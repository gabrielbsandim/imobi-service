import { injectable, inject } from 'tsyringe'

import {
  ProposalEntity,
  TCreateProposalRequest,
} from '@/domain/entities/ProposalEntity'
import { IListingRepository } from '@/domain/interfaces/IListingRepository'
import { IProposalRepository } from '@/domain/interfaces/IProposalRepository'
import { NotFoundError } from '@/errors/HttpErrors'

@injectable()
export class ProposalService {
  constructor(
    @inject('IProposalRepository')
    private proposalRepository: IProposalRepository,
    @inject('IListingRepository') private listingRepository: IListingRepository,
  ) {}

  async create(
    proposal: Omit<TCreateProposalRequest, 'status'>,
  ): Promise<ProposalEntity> {
    const listing = await this.listingRepository.findById(proposal.listingId)

    if (!listing) {
      throw new NotFoundError('Anúncio não encontrado')
    }

    return this.proposalRepository.create({
      ...proposal,
      status: 'pending',
    })
  }

  async accept(proposalId: string): Promise<ProposalEntity> {
    const proposal = await this.proposalRepository.findProposalById(proposalId)

    if (!proposal) {
      throw new NotFoundError('Proposta não encontrada')
    }

    return this.proposalRepository.updateProposalStatus({
      id: proposalId,
      status: 'accepted',
    })
  }

  async reject(proposalId: string): Promise<ProposalEntity> {
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
