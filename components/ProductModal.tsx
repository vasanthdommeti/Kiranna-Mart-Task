import { ProductModalProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import {
  Image,
  Modal,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProductModal({
  visible,
  onClose,
  onAdd,
  initialQuantity = 1,
  initialNote = "",
  image,
  title,
  subtitle,
  description,
  price,
}: ProductModalProps) {
  const insets = useSafeAreaInsets();
  const [quantity, setQuantity] = React.useState(initialQuantity);
  const [note, setNote] = React.useState(initialNote);
  const numericPrice = React.useMemo(() => {
    const cleaned = parseFloat((price || "").replace(/[^\d.]/g, ""));
    return Number.isFinite(cleaned) ? cleaned : 0;
  }, [price]);
  const total = (numericPrice * quantity || 0).toFixed(3);

  React.useEffect(() => {
    if (visible) {
      setQuantity(initialQuantity);
      setNote(initialNote);
    }
  }, [visible, initialNote, initialQuantity]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent={true}
    >
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <BlurView intensity={0} tint="light" className="absolute inset-0" />
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="absolute inset-0 bg-black/30"
      />

      <SafeAreaView
        className="absolute bottom-0 w-full bg-white overflow-hidden"
        style={{
          height: "65%",
          paddingBottom: insets.bottom,
        }}
      >
        <View className="relative w-full h-1/2">
          <Image
            source={image}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-lg z-20"
          >
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>

          <View className="absolute top-2 left-1/2 -translate-x-6 w-12 h-1.5 bg-gray-300 rounded-full" />
        </View>

        <View className="flex-1 px-6 pt-4">
          {subtitle && (
            <Text className="text-sm text-gray-500 mb-1">{subtitle}</Text>
          )}
          <Text className="text-2xl font-bold mb-2">{title}</Text>
          {description && (
            <Text className="text-gray-600 mb-4">{description}</Text>
          )}

          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <Ionicons name="chatbubble-outline" size={20} color="#333" />
                <Text className="ml-2 text-gray-700">
                  Any special requests?
                </Text>
              </View>
              <Text className="text-orange-500 font-semibold">
                {note ? "Edit note" : "Add note"}
              </Text>
            </View>
            <TextInput
              placeholder="Ex: No onions, extra sauce..."
              value={note}
              onChangeText={setNote}
              className="border border-gray-200 rounded-xl px-3 py-2 text-base text-gray-800"
              multiline
            />
          </View>

          <View className="flex-row items-center justify-between mt-auto">
            <View className="flex-row items-center bg-white border border-gray-100 rounded-full">
              <TouchableOpacity
                className="px-4 py-4"
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Ionicons name="remove" size={24} color="#333" />
              </TouchableOpacity>
              <Text className="px-4 text-xl">{quantity}</Text>
              <TouchableOpacity
                className="px-4 py-2"
                onPress={() => setQuantity((q) => q + 1)}
              >
                <Ionicons name="add" size={24} color="#f97316" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="flex-row items-center bg-orange-500 px-6 py-4 rounded-full gap-3"
              onPress={() => {
                onAdd(quantity, note.trim());
                onClose();
                setQuantity(1);
                setNote("");
              }}
            >
              <Text className="text-white text-lg font-semibold">
                Add item&nbsp;
              </Text>
              <Text className="text-white text-lg font-semibold">
                KWD {total}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
