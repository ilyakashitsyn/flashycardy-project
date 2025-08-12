# Защита маршрутов в FlashyCardy

## Обзор

Проект использует Clerk для аутентификации пользователей. Страница `/dashboard` защищена на нескольких уровнях:

## Уровни защиты

### 1. Middleware (src/middleware.ts)
- Перехватывает все запросы к `/dashboard`
- Проверяет наличие `userId` в сессии
- Автоматически редиректит неавторизованных пользователей на главную страницу

### 2. Компонент ProtectedRoute (src/components/ui/protected-route.tsx)
- Оборачивает содержимое защищенных страниц
- Показывает состояние загрузки во время проверки аутентификации
- Предотвращает рендеринг контента для неавторизованных пользователей

### 3. API защита (src/app/api/decks/route.ts)
- Использует `auth()` от Clerk для проверки пользователя
- Возвращает 401 ошибку для неавторизованных запросов

## Использование

### Защита страницы
```tsx
import { ProtectedRoute } from "@/components/ui/protected-route";

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <YourPageContent />
    </ProtectedRoute>
  );
}
```

### Защита API
```tsx
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Ваша логика API
}
```

## Поведение

1. **Неавторизованный пользователь** пытается зайти на `/dashboard`
2. **Middleware** перехватывает запрос и редиректит на `/`
3. **ProtectedRoute** компонент дополнительно проверяет аутентификацию
4. **API** возвращает ошибку 401 для неавторизованных запросов

## Настройка

Для добавления новых защищенных маршрутов:

1. Добавьте маршрут в middleware
2. Оберните компонент в `ProtectedRoute`
3. Защитите соответствующий API endpoint
