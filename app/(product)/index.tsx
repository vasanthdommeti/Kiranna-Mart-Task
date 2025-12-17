"use client";
import ProductModal from "@/components/ProductModal";
import { useCart } from "@/context/CartContext";
import { TAB_LABELS } from "@/data";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProductCardScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { selected } = useCart();
  const item = selected!;
  const [activeTab, setActiveTab] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const tabScrollRef = useRef<ScrollView>(null);
  const sectionYs = useRef<number[]>([]);

  const onVerticalScroll = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    let idx = 0;
    for (let i = 0; i < sectionYs.current.length; i++) {
      if (y + 50 >= sectionYs.current[i]) idx = i;
      else break;
    }
    if (idx !== activeTab) {
      setActiveTab(idx);
      tabScrollRef.current?.scrollTo({ x: idx * 100, animated: true });
    }
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingBottom: insets.bottom }}>
      <StatusBar style="auto" />
      {/* Hero image + overlay buttons */}

      <ProductModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        image={require("../../assets/images/Banner.png")}
        title="Fried Potatoes"
        subtitle="Top rated"
        description="Crispy potato slices, fried to perfection for a satisfying crunch."
        price="KWD 0.600"
      />
      <View className="flex-none">
        <Image source={item.image} className="w-full h-64" resizeMode="cover" />

        <View
          className="absolute top-0 left-0 right-0 flex-row justify-between px-4 pt-4"
          style={{ paddingTop: insets.top }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white p-2 rounded-full shadow"
          >
            <Ionicons name="arrow-back" size={22} color="#333" />
          </TouchableOpacity>
          <View className="flex-row gap-2">
            <TouchableOpacity className="bg-white p-2 rounded-full shadow">
              <Ionicons name="heart-outline" size={22} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-white p-2 rounded-full shadow">
              <MaterialIcons name="share" size={22} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-white p-2 rounded-full shadow">
              <Ionicons name="search" size={22} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Restaurant Info card */}
      <View className="flex-none mx-4 -mt-10 bg-white rounded-2xl p-4 shadow">
        <View className="flex-row items-center">
          <Image
            source={item.image}
            className="w-12 h-12 rounded-full"
            resizeMode="cover"
          />
          <View className="ml-4 flex-1">
            <Text className="text-lg font-bold">{item.name}</Text>
            <Text className="text-gray-500 text-sm">Shawarma, Arabic</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#888" />
        </View>
        <View className="flex-row items-center mt-3 space-x-3">
          <View className="flex-row items-center bg-gray-100 px-2 py-1 rounded">
            <Ionicons name="time-outline" size={16} color="#555" />
            <Text className="ml-1 text-sm text-gray-700">45 mins</Text>
          </View>
          <View className="flex-row items-center bg-gray-100 px-2 py-1 rounded">
            <Ionicons name="bicycle" size={16} color="#555" />
            <Text className="ml-1 text-sm text-gray-700">KWD 0.950</Text>
          </View>
          <View className="flex-row items-center bg-gray-100 px-2 py-1 rounded">
            <Text className="text-sm text-gray-700">
              Delivered by restaurant
            </Text>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color="#555"
              className="ml-1"
            />
          </View>
        </View>
      </View>

      {/* Tabs bar */}
      <View className="flex-none">
        <ScrollView
          ref={tabScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          className="py-2"
        >
          {TAB_LABELS.map((tab, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                scrollViewRef.current?.scrollTo({
                  y: sectionYs.current[i],
                  animated: true,
                });
                setActiveTab(i);
              }}
              className={`mr-6 pb-2 ${
                activeTab === i ? "border-b-2 border-orange-500" : ""
              }`}
            >
              <Text
                className={`text-base font-medium ${
                  activeTab === i ? "text-black" : "text-gray-500"
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Scrollable menu content */}
      <View className="flex-1">
        <ScrollView
          ref={scrollViewRef}
          onScroll={onVerticalScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, paddingBottom: 140 }}
        >
          {TAB_LABELS.map((_, i) => (
            <View
              key={i}
              onLayout={(e) => (sectionYs.current[i] = e.nativeEvent.layout.y)}
              className="mb-8"
            >
              <Text className="text-xl font-semibold mb-4">
                {TAB_LABELS[i]}
              </Text>
              <View className="flex-row flex-wrap -mx-2">
                {[1, 2, 3, 4].map((_, j) => (
                  <TouchableOpacity
                    key={j}
                    className="w-1/2 px-2 mb-4"
                    onPress={() => setShowModal(true)}
                  >
                    <Image
                      source={item.image}
                      className="w-full h-32 rounded-xl"
                      resizeMode="cover"
                    />
                    <Text className="mt-2 font-semibold">Item {j + 1}</Text>
                    <Text className="text-gray-500">KWD 0.600</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* cart footer */}
      <View
        className="flex-none bg-white border-t border-gray-200 px-4 py-3"
        style={{ paddingBottom: Platform.OS === "ios" ? 0 : 0 }}
      >
        <TouchableOpacity
          className="w-11/12 mx-auto bg-orange-500 mt-2 rounded-full flex-row items-center justify-between px-4 py-2"
          onPress={() => router.navigate("/(product)/cart")}
        >
          <View className="flex flex-row gap-2 justify-center items-center">
            <View className="bg-orange-700 rounded-full w-10 aspect-square items-center justify-center">
              <Text className="text-white text-xl font-medium">0</Text>
            </View>
            <Text className="text-white text-lg font-medium">View cart</Text>
          </View>
          <Text className="text-white text-lg font-bold">KWD 0.00</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
