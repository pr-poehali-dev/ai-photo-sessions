-- Создаём нового админа Diana с простым паролем
-- Email: diana@photoset.ai
-- Пароль: Diana123

-- Сначала удаляем is_admin у старых админов
UPDATE users SET is_admin = FALSE WHERE email IN ('admin@photoset.com', 'admin@photoset.ai', 'diana2025@photoset.ai');

-- Создаём нового админа Diana
INSERT INTO users (
    email, 
    username, 
    password_hash, 
    full_name,
    is_admin,
    credits,
    plan,
    free_generations_limit,
    free_generations_used,
    subscription_status,
    created_at
) VALUES (
    'diana@photoset.ai',
    'Diana',
    '$2b$12$LQv3c1yduXkehn0jQBB3hOKe7mQJSqqyqCOC9BcT7l0fXJzQvJK6O',
    'Diana - Администратор',
    TRUE,
    999999,
    'unlimited',
    999999,
    0,
    'active',
    NOW()
) ON CONFLICT (email) DO UPDATE SET
    is_admin = TRUE,
    credits = 999999,
    plan = 'unlimited',
    subscription_status = 'active',
    password_hash = '$2b$12$LQv3c1yduXkehn0jQBB3hOKe7mQJSqqyqCOC9BcT7l0fXJzQvJK6O';
