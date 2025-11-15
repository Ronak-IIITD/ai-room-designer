import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  cache,
  createCacheKey,
  APIError,
  withRetry,
} from '../apiUtils';

describe('apiUtils', () => {
  describe('createCacheKey', () => {
    it('should create consistent cache keys', () => {
      const key1 = createCacheKey('test', 'param1', 'param2');
      const key2 = createCacheKey('test', 'param1', 'param2');
      
      expect(key1).toBe(key2);
    });

    it('should create different keys for different inputs', () => {
      const key1 = createCacheKey('test', 'param1');
      const key2 = createCacheKey('test', 'param2');
      
      expect(key1).not.toBe(key2);
    });
  });

  describe('cache', () => {
    beforeEach(() => {
      cache.clear();
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should store and retrieve values', () => {
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
    });

    it('should return null for non-existent keys', () => {
      expect(cache.get('nonexistent')).toBeNull();
    });

    it('should expire values after TTL', () => {
      cache.set('key1', 'value1', 1000);
      expect(cache.get('key1')).toBe('value1');
      
      vi.advanceTimersByTime(1001);
      expect(cache.get('key1')).toBeNull();
    });

    it('should clear all cached values', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.clear();
      
      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBeNull();
    });
  });

  describe('APIError', () => {
    it('should create error with all properties', () => {
      const error = new APIError('Test error', 404, 'NOT_FOUND', true);
      
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(404);
      expect(error.code).toBe('NOT_FOUND');
      expect(error.isRetryable).toBe(true);
    });

    it('should be an instance of Error', () => {
      const error = new APIError('Test', 500, 'ERROR', false);
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('withRetry', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return result on first success', async () => {
      const mockFn = vi.fn().mockResolvedValue('success');
      const result = await withRetry(mockFn);
      
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should retry on retryable errors', async () => {
      const mockFn = vi.fn()
        .mockRejectedValueOnce(new APIError('Error', 500, 'ERROR', true))
        .mockResolvedValueOnce('success');
      
      const promise = withRetry(mockFn, { maxAttempts: 3 });
      await vi.runAllTimersAsync();
      const result = await promise;
      
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should not retry on non-retryable errors', async () => {
      const mockFn = vi.fn()
        .mockRejectedValue(new APIError('Error', 400, 'BAD_REQUEST', false));
      
      await expect(withRetry(mockFn)).rejects.toThrow('Error');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
});
