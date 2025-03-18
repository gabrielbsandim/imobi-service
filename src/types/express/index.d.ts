import { TUserType } from '@/domain/entities/UserEntity'

declare global {
  namespace Express {
    interface Request {
      userId?: string
      userEmail?: string
      userType?: TUserType
    }
  }
}

export {}
