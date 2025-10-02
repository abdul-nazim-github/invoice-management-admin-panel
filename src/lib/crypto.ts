
import * as jose from 'jose';

const secret = new TextEncoder().encode(process.env.ENCRYPTION_SECRET || 'default-secret-key-that-is-long-enough');
const issuer = 'urn:example:issuer';
const audience = 'urn:example:audience';

export async function encryptToken(token: object): Promise<string> {
  return await new jose.SignJWT(token)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(issuer)
    .setAudience(audience)
    .setExpirationTime('2h')
    .sign(secret);
}

export async function decryptToken(encryptedToken: string): Promise<jose.JWTPayload> {
  const { payload } = await jose.jwtVerify(encryptedToken, secret, {
    issuer,
    audience,
  });
  return payload;
}
