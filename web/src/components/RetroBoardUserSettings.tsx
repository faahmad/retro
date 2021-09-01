import * as React from "react";
import { useCurrentUser } from "../hooks/use-current-user";
import { userListener } from "../services/user-listener";
import { UserSettings } from "../types/user";
import firebase from "../lib/firebase";
import { FirestoreCollections } from "../constants/firestore-collections";

export function RetroBoardUserSettings() {
  const { settings, toggleFullscreen } = useUserSettings();

  return (
    <div className="flex">
      <div className="flex mb-4">
        <div>
          <p className="text-blue text-xs text-right">
            {settings?.isFullscreen ? "Shrink" : "Expand"}
          </p>
          <button
            aria-label="edit title button"
            className="flex items-center px-4 border border-blue text-blue text-2xl font-black focus:outline-none h-10 w-full active:transform-1"
            onClick={toggleFullscreen}
          >
            {settings?.isFullscreen ? <Collapse /> : <Expand />}
          </button>
        </div>
      </div>
    </div>
  );
}

const Expand = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
    />
  </svg>
);
const Collapse = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
    />
  </svg>
);

export function useUserSettings() {
  const currentUser = useCurrentUser();
  const userId = currentUser?.auth?.uid;

  const [userSettings, setUserSettings] = React.useState<UserSettings | undefined>(
    undefined
  );
  React.useEffect(() => {
    if (userId) {
      userListener(userId, (user) => setUserSettings(user?.settings));
    }
  }, [userId]);

  const handleUpdateSettings = async (settingsFields: Partial<UserSettings>) => {
    const updates = Object.keys(settingsFields).reduce((object: any, key: any) => {
      // @ts-ignore
      object[`settings.${key}`] = settingsFields[key];
      return object;
    }, {});
    await firebase
      .firestore()
      .collection(FirestoreCollections.USER)
      .doc(userId)
      .update(updates);

    return;
  };

  const handleToggleFullscreen = () => {
    handleUpdateSettings({ isFullscreen: !userSettings?.isFullscreen });
    return;
  };

  return {
    settings: userSettings,
    toggleFullscreen: handleToggleFullscreen
  };
}
