import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";

export default function ProfileSetupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login } = useApp();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleComplete = async () => {
    const name = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ") || "User";
    await login({
      name,
      phone: "+234 812 345 6789",
      type: "Trader",
      location: "Ikeja, Lagos",
    });
    router.replace("/(tabs)/explore");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: topPad + 16, paddingBottom: botPad + 24 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Set up your profile</Text>
        <Text style={styles.subtitle}>Help buyers and sellers know who they're dealing with</Text>

        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>
              {firstName ? firstName[0].toUpperCase() : "?"}
            </Text>
            <View style={styles.cameraBtn}>
              <Feather name="camera" size={14} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.avatarHint}>Tap to add photo</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>First name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Tunde"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              placeholderTextColor="#B0B0B0"
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Last name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Adebayo"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              placeholderTextColor="#B0B0B0"
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Short bio (optional)</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              placeholder="Tell people what you sell or offer..."
              value={bio}
              onChangeText={setBio}
              multiline
              maxLength={150}
              placeholderTextColor="#B0B0B0"
            />
            <Text style={styles.charCount}>{bio.length}/150</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.btn, !firstName && styles.btnDisabled]}
          onPress={handleComplete}
          disabled={!firstName}
        >
          <Text style={styles.btnText}>Complete setup</Text>
          <Feather name="check" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, gap: 24 },
  title: { fontSize: 26, fontWeight: "800", color: "#1A1A1A", fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 14, color: "#6B6B6B", fontFamily: "Inter_400Regular", lineHeight: 20 },
  avatarSection: { alignItems: "center", gap: 8 },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: "#E8F8F2", alignItems: "center", justifyContent: "center", position: "relative" },
  avatarInitial: { fontSize: 36, fontWeight: "700", color: "#1D9E75", fontFamily: "Inter_700Bold" },
  cameraBtn: { position: "absolute", bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: "#1D9E75", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#FFFFFF" },
  avatarHint: { fontSize: 13, color: "#6B6B6B", fontFamily: "Inter_400Regular" },
  form: { gap: 16 },
  field: { gap: 6 },
  label: { fontSize: 13, fontWeight: "600", color: "#6B6B6B", fontFamily: "Inter_600SemiBold" },
  input: { height: 52, backgroundColor: "#F5F5F5", borderRadius: 12, paddingHorizontal: 16, fontSize: 16, fontFamily: "Inter_400Regular", color: "#1A1A1A", borderWidth: 1.5, borderColor: "#E0E0E0" },
  bioInput: { height: 90, paddingTop: 14, textAlignVertical: "top" },
  charCount: { alignSelf: "flex-end", fontSize: 12, color: "#B0B0B0", fontFamily: "Inter_400Regular" },
  btn: { height: 54, backgroundColor: "#1D9E75", borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  btnDisabled: { opacity: 0.4 },
  btnText: { fontSize: 16, fontWeight: "700", color: "#FFFFFF", fontFamily: "Inter_700Bold" },
});
