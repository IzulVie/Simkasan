import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';

export const useHafalan = (filters = {}) => {
  const queryClient = useQueryClient();

  // Get setoran hafalan records
  const hafalanQuery = useQuery({
    queryKey: ['hafalan', filters],
    queryFn: async () => {
      const res = await api.get('/api/hafalan', { params: filters });
      return res.data.data;
    },
  });

  // Create setoran hafalan
  const createHafalanMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post('/api/hafalan', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hafalan'] });
    },
  });

  // Update setoran hafalan
  const updateHafalanMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.put(`/api/hafalan/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hafalan'] });
    },
  });

  // Delete setoran hafalan
  const deleteHafalanMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/api/hafalan/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hafalan'] });
    },
  });

  return {
    records: hafalanQuery.data || [],
    isLoading: hafalanQuery.isLoading,
    createHafalan: createHafalanMutation.mutateAsync,
    isCreating: createHafalanMutation.isPending,
    updateHafalan: updateHafalanMutation.mutateAsync,
    isUpdating: updateHafalanMutation.isPending,
    deleteHafalan: deleteHafalanMutation.mutateAsync,
    isDeleting: deleteHafalanMutation.isPending,
  };
};
