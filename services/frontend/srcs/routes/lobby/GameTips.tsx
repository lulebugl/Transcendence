import { Target } from "lucide-react";
import { useEffect, useState } from "react";

const GAME_TIPS = [
  "Aim for the corners — harder for opponents to predict",
  "The ball speeds up after each hit. Stay alert!",
];

export const GameTips = () => {
  const [tip, setTip] = useState<string>(GAME_TIPS[0]);

  useEffect(() => {
    const randomTip = GAME_TIPS[Math.floor(Math.random() * GAME_TIPS.length)];
    setTip(randomTip);
  }, []);

  return (
    <section
      className="flex items-center justify-center gap-4 pb-6 animate-fade-in-up"
      style={{ animationDelay: "0.5s" }}
    >
      <div className="flex items-center gap-3 px-5 py-3 rounded-full border border-white/5 bg-white/2">
        <Target className="w-4 h-4 text-primary" />
        <span className="text-xs text-muted-foreground">
          <span className="text-primary font-medium">Pro tip:</span> {tip}
        </span>
      </div>
    </section>
  );
};
