import {
  Inter_300Light as interLight,
  Inter_400Regular as interRegular,
  Inter_500Medium as interMedium,
  Inter_600SemiBold as interSemiBold,
  Inter_700Bold as interBold,
} from "@expo-google-fonts/inter";

export const fontsToLoad = {
  interLight,
  interRegular,
  interMedium,
  interSemiBold,
  interBold,
};

const fonts = {
  inter: {
    // Cross-platform Google font.
    light: "interLight",
    normal: "interRegular",
    medium: "interMedium",
    semiBold: "interSemiBold",
    bold: "interBold",
  },
};

export const typography = {
  /**
   * The fonts are available to use, but prefer using the semantic name.
   */
  fonts,
  fontSizes: {
    text: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
    },
    display: {
      xs: 24,
      sm: 30,
      md: 36,
      lg: 48,
      xl: 60,
      "2xl": 72,
    },
  } as const,
};
