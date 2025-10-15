import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface AdminPanelProps {
  sessionToken: string;
  isAdmin: boolean;
}

interface PromoCode {
  id: number;
  code: string;
  generations: number;
  used_count: number;
  max_uses: number | null;
  is_active: boolean;
  created_at: string;
}

export default function AdminPanel({ sessionToken, isAdmin }: AdminPanelProps) {
  const { toast } = useToast();
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPromoDialog, setShowPromoDialog] = useState(false);
  const [newPromoGenerations, setNewPromoGenerations] = useState(15);

  const adminFunctionUrl = 'https://functions.poehali.dev/5025b042-4262-4d95-b9b5-769321f3eb1b';

  useEffect(() => {
    if (isAdmin) {
      loadPromoCodes();
    }
  }, [isAdmin]);

  const loadPromoCodes = async () => {
    try {
      const response = await fetch(`${adminFunctionUrl}?action=list-promos`, {
        headers: {
          'X-Session-Token': sessionToken
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setPromoCodes(data.promos);
      }
    } catch (error) {
      console.error('Failed to load promo codes:', error);
    }
  };

  const createPromoCode = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${adminFunctionUrl}?action=create-promo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Token': sessionToken
        },
        body: JSON.stringify({
          generations: newPromoGenerations,
          max_uses: null
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Промокод создан!',
          description: `Код: ${data.promo_code}`,
        });
        
        await navigator.clipboard.writeText(data.promo_code);
        
        setShowPromoDialog(false);
        loadPromoCodes();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать промокод',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePromoActive = async (promoId: number) => {
    try {
      const response = await fetch(`${adminFunctionUrl}?action=toggle-promo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Token': sessionToken
        },
        body: JSON.stringify({ promo_id: promoId })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Успешно',
          description: data.is_active ? 'Промокод активирован' : 'Промокод деактивирован',
        });
        loadPromoCodes();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить статус',
        variant: 'destructive',
      });
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="gradient-bg hover:opacity-90 text-white shadow-2xl h-14 w-14 rounded-full">
            <Icon name="Shield" size={24} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-4xl bg-gray-900/95 backdrop-blur-xl border-white/10 text-white max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold gradient-text">Админ-панель</DialogTitle>
            <DialogDescription className="text-gray-400">
              Управление промокодами и контентом
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Промокоды</h3>
                <Dialog open={showPromoDialog} onOpenChange={setShowPromoDialog}>
                  <DialogTrigger asChild>
                    <Button className="gradient-bg hover:opacity-90 text-white">
                      <Icon name="Plus" size={18} className="mr-2" />
                      Создать промокод
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900/95 backdrop-blur-xl border-white/10 text-white">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold gradient-text">Новый промокод</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Промокод будет создан автоматически
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-300 mb-2 block">
                          Количество генераций
                        </label>
                        <input
                          type="number"
                          value={newPromoGenerations}
                          onChange={(e) => setNewPromoGenerations(parseInt(e.target.value))}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                          min="1"
                          max="1000"
                        />
                      </div>
                      
                      <Button 
                        onClick={createPromoCode}
                        disabled={loading}
                        className="w-full gradient-bg hover:opacity-90 text-white py-6"
                      >
                        {loading ? (
                          <>
                            <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                            Создаём...
                          </>
                        ) : (
                          <>
                            <Icon name="Sparkles" size={18} className="mr-2" />
                            Создать промокод
                          </>
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-3">
                {promoCodes.length === 0 ? (
                  <Card className="bg-white/5 border-white/10 p-6 text-center">
                    <p className="text-gray-400">Промокоды ещё не созданы</p>
                  </Card>
                ) : (
                  promoCodes.map((promo) => (
                    <Card key={promo.id} className="bg-white/5 border-white/10 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <code className="text-2xl font-bold text-primary">{promo.code}</code>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-gray-400 hover:text-white"
                              onClick={() => {
                                navigator.clipboard.writeText(promo.code);
                                toast({
                                  title: 'Скопировано!',
                                  description: 'Промокод скопирован в буфер обмена',
                                });
                              }}
                            >
                              <Icon name="Copy" size={16} />
                            </Button>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>🎁 {promo.generations} генераций</span>
                            <span>📊 Использовано: {promo.used_count}</span>
                            <span className={promo.is_active ? 'text-green-400' : 'text-red-400'}>
                              {promo.is_active ? '✅ Активен' : '❌ Деактивирован'}
                            </span>
                          </div>
                        </div>
                        <Button
                          onClick={() => togglePromoActive(promo.id)}
                          variant={promo.is_active ? 'destructive' : 'default'}
                          size="sm"
                          className={promo.is_active ? '' : 'gradient-bg hover:opacity-90 text-white'}
                        >
                          {promo.is_active ? 'Деактивировать' : 'Активировать'}
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>

            <Card className="bg-primary/10 border-primary/20 p-4">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-300">
                  <p className="font-semibold text-white mb-1">Как использовать промокоды:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Создайте промокод и скопируйте его</li>
                    <li>Отправьте промокод выбранному пользователю</li>
                    <li>Пользователь активирует код в своём профиле</li>
                    <li>Генерации добавляются на баланс автоматически</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
