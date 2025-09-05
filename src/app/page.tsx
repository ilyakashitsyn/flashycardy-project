"use client";

import { useAuth } from "@clerk/nextjs";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  // Показываем загрузку пока проверяем аутентификацию
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Если пользователь залогинен, не показываем содержимое (будет редирект)
  if (isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        {/* Анимированный SVG фон */}
        <div className="animated-bg">
          <svg preserveAspectRatio="xMidYMid slice" viewBox="10 10 80 80">
            <path
              className="out-top"
              d="M37-5C25.1-14.7,5.7-19.1-9.2-10-28.5,1.8-32.7,31.1-19.8,49c15.5,21.5,52.6,22,67.2,2.3C59.4,35,53.7,8.5,37-5Z"
            />
            <path
              className="in-top"
              d="M20.6,4.1C11.6,1.5-1.9,2.5-8,11.2-16.3,23.1-8.2,45.6,7.4,50S42.1,38.9,41,24.5C40.2,14.1,29.4,6.6,20.6,4.1Z"
            />
            <path
              className="out-bottom"
              d="M105.9,48.6c-12.4-8.2-29.3-4.8-39.4.8-23.4,12.8-37.7,51.9-19.1,74.1s63.9,15.3,76-5.6c7.6-13.3,1.8-31.1-2.3-43.8C117.6,63.3,114.7,54.3,105.9,48.6Z"
            />
            <path
              className="in-bottom"
              d="M102,67.1c-9.6-6.1-22-3.1-29.5,2-15.4,10.7-19.6,37.5-7.6,47.8s35.9,3.9,44.5-12.5C115.5,92.6,113.9,74.6,102,67.1Z"
            />
          </svg>
        </div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in">
              <i className="fas fa-sparkles mr-2"></i>
              Новый способ изучения
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in-up">
              FlashyCardy
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
              Ваша персональная платформа для карточек
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-400">
              <SignUpButton mode="modal">
                <button className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Начать бесплатно
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="w-full sm:w-auto px-8 py-4 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-all duration-300 font-semibold text-lg border border-border hover:border-primary/50">
                  Войти
                </button>
              </SignInButton>
            </div>

            <p className="text-sm text-muted-foreground mt-6 animate-fade-in animation-delay-600">
              Без кредитной карты • Начните прямо сейчас
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Почему выбирают FlashyCardy?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Современные инструменты для эффективного изучения
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6 rounded-xl bg-background border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-brain text-2xl text-primary"></i>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                ИИ Генерация
              </h3>
              <p className="text-muted-foreground">
                Создавайте карточки с помощью искусственного интеллекта для
                быстрого изучения
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-background border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-chart-line text-2xl text-primary"></i>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Аналитика
              </h3>
              <p className="text-muted-foreground">
                Отслеживайте прогресс и оптимизируйте процесс изучения
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-background border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-mobile-alt text-2xl text-primary"></i>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Мобильность
              </h3>
              <p className="text-muted-foreground">
                Изучайте в любом месте и в любое время на всех устройствах
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Как это работает?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Простой процесс в три шага
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Создайте колоду
              </h3>
              <p className="text-muted-foreground">
                Создайте новую колоду карточек или используйте ИИ для генерации
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-primary-foreground">
                2
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Добавьте карточки
              </h3>
              <p className="text-muted-foreground">
                Добавьте вопросы и ответы или позвольте ИИ создать их за вас
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Изучайте
              </h3>
              <p className="text-muted-foreground">
                Начните изучение с умной системой повторений
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Выберите свой план
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Начните бесплатно или получите больше возможностей
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-8 rounded-xl bg-background border border-border">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Бесплатно
              </h3>
              <p className="text-3xl font-bold text-primary mb-4">0₽</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-muted-foreground">
                  <i className="fas fa-check text-primary mr-3"></i>
                  До 3 колод карточек
                </li>
                <li className="flex items-center text-muted-foreground">
                  <i className="fas fa-check text-primary mr-3"></i>
                  Базовые функции изучения
                </li>
                <li className="flex items-center text-muted-foreground">
                  <i className="fas fa-check text-primary mr-3"></i>
                  Мобильное приложение
                </li>
              </ul>
              <SignUpButton mode="modal">
                <button className="w-full px-6 py-3 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors font-semibold">
                  Начать бесплатно
                </button>
              </SignUpButton>
            </div>

            <div className="p-8 rounded-xl bg-background border-2 border-primary relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Популярный
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Pro</h3>
              <p className="text-3xl font-bold text-primary mb-4">
                990₽<span className="text-lg text-muted-foreground">/мес</span>
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-muted-foreground">
                  <i className="fas fa-check text-primary mr-3"></i>
                  Неограниченные колоды
                </li>
                <li className="flex items-center text-muted-foreground">
                  <i className="fas fa-check text-primary mr-3"></i>
                  ИИ генерация карточек
                </li>
                <li className="flex items-center text-muted-foreground">
                  <i className="fas fa-check text-primary mr-3"></i>
                  Расширенная аналитика
                </li>
                <li className="flex items-center text-muted-foreground">
                  <i className="fas fa-check text-primary mr-3"></i>
                  Приоритетная поддержка
                </li>
              </ul>
              <Link href="/pricing">
                <button className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold">
                  Узнать больше
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Готовы начать изучение?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Присоединяйтесь к тысячам пользователей, которые уже улучшают свои
              знания с FlashyCardy
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignUpButton mode="modal">
                <button className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Создать аккаунт
                </button>
              </SignUpButton>
              <Link href="/pricing">
                <button className="w-full sm:w-auto px-8 py-4 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-all duration-300 font-semibold text-lg border border-border hover:border-primary/50">
                  Посмотреть цены
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
