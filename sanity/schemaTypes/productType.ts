import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "produit",
  title: "Produit",
  type: "document",
  icon: TrolleyIcon,
  fields: [
    defineField({
      name: "nom",
      title: "Nom du produit",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "nom",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Introduction du produit",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "categorie",
      title: "Categorie",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "prix",
      title: "Prix du produit",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "remise",
      title: "Remise du produit",
      type: "number",
    }),
    defineField({
      name: "stock",
      title: "Stock du produit",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "Status",
      title: "Status du produit",
      type: "string",
      options: {
        list: [
          { title: "Nouveau", value: "Nouveau" },
          { title: "Indisponible", value: "Indisponible" },
          { title: "Disponible", value: "Disponible" },
          { title: "Promotion", value: "Promotion" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
        name: "variantes",
        title: "Variantes du produit",
        type: "string",
        options: {
          list: [
            { title: "Promotion", value: "Promotion" },
            { title: "Packs Exclusifs", value: "Packs Exclusifs" },
            { title: "Pre-Workout", value: "Pre-Workout" },
          ],
        },

      }),
    defineField({
      name: "images",
      title: "Images du produit",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],

      validation: (Rule) => Rule.required(),
    }),
  ],
  preview :{
    select: {
      title: 'nom',
      subtitle: 'prix',
      media: 'images',
    },
    prepare(selection) {
      const {title, subtitle, media} = selection
      return {
        title,
        subtitle: `${subtitle} TND`,
        media: media[0]
      }
    }
  }
});
