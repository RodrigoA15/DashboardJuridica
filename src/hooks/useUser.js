import { useQuery } from '@tanstack/react-query';
import { verifyToken } from '../api/auth';
import { hasAccessToken } from '../api/token';

const REFETCH_MS = 1000 * 60 * 60 * 23;

export const useUser = () => {
  const tokenPresent = hasAccessToken();

  const { data: user, isPending, isError } = useQuery({
    queryKey: ['user'],
    queryFn: verifyToken,
    enabled: tokenPresent,
    retry: false,
    staleTime: Infinity,
    refetchInterval: REFETCH_MS,
    refetchIntervalInBackground: true
  });

  return {
    user: tokenPresent ? user : null,
    isLoading: tokenPresent && isPending,
    isError: tokenPresent && isError
  };
};
