// TODO: write documentation for colors and palette in own markdown file and add links from here

const palette = {
  carolinaBlue: (opacity = 1) => `rgba(100, 149, 237, ${opacity})`,
  steelBlue: (opacity = 1) => `rgba(69, 130, 175, ${opacity})`,
  orangeYellowCrayola: (opacity = 1) => `rgba(238, 201, 107, ${opacity})`,
  /**
   *
   * Light Colors
   */
  light01: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,

  /**
   *
   * Greyscale Colors
   */
  textPrimary: (opacity = 1) => `rgba(4, 8, 21, ${opacity})`,
  textSecondary: (opacity = 1) => `rgba(50, 54, 67, ${opacity})`,
  textTertiary: (opacity = 1) => `rgba(96, 100, 113, ${opacity})`,
  greyscale900: (opacity = 1) => `rgba(18, 17, 39, ${opacity})`,
  /**
   * States Colors
   */
  error: (opacity = 1) => `rgba(240, 68, 56, ${opacity})`,
} as const;

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * Primary brand color for your app, usually your brand color.
   */
  primaryCarolinaBlue: (opacity = 1) => palette.carolinaBlue(opacity),
  primarySteelBlue: (opacity = 1) => palette.steelBlue(opacity),
  /**
   * Background color for pages, such as lists.
   */
  background: (opacity = 1) => palette.light01(opacity),
};
