import { Navbar } from "@/components/navbar";

const MainLayout = ({ children, backgroundImage = true }: { children: React.ReactNode, backgroundImage?: boolean }) => {
  return (
    <div
      className="w-full min-h-screen bg-cover bg-center" 
      style={{
        backgroundImage: backgroundImage ? "url('/lab.jpg')" : "transparent",
      }}
      aria-label="Page background"
    >
      <div className="bg-black/20 min-h-screen w-full flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
