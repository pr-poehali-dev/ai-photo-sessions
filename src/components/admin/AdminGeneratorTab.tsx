import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface AdminGeneratorTabProps {
  currentUser: any;
}

const AdminGeneratorTab = ({ currentUser }: AdminGeneratorTabProps) => {
  return (
    <div>
      <Card className="glass-effect p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-black gradient-text mb-2">✨ AI Генератор изображений</h2>
            <p className="text-gray-400">Создавайте уникальные изображения с помощью нейросетей</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Ваши кредиты</div>
            <div className="text-3xl font-black text-white">{currentUser?.credits?.toLocaleString() || 0}</div>
          </div>
        </div>

        <div className="bg-black/30 rounded-xl p-6 mb-6">
          <label className="block text-white font-semibold mb-3">Опишите, что хотите увидеть</label>
          <textarea
            placeholder="Например: Футуристический город на закате, неоновые огни, киберпанк стиль..."
            className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[120px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-white font-medium mb-2">Модель</label>
            <select className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white">
              <option>DALL-E 3</option>
              <option>Midjourney</option>
              <option>Stable Diffusion</option>
            </select>
          </div>
          <div>
            <label className="block text-white font-medium mb-2">Стиль</label>
            <select className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white">
              <option>Реалистичный</option>
              <option>Аниме</option>
              <option>Арт</option>
              <option>Киберпанк</option>
            </select>
          </div>
          <div>
            <label className="block text-white font-medium mb-2">Размер</label>
            <select className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-white">
              <option>1024x1024</option>
              <option>1792x1024</option>
              <option>1024x1792</option>
            </select>
          </div>
        </div>

        <Button className="w-full gradient-bg hover:opacity-90 text-white py-6 text-lg font-semibold">
          <Icon name="Sparkles" size={24} className="mr-2" />
          Создать изображение (стоит 1 кредит)
        </Button>
      </Card>

      <div className="text-center text-gray-400 text-sm">
        💡 Совет: чем подробнее описание, тем лучше результат
      </div>
    </div>
  );
};

export default AdminGeneratorTab;
