import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';

export const useIuran = (filters = {}) => {
  const queryClient = useQueryClient();

  // Fetch list of iuran records
  const iuranQuery = useQuery({
    queryKey: ['iuran', filters],
    queryFn: async () => {
      const res = await api.get('/api/iuran', { params: filters });
      return res.data.data;
    },
  });

  // Generate bulk monthly records
  const generateMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post('/api/iuran/generate', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['iuran'] });
    },
  });

  // Mark an iuran record as Paid (Lunas)
  const lunasMutation = useMutation({
    mutationFn: async ({ id, keterangan }) => {
      const res = await api.put(`/api/iuran/${id}/lunas`, { keterangan });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['iuran'] });
    },
  });

  return {
    iurans: iuranQuery.data || [],
    isLoading: iuranQuery.isLoading,
    generateIuran: generateMutation.mutateAsync,
    isGenerating: generateMutation.isPending,
    markAsLunas: lunasMutation.mutateAsync,
    isMarking: lunasMutation.isPending,
  };
};
