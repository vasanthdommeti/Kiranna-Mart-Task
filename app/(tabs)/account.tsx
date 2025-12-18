import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useCallback } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SvgXml, SvgProps } from "react-native-svg";

import { useLastTab } from "@/context/LastTabContext";
import { useAuthStore } from "@/store/auth";
import {
  AE,
  BH,
  EG,
  IQ,
  JO,
  KW,
  OM,
  QA,
  SA,
} from "country-flag-icons/string/3x2";
import { useFocusEffect, useRouter } from "expo-router";

const makeFlag = (xml: string) => (props: SvgProps) =>
  <SvgXml xml={xml} {...props} />;

const FLAG_URIS: Record<
  string,
  React.FC<import("react-native-svg").SvgProps>
> = {
  kw: makeFlag(KW),
  sa: makeFlag(SA),
  bh: makeFlag(BH),
  ae: makeFlag(AE),
  om: makeFlag(OM),
  qa: makeFlag(QA),
  jo: makeFlag(JO),
  eg: makeFlag(EG),
  iq: makeFlag(IQ),
};

export default function AccountScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setLastTab } = useLastTab();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const hasSkippedAuth = useAuthStore((s) => s.hasSkippedAuth);
  const Flag = FLAG_URIS["kw"];

  useFocusEffect(
    useCallback(() => {
      setLastTab("/(tabs)/account");
    }, [setLastTab])
  );
  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 10 }}>
      <StatusBar style="auto" />
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        {/* Avatar + Greeting */}
        <View className="flex-row items-center space-x-3">
          <View className="border border-black p-3 rounded-full bg-white items-center justify-center">
            <Ionicons name="person" size={24} color="#000" />
          </View>
          <View className="ml-3 gap-1">
            <Text className="text-xl font-normal text-black">
              Hi {user ? user.name : "guest"}
            </Text>
            <View className="flex-row items-center gap-1">
              <View className="w-5 h-5 rounded-full overflow-hidden border border-gray-200">
                <Flag
                  width="100%"
                  height="100%"
                  preserveAspectRatio="xMidYMid slice"
                />
              </View>
              <Text className="text-sm text-gray-400">
                {user
                  ? `Signed in with ${user.provider}`
                  : hasSkippedAuth
                    ? "Guest mode"
                    : "Kuwait"}
              </Text>
            </View>
          </View>
        </View>
        {/* Settings / Logout */}
        {user ? (
          <TouchableOpacity
            onPress={() => {
              logout();
              router.replace("/(auth)");
            }}
          >
            <Ionicons name="log-out-outline" size={24} color="#4B5563" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} color="#4B5563" />
          </TouchableOpacity>
        )}
      </View>

      {/* “Hey there!” card */}
      {!user ? (
        <View className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-row">
          <View className="pr-2" style={{ flex: 7 }}>
            <Text className="text-xl font-medium text-black">Hey there!</Text>
            <Text className="text-gray-600 font-normal mt-1 text-base">
              Log in or sign up for a more personalized ordering experience
            </Text>
            <TouchableOpacity
              className="mt-4 bg-orange-500 px-5 py-2 rounded-full self-start"
              onPress={() => router.navigate("/(auth)")}
            >
              <Text className="text-white font-medium text-base">Log in</Text>
            </TouchableOpacity>
          </View>

          <View className="items-end" style={{ flex: 3 }}>
            <Image
              source={require("../../assets/images/web2app.webp")}
              className="w-20 h-20"
              resizeMode="contain"
            />
          </View>
        </View>
      ) : null}

      {/* Menu Items */}
      <View className="mt-6">
        <TouchableOpacity
          className="flex-row items-center px-4 py-3"
          onPress={() => router.push("/(tabs)/order")}
        >
          <MaterialIcons name="receipt-long" size={24} color="#000" />
          <Text className="ml-4 text-black text-base">Your orders</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center px-4 py-3"
          onPress={() => router.push("/help")}
        >
          <Ionicons name="help-circle-outline" size={24} color="#000" />
          <Text className="ml-4 text-black text-base">Get help</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center px-4 py-3"
          onPress={() => router.push("/about")}
        >
          <Ionicons name="information-circle-outline" size={24} color="#000" />
          <Text className="ml-4 text-black text-base">About app</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
