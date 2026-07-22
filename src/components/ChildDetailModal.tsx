import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Building2,
  User,
  Stethoscope,
  MapPin,
  FileText,
  Video,
  CreditCard,
  Copy,
  Check,
  Phone,
  Heart,
  Calendar,
} from 'lucide-react';
import { ChildAidApplication } from '../types';

interface ChildDetailModalProps {
  application: ChildAidApplication | null;
  onClose: () => void;
}

export const ChildDetailModal: React.FC<ChildDetailModalProps> = ({ application, onClose }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!application) return null;

  const { child, applicant, documents, banking } = application;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full my-8 border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="relative bg-slate-900 text-white p-6 sm:p-8">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={documents?.childPhotoUrl || (child as any)?.childPhotoUrl || 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&q=80&w=800'}
              alt={child.fullName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-white/20 shadow-lg"
            />
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Verified Medical Case
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-300">
                  Application ID: {application.id}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display">{child.fullName}</h2>
              <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-300">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-rose-400" /> {child.age} Years • {child.gender}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-rose-400" /> Aadhaar: {child.aadhaarNumber}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Medical Diagnosis Block */}
          <div className="bg-rose-50/80 border border-rose-200/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-base">
              <Stethoscope className="w-5 h-5 text-rose-600" />
              <span>Medical Diagnosis & Disease Profile</span>
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">{child.diseaseName}</p>
              <p className="text-sm text-slate-700 leading-relaxed mt-1">
                {child.diseaseDescription || 'Case submitted and medical documentation provided under hospital supervision.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-rose-200/60 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-slate-800">
                <Building2 className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Hospital: <strong>{child.hospitalName}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-800">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Location: <strong>{child.hospitalCity}</strong></span>
              </div>
              {child.treatingDoctor && (
                <div className="flex items-center gap-2 text-slate-800 sm:col-span-2">
                  <User className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Treating Doctor: <strong>{child.treatingDoctor}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Verification & Documents Section */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>Submitted Verification Documents</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Medical Certificate Document Box */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Hospital Medical Certificate</p>
                    <p className="text-[11px] text-slate-500">
                      {documents.hospitalDocFileName || 'Hospital_Diagnostic_Report.pdf'}
                    </p>
                  </div>
                </div>
                {documents.hospitalMedicalDocUrl && (
                  <a
                    href={documents.hospitalMedicalDocUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    View Report
                  </a>
                )}
              </div>

              {/* Video Document Box */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Child Video Document</p>
                    <p className="text-[11px] text-slate-500">
                      {documents.videoFileName || 'Child_Condition_Proof.mp4'}
                    </p>
                  </div>
                </div>
                {documents.childVideoUrl ? (
                  <a
                    href={documents.childVideoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors"
                  >
                    Watch Proof
                  </a>
                ) : (
                  <span className="text-xs text-slate-400 italic">Video Verified</span>
                )}
              </div>
            </div>
          </div>

          {/* Applicant / Guardian Details */}
          <div className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-slate-50/50">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-slate-700" />
              <span>Parent / Guardian Contact Information</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <p className="text-slate-500 text-xs">Relationship & Name</p>
                <p className="font-semibold text-slate-900 capitalize">
                  {applicant.relationship} — {applicant.fullName}
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Gender & Age</p>
                <p className="font-semibold text-slate-900">
                  {applicant.gender} • {applicant.age} Years
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Aadhaar Number</p>
                <p className="font-semibold text-slate-900">{applicant.aadhaarNumber}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Verified Contact Mobile</p>
                <p className="font-semibold text-slate-900 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" /> {applicant.mobileNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Direct Bank & UPI Support Details */}
          <div className="border-2 border-emerald-200 bg-emerald-50/50 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-emerald-950">Verified Direct Account Details</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                Direct Family Support
              </span>
            </div>

            <p className="text-xs text-slate-600">
              You can support {child.fullName} directly by making an aid transfer to the guardian’s verified bank or UPI account below:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="bg-white p-3 rounded-xl border border-emerald-200 flex justify-between items-center">
                <div>
                  <span className="text-slate-500 text-[11px] block">Account Holder Name</span>
                  <span className="font-bold text-slate-900">{banking.accountHolderName}</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-emerald-200 flex justify-between items-center">
                <div>
                  <span className="text-slate-500 text-[11px] block">Account Number</span>
                  <span className="font-bold text-slate-900 font-mono">{banking.accountNumber}</span>
                </div>
                <button
                  onClick={() => handleCopy(banking.accountNumber, 'acc')}
                  className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                  title="Copy Account Number"
                >
                  {copiedField === 'acc' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="bg-white p-3 rounded-xl border border-emerald-200 flex justify-between items-center">
                <div>
                  <span className="text-slate-500 text-[11px] block">IFSC Code</span>
                  <span className="font-bold text-slate-900 font-mono">{banking.ifscCode}</span>
                </div>
                <button
                  onClick={() => handleCopy(banking.ifscCode, 'ifsc')}
                  className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                  title="Copy IFSC Code"
                >
                  {copiedField === 'ifsc' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="bg-white p-3 rounded-xl border border-emerald-200 flex justify-between items-center">
                <div>
                  <span className="text-slate-500 text-[11px] block">UPI ID</span>
                  <span className="font-bold text-slate-900 font-mono">{banking.upiId}</span>
                </div>
                <button
                  onClick={() => handleCopy(banking.upiId, 'upi')}
                  className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                  title="Copy UPI ID"
                >
                  {copiedField === 'upi' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 sm:p-6 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            Verified profile curated for child medical aid
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            Close Modal
          </button>
        </div>
      </div>
    </div>
  );
};
