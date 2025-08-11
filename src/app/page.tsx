import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      {/* Main Content */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-6xl font-bold text-foreground mb-8">FlashyCardy</h1>

        <div className="space-y-6 mb-12">
          <div className="text-lg text-muted-foreground">
            <span className="mr-2">1.</span>
            Создавайте карточки для изучения
          </div>

          <div className="text-lg text-muted-foreground">
            <span className="mr-2">2.</span>
            Изучайте с помощью умных алгоритмов
          </div>
        </div>

        {/* Authentication Status */}
        <SignedIn>
          <div className="mb-8 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-800 dark:text-green-200 font-medium">
              ✅ Вы успешно вошли в систему!
            </p>
            <p className="text-green-600 dark:text-green-400 text-sm mt-1">
              Теперь вы можете создавать и изучать карточки
            </p>
          </div>
        </SignedIn>

        <SignedOut>
          <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-blue-800 dark:text-blue-200 font-medium">
              🔐 Войдите в систему для доступа к функциям
            </p>
            <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">
              Используйте кнопки в верхней части страницы
            </p>
          </div>
        </SignedOut>

        {/* Buttons */}
        <div className="flex gap-4 justify-center mb-16">
          <SignedIn>
            <Button className="px-6 py-3">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Начать изучение
            </Button>

            <Button variant="outline" className="px-6 py-3">
              Создать карточки
            </Button>
          </SignedIn>

          <SignedOut>
            <Button className="px-6 py-3" disabled>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Войдите для начала
            </Button>

            <Button variant="outline" className="px-6 py-3" disabled>
              Войдите для создания
            </Button>
          </SignedOut>
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-8 text-sm text-muted-foreground">
        <a
          href="#"
          className="flex items-center gap-2 hover:text-foreground transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Изучить
        </a>

        <a
          href="#"
          className="flex items-center gap-2 hover:text-foreground transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12z"
              clipRule="evenodd"
            />
          </svg>
          Примеры
        </a>

        <a
          href="#"
          className="flex items-center gap-2 hover:text-foreground transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M12 1.586l-4 4V3a1 1 0 10-2 0v4a1 1 0 001 1h4a1 1 0 100-2H9.414l4-4a1 1 0 00-1.414-1.414zM5 5a2 2 0 00-2 2v4a2 2 0 002 2h4a2 2 0 002-2V7a2 2 0 00-2-2H5z"
              clipRule="evenodd"
            />
          </svg>
          Документация →
        </a>
      </div>
    </div>
  );
}
