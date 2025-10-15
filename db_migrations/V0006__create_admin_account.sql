-- Создание админ-аккаунта
-- Email: admin@photoset.ai
-- Пароль: PhotoSetAdmin2024!

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
    'admin@photoset.ai',
    'admin',
    '$2b$10$YvK8xGZ3qXJ4K0nF7rZw8eCpRjN0LGdEQ4.VEQm5FwYwYjN8qV0.K',
    'Администратор PhotoSet',
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
    subscription_status = 'active';

-- Добавляем индекс для быстрого поиска админов
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin) WHERE is_admin = TRUE;
