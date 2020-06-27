import * as React from "react";
import { QuestionIcon } from "../images/QuestionIcon";

interface UserAvatarProps {
  photoURL?: string;
  displayName?: string;
  isAnonymous?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}
export function UserAvatar({
  photoURL,
  displayName,
  isAnonymous = false,
  size = "md"
}: UserAvatarProps) {
  const sharedClassNames = "flex content-center bg-white rounded-full mr-2";
  const divClassNames = "text-white items-center justify-center";
  const sizeMap = {
    sm: 25,
    md: 40,
    lg: 60,
    xl: 80
  };
  const styles = { height: sizeMap[size], width: sizeMap[size] };

  if (isAnonymous) {
    return (
      <div className={`${sharedClassNames} ${divClassNames}`} style={styles}>
        <QuestionIcon />
      </div>
    );
  }

  // Default to displaying the user's photo.
  if (photoURL) {
    return (
      <img
        alt="user avatar"
        className="flex content-center bg-red border rounded-full mr-2"
        style={styles}
        src={photoURL}
      />
    );
  }

  return (
    <div className={`${sharedClassNames} ${divClassNames}`} style={styles}>
      {/* If the user doesn't have a displayName, display the Question icon. */}
      {displayName ? displayName[0] : <QuestionIcon />}
    </div>
  );
}
