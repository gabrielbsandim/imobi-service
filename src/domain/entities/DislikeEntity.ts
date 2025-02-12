export class DislikeEntity {
  constructor(
    public id: string,
    public listingId: string,
    public brokerId: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}

export type TToggleDislike = Pick<DislikeEntity, 'listingId' | 'brokerId'>
