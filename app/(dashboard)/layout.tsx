import { Sidebar } from '@/components/layout/sidebar';
import { Footer } from '@/components/layout/footer';
import { AuthGuard } from '@/components/auth/auth-guard';
import { SubscriptionGuard } from '@/components/auth/subscription-guard';
import { UserProvider } from '@/hooks/use-user';
import { SubscriptionProvider } from '@/hooks/use-subscription';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <AuthGuard>
        <SubscriptionProvider>
          <SubscriptionGuard>
            <div className="flex min-h-screen bg-background">
              <Sidebar />
              <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile top bar */}
                <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b border-border h-16 flex items-center justify-between px-4">
                  <div className="w-10" /> {/* Spacer for hamburger */}
                  <div className="flex items-center space-x-2">
                    <Image
                      src="/lgradarlogo.svg"
                      alt="LG Radar"
                      width={32}
                      height={32}
                      className="w-8 h-8"
                    />
                    <span className="font-semibold text-lg">LG Radar</span>
                  </div>
                  <div className="w-10" /> {/* Spacer for balance */}
                </div>
                
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-auto pt-20 lg:pt-4 sm:pt-6">
                  {children}
                </main>
                <Footer />
              </div>
            </div>
          </SubscriptionGuard>
        </SubscriptionProvider>
      </AuthGuard>
    </UserProvider>
  );
}