import { ValidationUtil } from '../../utils/validation.util';

describe('ValidationUtil', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(ValidationUtil.validateEmail('test@example.com')).toBe(true);
      expect(ValidationUtil.validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(ValidationUtil.validateEmail('admin@sportsline.local')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(ValidationUtil.validateEmail('invalid-email')).toBe(false);
      expect(ValidationUtil.validateEmail('test@')).toBe(false);
      expect(ValidationUtil.validateEmail('@domain.com')).toBe(false);
      expect(ValidationUtil.validateEmail('')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should validate correct phone numbers', () => {
      expect(ValidationUtil.validatePhone('+1234567890')).toBe(true);
      expect(ValidationUtil.validatePhone('123-456-7890')).toBe(true);
      expect(ValidationUtil.validatePhone('(123) 456-7890')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(ValidationUtil.validatePhone('123')).toBe(false);
      expect(ValidationUtil.validatePhone('abc-def-ghij')).toBe(false);
      expect(ValidationUtil.validatePhone('')).toBe(false);
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


