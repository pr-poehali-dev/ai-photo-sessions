import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-primary/20">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
            <img 
              src="https://cdn.poehali.dev/projects/2b4ea3db-a438-4e53-a09d-44a613d412ef/files/fe48bd8a-64d0-48f7-9f23-7b5d9060388a.jpg" 
              alt="PhotoSet" 
              className="h-10 w-10 object-contain"
            />
            <span className="text-xl font-bold gradient-text">PhotoSet</span>
          </div>
          <Button variant="ghost" className="text-white" onClick={() => navigate(-1)}>
            <Icon name="X" size={20} />
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-28 pb-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-black gradient-text mb-6">Условия использования</h1>
          <p className="text-gray-400 mb-12">Последнее обновление: {new Date().toLocaleDateString('ru-RU')}</p>

          <Card className="glass-effect p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Принятие условий</h2>
              <p className="text-gray-300 leading-relaxed">
                Используя сервис PhotoSet, вы соглашаетесь с настоящими условиями использования. 
                Если вы не согласны с какими-либо условиями, пожалуйста, не используйте наш сервис.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Описание сервиса</h2>
              <p className="text-gray-300 leading-relaxed mb-3">
                PhotoSet - это платформа для генерации профессиональных изображений с использованием 
                искусственного интеллекта. Сервис предоставляет:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Генерацию изображений на основе текстовых описаний</li>
                <li>Различные стили и темы для фотосессий</li>
                <li>Хранение сгенерированных изображений</li>
                <li>Персональную галерею пользователя</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Использование сгенерированных изображений</h2>
              <div className="space-y-3 text-gray-300">
                <p className="leading-relaxed">
                  <strong className="text-white">3.1 Права на изображения:</strong> Все изображения, 
                  сгенерированные через наш сервис, принадлежат пользователю, создавшему их.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">3.2 Коммерческое использование:</strong> Вы можете 
                  использовать сгенерированные изображения в коммерческих целях в рамках вашего тарифного плана.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">3.3 Запрещенное использование:</strong> Запрещается 
                  использовать сервис для создания контента, нарушающего законодательство, содержащего 
                  насилие, дискриминацию или нарушающего права третьих лиц.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Защита данных и конфиденциальность</h2>
              <div className="space-y-3 text-gray-300">
                <p className="leading-relaxed">
                  <strong className="text-white">4.1 Шифрование:</strong> Все личные данные и изображения 
                  пользователей хранятся в зашифрованном виде на защищенных серверах.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">4.2 Доступ к данным:</strong> Доступ к вашим данным имеете 
                  только вы. Мы не передаем личную информацию третьим лицам без вашего согласия.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">4.3 Хранение:</strong> Сгенерированные изображения хранятся 
                  в вашем аккаунте неограниченное время (в зависимости от тарифа).
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Учетные записи пользователей</h2>
              <div className="space-y-3 text-gray-300">
                <p className="leading-relaxed">
                  <strong className="text-white">5.1 Регистрация:</strong> Для использования сервиса необходима 
                  регистрация с указанием действующего email адреса.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">5.2 Безопасность:</strong> Вы несете ответственность за 
                  сохранность пароля от вашего аккаунта. При компрометации доступа немедленно измените пароль.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">5.3 Восстановление:</strong> При утере доступа вы можете 
                  восстановить пароль через email.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Тарифы и оплата</h2>
              <p className="text-gray-300 leading-relaxed">
                Сервис предоставляется на основе подписки. Стоимость и условия тарифов указаны на странице 
                "Тарифы". Оплата производится ежемесячно. Возврат средств возможен в течение 14 дней с момента 
                первой оплаты.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Ограничение ответственности</h2>
              <p className="text-gray-300 leading-relaxed">
                Сервис предоставляется "как есть". Мы не несем ответственности за качество сгенерированных 
                изображений и их соответствие вашим ожиданиям. Мы не гарантируем бесперебойную работу сервиса 
                и не несем ответственности за возможные простои.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Изменение условий</h2>
              <p className="text-gray-300 leading-relaxed">
                Мы оставляем за собой право изменять настоящие условия использования. О существенных изменениях 
                пользователи будут уведомлены по email за 30 дней до вступления изменений в силу.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Контактная информация</h2>
              <p className="text-gray-300 leading-relaxed">
                По всем вопросам, связанным с условиями использования, вы можете обратиться в нашу службу 
                поддержки через раздел "Поддержка" на сайте.
              </p>
            </section>
          </Card>

          <div className="mt-8 flex gap-4">
            <Button
              onClick={() => navigate('/privacy')}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              Политика конфиденциальности
            </Button>
            <Button
              onClick={() => navigate(-1)}
              className="flex-1 gradient-bg hover:opacity-90 text-white"
            >
              Вернуться назад
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Terms;
