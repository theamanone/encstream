import express from 'express';
import request from 'supertest';
import { encstreamMiddleware } from '../../src/server/middleware/express';
import { encstreamMiddleware as nextMiddleware } from '../../src/server/middleware/next';
import { createRemixMiddleware } from '../../src/server/middleware/remix';
import { Encryptor } from '../../src/core/encryption';
import { EncryptionConfig } from '../../src/core/types';

describe('Server Middleware', () => {
  const config = {
    secretKey: 'test-secret-key-32-chars-length!',
    debug: true
  };

  describe('Express Middleware', () => {
    const app = express();
    app.use(express.json());
    app.use(encstreamMiddleware(config));

    app.post('/test', (req, res) => {
      res.json(req.body);
    });

    it('should decrypt valid requests', async () => {
      const encryptor = new Encryptor(config);
      const testData = { message: 'test' };
      const encrypted = encryptor.encrypt(testData);

      const response = await request(app)
        .post('/test')
        .send(encrypted)
        .expect(200);

      expect(response.body).toEqual(testData);
    });

    it('should reject invalid payloads', async () => {
      await request(app)
        .post('/test')
        .send({ invalid: 'payload' })
        .expect(400);
    });

    it('should reject tampered signatures', async () => {
      const encryptor = new Encryptor(config);
      const encrypted = encryptor.encrypt({ message: 'test' });
      encrypted.signature = 'tampered';

      await request(app)
        .post('/test')
        .send(encrypted)
        .expect(400);
    });
  });

  describe('Next.js Middleware', () => {
    const middleware = nextMiddleware(config);

    it('should decrypt valid requests', async () => {
      const encryptor = new Encryptor(config);
      const testData = { message: 'test' };
      const encrypted = encryptor.encrypt(testData);

      const req = {
        body: encrypted,
        method: 'POST'
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const next = jest.fn();

      await middleware(req as any, res as any, next);
      expect(req.body).toEqual(testData);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Remix Middleware', () => {
    const config: EncryptionConfig = {
      secretKey: 'test-secret-key',
      debug: true
    };
    const middleware = createRemixMiddleware(config);

    it('should decrypt valid requests', async () => {
      const encryptor = new Encryptor(config);
      const testData = { message: 'test' };
      const encrypted = encryptor.encrypt(testData);

      const next = jest.fn().mockResolvedValue(
        new globalThis.Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' }
        })
      );

      const request = new globalThis.Request('http://localhost/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(encrypted)
      });

      const response = await middleware(request, next);
      expect(response.status).toBe(200);

      const nextRequest = next.mock.calls[0][0] as globalThis.Request;
      const body = await nextRequest.json();
      expect(body).toEqual(testData);
    });

    it('should pass through non-POST requests', async () => {
      const next = jest.fn().mockResolvedValue(
        new globalThis.Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' }
        })
      );

      const request = new globalThis.Request('http://localhost/test', {
        method: 'GET'
      });

      await middleware(request, next);
      expect(next).toHaveBeenCalledWith(request);
    });

    it('should reject invalid payloads', async () => {
      const next = jest.fn();

      const request = new globalThis.Request('http://localhost/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invalid: 'payload' })
      });

      const response = await middleware(request, next);
      expect(response.status).toBe(400);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
