import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: 'Ошибка',
        description: 'Пароли не совпадают',
        variant: 'destructive',
      });
      return;
    }

    if (!acceptTerms) {
      toast({
        title: 'Ошибка',
        description: 'Необходимо принять условия использования',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/d72c2702-d925-43c1-9343-c8c94ce97cf1?action=register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          username,
          full_name: fullName,
          password
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Регистрация успешна!',
          description: 'Теперь вы можете войти в систему',
        });
        navigate('/login');
      } else {
        toast({
          title: 'Ошибка регистрации',
          description: data.error || 'Не удалось создать аккаунт',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-primary/20 flex items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md glass-effect p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="https://cdn.poehali.dev/projects/2b4ea3db-a438-4e53-a09d-44a613d412ef/files/fe48bd8a-64d0-48f7-9f23-7b5d9060388a.jpg" 
              alt="PhotoSet" 
              className="h-16 w-16 object-contain"
            />
          </div>
          <h1 className="text-3xl font-black gradient-text mb-2">Регистрация</h1>
          <p className="text-gray-400">Создайте аккаунт в PhotoSet</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">Email *</label>
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
            <label className="block text-white font-medium mb-2">Имя пользователя *</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="username"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Полное имя</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="Иван Иванов"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Пароль *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="••••••••"
            />
            <p className="text-gray-400 text-xs mt-1">Минимум 8 символов</p>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Повторите пароль *</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-start gap-3 pt-2">
            <input
              type="checkbox"
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-2 focus:ring-primary/20"
            />
            <label htmlFor="terms" className="text-sm text-gray-300">
              Я принимаю{' '}
              <button
                type="button"
                onClick={() => navigate('/terms')}
                className="text-primary hover:text-primary/80 underline"
              >
                условия использования
              </button>
              {' '}и{' '}
              <button
                type="button"
                onClick={() => navigate('/privacy')}
                className="text-primary hover:text-primary/80 underline"
              >
                политику конфиденциальности
              </button>
            </label>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full gradient-bg hover:opacity-90 text-white py-6 text-lg font-semibold rounded-xl shadow-xl transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                Регистрация...
              </>
            ) : (
              <>
                <Icon name="UserPlus" size={20} className="mr-2" />
                Зарегистрироваться
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <div className="text-gray-400 text-sm">
            Уже есть аккаунт?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Войти
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

export default Register;
