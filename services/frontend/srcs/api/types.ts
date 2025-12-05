export interface OtpSetupData {
  secret: string;
  otpauth_url: string;
  qr_image: string;
}

export type LoginResponse = { require2fa: true } | { token: string };

export type Friends = {
  id: number;
  username: string;
  avatar_url: string;
  last_call: number;
};
