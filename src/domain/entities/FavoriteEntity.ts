export class FavoriteEntity {
  constructor(
    public id: string,
    public listingId: string,
    public brokerId: string,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}

export type TToggleFavorite = Pick<FavoriteEntity, 'listingId' | 'brokerId'>
