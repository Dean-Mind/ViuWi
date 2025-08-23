/**
 * Tests for SupabaseWhatsAppService
 */

import { supabaseWhatsAppAPI } from '../supabaseWhatsApp';

describe('SupabaseWhatsAppService', () => {
  describe('validateBase64ImageData', () => {
    it('should accept standard base64 data', () => {
      const standardBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77zgAAAABJRU5ErkJggg==';
      expect(supabaseWhatsAppAPI.validateBase64ImageData(standardBase64)).toBe(true);
    });

    it('should accept URL-safe base64 data', () => {
      const urlSafeBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77zgAAAABJRU5ErkJggg';
      expect(supabaseWhatsAppAPI.validateBase64ImageData(urlSafeBase64)).toBe(true);
    });

    it('should accept base64 with URL-safe characters', () => {
      const urlSafeWithChars = 'ABC-DEF_GHI123+/=';
      expect(supabaseWhatsAppAPI.validateBase64ImageData(urlSafeWithChars)).toBe(true);
    });

    it('should reject invalid characters', () => {
      const invalidBase64 = 'invalid@base64#data!';
      expect(supabaseWhatsAppAPI.validateBase64ImageData(invalidBase64)).toBe(false);
    });

    it('should reject data that is too short', () => {
      const shortData = 'ABC';
      expect(supabaseWhatsAppAPI.validateBase64ImageData(shortData)).toBe(false);
    });
  });

  describe('convertToDataUrl', () => {
    it('should convert standard base64 to data URL', () => {
      const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77zgAAAABJRU5ErkJggg==';
      const result = supabaseWhatsAppAPI.convertToDataUrl(base64);
      expect(result).toBe(`data:image/png;base64,${base64}`);
    });

    it('should normalize URL-safe base64 before converting', () => {
      const urlSafeBase64 = 'ABC-DEF_GHI';
      const expectedNormalized = 'ABC+DEF/GHI=';
      const result = supabaseWhatsAppAPI.convertToDataUrl(urlSafeBase64);
      expect(result).toBe(`data:image/png;base64,${expectedNormalized}`);
    });

    it('should handle custom mimetype', () => {
      const base64 = 'ABC123';
      const mimetype = 'image/jpeg';
      const result = supabaseWhatsAppAPI.convertToDataUrl(base64, mimetype);
      expect(result).toContain(`data:${mimetype};base64,`);
    });
  });
});
