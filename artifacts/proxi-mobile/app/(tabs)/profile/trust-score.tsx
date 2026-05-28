import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MY_USER } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

const SCORE_ITEMS = [
  { label: "Phone verified", points: 20, done: true, icon: "phone" as const },
  { label: "ID verified", points: 25, done: true, icon: "shield" as const },
  { label: "First transaction completed", points: 15, done: true, icon: "check-circle" as const },
  { label: "5-star review received", points: 10, done: true, icon: "star" as const },
  { label: "Profile complete", points: 8, done: true, icon: "user" as const },
  { label: "Address verified", points: 12, done: false, icon: "map-pin" as const },
  { label: "10 successful orders", points: 10, done: false, icon: "shopping-bag" as const },
];

export default function TrustScoreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const score = MY_USER.score;
  const scoreColor = score >= 70 ? "#1D9E75" : score >= 40 ? "#EF9F27" : "#E24B4A";
  const earnedPoints = SCORE_ITEMS.filter(i => i.done).reduce((s, i) => s + i.points, 0);
  const totalPoints = SCORE_ITEMS.reduce((s, i) => s + i.points, 0);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      {/* Score hero */}
      <View style={[styles.hero, { backgroundColor: scoreColor + "12" }]}>
        <View style={[styles.scoreRing, { borderColor: scoreColor }]}>
          <Text style={[styles.scoreNum, { color: scoreColor }]}>{score}</Text>
          <Text style={styles.scoreMax}>/ 100</Text>
        </View>
        <Text style={[styles.heroTitle, { color: colors.foreground }]}>Your Trust Score</Text>
        <Text style={[styles.heroSub, { color: colors.mutedForeground }]}>
          {score >= 70 ? "Excellent — buyers trust you highly" : score >= 40 ? "Good — keep improving" : "Needs improvement"}
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${score}%`, backgroundColor: scoreColor }]} />
        </View>
        <Text style={[styles.pointsSub, { color: colors.mutedForeground }]}>{earnedPoints} of {totalPoints} points earned</Text>
      </View>

      {/* Breakdown */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Score breakdown</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {SCORE_ITEMS.map((item, i) => (
            <View key={item.label}>
              <View style={styles.itemRow}>
                <View style={[styles.iconBox, { backgroundColor: item.done ? scoreColor + "18" : colors.background }]}>
                  <Feather name={item.icon} size={16} color={item.done ? scoreColor : colors.mutedForeground} />
                </View>
                <Text style={[styles.itemLabel, { color: item.done ? colors.foreground : colors.mutedForeground, flex: 1 }]}>
                  {item.label}
                </Text>
                <Text style={[styles.itemPoints, { color: item.done ? scoreColor : colors.mutedForeground }]}>
                  {item.done ? "+" : ""}{item.points} pts
                </Text>
                {item.done
                  ? <Feather name="check-circle" size={18} color={scoreColor} />
                  : <Feather name="circle" size={18} color={colors.border} />}
              </View>
              {i < SCORE_ITEMS.length - 1 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
            </View>
          ))}
        </View>
      </View>

      {/* How is it calculated */}
      <View style={[styles.section, { marginBottom: 40 }]}>
        <View style={[styles.infoBox, { backgroundColor: colors.card }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <Feather name="info" size={16} color={colors.primary} />
            <Text style={[styles.infoTitle, { color: colors.foreground }]}>How is my score calculated?</Text>
          </View>
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
            Your trust score is based on verified identity checks, transaction history, and community reviews. The higher your score, the more visible your listings are in search results.
          </Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: { alignItems: "center", paddingVertical: 36, paddingHorizontal: 20, gap: 10 },
  scoreRing: { width: 120, height: 120, borderRadius: 60, borderWidth: 8, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  scoreNum: { fontSize: 44, fontFamily: "Inter_700Bold" },
  scoreMax: { fontSize: 14, color: "#6B6B6B", fontFamily: "Inter_400Regular" },
  heroTitle: { fontSize: 22, fontFamily: "Inter_700Bold" },
  heroSub: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center" },
  progressBar: { width: "100%", height: 8, backgroundColor: "#E0E0E0", borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4 },
  pointsSub: { fontSize: 13, fontFamily: "Inter_400Regular" },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold", marginBottom: 12 },
  card: { borderRadius: 16, overflow: "hidden" },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  iconBox: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  itemLabel: { fontSize: 14, fontFamily: "Inter_500Medium" },
  itemPoints: { fontSize: 13, fontFamily: "Inter_700Bold" },
  divider: { height: 1, marginLeft: 66 },
  infoBox: { borderRadius: 16, padding: 16 },
  infoTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  infoText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
});
