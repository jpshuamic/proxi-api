import { Redirect } from "expo-router";
import { useApp } from "@/context/AppContext";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { isAuthenticated, isLoading } = useApp();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF" }}>
        <ActivityIndicator color="#1D9E75" size="large" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/explore" />;
  }

  return <Redirect href="/(onboarding)/splash" />;
}
