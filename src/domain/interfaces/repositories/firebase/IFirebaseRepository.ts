import { DecodedIdToken, UserRecord } from 'firebase-admin/auth'

import { TCreateUserAuth } from '@/domain/entities/UserEntity'

export interface IFirebaseAuthRepository {
  verifyToken: (token: string) => Promise<DecodedIdToken>
  createFirebaseUser: (userAuth: TCreateUserAuth) => Promise<UserRecord>
  deleteFirebaseUser: (userId: string) => Promise<void>
}
