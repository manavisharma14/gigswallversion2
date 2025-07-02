export function getUserIdFromToken(token: string | undefined): string | null {
    if (!token) return null;
    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      return payload.id || null;
    } catch (err) {
      console.error("Invalid token format");
      return null;
    }
  }
  