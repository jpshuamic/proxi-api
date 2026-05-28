import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const POST_TYPES = [
  {
    id: "product",
    label: "Product or Goods",
    desc: "Sell physical items, electronics, fashion, vehicles, and more",
    icon: "shopping-bag" as const,
    color: "#1D9E75",
    bg: "#E8F8F2",
    badge: "Trader",
  },
  {
    id: "service",
    label: "Skill or Service",
    desc: "Offer professional services — repairs, tutoring, design, and more",
    icon: "tool" as const,
    color: "#7F77DD",
    bg: "#EEEDFE",
    badge: "Skilled",
  },
  {
    id: "task",
    label: "Task or Gig",
    desc: "Post a task and let earners bid for your job",
    icon: "file-text" as const,
    color: "#D85A30",
    bg: "#FAECE7",
    badge: "Buyer",
  },
];

const MY_LISTINGS_PREVIEW = [
  { id: "my1", title: "Nike Air Max 90", price: 45000, status: "Active" },
  { id: "my2", title: "Canon EOS 250D", price: 280000, status: "Active" },
  { id: "my3", title: "2BR Apartment – GRA", price: 450000, status: "Sold" },
];

export default function PostTypeScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Post on Proxi</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>What would you like to post today?</Text>
      </View>

      <View style={styles.cards}>
        {POST_TYPES.map(type => (
          <Pressable
            key={type.id}
            style={({ pressed }) => [styles.card, { backgroundColor: colors.card, opacity: pressed ? 0.9 : 1 }]}
            onPress={() => router.push(`/(tabs)/post/${type.id}` as any)}
          >
            <View style={[styles.iconBox, { backgroundColor: type.bg }]}>
              <Feather name={type.icon} size={28} color={type.color} />
            </View>
            <View style={styles.cardBody}>
              <View style={styles.cardTop}>
                <Text style={[styles.cardLabel, { color: colors.foreground }]}>{type.label}</Text>
                <View style={[styles.badge, { backgroundColor: type.bg }]}>
                  <Text style={[styles.badgeText, { color: type.color }]}>{type.badge}</Text>
                </View>
              </View>
              <Text style={[styles.cardDesc, { color: colors.mutedForeground }]}>{type.desc}</Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.mutedForeground} />
          </Pressable>
        ))}
      </View>

      {/* My listings */}
      <View style={[styles.section, { paddingHorizontal: 20 }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>My Listings</Text>
          <Text style={[styles.seeAll, { color: colors.primary }]}>Manage all</Text>
        </View>
        {MY_LISTINGS_PREVIEW.map(l => (
          <View key={l.id} style={[styles.listingRow, { backgroundColor: colors.card }]}>
            <View style={[styles.listingImg, { backgroundColor: "#E8F8F2" }]}>
              <Feather name="image" size={18} color={colors.mutedForeground} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.listingTitle, { color: colors.foreground }]} numberOfLines={1}>{l.title}</Text>
              <Text style={[styles.listingPrice, { color: colors.primary }]}>₦{l.price.toLocaleString()}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: l.status === "Active" ? "#E8F8F2" : "#F5F5F5" }]}>
              <Text style={[styles.statusText, { color: l.status === "Active" ? "#1D9E75" : "#6B6B6B" }]}>{l.status}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 20, gap: 4 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 15, fontFamily: "Inter_400Regular" },
  cards: { paddingHorizontal: 20, gap: 12, marginBottom: 28 },
  card: { flexDirection: "row", alignItems: "center", gap: 14, padding: 18, borderRadius: 18 },
  iconBox: { width: 58, height: 58, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  cardBody: { flex: 1, gap: 4 },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardLabel: { fontSize: 16, fontFamily: "Inter_700Bold" },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  badgeText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  cardDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
  section: { gap: 12 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  seeAll: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  listingRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, borderRadius: 14 },
  listingImg: { width: 48, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  listingTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  listingPrice: { fontSize: 14, fontFamily: "Inter_700Bold", marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
});
