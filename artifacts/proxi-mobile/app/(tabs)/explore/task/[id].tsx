import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TASKS } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

function TrustBadge({ score }: { score: number }) {
  const color = score >= 70 ? "#1D9E75" : score >= 40 ? "#EF9F27" : "#E24B4A";
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: color + "18" }}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color }} />
      <Text style={{ fontSize: 12, fontFamily: "Inter_600SemiBold", color }}>{score}/100</Text>
    </View>
  );
}

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [applied, setApplied] = useState(false);
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const task = TASKS.find(t => t.id === id);
  if (!task) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: colors.mutedForeground }}>Task not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold" }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const urgencyColor = task.urgency === "High" ? "#E24B4A" : task.urgency === "Medium" ? "#EF9F27" : "#1D9E75";

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: "#EEEDFE" }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={20} color="#7F77DD" />
          </TouchableOpacity>
          <View style={styles.heroIcon}>
            <Feather name="file-text" size={40} color="#7F77DD" />
          </View>
          <View style={[styles.urgencyBadge, { backgroundColor: urgencyColor }]}>
            <Text style={styles.urgencyText}>{task.urgency} Priority</Text>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.budgetRow}>
            <Text style={[styles.budget, { color: "#7F77DD" }]}>
              ₦{task.budget.toLocaleString()} <Text style={styles.budgetType}>· {task.budgetType}</Text>
            </Text>
            <View style={[styles.chip, { backgroundColor: colors.card }]}>
              <Feather name={task.remote ? "wifi" : "map-pin"} size={12} color={colors.mutedForeground} />
              <Text style={[styles.chipText, { color: colors.mutedForeground }]}>{task.remote ? "Remote" : "On-site"}</Text>
            </View>
          </View>

          <Text style={[styles.title, { color: colors.foreground }]}>{task.title}</Text>

          <View style={styles.infoGrid}>
            <InfoChip icon="map-pin" text={task.location} />
            <InfoChip icon="clock" text={`Due in ${task.deadline}`} />
            <InfoChip icon="tag" text={task.category} />
            <InfoChip icon="calendar" text={task.createdAt} />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Task description</Text>
            <Text style={[styles.desc, { color: colors.mutedForeground }]}>{task.description}</Text>
          </View>

          <View style={[styles.posterCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.posterLabel, { color: colors.mutedForeground }]}>Posted by</Text>
            <View style={styles.posterRow}>
              <View style={styles.posterAvatar}>
                <Text style={styles.posterInitials}>
                  {task.poster.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.posterName, { color: colors.foreground }]}>{task.poster.name}</Text>
                <Text style={[styles.posterMember, { color: colors.mutedForeground }]}>Member since {task.poster.memberSince}</Text>
              </View>
              <TrustBadge score={task.poster.score} />
            </View>
          </View>

          <View style={[styles.escrowInfo, { backgroundColor: "#E8F8F2" }]}>
            <Feather name="shield" size={16} color="#1D9E75" />
            <Text style={styles.escrowText}>Payment held in escrow until task is approved</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: botPad + 12, backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.applyBtn, { backgroundColor: applied ? colors.card : "#7F77DD" }]}
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setApplied(true);
          }}
          disabled={applied}
        >
          <Feather name={applied ? "check" : "send"} size={18} color={applied ? "#7F77DD" : "#FFFFFF"} />
          <Text style={[styles.applyText, { color: applied ? "#7F77DD" : "#FFFFFF" }]}>
            {applied ? "Application Sent!" : "Apply for this Task"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function InfoChip({ icon, text }: { icon: keyof typeof Feather.glyphMap; text: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#F5F5F5", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10 }}>
      <Feather name={icon} size={12} color="#6B6B6B" />
      <Text style={{ fontSize: 12, color: "#6B6B6B", fontFamily: "Inter_400Regular" }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { height: 200, alignItems: "center", justifyContent: "center", position: "relative" },
  backBtn: { position: "absolute", top: 16, left: 16, width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.8)", alignItems: "center", justifyContent: "center" },
  heroIcon: { width: 80, height: 80, borderRadius: 24, backgroundColor: "rgba(127,119,221,0.2)", alignItems: "center", justifyContent: "center" },
  urgencyBadge: { position: "absolute", bottom: 14, right: 16, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  urgencyText: { fontSize: 12, color: "#FFFFFF", fontFamily: "Inter_600SemiBold" },
  body: { paddingHorizontal: 20, paddingTop: 20, gap: 18 },
  budgetRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  budget: { fontSize: 26, fontFamily: "Inter_700Bold" },
  budgetType: { fontSize: 14, fontFamily: "Inter_400Regular", color: "#6B6B6B" },
  chip: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  chipText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  title: { fontSize: 20, fontFamily: "Inter_700Bold", lineHeight: 26 },
  infoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  section: { gap: 8 },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  desc: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  posterCard: { padding: 16, borderRadius: 16, gap: 10 },
  posterLabel: { fontSize: 12, fontFamily: "Inter_500Medium", textTransform: "uppercase", letterSpacing: 0.5 },
  posterRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  posterAvatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: "#EEEDFE", alignItems: "center", justifyContent: "center" },
  posterInitials: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#7F77DD" },
  posterName: { fontSize: 15, fontFamily: "Inter_700Bold" },
  posterMember: { fontSize: 12, fontFamily: "Inter_400Regular" },
  escrowInfo: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderRadius: 12 },
  escrowText: { flex: 1, fontSize: 13, color: "#1D9E75", fontFamily: "Inter_500Medium", lineHeight: 18 },
  bottomBar: { paddingHorizontal: 20, paddingTop: 12, borderTopWidth: 1 },
  applyBtn: { height: 54, borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  applyText: { fontSize: 16, fontFamily: "Inter_700Bold" },
});
