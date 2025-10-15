import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  username: string;
  email: string;
  credits: number;
  plan: string;
  is_admin: boolean;
  created_at: string;
}

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

interface Stats {
  total_users: number;
  total_images: number;
  total_credits_used: number;
  active_users: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'images'>('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const sessionToken = localStorage.getItem('session_token');
    const userStr = localStorage.getItem('user');
    
    if (!sessionToken || !userStr) {
      toast({
        title: 'Требуется авторизация',
        description: 'Пожалуйста, войдите в систему',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    const user = JSON.parse(userStr);
    if (!user.is_admin) {
      toast({
        title: 'Доступ запрещён',
        description: 'Только для администраторов',
        variant: 'destructive',
      });
      navigate('/');
      return;
    }

    loadStats();
  };

  const loadStats = async () => {
    setLoading(true);
    try {
      const sessionToken = localStorage.getItem('session_token');
      const response = await fetch('https://functions.poehali.dev/d72c2702-d925-43c1-9343-c8c94ce97cf1?action=admin_stats', {
        headers: {
          'X-Session-Token': sessionToken || ''
        }
      });

      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const sessionToken = localStorage.getItem('session_token');
      const response = await fetch('https://functions.poehali.dev/d72c2702-d925-43c1-9343-c8c94ce97cf1?action=admin_users', {
        headers: {
          'X-Session-Token': sessionToken || ''
        }
      });

      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadImages = async () => {
    setLoading(true);
    try {
      const sessionToken = localStorage.getItem('session_token');
      const response = await fetch('https://functions.poehali.dev/d72c2702-d925-43c1-9343-c8c94ce97cf1?action=admin_images', {
        headers: {
          'X-Session-Token': sessionToken || ''
        }
      });

      const data = await response.json();
      if (data.success) {
        setImages(data.images);
      }
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('session_token');
    localStorage.removeItem('user');
    toast({
      title: 'Вы вышли из системы',
      description: 'До скорой встречи!',
    });
    navigate('/login');
  };

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'images') {
      loadImages();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-primary/20">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/30 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="https://cdn.poehali.dev/projects/2b4ea3db-a438-4e53-a09d-44a613d412ef/files/fe48bd8a-64d0-48f7-9f23-7b5d9060388a.jpg" 
                alt="PhotoSet" 
                className="h-10 w-10 object-contain"
              />
              <div>
                <h1 className="text-2xl font-black gradient-text">Админ-панель PhotoSet</h1>
                <p className="text-gray-400 text-sm">Управление платформой</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate('/')}
                className="bg-white/10 hover:bg-white/20 text-white"
              >
                <Icon name="Home" size={18} className="mr-2" />
                На сайт
              </Button>
              <Button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 text-white"
              >
                <Icon name="LogOut" size={18} className="mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <Button
            onClick={() => setActiveTab('overview')}
            className={activeTab === 'overview' ? 'gradient-bg text-white' : 'bg-white/10 text-white hover:bg-white/20'}
          >
            <Icon name="LayoutDashboard" size={18} className="mr-2" />
            Обзор
          </Button>
          <Button
            onClick={() => setActiveTab('users')}
            className={activeTab === 'users' ? 'gradient-bg text-white' : 'bg-white/10 text-white hover:bg-white/20'}
          >
            <Icon name="Users" size={18} className="mr-2" />
            Пользователи
          </Button>
          <Button
            onClick={() => setActiveTab('images')}
            className={activeTab === 'images' ? 'gradient-bg text-white' : 'bg-white/10 text-white hover:bg-white/20'}
          >
            <Icon name="Image" size={18} className="mr-2" />
            Изображения
          </Button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {loading && !stats ? (
              <div className="text-center py-20">
                <Icon name="Loader2" size={48} className="text-primary animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Загрузка статистики...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="glass-effect p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
                      <Icon name="Users" size={24} className="text-white" />
                    </div>
                    <span className="text-3xl font-black text-white">{stats?.total_users || 0}</span>
                  </div>
                  <h3 className="text-gray-400 text-sm font-medium">Всего пользователей</h3>
                </Card>

                <Card className="glass-effect p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
                      <Icon name="Image" size={24} className="text-white" />
                    </div>
                    <span className="text-3xl font-black text-white">{stats?.total_images || 0}</span>
                  </div>
                  <h3 className="text-gray-400 text-sm font-medium">Всего изображений</h3>
                </Card>

                <Card className="glass-effect p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
                      <Icon name="Zap" size={24} className="text-white" />
                    </div>
                    <span className="text-3xl font-black text-white">{stats?.total_credits_used || 0}</span>
                  </div>
                  <h3 className="text-gray-400 text-sm font-medium">Использовано кредитов</h3>
                </Card>

                <Card className="glass-effect p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
                      <Icon name="Activity" size={24} className="text-white" />
                    </div>
                    <span className="text-3xl font-black text-white">{stats?.active_users || 0}</span>
                  </div>
                  <h3 className="text-gray-400 text-sm font-medium">Активных пользователей</h3>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            {loading && users.length === 0 ? (
              <div className="text-center py-20">
                <Icon name="Loader2" size={48} className="text-primary animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Загрузка пользователей...</p>
              </div>
            ) : (
              <Card className="glass-effect overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-6 py-4 text-left text-white font-semibold">ID</th>
                        <th className="px-6 py-4 text-left text-white font-semibold">Имя</th>
                        <th className="px-6 py-4 text-left text-white font-semibold">Email</th>
                        <th className="px-6 py-4 text-left text-white font-semibold">Кредиты</th>
                        <th className="px-6 py-4 text-left text-white font-semibold">План</th>
                        <th className="px-6 py-4 text-left text-white font-semibold">Админ</th>
                        <th className="px-6 py-4 text-left text-white font-semibold">Дата регистрации</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 text-gray-300">{user.id}</td>
                          <td className="px-6 py-4 text-white font-medium">{user.username}</td>
                          <td className="px-6 py-4 text-gray-300">{user.email}</td>
                          <td className="px-6 py-4 text-gray-300">{user.credits}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.plan === 'unlimited' ? 'gradient-bg text-white' : 'bg-white/10 text-gray-300'
                            }`}>
                              {user.plan}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {user.is_admin ? (
                              <span className="text-green-400">✓ Да</span>
                            ) : (
                              <span className="text-gray-500">Нет</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-gray-300">
                            {new Date(user.created_at).toLocaleDateString('ru-RU')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Images Tab */}
        {activeTab === 'images' && (
          <div>
            {loading && images.length === 0 ? (
              <div className="text-center py-20">
                <Icon name="Loader2" size={48} className="text-primary animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Загрузка изображений...</p>
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
          </div>
        )}

        {/* Image Detail Modal */}
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

export default AdminDashboard;
