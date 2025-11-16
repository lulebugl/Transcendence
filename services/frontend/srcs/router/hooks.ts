import { useRouterContext } from './context';
import { parseSearchParams } from './utils';

/**
 * Hook to programmatically navigate
 * Usage: const navigate = useNavigate(); navigate('/path');
 */
export const useNavigate = () => {
  const { navigate } = useRouterContext();
  return navigate;
};

/**
 * Hook to get current location
 * Usage: const location = useLocation();
 */
export const useLocation = () => {
  const { location } = useRouterContext();
  return location;
};

/**
 * Hook to get URL parameters from route
 * Usage: const { id } = useParams(); // for route /user/:id
 */
export const useParams = (): Record<string, string> => {
  const { matches } = useRouterContext();
  // Get params from the most specific match (last one)
  if (matches.length > 0) {
    return matches[matches.length - 1].params;
  }
  return {};
};

/**
 * Hook to get search params from URL
 * Usage: const searchParams = useSearchParams(); const id = searchParams.get('id');
 */
export const useSearchParams = (): URLSearchParams => {
  const { location } = useRouterContext();
  return parseSearchParams(location.search);
};

