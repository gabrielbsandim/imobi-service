export type TUserType = 'buyer' | 'broker'

export class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public userType: TUserType,
    public email: string,
    public password: string,
    public refreshToken?: string | null,
    public emailVerified?: boolean,
    public verificationCode?: string | null,
    public verificationCodeExpiry?: Date | null,
    public resetPasswordCode?: string | null,
    public resetPasswordCodeExpiry?: Date | null,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}

export type TCreateUser = Omit<
  UserEntity,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'refreshToken'
  | 'emailVerified'
  | 'verificationCode'
  | 'verificationCodeExpiry'
  | 'resetPasswordCode'
  | 'resetPasswordCodeExpiry'
>

export type TUserCredentials = {
  email: string
  password: string
}

export type TAuthResult = {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    name: string
    email: string
    userType: TUserType
    emailVerified?: boolean
  }
}

export type TTokenPayload = {
  userId: string
  email: string
  userType: TUserType
}

export type TVerifyEmailRequest = {
  email: string
  code: string
}

export type TRequestResetPasswordRequest = {
  email: string
}

export type TResetPasswordRequest = {
  email: string
  code: string
  newPassword: string
}
