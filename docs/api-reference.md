# API Reference

## Client-side APIs

### useEncStream Hook

```typescript
const { encryptRequest, decryptResponse } = useEncStream({
  secretKey: string;
  algorithm?: 'aes-256-cbc';
  debug?: boolean;
});
```

#### Parameters

- `secretKey` (required): Your encryption key
- `algorithm` (optional): Encryption algorithm (default: 'aes-256-cbc')
- `debug` (optional): Enable debug mode

#### Returns

- `encryptRequest(data: unknown): Promise<EncryptedPayload>`
- `decryptResponse(payload: EncryptedPayload): Promise<unknown>`

### useDebugger Hook

```typescript
const { log, getLogs, clearLogs } = useDebugger(enabled?: boolean);
```

## Server-side APIs

### Express Middleware

```typescript
import { encstreamMiddleware } from 'encstream/server';

app.use(encstreamMiddleware({
  secretKey: 'your-secret-key',
  debug: false
}));
```

### Next.js Middleware

```typescript
import { encstreamMiddleware } from 'encstream/server';

export default encstreamMiddleware({
  secretKey: process.env.SECRET_KEY,
  debug: process.env.NODE_ENV === 'development'
})(handler);
```
