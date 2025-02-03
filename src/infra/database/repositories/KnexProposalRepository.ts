import { Knex } from 'knex'
import { injectable, inject } from 'tsyringe'

import {
  ProposalEntity,
  TCreateProposalRequest,
  TUpdateProposalStatus,
} from '@/domain/entities/ProposalEntity'
import { IProposalRepository } from '@/domain/interfaces/IProposalRepository'

@injectable()
export class KnexProposalRepository implements IProposalRepository {
  constructor(@inject('Knex') private knex: Knex) {}

  async create(proposalData: TCreateProposalRequest): Promise<ProposalEntity> {
    const [proposal] = await this.knex('proposals')
      .insert({
        listing_id: proposalData.listingId,
        broker_id: proposalData.brokerId,
        message: proposalData.message,
        photo_urls: proposalData.photoUrls,
        status: proposalData.status,
      })
      .returning('*')

    return this.toDomain(proposal)
  }

  async listProposalsByListingId(listingId: string): Promise<ProposalEntity[]> {
    const proposals = await this.knex('proposals')
      .where('listing_id', listingId)
      .select('*')

    return proposals.map(this.toDomain)
  }

  async updateProposalStatus({
    id,
    status,
  }: TUpdateProposalStatus): Promise<ProposalEntity> {
    const [proposal] = await this.knex('proposals')
      .where('id', id)
      .update({ status })
      .returning('*')

    return this.toDomain(proposal)
  }

  async findProposalById(proposalId: string): Promise<ProposalEntity | null> {
    const proposal = await this.knex('proposals')
      .where('id', proposalId)
      .first()

    return proposal ? this.toDomain(proposal) : null
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private toDomain(raw: any): ProposalEntity {
    return new ProposalEntity(
      raw.id,
      raw.listing_id,
      raw.broker_id,
      raw.message,
      raw.photo_urls,
      raw.status,
    )
  }
}
