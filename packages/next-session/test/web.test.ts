import { describe, expect, it, vi } from 'vitest';
import nextSession from '../src/index';
import MemoryStore from '../src/memory-store';

describe('getWebSession', () => {
  it('should work with standard Request and Headers', async () => {
    const getSession = nextSession();
    const req = new Request('http://localhost:3000');
    const headers = new Headers();
    
    const session = await getSession.getWebSession(req, headers);
    expect(session).toBeDefined();
    expect(session.id).toBeDefined();
    
    session.foo = 'bar';
    await session.commit();
    
    expect(headers.get('set-cookie')).toContain('sid=');
  });

  it('should load existing session from cookie', async () => {
    const store = new MemoryStore();
    const sid = 'test-session-id';
    // Pre-populate store
    await store.set(sid, { cookie: { maxAge: 1000 } });
    
    const getSession = nextSession({ store });
    const req = new Request('http://localhost:3000', {
      headers: {
        cookie: `sid=${sid}`
      }
    });
    const headers = new Headers();
    
    const session = await getSession.getWebSession(req, headers);
    expect(session.id).toBe(sid);
  });

  it('should support destroying session', async () => {
    const getSession = nextSession();
    const req = new Request('http://localhost:3000');
    const headers = new Headers();
    
    const session = await getSession.getWebSession(req, headers);
    await session.destroy();
    
    const setCookie = headers.get('set-cookie');
    expect(setCookie).toContain('Max-Age=-1');
  });
});
