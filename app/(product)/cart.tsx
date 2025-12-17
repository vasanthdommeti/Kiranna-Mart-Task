// app/(product)/cart.tsx
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CartScreen() {
  const router = useRouter();
  const [qty, setQty] = useState(8);
  const [needCutlery, setNeedCutlery] = useState(false);
  const youMight = [
    {
      title: "Pickled",
      price: "0.100",
      image: require("../../assets/images/Banner.png"),
    },
    {
      title: "Mexican Pepper Pickle",
      price: "0.150",
      image: require("../../assets/images/Banner.png"),
    },
    {
      title: "Ketchup Box",
      price: "0.200",
      image: require("../../assets/images/Banner.png"),
    },
    {
      title: "Cheddar Sauce",
      price: "0.200",
      image: require("../../assets/images/Banner.png"),
    },
  ];

  const subtotal = 4.8;
  const deliveryFee = 0.5;
  const total = subtotal + deliveryFee;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 rounded-full border border-gray-200"
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View className="ml-4">
          <Text className="text-lg font-bold">Cart</Text>
          <Text className="text-gray-500 text-sm">Ebn 3my</Text>
        </View>
      </View>

      <ScrollView
        contentContainerClassName="pb-12"
        showsVerticalScrollIndicator={false}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
      >
        {/* Cart Item */}
        <View className="px-4 flex-row h-36">
          <View className="flex flex-col justify-between flex-1 pr-4 h-full">
            <View>
              <Text className="text-xl font-medium">Fried Potatoes</Text>
              <TouchableOpacity className="flex-row items-center mt-1">
                <Ionicons name="pencil-outline" size={18} color="#F97316" />
                <Text className="text-orange-500 ml-1">Edit</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-lg font-medium mt-3">
              <Text className="text-lg font-light">KD</Text> 4.800
            </Text>
          </View>
          <View className="relative">
            <Image
              source={require("../../assets/images/Banner.png")}
              className="w-36 h-36 rounded-lg"
              resizeMode="cover"
            />
            <View className="absolute bottom-2 -translate-x-1/2 left-1/2 bg-white rounded-full flex-row items-center px-2 py-2 shadow">
              <TouchableOpacity
                onPress={() => setQty((q) => Math.max(1, q - 1))}
              >
                <MaterialIcons
                  name="delete-outline"
                  size={24}
                  color="#F97316"
                />
              </TouchableOpacity>
              <Text className="px-6 text-lg font-medium">{qty}</Text>
              <TouchableOpacity onPress={() => setQty((q) => q + 1)}>
                <Ionicons name="add-circle-outline" size={24} color="#F97316" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* You might also like… */}
        <View className="bg-orange-200 mt-8 py-8">
          <Text className=" px-4 text-xl font-semibold">
            You might also like…
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4"
            contentContainerStyle={{
              paddingLeft: 16, // match your px-4
              paddingRight: 16, // give the “right‐end” some breathing room
            }}
          >
            {youMight.map((it, i) => {
              const isLast = i === youMight.length - 1;
              return (
                <View key={i} className={`${!isLast ? "mr-4" : ""} w-28`}>
                  <View className="relative">
                    <Image
                      source={it.image}
                      className="w-full h-28 rounded-lg"
                      resizeMode="cover"
                    />
                    <TouchableOpacity className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow">
                      <Ionicons name="add" size={20} color="#F97316" />
                    </TouchableOpacity>
                  </View>
                  <View className="h-24 flex-col justify-between">
                    <Text className="mt-2 text-black text-base font-medium">
                      {it.title}
                    </Text>
                    <Text className="text-black text-base font-medium">
                      <Text className="text-black text-base font-light">
                        KD
                      </Text>{" "}
                      {it.price}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* Special request */}
        <Text className="mt-8 px-4 text-xl font-semibold">Special request</Text>
        <View className="px-4 mt-4 gap-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Ionicons name="restaurant-outline" size={20} color="#333" />
              <View className="ml-3 flex-1">
                <Text className="text-lg font-medium">Cutlery</Text>
                <Text
                  className="text-gray-500 text-sm"
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  Reduce waste. Select this option only if you really need
                  cutlery.
                </Text>
              </View>
            </View>
            <Switch
              value={needCutlery}
              onValueChange={setNeedCutlery}
              thumbColor={needCutlery ? "#F97316" : undefined}
            />
          </View>

          <View className="flex-row items-start">
            <Ionicons name="chatbubble-outline" size={20} color="#333" />
            <View className="ml-3 flex-1">
              <Text className="text-lg font-medium">Any special requests?</Text>
              <Text
                className="text-gray-500 text-sm"
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                Anything else we need to know?
              </Text>
            </View>
          </View>
        </View>

        {/* Save on your order */}
        <Text className="mt-8 px-4 text-xl font-semibold">
          Save on your order
        </Text>
        <View className="mt-2 px-4">
          <View className="flex-row items-center justify-between bg-white border border-gray-300 rounded-2xl overflow-hidden py-2">
            <View className="px-4 flex-row items-center gap-2">
              <Ionicons name="bookmark-outline" size={20} color="#888" />
              <Text className="text-gray-600 font-light">
                Enter voucher code
              </Text>
            </View>
            <TouchableOpacity className="px-4 py-3">
              <Text className="text-orange-500 text-lg font-semibold">
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment summary */}
        <Text className="mt-8 px-4 text-xl font-semibold">Payment summary</Text>
        <View className="px-4 mt-4 p-4 rounded-xl">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600 font-light">Subtotal</Text>
            <Text className="font-light text-gray-600">
              KD {subtotal.toFixed(3)}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600 font-light">Delivery Fee</Text>
            <Text className="font-light text-gray-600">
              KD {deliveryFee.toFixed(3)}
            </Text>
          </View>
          <View className="flex-row justify-between pt-1">
            <Text className="text-lg font-medium">Total amount</Text>
            <Text className="text-lg font-medium">KD {total.toFixed(3)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky footer */}
      <View
        className="absolute left-0 right-0 bottom-0 bg-white border-t border-gray-200 px-4 py-3 flex-row items-center justify-between"
        style={{ paddingBottom: 20 }}
      >
        <TouchableOpacity
          onPress={() => router.push("/(tabs)")}
          className="flex-1 border border-gray-300 mr-2 rounded-full py-3 items-center"
        >
          <Text className="text-base font-medium">Add items</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-orange-500 rounded-full py-3 items-center">
          <Text className="text-base font-semibold text-white">Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
