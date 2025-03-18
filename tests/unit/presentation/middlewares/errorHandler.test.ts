import { Request, Response } from 'express'
import { ValidationError } from 'yup'

import { HttpError } from '@/errors/HttpErrors'
import { errorHandler } from '@/presentation/middlewares/errorHandler'

describe('ErrorHandler', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    req = {}
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn(),
    }
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should handle HttpError correctly', () => {
    const httpError = new HttpError('Not Found', 404)

    errorHandler(httpError, req as Request, res as Response)

    expect(consoleErrorSpy).toHaveBeenCalledWith(httpError.stack)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'Not Found' })
  })

  it('should handle ValidationError correctly', () => {
    const validationError = new ValidationError(
      'Invalid',
      ['error1', 'error2'],
      'field',
    )

    errorHandler(validationError, req as Request, res as Response)

    expect(consoleErrorSpy).toHaveBeenCalledWith(validationError.stack)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ errors: validationError.errors })
  })

  it('should handle generic error correctly', () => {
    const genericError = new Error('Generic error')

    errorHandler(genericError, req as Request, res as Response)

    expect(consoleErrorSpy).toHaveBeenCalledWith(genericError.stack)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Generic error' })
  })

  it('should return "Unknown error" for a object that it is not an instance of Error', () => {
    const unknownError = {} as unknown as Error

    errorHandler(unknownError, req as Request, res as Response)

    expect(consoleErrorSpy).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Unknown error' })
  })
})
