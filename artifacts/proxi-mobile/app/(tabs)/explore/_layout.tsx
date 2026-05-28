import { Stack } from "expo-router";
import { useColors } from "@/hooks/useColors";

export default function ExploreLayout() {
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
      <Stack.Screen name="notifications" options={{ title: "Notifications" }} />
      <Stack.Screen name="listing/[id]" options={{ title: "Listing" }} />
      <Stack.Screen name="task/[id]" options={{ title: "Task" }} />
    </Stack>
  );
}
