import { IUser, TCreateUserRequest } from '@/domain/entities/UserEntity'

export interface IUserRepository {
  create(user: TCreateUserRequest): Promise<void>
  findByEmail(email: string): Promise<IUser | null>
}
