import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform, Pressable, ScrollView, Share, StyleSheet,
  Text, TouchableOpacity, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LISTINGS } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

function trustLabel(score: number): { label: string; color: string } {
  if (score >= 80) return { label: "Excellent", color: "#1D9E75" };
  if (score >= 60) return { label: "Good", color: "#1D9E75" };
  if (score >= 40) return { label: "Average", color: "#EF9F27" };
  return { label: "Poor", color: "#E24B4A" };
}

function TrustBadge({ score }: { score: number }) {
  const { label, color } = trustLabel(score);
  return (
    <View style={[tb.wrap, { backgroundColor: color + "15" }]}>
      <View style={[tb.dot, { backgroundColor: color }]} />
      <Text style={[tb.score, { color }]}>{score}/100</Text>
      <View style={[tb.divider, { backgroundColor: color + "40" }]} />
      <Text style={[tb.label, { color }]}>{label}</Text>
    </View>
  );
}
const tb = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  score: { fontSize: 12, fontFamily: "Inter_700Bold" },
  divider: { width: 1, height: 12 },
  label: { fontSize: 11, fontFamily: "Inter_500Medium" },
});

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [saved, setSaved] = useState(false);
  const [msgSent, setMsgSent] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reported, setReported] = useState(false);

  const listing = LISTINGS.find(l => l.id === id);

  const topPad = Platform.OS === "web" ? 20 : insets.top;
  const tabBarH = Platform.OS === "web" ? 84 : 58 + insets.bottom;

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
    setSaved(v => !v);
  };

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMenuOpen(false);
    try {
      await Share.share({
        title: listing.title,
        message: `Check out this listing on Proxi: ${listing.title} — ₦${listing.price.toLocaleString()} in ${listing.location}`,
      });
    } catch (_) {}
  };

  const handleReport = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setMenuOpen(false);
    setReported(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: tabBarH + 90 }}
      >
        {/* Hero image */}
        <View style={[styles.imagePlaceholder, { backgroundColor: "#E8F8F2" }]}>
          <Feather name="image" size={64} color={colors.mutedForeground} />

          {/* Overlay — back · save · more */}
          <View style={[styles.imageOverlay, { top: topPad + 10 }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
              <Feather name="arrow-left" size={20} color="#1A1A1A" />
            </TouchableOpacity>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity onPress={handleSave} style={styles.iconBtn}>
                <Feather name="heart" size={20} color={saved ? "#E24B4A" : "#1A1A1A"} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setMenuOpen(v => !v); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                style={styles.iconBtn}
              >
                <Feather name="more-vertical" size={20} color="#1A1A1A" />
              </TouchableOpacity>
            </View>
          </View>

          {listing.negotiable && (
            <View style={styles.negotiableBadge}>
              <Text style={styles.negotiableText}>Negotiable</Text>
            </View>
          )}
        </View>

        {/* 3-dot dropdown */}
        {menuOpen && (
          <View style={[styles.menu, { backgroundColor: colors.background, borderColor: colors.border, right: 16, top: topPad + 62 }]}>
            <TouchableOpacity style={styles.menuItem} onPress={handleShare}>
              <Feather name="share-2" size={15} color={colors.foreground} />
              <Text style={[styles.menuText, { color: colors.foreground }]}>Share listing</Text>
            </TouchableOpacity>
            <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />
            <TouchableOpacity style={styles.menuItem} onPress={handleReport}>
              <Feather name="flag" size={15} color="#E24B4A" />
              <Text style={[styles.menuText, { color: "#E24B4A" }]}>
                {reported ? "Reported ✓" : "Report listing"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Dismiss menu on background tap */}
        {menuOpen && (
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setMenuOpen(false)}
          />
        )}

        <View style={styles.body}>
          {/* Price & condition */}
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
              <Feather name="map-pin" size={13} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{listing.location} · {listing.distance} away</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={styles.metaItem}>
                <Feather name="clock" size={13} color={colors.mutedForeground} />
                <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{listing.createdAt}</Text>
              </View>
              <TouchableOpacity onPress={handleShare} style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
                <Feather name="share-2" size={13} color={colors.primary} />
                <Text style={{ fontSize: 12, color: colors.primary, fontFamily: "Inter_600SemiBold" }}>Share</Text>
              </TouchableOpacity>
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

          {/* Seller card */}
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
                    <Text style={styles.verText}>ID Verified</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.memberSince, { color: colors.mutedForeground }]}>Member since {listing.seller.memberSince}</Text>
            </View>
            <TrustBadge score={listing.seller.score} />
          </View>

          {/* Safety tip */}
          <View style={[styles.safetyTip, { backgroundColor: "#FFFBEB", borderColor: "#EF9F2740" }]}>
            <Feather name="alert-circle" size={14} color="#EF9F27" />
            <Text style={styles.safetyText}>
              <Text style={{ fontFamily: "Inter_700Bold" }}>Safety tip:</Text> Use escrow for all payments. Never pay outside Proxi.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom action bar — sits above tab bar */}
      <View style={[styles.bottomBar, {
        bottom: tabBarH,
        backgroundColor: colors.background,
        borderTopColor: colors.border,
      }]}>
        <TouchableOpacity
          style={[styles.offerBtn, { borderColor: colors.primary }]}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
        >
          <Feather name="tag" size={16} color={colors.primary} />
          <Text style={[styles.offerText, { color: colors.primary }]}>Make Offer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.msgBtn, { backgroundColor: msgSent ? colors.card : colors.primary }]}
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setMsgSent(true);
          }}
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
  imagePlaceholder: { height: 300, alignItems: "center", justifyContent: "center", position: "relative" },
  imageOverlay: { position: "absolute", left: 0, right: 0, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 16 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.92)", alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  negotiableBadge: { position: "absolute", bottom: 12, left: 16, backgroundColor: "#EF9F27", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  negotiableText: { fontSize: 12, color: "#FFFFFF", fontFamily: "Inter_600SemiBold" },
  menu: { position: "absolute", zIndex: 100, borderRadius: 14, borderWidth: 1, width: 190, shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 8 },
  menuItem: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14, paddingVertical: 13 },
  menuText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  menuDivider: { height: 1, marginHorizontal: 14 },
  body: { paddingHorizontal: 20, paddingTop: 20, gap: 16 },
  priceRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  price: { fontSize: 28, fontFamily: "Inter_700Bold" },
  conditionBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  conditionText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  title: { fontSize: 20, fontFamily: "Inter_700Bold", lineHeight: 26 },
  metaRow: { gap: 5 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { fontSize: 12, fontFamily: "Inter_400Regular" },
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
  safetyTip: { flexDirection: "row", alignItems: "flex-start", gap: 8, padding: 12, borderRadius: 12, borderWidth: 1 },
  safetyText: { flex: 1, fontSize: 12, color: "#92680A", fontFamily: "Inter_400Regular", lineHeight: 17 },
  bottomBar: { position: "absolute", left: 0, right: 0, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12, flexDirection: "row", gap: 12, borderTopWidth: 1 },
  offerBtn: { flex: 1, height: 52, borderRadius: 14, borderWidth: 1.5, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  offerText: { fontSize: 15, fontFamily: "Inter_700Bold" },
  msgBtn: { flex: 2, height: 52, borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  msgText: { fontSize: 15, fontFamily: "Inter_700Bold" },
});
