'''
Business: Get all generated images for admin dashboard
Args: event with httpMethod GET, optional query parameters for filtering
Returns: HTTP response with list of all images and user data
'''

import json
import os
from typing import Dict, Any
import psycopg2

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'GET':
        admin_key = event.get('headers', {}).get('x-admin-key', '')
        if admin_key != 'photoset-admin-2025':
            return {
                'statusCode': 403,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Forbidden: Admin access only'})
            }
    elif method == 'POST':
        pass
    else:
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database not configured'})
        }
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor()
    
    if method == 'GET':
        query_params = event.get('queryStringParameters', {}) or {}
        user_id = query_params.get('user_id')
        
        if user_id:
            limit = int(query_params.get('limit', 100))
            offset = int(query_params.get('offset', 0))
            
            cursor.execute('''
                SELECT 
                    id, user_id, prompt, image_url, theme, model, is_favorite, created_at
                FROM generated_images
                WHERE user_id = %s AND is_archived = FALSE
                ORDER BY created_at DESC
                LIMIT %s OFFSET %s
            ''', (user_id, limit, offset))
            
            images = []
            for row in cursor.fetchall():
                images.append({
                    'id': row[0],
                    'user_id': row[1],
                    'prompt': row[2],
                    'image_url': row[3],
                    'theme': row[4],
                    'model': row[5],
                    'is_favorite': row[6],
                    'created_at': str(row[7])
                })
            
            cursor.execute('SELECT COUNT(*) FROM generated_images WHERE user_id = %s AND is_archived = FALSE', (user_id,))
            total_count = cursor.fetchone()[0]
            
            cursor.close()
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
                    'images': images,
                    'total': total_count,
                    'limit': limit,
                    'offset': offset
                })
            }
        else:
            limit = int(query_params.get('limit', 50))
            offset = int(query_params.get('offset', 0))
            
            cursor.execute('''
                SELECT 
                    gi.id, gi.prompt, gi.image_url, gi.theme, gi.model, 
                    gi.created_at, gi.is_archived,
                    u.id as user_id, u.username, u.email
                FROM generated_images gi
                LEFT JOIN users u ON gi.user_id = u.id
                WHERE gi.is_archived = FALSE
                ORDER BY gi.created_at DESC
                LIMIT %s OFFSET %s
            ''', (limit, offset))
            
            images = []
            for row in cursor.fetchall():
                images.append({
                    'id': row[0],
                    'prompt': row[1],
                    'image_url': row[2],
                    'theme': row[3],
                    'model': row[4],
                    'created_at': str(row[5]),
                    'is_archived': row[6],
                    'user': {
                        'id': row[7],
                        'username': row[8],
                        'email': row[9]
                    }
                })
            
            cursor.execute('SELECT COUNT(*) FROM generated_images WHERE is_archived = FALSE')
            total_count = cursor.fetchone()[0]
            
            cursor.close()
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
                    'images': images,
                    'total': total_count,
                    'limit': limit,
                    'offset': offset
                })
            }
    elif method == 'POST':
        body_str = event.get('body', '{}')
        body = json.loads(body_str)
        
        user_id = body.get('user_id')
        prompt = body.get('prompt', '')
        image_url = body.get('image_url', '')
        theme = body.get('theme')
        model = body.get('model', 'dall-e-3')
        
        if not user_id or not image_url:
            cursor.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'user_id and image_url required'})
            }
        
        cursor.execute('''
            INSERT INTO generated_images (user_id, prompt, image_url, theme, model, is_favorite, is_archived)
            VALUES (%s, %s, %s, %s, %s, FALSE, FALSE)
            RETURNING id, user_id, prompt, image_url, theme, model, is_favorite, created_at
        ''', (user_id, prompt, image_url, theme, model))
        
        row = cursor.fetchone()
        conn.commit()
        
        saved_image = {
            'id': row[0],
            'user_id': row[1],
            'prompt': row[2],
            'image_url': row[3],
            'theme': row[4],
            'model': row[5],
            'is_favorite': row[6],
            'created_at': str(row[7])
        }
        
        cursor.close()
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
                'image': saved_image
            })
        }