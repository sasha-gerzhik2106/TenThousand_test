import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "./packages/shared/src/schema.graphql",
  generates: {
    // 1. BACKEND: Generate Resolver Types
    "./packages/server/src/__generated__/resolvers-types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        useIndexSignature: true,
      },
    },
    // 2. FRONTEND: Generate Client Hooks & Types
    "./packages/client/src/__generated__/": {
      documents: "./packages/client/src/**/*.{ts,tsx}",
      preset: "client",
      plugins: [], // 'client' preset handles the plugins internally
      presetConfig: {
        gqlTagName: "gql",
      },
    },
  },
};

export default config;
