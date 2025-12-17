import { LocationState } from "@/types";
import React, { createContext, ReactNode, useContext, useState } from "react";
import type { Region } from "react-native-maps";

const LocationContext = createContext<LocationState>({
  region: undefined,
  address: undefined,
  setLocation: () => {},
});

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [region, setRegion] = useState<Region>();
  const [address, setAddress] = useState<string>();

  const setLocation = (newRegion: Region, newAddress: string) => {
    setRegion(newRegion);
    setAddress(newAddress);
  };

  return (
    <LocationContext.Provider value={{ region, address, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
