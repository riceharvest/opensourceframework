// @vitest-environment jsdom

import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';
import {
  getUserProfile,
  handleApiResponse,
  loginWithEmailAndPassword,
  registerWithEmailAndPassword,
} from '../examples/vite/src/lib/api';
import { storage } from '../examples/vite/src/lib/utils';

const dbModulePath = '../examples/vite/src/mocks/db';

async function loadDbModule() {
  return import(dbModulePath);
}

describe('examples/vite api helpers', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('handleApiResponse returns parsed JSON on success', async () => {
    const response = new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });

    await expect(handleApiResponse<{ ok: boolean }>(response)).resolves.toEqual({
      ok: true,
    });
  });

  test('handleApiResponse throws generic error on failure', async () => {
    const response = new Response(JSON.stringify({ message: 'internal details' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });

    await expect(handleApiResponse(response)).rejects.toThrow('Request failed. Please try again.');
  });

  test('storage.getToken safely handles malformed values', () => {
    window.localStorage.setItem('token', '{invalid');
    expect(storage.getToken()).toBeNull();

    window.localStorage.setItem('token', JSON.stringify('bad\r\nvalue'));
    expect(storage.getToken()).toBeNull();
  });

  test('getUserProfile only sends Authorization when token is valid', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ user: undefined }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    );

    await getUserProfile();
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      '/auth/me',
      expect.objectContaining({ headers: undefined })
    );

    window.localStorage.setItem('token', JSON.stringify('token-value'));
    await getUserProfile();
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      '/auth/me',
      expect.objectContaining({ headers: { Authorization: 'token-value' } })
    );
  });

  test('login and register send JSON content type', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ jwt: 'token', user: { id: '1', email: 'u@x.dev' } }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    );

    await loginWithEmailAndPassword({ email: 'u@x.dev', password: 'pw' });
    await registerWithEmailAndPassword({
      email: 'u2@x.dev',
      password: 'pw',
      name: 'User',
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      '/auth/login',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      '/auth/register',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });

  test('mock db does not persist passwords in localStorage', async () => {
    const { getUser, setUser, validatePassword } = await loadDbModule();
    const created = await setUser({
      email: 'db@example.com',
      name: 'DB User',
      password: 'secret',
    });

    expect(created).toEqual({
      id: 'db@example.com',
      email: 'db@example.com',
      name: 'DB User',
    });
    expect(getUser('db@example.com')).toEqual(created);
    await expect(validatePassword('db@example.com', 'secret')).resolves.toBe(true);

    const rawDb = window.localStorage.getItem('db_users');
    expect(rawDb).toBeTruthy();
    expect(rawDb).not.toContain('secret');

    const rawCredentials = window.localStorage.getItem('db_credentials');
    expect(rawCredentials).toBeTruthy();
    expect(rawCredentials).not.toContain('secret');
  });

  test('mock db rejects invalid user payloads', async () => {
    const { setUser } = await loadDbModule();
    await expect(setUser({ email: '', name: 'Name', password: 'secret' })).resolves.toBeNull();
    await expect(
      setUser({ email: 'ok@example.com', name: '', password: 'secret' })
    ).resolves.toBeNull();
    await expect(
      setUser({ email: 'ok@example.com', name: 'Name', password: '' })
    ).resolves.toBeNull();
  });

  test('mock db helpers handle missing users and invalid credentials', async () => {
    const { getUser, setUser, validatePassword } = await loadDbModule();
    expect(getUser(null)).toBeUndefined();
    expect(getUser('missing@example.com')).toBeUndefined();

    await expect(validatePassword(null, 'secret')).resolves.toBe(false);
    await expect(validatePassword('missing@example.com', 'secret')).resolves.toBe(false);

    await setUser({
      email: 'alice@example.com',
      name: 'Alice',
      password: 'password-1',
    });
    await expect(validatePassword('alice@example.com', 'bad-password')).resolves.toBe(false);
  });

  test('mock db preserves hashed credentials across reloads', async () => {
    const firstDb = await loadDbModule();
    const created = await firstDb.setUser({
      email: 'reload@example.com',
      name: 'Reload',
      password: 'secret',
    });

    expect(created).toEqual({
      id: 'reload@example.com',
      email: 'reload@example.com',
      name: 'Reload',
    });
    await expect(firstDb.validatePassword('reload@example.com', 'secret')).resolves.toBe(true);

    vi.resetModules();

    const reloadedDb = await loadDbModule();
    expect(reloadedDb.getUser('reload@example.com')).toEqual(created);
    await expect(reloadedDb.validatePassword('reload@example.com', 'secret')).resolves.toBe(true);
  });

  test('storage setToken and clearToken round-trip', () => {
    storage.setToken('roundtrip-token');
    expect(storage.getToken()).toBe('roundtrip-token');
    storage.clearToken();
    expect(storage.getToken()).toBeNull();
  });
});
