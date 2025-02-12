import { container } from 'tsyringe'

import { ProposalService } from '@/application/services/ProposalService'
import { mockListingRepository } from '@/tests/unit/mocks/ListingMock'
import {
  mockCreateProposalRequest,
  mockProposal,
  mockProposalRepository,
} from '@/tests/unit/mocks/ProposalMock'

container.register('IProposalRepository', { useValue: mockProposalRepository })
container.register('IListingRepository', { useValue: mockListingRepository })

describe('ProposalService', () => {
  let proposalService: ProposalService

  beforeEach(() => {
    proposalService = container.resolve(ProposalService)
    jest.clearAllMocks()
  })

  it('should create a proposal', async () => {
    const created = await proposalService.create(mockCreateProposalRequest)

    expect(created).toStrictEqual({
      id: mockProposal.id,
    })

    expect(mockProposalRepository.create).toHaveBeenCalledWith({
      ...mockCreateProposalRequest,
      status: 'pending',
    })
  })

  it('should accept a proposal', async () => {
    await proposalService.accept(mockProposal.id)

    expect(mockProposalRepository.updateProposalStatus).toHaveBeenCalledWith({
      id: mockProposal.id,
      status: 'accepted',
    })
  })

  it('should reject a proposal', async () => {
    await proposalService.reject(mockProposal.id)

    expect(mockProposalRepository.updateProposalStatus).toHaveBeenCalledWith({
      id: mockProposal.id,
      status: 'rejected',
    })
  })

  it('should list proposals by "listeningId"', async () => {
    const proposals = await proposalService.listProposalsByListing(
      mockProposal.listingId,
    )

    expect(proposals).toStrictEqual([mockProposal])

    expect(
      mockProposalRepository.listProposalsByListingId,
    ).toHaveBeenCalledWith(mockProposal.listingId)
  })
})
