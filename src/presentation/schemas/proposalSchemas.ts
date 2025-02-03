import * as yup from 'yup'

export const createProposalSchema = yup.object().shape({
  message: yup.string().required('Mensagem é obrigatória'),
  photoUrls: yup
    .array()
    .of(yup.string().url().required())
    .min(1, 'Pelo menos uma foto é necessária')
    .max(3, 'Máximo de 3 fotos')
    .required('Pelo menos uma foto é necessária'),
})

export type TCreateProposalSchema = yup.InferType<typeof createProposalSchema>
