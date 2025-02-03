import { NextFunction, Request, Response } from 'express'
import { injectable, inject } from 'tsyringe'

import { ListingService } from '@/application/services/ListingService'
import { BadRequestError } from '@/errors/HttpErrors'
import {
  createListingSchema,
  listFilterListingSchema,
  updateListingSchema,
} from '@/presentation/schemas/listingSchema'

@injectable()
export class ListingController {
  constructor(
    @inject('ListingService') private listingService: ListingService,
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = await createListingSchema.validate(req.body, {
        abortEarly: false,
      })

      const listing = await this.listingService.create({
        ...validatedData,
        buyerId: req.user!.userId!,
      })

      res.status(201).json(listing)
    } catch (error) {
      next(error)
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      if (!id) {
        throw new BadRequestError('Id é obrigatório.')
      }

      const validatedData = await updateListingSchema.validate(req.body, {
        abortEarly: false,
      })

      const listing = await this.listingService.update(id, validatedData)

      res.status(201).json(listing)
    } catch (error) {
      next(error)
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      if (!id) {
        throw new BadRequestError('Id é obrigatório.')
      }

      const listing = await this.listingService.findById(id)

      if (listing) {
        res.json(listing)
        return
      }

      res.status(404).json({ error: 'Listing not found' })
    } catch (error) {
      next(error)
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params

      if (!id) {
        throw new BadRequestError('Id é obrigatório.')
      }

      await this.listingService.delete(id)

      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { filters, pagination } = await listFilterListingSchema.validate(
        req.body,
        {
          abortEarly: false,
        },
      )

      const listing = await this.listingService.list(filters, pagination)

      res.status(201).json(listing)
    } catch (error) {
      next(error)
    }
  }
}
