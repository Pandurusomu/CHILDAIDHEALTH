export type RelationshipType = 'parent' | 'sibling' | 'guardian';
export type GenderType = 'Male' | 'Female' | 'Other';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  clerkId: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface ApplicantDetails {
  relationship: RelationshipType;
  gender: GenderType;
  fullName: string;
  age: number;
  aadhaarNumber: string;
  mobileNumber: string;
}

export interface ChildDetails {
  fullName: string;
  age: number;
  gender: 'Male' | 'Female';
  aadhaarNumber: string;
  diseaseName: string;
  diseaseDescription: string;
  hospitalName: string;
  hospitalCity: string;
  treatingDoctor: string;
}

export interface VerificationDocuments {
  childPhotoUrl: string;
  hospitalMedicalDocUrl: string;
  childVideoUrl: string;
  hospitalDocFileName?: string;
  videoFileName?: string;
}

export interface BankingDetails {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
}

export interface ChildAidApplication {
  id: string;
  userId: string;
  userEmail: string;
  status: ApplicationStatus;
  submittedAt: string;
  applicant: ApplicantDetails;
  child: ChildDetails;
  documents: VerificationDocuments;
  banking: BankingDetails;
  adminFeedback?: string;
  approvedAt?: string;
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface NonMonetaryStats {
  childrenAssisted: number;
  hospitalsPartnered: number;
  verifiedApplications: number;
  statesCovered: number;
}
