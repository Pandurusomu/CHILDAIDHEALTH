import React, { useState } from 'react';
import {
  ShieldCheck,
  Check,
  X,
  FileText,
  Clock,
  Eye,
  User,
  Building2,
  Phone,
  Video,
  CreditCard,
  MessageSquare,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { ChildAidApplication } from '../types';

interface AdminPanelProps {
  applications: ChildAidApplication[];
  onUpdateStatus: (id: string, status: 'approved' | 'rejected', feedback?: string) => Promise<void>;
  onRefresh: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ applications, onUpdateStatus, onRefresh }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedApp, setSelectedApp] = useState<ChildAidApplication | null>(null);
  const [feedbackInput, setFeedbackInput] = useState<string>('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filteredApps = applications.filter((app) => (filter === 'all' ? true : app.status === filter));

  const pendingCount = applications.filter((a) => a.status === 'pending').length;
  const approvedCount = applications.filter((a) => a.status === 'approved').length;
  const rejectedCount = applications.filter((a) => a.status === 'rejected').length;

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    setProcessingId(id);
    await onUpdateStatus(id, status, feedbackInput);
    setProcessingId(null);
    setFeedbackInput('');
    setSelectedApp(null);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30 inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              Specialized Admin Officer Portal
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
              Submitted Child Aid Applications
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Review applicant identity, hospital diagnostic reports, child photos & video proof. Approving a submission instantly publishes the child profile to the Home Page.
            </p>
          </div>

          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold transition-colors border border-white/20"
          >
            Refresh Database List 🔄
          </button>
        </div>

        {/* Stats Filter Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`p-3 rounded-xl border transition-all text-left ${
              filter === 'all'
                ? 'bg-white text-slate-900 border-white font-bold'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <span className="block text-[10px] uppercase font-bold text-slate-400">Total Applications</span>
            <span className="text-lg font-bold font-mono">{applications.length}</span>
          </button>

          <button
            onClick={() => setFilter('pending')}
            className={`p-3 rounded-xl border transition-all text-left ${
              filter === 'pending'
                ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
                : 'bg-amber-950/40 text-amber-200 border-amber-800/60 hover:bg-amber-900/60'
            }`}
          >
            <span className="block text-[10px] uppercase font-bold text-amber-300">Pending Review</span>
            <span className="text-lg font-bold font-mono">{pendingCount}</span>
          </button>

          <button
            onClick={() => setFilter('approved')}
            className={`p-3 rounded-xl border transition-all text-left ${
              filter === 'approved'
                ? 'bg-emerald-400 text-slate-950 border-emerald-300 font-bold'
                : 'bg-emerald-950/40 text-emerald-200 border-emerald-800/60 hover:bg-emerald-900/60'
            }`}
          >
            <span className="block text-[10px] uppercase font-bold text-emerald-300">Approved (Homepage)</span>
            <span className="text-lg font-bold font-mono">{approvedCount}</span>
          </button>

          <button
            onClick={() => setFilter('rejected')}
            className={`p-3 rounded-xl border transition-all text-left ${
              filter === 'rejected'
                ? 'bg-rose-500 text-white border-rose-400 font-bold'
                : 'bg-rose-950/40 text-rose-200 border-rose-800/60 hover:bg-rose-900/60'
            }`}
          >
            <span className="block text-[10px] uppercase font-bold text-rose-300">Rejected</span>
            <span className="text-lg font-bold font-mono">{rejectedCount}</span>
          </button>
        </div>
      </div>

      {/* Application Cards List */}
      <div className="space-y-4">
        {filteredApps.length > 0 ? (
          filteredApps.map((app) => {
            const { child, applicant } = app;
            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={app.documents?.childPhotoUrl || (child as any)?.childPhotoUrl || 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&q=80&w=800'}
                    alt={child.fullName}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {app.id}
                      </span>
                      {app.status === 'pending' && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" /> Pending Approval
                        </span>
                      )}
                      {app.status === 'approved' && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Approved & Live on Home
                        </span>
                      )}
                      {app.status === 'rejected' && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
                          Rejected
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 font-display">{child.fullName} ({child.age} yrs, {child.gender})</h3>
                    <p className="text-xs text-rose-700 font-semibold">{child.diseaseName}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <span>Hospital: <strong>{child.hospitalName}</strong> ({child.hospitalCity})</span>
                      <span>•</span>
                      <span>Guardian: <strong>{applicant.fullName}</strong> ({applicant.relationship})</span>
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="flex-1 md:flex-initial px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-4 h-4 text-slate-600" />
                    <span>Inspect Details</span>
                  </button>

                  {app.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAction(app.id, 'approved')}
                        disabled={processingId === app.id}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-colors disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" /> Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                        }}
                        className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
            <p className="text-slate-600 font-semibold">No applications found under filter "{filter}".</p>
          </div>
        )}
      </div>

      {/* Modal Detailed Inspection & Decision Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full my-8 border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-rose-600">{selectedApp.id}</span>
                <h2 className="text-2xl font-bold font-display text-slate-900">
                  Reviewing {selectedApp.child.fullName}'s Case
                </h2>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Child & Medical Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <p className="text-slate-500">Child Name & Age</p>
                <p className="font-bold text-slate-900">{selectedApp.child.fullName} ({selectedApp.child.age} Yrs, {selectedApp.child.gender})</p>
              </div>
              <div>
                <p className="text-slate-500">Child Aadhaar</p>
                <p className="font-bold font-mono text-slate-900">{selectedApp.child.aadhaarNumber}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-slate-500">Diagnosed Disease</p>
                <p className="font-bold text-rose-900 text-base">{selectedApp.child.diseaseName}</p>
                <p className="text-slate-700 mt-1">{selectedApp.child.diseaseDescription}</p>
              </div>
              <div>
                <p className="text-slate-500">Diagnosing Hospital</p>
                <p className="font-bold text-slate-900">{selectedApp.child.hospitalName} ({selectedApp.child.hospitalCity})</p>
              </div>
              <div>
                <p className="text-slate-500">Treating Doctor</p>
                <p className="font-bold text-slate-900">{selectedApp.child.treatingDoctor || 'On Record'}</p>
              </div>
            </div>

            {/* Guardian & Bank Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200">
              <div>
                <p className="text-emerald-900 font-bold">Guardian ({selectedApp.applicant.relationship})</p>
                <p className="font-semibold text-slate-900">{selectedApp.applicant.fullName} ({selectedApp.applicant.gender}, {selectedApp.applicant.age} Yrs)</p>
                <p className="font-mono text-slate-700">Aadhaar: {selectedApp.applicant.aadhaarNumber}</p>
                <p className="text-slate-700">Mobile: {selectedApp.applicant.mobileNumber}</p>
              </div>

              <div>
                <p className="text-emerald-900 font-bold">Bank & UPI Account</p>
                <p className="font-semibold text-slate-900">Name: {selectedApp.banking.accountHolderName}</p>
                <p className="font-mono text-slate-700">Acc: {selectedApp.banking.accountNumber}</p>
                <p className="font-mono text-slate-700">IFSC: {selectedApp.banking.ifscCode} | UPI: {selectedApp.banking.upiId}</p>
              </div>
            </div>

            {/* Optional Admin Feedback Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Admin Notes / Approval Feedback
              </label>
              <textarea
                rows={2}
                placeholder="Optional verification remarks (e.g., Hospital Cardiology Department confirmed valid)..."
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 text-slate-900"
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(selectedApp.id, 'rejected')}
                disabled={processingId === selectedApp.id}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors disabled:opacity-50"
              >
                Reject Application
              </button>
              <button
                onClick={() => handleAction(selectedApp.id, 'approved')}
                disabled={processingId === selectedApp.id}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors shadow-md disabled:opacity-50"
              >
                Approve & Publish to Homepage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
