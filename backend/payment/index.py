"""
Business: PayPal payment processing for subscriptions
Args: event with action=create-order, capture-order, or webhook
Returns: HTTP response with order details or payment confirmation
"""

import json
import os
from typing import Dict, Any
import requests
import psycopg2
from datetime import datetime, timedelta

PAYPAL_API_BASE = 'https://api-m.sandbox.paypal.com'

PLANS = {
    'starter': {'price': '5.00', 'credits': 50, 'name': 'Стартовый'},
    'standard': {'price': '10.00', 'credits': 100, 'name': 'Стандартный'},
    'premium': {'price': '15.00', 'credits': 200, 'name': 'Премиум'}
}

def get_paypal_access_token() -> str:
    client_id = os.environ.get('PAYPAL_CLIENT_ID')
    client_secret = os.environ.get('PAYPAL_CLIENT_SECRET')
    
    if not client_id or not client_secret:
        raise Exception('PayPal credentials not configured')
    
    response = requests.post(
        f'{PAYPAL_API_BASE}/v1/oauth2/token',
        headers={'Accept': 'application/json'},
        auth=(client_id, client_secret),
        data={'grant_type': 'client_credentials'}
    )
    
    if response.status_code != 200:
        raise Exception('Failed to get PayPal access token')
    
    return response.json()['access_token']

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
    action = path_params.get('action', event.get('queryStringParameters', {}).get('action', 'create-order'))
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database not configured'})
        }
    
    if action == 'create-order':
        return create_order(event, dsn)
    elif action == 'capture-order':
        return capture_order(event, dsn)
    elif action == 'webhook':
        return handle_webhook(event, dsn)
    else:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid action'})
        }

def create_order(event: Dict[str, Any], dsn: str) -> Dict[str, Any]:
    headers = event.get('headers', {})
    session_token = headers.get('X-Session-Token') or headers.get('x-session-token')
    
    if not session_token:
        return {
            'statusCode': 401,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Session token required'})
        }
    
    body_data = json.loads(event.get('body', '{}'))
    plan_id = body_data.get('plan', 'starter')
    
    if plan_id not in PLANS:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid plan'})
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    cur.execute(
        """
        SELECT u.id, u.email, u.username
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
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Invalid session'})
        }
    
    user_id, user_email, username = user_data
    plan = PLANS[plan_id]
    
    access_token = get_paypal_access_token()
    
    paypal_headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {access_token}'
    }
    
    order_payload = {
        'intent': 'CAPTURE',
        'purchase_units': [{
            'amount': {
                'currency_code': 'USD',
                'value': plan['price']
            },
            'description': f"PhotoSet {plan['name']} Plan - {plan['credits']} credits"
        }],
        'application_context': {
            'brand_name': 'PhotoSet',
            'landing_page': 'NO_PREFERENCE',
            'user_action': 'PAY_NOW',
            'return_url': 'https://yoursite.com/payment/success',
            'cancel_url': 'https://yoursite.com/payment/cancel'
        }
    }
    
    response = requests.post(
        f'{PAYPAL_API_BASE}/v2/checkout/orders',
        headers=paypal_headers,
        json=order_payload
    )
    
    if response.status_code != 201:
        cur.close()
        conn.close()
        return {
            'statusCode': response.status_code,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Failed to create PayPal order'})
        }
    
    order_data = response.json()
    order_id = order_data['id']
    
    cur.execute(
        """
        INSERT INTO transactions (user_id, amount, currency, status, payment_method, paypal_order_id, plan, metadata)
        VALUES (%s, %s, 'USD', 'pending', 'paypal', %s, %s, %s)
        """,
        (user_id, plan['price'], order_id, plan_id, json.dumps({'credits': plan['credits']}))
    )
    conn.commit()
    cur.close()
    conn.close()
    
    approve_link = next((link['href'] for link in order_data.get('links', []) if link['rel'] == 'approve'), None)
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({
            'success': True,
            'order_id': order_id,
            'approve_link': approve_link,
            'plan': plan_id,
            'amount': plan['price']
        })
    }

def capture_order(event: Dict[str, Any], dsn: str) -> Dict[str, Any]:
    body_data = json.loads(event.get('body', '{}'))
    order_id = body_data.get('order_id')
    
    if not order_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Order ID required'})
        }
    
    access_token = get_paypal_access_token()
    
    paypal_headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {access_token}'
    }
    
    response = requests.post(
        f'{PAYPAL_API_BASE}/v2/checkout/orders/{order_id}/capture',
        headers=paypal_headers
    )
    
    if response.status_code != 201:
        return {
            'statusCode': response.status_code,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Failed to capture payment'})
        }
    
    capture_data = response.json()
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    cur.execute(
        "SELECT user_id, plan, metadata FROM transactions WHERE paypal_order_id = %s",
        (order_id,)
    )
    transaction = cur.fetchone()
    
    if not transaction:
        cur.close()
        conn.close()
        return {
            'statusCode': 404,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Transaction not found'})
        }
    
    user_id, plan_id, metadata = transaction
    credits = json.loads(metadata).get('credits', 0)
    
    cur.execute(
        """
        UPDATE transactions 
        SET status = 'completed', completed_at = CURRENT_TIMESTAMP 
        WHERE paypal_order_id = %s
        """,
        (order_id,)
    )
    
    expires_at = datetime.utcnow() + timedelta(days=30)
    
    cur.execute(
        """
        UPDATE users 
        SET credits = credits + %s,
            plan = %s,
            subscription_status = 'active',
            subscription_expires_at = %s
        WHERE id = %s
        """,
        (credits, plan_id, expires_at, user_id)
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
            'order_id': order_id,
            'status': 'completed',
            'credits_added': credits
        })
    }

def handle_webhook(event: Dict[str, Any], dsn: str) -> Dict[str, Any]:
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'received': True})
    }
