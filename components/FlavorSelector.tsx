// components/FlavorSelector.tsx
"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface FlavorSelectorProps {
  flavors: string[];
  selectedFlavor: string;
}

export default function FlavorSelector({ flavors, selectedFlavor: initialFlavor }: FlavorSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedFlavor, setSelectedFlavor] = useState(initialFlavor);

  useEffect(() => {
    const flavorParam = searchParams.get("flavor");
    setSelectedFlavor(flavorParam || initialFlavor);
  }, [searchParams, initialFlavor]);

  const handleFlavorChange = (flavor: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("flavor", flavor);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (!flavors?.length) return null;

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-3">Sélectionnez le parfum:</h3>
      <div className="flex flex-wrap gap-2">
        {flavors.map((flavor) => (
          <button
            key={flavor}
            onClick={() => handleFlavorChange(flavor)}
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