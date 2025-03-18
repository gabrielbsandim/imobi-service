import { NextFunction, Request, Response } from 'express'
import { injectable, inject } from 'tsyringe'

import { UserService } from '@/application/services/UserService'

@injectable()
export class UserController {
  constructor(
    @inject('UserService') private readonly userService: UserService,
  ) {}

  async findById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.params

      const user = await this.userService.findById(userId)

      res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }
}
