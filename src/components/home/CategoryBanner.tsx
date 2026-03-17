import Link from "next/link";

const categories = [
  {
    name: "Camisetas",
    slug: "camisetas",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800",
    span: "col-span-2 row-span-2",
  },
  {
    name: "Moletons",
    slug: "moletons",
    image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800",
    span: "col-span-1",
  },
  {
    name: "Calças",
    slug: "calcas",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800",
    span: "col-span-1",
  },
  {
    name: "Jaquetas",
    slug: "jaquetas",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
    span: "col-span-2",
  },
];

export default function CategoryBanner() {
  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <p className="text-xs font-bold tracking-[0.4em] uppercase text-neutral-500 mb-2">
          Categorias
        </p>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
          Explore por Estilo
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 h-[600px]">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/shop?category=${cat.slug}`}
            className={`relative overflow-hidden group bg-neutral-900 ${cat.span}`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{
                backgroundImage: `url('${cat.image}')`,
                opacity: 0.5,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="text-lg font-black tracking-widest uppercase text-white">
                {cat.name}
              </h3>
              <span className="text-xs text-neutral-400 group-hover:text-white transition-colors tracking-widest uppercase">
                Ver Coleção →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
