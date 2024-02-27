import notifee from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";
import Constants from "expo-constants";
import codePush from "react-native-code-push";

import App from "@/src/app";

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log("Message handled in the background!", remoteMessage);
  notifee.displayNotification(
    JSON.parse((remoteMessage.data?.notifee as string) ?? "{}")
  );
});

const BaseApp = () => {
  return <App />;
};

const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
};

const RootApp = __DEV__ ? BaseApp : codePush(codePushOptions)(BaseApp);

let AppEntryPoint = RootApp;

if (
  Constants.expoConfig &&
  Constants.expoConfig.extra &&
  Constants.expoConfig.extra.storybookEnabled === "1"
) {
  AppEntryPoint = require("./.storybook").default;
}

export default AppEntryPoint;
