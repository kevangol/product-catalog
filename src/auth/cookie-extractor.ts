import { Request } from 'express';

export const cookieAccessTokenExtractor = (
  req: Request & { cookies?: Record<string, string> },
): string | null => {
  if (
    req &&
    typeof req.cookies === 'object' &&
    req.cookies !== null &&
    Object.prototype.hasOwnProperty.call(req.cookies, 'access_token')
  ) {
    return (req.cookies as Record<string, string>)['access_token'];
  }
  return null;
};
