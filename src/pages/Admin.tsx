import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface GeneratedImage {
  id: number;
  prompt: string;
  image_url: string;
  theme: string;
  model: string;
  created_at: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  const handleLogin = () => {
    if (adminKey === 'photoset-admin-2025') {
      setIsAuthenticated(true);
      loadImages();
    } else {
      alert('Неверный ключ доступа');
    }
  };

  const loadImages = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/d94b5564-3eda-4bec-a6fb-a93cd0de2407', {
        method: 'GET',
        headers: {
          'x-admin-key': adminKey || 'photoset-admin-2025'
        }
      });

      const data = await response.json();
      if (data.success) {
        setImages(data.images);
        setTotal(data.total);
      }
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-primary/20 flex items-center justify-center p-6">
        <Card className="glass-effect p-10 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4">
              <Icon name="Lock" size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2">Админ-панель</h1>
            <p className="text-gray-400">Доступ только для владельца</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">Ключ доступа</label>
              <input
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Введите ключ..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <Button
              onClick={handleLogin}
              className="w-full gradient-bg hover:opacity-90 text-white py-3 font-semibold"
            >
              Войти
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-primary/20 p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black gradient-text mb-2">Админ-панель</h1>
            <p className="text-gray-400">Всего изображений: {total}</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={loadImages}
              disabled={loading}
              className="bg-white/10 hover:bg-white/20 text-white"
            >
              <Icon name="RefreshCw" size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
              Обновить
            </Button>
            <Button
              onClick={() => setIsAuthenticated(false)}
              className="bg-white/10 hover:bg-white/20 text-white"
            >
              <Icon name="LogOut" size={18} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>

        {loading && images.length === 0 ? (
          <div className="text-center py-20">
            <Icon name="Loader2" size={48} className="text-primary animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Загрузка...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <Card
                key={image.id}
                className="glass-effect overflow-hidden hover:border-primary/30 transition-all cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <div className="relative">
                  <img src={image.image_url} alt={image.prompt} className="w-full h-64 object-cover" />
                  <div className="absolute top-3 right-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold gradient-bg text-white">
                      {image.model}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-white font-semibold mb-2 line-clamp-2">{image.prompt}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <Icon name="User" size={14} />
                    <span>{image.user?.username || 'Anonymous'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Icon name="Calendar" size={14} />
                    <span>{new Date(image.created_at).toLocaleDateString('ru-RU')}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedImage(null)}
          >
            <Card
              className="glass-effect max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">Детали изображения</h2>
                  <Button
                    onClick={() => setSelectedImage(null)}
                    className="bg-white/10 hover:bg-white/20 text-white"
                  >
                    <Icon name="X" size={20} />
                  </Button>
                </div>

                <img
                  src={selectedImage.image_url}
                  alt={selectedImage.prompt}
                  className="w-full rounded-xl mb-6"
                />

                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-semibold mb-2">Промт:</h3>
                    <p className="text-gray-300 bg-black/30 p-4 rounded-lg">{selectedImage.prompt}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-white font-semibold mb-2">Модель:</h3>
                      <p className="text-gray-300">{selectedImage.model}</p>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Тема:</h3>
                      <p className="text-gray-300">{selectedImage.theme || 'Не указана'}</p>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Пользователь:</h3>
                      <p className="text-gray-300">{selectedImage.user?.email || 'N/A'}</p>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Дата создания:</h3>
                      <p className="text-gray-300">
                        {new Date(selectedImage.created_at).toLocaleString('ru-RU')}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => window.open(selectedImage.image_url, '_blank')}
                    className="w-full gradient-bg hover:opacity-90 text-white"
                  >
                    <Icon name="Download" size={18} className="mr-2" />
                    Скачать изображение
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
