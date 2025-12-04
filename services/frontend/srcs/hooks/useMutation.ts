import { useCallback, useRef, useState } from "react";

type Mutation<T, A> = (args: A) => Promise<T>;

interface UseMutationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useMutation<T, A = void>(
  mutationFn: Mutation<T, A>,
  options: UseMutationOptions<T> = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const optionRef = useRef(options);
  optionRef.current = options;

  const mutate = useCallback(async (args: A) => {
	setIsLoading(true);
	setError(null);

	try {
		const res = await mutationFn(args);
		optionRef.current.onSuccess?.(res);
		return res;
	} catch (err) {
		const error = err instanceof Error ? err : new Error(String(err));
		setError(error);
		if (optionRef.current.onError) {
			optionRef.current.onError(error);
		} else {
			throw error;
		}
	} finally {
		setIsLoading(false);
	}
  }, [mutationFn]);

  return { mutate, isLoading, error };
}
