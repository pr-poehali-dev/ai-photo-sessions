import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { shareImage, copyImageToClipboard, canUseNativeShare, canCopyToClipboard } from '@/utils/share';

interface ShareDialogProps {
  imageUrl: string;
  prompt?: string;
  trigger?: React.ReactNode;
}

export default function ShareDialog({ imageUrl, prompt, trigger }: ShareDialogProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [supportsNativeShare, setSupportsNativeShare] = useState(false);
  const [supportsClipboard, setSupportsClipboard] = useState(false);

  useEffect(() => {
    setSupportsNativeShare(canUseNativeShare());
    setSupportsClipboard(canCopyToClipboard());
  }, []);

  const shareText = prompt 
    ? `Создано в PhotoSet AI: ${prompt}`
    : 'Создано в PhotoSet AI - генератор AI изображений';

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const platforms = [
    {
      name: 'Twitter',
      icon: 'Twitter',
      color: 'bg-[#1DA1F2] hover:bg-[#1a8cd8]',
      action: () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank', 'width=550,height=420');
      }
    },
    {
      name: 'Facebook',
      icon: 'Facebook',
      color: 'bg-[#4267B2] hover:bg-[#365899]',
      action: () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank', 'width=550,height=420');
      }
    },
    {
      name: 'VK',
      icon: 'Users',
      color: 'bg-[#0077FF] hover:bg-[#0066DD]',
      action: () => {
        const url = `https://vk.com/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}&image=${encodeURIComponent(imageUrl)}`;
        window.open(url, '_blank', 'width=550,height=420');
      }
    },
    {
      name: 'Telegram',
      icon: 'Send',
      color: 'bg-[#0088cc] hover:bg-[#0077bb]',
      action: () => {
        const url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank', 'width=550,height=420');
      }
    },
    {
      name: 'WhatsApp',
      icon: 'MessageCircle',
      color: 'bg-[#25D366] hover:bg-[#1ebd57]',
      action: () => {
        const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        window.open(url, '_blank', 'width=550,height=420');
      }
    },
    {
      name: 'Pinterest',
      icon: 'Pin',
      color: 'bg-[#E60023] hover:bg-[#cc0020]',
      action: () => {
        const url = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank', 'width=750,height=600');
      }
    },
    {
      name: 'LinkedIn',
      icon: 'Linkedin',
      color: 'bg-[#0077b5] hover:bg-[#006399]',
      action: () => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank', 'width=550,height=420');
      }
    },
    {
      name: 'Reddit',
      icon: 'MessageSquare',
      color: 'bg-[#FF4500] hover:bg-[#e63e00]',
      action: () => {
        const url = `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank', 'width=850,height=600');
      }
    }
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(imageUrl);
      setCopied(true);
      toast({
        title: 'Скопировано!',
        description: 'Ссылка на изображение скопирована в буфер обмена',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось скопировать ссылку',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadImage = async () => {
    try {
      const response = await fetch(imageUrl);
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
        title: 'Успешно!',
        description: 'Изображение загружено',
      });
    } catch (err) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить изображение',
        variant: 'destructive',
      });
    }
  };

  const handleNativeShare = async () => {
    const success = await shareImage(imageUrl, shareText);
    if (success) {
      toast({
        title: 'Успешно!',
        description: 'Изображение отправлено',
      });
    } else {
      toast({
        title: 'Ошибка',
        description: 'Не удалось поделиться',
        variant: 'destructive',
      });
    }
  };

  const handleCopyImage = async () => {
    const success = await copyImageToClipboard(imageUrl);
    if (success) {
      toast({
        title: 'Скопировано!',
        description: 'Изображение скопировано в буфер обмена',
      });
    } else {
      handleCopyLink();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Icon name="Share2" size={18} className="mr-2" />
            Поделиться
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-900/95 backdrop-blur-xl border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold gradient-text">Поделиться изображением</DialogTitle>
          <DialogDescription className="text-gray-400">
            Выберите платформу для публикации или скопируйте ссылку
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card className="overflow-hidden bg-white/5 border-white/10">
            <img src={imageUrl} alt="Preview" className="w-full h-48 object-cover" />
          </Card>

          <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-3">Социальные сети</h4>
            <div className="grid grid-cols-4 gap-3">
              {platforms.map((platform) => (
                <button
                  key={platform.name}
                  onClick={platform.action}
                  className={`${platform.color} rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95`}
                  title={`Поделиться в ${platform.name}`}
                >
                  <Icon name={platform.icon as any} size={24} className="text-white" />
                  <span className="text-xs text-white font-medium">{platform.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-400">Действия</h4>
            {supportsNativeShare && (
              <Button
                onClick={handleNativeShare}
                className="w-full gradient-bg hover:opacity-90 text-white"
              >
                <Icon name="Share2" size={18} className="mr-2" />
                Поделиться
              </Button>
            )}
            <div className="flex gap-2">
              {supportsClipboard && (
                <Button
                  onClick={handleCopyImage}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  <Icon name="Copy" size={18} className="mr-2" />
                  Копировать
                </Button>
              )}
              <Button
                onClick={handleCopyLink}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20"
              >
                <Icon name={copied ? "Check" : "Link"} size={18} className="mr-2" />
                {copied ? 'Ссылка' : 'Ссылка'}
              </Button>
              <Button
                onClick={handleDownloadImage}
                className="flex-1 gradient-bg hover:opacity-90 text-white"
              >
                <Icon name="Download" size={18} className="mr-2" />
                Скачать
              </Button>
            </div>
          </div>

          <Card className="bg-primary/10 border-primary/20 p-4">
            <div className="flex items-start gap-3">
              <Icon name="Sparkles" size={20} className="text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-300">
                <p className="font-semibold text-white mb-1">Поддержите нас!</p>
                <p>При публикации упомяните PhotoSet AI - это поможет другим узнать о нашем сервисе 💙</p>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}