export class HttpError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(message, 404)
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string) {
    super(message, 400)
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string) {
    super(message, 401)
  }
}
