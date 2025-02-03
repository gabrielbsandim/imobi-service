export type TTransactionType = 'buy' | 'rent'
export type TPropertyType = 'house' | 'apartment' | 'land' | 'commercial'

export class ListingEntity {
  constructor(
    public id: string,
    public buyerId: string,
    public transactionType: TTransactionType,
    public propertyType: TPropertyType,
    public city: string,
    public description: string,
    public neighborhood?: string,
    public maxPrice?: number,
    public minPrice?: number,
    public bedrooms?: number,
    public bathrooms?: number,
    public minSizeM2?: number,
    public maxSizeM2?: number,
    public parkingSpaces?: number,
    public minFloor?: number,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}

export type TCreateListingRequest = Omit<
  ListingEntity,
  'id' | 'createdAt' | 'updatedAt'
>

export type TUpdateListingRequest = Partial<
  Omit<TCreateListingRequest, 'buyerId'>
>

export type TListListingFilterRequest = Partial<
  Omit<TCreateListingRequest, 'buyerId'>
>
