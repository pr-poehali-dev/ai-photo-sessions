import json
import os
import random
import string
from typing import Dict, Any
import psycopg

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Админ-панель для управления промокодами и контентом
    Args: event - dict with httpMethod, queryStringParameters, body, headers
          context - object with request_id, function_name
    Returns: HTTP response dict
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Session-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = event.get('headers', {})
    session_token = headers.get('X-Session-Token') or headers.get('x-session-token')
    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')
    
    if not session_token:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'AUTH_REQUIRED'})
        }
    
    dsn = os.environ.get('DATABASE_URL')
    
    with psycopg.connect(dsn) as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT u.id, u.email, u.username, u.is_admin FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.session_token = %s AND s.expires_at > NOW()",
                (session_token,)
            )
            user_row = cur.fetchone()
            
            if not user_row:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'INVALID_SESSION'})
                }
            
            user_id, email, username, is_admin = user_row
            
            if action != 'activate-promo' and not is_admin:
                return {
                    'statusCode': 403,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'ADMIN_ONLY'})
                }
            
            if method == 'POST' and action == 'create-promo':
                body = json.loads(event.get('body', '{}'))
                generations = body.get('generations', 15)
                max_uses = body.get('max_uses')
                
                code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
                
                cur.execute(
                    "INSERT INTO promo_codes (code, generations_count, max_uses, created_by) VALUES (%s, %s, %s, %s) RETURNING id, code",
                    (code, generations, max_uses, user_id)
                )
                promo_id, promo_code = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'promo_code': promo_code,
                        'id': promo_id,
                        'generations': generations
                    })
                }
            
            elif method == 'GET' and action == 'list-promos':
                cur.execute(
                    "SELECT id, code, generations_count, used_count, max_uses, is_active, created_at FROM promo_codes ORDER BY created_at DESC LIMIT 50"
                )
                rows = cur.fetchall()
                
                promos = []
                for row in rows:
                    promos.append({
                        'id': row[0],
                        'code': row[1],
                        'generations': row[2],
                        'used_count': row[3],
                        'max_uses': row[4],
                        'is_active': row[5],
                        'created_at': row[6].isoformat() if row[6] else None
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'promos': promos})
                }
            
            elif method == 'POST' and action == 'toggle-promo':
                body = json.loads(event.get('body', '{}'))
                promo_id = body.get('promo_id')
                
                cur.execute(
                    "UPDATE promo_codes SET is_active = NOT is_active WHERE id = %s RETURNING is_active",
                    (promo_id,)
                )
                result = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'is_active': result[0] if result else False})
                }
            
            elif method == 'POST' and action == 'add-gallery':
                body = json.loads(event.get('body', '{}'))
                image_url = body.get('image_url')
                title = body.get('title', '')
                description = body.get('description', '')
                theme = body.get('theme', '')
                category = body.get('category', 'gallery')
                
                cur.execute(
                    "INSERT INTO gallery_items (image_url, title, description, theme, category, created_by) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
                    (image_url, title, description, theme, category, user_id)
                )
                item_id = cur.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'id': item_id})
                }
            
            elif method == 'GET' and action == 'list-gallery':
                category = params.get('category', 'gallery')
                
                cur.execute(
                    "SELECT id, image_url, title, description, theme, is_visible, display_order FROM gallery_items WHERE category = %s ORDER BY display_order DESC, created_at DESC",
                    (category,)
                )
                rows = cur.fetchall()
                
                items = []
                for row in rows:
                    items.append({
                        'id': row[0],
                        'image_url': row[1],
                        'title': row[2],
                        'description': row[3],
                        'theme': row[4],
                        'is_visible': row[5],
                        'display_order': row[6]
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'items': items})
                }
            
            elif method == 'PUT' and action == 'update-gallery':
                body = json.loads(event.get('body', '{}'))
                item_id = body.get('id')
                
                updates = []
                values = []
                
                if 'title' in body:
                    updates.append('title = %s')
                    values.append(body['title'])
                if 'description' in body:
                    updates.append('description = %s')
                    values.append(body['description'])
                if 'image_url' in body:
                    updates.append('image_url = %s')
                    values.append(body['image_url'])
                if 'is_visible' in body:
                    updates.append('is_visible = %s')
                    values.append(body['is_visible'])
                
                updates.append('updated_at = NOW()')
                values.append(item_id)
                
                query = f"UPDATE gallery_items SET {', '.join(updates)} WHERE id = %s"
                cur.execute(query, tuple(values))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True})
                }
            
            elif method == 'POST' and action == 'add-photoshoot':
                body = json.loads(event.get('body', '{}'))
                image_url = body.get('image_url')
                title = body.get('title')
                description = body.get('description', '')
                theme_id = body.get('theme_id', '')
                icon = body.get('icon', 'Image')
                
                cur.execute(
                    "INSERT INTO photoshoot_examples (image_url, title, description, theme_id, icon, created_by) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id",
                    (image_url, title, description, theme_id, icon, user_id)
                )
                item_id = cur.fetchone()[0]
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'id': item_id})
                }
            
            elif method == 'GET' and action == 'list-photoshoots':
                cur.execute(
                    "SELECT id, image_url, title, description, theme_id, icon, is_visible, display_order FROM photoshoot_examples ORDER BY display_order DESC, created_at DESC"
                )
                rows = cur.fetchall()
                
                items = []
                for row in rows:
                    items.append({
                        'id': row[0],
                        'image_url': row[1],
                        'title': row[2],
                        'description': row[3],
                        'theme_id': row[4],
                        'icon': row[5],
                        'is_visible': row[6],
                        'display_order': row[7]
                    })
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'items': items})
                }
            
            elif method == 'POST' and action == 'activate-promo':
                body = json.loads(event.get('body', '{}'))
                promo_code = body.get('code', '').strip().upper()
                
                if not promo_code:
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'PROMO_CODE_REQUIRED'})
                    }
                
                cur.execute(
                    "SELECT id, generations_count, used_count, max_uses, is_active FROM promo_codes WHERE code = %s",
                    (promo_code,)
                )
                promo_row = cur.fetchone()
                
                if not promo_row:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'PROMO_NOT_FOUND', 'message': 'Промокод не найден'})
                    }
                
                promo_id, generations, used_count, max_uses, is_active = promo_row
                
                if not is_active:
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'PROMO_INACTIVE', 'message': 'Промокод деактивирован'})
                    }
                
                if max_uses and used_count >= max_uses:
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'PROMO_EXHAUSTED', 'message': 'Промокод исчерпан'})
                    }
                
                cur.execute(
                    "SELECT 1 FROM promo_code_usage WHERE promo_code_id = %s AND user_id = %s",
                    (promo_id, user_id)
                )
                already_used = cur.fetchone()
                
                if already_used:
                    return {
                        'statusCode': 403,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'PROMO_ALREADY_USED', 'message': 'Вы уже использовали этот промокод'})
                    }
                
                cur.execute(
                    "INSERT INTO promo_code_usage (promo_code_id, user_id) VALUES (%s, %s)",
                    (promo_id, user_id)
                )
                
                cur.execute(
                    "UPDATE promo_codes SET used_count = used_count + 1 WHERE id = %s",
                    (promo_id,)
                )
                
                cur.execute(
                    "UPDATE users SET credits = credits + %s WHERE id = %s",
                    (generations, user_id)
                )
                
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'message': f'Промокод активирован! Вы получили {generations} бесплатных генераций',
                        'generations_added': generations
                    })
                }
            
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'UNKNOWN_ACTION'})
            }