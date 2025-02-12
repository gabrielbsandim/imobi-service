export type TTransactionType = 'buy' | 'rent'
export type TPropertyType = 'house' | 'apartment' | 'studio'

export enum EPrice {
  UNTIL_300 = 0,
  BETWEEN_300_TO_500 = 1,
  BETWEEN_500_TO_750 = 2,
  MORE_THAN_750 = 3,
}

export enum ESize {
  UNTIL_50 = 0,
  BETWEEN_51_TO_70 = 1,
  BETWEEN_71_TO_100 = 2,
  MORE_THAN_100 = 3,
}

export enum EBedroom {
  ONE = 0,
  TWO = 1,
  THREE = 2,
  MORE_THAN_FOUR = 3,
}

export enum EBathroom {
  ONE = 0,
  TWO = 1,
  THREE = 2,
  MORE_THAN_FOUR = 3,
}

export enum EParkingSpaces {
  ONE = 0,
  TWO = 1,
  MORE_THAN_TWO = 2,
}

export class ListingEntity {
  constructor(
    public id: string,
    public buyerId: string,
    public buyerPhoneNumber: string,
    public transactionType: TTransactionType,
    public propertyType: TPropertyType,
    public city: string,
    public description: string,
    public price?: EPrice,
    public bedrooms?: EBedroom,
    public bathrooms?: EBathroom,
    public size?: ESize,
    public parkingSpaces?: EParkingSpaces,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}

export type TCreateListing = Omit<
  ListingEntity,
  'id' | 'createdAt' | 'updatedAt'
>

export type TUpdateListing = Partial<Omit<TCreateListing, 'buyerId'>>

export type TListListingFilter = Partial<TUpdateListing> & {
  excludeDisliked?: boolean
  onlyFavorites?: boolean
  onlyDisliked?: boolean
}
