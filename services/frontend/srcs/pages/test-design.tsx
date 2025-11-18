import type { ComponentType, ReactNode } from "react";
import {
  Activity,
  BadgeCheck,
  BellRing,
  ChartSpline,
  Clock,
  Flame,
  Play,
  Plus,
  Radar,
  Shield,
  SignalHigh,
  Sparkles,
  Target,
  Trophy,
  Users,
  Video,
  Waves,
} from "lucide-react";
import { cn } from "../lib/utils";

const navigation = ["Dashboard", "Matches", "Tournaments", "Community", "Settings"];

const queueFilters = [
  { label: "Ranked", active: true },
  { label: "Arcade", active: false },
  { label: "Local", active: false },
  { label: "VR Ready", active: true },
];

const statCards = [
  { label: "Neo Rating", value: "1,482", delta: "+42 this week", icon: Trophy },
  { label: "Win / Loss", value: "72% / 28%", delta: "12 W streak", icon: Target },
  { label: "Rally Avg", value: "14 hits", delta: "top 9% players", icon: Activity },
  { label: "Perfect Returns", value: "328", delta: "+18 today", icon: Sparkles },
];

const upcomingMatches = [
  {
    id: "neo-01",
    opponent: "LunaFlux",
    avatar: "https://i.pravatar.cc/80?u=luna-flux",
    mode: "Ranked • Bo3",
    arena: "Neon Rift",
    startTime: "Today · 18:40",
    latency: "18 ms",
    status: "check-in",
  },
  {
    id: "neo-02",
    opponent: "EchoBlade",
    avatar: "https://i.pravatar.cc/80?u=echoblade",
    mode: "Arcade • Endless",
    arena: "Gravity Well",
    startTime: "Tomorrow · 09:15",
    latency: "23 ms",
    status: "scheduled",
  },
];

const tournaments = [
  {
    name: "Photon Cup • S2",
    stage: "Quarter Finals",
    progress: 68,
    reward: "Top 32 badge",
    status: "Advanced",
  },
  {
    name: "Community Clash",
    stage: "Swiss Stage · Round 4",
    progress: 42,
    reward: "Exclusive paddle skin",
    status: "In progress",
  },
];

const highlights = [
  {
    title: "Perfect curved serve",
    duration: "00:27",
    likes: 214,
    opponents: ["ZeroShift", "Nova"],
  },
  {
    title: "Flawless comeback",
    duration: "01:14",
    likes: 389,
    opponents: ["Pulse", "Orbit"],
  },
];

const friends = [
  { name: "Axia", status: "Queueing ranked", latency: "16 ms" },
  { name: "Monet", status: "In match · 2-1", latency: "21 ms" },
  { name: "Orion", status: "Lobbying", latency: "32 ms" },
];

const skillFocus = [
  { label: "Serve spin", value: 78 },
  { label: "Wall control", value: 65 },
  { label: "Counter speed", value: 92 },
];

const TestDesign = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-10 h-64 w-64 rounded-full bg-cyan-500/30 blur-[140px]" />
        <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-purple-600/20 blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(12,14,29,0.6),_rgba(4,7,16,0.95))]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300/70">
              Pong³ Companion
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <h1 className="text-3xl font-semibold text-white sm:text-4xl">Neon Dashboard</h1>
              <span className="rounded-full border border-cyan-400/40 px-3 py-1 text-xs font-medium text-cyan-200">
                v0.5 concept
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Track ranked progress, scout tournaments, drop into a match, or just vibe with the
              community. Everything you need before loading the 3D arena.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 backdrop-blur">
              <BellRing className="h-4 w-4 text-cyan-300" />
              Inbox (3)
            </button>
            <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400/80 to-indigo-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:scale-[1.01]">
              <Play className="h-4 w-4" />
              Start Match
            </button>
          </div>
        </header>

        <nav className="mt-8 flex flex-wrap gap-3 text-sm text-slate-400">
          {navigation.map((item) => (
            <button
              key={item}
              className={cn(
                "rounded-full border border-transparent px-4 py-2 transition",
                item === "Dashboard"
                  ? "border-cyan-300/40 bg-white/5 text-white"
                  : "hover:border-white/20 hover:bg-white/5",
              )}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="mt-10 grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)_320px]">
          <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Queue</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {queueFilters.map((filter) => (
                  <span
                    key={filter.label}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium backdrop-blur",
                      filter.active
                        ? "border-cyan-300/60 bg-cyan-300/10 text-cyan-100"
                        : "border-white/10 text-slate-400",
                    )}
                  >
                    {filter.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-900/30 p-4">
              <p className="text-sm font-semibold text-white">System status</p>
              <div className="mt-4 space-y-3 text-sm text-slate-400">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-cyan-200">
                    <SignalHigh className="h-4 w-4" />
                    Latency
                  </span>
                  <span className="font-semibold text-white">16 ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-purple-200">
                    <Shield className="h-4 w-4" />
                    Anti-cheat
                  </span>
                  <span className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-slate-300">
                    Synced
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-rose-200">
                    <Waves className="h-4 w-4" />
                    Controllers
                  </span>
                  <span className="text-white">88%</span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <p className="font-semibold text-white">Crew online</p>
                <button className="text-cyan-200 hover:text-cyan-100">Invite</button>
              </div>
              <div className="mt-3 space-y-3">
                {friends.map((friend) => (
                  <div
                    key={friend.name}
                    className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px] shadow-emerald-400/60" />
                        <p className="font-medium text-white">{friend.name}</p>
                      </div>
                      <span className="text-xs text-slate-500">{friend.latency}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{friend.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <main className="space-y-6">
            <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/70 via-indigo-900/30 to-purple-900/30 p-6 backdrop-blur">
              <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-slate-300">
                    <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                    Resume from last session
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Neo arena</p>
                    <h2 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">
                      Cloudstream Run · Rally 22
                    </h2>
                  </div>
                  <p className="text-sm text-slate-300">
                    Your doubles match with <span className="text-white">LunaFlux</span> resumes mid-set.
                    Continue warm or scout opponents while the arena loads in the background.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <Tag icon={Clock} label="Last saved · 12m ago" />
                    <Tag icon={Users} label="Doubles · Sync ready" />
                    <Tag icon={Radar} label="Spatial audio online" />
                  </div>
                  <div className="flex flex-wrap gap-3 pt-3 text-sm">
                    <button className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 font-semibold text-slate-900 shadow-lg shadow-cyan-500/25 transition hover:-translate-y-0.5">
                      <Play className="h-4 w-4" />
                      Resume match
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-5 py-2.5 text-slate-200">
                      <Video className="h-4 w-4" />
                      Spectate lobby
                    </button>
                  </div>
                </div>
                <CourtPreview />
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => (
                <article
                  key={card.label}
                  className="rounded-3xl border border-white/10 bg-slate-900/70 p-4 shadow-[0_20px_60px_-40px_rgba(15,118,230,0.8)]"
                >
                  <div className="flex items-center justify-between">
                    <div className="rounded-2xl bg-white/5 p-2 text-cyan-200">
                      <card.icon className="h-4 w-4" />
                    </div>
                    <MiniSparkline variant={card.label} />
                  </div>
                  <p className="mt-6 text-xs uppercase tracking-[0.3em] text-slate-500">{card.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{card.value}</p>
                  <p className="text-sm text-emerald-300">{card.delta}</p>
                </article>
              ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <article className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <SectionHeader title="Upcoming matches" subtitle="Ready checks · invites" icon={Clock}>
                  <button className="inline-flex items-center gap-1 rounded-full border border-white/10 px-4 py-1 text-xs font-medium text-slate-300">
                    <Plus className="h-4 w-4" />
                    Create lobby
                  </button>
                </SectionHeader>
                <div className="mt-4 space-y-4">
                  {upcomingMatches.map((match) => (
                    <div
                      key={match.id}
                      className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-slate-900/60 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={match.avatar}
                          alt={match.opponent}
                          className="h-12 w-12 rounded-2xl border border-white/10 object-cover"
                        />
                        <div>
                          <p className="text-sm text-slate-400">{match.mode}</p>
                          <p className="text-lg font-semibold text-white">{match.opponent}</p>
                          <p className="text-xs text-slate-500">{match.arena}</p>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                        <div className="text-right text-sm">
                          <p className="font-medium text-white">{match.startTime}</p>
                          <p className="text-xs text-slate-500">Latency · {match.latency}</p>
                        </div>
                        <button className="rounded-2xl border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                          {match.status}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <SectionHeader title="Tournaments" subtitle="Seasonal + community" icon={Trophy}>
                  <button className="text-xs font-medium text-cyan-200 hover:text-cyan-100">
                    View brackets
                  </button>
                </SectionHeader>
                <div className="mt-4 space-y-4">
                  {tournaments.map((event) => (
                    <div
                      key={event.name}
                      className="rounded-2xl border border-white/5 bg-slate-900/60 p-4 shadow-[0_0_30px_-15px_rgba(14,165,233,0.9)]"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{event.stage}</p>
                          <p className="text-lg font-semibold text-white">{event.name}</p>
                        </div>
                        <span className="rounded-full border border-cyan-300/30 px-3 py-1 text-xs text-cyan-200">
                          {event.status}
                        </span>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>Progress</span>
                          <span>{event.progress}%</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500"
                            style={{ width: `${event.progress}%` }}
                          />
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-slate-400">{event.reward}</p>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
                <SectionHeader title="Match highlights" subtitle="Clips ready to share" icon={Video}>
                  <button className="text-xs text-slate-400 hover:text-white">Open studio</button>
                </SectionHeader>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {highlights.map((clip) => (
                    <div key={clip.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="relative overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br from-slate-900 to-slate-800 p-4">
                        <div className="h-24 rounded-lg bg-gradient-to-r from-cyan-500/40 to-purple-500/30">
                          <div className="absolute inset-0 origin-center animate-pulse rounded-lg border border-white/5" />
                        </div>
                        <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                          {clip.duration}
                        </span>
                      </div>
                      <p className="mt-3 text-base font-semibold text-white">{clip.title}</p>
                      <p className="text-xs text-slate-400">
                        vs {clip.opponents.join(" • ")} · {clip.likes} likes
                      </p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
                <SectionHeader title="Community heat" subtitle="Live challenges + streaks" icon={Flame}>
                  <button className="text-xs text-cyan-200 hover:text-cyan-100">Join challenge</button>
                </SectionHeader>
                <div className="mt-4 space-y-5">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-semibold text-white">Longest Rally · Week 12</p>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <div>
                        <p className="text-slate-400">Current top</p>
                        <p className="text-lg font-semibold text-white">38 hits</p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-400">Your best</p>
                        <p className="text-lg font-semibold text-cyan-200">34 hits</p>
                      </div>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-white/5">
                      <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-400" style={{ width: "89%" }} />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm font-semibold text-white">Clean Sweep · Ranked only</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.3em] text-emerald-300">4 / 5 wins</p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3 text-xs text-slate-400">
                        <BadgeCheck className="mb-1 h-4 w-4 text-emerald-300" />
                        Win without conceding 5 points.
                      </div>
                      <button className="rounded-2xl border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                        Track
                      </button>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-4">
                    <p className="text-sm font-semibold text-white">Community Lobby “Nightfall”</p>
                    <p className="text-xs text-slate-300">12 players warming up · latency avg 22 ms</p>
                    <button className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs text-cyan-100">
                      <Users className="h-4 w-4" />
                      Drop in
                    </button>
                  </div>
                </div>
              </article>
            </section>
          </main>

          <aside className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <article className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
              <SectionHeader title="Skill focus" subtitle="Micro goals" icon={Target} />
              <div className="mt-4 space-y-3 text-sm">
                {skillFocus.map((skill) => (
                  <div key={skill.label}>
                    <div className="flex items-center justify-between text-xs">
                      <p className="text-slate-400">{skill.label}</p>
                      <p className="font-semibold text-white">{skill.value}%</p>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-500"
                        style={{ width: `${skill.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
              <SectionHeader title="Heatmap radar" subtitle="Return zones" icon={Radar} />
              <div className="mt-4 flex flex-col items-center gap-4">
                <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950">
                  <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
                  <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
                  <div className="absolute inset-x-10 top-1/2 h-px -translate-y-1/2 bg-white/5" />
                  <div className="absolute inset-y-6 left-1/2 w-px -translate-x-1/2 bg-white/5" />
                  <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/60 blur-md" />
                  <div className="absolute left-1/2 top-10 h-5 w-5 -translate-x-1/2 rounded-full bg-cyan-300/70 blur" />
                  <div className="absolute left-1/4 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-purple-400/60 blur" />
                  <div className="absolute right-16 bottom-12 h-4 w-4 rounded-full bg-rose-400/60 blur" />
                </div>
                <div className="w-full space-y-2 text-xs text-slate-400">
                  <p className="flex items-center justify-between">
                    Baseline defense <span className="text-cyan-200">42%</span>
                  </p>
                  <p className="flex items-center justify-between">
                    Mid-court traps <span className="text-purple-200">33%</span>
                  </p>
                  <p className="flex items-center justify-between">
                    Front flicks <span className="text-rose-200">25%</span>
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/70 to-slate-900/30 p-4">
              <SectionHeader title="Daily tip" subtitle="AI coach" icon={ChartSpline} />
              <p className="mt-3 text-sm text-slate-300">
                Load serves with higher arc when latency spikes above 30 ms. It widens your safe
                return window by ~220 ms without slowing overall pace.
              </p>
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-400">
                <p className="font-semibold text-white">Micro drill</p>
                <p>Practice curved serves for 6 minutes, focus on 18° paddle tilt.</p>
              </div>
              <button className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-cyan-100">
                <Sparkles className="h-4 w-4" />
                Queue drill
              </button>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Syncs</p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-lg font-semibold text-white">Connections</p>
                <button className="text-xs text-cyan-300">Manage</button>
              </div>
              <div className="mt-4 space-y-3">
                <SyncRow label="Twitch" status="Auto highlights" />
                <SyncRow label="Discord" status="Lobby status" />
                <SyncRow label="Babylon XR" status="Localized" />
              </div>
            </article>
          </aside>
        </div>
      </div>
    </div>
  );
};

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  icon?: ComponentType<{ className?: string }>;
  children?: ReactNode;
};

const SectionHeader = ({ title, subtitle, icon: Icon, children }: SectionHeaderProps) => (
  <div className="flex flex-wrap items-center gap-3">
    <div className="flex items-center gap-2">
      {Icon ? (
        <span className="rounded-2xl bg-white/5 p-2 text-cyan-200">
          <Icon className="h-4 w-4" />
        </span>
      ) : null}
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        {subtitle ? <p className="text-xs text-slate-500">{subtitle}</p> : null}
      </div>
    </div>
    <div className="ml-auto">{children}</div>
  </div>
);

const Tag = ({ icon: Icon, label }: { icon: ComponentType<{ className?: string }>; label: string }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
    <Icon className="h-3.5 w-3.5 text-cyan-200" />
    {label}
  </span>
);

const MiniSparkline = ({ variant }: { variant: string }) => {
  const gradient =
    variant === "Neo Rating"
      ? "from-cyan-400 to-indigo-500"
      : variant === "Win / Loss"
        ? "from-emerald-400 to-lime-400"
        : variant === "Rally Avg"
          ? "from-amber-400 to-orange-500"
          : "from-fuchsia-400 to-rose-400";

  return (
    <div className="h-12 w-20 rounded-xl bg-black/30 p-1">
      <div className={cn("h-full w-full rounded-lg bg-gradient-to-r", gradient)} />
    </div>
  );
};

const CourtPreview = () => (
  <div className="relative min-h-[220px] rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 shadow-[0_40px_120px_-50px_rgba(14,165,233,0.8)]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.08),_transparent)]" />
    <div className="relative h-full w-full rounded-2xl border border-cyan-200/20 p-4">
      <div className="absolute inset-4 rounded-xl border border-cyan-200/20" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-[2px] w-3/4 bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent" />
      </div>
      <div className="absolute inset-y-6 left-1/2 w-[2px] -translate-x-1/2 bg-cyan-200/20" />
      <div className="absolute left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-white/30 bg-white/10 shadow-[0_0_25px_rgba(255,255,255,0.4)]" />
      <div className="absolute right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border border-white/30 bg-white/10 shadow-[0_0_25px_rgba(14,165,233,0.6)]" />
      <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-400 shadow-[0_0_25px_rgba(251,113,133,0.8)]" />
    </div>
    <div className="mt-4 flex items-center justify-between text-xs text-cyan-200">
      <span className="inline-flex items-center gap-2">
        <SignalHigh className="h-4 w-4" />
        Synced 3D assets
      </span>
      <span className="inline-flex items-center gap-2 text-slate-300">
        <Waves className="h-4 w-4" />
        Holo depth: 78%
      </span>
    </div>
  </div>
);

const SyncRow = ({ label, status }: { label: string; status: string }) => (
  <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-900/40 px-3 py-2">
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.7)]" />
      <p className="text-white">{label}</p>
    </div>
    <p className="text-xs text-slate-400">{status}</p>
  </div>
);

export default TestDesign;
