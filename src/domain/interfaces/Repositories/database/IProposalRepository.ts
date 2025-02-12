import {
  ProposalEntity,
  TCreateProposal,
  TUpdateProposalStatus,
} from '@/domain/entities/ProposalEntity'
import { ICreationResult } from '@/domain/interfaces/shared/ICreationResult'

export interface IProposalRepository {
  create(proposal: TCreateProposal): Promise<ICreationResult>
  listProposalsByListingId(listingId: string): Promise<ProposalEntity[]>
  updateProposalStatus(input: TUpdateProposalStatus): Promise<void>
  findProposalById(proposalId: string): Promise<ProposalEntity | null>
}
