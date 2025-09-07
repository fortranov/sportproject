# 🔧 Исправление ошибки ERR_CONNECTION_REFUSED в продакшене

## ❌ Проблема
```
POST http://localhost:8000/training-plan net::ERR_CONNECTION_REFUSED
```

## 🎯 Причина
В продакшене backend **не должен быть доступен напрямую** на порту 8000. Все запросы должны идти через Nginx на порту 80.

## ✅ Решение

### 1. Исправленная архитектура:
```
Frontend → Nginx (port 80) → Backend (internal)
```

**Было**: `POST http://localhost:8000/training-plan`  
**Стало**: `POST http://localhost/training-plan` (через Nginx)

### 2. Изменения в конфигурации:

#### `frontend/src/lib/api.ts`:
```javascript
// Автоматическое определение API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000');
```

#### `docker-compose.yml`:
```yaml
# Backend - порт НЕ экспонируется наружу
backend:
  # ports: - убрано для безопасности
  
# Frontend - порт НЕ экспонируется наружу  
frontend:
  # ports: - убрано для безопасности
  environment:
    - NEXT_PUBLIC_API_URL=  # Пустое = тот же домен через Nginx

# Nginx - единственная точка входа
nginx:
  ports:
    - "80:80"  # Только Nginx доступен снаружи
```

## 🚀 Правильный запуск продакшена

### Вариант 1: Обычный docker-compose (рекомендуется)
```bash
# Остановить старые контейнеры
docker-compose down

# Запустить с новой конфигурацией
docker-compose up --build -d

# Проверить статус
docker-compose ps

# Проверить логи
docker-compose logs nginx
docker-compose logs backend
```

### Вариант 2: Специальная продакшен конфигурация
```bash
# Остановить старые контейнеры
docker-compose -f docker-compose.prod.yml down

# Запустить продакшен версию
docker-compose -f docker-compose.prod.yml up --build -d

# Проверить статус
docker-compose -f docker-compose.prod.yml ps
```

## 🧪 Тестирование

### Быстрый тест API:
```bash
node test-production-api.js
```

### Ручная проверка:
```bash
# Health check
curl http://localhost/health

# API endpoint
curl -X POST http://localhost/training-plan \
  -H "Content-Type: application/json" \
  -d '{"uin":"test123","competition_date":"2025-12-01","difficulty":500}'
```

### Проверка в браузере:
1. Откройте `http://localhost` (НЕ :3000 или :8000)
2. Перейдите на страницу создания плана
3. Заполните форму и создайте план

## 🔍 Диагностика проблем

### Если всё ещё ERR_CONNECTION_REFUSED:

1. **Проверьте статус контейнеров:**
   ```bash
   docker-compose ps
   ```
   Все должны быть "Up"

2. **Проверьте логи Nginx:**
   ```bash
   docker-compose logs nginx
   ```
   Не должно быть ошибок подключения к backend

3. **Проверьте логи Backend:**
   ```bash
   docker-compose logs backend
   ```
   Должен быть запущен на порту 8000 внутри контейнера

4. **Проверьте сеть Docker:**
   ```bash
   docker network ls
   docker network inspect sportproject_triathlon-network
   ```

### Если Nginx не может подключиться к backend:

```bash
# Перезапустить только backend
docker-compose restart backend

# Или пересобрать всё
docker-compose up --build --force-recreate -d
```

## 📊 Правильные URL в продакшене

| Сервис | Внешний URL | Внутренний URL |
|--------|-------------|----------------|
| Frontend | `http://localhost/` | `http://frontend:3000` |
| Backend API | `http://localhost/training-plan` | `http://backend:8000` |
| Nginx | `http://localhost/` | - |
| Health Check | `http://localhost/health` | - |

## ⚠️ Важные моменты

1. **Никогда не обращайтесь напрямую к портам 3000 или 8000 в продакшене**
2. **Все запросы должны идти через порт 80 (Nginx)**
3. **Frontend автоматически использует правильный API URL**
4. **CORS настроен для работы через Nginx**

## 🎉 После исправления

✅ `POST http://localhost/training-plan` - работает  
✅ Frontend доступен на `http://localhost`  
✅ API доступен через тот же домен  
✅ Безопасная архитектура  
✅ Готовность к SSL/HTTPS
