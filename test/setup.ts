import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { TextDecoder, TextEncoder } from 'util';
import fetch, { Request, Response, Headers } from 'node-fetch';
import { Blob } from 'buffer';

// Configure React Testing Library
configure({
  reactStrictMode: true
});

// Mock crypto for Node.js environment
const crypto = require('crypto');

Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (arr: Uint8Array) => crypto.randomBytes(arr.length)
  }
});

// Setup Web API globals
if (typeof globalThis.fetch === 'undefined') {
  Object.assign(globalThis, {
    fetch,
    Request,
    Response,
    Headers,
    Blob,
    TextEncoder,
    TextDecoder
  });
}
