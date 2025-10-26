# FlashyCardy - Smart Learning Cards

<div align="center">
  <h3>🌐 Language</h3>
  <p>
    <a href="#english">🇺🇸 english</a> | 
    <a href="#russian">🇷🇺 russian</a>
  </p>
</div>

---

## 🇺🇸 English {#english}

Modern web application for creating, managing and studying flashcards with AI generation support and progress tracking.

You can check out the ready-made solution on [Vercel](https://flashycardy-project.vercel.app/)

### ✨ Features

#### 🔐 Authentication & Authorization

- Sign in and registration through Clerk
- Automatic redirect after login
- Protected routes with middleware
- User and profile management

#### 📚 Deck Management

- Create decks with name, description and emoji
- View user's deck list
- Display statistics (card count, progress)
- Edit and delete decks
- Subscription plan limitations

#### 🎯 Learning System

- Interactive card studying
- Learning progress tracking
- Study session system
- Card statistics (known/unknown)
- Random card order

#### 🤖 AI Card Generation

- Automatic card generation using Hugging Face API
- Support for various categories (science, languages, general topics)
- Generate up to 20 cards at once
- Available only in Pro plan

#### 💳 Subscription System

- Free plan (3 decks)
- Pro plan (unlimited decks + AI)
- Clerk Billing integration
- Feature protection by plans

#### 🎨 UI/UX

- Modern design with Tailwind CSS
- Dark and light theme support
- Responsive design for all devices
- Lazy loading components
- Animations and transitions

#### 🧪 Testing

- Full test coverage (Jest + Testing Library)
- Component, API and database tests
- Code coverage setup 70%
- Automated testing

### 🛠 Technologies

#### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - typing
- **Tailwind CSS** - styling
- **next-themes** - theme management

#### UI Components

- **Radix UI** - accessible components (Dialog, Dropdown, Tooltip, etc.)
- **Lucide React** - icons
- **class-variance-authority** - style variants
- **clsx** + **tailwind-merge** - CSS utilities

#### Authentication & Billing

- **Clerk** - authentication and user management
- **Clerk Billing** - subscription system

#### Database

- **Neon** - PostgreSQL in the cloud
- **Drizzle ORM** - typed ORM
- **@neondatabase/serverless** - Neon driver

#### Forms & Validation

- **React Hook Form** - form management
- **@hookform/resolvers** - validation resolvers
- **Zod** - validation schema

#### Testing

- **Jest** - testing framework
- **@testing-library/react** - React component testing
- **@testing-library/jest-dom** - additional matchers
- **@testing-library/user-event** - user action simulation

#### Additional Libraries

- **Sonner** - notifications
- **Recharts** - charts and diagrams
- **Embla Carousel** - carousels
- **React Day Picker** - date picker
- **React Resizable Panels** - resizable panels

#### Deployment & Infrastructure

- **Vercel** - deployment platform and hosting
- **Neon** - PostgreSQL cloud database
- **Clerk** - authentication and user management
- **Hugging Face** - AI API for card generation
- **GitHub** - version control and CI/CD

### 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API endpoints
│   │   ├── cards/[cardId]/       # Card management
│   │   ├── decks/                # CRUD decks
│   │   │   └── [deckId]/
│   │   │       ├── cards/        # Deck cards
│   │   │       └── generate-ai/  # AI generation
│   │   └── study/[deckId]/       # Study sessions
│   ├── dashboard/                # Control panel
│   ├── decks/[deckId]/           # Deck pages
│   │   ├── edit/                 # Editing
│   │   └── study/                # Studying
│   ├── pricing/                  # Pricing page
│   └── card-demo/                # Card demo
├── components/ui/                # UI components
│   ├── auth-*.tsx               # Authentication
│   ├── billing-*.tsx            # Billing
│   ├── *-dialog.tsx             # Dialogs
│   └── ...                      # Other components
├── mainpage/                     # Landing page
│   ├── components/               # Landing sections
│   ├── hooks/                    # Custom hooks
│   └── pages/                    # Landing pages
├── db/                          # Database
│   ├── schema.ts                # Drizzle schema
│   └── index.ts                 # DB configuration
├── lib/                         # Utilities
└── types/                       # TypeScript types

__tests__/                       # Tests
├── api/                         # API tests
├── components/                  # Component tests
├── db/                          # DB tests
├── middleware/                  # Middleware tests
└── utils/                       # Utility tests
```

### 🚀 Installation & Setup

#### Prerequisites

- Node.js 18.18.0+ or 20.0.0+
- PostgreSQL database (Neon recommended)
- Clerk account for authentication
- Vercel account for deployment (optional)
- Vercel CLI for local deployment (optional)

#### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd flashycardy-project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create `.env.local` file:

   ```bash
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

   # Database
   DATABASE_URL=your_neon_database_url

   # Hugging Face (for AI generation)
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   ```

4. **Set up database**

   ```bash
   # Generate migrations
   npm run db:generate

   # Apply migrations
   npm run db:migrate

   # Fill with test data (optional)
   npm run db:seed
   ```

5. **Run the application**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

### Deploy to Vercel

1. **Connect repository to Vercel**

   - Sign in to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project" and select your GitHub repository

2. **Set up environment variables in Vercel**

   - Go to Settings → Environment Variables
   - Add all variables from `.env.local`:
     ```
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
     CLERK_SECRET_KEY
     NEXT_PUBLIC_CLERK_SIGN_IN_URL
     NEXT_PUBLIC_CLERK_SIGN_UP_URL
     NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
     NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
     DATABASE_URL
     HUGGINGFACE_API_KEY
     ```

3. **Set up database**

   - Create database in [Neon Console](https://console.neon.tech)
   - Copy DATABASE_URL to Vercel environment variables

4. **Deployment**
   - Vercel will automatically deploy the app when pushing to main branch
   - The app will be available at URL like `https://your-app.vercel.app`

### 📊 API Endpoints

#### Decks

- `GET /api/decks` - Get user's decks
- `POST /api/decks` - Create new deck
- `GET /api/decks/[deckId]` - Get specific deck
- `PUT /api/decks/[deckId]` - Update deck
- `DELETE /api/decks/[deckId]` - Delete deck

#### Cards

- `GET /api/cards/[cardId]` - Get card
- `POST /api/decks/[deckId]/cards` - Create card in deck
- `PUT /api/cards/[cardId]` - Update card
- `DELETE /api/cards/[cardId]` - Delete card

#### Study

- `POST /api/study/[deckId]` - Start study session
- `PUT /api/study/[deckId]` - Complete study session

#### AI Generation

- `POST /api/decks/[deckId]/generate-ai` - Generate cards with AI

### 🧪 Testing

#### Running Tests

```bash
# All tests
npm test

# Watch mode
npm run test:watch

# With code coverage
npm run test:coverage
```

### 📋 Commands

#### Development

- `npm run dev` - Run in development mode
- `npm run build` - Build for production
- `npm run start` - Run production build
- `npm run lint` - Run linter

#### Database

- `npm run db:generate` - Generate migrations
- `npm run db:push` - Apply schema changes
- `npm run db:migrate` - Apply migrations
- `npm run db:studio` - Run Drizzle Studio
- `npm run db:seed` - Fill DB with test data
- `npm run db:clear` - Clear test data

#### Testing

- `npm test` - Run tests
- `npm run test:watch` - Tests in watch mode
- `npm run test:coverage` - Tests with coverage

#### Utilities

- `npm run use-node20` - Switch to Node.js 20

#### Deployment

- `vercel` - Deploy to Vercel (requires Vercel CLI)
- `vercel --prod` - Deploy to production
- `vercel env pull` - Pull environment variables from Vercel

### 🗄️ Database Schema

#### Tables

- **decks** - Card decks
- **cards** - Cards
- **study_sessions** - Study sessions
- **card_progress** - Card learning progress

#### Relationships

- Deck → Cards (1:many)
- User → Decks (1:many)
- Card → Progress (1:many)
- Deck → Study sessions (1:many)

### 🔒 Security

- Authentication through Clerk
- Protected API routes
- Middleware for authorization check
- Input validation with Zod
- CORS settings
- CSRF attack protection

---

## 🇷🇺 Русский {#russian}

Современное веб-приложение для создания, управления и изучения флеш-карточек с поддержкой ИИ-генерации и системы прогресса.

Вы можете посмотреть готовое решение на [Vercel](https://flashycardy-project.vercel.app/)

## ✨ Возможности

### 🔐 Аутентификация и авторизация

- Вход и регистрация через Clerk
- Автоматическое перенаправление после входа
- Защищенные маршруты с middleware
- Управление пользователями и профилями

### 📚 Управление колодами

- Создание колод с названием, описанием и эмодзи
- Просмотр списка колод пользователя
- Отображение статистики (количество карточек, прогресс)
- Редактирование и удаление колод
- Ограничения по планам подписки

### 🎯 Система изучения

- Интерактивное изучение карточек
- Отслеживание прогресса изучения
- Система сессий изучения
- Статистика по карточкам (известные/неизвестные)
- Случайный порядок карточек

### 🤖 ИИ-генерация карточек

- Автоматическая генерация карточек с помощью Hugging Face API
- Поддержка различных категорий (наука, языки, общие темы)
- Генерация до 20 карточек за раз
- Доступно только в Pro плане

### 💳 Система подписок

- Бесплатный план (3 колоды)
- Pro план (неограниченные колоды + ИИ)
- Интеграция с Clerk Billing
- Защита функций по планам

### 🎨 UI/UX

- Современный дизайн с Tailwind CSS
- Поддержка темной и светлой темы
- Адаптивный дизайн для всех устройств
- Ленивая загрузка компонентов
- Анимации и переходы

### 🧪 Тестирование

- Полное покрытие тестами (Jest + Testing Library)
- Тесты компонентов, API и базы данных
- Настройка покрытия кода 70%
- Автоматизированное тестирование

## 🛠 Технологии

### Frontend

- **Next.js 15** - React фреймворк с App Router
- **React 19** - UI библиотека
- **TypeScript** - типизация
- **Tailwind CSS** - стилизация
- **next-themes** - управление темами

### UI Компоненты

- **Radix UI** - доступные компоненты (Dialog, Dropdown, Tooltip, etc.)
- **Lucide React** - иконки
- **class-variance-authority** - варианты стилей
- **clsx** + **tailwind-merge** - утилиты для CSS

### Аутентификация и биллинг

- **Clerk** - аутентификация и управление пользователями
- **Clerk Billing** - система подписок

### База данных

- **Neon** - PostgreSQL в облаке
- **Drizzle ORM** - типизированная ORM
- **@neondatabase/serverless** - драйвер для Neon

### Формы и валидация

- **React Hook Form** - управление формами
- **@hookform/resolvers** - резолверы для валидации
- **Zod** - схема валидации

### Тестирование

- **Jest** - тестовый фреймворк
- **@testing-library/react** - тестирование React компонентов
- **@testing-library/jest-dom** - дополнительные матчеры
- **@testing-library/user-event** - симуляция пользовательских действий

### Дополнительные библиотеки

- **Sonner** - уведомления
- **Recharts** - графики и диаграммы
- **Embla Carousel** - карусели
- **React Day Picker** - выбор дат
- **React Resizable Panels** - изменяемые панели

### Развертывание и инфраструктура

- **Vercel** - платформа развертывания и хостинг
- **Neon** - PostgreSQL база данных в облаке
- **Clerk** - аутентификация и управление пользователями
- **Hugging Face** - ИИ API для генерации карточек
- **GitHub** - система контроля версий и CI/CD

## 📁 Структура проекта

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API endpoints
│   │   ├── cards/[cardId]/       # Управление карточками
│   │   ├── decks/                # CRUD колод
│   │   │   └── [deckId]/
│   │   │       ├── cards/        # Карточки колоды
│   │   │       └── generate-ai/  # ИИ генерация
│   │   └── study/[deckId]/       # Сессии изучения
│   ├── dashboard/                # Панель управления
│   ├── decks/[deckId]/           # Страницы колод
│   │   ├── edit/                 # Редактирование
│   │   └── study/                # Изучение
│   ├── pricing/                  # Страница тарифов
│   └── card-demo/                # Демо карточек
├── components/ui/                # UI компоненты
│   ├── auth-*.tsx               # Аутентификация
│   ├── billing-*.tsx            # Биллинг
│   ├── *-dialog.tsx             # Диалоги
│   └── ...                      # Остальные компоненты
├── mainpage/                     # Лендинг страница
│   ├── components/               # Секции лендинга
│   ├── hooks/                    # Кастомные хуки
│   └── pages/                    # Страницы лендинга
├── db/                          # База данных
│   ├── schema.ts                # Схема Drizzle
│   └── index.ts                 # Конфигурация БД
├── lib/                         # Утилиты
└── types/                       # TypeScript типы

__tests__/                       # Тесты
├── api/                         # Тесты API
├── components/                  # Тесты компонентов
├── db/                          # Тесты БД
├── middleware/                  # Тесты middleware
└── utils/                       # Тесты утилит
```

## 🚀 Установка и запуск

### Предварительные требования

- Node.js 18.18.0+ или 20.0.0+
- PostgreSQL база данных (рекомендуется Neon)
- Аккаунт Clerk для аутентификации
- Аккаунт Vercel для развертывания (опционально)
- Vercel CLI для локального развертывания (опционально)

### Установка

1. **Клонируйте репозиторий**

   ```bash
   git clone <repository-url>
   cd flashycardy-project
   ```

2. **Установите зависимости**

   ```bash
   npm install
   ```

3. **Настройте переменные окружения**
   Создайте `.env.local` файл:

   ```bash
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

   # Database
   DATABASE_URL=your_neon_database_url

   # Hugging Face (для ИИ генерации)
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   ```

4. **Настройте базу данных**

   ```bash
   # Генерация миграций
   npm run db:generate

   # Применение миграций
   npm run db:migrate

   # Заполнение тестовыми данными (опционально)
   npm run db:seed
   ```

5. **Запустите приложение**
   ```bash
   npm run dev
   ```

Приложение будет доступно по адресу `http://localhost:3000`

### Развертывание на Vercel

1. **Подключите репозиторий к Vercel**

   - Войдите в [Vercel Dashboard](https://vercel.com/dashboard)
   - Нажмите "New Project" и выберите ваш GitHub репозиторий

2. **Настройте переменные окружения в Vercel**

   - Перейдите в Settings → Environment Variables
   - Добавьте все переменные из `.env.local`:
     ```
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
     CLERK_SECRET_KEY
     NEXT_PUBLIC_CLERK_SIGN_IN_URL
     NEXT_PUBLIC_CLERK_SIGN_UP_URL
     NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
     NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
     DATABASE_URL
     HUGGINGFACE_API_KEY
     ```

3. **Настройте базу данных**

   - Создайте базу данных в [Neon Console](https://console.neon.tech)
   - Скопируйте DATABASE_URL в переменные окружения Vercel

4. **Развертывание**
   - Vercel автоматически развернет приложение при push в main ветку
   - Приложение будет доступно по URL вида `https://your-app.vercel.app`

## 📊 API Endpoints

### Колоды

- `GET /api/decks` - Получение колод пользователя
- `POST /api/decks` - Создание новой колоды
- `GET /api/decks/[deckId]` - Получение конкретной колоды
- `PUT /api/decks/[deckId]` - Обновление колоды
- `DELETE /api/decks/[deckId]` - Удаление колоды

### Карточки

- `GET /api/cards/[cardId]` - Получение карточки
- `POST /api/decks/[deckId]/cards` - Создание карточки в колоде
- `PUT /api/cards/[cardId]` - Обновление карточки
- `DELETE /api/cards/[cardId]` - Удаление карточки

### Изучение

- `POST /api/study/[deckId]` - Начало сессии изучения
- `PUT /api/study/[deckId]` - Завершение сессии изучения

### ИИ генерация

- `POST /api/decks/[deckId]/generate-ai` - Генерация карточек с ИИ

## 🧪 Тестирование

### Запуск тестов

```bash
# Все тесты
npm test

# Режим наблюдения
npm run test:watch

# С покрытием кода
npm run test:coverage
```

## 📋 Команды

### Разработка

- `npm run dev` - Запуск в режиме разработки
- `npm run build` - Сборка для продакшена
- `npm run start` - Запуск продакшен сборки
- `npm run lint` - Проверка линтера

### База данных

- `npm run db:generate` - Генерация миграций
- `npm run db:push` - Применение изменений схемы
- `npm run db:migrate` - Применение миграций
- `npm run db:studio` - Запуск Drizzle Studio
- `npm run db:seed` - Заполнение БД тестовыми данными
- `npm run db:clear` - Очистка тестовых данных

### Тестирование

- `npm test` - Запуск тестов
- `npm run test:watch` - Тесты в режиме наблюдения
- `npm run test:coverage` - Тесты с покрытием

### Утилиты

- `npm run use-node20` - Переключение на Node.js 20

### Развертывание

- `vercel` - Развертывание на Vercel (требует Vercel CLI)
- `vercel --prod` - Развертывание в продакшен
- `vercel env pull` - Скачивание переменных окружения из Vercel

## 🗄️ Схема базы данных

### Таблицы

- **decks** - Колоды карточек
- **cards** - Карточки
- **study_sessions** - Сессии изучения
- **card_progress** - Прогресс изучения карточек

### Связи

- Колода → Карточки (1:м)
- Пользователь → Колоды (1:м)
- Карточка → Прогресс (1:м)
- Колода → Сессии изучения (1:м)

## 🔒 Безопасность

- Аутентификация через Clerk
- Защищенные API маршруты
- Middleware для проверки авторизации
- Валидация входных данных с Zod
- CORS настройки
- Защита от CSRF атак

---

**Статус**: В разработке ✅  
**Версия**: 1.1.0  
**Последнее обновление**: Октябрь 2025
