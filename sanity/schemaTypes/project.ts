import { defineField, defineType } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      description: 'Controls position on the index page (lower = higher up).',
      type: 'number',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'material',
      title: 'Material',
      type: 'string',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      description: 'Kept as text to allow ranges like "2023-24".',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'indexThumbnail',
      title: 'Index page thumbnail',
      description: 'Small image shown next to this project on the index page.',
      type: 'image',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      description: 'Images shown on the project detail page, in order.',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'year', media: 'indexThumbnail' },
  },
})
