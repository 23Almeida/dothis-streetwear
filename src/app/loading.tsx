export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <span className="text-xs tracking-widest uppercase text-neutral-600">
          Carregando...
        </span>
      </div>
    </div>
  );
}
