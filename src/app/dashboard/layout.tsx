import { ProtectedHeader } from "@/components/ui/protected-header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-semibold text-foreground">
            Панель управления
          </div>
          <ProtectedHeader />
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
