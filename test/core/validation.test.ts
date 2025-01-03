import { PayloadValidator } from '../../src/core/validation';
import type { EncryptedPayload } from '../../src/core/types';

describe('PayloadValidator', () => {
  const validator = new PayloadValidator(5000); // 5 seconds max age

  const validPayload: EncryptedPayload = {
    data: 'encrypted-data',
    iv: 'initialization-vector',
    timestamp: Date.now(),
    signature: 'valid-signature'
  };

  it('should validate correct payload structure', () => {
    expect(validator.validate(validPayload)).toBe(true);
  });

  it('should reject expired timestamps', () => {
    const expiredPayload: EncryptedPayload = {
      ...validPayload,
      timestamp: Date.now() - 10000 // 10 seconds ago
    };
    expect(validator.validate(expiredPayload)).toBe(false);
  });

  it('should reject future timestamps', () => {
    const futurePayload: EncryptedPayload = {
      ...validPayload,
      timestamp: Date.now() + 10000 // 10 seconds in future
    };
    expect(validator.validate(futurePayload)).toBe(false);
  });

  it('should reject missing fields', () => {
    const invalidPayloads = [
      { iv: 'iv', timestamp: Date.now(), signature: 'sig' },
      { data: 'data', timestamp: Date.now(), signature: 'sig' },
      { data: 'data', iv: 'iv', signature: 'sig' },
      { data: 'data', iv: 'iv', timestamp: Date.now() }
    ];

    invalidPayloads.forEach(payload => {
      expect(validator.validate(payload as any)).toBe(false);
    });
  });

  it('should reject non-object payloads', () => {
    const invalidPayloads = [
      null,
      undefined,
      'string',
      123,
      [],
      true
    ];

    invalidPayloads.forEach(payload => {
      expect(validator.validate(payload as any)).toBe(false);
    });
  });
});
