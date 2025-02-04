import { UserEntity, TCreateUserRequest } from '@/domain/entities/UserEntity'

export interface IUserRepository {
  create(user: TCreateUserRequest): Promise<void>
  findByEmail(email: string): Promise<UserEntity | null>
  findByPhoneNumber(phoneNumber: string): Promise<UserEntity | null>
  findById(id: string): Promise<UserEntity | null>
}
