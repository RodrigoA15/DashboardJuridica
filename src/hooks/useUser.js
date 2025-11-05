import { useQuery } from '@tanstack/react-query';
import { verifyToken } from '../api/auth';
import Cookies from 'js-cookie';

export const useUser = () => {
  const token = Cookies.get('token');

  const TIME = 1000 * 60 * 60 * 23;

  const {
    data: user,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['user'],
    queryFn: verifyToken,
    enabled: !!token,
    retry: 1,
    staleTime: Infinity,
    refetchInterval: TIME,
    refetchIntervalInBackground: true
  });

  return { user, isLoading, isError };
};
