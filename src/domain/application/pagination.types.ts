export interface IPagination {
  total: number
  offset: number
  limit: number
}

export interface IPaginationResponse<T> {
  items: T[]
  pagination: IPagination
}

export type TPaginationRequest = Pick<IPagination, 'offset' | 'limit'>
