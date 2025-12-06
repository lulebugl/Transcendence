export const MOCK_USER = {
  id: 3,
  username: "CyberPilot_42",
  email: "cyberpilot@transcendence.io",
  avatar_url: "https://api.dicebear.com/9.x/avataaars/svg?seed=tryHarsdfsf",
  level: 42,
  xp: 8500,
  nextLevelXp: 10000,
  rank: "Diamond",
  rankPosition: 127,
  totalPlayers: 4823,
  memberSince: "Jan 2024",
  status: "online" as const,
};

export type MockUser = typeof MOCK_USER;

