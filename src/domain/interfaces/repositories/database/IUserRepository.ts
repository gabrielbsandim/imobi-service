import { UserEntity, TCreateUser } from '@/domain/entities/UserEntity'
import { ICreationResult } from '@/domain/interfaces/shared/ICreationResult'

export interface IUserRepository {
  create(user: TCreateUser): Promise<ICreationResult>
  findByEmail(email: string): Promise<UserEntity | null>
  findById(id: string): Promise<UserEntity | null>
}
