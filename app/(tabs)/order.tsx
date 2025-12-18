import { useLastTab } from "@/context/LastTabContext";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OrderScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setLastTab } = useLastTab();

  useFocusEffect(
    useCallback(() => {
      setLastTab("/(tabs)/order");
    }, [setLastTab])
  );

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 10 }}>
      <StatusBar style="auto" />

      <View className="px-4 py-3 border-b border-gray-200">
        <Text className="text-xl font-semibold text-black">Orders</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="items-center mt-20 px-6">
          <View className="w-16 h-16 rounded-full bg-orange-50 items-center justify-center">
            <Ionicons name="receipt-outline" size={32} color="#F97316" />
          </View>
          <Text className="text-xl font-semibold text-black mt-4">
            No orders yet
          </Text>
          <Text className="text-gray-600 text-center mt-2">
            Your past orders will appear here once you place an order.
          </Text>
          <TouchableOpacity
            className="mt-6 bg-orange-500 px-6 py-3 rounded-full"
            onPress={() => router.replace("/(tabs)")}
          >
            <Text className="text-white font-semibold">Start shopping</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
