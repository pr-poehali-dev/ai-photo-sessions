import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>('');

  const themes = [
    { id: 'professional', name: 'Professional', icon: 'Briefcase' },
    { id: 'fashion', name: 'Fashion', icon: 'Sparkles' },
    { id: 'casual', name: 'Casual', icon: 'Coffee' },
    { id: 'outdoor', name: 'Outdoor', icon: 'Mountain' },
    { id: 'vintage', name: 'Vintage', icon: 'Camera' },
    { id: 'studio', name: 'Studio', icon: 'Aperture' }
  ];

  const examples = [
    { url: 'https://v3b.fal.media/files/b/tiger/HBqy7ktdkNZQbMq0c1DPY_output.png', theme: 'Professional' },
    { url: 'https://v3b.fal.media/files/b/tiger/HBqy7ktdkNZQbMq0c1DPY_output.png', theme: 'Fashion' },
    { url: 'https://v3b.fal.media/files/b/tiger/HBqy7ktdkNZQbMq0c1DPY_output.png', theme: 'Casual' },
    { url: 'https://v3b.fal.media/files/b/tiger/HBqy7ktdkNZQbMq0c1DPY_output.png', theme: 'Studio' }
  ];

  const gallery = [
    { id: 1, url: 'https://v3b.fal.media/files/b/tiger/HBqy7ktdkNZQbMq0c1DPY_output.png', theme: 'Professional' },
    { id: 2, url: 'https://v3b.fal.media/files/b/tiger/HBqy7ktdkNZQbMq0c1DPY_output.png', theme: 'Fashion' },
    { id: 3, url: 'https://v3b.fal.media/files/b/tiger/HBqy7ktdkNZQbMq0c1DPY_output.png', theme: 'Casual' }
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
            <div className="text-2xl font-bold bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
              AI PHOTO STUDIO
            </div>
            <div className="flex items-center gap-6">
              <Button 
                variant="ghost" 
                className="text-white hover:text-primary hover:bg-white/5"
                onClick={() => setActiveTab('home')}
              >
                Home
              </Button>
              <Button 
                variant="ghost" 
                className="text-white hover:text-primary hover:bg-white/5"
                onClick={() => setActiveTab('generator')}
              >
                Generator
              </Button>
              <Button 
                variant="ghost" 
                className="text-white hover:text-primary hover:bg-white/5"
                onClick={() => setActiveTab('gallery')}
              >
                Gallery
              </Button>
              <Button 
                variant="ghost" 
                className="text-white hover:text-primary hover:bg-white/5"
                onClick={() => setActiveTab('examples')}
              >
                Examples
              </Button>
              <Button 
                variant="ghost" 
                className="text-white hover:text-primary hover:bg-white/5"
                onClick={() => setActiveTab('faq')}
              >
                FAQ
              </Button>
              <Button 
                variant="ghost" 
                className="text-white hover:text-primary hover:bg-white/5"
                onClick={() => setActiveTab('pricing')}
              >
                Pricing
              </Button>
              <Button 
                variant="ghost" 
                className="text-white hover:text-primary hover:bg-white/5"
                onClick={() => setActiveTab('support')}
              >
                Support
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
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent">
                Create Perfect Photoshoots with AI
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                Professional portraits and themed photoshoots with seamless face swap technology
              </p>
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg"
                onClick={() => setActiveTab('generator')}
              >
                Start Creating
                <Icon name="ArrowRight" size={20} className="ml-2" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 hover:bg-white/10 transition-all">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <Icon name="Sparkles" size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">AI Face Swap</h3>
                <p className="text-gray-400">Seamless face replacement without imperfections</p>
              </Card>
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 hover:bg-white/10 transition-all">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <Icon name="Palette" size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Multiple Themes</h3>
                <p className="text-gray-400">Professional, fashion, casual, outdoor and more</p>
              </Card>
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-6 hover:bg-white/10 transition-all">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <Icon name="Zap" size={24} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Fast Generation</h3>
                <p className="text-gray-400">Get your photos in seconds, not hours</p>
              </Card>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-bold text-white text-center mb-8">Recent Examples</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {examples.map((example, idx) => (
                  <Card key={idx} className="overflow-hidden bg-white/5 border-white/10 hover:scale-105 transition-transform">
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
              <h1 className="text-4xl font-bold text-white mb-8">Photo Generator</h1>
              
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-8 mb-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Upload Your Photo</h3>
                  <div className="border-2 border-dashed border-primary/50 rounded-lg p-12 text-center hover:border-primary transition-colors">
                    {selectedImage ? (
                      <div className="flex flex-col items-center">
                        <img src={selectedImage} alt="Selected" className="w-48 h-48 object-cover rounded-lg mb-4" />
                        <Button 
                          variant="outline" 
                          onClick={() => setSelectedImage(null)}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          Change Photo
                        </Button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <Icon name="Upload" size={48} className="mx-auto mb-4 text-primary" />
                        <p className="text-white mb-2">Click to upload or drag and drop</p>
                        <p className="text-gray-400 text-sm">PNG, JPG up to 10MB</p>
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
                  <h3 className="text-xl font-semibold text-white mb-4">Choose Theme</h3>
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
                  Generate Photo
                </Button>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="container mx-auto px-6 py-20">
            <h1 className="text-4xl font-bold text-white mb-8">My Gallery</h1>
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
            <h1 className="text-4xl font-bold text-white mb-8">Examples</h1>
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
                    <p className="text-gray-400">Professional AI-generated photoshoot</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold text-white mb-8">FAQ</h1>
              <div className="space-y-4">
                {[
                  { q: 'How does AI face swap work?', a: 'Our AI analyzes facial features and seamlessly blends your face into themed photoshoots.' },
                  { q: 'What photo quality do I need?', a: 'We recommend clear, well-lit photos in JPG or PNG format up to 10MB.' },
                  { q: 'How long does generation take?', a: 'Most photos are ready in 10-30 seconds depending on complexity.' },
                  { q: 'Can I download my photos?', a: 'Yes, all generated photos can be downloaded in high resolution.' }
                ].map((faq, idx) => (
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
            <h1 className="text-4xl font-bold text-white text-center mb-12">Pricing</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { name: 'Starter', price: '9', credits: '50' },
                { name: 'Pro', price: '29', credits: '200' },
                { name: 'Enterprise', price: '99', credits: '1000' }
              ].map((plan, idx) => (
                <Card key={idx} className={`p-8 ${idx === 1 ? 'bg-primary border-primary scale-105' : 'bg-white/5 border-white/10'}`}>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-white mb-4">
                    ${plan.price}<span className="text-lg text-gray-400">/mo</span>
                  </div>
                  <p className="text-gray-300 mb-6">{plan.credits} generation credits</p>
                  <Button className={`w-full ${idx === 1 ? 'bg-white text-primary hover:bg-white/90' : 'bg-primary hover:bg-primary/90 text-white'}`}>
                    Get Started
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-4xl font-bold text-white mb-8">Support</h1>
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Email</label>
                    <input 
                      type="email" 
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Message</label>
                    <textarea 
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:outline-none h-32"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white py-3">
                    Send Message
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-4xl font-bold text-white mb-8">Profile</h1>
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
                    <p className="text-gray-400 text-sm">Generated</p>
                  </Card>
                  <Card className="bg-white/5 border-white/10 p-4 text-center">
                    <p className="text-3xl font-bold text-primary">50</p>
                    <p className="text-gray-400 text-sm">Credits Left</p>
                  </Card>
                  <Card className="bg-white/5 border-white/10 p-4 text-center">
                    <p className="text-3xl font-bold text-primary">Pro</p>
                    <p className="text-gray-400 text-sm">Plan</p>
                  </Card>
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                  Edit Profile
                </Button>
              </Card>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-black/80 backdrop-blur-md border-t border-white/10 mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2025 AI Photo Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
