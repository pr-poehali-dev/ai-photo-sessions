-- Обновление пароля админа (bcrypt хеш для "admin123")
UPDATE users 
SET password_hash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLhFx6ES'
WHERE email = 'admin@photoset.com';
