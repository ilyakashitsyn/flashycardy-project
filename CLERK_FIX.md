# Исправление проблем с Clerk

## Проблемы:

1. Clerk не работает - pop-up формы не открываются
2. Нужно добавить недостающие переменные окружения

## Решение:

### 1. Обновите файл `.env.local`:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZG9taW5hbnQtbW9uaXRvci01LmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_aSE2rmtPzXSCfvPhpNRD2nv83NR8aAJWpVYcDT6Xuy

# Clerk URLs (ОБЯЗАТЕЛЬНО добавить!)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Database
DATABASE_URL=your_neon_database_url_here
```

### 2. Проверьте настройки Clerk:

- В настройках Clerk добавьте домен: `http://localhost:61253`
- Убедитесь что проект активен

### 3. Перезапустите сервер:

```bash
pkill -f "next dev"
npm run dev
```

## Что исправлено в коде:

- ✅ Header компонент с кнопками авторизации
- ✅ Pop-up формы Clerk (SignInButton, SignUpButton)
- ✅ Правильная иконка переключения темы
- ✅ Обновленный middleware
- ✅ Настроенный ClerkProvider

## Проверка:

После исправления переменных окружения:

1. Кнопки "Войти" и "Регистрация" должны открывать pop-up формы
2. Иконка темы должна показывать правильный символ
3. Header должен отображаться на всех страницах
