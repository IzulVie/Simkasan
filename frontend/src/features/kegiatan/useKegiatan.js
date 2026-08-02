import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';

export const useKegiatan = (filters = {}) => {
  const queryClient = useQueryClient();

  // Get calendar activities
  const kegiatanQuery = useQuery({
    queryKey: ['kegiatan', filters],
    queryFn: async () => {
      const res = await api.get('/api/kegiatan', { params: filters });
      return res.data.data;
    },
  });

  // Create activity
  const createKegiatanMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post('/api/kegiatan', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kegiatan'] });
    },
  });

  // Update activity
  const updateKegiatanMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.put(`/api/kegiatan/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kegiatan'] });
    },
  });

  // Delete activity
  const deleteKegiatanMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/api/kegiatan/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kegiatan'] });
    },
  });

  return {
    activities: kegiatanQuery.data || [],
    isLoading: kegiatanQuery.isLoading,
    createKegiatan: createKegiatanMutation.mutateAsync,
    isCreating: createKegiatanMutation.isPending,
    updateKegiatan: updateKegiatanMutation.mutateAsync,
    isUpdating: updateKegiatanMutation.isPending,
    deleteKegiatan: deleteKegiatanMutation.mutateAsync,
    isDeleting: deleteKegiatanMutation.isPending,
  };
};
