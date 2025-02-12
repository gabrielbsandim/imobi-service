import { injectable, inject } from 'tsyringe'

import {
  ProposalEntity,
  TCreateProposal,
} from '@/domain/entities/ProposalEntity'
import { IListingRepository } from '@/domain/interfaces/repositories/database/IListingRepository'
import { IProposalRepository } from '@/domain/interfaces/repositories/database/IProposalRepository'
import { NotFoundError } from '@/errors/HttpErrors'

@injectable()
export class ProposalService {
  constructor(
    @inject('IProposalRepository')
    private proposalRepository: IProposalRepository,
    @inject('IListingRepository') private listingRepository: IListingRepository,
  ) {}

  async create(proposal: Omit<TCreateProposal, 'status'>) {
    const listing = await this.listingRepository.findById(proposal.listingId)

    if (!listing) {
      throw new NotFoundError('Anúncio não encontrado')
    }

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
