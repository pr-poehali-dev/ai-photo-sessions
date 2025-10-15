import { useState, useEffect } from 'react';

interface UserImage {
  id: number;
  user_id: number;
  prompt: string;
  image_url: string;
  theme?: string;
  model: string;
  is_favorite: boolean;
  created_at: string;
}

export const useUserImages = (userId: number | null) => {
  const [images, setImages] = useState<UserImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadImages = async () => {
    if (!userId) {
      setImages([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://functions.poehali.dev/d94b5564-3eda-4bec-a6fb-a93cd0de2407?user_id=${userId}&limit=100&offset=0`
      );

      if (!response.ok) {
        throw new Error('Failed to load images');
      }

      const data = await response.json();

      if (data.success) {
        setImages(data.images || []);
      } else {
        setError(data.error || 'Failed to load images');
      }
    } catch (err) {
      console.error('Error loading images:', err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, [userId]);

  const toggleFavorite = async (imageId: number) => {
    const image = images.find(img => img.id === imageId);
    if (!image) return;

    setImages(prev =>
      prev.map(img =>
        img.id === imageId ? { ...img, is_favorite: !img.is_favorite } : img
      )
    );
  };

  const addImage = (image: UserImage) => {
    setImages(prev => [image, ...prev]);
  };

  return {
    images,
    loading,
    error,
    loadImages,
    toggleFavorite,
    addImage
  };
};