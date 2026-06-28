import nodeConfig from "@codesync/eslint-config/node";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
    ],
  },
  ...nodeConfig,
];
