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
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </CardTitle>
        <CardDescription className="text-center">
          {isSignup
            ? 'Sign up to start using Kidsafe Band'
            : 'Sign in to your Kidsafe Band account'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isSignup && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isSignup && (
            <div className="space-y-2">
              <Label>I am a</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={role === 'parent' ? 'default' : 'outline'}
                  onClick={() => setRole('parent')}
                  className="w-full"
                >
                  👨‍👩‍👧‍👦 Parent
                </Button>
                <Button
                  type="button"
                  variant={role === 'child' ? 'default' : 'outline'}
                  onClick={() => setRole('child')}
                  className="w-full"
                >
                  👧 Child
                </Button>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Sign In'}
          </Button>

          <div className="text-center text-sm">
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
