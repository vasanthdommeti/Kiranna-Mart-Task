import { LastTabContextType } from "@/types";
import React, { createContext, useContext, useState } from "react";

const LastTabContext = createContext<LastTabContextType | undefined>(undefined);

export const LastTabProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lastTab, setLastTab] = useState("/(tabs)/index");
  return (
    <LastTabContext.Provider value={{ lastTab, setLastTab }}>
      {children}
    </LastTabContext.Provider>
  );
};

export const useLastTab = (): LastTabContextType => {
  const context = useContext(LastTabContext);
  if (!context) {
    throw new Error("useLastTab must be used within a LastTabProvider");
  }
  return context;
};
