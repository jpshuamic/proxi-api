import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

export default function SplashScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const t = setTimeout(() => router.replace("/(onboarding)/signup"), 2200);
    return () => clearTimeout(t);
  }, []);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[styles.container, { paddingTop: topPad }]}>
      <View style={styles.center}>
        <View style={styles.logoBox}>
          <Text style={styles.logoLetter}>P</Text>
        </View>
        <Text style={styles.brand}>Proxi</Text>
        <Text style={styles.tagline}>Your neighbourhood. Your market.</Text>
      </View>

      <View style={[styles.footer, { paddingBottom: Platform.OS === "web" ? 34 : insets.bottom + 16 }]}>
        <View style={styles.featureRow}>
          <FeatureItem icon="shield" text="100% Escrow Safe" />
          <FeatureItem icon="map-pin" text="Hyper-Local" />
          <FeatureItem icon="users" text="Trusted Traders" />
        </View>
        <Text style={styles.footerNote}>Nigeria's informal economy, reimagined</Text>
      </View>
    </View>
  );
}

function FeatureItem({ icon, text }: { icon: keyof typeof Feather.glyphMap; text: string }) {
  return (
    <View style={styles.featureItem}>
      <Feather name={icon} size={20} color="#FFFFFF" />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1D9E75", justifyContent: "space-between" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  logoBox: {
    width: 88, height: 88, borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center", marginBottom: 8,
  },
  logoLetter: { fontSize: 52, fontWeight: "900", color: "#FFFFFF", fontFamily: "Inter_700Bold" },
  brand: { fontSize: 40, fontWeight: "900", color: "#FFFFFF", letterSpacing: -1.5, fontFamily: "Inter_700Bold" },
  tagline: { fontSize: 16, color: "rgba(255,255,255,0.85)", fontFamily: "Inter_400Regular", marginTop: 4 },
  footer: { paddingHorizontal: 24 },
  featureRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 20 },
  featureItem: { alignItems: "center", gap: 6 },
  featureText: { fontSize: 11, color: "rgba(255,255,255,0.8)", fontFamily: "Inter_500Medium", textAlign: "center" },
  footerNote: { textAlign: "center", color: "rgba(255,255,255,0.6)", fontSize: 13, fontFamily: "Inter_400Regular", marginBottom: 8 },
});
