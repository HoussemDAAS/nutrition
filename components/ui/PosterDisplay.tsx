"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { Poster } from "@/sanity.types";
import { Button } from "./button";

const PosterDisplay = () => {
  const [posters, setPosters] = React.useState<Poster[]>([]);
  const query = `*[_type == 'poster'] | order(_createdAt asc)`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.fetch(query);
        setPosters(response);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [query]);

  return (
    <div className="flex flex-col md:flex-row gap-8 p-4 max-w-6xl mx-auto mt-4 mb-10">
      {posters.slice(0, 2).map((poster: Poster) => (
        <div key={poster._id} className="flex-1 group relative">
          {/* Image */}
          <div className="overflow-hidden rounded-lg shadow-lg">
            <Image
              src={
                poster?.image
                  ? urlFor(poster.image).quality(100).width(800).url()
                  : ""
              }
              alt={poster?.title || "Poster image"}
              width={400} // Slightly smaller
              height={600} // Slightly smaller
              className="w-full h-auto object-cover transform transition-transform duration-300 group-hover:scale-105"
            />
          </div>

        

          {/* Button */}
          <Link
            href={`${poster.status}/${poster.slug?.current}` || "#"} // Replace with your desired link
            className="mt-4 text-center items-center justify-center flex"
          >
            
            <Button  className="w-1/2 bg-transparent text-AccentColor shadow-none border border-AccentColor/30 font-semibold tracking-wide hover:bg-AccentColor hover:text-white flex items-center justify-center transition-transform duration-500 transform hover:scale-105">
            Voir Plus
            </Button >
          </Link>
        </div>
      ))}
    </div>
  );
};

export default PosterDisplay;