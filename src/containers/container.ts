import { Knex } from 'knex'
import knex from 'knex'
import { container } from 'tsyringe'

import knexConfig from '../../knexfile'

import { AuthService } from '@/application/services/AuthService'
import { ListingService } from '@/application/services/ListingService'
import { ProposalService } from '@/application/services/ProposalService'
import { UserService } from '@/application/services/UserService'
import { IListingRepository } from '@/domain/interfaces/Repositories/database/IListingRepository'
import { IProposalRepository } from '@/domain/interfaces/Repositories/database/IProposalRepository'
import { IUserRepository } from '@/domain/interfaces/Repositories/database/IUserRepository'
import { KnexListingRepository } from '@/infra/repositories/database/KnexListingRepository'
import { KnexProposalRepository } from '@/infra/repositories/database/KnexProposalRepository'
import { KnexUserRepository } from '@/infra/repositories/database/KnexUserRepository'
import { FirebaseAuthRepository } from '@/infra/repositories/firebase/FirebaseAuthRepository'
import { ListingController } from '@/presentation/controllers/ListingController'
import { ProposalController } from '@/presentation/controllers/ProposalController'
import { UserController } from '@/presentation/controllers/UserController'

const knexInstance = knex(knexConfig)
container.register<Knex>('Knex', { useValue: knexInstance })

container.register('AuthService', { useClass: AuthService })
container.register('IAuthRepository', { useClass: FirebaseAuthRepository })

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
