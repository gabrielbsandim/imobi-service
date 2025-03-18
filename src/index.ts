import 'dotenv/config'
import 'reflect-metadata'

import '@/containers/container'
import express, { Request, Response } from 'express'

import { errorHandler } from '@/presentation/middlewares/errorHandler'
import authRoutes from '@/presentation/routes/authRoutes'
import dislikeRoutes from '@/presentation/routes/dislikeRoutes'
import favoriteRoutes from '@/presentation/routes/favoriteRoutes'
import listingRoutes from '@/presentation/routes/listingRoutes'
import proposalRoutes from '@/presentation/routes/proposalRoutes'
import reviewRoutes from '@/presentation/routes/reviewRoutes'
import userRoutes from '@/presentation/routes/userRoutes'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.use('/api/auth', authRoutes)

app.use('/api', userRoutes)
app.use('/api', listingRoutes)
app.use('/api', proposalRoutes)
app.use('/api', dislikeRoutes)
app.use('/api', favoriteRoutes)
app.use('/api', reviewRoutes)

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Rota não encontrada' })
})

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
