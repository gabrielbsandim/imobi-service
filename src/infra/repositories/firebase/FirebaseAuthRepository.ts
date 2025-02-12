import admin from 'firebase-admin'
import { injectable } from 'tsyringe'

import { TCreateUserAuth } from '@/domain/entities/UserEntity'
import { IFirebaseAuthRepository } from '@/domain/interfaces/repositories/firebase/IFirebaseRepository'

@injectable()
export class FirebaseAuthRepository implements IFirebaseAuthRepository {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    })
  }

  async verifyToken(token: string) {
    return admin.auth().verifyIdToken(token)
  }

  async createFirebaseUser(userAuth: TCreateUserAuth) {
    return admin.auth().createUser(userAuth)
  }

  async deleteFirebaseUser(uid: string) {
    return admin.auth().deleteUser(uid)
  }
}
