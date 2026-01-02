export function xpForLevel(L: number): number {

    // parameters of the curb for XP
    const XP_MAX = 100000.0;
    const k = 0.126376;
    const L0 = 36.4014;
    const C = 1177.3525;

    // equation
    const xp = XP_MAX / (1.0 + Math.exp(-k * (L - L0))) - C;

    // security for 0
    if (xp < 0.0) return 0.0;

    return xp;
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