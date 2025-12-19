import { useCart } from "@/context/CartContext";
import { useLocation } from "@/context/LocationContext";
import { useOrdersStore } from "@/store/orders";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CheckoutScreen() {
  const router = useRouter();
  const { cartItems, clearCart, orderNote } = useCart();
  const { address } = useLocation();
  const addOrder = useOrdersStore((s) => s.addOrder);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");

  const subtotal = useMemo(
    () =>
      cartItems.reduce((sum, c) => sum + (c.item.price ?? 0) * c.quantity, 0),
    [cartItems]
  );
  const deliveryFee = cartItems.length > 0 ? 0.5 : 0;
  const total = subtotal + deliveryFee;

  const pay = async () => {
    setProcessing(true);
    /**
     * NOTE:
     * This is a simulated checkout. Hook up a real payment provider when a
     * backend is available.
     */
    const now = Date.now();
    const orderId = `ord-${now}`;
    const orderNumber = `#KM${now.toString().slice(-6)}`;
    const items = cartItems.map((c) => ({
      id: c.item.id,
      name: c.item.name,
      price: c.item.price ?? 0,
      quantity: c.quantity,
      note: c.note,
      image: c.item.image,
    }));

    addOrder({
      id: orderId,
      orderNumber,
      status: "Order placed",
      createdAt: now,
      subtotal,
      deliveryFee,
      total,
      note: orderNote || undefined,
      address,
      items,
      timeline: [
        { key: "placed", label: "Order placed", at: now, status: "current" },
        { key: "preparing", label: "Preparing order", status: "pending" },
        { key: "on-the-way", label: "Driver on the way", status: "pending" },
        { key: "delivered", label: "Delivered", status: "pending" },
      ],
    });

    setTimeout(() => {
      clearCart();
      setProcessing(false);
      Alert.alert("Success", "Order placed successfully.", [
        {
          text: "OK",
          onPress: () => router.replace(`/(tabs)/order/${orderId}`),
        },
      ]);
    }, 500);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 rounded-full border border-gray-200"
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="ml-4 text-lg font-bold">Checkout</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <Text className="text-xl font-semibold text-black">Order summary</Text>
        {cartItems.map((c) => (
          <View
            key={c.item.id}
            className="flex-row justify-between mt-3 border-b border-gray-200 pb-3"
          >
            <View>
              <Text className="text-base font-medium">{c.item.name}</Text>
              <Text className="text-gray-500 text-sm">
                Qty {c.quantity} • KD {(c.item.price ?? 0).toFixed(3)}
              </Text>
            </View>
            <Text className="text-base font-semibold">
              KD {((c.item.price ?? 0) * c.quantity).toFixed(3)}
            </Text>
          </View>
        ))}

        <View className="mt-4 bg-white rounded-xl border border-gray-200 p-4">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Subtotal</Text>
            <Text className="text-gray-800">KD {subtotal.toFixed(3)}</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Delivery fee</Text>
            <Text className="text-gray-800">KD {deliveryFee.toFixed(3)}</Text>
          </View>
          <View className="flex-row justify-between pt-2">
            <Text className="text-lg font-semibold">Total</Text>
            <Text className="text-lg font-semibold">KD {total.toFixed(3)}</Text>
          </View>
        </View>

        <Text className="mt-6 text-base font-semibold text-black">
          Payment method
        </Text>
        <View className="mt-3 bg-white rounded-2xl border border-gray-200 p-4">
          <TouchableOpacity
            className="flex-row items-center justify-between"
            onPress={() => setPaymentMethod("cash")}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-orange-50 items-center justify-center">
                <Ionicons name="cash-outline" size={20} color="#F97316" />
              </View>
              <View className="ml-3">
                <Text className="text-base font-semibold">Cash on delivery</Text>
                <Text className="text-sm text-gray-500">
                  Pay at your doorstep
                </Text>
              </View>
            </View>
            <View
              className="w-5 h-5 rounded-full border border-orange-500 items-center justify-center"
              style={{
                backgroundColor: paymentMethod === "cash" ? "#F97316" : "#fff",
              }}
            >
              {paymentMethod === "cash" ? (
                <Ionicons name="checkmark" size={12} color="#fff" />
              ) : null}
            </View>
          </TouchableOpacity>

          <View className="h-px bg-gray-100 my-4" />

          <TouchableOpacity
            className="flex-row items-center justify-between"
            onPress={() => setPaymentMethod("card")}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
                <Ionicons name="card-outline" size={20} color="#333" />
              </View>
              <View className="ml-3">
                <Text className="text-base font-semibold">Card</Text>
                <Text className="text-sm text-gray-500">
                  Add card for faster checkout
                </Text>
              </View>
            </View>
            <View
              className="w-5 h-5 rounded-full border border-orange-500 items-center justify-center"
              style={{
                backgroundColor: paymentMethod === "card" ? "#F97316" : "#fff",
              }}
            >
              {paymentMethod === "card" ? (
                <Ionicons name="checkmark" size={12} color="#fff" />
              ) : null}
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="mt-6 bg-orange-500 rounded-full py-3 items-center"
          onPress={pay}
          disabled={processing}
        >
          <Text className="text-white text-base font-semibold">
            {processing ? "Processing..." : "Place order"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
