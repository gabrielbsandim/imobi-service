import { NextFunction, Request, Response } from 'express'
import { container } from 'tsyringe'

import { TTokenPayload } from '@/domain/entities/UserEntity'
import { UnauthorizedError } from '@/errors/HttpErrors'
import { AuthMiddleware } from '@/presentation/middlewares/AuthMiddleware'

const mockAuthService = {
  verifyToken: jest.fn(),
}

container.register('AuthService', { useValue: mockAuthService })

describe('AuthMiddleware', () => {
  let authMiddleware: AuthMiddleware
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockNext: NextFunction

  const mockTokenPayload: TTokenPayload = {
    userId: 'user-id',
    email: 'test@example.com',
    userType: 'buyer',
  }

  beforeEach(() => {
    authMiddleware = container.resolve(AuthMiddleware)
    mockRequest = {
      headers: {},
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    mockNext = jest.fn()
    jest.clearAllMocks()

    mockAuthService.verifyToken.mockResolvedValue(mockTokenPayload)
  })

  it('should throw UnauthorizedError when authorization header is missing', async () => {
    await expect(
      authMiddleware.handle(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      ),
    ).rejects.toThrow(UnauthorizedError)

    await expect(
      authMiddleware.handle(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      ),
    ).rejects.toThrow('Token não fornecido')

    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should throw UnauthorizedError when token format is invalid', async () => {
    mockRequest.headers = {
      authorization: 'InvalidFormat',
    }

    await expect(
      authMiddleware.handle(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      ),
    ).rejects.toThrow(UnauthorizedError)

    await expect(
      authMiddleware.handle(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      ),
    ).rejects.toThrow('Token mal formatado')

    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should call next and set user data when token is valid', async () => {
    mockRequest.headers = {
      authorization: 'Bearer valid-token',
    }

    await authMiddleware.handle(
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    )

    expect(mockAuthService.verifyToken).toHaveBeenCalledWith('valid-token')
    expect(mockRequest.userId).toBe(mockTokenPayload.userId)
    expect(mockRequest.userEmail).toBe(mockTokenPayload.email)
    expect(mockRequest.userType).toBe(mockTokenPayload.userType)
    expect(mockNext).toHaveBeenCalled()
  })

  it('should throw UnauthorizedError when token verification fails', async () => {
    mockRequest.headers = {
      authorization: 'Bearer invalid-token',
    }

    mockAuthService.verifyToken.mockRejectedValue(
      new UnauthorizedError('Token inválido ou expirado'),
    )

    await expect(
      authMiddleware.handle(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      ),
    ).rejects.toThrow(UnauthorizedError)

    await expect(
      authMiddleware.handle(
        mockRequest as Request,
        mockResponse as Response,
        mockNext,
      ),
    ).rejects.toThrow('Token inválido ou expirado')

    expect(mockNext).not.toHaveBeenCalled()
  })
})
