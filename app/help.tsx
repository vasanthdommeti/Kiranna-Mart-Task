import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { LayoutAnimation, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const FAQ_DATA = [
  {
    question: "Order not delivered",
    answer:
      "Check the order status in Orders. If it shows delivered but you didn't receive it, contact support and we’ll investigate and issue a refund if needed.",
  },
  {
    question: "Report a wrong or missing item",
    answer:
      "Go to the order details, tap 'Report issue', select the missing/wrong items, and submit. We’ll review and process a refund or replacement.",
  },
  {
    question: "Payment and refunds",
    answer:
      "Refunds typically post in 3–5 business days depending on your bank. If you used wallet credit, the refund is instant.",
  },
  {
    question: "Change delivery address",
    answer:
      "You can change the address before the order is accepted. After that, contact support to request an address update.",
  },
  {
    question: "App feedback",
    answer:
      "We love feedback! Share feature requests or bugs via the feedback form in settings or email support@kiranna-mart.com.",
  },
];

type DropdownProps = {
  title: string;
  body: string;
  isOpen: boolean;
  onToggle: () => void;
};

function FAQDropdown({ title, body, isOpen, onToggle }: DropdownProps) {
  return (
    <View className="border-b border-gray-200">
      <TouchableOpacity
        className="flex-row items-center justify-between px-4 py-4"
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          onToggle();
        }}
      >
        <Text className="text-base text-black flex-1 pr-3">{title}</Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={18}
          color="#9ca3af"
        />
      </TouchableOpacity>
      {isOpen && (
        <View className="px-4 pb-4">
          <Text className="text-gray-600 leading-relaxed">{body}</Text>
        </View>
      )}
    </View>
  );
}

if (Platform.OS === "android" && LayoutAnimation.configureNext) {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
}

export default function HelpScreen() {
  const insets = useSafeAreaInsets();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const router = useRouter();

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 10 }}>
      <View className="flex-row items-center px-4 mb-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="rounded-full border border-gray-300 p-2"
        >
          <Ionicons name="arrow-back" size={18} color="#111827" />
        </TouchableOpacity>
        <Text className="ml-3 text-lg font-semibold text-black">Get help</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-orange-50 rounded-2xl p-4 flex-row items-start gap-3">
          <Ionicons name="chatbubble-ellipses-outline" size={22} color="#f97316" />
          <View className="flex-1">
            <Text className="text-lg font-semibold text-black">
              Need assistance?
            </Text>
            <Text className="text-gray-700 mt-1">
              Chat with support or browse quick answers to common questions.
            </Text>
          </View>
        </View>

        <View className="mt-4 bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {FAQ_DATA.map((item, idx) => (
            <FAQDropdown
              key={item.question}
              title={item.question}
              body={item.answer}
              isOpen={openIndex === idx}
              onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
