"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/contexts/LocationContext';
import { useBand } from '@/contexts/BandContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LogOut, MapPin, Shield, Users, Activity, Bell } from 'lucide-react';
import MapView from './MapView';
import PairingInterface from './PairingInterface';
import SafeZoneManager from './SafeZoneManager';
import AlertsPanel from './AlertsPanel';
import HealthDashboard from './HealthDashboard';

export default function ParentDashboard() {
  const { user, logout } = useAuth();
  const { locations, alerts } = useLocation();
  const [activeTab, setActiveTab] = useState('map');

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged).length;
  const pairedChildren = user?.pairedWith?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                👨‍👩‍👧‍👦 Kidsafe Band
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome back, {user?.name}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm">
                <Users className="w-4 h-4 mr-1" />
                {pairedChildren} Child{pairedChildren !== 1 ? 'ren' : ''}
              </Badge>
              {unacknowledgedAlerts > 0 && (
                <Badge variant="destructive" className="text-sm animate-pulse">
                  <Bell className="w-4 h-4 mr-1" />
                  {unacknowledgedAlerts} Alert{unacknowledgedAlerts !== 1 ? 's' : ''}
                </Badge>
              )}
              <Button variant="outline" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="map" className="gap-2">
              <MapPin className="w-4 h-4" />
              Live Map
            </TabsTrigger>
            <TabsTrigger value="pairing" className="gap-2">
              <Users className="w-4 h-4" />
              Pairing
            </TabsTrigger>
            <TabsTrigger value="zones" className="gap-2">
              <Shield className="w-4 h-4" />
              Safe Zones
            </TabsTrigger>
            <TabsTrigger value="health" className="gap-2">
              <Activity className="w-4 h-4" />
              Health Data
            </TabsTrigger>
            <TabsTrigger value="alerts" className="gap-2">
              <Bell className="w-4 h-4" />
              Alerts
              {unacknowledgedAlerts > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {unacknowledgedAlerts}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-6">
            <MapView />
          </TabsContent>

          <TabsContent value="pairing" className="space-y-6">
            <PairingInterface />
          </TabsContent>

          <TabsContent value="zones" className="space-y-6">
            <SafeZoneManager />
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <HealthDashboard />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <AlertsPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
