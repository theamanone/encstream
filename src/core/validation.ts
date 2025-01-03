import { EncryptedPayload } from './types';

export class PayloadValidator {
  private readonly maxAge: number;

  constructor(maxAgeMs: number = 5 * 60 * 1000) { // Default 5 minutes
    this.maxAge = maxAgeMs;
  }

  validate(payload: EncryptedPayload): boolean {
    if (!this.validateStructure(payload)) {
      return false;
    }

    if (!this.validateTimestamp(payload.timestamp)) {
      return false;
    }

    return true;
  }

  private validateStructure(payload: unknown): payload is EncryptedPayload {
    if (!payload || typeof payload !== 'object') {
      return false;
    }

    const requiredFields: (keyof EncryptedPayload)[] = ['data', 'iv', 'timestamp', 'signature'];
    return requiredFields.every(field => field in payload);
  }

  private validateTimestamp(timestamp: number): boolean {
    const now = Date.now();
    const age = now - timestamp;
    return age >= 0 && age <= this.maxAge;
  }
}
