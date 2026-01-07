import { Link } from "react-router";
import { AlertTriangle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";

export const NotFound = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-6">
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-destructive/10 blur-3xl rounded-full" />
          <AlertTriangle className="w-32 h-32 text-destructive/80 relative z-10" />
        </div>

        <h1 className="text-6xl font-bold text-foreground tracking-tighter">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-muted-foreground">
          System Error: Sector Not Found
        </h2>

        <p className="text-muted-foreground max-w-xs text-center">
          The coordinates you requested are outside the known grid. <br />
          Return to base immediately.
        </p>

        <Link
          to="/"
          className="mt-4 px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_20px_-5px_var(--color-primary)]"
        >
          Return to Homepage
        </Link>
      </div>
    </Layout>
  );
};

// because api is redirected via nginx this page is never shown
export const Unauthorized = () => {
	return (
	  <Layout>
		<div className="flex flex-col items-center justify-center h-[80vh] space-y-6">
		  <div className="relative mb-4">
			<div className="absolute inset-0 bg-destructive/10 blur-3xl rounded-full" />
			<AlertTriangle className="w-32 h-32 text-destructive/80 relative z-10" />
		  </div>
  
		  <h1 className="text-6xl font-bold text-foreground tracking-tighter">
			401
		  </h1>
		  <h2 className="text-2xl font-semibold text-muted-foreground">
			System Error: Unauthorized
		  </h2>
  
		  <p className="text-muted-foreground max-w-xs text-center">
			You are not authorized to access this page. <br />
		  </p>
  
		  <Link
			to="/"
			className="mt-4 px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_20px_-5px_var(--color-primary)]"
		  >
			Return to Homepage
		  </Link>
		</div>
	  </Layout>
	);
  };
