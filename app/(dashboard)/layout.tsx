import { Sidebar } from '@/components/layout/sidebar';
import { Footer } from '@/components/layout/footer';
import { AuthGuard } from '@/components/auth/auth-guard';
import { UserProvider } from '@/hooks/use-user';

export const dynamic = 'force-dynamic';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <AuthGuard>
        <div className="flex min-h-screen bg-background">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <main className="flex-1 p-6 lg:p-8">
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </AuthGuard>
    </UserProvider>
  );
}