import { injectable } from 'tsyringe'
import twilio, { Twilio } from 'twilio'

import { SendMessageError } from '@/errors/HttpErrors'

@injectable()
export class WhatsAppIntegrationService {
  private client: Twilio

  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    )
  }

  async sendMessage(to: string, body: string): Promise<void> {
    try {
      await this.client.messages.create({
        body,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${to}`,
      })
    } catch (error) {
      console.error('Erro ao enviar mensagem via Twilio:', error)

      throw new SendMessageError()
    }
  }

  async sendNameQuestion(to: string, name: string) {
    try {
      await this.client.messages.create({
        contentSid: process.env.TWILIO_QUESTION_NAME_TEMPLATE_SID,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${to}`,
        contentVariables: JSON.stringify({ 1: name }),
      })
    } catch (error) {
      console.error('Erro ao enviar mensagem via Twilio:', error)

      throw new SendMessageError()
    }
  }
}
