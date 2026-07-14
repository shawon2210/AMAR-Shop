const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function base64urlEncode(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64urlDecode(str: string): string {
  const padding = '='.repeat((4 - (str.length % 4)) % 4);
  return atob(str.replace(/-/g, '+').replace(/_/g, '/') + padding);
}

async function importKey(): Promise<CryptoKey> {
  const keyData = encoder.encode('your-secret-key-change-in-production');
  return crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

export interface JWTPayload {
  sub: string;
  role: string;
  phone: string;
  iat?: number;
  exp?: number;
}

export async function signToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claims = { ...payload, iat: now, exp: now + 15 * 60 }; // 15 minutes

  const headerEncoded = base64urlEncode(JSON.stringify(header));
  const claimsEncoded = base64urlEncode(JSON.stringify(claims));

  const signingInput = `${headerEncoded}.${claimsEncoded}`;
  const key = await importKey();
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(signingInput));
  const signatureEncoded = base64urlEncode(String.fromCharCode(...new Uint8Array(signature)));

  return `${signingInput}.${signatureEncoded}`;
}

export async function signRefreshToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claims = { ...payload, iat: now, exp: now + 7 * 24 * 60 * 60 }; // 7 days

  const headerEncoded = base64urlEncode(JSON.stringify(header));
  const claimsEncoded = base64urlEncode(JSON.stringify(claims));

  const signingInput = `${headerEncoded}.${claimsEncoded}`;
  const key = await importKey();
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(signingInput));
  const signatureEncoded = base64urlEncode(String.fromCharCode(...new Uint8Array(signature)));

  return `${signingInput}.${signatureEncoded}`;
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  const [headerEncoded, claimsEncoded, signatureEncoded] = token.split('.');
  if (!headerEncoded || !claimsEncoded || !signatureEncoded) {
    throw new Error('Invalid token format');
  }

  const signingInput = `${headerEncoded}.${claimsEncoded}`;
  const key = await importKey();
  const signature = new Uint8Array(
    base64urlDecode(signatureEncoded)
      .split('')
      .map((c) => c.charCodeAt(0)),
  );

  const valid = await crypto.subtle.verify('HMAC', await importKey(), signature, encoder.encode(signingInput));
  if (!valid) {
    throw new Error('Invalid signature');
  }

  const claims = JSON.parse(decoder.decode(new Uint8Array(base64urlDecode(claimsEncoded).split('').map(c => c.charCodeAt(0)))));
  
  const now = Math.floor(Date.now() / 1000);
  if (claims.exp && claims.exp < now) {
    throw new Error('Token expired');
  }

  return claims as JWTPayload;
}