# FlashyCardy

Application for creating and studying flashcards using smart repetition algorithms. Allows users to create card decks, track learning progress, and effectively memorize information.

## Features

- 🔐 User authentication through Clerk
- 📚 Create and manage card decks
- 🎯 Learning system with progress tracking
- 📊 Study session analytics
- 🌙 Dark and light theme support
- 📱 Responsive design

## Technologies

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - Library for building user interfaces
- **TypeScript** - Typed JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI components
- **Lucide React** - Icons

### Backend & Database

- **Drizzle ORM** - TypeScript ORM for database operations
- **PostgreSQL** - Relational database
- **Neon Database** - Serverless PostgreSQL

### Authentication

- **Clerk** - Ready-to-use authentication system

### Styling

- **Tailwind CSS** - CSS framework
- **Tailwind CSS Animate** - Animations for Tailwind
- **next-themes** - Theme switching
- **class-variance-authority** - CSS class utilities

### Development

- **ESLint** - JavaScript/TypeScript linter
- **PostCSS** - CSS processing tool
- **Autoprefixer** - Automatic CSS prefixing

## Getting Started

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build project
npm run build

# Run production version
npm start
```

## Database

```bash
# Generate migrations
npm run db:generate

# Apply migrations
npm run db:migrate

# Run Drizzle Studio
npm run db:studio
```
