import 'dotenv/config'
import 'reflect-metadata'
import express from 'express'

import '@/containers/container'
import { errorHandler } from '@/presentation/middlewares/errorHandler'
import feedRoutes from '@/presentation/routes/feedRoutes'
import listingRoutes from '@/presentation/routes/listingRoutes'
import userRoutes from '@/presentation/routes/userRoutes'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.use('/api/auth', userRoutes)

app.use('/api', listingRoutes)
app.use('/api', feedRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
