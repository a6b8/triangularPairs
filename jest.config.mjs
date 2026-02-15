export default {
    testEnvironment: 'node',
    testMatch: ['**/tests/jest/**/*.test.mjs'],
    collectCoverageFrom: ['src/**/*.mjs', '!src/**/*.test.mjs'],
    coverageThreshold: {
        global: { branches: 50, functions: 50, lines: 50, statements: 50 }
    },
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html', 'json'],
    verbose: true,
    testTimeout: 10000
}
