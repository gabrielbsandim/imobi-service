import {
  TCreateUser,
  TUserCredentials,
  UserEntity,
} from '@/domain/entities/UserEntity'

export const mockUserCreateRequest: jest.Mocked<TCreateUser> = {
  name: 'DUMMY_NAME',
  email: 'dummy@email.com',
  password: 'DUMMY_PASSWORD',
  userType: 'buyer',
}

export const mockUserEntity: jest.Mocked<UserEntity> = {
  id: 'USER_ID',
  name: 'DUMMY_NAME',
  email: 'dummy@email.com',
  password: 'HASHED_PASSWORD',
  userType: 'buyer',
  refreshToken: 'REFRESH_TOKEN',
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const mockUserCredentials: jest.Mocked<TUserCredentials> = {
  email: 'dummy@email.com',
  password: 'DUMMY_PASSWORD',
}
