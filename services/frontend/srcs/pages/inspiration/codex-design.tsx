import {
  Activity,
  Flame,
  Gamepad2,
  Layers,
  Radio,
  Shield,
  Sparkles,
  Target,
  Trophy,
  UsersRound,
  Waves,
} from "lucide-react";

const navigation = [
  { label: "Control Deck", icon: Activity, active: true },
  { label: "Arena", icon: Gamepad2 },
  { label: "Tournaments", icon: Trophy },
  { label: "Loadouts", icon: Layers },
  { label: "Settings", icon: Shield },
];

const statRings = [
  { label: "Elo", value: 1875, max: 2200, accent: "from-[#19f0d0] to-[#56fff4]" },
  { label: "Win Rate", value: 68, max: 100, accent: "from-[#ff3fb4] to-[#ffa3d5]" },
  { label: "Streak", value: 7, max: 15, accent: "from-[#7c5bff] to-[#b79dff]" },
];

const scoreTimeline = [
  { label: "Axis", score: 32, opponent: "Flux", result: "W 2-0" },
  { label: "Halo", score: 24, opponent: "Quanta", result: "L 1-2" },
  { label: "Pulse", score: 40, opponent: "Drift", result: "W 2-1" },
  { label: "Orbit", score: 36, opponent: "Vex", result: "W 2-0" },
  { label: "Nova", score: 42, opponent: "Lumen", result: "W 2-1" },
  { label: "Rift", score: 28, opponent: "Splice", result: "L 0-2" },
  { label: "Quell", score: 44, opponent: "Zen", result: "W 2-1" },
];

const tournaments = [
  {
    name: "Quantum Rally",
    stage: "Group Orbit",
    slots: "12 / 16",
    prize: "2 500 XP",
    badge: "Live",
  },
  {
    name: "Gravity Cup",
    stage: "Elimination Grid",
    slots: "8 / 8",
    prize: "Legendary Decal",
    badge: "Locked",
  },
  {
    name: "Axis Clash",
    stage: "Qualifiers",
    slots: "34 / 64",
    prize: "500 Tokens",
    badge: "Open",
  },
];

const liveArena = [
  { players: ["Flux", "Aurora"], energy: 82, status: "sudden death" },
  { players: ["Helix", "Strata"], energy: 61, status: "overtime" },
  { players: ["Nova", "Vanta"], energy: 48, status: "best of 3" },
];

const achievements = [
  {
    title: "Singularity Ace",
    description: "Sweep five sudden-death rounds in ranked arena.",
    icon: Sparkles,
  },
  {
    title: "Graviton Anchor",
    description: "Hold defensive wall for 90s without conceding.",
    icon: Shield,
  },
  {
    title: "Pulse Curator",
    description: "Curate three custom arenas with 95% rating.",
    icon: Waves,
  },
];

const timelineMax = Math.max(...scoreTimeline.map((point) => point.score));

const CodexDesign = () => {
  const timelinePath = scoreTimeline
    .map((point, index) => {
      const x = (index / (scoreTimeline.length - 1)) * 100;
      const y = 100 - (point.score / timelineMax) * 80 - 5;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  const timelineArea = `${timelinePath} L 100 100 L 0 100 Z`;

  return (
      <div className="relative min-h-screen overflow-hidden bg-[#03030f] text-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] bg-gradient-to-b from-[#060b1b] via-[#090c22] to-transparent opacity-90 blur-3xl" />
        <div className="pointer-events-none absolute inset-y-0 left-1/2 h-[120%] w-[50%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(25,240,208,0.18),_transparent_60%)] blur-3xl" />
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pb-16 pt-10 lg:flex-row">
          <aside className="w-full rounded-[32px] border border-white/5 bg-white/5 p-6 backdrop-blur-2xl lg:w-64">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-xs uppercase tracking-[0.35em] text-teal-200/70">Pilot</div>
              <div className="mt-2 flex items-end gap-2">
                <p className="text-3xl font-semibold">NovaPulse</p>
                <span className="rounded-full border border-white/20 px-2 py-0.5 text-[0.65rem] uppercase tracking-wide text-white/70">
                  Ascendant III
                </span>
              </div>
              <p className="mt-4 text-sm text-white/70">
                Adaptive paddle tuned for hyperspin volleys. Syncs with personal quantum ID.
              </p>
            </div>
            <nav className="mt-6 space-y-1">
              {navigation.map(({ label, icon: Icon, active }) => (
                <button
                  key={label}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition ${
                    active
                      ? "bg-gradient-to-r from-[#19f0d0]/30 to-[#ff3fb4]/20 text-white"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </nav>
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/20 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-white/60">Next Queue</p>
              <p className="mt-3 text-2xl font-semibold">Arcade Flux</p>
              <p className="text-sm text-white/70">Window opens in 08:24</p>
              <div className="mt-4 flex gap-3">
                <button className="flex-1 rounded-xl bg-white/15 py-2 text-sm font-medium text-white">
                  Queue Match
                </button>
                <button className="flex items-center justify-center rounded-xl border border-white/20 px-3 py-2 text-white/60">
                  <Radio className="h-4 w-4" />
                </button>
              </div>
            </div>
          </aside>

          <main className="flex-1 space-y-8">
            <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl">
              <div className="flex flex-col gap-8 lg:flex-row">
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-[0.4em] text-teal-200/70">
                    Transcendence Control Deck
                  </p>
                  <h1 className="mt-3 text-4xl font-semibold leading-tight">Command your 3D Pong legacy</h1>
                  <p className="mt-4 max-w-lg text-base text-white/70">
                    Monitor ranked pulses, lock-in for tournaments, and orchestrate custom arenas under a single holo surface.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button className="rounded-2xl bg-gradient-to-r from-[#19f0d0] to-[#38ffe6] px-5 py-2.5 text-sm font-semibold text-[#061323]">
                      Launch Arena
                    </button>
                    <button className="rounded-2xl border border-white/30 px-5 py-2.5 text-sm font-semibold text-white">
                      Invite Squad
                    </button>
                  </div>
                </div>
                <div className="grid flex-1 gap-6 md:grid-cols-3">
                  {statRings.map((stat) => {
                    const progress = stat.value / stat.max;
                    return (
                      <div key={stat.label} className="flex flex-col items-center gap-3 text-center">
                        <div
                          className="relative h-28 w-28 rounded-full p-[6px]"
                          style={{
                            background: `conic-gradient(#19f0d0 ${progress * 360}deg, rgba(255,255,255,0.08) 0deg)`,
                          }}
                        >
                          <div className="absolute inset-[3px] rounded-full bg-[#080a1b]" />
                          <div className="relative flex h-full w-full flex-col items-center justify-center rounded-full bg-[#05060f]">
                            <span className="text-2xl font-semibold">{stat.value}</span>
                            <span className="text-[0.65rem] uppercase tracking-[0.3em] text-white/50">{stat.label}</span>
                          </div>
                        </div>
                        <div className="text-xs uppercase tracking-[0.3em] text-white/60">
                          {Math.round(progress * 100)}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
              <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/60">Score Timeline</p>
                    <h2 className="text-2xl font-semibold">Arc Ranked Pulse</h2>
                  </div>
                  <div className="flex gap-2 rounded-full border border-white/10 bg-white/20 p-1">
                    {["Ranked", "Arcade", "Custom"].map((label, index) => (
                      <button
                        key={label}
                        className={`rounded-full px-3 py-1 text-xs ${
                          index === 0 ? "bg-white text-[#05060f]" : "text-white/70"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-6 h-52 rounded-3xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent p-4">
                  <svg viewBox="0 0 100 100" className="h-full w-full">
                    <defs>
                      <linearGradient id="timelineLine" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#19f0d0" />
                        <stop offset="100%" stopColor="#ff3fb4" />
                      </linearGradient>
                      <linearGradient id="timelineFill" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(25,240,208,0.25)" />
                        <stop offset="100%" stopColor="rgba(25,240,208,0)" />
                      </linearGradient>
                    </defs>
                    <path d={timelineArea} fill="url(#timelineFill)" stroke="none" />
                    <path d={timelinePath} fill="none" stroke="url(#timelineLine)" strokeWidth={1.5} strokeLinecap="round" />
                    {scoreTimeline.map((point, index) => {
                      const x = (index / (scoreTimeline.length - 1)) * 100;
                      const y = 100 - (point.score / timelineMax) * 80 - 5;
                      return (
                        <g key={point.label}>
                          <circle cx={x} cy={y} r={1.5} fill="#fff" />
                        </g>
                      );
                    })}
                  </svg>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {scoreTimeline.slice(-3).map((match) => (
                    <div key={match.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-white/60">{match.label} Circuit</p>
                      <p className="mt-2 text-2xl font-semibold">{match.result}</p>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/40">vs {match.opponent}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4 rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/60">Tournaments</p>
                    <h2 className="text-2xl font-semibold">Upcoming Pulses</h2>
                  </div>
                  <Trophy className="h-7 w-7 text-[#ffb347]" />
                </div>
                <div className="space-y-3">
                  {tournaments.map((event) => (
                    <div
                      key={event.name}
                      className="rounded-2xl border border-white/10 bg-white/15 p-4 hover:border-white/30"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-lg font-semibold">{event.name}</p>
                        <span className="rounded-full border border-white/20 px-3 py-0.5 text-[0.6rem] uppercase tracking-[0.3em]">
                          {event.badge}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-white/70">{event.stage}</div>
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/50">
                        <span>{event.slots} slots</span>
                        <span className="h-1 w-1 rounded-full bg-white/30" />
                        <span>{event.prize}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full rounded-2xl border border-white/30 px-4 py-3 text-sm font-semibold text-white">
                  Browse Brackets
                </button>
              </div>
            </section>

            <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/60">Live Arena Feed</p>
                    <h2 className="text-2xl font-semibold">Spectate and boost</h2>
                  </div>
                  <UsersRound className="h-6 w-6 text-white/60" />
                </div>
                <div className="mt-6 space-y-4">
                  {liveArena.map((match) => (
                    <div
                      key={match.players.join("-")}
                      className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-center"
                    >
                      <div className="flex flex-1 items-center justify-between gap-3">
                        <div className="flex flex-1 items-center justify-between gap-3 text-lg font-semibold">
                          <span>{match.players[0]}</span>
                          <div className="flex flex-col items-center text-xs uppercase tracking-[0.3em] text-[#19f0d0]">
                            <Target className="h-5 w-5" />
                            vs
                          </div>
                          <span className="text-white/70">{match.players[1]}</span>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col gap-2">
                        <div className="h-2 rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#19f0d0] to-[#ff3fb4]"
                            style={{ width: `${match.energy}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-white/50">
                          <span>{match.status}</span>
                          <span>{match.energy}% energy</span>
                        </div>
                      </div>
                      <button className="rounded-xl border border-white/30 px-4 py-2 text-sm font-medium text-white/80">
                        Spectate
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-white/60">Account Capsule</p>
                    <h2 className="text-2xl font-semibold">Loadout & Security</h2>
                  </div>
                  <Shield className="h-6 w-6 text-white/60" />
                </div>
                <div className="mt-6 space-y-4">
                  {achievements.map(({ title, description, icon: Icon }) => (
                    <div key={title} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/15 p-4">
                      <div className="rounded-2xl border border-white/20 bg-white/5 p-3">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{title}</p>
                        <p className="text-sm text-white/70">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-2xl border border-white/10 bg-[#05060f] p-5">
                  <div className="flex items-center gap-3">
                    <Flame className="h-5 w-5 text-[#ffb347]" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-white/60">Security Pulse</p>
                      <p className="text-lg font-semibold text-white">Multi-factor lock engaged</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-white/60">
                    Quantum tether synchronized. Recovery beacons stored in vault fragment #07.
                  </p>
                </div>
              </div>
            </section>
          </main>
        </div>
        <div className="fixed inset-x-0 bottom-4 mx-auto flex w-full max-w-sm items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-[0.65rem] uppercase tracking-[0.4em] backdrop-blur-lg md:hidden">
          <span>Deck</span>
          <span>Arena</span>
          <span>Events</span>
          <span>Loadout</span>
      </div>
    </div>
  );
};

export default CodexDesign;
