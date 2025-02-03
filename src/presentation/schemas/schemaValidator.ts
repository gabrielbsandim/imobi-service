import * as yup from 'yup'

export const schemaValidator = async <T>(
  schema: yup.Schema<T>,
  data: unknown,
  options: yup.ValidateOptions<yup.AnyObject> = {
    abortEarly: false,
  },
): Promise<T> => schema.validate(data, options)
