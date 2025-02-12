export class ReviewEntity {
  constructor(
    public id: string,
    public buyerId: string,
    public brokerId: string,
    public rating: number,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}

export type TCreateReview = Pick<
  ReviewEntity,
  'buyerId' | 'brokerId' | 'rating'
>

export type TFindReviewByBuyerAndBroker = Pick<
  ReviewEntity,
  'buyerId' | 'brokerId'
>
