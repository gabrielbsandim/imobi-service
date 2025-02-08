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
