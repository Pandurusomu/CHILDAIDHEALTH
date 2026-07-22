import React from 'react';
import { Heart, ShieldCheck, User, PlusCircle, Home, HelpCircle, UserCheck, Shield } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: 'home' | 'apply' | 'faq' | 'profile';
  setActiveTab: (tab: 'home' | 'apply' | 'faq' | 'profile') => void;
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuthModal,
  isAdminLoggedIn,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-800 font-display">
                  ChildAid<span className="text-indigo-600">Health</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Aid
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">Child Healthcare Application & Verification Platform</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 font-semibold text-sm">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
                activeTab === 'home'
                  ? 'bg-indigo-50 text-indigo-600 font-bold'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Children Profiles</span>
            </button>

            <button
              onClick={() => setActiveTab('apply')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
                activeTab === 'apply'
                  ? 'bg-indigo-50 text-indigo-600 font-bold'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>Apply for Aid</span>
            </button>

            <button
              onClick={() => setActiveTab('faq')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
                activeTab === 'faq'
                  ? 'bg-indigo-50 text-indigo-600 font-bold'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>FAQ & Guidance</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
                activeTab === 'profile'
                  ? 'bg-indigo-50 text-indigo-600 font-bold'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>{currentUser?.email?.toLowerCase().trim() === 'foundersomu@gmail.com' ? 'Profile & Admin' : 'My Profile'}</span>
            </button>
          </nav>

          {/* User Auth Action & Admin Badge */}
          <div className="flex items-center gap-3">
            {currentUser?.email?.toLowerCase().trim() === 'foundersomu@gmail.com' && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5 text-indigo-600" /> Admin
              </span>
            )}

            {currentUser ? (
              <button
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2 py-2 px-4 rounded-full border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center text-xs font-bold">
                  {currentUser.username.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[120px] truncate">{currentUser.username}</span>
                <UserCheck className="w-4 h-4 text-emerald-600" />
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold shadow-xs transition-all"
              >
                <User className="w-4 h-4" />
                <span>Clerk Auth Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar Nav */}
      <div className="md:hidden border-t border-slate-200 bg-white px-2 py-2 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 text-xs px-3 py-1 rounded-md ${
            activeTab === 'home' ? 'text-indigo-600 font-bold' : 'text-slate-600'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </button>
        <button
          onClick={() => setActiveTab('apply')}
          className={`flex flex-col items-center gap-1 text-xs px-3 py-1 rounded-md ${
            activeTab === 'apply' ? 'text-indigo-600 font-bold' : 'text-slate-600'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Apply</span>
        </button>
        <button
          onClick={() => setActiveTab('faq')}
          className={`flex flex-col items-center gap-1 text-xs px-3 py-1 rounded-md ${
            activeTab === 'faq' ? 'text-indigo-600 font-bold' : 'text-slate-600'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>FAQ</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 text-xs px-3 py-1 rounded-md ${
            activeTab === 'profile' ? 'text-indigo-600 font-bold' : 'text-slate-600'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </button>
      </div>
    </header>
  );
};
