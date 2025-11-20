import { useState } from "react";
import { 
  Trophy, 
  Gamepad2, 
  User, 
  Settings, 
  LogOut, 
  TrendingUp, 
  Activity, 
  Clock,
  ChevronRight,
  Crown,
  Sword,
  Target,
  LayoutDashboard
} from "lucide-react";

const GeminiDesign = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock Data
  const user = {
    name: "NeoPlayer_99",
    rank: "Diamond II",
    level: 42,
    xp: 78, // percentage
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neo",
    stats: {
      wins: 142,
      losses: 38,
      winRate: "78%",
      tournamentWins: 5
    }
  };

  const recentMatches = [
    { id: 1, opponent: "CyberPunk_X", result: "WIN", score: "11 - 4", date: "2h ago", mode: "Ranked" },
    { id: 2, opponent: "GlitchUser", result: "LOSS", score: "9 - 11", date: "5h ago", mode: "Tournament" },
    { id: 3, opponent: "RetroWave", result: "WIN", score: "11 - 2", date: "1d ago", mode: "Casual" },
    { id: 4, opponent: "NullPointer", result: "WIN", score: "11 - 9", date: "2d ago", mode: "Ranked" },
  ];

  const tournaments = [
    { id: 1, name: "Neon City Championship", status: "Live", players: "12/16", prize: "1000 XP" },
    { id: 2, name: "Midnight Protocol Cup", status: "Registering", players: "4/32", prize: "Rare Skin" },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-cyan-500/30">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-700" />
        <div className="absolute top-[40%] left-[50%] translate-x-[-50%] w-[800px] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative z-10 flex h-screen overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-20 lg:w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 flex flex-col justify-between py-6 transition-all duration-300">
          <div>
            <div className="px-6 mb-12 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg shadow-lg shadow-cyan-500/20 flex items-center justify-center transform rotate-3">
                <Gamepad2 size={20} className="text-white" />
              </div>
              <span className="hidden lg:block text-xl font-bold tracking-tight">PONG<span className="text-cyan-400">3D</span></span>
            </div>

            <nav className="space-y-2 px-3">
              {[
                { id: "overview", icon: LayoutDashboard, label: "Overview" },
                { id: "play", icon: Gamepad2, label: "Play Now" },
                { id: "tournaments", icon: Trophy, label: "Tournaments" },
                { id: "profile", icon: User, label: "Profile" },
                { id: "settings", icon: Settings, label: "Settings" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    activeTab === item.id 
                      ? "bg-gradient-to-r from-cyan-500/20 to-transparent text-cyan-400 border-l-2 border-cyan-400" 
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon size={22} className={`transition-transform group-hover:scale-110 ${activeTab === item.id ? "text-cyan-400" : ""}`} />
                  <span className="hidden lg:block font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="px-3">
            <button className="w-full flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-red-400 transition-colors rounded-xl hover:bg-red-500/10">
              <LogOut size={22} />
              <span className="hidden lg:block font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scrollbar-hide">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1">Welcome back, {user.name}</h1>
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Online Server US-East
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-sm font-medium text-white">Level {user.level}</span>
                <div className="w-32 h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-purple-500" 
                    style={{ width: `${user.xp}%` }} 
                  />
                </div>
              </div>
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity" />
                <img 
                  src={user.avatar} 
                  alt="User Avatar" 
                  className="w-12 h-12 rounded-full relative border-2 border-white/20 z-10 bg-black"
                />
              </div>
            </div>
          </header>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Stats Cards */}
            <div className="col-span-1 md:col-span-4 grid grid-cols-2 gap-4">
              <div className="col-span-2 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-cyan-500/30 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-500">
                    <Crown size={20} />
                  </div>
                  <span className="text-xs font-bold px-2 py-1 bg-white/10 rounded-full text-gray-300">RANK</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{user.rank}</h3>
                <p className="text-xs text-gray-400">Top 5% of players</p>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="text-cyan-400 mb-2"><Sword size={20} /></div>
                <div className="text-xl font-bold">{user.stats.wins}</div>
                <div className="text-xs text-gray-400">Total Wins</div>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="text-purple-400 mb-2"><Target size={20} /></div>
                <div className="text-xl font-bold">{user.stats.winRate}</div>
                <div className="text-xs text-gray-400">Win Rate</div>
              </div>
            </div>

            {/* Hero / Play Section */}
            <div className="col-span-1 md:col-span-8 relative group overflow-hidden rounded-2xl border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-black/80 to-black/90 z-0" />
              {/* Abstract 3D Representation */}
              <div className="absolute right-[-50px] top-[-50px] w-64 h-64 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
              
              <div className="relative z-10 p-8 h-full flex flex-col justify-center items-start">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold mb-4 tracking-wider uppercase">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  Ready to play
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4 max-w-md leading-tight">
                  Dominate the <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                    Virtual Arena
                  </span>
                </h2>
                <p className="text-gray-400 mb-8 max-w-md">
                  Enter the immersive 3D Pong experience. Compete in ranked matches or join daily tournaments to win exclusive rewards.
                </p>
                <button className="group relative px-8 py-3 bg-white text-black font-bold rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10 group-hover:text-white flex items-center gap-2">
                    Start Match <ChevronRight size={18} />
                  </span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="col-span-1 md:col-span-7 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Activity size={20} className="text-cyan-400" />
                  Match History
                </h3>
                <button className="text-xs text-gray-400 hover:text-white transition-colors">View All</button>
              </div>
              
              <div className="space-y-3">
                {recentMatches.map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group border border-transparent hover:border-white/5">
                    <div className="flex items-center gap-4">
                      <div className={`w-1 h-8 rounded-full ${match.result === 'WIN' ? 'bg-green-500' : 'bg-red-500'}`} />
                      <div>
                        <div className="font-bold text-sm">{match.opponent}</div>
                        <div className="text-xs text-gray-400">{match.mode}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-mono font-bold text-lg tracking-widest">{match.score}</span>
                      <div className="text-right min-w-[60px]">
                        <div className={`text-xs font-bold ${match.result === 'WIN' ? 'text-green-400' : 'text-red-400'}`}>
                          {match.result}
                        </div>
                        <div className="text-[10px] text-gray-500">{match.date}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tournament Status */}
            <div className="col-span-1 md:col-span-5 space-y-6">
              <div className="rounded-2xl bg-gradient-to-br from-purple-900/40 to-black/40 border border-purple-500/20 p-6 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Trophy size={20} className="text-purple-400" />
                    Active Tournaments
                  </h3>
                </div>
                
                <div className="space-y-4">
                  {tournaments.map(tourney => (
                    <div key={tourney.id} className="relative p-4 rounded-xl bg-black/40 border border-white/5 overflow-hidden group hover:border-purple-500/30 transition-all">
                      {tourney.status === 'Live' && (
                        <div className="absolute top-0 right-0 px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold rounded-bl-lg border-l border-b border-red-500/20 animate-pulse">
                          LIVE
                        </div>
                      )}
                      <h4 className="font-bold text-sm mb-1">{tourney.name}</h4>
                      <div className="flex justify-between text-xs text-gray-400 mt-2">
                        <span className="flex items-center gap-1"><User size={12} /> {tourney.players}</span>
                        <span className="text-purple-300">{tourney.prize}</span>
                      </div>
                      <div className="mt-3 w-full bg-white/10 h-1 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-4 py-2 text-sm text-purple-300 hover:text-purple-200 font-medium border border-purple-500/30 rounded-lg hover:bg-purple-500/10 transition-colors">
                  Join Tournament
                </button>
              </div>

              {/* Quick Stats Chart Placeholder */}
              <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-md flex flex-col justify-center items-center text-center min-h-[150px]">
                 <div className="mb-2 p-3 bg-cyan-500/10 rounded-full text-cyan-400">
                   <TrendingUp size={24} />
                 </div>
                 <h4 className="text-sm font-bold text-gray-300">Performance Analysis</h4>
                 <p className="text-xs text-gray-500 mt-1">Play 5 more ranked games to unlock advanced stats.</p>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default GeminiDesign;

