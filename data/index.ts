import { Restaurant } from "@/types";

export const categories = [
  { id: 1, title: "Food", icon: require("../assets/images/food.png") },
  {
    id: 2,
    title: "Groceries",
    icon: require("../assets/images/groceries.png"),
  },
  {
    id: 3,
    title: "Health & beauty",
    icon: require("../assets/images/health.png"),
  },
  { id: 4, title: "Flowers", icon: require("../assets/images/flowers.png") },
  {
    id: 5,
    title: "Electronics",
    icon: require("../assets/images/electronics.png"),
  },
];

export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "Ebn 3my",
    image: require("../assets/images/Banner.png"),
    rating: "4.3",
    reviews: "100+",
    eta: "45 mins",
    fee: "KWD 0.950",
  },
  {
    id: "2",
    name: "Madhbi Najd",
    image: require("../assets/images/Banner.png"),
    rating: "4.5",
    reviews: "1,000+",
    eta: "60 mins",
    fee: "KWD 0.500",
  },
  {
    id: "3",
    name: "Labnah And Zaatar",
    image: require("../assets/images/Banner.png"),
    rating: "4.3",
    reviews: "500+",
    eta: "45 mins",
    fee: "KWD 0.500",
    isPro: true,
  },
  {
    id: "4",
    name: "Labnah And Zaatar",
    image: require("../assets/images/Banner.png"),
    rating: "4.3",
    reviews: "500+",
    eta: "45 mins",
    fee: "KWD 0.500",
    isPro: true,
  },
  {
    id: "5",
    name: "Labnah And Zaatar",
    image: require("../assets/images/Banner.png"),
    rating: "4.3",
    reviews: "500+",
    eta: "45 mins",
    fee: "KWD 0.500",
    isPro: true,
  },
  {
    id: "6",
    name: "Labnah And Zaatar",
    image: require("../assets/images/Banner.png"),
    rating: "4.3",
    reviews: "500+",
    eta: "45 mins",
    fee: "KWD 0.500",
    isPro: true,
  },
  {
    id: "7",
    name: "Labnah And Zaatar",
    image: require("../assets/images/Banner.png"),
    rating: "4.3",
    reviews: "500+",
    eta: "45 mins",
    fee: "KWD 0.500",
    isPro: true,
  },
];

export const TAB_LABELS = ["Picks for you 🔥", "SAJ.", "Shawarma & Kebab."];
