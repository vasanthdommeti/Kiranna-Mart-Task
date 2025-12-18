import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { Order, OrderTimelineEntry, OrderTimelineStatus } from "@/types";

type OrdersState = {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateStatus: (
    id: string,
    status: string,
    updater?: (timeline: OrderTimelineEntry[]) => OrderTimelineEntry[]
  ) => void;
  clearOrders: () => void;
};

const updateTimelineStatuses = (
  timeline: OrderTimelineEntry[],
  activeKey: string
) => {
  let activeFound = false;
  return timeline.map((step) => {
    if (activeFound) {
      return { ...step, status: "pending" as OrderTimelineStatus };
    }
    if (step.key === activeKey) {
      activeFound = true;
      return { ...step, status: "current" as OrderTimelineStatus };
    }
    return { ...step, status: "done" as OrderTimelineStatus };
  });
};

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) =>
        set((state) => ({
          orders: [
            {
              ...order,
              timeline: updateTimelineStatuses(order.timeline, order.timeline[0].key),
            },
            ...state.orders,
          ],
        })),
      updateStatus: (id, status, updater) =>
        set((state) => ({
          orders: state.orders.map((o) => {
            if (o.id !== id) return o;
            const updatedTimeline = updater
              ? updater(o.timeline)
              : updateTimelineStatuses(o.timeline, status);
            return {
              ...o,
              status,
              timeline: updatedTimeline,
            };
          }),
        })),
      clearOrders: () => set({ orders: [] }),
    }),
    {
      name: "orders-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        orders: state.orders,
      }),
    }
  )
);

export const resetOrdersStore = () => {
  useOrdersStore.setState({ orders: [] });
};
