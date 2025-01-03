import { useCallback, useRef } from 'react';
import type { DebugInfo } from '../../core/types';

export function useDebugger(enabled: boolean = false) {
  const debugLogs = useRef<DebugInfo[]>([]);

  const log = useCallback((info: DebugInfo) => {
    if (enabled) {
      debugLogs.current.push(info);
      console.log('EncStream Debug:', info);
    }
  }, [enabled]);

  const getLogs = useCallback(() => {
    return debugLogs.current;
  }, []);

  const clearLogs = useCallback(() => {
    debugLogs.current = [];
  }, []);

  return {
    log,
    getLogs,
    clearLogs,
  };
}
