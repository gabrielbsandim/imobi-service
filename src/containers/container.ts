import { Knex } from 'knex'
import knex from 'knex'
import { container } from 'tsyringe'

import knexConfig from '../../knexfile'

import { AuthService } from '@/application/services/AuthService'
import { DislikeService } from '@/application/services/DislikeService'
import { EmailService } from '@/application/services/EmailService'
import { FavoriteService } from '@/application/services/FavoriteService'
import { ListingService } from '@/application/services/ListingService'
import { ProposalService } from '@/application/services/ProposalService'
import { ReviewService } from '@/application/services/ReviewService'
import { UserService } from '@/application/services/UserService'
import { IAuthRepository } from '@/domain/interfaces/repositories/database/IAuthRepository'
import { IDislikeRepository } from '@/domain/interfaces/repositories/database/IDislikeRepository'
import { IFavoriteRepository } from '@/domain/interfaces/repositories/database/IFavoriteRepository'
import { IListingRepository } from '@/domain/interfaces/repositories/database/IListingRepository'
import { IProposalRepository } from '@/domain/interfaces/repositories/database/IProposalRepository'
import { IReviewRepository } from '@/domain/interfaces/repositories/database/IReviewRepository'
import { IUserRepository } from '@/domain/interfaces/repositories/database/IUserRepository'
import { IEmailService } from '@/domain/interfaces/services/IEmailService'
import { KnexAuthRepository } from '@/infra/repositories/database/KnexAuthRepository'
import { KnexDislikeRepository } from '@/infra/repositories/database/KnexDislikeRepository'
import { KnexFavoriteRepository } from '@/infra/repositories/database/KnexFavoriteRepository'
import { KnexListingRepository } from '@/infra/repositories/database/KnexListingRepository'
import { KnexProposalRepository } from '@/infra/repositories/database/KnexProposalRepository'
import { KnexReviewRepository } from '@/infra/repositories/database/KnexReviewRepository'
import { KnexUserRepository } from '@/infra/repositories/database/KnexUserRepository'
import { AuthController } from '@/presentation/controllers/AuthController'
import { DislikeController } from '@/presentation/controllers/DislikeController'
import { FavoriteController } from '@/presentation/controllers/FavoriteController'
import { ListingController } from '@/presentation/controllers/ListingController'
import { ProposalController } from '@/presentation/controllers/ProposalController'
import { ReviewController } from '@/presentation/controllers/ReviewController'
import { UserController } from '@/presentation/controllers/UserController'
import { AuthMiddleware } from '@/presentation/middlewares/AuthMiddleware'

const knexInstance = knex(knexConfig)
container.register<Knex>('Knex', { useValue: knexInstance })

container.register('AuthService', { useClass: AuthService })
container.register<IAuthRepository>('IAuthRepository', {
  useClass: KnexAuthRepository,
})
container.register('AuthController', { useClass: AuthController })
container.register('AuthMiddleware', { useClass: AuthMiddleware })

container.register('UserService', { useClass: UserService })
container.register<IUserRepository>('IUserRepository', {
  useClass: KnexUserRepository,
})
container.register('UserController', { useClass: UserController })

container.register('EmailService', { useClass: EmailService })
container.register<IEmailService>('IEmailService', {
  useClass: EmailService,
})

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

container.register<IFavoriteRepository>('IFavoriteRepository', {
  useClass: KnexFavoriteRepository,
})
container.register('FavoriteService', { useClass: FavoriteService })
container.register('FavoriteController', { useClass: FavoriteController })

container.register<IDislikeRepository>('IDislikeRepository', {
  useClass: KnexDislikeRepository,
})
container.register('DislikeService', { useClass: DislikeService })
container.register('DislikeController', { useClass: DislikeController })

container.register<IReviewRepository>('IReviewRepository', {
  useClass: KnexReviewRepository,
})
container.register('ReviewService', { useClass: ReviewService })
container.register('ReviewController', { useClass: ReviewController })
