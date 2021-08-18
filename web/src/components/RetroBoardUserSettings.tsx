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
          {/* <p className="text-blue text-xs text-right">Size</p> */}
          <button
            aria-label="edit title button"
            className="flex items-center px-4 border border-blue text-2xl font-black focus:outline-none h-10 w-10 active:transform-1"
            onClick={toggleFullscreen}
          >
            {settings?.isFullscreen ? <Collapse /> : <Expand />}
          </button>
        </div>
      </div>
    </div>
  );
}

const Expand = () => <span className="text-blue">&#x2192;</span>;
const Collapse = () => <span className="text-blue">&#x2190;</span>;

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
