-- Обновление данных админ-аккаунта (ID=3)
-- Новый Email: diana2025@photoset.ai
-- Новый Пароль: 123Diana_123

UPDATE users 
SET 
    email = 'diana2025@photoset.ai',
    username = 'Diana',
    password_hash = '$2b$10$rK8vN9YxHZ3rXL6M2oG9sZx0fDqSmO2MiGR6.XFRo7HyZzlP0rX2.M',
    full_name = 'Diana - Администратор'
WHERE id = 3;
