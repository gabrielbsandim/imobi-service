export type TUserType = 'buyer' | 'broker'

export class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public userType: TUserType,
    public email: string,
    public password: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}

export type TCreateUser = Omit<UserEntity, 'createdAt' | 'updatedAt'>

export type TCreateUserAuth = Pick<UserEntity, 'email' | 'password'> & {
  displayName: string
}
