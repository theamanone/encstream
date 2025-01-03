import { Request, Response, NextFunction } from 'express';
import { Encryptor } from '../../core/encryption';
import type { EncryptionConfig } from '../../core/types';

export function expressMiddleware(config: EncryptionConfig) {
  const encryptor = new Encryptor(config);

  return {
    async proxyRequest(req: Request, res: Response) {
      try {
        const { target, data } = req.body;

        if (!target || !data) {
          return res.status(400).json({ error: 'Invalid proxy request' });
        }

        // Decrypt the request data
        const decryptedData = await encryptor.decrypt(data);

        // Forward the decrypted request to the actual endpoint
        const response = await fetch(target, {
          method: req.method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(decryptedData),
        });

        const responseData = await response.json();

        // Encrypt the response
        const encryptedResponse = await encryptor.encrypt(responseData);
        return res.json(encryptedResponse);
      } catch (error: any) {
        console.error('Proxy error:', error);
        return res.status(400).json({ error: 'Proxy request failed' });
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
