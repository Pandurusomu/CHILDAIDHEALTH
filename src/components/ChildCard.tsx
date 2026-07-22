import React from 'react';
import { Building2, ShieldCheck, Heart, User, Stethoscope, MapPin } from 'lucide-react';
import { ChildAidApplication } from '../types';

interface ChildCardProps {
  application: ChildAidApplication;
  onSelect: (application: ChildAidApplication) => void;
}

export const ChildCard: React.FC<ChildCardProps> = ({ application, onSelect }) => {
  const { child, applicant } = application;

  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden group p-2">
      {/* Image Container with Badge */}
      <div className="relative h-52 w-full bg-slate-100 rounded-[1.5rem] overflow-hidden">
        <img
          src={application.documents?.childPhotoUrl || (child as any)?.childPhotoUrl || 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&q=80&w=800'}
          alt={child.fullName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent" />

        {/* Verification Tag */}
        <div className="absolute top-3 left-3 bg-emerald-100/95 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Hospital Verified</span>
        </div>

        {/* Gender & Age Pill */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="bg-slate-900/90 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-bold border border-white/20">
            {child.age} Yrs • {child.gender}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="text-xl font-extrabold text-slate-800 tracking-tight font-display group-hover:text-indigo-600 transition-colors">
              {child.fullName}
            </h3>
            <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
              #{application.id}
            </span>
          </div>

          <p className="text-indigo-600 font-bold text-xs mb-3">
            Registered Patient • {child.hospitalCity}
          </p>

          {/* Medical Condition Banner */}
          <div className="bg-indigo-50/80 border border-indigo-100 rounded-2xl p-3 mb-3 flex items-start gap-2.5">
            <Stethoscope className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-extrabold text-indigo-900 uppercase tracking-widest">Medical Condition</p>
              <p className="text-xs font-bold text-slate-800 line-clamp-1">{child.diseaseName}</p>
            </div>
          </div>

          {/* Hospital & Location */}
          <div className="space-y-1.5 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2 text-slate-700">
              <Building2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="truncate font-semibold text-slate-800">{child.hospitalName}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{child.hospitalCity}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 pt-0.5">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                Applicant: <strong className="text-slate-700 font-bold capitalize">{applicant.relationship}</strong> ({applicant.fullName})
              </span>
            </div>
          </div>
        </div>

        {/* Action Button - STRICTLY NO MONETARY FIGURES */}
        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={() => onSelect(application)}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs group-hover:bg-indigo-600"
          >
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>View Medical Records & Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};
