import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SignUpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState("");
  const [isSignIn, setIsSignIn] = useState(false);
  const [pin, setPin] = useState("");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleContinue = () => {
    if (phone.length < 7) return;
    router.push("/(onboarding)/otp");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.container, { paddingTop: topPad + 16, paddingBottom: botPad + 16 }]}>
        <View style={styles.header}>
          <View style={styles.logoMini}>
            <Text style={styles.logoLetter}>P</Text>
          </View>
          <Text style={styles.brand}>Proxi</Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.title}>{isSignIn ? "Welcome back" : "Welcome to Proxi"}</Text>
          <Text style={styles.subtitle}>
            {isSignIn
              ? "Sign in to access your account"
              : "Create your free account and start trading"}
          </Text>

          <View style={styles.phoneRow}>
            <View style={styles.prefix}>
              <Text style={styles.prefixText}>🇳🇬 +234</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="812 345 6789"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              maxLength={11}
              placeholderTextColor="#B0B0B0"
            />
          </View>

          {isSignIn && (
            <View style={styles.pinContainer}>
              <Text style={styles.pinLabel}>4-digit PIN</Text>
              <TextInput
                style={styles.phoneInput}
                placeholder="• • • •"
                keyboardType="number-pad"
                secureTextEntry
                value={pin}
                onChangeText={setPin}
                maxLength={4}
                placeholderTextColor="#B0B0B0"
              />
            </View>
          )}

          {isSignIn && (
            <TouchableOpacity style={styles.forgotLink}>
              <Text style={styles.linkText}>Forgot PIN?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.btn, phone.length < 7 && styles.btnDisabled]}
            onPress={handleContinue}
            disabled={phone.length < 7}
          >
            <Text style={styles.btnText}>{isSignIn ? "Sign In" : "Continue"}</Text>
            <Feather name="arrow-right" size={18} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.toggleRow} onPress={() => setIsSignIn(!isSignIn)}>
            <Text style={styles.toggleText}>
              {isSignIn ? "Don't have an account? " : "Already have an account? "}
            </Text>
            <Text style={styles.linkText}>{isSignIn ? "Sign up" : "Sign in"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.trust}>
          <Feather name="shield" size={14} color="#1D9E75" />
          <Text style={styles.trustText}>Your number is never shared publicly</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, justifyContent: "space-between" },
  header: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoMini: { width: 32, height: 32, borderRadius: 8, backgroundColor: "#1D9E75", alignItems: "center", justifyContent: "center" },
  logoLetter: { fontSize: 18, fontWeight: "900", color: "#FFFFFF", fontFamily: "Inter_700Bold" },
  brand: { fontSize: 20, fontWeight: "800", color: "#1D9E75", fontFamily: "Inter_700Bold" },
  body: { flex: 1, justifyContent: "center", gap: 16 },
  title: { fontSize: 28, fontWeight: "800", color: "#1A1A1A", fontFamily: "Inter_700Bold", marginBottom: 4 },
  subtitle: { fontSize: 15, color: "#6B6B6B", fontFamily: "Inter_400Regular", marginBottom: 8 },
  phoneRow: { flexDirection: "row", gap: 10 },
  prefix: { backgroundColor: "#F5F5F5", borderRadius: 12, paddingHorizontal: 14, justifyContent: "center", borderWidth: 1.5, borderColor: "#E0E0E0" },
  prefixText: { fontSize: 15, fontFamily: "Inter_500Medium", color: "#1A1A1A" },
  phoneInput: { flex: 1, height: 54, backgroundColor: "#F5F5F5", borderRadius: 12, paddingHorizontal: 16, fontSize: 16, fontFamily: "Inter_400Regular", color: "#1A1A1A", borderWidth: 1.5, borderColor: "#E0E0E0" },
  pinContainer: { gap: 6 },
  pinLabel: { fontSize: 13, fontFamily: "Inter_500Medium", color: "#6B6B6B" },
  forgotLink: { alignSelf: "flex-end" },
  btn: { height: 54, backgroundColor: "#1D9E75", borderRadius: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 8 },
  btnDisabled: { opacity: 0.5 },
  btnText: { fontSize: 16, fontWeight: "700", color: "#FFFFFF", fontFamily: "Inter_700Bold" },
  divider: { flexDirection: "row", alignItems: "center", gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#E0E0E0" },
  dividerText: { color: "#B0B0B0", fontSize: 13, fontFamily: "Inter_400Regular" },
  toggleRow: { flexDirection: "row", justifyContent: "center" },
  toggleText: { fontSize: 14, color: "#6B6B6B", fontFamily: "Inter_400Regular" },
  linkText: { fontSize: 14, color: "#1D9E75", fontFamily: "Inter_600SemiBold" },
  trust: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  trustText: { fontSize: 12, color: "#6B6B6B", fontFamily: "Inter_400Regular" },
});
