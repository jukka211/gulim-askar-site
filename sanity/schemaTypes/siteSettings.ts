import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  description: 'Singleton: sitewide text and about-page content.',
  fields: [
    defineField({ name: 'email', title: 'Contact email', type: 'string' }),
    defineField({ name: 'instagramUrl', title: 'Instagram URL', type: 'url' }),
    defineField({ name: 'shopUrl', title: 'Shop URL', type: 'url' }),
    defineField({ name: 'aboutName', title: 'About: name', type: 'string' }),
    defineField({ name: 'aboutOrigination', title: 'About: origination', type: 'string' }),
    defineField({ name: 'aboutBirthYear', title: 'About: birth year', type: 'string' }),
    defineField({ name: 'aboutPortrait', title: 'About: portrait image', type: 'image' }),
    defineField({
      name: 'aboutBio',
      title: 'About: bio text',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site settings' }),
  },
})
