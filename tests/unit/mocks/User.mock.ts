import { TCreateBrokerUserRequest } from '@/domain/entities/UserEntity'

export const mockUserCreateRequest: jest.Mocked<TCreateBrokerUserRequest> = {
  name: 'DUMMY_NAME',
  email: 'dummy@email.com',
  password: 'DUMMY_PASSWORD',
  phoneNumber: '+5511999999999',
}
