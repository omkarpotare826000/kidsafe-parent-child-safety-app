"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/contexts/LocationContext';
import { useBand } from '@/contexts/BandContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { LogOut, MapPin, AlertTriangle, Bluetooth, Battery, Activity, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ChildDashboard() {
  const { user, logout, updateUser } = useAuth();
  const { isSharing, startSharing, stopSharing, triggerSOS, locations } = useLocation();
  const { bandData, connectBand, disconnectBand } = useBand();
  const [pairingCode, setPairingCode] = useState('');
  const [sosTriggered, setSosTriggered] = useState(false);

  const currentLocation = user?.id ? locations[user.id] : null;

  const handlePairing = () => {
    if (pairingCode.length === 6) {
      // Mock pairing logic
      const usersData = localStorage.getItem('kidsafe_users');
      if (usersData) {
        const users = JSON.parse(usersData);
        const parent = users.find((u: any) => u.pairingCode === pairingCode);
        
        if (parent) {
          // Add this child to parent's paired list
          if (!parent.pairedWith) {
            parent.pairedWith = [];
          }
          if (!parent.pairedWith.includes(user?.id)) {
            parent.pairedWith.push(user?.id);
          }
          
          // Add parent to child's paired list
          if (!user?.pairedWith) {
            updateUser({ pairedWith: [parent.id] });
          } else if (!user.pairedWith.includes(parent.id)) {
            updateUser({ pairedWith: [...user.pairedWith, parent.id] });
          }
          
          localStorage.setItem('kidsafe_users', JSON.stringify(users));
          alert(`Successfully paired with ${parent.name}!`);
          setPairingCode('');
        } else {
          alert('Invalid pairing code. Please try again.');
        }
      }
    }
  };

  const handleSOS = () => {
    triggerSOS();
    setSosTriggered(true);
    setTimeout(() => setSosTriggered(false), 3000);
  };

  const handleLocationToggle = (checked: boolean) => {
    if (checked) {
      startSharing();
    } else {
      stopSharing();
    }
  };

  const handleBandToggle = (checked: boolean) => {
    if (checked) {
      connectBand();
    } else {
      disconnectBand();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white truncate">
                👧 Kidsafe Band
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                Hi, {user?.name}!
              </p>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Badge variant={user?.pairedWith?.length ? 'default' : 'secondary'} className="text-xs h-6 sm:h-7">
                {user?.pairedWith?.length ? '✓ Paired' : 'Not Paired'}
              </Badge>
              <Button variant="outline" onClick={logout} size="sm" className="h-6 sm:h-9 text-xs sm:text-sm">
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-8 py-3 sm:py-6 lg:py-8 space-y-3 sm:space-y-6">
        {/* Emergency SOS */}
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader className="p-3 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
              Emergency SOS
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Press in case of emergency. Parents notified immediately.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
            <Button
              size="lg"
              variant={sosTriggered ? 'default' : 'destructive'}
              className="w-full h-14 sm:h-16 lg:h-20 text-base sm:text-lg lg:text-xl font-bold"
              onClick={handleSOS}
              disabled={sosTriggered}
            >
              {sosTriggered ? '✓ SOS SENT!' : '🚨 EMERGENCY SOS'}
            </Button>
            {sosTriggered && (
              <Alert className="mt-3 sm:mt-4 border-green-500">
                <AlertDescription className="text-xs sm:text-sm">
                  Your parents have been notified and will help you!
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
          {/* Pairing */}
          <Card>
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                Parent Pairing
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Enter parent's 6-digit code
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0 space-y-3 sm:space-y-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="pairing-code" className="text-xs sm:text-sm">Pairing Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="pairing-code"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    value={pairingCode}
                    onChange={(e) => setPairingCode(e.target.value.replace(/\D/g, ''))}
                    className="text-center text-lg sm:text-xl lg:text-2xl tracking-widest h-10 sm:h-12"
                  />
                  <Button onClick={handlePairing} disabled={pairingCode.length !== 6} size="sm" className="h-10 sm:h-12 text-xs sm:text-sm">
                    Pair
                  </Button>
                </div>
              </div>
              {user?.pairedWith && user.pairedWith.length > 0 && (
                <Alert className="py-2">
                  <AlertDescription className="text-xs sm:text-sm">
                    ✓ Connected with {user.pairedWith.length} parent{user.pairedWith.length > 1 ? 's' : ''}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Location Sharing */}
          <Card>
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                Location Sharing
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Allow parents to see your location
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex-1 min-w-0 mr-2">
                  <Label htmlFor="location-sharing" className="text-xs sm:text-sm">Share Location</Label>
                  <p className="text-xs text-muted-foreground truncate">
                    {isSharing ? 'Location is being shared' : 'Location sharing is off'}
                  </p>
                </div>
                <Switch
                  id="location-sharing"
                  checked={isSharing}
                  onCheckedChange={handleLocationToggle}
                />
              </div>
              {isSharing && currentLocation && (
                <div className="p-2 sm:p-3 bg-muted rounded-lg text-xs sm:text-sm">
                  <p className="font-medium">Current Location:</p>
                  <p className="text-muted-foreground truncate">
                    {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                    Last updated: {new Date(currentLocation.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Band Connection */}
          <Card>
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Bluetooth className="w-4 h-4 sm:w-5 sm:h-5" />
                Kidsafe Band
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Connect wrist band via Bluetooth
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex-1 min-w-0 mr-2">
                  <Label htmlFor="band-connection" className="text-xs sm:text-sm">Band Connection</Label>
                  <p className="text-xs text-muted-foreground">
                    {bandData.connected ? 'Connected' : 'Disconnected'}
                  </p>
                </div>
                <Switch
                  id="band-connection"
                  checked={bandData.connected}
                  onCheckedChange={handleBandToggle}
                />
              </div>
              {bandData.connected && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-muted rounded text-xs sm:text-sm">
                    <span className="flex items-center gap-1.5 sm:gap-2">
                      <Battery className="w-3 h-3 sm:w-4 sm:h-4" />
                      Battery
                    </span>
                    <span className="font-medium">{Math.round(bandData.battery)}%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded text-xs sm:text-sm">
                    <span className="flex items-center gap-1.5 sm:gap-2">
                      <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
                      Steps
                    </span>
                    <span className="font-medium">{bandData.steps}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Status</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Your current safety status</CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0 space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">Location Sharing</span>
                <Badge variant={isSharing ? 'default' : 'secondary'} className="text-xs">
                  {isSharing ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">Band Connected</span>
                <Badge variant={bandData.connected ? 'default' : 'secondary'} className="text-xs">
                  {bandData.connected ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm">Paired with Parent</span>
                <Badge variant={user?.pairedWith?.length ? 'default' : 'secondary'} className="text-xs">
                  {user?.pairedWith?.length ? 'Yes' : 'No'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}