import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import AE from "country-flag-icons/3x2/AE.svg";
import BH from "country-flag-icons/3x2/BH.svg";
import EG from "country-flag-icons/3x2/EG.svg";
import IQ from "country-flag-icons/3x2/IQ.svg";
import JO from "country-flag-icons/3x2/JO.svg";
import KW from "country-flag-icons/3x2/KW.svg";
import OM from "country-flag-icons/3x2/OM.svg";
import QA from "country-flag-icons/3x2/QA.svg";
import SA from "country-flag-icons/3x2/SA.svg";
import { useRouter } from "expo-router";

const FLAGS: Record<string, React.FC<import("react-native-svg").SvgProps>> = {
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

const COUNTRIES = [
  { code: "kw", name: "Kuwait" },
  { code: "sa", name: "KSA" },
  { code: "bh", name: "Bahrain" },
  { code: "ae", name: "UAE" },
  { code: "om", name: "Oman" },
  { code: "qa", name: "Qatar" },
  { code: "jo", name: "Jordan" },
  { code: "eg", name: "Egypt" },
  { code: "iq", name: "Iraq" },
];

export default function DeliveryLocationScreen() {
  const router = useRouter();
  const wavePath = `
    M0,0
    H1440
    V20
    C1200,60 800,-20 720,20
    C640,60 240,-20 0,20
    Z
  `;

  return (
    <View className="flex-1 bg-white">
      <View className="relative bg-orange-50 overflow-hidden">
        <Image
          source={require("../../assets/images/web2app.webp")}
          className="w-56 h-72 mx-auto"
          resizeMode="contain"
        />
      </View>
      <View className=" bottom-0 left-0 right-0 h-5">
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 40"
          preserveAspectRatio="none"
        >
          <Path fill="#fff7ed" d={wavePath} />
        </Svg>
      </View>

      <View className="-mt-5 flex-1">
        <Text className="px-6 mt-4 mb-2 text-lg font-semibold text-gray-900">
          Where are we delivering to?
        </Text>
        <FlatList
          data={COUNTRIES}
          keyExtractor={(item) => item.code}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => {
            const Flag = FLAGS[item.code];
            return (
              <TouchableOpacity
                className="flex-row items-center px-6 py-4 border-b border-gray-200"
                onPress={() => router.back()}
              >
                <View className="w-7 h-7 rounded-full overflow-hidden border border-gray-200">
                  <Flag
                    width="100%"
                    height="100%"
                    preserveAspectRatio="xMidYMid slice"
                  />
                </View>
                <Text className="ml-4 text-base text-gray-800">
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
}
