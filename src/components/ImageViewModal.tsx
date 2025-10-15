import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useState } from 'react';
import ShareDialog from './ShareDialog';

interface ImageViewModalProps {
  imageUrl: string;
  prompt?: string;
  theme?: string;
  createdAt?: string;
  onClose: () => void;
  onRegenerate?: (prompt: string) => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
}

const ImageViewModal = ({
  imageUrl,
  prompt,
  theme,
  createdAt,
  onClose,
  onRegenerate,
  onFavorite,
  isFavorite = false
}: ImageViewModalProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `photoset-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-fade-in"
      onClick={onClose}
    >
      <div className="max-w-6xl w-full h-full flex items-center justify-center">
        <Card
          className="glass-effect border-white/20 overflow-hidden max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Icon name="Image" size={24} className="text-primary" />
              <div>
                <h3 className="text-white font-semibold">
                  {theme || 'Сгенерированное изображение'}
                </h3>
                {createdAt && (
                  <p className="text-gray-400 text-sm">
                    {new Date(createdAt).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <div className="flex items-center justify-center mb-6">
              <img
                src={imageUrl}
                alt="Full size"
                className="max-w-full max-h-[60vh] rounded-xl shadow-2xl object-contain"
              />
            </div>

            {prompt && (
              <Card className="bg-black/30 border-white/10 p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Icon name="FileText" size={20} className="text-primary flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <p className="text-gray-400 text-xs mb-1">Промпт:</p>
                    <p className="text-white">{prompt}</p>
                  </div>
                </div>
              </Card>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="gradient-bg hover:opacity-90 text-white"
              >
                <Icon
                  name={isDownloading ? 'Loader2' : 'Download'}
                  size={18}
                  className={`mr-2 ${isDownloading ? 'animate-spin' : ''}`}
                />
                Скачать
              </Button>

              {onFavorite && (
                <Button
                  onClick={onFavorite}
                  className={`${
                    isFavorite
                      ? 'bg-red-500/20 text-red-400 border-red-500/50'
                      : 'bg-white/10 text-white'
                  } hover:bg-white/20 border border-white/20`}
                >
                  <Icon name={isFavorite ? 'Heart' : 'HeartOff'} size={18} className="mr-2" />
                  {isFavorite ? 'В избранном' : 'В избранное'}
                </Button>
              )}

              <ShareDialog
                imageUrl={imageUrl}
                prompt={prompt || ''}
                trigger={
                  <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
                    <Icon name="Share2" size={18} className="mr-2" />
                    Поделиться
                  </Button>
                }
              />

              {onRegenerate && prompt && (
                <Button
                  onClick={() => onRegenerate(prompt)}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  <Icon name="RefreshCw" size={18} className="mr-2" />
                  Повторить
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ImageViewModal;
