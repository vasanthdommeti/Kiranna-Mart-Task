import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
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
        <Text className="ml-3 text-lg font-semibold text-black">About app</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="bg-orange-50 rounded-2xl p-4 flex-row items-start gap-3">
          <Ionicons name="information-circle-outline" size={22} color="#f97316" />
          <View className="flex-1">
            <Text className="text-lg font-semibold text-black">
              Kiranna-Mart
            </Text>
            <Text className="text-gray-700 mt-1">
              Quick commerce app to discover nearby stores, place instant orders,
              and track delivery in one seamless experience.
            </Text>
          </View>
        </View>

        <View className="mt-4 bg-white rounded-2xl border border-gray-200 divide-y divide-gray-200">
          {[
            { label: "Version", value: "1.0.0" },
            { label: "Support", value: "support@kiranna-mart.com" },
            { label: "Privacy", value: "Your data is stored locally for auth" },
          ].map((item) => (
            <View
              key={item.label}
              className="flex-row justify-between items-center px-4 py-4"
            >
              <Text className="text-base text-gray-600">{item.label}</Text>
              <Text className="text-base text-black">{item.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
