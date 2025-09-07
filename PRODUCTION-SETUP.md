# 🚀 Настройка продакшена для Triathlon Training Service

## 📋 Обзор изменений CORS

Были внесены критически важные изменения для корректной работы CORS в продакшен окружении:

### ✅ Исправленные проблемы:

1. **Backend CORS настройки** - добавлена поддержка переменных окружения
2. **Docker Compose конфигурация** - исправлены API URLs и CORS origins
3. **Nginx конфигурация** - добавлена правильная обработка CORS заголовков
4. **Продакшен конфигурация** - создана специальная настройка для продакшена

## 🔧 Настройка для продакшена

### 1. Обновите CORS origins в docker-compose.prod.yml

```yaml
environment:
  - CORS_ORIGINS=http://localhost,http://localhost:80,https://yourdomain.com,https://www.yourdomain.com
```

Замените `yourdomain.com` на ваш реальный домен.

### 2. Запуск в продакшене

```bash
# Сборка и запуск продакшен версии
docker-compose -f docker-compose.prod.yml up --build -d

# Проверка статуса сервисов
docker-compose -f docker-compose.prod.yml ps

# Просмотр логов
docker-compose -f docker-compose.prod.yml logs -f
```

### 3. Тестирование CORS

```bash
# Установка зависимостей для тестирования
npm install axios

# Запуск тестов CORS
node test-cors-production.js
```

## 🌐 Архитектура продакшена

```
Internet → Nginx (port 80/443) → Frontend (internal) + Backend (internal)
```

### Преимущества:

- ✅ **Безопасность**: Backend и Frontend не доступны напрямую извне
- ✅ **Производительность**: Nginx кэширует статические файлы
- ✅ **CORS**: Правильная настройка для всех origins
- ✅ **SSL Ready**: Готов для добавления HTTPS
- ✅ **Rate Limiting**: Защита от DDoS атак

## 📁 Структура конфигурационных файлов

```
├── docker-compose.yml          # Базовая конфигурация
├── docker-compose.dev.yml      # Разработка
├── docker-compose.prod.yml     # Продакшен (новый)
├── nginx.conf                  # Базовая Nginx конфигурация
├── nginx.prod.conf            # Продакшен Nginx (новый)
└── test-cors-production.js    # Тесты CORS (новый)
```

## 🔒 Безопасность

### Nginx Security Headers:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Content-Security-Policy`
- `Referrer-Policy`

### Rate Limiting:
- API: 10 запросов/сек
- Frontend: 30 запросов/сек
- Global: 50 запросов/сек

## 🚀 SSL/HTTPS Setup (опционально)

### 1. Получите SSL сертификат

```bash
# Используя Let's Encrypt
sudo certbot certonly --webroot -w /var/www/html -d yourdomain.com -d www.yourdomain.com
```

### 2. Обновите nginx.prod.conf

```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    # ... остальная конфигурация
}

# Редирект HTTP → HTTPS
server {
    listen 80;
    return 301 https://$server_name$request_uri;
}
```

### 3. Обновите docker-compose.prod.yml

```yaml
volumes:
  - /etc/letsencrypt/live/yourdomain.com:/etc/nginx/ssl:ro
```

## 📊 Мониторинг

### Health Checks:
- **Nginx**: `http://localhost/health`
- **Backend**: Встроенный health check в Docker
- **Frontend**: Встроенный health check в Docker

### Логи:
```bash
# Все логи
docker-compose -f docker-compose.prod.yml logs -f

# Только Nginx
docker-compose -f docker-compose.prod.yml logs -f nginx

# Только Backend
docker-compose -f docker-compose.prod.yml logs -f backend
```

## 🔧 Troubleshooting

### CORS ошибки:
1. Проверьте переменную `CORS_ORIGINS` в docker-compose.prod.yml
2. Убедитесь, что origin включен в список разрешенных
3. Проверьте логи backend: `docker-compose -f docker-compose.prod.yml logs backend`

### 502 Bad Gateway:
1. Проверьте, что все сервисы запущены: `docker-compose -f docker-compose.prod.yml ps`
2. Проверьте логи Nginx: `docker-compose -f docker-compose.prod.yml logs nginx`
3. Проверьте сетевое подключение между контейнерами

### Медленная работа:
1. Проверьте использование ресурсов: `docker stats`
2. Увеличьте лимиты в nginx.prod.conf если нужно
3. Настройте кэширование статических файлов

## 📝 Чеклист деплоя

- [ ] Обновлен домен в CORS_ORIGINS
- [ ] Обновлен домен в nginx.prod.conf
- [ ] SSL сертификаты настроены (если нужно)
- [ ] Тесты CORS прошли успешно
- [ ] Health checks работают
- [ ] Логи не показывают ошибок
- [ ] Производительность приемлемая

## 💡 Дополнительные рекомендации

1. **Backup**: Настройте резервное копирование базы данных
2. **Monitoring**: Добавьте мониторинг (Prometheus + Grafana)
3. **CI/CD**: Настройте автоматический деплой
4. **CDN**: Используйте CDN для статических файлов
5. **Database**: Рассмотрите переход на PostgreSQL для продакшена
