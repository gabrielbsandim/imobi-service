import { inject, injectable } from 'tsyringe'

import { TCreateUserAuth } from '@/domain/entities/UserEntity'
import { FirebaseAuthRepository } from '@/infra/repositories/firebase/FirebaseAuthRepository'

@injectable()
export class AuthService {
  constructor(
    @inject('IAuthRepository')
    private readonly authRepository: FirebaseAuthRepository,
  ) {}

  async verifyToken(token: string) {
    return this.authRepository.verifyToken(token)
  }

  async register(user: TCreateUserAuth) {
    return this.authRepository.createFirebaseUser(user)
  }

  async delete(userId: string) {
    return this.authRepository.deleteFirebaseUser(userId)
  }
}
