'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import toast from 'react-hot-toast';

export default function SearchPlanPage() {
  const router = useRouter();
  const [uin, setUin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uin.trim()) {
      toast.error('Введите UIN пользователя');
      return;
    }

    setLoading(true);
    
    try {
      // Проверяем существование плана
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/training-plan/${uin}`);
      
      if (response.ok) {
        router.push(`/view-plan/${uin}`);
      } else if (response.status === 404) {
        toast.error('План тренировок не найден');
      } else {
        toast.error('Ошибка при поиске плана');
      }
    } catch (error) {
      toast.error('Ошибка подключения к серверу');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center">
            <Search size={24} className="mr-2" />
            Найти план тренировок
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UIN пользователя
              </label>
              <Input
                type="text"
                value={uin}
                onChange={(e) => setUin(e.target.value)}
                placeholder="Введите UIN"
                className="w-full"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full"
              loading={loading}
            >
              {loading ? 'Поиск...' : 'Найти план'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Нет плана тренировок?
            </p>
            <Button
              variant="outline"
              onClick={() => router.push('/create-plan')}
              className="w-full"
            >
              Создать новый план
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

