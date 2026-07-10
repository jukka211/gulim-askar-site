import { defineField, defineType } from 'sanity'

export const homepageImage = defineType({
  name: 'homepageImage',
  title: 'Homepage image',
  type: 'document',
  description:
    'One tile in the homepage mouse-follow gallery. Links to a project; a project can have several of these.',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'project',
      title: 'Links to project',
      type: 'reference',
      to: [{ type: 'project' }],
    }),
    defineField({
      name: 'order',
      title: 'Order',
      description: 'Position in the animation sequence (lower = earlier).',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'project.title', subtitle: 'order', media: 'image' },
  },
})
