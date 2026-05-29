import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TASKS } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

function trustLabel(score: number) {
  if (score >= 80) return { label: "Excellent", color: "#1D9E75" };
  if (score >= 60) return { label: "Good", color: "#1D9E75" };
  if (score >= 40) return { label: "Average", color: "#EF9F27" };
  return { label: "Poor", color: "#E24B4A" };
}

function TrustBadge({ score }: { score: number }) {
  const { label, color } = trustLabel(score);
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, backgroundColor: color + "15" }}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color }} />
      <Text style={{ fontSize: 12, fontFamily: "Inter_700Bold", color }}>{score}/100</Text>
      <View style={{ width: 1, height: 12, backgroundColor: color + "40" }} />
      <Text style={{ fontSize: 11, fontFamily: "Inter_500Medium", color }}>{label}</Text>
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

// Fake applicant counts per task
const APPLICANT_COUNTS: Record<string, number> = {
  t1: 4, t2: 11, t3: 2, t4: 7, t5: 18, t6: 3, t7: 9, t8: 5,
};

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [applied, setApplied] = useState(false);
  const [questionSent, setQuestionSent] = useState(false);

  const task = TASKS.find(t => t.id === id);
  const topPad = Platform.OS === "web" ? 20 : insets.top;
  const tabBarH = Platform.OS === "web" ? 84 : 58 + insets.bottom;
  const applicants = APPLICANT_COUNTS[id ?? ""] ?? Math.floor(Math.random() * 12) + 1;

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
  const isFixed = task.budgetType === "Fixed";

  // Milestone suggestion for fixed-price tasks
  const milestone1 = Math.round(task.budget * 0.5);
  const milestone2 = task.budget - milestone1;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: tabBarH + 90 }}
      >
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: "#EEEDFE" }]}>
          {/* Single back button — no system header */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backBtn, { top: topPad + 10 }]}
          >
            <Feather name="arrow-left" size={20} color="#7F77DD" />
          </TouchableOpacity>

          <View style={styles.heroIcon}>
            <Feather name="file-text" size={40} color="#7F77DD" />
          </View>

          <View style={[styles.urgencyBadge, { backgroundColor: urgencyColor }]}>
            <Text style={styles.urgencyText}>{task.urgency} Priority</Text>
          </View>

          {/* Applicant count — urgency signal */}
          <View style={styles.applicantBadge}>
            <Feather name="users" size={12} color="#7F77DD" />
            <Text style={styles.applicantText}>
              {applicants} {applicants === 1 ? "person has" : "people have"} applied
            </Text>
          </View>
        </View>

        <View style={styles.body}>
          {/* Budget row */}
          <View style={styles.budgetRow}>
            <Text style={[styles.budget, { color: "#7F77DD" }]}>
              ₦{task.budget.toLocaleString()}{" "}
              <Text style={styles.budgetType}>· {task.budgetType}</Text>
            </Text>
            <View style={[styles.chip, { backgroundColor: colors.card }]}>
              <Feather name={task.remote ? "wifi" : "map-pin"} size={12} color={colors.mutedForeground} />
              <Text style={[styles.chipText, { color: colors.mutedForeground }]}>
                {task.remote ? "Remote possible" : "On-site"}
              </Text>
            </View>
          </View>

          <Text style={[styles.title, { color: colors.foreground }]}>{task.title}</Text>

          {/* Info chips */}
          <View style={styles.infoGrid}>
            <InfoChip icon="map-pin" text={task.location} />
            <InfoChip icon="clock" text={`Due in ${task.deadline}`} />
            <InfoChip icon="tag" text={task.category} />
            <InfoChip icon="calendar" text={task.createdAt} />
          </View>

          {/* Remote clarification */}
          {task.remote && (
            <View style={[styles.infoBanner, { backgroundColor: "#E8F8F2", borderColor: "#1D9E7530" }]}>
              <Feather name="info" size={14} color="#1D9E75" />
              <Text style={{ flex: 1, fontSize: 13, color: "#1D9E75", fontFamily: "Inter_400Regular", lineHeight: 18 }}>
                Remote work is welcome, but the client is based in <Text style={{ fontFamily: "Inter_700Bold" }}>{task.location}</Text>. Meetings may be required.
              </Text>
            </View>
          )}

          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Task description</Text>
            <Text style={[styles.desc, { color: colors.mutedForeground }]}>{task.description}</Text>
          </View>

          {/* Milestone suggestion for fixed-price tasks */}
          {isFixed && (
            <View style={[styles.milestoneCard, { backgroundColor: "#EEEDFE" }]}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Feather name="layers" size={15} color="#7F77DD" />
                <Text style={{ fontSize: 14, fontFamily: "Inter_700Bold", color: "#7F77DD" }}>Suggested milestones</Text>
              </View>
              <View style={styles.milestoneRow}>
                <View style={[styles.milestonePill, { backgroundColor: "rgba(127,119,221,0.12)" }]}>
                  <Text style={styles.milestoneNum}>1</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.milestoneLabel}>First deliverable</Text>
                    <Text style={styles.milestoneAmt}>₦{milestone1.toLocaleString()}</Text>
                  </View>
                </View>
                <View style={[styles.milestonePill, { backgroundColor: "rgba(127,119,221,0.12)" }]}>
                  <Text style={styles.milestoneNum}>2</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.milestoneLabel}>Final delivery</Text>
                    <Text style={styles.milestoneAmt}>₦{milestone2.toLocaleString()}</Text>
                  </View>
                </View>
              </View>
              <Text style={{ fontSize: 11, color: "#7F77DD", fontFamily: "Inter_400Regular", marginTop: 8, opacity: 0.8 }}>
                Milestones protect both parties — negotiate with the poster
              </Text>
            </View>
          )}

          {/* Poster card */}
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

          {/* Ask a question */}
          <TouchableOpacity
            style={[styles.questionBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setQuestionSent(true);
            }}
          >
            <Feather name="help-circle" size={16} color={questionSent ? "#1D9E75" : colors.mutedForeground} />
            <Text style={{ fontSize: 14, fontFamily: "Inter_600SemiBold", color: questionSent ? "#1D9E75" : colors.foreground }}>
              {questionSent ? "Question sent!" : "Ask a question publicly"}
            </Text>
          </TouchableOpacity>

          {/* Escrow info */}
          <View style={[styles.escrowInfo, { backgroundColor: "#E8F8F2" }]}>
            <Feather name="shield" size={16} color="#1D9E75" />
            <Text style={styles.escrowText}>Payment held in escrow until task is approved</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom bar — above tab bar */}
      <View style={[styles.bottomBar, {
        bottom: tabBarH,
        backgroundColor: colors.background,
        borderTopColor: colors.border,
      }]}>
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

const styles = StyleSheet.create({
  hero: { height: 220, alignItems: "center", justifyContent: "center", position: "relative" },
  backBtn: { position: "absolute", left: 16, width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.85)", alignItems: "center", justifyContent: "center" },
  heroIcon: { width: 80, height: 80, borderRadius: 24, backgroundColor: "rgba(127,119,221,0.2)", alignItems: "center", justifyContent: "center" },
  urgencyBadge: { position: "absolute", bottom: 40, right: 16, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  urgencyText: { fontSize: 12, color: "#FFFFFF", fontFamily: "Inter_600SemiBold" },
  applicantBadge: { position: "absolute", bottom: 12, left: 16, flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "rgba(127,119,221,0.15)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  applicantText: { fontSize: 12, color: "#7F77DD", fontFamily: "Inter_600SemiBold" },
  body: { paddingHorizontal: 20, paddingTop: 20, gap: 18 },
  budgetRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  budget: { fontSize: 26, fontFamily: "Inter_700Bold" },
  budgetType: { fontSize: 14, fontFamily: "Inter_400Regular", color: "#6B6B6B" },
  chip: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  chipText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  title: { fontSize: 20, fontFamily: "Inter_700Bold", lineHeight: 26 },
  infoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  infoBanner: { flexDirection: "row", alignItems: "flex-start", gap: 8, padding: 12, borderRadius: 12, borderWidth: 1 },
  section: { gap: 8 },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  desc: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  milestoneCard: { borderRadius: 16, padding: 16 },
  milestoneRow: { gap: 8 },
  milestonePill: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12, borderRadius: 12 },
  milestoneNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: "#7F77DD", textAlign: "center", lineHeight: 24, fontSize: 12, color: "#FFFFFF", fontFamily: "Inter_700Bold" },
  milestoneLabel: { fontSize: 12, fontFamily: "Inter_500Medium", color: "#7F77DD" },
  milestoneAmt: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#7F77DD" },
  posterCard: { padding: 16, borderRadius: 16, gap: 10 },
  posterLabel: { fontSize: 12, fontFamily: "Inter_500Medium", textTransform: "uppercase", letterSpacing: 0.5 },
  posterRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  posterAvatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: "#EEEDFE", alignItems: "center", justifyContent: "center" },
  posterInitials: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#7F77DD" },
  posterName: { fontSize: 15, fontFamily: "Inter_700Bold" },
  posterMember: { fontSize: 12, fontFamily: "Inter_400Regular" },
  questionBtn: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderRadius: 14, borderWidth: 1.5 },
  escrowInfo: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderRadius: 12 },
  escrowText: { flex: 1, fontSize: 13, color: "#1D9E75", fontFamily: "Inter_500Medium", lineHeight: 18 },
  bottomBar: { position: "absolute", left: 0, right: 0, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12, borderTopWidth: 1 },
  applyBtn: { height: 54, borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  applyText: { fontSize: 16, fontFamily: "Inter_700Bold" },
});
