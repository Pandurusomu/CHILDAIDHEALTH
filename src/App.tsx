import React, { useState, useEffect } from 'react';
import {
  Heart,
  Search,
  ShieldCheck,
  Building2,
  Users,
  MapPin,
  PlusCircle,
  Stethoscope,
  Filter,
  CheckCircle2,
  HelpCircle,
  Lock,
} from 'lucide-react';
import { ChildAidApplication, NonMonetaryStats, UserProfile } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ChildCard } from './components/ChildCard';
import { ChildDetailModal } from './components/ChildDetailModal';
import { ApplyForm } from './components/ApplyForm';
import { FaqPage } from './components/FaqPage';
import { ProfilePage } from './components/ProfilePage';
import { ClerkAuthModal } from './components/ClerkAuthModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'apply' | 'faq' | 'profile'>('home');
  const [approvedChildren, setApprovedChildren] = useState<ChildAidApplication[]>([]);
  const [allApplications, setAllApplications] = useState<ChildAidApplication[]>([]);
  const [userApplications, setUserApplications] = useState<ChildAidApplication[]>([]);
  const [faqs, setFaqs] = useState([]);
  const [stats, setStats] = useState<NonMonetaryStats | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('all');
  const [selectedChildModal, setSelectedChildModal] = useState<ChildAidApplication | null>(null);

  // Authentication & Session State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('childaid_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('childaid_admin_session') === 'true';
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Fetch Data from Express API Endpoints
  const fetchChildren = async () => {
    try {
      const res = await fetch('/api/children');
      if (res.ok) {
        const data = await res.json();
        setApprovedChildren(data);
      }
    } catch (err) {
      console.error('Error fetching children:', err);
    }
  };

  const fetchAllApplications = async () => {
    try {
      const res = await fetch('/api/admin/applications');
      if (res.ok) {
        const data = await res.json();
        setAllApplications(data);
      }
    } catch (err) {
      console.error('Error fetching all applications:', err);
    }
  };

  const fetchUserApplications = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/applications/user/${currentUser.clerkId || currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setUserApplications(data);
      }
    } catch (err) {
      console.error('Error fetching user applications:', err);
    }
  };

  const fetchFaqsAndStats = async () => {
    try {
      const [faqRes, statRes] = await Promise.all([fetch('/api/faqs'), fetch('/api/stats')]);
      if (faqRes.ok) setFaqs(await faqRes.json());
      if (statRes.ok) setStats(await statRes.json());
    } catch (err) {
      console.error('Error fetching faqs/stats:', err);
    }
  };

  useEffect(() => {
    fetchChildren();
    fetchAllApplications();
    fetchFaqsAndStats();
  }, []);

  useEffect(() => {
    fetchUserApplications();
  }, [currentUser]);

  // Auth Handlers
  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('childaid_user', JSON.stringify(user));
    if (user.email?.toLowerCase().trim() === 'foundersomu@gmail.com') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('childaid_admin_session', 'true');
    }
  };

  const handleLogoutUser = () => {
    setCurrentUser(null);
    setIsAdminLoggedIn(false);
    localStorage.removeItem('childaid_user');
    localStorage.removeItem('childaid_admin_session');
    setUserApplications([]);
  };

  const handleAdminLogin = async (user: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass }),
      });
      const data = await res.json();
      if (data.success) {
        const adminUserProfile: UserProfile = {
          id: 'admin_somu_123',
          username: 'Founder Somu',
          email: 'foundersomu@gmail.com',
          clerkId: 'user_clerk_foundersomu',
          role: 'admin',
          createdAt: new Date().toISOString(),
        };
        handleAuthSuccess(adminUserProfile);
        setIsAdminLoggedIn(true);
        localStorage.setItem('childaid_admin_session', 'true');
        fetchAllApplications();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('childaid_admin_session');
    handleLogoutUser();
  };

  const handleUpdateApplicationStatus = async (id: string, status: 'approved' | 'rejected', feedback?: string) => {
    try {
      const res = await fetch(`/api/admin/applications/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminFeedback: feedback }),
      });
      if (res.ok) {
        await fetchChildren();
        await fetchAllApplications();
        await fetchUserApplications();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Filtered Approved Children for Homepage
  const filteredChildren = approvedChildren.filter((childApp) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      childApp.child.fullName.toLowerCase().includes(query) ||
      childApp.child.diseaseName.toLowerCase().includes(query) ||
      childApp.child.hospitalName.toLowerCase().includes(query) ||
      childApp.child.hospitalCity.toLowerCase().includes(query);

    const matchesCity = selectedCityFilter === 'all' || childApp.child.hospitalCity.toLowerCase() === selectedCityFilter.toLowerCase();

    return matchesSearch && matchesCity;
  });

  const uniqueCities = Array.from(new Set(approvedChildren.map((a) => a.child.hospitalCity)));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      {/* Top Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* TAB 1: HOMEPAGE (CHILDREN PROFILES - STRICTLY NO MONETARY FIGURES) */}
        {activeTab === 'home' && (
          <div className="space-y-12 pb-12">
            {/* Hero Banner Header */}
            <section className="px-4 pt-6 max-w-7xl mx-auto">
              <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-[2.5rem] p-8 sm:p-14 shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500 rounded-full blur-[120px] opacity-20 -mr-32 -mt-32"></div>
                <div className="absolute left-0 bottom-0 w-64 h-64 bg-rose-500 rounded-full blur-[100px] opacity-20 -ml-32 -mb-32"></div>

                <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-white/10 text-rose-300 border border-white/10 uppercase tracking-widest backdrop-blur-md">
                    <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                    Direct Child Healthcare Support
                  </div>

                  <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight max-w-3xl mx-auto leading-tight">
                    Verified Profiles for <span className="text-rose-400 italic">Children in Need</span>
                  </h1>

                  <p className="text-sm sm:text-base text-indigo-200 max-w-2xl mx-auto leading-relaxed font-medium">
                    Support the medical journey of brave children. Every profile is certified with treating hospitals and authorized medical boards across top healthcare institutions.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                    <button
                      onClick={() => setActiveTab('apply')}
                      className="px-6 py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold shadow-lg shadow-rose-500/30 flex items-center gap-2 transition-all"
                    >
                      <PlusCircle className="w-5 h-5" />
                      <span>Submit Child Aid Application</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('faq')}
                      className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold border border-white/10 flex items-center gap-2 transition-all"
                    >
                      <HelpCircle className="w-5 h-5" />
                      <span>Medical Verification Process</span>
                    </button>
                  </div>

                  {/* Non-Monetary Stats Row */}
                  {stats && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 text-center">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                        <p className="text-2xl sm:text-3xl font-black font-mono text-rose-400">{stats.childrenAssisted}+</p>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-200 mt-1">Children Assisted</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                        <p className="text-2xl sm:text-3xl font-black font-mono text-indigo-300">{stats.hospitalsPartnered}</p>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-200 mt-1">Hospitals Partnered</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                        <p className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">{stats.verifiedApplications}</p>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-200 mt-1">Verified Cases</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                        <p className="text-2xl sm:text-3xl font-black font-mono text-amber-400">{stats.statesCovered}</p>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-200 mt-1">States Covered</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Search & Filter Controls */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Search Box */}
                <div className="relative flex-1 w-full">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search child name, medical condition, or hospital..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium text-slate-900 bg-slate-50/50"
                  />
                </div>

                {/* City Filter */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="w-4 h-4 text-indigo-600 shrink-0" />
                  <select
                    value={selectedCityFilter}
                    onChange={(e) => setSelectedCityFilter(e.target.value)}
                    className="w-full sm:w-auto px-4 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 bg-slate-50 focus:bg-white"
                  >
                    <option value="all">All Hospital Cities</option>
                    {uniqueCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Children Cards Grid */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <Stethoscope className="w-6 h-6 text-indigo-600" />
                      <span>Verified Children Cases ({filteredChildren.length})</span>
                    </h2>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">Explore medical verification details and official hospital records.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('apply')}
                    className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-rose-200"
                  >
                    <PlusCircle className="w-4 h-4" /> Apply for Child Aid
                  </button>
                </div>

                {filteredChildren.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredChildren.map((app) => (
                      <ChildCard key={app.id} application={app} onSelect={setSelectedChildModal} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-[2rem] border border-slate-200 p-12 text-center space-y-3">
                    <p className="text-lg font-bold text-slate-800">No matching child profiles found.</p>
                    <p className="text-xs text-slate-500">Try adjusting your search query or city selection.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: APPLY PAGE */}
        {activeTab === 'apply' && (
          <ApplyForm
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onSubmitSuccess={() => {
              fetchChildren();
              fetchAllApplications();
              fetchUserApplications();
              setActiveTab('profile');
            }}
          />
        )}

        {/* TAB 3: FAQ PAGE */}
        {activeTab === 'faq' && <FaqPage faqs={faqs} />}

        {/* TAB 4: PROFILE & ADMIN PAGE */}
        {activeTab === 'profile' && (
          <ProfilePage
            currentUser={currentUser}
            userApplications={userApplications}
            allApplications={allApplications}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onLogoutUser={handleLogoutUser}
            isAdminLoggedIn={isAdminLoggedIn}
            onAdminLogin={handleAdminLogin}
            onAdminLogout={handleAdminLogout}
            onUpdateApplicationStatus={handleUpdateApplicationStatus}
            onRefreshApplications={() => {
              fetchChildren();
              fetchAllApplications();
            }}
          />
        )}
      </main>

      {/* Selected Child Detail Modal */}
      <ChildDetailModal
        application={selectedChildModal}
        onClose={() => setSelectedChildModal(null)}
      />

      {/* Clerk Auth Dialog */}
      <ClerkAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Footer Component */}
      <Footer onNavigate={setActiveTab} />
    </div>
  );
}
