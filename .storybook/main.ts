// .storybook/main.ts
import type { StorybookConfig } from "@storybook/react-native";

const paths = ["../src/components/**/"];

export const getStoriesPath = (targetFiles: string[]) => {
  return targetFiles
    .map((file) => {
      return paths.map((path) => {
        return path + file;
      });
    })
    .flat();
};

const main: StorybookConfig = {
  stories: getStoriesPath(["*.stories.?(ts|tsx|js|jsx)"]),
  addons: [
    "@storybook/addon-ondevice-notes",
    "@storybook/addon-ondevice-controls",
    "@storybook/addon-ondevice-backgrounds",
    "@storybook/addon-ondevice-actions",
  ],
};

export default main;
