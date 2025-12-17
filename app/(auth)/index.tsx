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

import AE from "country-flag-icons/3x2/AE.svg";
import BH from "country-flag-icons/3x2/BH.svg";
import EG from "country-flag-icons/3x2/EG.svg";
import IQ from "country-flag-icons/3x2/IQ.svg";
import JO from "country-flag-icons/3x2/JO.svg";
import KW from "country-flag-icons/3x2/KW.svg";
import OM from "country-flag-icons/3x2/OM.svg";
import QA from "country-flag-icons/3x2/QA.svg";
import SA from "country-flag-icons/3x2/SA.svg";

const FLAG_URIS: Record<
  string,
  React.FC<import("react-native-svg").SvgProps>
> = {
  kw: KW,
  sa: SA,
  bh: BH,
  ae: AE,
  om: OM,
  qa: QA,
  jo: JO,
  eg: EG,
  iq: IQ,
};

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function LoginScreen() {
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

  const Flag = FLAG_URIS["kw"];

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      <Animated.View style={{ flex: flexAnim }}>
        <ImageBackground
          source={require("../../assets/images/vegitable.jpg")}
          className="flex-1 relative"
          resizeMode="cover"
        >
          <View
            className="absolute inset-x-0 flex-row justify-between items-center px-4"
            style={{ paddingTop: insets.top + 16 }}
          >
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() =>
                router.push({
                  pathname: "/(auth)/deliveryLocation",
                  params: { returnTo: "login" },
                })
              }
            >
              <View className="w-9 h-9 rounded-md overflow-hidden border border-gray-200">
                <Flag
                  width="100%"
                  height="100%"
                  preserveAspectRatio="xMidYMid slice"
                />
              </View>

              <Ionicons
                name="chevron-down"
                size={16}
                color="white"
                className="ml-1"
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Text className="text-white text-base underline">Skip</Text>
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
          onPress={() => router.replace("/(tabs)")}
        >
          <AntDesign name="google" size={20} color="#EA4335" className="mr-2" />
          <Text className="text-base text-gray-800 font-medium">
            Continue with Google
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center justify-center border border-black rounded-full py-3 mb-3"
          onPress={() => router.replace("/(tabs)")}
        >
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
          <TouchableOpacity
            className="flex-row items-center justify-center border border-black rounded-full py-3 mb-3"
            onPress={() => router.replace("/(tabs)")}
          >
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
