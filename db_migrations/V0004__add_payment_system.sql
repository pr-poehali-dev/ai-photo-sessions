-- Добавляем поля для трекинга использования и подписок
ALTER TABLE users ADD COLUMN IF NOT EXISTS free_generations_used INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS free_generations_limit INTEGER DEFAULT 3;
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'none';
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS paypal_subscription_id TEXT;

-- Создание таблицы для транзакций
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT NOT NULL,
    payment_method TEXT DEFAULT 'paypal',
    paypal_order_id TEXT,
    paypal_subscription_id TEXT,
    plan TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB
);

-- Обновляем существующих пользователей
UPDATE users 
SET 
    free_generations_used = 0,
    free_generations_limit = 3,
    subscription_status = 'none'
WHERE free_generations_used IS NULL;

-- Индексы
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_paypal_order_id ON transactions(paypal_order_id);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);
