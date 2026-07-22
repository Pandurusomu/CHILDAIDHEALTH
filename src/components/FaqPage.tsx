import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, ShieldCheck, Heart, FileText, Lock } from 'lucide-react';
import { FAQItem } from '../types';

interface FaqPageProps {
  faqs: FAQItem[];
}

export const FaqPage: React.FC<FaqPageProps> = ({ faqs }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <HelpCircle className="w-4 h-4 text-rose-600" /> Guidance & Support Center
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Learn about our child aid verification procedures, hospital document checks, parent application rules, and direct aid transparency.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-xl mx-auto">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search questions (e.g., verification, hospital documents, admin approval)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-300 bg-white shadow-xs focus:ring-2 focus:ring-rose-500 text-sm text-slate-900"
        />
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Hospital Medical Verification</h4>
            <p className="text-[11px] text-slate-500">Every report is cross-verified with treating doctors.</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Non-Commercialized Focus</h4>
            <p className="text-[11px] text-slate-500">No collection numbers or target counters displayed.</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Direct Family Account Aid</h4>
            <p className="text-[11px] text-slate-500">Direct bank & UPI transfer details provided.</p>
          </div>
        </div>
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-3">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-slate-900 hover:text-rose-600 transition-colors"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-rose-600 tracking-wider block">
                      {faq.category}
                    </span>
                    <span className="text-base sm:text-lg font-display">{faq.question}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-slate-600 border-t border-slate-100 leading-relaxed bg-slate-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
            <p className="text-slate-600 font-medium">No matching questions found.</p>
            <p className="text-xs text-slate-400">Try searching for terms like "documents", "admin", or "verification".</p>
          </div>
        )}
      </div>
    </div>
  );
};
