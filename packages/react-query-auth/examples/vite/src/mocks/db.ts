export type DBUser = {
  email: string;
  name: string;
  password: string;
};

export type PublicUser = {
  id: string;
  email: string;
  name: string;
};

const USERS_STORAGE_KEY = 'db_users';
const CREDENTIALS_STORAGE_KEY = 'db_credentials';

function readStoredUsers(): Record<string, PublicUser> {
  const raw = window.localStorage.getItem(USERS_STORAGE_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as Record<string, Partial<PublicUser>>;
    const safeUsers: Record<string, PublicUser> = {};
    for (const [email, user] of Object.entries(parsed)) {
      if (typeof email !== 'string') continue;
      if (!user || typeof user !== 'object') continue;
      if (
        typeof user.id === 'string' &&
        typeof user.email === 'string' &&
        typeof user.name === 'string'
      ) {
        safeUsers[email] = user as PublicUser;
      }
    }
    return safeUsers;
  } catch {
    return {};
  }
}

function readStoredCredentials(): Record<string, string> {
  const raw = window.localStorage.getItem(CREDENTIALS_STORAGE_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const safeCredentials: Record<string, string> = {};
    for (const [email, hash] of Object.entries(parsed)) {
      if (typeof email !== 'string') continue;
      if (typeof hash !== 'string' || !hash) continue;
      safeCredentials[email] = hash;
    }
    return safeCredentials;
  } catch {
    return {};
  }
}

const users: Record<string, PublicUser> = readStoredUsers();
const credentials: Record<string, string> = readStoredCredentials();

function persistDb() {
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  window.localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(credentials));
}

async function hashPassword(password: string): Promise<string> {
  if (globalThis.crypto?.subtle) {
    const encoded = new TextEncoder().encode(password);
    const digest = await globalThis.crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  // Example-only fallback when SubtleCrypto is unavailable. It avoids storing raw
  // passwords but should not be used as production-grade password hashing.
  let hash = 2166136261;
  for (const char of password) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

export async function setUser(data: DBUser) {
  if (!data?.email || !data?.name || !data?.password) return null;

  const email = data.email.trim();
  const name = data.name.trim();
  const password = data.password;
  if (!email || !name || !password) return null;

  const safeUser: PublicUser = { id: email, email, name };
  users[email] = safeUser;
  credentials[email] = await hashPassword(password);
  persistDb();

  return safeUser;
}

export function getUser(email: string | null) {
  if (!email) return undefined;
  return users[email];
}

export async function validatePassword(email: string | null, password: string | null) {
  if (!email || !password) return false;
  const storedHash = credentials[email];
  if (!storedHash) return false;
  const providedHash = await hashPassword(password);
  return storedHash === providedHash;
}
