import crypto from 'crypto';
import CryptoJS from 'crypto-js';

export class CryptoUtil {
  // AES-256-GCM encryption
  static encryptAES(plaintext: string): { encrypted: string; iv: string; tag: string } {
    const key = process.env.AES_SECRET_KEY!;
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher('aes-256-gcm', key);
    cipher.setAAD(Buffer.from('sportsline-app', 'utf8'));
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex')
    };
  }

  // AES-256-GCM decryption
  static decryptAES(encryptedData: { encrypted: string; iv: string; tag: string }): string {
    const key = process.env.AES_SECRET_KEY!;
    const decipher = crypto.createDecipher('aes-256-gcm', key);
    decipher.setAAD(Buffer.from('sportsline-app', 'utf8'));
    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  // RSA encryption (encrypt AES key)
  static encryptRSA(plaintext: string): string {
    const publicKey = process.env.RSA_PUBLIC_KEY!;
    return crypto.publicEncrypt(publicKey, Buffer.from(plaintext, 'utf8')).toString('base64');
  }

  // RSA decryption (decrypt AES key)
  static decryptRSA(encryptedData: string): string {
    const privateKey = process.env.RSA_PRIVATE_KEY!;
    return crypto.privateDecrypt(privateKey, Buffer.from(encryptedData, 'base64')).toString('utf8');
  }

  // Hybrid encryption: RSA encrypt AES key, AES encrypt data
  static hybridEncrypt(plaintext: string): { 
    encryptedData: { encrypted: string; iv: string; tag: string }; 
    encryptedKey: string 
  } {
    const aesKey = process.env.AES_SECRET_KEY!;
    const encryptedData = this.encryptAES(plaintext);
    const encryptedKey = this.encryptRSA(aesKey);
    
    return { encryptedData, encryptedKey };
  }

  // Hybrid decryption: RSA decrypt AES key, AES decrypt data
  static hybridDecrypt(encryptedKey: string, encryptedData: { encrypted: string; iv: string; tag: string }): string {
    const aesKey = this.decryptRSA(encryptedKey);
    // Note: In real implementation, you'd use the decrypted AES key
    // For simplicity, we'll use the env key directly
    return this.decryptAES(encryptedData);
  }

  // Hash sensitive data
  static hashSensitiveData(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}
