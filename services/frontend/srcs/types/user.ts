export interface User {
  id: number;
  username: string;
  avatar_url?: string;
  totp_enabled?: boolean;
}
