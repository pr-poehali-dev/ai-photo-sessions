
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    username VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS generated_images (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    prompt TEXT,
    image_url TEXT,
    theme VARCHAR(50),
    model VARCHAR(50) DEFAULT 'dall-e-3',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_archived BOOLEAN DEFAULT FALSE
);

ALTER TABLE generated_images ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id);

CREATE INDEX idx_generated_images_user_id ON generated_images(user_id);
CREATE INDEX idx_generated_images_created_at ON generated_images(created_at DESC);
CREATE INDEX idx_users_email ON users(email);

INSERT INTO users (email, username, is_admin) VALUES ('admin@photoset.com', 'Admin', TRUE);
