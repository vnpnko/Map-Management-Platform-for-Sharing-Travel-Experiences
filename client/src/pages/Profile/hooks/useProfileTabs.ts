import { useState } from "react";

export type ProfileTab = "maps" | "places" | "followers" | "following";

export const useProfileTabs = () => {
  const [activeTab, setActiveTab] = useState<ProfileTab>("maps");
  return { activeTab, setActiveTab };
};
