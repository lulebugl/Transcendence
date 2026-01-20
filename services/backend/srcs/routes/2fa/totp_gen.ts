import crypto from "crypto";
import { Buffer } from 'buffer';
import base32 from "hi-base32";

export function generateSecret(): Buffer {
  return crypto.randomBytes(20); // 20 bytes come in Go
}

export function bufferToBase32(buf: Buffer): string {
  return base32.encode(buf).replace(/=/g, "");
}

//export function totp_easy_test(): void {
//  const secret = generateSecret();
//  const encoded = secret
//    .toString("base32")   // Node 20+ supporta base32 nativamente
//    .replace(/=+$/, "");  // No padding come in Go
//
//  console.log("Secret (base32):", encoded);
//
//  setInterval(() => {
//    const current = Math.floor(Date.now() / 1000 / 30);
//    const next = current + 1;
//    const prev = current - 1;
//
//    console.log(algoTOTP(secret, prev));
//    console.log(algoTOTP(secret, current));
//    console.log(algoTOTP(secret, next));
//  }, 30_000);
//}
//

