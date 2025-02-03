import { Router } from 'express'
import { container } from 'tsyringe'

import { ProposalController } from '@/presentation/controllers/ProposalController'
import { authenticateJWT } from '@/presentation/middlewares/authenticateJWT'

const router = Router()
const proposalController = container.resolve(ProposalController)

router.post(
  '/listings/:listingId/proposals',
  authenticateJWT,
  proposalController.createProposal.bind(proposalController),
)

router.patch(
  '/proposals/:proposalId/accept',
  authenticateJWT,
  proposalController.acceptProposal.bind(proposalController),
)

router.patch(
  '/proposals/:proposalId/reject',
  authenticateJWT,
  proposalController.rejectProposal.bind(proposalController),
)

router.get(
  '/listings/:listingId/proposals',
  authenticateJWT,
  proposalController.listProposalsByListingId.bind(proposalController),
)

export default router
