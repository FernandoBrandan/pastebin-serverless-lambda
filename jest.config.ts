// jest.config.ts
import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.ts'], // o ajustá según dónde tengas tests
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
}

export default config
