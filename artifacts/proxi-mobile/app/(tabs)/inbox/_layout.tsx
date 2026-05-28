import { Stack } from "expo-router";
import { useColors } from "@/hooks/useColors";

export default function InboxLayout() {
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
      <Stack.Screen name="chat/[id]" options={{ title: "" }} />
      <Stack.Screen name="order/[id]" options={{ title: "Order Details" }} />
    </Stack>
  );
}
