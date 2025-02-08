import { Router } from 'express'
import { container } from 'tsyringe'

import { ProposalController } from '@/presentation/controllers/ProposalController'
import { authenticate } from '@/presentation/middlewares/authenticate'

const router = Router()
const proposalController = container.resolve(ProposalController)

router.post(
  '/listings/:listingId/proposals',
  authenticate,
  proposalController.createProposal.bind(proposalController),
)

router.patch(
  '/proposals/:proposalId/accept',
  authenticate,
  proposalController.acceptProposal.bind(proposalController),
)

router.patch(
  '/proposals/:proposalId/reject',
  authenticate,
  proposalController.rejectProposal.bind(proposalController),
)

router.get(
  '/listings/:listingId/proposals',
  authenticate,
  proposalController.listProposalsByListingId.bind(proposalController),
)

export default router
