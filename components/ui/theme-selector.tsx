'use client';

import { Monitor, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      value: 'system' as const,
      label: 'System',
      icon: Monitor,
      description: 'Use system preference'
    },
    {
      value: 'light' as const,
      label: 'Light',
      icon: Sun,
      description: 'Light mode'
    },
    {
      value: 'dark' as const,
      label: 'Dark',
      icon: Moon,
      description: 'Dark mode'
    }
  ];

  return (
    <div className="space-y-3">
      {themes.map((themeOption) => {
        const Icon = themeOption.icon;
        const isSelected = theme === themeOption.value;
        
        return (
          <Button
            key={themeOption.value}
            variant={isSelected ? "default" : "outline"}
            className={`w-full justify-start h-auto p-4 ${
              isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
            }`}
            onClick={() => setTheme(themeOption.value)}
          >
            <div className="flex items-center space-x-3">
              <Icon className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">{themeOption.label}</div>
                <div className="text-sm text-muted-foreground">
                  {themeOption.description}
                </div>
              </div>
            </div>
          </Button>
        );
      })}
    </div>
  );
}