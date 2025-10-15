"""
Business: Generate AI images with usage limits - 3 free generations, then requires subscription
Args: event with POST body {prompt, size, model} and header X-Session-Token
Returns: HTTP response with generated image URL or limit exceeded error
"""

import json
import os
from typing import Dict, Any
import requests
import psycopg2

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    headers = event.get('headers', {})
    session_token = headers.get('X-Session-Token') or headers.get('x-session-token')
    
    if not session_token:
        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Session token required', 'code': 'AUTH_REQUIRED'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database not configured'})
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    cur.execute(
        """
        SELECT u.id, u.free_generations_used, u.free_generations_limit, 
               u.subscription_status, u.credits, u.plan
        FROM user_sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.session_token = %s AND s.expires_at > CURRENT_TIMESTAMP
        """,
        (session_token,)
    )
    user_data = cur.fetchone()
    
    if not user_data:
        cur.close()
        conn.close()
        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid or expired session', 'code': 'AUTH_REQUIRED'})
        }
    
    user_id, free_used, free_limit, sub_status, credits, plan = user_data
    
    if sub_status == 'none' or sub_status is None:
        if free_used >= free_limit:
            cur.close()
            conn.close()
            return {
                'statusCode': 403,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'Free generations limit exceeded',
                    'code': 'LIMIT_EXCEEDED',
                    'free_used': free_used,
                    'free_limit': free_limit,
                    'message': 'You have used all 3 free generations. Please subscribe to continue.'
                })
            }
    elif sub_status == 'active':
        if credits <= 0:
            cur.close()
            conn.close()
            return {
                'statusCode': 403,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'No credits remaining',
                    'code': 'NO_CREDITS',
                    'credits': credits,
                    'message': 'You have no credits left. Please upgrade your plan.'
                })
            }
    
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        cur.close()
        conn.close()
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'OpenAI API key not configured'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    prompt = body_data.get('prompt', '')
    size = body_data.get('size', '1024x1024')
    model = body_data.get('model', 'dall-e-3')
    
    if not prompt:
        cur.close()
        conn.close()
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Prompt is required'})
        }
    
    openai_headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        'model': model,
        'prompt': prompt,
        'n': 1,
        'size': size,
        'quality': 'standard'
    }
    
    response = requests.post(
        'https://api.openai.com/v1/images/generations',
        headers=openai_headers,
        json=payload,
        timeout=60
    )
    
    if response.status_code != 200:
        error_data = response.json()
        cur.close()
        conn.close()
        return {
            'statusCode': response.status_code,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': error_data.get('error', {}).get('message', 'Failed to generate image')
            })
        }
    
    result = response.json()
    image_url = result.get('data', [{}])[0].get('url', '')
    
    if sub_status == 'none' or sub_status is None:
        cur.execute(
            "UPDATE users SET free_generations_used = free_generations_used + 1 WHERE id = %s",
            (user_id,)
        )
        new_used = free_used + 1
    else:
        cur.execute(
            "UPDATE users SET credits = credits - 1 WHERE id = %s",
            (user_id,)
        )
        new_used = free_used
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'image_url': image_url,
            'prompt': prompt,
            'model': model,
            'remaining_free': max(0, free_limit - new_used) if sub_status == 'none' or sub_status is None else None,
            'remaining_credits': credits - 1 if sub_status == 'active' else None,
            'subscription_status': sub_status
        })
    }
