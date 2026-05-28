import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MY_USER, REVIEWS } from "@/constants/data";
import { useColors } from "@/hooks/useColors";
import { useApp } from "@/context/AppContext";

function TrustRing({ score }: { score: number }) {
  const color = score >= 70 ? "#1D9E75" : score >= 40 ? "#EF9F27" : "#E24B4A";
  return (
    <View style={[tr.ring, { borderColor: color + "33" }]}>
      <View style={[tr.inner, { borderColor: color }]}>
        <Text style={[tr.score, { color }]}>{score}</Text>
        <Text style={tr.label}>/ 100</Text>
      </View>
    </View>
  );
}
const tr = StyleSheet.create({
  ring: { width: 96, height: 96, borderRadius: 48, borderWidth: 8, alignItems: "center", justifyContent: "center" },
  inner: { width: 76, height: 76, borderRadius: 38, borderWidth: 3, alignItems: "center", justifyContent: "center" },
  score: { fontSize: 24, fontFamily: "Inter_700Bold" },
  label: { fontSize: 11, color: "#6B6B6B", fontFamily: "Inter_400Regular" },
});

export default function ProfileScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { logout } = useApp();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const MENU_ITEMS = [
    { icon: "shield" as const, label: "Trust Score", sub: `${MY_USER.score}/100`, onPress: () => router.push("/(tabs)/profile/trust-score" as any) },
    { icon: "credit-card" as const, label: "Wallet", sub: `₦${MY_USER.walletBalance.toLocaleString()}`, onPress: () => router.push("/(tabs)/profile/wallet" as any) },
    { icon: "star" as const, label: "Reviews", sub: `${MY_USER.reviews} reviews`, onPress: () => router.push("/(tabs)/profile/reviews" as any) },
    { icon: "settings" as const, label: "Account Settings", sub: "", onPress: () => {} },
    { icon: "help-circle" as const, label: "Help & Support", sub: "", onPress: () => {} },
    { icon: "flag" as const, label: "Report a Problem", sub: "", onPress: () => {} },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      {/* Header cover */}
      <View style={[styles.cover, { paddingTop: topPad + 16 }]}>
        <TouchableOpacity style={[styles.settingsBtn, { backgroundColor: "rgba(255,255,255,0.2)" }]} onPress={() => {}}>
          <Feather name="settings" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>TA</Text>
          </View>
          <View>
            <Text style={styles.coverName}>{MY_USER.name}</Text>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{MY_USER.type}</Text>
            </View>
          </View>
        </View>

        <View style={styles.verBadges}>
          <VerBadge icon="phone" label="Phone" />
          <VerBadge icon="shield" label="ID" />
          <VerBadge icon="map-pin" label="Address" />
        </View>
      </View>

      {/* Stats + Trust */}
      <View style={[styles.statsCard, { backgroundColor: colors.background }]}>
        <TrustRing score={MY_USER.score} />
        <View style={styles.dividerV} />
        <View style={styles.stats}>
          <StatItem value={String(MY_USER.listings)} label="Listings" />
          <StatItem value={String(MY_USER.completedOrders)} label="Orders" />
          <StatItem value={String(MY_USER.reviews)} label="Reviews" />
        </View>
      </View>

      {/* Recent Reviews */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent reviews</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/profile/reviews" as any)}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>View all</Text>
          </TouchableOpacity>
        </View>
        {REVIEWS.slice(0, 2).map(r => (
          <View key={r.id} style={[styles.reviewCard, { backgroundColor: colors.card }]}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewAvatar}>
                <Text style={styles.reviewInitials}>{r.from[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.reviewName, { color: colors.foreground }]}>{r.from}</Text>
                <Text style={{ fontSize: 12, color: "#EF9F27" }}>{"★".repeat(r.stars)}</Text>
              </View>
              <Text style={[styles.reviewDate, { color: colors.mutedForeground }]}>{r.date}</Text>
            </View>
            <Text style={[styles.reviewComment, { color: colors.mutedForeground }]}>{r.comment}</Text>
          </View>
        ))}
      </View>

      {/* Menu */}
      <View style={[styles.section, { paddingHorizontal: 20 }]}>
        <View style={[styles.menuCard, { backgroundColor: colors.card }]}>
          {MENU_ITEMS.map((item, i) => (
            <View key={item.label}>
              <TouchableOpacity style={styles.menuRow} onPress={item.onPress}>
                <View style={[styles.menuIcon, { backgroundColor: colors.background }]}>
                  <Feather name={item.icon} size={18} color={colors.primary} />
                </View>
                <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
                {item.sub ? <Text style={[styles.menuSub, { color: colors.mutedForeground }]}>{item.sub}</Text> : null}
                <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
              </TouchableOpacity>
              {i < MENU_ITEMS.length - 1 && <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />}
            </View>
          ))}
        </View>
      </View>

      {/* Logout */}
      <View style={[styles.section, { paddingHorizontal: 20 }]}>
        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: "#FCE9E9" }]}
          onPress={() => { logout(); router.replace("/(onboarding)/splash"); }}
        >
          <Feather name="log-out" size={18} color="#E24B4A" />
          <Text style={{ fontSize: 15, color: "#E24B4A", fontFamily: "Inter_600SemiBold" }}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

function VerBadge({ icon, label }: { icon: keyof typeof Feather.glyphMap; label: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(255,255,255,0.25)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
      <Feather name={icon} size={12} color="#FFFFFF" />
      <Text style={{ fontSize: 12, color: "#FFFFFF", fontFamily: "Inter_500Medium" }}>{label}</Text>
    </View>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <View style={{ alignItems: "center", gap: 2 }}>
      <Text style={{ fontSize: 22, fontFamily: "Inter_700Bold", color: "#1A1A1A" }}>{value}</Text>
      <Text style={{ fontSize: 12, fontFamily: "Inter_400Regular", color: "#6B6B6B" }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cover: { backgroundColor: "#1D9E75", paddingHorizontal: 20, paddingBottom: 24, gap: 16, position: "relative" },
  settingsBtn: { position: "absolute", top: 16, right: 20, width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  avatarSection: { flexDirection: "row", alignItems: "center", gap: 16, paddingTop: 24 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "rgba(255,255,255,0.4)" },
  avatarText: { fontSize: 24, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  coverName: { fontSize: 22, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  typeBadge: { backgroundColor: "rgba(255,255,255,0.25)", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, alignSelf: "flex-start", marginTop: 4 },
  typeText: { fontSize: 12, color: "#FFFFFF", fontFamily: "Inter_600SemiBold" },
  verBadges: { flexDirection: "row", gap: 8 },
  statsCard: { flexDirection: "row", alignItems: "center", paddingVertical: 20, paddingHorizontal: 24, gap: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  dividerV: { width: 1, height: 60, backgroundColor: "#E0E0E0" },
  stats: { flex: 1, flexDirection: "row", justifyContent: "space-around" },
  section: { marginBottom: 20 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  seeAll: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  reviewCard: { marginHorizontal: 20, borderRadius: 16, padding: 16, gap: 10, marginBottom: 10 },
  reviewHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  reviewAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#E8F8F2", alignItems: "center", justifyContent: "center" },
  reviewInitials: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#1D9E75" },
  reviewName: { fontSize: 14, fontFamily: "Inter_700Bold" },
  reviewDate: { fontSize: 12, fontFamily: "Inter_400Regular" },
  reviewComment: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
  menuCard: { borderRadius: 18, overflow: "hidden" },
  menuRow: { flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 16, paddingVertical: 14 },
  menuIcon: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  menuLabel: { flex: 1, fontSize: 15, fontFamily: "Inter_500Medium" },
  menuSub: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  menuDivider: { height: 1, marginLeft: 68 },
  logoutBtn: { height: 52, borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
});
