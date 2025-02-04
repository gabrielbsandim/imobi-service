export type TUserType = 'buyer' | 'broker'

export class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public phoneNumber: string,
    public userType: TUserType,
    public email?: string,
    public password?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}

export type TCreateUserRequest = Omit<
  UserEntity,
  'id' | 'createdAt' | 'updatedAt'
>

export type TCreateBrokerUserRequest = Pick<
  UserEntity,
  'name' | 'phoneNumber'
> & {
  email: string
  password: string
}
