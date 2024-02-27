import type { StorybookConfig } from "@storybook/react-webpack5";

type ServerStorybookConfig = StorybookConfig & {
  reactNativeServerOptions: { host: string; port: number };
};

const main: ServerStorybookConfig = {
  stories: ["../src/**/*.stories.?(ts|tsx|js|jsx)", "../src/**/*.stories.mdx"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-react-native-web",
    "@storybook/addon-react-native-server",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },

  webpackFinal: async (config) => {
    // exclude sql files from the webpack bundling
    config.module?.rules?.push({
      test: /\.sql$/,
      use: "raw-loader",
    });

    // exclude plist files from the webpack bundling
    config.module?.rules?.push({
      test: /\.plist$/,
      use: "raw-loader",
    });

    return config;
  },

  reactNativeServerOptions: {
    // for android you should use your local ip address here
    host: "localhost",
    port: 7007,
  },

  typescript: {
    reactDocgen: "react-docgen-typescript",
  },

  // if you wanna include all props in the docs, uncomment this:
  // typescript: {
  //   reactDocgenTypescriptOptions: {
  //     shouldExtractLiteralValuesFromEnum: true,
  //     shouldRemoveUndefinedFromOptional: true,
  //   },
  // },

  docs: {
    autodocs: true,
  },

  staticDirs: [
    { from: "../node_modules/@expo-google-fonts/inter", to: "fonts" },
  ],
};

export default main;
