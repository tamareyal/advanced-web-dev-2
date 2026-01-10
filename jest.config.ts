import type {Config} from 'jest';

const config: Config = {
    verbose: true,
    preset: "ts-jest",
    testEnvironment: "node",
    setupFiles: ["./jest.setup.ts"],
    roots: ["<rootDir>/tests/"],
};

export default config;