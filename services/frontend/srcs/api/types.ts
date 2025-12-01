export interface OtpSetupData {
  secret: string;
  otpauth_url: string;
  qr_image: string;
}

export type LoginResponse = { require2fa: true } | { token: string };

