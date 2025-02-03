import { Knex } from 'knex'
import knex from 'knex'
import { container } from 'tsyringe'

import knexConfig from '../../knexfile'

import { ListingService } from '@/application/services/ListingService'
import { ProposalService } from '@/application/services/ProposalService'
import { UserService } from '@/application/services/UserService'
import { IListingRepository } from '@/domain/interfaces/IListingRepository'
import { IProposalRepository } from '@/domain/interfaces/IProposalRepository'
import { IUserRepository } from '@/domain/interfaces/IUserRepository'
import { KnexListingRepository } from '@/infra/database/repositories/KnexListingRepository'
import { KnexProposalRepository } from '@/infra/database/repositories/KnexProposalRepository'
import { KnexUserRepository } from '@/infra/database/repositories/KnexUserRepository'
import { ListingController } from '@/presentation/controllers/ListingController'
import { ProposalController } from '@/presentation/controllers/ProposalController'
import { UserController } from '@/presentation/controllers/UserController'

const knexInstance = knex(knexConfig)
container.register<Knex>('Knex', { useValue: knexInstance })

container.register('UserService', { useClass: UserService })
container.register<IUserRepository>('IUserRepository', {
  useClass: KnexUserRepository,
})
container.register('UserController', { useClass: UserController })

container.register('ListingService', { useClass: ListingService })
container.register<IListingRepository>('IListingRepository', {
  useClass: KnexListingRepository,
})
container.register('ListingController', { useClass: ListingController })

container.register<IProposalRepository>('IProposalRepository', {
  useClass: KnexProposalRepository,
})
container.register('ProposalService', { useClass: ProposalService })
container.register('ProposalController', { useClass: ProposalController })
