import { useState } from "react";
import { User, Trophy } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { FormInput } from "@/components/forms/FormInput";
import { FormError } from "@/components/forms/FormError";
import { Button } from "@/components/ui/Button";
import { toast } from "@/components/ui/toast";
import { apiRequest } from "@/api/api";

interface SimulateGameResponse {
  success: boolean;
  message: string;
  player1: { id: number; username: string; score: number };
  player2: { id: number; username: string; score: number };
  xpResult: {
    player1XpGain: number;
    player2XpGain: number;
  } | null;
}

export function SimulateGame() {
  const [player1Username, setPlayer1Username] = useState("");
  const [player2Username, setPlayer2Username] = useState("");
  const [player1Score, setPlayer1Score] = useState("");
  const [player2Score, setPlayer2Score] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SimulateGameResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setIsSubmitting(true);

    try {
      const p1Username = player1Username.trim();
      const p2Username = player2Username.trim();
      const p1ScoreNum = parseInt(player1Score, 10);
      const p2ScoreNum = parseInt(player2Score, 10);

      if (!p1Username || !p2Username) {
        setError("Both player usernames are required");
        setIsSubmitting(false);
        return;
      }

      if (p1Username === p2Username) {
        setError("Player 1 and Player 2 must be different users");
        setIsSubmitting(false);
        return;
      }

      if (isNaN(p1ScoreNum) || isNaN(p2ScoreNum)) {
        setError("Scores must be valid numbers");
        setIsSubmitting(false);
        return;
      }

      if (p1ScoreNum < 0 || p2ScoreNum < 0) {
        setError("Scores must be non-negative");
        setIsSubmitting(false);
        return;
      }

      const response = await apiRequest<SimulateGameResponse>(
        "/api/test/simulate-game",
        {
          method: "POST",
          body: JSON.stringify({
            player1Username: p1Username,
            player2Username: p2Username,
            player1Score: p1ScoreNum,
            player2Score: p2ScoreNum,
          }),
        }
      );

      setResult(response);
      toast.success("Game simulated successfully!");
    } catch (err) {
      const error = err as Error;
      console.error("Simulate game failed", error.message);
      setError(error.message || "Failed to simulate game");
      toast.error(error.message || "Failed to simulate game");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container pt-24 mx-auto flex flex-col items-center justify-center gap-6 max-w-2xl">
        <div className="w-full">
          <h1 className="text-3xl font-bold mb-2">Simulate Game</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Test game finalization by simulating a match with predefined scores
          </p>

          <div className="relative z-10 border border-white/5 bg-card/30 backdrop-blur-xl rounded-2xl overflow-hidden">
            <div className="p-8 text-center border-b border-white/5 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse" />
                <span className="text-[10px] font-mono text-primary tracking-[0.2em] uppercase">
                  Dev Mode
                </span>
              </div>
              <h2 className="text-2xl font-bold tracking-tighter text-white">
                GAME // SIMULATION
              </h2>
              <p className="text-sm text-muted-foreground font-light">
                Enter player usernames and scores to test game finalization
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Player 1
                  </h3>
                  <FormInput
                    label="Username"
                    id="player1-username"
                    value={player1Username}
                    onChange={(e) => {
                      setPlayer1Username(e.target.value);
                      if (error) setError(null);
                    }}
                    icon={User}
                    placeholder="player1"
                    required
                  />
                  <FormInput
                    label="Score"
                    id="player1-score"
                    type="number"
                    value={player1Score}
                    onChange={(e) => {
                      setPlayer1Score(e.target.value);
                      if (error) setError(null);
                    }}
                    icon={Trophy}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                <div className="space-y-6">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Player 2
                  </h3>
                  <FormInput
                    label="Username"
                    id="player2-username"
                    value={player2Username}
                    onChange={(e) => {
                      setPlayer2Username(e.target.value);
                      if (error) setError(null);
                    }}
                    icon={User}
                    placeholder="player2"
                    required
                  />
                  <FormInput
                    label="Score"
                    id="player2-score"
                    type="number"
                    value={player2Score}
                    onChange={(e) => {
                      setPlayer2Score(e.target.value);
                      if (error) setError(null);
                    }}
                    icon={Trophy}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
              </div>

              {error && <FormError message={error} />}

              {result && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg space-y-3">
                  <p className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                    Game Simulated Successfully
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
                        {result.player1.username}
                      </p>
                      <p className="text-white font-semibold">
                        Score: {result.player1.score}
                      </p>
                      {result.xpResult && (
                        <p className="text-emerald-400 text-xs mt-1">
                          +{result.xpResult.player1XpGain} XP
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
                        {result.player2.username}
                      </p>
                      <p className="text-white font-semibold">
                        Score: {result.player2.score}
                      </p>
                      {result.xpResult && (
                        <p className="text-emerald-400 text-xs mt-1">
                          +{result.xpResult.player2XpGain} XP
                        </p>
                      )}
                    </div>
                  </div>
                  {!result.xpResult && (
                    <p className="text-xs text-muted-foreground italic">
                      Draw - No XP gained
                    </p>
                  )}
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full font-bold tracking-[0.2em] uppercase"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                Simulate Game
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
