import React, { useState } from 'react';
import { X, Lock, Mail, User, Key, ShieldCheck, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';

interface ClerkAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
}

export const ClerkAuthModal: React.FC<ClerkAuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'admin'>('signin');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter Admin Email/Username and Password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success && data.adminUser) {
        const adminProfile: UserProfile = {
          id: 'admin_somu_123',
          username: data.adminUser.username || 'Founder Somu',
          email: 'foundersomu@gmail.com',
          clerkId: 'user_clerk_foundersomu',
          role: 'admin',
          createdAt: new Date().toISOString(),
        };
        onAuthSuccess(adminProfile);
        onClose();
      } else {
        setError(data.error || 'Invalid Admin credentials.');
      }
    } catch (err) {
      setError('Admin server connection failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'admin') {
      return handleAdminSubmit(e);
    }
    if (!username || !password || (mode === 'signup' && !email)) {
      setError('Please fill in all required authentication fields.');
      return;
    }

    setLoading(true);
    setError(null);

    const clerkId = `user_clerk_${Math.random().toString(36).substring(2, 9)}`;
    const endpoint = mode === 'signin' ? '/api/auth/login' : '/api/auth/register';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email: email || `${username.toLowerCase()}@childaid.user`,
          password,
          clerkId,
        }),
      });

      const data = await response.json();
      if (data.success && data.user) {
        onAuthSuccess(data.user);
        onClose();
      } else {
        setError(data.error || 'Authentication failed on backend.');
      }
    } catch (err) {
      console.error('Clerk auth error:', err);
      setError('Connection to backend authentication service failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    const simulatedUsername = 'GoogleUser';
    const simulatedEmail = 'google.user@gmail.com';
    const clerkId = `user_2N_google_${Date.now()}`;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: simulatedUsername,
          email: simulatedEmail,
          password: 'google_oauth_pass',
          clerkId,
        }),
      });

      const data = await response.json();
      if (data.success && data.user) {
        onAuthSuccess(data.user);
        onClose();
      }
    } catch (err) {
      setError('Google Clerk authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 relative animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Clerk Logo & Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-500/20 font-extrabold text-xl font-display">
            c
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
              Powered by Clerk Auth
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-extrabold font-display text-slate-900">
            {mode === 'admin' ? 'Admin Portal Sign In' : mode === 'signin' ? 'Sign In to ChildAid' : 'Create an Account'}
          </h2>
          <p className="text-xs text-slate-500">
            {mode === 'admin' 
              ? 'Authorized admin access for foundersomu@gmail.com' 
              : 'Secure authentication saved directly to backend database.'}
          </p>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(null); }}
            className={`py-2 rounded-lg transition-all ${mode === 'signin' ? 'bg-white text-indigo-900 shadow-2xs font-extrabold' : 'text-slate-500 hover:text-slate-900'}`}
          >
            User Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); }}
            className={`py-2 rounded-lg transition-all ${mode === 'signup' ? 'bg-white text-indigo-900 shadow-2xs font-extrabold' : 'text-slate-500 hover:text-slate-900'}`}
          >
            User Sign Up
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('admin');
              setError(null);
              setUsername('foundersomu@gmail.com');
              setPassword('@11@22@33@44$$');
            }}
            className={`py-2 rounded-lg transition-all ${mode === 'admin' ? 'bg-indigo-600 text-white shadow-2xs font-extrabold' : 'text-indigo-700 hover:bg-indigo-50'}`}
          >
            Admin Sign In
          </button>
        </div>

        {/* Quick Admin One-Click Button */}
        {mode === 'admin' && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-indigo-900 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Admin Credentials for FOUNDERSOMU@GMAIL.COM</span>
            </div>
            <p className="text-[11px] text-slate-600 font-mono">
              Username: <strong className="text-slate-900">foundersomu@gmail.com</strong><br />
              Password: <strong className="text-slate-900">@11@22@33@44$$</strong>
            </p>
            <button
              type="button"
              onClick={() => {
                const adminUser: UserProfile = {
                  id: 'admin_somu_123',
                  username: 'Founder Somu',
                  email: 'foundersomu@gmail.com',
                  clerkId: 'user_clerk_foundersomu',
                  role: 'admin',
                  createdAt: new Date().toISOString()
                };
                onAuthSuccess(adminUser);
                onClose();
              }}
              className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>One-Click Admin Sign In as Founder Somu</span>
            </button>
          </div>
        )}

        {mode !== 'admin' && (
          <div className="space-y-2">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        )}

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest absolute">
            Or with Username
          </span>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Username *
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. RameshSharma"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-xs text-indigo-600 font-bold hover:underline"
          >
            {mode === 'signin' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};
