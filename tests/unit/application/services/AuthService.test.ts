import { container } from 'tsyringe'

import { AuthService } from '@/application/services/AuthService'
import { TCreateUserAuth } from '@/domain/entities/UserEntity'

const mockAuthRepository = {
  verifyToken: jest.fn(),
  createFirebaseUser: jest.fn(),
  deleteFirebaseUser: jest.fn(),
}

container.register('IAuthRepository', { useValue: mockAuthRepository })

describe('AuthService', () => {
  let authService: AuthService

  beforeEach(() => {
    authService = container.resolve(AuthService)

    jest.clearAllMocks()
  })

  it('should verify token', async () => {
    const token = 'valid-token'
    const expectedResponse = { uid: 'user123' }

    mockAuthRepository.verifyToken.mockResolvedValue(expectedResponse)

    const result = await authService.verifyToken(token)

    expect(mockAuthRepository.verifyToken).toHaveBeenCalledWith(token)

    expect(result).toEqual(expectedResponse)
  })

  it('should register a user', async () => {
    const user: TCreateUserAuth = {
      email: 'test@example.com',
      password: 'secret',
      displayName: 'Display name',
    }

    const expectedResponse = { uid: 'user123' }

    mockAuthRepository.createFirebaseUser.mockResolvedValue(expectedResponse)

    const result = await authService.register(user)

    expect(mockAuthRepository.createFirebaseUser).toHaveBeenCalledWith(user)

    expect(result).toEqual(expectedResponse)
  })

  it('should delete a user', async () => {
    const userId = 'user123'
    const expectedResponse = { success: true }

    mockAuthRepository.deleteFirebaseUser.mockResolvedValue(expectedResponse)

    const result = await authService.delete(userId)

    expect(mockAuthRepository.deleteFirebaseUser).toHaveBeenCalledWith(userId)

    expect(result).toEqual(expectedResponse)
  })
})
