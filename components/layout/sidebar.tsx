'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Bell,
  Activity,
  CreditCard,
  Mail,
  Settings,
  Menu,
  X,
  LogOut,
  Table,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useUser } from '@/hooks/use-user';

const navigation = [
  { name: 'Gazettes', href: '/gazettes', icon: FileText },
  { name: 'Tabled', href: '/tabled', icon: Table },
  { name: 'Alerts', href: '/alerts', icon: Bell },
  { name: 'Logs', href: '/logs', icon: Activity },
  { name: 'Contact', href: 'https://www.lgradar.com.au/contact', icon: Mail, external: true },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false); // Mobile sidebar state
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop sidebar state
  const pathname = usePathname();
  const { user, signOut } = useUser();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleCollapsed = () => setIsCollapsed(!isCollapsed);

  return (
    <>
      {/* Mobile menu button - positioned in top bar */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 bg-card border-r border-border sidebar-transition',
          'lg:translate-x-0',
          // Mobile behavior
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          // Desktop width based on collapsed state
          isCollapsed ? 'lg:w-16' : 'lg:w-56',
          // Mobile always full width when open
          'w-56',
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header with logo and desktop collapse button */}
          <div className={cn(
            "flex items-center h-16 border-b border-border relative",
            isCollapsed ? "px-2 justify-center" : "px-6 justify-between"
          )}>
            {isCollapsed ? (
              <button
                onClick={toggleCollapsed}
                className="flex items-center space-x-0 mx-auto hover:opacity-80 transition-opacity"
                aria-label="Expand sidebar"
              >
                <Image
                  src="/lgradarlogo.svg"
                  alt="LG Radar"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </button>
            ) : (
              <>
                <Link href="/gazettes" className="flex items-center space-x-2">
                  <Image
                    src="/lgradarlogo.svg"
                    alt="LG Radar"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                  <span className="font-semibold text-lg">LG Radar</span>
                </Link>
                
                {/* Desktop collapse button */}
                <div className="hidden lg:block">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleCollapsed}
                    className="h-8 w-8"
                    aria-label="Toggle sidebar"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Navigation */}
          <nav className={cn(
            "flex-1 py-6 space-y-2",
            isCollapsed ? "px-2" : "px-4"
          )}>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'nav-link',
                    isActive && 'nav-link-active',
                    isCollapsed ? 'justify-center px-2' : 'gap-3 px-3'
                  )}
                  title={isCollapsed ? item.name : undefined}
                  {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <item.icon className="h-5 w-5" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className={cn(
            "border-t border-border",
            isCollapsed ? "p-2" : "p-4"
          )}>
            {isCollapsed ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                  {user?.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={signOut}
                  className="h-8 w-8"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                    {user?.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="w-full justify-start"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main content spacer for desktop */}
      <div className={cn(
        "hidden lg:block flex-shrink-0",
        isCollapsed ? "w-16" : "w-56"
      )} />
    </>
  );
}