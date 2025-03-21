import { NextFunction, Request, Response } from 'express'
import { injectable, inject } from 'tsyringe'

import { ListingService } from '@/application/services/ListingService'
import { BadRequestError } from '@/errors/HttpErrors'
import {
  createListingSchema,
  listFilterListingSchema,
  TCreateListingSchema,
  TListFilterListingSchema,
  TUpdateListingSchema,
  updateListingSchema,
} from '@/presentation/schemas/listingSchema'
import { schemaValidator } from '@/presentation/schemas/schemaValidator'

@injectable()
export class ListingController {
  constructor(
    @inject('ListingService') private listingService: ListingService,
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = await schemaValidator<TCreateListingSchema>(
        createListingSchema,
        req.body,
      )

      const response = await this.listingService.create({
        ...validatedData,
        buyerId: req.userId!,
        buyerPhoneNumber: req.user!.phoneNumber!,
      })

      res.status(201).json(response)
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

      const validatedData = await schemaValidator<TUpdateListingSchema>(
        updateListingSchema,
        req.body,
      )

      await this.listingService.update(id, validatedData)

      res.status(204).send()
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
        res.status(200).json(listing)
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
      const { filters, pagination } =
        await schemaValidator<TListFilterListingSchema>(
          listFilterListingSchema,
          req.body,
        )

      const listing = await this.listingService.list(
        filters,
        pagination,
        req.user!.id,
      )

      res.status(200).json(listing)
    } catch (error) {
      next(error)
    }
  }
}
