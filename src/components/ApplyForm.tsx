import React, { useState } from 'react';
import {
  User,
  Heart,
  FileText,
  CreditCard,
  CheckCircle2,
  Upload,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Stethoscope,
  Building2,
  AlertCircle,
  Video,
} from 'lucide-react';
import { ApplicantDetails, BankingDetails, ChildDetails, RelationshipType, UserProfile, VerificationDocuments } from '../types';

interface ApplyFormProps {
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
  onSubmitSuccess: () => void;
}

export const ApplyForm: React.FC<ApplyFormProps> = ({ currentUser, onOpenAuthModal, onSubmitSuccess }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Step 1: Applicant / Guardian Form State
  const [applicant, setApplicant] = useState<ApplicantDetails>({
    relationship: 'parent',
    gender: 'Male',
    fullName: '',
    age: 30,
    aadhaarNumber: '',
    mobileNumber: '',
  });

  // Step 2: Child Details Form State
  const [child, setChild] = useState<ChildDetails>({
    fullName: '',
    age: 5,
    gender: 'Male',
    aadhaarNumber: '',
    diseaseName: '',
    diseaseDescription: '',
    hospitalName: '',
    hospitalCity: '',
    treatingDoctor: '',
  });

  // Step 3: Documents Form State
  const [documents, setDocuments] = useState<VerificationDocuments>({
    childPhotoUrl: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&q=80&w=800',
    hospitalMedicalDocUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
    childVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-little-boy-smiling-at-the-camera-42861-large.mp4',
    hospitalDocFileName: 'Hospital_Diagnostic_Certificate.pdf',
    videoFileName: 'Child_Medical_Condition.mp4',
  });

  // Step 4: Banking Form State
  const [banking, setBanking] = useState<BankingDetails>({
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
  });

  // Photo / File Upload Handlers (converts local files to Base64 or previews)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocuments((prev) => ({ ...prev, childPhotoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHospitalDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocuments((prev) => ({
        ...prev,
        hospitalDocFileName: file.name,
      }));
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocuments((prev) => ({
        ...prev,
        videoFileName: file.name,
      }));
    }
  };

  // Step Validation logic
  const validateStep = (step: number): boolean => {
    setErrorMessage(null);
    if (step === 1) {
      if (!applicant.fullName.trim() || !applicant.aadhaarNumber.trim() || !applicant.mobileNumber.trim()) {
        setErrorMessage('Please fill in applicant name, Aadhaar number, and mobile number.');
        return false;
      }
    } else if (step === 2) {
      if (!child.fullName.trim() || !child.diseaseName.trim() || !child.hospitalName.trim()) {
        setErrorMessage('Please fill in child name, disease name, and hospital name.');
        return false;
      }
    } else if (step === 3) {
      if (!documents.childPhotoUrl) {
        setErrorMessage('Please select or upload a child photo.');
        return false;
      }
    } else if (step === 4) {
      if (!banking.accountHolderName.trim() || !banking.accountNumber.trim() || !banking.ifscCode.trim() || !banking.upiId.trim()) {
        setErrorMessage('Please fill in complete banking and UPI details.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setErrorMessage(null);
    setCurrentStep((prev) => prev - 1);
  };

  // Final Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser?.clerkId || currentUser?.id || 'guest_user',
          userEmail: currentUser?.email || 'guest@childaid.org',
          applicant,
          child,
          documents,
          banking,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSubmittedAppId(data.application.id);
        setIsSubmitting(false);
      } else {
        setErrorMessage(data.error || 'Failed to submit application to backend.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMessage('Network or backend server connection issue.');
      setIsSubmitting(false);
    }
  };

  if (submittedAppId) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            Status: Pending Admin Approval ⏳
          </span>
          <h2 className="text-3xl font-bold font-display text-slate-900">Application Submitted!</h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Your application for <strong>{child.fullName}</strong> has been saved directly to our backend database with Tracking ID:
          </p>
          <div className="inline-block bg-slate-900 text-white font-mono text-lg font-bold px-4 py-2 rounded-xl my-2">
            {submittedAppId}
          </div>
        </div>

        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Our hospital verification board will contact <strong>{child.hospitalName}</strong> to verify the diagnostic reports. Once approved by the admin team, the profile will be published on the homepage.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onSubmitSuccess}
            className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-sm transition-colors"
          >
            Track in My Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="mb-8 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <ShieldCheck className="w-4 h-4 text-rose-600" /> Official Child Aid Application
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
          Apply for Child Healthcare Assistance
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Fill in the verified guardian, child medical condition, diagnostic documents, and banking details. All entries are reviewed by admin officers before approval.
        </p>
      </div>

      {/* Step Progress Bar */}
      <div className="mb-8 bg-white border border-slate-200 rounded-[2rem] p-4 shadow-xs">
        <div className="grid grid-cols-5 gap-2 text-center text-xs font-bold">
          <div className={`p-2.5 rounded-xl transition-all ${currentStep === 1 ? 'bg-indigo-600 text-white shadow-xs' : currentStep > 1 ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-400'}`}>
            <span className="block text-[9px] uppercase tracking-widest font-extrabold">Step 1</span>
            Guardian
          </div>
          <div className={`p-2.5 rounded-xl transition-all ${currentStep === 2 ? 'bg-indigo-600 text-white shadow-xs' : currentStep > 2 ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-400'}`}>
            <span className="block text-[9px] uppercase tracking-widest font-extrabold">Step 2</span>
            Child Details
          </div>
          <div className={`p-2.5 rounded-xl transition-all ${currentStep === 3 ? 'bg-indigo-600 text-white shadow-xs' : currentStep > 3 ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-400'}`}>
            <span className="block text-[9px] uppercase tracking-widest font-extrabold">Step 3</span>
            Documents
          </div>
          <div className={`p-2.5 rounded-xl transition-all ${currentStep === 4 ? 'bg-indigo-600 text-white shadow-xs' : currentStep > 4 ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-400'}`}>
            <span className="block text-[9px] uppercase tracking-widest font-extrabold">Step 4</span>
            Banking
          </div>
          <div className={`p-2.5 rounded-xl transition-all ${currentStep === 5 ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-400'}`}>
            <span className="block text-[9px] uppercase tracking-widest font-extrabold">Step 5</span>
            Review
          </div>
        </div>
      </div>

      {/* Error Message Display */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Form Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-8">
        {/* STEP 1: APPLICANT / GUARDIAN DETAILS */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-rose-600" />
                Step 1: Guardian / Applicant Identification
              </h2>
              <p className="text-xs text-slate-500">
                Please mention who you are (Parent, Sibling, or Legal Guardian) and provide your valid identification.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Relationship Dropdown */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Who are you? (Relationship to Child) *
                </label>
                <select
                  value={applicant.relationship}
                  onChange={(e) => setApplicant({ ...applicant, relationship: e.target.value as RelationshipType })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-rose-500 text-sm font-semibold text-slate-900 transition-all"
                >
                  <option value="parent">Parent (Father / Mother)</option>
                  <option value="sibling">Sibling (Brother / Sister)</option>
                  <option value="guardian">Legal Guardian / Family Caretaker</option>
                </select>
              </div>

              {/* Gender Radio Select */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Applicant Gender *
                </label>
                <div className="flex items-center gap-4 pt-1">
                  {['Male', 'Female', 'Other'].map((g) => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-800">
                      <input
                        type="radio"
                        name="applicantGender"
                        value={g}
                        checked={applicant.gender === g}
                        onChange={() => setApplicant({ ...applicant, gender: g as any })}
                        className="w-4 h-4 text-rose-600 focus:ring-rose-500"
                      />
                      <span>{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Applicant Name */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Applicant Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Sharma"
                  value={applicant.fullName}
                  onChange={(e) => setApplicant({ ...applicant, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-rose-500 text-sm text-slate-900"
                />
              </div>

              {/* Applicant Age */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Applicant Age (Years) *
                </label>
                <input
                  type="number"
                  min="18"
                  max="90"
                  value={applicant.age}
                  onChange={(e) => setApplicant({ ...applicant, age: parseInt(e.target.value) || 18 })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-rose-500 text-sm text-slate-900"
                />
              </div>

              {/* Aadhaar Number */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Applicant Aadhaar Number (Full 12 digits or Last 4) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 8923-4810-4891 or XXXX-XXXX-4891"
                  value={applicant.aadhaarNumber}
                  onChange={(e) => setApplicant({ ...applicant, aadhaarNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-rose-500 text-sm font-mono text-slate-900"
                />
              </div>

              {/* Mobile Number */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Contact Mobile Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g. +91 98765 43210"
                  value={applicant.mobileNumber}
                  onChange={(e) => setApplicant({ ...applicant, mobileNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-rose-500 text-sm text-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: CHILD DETAILS */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-600" />
                Step 2: Child Medical Case Details
              </h2>
              <p className="text-xs text-slate-500">
                Provide details about the child, the diagnosed disease/health condition, and the certifying hospital.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Child Name */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Child Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aarav Sharma"
                  value={child.fullName}
                  onChange={(e) => setChild({ ...child, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-rose-500 text-sm text-slate-900"
                />
              </div>

              {/* Child Age */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Child Age (Years) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="17"
                  value={child.age}
                  onChange={(e) => setChild({ ...child, age: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-rose-500 text-sm text-slate-900"
                />
              </div>

              {/* Child Gender */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Child Gender *
                </label>
                <div className="flex items-center gap-6 pt-1">
                  {['Male', 'Female'].map((g) => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-800">
                      <input
                        type="radio"
                        name="childGender"
                        value={g}
                        checked={child.gender === g}
                        onChange={() => setChild({ ...child, gender: g as any })}
                        className="w-4 h-4 text-rose-600 focus:ring-rose-500"
                      />
                      <span>{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Child Aadhaar Number */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Child Aadhaar Number / Birth Certificate ID *
                </label>
                <input
                  type="text"
                  placeholder="e.g. XXXX-XXXX-7123"
                  value={child.aadhaarNumber}
                  onChange={(e) => setChild({ ...child, aadhaarNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-rose-500 text-sm font-mono text-slate-900"
                />
              </div>

              {/* Health Issue / Disease Name */}
              <div className="space-y-2 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Health Issue / Diagnosed Disease Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ventricular Septal Defect (Congenital Heart Disease)"
                  value={child.diseaseName}
                  onChange={(e) => setChild({ ...child, diseaseName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-rose-500 text-sm font-semibold text-slate-900"
                />
              </div>

              {/* Detailed Description */}
              <div className="space-y-2 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Detailed Medical Case Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe what the medical issue is, current symptoms, and recommended surgery or treatment..."
                  value={child.diseaseDescription}
                  onChange={(e) => setChild({ ...child, diseaseDescription: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-rose-500 text-sm text-slate-900"
                />
              </div>

              {/* Diagnosing Hospital Name */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Which Hospital Confirmed/Diagnosed This? *
                </label>
                <input
                  type="text"
                  placeholder="e.g. AIIMS Delhi / Tata Memorial Hospital"
                  value={child.hospitalName}
                  onChange={(e) => setChild({ ...child, hospitalName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-rose-500 text-sm text-slate-900"
                />
              </div>

              {/* Hospital City */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Hospital City / Location *
                </label>
                <input
                  type="text"
                  placeholder="e.g. New Delhi"
                  value={child.hospitalCity}
                  onChange={(e) => setChild({ ...child, hospitalCity: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-rose-500 text-sm text-slate-900"
                />
              </div>

              {/* Treating Doctor */}
              <div className="space-y-2 sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Treating Doctor / Department
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. V. K. Paul, Head of Pediatric Cardiology"
                  value={child.treatingDoctor}
                  onChange={(e) => setChild({ ...child, treatingDoctor: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-rose-500 text-sm text-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: ISSUED DOCUMENTS */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Step 3: Verification & Media Documents
              </h2>
              <p className="text-xs text-slate-500">
                Upload or link clear documents for child photo, hospital diagnostic certificate, and a short video of the child.
              </p>
            </div>

            <div className="space-y-6">
              {/* Document 1: Child Photo */}
              <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50 space-y-3">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                  1. Child Photo Document *
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={documents.childPhotoUrl}
                    alt="Child preview"
                    className="w-24 h-24 rounded-xl object-cover border border-slate-300 shadow-2xs"
                  />
                  <div className="space-y-2 flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
                    />
                    <p className="text-[11px] text-slate-500">
                      Upload clear photo of the child or keep sample verification photo.
                    </p>
                  </div>
                </div>
              </div>

              {/* Document 2: Hospital Department Certificate */}
              <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50 space-y-3">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                  2. Hospital Diagnostic Department Certificate / Report *
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.png"
                      onChange={handleHospitalDocUpload}
                      className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    <p className="text-[11px] font-semibold text-indigo-900">
                      File Selected: {documents.hospitalDocFileName || 'Hospital_Diagnostic_Certificate.pdf'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Document 3: Child Video Proof */}
              <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50 space-y-3">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                  3. Video Document of Child *
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                    <Video className="w-6 h-6" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
                    />
                    <p className="text-[11px] font-semibold text-rose-900">
                      File Selected: {documents.videoFileName || 'Child_Condition_Proof.mp4'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: BANKING DETAILS */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                Step 4: Verified Banking & UPI Account Details
              </h2>
              <p className="text-xs text-slate-500">
                Provide guardian account details for direct aid transfers. Ensure account holder name matches guardian identity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Account Holder Name */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Account Holder Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Sharma"
                  value={banking.accountHolderName}
                  onChange={(e) => setBanking({ ...banking, accountHolderName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 text-sm font-semibold text-slate-900"
                />
              </div>

              {/* Account Number */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Bank Account Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 309281740129"
                  value={banking.accountNumber}
                  onChange={(e) => setBanking({ ...banking, accountNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 text-sm font-mono text-slate-900"
                />
              </div>

              {/* IFSC Code */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Bank IFSC Code *
                </label>
                <input
                  type="text"
                  placeholder="e.g. SBIN0001234"
                  value={banking.ifscCode}
                  onChange={(e) => setBanking({ ...banking, ifscCode: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 text-sm font-mono uppercase text-slate-900"
                />
              </div>

              {/* UPI ID */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  UPI ID (Google Pay / PhonePe / Paytm / BHIM) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. ramesh.sharma@upi"
                  value={banking.upiId}
                  onChange={(e) => setBanking({ ...banking, upiId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500 text-sm font-mono text-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: FINAL REVIEW */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-rose-600" />
                Step 5: Review & Submit Application
              </h2>
              <p className="text-xs text-slate-500">
                Please double check all submitted details. When submitted, the application will be saved in our backend database for admin approval.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              {/* Applicant Summary */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-2 uppercase text-[11px] text-rose-700">1. Applicant Info</h3>
                <p><strong>Relationship:</strong> {applicant.relationship} ({applicant.gender})</p>
                <p><strong>Name:</strong> {applicant.fullName} ({applicant.age} yrs)</p>
                <p><strong>Aadhaar:</strong> {applicant.aadhaarNumber} | <strong>Mobile:</strong> {applicant.mobileNumber}</p>
              </div>

              {/* Child Summary */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-2 uppercase text-[11px] text-rose-700">2. Child Details</h3>
                <p><strong>Child Name:</strong> {child.fullName} ({child.age} yrs, {child.gender})</p>
                <p><strong>Disease / Issue:</strong> {child.diseaseName}</p>
                <p><strong>Diagnosing Hospital:</strong> {child.hospitalName}, {child.hospitalCity}</p>
              </div>

              {/* Banking Summary */}
              <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
                <h3 className="font-bold text-emerald-950 mb-2 uppercase text-[11px]">3. Account Details</h3>
                <p><strong>Account Holder:</strong> {banking.accountHolderName}</p>
                <p><strong>Account / IFSC:</strong> {banking.accountNumber} | {banking.ifscCode}</p>
                <p><strong>UPI ID:</strong> {banking.upiId}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Navigation Controls */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-sm flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Previous Step
            </button>
          ) : <div />}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-sm"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Saving to Backend Database...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Submit Application for Approval</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
