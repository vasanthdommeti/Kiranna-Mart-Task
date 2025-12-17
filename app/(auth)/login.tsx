// app/(auth)/SecondLoginScreen.tsx
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
  Animated,
  Easing,
  ImageBackground,
  Platform,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import RemixLogo from "../../assets/images/remix-logo.svg";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SecondLoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [showMore, setShowMore] = useState(false);
  const flexAnim = useRef(new Animated.Value(0.7)).current;
  const bottomFlex = Animated.subtract(1, flexAnim);

  const toggleShowMore = () => {
    Animated.timing(flexAnim, {
      toValue: showMore ? 0.7 : 0.6,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
    setShowMore((v) => !v);
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      <Animated.View style={{ flex: flexAnim }}>
        <ImageBackground
          source={require("../../assets/images/vegitable.jpg")}
          className="flex-1 relative"
          resizeMode="cover"
        >
          {/* ← FIX: pin to top + solid background for arrow */}
          <View
            className="absolute top-0 inset-x-0 flex-row justify-between items-center px-4"
            style={{ paddingTop: insets.top + 16 }}
          >
            <TouchableOpacity
              className="rounded-full bg-white overflow-hidden border border-black p-2"
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* wave */}
          <View className="absolute bottom-0 left-0 right-0 z-0">
            <Svg
              width="100%"
              height={60}
              viewBox="0 0 1440 320"
              preserveAspectRatio="none"
            >
              <Path
                fill="#fff"
                d="M0,64 C360,160 1080,0 1440,96 L1440,320 L0,320 Z"
              />
            </Svg>
          </View>

          {/* Welcome text */}
          <View
            className="absolute left-0 right-0 items-center z-10"
            style={{ bottom: 25 }}
          >
            <Text className="text-5xl font-bold text-white shadow-sm">
              Welcome to
            </Text>
            <RemixLogo width={150} height={100} />
          </View>
        </ImageBackground>
      </Animated.View>

      {/* bottom half */}
      <Animated.View
        className="bg-white px-4 pt-4"
        style={{ flex: bottomFlex, paddingBottom: insets.bottom + 20 }}
      >
        <Text className="text-center text-base font-medium text-black leading-relaxed mx-8 mb-6">
          Log in or sign up to save more, shop faster, and get personalized
          perks
        </Text>
        <TouchableOpacity
          className="flex-row items-center justify-center border border-black rounded-full py-3 mb-3"
          onPress={() => router.push("/(tabs)")}
        >
          <AntDesign name="google" size={20} color="#EA4335" className="mr-2" />
          <Text className="text-base text-gray-800 font-medium">
            Continue with Google
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-row items-center justify-center border border-black rounded-full py-3 mb-3">
          <FontAwesome
            name="facebook"
            size={20}
            color="#1877F2"
            className="mr-2"
          />
          <Text className="text-base text-gray-800 font-medium">
            Continue with Facebook
          </Text>
        </TouchableOpacity>
        {showMore && (
          <TouchableOpacity className="flex-row items-center justify-center border border-black rounded-full py-3 mb-3">
            <Ionicons
              name="mail-outline"
              size={20}
              color="#374151"
              className="mr-2"
            />
            <Text className="text-base text-gray-800 font-medium">
              Continue with Email
            </Text>
          </TouchableOpacity>
        )}
        {!showMore && (
          <TouchableOpacity
            onPress={toggleShowMore}
            className="self-center mt-2"
          >
            <Text className="text-gray-500 underline text-base">View more</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
}
