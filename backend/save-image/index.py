'''
Business: Save generated image to database
Args: event with httpMethod POST, body containing user_id, prompt, image_url, theme
Returns: HTTP response with saved image data
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
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
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
    
    body_data = json.loads(event.get('body', '{}'))
    user_id = body_data.get('user_id', 1)
    prompt = body_data.get('prompt', '')
    image_url = body_data.get('image_url', '')
    theme = body_data.get('theme', '')
    model = body_data.get('model', 'dall-e-3')
    
    if not prompt or not image_url:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Prompt and image_url are required'})
        }
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor()
    
    cursor.execute(
        '''INSERT INTO generated_images (user_id, prompt, image_url, theme, model) 
           VALUES (%s, %s, %s, %s, %s) RETURNING id, created_at''',
        (user_id, prompt, image_url, theme, model)
    )
    
    result = cursor.fetchone()
    image_id = result[0]
    created_at = result[1]
    
    conn.commit()
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
            'image_id': image_id,
            'created_at': str(created_at),
            'request_id': context.request_id
        })
    }
