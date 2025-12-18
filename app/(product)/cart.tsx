// app/(product)/cart.tsx
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useCart } from "@/context/CartContext";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProductModal from "@/components/ProductModal";

export default function CartScreen() {
  const router = useRouter();
  const { cartItems, addToCart, updateQuantity, updateNote, orderNote, setOrderNote } =
    useCart();
  const [showOrderNote, setShowOrderNote] = useState(false);
  const [editing, setEditing] = useState<{
    id: string;
    name: string;
    image: any;
    price: number;
    quantity: number;
    note?: string;
  } | null>(null);
  const [needCutlery, setNeedCutlery] = React.useState(false);
  const youMight = [
    {
      title: "Pickled",
      price: "0.100",
      image: require("../../assets/images/Banner.png"),
      id: "ym-pickled",
    },
    {
      title: "Mexican Pepper Pickle",
      price: "0.150",
      image: require("../../assets/images/Banner.png"),
      id: "ym-mex",
    },
    {
      title: "Ketchup Box",
      price: "0.200",
      image: require("../../assets/images/Banner.png"),
      id: "ym-ketchup",
    },
    {
      title: "Cheddar Sauce",
      price: "0.200",
      image: require("../../assets/images/Banner.png"),
      id: "ym-cheddar",
    },
  ];

  const priceFor = (p: any) => {
    if (p?.price) return p.price;
    const parsed = parseFloat((p?.fee || "").replace(/[^\d.]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, c) => sum + priceFor(c.item) * c.quantity,
        0
      ),
    [cartItems]
  );
  const deliveryFee = cartItems.length > 0 ? 0.5 : 0;
  const total = subtotal + deliveryFee;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {editing && (
        <ProductModal
          visible={!!editing}
          onClose={() => setEditing(null)}
          onAdd={(qty, note) => {
            updateQuantity(editing.id, Math.max(1, qty));
            updateNote(editing.id, note ?? "");
            setEditing(null);
          }}
          initialQuantity={editing.quantity}
          initialNote={editing.note ?? ""}
          image={editing.image}
          title={editing.name}
          subtitle="Customize your item"
          description=""
          price={`KWD ${editing.price.toFixed(3)}`}
        />
      )}
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 rounded-full border border-gray-200"
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View className="ml-4">
          <Text className="text-lg font-bold">Cart</Text>
          <Text className="text-gray-500 text-sm">Ebn 3my</Text>
        </View>
      </View>

      <ScrollView
        contentContainerClassName="pb-12"
        showsVerticalScrollIndicator={false}
        bounces={false}
        alwaysBounceVertical={false}
        overScrollMode="never"
      >
        {/* Cart Items */}
        {cartItems.length === 0 ? (
          <Text className="px-4 text-base text-gray-600">
            Your cart is empty. Add items to get started.
          </Text>
        ) : (
          cartItems.map((c) => (
            <View key={c.item.id} className="px-4 mb-6">
              <View className="flex-row h-36">
                <View className="flex flex-col justify-between flex-1 pr-4 h-full">
                  <View>
                    <Text className="text-xl font-medium">{c.item.name}</Text>
                    <TouchableOpacity
                      className="flex-row items-center mt-1"
                      onPress={() => {
                        const price = c.item.price ?? priceFor(c.item);
                        setEditing({
                          id: c.item.id,
                          name: c.item.name,
                          image: c.item.image,
                          price,
                          quantity: c.quantity,
                          note: c.note,
                        });
                      }}
                    >
                      <Ionicons name="pencil-outline" size={18} color="#F97316" />
                      <Text className="text-orange-500 ml-1">Edit</Text>
                    </TouchableOpacity>
                  </View>
                  <Text className="text-lg font-medium mt-3">
                    <Text className="text-lg font-light">KD</Text>{" "}
                    {(priceFor(c.item) * c.quantity).toFixed(3)}
                  </Text>
                </View>
                <View className="relative">
                  <Image
                    source={c.item.image}
                    className="w-36 h-36 rounded-lg"
                    resizeMode="cover"
                  />
                  <View className="absolute bottom-2 -translate-x-1/2 left-1/2 bg-white rounded-full flex-row items-center px-2 py-2 shadow">
                    <TouchableOpacity
                      onPress={() =>
                        updateQuantity(c.item.id, Math.max(0, c.quantity - 1))
                      }
                    >
                      <MaterialIcons
                        name="delete-outline"
                        size={24}
                        color="#F97316"
                      />
                    </TouchableOpacity>
                    <Text className="px-6 text-lg font-medium">
                      {c.quantity}
                    </Text>
                    <TouchableOpacity
                      onPress={() => updateQuantity(c.item.id, c.quantity + 1)}
                    >
                      <Ionicons
                        name="add-circle-outline"
                        size={24}
                        color="#F97316"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {c.note ? (
                <Text className="mt-2 text-base text-gray-700">{c.note}</Text>
              ) : null}
            </View>
          ))
        )}

        {/* You might also like… */}
        <View className="bg-orange-200 mt-8 py-8">
          <Text className=" px-4 text-xl font-semibold">
            You might also like…
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4"
            contentContainerStyle={{
              paddingLeft: 16, // match your px-4
              paddingRight: 16, // give the “right‐end” some breathing room
            }}
          >
            {youMight.map((it, i) => {
              const isLast = i === youMight.length - 1;
              const existingQty =
                cartItems.find((c) => c.item.id === it.id)?.quantity ?? 0;
              return (
                <View key={i} className={`${!isLast ? "mr-4" : ""} w-28`}>
                  <View className="relative">
                    <Image
                      source={it.image}
                      className="w-full h-28 rounded-lg"
                      resizeMode="cover"
                    />
                    {existingQty > 0 ? (
                      <View className="absolute bottom-2 right-2 bg-white rounded-full shadow flex-row items-center px-2 py-1">
                        <TouchableOpacity
                          onPress={() =>
                            updateQuantity(it.id, Math.max(0, existingQty - 1))
                          }
                          className="p-1"
                        >
                          <MaterialIcons
                            name="delete-outline"
                            size={20}
                            color="#F97316"
                          />
                        </TouchableOpacity>
                        <Text className="px-3 text-base font-medium">
                          {existingQty}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            const price = parseFloat(
                              (it.price || "").replace(/[^\d.]/g, "")
                            );
                            const product = {
                              id: it.id,
                              name: it.title,
                              image: it.image,
                              rating: "",
                              reviews: "",
                              eta: "",
                              fee: "",
                              price: Number.isFinite(price) ? price : 0,
                            };
                            addToCart(product as any, 1);
                          }}
                          className="p-1"
                        >
                          <Ionicons name="add" size={20} color="#F97316" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow"
                        onPress={() => {
                          const price = parseFloat(
                            (it.price || "").replace(/[^\d.]/g, "")
                          );
                          const product = {
                            id: it.id,
                            name: it.title,
                            image: it.image,
                            rating: "",
                            reviews: "",
                            eta: "",
                            fee: "",
                            price: Number.isFinite(price) ? price : 0,
                          };
                          addToCart(product as any, 1);
                        }}
                      >
                        <Ionicons name="add" size={20} color="#F97316" />
                      </TouchableOpacity>
                    )}
                  </View>
                  <View className="h-24 flex-col justify-between">
                    <Text className="mt-2 text-black text-base font-medium">
                      {it.title}
                    </Text>
                    <Text className="text-black text-base font-medium">
                      <Text className="text-black text-base font-light">
                        KD
                      </Text>{" "}
                      {it.price}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* Special request */}
        <Text className="mt-8 px-4 text-xl font-semibold">Special request</Text>
        <View className="px-4 mt-4 gap-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Ionicons name="restaurant-outline" size={20} color="#333" />
              <View className="ml-3 flex-1">
                <Text className="text-lg font-medium">Cutlery</Text>
                <Text
                  className="text-gray-500 text-sm"
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  Reduce waste. Select this option only if you really need
                  cutlery.
                </Text>
              </View>
            </View>
            <Switch
              value={needCutlery}
              onValueChange={setNeedCutlery}
              thumbColor={needCutlery ? "#F97316" : undefined}
            />
          </View>

          <View className="flex-row items-start">
            <Ionicons name="chatbubble-outline" size={20} color="#333" />
            <View className="ml-3 flex-1">
              <TouchableOpacity
                onPress={() => setShowOrderNote(true)}
                activeOpacity={0.8}
              >
                <Text className="text-lg font-medium">Any special requests?</Text>
              </TouchableOpacity>
              {showOrderNote && (
                <TextInput
                  placeholder="Anything else we need to know?"
                  value={orderNote}
                  onChangeText={setOrderNote}
                  className="mt-2 border border-gray-200 rounded-xl px-3 py-2 text-base text-gray-800"
                  multiline
                  autoFocus
                />
              )}
            </View>
          </View>
        </View>

        {/* Save on your order */}
        <Text className="mt-8 px-4 text-xl font-semibold">
          Save on your order
        </Text>
        <View className="mt-2 px-4">
          <View className="flex-row items-center justify-between bg-white border border-gray-300 rounded-2xl overflow-hidden py-2">
            <View className="px-4 flex-row items-center gap-2">
              <Ionicons name="bookmark-outline" size={20} color="#888" />
              <Text className="text-gray-600 font-light">
                Enter voucher code
              </Text>
            </View>
            <TouchableOpacity className="px-4 py-3">
              <Text className="text-orange-500 text-lg font-semibold">
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment summary */}
        <Text className="mt-8 px-4 text-xl font-semibold">Payment summary</Text>
        <View className="px-4 mt-4 p-4 rounded-xl">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600 font-light">Subtotal</Text>
            <Text className="font-light text-gray-600">
              KD {subtotal.toFixed(3)}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600 font-light">Delivery Fee</Text>
            <Text className="font-light text-gray-600">
              KD {deliveryFee.toFixed(3)}
            </Text>
          </View>
          <View className="flex-row justify-between pt-1">
            <Text className="text-lg font-medium">Total amount</Text>
            <Text className="text-lg font-medium">KD {total.toFixed(3)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Sticky footer */}
      <View
        className="absolute left-0 right-0 bottom-0 bg-white border-t border-gray-200 px-4 py-3 flex-row items-center justify-between"
        style={{ paddingBottom: 20 }}
      >
        <TouchableOpacity
          onPress={() => router.push("/(tabs)")}
          className="flex-1 border border-gray-300 mr-2 rounded-full py-3 items-center"
        >
          <Text className="text-base font-medium">Add items</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-orange-500 rounded-full py-3 items-center">
          <Text className="text-base font-semibold text-white">Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
