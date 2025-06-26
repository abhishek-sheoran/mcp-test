'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Car, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScheduleService from './ScheduleService';
import { User as UserType } from '@/types';

interface DashboardProps {
  user: UserType;
  onLogout: () => void;
}

const tabs = [
  { id: 'schedule', label: 'Schedule Service', functional: true },
];

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('schedule');

  const renderTabContent = () => {
    const currentTab = tabs.find(tab => tab.id === activeTab);
    
    if (activeTab === 'schedule') {
      return <ScheduleService userEmail={user.email} />;
    }
    
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Car className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{currentTab?.label}</h2>
        <p className="text-slate-600 mb-4">This tab is not functional yet.</p>
        <p className="text-sm text-slate-500">Content for {currentTab?.label} will go here.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#1C69D4] rounded-full flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">My BMW</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-700">{user.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="flex items-center space-x-1"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative py-4 px-1 whitespace-nowrap text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-[#1C69D4] border-b-2 border-[#1C69D4]'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
                {!tab.functional && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-slate-400 rounded-full"></span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-sm border-slate-200">
          <CardContent className="p-0">
            {renderTabContent()}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}