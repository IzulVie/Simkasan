import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';

export const useNilai = (filters = {}) => {
  const queryClient = useQueryClient();

  // Get academic grades
  const nilaiQuery = useQuery({
    queryKey: ['nilai', filters],
    queryFn: async () => {
      const res = await api.get('/api/nilai', { params: filters });
      return res.data.data;
    },
  });

  // Create grade
  const createNilaiMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post('/api/nilai', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nilai'] });
    },
  });

  // Update grade
  const updateNilaiMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.put(`/api/nilai/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nilai'] });
    },
  });

  // Delete grade
  const deleteNilaiMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/api/nilai/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nilai'] });
    },
  });

  return {
    records: nilaiQuery.data || [],
    isLoading: nilaiQuery.isLoading,
    createNilai: createNilaiMutation.mutateAsync,
    isCreating: createNilaiMutation.isPending,
    updateNilai: updateNilaiMutation.mutateAsync,
    isUpdating: updateNilaiMutation.isPending,
    deleteNilai: deleteNilaiMutation.mutateAsync,
    isDeleting: deleteNilaiMutation.isPending,
  };
};
