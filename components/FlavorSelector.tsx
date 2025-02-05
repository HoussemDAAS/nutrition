"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// FlavorSelector.tsx
export default function FlavorSelector({ flavors }: { flavors: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedFlavor, setSelectedFlavor] = useState('');

  useEffect(() => {
    // Auto-select first flavor if only one exists
    if (flavors.length === 1) {
      const params = new URLSearchParams(searchParams);
      params.set('flavor', flavors[0]);
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [flavors, router, searchParams]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const flavor = e.target.value;
    const params = new URLSearchParams(searchParams);
    params.set('flavor', flavor);
    router.replace(`?${params.toString()}`, { scroll: false });
    setSelectedFlavor(flavor);
  };

  if (flavors.length <= 1) return null;

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-3">Sélectionnez le parfum:</h3>
      <select
        value={selectedFlavor}
        onChange={handleSelect}
        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-AccentColor"
      >
        <option value="">Choisir un parfum</option>
        {flavors.map((flavor) => (
          <option key={flavor} value={flavor}>
            {flavor}
          </option>
        ))}
      </select>
    </div>
  );
};