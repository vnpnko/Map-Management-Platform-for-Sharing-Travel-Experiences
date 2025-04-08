import React, { createContext, useState, useContext, useEffect } from "react";
import { Map } from "../models/Map.ts";

interface DraftMapContextProps {
  draftMap: Map | null;
  setDraftMap: (map: Map | null) => void;
}

export const DraftMapContext = createContext<DraftMapContextProps | undefined>(
  undefined,
);

export const DraftMapProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [draftMap, setDraftMap] = useState<Map | null>(() => {
    const storedDraft = localStorage.getItem("draftMap");
    return storedDraft ? JSON.parse(storedDraft) : null;
  });

  useEffect(() => {
    if (draftMap) {
      localStorage.setItem("draftMap", JSON.stringify(draftMap));
    } else {
      localStorage.removeItem("draftMap");
    }
  }, [draftMap]);

  return (
    <DraftMapContext.Provider value={{ draftMap, setDraftMap }}>
      {children}
    </DraftMapContext.Provider>
  );
};

export const useDraftMap = () => {
  const context = useContext(DraftMapContext);
  if (!context) {
    throw new Error("useDraftMap must be used within a DraftMapProvider");
  }
  return context;
};
