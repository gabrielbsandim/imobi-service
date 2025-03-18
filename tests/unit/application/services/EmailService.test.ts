import nodemailer from 'nodemailer'
import { container } from 'tsyringe'

import { EmailService } from '@/application/services/EmailService'
import { mockUserEntity } from '@/tests/unit/mocks/UserMMock'

// Mock do Nodemailer
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockImplementation(() => Promise.resolve(true)),
  }),
}))

describe('EmailService', () => {
  let emailService: EmailService
  let mockTransporter: any

  beforeEach(() => {
    // Limpa todos os mocks
    jest.clearAllMocks()

    // Configura o mock do transporter
    mockTransporter = {
      sendMail: jest.fn().mockResolvedValue(true),
    }

    // Mock da função createTransport do nodemailer para retornar nosso transporter mockado
    ;(nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter)

    // Resolve o serviço
    emailService = container.resolve(EmailService)
  })

  describe('sendWelcomeEmail', () => {
    it('deve enviar email de boas-vindas com código de verificação para um comprador', async () => {
      const to = 'usuario@exemplo.com'
      const name = 'Usuário Teste'
      const userType = 'buyer'
      const verificationCode = '123456'

      await emailService.sendWelcomeEmail(to, name, userType, verificationCode)

      // Verifica se o método sendMail foi chamado com os parâmetros corretos
      expect(nodemailer.createTransport).toHaveBeenCalled()
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: expect.any(String),
          to,
          subject: expect.stringContaining('Bem-vindo'),
          html: expect.stringContaining(name),
        }),
      )

      // Verifica se o HTML contém o código de verificação
      const callArgs = mockTransporter.sendMail.mock.calls[0][0]
      expect(callArgs.html).toContain(verificationCode)
      expect(callArgs.html).toContain('Bem-vindo ao ImobiApp')
    })

    it('deve enviar email de boas-vindas com código de verificação para um corretor', async () => {
      const to = 'corretor@exemplo.com'
      const name = 'Corretor Teste'
      const userType = 'broker'
      const verificationCode = '123456'

      await emailService.sendWelcomeEmail(to, name, userType, verificationCode)

      // Verifica se o método sendMail foi chamado com os parâmetros corretos
      expect(nodemailer.createTransport).toHaveBeenCalled()
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: expect.any(String),
          to,
          subject: expect.stringContaining('Bem-vindo'),
          html: expect.stringContaining(name),
        }),
      )

      // Verifica se o HTML contém o código de verificação e mensagem específica para corretores
      const callArgs = mockTransporter.sendMail.mock.calls[0][0]
      expect(callArgs.html).toContain(verificationCode)
      expect(callArgs.html).toContain('nossa plataforma')
    })
  })

  describe('sendVerificationEmail', () => {
    it('deve enviar email com código de verificação', async () => {
      const to = 'usuario@exemplo.com'
      const name = 'Usuário Teste'
      const verificationCode = '123456'

      await emailService.sendVerificationEmail(to, name, verificationCode)

      // Verifica se o método sendMail foi chamado com os parâmetros corretos
      expect(nodemailer.createTransport).toHaveBeenCalled()
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: expect.any(String),
          to,
          subject: expect.stringContaining('Código de Verificação'),
          html: expect.stringContaining(name),
        }),
      )

      // Verifica se o HTML contém o código de verificação
      const callArgs = mockTransporter.sendMail.mock.calls[0][0]
      expect(callArgs.html).toContain(verificationCode)
      expect(callArgs.html).toContain(
        'Recebemos uma solicitação para verificar seu e-mail',
      )
    })
  })

  describe('sendPasswordResetEmail', () => {
    it('deve enviar email com código de redefinição de senha', async () => {
      const to = 'usuario@exemplo.com'
      const name = 'Usuário Teste'
      const resetCode = '123456'

      await emailService.sendPasswordResetEmail(to, name, resetCode)

      // Verifica se o método sendMail foi chamado com os parâmetros corretos
      expect(nodemailer.createTransport).toHaveBeenCalled()
      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          from: expect.any(String),
          to,
          subject: expect.stringContaining('Redefinição de Senha'),
          html: expect.stringContaining(name),
        }),
      )

      // Verifica se o HTML contém o código de redefinição
      const callArgs = mockTransporter.sendMail.mock.calls[0][0]
      expect(callArgs.html).toContain(resetCode)
      expect(callArgs.html).toContain(
        'Recebemos uma solicitação para redefinir sua senha',
      )
    })
  })

  describe('getWelcomeMessageByUserType', () => {
    it('deve retornar mensagem específica para corretores', () => {
      // Método privado, precisamos acessá-lo usando any
      const service = emailService as any
      const message = service.getWelcomeMessageByUserType('broker')
      expect(message).toContain('nossa plataforma')
    })

    it('deve retornar mensagem específica para compradores', () => {
      const service = emailService as any
      const message = service.getWelcomeMessageByUserType('buyer')
      expect(message).toContain('imóvel dos seus sonhos')
    })

    it('deve retornar mensagem padrão para tipos desconhecidos', () => {
      const service = emailService as any
      // Passando um tipo inválido para testar o caso padrão
      const message = service.getWelcomeMessageByUserType('unknown' as any)
      expect(message).toContain('Bem-vindo ao ImobiApp')
    })
  })
})
