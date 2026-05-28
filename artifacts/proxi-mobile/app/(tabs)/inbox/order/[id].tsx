import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ORDERS } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [confirmed, setConfirmed] = useState(false);
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const order = ORDERS.find(o => o.id === id);
  if (!order) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: colors.mutedForeground }}>Order not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold" }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Status */}
        <View style={[styles.statusBanner, { backgroundColor: order.status === "Completed" ? "#E8F8F2" : order.status === "Disputed" ? "#FCE9E9" : "#FEF8EC" }]}>
          <Feather
            name={order.status === "Completed" ? "check-circle" : order.status === "Disputed" ? "alert-circle" : "shield"}
            size={22}
            color={order.status === "Completed" ? "#1D9E75" : order.status === "Disputed" ? "#E24B4A" : "#EF9F27"}
          />
          <Text style={[styles.statusText, { color: order.status === "Completed" ? "#1D9E75" : order.status === "Disputed" ? "#E24B4A" : "#EF9F27" }]}>
            {order.status === "Escrow" ? "₦" + order.amount.toLocaleString() + " held in escrow" : order.status}
          </Text>
        </View>

        <View style={styles.body}>
          {/* Order info */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={[styles.orderId, { color: colors.mutedForeground }]}>Order #{order.id}</Text>
            </View>
            <Text style={[styles.orderTitle, { color: colors.foreground }]}>{order.listingTitle}</Text>
            <Text style={[styles.amount, { color: colors.primary }]}>₦{order.amount.toLocaleString()}</Text>
            <View style={styles.parties}>
              <View style={{ gap: 2 }}>
                <Text style={[styles.partyLabel, { color: colors.mutedForeground }]}>Buyer</Text>
                <Text style={[styles.partyName, { color: colors.foreground }]}>{order.buyerName}</Text>
              </View>
              <Feather name="arrow-right" size={16} color={colors.mutedForeground} />
              <View style={{ gap: 2 }}>
                <Text style={[styles.partyLabel, { color: colors.mutedForeground }]}>Seller</Text>
                <Text style={[styles.partyName, { color: colors.foreground }]}>{order.sellerName}</Text>
              </View>
            </View>
          </View>

          {/* Timeline */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Order timeline</Text>
            {order.timeline.map((step, i) => (
              <View key={i} style={styles.timelineRow}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.timelineDot, { backgroundColor: step.done ? "#1D9E75" : step.active ? "#EF9F27" : colors.border }]}>
                    {step.done && <Feather name="check" size={12} color="#FFFFFF" />}
                    {step.active && !step.done && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#EF9F27" }} />}
                  </View>
                  {i < order.timeline.length - 1 && (
                    <View style={[styles.timelineLine, { backgroundColor: i < order.timeline.findIndex(s => s.active) ? "#1D9E75" : colors.border }]} />
                  )}
                </View>
                <Text style={[styles.timelineLabel, { color: step.active ? colors.foreground : step.done ? colors.mutedForeground : colors.border }]}>
                  {step.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      {order.status === "Escrow" && (
        <View style={[styles.bottomBar, { paddingBottom: botPad + 12, backgroundColor: colors.background, borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.confirmBtn, { backgroundColor: confirmed ? "#E8F8F2" : "#1D9E75" }]}
            onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); setConfirmed(true); }}
            disabled={confirmed}
          >
            <Feather name={confirmed ? "check" : "check-circle"} size={18} color={confirmed ? "#1D9E75" : "#FFFFFF"} />
            <Text style={[styles.confirmText, { color: confirmed ? "#1D9E75" : "#FFFFFF" }]}>
              {confirmed ? "Receipt Confirmed" : "Confirm Receipt"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.disputeBtn, { backgroundColor: "#FCE9E9" }]}>
            <Feather name="alert-triangle" size={16} color="#E24B4A" />
            <Text style={{ fontSize: 14, color: "#E24B4A", fontFamily: "Inter_600SemiBold" }}>Dispute</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  statusBanner: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, margin: 20, borderRadius: 16 },
  statusText: { fontSize: 15, fontFamily: "Inter_700Bold" },
  body: { paddingHorizontal: 20, gap: 16 },
  card: { borderRadius: 16, padding: 16, gap: 12 },
  orderId: { fontSize: 12, fontFamily: "Inter_500Medium" },
  orderTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  amount: { fontSize: 24, fontFamily: "Inter_700Bold" },
  parties: { flexDirection: "row", alignItems: "center", gap: 16 },
  partyLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  partyName: { fontSize: 14, fontFamily: "Inter_700Bold" },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  timelineRow: { flexDirection: "row", alignItems: "flex-start", gap: 14 },
  timelineLeft: { alignItems: "center" },
  timelineDot: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  timelineLine: { width: 2, height: 28, marginTop: 2 },
  timelineLabel: { fontSize: 14, fontFamily: "Inter_500Medium", paddingTop: 4 },
  bottomBar: { paddingHorizontal: 20, paddingTop: 12, gap: 10, borderTopWidth: 1 },
  confirmBtn: { height: 52, borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  confirmText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  disputeBtn: { height: 44, borderRadius: 12, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
});
