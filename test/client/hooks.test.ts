import { act } from 'react';
import { renderHook } from '@testing-library/react';
import { useEncStream, useDebugger } from '../../src/client/hooks';

describe('useEncStream', () => {
  const config = {
    secretKey: 'test-secret-key-32-chars-length!',
    debug: true
  };

  it('should encrypt and decrypt data', async () => {
    const { result } = renderHook(() => useEncStream(config));
    const testData = { message: 'test' };

    await act(async () => {
      const encrypted = await result.current.encryptRequest(testData);
      const decrypted = await result.current.decryptResponse(encrypted);
      expect(decrypted).toEqual(testData);
    });
  });

  it('should maintain consistent encryption across renders', async () => {
    const { result, rerender } = renderHook(() => useEncStream(config));
    const testData = { message: 'test' };

    let encrypted1: any;
    await act(async () => {
      encrypted1 = await result.current.encryptRequest(testData);
    });

    rerender();

    let encrypted2: any;
    await act(async () => {
      encrypted2 = await result.current.encryptRequest(testData);
    });

    expect(encrypted1).not.toEqual(encrypted2);
    expect(encrypted1.data).not.toEqual(encrypted2.data);
    expect(encrypted1.iv).not.toEqual(encrypted2.iv);
  });
});

describe('useDebugger', () => {
  it('should log when enabled', () => {
    const { result } = renderHook(() => useDebugger(true));
    const debugInfo = {
      originalData: { test: true },
      encryptedData: {
        data: 'encrypted',
        iv: 'test-iv',
        timestamp: Date.now(),
        signature: 'test-signature'
      },
      timestamp: Date.now(),
      duration: 100
    };

    act(() => {
      result.current.log(debugInfo);
    });

    const logs = result.current.getLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0]).toEqual(debugInfo);
  });

  it('should not log when disabled', () => {
    const { result } = renderHook(() => useDebugger(false));
    
    act(() => {
      result.current.log({
        originalData: { test: true },
        encryptedData: {
          data: 'encrypted',
          iv: 'test-iv',
          timestamp: Date.now(),
          signature: 'test-signature'
        },
        timestamp: Date.now(),
        duration: 100
      });
    });

    const logs = result.current.getLogs();
    expect(logs).toHaveLength(0);
  });

  it('should clear logs', () => {
    const { result } = renderHook(() => useDebugger(true));
    
    act(() => {
      result.current.log({
        originalData: { test: true },
        encryptedData: {
          data: 'encrypted',
          iv: 'test-iv',
          timestamp: Date.now(),
          signature: 'test-signature'
        },
        timestamp: Date.now(),
        duration: 100
      });
      result.current.clearLogs();
    });

    const logs = result.current.getLogs();
    expect(logs).toHaveLength(0);
  });
});
