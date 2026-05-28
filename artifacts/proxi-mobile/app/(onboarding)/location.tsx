import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LocationPermissionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { paddingTop: topPad + 16, paddingBottom: botPad + 24 }]}>
      <View style={styles.visual}>
        <View style={styles.mapCircle}>
          <View style={styles.mapOuter}>
            <View style={styles.mapInner}>
              <Feather name="map-pin" size={36} color="#1D9E75" />
            </View>
          </View>
          <View style={[styles.dot, { top: 20, right: 30 }]} />
          <View style={[styles.dot, styles.dotSmall, { bottom: 30, left: 20 }]} />
          <View style={[styles.dot, styles.dotTiny, { top: 60, left: 40 }]} />
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>Enable your location</Text>
        <Text style={styles.desc}>
          Proxi connects you to buyers and sellers within your neighbourhood. Your exact location is never shared publicly — only your general area (e.g. "Ikeja, Lagos") is shown.
        </Text>

        <View style={styles.benefits}>
          <BenefitRow icon="navigation" text="See listings near you first" />
          <BenefitRow icon="users" text="Connect with local traders" />
          <BenefitRow icon="lock" text="Exact GPS never shared" />
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.push("/(onboarding)/profile-setup")}
        >
          <Feather name="map-pin" size={18} color="#FFFFFF" />
          <Text style={styles.btnText}>Allow location</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => router.push("/(onboarding)/profile-setup")}
        >
          <Text style={styles.skipText}>Set manually instead</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function BenefitRow({ icon, text }: { icon: keyof typeof Feather.glyphMap; text: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <View style={styles.benefitIcon}>
        <Feather name={icon} size={16} color="#1D9E75" />
      </View>
      <Text style={styles.benefitText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", paddingHorizontal: 24, justifyContent: "space-between" },
  visual: { flex: 1, alignItems: "center", justifyContent: "center" },
  mapCircle: { width: 200, height: 200, position: "relative", alignItems: "center", justifyContent: "center" },
  mapOuter: { width: 160, height: 160, borderRadius: 80, backgroundColor: "#E8F8F2", alignItems: "center", justifyContent: "center" },
  mapInner: { width: 90, height: 90, borderRadius: 45, backgroundColor: "#D0F0E6", alignItems: "center", justifyContent: "center" },
  dot: { position: "absolute", width: 16, height: 16, borderRadius: 8, backgroundColor: "#1D9E75" },
  dotSmall: { width: 12, height: 12, borderRadius: 6, opacity: 0.6 },
  dotTiny: { width: 8, height: 8, borderRadius: 4, opacity: 0.4 },
  body: { gap: 16 },
  title: { fontSize: 26, fontWeight: "800", color: "#1A1A1A", fontFamily: "Inter_700Bold" },
  desc: { fontSize: 15, color: "#6B6B6B", fontFamily: "Inter_400Regular", lineHeight: 22 },
  benefits: { gap: 12, marginTop: 8 },
  benefitIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#E8F8F2", alignItems: "center", justifyContent: "center" },
  benefitText: { fontSize: 14, color: "#1A1A1A", fontFamily: "Inter_500Medium" },
  actions: { gap: 12 },
  btn: { height: 54, backgroundColor: "#1D9E75", borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  btnText: { fontSize: 16, fontWeight: "700", color: "#FFFFFF", fontFamily: "Inter_700Bold" },
  skipBtn: { height: 44, alignItems: "center", justifyContent: "center" },
  skipText: { fontSize: 15, color: "#6B6B6B", fontFamily: "Inter_500Medium" },
});
