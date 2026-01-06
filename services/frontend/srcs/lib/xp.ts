// Sigmoid curve parameters - must match backend (services/backend/srcs/pong/expCounter.ts)
const XP_MAX = 100000.0;
const K = 0.126376;
const L0 = 36.4014;
const C = 1177.3525;

export function xpForLevel(level: number): number {
  const xp = XP_MAX / (1.0 + Math.exp(-K * (level - L0))) - C;
  if (xp < 0) return 0;
  return Math.round(xp / 10) * 10;
}

export function levelFromXp(xp: number): number {
  const adjusted = xp + C;
  if (adjusted <= 0) return 1;

  const ratio = XP_MAX / adjusted;
  if (ratio <= 1) return 99;

  const level = L0 - Math.log(ratio - 1) / K;
  return Math.max(1, Math.floor(level));
}
