import { container } from 'tsyringe'

import { UserService } from '@/application/services/UserService'
import { TCreateUserRequest } from '@/domain/entities/UserEntity'
import { NotFoundError } from '@/errors/HttpErrors'

const mockUserRepository = {
  findById: jest.fn(),
  create: jest.fn(),
}

container.register('IUserRepository', { useValue: mockUserRepository })

describe('UserService', () => {
  let userService: UserService

  beforeEach(() => {
    userService = container.resolve(UserService)
    jest.clearAllMocks()
  })

  describe('FindById', () => {
    it('should return the user', async () => {
      const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' }

      mockUserRepository.findById.mockResolvedValue(mockUser)

      const result = await userService.findById('1')

      expect(mockUserRepository.findById).toHaveBeenCalledWith('1')

      expect(result).toEqual(mockUser)
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

  describe('Create', () => {
    it('deve criar um usuário e retornar o resultado', async () => {
      const newUser: TCreateUserRequest = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'secret',
        id: 'DUMMY_ID',
        userType: 'buyer',
      }

      mockUserRepository.create.mockResolvedValue(newUser)

      const result = await userService.create(newUser)

      expect(mockUserRepository.create).toHaveBeenCalledWith(newUser)

      expect(result).toEqual(newUser)
    })
  })
})
