# GitHub Actions Setup

## Необходимые секреты

Для работы GitHub Actions workflow необходимо настроить следующие секреты в настройках репозитория (Settings → Secrets and variables → Actions):

### Обязательные секреты:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - публичный ключ Clerk
- `CLERK_SECRET_KEY` - секретный ключ Clerk
- `DATABASE_URL` - URL подключения к базе данных
- `OPENAI_API_KEY` - API ключ OpenAI для генерации карточек

## Workflow

Workflow `deploy.yml` выполняет:

1. Установку зависимостей
2. Запуск линтера
3. Запуск тестов
4. Сборку приложения
5. Деплой (требует настройки)

## Триггеры

- Push в ветки `main` и `dev`
- Pull Request в ветку `main`
