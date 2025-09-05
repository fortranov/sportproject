# 🐳 Docker Setup for Triathlon Training Service

Этот документ описывает, как запустить приложение с помощью Docker и Docker Compose.

## Предварительные требования

- Docker Engine 20.10+
- Docker Compose 2.0+

## Быстрый старт

### Разработка

```bash
# Запуск в режиме разработки с hot reload
docker-compose -f docker-compose.dev.yml up --build

# Доступ к приложению:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Documentation: http://localhost:8000/docs
```

### Продакшен

```bash
# Запуск в продакшн режиме
docker-compose up --build -d

# С Nginx reverse proxy
docker-compose --profile production up --build -d

# Доступ к приложению:
# Frontend: http://localhost:3000 (или http://localhost:80 с Nginx)
# Backend API: http://localhost:8000
# API Documentation: http://localhost:8000/docs
```

## Управление контейнерами

### Основные команды

```bash
# Запуск сервисов
docker-compose up -d

# Остановка сервисов
docker-compose down

# Просмотр логов
docker-compose logs -f

# Просмотр логов конкретного сервиса
docker-compose logs -f backend
docker-compose logs -f frontend

# Перезапуск сервиса
docker-compose restart backend

# Пересборка и запуск
docker-compose up --build
```

### Очистка

```bash
# Остановка и удаление контейнеров, сетей
docker-compose down

# Удаление с volumes (ВНИМАНИЕ: удалит данные БД!)
docker-compose down -v

# Очистка неиспользуемых образов
docker system prune -f
```

## Структура Docker файлов

```
├── docker-compose.yml          # Продакшн конфигурация
├── docker-compose.dev.yml      # Конфигурация для разработки
├── nginx.conf                  # Конфигурация Nginx
├── backend/
│   └── Dockerfile             # Backend образ (Python/FastAPI)
└── frontend/
    ├── Dockerfile             # Frontend продакшн образ (Next.js)
    └── Dockerfile.dev         # Frontend разработка образ
```

## Переменные окружения

### Backend
- `PYTHONPATH=/app` - Python path
- `DATABASE_URL=sqlite:///./triathlon_training.db` - URL базы данных

### Frontend
- `NODE_ENV=production|development` - Режим работы Node.js
- `NEXT_PUBLIC_API_URL=http://localhost:8000` - URL API backend
- `NEXT_TELEMETRY_DISABLED=1` - Отключение телеметрии Next.js

## Volumes и данные

### Backend данные
- `backend-data:/app/data` - Постоянное хранение данных БД

### Development volumes
- `./backend:/app` - Синхронизация кода backend для hot reload
- `./frontend:/app` - Синхронизация кода frontend для hot reload
- `/app/node_modules` - Исключение node_modules из синхронизации

## Сети

- `triathlon-network` - Внутренняя сеть для связи между сервисами

## Health Checks

Все сервисы имеют health checks:
- **Backend**: HTTP запрос к `/`
- **Frontend**: HTTP запрос к корню
- **Nginx**: Встроенная проверка

```bash
# Проверка состояния сервисов
docker-compose ps
```

## Отладка

### Подключение к контейнеру

```bash
# Backend
docker-compose exec backend bash

# Frontend
docker-compose exec frontend sh
```

### Просмотр логов с фильтрацией

```bash
# Последние 100 строк
docker-compose logs --tail=100 backend

# Логи за последний час
docker-compose logs --since=1h frontend

# Следить за новыми логами
docker-compose logs -f --tail=0 backend
```

### Мониторинг ресурсов

```bash
# Использование ресурсов
docker stats

# Информация о контейнерах
docker-compose ps -a
```

## Производительность

### Оптимизация образов
- Используется multi-stage build для frontend
- Минимальные базовые образы (alpine)
- Оптимизированные layers для кэширования

### Настройки памяти
```bash
# Ограничение памяти для сервиса (в docker-compose.yml)
deploy:
  resources:
    limits:
      memory: 512M
    reservations:
      memory: 256M
```

## Безопасность

- Запуск от non-root пользователя
- Минимальные привилегии
- Security headers в Nginx
- Rate limiting
- CORS настройки

## Troubleshooting

### Порты заняты
```bash
# Проверить занятые порты
netstat -tulpn | grep :3000
netstat -tulpn | grep :8000

# Изменить порты в docker-compose.yml
ports:
  - "3001:3000"  # внешний:внутренний
```

### Проблемы с правами доступа
```bash
# Исправить права на файлы
sudo chown -R $USER:$USER .
```

### Очистка Docker кэша
```bash
# Полная очистка (ВНИМАНИЕ: удалит все неиспользуемые данные!)
docker system prune -a --volumes
```

### Пересборка без кэша
```bash
# Пересборка образов без кэша
docker-compose build --no-cache
```
