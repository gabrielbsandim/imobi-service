import 'dotenv/config'
import 'reflect-metadata'

import '@/containers/container'
import express from 'express'

import { errorHandler } from '@/presentation/middlewares/errorHandler'
import listingRoutes from '@/presentation/routes/listingRoutes'
import proposalRoutes from '@/presentation/routes/proposalRoutes'
import userRoutes from '@/presentation/routes/userRoutes'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.use('/api/auth', userRoutes)

app.use('/api', listingRoutes)
app.use('/api', proposalRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
