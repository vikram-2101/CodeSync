export const USER_COLORS = [
  "#30bced",
  "#6eeb83",
  "#ffbc42",
  "#ecd444",
  "#ee6352",
  "#9ac2c9",
  "#8acb88",
  "#1be7ff",
];

/**
 * Deterministically generates a color from the USER_COLORS palette
 * based on the provided string (e.g., username).
 */
export const getUserColor = (username: string): string => {
  let sum = 0;
  for (let i = 0; i < username.length; i++) {
    sum += username.charCodeAt(i);
  }
  return USER_COLORS[sum % USER_COLORS.length];
};
