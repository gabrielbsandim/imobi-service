import { container } from 'tsyringe'

import { UserService } from '@/application/services/UserService'
import { NotFoundError } from '@/errors/HttpErrors'
import { mockUserCreateRequest } from '@/tests/unit/mocks/UserMMock'

const mockUserRepository = {
  findById: jest.fn().mockResolvedValue(mockUserCreateRequest),
  create: jest.fn().mockResolvedValue({ id: mockUserCreateRequest.id }),
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
      const result = await userService.findById(mockUserCreateRequest.id)

      expect(mockUserRepository.findById).toHaveBeenCalledWith(
        mockUserCreateRequest.id,
      )

      expect(result).toEqual(mockUserCreateRequest)
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
    it('should create an user and return the result', async () => {
      const result = await userService.create(mockUserCreateRequest)

      expect(mockUserRepository.create).toHaveBeenCalledWith(
        mockUserCreateRequest,
      )

      expect(result).toStrictEqual({
        id: mockUserCreateRequest.id,
      })
    })
  })
})
