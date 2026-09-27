import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Landmark, Search, ShieldCheck, UserCheck, LayoutDashboard, FileText, Settings } from 'lucide-react';

export default function Navbar({ currentProfile, onOpenProfileModal }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Find Schemes', path: '/schemes', icon: Search },
    { label: 'Check Eligibility', path: '/eligibility', icon: UserCheck },
    { label: 'Official Sources', path: '/sources', icon: FileText },
    { label: 'Admin Portal', path: '/admin', icon: Settings },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      {/* Tricolor Government Strip */}
      <div className="h-1.5 w-full flex">
        <div className="h-full w-1/3 bg-orange-500"></div>
        <div className="h-full w-1/3 bg-slate-100"></div>
        <div className="h-full w-1/3 bg-emerald-600"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Title */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-xl shadow-md group-hover:bg-blue-800 transition-colors">
              <Landmark className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-lg leading-tight tracking-tight">GOV ASSISTANT</span>
                <span className="text-[10px] uppercase font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Official Portal</span>
              </div>
              <p className="text-xs font-medium text-slate-500">Class 10 & Secondary Schemes Catalogue</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-blue-50 text-blue-900 border-b-2 border-blue-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-blue-700' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Profile Shortcut Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenProfileModal}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 transition-all shadow-xs"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-medium text-slate-500 hidden sm:inline">Profile:</span>
              <span className="text-blue-900 font-bold">{currentProfile.class_name || 'Class 10'} • {currentProfile.state}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
