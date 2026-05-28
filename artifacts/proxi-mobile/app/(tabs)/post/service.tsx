import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView, Platform, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

const STEPS = ["Service Info", "Availability", "Review"];
const SERVICE_CATS = ["Tech & Design", "Home Repairs", "Tutoring", "Events", "Beauty", "Logistics", "Other"];
const RATE_TYPES = ["Per hour", "Per job", "Per day"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function PostServiceScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [rate, setRate] = useState("");
  const [rateType, setRateType] = useState("");
  const [days, setDays] = useState<string[]>([]);
  const [published, setPublished] = useState(false);
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const toggleDay = (d: string) => setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  const handleNext = () => {
    if (step < 2) { setStep(step + 1); return; }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setPublished(true);
    setTimeout(() => router.replace("/(tabs)/post"), 1200);
  };

  if (published) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", gap: 16 }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: "#EEEDFE", alignItems: "center", justifyContent: "center" }}>
          <Feather name="check" size={40} color="#7F77DD" />
        </View>
        <Text style={{ fontSize: 22, fontFamily: "Inter_700Bold", color: colors.foreground }}>Service Published!</Text>
        <Text style={{ fontSize: 15, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Your service is now live on Proxi</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.progress}>
        {STEPS.map((s, i) => (
          <TouchableOpacity key={s} style={styles.stepItem} onPress={() => i < step && setStep(i)}>
            <View style={[styles.stepDot, { backgroundColor: i <= step ? "#7F77DD" : colors.border }]}>
              {i < step ? <Feather name="check" size={12} color="#FFFFFF" /> : <Text style={[styles.stepNum, { color: i === step ? "#FFFFFF" : colors.mutedForeground }]}>{i + 1}</Text>}
            </View>
            <Text style={[styles.stepLabel, { color: i === step ? "#7F77DD" : colors.mutedForeground }]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120, gap: 18, paddingTop: 8 }} keyboardShouldPersistTaps="handled">
        {step === 0 && (
          <View style={{ gap: 16 }}>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>Service details</Text>
            <View style={{ gap: 6 }}>
              <Text style={styles.label}>Service category</Text>
              <View style={styles.chips}>{SERVICE_CATS.map(c => (
                <TouchableOpacity key={c} style={[styles.chip, { backgroundColor: category === c ? "#7F77DD" : colors.card, borderColor: category === c ? "#7F77DD" : colors.border }]} onPress={() => setCategory(c)}>
                  <Text style={[styles.chipText, { color: category === c ? "#FFFFFF" : colors.mutedForeground }]}>{c}</Text>
                </TouchableOpacity>
              ))}</View>
            </View>
            <View style={{ gap: 6 }}>
              <Text style={styles.label}>Service title</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} placeholder="e.g. Professional logo design" placeholderTextColor={colors.mutedForeground} value={title} onChangeText={setTitle} />
            </View>
            <View style={{ gap: 6 }}>
              <Text style={styles.label}>Description</Text>
              <TextInput style={[styles.input, styles.textarea, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} placeholder="Describe your service, experience, and what's included..." placeholderTextColor={colors.mutedForeground} multiline value={desc} onChangeText={setDesc} />
            </View>
            <View style={{ gap: 6 }}>
              <Text style={styles.label}>Rate (₦)</Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <TextInput style={[styles.input, { flex: 1, backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} placeholder="5,000" keyboardType="number-pad" placeholderTextColor={colors.mutedForeground} value={rate} onChangeText={setRate} />
                <View style={styles.chips}>
                  {RATE_TYPES.map(rt => (
                    <TouchableOpacity key={rt} style={[styles.chip, { backgroundColor: rateType === rt ? "#7F77DD" : colors.card, borderColor: rateType === rt ? "#7F77DD" : colors.border }]} onPress={() => setRateType(rt)}>
                      <Text style={[styles.chipText, { color: rateType === rt ? "#FFFFFF" : colors.mutedForeground }]}>{rt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>
        )}

        {step === 1 && (
          <View style={{ gap: 16 }}>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>Availability & area</Text>
            <View style={{ gap: 8 }}>
              <Text style={styles.label}>Available days</Text>
              <View style={styles.chips}>
                {DAYS.map(d => (
                  <TouchableOpacity key={d} style={[styles.dayChip, { backgroundColor: days.includes(d) ? "#7F77DD" : colors.card, borderColor: days.includes(d) ? "#7F77DD" : colors.border }]} onPress={() => toggleDay(d)}>
                    <Text style={[styles.chipText, { color: days.includes(d) ? "#FFFFFF" : colors.mutedForeground }]}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={{ gap: 6 }}>
              <Text style={styles.label}>Portfolio photos</Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                {[...Array(3)].map((_, i) => (
                  <TouchableOpacity key={i} style={[styles.photoSlot, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Feather name="plus" size={24} color={colors.mutedForeground} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={{ gap: 16 }}>
            <Text style={[styles.stepTitle, { color: colors.foreground }]}>Review & publish</Text>
            <View style={[styles.previewCard, { backgroundColor: colors.card }]}>
              <View style={styles.previewHeader}>
                <View style={{ width: 50, height: 50, borderRadius: 14, backgroundColor: "#EEEDFE", alignItems: "center", justifyContent: "center" }}>
                  <Feather name="tool" size={22} color="#7F77DD" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.previewTitle, { color: colors.foreground }]}>{title || "Your service title"}</Text>
                  <Text style={[styles.previewPrice, { color: "#7F77DD" }]}>₦{rate || "0"} {rateType}</Text>
                </View>
              </View>
              {category ? <View style={{ flexDirection: "row" }}><View style={{ backgroundColor: "#EEEDFE", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}><Text style={{ fontSize: 12, color: "#7F77DD", fontFamily: "Inter_500Medium" }}>{category}</Text></View></View> : null}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: botPad + 12, backgroundColor: colors.background, borderTopColor: colors.border }]}>
        {step > 0 && <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.card }]} onPress={() => setStep(step - 1)}><Feather name="arrow-left" size={20} color={colors.foreground} /></TouchableOpacity>}
        <TouchableOpacity style={[styles.nextBtn, { backgroundColor: "#7F77DD", flex: 1 }]} onPress={handleNext}>
          <Text style={styles.nextText}>{step === 2 ? "Publish Service" : "Continue"}</Text>
          <Feather name={step === 2 ? "check" : "arrow-right"} size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  progress: { flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 20, paddingVertical: 16 },
  stepItem: { alignItems: "center", gap: 4 },
  stepDot: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  stepNum: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  stepLabel: { fontSize: 10, fontFamily: "Inter_500Medium" },
  stepTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  label: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#6B6B6B" },
  input: { height: 52, borderRadius: 12, paddingHorizontal: 16, fontSize: 15, fontFamily: "Inter_400Regular", borderWidth: 1.5 },
  textarea: { height: 90, paddingTop: 14, textAlignVertical: "top" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5 },
  dayChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5 },
  chipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  photoSlot: { width: 90, height: 90, borderRadius: 12, borderWidth: 1.5, borderStyle: "dashed", alignItems: "center", justifyContent: "center" },
  previewCard: { borderRadius: 16, padding: 16, gap: 12 },
  previewHeader: { flexDirection: "row", gap: 12, alignItems: "center" },
  previewTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  previewPrice: { fontSize: 16, fontFamily: "Inter_700Bold", marginTop: 2 },
  bottomBar: { paddingHorizontal: 20, paddingTop: 12, flexDirection: "row", gap: 10, borderTopWidth: 1 },
  backBtn: { width: 52, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  nextBtn: { height: 52, borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  nextText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
});
