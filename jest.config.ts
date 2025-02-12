import type { Config } from '@jest/types'
import { pathsToModuleNameMapper } from 'ts-jest'

import { compilerOptions } from './tsconfig.json'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.json',
    },
  },
  setupFiles: ['<rootDir>/tests/setup.ts'],
}

export default config
