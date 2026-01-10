export default function GridBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full min-h-screen bg-background 
      /* Dotted Grid Effect */
      bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] 
      [background-size:32px_32px]">
      
      {/* Midab khafiif ah oo gradient ah si grid-ku uusan indhaha u daalin */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background -z-10" />
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}