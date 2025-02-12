import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  clearMocks: true,
  rootDir: '.',
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  moduleNameMapper: {
    '^@/tests/(.*)$': '<rootDir>/tests/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: ['src'],
  testPathIgnorePatterns: ['build'],
  setupFiles: ['<rootDir>/tests/setup.ts'],
  verbose: true,
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
}

export default config
