import { NextFunction, Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'

import { ChatService } from '@/application/services/ChatService'
import { UserService } from '@/application/services/UserService'

@injectable()
export class TwilioController {
  constructor(
    @inject('UserService') private userService: UserService,
    @inject('ChatService') private chatService: ChatService,
  ) {}

  async handleIncomingMessage(req: Request, res: Response, next: NextFunction) {
    const { Body: message, From: phoneNumber } = req.body

    try {
      const user = await this.userService.findUserByPhoneNumber(phoneNumber)

      if (!user) {
        await this.chatService.handleNotUserRequest(phoneNumber, message)

        res.status(204).send()
        return
      }

      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
}
