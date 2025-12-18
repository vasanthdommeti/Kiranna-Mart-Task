import { useLastTab } from "@/context/LastTabContext";
import { useLocation } from "@/context/LocationContext";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AddressSuggestion = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
};

export default function LocationScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { lastTab } = useLastTab();
  const mapRef = useRef<MapView>(null);

  const [detectingLocation, setDetectingLocation] = useState(true);
  const regionChangeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [region, setRegion] = useState<Region>({
    latitude: 29.2289,
    longitude: 47.978,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const { setLocation } = useLocation();
  const [address, setAddress] = useState("");

  const [footerHeight, setFooterHeight] = useState(0);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<AddressSuggestion[]>([]);

  const searchRequestIdRef = useRef(0);
  const reverseGeocodeRequestIdRef = useRef(0);

  const formatAddress = (
    place: Location.LocationGeocodedAddress | undefined,
    fallback: { latitude: number; longitude: number },
    options?: { maxParts?: number; includeCoordsIfLowDetail?: boolean }
  ) => {
    if (!place) {
      return `${fallback.latitude.toFixed(5)}, ${fallback.longitude.toFixed(5)}`;
    }

    const rawParts = [
      place.name,
      place.street,
      place.district,
      place.city,
      place.region,
      place.postalCode,
    ]
      .filter(Boolean)
      .map((p) => String(p).trim())
      .filter(Boolean);

    const parts: string[] = [];
    for (const p of rawParts) {
      if (!parts.includes(p)) parts.push(p);
    }

    const maxParts = options?.maxParts;
    const includeCoordsIfLowDetail = options?.includeCoordsIfLowDetail ?? false;

    const usedParts = typeof maxParts === "number" ? parts.slice(0, maxParts) : parts;
    let label =
      usedParts.join(", ") ||
      `${fallback.latitude.toFixed(5)}, ${fallback.longitude.toFixed(5)}`;

    if (includeCoordsIfLowDetail && parts.length <= 2) {
      label = `${label} (${fallback.latitude.toFixed(5)}, ${fallback.longitude.toFixed(5)})`;
    }

    return label;
  };

  const fetchAddress = async (
    lat: number,
    lng: number,
    requestId?: number
  ): Promise<string> => {
    const id = requestId ?? ++reverseGeocodeRequestIdRef.current;
    try {
      const [place] = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });
      const formatted = formatAddress(
        place,
        { latitude: lat, longitude: lng },
        { includeCoordsIfLowDetail: true }
      );
      if (reverseGeocodeRequestIdRef.current === id) setAddress(formatted);
      return formatted;
    } catch {
      const fallback = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      if (reverseGeocodeRequestIdRef.current === id) setAddress(fallback);
      return fallback;
    }
  };

  const formatPlaceLabel = (
    place: Location.LocationGeocodedAddress | undefined,
    fallback: { latitude: number; longitude: number }
  ) => formatAddress(place, fallback, { maxParts: 3 });

  const selectLocation = async (latitude: number, longitude: number) => {
    const newRegion: Region = {
      latitude,
      longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };

    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 500);
    const formatted = await fetchAddress(latitude, longitude);
    setLocation(newRegion, formatted);
    return formatted;
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Location permission denied!");
        setAddress("Permission to access location was denied.");
        setDetectingLocation(false);
        return;
      }

      try {
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
          timeInterval: 5000,
          mayShowUserSettingsDialog: true,
        });
        const { latitude, longitude } = loc.coords;
        const init: Region = {
          ...region,
          latitude,
          longitude,
        };
        setRegion(init);
        mapRef.current?.animateToRegion(init, 1000);
        const formatted = await fetchAddress(latitude, longitude);
        setLocation(init, formatted);
      } catch (e) {
        console.error("Error fetching location:", e);
        setAddress("Unable to detect location");
      } finally {
        setDetectingLocation(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const normalizedSearchQuery = useMemo(
    () => searchQuery.trim(),
    [searchQuery]
  );

  useEffect(() => {
    if (!searchVisible) return;

    const q = normalizedSearchQuery;
    if (q.length < 3) {
      setSuggestions([]);
      setSuggestionsLoading(false);
      return;
    }

    const requestId = ++searchRequestIdRef.current;
    setSuggestionsLoading(true);

    const timer = setTimeout(async () => {
      try {
        const matches = await Location.geocodeAsync(q);
        if (searchRequestIdRef.current !== requestId) return;

        const topMatches = matches.slice(0, 6);
        const places = await Promise.all(
          topMatches.map(async (m) => {
            try {
              const [place] = await Location.reverseGeocodeAsync({
                latitude: m.latitude,
                longitude: m.longitude,
              });
              return {
                id: `${m.latitude}-${m.longitude}`,
                label: formatPlaceLabel(place, m),
                latitude: m.latitude,
                longitude: m.longitude,
              } satisfies AddressSuggestion;
            } catch {
              return {
                id: `${m.latitude}-${m.longitude}`,
                label: `${m.latitude.toFixed(5)}, ${m.longitude.toFixed(5)}`,
                latitude: m.latitude,
                longitude: m.longitude,
              } satisfies AddressSuggestion;
            }
          })
        );

        if (searchRequestIdRef.current !== requestId) return;

        // De-dupe by label to avoid noisy repeats.
        const unique = places.filter(
          (p, idx) => places.findIndex((x) => x.label === p.label) === idx
        );
        setSuggestions(unique);
      } catch (e) {
        console.error("Failed to fetch suggestions:", e);
        if (searchRequestIdRef.current === requestId) setSuggestions([]);
      } finally {
        if (searchRequestIdRef.current === requestId)
          setSuggestionsLoading(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [normalizedSearchQuery, searchVisible]);

  const handleClose = () => {
    if (lastTab) router.replace(lastTab as any);
    else router.replace(`/(tabs)`);
  };

  const confirmLocation = async () => {
    try {
      if (regionChangeTimer.current) {
        clearTimeout(regionChangeTimer.current);
        regionChangeTimer.current = null;
      }

      setDetectingLocation(true);
      const id = ++reverseGeocodeRequestIdRef.current;
      const formatted = await fetchAddress(region.latitude, region.longitude, id);
      setLocation(region, formatted);
      handleClose();
    } catch (e) {
      console.error("Failed to confirm location:", e);
      Alert.alert("Something went wrong", "Please try again.");
    } finally {
      setDetectingLocation(false);
    }
  };

  const recenter = async () => {
    try {
      setDetectingLocation(true);

      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const newRegion: Region = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };

      mapRef.current?.animateToRegion(newRegion, 500);
      setRegion(newRegion);

      const formatted = await fetchAddress(coords.latitude, coords.longitude);
      setLocation(newRegion, formatted);
    } catch (e) {
      console.error("Failed to recenter:", e);
    } finally {
      setDetectingLocation(false);
    }
  };

  const permissionCheck = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "We need your location to continue.");
      setDetectingLocation(false);
      return;
    }
  };

  useEffect(() => {
    permissionCheck();
  }, []);

  const searchForAddress = async () => {
    const q = normalizedSearchQuery;
    if (!q) return;

    try {
      const matches = await Location.geocodeAsync(q);
      if (!matches?.length) {
        Alert.alert("No results", "Try a different address.");
        return;
      }

      const { latitude, longitude } = matches[0];
      const formatted = await selectLocation(latitude, longitude);
      setRecentSearches((prev) => {
        const next: AddressSuggestion[] = [
          {
            id: `${latitude}-${longitude}`,
            label: formatted,
            latitude,
            longitude,
          },
          ...prev.filter((p) => p.label !== formatted),
        ];
        return next.slice(0, 6);
      });
      setSearchVisible(false);
    } catch (e) {
      console.error("Failed to search address:", e);
      Alert.alert("Search failed", "Please try again.");
    }
  };

  return (
    <View className="flex-1">
      <StatusBar style="auto" />

      <View
        className="absolute top-0 left-0 right-0 flex-row items-center justify-between bg-white px-5 py-3 z-10"
        style={{ paddingTop: insets.top + 10 }}
      >
        <View className="flex-row items-center space-x-3">
          <TouchableOpacity
            onPress={handleClose}
            className="border border-gray-300 rounded-full p-2"
          >
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-base font-medium text-black ml-2">
            Delivery Address
          </Text>
        </View>
        <TouchableOpacity
          className="border border-gray-300 rounded-full p-2"
          onPress={() => setSearchVisible(true)}
        >
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={searchVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSearchVisible(false)}
      >
        <View className="flex-1 bg-black/40 justify-center px-6">
          <View className="bg-white rounded-2xl p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-black">
                Search address
              </Text>
              <TouchableOpacity onPress={() => setSearchVisible(false)}>
                <Ionicons name="close" size={22} color="#111827" />
              </TouchableOpacity>
            </View>

            <View className="mt-3 flex-row items-center bg-white h-12 px-4 rounded-full shadow-sm border border-gray-200">
              <Ionicons name="search" size={18} color="#1f2937" />
              <TextInput
                className="flex-1 ml-2 text-base text-gray-800"
                placeholder="Search for a place or address"
                placeholderTextColor="#6b7280"
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                onSubmitEditing={searchForAddress}
                autoFocus
              />
              {searchQuery.trim().length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  className="ml-2"
                >
                  <Ionicons name="close-circle" size={18} color="#9ca3af" />
                </TouchableOpacity>
              )}
            </View>

            {normalizedSearchQuery.length >= 3 ? (
              <View className="mt-3">
                {suggestionsLoading ? (
                  <Text className="text-gray-500 px-1">Searching…</Text>
                ) : suggestions.length === 0 ? (
                  <Text className="text-gray-500 px-1">
                    No suggestions. Try a more specific address.
                  </Text>
                ) : (
                  <ScrollView
                    className="mt-1 border border-gray-200 rounded-xl"
                    style={{ maxHeight: 220 }}
                    keyboardShouldPersistTaps="handled"
                  >
                    {suggestions.map((s) => (
                      <TouchableOpacity
                        key={s.id}
                        className="px-4 py-3 border-b border-gray-100"
                        onPress={async () => {
                          try {
                            const formatted = await selectLocation(
                              s.latitude,
                              s.longitude
                            );
                            setRecentSearches((prev) => {
                              const next: AddressSuggestion[] = [
                                {
                                  id: s.id,
                                  label: formatted,
                                  latitude: s.latitude,
                                  longitude: s.longitude,
                                },
                                ...prev.filter((p) => p.label !== formatted),
                              ];
                              return next.slice(0, 6);
                            });
                            setSearchVisible(false);
                          } catch (e) {
                            console.error("Failed to select suggestion:", e);
                          }
                        }}
                      >
                        <View className="flex-row items-center">
                          <Ionicons
                            name="location-outline"
                            size={18}
                            color="#6b7280"
                          />
                          <Text className="ml-2 text-gray-900">{s.label}</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>
            ) : recentSearches.length > 0 ? (
              <View className="mt-3">
                <Text className="text-gray-500 px-1 mb-2">Recent</Text>
                <ScrollView
                  className="border border-gray-200 rounded-xl"
                  style={{ maxHeight: 220 }}
                  keyboardShouldPersistTaps="handled"
                >
                  {recentSearches.map((s) => (
                    <TouchableOpacity
                      key={`recent-${s.id}-${s.label}`}
                      className="px-4 py-3 border-b border-gray-100"
                      onPress={async () => {
                        try {
                          await selectLocation(s.latitude, s.longitude);
                          setSearchVisible(false);
                        } catch (e) {
                          console.error("Failed to select recent:", e);
                        }
                      }}
                    >
                      <View className="flex-row items-center">
                        <Ionicons
                          name="time-outline"
                          size={18}
                          color="#6b7280"
                        />
                        <Text className="ml-2 text-gray-900">{s.label}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ) : null}

            <View className="flex-row justify-end mt-4 gap-2">
              <TouchableOpacity
                className="px-4 py-2 rounded-full border border-gray-300"
                onPress={() => setSearchVisible(false)}
              >
                <Text className="text-gray-700 font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-4 py-2 rounded-full bg-orange-500"
                onPress={searchForAddress}
              >
                <Text className="text-white font-semibold">Search</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View
        style={{
          flex: 1,
          marginTop: insets.top + 56,
          marginBottom: footerHeight,
        }}
      >
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          provider={PROVIDER_GOOGLE}
          region={region}
          showsUserLocation={true}
          showsCompass
          mapType="standard"
          onRegionChangeComplete={(r) => {
            setDetectingLocation(true);
            setRegion(r);
            if (regionChangeTimer.current)
              clearTimeout(regionChangeTimer.current);
            regionChangeTimer.current = setTimeout(async () => {
              const id = ++reverseGeocodeRequestIdRef.current;
              await fetchAddress(r.latitude, r.longitude, id);
              if (reverseGeocodeRequestIdRef.current === id) {
                setDetectingLocation(false);
              }
            }, 2000);
          }}
        />

        <View
          pointerEvents="none"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full items-center"
        >
          <View className="bg-black px-3 py-3 rounded-xl">
            <Text className="text-white text-base">
              Your order will be delivered here
            </Text>
          </View>
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: 8,
              borderRightWidth: 8,
              borderTopWidth: 10,
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              borderTopColor: "#000",
            }}
          />
          <Ionicons name="location-sharp" size={50} color="#F97316" />
        </View>

        <TouchableOpacity
          onPress={recenter}
          className="absolute bottom-20 right-5 bg-white rounded-full p-2 shadow"
        >
          <Ionicons name="paper-plane" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {Platform.OS === "ios" ? (
        <View
          className="absolute left-0 right-0 bg-white px-4 pt-4 pb-safe"
          style={{ bottom: 0 }}
          onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height)}
        >
          {detectingLocation ? (
            <TouchableOpacity
              onPress={recenter}
              className="bg-neutral-200 rounded-full py-4"
            >
              <Text className="text-neutral-500 text-center">
                Detecting location...
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <Text className="text-base font-medium mb-2">{address}</Text>
              <TouchableOpacity
                className="bg-orange-500 rounded-full py-4 mb-3"
                onPress={confirmLocation}
              >
                <Text className="text-white text-center font-semibold">
                  Yes, deliver here
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={recenter}
                className="border border-gray-300 rounded-full py-4"
              >
                <Text className="text-gray-700 text-center font-semibold">
                  Reset to my location
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : (
        <View
          className="absolute left-0 right-0 bg-white px-4 pt-4 pb-safe"
          style={{ bottom: 0 }}
          onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height)}
        >
          {detectingLocation ? (
            <TouchableOpacity
              onPress={recenter}
              className="bg-neutral-200 rounded-full py-4"
            >
              <Text className="text-neutral-500 text-center">
                Detecting location...
              </Text>
            </TouchableOpacity>
          ) : (
            <>
              <Text className="text-base font-medium mb-2">{address}</Text>
              <TouchableOpacity
                className="bg-orange-500 rounded-full py-4 mb-3"
                onPress={confirmLocation}
              >
                <Text className="text-white text-center font-semibold">
                  Yes, deliver here
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={recenter}
                className="border border-gray-300 rounded-full py-4"
              >
                <Text className="text-gray-700 text-center font-semibold">
                  Reset to my location
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </View>
  );
}
