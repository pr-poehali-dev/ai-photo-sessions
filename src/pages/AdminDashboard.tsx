import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminOverviewTab from '@/components/admin/AdminOverviewTab';
import AdminGeneratorTab from '@/components/admin/AdminGeneratorTab';
import AdminUsersTab from '@/components/admin/AdminUsersTab';
import AdminImagesTab from '@/components/admin/AdminImagesTab';
import ImageDetailModal from '@/components/admin/ImageDetailModal';
import { User, GeneratedImage, Stats, TabType } from '@/components/admin/types';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

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
    setCurrentUser(user);
    
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
      <AdminHeader 
        currentUser={currentUser}
        onNavigateHome={() => navigate('/')}
        onLogout={handleLogout}
      />

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8 flex-wrap">
          <Button
            onClick={() => setActiveTab('overview')}
            className={activeTab === 'overview' ? 'gradient-bg text-white' : 'bg-white/10 text-white hover:bg-white/20'}
          >
            <Icon name="LayoutDashboard" size={18} className="mr-2" />
            Обзор
          </Button>
          <Button
            onClick={() => setActiveTab('generator')}
            className={activeTab === 'generator' ? 'gradient-bg text-white' : 'bg-white/10 text-white hover:bg-white/20'}
          >
            <Icon name="Sparkles" size={18} className="mr-2" />
            Генератор
          </Button>
          <Button
            onClick={() => setActiveTab('users')}
            className={activeTab === 'users' ? 'gradient-bg text-white' : 'bg-white/10 text-white hover:bg-white/20'}
          >
            <Icon name="Users" size={18} className="mr-2" />
            Пользователи ({users.length || 0})
          </Button>
          <Button
            onClick={() => setActiveTab('images')}
            className={activeTab === 'images' ? 'gradient-bg text-white' : 'bg-white/10 text-white hover:bg-white/20'}
          >
            <Icon name="Image" size={18} className="mr-2" />
            Изображения ({images.length || 0})
          </Button>
        </div>

        {activeTab === 'overview' && (
          <AdminOverviewTab
            loading={loading}
            stats={stats}
            currentUser={currentUser}
            onTabChange={setActiveTab}
          />
        )}

        {activeTab === 'generator' && (
          <AdminGeneratorTab currentUser={currentUser} />
        )}

        {activeTab === 'users' && (
          <AdminUsersTab
            loading={loading}
            users={users}
            onRefresh={loadUsers}
          />
        )}

        {activeTab === 'images' && (
          <AdminImagesTab
            loading={loading}
            images={images}
            onRefresh={loadImages}
            onImageClick={setSelectedImage}
          />
        )}

        <ImageDetailModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
