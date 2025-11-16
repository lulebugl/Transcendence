import argon2 from "argon2";

export async function hashPassword(plain: string): Promise<string> {
    return await argon2.hash(plain);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
    try {
        return await argon2.verify(hash, plain);
    } catch {
        return false;
    }
}