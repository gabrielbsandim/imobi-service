import { container } from 'tsyringe'

import { ChatService } from '@/application/services/ChatService'
import { KnexUserRepository } from '@/infra/database/repositories/KnexUserRepository'
import { WhatsAppIntegrationService } from '@/infra/services/WhatsAppIntegrationService'

const mockSendMessage = jest.fn()
const mockSendNameQuestion = jest.fn()
const mockUserRepository: jest.Mocked<KnexUserRepository> = {
  create: jest.fn().mockResolvedValue({ id: 'user-123' }),
} as any

const mockWhatsAppService: jest.Mocked<WhatsAppIntegrationService> = {
  sendMessage: mockSendMessage,
  sendNameQuestion: mockSendNameQuestion,
} as any

container.register('IUserRepository', { useValue: mockUserRepository })
container.register('WhatsAppIntegrationService', {
  useValue: mockWhatsAppService,
})

describe('ChatService', () => {
  let chatService: ChatService

  beforeEach(() => {
    chatService = container.resolve(ChatService)

    jest.clearAllMocks()

    chatService['userState'] = {}
  })

  describe('HandleNotUserRequest', () => {
    const phoneNumberMock = '+5511999999999'

    it('should ask for name on first interaction', async () => {
      await chatService.handleNotUserRequest(phoneNumberMock, '')

      expect(mockSendMessage).toHaveBeenCalledWith(
        phoneNumberMock,
        'Olá! Parece que é sua primeira vez aqui. Qual é o seu nome?',
      )
    })

    it('should handle name confirmation flow', async () => {
      await chatService.handleNotUserRequest(phoneNumberMock, 'Olá')

      await chatService.handleNotUserRequest(phoneNumberMock, 'João Silva')

      expect(mockSendNameQuestion).toHaveBeenCalledWith(
        phoneNumberMock,
        'João Silva',
      )
    })

    it('should create user when name is confirmed', async () => {
      await chatService.handleNotUserRequest(phoneNumberMock, 'Oi')
      await chatService.handleNotUserRequest(phoneNumberMock, 'Maria Oliveira')
      await chatService.handleNotUserRequest(phoneNumberMock, '1')

      expect(mockUserRepository.create).toHaveBeenCalledWith({
        name: 'Maria Oliveira',
        phoneNumber: phoneNumberMock,
        userType: 'buyer',
      })

      expect(mockSendMessage).toHaveBeenCalledWith(
        phoneNumberMock,
        'Prazer em conhecê-lo, Maria Oliveira! Agora vamos criar seu anúncio de desejo.',
      )
    })

    it('should reset flow when name is rejected', async () => {
      await chatService.handleNotUserRequest(phoneNumberMock, 'Oi')
      await chatService.handleNotUserRequest(phoneNumberMock, 'José')
      await chatService.handleNotUserRequest(phoneNumberMock, '0')

      expect(mockSendMessage).toHaveBeenCalledWith(
        phoneNumberMock,
        'Qual é o seu nome?',
      )
    })

    it('should handle invalid confirmation responses', async () => {
      await chatService.handleNotUserRequest(phoneNumberMock, 'Oi')
      await chatService.handleNotUserRequest(phoneNumberMock, 'Carlos')
      await chatService.handleNotUserRequest(phoneNumberMock, 'talvez')

      expect(mockSendMessage).toHaveBeenCalledWith(
        phoneNumberMock,
        'Resposta inválida. Por favor, responda "Sim" ou "Não".',
      )
    })
  })

  describe('State Management', () => {
    it('should maintain separate state for different users', async () => {
      const user1 = '+5511111111111'
      const user2 = '+5522222222222'

      await chatService.handleNotUserRequest(user1, '')
      await chatService.handleNotUserRequest(user2, '')

      expect(mockSendMessage).toHaveBeenCalledWith(
        user1,
        'Olá! Parece que é sua primeira vez aqui. Qual é o seu nome?',
      )
      expect(mockSendMessage).toHaveBeenCalledWith(
        user2,
        'Olá! Parece que é sua primeira vez aqui. Qual é o seu nome?',
      )
    })
  })
})
