import { type SchemaTypeDefinition } from 'sanity'

import {categoryType} from './categoryType'
import { productType } from './productType'
import {brandType} from './brandType'
import {sliderType} from './sliderType'
import { posterType } from './posterType'


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [productType,categoryType,brandType,sliderType,posterType],
}
