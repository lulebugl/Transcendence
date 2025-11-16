const Background = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="w-full min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/lab.jpg')",
      }}
      aria-label="Page background"
    >
      <div className="bg-black/20 min-h-screen w-full flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default Background;
