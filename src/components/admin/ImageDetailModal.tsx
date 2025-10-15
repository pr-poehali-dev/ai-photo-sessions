import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { GeneratedImage } from './types';

interface ImageDetailModalProps {
  image: GeneratedImage | null;
  onClose: () => void;
}

const ImageDetailModal = ({ image, onClose }: ImageDetailModalProps) => {
  if (!image) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <Card
        className="glass-effect max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Детали изображения</h2>
            <Button
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 text-white"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          <img
            src={image.image_url}
            alt={image.prompt}
            className="w-full rounded-xl mb-6"
          />

          <div className="space-y-4">
            <div>
              <h3 className="text-white font-semibold mb-2">Промт:</h3>
              <p className="text-gray-300 bg-black/30 p-4 rounded-lg">{image.prompt}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-white font-semibold mb-2">Модель:</h3>
                <p className="text-gray-300">{image.model}</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Тема:</h3>
                <p className="text-gray-300">{image.theme || 'Не указана'}</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Пользователь:</h3>
                <p className="text-gray-300">{image.user?.email || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Дата создания:</h3>
                <p className="text-gray-300">
                  {new Date(image.created_at).toLocaleString('ru-RU')}
                </p>
              </div>
            </div>

            <Button
              onClick={() => window.open(image.image_url, '_blank')}
              className="w-full gradient-bg hover:opacity-90 text-white"
            >
              <Icon name="Download" size={18} className="mr-2" />
              Скачать изображение
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ImageDetailModal;
