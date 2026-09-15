import * as crypto from 'crypto';

export const generateOtpCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const hashOtp = (code: string): string => {
  return crypto.createHash('sha256').update(code).digest('hex');
};

export const verifyOtpHash = (code: string, hashedCode: string): boolean => {
  const hash = hashOtp(code);
  if (hash.length !== hashedCode.length) return false;
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(hashedCode));
};
