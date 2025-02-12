export type TProposalStatus = 'pending' | 'accepted' | 'rejected'

export class ProposalEntity {
  constructor(
    public id: string,
    public listingId: string,
    public brokerId: string,
    public message: string,
    public photoUrls: string[],
    public status: TProposalStatus = 'pending',
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}

export type TCreateProposal = Omit<
  ProposalEntity,
  'id' | 'createdAt' | 'updatedAt'
>

export type TUpdateProposalStatus = Pick<ProposalEntity, 'id' | 'status'>
