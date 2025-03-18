import { TUserType } from '@/domain/entities/UserEntity'

export interface IEmailService {
  sendWelcomeEmail(
    to: string,
    name: string,
    userType: TUserType,
    verificationCode: string,
  ): Promise<void>
  sendVerificationEmail(
    to: string,
    name: string,
    verificationCode: string,
  ): Promise<void>
  sendPasswordResetEmail(
    to: string,
    name: string,
    resetCode: string,
  ): Promise<void>
}
