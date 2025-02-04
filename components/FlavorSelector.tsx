"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function FlavorSelector({ flavors }: { flavors: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedFlavor = searchParams.get('flavor') || flavors[0];

  const handleSelect = (flavor: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('flavor', flavor);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-3">Sélectionnez le parfum:</h3>
      <div className="flex flex-wrap gap-2">
        {flavors.map((flavor) => (
          <button
            key={flavor}
            onClick={() => handleSelect(flavor)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedFlavor === flavor 
                ? "bg-AccentColor text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {flavor}
          </button>
        ))}
      </div>
    </div>
  );
}