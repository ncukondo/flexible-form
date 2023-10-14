import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig: Config = {
  moduleNameMapper: {
    // aliasを定義 （tsconfig.jsonのcompilerOptions>pathsの定義に合わせる）
    "^@components/(.*)$": "<rootDir>/src/app/_components/$1",
    "^@lib/(.*)$": "<rootDir>/src/app/_lib/$1",
  },
};

export default createJestConfig(customJestConfig);
