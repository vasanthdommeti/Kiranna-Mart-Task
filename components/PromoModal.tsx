import { useCart } from "@/context/CartContext";
import { Item, PromoModalProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef } from "react";
import {
  Animated,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const WAVE_HEIGHT = 30;
const FADE_DISTANCE = 80;
const PROMO_TEXT_AREA_HEIGHT = 20;

export default function PromoModal({
  onClose,
  promoAmount,
  promoText,
  timer,
  data,
  bottomInset,
}: PromoModalProps) {
  const insets = useSafeAreaInsets();
  const { setSelected } = useCart();
  const scrollY = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  const disappearingItemsOpacity = scrollY.interpolate({
    inputRange: [0, FADE_DISTANCE],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const timerTranslateY = scrollY.interpolate({
    inputRange: [0, FADE_DISTANCE],
    outputRange: [0, -PROMO_TEXT_AREA_HEIGHT],
    extrapolate: "clamp",
  });

  const listContainerTranslateY = scrollY.interpolate({
    inputRange: [0, FADE_DISTANCE],
    outputRange: [WAVE_HEIGHT, 0],
    extrapolate: "clamp",
  });

  const flatListPaddingTop = scrollY.interpolate({
    inputRange: [0, FADE_DISTANCE],
    outputRange: [WAVE_HEIGHT, 0],
    extrapolate: "clamp",
  });

  const onItemPress = (item: Item) => {
    setSelected(item);
    router.push("/(product)");
  };

  return (
    <View className="absolute inset-0 z-10">
      <StatusBar style="auto" />

      <BlurView intensity={0} tint="light" className="absolute inset-0" />
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="absolute inset-0 bg-black/30"
      />
      <View
        className="flex-1"
        style={{
          position: "absolute",
          top: insets.top + 8,
          left: 8,
          right: 8,
          bottom: Platform.OS === "ios" ? bottomInset : 10,
        }}
        pointerEvents="box-none"
      >
        <View className="flex-1 bg-[#FEF7ED] rounded-3xl overflow-hidden">
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg z-20"
          >
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>

          <View className="px-6 pt-6 items-center">
            <Ionicons name="sparkles" size={28} color="#F97316" />
            <Text className="text-2xl font-bold text-black mt-2">
              Save up to <Text className="text-orange-500">{promoAmount}</Text>
            </Text>
            <Animated.View style={{ opacity: disappearingItemsOpacity }}>
              <View
                style={{
                  height: PROMO_TEXT_AREA_HEIGHT,
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <Text className="text-base text-gray-700 text-center">
                  {promoText}
                </Text>
              </View>
            </Animated.View>
            <Animated.View
              style={{ transform: [{ translateY: timerTranslateY }] }}
            >
              <View className="mt-4 bg-white px-4 py-1 rounded-full shadow">
                <Text className="text-orange-500 font-bold text-lg">
                  {timer}
                </Text>
              </View>
            </Animated.View>
          </View>

          <Animated.View
            className="bg-white rounded-b-3xl"
            style={{
              flex: 1,
              transform: [{ translateY: listContainerTranslateY }],
            }}
          >
            <Animated.View
              style={{ opacity: disappearingItemsOpacity }}
              className="absolute top-0 left-0 right-0 h-[60px] z-10"
            >
              <Svg
                width="100%"
                height={WAVE_HEIGHT}
                viewBox="0 0 1440 320"
                preserveAspectRatio="none"
              >
                <Path
                  fill="#FEF7ED"
                  d="M0,64 C360,160 1080,0 1440,96 L1440,0 L0,0 Z"
                />
              </Svg>
            </Animated.View>

            <Animated.FlatList
              data={data}
              keyExtractor={(r) => r.id}
              showsVerticalScrollIndicator={false}
              bounces={false}
              overScrollMode="never"
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: true }
              )}
              scrollEventThrottle={16}
              contentContainerStyle={{
                paddingTop: flatListPaddingTop,
                paddingBottom: 20,
              }}
              className="px-4"
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => onItemPress(item)}
                  className="flex-row items-center mb-4"
                >
                  <Image
                    source={item.image}
                    className="w-36 h-28 rounded-xl"
                    resizeMode="cover"
                  />
                  <View className="flex-1 ml-4">
                    <View className="flex-row items-center">
                      {item.isPro && (
                        <View className="bg-purple-600 px-1 rounded mr-1">
                          <Text className="text-white text-xs font-bold">
                            pro
                          </Text>
                        </View>
                      )}
                      <Text className="text-lg font-semibold">{item.name}</Text>
                    </View>
                    <View className="flex-row items-center mt-1">
                      <Ionicons name="star" size={16} color="#FBBF24" />
                      <Text className="ml-1 text-base font-medium">
                        {item.rating}
                      </Text>
                      <Text className="text-sm text-gray-500 ml-1">
                        ({item.reviews})
                      </Text>
                    </View>
                    <View className="flex-row items-center mt-1">
                      <Ionicons name="time-outline" size={16} color="#6B7280" />
                      <Text className="text-sm text-gray-500 ml-1">
                        {item.eta}
                      </Text>
                      <Ionicons
                        name="bicycle"
                        size={16}
                        color="#6B7280"
                        style={{ marginLeft: 12 }}
                      />
                      <Text className="text-sm text-gray-500 ml-1">
                        {item.fee}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </Animated.View>
        </View>
      </View>
    </View>
  );
}
