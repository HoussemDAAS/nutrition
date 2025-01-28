
import {defineField, defineType} from 'sanity'
import {ComposeIcon} from '@sanity/icons'
export const posterType = defineType({
  name: 'poster',
  title: 'poster',
  type: 'document',
  icon:ComposeIcon ,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
        name: "status",
        title: "Status du produit",
        type: "string",
        options: {
          list: [
            { title: "category", value: "category" },
            { title: "product", value: "product" },
            { title: "brand", value: "brand" },
            { title: "Promotion", value: "Promotion" },
          ],
        },
        validation: (Rule) => Rule.required(),
      }),
    defineField({
      name: 'image',
      title: 'slider Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'status',
      media: 'image',
    },},
})
