import { Express } from 'express-serve-static-core'

import { TUserType, UserEntity } from '@/domain/entities/UserEntity'

declare global {
  namespace Express {
    interface Request {
      userId?: string
      userEmail?: string
      userType?: TUserType
      user?: UserEntity
    }
  }
}

export {}
