import { Encryptor } from '../../src/core/encryption';
import type { EncryptedPayload } from '../../src/core/types';

describe('Encryption', () => {
  const secretKey = 'test-secret-key-32-chars-length!';
  const encryptor = new Encryptor({ secretKey });

  const testData = {
    message: 'Hello, World!',
    number: 42,
    nested: { value: true }
  };

  it('should encrypt and decrypt data correctly', () => {
    const encrypted = encryptor.encrypt(testData);
    const decrypted = encryptor.decrypt(encrypted);
    expect(decrypted).toEqual(testData);
  });

  it('should generate different IVs for each encryption', () => {
    const encrypted1 = encryptor.encrypt(testData);
    const encrypted2 = encryptor.encrypt(testData);
    expect(encrypted1.iv).not.toBe(encrypted2.iv);
  });

  it('should fail with invalid signature', () => {
    const encrypted = encryptor.encrypt(testData);
    const tampered: EncryptedPayload = {
      ...encrypted,
      signature: 'invalid-signature'
    };
    expect(() => encryptor.decrypt(tampered)).toThrow();
  });

  it('should handle different data types', () => {
    const testCases = [
      123,
      'string',
      true,
      [1, 2, 3],
      { a: 1, b: 2 },
      null
    ];

    testCases.forEach(testCase => {
      const encrypted = encryptor.encrypt(testCase);
      const decrypted = encryptor.decrypt(encrypted);
      expect(decrypted).toEqual(testCase);
    });
  });

  it('should handle large data', () => {
    const largeData = Array(1000).fill('test').join('');
    const encrypted = encryptor.encrypt(largeData);
    const decrypted = encryptor.decrypt(encrypted);
    expect(decrypted).toBe(largeData);
  });
});
