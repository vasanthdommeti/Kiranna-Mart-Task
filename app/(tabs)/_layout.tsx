import { Tabs } from "expo-router";
import React from "react";
import { Platform, Text } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function TabLayout() {
  const inactiveColor = "#6d6d6d";
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#F97316",
        tabBarInactiveTintColor: "#6d6d6d",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        animation: "fade",
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="home-outline" color={color} />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "black" : inactiveColor,
                fontSize: 12,
              }}
            >
              Home
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          title: "Orders",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="bookmark-border" color={color} />
          ),
          tabBarStyle: { display: "none" }, // Not needed anymore
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="person-outline" color={color} />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "black" : inactiveColor,
                fontSize: 12,
              }}
            >
              Account
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}
