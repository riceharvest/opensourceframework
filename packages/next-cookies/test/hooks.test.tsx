/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCookies, useCookie } from '../src/index';

describe('next-cookies hooks', () => {
  beforeEach(() => {
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
  });

  describe('useCookies', () => {
    it('should return cookies', () => {
      document.cookie = 'test=value';
      const { result } = renderHook(() => useCookies());
      expect(result.current[0].test).toBe('value');
    });

    it('should set a cookie', () => {
      const { result } = renderHook(() => useCookies());
      const [, setCookie] = result.current;

      act(() => {
        setCookie('newCookie', 'newValue');
      });

      expect(document.cookie).toContain('newCookie=newValue');
      expect(result.current[0].newCookie).toBe('newValue');
    });

    it('should remove a cookie', () => {
      document.cookie = 'toRemove=val';
      const { result } = renderHook(() => useCookies());
      const [, , removeCookie] = result.current;

      expect(result.current[0].toRemove).toBe('val');

      act(() => {
        removeCookie('toRemove');
      });

      expect(document.cookie).not.toContain('toRemove=val');
      expect(result.current[0].toRemove).toBeUndefined();
    });
  });

  describe('useCookie', () => {
    it('should return cookie value', () => {
      document.cookie = 'test=value';
      const { result } = renderHook(() => useCookie('test'));
      expect(result.current[0]).toBe('value');
    });

    it('should return default value if cookie not set', () => {
      const { result } = renderHook(() => useCookie('missing', 'default'));
      expect(result.current[0]).toBe('default');
    });

    it('should set cookie', () => {
      const { result } = renderHook(() => useCookie('myCookie'));
      const [, setCookie] = result.current;

      act(() => {
        setCookie('myValue');
      });

      expect(document.cookie).toContain('myCookie=myValue');
      expect(result.current[0]).toBe('myValue');
    });

    it('should remove cookie', () => {
      document.cookie = 'rem=val';
      const { result } = renderHook(() => useCookie('rem'));
      const [, , removeCookie] = result.current;

      act(() => {
        removeCookie();
      });

      expect(document.cookie).not.toContain('rem=val');
      expect(result.current[0]).toBeUndefined();
    });
  });
});