import { type SchemaTypeDefinition } from 'sanity'

import { project } from './project'
import { homepageImage } from './homepageImage'
import { siteSettings } from './siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [project, homepageImage, siteSettings],
}
