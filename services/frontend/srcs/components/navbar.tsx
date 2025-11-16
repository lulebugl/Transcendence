export const Navbar = () => {
  return (
    <nav className="w-full bg-white/10 backdrop-blur-sm border-b border-white/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Transcendence</h2>
          <div className="flex gap-4">
            {/* Navigation items can be added here */}
          </div>
        </div>
      </div>
    </nav>
  );
};

