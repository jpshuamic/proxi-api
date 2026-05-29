import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated, FlatList, Modal, Platform, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CONVERSATIONS, type Message } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

type MsgStatus = "sent" | "delivered" | "seen";

const AUTO_REPLIES = [
  "Yes, still available! When would you like to meet?",
  "That price is a bit low for me — can you do a bit more?",
  "Sure! I can arrange delivery by tomorrow.",
  "Let me check my schedule and get back to you shortly.",
  "Please use the Proxi escrow so we're both protected 🔒",
];

function ReadReceipt({ status }: { status: MsgStatus }) {
  const color = status === "seen" ? "#1D9E75" : "rgba(255,255,255,0.55)";
  return (
    <View style={{ flexDirection: "row", gap: 1, alignSelf: "flex-end" }}>
      <Feather name="check" size={12} color={color} />
      {status !== "sent" && <Feather name="check" size={12} color={color} style={{ marginLeft: -6 }} />}
    </View>
  );
}

function TypingIndicator({ visible, name }: { visible: boolean; name: string }) {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -5, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(600),
        ])
      ).start();
    animate(dot1, 0);
    animate(dot2, 150);
    animate(dot3, 300);
    return () => { dot1.stopAnimation(); dot2.stopAnimation(); dot3.stopAnimation(); };
  }, [visible]);

  if (!visible) return null;
  return (
    <View style={ty.wrap}>
      <View style={ty.bubble}>
        <Text style={ty.name}>{name.split(" ")[0]} is typing</Text>
        <View style={ty.dots}>
          {[dot1, dot2, dot3].map((d, i) => (
            <Animated.View key={i} style={[ty.dot, { transform: [{ translateY: d }] }]} />
          ))}
        </View>
      </View>
    </View>
  );
}
const ty = StyleSheet.create({
  wrap: { paddingHorizontal: 16, paddingVertical: 6 },
  bubble: { alignSelf: "flex-start", backgroundColor: "#F0F0F0", borderRadius: 18, borderBottomLeftRadius: 4, paddingHorizontal: 14, paddingVertical: 10, flexDirection: "row", alignItems: "center", gap: 8 },
  name: { fontSize: 12, color: "#888", fontFamily: "Inter_400Regular" },
  dots: { flexDirection: "row", gap: 4, alignItems: "center" },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#888" },
});

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");
  const conv = CONVERSATIONS.find(c => c.id === id);
  const [messages, setMessages] = useState<Message[]>(conv?.messages ?? []);
  const [msgStatuses, setMsgStatuses] = useState<Record<string, MsgStatus>>({});
  const [isTyping, setIsTyping] = useState(false);
  const [attachMenuVisible, setAttachMenuVisible] = useState(false);
  const flatRef = useRef<FlatList>(null);
  const tabBarH = Platform.OS === "web" ? 84 : 58 + insets.bottom;

  useEffect(() => {
    if (conv) {
      navigation.setOptions({
        title: conv.name,
        headerRight: () => {
          const color = conv.score >= 70 ? "#1D9E75" : "#EF9F27";
          return (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: color + "18", marginRight: 16 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color }} />
              <Text style={{ fontSize: 12, fontFamily: "Inter_600SemiBold", color }}>{conv.score}/100</Text>
            </View>
          );
        },
      });
    }
  }, [conv]);

  const send = () => {
    if (!text.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const msgId = Date.now().toString();
    const msg: Message = {
      id: msgId,
      from: "me",
      text: text.trim(),
      time: new Date().toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(prev => [...prev, msg]);
    setText("");

    // Read receipt progression
    setMsgStatuses(prev => ({ ...prev, [msgId]: "sent" }));
    setTimeout(() => setMsgStatuses(prev => ({ ...prev, [msgId]: "delivered" })), 1200);
    setTimeout(() => setMsgStatuses(prev => ({ ...prev, [msgId]: "seen" })), 3500);

    // Typing indicator then auto-reply
    setTimeout(() => setIsTyping(true), 1000);
    setTimeout(() => {
      setIsTyping(false);
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        from: "them",
        text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
        time: new Date().toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages(prev => [...prev, reply]);
    }, 3200);
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isMe = item.from === "me";
    const status = msgStatuses[item.id] as MsgStatus | undefined;

    if (item.isOffer) {
      return (
        <View style={[styles.offerCard, { alignSelf: isMe ? "flex-end" : "flex-start", backgroundColor: isMe ? "#E8F8F2" : colors.card }]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Feather name="tag" size={14} color="#1D9E75" />
            <Text style={{ fontSize: 12, fontFamily: "Inter_600SemiBold", color: "#1D9E75" }}>Offer made</Text>
          </View>
          <Text style={{ fontSize: 20, fontFamily: "Inter_700Bold", color: colors.foreground }}>₦{item.offerAmount?.toLocaleString()}</Text>
          <Text style={[styles.msgText, { color: colors.mutedForeground }]}>{item.text}</Text>
          {!isMe && (
            <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
              <TouchableOpacity style={[styles.offerActionBtn, { backgroundColor: "#1D9E75" }]}>
                <Text style={{ fontSize: 12, color: "#FFFFFF", fontFamily: "Inter_700Bold" }}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.offerActionBtn, { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border }]}>
                <Text style={{ fontSize: 12, color: colors.foreground, fontFamily: "Inter_600SemiBold" }}>Counter</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.offerActionBtn, { backgroundColor: "#FCE9E9" }]}>
                <Text style={{ fontSize: 12, color: "#E24B4A", fontFamily: "Inter_600SemiBold" }}>Decline</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    }

    return (
      <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem, { backgroundColor: isMe ? "#1D9E75" : colors.card }]}>
        <Text style={[styles.msgText, { color: isMe ? "#FFFFFF" : colors.foreground }]}>{item.text}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
          <Text style={[styles.timeText, { color: isMe ? "rgba(255,255,255,0.65)" : colors.mutedForeground }]}>{item.time}</Text>
          {isMe && status && <ReadReceipt status={status} />}
        </View>
      </View>
    );
  };

  if (!conv) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: colors.mutedForeground }}>Conversation not found</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {conv.listingTitle && (
        <View style={[styles.listingBanner, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <Feather name="tag" size={14} color={colors.primary} />
          <Text style={[styles.listingBannerText, { color: colors.mutedForeground }]} numberOfLines={1}>
            re: <Text style={{ color: colors.primary }}>{conv.listingTitle}</Text>
          </Text>
        </View>
      )}

      <FlatList
        ref={flatRef}
        data={messages}
        keyExtractor={m => m.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, gap: 8, paddingBottom: 20 }}
        onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <TypingIndicator visible={isTyping} name={conv.name} />
        }
      />

      {/* Input bar */}
      <View style={[styles.inputBar, {
        paddingBottom: tabBarH + 8,
        backgroundColor: colors.background,
        borderTopColor: colors.border,
      }]}>
        <TouchableOpacity
          style={[styles.attachIconBtn, { backgroundColor: colors.card }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setAttachMenuVisible(true);
          }}
        >
          <Feather name="paperclip" size={18} color={colors.mutedForeground} />
        </TouchableOpacity>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.foreground, borderColor: colors.border }]}
          placeholder="Type a message..."
          placeholderTextColor={colors.mutedForeground}
          value={text}
          onChangeText={setText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: text.trim() ? "#1D9E75" : colors.card }]}
          onPress={send}
        >
          <Feather name="send" size={18} color={text.trim() ? "#FFFFFF" : colors.mutedForeground} />
        </TouchableOpacity>
      </View>

      {/* Attachment menu modal */}
      <Modal
        visible={attachMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAttachMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setAttachMenuVisible(false)}
        >
          <View style={[styles.attachMenu, { backgroundColor: colors.background, borderColor: colors.border, bottom: tabBarH + 80 }]}>
            {[
              { icon: "image" as const, label: "Photo / Image", color: "#7F77DD" },
              { icon: "file-text" as const, label: "Document / PDF", color: "#185FA5" },
              { icon: "camera" as const, label: "Take a photo", color: "#1D9E75" },
              { icon: "tag" as const, label: "Send an offer", color: "#D85A30" },
            ].map(item => (
              <TouchableOpacity
                key={item.label}
                style={styles.attachItem}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setAttachMenuVisible(false);
                }}
              >
                <View style={[styles.attachIcon, { backgroundColor: item.color + "15" }]}>
                  <Feather name={item.icon} size={18} color={item.color} />
                </View>
                <Text style={[styles.attachLabel, { color: colors.foreground }]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  listingBanner: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1 },
  listingBannerText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  bubble: { maxWidth: "78%", padding: 12, borderRadius: 18, gap: 4 },
  bubbleMe: { alignSelf: "flex-end", borderBottomRightRadius: 4 },
  bubbleThem: { alignSelf: "flex-start", borderBottomLeftRadius: 4 },
  msgText: { fontSize: 15, fontFamily: "Inter_400Regular", lineHeight: 21 },
  timeText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  offerCard: { maxWidth: "85%", padding: 14, borderRadius: 18, gap: 4, marginVertical: 4 },
  offerActionBtn: { flex: 1, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  inputBar: { paddingHorizontal: 12, paddingTop: 10, flexDirection: "row", alignItems: "flex-end", gap: 8, borderTopWidth: 1 },
  attachIconBtn: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  input: { flex: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, fontFamily: "Inter_400Regular", maxHeight: 100, borderWidth: 1.5 },
  sendBtn: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  attachMenu: { position: "absolute", left: 16, right: 16, borderRadius: 20, borderWidth: 1, padding: 8, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 10 },
  attachItem: { flexDirection: "row", alignItems: "center", gap: 14, padding: 12, borderRadius: 12 },
  attachIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  attachLabel: { fontSize: 15, fontFamily: "Inter_500Medium" },
});
