"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface BandData {
  connected: boolean;
  battery: number;
  heartRate: number;
  steps: number;
  temperature: number;
  lastSync: number;
}

interface BandContextType {
  bandData: BandData;
  connectBand: () => void;
  disconnectBand: () => void;
}

const BandContext = createContext<BandContextType | undefined>(undefined);

export function BandProvider({ children }: { children: React.ReactNode }) {
  const [bandData, setBandData] = useState<BandData>({
    connected: false,
    battery: 0,
    heartRate: 0,
    steps: 0,
    temperature: 0,
    lastSync: 0
  });

  // Simulate band data updates when connected
  useEffect(() => {
    if (bandData.connected) {
      const interval = setInterval(() => {
        setBandData(prev => ({
          ...prev,
          battery: Math.max(0, prev.battery - Math.random() * 0.5),
          heartRate: 60 + Math.floor(Math.random() * 40),
          steps: prev.steps + Math.floor(Math.random() * 20),
          temperature: 36 + Math.random() * 1.5,
          lastSync: Date.now()
        }));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [bandData.connected]);

  const connectBand = () => {
    setBandData({
      connected: true,
      battery: 75 + Math.random() * 25,
      heartRate: 70 + Math.floor(Math.random() * 20),
      steps: Math.floor(Math.random() * 5000),
      temperature: 36.5 + Math.random() * 0.5,
      lastSync: Date.now()
    });
  };

  const disconnectBand = () => {
    setBandData({
      connected: false,
      battery: 0,
      heartRate: 0,
      steps: 0,
      temperature: 0,
      lastSync: 0
    });
  };

  return (
    <BandContext.Provider value={{ bandData, connectBand, disconnectBand }}>
      {children}
    </BandContext.Provider>
  );
}

export function useBand() {
  const context = useContext(BandContext);
  if (context === undefined) {
    throw new Error('useBand must be used within a BandProvider');
  }
  return context;
}
