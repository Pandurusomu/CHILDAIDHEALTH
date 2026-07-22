import fs from 'fs';
import path from 'path';
import { ChildAidApplication, FAQItem, NonMonetaryStats, UserProfile } from '../src/types';
import { INITIAL_APPLICATIONS, INITIAL_FAQS, INITIAL_NON_MONETARY_STATS } from '../src/data/initialData';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface DatabaseSchema {
  users: UserProfile[];
  applications: ChildAidApplication[];
  faqs: FAQItem[];
  stats: NonMonetaryStats;
}

// Initial admin user pre-seeded
const DEFAULT_ADMIN: UserProfile = {
  id: 'usr_admin_01',
  clerkId: 'user_clerk_admin_01',
  username: 'admin',
  email: 'admin@childaid.org',
  role: 'admin',
  createdAt: new Date().toISOString(),
};

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadDatabase(): DatabaseSchema {
  ensureDataDir();
  if (!fs.existsSync(DB_FILE)) {
    const initialDb: DatabaseSchema = {
      users: [DEFAULT_ADMIN],
      applications: INITIAL_APPLICATIONS,
      faqs: INITIAL_FAQS,
      stats: INITIAL_NON_MONETARY_STATS,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }

  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    // Remove sample mock applications
    const filteredApps = (parsed.applications || []).filter(
      (app: ChildAidApplication) => !app.id.startsWith('APP-2026-10')
    );
    return {
      users: parsed.users || [DEFAULT_ADMIN],
      applications: filteredApps,
      faqs: parsed.faqs || INITIAL_FAQS,
      stats: parsed.stats || INITIAL_NON_MONETARY_STATS,
    };
  } catch (err) {
    console.error('Error reading db.json, returning initial state:', err);
    return {
      users: [DEFAULT_ADMIN],
      applications: INITIAL_APPLICATIONS,
      faqs: INITIAL_FAQS,
      stats: INITIAL_NON_MONETARY_STATS,
    };
  }
}

function saveDatabase(data: DatabaseSchema): void {
  ensureDataDir();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save to db.json:', err);
  }
}

export async function getUsers(): Promise<UserProfile[]> {
  const db = loadDatabase();
  return db.users;
}

export async function getUserByClerkId(clerkId: string): Promise<UserProfile | null> {
  const db = loadDatabase();
  return db.users.find((u) => u.clerkId === clerkId || u.username === clerkId || u.email === clerkId) || null;
}

export async function createUser(user: Omit<UserProfile, 'id' | 'createdAt'>): Promise<UserProfile> {
  const db = loadDatabase();
  const existing = db.users.find((u) => u.email === user.email || u.username === user.username);
  if (existing) {
    return existing;
  }
  const newUser: UserProfile = {
    ...user,
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);
  saveDatabase(db);
  return newUser;
}

export async function getApplications(statusFilter?: string): Promise<ChildAidApplication[]> {
  const db = loadDatabase();
  if (statusFilter && statusFilter !== 'all') {
    return db.applications.filter((a) => a.status === statusFilter);
  }
  return db.applications;
}

export async function getApplicationById(id: string): Promise<ChildAidApplication | null> {
  const db = loadDatabase();
  return db.applications.find((a) => a.id === id) || null;
}

export async function getApplicationsByUserId(userId: string): Promise<ChildAidApplication[]> {
  const db = loadDatabase();
  return db.applications.filter((a) => a.userId === userId || a.userEmail === userId);
}

export async function createApplication(
  appData: Omit<ChildAidApplication, 'id' | 'submittedAt' | 'status'>
): Promise<ChildAidApplication> {
  const db = loadDatabase();
  const idNumber = Math.floor(1000 + Math.random() * 9000);
  const newApp: ChildAidApplication = {
    ...appData,
    id: `APP-2026-${idNumber}`,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  };
  db.applications.unshift(newApp);
  db.stats.verifiedApplications += 1;
  saveDatabase(db);
  return newApp;
}

export async function updateApplicationStatus(
  id: string,
  status: 'pending' | 'approved' | 'rejected',
  adminFeedback?: string
): Promise<ChildAidApplication | null> {
  const db = loadDatabase();
  const appIndex = db.applications.findIndex((a) => a.id === id);
  if (appIndex === -1) return null;

  const app = db.applications[appIndex];
  app.status = status;
  app.adminFeedback = adminFeedback || app.adminFeedback;
  if (status === 'approved') {
    app.approvedAt = new Date().toISOString();
    db.stats.childrenAssisted += 1;
  }

  db.applications[appIndex] = app;
  saveDatabase(db);
  return app;
}

export async function getFaqs(): Promise<FAQItem[]> {
  const db = loadDatabase();
  return db.faqs;
}

export async function getStats(): Promise<NonMonetaryStats> {
  const db = loadDatabase();
  return db.stats;
}
