import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { container } from 'tsyringe'

import { TTokenPayload } from '@/domain/entities/UserEntity'
import { KnexAuthRepository } from '@/infra/repositories/database/KnexAuthRepository'
import { mockUserEntity } from '@/tests/unit/mocks/UserMMock'

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mocked-token'),
  verify: jest.fn().mockImplementation(token => {
    if (token === 'valid-token') {
      return { userId: 'user-id', email: 'test@example.com', userType: 'buyer' }
    }
    throw new Error('Invalid token')
  }),
}))

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockResolvedValue(true),
}))

const mockKnex = {}

container.register('Knex', { useValue: mockKnex })

describe('KnexAuthRepository', () => {
  let authRepository: KnexAuthRepository
  const mockPayload: TTokenPayload = {
    userId: mockUserEntity.id,
    email: mockUserEntity.email,
    userType: mockUserEntity.userType,
  }

  beforeEach(() => {
    authRepository = container.resolve(KnexAuthRepository)
    jest.clearAllMocks()
  })

  describe('hashPassword', () => {
    it('should call bcrypt.hash with correct parameters', async () => {
      const password = 'test-password'
      const result = await authRepository.hashPassword(password)

      expect(bcrypt.hash).toHaveBeenCalledWith(password, expect.any(Number))
      expect(result).toBe('hashed-password')
    })
  })

  describe('comparePassword', () => {
    it('should call bcrypt.compare with correct parameters', async () => {
      const password = 'test-password'
      const hashedPassword = 'hashed-password'
      const result = await authRepository.comparePassword(
        password,
        hashedPassword,
      )

      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword)
      expect(result).toBe(true)
    })
  })

  describe('generateAccessToken', () => {
    it('should call jwt.sign with correct parameters', () => {
      const result = authRepository.generateAccessToken(mockPayload)

      expect(jwt.sign).toHaveBeenCalledWith(
        mockPayload,
        expect.any(String),
        expect.objectContaining({
          expiresIn: expect.any(String),
        }),
      )
      expect(result).toBe('mocked-token')
    })
  })

  describe('generateRefreshToken', () => {
    it('should call jwt.sign with correct parameters', () => {
      const result = authRepository.generateRefreshToken(mockPayload)

      expect(jwt.sign).toHaveBeenCalledWith(
        mockPayload,
        expect.any(String),
        expect.objectContaining({
          expiresIn: expect.any(String),
        }),
      )
      expect(result).toBe('mocked-token')
    })
  })

  describe('verifyToken', () => {
    it('should return payload for valid token', async () => {
      const result = await authRepository.verifyToken('valid-token')

      expect(jwt.verify).toHaveBeenCalledWith('valid-token', expect.any(String))
      expect(result).toEqual({
        userId: 'user-id',
        email: 'test@example.com',
        userType: 'buyer',
      })
    })

    it('should return null for invalid token', async () => {
      const result = await authRepository.verifyToken('invalid-token')

      expect(jwt.verify).toHaveBeenCalledWith(
        'invalid-token',
        expect.any(String),
      )
      expect(result).toBeNull()
    })
  })

  describe('verifyRefreshToken', () => {
    it('should return payload for valid token', async () => {
      const result = await authRepository.verifyRefreshToken('valid-token')

      expect(jwt.verify).toHaveBeenCalledWith('valid-token', expect.any(String))
      expect(result).toEqual({
        userId: 'user-id',
        email: 'test@example.com',
        userType: 'buyer',
      })
    })

    it('should return null for invalid token', async () => {
      const result = await authRepository.verifyRefreshToken('invalid-token')

      expect(jwt.verify).toHaveBeenCalledWith(
        'invalid-token',
        expect.any(String),
      )
      expect(result).toBeNull()
    })
  })
})
