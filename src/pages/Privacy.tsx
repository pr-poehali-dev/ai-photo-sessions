import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const Privacy = () => {
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
          <h1 className="text-5xl font-black gradient-text mb-6">Политика конфиденциальности</h1>
          <p className="text-gray-400 mb-12">Последнее обновление: {new Date().toLocaleDateString('ru-RU')}</p>

          <Card className="glass-effect p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Введение</h2>
              <p className="text-gray-300 leading-relaxed">
                Мы серьезно относимся к защите ваших персональных данных. Эта политика конфиденциальности 
                объясняет, какую информацию мы собираем, как мы ее используем и защищаем.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Собираемая информация</h2>
              <div className="space-y-4 text-gray-300">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">2.1 Информация при регистрации:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Email адрес</li>
                    <li>Имя пользователя</li>
                    <li>Полное имя (опционально)</li>
                    <li>Пароль (хранится в зашифрованном виде)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">2.2 Информация об использовании:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>IP адрес</li>
                    <li>Браузер и устройство</li>
                    <li>Дата и время доступа</li>
                    <li>Сгенерированные изображения и промпты</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">2.3 Платежная информация:</h3>
                  <p className="ml-4">
                    Обрабатывается через сторонние платежные системы. Мы не храним данные банковских карт.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Использование информации</h2>
              <div className="space-y-3 text-gray-300">
                <p className="leading-relaxed">
                  <strong className="text-white">3.1 Предоставление сервиса:</strong> Для работы основных 
                  функций платформы, генерации и хранения изображений.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">3.2 Улучшение качества:</strong> Анализ использования для 
                  улучшения алгоритмов генерации и пользовательского опыта.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">3.3 Коммуникация:</strong> Отправка уведомлений о работе 
                  сервиса, обновлениях и важной информации.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">3.4 Безопасность:</strong> Защита от мошенничества и 
                  несанкционированного доступа.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Защита данных</h2>
              <div className="space-y-3 text-gray-300">
                <p className="leading-relaxed">
                  <strong className="text-white">4.1 Шифрование:</strong> Все данные передаются по защищенному 
                  HTTPS протоколу. Пароли хранятся с использованием bcrypt хеширования.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">4.2 Доступ:</strong> Доступ к базе данных имеют только 
                  авторизованные системные процессы. Персонал не имеет доступа к паролям пользователей.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">4.3 Хранение:</strong> Данные хранятся на защищенных серверах 
                  с регулярным резервным копированием.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">4.4 Мониторинг:</strong> Ведется журнал безопасности для 
                  отслеживания подозрительной активности.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Сгенерированные изображения</h2>
              <div className="space-y-3 text-gray-300">
                <p className="leading-relaxed">
                  <strong className="text-white">5.1 Права на изображения:</strong> Все сгенерированные 
                  изображения принадлежат пользователю. Мы не используем их без вашего разрешения.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">5.2 Хранение:</strong> Изображения хранятся в зашифрованном 
                  виде и доступны только владельцу аккаунта.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">5.3 Удаление:</strong> Вы можете удалить свои изображения 
                  в любое время через интерфейс галереи.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Cookies и трекинг</h2>
              <p className="text-gray-300 leading-relaxed">
                Мы используем cookies для сохранения сессии пользователя и улучшения работы сайта. 
                Вы можете отключить cookies в настройках браузера, но это может ограничить функциональность сервиса.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Передача данных третьим лицам</h2>
              <div className="space-y-3 text-gray-300">
                <p className="leading-relaxed">
                  Мы не продаем и не передаем ваши личные данные третьим лицам, за исключением:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>OpenAI (для генерации изображений - передаются только текстовые промпты)</li>
                  <li>Платежных систем (для обработки платежей)</li>
                  <li>По требованию закона или судебного решения</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Ваши права</h2>
              <div className="space-y-2 text-gray-300">
                <p>Вы имеете право:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Получить копию своих персональных данных</li>
                  <li>Исправить неточные данные</li>
                  <li>Удалить свой аккаунт и все связанные данные</li>
                  <li>Ограничить обработку данных</li>
                  <li>Возражать против обработки данных</li>
                  <li>Перенести данные к другому провайдеру</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Сохранение данных</h2>
              <p className="text-gray-300 leading-relaxed">
                Мы храним ваши данные до тех пор, пока ваш аккаунт активен. После удаления аккаунта данные 
                удаляются в течение 30 дней, за исключением данных, которые мы обязаны хранить по закону.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Изменения в политике</h2>
              <p className="text-gray-300 leading-relaxed">
                Мы можем обновлять эту политику конфиденциальности. О существенных изменениях мы уведомим 
                вас по email за 30 дней до вступления изменений в силу.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Контакты</h2>
              <p className="text-gray-300 leading-relaxed">
                По вопросам конфиденциальности обращайтесь через раздел "Поддержка" на сайте или по email 
                указанному при регистрации.
              </p>
            </section>
          </Card>

          <div className="mt-8 flex gap-4">
            <Button
              onClick={() => navigate('/terms')}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              Условия использования
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

export default Privacy;
