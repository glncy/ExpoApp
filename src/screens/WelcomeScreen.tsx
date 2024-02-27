import React, { FC } from "react";
import { View } from "react-native";

import { AppStackScreenProps } from "@/src/navigators/AppNavigator";

interface WelcomeScreenProps extends AppStackScreenProps<"WelcomeScreen"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = (props) => {
  return <View>{/* ... */}</View>;
};
