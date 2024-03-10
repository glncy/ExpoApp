import { Redirect } from "expo-router";

const RootEntry = () => {
  return <Redirect href="/auth/login" />;
};

export default RootEntry;
