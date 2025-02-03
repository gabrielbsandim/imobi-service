import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { UnauthorizedError } from '@/errors/HttpErrors'

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return next(new UnauthorizedError('Token não fornecido'))
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) {
      return next(new UnauthorizedError('Token inválido ou expirado'))
    }

    req.user = decoded as jwt.JwtPayload
    next()
  })
}
