// tailwind
import "../global.css";

// unistyles
import "../src/theme/unistyles";

import React from "react";
import { View } from "react-native";
import { Preview } from "@storybook/react";

const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

const decorators = [
  /* by wrapping everything in a view the parent container is always using flexbox and behaves like a react-native-web component would  */
  (Story) => (
    <View>
      <Story />
    </View>
  ),
];

const preview: Preview = {
  decorators,
  parameters,
};

export default preview;
