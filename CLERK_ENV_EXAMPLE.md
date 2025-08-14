# Пример переменных окружения для Clerk

Создайте файл `.env.local` в корне проекта со следующим содержимым:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# Database
DATABASE_URL=your_neon_database_url_here
```

## Как получить ключи Clerk:

1. Перейдите на [clerk.com](https://clerk.com)
2. Создайте новый проект
3. Выберите Next.js как фреймворк
4. Скопируйте ключи из настроек проекта

## Важно:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` должен начинаться с `pk_test_` или `pk_live_`
- `CLERK_SECRET_KEY` должен начинаться с `sk_test_` или `sk_live_`
- Добавьте `.env.local` в `.gitignore` для безопасности
