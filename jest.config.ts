import type {Config} from 'jest';

const config: Config = {
    verbose: true,
    preset: "ts-jest",
    testEnvironment: "node",
    setupFilesAfterEnv: ["./jest.setup.ts"],
    roots: ["<rootDir>/tests/"],
    bail: true,
    coverageProvider: "v8",
    collectCoverageFrom: [
        '**/*.ts',
        '!**/*.test.ts',      
        '!**/tests/**',
        '!**/node_modules/**',
        '!**/dist/**',
        '!**/coverage/**',
        '!swagger.ts',        
        '!server.ts',
        '!index.ts',
    ],
};

export default config;