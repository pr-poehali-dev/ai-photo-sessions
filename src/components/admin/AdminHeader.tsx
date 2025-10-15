import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface AdminHeaderProps {
  currentUser: any;
  onNavigateHome: () => void;
  onLogout: () => void;
}

const AdminHeader = ({ currentUser, onNavigateHome, onLogout }: AdminHeaderProps) => {
  return (
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
              <p className="text-gray-400 text-sm">Добро пожаловать, {currentUser?.username || 'Admin'}!</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={onNavigateHome}
              className="bg-white/10 hover:bg-white/20 text-white"
            >
              <Icon name="Home" size={18} className="mr-2" />
              На главную
            </Button>
            <Button
              onClick={onLogout}
              className="bg-white/10 hover:bg-white/20 text-white"
            >
              <Icon name="LogOut" size={18} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
