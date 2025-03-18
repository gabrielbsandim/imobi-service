import nodemailer from 'nodemailer'
import { injectable } from 'tsyringe'

import { TUserType } from '@/domain/entities/UserEntity'
import { IEmailService } from '@/domain/interfaces/services/IEmailService'

@injectable()
export class EmailService implements IEmailService {
  private transporter!: nodemailer.Transporter
  private readonly primaryColor = '#0B61A4'
  private readonly secondaryColor = '#FAE366'
  private readonly tertiaryColor = '#AB3428'
  private readonly appName = 'ImobiApp'
  private readonly from = process.env.EMAIL_FROM || 'noreply@imobiapp.com'
  private readonly isDevelopment = process.env.NODE_ENV !== 'production'

  constructor() {
    this.initializeTransporter()
  }

  private async initializeTransporter(): Promise<void> {
    // Em ambiente de desenvolvimento, use o Ethereal Email
    if (this.isDevelopment) {
      // Cria uma conta de teste no Ethereal Email
      const testAccount = await nodemailer.createTestAccount()

      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      })
    } else {
      // Em produção, use as configurações do .env
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      })
    }
  }

  async sendWelcomeEmail(
    to: string,
    name: string,
    userType: TUserType,
    verificationCode: string,
  ): Promise<void> {
    const welcomeMessage = this.getWelcomeMessageByUserType(userType)

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="background-color: ${this.primaryColor}; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">${this.appName}</h1>
        </div>
        
        <div style="padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">
          <h2>Olá, ${name}!</h2>
          <p>${welcomeMessage}</p>
          
          <p>Para verificar seu e-mail, use o código abaixo:</p>
          
          <div style="background-color: ${this.secondaryColor}; text-align: center; padding: 15px; margin: 20px 0; border-radius: 5px; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #211C00;">
            ${verificationCode}
          </div>
          
          <p>Este código expira em 24 horas.</p>
          
          <p>Se você não criou uma conta, pode ignorar este e-mail.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #888; font-size: 12px;">
            <p>© ${new Date().getFullYear()} ${this.appName}. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    `

    const info = await this.transporter.sendMail({
      from: this.from,
      to,
      subject: `Bem-vindo ao ${this.appName}! Verifique seu e-mail`,
      html,
    })

    // Se estiver em desenvolvimento, exibe a URL de visualização
    if (this.isDevelopment) {
      console.log(
        'URL de visualização do e-mail: %s',
        nodemailer.getTestMessageUrl(info),
      )
    }
  }

  async sendVerificationEmail(
    to: string,
    name: string,
    verificationCode: string,
  ): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="background-color: ${this.primaryColor}; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">${this.appName}</h1>
        </div>
        
        <div style="padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">
          <h2>Olá, ${name}!</h2>
          <p>Recebemos uma solicitação para verificar seu e-mail.</p>
          
          <p>Use o código abaixo para verificar sua conta:</p>
          
          <div style="background-color: ${this.secondaryColor}; text-align: center; padding: 15px; margin: 20px 0; border-radius: 5px; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #211C00;">
            ${verificationCode}
          </div>
          
          <p>Este código expira em 24 horas.</p>
          
          <p>Se você não solicitou este código, pode ignorar este e-mail.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #888; font-size: 12px;">
            <p>© ${new Date().getFullYear()} ${this.appName}. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    `

    const info = await this.transporter.sendMail({
      from: this.from,
      to,
      subject: `Código de Verificação - ${this.appName}`,
      html,
    })

    // Se estiver em desenvolvimento, exibe a URL de visualização
    if (this.isDevelopment) {
      console.log(
        'URL de visualização do e-mail: %s',
        nodemailer.getTestMessageUrl(info),
      )
    }
  }

  async sendPasswordResetEmail(
    to: string,
    name: string,
    resetCode: string,
  ): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="background-color: ${this.primaryColor}; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">${this.appName}</h1>
        </div>
        
        <div style="padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;">
          <h2>Olá, ${name}!</h2>
          <p>Recebemos uma solicitação para redefinir sua senha.</p>
          
          <p>Use o código abaixo para redefinir sua senha:</p>
          
          <div style="background-color: ${this.tertiaryColor}; text-align: center; padding: 15px; margin: 20px 0; border-radius: 5px; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: white;">
            ${resetCode}
          </div>
          
          <p>Este código expira em 1 hora.</p>
          
          <p>Se você não solicitou a redefinição de senha, por favor, ignore este e-mail ou entre em contato com nosso suporte.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #888; font-size: 12px;">
            <p>© ${new Date().getFullYear()} ${this.appName}. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    `

    const info = await this.transporter.sendMail({
      from: this.from,
      to,
      subject: `Redefinição de Senha - ${this.appName}`,
      html,
    })

    // Se estiver em desenvolvimento, exibe a URL de visualização
    if (this.isDevelopment) {
      console.log(
        'URL de visualização do e-mail: %s',
        nodemailer.getTestMessageUrl(info),
      )
    }
  }

  private getWelcomeMessageByUserType(userType: TUserType): string {
    switch (userType) {
      case 'broker':
        return 'Bem-vindo à nossa plataforma! Estamos animados em tê-lo conosco. Com o ImobiApp, você poderá conectar-se com potenciais compradores e expandir seus negócios de forma eficiente.'
      case 'buyer':
        return 'Bem-vindo ao ImobiApp! Estamos felizes em ajudá-lo a encontrar o imóvel dos seus sonhos. Nossa plataforma oferece diversas opções para você explorar e facilitar sua jornada na busca pelo lugar perfeito.'
      default:
        return 'Bem-vindo ao ImobiApp! Estamos felizes em tê-lo como parte da nossa comunidade.'
    }
  }
}
