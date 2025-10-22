import { CryptoUtil } from '../utils/crypto.util';

describe('CryptoUtil', () => {
  describe('hashSensitiveData', () => {
    it('should hash sensitive data consistently', () => {
      const data = 'sensitive-data';
      const hash1 = CryptoUtil.hashSensitiveData(data);
      const hash2 = CryptoUtil.hashSensitiveData(data);
      
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // SHA256 produces 64 character hex string
      expect(hash1).toMatch(/^[a-f0-9]+$/); // Should be hexadecimal
    });

    it('should produce different hashes for different inputs', () => {
      const hash1 = CryptoUtil.hashSensitiveData('data1');
      const hash2 = CryptoUtil.hashSensitiveData('data2');
      
      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty string', () => {
      const hash = CryptoUtil.hashSensitiveData('');
      expect(hash).toBeDefined();
      expect(hash).toHaveLength(64);
    });
  });
});
