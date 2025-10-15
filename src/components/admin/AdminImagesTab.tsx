import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { GeneratedImage } from './types';

interface AdminImagesTabProps {
  loading: boolean;
  images: GeneratedImage[];
  onRefresh: () => void;
  onImageClick: (image: GeneratedImage) => void;
}

const AdminImagesTab = ({ loading, images, onRefresh, onImageClick }: AdminImagesTabProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Все изображения платформы</h2>
        <Button
          onClick={onRefresh}
          disabled={loading}
          className="bg-white/10 hover:bg-white/20 text-white"
        >
          <Icon name="RefreshCw" size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
          Обновить
        </Button>
      </div>

      {loading && images.length === 0 ? (
        <div className="text-center py-20">
          <Icon name="Loader2" size={48} className="text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Загрузка изображений...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image) => (
            <Card
              key={image.id}
              className="glass-effect overflow-hidden hover:border-primary/30 transition-all cursor-pointer group"
              onClick={() => onImageClick(image)}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={image.image_url} 
                  alt={image.prompt} 
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold gradient-bg text-white">
                    {image.model}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-white font-semibold mb-2 line-clamp-2 text-sm">{image.prompt}</p>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Icon name="User" size={14} />
                  <span className="truncate">{image.user?.username || 'Anonymous'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Icon name="Calendar" size={14} />
                  <span>{new Date(image.created_at).toLocaleDateString('ru-RU')}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminImagesTab;
