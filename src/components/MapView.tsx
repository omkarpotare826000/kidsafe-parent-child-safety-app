"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from '@/contexts/LocationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users } from 'lucide-react';

export default function MapView() {
  const { user } = useAuth();
  const { locations, safeZones } = useLocation();

  const childLocations = user?.pairedWith?.map(childId => ({
    id: childId,
    location: locations[childId]
  })).filter(c => c.location) || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Live Location Map
          </CardTitle>
          <CardDescription>
            Real-time tracking of your children's locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-[500px] bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 rounded-lg overflow-hidden">
            {/* Map Background */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=600&fit=crop')] bg-cover bg-center opacity-30"></div>
            
            {/* Grid overlay to simulate map */}
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}></div>

            {/* Safe Zones */}
            {safeZones.map((zone, index) => {
              const x = 50 + (index * 15) % 60;
              const y = 30 + (index * 20) % 50;
              return (
                <div
                  key={zone.id}
                  className="absolute rounded-full border-4 border-dashed opacity-40"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    width: '120px',
                    height: '120px',
                    borderColor: zone.color,
                    backgroundColor: zone.color + '20',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-semibold" style={{ color: zone.color }}>
                      {zone.name}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Child Locations */}
            {childLocations.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-6 bg-white/80 dark:bg-gray-800/80 rounded-lg backdrop-blur">
                  <Users className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="font-medium">No Children Paired</p>
                  <p className="text-sm text-muted-foreground">
                    Add children using the Pairing tab
                  </p>
                </div>
              </div>
            ) : (
              childLocations.map((child, index) => {
                const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
                const color = colors[index % colors.length];
                const x = 30 + (index * 20) % 50;
                const y = 40 + (index * 15) % 40;
                
                return (
                  <div
                    key={child.id}
                    className="absolute animate-pulse"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {/* Ping animation */}
                    <div className="absolute inset-0 rounded-full animate-ping" style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: color,
                      opacity: 0.4
                    }}></div>
                    
                    {/* Marker */}
                    <div 
                      className="relative flex items-center justify-center w-10 h-10 rounded-full shadow-lg"
                      style={{ backgroundColor: color }}
                    >
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    
                    {/* Label */}
                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <Badge style={{ backgroundColor: color }} className="text-white">
                        Child {index + 1}
                      </Badge>
                    </div>
                  </div>
                );
              })
            )}

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur p-4 rounded-lg shadow-lg">
              <h4 className="text-sm font-semibold mb-2">Legend</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span>Child Location</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-dashed border-green-500"></div>
                  <span>Safe Zone</span>
                </div>
              </div>
            </div>

            {/* Coordinates Display */}
            <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur p-3 rounded-lg shadow-lg">
              <h4 className="text-sm font-semibold mb-2">Active Locations</h4>
              <div className="space-y-1 text-xs">
                {childLocations.map((child, index) => (
                  <div key={child.id} className="flex items-center gap-2">
                    <Badge variant="outline">Child {index + 1}</Badge>
                    <span className="text-muted-foreground">
                      {child.location?.lat.toFixed(4)}, {child.location?.lng.toFixed(4)}
                    </span>
                  </div>
                ))}
                {childLocations.length === 0 && (
                  <p className="text-muted-foreground">No active locations</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{childLocations.length}</div>
              <p className="text-sm text-muted-foreground">Active Trackers</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{safeZones.length}</div>
              <p className="text-sm text-muted-foreground">Safe Zones</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {childLocations.length > 0 ? 'Live' : 'Offline'}
              </div>
              <p className="text-sm text-muted-foreground">Tracking Status</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
