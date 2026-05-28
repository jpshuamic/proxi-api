import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView, Platform, ScrollView, StyleSheet,
  Switch, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const STEPS = ["Photos", "Details", "Pricing", "Review"];
const CATEGORIES = ["Electronics", "Vehicles", "Fashion", "Home", "Property", "Services", "Other"];
const CONDITIONS = ["New", "Used", "Refurbished"];
const DELIVERY = ["Pickup", "Delivery", "Both"];

export default function PostProductScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [delivery, setDelivery] = useState("");
  const [negotiable, setNegotiable] = useState(false);
  const [published, setPublished] = useState(false);

  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const canNext = () => {
    if (step === 0) return true;
    if (step === 1) return title.length > 0 && category.length > 0 && condition.length > 0;
    if (step === 2) return price.length > 0 && delivery.length > 0;
    return true;
  };

  const handleNext = () => {
    if (step < 3) { setStep(step + 1); return; }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setPublished(true);
    setTimeout(() => router.replace("/(tabs)/post"), 1200);
  };

  if (published) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", gap: 16 }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: "#E8F8F2", alignItems: "center", justifyContent: "center" }}>
          <Feather name="check" size={40} color="#1D9E75" />
        </View>
        <Text style={{ fontSize: 22, fontFamily: "Inter_700Bold", color: colors.foreground }}>Listing Published!</Text>
        <Text style={{ fontSize: 15, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Your listing is now live on Proxi</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      {/* Progress */}
      <View style={styles.progress}>
        {STEPS.map((s, i) => (
          <View key={s} style={styles.stepItem}>
            <View style={[styles.stepDot, { backgroundColor: i <= step ? "#1D9E75" : colors.border }]}>
              {i < step ? (
                <Feather name="check" size={12} color="#FFFFFF" />
              ) : (
                <Text style={[styles.stepNum, { color: i === step ? "#FFFFFF" : colors.mutedForeground }]}>{i + 1}</Text>
              )}
            </View>
            <Text style={[styles.stepLabel, { color: i === step ? "#1D9E75" : colors.mutedForeground }]}>{s}</Text>
            {i < STEPS.length - 1 && <View style={[styles.stepLine, { backgroundColor: i < step ? "#1D9E75" : colors.border }]} />}
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120, gap: 20, paddingTop: 8 }} keyboardShouldPersistTaps="handled">
        {step === 0 && (
          <View style={{ gap: 16 }}>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>Add photos</Text>
            <View style={styles.photoGrid}>
              {[...Array(6)].map((_, i) => (
                <TouchableOpacity key={i} style={[styles.photoSlot, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Feather name="plus" size={24} color={colors.mutedForeground} />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.hint, { color: colors.mutedForeground }]}>Add up to 6 photos. First photo is your cover image.</Text>
          </View>
        )}

        {step === 1 && (
          <View style={{ gap: 16 }}>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>Listing details</Text>
            <Field label="Title" children={
              <TextInput style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} placeholder="e.g. iPhone 14 Pro Max 256GB" placeholderTextColor={colors.mutedForeground} value={title} onChangeText={setTitle} />
            } />
            <Field label="Description" children={
              <TextInput style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground, height: 90, textAlignVertical: "top", paddingTop: 14 }]} placeholder="Describe your item..." placeholderTextColor={colors.mutedForeground} multiline value={desc} onChangeText={setDesc} />
            } />
            <Field label="Category" children={
              <View style={styles.chips}>{CATEGORIES.map(c => (
                <TouchableOpacity key={c} style={[styles.chip, { backgroundColor: category === c ? "#1D9E75" : colors.card, borderColor: category === c ? "#1D9E75" : colors.border }]} onPress={() => setCategory(c)}>
                  <Text style={[styles.chipText, { color: category === c ? "#FFFFFF" : colors.mutedForeground }]}>{c}</Text>
                </TouchableOpacity>
              ))}</View>
            } />
            <Field label="Condition" children={
              <View style={styles.chips}>{CONDITIONS.map(c => (
                <TouchableOpacity key={c} style={[styles.chip, { backgroundColor: condition === c ? "#1D9E75" : colors.card, borderColor: condition === c ? "#1D9E75" : colors.border }]} onPress={() => setCondition(c)}>
                  <Text style={[styles.chipText, { color: condition === c ? "#FFFFFF" : colors.mutedForeground }]}>{c}</Text>
                </TouchableOpacity>
              ))}</View>
            } />
          </View>
        )}

        {step === 2 && (
          <View style={{ gap: 16 }}>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>Pricing & delivery</Text>
            <Field label="Price (₦)" children={
              <TextInput style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} placeholder="0" keyboardType="number-pad" placeholderTextColor={colors.mutedForeground} value={price} onChangeText={setPrice} />
            } />
            <View style={[styles.switchRow, { backgroundColor: colors.card }]}>
              <Text style={[styles.switchLabel, { color: colors.foreground }]}>Price is negotiable</Text>
              <Switch value={negotiable} onValueChange={setNegotiable} trackColor={{ false: colors.border, true: "#1D9E75" }} thumbColor="#FFFFFF" />
            </View>
            <Field label="Delivery options" children={
              <View style={styles.chips}>{DELIVERY.map(d => (
                <TouchableOpacity key={d} style={[styles.chip, { backgroundColor: delivery === d ? "#1D9E75" : colors.card, borderColor: delivery === d ? "#1D9E75" : colors.border }]} onPress={() => setDelivery(d)}>
                  <Text style={[styles.chipText, { color: delivery === d ? "#FFFFFF" : colors.mutedForeground }]}>{d}</Text>
                </TouchableOpacity>
              ))}</View>
            } />
          </View>
        )}

        {step === 3 && (
          <View style={{ gap: 16 }}>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>Review & publish</Text>
            <View style={[styles.previewCard, { backgroundColor: colors.card }]}>
              <View style={{ height: 120, backgroundColor: "#E8F8F2", borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <Feather name="image" size={32} color={colors.mutedForeground} />
              </View>
              <Text style={[styles.previewTitle, { color: colors.foreground }]}>{title || "Your listing title"}</Text>
              <Text style={[styles.previewPrice, { color: "#1D9E75" }]}>₦{price ? parseInt(price).toLocaleString() : "0"}</Text>
              <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                {category ? <Chip label={category} /> : null}
                {condition ? <Chip label={condition} /> : null}
                {delivery ? <Chip label={delivery} /> : null}
                {negotiable ? <Chip label="Negotiable" color="#EF9F27" /> : null}
              </View>
            </View>
            <View style={[styles.escrowInfo, { backgroundColor: "#E8F8F2" }]}>
              <Feather name="shield" size={14} color="#1D9E75" />
              <Text style={{ flex: 1, fontSize: 13, color: "#1D9E75", fontFamily: "Inter_400Regular", lineHeight: 18 }}>All transactions through Proxi are escrow-protected</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: botPad + 12, backgroundColor: colors.background, borderTopColor: colors.border }]}>
        {step > 0 && (
          <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.card }]} onPress={() => setStep(step - 1)}>
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: canNext() ? "#1D9E75" : colors.border, flex: 1 }]}
          onPress={handleNext}
          disabled={!canNext()}
        >
          <Text style={styles.nextText}>{step === 3 ? "Publish Listing" : "Continue"}</Text>
          <Feather name={step === 3 ? "check" : "arrow-right"} size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#6B6B6B" }}>{label}</Text>
      {children}
    </View>
  );
}

function Chip({ label, color = "#1D9E75" }: { label: string; color?: string }) {
  return (
    <View style={{ backgroundColor: color + "18", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
      <Text style={{ fontSize: 12, color, fontFamily: "Inter_500Medium" }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  progress: { flexDirection: "row", paddingHorizontal: 20, paddingVertical: 16, gap: 0 },
  stepItem: { flex: 1, alignItems: "center", gap: 4, flexDirection: "column", position: "relative" },
  stepDot: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  stepNum: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  stepLabel: { fontSize: 10, fontFamily: "Inter_500Medium" },
  stepLine: { position: "absolute", top: 14, left: "60%", right: "-40%", height: 2 },
  stepTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  photoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  photoSlot: { width: "30%", aspectRatio: 1, borderRadius: 12, borderWidth: 1.5, borderStyle: "dashed", alignItems: "center", justifyContent: "center" },
  hint: { fontSize: 12, fontFamily: "Inter_400Regular" },
  input: { height: 52, borderRadius: 12, paddingHorizontal: 16, fontSize: 15, fontFamily: "Inter_400Regular", borderWidth: 1.5 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5 },
  chipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14, borderRadius: 12 },
  switchLabel: { fontSize: 15, fontFamily: "Inter_500Medium" },
  previewCard: { borderRadius: 16, padding: 16 },
  previewTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  previewPrice: { fontSize: 22, fontFamily: "Inter_700Bold", marginTop: 4 },
  escrowInfo: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderRadius: 12 },
  bottomBar: { paddingHorizontal: 20, paddingTop: 12, flexDirection: "row", gap: 10, borderTopWidth: 1 },
  backBtn: { width: 52, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  nextBtn: { height: 52, borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  nextText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
});
