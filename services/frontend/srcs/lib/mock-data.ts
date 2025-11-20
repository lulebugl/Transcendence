export const CURRENT_USER = {
  id: "u1",
  username: "NeoPaddle",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NeoPaddle",
  rank: "Diamond",
  level: 42,
  xp: 8500,
  nextLevelXp: 10000,
  stats: {
    wins: 124,
    losses: 45,
    winRate: "73%",
    totalMatches: 169,
  },
  credits: 2500,
};

export const RECENT_MATCHES = [
  { id: 1, opponent: "CyberPong_01", result: "WIN", score: "11-9", date: "2h ago", mode: "Ranked" },
  { id: 2, opponent: "GlitchUser", result: "LOSS", score: "8-11", date: "5h ago", mode: "Tournament" },
  { id: 3, opponent: "AI_Hard", result: "WIN", score: "11-2", date: "1d ago", mode: "Practice" },
];

export const TOURNAMENTS = [
  { id: 1, name: "Neon City Championship", status: "Live", participants: "128/256", prize: "5000 Credits", date: "Now" },
  { id: 2, name: "Weekly Rookie Cup", status: "Registration", participants: "45/64", prize: "1000 Credits", date: "Starts in 2h" },
  { id: 3, name: "Legends League", status: "Finished", participants: "32/32", prize: "10000 Credits", date: "Ended yesterday" },
];

export const LEADERBOARD = [
  { rank: 1, username: "ZeroCool", points: 2500, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zero" },
  { rank: 2, username: "AcidBurn", points: 2350, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Acid" },
  { rank: 3, username: "CrashOverride", points: 2200, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Crash" },
  { rank: 4, username: "NeoPaddle", points: 2100, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NeoPaddle" }, // Current User
  { rank: 5, username: "CerealKiller", points: 1950, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Cereal" },
];

export const FRIENDS = [
  { id: 1, username: "Trinity", status: "online", activity: "In Match" },
  { id: 2, username: "Morpheus", status: "offline", activity: "Last seen 5m ago" },
  { id: 3, username: "Tank", status: "online", activity: "Lobby" },
];

