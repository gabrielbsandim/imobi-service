import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { container } from 'tsyringe'

import { UserService } from '@/application/services/UserService'
import { IUserRepository } from '@/domain/interfaces/IUserRepository'
import { mockUserCreateRequest } from '@/tests/unit/mocks/User.mock'

const mockUserRepository: jest.Mocked<IUserRepository> = {
  create: jest.fn(),
  findByEmail: jest.fn(),
}

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn().mockResolvedValue(true),
}))

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('fake_token'),
}))

container.register('IUserRepository', { useValue: mockUserRepository })

describe('UserService', () => {
  let userService: UserService

  beforeEach(() => {
    userService = container.resolve(UserService)
    jest.clearAllMocks()
  })

  it('should ccreate user with a hash password', async () => {
    await userService.register(mockUserCreateRequest)

    expect(bcrypt.hash).toHaveBeenCalledWith(mockUserCreateRequest.password, 10)

    expect(mockUserRepository.create).toHaveBeenCalledWith({
      ...mockUserCreateRequest,
      password: 'hashed_password',
    })
  })

  it('should return a JWT token when the login was successfully', async () => {
    mockUserRepository.findByEmail.mockResolvedValueOnce({
      ...mockUserCreateRequest,
      id: 'DUMMY_ID',
      password: 'hashed_password',
    })

    const token = await userService.login(
      mockUserCreateRequest.email,
      mockUserCreateRequest.password,
    )

    expect(token).toBe('fake_token')

    expect(jwt.sign).toHaveBeenCalledWith(
      {
        userId: 'DUMMY_ID',
        email: mockUserCreateRequest.email,
        name: mockUserCreateRequest.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    )
  })

  it('should return null when the email and password is wrong', async () => {
    mockUserRepository.findByEmail.mockResolvedValueOnce(null)

    const token = await userService.login(
      'invalid@example.com',
      'wrong_password',
    )

    expect(token).toBeNull()
  })
})
