export interface User {
  id: number;
  username: string;
  email: string;
  avatar_url?: string;
  totp_enabled?: boolean;
}
