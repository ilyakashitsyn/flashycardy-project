# Настройка переменных окружения для Clerk

## Проблема:
Clerk не работает - pop-up формы не открываются при нажатии на кнопки "Войти" и "Регистрация"

## Решение:

### 1. Остановите сервер:
```bash
pkill -f "next dev"
```

### 2. Обновите файл `.env.local` в корне проекта:
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

### 3. В настройках Clerk добавьте домен:
- Перейдите в [clerk.com](https://clerk.com)
- В настройках проекта добавьте: `http://localhost:61395`
- Убедитесь что проект активен

### 4. Запустите сервер заново:
```bash
source ~/.nvm/nvm.sh
nvm use 20
npm run dev
```

## Что исправлено в коде:
- ✅ Header компонент с кнопками авторизации
- ✅ Pop-up формы Clerk (SignInButton, SignUpButton)
- ✅ Правильная иконка переключения темы
- ✅ Исправленный middleware
- ✅ Настроенный ClerkProvider
- ✅ Стили для Clerk модальных окон

## Проверка:
После исправления переменных окружения:
1. Кнопки "Войти" и "Регистрация" должны открывать pop-up формы
2. Иконка темы должна показывать правильный символ
3. Header должен отображаться на всех страницах
4. Clerk должен работать без ошибок
