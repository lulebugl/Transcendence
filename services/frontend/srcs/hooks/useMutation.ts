import { useCallback, useState } from "react";
import { resumeToPipeableStream } from "react-dom/server";

type Mutation<T, A> = (args: A) => Promise<T>;

interface UseMutationOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (data: T) => void;
}

export function useMutation<T, A = void>(
  mutationFn: Mutation<T, A>,
  options: UseMutationOptions<T> = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (args: A) => {
	setIsLoading(true);
	setError(null);

	try {
		const res = await mutationFn(args);
		options.onSuccess?.(res);
		return res;
	} catch (err) {
		console.log("Failed mutation: ", err);
		const error = err instanceof Error ? err : new Error(String(err));

		setError(error);
		if (options.onError && error instanceof Error) {
			(options.onError as (data: Error) => void)(error);
		}

		throw error;
	} finally {
		setIsLoading(false);
	}
  }, [mutationFn, options]);

  return { mutate, isLoading, error };
}
