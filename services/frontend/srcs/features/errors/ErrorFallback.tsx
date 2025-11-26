import { Link } from "react-router";
import { Layout } from "@/components/layout/layout";

interface ErrorFallbackProps {
  error?: Error | null;
  resetError?: () => void;
}

export function DefaultErrorFallback({ error }: ErrorFallbackProps) {
  return (
    <Layout>
      <div className="h-[90vh] flex items-center justify-center bg-background">
        <div className="text-center space-y-4 p-8 max-w-md">
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Something went wrong
          </h1>
          <p className="text-muted-foreground">
            {error?.message || "An unexpected error occurred"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 my-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    </Layout>
  );
}

export function PongErrorFallback() {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 p-8">
          <h1 className="text-2xl font-bold">Failed to load game</h1>
          <p className="text-muted-foreground">
            Your browser may not support WebGL, or the game assets failed to
            load.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </Layout>
  );
}
