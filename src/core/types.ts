export interface EncryptionConfig {
  secretKey: string;
  algorithm?: 'aes-256-cbc';
  debug?: boolean;
}

export interface EncryptedPayload {
  data: string;
  iv: string;
  timestamp: number;
  signature: string;
}

export interface DebugInfo {
  originalData: unknown;
  encryptedData: EncryptedPayload;
  timestamp: number;
  duration: number;
}
