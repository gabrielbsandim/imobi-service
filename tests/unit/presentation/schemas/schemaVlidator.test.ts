import * as yup from 'yup'

import { schemaValidator } from '@/presentation/schemas/schemaValidator'

describe('schemaValidator', () => {
  const userSchema = yup.object({
    name: yup.string().required('Name is a required field'),
    age: yup
      .number()
      .required('Age is a required field')
      .min(18, 'Age must be at least 18'),
  })

  it('should validate valid data', async () => {
    const validData = { name: 'John Doe', age: 25 }

    const result = await schemaValidator(userSchema, validData)

    expect(result).toEqual(validData)
  })

  it('should throw a validation error when data is invalid', async () => {
    const invalidData = { name: 'John Doe', age: 16 }

    await expect(schemaValidator(userSchema, invalidData)).rejects.toThrow(
      yup.ValidationError,
    )
  })

  it('should return multiple validation errors when required fields are missing', async () => {
    const incompleteData = { age: 16 }

    try {
      await schemaValidator(userSchema, incompleteData)

      fail('Expected a validation error but none was thrown')
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        expect(error.errors).toContain('Name is a required field')

        expect(error.errors).toContain('Age must be at least 18')

        return
      }

      fail('Expected a yup.ValidationError')
    }
  })
})
