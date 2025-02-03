export class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}

export type TCreateUserRequest = Omit<
  UserEntity,
  'id' | 'createdAt' | 'updatedAt'
>
