const items = [
  "Streetwear Nacional",
  "Drop Exclusivo",
  "Entrega Rápida",
  "Qualidade Premium",
  "Edição Limitada",
  "Estilo Urbano",
];

export default function MarqueeBar() {
  return (
    <div className="bg-white text-black py-3 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="text-xs font-black tracking-[0.3em] uppercase mx-8">
            {item} <span className="mx-4 opacity-40">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
