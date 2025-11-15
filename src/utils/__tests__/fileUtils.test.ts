import { describe, it, expect } from 'vitest';
import {
  validateFile,
  getFileExtension,
  formatFileSize,
  defaultImageValidation,
} from '../fileUtils';

describe('fileUtils', () => {
  describe('getFileExtension', () => {
    it('should extract file extension correctly', () => {
      expect(getFileExtension('image.jpg')).toBe('.jpg');
      expect(getFileExtension('document.PDF')).toBe('.pdf');
      expect(getFileExtension('file.name.with.dots.png')).toBe('.png');
    });

    it('should handle files without extensions', () => {
      expect(getFileExtension('noextension')).toBe('');
    });

    it('should handle empty strings', () => {
      expect(getFileExtension('')).toBe('');
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });

    it('should format decimal values', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(1048576 + 524288)).toBe('1.5 MB');
    });

    it('should handle large numbers', () => {
      expect(formatFileSize(10 * 1024 * 1024)).toBe('10 MB');
      expect(formatFileSize(100 * 1024 * 1024)).toBe('100 MB');
    });
  });

  describe('validateFile', () => {
    const createMockFile = (
      name: string,
      size: number,
      type: string
    ): File => {
      const file = new File([''], name, { type });
      Object.defineProperty(file, 'size', { value: size });
      return file;
    };

    it('should validate a valid image file', () => {
      const file = createMockFile('image.jpg', 1024 * 1024, 'image/jpeg');
      const result = validateFile(file);
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
      expect(result.details).toEqual({
        size: 1024 * 1024,
        type: 'image/jpeg',
        extension: '.jpg',
      });
    });

    it('should reject files that are too large', () => {
      const file = createMockFile('large.jpg', 15 * 1024 * 1024, 'image/jpeg');
      const result = validateFile(file);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('exceeds the maximum allowed size');
    });

    it('should reject unsupported MIME types', () => {
      const file = createMockFile('document.pdf', 1024, 'application/pdf');
      const result = validateFile(file);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('not supported');
    });

    it('should accept PNG files', () => {
      const file = createMockFile('image.png', 1024, 'image/png');
      const result = validateFile(file);
      
      expect(result.isValid).toBe(true);
    });

    it('should accept WebP files', () => {
      const file = createMockFile('image.webp', 1024, 'image/webp');
      const result = validateFile(file);
      
      expect(result.isValid).toBe(true);
    });

    it('should allow custom validation options', () => {
      const file = createMockFile('large.jpg', 15 * 1024 * 1024, 'image/jpeg');
      const result = validateFile(file, {
        maxSizeBytes: 20 * 1024 * 1024,
      });
      
      expect(result.isValid).toBe(true);
    });
  });

  describe('defaultImageValidation', () => {
    it('should have correct default values', () => {
      expect(defaultImageValidation.maxSizeBytes).toBe(10 * 1024 * 1024);
      expect(defaultImageValidation.allowedMimeTypes).toContain('image/jpeg');
      expect(defaultImageValidation.allowedExtensions).toContain('.jpg');
    });
  });
});
