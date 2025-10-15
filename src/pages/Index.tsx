import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { translations, Language } from '@/i18n/translations';
import { useToast } from '@/hooks/use-toast';
import ShareDialog from '@/components/ShareDialog';

interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  credits: number;
  plan: string;
  avatar_url?: string;
  is_admin?: boolean;
  free_generations_used?: number;
  free_generations_limit?: number;
  subscription_status?: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [language, setLanguage] = useState<Language>('ru');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{type: string, name: string, action: () => void}>>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const t = translations[language];

  useEffect(() => {
    const checkAuth = async () => {
      const sessionToken = localStorage.getItem('session_token');
      const savedUser = localStorage.getItem('user');
      
      if (sessionToken && savedUser) {
        try {
          const response = await fetch('https://functions.poehali.dev/d72c2702-d925-43c1-9343-c8c94ce97cf1?action=verify', {
            method: 'GET',
            headers: {
              'X-Session-Token': sessionToken
            }
          });
          
          const data = await response.json();
          
          if (data.success) {
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
          } else {
            localStorage.removeItem('session_token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Auth check error:', error);
        }
      }
      setIsLoadingUser(false);
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const themes = [
    { id: 'professional', name: t.themes.professional, icon: 'Briefcase' },
    { id: 'fashion', name: t.themes.fashion, icon: 'Sparkles' },
    { id: 'casual', name: t.themes.casual, icon: 'Coffee' },
    { id: 'outdoor', name: t.themes.outdoor, icon: 'Mountain' },
    { id: 'vintage', name: t.themes.vintage, icon: 'Camera' },
    { id: 'studio', name: t.themes.studio, icon: 'Aperture' }
  ];

  const examples = [
    { url: 'https://v3b.fal.media/files/b/tiger/HBqy7ktdkNZQbMq0c1DPY_output.png', theme: t.themes.professional },
    { url: 'https://v3b.fal.media/files/b/tiger/HBqy7ktdkNZQbMq0c1DPY_output.png', theme: t.themes.fashion },
    { url: 'https://v3b.fal.media/files/b/tiger/HBqy7ktdkNZQbMq0c1DPY_output.png', theme: t.themes.casual },
    { url: 'https://v3b.fal.media/files/b/tiger/HBqy7ktdkNZQbMq0c1DPY_output.png', theme: t.themes.studio }
  ];

  const gallery = [
    { id: 1, url: 'https://v3b.fal.media/files/b/tiger/HBqy7ktdkNZQbMq0c1DPY_output.png', theme: t.themes.professional },
    { id: 2, url: 'https://v3b.fal.media/files/b/tiger/HBqy7ktdkNZQbMq0c1DPY_output.png', theme: t.themes.fashion },
    { id: 3, url: 'https://v3b.fal.media/files/b/tiger/HBqy7ktdkNZQbMq0c1DPY_output.png', theme: t.themes.casual }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const results: Array<{type: string, name: string, action: () => void}> = [];
    const lowerQuery = query.toLowerCase();

    const sections = [
      { name: t.nav.home, keywords: ['главная', 'home', 'начало', 'старт', 'домой'], action: () => setActiveTab('home') },
      { name: t.nav.generator, keywords: ['генератор', 'generator', 'создать', 'generate', 'фото', 'photo', 'сгенерировать'], action: () => setActiveTab('generator') },
      { name: t.nav.gallery, keywords: ['галерея', 'gallery', 'мои', 'работы', 'коллекция', 'мои фото'], action: () => setActiveTab('gallery') },
      { name: t.nav.examples, keywords: ['примеры', 'examples', 'образцы', 'идеи', 'вдохновение'], action: () => setActiveTab('examples') },
      { name: t.nav.prompts, keywords: ['промты', 'prompts', 'подсказки', 'запросы', 'описания', 'текст'], action: () => setActiveTab('prompts') },
      { name: t.nav.faq, keywords: ['faq', 'вопросы', 'помощь', 'частые', 'ответы', 'как'], action: () => setActiveTab('faq') },
      { name: t.nav.pricing, keywords: ['тарифы', 'pricing', 'цены', 'планы', 'подписка', 'оплата', 'стоимость'], action: () => setActiveTab('pricing') },
      { name: t.nav.support, keywords: ['поддержка', 'support', 'контакты', 'связь', 'написать', 'помощь'], action: () => setActiveTab('support') }
    ];

    const themeKeywords: Record<string, string[]> = {
      professional: ['профессиональные', 'деловые', 'бизнес', 'офис', 'костюм', 'работа'],
      fashion: ['модные', 'мода', 'стиль', 'vogue', 'журнал', 'подиум'],
      casual: ['повседневные', 'casual', 'простые', 'обычные', 'каждый день'],
      outdoor: ['уличные', 'улица', 'outdoor', 'город', 'городские'],
      vintage: ['винтажные', 'ретро', 'старые', '70', 'винтаж'],
      studio: ['студийные', 'студия', 'фотостудия', 'professional']
    };

    sections.forEach(section => {
      if (section.name.toLowerCase().includes(lowerQuery) || 
          section.keywords.some(k => k.includes(lowerQuery))) {
        results.push({ type: 'Раздел', name: section.name, action: section.action });
      }
    });

    themes.forEach(theme => {
      const keywords = themeKeywords[theme.id] || [];
      if (theme.name.toLowerCase().includes(lowerQuery) || 
          keywords.some(k => k.includes(lowerQuery))) {
        results.push({ 
          type: 'Образ', 
          name: theme.name, 
          action: () => {
            setSelectedTheme(theme.id);
            setActiveTab('generator');
          }
        });
      }
    });

    if (t.prompts && t.prompts.categories) {
      t.prompts.categories.forEach(category => {
        if (category.title.toLowerCase().includes(lowerQuery)) {
          results.push({ 
            type: 'Промты', 
            name: category.title, 
            action: () => setActiveTab('prompts')
          });
        }
      });
    }

    setSearchResults(results);
    setShowSearchResults(true);
  };

  const handleGenerate = async () => {
    if (!user) {
      toast({
        title: language === 'ru' ? 'Требуется авторизация' : 'Authorization required',
        description: language === 'ru' ? 'Войдите или зарегистрируйтесь для генерации изображений' : 'Login or register to generate images',
        variant: 'destructive',
      });
      navigate('/register');
      return;
    }

    if (!customPrompt && !selectedTheme) {
      toast({
        title: language === 'ru' ? 'Заполните поле' : 'Fill the field',
        description: language === 'ru' ? 'Выберите тему или введите описание' : 'Select a theme or enter description',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);

    const promptText = customPrompt || `A professional ${selectedTheme} photoshoot portrait`;
    const sessionToken = localStorage.getItem('session_token');

    try {
      const response = await fetch('https://functions.poehali.dev/7d536f2c-ea7f-4cbb-9f6b-97f5fbd3af1e', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Token': sessionToken || ''
        },
        body: JSON.stringify({
          prompt: promptText,
          size: '1024x1024',
          model: 'dall-e-3'
        })
      });

      const data = await response.json();

      if (data.code === 'LIMIT_EXCEEDED') {
        toast({
          title: language === 'ru' ? 'Лимит исчерпан' : 'Limit exceeded',
          description: language === 'ru' ? 
            `Вы использовали все ${data.free_limit} бесплатные генерации. Оформите подписку для продолжения!` :
            `You used all ${data.free_limit} free generations. Subscribe to continue!`,
          variant: 'destructive',
        });
        setActiveTab('pricing');
        return;
      }

      if (data.code === 'NO_CREDITS') {
        toast({
          title: language === 'ru' ? 'Кредиты закончились' : 'No credits',
          description: language === 'ru' ? 
            'У вас закончились кредиты. Обновите тариф для продолжения!' :
            'You have no credits left. Upgrade your plan to continue!',
          variant: 'destructive',
        });
        setActiveTab('pricing');
        return;
      }

      if (data.success && data.image_url) {
        setGeneratedImage(data.image_url);
        
        if (user) {
          setUser({
            ...user,
            credits: data.remaining_credits !== null ? data.remaining_credits : user.credits
          });
        }
        
        await fetch('https://functions.poehali.dev/ed30ba91-7de2-406c-a2aa-91ad833c0ac8', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.id,
            prompt: promptText,
            image_url: data.image_url,
            theme: selectedTheme,
            model: 'dall-e-3'
          })
        });

        toast({
          title: language === 'ru' ? 'Готово!' : 'Success!',
          description: data.remaining_free !== null ? 
            (language === 'ru' ? `Осталось бесплатных генераций: ${data.remaining_free}` : `Free generations left: ${data.remaining_free}`) :
            (language === 'ru' ? `Осталось кредитов: ${data.remaining_credits}` : `Credits left: ${data.remaining_credits}`),
        });
      } else {
        toast({
          title: language === 'ru' ? 'Ошибка' : 'Error',
          description: data.error || (language === 'ru' ? 'Ошибка генерации' : 'Generation error'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: language === 'ru' ? 'Ошибка' : 'Error',
        description: language === 'ru' ? 'Ошибка подключения к серверу' : 'Server connection error',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-primary/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center gap-0.5 cursor-pointer" onClick={() => setActiveTab('home')}>
              <img 
                src="https://cdn.poehali.dev/projects/2b4ea3db-a438-4e53-a09d-44a613d412ef/files/fe48bd8a-64d0-48f7-9f23-7b5d9060388a.jpg" 
                alt="PhotoSet" 
                className="h-10 w-10 object-contain"
              />
              <span className="text-sm font-bold bg-gradient-to-r from-white to-primary bg-clip-text text-transparent whitespace-nowrap">
                PhotoSet
              </span>
              <span className="text-[10px] text-gray-400 whitespace-nowrap">
                by Davidova
              </span>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative" ref={searchRef}>
                <div className="relative">
                  <Icon name="Search" size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={language === 'ru' ? 'Поиск образов, разделов...' : 'Search styles, sections...'}
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                    className="w-64 bg-white/5 border border-white/10 rounded-xl pl-11 pr-20 py-2.5 text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs text-gray-400 bg-white/5 border border-white/10 rounded">
                    ⌘K
                  </kbd>
                </div>
                
                {showSearchResults && (
                  <div className="absolute top-full mt-2 w-80 glass-effect border border-white/10 rounded-xl shadow-2xl max-h-96 overflow-y-auto z-50">
                    {searchResults.length > 0 ? (
                      searchResults.map((result, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            result.action();
                            setShowSearchResults(false);
                            setSearchQuery('');
                          }}
                          className="w-full px-5 py-3 flex items-center gap-3 hover:bg-white/10 transition-all text-left border-b border-white/5 last:border-0"
                        >
                          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center flex-shrink-0">
                            <Icon name={result.type === 'Раздел' ? 'Layout' : result.type === 'Образ' ? 'Image' : 'FileText'} size={16} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-semibold">{result.name}</p>
                            <p className="text-gray-400 text-sm">{result.type}</p>
                          </div>
                          <Icon name="ArrowRight" size={16} className="text-gray-400" />
                        </button>
                      ))
                    ) : (
                      <div className="px-5 py-8 text-center">
                        <Icon name="SearchX" size={40} className="text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-300 font-medium mb-1">
                          {language === 'ru' ? 'Ничего не найдено' : 'Nothing found'}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {language === 'ru' ? 'Попробуйте другой запрос' : 'Try another search'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Button 
                variant="ghost" 
                className="text-white hover:text-primary hover:bg-white/5"
                onClick={() => setActiveTab('home')}
              >
                {t.nav.home}
              </Button>
              <Button 
                variant="ghost" 
                className="text-white hover:text-primary hover:bg-white/5"
                onClick={() => setActiveTab('generator')}
              >
                {t.nav.generator}
              </Button>
              <Button 
                variant="ghost" 
                className="text-white hover:text-primary hover:bg-white/5"
                onClick={() => setActiveTab('gallery')}
              >
                {t.nav.gallery}
              </Button>
              <Button 
                variant="ghost" 
                className="text-white hover:text-primary hover:bg-white/5"
                onClick={() => setActiveTab('examples')}
              >
                {t.nav.examples}
              </Button>
              <Button 
                variant="ghost" 
                className="text-white hover:text-primary hover:bg-white/5"
                onClick={() => setActiveTab('prompts')}
              >
                {t.nav.prompts}
              </Button>
              <Button 
                variant="ghost" 
                className="text-white hover:text-primary hover:bg-white/5"
                onClick={() => setActiveTab('faq')}
              >
                {t.nav.faq}
              </Button>
              <Button 
                variant="ghost" 
                className="text-white hover:text-primary hover:bg-white/5"
                onClick={() => setActiveTab('pricing')}
              >
                {t.nav.pricing}
              </Button>
              <Button 
                variant="ghost" 
                className="text-white hover:text-primary hover:bg-white/5"
                onClick={() => setActiveTab('support')}
              >
                {t.nav.support}
              </Button>
              <Button 
                variant="ghost" 
                className="text-white hover:text-primary hover:bg-white/5"
                onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
              >
                {language === 'ru' ? '🇬🇧 EN' : '🇷🇺 RU'}
              </Button>
              {isLoadingUser ? (
                <div className="w-10 h-10 flex items-center justify-center">
                  <Icon name="Loader2" size={20} className="text-white animate-spin" />
                </div>
              ) : user ? (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    className="text-white hover:text-primary hover:bg-white/5"
                    onClick={() => setActiveTab('profile')}
                  >
                    <Icon name="User" size={20} className="mr-2" />
                    {user.username}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="text-white hover:text-red-500 hover:bg-white/5"
                    onClick={() => {
                      localStorage.removeItem('session_token');
                      localStorage.removeItem('user');
                      setUser(null);
                      toast({
                        title: 'Выход выполнен',
                        description: 'До скорой встречи!',
                      });
                    }}
                  >
                    <Icon name="LogOut" size={20} />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    className="text-white hover:text-primary hover:bg-white/5"
                    onClick={() => navigate('/login')}
                  >
                    Войти
                  </Button>
                  <Button 
                    className="gradient-bg hover:opacity-90 text-white"
                    onClick={() => navigate('/register')}
                  >
                    Регистрация
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {activeTab === 'home' && (
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-4xl mx-auto text-center mb-20 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-gradient-end/20 blur-[100px] -z-10"></div>
              <h1 className="text-7xl font-black mb-6 gradient-text animate-fade-in">
                {t.hero.title}
              </h1>
              <p className="text-2xl text-gray-300 mb-10 animate-fade-in-up font-light" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                {t.hero.subtitle}
              </p>
              <Button 
                size="lg" 
                className="gradient-bg hover:opacity-90 text-white px-10 py-7 text-lg font-semibold rounded-2xl shadow-2xl animate-glow transition-all"
                style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
                onClick={() => setActiveTab('generator')}
              >
                {t.hero.cta} →
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              <Card className="glass-effect p-8 hover:scale-105 hover:border-primary/30 transition-all duration-300 animate-fade-in-up group" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
                <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mb-6 group-hover:animate-float">
                  <Icon name="Sparkles" size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{t.features.faceSwap.title}</h3>
                <p className="text-gray-300 leading-relaxed">{t.features.faceSwap.description}</p>
              </Card>
              <Card className="glass-effect p-8 hover:scale-105 hover:border-primary/30 transition-all duration-300 animate-fade-in-up group" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
                <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mb-6 group-hover:animate-float">
                  <Icon name="Palette" size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{t.features.themes.title}</h3>
                <p className="text-gray-300 leading-relaxed">{t.features.themes.description}</p>
              </Card>
              <Card className="glass-effect p-8 hover:scale-105 hover:border-primary/30 transition-all duration-300 animate-fade-in-up group" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
                <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mb-6 group-hover:animate-float">
                  <Icon name="Zap" size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{t.features.fast.title}</h3>
                <p className="text-gray-300 leading-relaxed">{t.features.fast.description}</p>
              </Card>
            </div>

            <div className="mb-12">
              <h2 className="text-5xl font-black text-center mb-12 gradient-text animate-fade-in" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>{t.sections.recentExamples}</h2>
              <div className="horizontal-scroll pb-4">
                <div className="flex gap-6" style={{ minWidth: 'max-content' }}>
                  {examples.map((example, idx) => (
                    <Card key={idx} className="overflow-hidden glass-effect hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 animate-scale-in group w-80 flex-shrink-0" style={{ animationDelay: `${0.9 + idx * 0.1}s`, animationFillMode: 'both' }}>
                      <div className="relative overflow-hidden">
                        <img src={example.url} alt={example.theme} className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <div className="p-5">
                        <p className="text-white font-semibold text-lg">{example.theme}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'generator' && (
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl font-black text-center mb-4 gradient-text">{t.generator.title}</h1>
              <p className="text-center text-gray-300 mb-8">
                {language === 'ru' ? '🤖 Powered by OpenAI DALL-E 3' : '🤖 Powered by OpenAI DALL-E 3'}
              </p>
              
              <Card className="glass-effect p-8 mb-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-4">{t.generator.uploadTitle}</h3>
                  <div className="border-2 border-dashed border-primary/50 rounded-lg p-12 text-center hover:border-primary transition-colors">
                    {selectedImage ? (
                      <div className="flex flex-col items-center">
                        <img src={selectedImage} alt="Selected" className="w-48 h-48 object-cover rounded-lg mb-4" />
                        <Button 
                          variant="outline" 
                          onClick={() => setSelectedImage(null)}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          {t.generator.changePhoto}
                        </Button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <Icon name="Upload" size={48} className="mx-auto mb-4 text-primary" />
                        <p className="text-white mb-2">{t.generator.uploadText}</p>
                        <p className="text-gray-400 text-sm">{t.generator.uploadSubtext}</p>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-4">{language === 'ru' ? 'Опишите желаемое изображение' : 'Describe the desired image'}</h3>
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder={language === 'ru' ? 'Например: Профессиональный деловой портрет в костюме, нейтральный фон, студийное освещение...' : 'Example: Professional business portrait in suit, neutral background, studio lighting...'}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none h-32"
                  />
                  <p className="text-gray-400 text-sm mt-2">
                    {language === 'ru' ? '💡 Совет: Укажите стиль, освещение, фон и настроение для лучшего результата' : '💡 Tip: Specify style, lighting, background and mood for best results'}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-4">{t.generator.chooseTheme}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {themes.map((theme) => (
                      <Card 
                        key={theme.id}
                        className={`p-4 cursor-pointer transition-all ${
                          selectedTheme === theme.id 
                            ? 'gradient-bg border-primary shadow-lg' 
                            : 'glass-effect hover:border-primary/30'
                        }`}
                        onClick={() => setSelectedTheme(theme.id)}
                      >
                        <Icon name={theme.icon as any} size={32} className="mx-auto mb-2 text-white" />
                        <p className="text-white text-center font-medium">{theme.name}</p>
                      </Card>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full gradient-bg hover:opacity-90 text-white py-6 text-lg font-semibold rounded-xl shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={(!customPrompt && !selectedTheme) || isGenerating}
                  onClick={handleGenerate}
                >
                  {isGenerating ? (
                    <>
                      <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                      {language === 'ru' ? 'Генерируем...' : 'Generating...'}
                    </>
                  ) : (
                    <>
                      <Icon name="Sparkles" size={20} className="mr-2" />
                      {t.generator.generateBtn}
                    </>
                  )}
                </Button>

                {generatedImage && (
                  <div className="mt-8">
                    <h3 className="text-2xl font-bold text-white mb-4">{language === 'ru' ? 'Результат' : 'Result'}</h3>
                    <Card className="overflow-hidden glass-effect">
                      <img src={generatedImage} alt="Generated" className="w-full" />
                      <div className="p-4 space-y-3">
                        <div className="flex gap-3">
                          <Button 
                            className="flex-1 gradient-bg hover:opacity-90 text-white"
                            onClick={async () => {
                              try {
                                const response = await fetch(generatedImage);
                                const blob = await response.blob();
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `photoset-ai-${Date.now()}.png`;
                                document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                                document.body.removeChild(a);
                                toast({
                                  title: language === 'ru' ? 'Успешно!' : 'Success!',
                                  description: language === 'ru' ? 'Изображение загружено' : 'Image downloaded',
                                });
                              } catch (err) {
                                toast({
                                  title: language === 'ru' ? 'Ошибка' : 'Error',
                                  description: language === 'ru' ? 'Не удалось загрузить изображение' : 'Failed to download image',
                                  variant: 'destructive',
                                });
                              }
                            }}
                          >
                            <Icon name="Download" size={18} className="mr-2" />
                            {language === 'ru' ? 'Скачать' : 'Download'}
                          </Button>
                          <ShareDialog 
                            imageUrl={generatedImage}
                            prompt={customPrompt}
                            trigger={
                              <Button className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20">
                                <Icon name="Share2" size={18} className="mr-2" />
                                {language === 'ru' ? 'Поделиться' : 'Share'}
                              </Button>
                            }
                          />
                        </div>
                        <Button 
                          className="w-full bg-white/5 hover:bg-white/10 text-white"
                          onClick={() => {
                            setGeneratedImage(null);
                            setCustomPrompt('');
                            setSelectedTheme('');
                          }}
                        >
                          <Icon name="RefreshCw" size={18} className="mr-2" />
                          {language === 'ru' ? 'Создать новое' : 'Create new'}
                        </Button>
                      </div>
                    </Card>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="container mx-auto px-6 py-20">
            <h1 className="text-4xl font-bold text-white mb-8">{t.gallery.title}</h1>
            <div className="horizontal-scroll pb-4">
              <div className="flex gap-6" style={{ minWidth: 'max-content' }}>
                {gallery.map((item) => (
                  <Card key={item.id} className="overflow-hidden bg-white/5 border-white/10 hover:scale-105 transition-transform w-96 flex-shrink-0">
                    <img src={item.url} alt={item.theme} className="w-full h-80 object-cover" />
                    <div className="p-4 flex items-center justify-between">
                      <p className="text-white font-medium">{item.theme}</p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-white hover:bg-white/10"
                          onClick={async () => {
                            try {
                              const response = await fetch(item.url);
                              const blob = await response.blob();
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `photoset-${item.id}.png`;
                              document.body.appendChild(a);
                              a.click();
                              window.URL.revokeObjectURL(url);
                              document.body.removeChild(a);
                            } catch (err) {
                              console.error('Download failed:', err);
                            }
                          }}
                        >
                          <Icon name="Download" size={16} />
                        </Button>
                        <ShareDialog 
                          imageUrl={item.url}
                          prompt={item.theme}
                          trigger={
                            <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                              <Icon name="Share2" size={16} />
                            </Button>
                          }
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'examples' && (
          <div className="container mx-auto px-6 py-20">
            <h1 className="text-4xl font-bold text-white mb-8">{t.examples.title}</h1>
            <div className="horizontal-scroll pb-4">
              <div className="flex gap-6" style={{ minWidth: 'max-content' }}>
                {themes.map((theme) => (
                  <Card key={theme.id} className="overflow-hidden bg-white/5 border-white/10 w-96 flex-shrink-0 hover:scale-105 transition-transform">
                    <img 
                      src="https://v3b.fal.media/files/b/tiger/HBqy7ktdkNZQbMq0c1DPY_output.png" 
                      alt={theme.name} 
                      className="w-full h-80 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon name={theme.icon as any} size={20} className="text-primary" />
                          <h3 className="text-xl font-semibold text-white">{theme.name}</h3>
                        </div>
                        <ShareDialog 
                          imageUrl="https://v3b.fal.media/files/b/tiger/HBqy7ktdkNZQbMq0c1DPY_output.png"
                          prompt={theme.name}
                          trigger={
                            <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                              <Icon name="Share2" size={16} />
                            </Button>
                          }
                        />
                      </div>
                      <p className="text-gray-400">{t.examples.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold text-white mb-8">{t.faq.title}</h1>
              <div className="space-y-4">
                {t.faq.items.map((faq, idx) => (
                  <Card key={idx} className="bg-white/5 backdrop-blur-sm border-white/10 p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{faq.q}</h3>
                    <p className="text-gray-400">{faq.a}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="container mx-auto px-6 py-20">
            <h1 className="text-6xl font-black text-center mb-6 gradient-text">{t.pricing.title}</h1>
            <p className="text-xl text-gray-300 text-center mb-8 max-w-2xl mx-auto">Выберите подходящий тариф для ваших задач</p>
            
            {!user ? (
              <Card className="max-w-2xl mx-auto glass-effect p-8 text-center mb-12">
                <Icon name="Gift" size={64} className="mx-auto mb-4 text-primary" />
                <h2 className="text-3xl font-bold text-white mb-3">3 бесплатные генерации!</h2>
                <p className="text-gray-300 text-lg mb-6">
                  Зарегистрируйтесь и получите 3 бесплатные генерации для знакомства с сервисом
                </p>
                <Button 
                  onClick={() => navigate('/register')}
                  className="gradient-bg hover:opacity-90 text-white px-8 py-6 text-lg"
                >
                  <Icon name="UserPlus" size={20} className="mr-2" />
                  Зарегистрироваться бесплатно
                </Button>
              </Card>
            ) : user.subscription_status === 'none' && (
              <Card className="max-w-2xl mx-auto glass-effect p-8 text-center mb-12 border-primary/50">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Icon name="Zap" size={48} className="text-primary animate-pulse" />
                  <div>
                    <p className="text-4xl font-black gradient-text">
                      {user.free_generations_used || 0} / 3
                    </p>
                    <p className="text-gray-400">использовано</p>
                  </div>
                </div>
                <p className="text-white text-lg mb-2">
                  {user.free_generations_used >= 3 ? 
                    'Вы использовали все бесплатные генерации' : 
                    `Осталось ${3 - (user.free_generations_used || 0)} бесплатных генераций`
                  }
                </p>
                <p className="text-gray-300">
                  Оформите подписку, чтобы продолжить создавать изображения!
                </p>
              </Card>
            )}
            
            <div className="horizontal-scroll pb-4">
              <div className="flex gap-8 px-4" style={{ minWidth: 'max-content' }}>
                {[
                  { id: 'starter', price: '5', credits: '50', popular: false, name: 'Стартовый' },
                  { id: 'standard', price: '10', credits: '100', popular: true, name: 'Стандартный' },
                  { id: 'premium', price: '15', credits: '200', popular: false, name: 'Премиум' }
                ].map((plan) => (
                  <Card key={plan.id} className={`p-10 relative transition-all duration-300 hover:scale-105 w-96 flex-shrink-0 ${
                    plan.popular 
                      ? 'glass-effect border-primary shadow-2xl shadow-primary/20 animate-glow' 
                      : 'glass-effect hover:border-primary/30'
                  }`}>
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="gradient-bg px-6 py-2 rounded-full text-white text-sm font-bold shadow-lg">
                          Популярный
                        </span>
                      </div>
                    )}
                    <h3 className="text-3xl font-bold text-white mb-4">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-6xl font-black gradient-text">${plan.price}</span>
                      <span className="text-xl text-gray-400 ml-2">/ месяц</span>
                    </div>
                    <p className="text-gray-300 mb-8 text-lg">{plan.credits} генераций</p>
                    <ul className="text-gray-300 space-y-3 mb-8">
                      <li className="flex items-center gap-2">
                        <Icon name="Check" size={20} className="text-primary" />
                        DALL-E 3 качество
                      </li>
                      <li className="flex items-center gap-2">
                        <Icon name="Check" size={20} className="text-primary" />
                        Без watermark
                      </li>
                      <li className="flex items-center gap-2">
                        <Icon name="Check" size={20} className="text-primary" />
                        Коммерческая лицензия
                      </li>
                      <li className="flex items-center gap-2">
                        <Icon name="Check" size={20} className="text-primary" />
                        Поддержка 24/7
                      </li>
                    </ul>
                    <Button 
                      onClick={async () => {
                        if (!user) {
                          navigate('/register');
                          return;
                        }
                        
                        const sessionToken = localStorage.getItem('session_token');
                        try {
                          const response = await fetch('https://functions.poehali.dev/8d0ec26b-25da-4a04-9d3e-712ff7777a39?action=create-order', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'X-Session-Token': sessionToken || ''
                            },
                            body: JSON.stringify({ plan: plan.id })
                          });
                          
                          const data = await response.json();
                          
                          if (data.success && data.approve_link) {
                            window.location.href = data.approve_link;
                          } else {
                            toast({
                              title: 'Ошибка',
                              description: data.error || 'Не удалось создать платеж',
                              variant: 'destructive',
                            });
                          }
                        } catch (error) {
                          console.error('Payment error:', error);
                          toast({
                            title: 'Ошибка',
                            description: 'Не удалось подключиться к PayPal',
                            variant: 'destructive',
                          });
                        }
                      }}
                      className={`w-full py-6 text-lg font-semibold rounded-xl transition-all ${
                        plan.popular 
                          ? 'gradient-bg hover:opacity-90 text-white shadow-xl' 
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                      }`}
                    >
                      <Icon name="CreditCard" size={20} className="mr-2" />
                      {user ? 'Оплатить через PayPal' : 'Зарегистрироваться'}
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="mt-16 max-w-3xl mx-auto">
              <Card className="glass-effect p-8">
                <div className="flex items-start gap-4">
                  <Icon name="Shield" size={32} className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">Безопасность платежей</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Все платежи обрабатываются через защищенную систему PayPal. Мы не храним данные ваших банковских карт. 
                      Все транзакции защищены 256-битным SSL шифрованием.
                    </p>
                    <div className="flex items-center gap-6 text-gray-400">
                      <div className="flex items-center gap-2">
                        <Icon name="Lock" size={18} className="text-primary" />
                        <span className="text-sm">SSL шифрование</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="ShieldCheck" size={18} className="text-primary" />
                        <span className="text-sm">PCI DSS</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Check" size={18} className="text-primary" />
                        <span className="text-sm">PayPal защита</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'prompts' && (
          <div className="container mx-auto px-6 py-20">
            <h1 className="text-6xl font-black text-center mb-6 gradient-text">{t.prompts.title}</h1>
            <p className="text-xl text-gray-300 text-center mb-16 max-w-2xl mx-auto">{t.prompts.subtitle}</p>
            
            <div className="horizontal-scroll pb-4">
              <div className="flex gap-8 px-4" style={{ minWidth: 'max-content' }}>
              {t.prompts.categories.map((category, idx) => (
                <Card key={idx} className="glass-effect p-10 hover:border-primary/30 transition-all duration-300 w-[500px] flex-shrink-0">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center">
                      <Icon name={idx === 0 ? 'Briefcase' : idx === 1 ? 'Sparkles' : 'Palette'} size={24} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">{category.title}</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {category.prompts.map((prompt, pIdx) => (
                      <div key={pIdx} className="bg-black/30 rounded-xl p-5 border border-white/10 hover:border-primary/40 hover:bg-black/40 transition-all duration-300 cursor-pointer group">
                        <div className="flex items-start gap-4">
                          <Icon name="Copy" size={20} className="text-primary mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                          <p className="text-gray-200 leading-relaxed text-lg">{prompt}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
              
                <Card className="gradient-bg p-8 border-0 shadow-2xl w-[500px] flex-shrink-0">
                  <div className="flex items-start gap-4">
                    <Icon name="Lightbulb" size={28} className="text-white flex-shrink-0 animate-pulse" />
                    <p className="text-white font-semibold text-lg leading-relaxed">{t.prompts.tip}</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-4xl font-bold text-white mb-8">{t.support.title}</h1>
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">{t.support.name}</label>
                    <input 
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                      placeholder={t.support.namePlaceholder}
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">{t.support.email}</label>
                    <input 
                      type="email" 
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                      placeholder={t.support.emailPlaceholder}
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">{t.support.message}</label>
                    <textarea 
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none h-32"
                      placeholder={t.support.messagePlaceholder}
                    />
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white py-3">
                    {t.support.sendBtn}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-2xl mx-auto">
              {user ? (
                <>
                  <h1 className="text-4xl font-bold text-white mb-8">{t.profile.title}</h1>
                  <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-8">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt={user.username} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <Icon name="User" size={48} className="text-primary" />
                        )}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">{user.full_name || user.username}</h2>
                        <p className="text-gray-400">{user.email}</p>
                        {user.is_admin && (
                          <span className="inline-block mt-2 px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
                            Администратор
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <Card className="bg-white/5 border-white/10 p-4 text-center">
                        <p className="text-3xl font-bold text-primary">0</p>
                        <p className="text-gray-400 text-sm">{t.profile.generated}</p>
                      </Card>
                      <Card className="bg-white/5 border-white/10 p-4 text-center">
                        <p className="text-3xl font-bold text-primary">{user.credits}</p>
                        <p className="text-gray-400 text-sm">{t.profile.creditsLeft}</p>
                      </Card>
                      <Card className="bg-white/5 border-white/10 p-4 text-center">
                        <p className="text-3xl font-bold text-primary capitalize">{user.plan}</p>
                        <p className="text-gray-400 text-sm">{t.profile.plan}</p>
                      </Card>
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        className="flex-1 bg-primary hover:bg-primary/90 text-white"
                        onClick={() => setActiveTab('pricing')}
                      >
                        <Icon name="CreditCard" size={18} className="mr-2" />
                        Управление подпиской
                      </Button>
                      <Button 
                        variant="outline"
                        className="flex-1 border-white/20 text-white hover:bg-white/10"
                        onClick={() => {
                          localStorage.removeItem('session_token');
                          localStorage.removeItem('user');
                          setUser(null);
                          navigate('/login');
                        }}
                      >
                        <Icon name="LogOut" size={18} className="mr-2" />
                        Выйти
                      </Button>
                    </div>
                  </Card>
                </>
              ) : (
                <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-12 text-center">
                  <Icon name="Lock" size={64} className="mx-auto mb-6 text-primary" />
                  <h2 className="text-3xl font-bold text-white mb-4">Требуется авторизация</h2>
                  <p className="text-gray-400 mb-8">Войдите или зарегистрируйтесь, чтобы получить доступ к профилю</p>
                  <div className="flex gap-4 justify-center">
                    <Button 
                      onClick={() => navigate('/login')}
                      className="gradient-bg hover:opacity-90 text-white px-8"
                    >
                      Войти
                    </Button>
                    <Button 
                      onClick={() => navigate('/register')}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 px-8"
                    >
                      Регистрация
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-black/80 backdrop-blur-md border-t border-white/10 mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <p className="text-gray-400">{t.footer.copyright}</p>
            <a
              href="/admin"
              className="text-gray-500 hover:text-primary transition-colors text-sm"
              title="Admin"
            >
              <Icon name="Shield" size={16} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;