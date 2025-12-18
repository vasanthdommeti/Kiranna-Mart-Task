import { menuItems, restaurants } from "@/data";
import { useCart } from "@/context/CartContext";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setSelected } = useCart();
  const params = useLocalSearchParams();
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const rawScope = params?.scope;
  const scope = (Array.isArray(rawScope) ? rawScope[0] : rawScope) === "items"
    ? "items"
    : "restaurants";

  const results = useMemo(() => {
    if (!normalized) return [];
    if (scope === "items") {
      return menuItems.filter((m) =>
        m.name.toLowerCase().includes(normalized)
      );
    }
    return restaurants.filter((r) => {
      const haystack = `${r.name} ${(r.keywords ?? []).join(" ")}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [normalized, scope]);

  return (
    <View
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top + 10, paddingHorizontal: 16 }}
    >
      <View className="flex-row items-center mb-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 rounded-full bg-white shadow border border-gray-200"
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View className="flex-1 ml-3 bg-white flex-row items-center justify-center h-12 px-4 rounded-full shadow-sm border border-gray-200">
          <Ionicons name="search" size={20} color="#1f2937" />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-800"
            placeholder={
              scope === "items"
                ? "Search items (ex: shawarma)"
                : "Search restaurants (ex: burger)"
            }
            value={query}
            onChangeText={setQuery}
            autoFocus
            placeholderTextColor="#6b7280"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")} className="ml-2">
              <Ionicons name="close-circle" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {!normalized ? (
          <View className="mt-10 items-center">
            <Ionicons name="search" size={48} color="#9ca3af" />
            <Text className="text-gray-600 mt-2 text-base font-medium">
              {scope === "items"
                ? "Search items in this restaurant"
                : "Search restaurants near you"}
            </Text>
            <Text className="text-gray-500 mt-1 text-sm text-center px-8">
              Type in the search box to see results.
            </Text>
          </View>
        ) : results.length === 0 ? (
          <View className="mt-10 items-center">
            <Ionicons name="alert-circle" size={48} color="#9ca3af" />
            <Text className="text-gray-500 mt-2">
              No matches for "{query.trim()}"
            </Text>
            <TouchableOpacity
              className="mt-3 px-4 py-2 rounded-full border border-gray-300"
              onPress={() => setQuery("")}
            >
              <Text className="text-gray-700">Clear search</Text>
            </TouchableOpacity>
          </View>
        ) : scope === "items" ? (
          results.map((m: any) => (
            <TouchableOpacity
              key={m.id}
              className="flex-row items-center bg-white mb-3 p-3 rounded-xl shadow-sm border border-gray-200"
              onPress={() =>
                router.push({
                  pathname: "/(product)",
                  params: { itemId: m.id },
                })
              }
            >
              <Image
                source={m.image}
                className="w-16 h-16 rounded-lg"
                resizeMode="cover"
              />
              <View className="ml-3 flex-1">
                <Text className="text-base font-semibold text-black">
                  {m.name}
                </Text>
                <Text className="text-sm text-gray-600">
                  {m.section ? `${m.section} · ` : ""}KWD{" "}
                  {(m.price ?? 0).toFixed(3)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
            </TouchableOpacity>
          ))
        ) : (
          results.map((r: any) => (
            <TouchableOpacity
              key={r.id}
              className="flex-row items-center bg-white mb-3 p-3 rounded-xl shadow-sm border border-gray-200"
              onPress={() => {
                setSelected(r as any);
                router.push("/(product)");
              }}
            >
              <Image
                source={r.image}
                className="w-16 h-16 rounded-lg"
                resizeMode="cover"
              />
              <View className="ml-3 flex-1">
                <Text className="text-base font-semibold text-black">
                  {r.name}
                </Text>
                <Text className="text-sm text-gray-600">
                  {r.eta} · {r.fee}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
