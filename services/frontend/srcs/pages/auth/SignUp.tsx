import { Link } from "react-router";
import { ArrowRight, Lock, User, Mail, Sparkles } from "lucide-react";
import { MainLayout } from "@/components/main-layout";

const Signup = () => {
  return (
	<MainLayout>
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6">
      
      {/* Ambient Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative w-full max-w-md">
        <div className="relative z-10 border border-white/5 bg-card/30 backdrop-blur-xl rounded-2xl overflow-hidden">
          
          {/* Card Header */}
          <div className="p-8 text-center border-b border-white/5 space-y-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-b from-white/5 to-transparent opacity-50" />
            <h1 className="relative text-3xl font-bold tracking-tighter text-white">IDENTITY // CREATION</h1>
            <p className="relative text-sm text-muted-foreground font-light">Register a new pilot profile in the database.</p>
          </div>

          {/* Form */}
          <div className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Username</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-white transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" 
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all"
                    placeholder="PILOT_01"
                  />
                </div>
              </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Email Frequency</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <input 
                  type="email" 
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all"
                  placeholder="PILOT@NET.COM"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Security Key</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-white transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input 
                  type="password" 
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button className="mt-4 group relative w-full py-4 bg-white text-black text-sm font-bold tracking-[0.2em] uppercase clip-path-button overflow-hidden transition-all hover:bg-white/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <span className="relative flex items-center justify-center gap-3">
                Register Identity <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>

          {/* Footer */}
          <div className="p-6 bg-black/20 border-t border-white/5 text-center">
            <p className="text-xs text-muted-foreground">
              Already have clearance? <br/>
              <Link to="/auth/login" className="text-white hover:text-primary transition-colors font-medium uppercase tracking-wider mt-2 inline-block border-b border-white/20 hover:border-primary">
                Access System
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
	</MainLayout>
  );
};

export default Signup;
