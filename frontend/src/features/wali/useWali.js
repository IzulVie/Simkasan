import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';

export const useWali = () => {
  const queryClient = useQueryClient();

  // Get list of wali santris
  const walisQuery = useQuery({
    queryKey: ['wali-santris'],
    queryFn: async () => {
      const res = await api.get('/api/wali-santris');
      return res.data.data;
    },
  });

  // Create wali santri
  const createWaliMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post('/api/wali-santris', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wali-santris'] });
    },
  });

  // Update wali santri
  const updateWaliMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.put(`/api/wali-santris/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wali-santris'] });
    },
  });

  // Delete wali santri
  const deleteWaliMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/api/wali-santris/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wali-santris'] });
    },
  });

  return {
    walis: walisQuery.data || [],
    isLoading: walisQuery.isLoading,
    isError: walisQuery.isError,
    createWali: createWaliMutation.mutateAsync,
    isCreating: createWaliMutation.isPending,
    updateWali: updateWaliMutation.mutateAsync,
    isUpdating: updateWaliMutation.isPending,
    deleteWali: deleteWaliMutation.mutateAsync,
    isDeleting: deleteWaliMutation.isPending,
  };
};
