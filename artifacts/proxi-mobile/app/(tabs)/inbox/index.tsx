import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CONVERSATIONS, ORDERS } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

type TabType = "Messages" | "Orders" | "Tasks";

function TrustBadge({ score }: { score: number }) {
  const color = score >= 70 ? "#1D9E75" : score >= 40 ? "#EF9F27" : "#E24B4A";
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, backgroundColor: color + "18" }}>
      <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: color }} />
      <Text style={{ fontSize: 10, fontFamily: "Inter_600SemiBold", color }}>{score}</Text>
    </View>
  );
}

function OrderStatus({ status }: { status: string }) {
  const config: Record<string, { color: string; bg: string }> = {
    Escrow: { color: "#EF9F27", bg: "#FEF8EC" },
    Delivered: { color: "#185FA5", bg: "#E6F1FB" },
    Completed: { color: "#1D9E75", bg: "#E8F8F2" },
    Disputed: { color: "#E24B4A", bg: "#FCE9E9" },
  };
  const c = config[status] ?? { color: "#6B6B6B", bg: "#F5F5F5" };
  return (
    <View style={{ backgroundColor: c.bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
      <Text style={{ fontSize: 11, color: c.color, fontFamily: "Inter_600SemiBold" }}>{status}</Text>
    </View>
  );
}

export default function InboxScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>("Messages");
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const TABS: TabType[] = ["Messages", "Orders", "Tasks"];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Inbox</Text>
        <TouchableOpacity style={[styles.notifBtn, { backgroundColor: colors.card }]}>
          <Feather name="bell" size={20} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={[styles.tabBar, { backgroundColor: colors.card }]}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabItem, activeTab === tab && { backgroundColor: "#FFFFFF", borderRadius: 10 }]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, { color: activeTab === tab ? colors.foreground : colors.mutedForeground }]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Messages */}
      {activeTab === "Messages" && (
        <FlatList
          data={CONVERSATIONS}
          keyExtractor={i => i.id}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [styles.convRow, { backgroundColor: pressed ? colors.card : colors.background }]}
              onPress={() => router.push(`/(tabs)/inbox/chat/${item.id}` as any)}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</Text>
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={[styles.convName, { color: colors.foreground }]}>{item.name}</Text>
                  <Text style={[styles.convTime, { color: colors.mutedForeground }]}>{item.time}</Text>
                </View>
                {item.listingTitle && (
                  <Text style={[styles.convListing, { color: colors.primary }]} numberOfLines={1}>re: {item.listingTitle}</Text>
                )}
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={[styles.convMsg, { color: colors.mutedForeground }]} numberOfLines={1}>{item.lastMessage}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <TrustBadge score={item.score} />
                    {item.unread > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{item.unread}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </Pressable>
          )}
          scrollEnabled
          ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.border }]} />}
        />
      )}

      {/* Orders */}
      {activeTab === "Orders" && (
        <FlatList
          data={ORDERS}
          keyExtractor={i => i.id}
          contentContainerStyle={{ padding: 20, gap: 14, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [styles.orderCard, { backgroundColor: colors.card, opacity: pressed ? 0.9 : 1 }]}
              onPress={() => router.push(`/(tabs)/inbox/order/${item.id}` as any)}
            >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={[styles.orderId, { color: colors.mutedForeground }]}>#{item.id}</Text>
                <OrderStatus status={item.status} />
              </View>
              <Text style={[styles.orderTitle, { color: colors.foreground }]} numberOfLines={1}>{item.listingTitle}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={[styles.orderAmount, { color: colors.primary }]}>₦{item.amount.toLocaleString()}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                </View>
              </View>
            </Pressable>
          )}
          scrollEnabled
        />
      )}

      {/* Tasks */}
      {activeTab === "Tasks" && (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12, paddingBottom: 80 }}>
          <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: "#FAECE7", alignItems: "center", justifyContent: "center" }}>
            <Feather name="file-text" size={28} color="#D85A30" />
          </View>
          <Text style={{ fontSize: 18, fontFamily: "Inter_700Bold", color: colors.foreground }}>No task activity yet</Text>
          <Text style={{ fontSize: 14, color: colors.mutedForeground, fontFamily: "Inter_400Regular", textAlign: "center", paddingHorizontal: 40 }}>
            Apply for tasks in the Explore tab to see your activity here
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: 26, fontFamily: "Inter_700Bold" },
  notifBtn: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  tabBar: { marginHorizontal: 20, borderRadius: 14, padding: 4, flexDirection: "row", marginBottom: 8 },
  tabItem: { flex: 1, paddingVertical: 10, alignItems: "center", justifyContent: "center" },
  tabText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  convRow: { flexDirection: "row", alignItems: "flex-start", gap: 14, paddingHorizontal: 20, paddingVertical: 14 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: "#E8F8F2", alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#1D9E75" },
  convName: { fontSize: 15, fontFamily: "Inter_700Bold" },
  convTime: { fontSize: 12, fontFamily: "Inter_400Regular" },
  convListing: { fontSize: 12, fontFamily: "Inter_500Medium" },
  convMsg: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1 },
  separator: { height: 1, marginLeft: 86 },
  unreadBadge: { backgroundColor: "#1D9E75", width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  unreadText: { fontSize: 11, color: "#FFFFFF", fontFamily: "Inter_700Bold" },
  orderCard: { borderRadius: 16, padding: 16, gap: 8 },
  orderId: { fontSize: 12, fontFamily: "Inter_500Medium" },
  orderTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  orderAmount: { fontSize: 18, fontFamily: "Inter_700Bold" },
});
