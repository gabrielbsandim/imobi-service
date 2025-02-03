import { NextFunction, Request, Response } from 'express'
import { injectable, inject } from 'tsyringe'

import { ProposalService } from '@/application/services/ProposalService'
import {
  createProposalSchema,
  TCreateProposalSchema,
} from '@/presentation/schemas/proposalSchemas'
import { schemaValidator } from '@/presentation/schemas/schemaValidator'

@injectable()
export class ProposalController {
  constructor(
    @inject('ProposalService') private proposalService: ProposalService,
  ) {}

  async createProposal(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = await schemaValidator<TCreateProposalSchema>(
        createProposalSchema,
        req.body,
      )

      const proposal = await this.proposalService.create({
        ...validatedData,
        listingId: req.params.listingId,
        brokerId: req.user!.userId!,
      })

      res.status(201).json(proposal)
    } catch (error) {
      next(error)
    }
  }

  async acceptProposal(req: Request, res: Response, next: NextFunction) {
    try {
      const proposal = await this.proposalService.accept(req.params.proposalId)

      res.json(proposal)
    } catch (error) {
      next(error)
    }
  }

  async rejectProposal(req: Request, res: Response, next: NextFunction) {
    try {
      const proposal = await this.proposalService.reject(req.params.proposalId)

      res.json(proposal)
    } catch (error) {
      next(error)
    }
  }

  async listProposalsByListingId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const proposals = await this.proposalService.listProposalsByListing(
        req.params.listingId,
      )

      res.json(proposals)
    } catch (error) {
      next(error)
    }
  }
}
