import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { injectable, inject } from 'tsyringe'

import { TCreateUserRequest } from '@/domain/entities/UserEntity'
import { IUserRepository } from '@/domain/interfaces/IUserRepository'

@injectable()
export class UserService {
  constructor(
    @inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async register(data: TCreateUserRequest): Promise<void> {
    const hashedPassword = await bcrypt.hash(data.password, 10)

    await this.userRepository.create({
      ...data,
      password: hashedPassword,
    })
  }

  async login(email: string, password: string): Promise<string | null> {
    const user = await this.userRepository.findByEmail(email)

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null
    }

    return jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET!,
      {
        expiresIn: '1h',
      },
    )
  }
}
