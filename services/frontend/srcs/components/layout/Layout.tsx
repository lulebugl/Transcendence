import { Toaster } from "@/components/ui/Sonner";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col overflow-x-hidden">
      <Navbar />
      <Toaster />
      <main className="flex-1 relative pt-20 md:px-12 px-4 w-full">
        {children}
      </main>
	  <Footer />
    </div>
  );
};
