/** @type {import('jest').Config} */
module.exports = {
  // Run tests in a Node.js environment
  testEnvironment: 'node',

  // Discover test files
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/*.test.js',
    '**/*.spec.js',
  ],

  // Paths to ignore
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],

  // Module name aliases so tests can import using short paths
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@db/(.*)$': '<rootDir>/src/db/$1',
    '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
  },

  // Coverage collection
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/db/migrations/**',
    '!src/db/seeds/**',
  ],

  // Coverage thresholds — fail the build if coverage drops below these values
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },

  // Output coverage reports to ./coverage
  coverageDirectory: 'coverage',

  coverageReporters: ['text', 'lcov', 'clover'],

  // Automatically reset mocks between every test
  clearMocks: true,
  resetMocks: false,
  restoreMocks: true,

  // Expose global setup helpers
  setupFilesAfterFramework: [],
};
