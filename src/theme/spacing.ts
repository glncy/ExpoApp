/**
  Use these spacings for margins/paddings and other whitespace throughout your app.
 */
export const spacing = {
  xxxs: 2,
  xxs: 4,
  "2xs": 6,
  xs: 8,
  sm: 12,
  "2sm": 14,
  md: 16,
  "2md": 20,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export type Spacing = keyof typeof spacing;
