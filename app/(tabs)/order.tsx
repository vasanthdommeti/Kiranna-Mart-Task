import { useLastTab } from "@/context/LastTabContext";
import { useLocation } from "@/context/LocationContext";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Platform, Text, TouchableOpacity, View } from "react-native";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OrderScreen() {
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

  const fetchAddress = async (lat: number, lng: number): Promise<string> => {
    try {
      const [place] = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });
      const parts = [place.name, place.street, place.city, place.region].filter(
        Boolean
      );

      const short = parts.slice(-2).join(", ");
      setAddress(short);
      return short;
    } catch {
      setAddress("Unknown location");
      return "Unknown location";
    }
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
  }, []);

  const handleClose = () => {
    if (lastTab) router.replace(lastTab as any);
    else router.replace(`/(tabs)`);
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

  return (
    <View className="flex-1">
      <StatusBar style="auto" />

      {/* HEADER */}
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
        <TouchableOpacity className="border border-gray-300 rounded-full p-2">
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* MAP CONTAINER */}
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
              await fetchAddress(r.latitude, r.longitude);
              setDetectingLocation(false);
            }, 2000);
          }}
        />

        {/* pin + tooltip */}
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

        {/* recenter */}
        <TouchableOpacity
          onPress={recenter}
          className="absolute bottom-20 right-5 bg-white rounded-full p-2 shadow"
        >
          <Ionicons name="paper-plane" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* FOOTER */}
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
                onPress={() => router.navigate("/(tabs)")}
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
          <Text className="text-base font-medium mb-2">{address}</Text>
          <TouchableOpacity
            className="bg-orange-500 rounded-full py-4 mb-3"
            onPress={() => router.navigate("/(tabs)")}
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
        </View>
      )}
    </View>
  );
}
