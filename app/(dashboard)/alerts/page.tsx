'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { WelcomePopup } from '@/components/ui/welcome-popup';
import { Plus, Bell, Mail, Trash2, Edit } from 'lucide-react';

// Mock data
const mockAlerts = [
  {
    id: '1',
    name: 'Planning Policy Changes',
    type: 'keyword',
    keywords: ['planning', 'zoning', 'development'],
    is_active: true,
    email_notifications: true,
    daily_summary: false,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'City of Perth Updates',
    type: 'council',
    councils: ['City of Perth'],
    is_active: true,
    email_notifications: true,
    daily_summary: true,
    created_at: '2024-12-15T00:00:00Z',
  },
  {
    id: '3',
    name: 'Heritage Matters',
    type: 'keyword',
    keywords: ['heritage', 'conservation', 'historic'],
    is_active: false,
    email_notifications: false,
    daily_summary: false,
    created_at: '2024-12-01T00:00:00Z',
  },
];

export default function AlertsPage() {
  const searchParams = useSearchParams();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Check if user just completed payment
    const success = searchParams.get('success');
    const sessionId = searchParams.get('session_id');
    
    if (success === 'true' && sessionId) {
      setShowWelcome(true);
      
      // Grant temporary access while webhook processes
      sessionStorage.setItem('stripe_payment_success', JSON.stringify({
        timestamp: new Date().toISOString(),
        sessionId: sessionId,
        plan: 'monthly' // Default, will be updated by webhook
      }));
      
      // Clean up URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete('success');
      url.searchParams.delete('session_id');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  return (
    <>
      <WelcomePopup
        isOpen={showWelcome}
        onClose={() => setShowWelcome(false)}
      />
      
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alerts</h1>
          <p className="text-muted-foreground">
            Manage your notification preferences and keyword alerts
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Alert
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Alerts</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <Bell className="h-8 w-8 text-brand-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email Notifications</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <Mail className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Daily Summaries</p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <Mail className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Global Notification Settings</CardTitle>
          <CardDescription>
            Configure your overall notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Email Notifications</label>
              <p className="text-sm text-muted-foreground">
                Receive email alerts when new relevant gazettes are published
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Daily Summary</label>
              <p className="text-sm text-muted-foreground">
                Get a daily digest of all new gazettes
              </p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Browser Notifications</label>
              <p className="text-sm text-muted-foreground">
                Show browser notifications for urgent alerts
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Alert List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Alerts</CardTitle>
          <CardDescription>
            Manage your custom alerts and keywords
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{alert.name}</h3>
                    <Badge variant={alert.is_active ? 'default' : 'secondary'}>
                      {alert.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {alert.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    {alert.keywords && (
                      <span>Keywords: {alert.keywords.join(', ')}</span>
                    )}
                    {alert.councils && (
                      <span>Councils: {alert.councils.join(', ')}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <span className={alert.email_notifications ? 'text-green-400' : 'text-muted-foreground'}>
                      Email: {alert.email_notifications ? 'On' : 'Off'}
                    </span>
                    <span className={alert.daily_summary ? 'text-green-400' : 'text-muted-foreground'}>
                      Daily Summary: {alert.daily_summary ? 'On' : 'Off'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </>
  );
}