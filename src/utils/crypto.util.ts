import crypto from 'crypto';

const RSA_PUBLIC_KEY = process.env.RSA_PUBLIC_KEY || '';
const RSA_PRIVATE_KEY = process.env.RSA_PRIVATE_KEY || '';

interface EncryptedData {
  encrypted: string;
  iv: string;
  tag: string;
}

interface HybridEncryptedResult {
  encryptedKey: string;
  encryptedData: EncryptedData;
}

export class CryptoUtil {
  static generateKeyPair(): { publicKey: string; privateKey: string } {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    return { publicKey, privateKey };
  }

  static hybridEncrypt(data: string): HybridEncryptedResult {
    const aesKey = crypto.randomBytes(32); // AES-256 key
    const iv = crypto.randomBytes(16); // Initialization Vector
    const cipher = crypto.createCipheriv('aes-256-gcm', aesKey, iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag();

    const encryptedAesKey = crypto.publicEncrypt(
      { key: RSA_PUBLIC_KEY, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
      aesKey
    ).toString('base64');

    return {
      encryptedKey: encryptedAesKey,
      encryptedData: {
        encrypted,
        iv: iv.toString('hex'),
        tag: tag.toString('hex'),
      },
    };
  }

  static hybridDecrypt(encryptedKey: string, encryptedData: EncryptedData): string {
    const decryptedAesKey = crypto.privateDecrypt(
      { key: RSA_PRIVATE_KEY, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
      Buffer.from(encryptedKey, 'base64')
    );

    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      decryptedAesKey,
      Buffer.from(encryptedData.iv, 'hex')
    );
    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));

    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  static hashSensitiveData(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}
