import { container } from 'tsyringe'

import { UserService } from '@/application/services/UserService'
import { NotFoundError, UnauthorizedError } from '@/errors/HttpErrors'
import {
  mockUserCreateRequest,
  mockUserEntity,
} from '@/tests/unit/mocks/UserMMock'

const mockUserRepository = {
  findById: jest.fn(),
  findByEmail: jest.fn(),
  create: jest.fn(),
  updateRefreshToken: jest.fn(),
  generateVerificationCode: jest.fn(),
  verifyEmail: jest.fn(),
  markEmailAsVerified: jest.fn(),
  generatePasswordResetCode: jest.fn(),
  verifyPasswordResetCode: jest.fn(),
  updatePassword: jest.fn(),
}

container.register('IUserRepository', { useValue: mockUserRepository })

describe('UserService', () => {
  let userService: UserService

  beforeEach(() => {
    userService = container.resolve(UserService)
    jest.clearAllMocks()

    mockUserRepository.findById.mockResolvedValue(mockUserEntity)
    mockUserRepository.findByEmail.mockResolvedValue(mockUserEntity)
    mockUserRepository.create.mockResolvedValue({ id: mockUserEntity.id })
    mockUserRepository.generateVerificationCode.mockResolvedValue('123456')
    mockUserRepository.verifyEmail.mockResolvedValue(true)
    mockUserRepository.verifyPasswordResetCode.mockResolvedValue(true)
  })

  describe('findById', () => {
    it('should return the user when found', async () => {
      const result = await userService.findById(mockUserEntity.id)

      expect(mockUserRepository.findById).toHaveBeenCalledWith(
        mockUserEntity.id,
      )

      expect(result).toEqual(mockUserEntity)
    })

    it('should throw "NotFoundError" when the user is not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null)

      await expect(userService.findById('non-existent-id')).rejects.toThrow(
        NotFoundError,
      )

      await expect(userService.findById('non-existent-id')).rejects.toThrow(
        'Usuário não encontrado',
      )
    })
  })

  describe('findByEmail', () => {
    it('should return the user when found', async () => {
      const result = await userService.findByEmail(mockUserEntity.email)

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        mockUserEntity.email,
      )

      expect(result).toEqual(mockUserEntity)
    })

    it('should throw "UnauthorizedError" when the user is not found', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null)

      await expect(
        userService.findByEmail('non-existent@email.com'),
      ).rejects.toThrow(UnauthorizedError)

      await expect(
        userService.findByEmail('non-existent@email.com'),
      ).rejects.toThrow('Credenciais inválidas')
    })
  })

  describe('create', () => {
    it('should create a user and return the result', async () => {
      const result = await userService.create(mockUserCreateRequest)

      expect(mockUserRepository.create).toHaveBeenCalledWith(
        mockUserCreateRequest,
      )

      expect(result).toStrictEqual({
        id: mockUserEntity.id,
      })
    })
  })

  describe('updateRefreshToken', () => {
    it('should update the refresh token of a user', async () => {
      const refreshToken = 'new-refresh-token'

      await userService.updateRefreshToken(mockUserEntity.id, refreshToken)

      expect(mockUserRepository.findById).toHaveBeenCalledWith(
        mockUserEntity.id,
      )

      expect(mockUserRepository.updateRefreshToken).toHaveBeenCalledWith(
        mockUserEntity.id,
        refreshToken,
      )
    })

    it('should throw "NotFoundError" when the user is not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null)

      await expect(
        userService.updateRefreshToken('non-existent-id', 'token'),
      ).rejects.toThrow(NotFoundError)

      await expect(
        userService.updateRefreshToken('non-existent-id', 'token'),
      ).rejects.toThrow('Usuário não encontrado')
    })
  })

  describe('generateVerificationCode', () => {
    it('should generate a verification code', async () => {
      const result = await userService.generateVerificationCode(
        mockUserEntity.id,
      )

      expect(mockUserRepository.generateVerificationCode).toHaveBeenCalledWith(
        mockUserEntity.id,
      )
      expect(result).toBe('123456')
    })
  })

  describe('verifyEmail', () => {
    it('should verify email successfully', async () => {
      const result = await userService.verifyEmail(mockUserEntity.id, '123456')

      expect(mockUserRepository.verifyEmail).toHaveBeenCalledWith(
        mockUserEntity.id,
        '123456',
      )
      expect(result).toBe(true)
    })

    it('should return false when verification fails', async () => {
      mockUserRepository.verifyEmail.mockResolvedValue(false)

      const result = await userService.verifyEmail(
        mockUserEntity.id,
        'WRONG_CODE',
      )

      expect(mockUserRepository.verifyEmail).toHaveBeenCalledWith(
        mockUserEntity.id,
        'WRONG_CODE',
      )
      expect(result).toBe(false)
    })
  })

  describe('markEmailAsVerified', () => {
    it('should mark email as verified', async () => {
      await userService.markEmailAsVerified(mockUserEntity.id)

      expect(mockUserRepository.markEmailAsVerified).toHaveBeenCalledWith(
        mockUserEntity.id,
      )
    })
  })

  describe('generatePasswordResetCode', () => {
    it('should generate a password reset code', async () => {
      mockUserRepository.generatePasswordResetCode.mockResolvedValue('654321')

      const result = await userService.generatePasswordResetCode(
        mockUserEntity.id,
      )

      expect(mockUserRepository.generatePasswordResetCode).toHaveBeenCalledWith(
        mockUserEntity.id,
      )
      expect(result).toBe('654321')
    })
  })

  describe('verifyPasswordResetCode', () => {
    it('should verify password reset code successfully', async () => {
      const result = await userService.verifyPasswordResetCode(
        mockUserEntity.id,
        '654321',
      )

      expect(mockUserRepository.verifyPasswordResetCode).toHaveBeenCalledWith(
        mockUserEntity.id,
        '654321',
      )
      expect(result).toBe(true)
    })

    it('should return false when verification fails', async () => {
      mockUserRepository.verifyPasswordResetCode.mockResolvedValue(false)

      const result = await userService.verifyPasswordResetCode(
        mockUserEntity.id,
        'WRONG_CODE',
      )

      expect(mockUserRepository.verifyPasswordResetCode).toHaveBeenCalledWith(
        mockUserEntity.id,
        'WRONG_CODE',
      )
      expect(result).toBe(false)
    })
  })

  describe('updatePassword', () => {
    it('should update user password', async () => {
      await userService.updatePassword(mockUserEntity.id, 'NEW_HASHED_PASSWORD')

      expect(mockUserRepository.updatePassword).toHaveBeenCalledWith(
        mockUserEntity.id,
        'NEW_HASHED_PASSWORD',
      )
    })
  })
})
