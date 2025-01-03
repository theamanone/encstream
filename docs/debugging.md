# Debugging Guide

## Enable Debug Mode

```typescript
// Client-side
const { encryptRequest } = useEncStream({
  secretKey: 'your-key',
  debug: true
});

// Server-side
app.use(encstreamMiddleware({
  secretKey: 'your-key',
  debug: true
}));
```

## Using the Debugger Hook

```typescript
const { log, getLogs, clearLogs } = useDebugger(true);

// View encryption process
log({
  originalData: data,
  encryptedData: encrypted,
  timestamp: Date.now(),
  duration: performance.now() - startTime
});

// Get debug logs
const logs = getLogs();

// Clear logs when done
clearLogs();
```

## Common Issues

1. **Invalid Signature**
   - Check secret key consistency
   - Verify timestamp validity
   - Check for request tampering

2. **Decryption Failures**
   - Verify payload structure
   - Check IV format
   - Validate encryption parameters

3. **Timestamp Issues**
   - Check server/client time sync
   - Verify maxAge setting
   - Check for replay attacks
