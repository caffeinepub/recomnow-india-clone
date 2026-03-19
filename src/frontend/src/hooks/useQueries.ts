import { useQuery } from "@tanstack/react-query";
import type { Product } from "../backend.d";
import { useActor } from "./useActor";

export function useGetAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
    // Retry up to 4 times with exponential backoff to handle ICP canister cold-starts
    retry: 4,
    retryDelay: (attempt) => Math.min(2000 * 2 ** attempt, 20_000),
    // Refetch in background after mount so stale data is refreshed
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
}
