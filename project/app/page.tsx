'use client';

import { useState } from 'react';
import { User } from '@/types';
import LoginScreen from '@/components/LoginScreen';
import Dashboard from '@/components/Dashboard';
import { mockUser } from '@/types/mock-data';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (email: string) => {
    setUser(mockUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}