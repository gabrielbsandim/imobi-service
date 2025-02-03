import { Knex } from 'knex'
import knex from 'knex'
import { container } from 'tsyringe'

import knexConfig from '../../knexfile'

import { ListingService } from '@/application/services/ListingService'
import { UserService } from '@/application/services/UserService'
import { IListingRepository } from '@/domain/interfaces/IListingRepostory'
import { IUserRepository } from '@/domain/interfaces/IUserRepository'
import { KnexListingRepository } from '@/infra/database/repositories/KnexListingRepository'
import { KnexUserRepository } from '@/infra/database/repositories/KnexUserRepository'
import { ListingController } from '@/presentation/controllers/ListingController'
import { UserController } from '@/presentation/controllers/UserController'

const knexInstalnce = knex(knexConfig)
container.register<Knex>('Knex', { useValue: knexInstalnce })

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
