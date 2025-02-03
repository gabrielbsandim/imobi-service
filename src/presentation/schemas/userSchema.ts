import * as yup from 'yup'

export const loginSchema = yup.object().shape({
  email: yup.string().email().required('Email é obrigatório.'),
  password: yup.string().required('Senha é obrigatória.'),
})

export const registerSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório.'),
  email: yup.string().email().required('Email é obrigatório.'),
  password: yup.string().required('Senha é obrigatória.'),
})
