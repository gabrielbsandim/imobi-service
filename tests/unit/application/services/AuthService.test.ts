import { container } from 'tsyringe'

import { AuthService } from '@/application/services/AuthService'
import { TTokenPayload } from '@/domain/entities/UserEntity'
import { BadRequestError, UnauthorizedError } from '@/errors/HttpErrors'
import {
  mockUserCredentials,
  mockUserCreateRequest,
  mockUserEntity,
} from '@/tests/unit/mocks/UserMMock'

const mockAuthRepository = {
  hashPassword: jest.fn(),
  comparePassword: jest.fn(),
  generateAccessToken: jest.fn(),
  generateRefreshToken: jest.fn(),
  verifyToken: jest.fn(),
  verifyRefreshToken: jest.fn(),
}

const mockUserService = {
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

const mockEmailService = {
  sendWelcomeEmail: jest.fn(),
  sendVerificationEmail: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}

container.register('IAuthRepository', { useValue: mockAuthRepository })
container.register('UserService', { useValue: mockUserService })
container.register('EmailService', { useValue: mockEmailService })

describe('AuthService', () => {
  let authService: AuthService
  const mockTokenPayload: TTokenPayload = {
    userId: mockUserEntity.id,
    email: mockUserEntity.email,
    userType: mockUserEntity.userType,
  }

  beforeEach(() => {
    authService = container.resolve(AuthService)
    jest.clearAllMocks()

    const userWithRefreshToken = {
      ...mockUserEntity,
      refreshToken: 'VALID_REFRESH_TOKEN',
    }

    mockUserService.findById.mockResolvedValue(userWithRefreshToken)
    mockUserService.findByEmail.mockResolvedValue(mockUserEntity)
    mockUserService.create.mockResolvedValue({ id: mockUserEntity.id })
    mockUserService.generateVerificationCode.mockResolvedValue('123456')
    mockUserService.verifyEmail.mockResolvedValue(true)
    mockUserService.generatePasswordResetCode.mockResolvedValue('654321')
    mockUserService.verifyPasswordResetCode.mockResolvedValue(true)

    mockAuthRepository.comparePassword.mockResolvedValue(true)
    mockAuthRepository.hashPassword.mockResolvedValue('HASHED_PASSWORD')
    mockAuthRepository.generateAccessToken.mockReturnValue('ACCESS_TOKEN')
    mockAuthRepository.generateRefreshToken.mockReturnValue('REFRESH_TOKEN')
    mockAuthRepository.verifyToken.mockResolvedValue(mockTokenPayload)
    mockAuthRepository.verifyRefreshToken.mockResolvedValue(mockTokenPayload)
  })

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const result = await authService.login(mockUserCredentials)

      expect(mockUserService.findByEmail).toHaveBeenCalledWith(
        mockUserCredentials.email,
      )
      expect(mockAuthRepository.comparePassword).toHaveBeenCalledWith(
        mockUserCredentials.password,
        mockUserEntity.password,
      )
      expect(mockAuthRepository.generateAccessToken).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUserEntity.id,
          email: mockUserEntity.email,
        }),
      )
      expect(mockAuthRepository.generateRefreshToken).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUserEntity.id,
          email: mockUserEntity.email,
        }),
      )
      expect(mockUserService.updateRefreshToken).toHaveBeenCalledWith(
        mockUserEntity.id,
        'REFRESH_TOKEN',
      )

      expect(result).toEqual({
        accessToken: 'ACCESS_TOKEN',
        refreshToken: 'REFRESH_TOKEN',
        user: {
          id: mockUserEntity.id,
          name: mockUserEntity.name,
          email: mockUserEntity.email,
          userType: mockUserEntity.userType,
        },
      })
    })

    it('should throw UnauthorizedError when password does not match', async () => {
      mockAuthRepository.comparePassword.mockResolvedValue(false)

      await expect(authService.login(mockUserCredentials)).rejects.toThrow(
        UnauthorizedError,
      )
      await expect(authService.login(mockUserCredentials)).rejects.toThrow(
        'Credenciais inválidas',
      )
    })
  })

  describe('register', () => {
    it('should register a new user successfully and send welcome email', async () => {
      const result = await authService.register(mockUserCreateRequest)

      expect(mockAuthRepository.hashPassword).toHaveBeenCalledWith(
        mockUserCreateRequest.password,
      )
      expect(mockUserService.create).toHaveBeenCalledWith({
        ...mockUserCreateRequest,
        password: 'HASHED_PASSWORD',
      })

      // Verificar se o código de verificação é gerado
      expect(mockUserService.generateVerificationCode).toHaveBeenCalledWith(
        mockUserEntity.id,
      )

      // Verificar se o email de boas-vindas é enviado
      expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith(
        mockUserEntity.email,
        mockUserEntity.name,
        mockUserEntity.userType,
        '123456',
      )

      expect(mockUserService.findByEmail).toHaveBeenCalledWith(
        mockUserCreateRequest.email,
      )
      expect(result).toEqual({
        accessToken: 'ACCESS_TOKEN',
        refreshToken: 'REFRESH_TOKEN',
        user: {
          id: mockUserEntity.id,
          name: mockUserEntity.name,
          email: mockUserEntity.email,
          userType: mockUserEntity.userType,
        },
      })
    })
  })

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const result = await authService.refreshToken('VALID_REFRESH_TOKEN')

      expect(mockAuthRepository.verifyRefreshToken).toHaveBeenCalledWith(
        'VALID_REFRESH_TOKEN',
      )
      expect(mockUserService.findById).toHaveBeenCalledWith(
        mockTokenPayload.userId,
      )
      expect(mockAuthRepository.generateAccessToken).toHaveBeenCalled()
      expect(mockAuthRepository.generateRefreshToken).toHaveBeenCalled()
      expect(mockUserService.updateRefreshToken).toHaveBeenCalled()

      expect(result).toEqual({
        accessToken: 'ACCESS_TOKEN',
        refreshToken: 'REFRESH_TOKEN',
        user: {
          id: mockUserEntity.id,
          name: mockUserEntity.name,
          email: mockUserEntity.email,
          userType: mockUserEntity.userType,
        },
      })
    })

    it('should throw UnauthorizedError when refresh token is invalid', async () => {
      mockAuthRepository.verifyRefreshToken.mockResolvedValue(null)

      await expect(authService.refreshToken('INVALID_TOKEN')).rejects.toThrow(
        UnauthorizedError,
      )
      await expect(authService.refreshToken('INVALID_TOKEN')).rejects.toThrow(
        'Refresh token inválido ou expirado',
      )
    })

    it('should throw UnauthorizedError when stored refresh token does not match', async () => {
      const userWithDifferentToken = {
        ...mockUserEntity,
        refreshToken: 'DIFFERENT_TOKEN',
      }

      mockUserService.findById.mockReset()
      mockUserService.findById.mockResolvedValue(userWithDifferentToken)

      await expect(
        authService.refreshToken('VALID_REFRESH_TOKEN'),
      ).rejects.toThrow(UnauthorizedError)
    })
  })

  describe('verifyToken', () => {
    it('should verify token successfully', async () => {
      const result = await authService.verifyToken('VALID_TOKEN')

      expect(mockAuthRepository.verifyToken).toHaveBeenCalledWith('VALID_TOKEN')
      expect(result).toEqual(mockTokenPayload)
    })

    it('should throw UnauthorizedError when token is invalid', async () => {
      mockAuthRepository.verifyToken.mockResolvedValue(null)

      await expect(authService.verifyToken('INVALID_TOKEN')).rejects.toThrow(
        UnauthorizedError,
      )
      await expect(authService.verifyToken('INVALID_TOKEN')).rejects.toThrow(
        'Token inválido ou expirado',
      )
    })
  })

  describe('logout', () => {
    it('should logout successfully', async () => {
      await authService.logout(mockUserEntity.id)

      expect(mockUserService.updateRefreshToken).toHaveBeenCalledWith(
        mockUserEntity.id,
        null,
      )
    })
  })

  describe('verifyEmail', () => {
    it('should verify email successfully', async () => {
      const verifyEmailRequest = {
        email: mockUserEntity.email,
        code: '123456',
      }

      const result = await authService.verifyEmail(verifyEmailRequest)

      expect(mockUserService.findByEmail).toHaveBeenCalledWith(
        mockUserEntity.email,
      )
      expect(mockUserService.verifyEmail).toHaveBeenCalledWith(
        mockUserEntity.id,
        '123456',
      )
      expect(result).toBe(true)
    })

    it('should throw UnauthorizedError when verification code is invalid', async () => {
      const verifyEmailRequest = {
        email: mockUserEntity.email,
        code: 'INVALID_CODE',
      }

      mockUserService.verifyEmail.mockResolvedValue(false)

      await expect(authService.verifyEmail(verifyEmailRequest)).rejects.toThrow(
        UnauthorizedError,
      )
      await expect(authService.verifyEmail(verifyEmailRequest)).rejects.toThrow(
        'Código de verificação inválido ou expirado',
      )
    })
  })

  describe('resendVerificationCode', () => {
    it('should resend verification code successfully', async () => {
      const userNotVerified = {
        ...mockUserEntity,
        emailVerified: false,
      }
      mockUserService.findByEmail.mockResolvedValue(userNotVerified)

      await authService.resendVerificationCode(mockUserEntity.email)

      expect(mockUserService.findByEmail).toHaveBeenCalledWith(
        mockUserEntity.email,
      )
      expect(mockUserService.generateVerificationCode).toHaveBeenCalledWith(
        mockUserEntity.id,
      )
      expect(mockEmailService.sendVerificationEmail).toHaveBeenCalledWith(
        mockUserEntity.email,
        mockUserEntity.name,
        '123456',
      )
    })

    it('should throw BadRequestError when email is already verified', async () => {
      const verifiedUser = {
        ...mockUserEntity,
        emailVerified: true,
      }
      mockUserService.findByEmail.mockResolvedValue(verifiedUser)

      await expect(
        authService.resendVerificationCode(mockUserEntity.email),
      ).rejects.toThrow(BadRequestError)
      await expect(
        authService.resendVerificationCode(mockUserEntity.email),
      ).rejects.toThrow('E-mail já foi verificado')
    })
  })

  describe('requestPasswordReset', () => {
    it('should request password reset successfully', async () => {
      const request = {
        email: mockUserEntity.email,
      }

      await authService.requestPasswordReset(request)

      expect(mockUserService.findByEmail).toHaveBeenCalledWith(
        mockUserEntity.email,
      )
      expect(mockUserService.generatePasswordResetCode).toHaveBeenCalledWith(
        mockUserEntity.id,
      )
      expect(mockEmailService.sendPasswordResetEmail).toHaveBeenCalledWith(
        mockUserEntity.email,
        mockUserEntity.name,
        '654321',
      )
    })
  })

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      const request = {
        email: mockUserEntity.email,
        code: '654321',
        newPassword: 'NEW_PASSWORD',
      }

      await authService.resetPassword(request)

      expect(mockUserService.findByEmail).toHaveBeenCalledWith(
        mockUserEntity.email,
      )
      expect(mockUserService.verifyPasswordResetCode).toHaveBeenCalledWith(
        mockUserEntity.id,
        '654321',
      )
      expect(mockAuthRepository.hashPassword).toHaveBeenCalledWith(
        'NEW_PASSWORD',
      )
      expect(mockUserService.updatePassword).toHaveBeenCalledWith(
        mockUserEntity.id,
        'HASHED_PASSWORD',
      )
    })

    it('should throw UnauthorizedError when reset code is invalid', async () => {
      const request = {
        email: mockUserEntity.email,
        code: 'INVALID_CODE',
        newPassword: 'NEW_PASSWORD',
      }

      mockUserService.verifyPasswordResetCode.mockResolvedValue(false)

      await expect(authService.resetPassword(request)).rejects.toThrow(
        UnauthorizedError,
      )
      await expect(authService.resetPassword(request)).rejects.toThrow(
        'Código de redefinição de senha inválido ou expirado',
      )
    })
  })
})
