import { Retro, RetroUserType } from "../types/retro";
import { User } from "../types/user";

export function getIsFacilitator(retro: Retro, userId: User["id"]) {
  let isFacilitator = false;
  const currentUserType = retro?.userIds[userId];
  // To be backwards compatible, we need to assign the facilitator as the person
  // who created the retro. This is how we used to grant the facilitor role before
  // we introduced the RetroUserType.
  if (
    (currentUserType !== RetroUserType.FACILITATOR ||
      // @ts-ignore
      currentUserType !== RetroUserType.GUEST) &&
    userId === retro?.createdById
  ) {
    isFacilitator = true;
  } else if (currentUserType === RetroUserType.FACILITATOR) {
    isFacilitator = true;
  }
  return isFacilitator;
}
