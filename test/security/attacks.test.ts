import { Encryptor } from '../../src/core/encryption';
import { PayloadValidator } from '../../src/core/validation';
import type { EncryptedPayload } from '../../src/core/types';

describe('Security Tests', () => {
  const config = {
    secretKey: 'test-secret-key-32-chars-length!',
    debug: false
  };

  const encryptor = new Encryptor(config);
  const validator = new PayloadValidator(5000); // 5 seconds

  describe('Replay Attack Protection', () => {
    it('should prevent replay attacks', () => {
      // Create a valid encrypted payload
      const payload = encryptor.encrypt({ message: 'test' });
      
      // Simulate waiting (payload becomes expired)
      payload.timestamp = Date.now() - 6000; // 6 seconds ago
      
      // Attempt replay
      expect(validator.validate(payload)).toBe(false);
    });
  });

  describe('Tampering Protection', () => {
    it('should detect data tampering', () => {
      const payload = encryptor.encrypt({ message: 'original' });
      
      // Tamper with encrypted data
      const tampered: EncryptedPayload = {
        ...payload,
        data: payload.data.replace(/.$/, 'X')
      };
      
      expect(() => encryptor.decrypt(tampered)).toThrow();
    });

    it('should detect IV tampering', () => {
      const payload = encryptor.encrypt({ message: 'test' });
      
      // Tamper with IV
      const tampered: EncryptedPayload = {
        ...payload,
        iv: 'tampered-iv'
      };
      
      expect(() => encryptor.decrypt(tampered)).toThrow();
    });
  });

  describe('Man-in-the-Middle Protection', () => {
    it('should prevent data modification', () => {
      const originalPayload = encryptor.encrypt({ message: 'secret' });
      
      // Simulate MITM attack by modifying data but keeping signature
      const mitm: EncryptedPayload = {
        ...originalPayload,
        data: encryptor.encrypt({ message: 'hacked' }).data
      };
      
      expect(() => encryptor.decrypt(mitm)).toThrow();
    });
  });

  describe('Timing Attack Protection', () => {
    it('should use constant-time comparison for signatures', () => {
      const payload = encryptor.encrypt({ message: 'test' });
      
      // Measure time for valid signature
      const start1 = process.hrtime.bigint();
      validator.validate(payload);
      const end1 = process.hrtime.bigint();
      const validTime = end1 - start1;

      // Measure time for invalid signature
      const tampered = { ...payload, signature: 'x'.repeat(payload.signature.length) };
      const start2 = process.hrtime.bigint();
      validator.validate(tampered);
      const end2 = process.hrtime.bigint();
      const invalidTime = end2 - start2;

      // Compare execution times (should be similar)
      const timeDiff = Number(validTime - invalidTime);
      expect(Math.abs(timeDiff)).toBeLessThan(1000000); // Less than 1ms difference
    });
  });

  describe('Input Validation', () => {
    it('should reject malformed JSON', () => {
      const payload = encryptor.encrypt({ message: 'test' });
      const malformed = { ...payload, data: 'not-valid-base64' };
      
      expect(() => encryptor.decrypt(malformed)).toThrow();
    });

    it('should handle large payloads safely', () => {
      const largeData = 'x'.repeat(1024 * 1024); // 1MB
      expect(() => encryptor.encrypt({ data: largeData })).not.toThrow();
    });
  });
});
