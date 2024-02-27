import React, { FC } from "react";
import { View } from "react-native";

import { NavigatorNameNavScreenProps } from "@/src/navigators/NavigatorNameNavigator";

interface ScreenNameScreenProps extends NavigatorNameNavScreenProps<"ScreenNameScreen"> {}

export const ScreenNameScreen: FC<ScreenNameScreenProps> = (props) => {
  return <View>{/* ... */}</View>;
};
