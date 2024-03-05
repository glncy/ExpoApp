import { useRouter } from "expo-router";
import { View, Text } from "react-native";

import Button from "@/src/components/atoms/Button";

export default function LoginScreen() {
  const router = useRouter();
  return (
    <View>
      <Text>Login</Text>
      <Button text="Sign Up" onPress={() => router.push("/auth/signup")} />
    </View>
  );
}
