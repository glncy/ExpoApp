import { useRouter } from "expo-router";
import { View } from "react-native";

import { Button } from "@/src/components/reusables/ui/button";
import { Text } from "@/src/components/reusables/ui/text";

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View>
      <Text>Login</Text>
      <Button onPress={() => router.push("/auth/signup")}>
        <Text>Signup</Text>
      </Button>
    </View>
  );
}
