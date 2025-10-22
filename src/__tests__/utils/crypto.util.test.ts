import { CryptoUtil } from '../../utils/crypto.util';

describe('CryptoUtil', () => {
  describe('generateKeyPair', () => {
    it('should generate RSA key pair', () => {
      const keyPair = CryptoUtil.generateKeyPair();
      
      expect(keyPair).toBeDefined();
      expect(keyPair.publicKey).toBeDefined();
      expect(keyPair.privateKey).toBeDefined();
      expect(keyPair.publicKey).toContain('BEGIN PUBLIC KEY');
      expect(keyPair.privateKey).toContain('BEGIN PRIVATE KEY');
    });
  });

  describe('hashSensitiveData', () => {
    it('should hash data consistently', () => {
      const testData = 'Sensitive data';
      const hash1 = CryptoUtil.hashSensitiveData(testData);
      const hash2 = CryptoUtil.hashSensitiveData(testData);
      
      expect(hash1).toBe(hash2);
      expect(hash1).toHaveLength(64); // SHA-256 produces 64 character hex string
    });

    it('should produce different hashes for different data', () => {
      const hash1 = CryptoUtil.hashSensitiveData('data1');
      const hash2 = CryptoUtil.hashSensitiveData('data2');
      
      expect(hash1).not.toBe(hash2);
    });
  });
});

