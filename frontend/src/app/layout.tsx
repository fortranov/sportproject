import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import "./globals.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Triathlon Training Service",
  description: "Персонализированные планы тренировок на основе методологии Джо Фрила",
  keywords: ['триатлон', 'тренировки', 'план', 'плавание', 'велосипед', 'бег'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-4">
                  <Link href="/" className="text-xl font-bold text-gray-900">
                    🏊‍♂️🚴‍♂️🏃‍♂️ Triathlon Training
                  </Link>
                </div>
                <nav className="hidden md:flex items-center space-x-6">
                  <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Главная
                  </Link>
                  <Link href="/create-plan" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Создать план
                  </Link>
                  <Link href="/search-plan" className="text-gray-700 hover:text-blue-600 transition-colors">
                    Найти план
                  </Link>
                </nav>
              </div>
            </div>
          </header>
          
          <main>{children}</main>
          
          <footer className="bg-white border-t mt-auto">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center text-gray-600">
                <p>&copy; 2024 Triathlon Training Service. Основано на методологии Джо Фрила.</p>
              </div>
            </div>
          </footer>
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}