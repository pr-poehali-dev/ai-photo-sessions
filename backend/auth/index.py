"""
Business: Complete authentication system - register, login, verify, reset password
Args: event with POST/GET and path parameter for action
Returns: HTTP response with auth data or error
"""

import json
import os
import re
import secrets
from datetime import datetime, timedelta
from typing import Dict, Any
import psycopg2
import bcrypt

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    path_params = event.get('pathParams', {})
    action = path_params.get('action', event.get('queryStringParameters', {}).get('action', 'register'))
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database not configured'})
        }
    
    if action == 'register':
        return handle_register(event, dsn)
    elif action == 'login':
        return handle_login(event, dsn)
    elif action == 'verify':
        return handle_verify(event, dsn)
    elif action == 'reset-request':
        return handle_reset_request(event, dsn)
    elif action == 'reset-complete':
        return handle_reset_complete(event, dsn)
    elif action == 'admin_stats':
        return handle_admin_stats(event, dsn)
    elif action == 'admin_users':
        return handle_admin_users(event, dsn)
    elif action == 'admin_images':
        return handle_admin_images(event, dsn)
    else:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid action'})
        }

def handle_register(event: Dict[str, Any], dsn: str) -> Dict[str, Any]:
    body_data = json.loads(event.get('body', '{}'))
    email = body_data.get('email', '').strip().lower()
    password = body_data.get('password', '')
    username = body_data.get('username', '').strip()
    full_name = body_data.get('full_name', '').strip()
    
    if not email or not password or not username:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Email, password and username are required'})
        }
    
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, email):
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid email format'})
        }
    
    if len(password) < 8:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Password must be at least 8 characters'})
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    cur.execute("SELECT id FROM users WHERE email = %s", (email,))
    if cur.fetchone():
        cur.close()
        conn.close()
        return {
            'statusCode': 409,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Email already registered'})
        }
    
    password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    cur.execute(
        """
        INSERT INTO users (email, username, password_hash, full_name, credits, plan) 
        VALUES (%s, %s, %s, %s, 50, 'free') 
        RETURNING id, email, username, full_name, credits, plan, created_at
        """,
        (email, username, password_hash, full_name if full_name else None)
    )
    user = cur.fetchone()
    conn.commit()
    
    cur.execute(
        "INSERT INTO security_logs (user_id, action, success) VALUES (%s, 'register', true)",
        (user[0],)
    )
    conn.commit()
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 201,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'user': {
                'id': user[0],
                'email': user[1],
                'username': user[2],
                'full_name': user[3],
                'credits': user[4],
                'plan': user[5],
                'created_at': user[6].isoformat() if user[6] else None
            }
        })
    }

def handle_login(event: Dict[str, Any], dsn: str) -> Dict[str, Any]:
    body_data = json.loads(event.get('body', '{}'))
    email = body_data.get('email', '').strip().lower()
    password = body_data.get('password', '')
    
    if not email or not password:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Email and password are required'})
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    cur.execute(
        "SELECT id, email, username, full_name, password_hash, credits, plan, avatar_url, is_admin FROM users WHERE email = %s",
        (email,)
    )
    user = cur.fetchone()
    
    if not user:
        cur.execute(
            "INSERT INTO security_logs (action, success, details) VALUES ('login', false, %s)",
            (json.dumps({'email': email, 'reason': 'user_not_found'}),)
        )
        conn.commit()
        cur.close()
        conn.close()
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid email or password'})
        }
    
    password_hash = user[4]
    if not bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8')):
        cur.execute(
            "INSERT INTO security_logs (user_id, action, success, details) VALUES (%s, 'login', false, %s)",
            (user[0], json.dumps({'reason': 'wrong_password'}))
        )
        conn.commit()
        cur.close()
        conn.close()
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid email or password'})
        }
    
    session_token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(days=30)
    
    request_context = event.get('requestContext', {})
    identity = request_context.get('identity', {})
    ip_address = identity.get('sourceIp', 'unknown')
    user_agent = event.get('headers', {}).get('User-Agent', 'unknown')
    
    cur.execute(
        """
        INSERT INTO user_sessions (user_id, session_token, expires_at, ip_address, user_agent) 
        VALUES (%s, %s, %s, %s, %s)
        """,
        (user[0], session_token, expires_at, ip_address, user_agent)
    )
    conn.commit()
    
    cur.execute(
        "UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = %s",
        (user[0],)
    )
    conn.commit()
    
    cur.execute(
        "INSERT INTO security_logs (user_id, action, success, ip_address, user_agent) VALUES (%s, 'login', true, %s, %s)",
        (user[0], ip_address, user_agent)
    )
    conn.commit()
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'session_token': session_token,
            'expires_at': expires_at.isoformat(),
            'user': {
                'id': user[0],
                'email': user[1],
                'username': user[2],
                'full_name': user[3],
                'credits': user[5],
                'plan': user[6],
                'avatar_url': user[7],
                'is_admin': user[8]
            }
        })
    }

def handle_verify(event: Dict[str, Any], dsn: str) -> Dict[str, Any]:
    headers = event.get('headers', {})
    session_token = headers.get('X-Session-Token') or headers.get('x-session-token')
    
    if not session_token:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Session token required'})
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    cur.execute(
        """
        SELECT s.user_id, s.expires_at, u.email, u.username, u.full_name, u.credits, u.plan, u.avatar_url, u.is_admin
        FROM user_sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.session_token = %s
        """,
        (session_token,)
    )
    session = cur.fetchone()
    
    if not session:
        cur.close()
        conn.close()
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid session token'})
        }
    
    expires_at = session[1]
    if datetime.utcnow() > expires_at:
        cur.close()
        conn.close()
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Session expired'})
        }
    
    cur.execute(
        "UPDATE user_sessions SET last_activity = CURRENT_TIMESTAMP WHERE session_token = %s",
        (session_token,)
    )
    conn.commit()
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'user': {
                'id': session[0],
                'email': session[2],
                'username': session[3],
                'full_name': session[4],
                'credits': session[5],
                'plan': session[6],
                'avatar_url': session[7],
                'is_admin': session[8]
            }
        })
    }

def handle_reset_request(event: Dict[str, Any], dsn: str) -> Dict[str, Any]:
    body_data = json.loads(event.get('body', '{}'))
    email = body_data.get('email', '').strip().lower()
    
    if not email:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Email is required'})
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    cur.execute("SELECT id FROM users WHERE email = %s", (email,))
    user = cur.fetchone()
    
    if not user:
        cur.close()
        conn.close()
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'message': 'If email exists, reset link will be sent'
            })
        }
    
    reset_token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(hours=1)
    
    cur.execute(
        "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (%s, %s, %s)",
        (user[0], reset_token, expires_at)
    )
    conn.commit()
    
    cur.execute(
        "INSERT INTO security_logs (user_id, action, success) VALUES (%s, 'password_reset_request', true)",
        (user[0],)
    )
    conn.commit()
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'message': 'Password reset token generated',
            'token': reset_token,
            'expires_at': expires_at.isoformat()
        })
    }

def handle_reset_complete(event: Dict[str, Any], dsn: str) -> Dict[str, Any]:
    body_data = json.loads(event.get('body', '{}'))
    token = body_data.get('token', '')
    new_password = body_data.get('new_password', '')
    
    if not token or not new_password:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Token and new password are required'})
        }
    
    if len(new_password) < 8:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Password must be at least 8 characters'})
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    cur.execute(
        """
        SELECT user_id, expires_at, used 
        FROM password_reset_tokens 
        WHERE token = %s
        """,
        (token,)
    )
    token_data = cur.fetchone()
    
    if not token_data:
        cur.close()
        conn.close()
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid or expired token'})
        }
    
    user_id, expires_at, used = token_data
    
    if used or datetime.utcnow() > expires_at:
        cur.close()
        conn.close()
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Token has expired or already used'})
        }
    
    password_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    cur.execute(
        "UPDATE users SET password_hash = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s",
        (password_hash, user_id)
    )
    conn.commit()
    
    cur.execute(
        "UPDATE password_reset_tokens SET used = true WHERE token = %s",
        (token,)
    )
    conn.commit()
    
    cur.execute(
        "INSERT INTO security_logs (user_id, action, success) VALUES (%s, 'password_reset_complete', true)",
        (user_id,)
    )
    conn.commit()
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'message': 'Password has been reset successfully'
        })
    }

def verify_admin(session_token: str, dsn: str) -> tuple[bool, int | None]:
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    cur.execute(
        """
        SELECT s.user_id, u.is_admin, s.expires_at
        FROM user_sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.session_token = %s
        """,
        (session_token,)
    )
    session = cur.fetchone()
    
    cur.close()
    conn.close()
    
    if not session:
        return False, None
    
    user_id, is_admin, expires_at = session
    
    if datetime.utcnow() > expires_at:
        return False, None
    
    if not is_admin:
        return False, user_id
    
    return True, user_id

def handle_admin_stats(event: Dict[str, Any], dsn: str) -> Dict[str, Any]:
    headers = event.get('headers', {})
    session_token = headers.get('X-Session-Token') or headers.get('x-session-token')
    
    if not session_token:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Session token required'})
        }
    
    is_admin, user_id = verify_admin(session_token, dsn)
    if not is_admin:
        return {
            'statusCode': 403,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Admin access required'})
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    cur.execute("SELECT COUNT(*) FROM users")
    total_users = cur.fetchone()[0]
    
    cur.execute("SELECT COUNT(*) FROM generated_images")
    total_images = cur.fetchone()[0]
    
    cur.execute("SELECT COALESCE(SUM(credits), 0) FROM users WHERE plan != 'unlimited'")
    total_credits_used = cur.fetchone()[0]
    
    cur.execute("SELECT COUNT(DISTINCT user_id) FROM user_sessions WHERE last_activity > NOW() - INTERVAL '7 days'")
    active_users = cur.fetchone()[0]
    
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'stats': {
                'total_users': total_users,
                'total_images': total_images,
                'total_credits_used': total_credits_used,
                'active_users': active_users
            }
        })
    }

def handle_admin_users(event: Dict[str, Any], dsn: str) -> Dict[str, Any]:
    headers = event.get('headers', {})
    session_token = headers.get('X-Session-Token') or headers.get('x-session-token')
    
    if not session_token:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Session token required'})
        }
    
    is_admin, user_id = verify_admin(session_token, dsn)
    if not is_admin:
        return {
            'statusCode': 403,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Admin access required'})
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    cur.execute(
        """
        SELECT id, username, email, credits, plan, is_admin, created_at
        FROM users
        ORDER BY created_at DESC
        LIMIT 100
        """
    )
    users = cur.fetchall()
    
    cur.close()
    conn.close()
    
    users_list = []
    for user in users:
        users_list.append({
            'id': user[0],
            'username': user[1],
            'email': user[2],
            'credits': user[3],
            'plan': user[4],
            'is_admin': user[5],
            'created_at': user[6].isoformat() if user[6] else None
        })
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'users': users_list
        })
    }

def handle_admin_images(event: Dict[str, Any], dsn: str) -> Dict[str, Any]:
    headers = event.get('headers', {})
    session_token = headers.get('X-Session-Token') or headers.get('x-session-token')
    
    if not session_token:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Session token required'})
        }
    
    is_admin, user_id = verify_admin(session_token, dsn)
    if not is_admin:
        return {
            'statusCode': 403,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Admin access required'})
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    cur.execute(
        """
        SELECT gi.id, gi.prompt, gi.image_url, gi.theme, gi.model, gi.created_at,
               u.id, u.username, u.email
        FROM generated_images gi
        JOIN users u ON gi.user_id = u.id
        ORDER BY gi.created_at DESC
        LIMIT 100
        """
    )
    images = cur.fetchall()
    
    cur.close()
    conn.close()
    
    images_list = []
    for img in images:
        images_list.append({
            'id': img[0],
            'prompt': img[1],
            'image_url': img[2],
            'theme': img[3],
            'model': img[4],
            'created_at': img[5].isoformat() if img[5] else None,
            'user': {
                'id': img[6],
                'username': img[7],
                'email': img[8]
            }
        })
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'images': images_list
        })
    }