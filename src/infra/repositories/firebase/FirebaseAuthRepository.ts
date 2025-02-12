import { auth } from 'firebase-admin'
import { injectable } from 'tsyringe'

import { TCreateUserAuth } from '@/domain/entities/UserEntity'
import { IFirebaseAuthRepository } from '@/domain/interfaces/repositories/firebase/IFirebaseRepository'

@injectable()
export class FirebaseAuthRepository implements IFirebaseAuthRepository {
  async verifyToken(token: string) {
    return auth().verifyIdToken(token)
  }

  async createFirebaseUser(userAuth: TCreateUserAuth) {
    return auth().createUser(userAuth)
  }

  async deleteFirebaseUser(uid: string) {
    return auth().deleteUser(uid)
  }
}
