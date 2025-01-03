import CryptoJS from 'crypto-js';
import { EncryptedPayload, EncryptionConfig } from './types';

export class Encryptor {
  private readonly secretKey: string;
  private readonly debug: boolean;

  constructor(config: EncryptionConfig) {
    this.secretKey = config.secretKey;
    this.debug = config.debug || false;
  }

  encrypt(data: unknown): EncryptedPayload {
    const jsonData = JSON.stringify(data);
    const iv = CryptoJS.lib.WordArray.random(16);
    
    const encrypted = CryptoJS.AES.encrypt(jsonData, this.secretKey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    const timestamp = Date.now();
    const signature = this.generateSignature(encrypted.toString(), iv.toString(), timestamp);

    if (this.debug) {
      console.log('Encryption Debug:', {
        originalData: data,
        iv: iv.toString(),
        timestamp,
        signature
      });
    }

    return {
      data: encrypted.toString(),
      iv: iv.toString(),
      timestamp,
      signature
    };
  }

  decrypt(payload: EncryptedPayload): unknown {
    const { data, iv, timestamp, signature } = payload;
    
    // Verify signature
    const expectedSignature = this.generateSignature(data, iv, timestamp);
    if (signature !== expectedSignature) {
      throw new Error('Invalid signature');
    }

    const decrypted = CryptoJS.AES.decrypt(data, this.secretKey, {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  }

  private generateSignature(data: string, iv: string, timestamp: number): string {
    const message = `${data}${iv}${timestamp}`;
    return CryptoJS.HmacSHA256(message, this.secretKey).toString();
  }
}
