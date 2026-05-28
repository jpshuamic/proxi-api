import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList, Platform, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CONVERSATIONS, type Message } from "@/constants/data";
import { useColors } from "@/hooks/useColors";

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [text, setText] = useState("");
  const conv = CONVERSATIONS.find(c => c.id === id);
  const [messages, setMessages] = useState<Message[]>(conv?.messages ?? []);
  const flatRef = useRef<FlatList>(null);
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  useEffect(() => {
    if (conv) {
      navigation.setOptions({
        title: conv.name,
        headerRight: () => (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: (conv.score >= 70 ? "#1D9E75" : "#EF9F27") + "18", marginRight: 16 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: conv.score >= 70 ? "#1D9E75" : "#EF9F27" }} />
            <Text style={{ fontSize: 12, fontFamily: "Inter_600SemiBold", color: conv.score >= 70 ? "#1D9E75" : "#EF9F27" }}>{conv.score}</Text>
          </View>
        ),
      });
    }
  }, [conv]);

  const send = () => {
    if (!text.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const msg: Message = {
      id: Date.now().toString(),
      from: "me",
      text: text.trim(),
      time: new Date().toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(prev => [...prev, msg]);
    setText("");
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isMe = item.from === "me";
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
        <Text style={[styles.timeText, { color: isMe ? "rgba(255,255,255,0.7)" : colors.mutedForeground }]}>{item.time}</Text>
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
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior="padding" keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}>
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
        contentContainerStyle={{ padding: 16, gap: 8, paddingBottom: 16 }}
        onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: true })}
        scrollEnabled={messages.length > 0}
        showsVerticalScrollIndicator={false}
      />

      <View style={[styles.inputBar, { paddingBottom: botPad + 8, backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity style={[styles.attachIconBtn, { backgroundColor: colors.card }]}>
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
        <TouchableOpacity style={[styles.sendBtn, { backgroundColor: text.trim() ? "#1D9E75" : colors.card }]} onPress={send}>
          <Feather name="send" size={18} color={text.trim() ? "#FFFFFF" : colors.mutedForeground} />
        </TouchableOpacity>
      </View>
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
  timeText: { fontSize: 11, fontFamily: "Inter_400Regular", alignSelf: "flex-end" },
  offerCard: { maxWidth: "85%", padding: 14, borderRadius: 18, gap: 4, marginVertical: 4 },
  offerActionBtn: { flex: 1, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  inputBar: { paddingHorizontal: 12, paddingTop: 10, flexDirection: "row", alignItems: "flex-end", gap: 8, borderTopWidth: 1 },
  attachIconBtn: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  input: { flex: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, fontFamily: "Inter_400Regular", maxHeight: 100, borderWidth: 1.5 },
  sendBtn: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center" },
});
