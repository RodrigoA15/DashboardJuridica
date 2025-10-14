import { useQuery } from '@tanstack/react-query';
import { verifyToken } from '../api/auth';
import Cookies from 'js-cookie';

export const useUser = () => {
  const token = Cookies.get('token');

  const {
    data: user,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['user'],
    queryFn: verifyToken,
    enabled: !!token,
    retry: 1,
    staleTime: Infinity
  });

  return { user, isLoading, isError };
};
