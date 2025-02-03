import 'dotenv/config'
import 'reflect-metadata'
process.env.NODE_ENV = 'test'

jest.mock('twilio', () =>
  jest.fn().mockReturnValue({
    messages: {
      create: jest.fn(),
    },
  }),
)
