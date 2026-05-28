import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="splash" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="otp" />
      <Stack.Screen name="user-type" />
      <Stack.Screen name="location" />
      <Stack.Screen name="profile-setup" />
    </Stack>
  );
}
