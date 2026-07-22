import React, { useState } from 'react';
import {
  User,
  Shield,
  Clock,
  CheckCircle2,
  FileText,
  Lock,
  LogOut,
  Key,
  ShieldAlert,
  ShieldCheck,
  Eye,
  Building2,
  Phone,
} from 'lucide-react';
import { ChildAidApplication, UserProfile } from '../types';
import { AdminPanel } from './AdminPanel';
import { ChildDetailModal } from './ChildDetailModal';

interface ProfilePageProps {
  currentUser: UserProfile | null;
  userApplications: ChildAidApplication[];
  allApplications: ChildAidApplication[];
  onOpenAuthModal: () => void;
  onLogoutUser: () => void;
  isAdminLoggedIn: boolean;
  onAdminLogin: (user: string, pass: string) => Promise<boolean>;
  onAdminLogout: () => void;
  onUpdateApplicationStatus: (id: string, status: 'approved' | 'rejected', feedback?: string) => Promise<void>;
  onRefreshApplications: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  userApplications,
  allApplications,
  onOpenAuthModal,
  onLogoutUser,
  isAdminLoggedIn,
  onAdminLogin,
  onAdminLogout,
  onUpdateApplicationStatus,
  onRefreshApplications,
}) => {
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  const [adminUsername, setAdminUsername] = useState<string>('admin');
  const [adminPassword, setAdminPassword] = useState<string>('admin123');
  const [adminError, setAdminError] = useState<string | null>(null);
  const [selectedUserApp, setSelectedUserApp] = useState<ChildAidApplication | null>(null);

  const isAuthorizedAdmin = currentUser?.email?.toLowerCase().trim() === 'foundersomu@gmail.com';

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    const success = await onAdminLogin(adminUsername, adminPassword);
    if (!success) {
      setAdminError('Invalid specialized admin credentials.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
              Account & Portal Management
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-display mt-1">
            {isAuthorizedAdmin ? 'User Profile & Admin Portal' : 'User Profile Portal'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {isAuthorizedAdmin 
              ? 'Manage submitted applications, review hospital medical records, and issue approvals as Admin.' 
              : 'Track your submitted child healthcare applications and profile details.'}
          </p>
        </div>

        {/* Tab Toggle Switch - Admin button ONLY visible for foundersomu@gmail.com */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('user')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'user' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" /> My Profile & Applications
          </button>
          {isAuthorizedAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-indigo-700 hover:bg-indigo-50'
              }`}
            >
              <Shield className="w-4 h-4" /> Admin Portal Tab
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: USER PROFILE & SUBMITTED APPLICATIONS */}
      {activeTab === 'user' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* User Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            {currentUser ? (
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
                  {currentUser.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900 font-display">{currentUser.username}</h2>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      Clerk Synced
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{currentUser.email}</p>
                  <p className="text-[11px] font-mono text-slate-400 mt-1">Clerk ID: {currentUser.clerkId}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900">Guest User</h2>
                <p className="text-xs text-slate-500">Sign in using Clerk Auth to sync all your submitted applications across sessions.</p>
              </div>
            )}

            <div>
              {currentUser ? (
                <button
                  onClick={onLogoutUser}
                  className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              ) : (
                <button
                  onClick={onOpenAuthModal}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
                >
                  Sign In / Register with Clerk
                </button>
              )}
            </div>
          </div>

          {/* Submitted Applications Tracker */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-600" />
                <span>My Submitted Child Aid Applications ({userApplications.length})</span>
              </h3>
            </div>

            {userApplications.length > 0 ? (
              <div className="space-y-3">
                {userApplications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={app.documents?.childPhotoUrl || (app.child as any)?.childPhotoUrl || 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&q=80&w=800'}
                        alt={app.child.fullName}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            {app.id}
                          </span>
                          {app.status === 'pending' && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-amber-600" /> Pending Admin Review
                            </span>
                          )}
                          {app.status === 'approved' && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Approved & Featured on Home
                            </span>
                          )}
                          {app.status === 'rejected' && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
                              Rejected
                            </span>
                          )}
                        </div>

                        <h4 className="text-base font-bold text-slate-900">{app.child.fullName} ({app.child.age} Yrs)</h4>
                        <p className="text-xs text-slate-600">Disease: <strong>{app.child.diseaseName}</strong></p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedUserApp(app)}
                      className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-4 h-4" /> View Details
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                <p className="text-slate-600 font-semibold text-sm">You have not submitted any child aid applications yet.</p>
                <p className="text-xs text-slate-400">Click on "Apply for Aid" in the navbar to submit a child healthcare case.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ADMIN PORTAL TAB */}
      {activeTab === 'admin' && (
        <div className="animate-in fade-in duration-200">
          {!isAuthorizedAdmin ? (
            <div className="max-w-md mx-auto bg-white rounded-3xl border border-rose-200 p-8 shadow-xl space-y-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto shadow-sm">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold font-display text-slate-900">Admin Access Restricted</h2>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  The Admin Portal and Child Aid application approvals are restricted exclusively to <strong className="text-indigo-600">foundersomu@gmail.com</strong>.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={onOpenAuthModal}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" /> Sign In as Admin (foundersomu@gmail.com)
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-900 text-sm font-bold">
                  <ShieldCheck className="w-5 h-5 text-indigo-700" />
                  <span>Authorized Admin Officer: foundersomu@gmail.com</span>
                </div>
                <button
                  onClick={onAdminLogout}
                  className="px-3 py-1.5 bg-white border border-indigo-300 hover:bg-indigo-100 text-indigo-900 rounded-xl text-xs font-semibold transition-colors"
                >
                  Exit Admin Mode
                </button>
              </div>

              <AdminPanel
                applications={allApplications}
                onUpdateStatus={onUpdateApplicationStatus}
                onRefresh={onRefreshApplications}
              />
            </div>
          )}
        </div>
      )}

      {/* Modal View for User Application */}
      {selectedUserApp && (
        <ChildDetailModal application={selectedUserApp} onClose={() => setSelectedUserApp(null)} />
      )}
    </div>
  );
};
