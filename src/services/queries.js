import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from './api';

export function useProfileQuery(options = {}) {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await axiosInstance.get('/auth/profile');
      const data = res.data;
      if (data?.success === false) {
        throw new Error(data?.message || 'Failed to load profile');
      }
      return data.user || data.data?.user || data;
    },
    staleTime: 60 * 1000,
    retry: 1,
    ...options,
  });
}
