# 🔐 EncStream

<div align="center">
  <h1>
   
    EncStream
  </h1>
  <p><strong>Secure API Encryption Toolkit for Next.js</strong></p>

  [![npm version](https://img.shields.io/npm/v/encstream.svg?style=flat&colorA=18181B&colorB=28CF8D)](https://www.npmjs.com/package/encstream)
  [![downloads](https://img.shields.io/npm/dm/encstream.svg?style=flat&colorA=18181B&colorB=28CF8D)](https://www.npmjs.com/package/encstream)
  [![license](https://img.shields.io/npm/l/encstream.svg?style=flat&colorA=18181B&colorB=28CF8D)](https://github.com/theamanone/encstream/blob/main/LICENSE)

  <p>
    <a href="#-quick-start">Quick Start</a>
    ·
    <a href="#-features">Features</a>
    ·
    <a href="#-documentation">Docs</a>
    ·
    <a href="#-contributing">Contribute</a>
  </p>
</div>

## ✨ Features

- 🔒 **End-to-End Encryption**: AES-256-GCM encryption for all API requests
- 🚀 **Next.js App Router Ready**: Built specifically for modern Next.js applications
- 🎯 **Zero Config**: Works out of the box with sensible defaults
- 🔍 **Debug Mode**: Built-in debugging tools for development
- 📝 **TypeScript Support**: Full type definitions included
- 🛡️ **Security First**: Request signing and timestamp validation

## 📦 Installation

<div class="code-block">
<div class="copy-button" onclick="navigator.clipboard.writeText('npm install encstream')">
  <svg width="12" height="12" viewBox="0 0 12 12"><path d="M3.5 3.5v5h5v-5h-5zM2 2h8v8H2V2z"/></svg>
  Copy
</div>

```bash
npm install encstream
```
</div>

## 🚀 Quick Start

### 1. Set Up Environment Variables

<div class="code-block">

```env
# .env.local
ENCRYPTION_KEY=your-secret-key-min-32-chars-long!!
API_BASE_URL=http://localhost:3000  # Your API base URL
```
</div>

### 2. Create Proxy Route

<div class="code-block">

```typescript
// app/api/proxy/route.ts
import { NextResponse } from 'next/server';
import { Encryptor } from 'encstream';

const secretKey = process.env.ENCRYPTION_KEY!;
const baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';

const encryptor = new Encryptor({
  secretKey,
  debug: true // Enable for development
});

export async function POST(request: Request) {
  try {
    const encryptedPayload = await request.json();
    
    // Validate payload structure
    if (!encryptedPayload?.data || !encryptedPayload?.signature) {
      throw new Error('Invalid encrypted payload structure');
    }

    // Decrypt and extract request details
    const decrypted = await encryptor.decrypt(encryptedPayload);
    const { target, data } = decrypted as { target: string; data: any };

    if (!target) {
      throw new Error('Missing target endpoint');
    }

    // Forward request to actual endpoint
    const response = await fetch(`${baseUrl}${target}`, {
      method: data.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...(data.body ? { body: data.body } : {}),
    });

    const responseData = await response.json();
    const encryptedResponse = await encryptor.encrypt(responseData);
    
    return NextResponse.json(encryptedResponse);
  } catch (error: any) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: error.message || 'Proxy request failed' },
      { status: 400 }
    );
  }
}
```
</div>

### 3. Create Client Component

<div class="code-block">

```typescript
// components/SecureForm.tsx
'use client';

import { useState } from 'react';
import { useEncStream } from 'encstream';

const config = {
  secretKey: process.env.NEXT_PUBLIC_ENCRYPTION_KEY!,
  debug: true // Enable for development
};

export default function SecureForm() {
  const [message, setMessage] = useState('');
  const { makeSecureRequest } = useEncStream(config);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await makeSecureRequest('/api/users', {
        method: 'POST',
        body: JSON.stringify({ message })
      });
      console.log('Response:', response);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">Send Secure Request</button>
    </form>
  );
}
```
</div>

## 🛠️ Advanced Usage

### Custom Headers

<div class="code-block">

```typescript
const response = await makeSecureRequest('/api/data', {
  method: 'POST',
  headers: {
    'Custom-Header': 'value'
  },
  body: JSON.stringify(data)
});
```
</div>

### TypeScript Support

<div class="code-block">

```typescript
import { EncStreamConfig, SecureResponse } from 'encstream';

interface UserData {
  id: string;
  name: string;
}

const response = await makeSecureRequest<UserData>('/api/user');
// response is typed as SecureResponse<UserData>
```
</div>

## 🔒 Security Features

### Encryption Process

1. **Request Encryption**:
   - AES-256-GCM encryption
   - Unique IV per request
   - Timestamp validation
   - Request signing

2. **Proxy Handling**:
   - Payload validation
   - Signature verification
   - Secure decryption
   - Endpoint forwarding

3. **Response Encryption**:
   - Secure response encryption
   - Integrity checks
   - New IV per response

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. 🐛 **Report Bugs**: Open an issue with detailed information
2. 💡 **Suggest Features**: Share your ideas in issues
3. 🔧 **Submit PRs**: Check our contributing guidelines
4. 📚 **Improve Docs**: Help us make docs better
5. ⭐ **Star the Project**: Show your support!

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📝 License

MIT 

---

<p align="center">Made with ❤️ by <a href="https://github.com/theamanone">theamanone</a></p>

<style>
.code-block {
  position: relative;
  background: #1a1a1a;
  border-radius: 8px;
  margin: 16px 0;
  padding: 16px;
}

.copy-button {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.copy-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.copy-button svg {
  fill: currentColor;
}

code {
  background: #1a1a1a;
  color: #fff;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 85%;
}
</style>
