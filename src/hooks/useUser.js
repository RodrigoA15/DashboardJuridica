import { useQuery } from '@tanstack/react-query';
import { verifyToken } from '../api/auth';
import Cookies from 'js-cookie';

const REFETCH_MS = 1000 * 60 * 60 * 23;

export const useUser = () => {
  const token = Cookies.get('token');

  const { data: user, isPending, isError } = useQuery({
    queryKey: ['user'],
    queryFn: verifyToken,
    enabled: !!token,
    retry: 1,
    staleTime: Infinity,
    refetchInterval: REFETCH_MS,
    refetchIntervalInBackground: true
  });

  return {
    user: token ? user : null,
    isLoading: !!token && isPending,
    isError: !!token && isError
  };
};
