import { Request, Response, NextFunction } from 'express'
import { container } from 'tsyringe'

import { AuthService } from '@/application/services/AuthService'
import { UserService } from '@/application/services/UserService'
import { UnauthorizedError } from '@/errors/HttpErrors'
import { authenticate } from '@/presentation/middlewares/authenticate'

const mockAuthService: any = {
  verifyToken: jest.fn(),
}

const mockUserService: any = {
  findById: jest.fn(),
}

const mockAuthRepository = {
  verifyToken: jest.fn(),
}

const mockUserRepository = {
  findById: jest.fn(),
}

container.register('IUserRepository', { useValue: mockUserRepository })
container.register('IAuthRepository', { useValue: mockAuthRepository })

container.registerInstance(AuthService, mockAuthService)
container.registerInstance(UserService, mockUserService)

describe('authenticate middleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  jest.spyOn(console, 'error').mockImplementation()

  beforeEach(() => {
    req = { headers: {} }
    res = {}
    next = jest.fn()

    jest.clearAllMocks()
  })

  it('should call next with UnauthorizedError if the authorization header does not exist', async () => {
    await authenticate(req as Request, res as Response, next)

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError))

    expect((next as jest.Mock).mock.calls[0][0].message).toBe('Token inválido')
  })

  it('should call next with UnauthorizedError if the authorization header does not start with "Bearer "', async () => {
    req.headers = { authorization: 'TokenInvalido' }

    await authenticate(req as Request, res as Response, next)

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError))

    expect((next as jest.Mock).mock.calls[0][0].message).toBe('Token inválido')
  })

  it('should assign the user to req.user and call next if authentication is successful', async () => {
    const token = 'valid-token'

    req.headers = { authorization: `Bearer ${token}` }

    const decodedToken = {
      userId: 'user123',
      email: 'user@example.com',
      userType: 'buyer',
    }
    const user = {
      id: 'user123',
      name: 'John Doe',
      email: 'user@example.com',
      userType: 'buyer',
    }

    mockAuthService.verifyToken.mockResolvedValue(decodedToken)
    mockUserService.findById.mockResolvedValue(user)

    await authenticate(req as Request, res as Response, next)

    expect(mockAuthService.verifyToken).toHaveBeenCalledWith(token)

    expect(mockUserService.findById).toHaveBeenCalledWith(decodedToken.userId)

    expect(req.user).toEqual(user)
    expect(req.userId).toEqual(user.id)
    expect(req.userEmail).toEqual(user.email)
    expect(req.userType).toEqual(user.userType)

    expect(next).toHaveBeenCalledWith()
  })

  it('should call next with UnauthorizedError if authService.verifyToken throws an error', async () => {
    const token = 'invalid-token'

    req.headers = { authorization: `Bearer ${token}` }

    mockAuthService.verifyToken.mockRejectedValue(new Error('Invalid token'))

    await authenticate(req as Request, res as Response, next)

    expect(mockAuthService.verifyToken).toHaveBeenCalledWith(token)

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError))

    expect((next as jest.Mock).mock.calls[0][0].message).toBe(
      'Token inválido ou expirado',
    )
  })

  it('should call next with UnauthorizedError if userService.findById throws an error', async () => {
    const token = 'valid-token'

    req.headers = { authorization: `Bearer ${token}` }

    const decodedToken = {
      userId: 'user123',
      email: 'user@example.com',
      userType: 'buyer',
    }

    mockAuthService.verifyToken.mockResolvedValue(decodedToken)
    mockUserService.findById.mockRejectedValue(new Error('User not found'))

    await authenticate(req as Request, res as Response, next)

    expect(mockUserService.findById).toHaveBeenCalledWith(decodedToken.userId)

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError))

    expect((next as jest.Mock).mock.calls[0][0].message).toBe(
      'Token inválido ou expirado',
    )
  })
})
