import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TYPES = [
  {
    id: "Trader" as const,
    label: "Trader",
    description: "Sell goods, products or vehicles",
    icon: "shopping-bag" as const,
    color: "#1D9E75",
  },
  {
    id: "Skilled" as const,
    label: "Skilled Worker",
    description: "Offer professional services",
    icon: "tool" as const,
    color: "#7F77DD",
  },
  {
    id: "Earner" as const,
    label: "Earner",
    description: "Complete tasks and gigs for income",
    icon: "zap" as const,
    color: "#D85A30",
  },
];

export default function UserTypeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { paddingTop: topPad + 16, paddingBottom: botPad + 24 }]}>
      <View style={styles.header}>
        <Text style={styles.title}>What best describes you?</Text>
        <Text style={styles.subtitle}>You can always change this later in your profile settings</Text>
      </View>

      <View style={styles.cards}>
        {TYPES.map((t) => {
          const active = selected === t.id;
          return (
            <Pressable
              key={t.id}
              style={[styles.card, active && { borderColor: t.color, backgroundColor: t.color + "08" }]}
              onPress={() => setSelected(t.id)}
            >
              <View style={[styles.iconBox, { backgroundColor: t.color + "18" }]}>
                <Feather name={t.icon} size={26} color={t.color} />
              </View>
              <View style={styles.cardBody}>
                <Text style={[styles.cardTitle, active && { color: t.color }]}>{t.label}</Text>
                <Text style={styles.cardDesc}>{t.description}</Text>
              </View>
              <View style={[styles.radio, active && { borderColor: t.color }]}>
                {active && <View style={[styles.radioDot, { backgroundColor: t.color }]} />}
              </View>
            </Pressable>
          );
        })}
      </View>

      <TouchableOpacity
        style={[styles.btn, !selected && styles.btnDisabled]}
        onPress={() => router.push("/(onboarding)/location")}
        disabled={!selected}
      >
        <Text style={styles.btnText}>Continue</Text>
        <Feather name="arrow-right" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", paddingHorizontal: 24, gap: 32 },
  header: { gap: 8 },
  title: { fontSize: 26, fontWeight: "800", color: "#1A1A1A", fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 14, color: "#6B6B6B", fontFamily: "Inter_400Regular", lineHeight: 20 },
  cards: { gap: 14 },
  card: {
    flexDirection: "row", alignItems: "center", gap: 16,
    backgroundColor: "#F5F5F5", borderRadius: 16,
    padding: 18, borderWidth: 2, borderColor: "transparent",
  },
  iconBox: { width: 52, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  cardBody: { flex: 1, gap: 3 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#1A1A1A", fontFamily: "Inter_700Bold" },
  cardDesc: { fontSize: 13, color: "#6B6B6B", fontFamily: "Inter_400Regular" },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: "#E0E0E0", alignItems: "center", justifyContent: "center" },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  btn: { height: 54, backgroundColor: "#1D9E75", borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  btnDisabled: { opacity: 0.4 },
  btnText: { fontSize: 16, fontWeight: "700", color: "#FFFFFF", fontFamily: "Inter_700Bold" },
});
