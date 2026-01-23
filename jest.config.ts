import type {Config} from 'jest';

const config: Config = {
    verbose: true,
    preset: "ts-jest",
    testEnvironment: "node",
    setupFilesAfterEnv: ["./jest.setup.ts"],
    roots: ["<rootDir>/tests/"],
    bail: true,
    coverageProvider: "v8",
};

export default config;