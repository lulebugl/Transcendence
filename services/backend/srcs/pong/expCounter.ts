// Sigmoid curve parameters for XP progression
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
    // Inverse of the sigmoid: solve xp = XP_MAX / (1 + e^(-k(L-L0))) - C for L
    // L = L0 - ln(XP_MAX / (xp + C) - 1) / k
    const adjusted = xp + C;
    if (adjusted <= 0) return 1;

    const ratio = XP_MAX / adjusted;
    if (ratio <= 1) return 99; // max level cap

    const level = L0 - Math.log(ratio - 1) / K;
    return Math.max(1, Math.floor(level));
}

// function tanh because I did not find find one
function tanh(x: number): number {

    const ePos = Math.exp(x);
    const eNeg = Math.exp(-x);
    return (ePos - eNeg) / (ePos + eNeg);
}

// return factor between 0.5 and 1.5 to modify the XP won depends on level
function xpFactor(xpA: number, xpB: number): number {

    const d = xpA - xpB;
    const D = 50.0;
    const alpha = 0.5;

    const t = tanh(d / D);

    return 1.0 - alpha * t;
}

// return XP won by each player depends on score and levels
export function computeMatchXp(scoreA: number, scoreB: number, xpABefore: number, xpBBefore: number): { xpAGain: number; xpBGain: number } {

    // set the base number
    const diff = scoreA - scoreB;
    const xpLose = 50;
    const xpWin = 100;
    const xpPoint = 10;
    let baseA = 0;
    let baseB = 0;

    // base XP
    if (diff > 0) { // A win
        baseA += xpWin;
        baseB += xpLose;
        baseA += xpPoint * diff;
    } else if (diff < 0) { // B win
        baseA += xpLose;
        baseB += xpWin;
        baseB += xpPoint * (-diff);
    } else { // drow
        baseA += xpLose;
        baseB += xpLose;
    }

    // XP multiply by factor depend on levels
    const factorA = xpFactor(xpABefore, xpBBefore);
    const factorB = xpFactor(xpBBefore, xpABefore);

    const xpAGain = Math.round(baseA * factorA);
    const xpBGain = Math.round(baseB * factorB);

    return { xpAGain, xpBGain };
}
