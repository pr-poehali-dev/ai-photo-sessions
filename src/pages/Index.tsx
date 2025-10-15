import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { translations, Language } from '@/i18n/translations';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [language, setLanguage] = useState<Language>('ru');
  
  const t = translations[language];

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

  const handleGenerate = () => {
    console.log('Generating with theme:', selectedTheme);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-primary/20">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => setActiveTab('home')}>
              <img 
                src="https://cdn.poehali.dev/projects/2b4ea3db-a438-4e53-a09d-44a613d412ef/files/fe48bd8a-64d0-48f7-9f23-7b5d9060388a.jpg" 
                alt="PhotoSet" 
                className="h-10 w-10 object-contain"
              />
              <span className="text-sm font-bold bg-gradient-to-r from-white to-primary bg-clip-text text-transparent whitespace-nowrap">
                PhotoSet
              </span>
            </div>
            <div className="flex items-center gap-6">
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
            <div className="max-w-4xl mx-auto text-center mb-20">
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent animate-fade-in">
                {t.hero.title}
              </h1>
              <p className="text-xl text-gray-400 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                {t.hero.subtitle}
              </p>
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg animate-scale-in"
                style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
                onClick={() => setActiveTab('generator')}
              >
                {t.hero.cta}
                <Icon name="ArrowRight" size={20} className="ml-2" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 hover:bg-white/10 transition-all animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <Icon name="Sparkles" size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{t.features.faceSwap.title}</h3>
                <p className="text-gray-400">{t.features.faceSwap.description}</p>
              </Card>
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 hover:bg-white/10 transition-all animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <Icon name="Palette" size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{t.features.themes.title}</h3>
                <p className="text-gray-400">{t.features.themes.description}</p>
              </Card>
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 hover:bg-white/10 transition-all animate-fade-in-up" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <Icon name="Zap" size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{t.features.fast.title}</h3>
                <p className="text-gray-400">{t.features.fast.description}</p>
              </Card>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white text-center mb-8 animate-fade-in" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>{t.sections.recentExamples}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {examples.map((example, idx) => (
                  <Card key={idx} className="overflow-hidden bg-white/5 border-white/10 hover:scale-105 transition-transform animate-scale-in" style={{ animationDelay: `${0.9 + idx * 0.1}s`, animationFillMode: 'both' }}>
                    <img src={example.url} alt={example.theme} className="w-full h-64 object-cover" />
                    <div className="p-4">
                      <p className="text-white font-medium">{example.theme}</p>
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
            <h1 className="text-4xl font-bold text-white text-center mb-12">{t.pricing.title}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { price: '500' },
                { price: '1000' },
                { price: '1500' }
              ].map((plan, idx) => (
                <Card key={idx} className={`p-8 ${idx === 1 ? 'bg-primary border-primary scale-105' : 'bg-white/5 border-white/10'}`}>
                  <h3 className="text-2xl font-bold text-white mb-2">{t.pricing.plans[idx].name}</h3>
                  <div className="text-4xl font-bold text-white mb-4">
                    {plan.price} ₽<span className="text-lg text-gray-400">{t.pricing.perMonth}</span>
                  </div>
                  <p className="text-gray-300 mb-6">{t.pricing.plans[idx].credits}</p>
                  <Button className={`w-full ${idx === 1 ? 'bg-white text-primary hover:bg-white/90' : 'bg-primary hover:bg-primary/90 text-white'}`}>
                    {t.pricing.getStarted}
                  </Button>
                </Card>
              ))}
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