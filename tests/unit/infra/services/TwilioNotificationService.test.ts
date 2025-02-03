import { TwilioNotificationService } from '@/infra/services/TwilioNotificationService'

const mockMessagesCreate = jest.fn()
jest.mock('twilio', () =>
  jest.fn().mockReturnValue({
    messages: {
      create: (props: any) => mockMessagesCreate(props),
    },
  }),
)

describe('TwilioNotificationService', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.clearAllMocks()
    process.env = {
      ...originalEnv,
      TWILIO_ACCOUNT_SID: 'test_account_sid',
      TWILIO_AUTH_TOKEN: 'test_auth_token',
      TWILIO_WHATSAPP_NUMBER: '+123456789',
    }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  describe('sendWhatsAppMessage', () => {
    it('should send message with correct parameters', async () => {
      const service = new TwilioNotificationService()
      const to = '+5511999999999'
      const body = 'Test message'

      await service.sendWhatsAppMessage(to, body)

      expect(mockMessagesCreate).toHaveBeenCalledWith({
        body: 'Test message',
        from: 'whatsapp:+123456789',
        to: 'whatsapp:+5511999999999',
      })
    })

    it('should throw error when Twilio API fails', async () => {
      const service = new TwilioNotificationService()
      const error = new Error('Twilio API Error')
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      mockMessagesCreate.mockRejectedValueOnce(error)

      await expect(
        service.sendWhatsAppMessage('+5511888888888', 'test'),
      ).rejects.toThrow('Falha ao enviar notificação')

      expect(consoleSpy).toHaveBeenCalledWith(
        'Erro ao enviar mensagem via Twilio:',
        error,
      )
    })
  })
})
