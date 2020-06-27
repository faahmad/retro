import { useQuery } from "@apollo/react-hooks";
import { USER_QUERY as BASIC_USER_QUERY } from "../AppRoutes";

export function useBasicUserQuery() {
  return useQuery(BASIC_USER_QUERY);
}
