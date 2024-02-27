import type { Preview } from "@storybook/react";

const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

const decorators = [];

export const preview: Preview = {
  parameters,
  decorators,
};
