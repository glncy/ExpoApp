import type { Meta, StoryFn, StoryObj } from "@storybook/react";
import React from "react";
import { StyleSheet, View } from "react-native";

import ComponentName from "./ComponentName";

type ComponentNameArgs = React.ComponentProps<typeof ComponentName>;
type Story = StoryObj<ComponentNameArgs>;

// Description of the component
// Use markdown syntax for the description
const description = `
Inherits (and extends) the [TouchableOpacity](https://reactnative.dev/docs/touchableopacity) component from React Native.
`;

const ComponentNameMeta: Meta<ComponentNameArgs> = {
  title: "ComponentType/ComponentName",
  component: ComponentName,
  argTypes: {
    onPress: { action: "pressed the button" },
  },
  args: {
    text: "Hello world",
  },
  decorators: [
    (Story: StoryFn) => (
      <View style={styles.container}>
        <Story />
      </View>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});

export default ComponentNameMeta;

export const Basic: Story = {
  args: {
    text: "Another example",
  },
};
