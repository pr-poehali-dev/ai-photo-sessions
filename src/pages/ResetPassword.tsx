import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState(token || '');
  const [step, setStep] = useState<'request' | 'reset'>(token ? 'reset' : 'request');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/d72c2702-d925-43c1-9343-c8c94ce97cf1?action=reset-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        if (data.token) {
          setResetToken(data.token);
          setStep('reset');
          toast({
            title: 'Токен получен',
            description: 'Введите новый пароль',
          });
        } else {
          toast({
            title: 'Проверьте почту',
            description: 'Если email зарегистрирован, вы получите ссылку для сброса пароля',
          });
        }
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось отправить запрос',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Reset request error:', error);
      toast({
        title: 'Ошибка подключения',
        description: 'Не удалось подключиться к серверу',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Ошибка',
        description: 'Пароли не совпадают',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: 'Ошибка',
        description: 'Пароль должен быть не менее 8 символов',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/d72c2702-d925-43c1-9343-c8c94ce97cf1?action=reset-complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: resetToken,
          new_password: newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Пароль изменен!',
          description: 'Теперь вы можете войти с новым паролем',
        });
        navigate('/login');
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось изменить пароль',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Password reset error:', error);
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
          <h1 className="text-3xl font-black gradient-text mb-2">
            {step === 'request' ? 'Восстановление пароля' : 'Новый пароль'}
          </h1>
          <p className="text-gray-400">
            {step === 'request' 
              ? 'Введите email для восстановления доступа' 
              : 'Создайте новый пароль для вашего аккаунта'}
          </p>
        </div>

        {step === 'request' ? (
          <form onSubmit={handleRequestReset} className="space-y-4">
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

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full gradient-bg hover:opacity-90 text-white py-6 text-lg font-semibold rounded-xl shadow-xl transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Icon name="Mail" size={20} className="mr-2" />
                  Отправить запрос
                </>
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">Новый пароль</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="••••••••"
              />
              <p className="text-gray-400 text-xs mt-1">Минимум 8 символов</p>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Повторите пароль</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Изменение...
                </>
              ) : (
                <>
                  <Icon name="Key" size={20} className="mr-2" />
                  Изменить пароль
                </>
              )}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-primary hover:text-primary/80 text-sm transition-colors"
          >
            Вернуться к входу
          </button>
        </div>

        <div className="mt-4">
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

export default ResetPassword;
