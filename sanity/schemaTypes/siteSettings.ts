import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  description: 'Singleton: sitewide text, the "what\'s on" banner, and about-page content.',
  fields: [
    defineField({
      name: 'whatsOn',
      title: "What's on",
      description: 'Shown in the homepage popover. Supports links.',
      type: 'array',
      of: [{ type: 'block', marks: { annotations: [{ name: 'link', type: 'object', fields: [{ name: 'href', type: 'url' }] }] } }],
    }),
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
