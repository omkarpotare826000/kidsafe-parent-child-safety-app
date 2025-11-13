"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Location {
  lat: number;
  lng: number;
  timestamp: number;
  userId: string;
}

export interface SafeZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number; // in meters
  color: string;
}

export interface Alert {
  id: string;
  type: 'sos' | 'zone_exit' | 'zone_entry' | 'low_battery';
  message: string;
  timestamp: number;
  userId: string;
  userName: string;
  acknowledged: boolean;
}

interface LocationContextType {
  locations: { [userId: string]: Location };
  locationHistory: Location[];
  safeZones: SafeZone[];
  alerts: Alert[];
  isSharing: boolean;
  startSharing: () => void;
  stopSharing: () => void;
  addSafeZone: (zone: Omit<SafeZone, 'id'>) => void;
  removeSafeZone: (id: string) => void;
  triggerSOS: () => void;
  acknowledgeAlert: (id: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [locations, setLocations] = useState<{ [userId: string]: Location }>({});
  const [locationHistory, setLocationHistory] = useState<Location[]>([]);
  const [safeZones, setSafeZones] = useState<SafeZone[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isSharing, setIsSharing] = useState(false);

  // Simulate location updates
  useEffect(() => {
    if (isSharing && user) {
      const interval = setInterval(() => {
        // Simulate small movements
        const currentLoc = locations[user.id] || { lat: 40.7128, lng: -74.0060 };
        const newLocation: Location = {
          lat: currentLoc.lat + (Math.random() - 0.5) * 0.001,
          lng: currentLoc.lng + (Math.random() - 0.5) * 0.001,
          timestamp: Date.now(),
          userId: user.id
        };

        setLocations(prev => ({ ...prev, [user.id]: newLocation }));
        setLocationHistory(prev => [...prev.slice(-99), newLocation]);

        // Check geofencing
        checkGeofencing(newLocation);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isSharing, user, locations, safeZones]);

  // Simulate paired children locations for parents
  useEffect(() => {
    if (user?.role === 'parent' && user.pairedWith && user.pairedWith.length > 0) {
      const interval = setInterval(() => {
        user.pairedWith?.forEach((childId, index) => {
          const baseLocations = [
            { lat: 40.7589, lng: -73.9851 }, // Times Square
            { lat: 40.7614, lng: -73.9776 }, // Central Park
            { lat: 40.7580, lng: -73.9855 }, // Nearby
          ];
          
          const baseLoc = baseLocations[index % baseLocations.length];
          const currentLoc = locations[childId] || baseLoc;
          
          const newLocation: Location = {
            lat: currentLoc.lat + (Math.random() - 0.5) * 0.0005,
            lng: currentLoc.lng + (Math.random() - 0.5) * 0.0005,
            timestamp: Date.now(),
            userId: childId
          };

          setLocations(prev => ({ ...prev, [childId]: newLocation }));
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [user]);

  const checkGeofencing = (location: Location) => {
    if (!user) return;

    safeZones.forEach(zone => {
      const distance = calculateDistance(
        location.lat,
        location.lng,
        zone.lat,
        zone.lng
      );

      const isInside = distance <= zone.radius;
      const wasInside = localStorage.getItem(`zone_${zone.id}_${location.userId}`) === 'true';

      if (isInside && !wasInside) {
        // Entered zone
        addAlert({
          type: 'zone_entry',
          message: `${user.name} entered ${zone.name}`,
          userId: location.userId,
          userName: user.name
        });
        localStorage.setItem(`zone_${zone.id}_${location.userId}`, 'true');
      } else if (!isInside && wasInside) {
        // Exited zone
        addAlert({
          type: 'zone_exit',
          message: `${user.name} left ${zone.name}`,
          userId: location.userId,
          userName: user.name
        });
        localStorage.setItem(`zone_${zone.id}_${location.userId}`, 'false');
      }
    });
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const startSharing = () => {
    setIsSharing(true);
  };

  const stopSharing = () => {
    setIsSharing(false);
  };

  const addSafeZone = (zone: Omit<SafeZone, 'id'>) => {
    const newZone = {
      ...zone,
      id: Math.random().toString(36).substr(2, 9)
    };
    setSafeZones(prev => [...prev, newZone]);
  };

  const removeSafeZone = (id: string) => {
    setSafeZones(prev => prev.filter(z => z.id !== id));
  };

  const addAlert = (alert: Omit<Alert, 'id' | 'timestamp' | 'acknowledged'>) => {
    const newAlert: Alert = {
      ...alert,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      acknowledged: false
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const triggerSOS = () => {
    if (user) {
      addAlert({
        type: 'sos',
        message: `🚨 EMERGENCY: ${user.name} triggered SOS alert!`,
        userId: user.id,
        userName: user.name
      });
    }
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === id ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  return (
    <LocationContext.Provider
      value={{
        locations,
        locationHistory,
        safeZones,
        alerts,
        isSharing,
        startSharing,
        stopSharing,
        addSafeZone,
        removeSafeZone,
        triggerSOS,
        acknowledgeAlert
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
