import { currentUser } from "@clerk/nextjs/server";
import { UserProfile } from "@clerk/nextjs";

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <h1 className="text-2xl font-bold text-foreground mb-6">
            Панель управления
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Профиль пользователя
              </h2>
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {user?.firstName?.charAt(0) ||
                        user?.emailAddresses[0]?.emailAddress
                          .charAt(0)
                          .toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user?.emailAddresses[0]?.emailAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Статистика
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    Карточки
                  </p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    0
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4">
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Сессии
                  </p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    0
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Настройки профиля
            </h2>
            <UserProfile />
          </div>
        </div>
      </div>
    </div>
  );
}
