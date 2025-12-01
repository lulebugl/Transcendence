
import crypto from "crypto";
import { Buffer } from 'buffer';

function algoTOTP(secret: Buffer, counter: number): number {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter)); // counter come uint64 big-endian

  const hmac = crypto.createHmac("sha1", secret);
  hmac.update(buf);
  const hash = hmac.digest();

  const offset = hash[hash.length - 1] & 0x0f;
  const part = hash.slice(offset, offset + 4);

  const number =
    (part.readUInt32BE(0) & 0x7fffffff) % 1_000_000;

  return number;
}

export function verifyTOTP(secretKey: Buffer, clientCode: number): boolean {
  const current = Math.floor(Date.now() / 1000 / 30);
  for (let i = -1; i <= 1; i++) {
    const serverCode = algoTOTP(secretKey, current + i);
    if (serverCode === clientCode) {
      return true;
    }
  }
  return false;
}
