import { view } from "./storybook.requires";
import * as Font from "expo-font";
import "./storybook.requires";
import { fontsToLoad } from "../src/theme/typography";
import * as storage from "../src/utils/storage";

// load fonts
Font.loadAsync(fontsToLoad);

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: async (key: string) => {
      const data = storage.loadString(key);
      if (!data) return null;
      return data;
    },
    setItem: async (key: string, value: string) => {
      storage.saveString(key, value);
    },
  },
  enableWebsockets: true,
  host: "localhost",
  port: 7007,
});

export default StorybookUIRoot;
