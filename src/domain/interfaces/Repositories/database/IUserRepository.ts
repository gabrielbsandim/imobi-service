import { UserEntity, TCreateUserRequest } from '@/domain/entities/UserEntity'

export interface IUserRepository {
  create(user: TCreateUserRequest): Promise<UserEntity>
  findByEmail(email: string): Promise<UserEntity | null>
  findById(id: string): Promise<UserEntity | null>
}
