import { NextFunction, Request, Response } from 'express'
import { ValidationError } from 'yup'

import { HttpError } from '@/errors/HttpErrors'

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error(err.stack)

  res.setHeader('Content-Type', 'application/json')

  const { statusCode } = err as HttpError

  if (err instanceof ValidationError) {
    res.status(400).json({ errors: err.errors })
    return
  }

  if (statusCode) {
    res.status(statusCode).json({ error: err.message })
    return
  }

  res.status(500).json({ error: err.message || 'Erro interno do servidor' })
}
