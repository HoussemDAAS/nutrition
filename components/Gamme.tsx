// components/Gamme.tsx
import Link from 'next/link';
import Image from 'next/image';

const Gamme = () => {
  const gammeItems = [
    {
      title: 'Endurance',
      categorySlug: 'pre-workout',
      image: '/endurance.jpg',
    },
    {
        title: 'Brunleur de Graisse',
        categorySlug: 'bruleur-de-graisse',
        image: '/loseweight.jpg',
      },
      {
        title: 'Volume Musculaire',
        categorySlug: 'whey-isolate',
        image: '/muscle.jpg',
      },
      {
        title: 'Bien-être',
        categorySlug: 'multivitamine',
        image: '/bienetre.jpg',
      },

    
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
     

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {gammeItems.map((item, index) => (
            <Link
              key={index}
              href={`/category/${item.categorySlug}`}
              className="group relative block overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-80"
            >
              {/* Image Container */}
              <div className="relative h-full w-full">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transform transition-transform duration-500 group-hover:scale-105"
                  quality={90}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <h3 className="text-2xl font-bold text-white mb-2 relative z-10">
                    {item.title}
                  </h3>
                  <div className="w-8 h-[2px] bg-white mb-4 transition-all group-hover:w-12" />
                  <p className="text-white/90 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 Voir plus →
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gamme;