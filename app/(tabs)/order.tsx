import { useLastTab } from "@/context/LastTabContext";
import { useOrdersStore } from "@/store/orders";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useMemo } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OrderScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setLastTab } = useLastTab();
  const orders = useOrdersStore((s) => s.orders);

  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => b.createdAt - a.createdAt),
    [orders]
  );

  const statusLabel = (order: (typeof orders)[number]) => {
    const current = order.timeline.find((t) => t.status === "current");
    const latestDone = order.timeline.find((t) => t.status === "done");
    return current?.label ?? latestDone?.label ?? order.status;
  };

  const formatDateTime = (ts: number) =>
    new Date(ts).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

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
        {sortedOrders.length === 0 ? (
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
        ) : (
          sortedOrders.map((order) => {
            const itemsPreview =
              order.items.length > 1
                ? `${order.items[0].name} +${order.items.length - 1} more`
                : order.items[0].name;
            return (
              <TouchableOpacity
                key={order.id}
                className="mb-4 bg-white rounded-2xl border border-gray-200 p-4 shadow-sm"
                onPress={() => router.push(`/(tabs)/order/${order.id}`)}
                activeOpacity={0.8}
              >
                <View className="flex-row justify-between items-center">
                  <Text className="text-lg font-semibold text-black">
                    {order.orderNumber}
                  </Text>
                  <View className="px-3 py-1 rounded-full bg-orange-50 border border-orange-200">
                    <Text className="text-orange-600 text-xs font-semibold">
                      {statusLabel(order)}
                    </Text>
                  </View>
                </View>

                <Text className="mt-1 text-gray-600">
                  {itemsPreview}
                </Text>
                <Text className="mt-3 text-base font-semibold text-black">
                  KD {order.total.toFixed(3)}
                </Text>
                <Text className="mt-1 text-gray-500 text-sm">
                  {formatDateTime(order.createdAt)}
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
