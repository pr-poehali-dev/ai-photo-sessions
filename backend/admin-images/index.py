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
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
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
    
    query_params = event.get('queryStringParameters', {}) or {}
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
