import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const quickLoginAsAdmin = async () => {
    setEmail('diana2025@photoset.ai');
    setPassword('123Diana_123');
    setIsLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/d72c2702-d925-43c1-9343-c8c94ce97cf1?action=login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: 'diana2025@photoset.ai', 
          password: '123Diana_123' 
        })
      });

      const data = await response.json();

      if (data.success && data.session_token) {
        localStorage.setItem('session_token', data.session_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast({
          title: '👑 Добро пожаловать, Diana!',
          description: `Вы вошли как администратор`,
        });
        navigate('/');
      } else {
        toast({
          title: 'Ошибка входа',
          description: data.error || 'Не удалось войти как админ',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Ошибка подключения',
        description: 'Не удалось подключиться к серверу',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/d72c2702-d925-43c1-9343-c8c94ce97cf1?action=login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success && data.session_token) {
        localStorage.setItem('session_token', data.session_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast({
          title: 'Успешный вход',
          description: `Добро пожаловать, ${data.user.username}!`,
        });
        navigate('/');
      } else {
        toast({
          title: 'Ошибка входа',
          description: data.error || 'Неверный email или пароль',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Ошибка подключения',
        description: 'Не удалось подключиться к серверу',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-primary/20 flex items-center justify-center px-6">
      <Card className="w-full max-w-md glass-effect p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="https://cdn.poehali.dev/projects/2b4ea3db-a438-4e53-a09d-44a613d412ef/files/fe48bd8a-64d0-48f7-9f23-7b5d9060388a.jpg" 
              alt="PhotoSet" 
              className="h-16 w-16 object-contain"
            />
          </div>
          <h1 className="text-3xl font-black gradient-text mb-2">Вход в PhotoSet</h1>
          <p className="text-gray-400">Войдите, чтобы продолжить</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full gradient-bg hover:opacity-90 text-white py-6 text-lg font-semibold rounded-xl shadow-xl transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                Вход...
              </>
            ) : (
              <>
                <Icon name="LogIn" size={20} className="mr-2" />
                Войти
              </>
            )}
          </Button>
        </form>

        <div className="mt-6">
          <Button
            type="button"
            onClick={quickLoginAsAdmin}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-4 font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50"
          >
            <Icon name="Shield" size={20} className="mr-2" />
            👑 Быстрый вход как Админ
          </Button>
        </div>

        <div className="mt-6 text-center space-y-3">
          <button
            onClick={() => navigate('/reset-password')}
            className="text-primary hover:text-primary/80 text-sm transition-colors"
          >
            Забыли пароль?
          </button>
          
          <div className="text-gray-400 text-sm">
            Нет аккаунта?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Зарегистрироваться
            </button>
          </div>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="w-full text-white hover:bg-white/10"
          >
            <Icon name="ArrowLeft" size={18} className="mr-2" />
            На главную
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Login;