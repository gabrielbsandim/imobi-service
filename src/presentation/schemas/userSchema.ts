import * as yup from 'yup'

export const loginSchema = yup.object().shape({
  email: yup.string().email().required('Email é obrigatório.'),
  password: yup.string().required('Senha é obrigatória.'),
})

export type TLoginSchema = yup.InferType<typeof loginSchema>

export const registerSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório.'),
  email: yup.string().email().required('Email é obrigatório.'),
  password: yup.string().required('Senha é obrigatória.'),
  userType: yup
    .string()
    .oneOf(['buyer', 'broker'], 'O tipo deve ser "buyer" ou "broker".')
    .required('Tipo do usuário é obrigatório'),
})

export type TRegisterSchema = yup.InferType<typeof registerSchema>

export const refreshTokenSchema = yup.object().shape({
  refreshToken: yup.string().required('Token de atualização é obrigatório.'),
})

export type TRefreshTokenSchema = yup.InferType<typeof refreshTokenSchema>

export const verifyEmailSchema = yup.object().shape({
  email: yup.string().email().required('Email é obrigatório.'),
  code: yup.string().required('Código de verificação é obrigatório.'),
})

export type TVerifyEmailSchema = yup.InferType<typeof verifyEmailSchema>

export const requestPasswordResetSchema = yup.object().shape({
  email: yup.string().email().required('Email é obrigatório.'),
})

export type TRequestPasswordResetSchema = yup.InferType<
  typeof requestPasswordResetSchema
>

export const resetPasswordSchema = yup.object().shape({
  email: yup.string().email().required('Email é obrigatório.'),
  code: yup.string().required('Código de verificação é obrigatório.'),
  newPassword: yup.string().required('Nova senha é obrigatória.'),
})

export type TResetPasswordSchema = yup.InferType<typeof resetPasswordSchema>
