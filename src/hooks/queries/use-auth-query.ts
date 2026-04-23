import { useQuery } from "@tanstack/react-query";
import { authClient } from "#/lib/auth-client";
import { queryKeys } from "#/lib/query-keys";

export const useAuthQuery = () => useQuery({
  queryKey: queryKeys.auth.session(),
  queryFn: async () => {
    try {
      const { data } = await authClient.getSession()
      if (!data) {
        return null
      }
      return {
        user: data?.user,
        session: data?.session
      }
    } catch (err) {
      console.error(err);
      throw err
    }
  },
  staleTime: 1000 * 60 * 5
});