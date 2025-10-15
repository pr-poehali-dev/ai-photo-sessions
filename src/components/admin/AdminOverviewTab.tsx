import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Stats, TabType } from './types';

interface AdminOverviewTabProps {
  loading: boolean;
  stats: Stats | null;
  currentUser: any;
  onTabChange: (tab: TabType) => void;
}

const AdminOverviewTab = ({ loading, stats, currentUser, onTabChange }: AdminOverviewTabProps) => {
  if (loading && !stats) {
    return (
      <div className="text-center py-20">
        <Icon name="Loader2" size={48} className="text-primary animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Загрузка статистики...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="glass-effect p-6 hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
              <Icon name="Users" size={24} className="text-white" />
            </div>
            <span className="text-3xl font-black text-white">{stats?.total_users || 0}</span>
          </div>
          <h3 className="text-gray-400 text-sm font-medium">Всего пользователей</h3>
        </Card>

        <Card className="glass-effect p-6 hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
              <Icon name="Image" size={24} className="text-white" />
            </div>
            <span className="text-3xl font-black text-white">{stats?.total_images || 0}</span>
          </div>
          <h3 className="text-gray-400 text-sm font-medium">Всего изображений</h3>
        </Card>

        <Card className="glass-effect p-6 hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
              <Icon name="Zap" size={24} className="text-white" />
            </div>
            <span className="text-3xl font-black text-white">{stats?.total_credits_used || 0}</span>
          </div>
          <h3 className="text-gray-400 text-sm font-medium">Использовано кредитов</h3>
        </Card>

        <Card className="glass-effect p-6 hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
              <Icon name="Activity" size={24} className="text-white" />
            </div>
            <span className="text-3xl font-black text-white">{stats?.active_users || 0}</span>
          </div>
          <h3 className="text-gray-400 text-sm font-medium">Активных за неделю</h3>
        </Card>
      </div>

      <Card className="glass-effect p-8">
        <h2 className="text-2xl font-bold text-white mb-4">👑 Привет, {currentUser?.username}!</h2>
        <p className="text-gray-300 mb-6">
          У вас <span className="text-primary font-bold">{currentUser?.credits?.toLocaleString() || 0}</span> кредитов 
          {currentUser?.plan === 'unlimited' && <span className="ml-2 px-3 py-1 rounded-full text-xs font-semibold gradient-bg text-white">БЕЗЛИМИТ</span>}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={() => onTabChange('generator')}
            className="gradient-bg hover:opacity-90 text-white py-6 text-lg"
          >
            <Icon name="Sparkles" size={24} className="mr-2" />
            Создать изображение
          </Button>
          <Button
            onClick={() => onTabChange('users')}
            className="bg-white/10 hover:bg-white/20 text-white py-6 text-lg"
          >
            <Icon name="Users" size={24} className="mr-2" />
            Управление пользователями
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminOverviewTab;
