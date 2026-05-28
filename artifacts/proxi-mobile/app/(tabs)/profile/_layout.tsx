import { Stack } from "expo-router";
import { useColors } from "@/hooks/useColors";

export default function ProfileLayout() {
  const colors = useColors();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.foreground,
        headerTitleStyle: { fontFamily: "Inter_700Bold", fontSize: 17 },
        headerShadowVisible: false,
        headerBackTitle: "",
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="trust-score" options={{ title: "Trust Score" }} />
      <Stack.Screen name="wallet" options={{ title: "Wallet" }} />
      <Stack.Screen name="reviews" options={{ title: "Reviews" }} />
    </Stack>
  );
}
