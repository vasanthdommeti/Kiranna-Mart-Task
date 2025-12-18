import { Region } from "react-native-maps";

export type Restaurant = {
  id: string;
  name: string;
  image: any;
  rating: string;
  reviews: string;
  eta: string;
  fee: string;
  isPro?: boolean;
  price?: number;
  keywords?: string[];
};

export type PromoModalProps = {
  onClose: () => void;
  promoAmount: string;
  promoText: string;
  timer: string;
  data: Restaurant[];
  bottomInset: number;
};

export type Item = {
  id: string;
  name: string;
  image: any;
  rating: string;
  reviews: string;
  eta: string;
  fee: string;
  isPro?: boolean;
  price?: number;
  section?: string;
  description?: string;
};

export type CartContextType = {
  selected: Item | null;
  setSelected: (item: Item | null) => void;
  cartItems: { item: Item; quantity: number; note?: string }[];
  addToCart: (item: Item, quantity?: number, note?: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateNote: (id: string, note: string) => void;
  clearCart: () => void;
  totalItems: number;
  cartTotal: number;
  orderNote: string;
  setOrderNote: (note: string) => void;
};

export type ProductModalProps = {
  visible: boolean;
  onClose: () => void;
  onAdd: (quantity: number, note?: string) => void;
  initialQuantity?: number;
  initialNote?: string;
  image: any;
  title: string;
  subtitle?: string;
  description?: string;
  price: string;
};

export interface LastTabContextType {
  lastTab: string;
  setLastTab: (tab: string) => void;
}

export interface LocationState {
  region?: Region;
  address?: string;
  setLocation: (region: Region, address: string) => void;
}
