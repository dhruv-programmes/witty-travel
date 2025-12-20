import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import { useState } from 'react';

const AppLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex bg-ios-bg min-h-screen text-ios-label font-sans selection:bg-ios-blue/30 selection:text-white">
      {/* Mobile Sidebar Overlay (Only on planner pages) */}
      {!isHomePage && (
        <div 
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar (Only on planner pages) */}
      {!isHomePage && (
        <div className={`fixed inset-y-0 left-0 z-50 lg:sticky lg:top-0 lg:h-screen transform transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <Sidebar />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-ios-bg relative z-0">
        {/* Mobile Header (Only on planner pages) */}
        {!isHomePage && (
          <div className="lg:hidden h-14 border-b border-ios-separator flex items-center px-4 bg-ios-card/80 backdrop-blur-md sticky top-0 z-30">
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2 text-ios-blue hover:text-blue-400 transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <span className="ml-2 font-semibold text-white tracking-wide">Travel Agent</span>
          </div>
        )}

        <main className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
