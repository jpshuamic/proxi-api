import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform, Pressable, ScrollView, StyleSheet,
  Text, TouchableOpacity, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LISTINGS } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

function TrustBadge({ score }: { score: number }) {
  const color = score >= 70 ? "#1D9E75" : score >= 40 ? "#EF9F27" : "#E24B4A";
  return (
    <View style={[{ flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: color + "18" }]}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color }} />
      <Text style={{ fontSize: 12, fontFamily: "Inter_600SemiBold", color }}>{score}/100</Text>
    </View>
  );
}

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [saved, setSaved] = useState(false);
  const [msgSent, setMsgSent] = useState(false);

  const listing = LISTINGS.find(l => l.id === id);
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  if (!listing) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Listing not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold" }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSaved(!saved);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image */}
        <View style={[styles.imagePlaceholder, { backgroundColor: "#E8F8F2" }]}>
          <Feather name="image" size={64} color={colors.mutedForeground} />
          <View style={styles.imageOverlay}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Feather name="arrow-left" size={20} color="#1A1A1A" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
              <Feather name={saved ? "heart" : "heart"} size={20} color={saved ? "#E24B4A" : "#1A1A1A"} />
            </TouchableOpacity>
          </View>
          {listing.negotiable && (
            <View style={styles.negotiableBadge}>
              <Text style={styles.negotiableText}>Negotiable</Text>
            </View>
          )}
        </View>

        <View style={styles.body}>
          {/* Price & Title */}
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.primary }]}>₦{listing.price.toLocaleString()}</Text>
            <View style={[styles.conditionBadge, { backgroundColor: colors.card }]}>
              <Text style={[styles.conditionText, { color: colors.mutedForeground }]}>{listing.condition}</Text>
            </View>
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>{listing.title}</Text>

          {/* Meta */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Feather name="map-pin" size={14} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{listing.location} · {listing.distance} away</Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="clock" size={14} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{listing.createdAt}</Text>
            </View>
          </View>

          {/* Tags */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.tags}>
              {listing.tags.map(tag => (
                <View key={tag} style={[styles.tag, { backgroundColor: colors.card }]}>
                  <Text style={[styles.tagText, { color: colors.mutedForeground }]}>#{tag}</Text>
                </View>
              ))}
              <View style={[styles.tag, { backgroundColor: "#E8F8F2" }]}>
                <Feather name="truck" size={11} color="#1D9E75" />
                <Text style={[styles.tagText, { color: "#1D9E75" }]}>{listing.delivery}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Description</Text>
            <Text style={[styles.desc, { color: colors.mutedForeground }]}>{listing.description}</Text>
          </View>

          {/* Seller */}
          <View style={[styles.sellerCard, { backgroundColor: colors.card }]}>
            <View style={styles.sellerAvatar}>
              <Text style={styles.sellerInitials}>
                {listing.seller.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sellerName, { color: colors.foreground }]}>{listing.seller.name}</Text>
              <View style={styles.verBadges}>
                {listing.seller.phoneVerified && (
                  <View style={styles.verChip}>
                    <Feather name="phone" size={10} color="#1D9E75" />
                    <Text style={styles.verText}>Phone</Text>
                  </View>
                )}
                {listing.seller.verified && (
                  <View style={styles.verChip}>
                    <Feather name="shield" size={10} color="#1D9E75" />
                    <Text style={styles.verText}>ID</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.memberSince, { color: colors.mutedForeground }]}>Member since {listing.seller.memberSince}</Text>
            </View>
            <TrustBadge score={listing.seller.score} />
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomBar, { paddingBottom: botPad + 12, backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.offerBtn, { borderColor: colors.primary }]}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
        >
          <Feather name="tag" size={16} color={colors.primary} />
          <Text style={[styles.offerText, { color: colors.primary }]}>Make Offer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.msgBtn, { backgroundColor: msgSent ? colors.card : colors.primary }]}
          onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); setMsgSent(true); }}
        >
          <Feather name="message-circle" size={16} color={msgSent ? colors.primary : "#FFFFFF"} />
          <Text style={[styles.msgText, { color: msgSent ? colors.primary : "#FFFFFF" }]}>
            {msgSent ? "Message Sent!" : "Message Seller"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imagePlaceholder: { height: 280, alignItems: "center", justifyContent: "center", position: "relative" },
  imageOverlay: { position: "absolute", top: 16, left: 0, right: 0, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.9)", alignItems: "center", justifyContent: "center" },
  saveBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.9)", alignItems: "center", justifyContent: "center" },
  negotiableBadge: { position: "absolute", bottom: 12, left: 16, backgroundColor: "#EF9F27", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  negotiableText: { fontSize: 12, color: "#FFFFFF", fontFamily: "Inter_600SemiBold" },
  body: { paddingHorizontal: 20, paddingTop: 20, gap: 16 },
  priceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  price: { fontSize: 28, fontFamily: "Inter_700Bold" },
  conditionBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  conditionText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  title: { fontSize: 20, fontFamily: "Inter_700Bold", lineHeight: 26 },
  metaRow: { gap: 6 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  tags: { flexDirection: "row", gap: 8 },
  tag: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  tagText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  section: { gap: 8 },
  sectionTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  desc: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  sellerCard: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, borderRadius: 16 },
  sellerAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#E8F8F2", alignItems: "center", justifyContent: "center" },
  sellerInitials: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#1D9E75" },
  sellerName: { fontSize: 15, fontFamily: "Inter_700Bold" },
  verBadges: { flexDirection: "row", gap: 6, marginTop: 3 },
  verChip: { flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "#E8F8F2", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  verText: { fontSize: 10, color: "#1D9E75", fontFamily: "Inter_500Medium" },
  memberSince: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  bottomBar: { paddingHorizontal: 20, paddingTop: 12, flexDirection: "row", gap: 12, borderTopWidth: 1 },
  offerBtn: { flex: 1, height: 52, borderRadius: 14, borderWidth: 1.5, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  offerText: { fontSize: 15, fontFamily: "Inter_700Bold" },
  msgBtn: { flex: 2, height: 52, borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  msgText: { fontSize: 15, fontFamily: "Inter_700Bold" },
});
