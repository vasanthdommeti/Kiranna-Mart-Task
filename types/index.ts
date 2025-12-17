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
};

export type CartContextType = {
  selected: Item | null;
  setSelected: (item: Item) => void;
};

export type ProductModalProps = {
  visible: boolean;
  onClose: () => void;
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
