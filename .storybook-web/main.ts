import type { StorybookConfig } from "@storybook/react-webpack5";
import path from "path";
import { getStoriesPath } from "../.storybook/main";

type ServerStorybookConfig = StorybookConfig & {
  reactNativeServerOptions: { host: string; port: number };
};

const main: ServerStorybookConfig = {
  stories: getStoriesPath(["*.stories.?(ts|tsx|js|jsx)", "*.stories.mdx"]),
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    {
      name: "@storybook/addon-react-native-web",
      options: {
        modulesToTranspile: [
          "react-native-reanimated",
          "nativewind",
          "react-native-css-interop",
        ],
        babelPresets: ["nativewind/babel"],
        babelPresetReactOptions: { jsxImportSource: "nativewind" },
        babelPlugins: [
          "react-native-reanimated/plugin",
          [
            "@babel/plugin-transform-react-jsx",
            {
              runtime: "automatic",
              importSource: "nativewind",
            },
          ],
        ],
      },
    },
    "@storybook/addon-react-native-server",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },

  webpackFinal: async (config) => {
    config.module?.rules?.push({
      test: /\.css$/,
      use: [
        {
          loader: "postcss-loader",
          options: {
            postcssOptions: {
              plugins: [require("tailwindcss"), require("autoprefixer")],
            },
          },
        },
      ],
      include: path.resolve(__dirname, "../"),
    });
    return { ...config };
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
