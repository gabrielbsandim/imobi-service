import { TCreateUser, TCreateUserAuth } from '@/domain/entities/UserEntity'

export const mockUserCreateRequest: jest.Mocked<TCreateUser> = {
  name: 'DUMMY_NAME',
  email: 'dummy@email.com',
  password: 'DUMMY_PASSWORD',
  id: 'USER_ID',
  userType: 'buyer',
}

export const mockCreateUserAuth: jest.Mocked<TCreateUserAuth> = {
  displayName: 'Name Test',
  email: 'dummy@email.com',
  password: 'DUMMY_PASSWORD',
}
