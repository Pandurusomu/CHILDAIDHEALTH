import { ChildAidApplication, FAQItem, NonMonetaryStats } from '../types';

export const INITIAL_NON_MONETARY_STATS: NonMonetaryStats = {
  childrenAssisted: 0,
  hospitalsPartnered: 38,
  verifiedApplications: 0,
  statesCovered: 18,
};

export const INITIAL_APPLICATIONS: ChildAidApplication[] = [];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Application & Process',
    question: 'Who is eligible to apply for child healthcare support?',
    answer: 'Any biological parent, sibling, or legal guardian of a child (under 18 years of age) who has been diagnosed with a severe critical illness by a recognized government or private hospital can apply.',
  },
  {
    id: 'faq-2',
    category: 'Verification & Safety',
    question: 'How are child health profiles verified before being published?',
    answer: 'Our dedicated medical verification board cross-checks every submission by contacting the diagnosing hospital, verifying doctor credentials, reviewing official hospital admission papers, and confirming Aadhaar identities of both guardian and child.',
  },
  {
    id: 'faq-3',
    category: 'Financial Transparency',
    question: 'Why are there no financial amounts or collection targets displayed on the platform?',
    answer: 'To protect the dignity of children and families, ensure absolute transparency, and avoid speculative commercialization, our platform focuses purely on healthcare assistance, medical profile curation, and direct guardian verification rather than public fundraising counters.',
  },
  {
    id: 'faq-4',
    category: 'Documents Required',
    question: 'What documents are required during the application process?',
    answer: 'You will need: 1) Guardian identity proof (Aadhaar number & mobile number), 2) Child identity proof (Aadhaar or Birth Certificate), 3) Official hospital diagnosis/treatment report on hospital letterhead, 4) A clear photo and short video of the child, and 5) Valid bank account/UPI details for direct family support.',
  },
  {
    id: 'faq-5',
    category: 'Admin Approval',
    question: 'How long does it take for an application to be approved by Admin?',
    answer: 'Applications undergo thorough verification and are usually processed within 24 to 48 hours. Once approved by our admin team, the child’s profile is instantly featured on the homepage for visibility.',
  },
  {
    id: 'faq-6',
    category: 'Direct Support',
    question: 'How can supporters assist a child after viewing their profile?',
    answer: 'Supporters can view the child’s hospital verification summary, medical case history, and direct guardian contact details or bank/UPI information provided securely on the verified profile page.',
  },
];
