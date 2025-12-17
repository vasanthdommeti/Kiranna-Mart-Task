<<<<<<< HEAD
import PromoModal from "@/components/PromoModal";
import { useLastTab } from "@/context/LastTabContext";
import { useLocation } from "@/context/LocationContext";
import { categories, restaurants } from "@/data";
import { useTypewriter } from "@/utils/typeWriting";
import { Ionicons } from "@expo/vector-icons";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState } from "react";
import {
  Image,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Path, Svg } from "react-native-svg";

const ChevronDownIcon = (props: any) => (
  <Svg height="20" width="20" viewBox="0 0 20 20" fill="white" {...props}>
    <Path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </Svg>
);

export default function HomeScreen() {
  const router = useRouter();
  const { setLastTab } = useLastTab();
  const { address } = useLocation();
  const insets = { top: 44, bottom: 34, left: 0, right: 0 };
  const tabBarHeight = useBottomTabBarHeight();
  const [headerLayout, setHeaderLayout] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const [statusBarStyle, setStatusBarStyle] = useState<"light" | "dark">(
    "light"
  );

  const rotatingPlaceholder = useTypewriter([
    "Pizza",
    "Burger",
    "Roll",
    "Sushi",
  ]);

  useFocusEffect(
    useCallback(() => {
      setLastTab("/(tabs)");
    }, [setLastTab])
  );

  const footerSpacing = tabBarHeight;

  const createDoubleWavePath = (width: number, height: number) => {
    const amplitude = 20;
    const y = height - amplitude;
    return `M0,0 H${width} V${y} C ${width * 0.875},${y + amplitude * 2} ${width * 0.625},${y - amplitude * 2} ${width * 0.5},${y} C ${width * 0.375},${y + amplitude * 2} ${width * 0.125},${y - amplitude * 2} 0,${y} Z`;
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!headerLayout) return;

    const scrollY = event.nativeEvent.contentOffset.y;
    const threshold = headerLayout.height - 60;

    if (scrollY > threshold) {
      if (statusBarStyle !== "dark") {
        setStatusBarStyle("dark");
      }
    } else {
      if (statusBarStyle !== "light") {
        setStatusBarStyle("light");
      }
    }
  };

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style={statusBarStyle} />

      {modalVisible && (
        <PromoModal
          onClose={() => setModalVisible(false)}
          promoAmount="KWD 3"
          promoText="Discover new restaurants and revisit places you haven't tried in a while"
          timer="27:51"
          data={restaurants}
          bottomInset={tabBarHeight + 10}
        />
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingBottom: Platform.OS === "ios" ? footerSpacing + 20 : 20,
        }}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
      >
        {/* --- HEADER --- */}
        <View className="relative">
          {headerLayout && (
            <View className="absolute top-0 left-0 right-0 bottom-0">
              <Svg width={headerLayout.width} height={headerLayout.height}>
                <Path
                  d={createDoubleWavePath(
                    headerLayout.width,
                    headerLayout.height
                  )}
                  fill="#F97316"
                />
              </Svg>
            </View>
          )}

          <View
            onLayout={(event) => {
              const { width, height } = event.nativeEvent.layout;
              if (
                !headerLayout ||
                width !== headerLayout.width ||
                height !== headerLayout.height
              ) {
                setHeaderLayout({ width, height });
              }
            }}
            className="px-4 pb-14"
            style={{ paddingTop: insets.top + 16 }}
          >
            <View className="flex flex-row justify-between">
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => router.navigate("/(tabs)/order")}
              >
                <Text className="text-white text-lg font-semibold">
                  {address ?? "Choose delivery location"}
                </Text>
                <ChevronDownIcon className="ml-1" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/cart")}
                className="relative p-2 bg-white rounded-full"
              >
                <Ionicons name="cart-outline" size={24} color="#F97316" />

                <View className="absolute -bottom-1 -right-1 bg-orange-500 w-5 h-5 border border-white rounded-full justify-center items-center">
                  <Text className="text-white text-xs">8</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View className="mt-4 bg-white flex-row items-center justify-center h-12 px-4 rounded-full shadow-md">
              <Ionicons name="search" size={24} color="#1f2937" />
              <TextInput
                placeholder={`Search for ${rotatingPlaceholder}`}
                placeholderTextColor="#1f2937"
                className="flex-1 ml-2 text-base text-gray-800"
              />
            </View>
          </View>
        </View>

        {/* --- CATEGORIES --- */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
          className="mt-4"
        >
          {categories.map((cat, index) => (
            <TouchableOpacity
              key={cat.id}
              className="items-center w-24"
              style={{
                marginRight: index === categories.length - 1 ? 0 : 12,
              }}
              onPress={() => setModalVisible(true)}
            >
              <View className="bg-[#ffe9be] w-24 h-24 rounded-2xl items-center justify-center">
                <Image
                  source={cat.icon}
                  className="w-20 h-20"
                  resizeMode="cover"
                />
              </View>
              <Text className="text-sm text-gray-800 mt-2 text-center">
                {cat.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* “Hey there!” card */}
        <View className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-row">
          <View className="pr-2" style={{ flex: 7 }}>
            <Text className="text-xl font-medium text-black">Hey there!</Text>
            <Text className="text-gray-600 font-normal mt-1 text-base">
              Log in or sign up for a more personalized ordering experience
            </Text>
            <TouchableOpacity
              className="mt-4 bg-orange-500 px-5 py-2 rounded-full self-start"
              onPress={() => router.navigate("/modal")}
            >
              <Text className="text-white font-medium text-base">Log in</Text>
            </TouchableOpacity>
          </View>
          <View className="items-end justify-center" style={{ flex: 3 }}>
            <Image
              source={require("../../assets/images/web2app.webp")}
              className="w-20 h-20"
              resizeMode="contain"
            />
          </View>
        </View>

        <View className="mt-8 items-center relative">
          <Svg
            width="100%"
            height={40}
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              top: 0,
              zIndex: -1,
            }}
          >
            <Path
              d="M0,50 C360,30 1080,70 1440,50"
              stroke="#d8d3d3"
              strokeWidth={2}
              fill="none"
            />
          </Svg>
          <Image
            source={require("../../assets/images/welcome-gift.png")}
            className="w-12 h-12"
            resizeMode="contain"
          />
          <Text className="text-orange-500 text-xl font-bold mt-1">
            Your first order delivered free
          </Text>
          <Text className="text-gray-600 text-sm font-medium">
            Enjoy your welcome gift!
          </Text>
        </View>

        <Text className="mt-8 px-4 text-xl font-medium text-black">
          Get the most out of talabat
        </Text>

        <TouchableOpacity
          className="mt-4 px-4"
          onPress={() => setModalVisible(true)}
        >
          <ImageBackground
            source={require("../../assets/images/Banner.png")}
            className="w-full h-72 rounded-2xl overflow-hidden"
            resizeMode="cover"
          />
        </TouchableOpacity>

        <View className="mt-4 px-4 flex-row justify-between gap-4">
          <TouchableOpacity
            className="flex-1 bg-orange-500 rounded-2xl p-4"
            onPress={() => setModalVisible(true)}
          >
            <Text className="text-white text-base font-bold mb-2">
              Running low on
            </Text>
            <Text className="text-white text-lg font-extrabold mb-4">
              groceries?
            </Text>
            <Image
              source={require("../../assets/images/groceries.png")}
              className="w-full h-24 rounded-xl"
              resizeMode="cover"
            />
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-orange-500 rounded-2xl p-4"
            onPress={() => setModalVisible(true)}
          >
            <Text className="text-white text-base font-bold mb-2">
              Running low on
            </Text>
            <Text className="text-white text-lg font-extrabold mb-4">
              groceries?
            </Text>
            <Image
              source={require("../../assets/images/groceries.png")}
              className="w-full h-24 rounded-xl"
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// HomeScreen.tsx
// import PromosModal from "@/components/PromosModal";
// import React, { useState } from "react";
// import { Button, StyleSheet } from "react-native";
// import Animated, {
//   Easing,
//   runOnJS,
//   useAnimatedStyle,
//   useSharedValue,
//   withTiming,
// } from "react-native-reanimated";
// import { SafeAreaView } from "react-native-safe-area-context";

// export default function HomeScreen() {
//   const [modalVisible, setModalVisible] = useState(false);
//   const progress = useSharedValue(0); // 0 = closed, 1 = open

//   const openModal = () => {
//     progress.value = withTiming(
//       1,
//       { duration: 400, easing: Easing.out(Easing.ease) },
//       () => {
//         runOnJS(setModalVisible)(true);
//       }
//     );
//   };

//   const closeModal = () => {
//     progress.value = withTiming(
//       0,
//       { duration: 400, easing: Easing.in(Easing.ease) },
//       () => {
//         runOnJS(setModalVisible)(false);
//       }
//     );
//   };

//   const animatedBackground = useAnimatedStyle(() => {
//     const scale = 1 - 0.1 * progress.value;
//     const rotateX = -12 * progress.value;
//     return {
//       transform: [
//         { perspective: 1000 },
//         { scale },
//         { rotateX: `${rotateX}deg` },
//       ],
//     };
//   });

//   return (
//     <SafeAreaView style={styles.container}>
//       <Animated.View style={[styles.content, animatedBackground]}>
//         {/* your ScrollView and other UI go here */}
//         <Button title="Show Promo" onPress={openModal} />
//       </Animated.View>

//       {modalVisible && <PromosModal onClose={closeModal} />}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   content: { flex: 1, overflow: "hidden" },
// });
=======
import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
>>>>>>> 4b0fe7b (Initial commit)
