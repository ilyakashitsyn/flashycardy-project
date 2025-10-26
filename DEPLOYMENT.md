# Инструкции по деплою на Vercel

## 1. Настройка переменных окружения

В панели Vercel добавьте следующие переменные окружения:

### Обязательные переменные:

- `DATABASE_URL` - URL подключения к PostgreSQL (Neon)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - публичный ключ Clerk
- `CLERK_SECRET_KEY` - секретный ключ Clerk
- `HUGGINGFACE_API_KEY` - ключ для AI генерации карточек

### Дополнительные переменные Clerk:

- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard`

## 2. Настройка базы данных

### Шаг 1: Создание базы данных

1. Создайте базу данных в Neon (или другой PostgreSQL провайдер)
2. Скопируйте connection string в переменную `DATABASE_URL`

### Шаг 2: Выполнение миграций

После деплоя выполните миграции в Vercel CLI:

```bash
# Установите Vercel CLI
npm i -g vercel

# Логин в Vercel
vercel login

# Подключитесь к проекту
vercel link

# Выполните миграции
vercel env pull .env.local
npm run db:push
```

## 3. Настройка Clerk

### Шаг 1: Создание приложения

1. Зайдите в [Clerk Dashboard](https://dashboard.clerk.com)
2. Создайте новое приложение
3. Настройте домены в разделе "Domains"

### Шаг 2: Настройка биллинга

1. В Clerk Dashboard перейдите в раздел "Billing"
2. Настройте планы `free_user` и `pro_plan`
3. Настройте функции:
   - `3_deck_limit` для бесплатного плана
   - `unlimited_decks` для Pro плана
   - `ai_flashcard_generation` для Pro плана

## 4. Настройка Hugging Face

1. Зайдите на [Hugging Face](https://huggingface.co)
2. Создайте API токен в настройках профиля
3. Добавьте токен в переменную `HUGGINGFACE_API_KEY`

## 5. Деплой

### Автоматический деплой:

1. Подключите репозиторий к Vercel
2. Vercel автоматически задеплоит при каждом push в main ветку

### Ручной деплой:

```bash
vercel --prod
```

## 6. Проверка после деплоя

1. Убедитесь что все страницы загружаются
2. Проверьте аутентификацию
3. Протестируйте создание колод
4. Проверьте AI генерацию карточек
5. Убедитесь что биллинг работает корректно

## 7. Мониторинг

- Используйте Vercel Analytics для отслеживания производительности
- Настройте алерты в Clerk Dashboard
- Мониторьте использование базы данных в Neon

## Возможные проблемы

### Ошибка подключения к БД:

- Проверьте правильность `DATABASE_URL`
- Убедитесь что база данных доступна из интернета

### Ошибки аутентификации:

- Проверьте настройки доменов в Clerk
- Убедитесь что все Clerk переменные настроены

### Ошибки AI генерации:

- Проверьте `HUGGINGFACE_API_KEY`
- Убедитесь что у токена есть права на использование моделей
