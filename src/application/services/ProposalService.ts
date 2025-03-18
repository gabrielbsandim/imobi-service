import { injectable, inject } from 'tsyringe'

import { ListingService } from '@/application/services/ListingService'
import {
  ProposalEntity,
  TCreateProposal,
} from '@/domain/entities/ProposalEntity'
import { IProposalRepository } from '@/domain/interfaces/repositories/database/IProposalRepository'
import { NotFoundError } from '@/errors/HttpErrors'

@injectable()
export class ProposalService {
  constructor(
    @inject('IProposalRepository')
    private proposalRepository: IProposalRepository,
    @inject('ListingService') private listingService: ListingService,
  ) {}

  async create(proposal: Omit<TCreateProposal, 'status'>) {
    await this.listingService.findById(proposal.listingId)

    const created = await this.proposalRepository.create({
      ...proposal,
      status: 'pending',
    })

    return created
  }

  async accept(proposalId: string): Promise<void> {
    const proposal = await this.proposalRepository.findProposalById(proposalId)

    if (!proposal) {
      throw new NotFoundError('Proposta não encontrada')
    }

    return this.proposalRepository.updateProposalStatus({
      id: proposalId,
      status: 'accepted',
    })
  }

  async reject(proposalId: string): Promise<void> {
    const proposal = await this.proposalRepository.findProposalById(proposalId)

    if (!proposal) {
      throw new NotFoundError('Proposta não encontrada')
    }

    return this.proposalRepository.updateProposalStatus({
      id: proposalId,
      status: 'rejected',
    })
  }

  async listProposalsByListing(listingId: string): Promise<ProposalEntity[]> {
    return this.proposalRepository.listProposalsByListingId(listingId)
  }
}
