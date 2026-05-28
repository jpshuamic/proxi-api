import { Stack } from "expo-router";
import { useColors } from "@/hooks/useColors";

export default function PostLayout() {
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
      <Stack.Screen name="product" options={{ title: "Post a Product" }} />
      <Stack.Screen name="service" options={{ title: "Post a Service" }} />
      <Stack.Screen name="task" options={{ title: "Post a Task" }} />
    </Stack>
  );
}
