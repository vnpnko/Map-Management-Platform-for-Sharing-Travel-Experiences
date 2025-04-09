import React, { createContext, useReducer, useContext, useEffect } from "react";
import { Map } from "../models/Map.ts";

type DraftMapAction =
  | { type: "SET_MAP"; payload: Map | null }
  | { type: "ADD_PLACE"; payload: string }
  | { type: "REMOVE_PLACE"; payload: string }
  | { type: "RESET" };

const draftMapReducer = (
  state: Map | null,
  action: DraftMapAction,
): Map | null => {
  switch (action.type) {
    case "SET_MAP":
      return action.payload;
    case "ADD_PLACE":
      if (!state) {
        return {
          _id: 0,
          name: "",
          description: "",
          places: [action.payload],
          likes: [],
        };
      }
      if (state.places.includes(action.payload)) return state;
      return { ...state, places: [...state.places, action.payload] };
    case "REMOVE_PLACE":
      if (!state) return state;
      return {
        ...state,
        places: state.places.filter((id) => id !== action.payload),
      };
    case "RESET":
      return null;
    default:
      return state;
  }
};

interface DraftMapContextProps {
  draftMap: Map | null;
  dispatch: React.Dispatch<DraftMapAction>;
}

const DraftMapContext = createContext<DraftMapContextProps | undefined>(
  undefined,
);

export const DraftMapProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [draftMap, dispatch] = useReducer(draftMapReducer, null, (initial) => {
    const stored = localStorage.getItem("draftMap");
    return stored ? JSON.parse(stored) : initial;
  });

  useEffect(() => {
    if (draftMap) {
      localStorage.setItem("draftMap", JSON.stringify(draftMap));
    } else {
      localStorage.removeItem("draftMap");
    }
  }, [draftMap]);

  return (
    <DraftMapContext.Provider value={{ draftMap, dispatch }}>
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
