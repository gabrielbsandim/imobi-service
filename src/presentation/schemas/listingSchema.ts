import * as yup from 'yup'

import {
  TPropertyType,
  TTransactionType,
} from '@/domain/entities/ListingEntity'

export const createListingSchema = yup.object().shape({
  transactionType: yup
    .mixed<TTransactionType>()
    .oneOf(['buy', 'rent'])
    .required('Tipo de transação é obrigatório'),
  propertyType: yup
    .mixed<TPropertyType>()
    .oneOf(['house', 'apartment', 'studio'])
    .required('Tipo de imóvel é obrigatório'),
  city: yup.string().required('Cidade é obrigatória'),
  description: yup.string().required('Descrição é obrigatória'),
  neighborhood: yup.string().optional(),
  maxPrice: yup.number().min(0).optional(),
  minPrice: yup.number().min(0).optional(),
  bedrooms: yup.number().min(0).optional(),
  bathrooms: yup.number().min(0).optional(),
  minSizeM2: yup.number().min(0).optional(),
  maxSizeM2: yup.number().min(0).optional(),
  parkingSpaces: yup.number().min(0).optional(),
  minFloor: yup.number().min(0).optional(),
})
export type TCreateListingSchema = yup.InferType<typeof createListingSchema>

export const updateListingSchema = yup.object().shape({
  transactionType: yup
    .mixed<TTransactionType>()
    .oneOf(['buy', 'rent'])
    .optional(),
  propertyType: yup
    .mixed<TPropertyType>()
    .oneOf(['house', 'apartment', 'studio'])
    .optional(),
  city: yup.string().optional(),
  description: yup.string().optional(),
  neighborhood: yup.string().optional(),
  maxPrice: yup.number().min(0).optional(),
  minPrice: yup.number().min(0).optional(),
  bedrooms: yup.number().min(0).optional(),
  bathrooms: yup.number().min(0).optional(),
  minSizeM2: yup.number().min(0).optional(),
  maxSizeM2: yup.number().min(0).optional(),
  parkingSpaces: yup.number().min(0).optional(),
  minFloor: yup.number().min(0).optional(),
})
export type TUpdateListingSchema = yup.InferType<typeof updateListingSchema>

export const listFilterListingSchema = yup.object().shape({
  filters: yup.object().shape({
    transactionType: yup
      .mixed<TTransactionType>()
      .oneOf(['buy', 'rent'])
      .optional(),
    propertyType: yup
      .mixed<TPropertyType>()
      .oneOf(['house', 'apartment', 'studio'])
      .optional(),
    city: yup.string().optional(),
    description: yup.string().optional(),
    neighborhood: yup.string().optional(),
    maxPrice: yup.number().min(0).optional(),
    minPrice: yup.number().min(0).optional(),
    bedrooms: yup.number().min(0).optional(),
    bathrooms: yup.number().min(0).optional(),
    minSizeM2: yup.number().min(0).optional(),
    maxSizeM2: yup.number().min(0).optional(),
    parkingSpaces: yup.number().min(0).optional(),
    minFloor: yup.number().min(0).optional(),
    excludeDisliked: yup.boolean().optional(),
    onlyFavorites: yup.boolean().optional(),
    onlyDisliked: yup.boolean().optional(),
  }),
  pagination: yup.object().shape({
    offset: yup.number().min(1).required('Offset é obrigatório.'),
    limit: yup.number().min(1).required('Limit é obrigatório.'),
  }),
})
export type TListFilterListingSchema = yup.InferType<
  typeof listFilterListingSchema
>
