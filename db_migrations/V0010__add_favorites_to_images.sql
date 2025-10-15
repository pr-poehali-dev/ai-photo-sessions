-- Add is_favorite column to generated_images table
ALTER TABLE generated_images 
ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT FALSE;

-- Create index for faster filtering by favorites
CREATE INDEX IF NOT EXISTS idx_generated_images_user_favorite 
ON generated_images(user_id, is_favorite, created_at DESC);
