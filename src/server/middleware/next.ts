import { NextResponse } from 'next/server';
import { Encryptor } from '../../core/encryption';
import type { EncryptionConfig, EncryptedPayload } from '../../core/types';

export function nextMiddleware(config: EncryptionConfig) {
  const encryptor = new Encryptor(config);

  return {
    async proxyRequest(request: Request) {
      try {
        // Validate encryption headers
        const timestamp = request.headers.get('X-Encryption-Timestamp');
        const signature = request.headers.get('X-Encryption-Signature');

        if (!timestamp || !signature) {
          throw new Error('Missing encryption headers');
        }

        // Parse and validate request body
        const encryptedPayload = await request.json() as EncryptedPayload;
        if (!encryptedPayload || !encryptedPayload.data) {
          throw new Error('Invalid encrypted payload');
        }

        // Decrypt the request data
        const decrypted = await encryptor.decrypt(encryptedPayload);
        const { target, data } = decrypted as { target: string; data: RequestInit };

        if (!target || !data) {
          throw new Error('Invalid proxy request data');
        }

        // Forward the decrypted request to the actual endpoint
        const response = await fetch(target, {
          method: data.method,
          headers: data.headers,
          body: data.body ? JSON.stringify(JSON.parse(data.body as string)) : undefined,
        });

        const responseData = await response.json();

        // Encrypt the response
        const encryptedResponse = await encryptor.encrypt(responseData);
        return NextResponse.json(encryptedResponse);
      } catch (error: any) {
        console.error('Proxy error:', error);
        return NextResponse.json(
          { error: error.message || 'Proxy request failed' },
          { status: 400 }
        );
      }
    },

    async decryptRequest(data: any) {
      return encryptor.decrypt(data);
    },

    async encryptResponse(data: any) {
      return encryptor.encrypt(data);
    }
  };
}
