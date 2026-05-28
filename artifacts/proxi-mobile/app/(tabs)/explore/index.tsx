import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList, Platform, Pressable, RefreshControl,
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LISTINGS, TASKS, type Listing, type Task } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

const CATEGORIES = ["All", "Goods", "Vehicles", "Services", "Tasks", "Wholesale"];

function TrustBadge({ score }: { score: number }) {
  const color = score >= 70 ? "#1D9E75" : score >= 40 ? "#EF9F27" : "#E24B4A";
  return (
    <View style={[sb.badge, { backgroundColor: color + "18" }]}>
      <View style={[sb.dot, { backgroundColor: color }]} />
      <Text style={[sb.text, { color }]}>{score}</Text>
    </View>
  );
}
const sb = StyleSheet.create({
  badge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
});

function ListingCard({ item, onPress }: { item: Listing; onPress: () => void }) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [lc.card, { backgroundColor: colors.card, opacity: pressed ? 0.9 : 1 }]}
    >
      <View style={lc.imgPlaceholder}>
        <Feather name="image" size={32} color={colors.mutedForeground} />
        <View style={lc.categoryBadge}>
          <Text style={lc.categoryText}>{item.category}</Text>
        </View>
      </View>
      <View style={lc.body}>
        <Text style={[lc.title, { color: colors.foreground }]} numberOfLines={2}>{item.title}</Text>
        <Text style={lc.price}>₦{item.price.toLocaleString()}</Text>
        {item.negotiable && <Text style={lc.negotiable}>Negotiable</Text>}
        <View style={lc.footer}>
          <View style={lc.loc}>
            <Feather name="map-pin" size={11} color={colors.mutedForeground} />
            <Text style={[lc.locText, { color: colors.mutedForeground }]}>{item.distance}</Text>
          </View>
          <TrustBadge score={item.seller.score} />
        </View>
      </View>
    </Pressable>
  );
}
const lc = StyleSheet.create({
  card: { width: 180, borderRadius: 16, overflow: "hidden", marginRight: 12 },
  imgPlaceholder: { height: 130, backgroundColor: "#E8F8F2", alignItems: "center", justifyContent: "center" },
  categoryBadge: { position: "absolute", top: 8, left: 8, backgroundColor: "rgba(29,158,117,0.9)", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  categoryText: { fontSize: 10, color: "#FFFFFF", fontFamily: "Inter_600SemiBold" },
  body: { padding: 12, gap: 4 },
  title: { fontSize: 13, fontFamily: "Inter_600SemiBold", lineHeight: 18 },
  price: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#1D9E75" },
  negotiable: { fontSize: 10, color: "#EF9F27", fontFamily: "Inter_500Medium" },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 },
  loc: { flexDirection: "row", alignItems: "center", gap: 3 },
  locText: { fontSize: 11, fontFamily: "Inter_400Regular" },
});

function TaskCard({ item, onPress }: { item: Task; onPress: () => void }) {
  const colors = useColors();
  const urgencyColor = item.urgency === "High" ? "#E24B4A" : item.urgency === "Medium" ? "#EF9F27" : "#1D9E75";
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [tc.card, { backgroundColor: colors.card, opacity: pressed ? 0.9 : 1 }]}
    >
      <View style={tc.row}>
        <View style={tc.iconBox}>
          <Feather name="file-text" size={20} color="#7F77DD" />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={[tc.title, { color: colors.foreground }]} numberOfLines={2}>{item.title}</Text>
          <Text style={tc.budget}>₦{item.budget.toLocaleString()} · {item.budgetType}</Text>
        </View>
      </View>
      <View style={tc.footer}>
        <View style={[tc.urgency, { backgroundColor: urgencyColor + "18" }]}>
          <Text style={[tc.urgencyText, { color: urgencyColor }]}>{item.urgency}</Text>
        </View>
        <View style={tc.loc}>
          <Feather name="map-pin" size={11} color={colors.mutedForeground} />
          <Text style={[tc.locText, { color: colors.mutedForeground }]}>{item.location}</Text>
        </View>
      </View>
    </Pressable>
  );
}
const tc = StyleSheet.create({
  card: { width: 240, borderRadius: 16, padding: 16, marginRight: 12, gap: 12 },
  row: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  iconBox: { width: 42, height: 42, borderRadius: 12, backgroundColor: "#EEEDFE", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 14, fontFamily: "Inter_600SemiBold", lineHeight: 19 },
  budget: { fontSize: 13, fontFamily: "Inter_700Bold", color: "#7F77DD" },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  urgency: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  urgencyText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  loc: { flexDirection: "row", alignItems: "center", gap: 3 },
  locText: { fontSize: 11, fontFamily: "Inter_400Regular" },
});

function TraderCard({ seller }: { seller: Listing["seller"] }) {
  const colors = useColors();
  const initials = seller.name.split(" ").map(n => n[0]).join("").slice(0, 2);
  return (
    <View style={[trc.card, { backgroundColor: colors.card }]}>
      <View style={trc.avatar}>
        <Text style={trc.initials}>{initials}</Text>
      </View>
      <Text style={[trc.name, { color: colors.foreground }]} numberOfLines={1}>{seller.name.split(" ")[0]}</Text>
      <TrustBadge score={seller.score} />
      {seller.verified && (
        <View style={trc.verified}>
          <Feather name="check-circle" size={10} color="#1D9E75" />
          <Text style={trc.verifiedText}>Verified</Text>
        </View>
      )}
    </View>
  );
}
const trc = StyleSheet.create({
  card: { width: 100, borderRadius: 16, padding: 12, alignItems: "center", gap: 6, marginRight: 10 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#E8F8F2", alignItems: "center", justifyContent: "center" },
  initials: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#1D9E75" },
  name: { fontSize: 12, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  verified: { flexDirection: "row", alignItems: "center", gap: 3 },
  verifiedText: { fontSize: 10, color: "#1D9E75", fontFamily: "Inter_400Regular" },
});

export default function ExploreHome() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const filteredListings = LISTINGS.filter(l =>
    (cat === "All" || l.category.toLowerCase().includes(cat.toLowerCase())) &&
    (!search || l.title.toLowerCase().includes(search.toLowerCase()))
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const uniqueSellers = LISTINGS.map(l => l.seller).filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <View style={styles.topRow}>
          <View>
            <Text style={[styles.greeting, { color: colors.mutedForeground }]}>Good morning</Text>
            <View style={styles.locationRow}>
              <Feather name="map-pin" size={14} color={colors.primary} />
              <Text style={[styles.location, { color: colors.foreground }]}>Ikeja, Lagos</Text>
              <Feather name="chevron-down" size={14} color={colors.mutedForeground} />
            </View>
          </View>
          <TouchableOpacity style={[styles.notifBtn, { backgroundColor: colors.card }]}>
            <Feather name="bell" size={20} color={colors.foreground} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="search" size={18} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Search products, services, tasks..."
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cats}
      >
        {CATEGORIES.map(c => (
          <TouchableOpacity
            key={c}
            style={[styles.catChip, cat === c && styles.catChipActive]}
            onPress={() => setCat(c)}
          >
            <Text style={[styles.catText, cat === c && styles.catTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Nearby Listings */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Near you</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredListings}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={i => i.id}
          renderItem={({ item }) => (
            <ListingCard item={item} onPress={() => router.push(`/(tabs)/explore/listing/${item.id}`)} />
          )}
          contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }}
          scrollEnabled={filteredListings.length > 0}
          ListEmptyComponent={
            <Text style={[styles.empty, { color: colors.mutedForeground }]}>No listings found</Text>
          }
        />
      </View>

      {/* Open Tasks */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Open tasks</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={TASKS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={i => i.id}
          renderItem={({ item }) => (
            <TaskCard item={item} onPress={() => router.push(`/(tabs)/explore/task/${item.id}`)} />
          )}
          contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }}
          scrollEnabled
        />
      </View>

      {/* Top Traders */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Top rated traders</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={uniqueSellers}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={s => s.id}
          renderItem={({ item }) => <TraderCard seller={item} />}
          contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }}
          scrollEnabled
        />
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, gap: 14, paddingBottom: 8 },
  topRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  greeting: { fontSize: 13, fontFamily: "Inter_400Regular" },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  location: { fontSize: 16, fontFamily: "Inter_700Bold" },
  notifBtn: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center", position: "relative" },
  notifDot: { position: "absolute", top: 9, right: 9, width: 8, height: 8, borderRadius: 4, backgroundColor: "#E24B4A", borderWidth: 1.5, borderColor: "#FFFFFF" },
  searchBar: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14, height: 48, borderRadius: 14, borderWidth: 1.5 },
  searchInput: { flex: 1, fontSize: 15, fontFamily: "Inter_400Regular" },
  cats: { paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
  catChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: "#F5F5F5" },
  catChipActive: { backgroundColor: "#1D9E75" },
  catText: { fontSize: 13, fontFamily: "Inter_500Medium", color: "#6B6B6B" },
  catTextActive: { color: "#FFFFFF", fontFamily: "Inter_600SemiBold" },
  section: { marginBottom: 28 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  seeAll: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#1D9E75" },
  empty: { fontSize: 14, fontFamily: "Inter_400Regular", paddingLeft: 20 },
});
