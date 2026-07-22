import React from 'react';
import { Heart, ShieldCheck, Lock, Building2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'home' | 'apply' | 'faq' | 'profile') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                <Heart className="w-4 h-4 fill-white" />
              </div>
              <span className="text-xl font-extrabold font-display tracking-tight text-white">
                ChildAid<span className="text-indigo-400">Health</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed font-medium">
              A curated healthcare aid platform dedicated to verifying child medical cases, connecting parents/guardians with hospital certification boards, and providing direct family account details.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 pt-1 font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Strict Non-Monetary Transparency Policy</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Quick Links</h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-indigo-400 transition-colors">
                  Children Profiles
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('apply')} className="hover:text-indigo-400 transition-colors">
                  Apply for Child Aid
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('faq')} className="hover:text-indigo-400 transition-colors">
                  FAQ & Medical Process
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('profile')} className="hover:text-indigo-400 transition-colors">
                  Profile & Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Verification Assurance */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Hospital Verification</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              All submitted cases undergo 24–48hr hospital verification with treating doctors prior to admin approval and homepage publication.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-2 font-bold">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>AIIMS • Tata Memorial • Apollo • Fortis</span>
            </div>
          </div>
        </div>

        {/* Status Bar Footer */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
          <p>© 2026 ChildAid Healthcare Foundation.</p>
          <div className="flex items-center gap-6">
            <span className="text-indigo-400">Database: Express & SQLite</span>
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span>Clerk Auth Secured</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
