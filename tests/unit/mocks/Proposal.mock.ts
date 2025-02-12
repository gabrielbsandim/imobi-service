import {
  ProposalEntity,
  TCreateProposalRequest,
} from '@/domain/entities/ProposalEntity'
import { IProposalRepository } from '@/domain/interfaces/repositories/database/IProposalRepository'

export const mockCreateProposalRequest: jest.Mocked<
  Omit<TCreateProposalRequest, 'status'>
> = {
  listingId: 'listing_456',
  brokerId: 'broker_789',
  message: 'Excelente imóvel!',
  photoUrls: ['https://example.com/photo.jpg'],
}

export const mockProposal: jest.Mocked<ProposalEntity> = {
  ...mockCreateProposalRequest,
  status: 'pending',
  id: '123',
}

export const mockProposalRepository: jest.Mocked<IProposalRepository> = {
  create: jest.fn().mockResolvedValue({
    id: mockProposal.id,
  }),
  listProposalsByListingId: jest.fn().mockResolvedValue([mockProposal]),
  updateProposalStatus: jest.fn().mockResolvedValue({
    ...mockProposal,
    status: 'accepted',
  }),
  findProposalById: jest.fn().mockResolvedValue(mockProposal),
}
