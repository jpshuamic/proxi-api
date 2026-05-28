import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { REVIEWS } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

export default function ReviewsScreen() {
  const colors = useColors();
  const [tab, setTab] = useState<"Received" | "Given">("Received");
  const avgRating = REVIEWS.reduce((s, r) => s + r.stars, 0) / REVIEWS.length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Rating summary */}
      <View style={[styles.summary, { backgroundColor: colors.card }]}>
        <View style={styles.ratingBig}>
          <Text style={[styles.avgNum, { color: colors.foreground }]}>{avgRating.toFixed(1)}</Text>
          <Text style={styles.stars}>{"★".repeat(Math.round(avgRating))}</Text>
          <Text style={[styles.totalRev, { color: colors.mutedForeground }]}>{REVIEWS.length} reviews</Text>
        </View>
        <View style={styles.barsSection}>
          {[5, 4, 3, 2, 1].map(star => {
            const count = REVIEWS.filter(r => r.stars === star).length;
            const pct = (count / REVIEWS.length) * 100;
            return (
              <View key={star} style={styles.barRow}>
                <Text style={[styles.barLabel, { color: colors.mutedForeground }]}>{star}</Text>
                <View style={[styles.barBg, { backgroundColor: colors.border }]}>
                  <View style={[styles.barFill, { width: `${pct}%` }]} />
                </View>
                <Text style={[styles.barCount, { color: colors.mutedForeground }]}>{count}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Tabs */}
      <View style={[styles.tabBar, { backgroundColor: colors.card }]}>
        {(["Received", "Given"] as const).map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tabItem, tab === t && { backgroundColor: "#FFFFFF", borderRadius: 10 }]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, { color: tab === t ? colors.foreground : colors.mutedForeground }]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={tab === "Received" ? REVIEWS : []}
        keyExtractor={r => r.id}
        contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 80 }}
        scrollEnabled
        renderItem={({ item: r }) => (
          <View style={[styles.reviewCard, { backgroundColor: colors.card }]}>
            <View style={styles.reviewHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{r.from[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.reviewerName, { color: colors.foreground }]}>{r.from}</Text>
                <Text style={styles.reviewStars}>{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</Text>
              </View>
              <Text style={[styles.reviewDate, { color: colors.mutedForeground }]}>{r.date}</Text>
            </View>
            <Text style={[styles.comment, { color: colors.mutedForeground }]}>{r.comment}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingTop: 40, gap: 12 }}>
            <View style={{ width: 60, height: 60, borderRadius: 20, backgroundColor: colors.card, alignItems: "center", justifyContent: "center" }}>
              <Feather name="star" size={24} color={colors.mutedForeground} />
            </View>
            <Text style={{ fontSize: 16, fontFamily: "Inter_600SemiBold", color: colors.foreground }}>No reviews given yet</Text>
            <Text style={{ fontSize: 14, color: colors.mutedForeground, fontFamily: "Inter_400Regular", textAlign: "center" }}>
              Complete transactions to leave reviews for sellers
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  summary: { margin: 16, borderRadius: 16, padding: 16, flexDirection: "row", gap: 20 },
  ratingBig: { alignItems: "center", gap: 4 },
  avgNum: { fontSize: 40, fontFamily: "Inter_700Bold" },
  stars: { fontSize: 18, color: "#EF9F27" },
  totalRev: { fontSize: 12, fontFamily: "Inter_400Regular" },
  barsSection: { flex: 1, gap: 5, justifyContent: "center" },
  barRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  barLabel: { width: 12, fontSize: 12, fontFamily: "Inter_500Medium", textAlign: "right" },
  barBg: { flex: 1, height: 6, borderRadius: 3, overflow: "hidden" },
  barFill: { height: "100%", backgroundColor: "#EF9F27", borderRadius: 3 },
  barCount: { width: 16, fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "right" },
  tabBar: { marginHorizontal: 16, borderRadius: 14, padding: 4, flexDirection: "row", marginBottom: 4 },
  tabItem: { flex: 1, paddingVertical: 10, alignItems: "center", justifyContent: "center" },
  tabText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  reviewCard: { borderRadius: 16, padding: 16, gap: 10 },
  reviewHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#E8F8F2", alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#1D9E75" },
  reviewerName: { fontSize: 14, fontFamily: "Inter_700Bold" },
  reviewStars: { fontSize: 13, color: "#EF9F27", marginTop: 1 },
  reviewDate: { fontSize: 12, fontFamily: "Inter_400Regular" },
  comment: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
});
