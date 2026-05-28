import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Platform, StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const OTP_LENGTH = 6;

export default function OTPScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [code, setCode] = useState(Array(OTP_LENGTH).fill(""));
  const [seconds, setSeconds] = useState(45);
  const refs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (seconds > 0) {
      const t = setInterval(() => setSeconds((s) => s - 1), 1000);
      return () => clearInterval(t);
    }
  }, [seconds]);

  const handleChange = (val: string, idx: number) => {
    const c = [...code];
    c[idx] = val.slice(-1);
    setCode(c);
    if (val && idx < OTP_LENGTH - 1) refs.current[idx + 1]?.focus();
    if (!val && idx > 0) refs.current[idx - 1]?.focus();
    if (c.join("").length === OTP_LENGTH) {
      setTimeout(() => router.replace("/(onboarding)/user-type"), 300);
    }
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { paddingTop: topPad + 16, paddingBottom: botPad + 16 }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      <View style={styles.body}>
        <Text style={styles.title}>Verify your number</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to{"\n"}
          <Text style={styles.phone}>+234 812 *** 6789</Text>
        </Text>

        <View style={styles.boxes}>
          {code.map((c, i) => (
            <TextInput
              key={i}
              ref={(r) => { refs.current[i] = r; }}
              style={[styles.box, c ? styles.boxFilled : null]}
              value={c}
              onChangeText={(v) => handleChange(v, i)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        <View style={styles.timerRow}>
          {seconds > 0 ? (
            <Text style={styles.timerText}>
              Resend in{" "}
              <Text style={styles.timerCount}>
                0:{seconds.toString().padStart(2, "0")}
              </Text>
            </Text>
          ) : (
            <TouchableOpacity onPress={() => setSeconds(45)}>
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", paddingHorizontal: 24 },
  back: { paddingVertical: 8, paddingRight: 16, alignSelf: "flex-start" },
  backIcon: { fontSize: 22, color: "#1A1A1A" },
  body: { flex: 1, justifyContent: "center", gap: 20 },
  title: { fontSize: 28, fontWeight: "800", color: "#1A1A1A", fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 15, color: "#6B6B6B", fontFamily: "Inter_400Regular", lineHeight: 22 },
  phone: { color: "#1A1A1A", fontFamily: "Inter_600SemiBold" },
  boxes: { flexDirection: "row", gap: 10, justifyContent: "center" },
  box: {
    width: 48, height: 56, borderRadius: 12,
    borderWidth: 1.5, borderColor: "#E0E0E0",
    backgroundColor: "#F5F5F5", textAlign: "center",
    fontSize: 22, fontFamily: "Inter_700Bold", color: "#1A1A1A",
  },
  boxFilled: { borderColor: "#1D9E75", backgroundColor: "#F0FBF7" },
  timerRow: { alignItems: "center" },
  timerText: { fontSize: 14, color: "#6B6B6B", fontFamily: "Inter_400Regular" },
  timerCount: { color: "#1D9E75", fontFamily: "Inter_600SemiBold" },
  resendText: { fontSize: 15, color: "#1D9E75", fontFamily: "Inter_600SemiBold" },
});
