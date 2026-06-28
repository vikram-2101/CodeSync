import reactConfig from "@codesync/eslint-config/react";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/coverage/**",
    ],
  },
  ...reactConfig,
];
