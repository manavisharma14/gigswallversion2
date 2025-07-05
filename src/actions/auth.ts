export function getUserIdFromToken(token: string | undefined): string | null {
  if (!token) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1] ?? '', 'base64').toString('utf8'),
    );
    return payload.id ?? null;
  } catch (err) {
    // ✅ “err” is now used, so @typescript-eslint/no-unused-vars is satisfied
    console.error('Invalid token format:', err);
    return null;
  }
}
