import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NOTIFICATIONS, type AppNotification } from "@/constants/notifications";
import { useColors } from "@/hooks/useColors";

export default function NotificationsScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const renderItem = ({ item }: { item: AppNotification }) => (
    <TouchableOpacity
      style={[
        styles.item,
        { backgroundColor: item.read ? colors.background : colors.primary + "08" },
      ]}
      onPress={() => markRead(item.id)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
        <Feather name={item.iconName as any} size={18} color={item.iconColor} />
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[styles.time, { color: colors.mutedForeground }]}>{item.time}</Text>
        </View>
        <Text style={[styles.body, { color: colors.mutedForeground }]} numberOfLines={2}>
          {item.body}
        </Text>
      </View>
      {!item.read && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={notifications}
        keyExtractor={n => n.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
        scrollEnabled
        ListHeaderComponent={
          <View style={styles.listHeader}>
            {unreadCount > 0 ? (
              <TouchableOpacity onPress={markAllRead} style={[styles.markAllBtn, { backgroundColor: colors.card }]}>
                <Feather name="check-circle" size={14} color={colors.primary} />
                <Text style={[styles.markAllText, { color: colors.primary }]}>Mark all as read</Text>
              </TouchableOpacity>
            ) : (
              <View style={[styles.allReadBanner, { backgroundColor: "#E8F8F2" }]}>
                <Feather name="check-circle" size={14} color="#1D9E75" />
                <Text style={{ fontSize: 13, color: "#1D9E75", fontFamily: "Inter_500Medium" }}>
                  You're all caught up!
                </Text>
              </View>
            )}
          </View>
        }
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
        )}
        ListEmptyComponent={
          <View style={{ alignItems: "center", paddingTop: 60, gap: 12 }}>
            <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: colors.card, alignItems: "center", justifyContent: "center" }}>
              <Feather name="bell" size={28} color={colors.mutedForeground} />
            </View>
            <Text style={{ fontSize: 17, fontFamily: "Inter_700Bold", color: colors.foreground }}>
              No notifications yet
            </Text>
            <Text style={{ fontSize: 14, color: colors.mutedForeground, fontFamily: "Inter_400Regular", textAlign: "center", paddingHorizontal: 40 }}>
              Activity on your listings and orders will appear here
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listHeader: { padding: 16, paddingBottom: 8 },
  markAllBtn: { flexDirection: "row", alignItems: "center", gap: 8, alignSelf: "flex-end", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  markAllText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  allReadBanner: { flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderRadius: 12 },
  item: { flexDirection: "row", alignItems: "flex-start", gap: 12, paddingHorizontal: 16, paddingVertical: 14, position: "relative" },
  iconBox: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 },
  content: { flex: 1, gap: 4 },
  titleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  title: { fontSize: 14, fontFamily: "Inter_700Bold", flex: 1 },
  time: { fontSize: 11, fontFamily: "Inter_400Regular", flexShrink: 0 },
  body: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
  unreadDot: { position: "absolute", top: 18, right: 16, width: 8, height: 8, borderRadius: 4 },
  separator: { height: 1, marginLeft: 72 },
});
