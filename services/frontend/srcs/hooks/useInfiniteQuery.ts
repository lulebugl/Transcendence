import { useState, useRef, useCallback, useEffect } from "react";

interface UseInfiniteQueryResult<T> {
  data: T[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => void;
}

export function useInfiniteQuery<T>(
  queryFn: (offset: number) => Promise<T[]>,
  pageSize: number = 50
): UseInfiniteQueryResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const offsetRef = useRef(0);
  const queryFnRef = useRef(queryFn);
  queryFnRef.current = queryFn;

  const fetchData = useCallback(
    async (isInitial: boolean) => {
      if (isInitial) {
        setIsLoading(true);
        setError(null);
        offsetRef.current = 0;
      } else {
        setIsLoadingMore(true);
      }

      try {
        const newData = await queryFnRef.current(offsetRef.current);

        if (newData.length < pageSize) {
          setHasMore(false);
        }

        setData((prev) => (isInitial ? newData : [...prev, ...newData]));
        offsetRef.current += newData.length;
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [pageSize]
  );

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  return {
    data,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore: () => fetchData(false),
  };
}
