import { ValidationUtil } from '../../utils/validation.util';

describe('ValidationUtil', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(ValidationUtil.isValidEmail('test@example.com')).toBe(true);
      expect(ValidationUtil.isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(ValidationUtil.isValidEmail('admin@sportsline.local')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(ValidationUtil.isValidEmail('invalid-email')).toBe(false);
      expect(ValidationUtil.isValidEmail('test@')).toBe(false);
      expect(ValidationUtil.isValidEmail('@domain.com')).toBe(false);
      expect(ValidationUtil.isValidEmail('')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should validate correct phone numbers', () => {
      expect(ValidationUtil.isValidPhone('+1234567890')).toBe(true);
      expect(ValidationUtil.isValidPhone('123-456-7890')).toBe(true);
      expect(ValidationUtil.isValidPhone('(123) 456-7890')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(ValidationUtil.isValidPhone('123')).toBe(false);
      expect(ValidationUtil.isValidPhone('abc-def-ghij')).toBe(false);
      expect(ValidationUtil.isValidPhone('')).toBe(false);
    });
  });

  describe('sanitizeString', () => {
    it('should sanitize strings correctly', () => {
      expect(ValidationUtil.sanitizeString('  Hello World  ')).toBe('Hello World');
      expect(ValidationUtil.sanitizeString('Test\nString')).toBe('Test String');
      expect(ValidationUtil.sanitizeString('Special<>Chars')).toBe('SpecialChars');
    });
  });
});


