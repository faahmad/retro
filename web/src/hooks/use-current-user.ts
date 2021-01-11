import * as React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export function useCurrentUser() {
  return React.useContext(CurrentUserContext);
}
