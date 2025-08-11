import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-8">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-foreground hover:text-muted-foreground"
            >
              Обзор
            </Link>
            <Link
              href="/dashboard/profile"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Профиль
            </Link>
            <Link
              href="/dashboard/settings"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Настройки
            </Link>
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}
