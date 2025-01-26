import { type SchemaTypeDefinition } from 'sanity'

import {categoryType} from './categoryType'
import { productType } from './productType'
import {brandType} from './brandType'


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [productType,categoryType,brandType],
}
