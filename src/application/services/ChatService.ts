import { inject, injectable } from 'tsyringe'

import { KnexUserRepository } from '@/infra/database/repositories/KnexUserRepository'
import { WhatsAppIntegrationService } from '@/infra/services/WhatsAppIntegrationService'

const confirmNameAnswer = {
  yes: '1',
  no: '0',
}

@injectable()
export class ChatService {
  private userState: Record<
    string,
    { isAskedForName?: boolean; name?: string }
  > = {}

  constructor(
    @inject('IUserRepository') private userRepository: KnexUserRepository,
    @inject('WhatsAppIntegrationService')
    private whatsAppIntegrationService: WhatsAppIntegrationService,
  ) {}

  private handleNameNotConfirmed(phoneNumber: string, message: string) {
    if (!message) {
      return { response: 'Por favor, digite seu nome.' }
    }

    this.userState[phoneNumber].name = message

    return {
      isConfirmName: true,
    }
  }

  private async handleIncomingMessage(
    phoneNumber: string,
    message: string,
  ): Promise<{ response?: string; isConfirmName?: boolean }> {
    const { isAskedForName, name } = this.userState[phoneNumber] || {}

    if (!isAskedForName) {
      this.userState[phoneNumber] = {
        isAskedForName: true,
      }

      return {
        response: 'Olá! Parece que é sua primeira vez aqui. Qual é o seu nome?',
      }
    }

    if (!name) {
      return this.handleNameNotConfirmed(phoneNumber, message)
    }

    if (message?.toLowerCase()?.trim() === confirmNameAnswer.yes) {
      const userName = this.userState[phoneNumber]!.name!

      await this.userRepository.create({
        name: userName,
        phoneNumber,
        userType: 'buyer',
      })

      delete this.userState[phoneNumber]

      return {
        response: `Prazer em conhecê-lo, ${userName}! Agora vamos criar seu anúncio de desejo.`,
      }
    }

    if (message?.toLowerCase().trim() === confirmNameAnswer.no) {
      this.userState[phoneNumber].name = undefined

      return { response: 'Qual é o seu nome?' }
    }

    return {
      response: 'Resposta inválida. Por favor, responda "Sim" ou "Não".',
    }
  }

  async handleNotUserRequest(phoneNumber: string, message: string) {
    const { response, isConfirmName } = await this.handleIncomingMessage(
      phoneNumber,
      message,
    )

    if (isConfirmName) {
      return this.whatsAppIntegrationService.sendNameQuestion(
        phoneNumber,
        message,
      )
    }

    this.whatsAppIntegrationService.sendMessage(phoneNumber, response!)
  }
}
