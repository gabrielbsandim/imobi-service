import { NextFunction, Request, Response } from 'express'
import { injectable, inject } from 'tsyringe'

import { ReviewService } from '@/application/services/ReviewService'
import {
  createReviewSchema,
  TCreateReviewSchema,
} from '@/presentation/schemas/reviewSchema'
import { schemaValidator } from '@/presentation/schemas/schemaValidator'

@injectable()
export class ReviewController {
  constructor(@inject('ReviewService') private reviewService: ReviewService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = await schemaValidator<TCreateReviewSchema>(
        createReviewSchema,
        req.body,
      )

      const response = await this.reviewService.create({
        ...validatedData,
        brokerId: req.params.brokerId,
        buyerId: req.userId!,
      })

      res.status(201).json(response)
    } catch (error) {
      next(error)
    }
  }

  async getAverageRating(req: Request, res: Response, next: NextFunction) {
    try {
      const { brokerId } = req.params

      const average = await this.reviewService.getAverageRating(brokerId)

      res.status(200).json(average)
    } catch (error) {
      next(error)
    }
  }
}
