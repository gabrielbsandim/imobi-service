import { injectable } from 'tsyringe'
import twilio, { Twilio } from 'twilio'

@injectable()
export class TwilioNotificationService {
  private twilioClient: Twilio

  constructor() {
    this.twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    )
  }

  async sendWhatsAppMessage(to: string, body: string): Promise<void> {
    try {
      await this.twilioClient.messages.create({
        body,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:${to}`,
      })
    } catch (error) {
      console.error('Erro ao enviar mensagem via Twilio:', error)

      throw new Error('Falha ao enviar notificação')
    }
  }
}
