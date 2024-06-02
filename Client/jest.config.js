// jest.config.cjs
module.exports = {
  testEnvironment: 'node',
  testEnvironment: 'jsdom',

  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/frontend/src/styleMock.js',
  },
  testPathIgnorePatterns: ['/node_modules/', '/backend/', '/public/'],
  testTimeout: 10000,
};
