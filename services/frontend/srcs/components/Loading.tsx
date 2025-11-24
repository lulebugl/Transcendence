import { Navbar } from "@/components/layout";

const Loading = () => {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-1 relative pt-20 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-8 -mt-[25%]">
        <div className="flex items-center gap-4 group">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 border border-white/20 rotate-45 transition-transform group-hover:rotate-90 duration-700" />
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          </div>
          <div className="flex flex-col group cursor-default select-none">
            <span className="font-bold tracking-[0.2em] text-sm uppercase text-primary group-hover:text-primary/80 transition-colors">Transcendence</span>
            <span className="text-[8px] uppercase tracking-widest text-muted-foreground font-mono">Sys.Ver.2.0</span>
          </div>
        </div>

          <div className="flex flex-col items-center gap-4 mt-4">
            <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-primary animate-loading-bar w-2/3 rounded-full shadow-[0_0_15px_var(--color-primary)]"></div>
            </div>
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground animate-pulse">
              Initializing System...
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Loading;

