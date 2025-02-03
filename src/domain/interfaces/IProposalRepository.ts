import {
  ProposalEntity,
  TCreateProposalRequest,
  TUpdateProposalStatus,
} from '@/domain/entities/ProposalEntity'

export interface IProposalRepository {
  create(proposal: TCreateProposalRequest): Promise<ProposalEntity>
  listProposalsByListingId(listingId: string): Promise<ProposalEntity[]>
  updateProposalStatus(input: TUpdateProposalStatus): Promise<ProposalEntity>
  findProposalById(proposalId: string): Promise<ProposalEntity | null>
}
