"use client"
import React, { useState } from 'react';
import { Home, Plus, MessageSquare, Users, Bell, Settings, LogOut } from 'lucide-react';

export default function SocializePage() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Plus, label: 'Post', path: '/post' },
    { icon: MessageSquare, label: 'My Messages', path: '/messages' },
    { icon: Users, label: 'Friends', path: '/friends' },
    { icon: Bell, label: 'Notifications', path: '/notifications', badge: 3 },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-6">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-32 w-80 h-80 bg-indigo-400/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative flex gap-6 h-full">
        {/* Main Sidebar */}
        <div className={`transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-80'}`}>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-2xl h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                {!isCollapsed && (
                  <div>
                    <h1 className="text-white text-2xl font-bold">Elitnite</h1>
                  </div>
                )}
              </div>
              <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-white/70 hover:text-white transition-colors p-1"
              >
                {isCollapsed ? '→' : '←'}
              </button>
            </div>

            {/* User Profile */}
            {!isCollapsed && (
              <div className="flex items-center gap-3 mb-8 p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">P</span>
                </div>
                <div>
                  <h2 className="text-white font-semibold">Elitnite</h2>
                  <p className="text-white/70 text-sm">My Account</p>
                </div>
              </div>
            )}

            {/* Menu */}
            <div className="mb-8">
              {!isCollapsed && (
                <h3 className="text-white/70 text-sm font-semibold mb-4 tracking-wider">MENU</h3>
              )}
              
              <nav className="space-y-2">
                {menuItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.path}
                    className="flex items-center gap-3 p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group relative"
                  >
                    <item.icon className="w-5 h-5" />
                    {!isCollapsed && (
                      <>
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                    {isCollapsed && item.badge && (
                      <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </a>
                ))}
              </nav>
            </div>

            {/* Divider */}
            <div className="border-t border-white/20 mb-6"></div>

            {/* Logout */}
            <button className="flex items-center gap-3 p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 w-full">
              <LogOut className="w-5 h-5" />
              {!isCollapsed && <span className="font-medium">Log Out</span>}
            </button>
          </div>
        </div>

        {/* Collapsed Sidebar Preview */}
        {isCollapsed && (
          <div className="w-20">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 shadow-2xl">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                
                <div className="space-y-3">
                  {menuItems.map((item, index) => (
                    <div key={index} className="relative">
                      <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                        <item.icon className="w-5 h-5" />
                      </button>
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/20 w-full"></div>
                
                <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1">
          <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl h-full">
            <div className="text-center text-white/80">
              <h2 className="text-3xl font-bold mb-4">Welcome to Elitnite</h2>
              <p className="text-lg text-white/60">Your main content area would go here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}