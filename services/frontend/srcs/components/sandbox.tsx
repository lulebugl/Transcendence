const Sandbox = (props: { children: React.ReactNode, backgroundImage?: boolean, className?: string }) => {
  return (
    <div
      className="w-full min-h-screen bg-cover bg-center" 
      style={{
        backgroundImage: props.backgroundImage !== false ? "url('/lab.jpg')" : "transparent",
      }}
      aria-label="Page background"
    >
      <div className="flex items-center justify-center min-h-screen">
        <main className={`bg-white rounded-xl shadow-lg p-8 border-2 border-white/30 max-w-lg w-full ${props.className}`}>
          {props.children}
        </main>
      </div>
    </div>
  );
};

export default Sandbox;
