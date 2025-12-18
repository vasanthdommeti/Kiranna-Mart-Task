import { useOrdersStore } from "@/store/orders";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const formatDateTime = (ts: number) =>
  new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export default function OrderDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const orders = useOrdersStore((s) => s.orders);

  const order = useMemo(
    () => orders.find((o) => o.id === params.id),
    [orders, params.id]
  );

  if (!order) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 rounded-full border border-gray-200"
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text className="ml-4 text-lg font-semibold">Order details</Text>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="alert-circle-outline" size={32} color="#F97316" />
          <Text className="text-lg font-semibold mt-3">
            Order not found
          </Text>
          <TouchableOpacity
            className="mt-4 px-5 py-3 rounded-full bg-orange-500"
            onPress={() => router.replace("/(tabs)/order")}
          >
            <Text className="text-white font-semibold">Back to orders</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentStatus =
    order.timeline.find((t) => t.status === "current")?.label || order.status;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 rounded-full border border-gray-200"
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="ml-4 text-lg font-semibold">Order details</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <View className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-bold text-black">
              {order.orderNumber}
            </Text>
            <View className="px-3 py-1 rounded-full bg-orange-50 border border-orange-200">
              <Text className="text-orange-600 text-xs font-semibold">
                {currentStatus}
              </Text>
            </View>
          </View>
          <Text className="mt-2 text-gray-600">
            Placed on {formatDateTime(order.createdAt)}
          </Text>
          {order.address ? (
            <View className="flex-row items-start mt-3">
              <Ionicons name="location-outline" size={18} color="#555" />
              <Text className="ml-2 text-gray-700 flex-1">{order.address}</Text>
            </View>
          ) : null}
          <View className="flex-row justify-between mt-4">
            <Text className="text-gray-600">Subtotal</Text>
            <Text className="text-gray-800">
              KD {order.subtotal.toFixed(3)}
            </Text>
          </View>
          <View className="flex-row justify-between mt-2">
            <Text className="text-gray-600">Delivery fee</Text>
            <Text className="text-gray-800">
              KD {order.deliveryFee.toFixed(3)}
            </Text>
          </View>
          <View className="flex-row justify-between mt-3">
            <Text className="text-lg font-semibold text-black">Total</Text>
            <Text className="text-lg font-semibold text-black">
              KD {order.total.toFixed(3)}
            </Text>
          </View>
          {order.note ? (
            <View className="mt-3 bg-gray-50 rounded-xl p-3">
              <Text className="text-sm font-semibold text-gray-700">
                Notes
              </Text>
              <Text className="text-gray-700 mt-1">{order.note}</Text>
            </View>
          ) : null}
        </View>

        <Text className="mt-6 mb-2 text-base font-semibold text-black">
          Items
        </Text>
        <View className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
          {order.items.map((item) => (
            <View key={item.id} className="flex-row p-4 items-center">
              <Image
                source={item.image}
                className="w-14 h-14 rounded-lg"
                resizeMode="cover"
              />
              <View className="flex-1 ml-3">
                <Text className="text-base font-semibold text-black">
                  {item.name}
                </Text>
                <Text className="text-gray-500 text-sm">
                  Qty {item.quantity} • KD {item.price.toFixed(3)}
                </Text>
                {item.note ? (
                  <Text className="text-gray-600 text-sm mt-1">
                    Note: {item.note}
                  </Text>
                ) : null}
              </View>
              <Text className="text-base font-semibold">
                KD {(item.price * item.quantity).toFixed(3)}
              </Text>
            </View>
          ))}
        </View>

        <Text className="mt-6 mb-2 text-base font-semibold text-black">
          Status timeline
        </Text>
        <View className="bg-white rounded-2xl border border-gray-200 p-4">
          {order.timeline.map((step, idx) => {
            const isDone = step.status === "done";
            const isCurrent = step.status === "current";
            const isLast = idx === order.timeline.length - 1;
            const circleColor = isDone || isCurrent ? "#F97316" : "#d1d5db";
            return (
              <View key={step.key} className="flex-row">
                <View className="items-center mr-3">
                  <View
                    className="w-4 h-4 rounded-full items-center justify-center"
                    style={{ backgroundColor: circleColor }}
                  >
                    {isDone ? (
                      <Ionicons name="checkmark" size={10} color="#fff" />
                    ) : null}
                  </View>
                  {!isLast && (
                    <View
                      className="w-px flex-1"
                      style={{
                        backgroundColor: "#e5e7eb",
                        minHeight: 18,
                      }}
                    />
                  )}
                </View>
                <View className={`pb-4 flex-1 ${isLast ? "pb-0" : ""}`}>
                  <Text className="text-base font-semibold text-black">
                    {step.label}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {step.at ? formatDateTime(step.at) : "Pending"}
                  </Text>
                  {isCurrent ? (
                    <Text className="text-orange-600 text-sm mt-1">
                      In progress
                    </Text>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
