import { Link } from "react-router";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/Button";

export function DevHub() {
  return (
    <Layout>
      <div className="container pt-24 mx-auto flex flex-col items-center justify-center gap-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Dev Hub</h1>
        <div className="flex flex-col gap-4 w-full">
          <Button asChild>
            <a
              href="https://local.drizzle.studio"
              target="_blank"
              rel="noopener noreferrer"
            >
              Drizzle Studio
            </a>
          </Button>
          <Button asChild>
            <Link to="/dev/playground/ui">UI Playground</Link>
          </Button>
          <Button asChild>
            <Link to="/dev/playground/components">Components Playground</Link>
          </Button>
		  <Button asChild>
            <Link to="/dev/simulate-game">Simulate Game</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
