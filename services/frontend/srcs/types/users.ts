export type BaseUserType = {
  id: number;
  username: string;
  avatar_url: string;
  totp_enabled?: boolean;
  /** @description last_call is the last time the user was active in ms */
  last_call: number;
};
