import { useCallback, useMemo } from 'react';
import { Encryptor } from '../../core/encryption';
import type { EncryptionConfig, EncryptedPayload } from '../../core/types';

export function useEncStream(config: EncryptionConfig) {
  const encryptor = useMemo(() => new Encryptor(config), [config.secretKey, config.debug]);

  const makeSecureRequest = useCallback(async (
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> => {
    try {
      const requestData = {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        body: options.body
      };

      // Encrypt both the target endpoint and request data
      const encryptedPayload = await encryptor.encrypt({
        target: endpoint,
        data: requestData
      });

      // Make the proxy request
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Encryption-Timestamp': encryptedPayload.timestamp.toString(),
          'X-Encryption-Signature': encryptedPayload.signature
        },
        body: JSON.stringify(encryptedPayload)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Request failed');
      }

      const encryptedResponse = await response.json();
      return encryptor.decrypt(encryptedResponse);
    } catch (error: any) {
      console.error('Secure request error:', error);
      throw error;
    }
  }, [encryptor]);

  return {
    makeSecureRequest,
    encryptRequest: useCallback(async (data: unknown): Promise<EncryptedPayload> => {
      return encryptor.encrypt(data);
    }, [encryptor]),
    decryptResponse: useCallback(async (payload: EncryptedPayload): Promise<unknown> => {
      return encryptor.decrypt(payload);
    }, [encryptor])
  };
}
