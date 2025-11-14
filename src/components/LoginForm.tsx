"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginForm() {
  const { login, signup } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('parent');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let success = false;
      
      if (isSignup) {
        success = await signup(name, email, password, role);
        if (!success) {
          setError('Email already exists. Please use a different email.');
        }
      } else {
        success = await login(email, password);
        if (!success) {
          setError('Invalid email or password.');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-2 sm:mx-0">
      <CardHeader className="space-y-1 p-4 sm:p-6">
        <CardTitle className="text-xl sm:text-2xl font-bold text-center">
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </CardTitle>
        <CardDescription className="text-center text-xs sm:text-sm">
          {isSignup
            ? 'Sign up to start using Kidsafe Band'
            : 'Sign in to your Kidsafe Band account'}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {error && (
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
              <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {isSignup && (
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="name" className="text-xs sm:text-sm">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-9 sm:h-10 text-sm"
              />
            </div>
          )}

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="email" className="text-xs sm:text-sm">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-9 sm:h-10 text-sm"
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="password" className="text-xs sm:text-sm">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-9 sm:h-10 text-sm"
            />
          </div>

          {isSignup && (
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">I am a</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={role === 'parent' ? 'default' : 'outline'}
                  onClick={() => setRole('parent')}
                  className="w-full h-9 sm:h-10 text-xs sm:text-sm"
                >
                  👨‍👩‍👧‍👦 Parent
                </Button>
                <Button
                  type="button"
                  variant={role === 'child' ? 'default' : 'outline'}
                  onClick={() => setRole('child')}
                  className="w-full h-9 sm:h-10 text-xs sm:text-sm"
                >
                  👧 Child
                </Button>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full h-9 sm:h-10 text-sm" disabled={loading}>
            {loading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Sign In'}
          </Button>

          <div className="text-center text-xs sm:text-sm">
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
              }}
              className="text-primary hover:underline"
            >
              {isSignup
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}