export * from "./colors";
export * from "./spacing";
export * from "./typography";
export * from "./timing";

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  "4xl": 48,
  "5xl": 56,
  "6xl": 64,
  full: 9999,
} as const;

export type BorderRadius = keyof typeof borderRadius;

export const borderWidth = {
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
} as const;

export type BorderWidth = keyof typeof borderWidth;
