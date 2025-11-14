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
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white truncate">
                👨‍👩‍👧‍👦 Kidsafe Band
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                Welcome, {user?.name}
              </p>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs h-6 sm:h-7">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">{pairedChildren} Child{pairedChildren !== 1 ? 'ren' : ''}</span>
                <span className="sm:hidden">{pairedChildren}</span>
              </Badge>
              {unacknowledgedAlerts > 0 && (
                <Badge variant="destructive" className="text-xs h-6 sm:h-7 animate-pulse">
                  <Bell className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">{unacknowledgedAlerts} Alert{unacknowledgedAlerts !== 1 ? 's' : ''}</span>
                  <span className="sm:hidden">{unacknowledgedAlerts}</span>
                </Badge>
              )}
              <Button variant="outline" onClick={logout} size="sm" className="h-6 sm:h-9 text-xs sm:text-sm">
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-3 sm:py-6 lg:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1">
            <TabsTrigger value="map" className="flex-col gap-0.5 sm:gap-1 py-1.5 sm:py-2 px-1 sm:px-3 text-xs sm:text-sm">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Live Map</span>
              <span className="sm:hidden">Map</span>
            </TabsTrigger>
            <TabsTrigger value="pairing" className="flex-col gap-0.5 sm:gap-1 py-1.5 sm:py-2 px-1 sm:px-3 text-xs sm:text-sm">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Pairing</span>
              <span className="sm:hidden">Pair</span>
            </TabsTrigger>
            <TabsTrigger value="zones" className="flex-col gap-0.5 sm:gap-1 py-1.5 sm:py-2 px-1 sm:px-3 text-xs sm:text-sm">
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Safe Zones</span>
              <span className="sm:hidden">Zones</span>
            </TabsTrigger>
            <TabsTrigger value="health" className="flex-col gap-0.5 sm:gap-1 py-1.5 sm:py-2 px-1 sm:px-3 text-xs sm:text-sm">
              <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Health Data</span>
              <span className="sm:hidden">Health</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex-col gap-0.5 sm:gap-1 py-1.5 sm:py-2 px-1 sm:px-3 text-xs sm:text-sm relative">
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Alerts</span>
              {unacknowledgedAlerts > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] sm:text-xs">
                  {unacknowledgedAlerts}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="space-y-3 sm:space-y-6 mt-3 sm:mt-6">
            <MapView />
          </TabsContent>

          <TabsContent value="pairing" className="space-y-3 sm:space-y-6 mt-3 sm:mt-6">
            <PairingInterface />
          </TabsContent>

          <TabsContent value="zones" className="space-y-3 sm:space-y-6 mt-3 sm:mt-6">
            <SafeZoneManager />
          </TabsContent>

          <TabsContent value="health" className="space-y-3 sm:space-y-6 mt-3 sm:mt-6">
            <HealthDashboard />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-3 sm:space-y-6 mt-3 sm:mt-6">
            <AlertsPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}