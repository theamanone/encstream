import { Encryptor } from '../../core/encryption';
import { PayloadValidator } from '../../core/validation';
import type { EncryptedPayload } from '../../core/types';

interface RemixConfig {
  secretKey: string;
  maxAge?: number;
  debug?: boolean;
}

export function createRemixMiddleware(config: RemixConfig) {
  const encryptor = new Encryptor(config);
  const validator = new PayloadValidator(config.maxAge);

  return async function encstreamMiddleware(
    request: Request,
    next: (request: Request) => Promise<Response>
  ): Promise<Response> {
    try {
      if (request.method !== 'POST') {
        return next(request);
      }

      const body = await request.json();
      const payload = body as EncryptedPayload;

      if (!validator.validate(payload)) {
        return new Response(
          JSON.stringify({ error: 'Invalid payload' }), 
          { status: 400 }
        );
      }

      const decrypted = encryptor.decrypt(payload);
      const newRequest = new Request(request.url, {
        method: request.method,
        headers: request.headers,
        body: JSON.stringify(decrypted),
      });

      return next(newRequest);
    } catch (error) {
      if (config.debug) {
        console.error('EncStream Error:', error);
      }
      return new Response(
        JSON.stringify({ error: 'Decryption failed' }), 
        { status: 400 }
      );
    }
  };
}
