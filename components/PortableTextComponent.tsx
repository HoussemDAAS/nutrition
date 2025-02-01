"use client";

import { PortableTextComponents } from "next-sanity";


import SanityImage from "./SanityImage";
; // Adjust the import path as necessary

export const PortableTextComponent: PortableTextComponents = {
  block: {
    h2: ({children}) => <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>,
    h3: ({children}) => <h3 className="text-xl font-semibold mt-5 mb-2">{children}</h3>,
    normal: ({children}) => <p className="mb-4 text-gray-600 leading-relaxed">{children}</p>,
    blockquote: ({children}) => <blockquote className="border-l-4 border-primary pl-4 italic my-4">{children}</blockquote>,
  },
  list: {
    bullet: ({children}) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
    number: ({children}) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
  },
  marks: {
    strong: ({children}) => <strong className="font-semibold">{children}</strong>,
    em: ({children}) => <em className="italic">{children}</em>,
    link: ({value, children}) => (
      <a 
        href={value?.href} 
        className="text-primary hover:underline"
        target="_blank" 
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: SanityImage,
  },
};