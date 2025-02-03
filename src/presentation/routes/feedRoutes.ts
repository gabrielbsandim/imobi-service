import { Router } from 'express'

import { authenticateJWT } from '@/presentation/middlewares/authenticateJWT'

const router = Router()

router.get('/feed', authenticateJWT, (req, res) => {
  const { userId } = req.user!

  res.json({ feed: [], userId })
})

export default router
