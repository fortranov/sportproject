import Link from 'next/link';
import { SportIcon } from '@/components/SportIcon';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero секция */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            🏊‍♂️🚴‍♂️🏃‍♂️ Triathlon Training
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Персонализированные планы тренировок на основе методологии Джо Фрила &ldquo;Библия триатлета&rdquo;
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create-plan">
              <Button size="lg" className="w-full sm:w-auto">
                Создать план тренировок
              </Button>
            </Link>
            <Link href="/search-plan">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Найти существующий план
              </Button>
            </Link>
          </div>
        </div>

        {/* Особенности */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <SportIcon sport="swimming" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Плавание</h3>
            <p className="text-gray-600">20-40% от общего времени тренировок</p>
          </div>
          <div className="text-center p-6">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <SportIcon sport="cycling" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Велосипед</h3>
            <p className="text-gray-600">30-50% от общего времени тренировок</p>
          </div>
          <div className="text-center p-6">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <SportIcon sport="running" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Бег</h3>
            <p className="text-gray-600">25-35% от общего времени тренировок</p>
          </div>
        </div>

        {/* Уровни подготовки */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Уровни подготовки</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6 border-green-200">
              <CardContent className="p-0">
                <div className="text-4xl mb-4">🔰</div>
                <h3 className="text-xl font-semibold text-green-600 mb-2">Начинающий</h3>
                <p className="text-gray-600 mb-2">0-300 баллов</p>
                <p className="text-sm text-gray-500">4-10 часов в неделю</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 border-yellow-200">
              <CardContent className="p-0">
                <div className="text-4xl mb-4">🏃‍♂️</div>
                <h3 className="text-xl font-semibold text-yellow-600 mb-2">Средний</h3>
                <p className="text-gray-600 mb-2">301-700 баллов</p>
                <p className="text-sm text-gray-500">8-16 часов в неделю</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 border-red-200">
              <CardContent className="p-0">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold text-red-600 mb-2">Продвинутый</h3>
                <p className="text-gray-600 mb-2">701-1000 баллов</p>
                <p className="text-sm text-gray-500">15-25 часов в неделю</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Методология */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Методология Джо Фрила</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">📊 Периодизация</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Базовый период - развитие аэробной выносливости</li>
                  <li>• Специальный период - работа на пороге</li>
                  <li>• Пиковый период - развитие мощности</li>
                  <li>• Восстановительный период - тейперинг</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">⚡ Зоны тренировки</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Зона 1-2: Аэробная база (60-75%)</li>
                  <li>• Зона 3: Темповая работа (80-85%)</li>
                  <li>• Зона 4: Лактатный порог (85-95%)</li>
                  <li>• Зона 5-6: VO2 Max и нейромышечная (95-120%)</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}