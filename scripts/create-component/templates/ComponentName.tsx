import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export interface ComponentNameProps {
  /**
   * Function to execute on press
   */
  onPress: () => void;
  /**
   * Text to display inside the button
   */
  text: string;
}

const ComponentName = ({ onPress, text }: ComponentNameProps) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "purple",
    borderRadius: 8,
  },
  text: { color: "white" },
});

export default ComponentName;
