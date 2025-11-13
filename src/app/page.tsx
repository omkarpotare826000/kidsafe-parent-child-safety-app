"use client";

import { useAuth } from '@/contexts/AuthContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { BandProvider } from '@/contexts/BandContext';
import LoginForm from '@/components/LoginForm';
import ParentDashboard from '@/components/ParentDashboard';
import ChildDashboard from '@/components/ChildDashboard';

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-lg">
              👨‍👩‍👧‍👦 Kidsafe Band
            </h1>
            <p className="text-xl text-white/90 drop-shadow">
              Keep your family safe and connected
            </p>
          </div>
          <div className="flex justify-center">
            <LoginForm />
          </div>
        </div>
      </div>
    );
  }

  return user.role === 'parent' ? <ParentDashboard /> : <ChildDashboard />;
}

export default function Home() {
  return (
    <AuthProvider>
      <LocationProvider>
        <BandProvider>
          <AppContent />
        </BandProvider>
      </LocationProvider>
    </AuthProvider>
  );
}