import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { translations, Language } from '@/i18n/translations';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [language, setLanguage] = useState<Language>('ru');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{type: string, name: string, action: () => void}>>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const t = translations[language];

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

  const handleGenerate = () => {
    console.log('Generating with theme:', selectedTheme);
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
              <Button 
                variant="ghost" 
                className="text-white hover:text-primary hover:bg-white/5"
                onClick={() => setActiveTab('profile')}
              >
                <Icon name="User" size={20} />
              </Button>
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {examples.map((example, idx) => (
                  <Card key={idx} className="overflow-hidden glass-effect hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 animate-scale-in group" style={{ animationDelay: `${0.9 + idx * 0.1}s`, animationFillMode: 'both' }}>
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
        )}

        {activeTab === 'generator' && (
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-bold text-white mb-8">{t.generator.title}</h1>
              
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-8 mb-6">
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
                  <h3 className="text-xl font-semibold text-white mb-4">{t.generator.chooseTheme}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {themes.map((theme) => (
                      <Card 
                        key={theme.id}
                        className={`p-4 cursor-pointer transition-all ${
                          selectedTheme === theme.id 
                            ? 'bg-primary border-primary' 
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
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
                  className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg"
                  disabled={!selectedImage || !selectedTheme}
                  onClick={handleGenerate}
                >
                  <Icon name="Sparkles" size={20} className="mr-2" />
                  {t.generator.generateBtn}
                </Button>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="container mx-auto px-6 py-20">
            <h1 className="text-4xl font-bold text-white mb-8">{t.gallery.title}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {gallery.map((item) => (
                <Card key={item.id} className="overflow-hidden bg-white/5 border-white/10 hover:scale-105 transition-transform">
                  <img src={item.url} alt={item.theme} className="w-full h-80 object-cover" />
                  <div className="p-4 flex items-center justify-between">
                    <p className="text-white font-medium">{item.theme}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                        <Icon name="Download" size={16} />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-white hover:bg-white/10">
                        <Icon name="Share2" size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'examples' && (
          <div className="container mx-auto px-6 py-20">
            <h1 className="text-4xl font-bold text-white mb-8">{t.examples.title}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {themes.map((theme) => (
                <Card key={theme.id} className="overflow-hidden bg-white/5 border-white/10">
                  <img 
                    src="https://v3b.fal.media/files/b/tiger/HBqy7ktdkNZQbMq0c1DPY_output.png" 
                    alt={theme.name} 
                    className="w-full h-80 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name={theme.icon as any} size={20} className="text-primary" />
                      <h3 className="text-xl font-semibold text-white">{theme.name}</h3>
                    </div>
                    <p className="text-gray-400">{t.examples.description}</p>
                  </div>
                </Card>
              ))}
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
            <p className="text-xl text-gray-300 text-center mb-16 max-w-2xl mx-auto">Выберите подходящий тариф для ваших задач</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                { price: '500', popular: false },
                { price: '1000', popular: true },
                { price: '1500', popular: false }
              ].map((plan, idx) => (
                <Card key={idx} className={`p-10 relative transition-all duration-300 hover:scale-105 ${
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
                  <h3 className="text-3xl font-bold text-white mb-4">{t.pricing.plans[idx].name}</h3>
                  <div className="mb-6">
                    <span className="text-6xl font-black gradient-text">{plan.price} ₽</span>
                    <span className="text-xl text-gray-400 ml-2">{t.pricing.perMonth}</span>
                  </div>
                  <p className="text-gray-300 mb-8 text-lg">{t.pricing.plans[idx].credits}</p>
                  <Button className={`w-full py-6 text-lg font-semibold rounded-xl transition-all ${
                    plan.popular 
                      ? 'gradient-bg hover:opacity-90 text-white shadow-xl' 
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  }`}>
                    {t.pricing.getStarted}
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'prompts' && (
          <div className="container mx-auto px-6 py-20">
            <h1 className="text-6xl font-black text-center mb-6 gradient-text">{t.prompts.title}</h1>
            <p className="text-xl text-gray-300 text-center mb-16 max-w-2xl mx-auto">{t.prompts.subtitle}</p>
            
            <div className="max-w-5xl mx-auto space-y-8">
              {t.prompts.categories.map((category, idx) => (
                <Card key={idx} className="glass-effect p-10 hover:border-primary/30 transition-all duration-300">
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
              
              <Card className="gradient-bg p-8 border-0 shadow-2xl">
                <div className="flex items-start gap-4">
                  <Icon name="Lightbulb" size={28} className="text-white flex-shrink-0 animate-pulse" />
                  <p className="text-white font-semibold text-lg leading-relaxed">{t.prompts.tip}</p>
                </div>
              </Card>
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
              <h1 className="text-4xl font-bold text-white mb-8">{t.profile.title}</h1>
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-8">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                    <Icon name="User" size={48} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">John Doe</h2>
                    <p className="text-gray-400">john@example.com</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <Card className="bg-white/5 border-white/10 p-4 text-center">
                    <p className="text-3xl font-bold text-primary">127</p>
                    <p className="text-gray-400 text-sm">{t.profile.generated}</p>
                  </Card>
                  <Card className="bg-white/5 border-white/10 p-4 text-center">
                    <p className="text-3xl font-bold text-primary">50</p>
                    <p className="text-gray-400 text-sm">{t.profile.creditsLeft}</p>
                  </Card>
                  <Card className="bg-white/5 border-white/10 p-4 text-center">
                    <p className="text-3xl font-bold text-primary">{t.pricing.plans[1].name}</p>
                    <p className="text-gray-400 text-sm">{t.profile.plan}</p>
                  </Card>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                  {t.profile.editBtn}
                </Button>
              </Card>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-black/80 backdrop-blur-md border-t border-white/10 mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-gray-400">
            <p>{t.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;