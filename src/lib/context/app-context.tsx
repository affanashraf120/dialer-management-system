import React, { createContext } from "react";
import { siteConfig } from "../../config/site";
import { useLocalStorageState } from "@lib/hooks";

interface AppContextProps {
  children: React.ReactNode;
}

export interface AgencyOption {
  label: string;
  value: string;
}

interface AppContextState {
  selectedAgency: AgencyOption;
  onSelectAgency: (agency: AgencyOption) => void;
}

export const AppContext = createContext<AppContextState | undefined>(undefined);

export const AppContextProvider = ({ children }: AppContextProps) => {
  const [selectedAgency, setSelectedAgency] =
    useLocalStorageState<AgencyOption>(
      "selectedAgency",
      siteConfig.agencies.ics as AgencyOption
    );

  const onSelectAgency = (agency: AgencyOption) => {
    setSelectedAgency(agency);
  };

  return (
    <AppContext.Provider value={{ selectedAgency, onSelectAgency }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
