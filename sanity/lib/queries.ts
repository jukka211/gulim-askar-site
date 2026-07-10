import { defineQuery } from 'next-sanity'

export const homepageImagesQuery = defineQuery(`
  *[_type == "homepageImage"] | order(order asc) {
    _id,
    order,
    image,
    "projectSlug": project->slug.current
  }
`)

export const projectsListQuery = defineQuery(`
  *[_type == "project"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    year,
    indexThumbnail
  }
`)

export const projectBySlugQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    material,
    year,
    description,
    gallery
  }
`)

export const projectSlugsQuery = defineQuery(`
  *[_type == "project"]{ "slug": slug.current }
`)

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0] {
    whatsOn,
    email,
    instagramUrl,
    shopUrl,
    aboutName,
    aboutOrigination,
    aboutBirthYear,
    aboutPortrait,
    aboutBio
  }
`)
