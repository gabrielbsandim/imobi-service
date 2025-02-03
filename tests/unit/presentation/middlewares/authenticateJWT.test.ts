import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { UnauthorizedError } from '@/errors/HttpErrors'
import { authenticateJWT } from '@/presentation/middlewares/authenticateJWT'

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn().mockImplementation((token, secret, callback) => {
    if (token === 'valid_token') {
      callback(null, { userId: '123', email: 'test@example.com' })
    } else {
      callback(new Error('Token inválido'), null)
    }
  }),
}))

describe('AuthenticateJWT', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let nextFunction: NextFunction

  beforeEach(() => {
    mockRequest = {
      headers: {},
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    nextFunction = jest.fn()
  })

  it('should add the user to the request with a valid token', async () => {
    mockRequest.headers = { authorization: 'Bearer valid_token' }

    authenticateJWT(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    )

    expect(jwt.verify).toHaveBeenCalled()
    expect(nextFunction).toHaveBeenCalled()
    expect(mockRequest.user).toEqual({
      userId: '123',
      email: 'test@example.com',
    })
  })

  it('should return error with code 401 if the token does not exist', async () => {
    authenticateJWT(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    )

    expect(nextFunction).toHaveBeenCalledWith(
      new UnauthorizedError('Token não fornecido'),
    )
  })

  it('should return error with code 401 if the token is invalid', async () => {
    mockRequest.headers = { authorization: 'Bearer invalid_token' }

    authenticateJWT(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    )

    expect(jwt.verify).toHaveBeenCalled()
    expect(nextFunction).toHaveBeenCalledWith(
      new UnauthorizedError('Token inválido ou expirado'),
    )
  })
})
