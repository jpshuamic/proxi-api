import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MY_USER, WALLET_TRANSACTIONS } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

export default function WalletScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>₦{MY_USER.walletBalance.toLocaleString()}</Text>
          <View style={styles.escrowRow}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Feather name="lock" size={13} color="rgba(255,255,255,0.7)" />
              <Text style={styles.escrowText}>₦{MY_USER.escrowHeld.toLocaleString()} in escrow</Text>
            </View>
          </View>

          <View style={styles.actionBtns}>
            <TouchableOpacity style={styles.walletAction} onPress={() => setActiveAction("add")}>
              <View style={styles.walletActionIcon}>
                <Feather name="plus" size={20} color="#1D9E75" />
              </View>
              <Text style={styles.walletActionLabel}>Add Money</Text>
            </TouchableOpacity>
            <View style={styles.walletActionDivider} />
            <TouchableOpacity style={styles.walletAction} onPress={() => setActiveAction("withdraw")}>
              <View style={styles.walletActionIcon}>
                <Feather name="arrow-up" size={20} color="#1D9E75" />
              </View>
              <Text style={styles.walletActionLabel}>Withdraw</Text>
            </TouchableOpacity>
            <View style={styles.walletActionDivider} />
            <TouchableOpacity style={styles.walletAction}>
              <View style={styles.walletActionIcon}>
                <Feather name="credit-card" size={20} color="#1D9E75" />
              </View>
              <Text style={styles.walletActionLabel}>Bank</Text>
            </TouchableOpacity>
          </View>
        </View>

        {activeAction === "add" && (
          <View style={[styles.actionPanel, { backgroundColor: colors.card, marginHorizontal: 20, marginTop: 16 }]}>
            <Text style={[styles.actionTitle, { color: colors.foreground }]}>Add money via Paystack</Text>
            <Text style={[styles.actionSub, { color: colors.mutedForeground }]}>Instant bank transfer or card payment</Text>
            <View style={styles.amtRow}>
              {["5,000", "10,000", "25,000", "50,000"].map(amt => (
                <TouchableOpacity key={amt} style={[styles.amtChip, { borderColor: colors.border, backgroundColor: colors.background }]}>
                  <Text style={[styles.amtText, { color: colors.foreground }]}>₦{amt}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={[styles.proceedBtn, { backgroundColor: colors.primary }]}>
              <Text style={styles.proceedText}>Proceed to Payment</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Transactions */}
        <View style={{ paddingHorizontal: 20, marginTop: 24, gap: 12 }}>
          <Text style={[styles.txTitle, { color: colors.foreground }]}>Transaction History</Text>
          {WALLET_TRANSACTIONS.map(tx => (
            <View key={tx.id} style={[styles.txRow, { backgroundColor: colors.card }]}>
              <View style={[styles.txIcon, { backgroundColor: tx.type === "credit" ? "#E8F8F2" : "#FCE9E9" }]}>
                <Feather
                  name={tx.type === "credit" ? "arrow-down-left" : "arrow-up-right"}
                  size={18}
                  color={tx.type === "credit" ? "#1D9E75" : "#E24B4A"}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.txLabel, { color: colors.foreground }]} numberOfLines={1}>{tx.label}</Text>
                <Text style={[styles.txDate, { color: colors.mutedForeground }]}>{tx.date}</Text>
              </View>
              <Text style={[styles.txAmount, { color: tx.type === "credit" ? "#1D9E75" : "#E24B4A" }]}>
                {tx.type === "credit" ? "+" : "-"}₦{tx.amount.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  balanceCard: { backgroundColor: "#1D9E75", margin: 20, borderRadius: 24, padding: 24, gap: 8 },
  balanceLabel: { fontSize: 14, color: "rgba(255,255,255,0.75)", fontFamily: "Inter_400Regular" },
  balanceAmount: { fontSize: 40, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  escrowRow: { flexDirection: "row", alignItems: "center" },
  escrowText: { fontSize: 13, color: "rgba(255,255,255,0.7)", fontFamily: "Inter_400Regular" },
  actionBtns: { flexDirection: "row", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 16, marginTop: 8, overflow: "hidden" },
  walletAction: { flex: 1, alignItems: "center", paddingVertical: 14, gap: 6 },
  walletActionIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.9)", alignItems: "center", justifyContent: "center" },
  walletActionLabel: { fontSize: 12, color: "#FFFFFF", fontFamily: "Inter_600SemiBold" },
  walletActionDivider: { width: 1, backgroundColor: "rgba(255,255,255,0.2)", marginVertical: 12 },
  actionPanel: { borderRadius: 16, padding: 16, gap: 12 },
  actionTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  actionSub: { fontSize: 13, fontFamily: "Inter_400Regular" },
  amtRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  amtChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5 },
  amtText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  proceedBtn: { height: 50, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  proceedText: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
  txTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  txRow: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14, borderRadius: 14 },
  txIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  txLabel: { fontSize: 14, fontFamily: "Inter_500Medium" },
  txDate: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  txAmount: { fontSize: 16, fontFamily: "Inter_700Bold" },
});
