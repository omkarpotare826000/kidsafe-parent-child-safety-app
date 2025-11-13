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
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                👧 Kidsafe Band
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Hi, {user?.name}!
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={user?.pairedWith?.length ? 'default' : 'secondary'}>
                {user?.pairedWith?.length ? '✓ Paired' : 'Not Paired'}
              </Badge>
              <Button variant="outline" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Emergency SOS */}
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Emergency SOS
            </CardTitle>
            <CardDescription>
              Press this button in case of emergency. Your parents will be notified immediately.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              size="lg"
              variant={sosTriggered ? 'default' : 'destructive'}
              className="w-full h-20 text-xl font-bold"
              onClick={handleSOS}
              disabled={sosTriggered}
            >
              {sosTriggered ? '✓ SOS SENT!' : '🚨 EMERGENCY SOS'}
            </Button>
            {sosTriggered && (
              <Alert className="mt-4 border-green-500">
                <AlertDescription>
                  Your parents have been notified and will help you!
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Pairing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Parent Pairing
              </CardTitle>
              <CardDescription>
                Enter your parent's 6-digit code to connect
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pairing-code">Pairing Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="pairing-code"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    value={pairingCode}
                    onChange={(e) => setPairingCode(e.target.value.replace(/\D/g, ''))}
                    className="text-center text-2xl tracking-widest"
                  />
                  <Button onClick={handlePairing} disabled={pairingCode.length !== 6}>
                    Pair
                  </Button>
                </div>
              </div>
              {user?.pairedWith && user.pairedWith.length > 0 && (
                <Alert>
                  <AlertDescription>
                    ✓ Connected with {user.pairedWith.length} parent{user.pairedWith.length > 1 ? 's' : ''}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Location Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location Sharing
              </CardTitle>
              <CardDescription>
                Allow your parents to see where you are
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="location-sharing">Share Location</Label>
                  <p className="text-sm text-muted-foreground">
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
                <div className="p-3 bg-muted rounded-lg text-sm">
                  <p className="font-medium">Current Location:</p>
                  <p className="text-muted-foreground">
                    {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Last updated: {new Date(currentLocation.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Band Connection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bluetooth className="w-5 h-5" />
                Kidsafe Band
              </CardTitle>
              <CardDescription>
                Connect your wrist band via Bluetooth
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="band-connection">Band Connection</Label>
                  <p className="text-sm text-muted-foreground">
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
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm flex items-center gap-2">
                      <Battery className="w-4 h-4" />
                      Battery
                    </span>
                    <span className="text-sm font-medium">{Math.round(bandData.battery)}%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Steps
                    </span>
                    <span className="text-sm font-medium">{bandData.steps}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
              <CardDescription>Your current safety status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Location Sharing</span>
                <Badge variant={isSharing ? 'default' : 'secondary'}>
                  {isSharing ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Band Connected</span>
                <Badge variant={bandData.connected ? 'default' : 'secondary'}>
                  {bandData.connected ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Paired with Parent</span>
                <Badge variant={user?.pairedWith?.length ? 'default' : 'secondary'}>
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