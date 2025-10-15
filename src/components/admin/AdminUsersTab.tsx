import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { User } from './types';

interface AdminUsersTabProps {
  loading: boolean;
  users: User[];
  onRefresh: () => void;
}

const AdminUsersTab = ({ loading, users, onRefresh }: AdminUsersTabProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Управление пользователями</h2>
        <Button
          onClick={onRefresh}
          disabled={loading}
          className="bg-white/10 hover:bg-white/20 text-white"
        >
          <Icon name="RefreshCw" size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
          Обновить
        </Button>
      </div>

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
                  <th className="px-6 py-4 text-left text-white font-semibold">Роль</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Дата регистрации</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-white/10 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-gray-300">{user.id}</td>
                    <td className="px-6 py-4 text-white font-medium">{user.username}</td>
                    <td className="px-6 py-4 text-gray-300">{user.email}</td>
                    <td className="px-6 py-4 text-gray-300">{user.credits.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.plan === 'unlimited' ? 'gradient-bg text-white' : 'bg-white/10 text-gray-300'
                      }`}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.is_admin ? (
                        <span className="text-yellow-400 font-semibold">👑 Админ</span>
                      ) : (
                        <span className="text-gray-500">Пользователь</span>
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
  );
};

export default AdminUsersTab;
