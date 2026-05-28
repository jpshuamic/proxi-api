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

const STEPS = ["Details", "Budget & Time", "Review"];
const TASK_CATS = ["Tech & Design", "Home Repairs", "Moving", "Education", "Events", "Errands", "Other"];
const BUDGET_TYPES = ["Fixed", "Hourly"];
const LOC_TYPES = ["Remote", "On-site", "Both"];

export default function PostTaskScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [budget, setBudget] = useState("");
  const [budgetType, setBudgetType] = useState("Fixed");
  const [locType, setLocType] = useState("");
  const [published, setPublished] = useState(false);
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleNext = () => {
    if (step < 2) { setStep(step + 1); return; }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setPublished(true);
    setTimeout(() => router.replace("/(tabs)/post"), 1200);
  };

  if (published) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", gap: 16 }}>
        <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: "#FAECE7", alignItems: "center", justifyContent: "center" }}>
          <Feather name="check" size={40} color="#D85A30" />
        </View>
        <Text style={{ fontSize: 22, fontFamily: "Inter_700Bold", color: colors.foreground }}>Task Posted!</Text>
        <Text style={{ fontSize: 15, color: colors.mutedForeground, fontFamily: "Inter_400Regular" }}>Earners can now apply for your task</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.progress}>
        {STEPS.map((s, i) => (
          <View key={s} style={styles.stepItem}>
            <View style={[styles.stepDot, { backgroundColor: i <= step ? "#D85A30" : colors.border }]}>
              {i < step ? <Feather name="check" size={12} color="#FFFFFF" /> : <Text style={[styles.stepNum, { color: i === step ? "#FFFFFF" : colors.mutedForeground }]}>{i + 1}</Text>}
            </View>
            <Text style={[styles.stepLabel, { color: i === step ? "#D85A30" : colors.mutedForeground }]}>{s}</Text>
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120, gap: 18, paddingTop: 8 }} keyboardShouldPersistTaps="handled">
        {step === 0 && (
          <View style={{ gap: 16 }}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Task details</Text>
            <View style={{ gap: 6 }}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.chips}>{TASK_CATS.map(c => (
                <TouchableOpacity key={c} style={[styles.chip, { backgroundColor: category === c ? "#D85A30" : colors.card, borderColor: category === c ? "#D85A30" : colors.border }]} onPress={() => setCategory(c)}>
                  <Text style={[styles.chipText, { color: category === c ? "#FFFFFF" : colors.mutedForeground }]}>{c}</Text>
                </TouchableOpacity>
              ))}</View>
            </View>
            <View style={{ gap: 6 }}>
              <Text style={styles.label}>Task title</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} placeholder="e.g. Fix leaking kitchen sink" placeholderTextColor={colors.mutedForeground} value={title} onChangeText={setTitle} />
            </View>
            <View style={{ gap: 6 }}>
              <Text style={styles.label}>Full description</Text>
              <TextInput style={[styles.input, styles.textarea, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} placeholder="Describe the task in detail. Include any requirements or materials needed..." placeholderTextColor={colors.mutedForeground} multiline value={desc} onChangeText={setDesc} />
            </View>
            <View style={{ gap: 8 }}>
              <Text style={styles.label}>Attachments (optional)</Text>
              <TouchableOpacity style={[styles.attachBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Feather name="paperclip" size={18} color={colors.mutedForeground} />
                <Text style={[styles.attachText, { color: colors.mutedForeground }]}>Add photos or files</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {step === 1 && (
          <View style={{ gap: 16 }}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Budget & timeline</Text>
            <View style={{ gap: 8 }}>
              <Text style={styles.label}>Budget type</Text>
              <View style={styles.chips}>
                {BUDGET_TYPES.map(bt => (
                  <TouchableOpacity key={bt} style={[styles.chip, { backgroundColor: budgetType === bt ? "#D85A30" : colors.card, borderColor: budgetType === bt ? "#D85A30" : colors.border }]} onPress={() => setBudgetType(bt)}>
                    <Text style={[styles.chipText, { color: budgetType === bt ? "#FFFFFF" : colors.mutedForeground }]}>{bt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={{ gap: 6 }}>
              <Text style={styles.label}>Budget amount (₦)</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]} placeholder="e.g. 15,000" keyboardType="number-pad" placeholderTextColor={colors.mutedForeground} value={budget} onChangeText={setBudget} />
            </View>
            <View style={{ gap: 8 }}>
              <Text style={styles.label}>Location type</Text>
              <View style={styles.chips}>
                {LOC_TYPES.map(lt => (
                  <TouchableOpacity key={lt} style={[styles.chip, { backgroundColor: locType === lt ? "#D85A30" : colors.card, borderColor: locType === lt ? "#D85A30" : colors.border }]} onPress={() => setLocType(lt)}>
                    <Text style={[styles.chipText, { color: locType === lt ? "#FFFFFF" : colors.mutedForeground }]}>{lt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={{ gap: 16 }}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Review & post</Text>
            <View style={[styles.previewCard, { backgroundColor: colors.card }]}>
              <View style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
                <View style={{ width: 50, height: 50, borderRadius: 14, backgroundColor: "#FAECE7", alignItems: "center", justifyContent: "center" }}>
                  <Feather name="file-text" size={22} color="#D85A30" />
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={{ fontSize: 16, fontFamily: "Inter_700Bold", color: colors.foreground }}>{title || "Your task title"}</Text>
                  <Text style={{ fontSize: 16, fontFamily: "Inter_700Bold", color: "#D85A30" }}>₦{budget ? parseInt(budget).toLocaleString() : "0"} {budgetType}</Text>
                  <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
                    {category ? <View style={{ backgroundColor: "#FAECE7", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}><Text style={{ fontSize: 11, color: "#D85A30", fontFamily: "Inter_500Medium" }}>{category}</Text></View> : null}
                    {locType ? <View style={{ backgroundColor: "#F5F5F5", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}><Text style={{ fontSize: 11, color: "#6B6B6B", fontFamily: "Inter_500Medium" }}>{locType}</Text></View> : null}
                  </View>
                </View>
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10, backgroundColor: "#E8F8F2", padding: 14, borderRadius: 12 }}>
              <Feather name="shield" size={14} color="#1D9E75" />
              <Text style={{ flex: 1, fontSize: 13, color: "#1D9E75", fontFamily: "Inter_400Regular", lineHeight: 18 }}>Budget is held in escrow and only released when you approve the work</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: botPad + 12, backgroundColor: colors.background, borderTopColor: colors.border }]}>
        {step > 0 && <TouchableOpacity style={[styles.backBtn, { backgroundColor: colors.card }]} onPress={() => setStep(step - 1)}><Feather name="arrow-left" size={20} color={colors.foreground} /></TouchableOpacity>}
        <TouchableOpacity style={[styles.nextBtn, { backgroundColor: "#D85A30", flex: 1 }]} onPress={handleNext}>
          <Text style={styles.nextText}>{step === 2 ? "Post Task" : "Continue"}</Text>
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
  sectionTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  label: { fontSize: 13, fontFamily: "Inter_600SemiBold", color: "#6B6B6B" },
  input: { height: 52, borderRadius: 12, paddingHorizontal: 16, fontSize: 15, fontFamily: "Inter_400Regular", borderWidth: 1.5 },
  textarea: { height: 100, paddingTop: 14, textAlignVertical: "top" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5 },
  chipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  attachBtn: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14, borderRadius: 12, borderWidth: 1.5, borderStyle: "dashed" },
  attachText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  previewCard: { borderRadius: 16, padding: 16 },
  bottomBar: { paddingHorizontal: 20, paddingTop: 12, flexDirection: "row", gap: 10, borderTopWidth: 1 },
  backBtn: { width: 52, height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  nextBtn: { height: 52, borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  nextText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#FFFFFF" },
});
