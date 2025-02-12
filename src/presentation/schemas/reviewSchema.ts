import * as yup from 'yup'

export const createReviewSchema = yup.object().shape({
  rating: yup
    .number()
    .integer('The value must be an integer')
    .min(1, 'The value must be at least 1')
    .max(5, 'The value must be at most 5')
    .required('The rating is required'),
})

export type TCreateReviewSchema = yup.InferType<typeof createReviewSchema>
