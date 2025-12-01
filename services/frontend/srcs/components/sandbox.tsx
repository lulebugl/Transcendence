const Sandbox = (props: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`relative bg-white rounded-xl shadow-lg h-full p-8 mt-24 mx-auto border-2 border-white/30 max-w-xl w-full ${props.className}`}
    >	
      {props.children}
    </div>
  );
};

export default Sandbox;
