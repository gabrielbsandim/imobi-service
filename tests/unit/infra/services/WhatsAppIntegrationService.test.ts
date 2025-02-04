import { SendMessageError } from '@/errors/HttpErrors'
import { WhatsAppIntegrationService } from '@/infra/services/WhatsAppIntegrationService'

const mockMessagesCreate = jest.fn()
jest.mock('twilio', () =>
  jest.fn().mockReturnValue({
    messages: {
      create: (props: any) => mockMessagesCreate(props),
    },
  }),
)

describe('WhatsAppIntegrationService', () => {
  const originalEnv = process.env

  beforeEach(jest.clearAllMocks)

  beforeAll(() => {
    process.env = {
      ...originalEnv,
      TWILIO_ACCOUNT_SID: 'test_account_sid',
      TWILIO_AUTH_TOKEN: 'test_auth_token',
      TWILIO_WHATSAPP_NUMBER: '+123456789',
      TWILIO_QUESTION_NAME_TEMPLATE_SID: 'test_template_sid',
    }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  describe('SendWhatsAppMessage', () => {
    it('should send message with correct parameters', async () => {
      const service = new WhatsAppIntegrationService()
      const to = '+5511999999999'
      const body = 'Test message'

      await service.sendMessage(to, body)

      expect(mockMessagesCreate).toHaveBeenCalledWith({
        body: 'Test message',
        from: 'whatsapp:+123456789',
        to: 'whatsapp:+5511999999999',
      })
    })

    it('should throw SendMessageError when Twilio API fails', async () => {
      const service = new WhatsAppIntegrationService()
      const error = new Error('Twilio API Error')
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      mockMessagesCreate.mockRejectedValueOnce(error)

      await expect(
        service.sendMessage('+5511888888888', 'test'),
      ).rejects.toThrow(SendMessageError)

      expect(consoleSpy).toHaveBeenCalledWith(
        'Erro ao enviar mensagem via Twilio:',
        error,
      )
    })
  })

  describe('SendNameQuestion', () => {
    it('should send name question with correct parameters', async () => {
      const service = new WhatsAppIntegrationService()
      const to = '+5511999999999'
      const name = 'John'

      await service.sendNameQuestion(to, name)

      expect(mockMessagesCreate).toHaveBeenCalledWith({
        contentSid: 'test_template_sid',
        from: 'whatsapp:+123456789',
        to: 'whatsapp:+5511999999999',
        contentVariables: JSON.stringify({ 1: name }),
      })
    })

    it('should throw SendMessageError when Twilio API fails', async () => {
      const service = new WhatsAppIntegrationService()
      const error = new Error('Twilio API Error')
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      mockMessagesCreate.mockRejectedValueOnce(error)

      await expect(
        service.sendNameQuestion('+5511888888888', 'John'),
      ).rejects.toThrow(SendMessageError)

      expect(consoleSpy).toHaveBeenCalledWith(
        'Erro ao enviar mensagem via Twilio:',
        error,
      )
    })
  })
})
