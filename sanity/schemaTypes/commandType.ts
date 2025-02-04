import { defineField, defineType } from 'sanity'

export const commandType = defineType({
  name: 'command',
  title: 'Command',
  type: 'document',
  fields: [
    defineField({
      name: 'customer',
      title: 'Customer Information',
      type: 'object',
      fields: [
        defineField({
          name: 'firstName', 
          type: 'string', 
          title: 'First Name',
          validation: Rule => Rule.required()
        }),
        defineField({
          name: 'lastName',
          type: 'string',
          title: 'Last Name',
          validation: Rule => Rule.required()
        }),
        defineField({
          name: 'email',
          type: 'string',
          title: 'Email',
          validation: Rule => Rule.required().email()
        }),
        defineField({
          name: 'phone',
          type: 'string',
          title: 'Phone Number',
          validation: Rule => Rule.required()
        }),
        defineField({
          name: 'address',
          type: 'text',
          title: 'Address',
          validation: Rule => Rule.required()
        }),
        defineField({
          name: 'city',
          type: 'string',
          title: 'City',
          validation: Rule => Rule.required()
        }),
  
    
       
      ]
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [defineField({
        name: 'orderItem',
        type: 'object',
        fields: [
          defineField({
            name: 'gout',
            type: 'string',
            title: 'Selected Flavor'
          }),
          defineField({
            name: 'product',
            type: 'reference',
            to: [{ type: 'produit' }],
            validation: Rule => Rule.required()
          }),
          defineField({
            name: 'quantity',
            type: 'number',
            validation: Rule => Rule.required().min(1)
          }),
          defineField({
            name: 'price',
            type: 'number',
            validation: Rule => Rule.required()
          })
        ]
      })]
    }),
    defineField({
      name: 'coupon',
      type: 'string',
      title: 'Coupon Code'
    }),
    defineField({
      name: 'total',
      type: 'number',
      title: 'Total Price',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'status',
      type: 'string',
      title: 'Status',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Confirmed', value: 'confirmed' },
          { title: 'Shipped', value: 'shipped' },
          { title: 'Delivered', value: 'delivered' },
        ]
      },
      initialValue: 'pending'
    }),
    defineField({
      name: 'createdAt',
      type: 'datetime',
      title: 'Order Date',
      initialValue: (new Date()).toISOString()
    })
  ],
  preview: {
    select: {
      name: 'customer.firstName',
      email: 'customer.email', // Updated to match new structure
      total: 'total',
      status: 'status',
      date: 'createdAt'
    },
    prepare({ name, email, total, status, date }) {
      return {
        title: `${name}'s Order (${email})`,
        subtitle: `${status} - ${total} TND - ${new Date(date).toLocaleDateString()}`
      }
    }
  }
});