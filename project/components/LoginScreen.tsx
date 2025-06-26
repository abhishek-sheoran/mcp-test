'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Car } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (email: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate login validation
    await new Promise(resolve => setTimeout(resolve, 800));

    if (email === '1' && password === '1') {
      onLogin(email);
    } else {
      setError('Invalid credentials. Please try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-[#1C69D4] rounded-full flex items-center justify-center">
              <Car className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to My BMW</h1>
          <p className="text-slate-600">Sign in to schedule your service appointment</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email Address
              </Label>
              <Input
                id="email"
                // type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="h-12 border-slate-200 focus:border-[#1C69D4] focus:ring-[#1C69D4]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="h-12 border-slate-200 focus:border-[#1C69D4] focus:ring-[#1C69D4]"
              />
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700 text-sm">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 bg-[#1C69D4] hover:bg-[#1557B8] text-white font-medium transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <p className="text-sm text-blue-700 font-medium mb-1">Demo Credentials:</p>
              <p className="text-xs text-blue-600">Email: user@example.com</p>
              <p className="text-xs text-blue-600">Password: password123</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}