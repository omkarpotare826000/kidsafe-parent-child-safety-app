"use client";

import { useState } from 'react';
import { useLocation } from '@/contexts/LocationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Shield, Plus, Trash2, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function SafeZoneManager() {
  const { safeZones, addSafeZone, removeSafeZone } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [zoneName, setZoneName] = useState('');
  const [radius, setRadius] = useState('100');

  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899'];
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const handleAddZone = () => {
    if (zoneName) {
      addSafeZone({
        name: zoneName,
        lat: 40.7589 + (Math.random() - 0.5) * 0.01,
        lng: -73.9851 + (Math.random() - 0.5) * 0.01,
        radius: parseInt(radius),
        color: selectedColor
      });
      setZoneName('');
      setRadius('100');
      setSelectedColor(colors[0]);
      setIsOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Safe Zones
              </CardTitle>
              <CardDescription>
                Set up geographical boundaries and get notified when children enter or leave
              </CardDescription>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Zone
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Safe Zone</DialogTitle>
                  <DialogDescription>
                    Define a new safe zone with custom parameters
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="zone-name">Zone Name</Label>
                    <Input
                      id="zone-name"
                      placeholder="e.g., Home, School, Park"
                      value={zoneName}
                      onChange={(e) => setZoneName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="radius">Radius (meters)</Label>
                    <Input
                      id="radius"
                      type="number"
                      placeholder="100"
                      value={radius}
                      onChange={(e) => setRadius(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Zone Color</Label>
                    <div className="flex gap-2">
                      {colors.map(color => (
                        <button
                          key={color}
                          type="button"
                          className={`w-10 h-10 rounded-full border-2 transition-all ${
                            selectedColor === color ? 'border-black dark:border-white scale-110' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setSelectedColor(color)}
                        />
                      ))}
                    </div>
                  </div>
                  <Button onClick={handleAddZone} className="w-full">
                    Create Safe Zone
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {safeZones.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">No Safe Zones Yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first safe zone to start monitoring
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {safeZones.map((zone) => (
                <div 
                  key={zone.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: zone.color + '20' }}
                    >
                      <Shield className="w-6 h-6" style={{ color: zone.color }} />
                    </div>
                    <div>
                      <p className="font-medium">{zone.name}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {zone.lat.toFixed(4)}, {zone.lng.toFixed(4)}
                        </span>
                        <span>Radius: {zone.radius}m</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      style={{ 
                        backgroundColor: zone.color + '20',
                        color: zone.color,
                        borderColor: zone.color
                      }}
                      className="border"
                    >
                      Active
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeSafeZone(zone.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Safe Zone Info */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{safeZones.length}</div>
              <p className="text-sm text-muted-foreground">Active Zones</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {safeZones.length > 0 ? '✓' : '○'}
              </div>
              <p className="text-sm text-muted-foreground">Monitoring</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">24/7</div>
              <p className="text-sm text-muted-foreground">Protection</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
