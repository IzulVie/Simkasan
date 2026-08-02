import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';

export const useSantri = () => {
  const queryClient = useQueryClient();

  // Get list of students
  const santrisQuery = useQuery({
    queryKey: ['santris'],
    queryFn: async () => {
      const res = await api.get('/api/santris');
      return res.data.data;
    },
  });

  // Create student
  const createSantriMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post('/api/santris', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['santris'] });
    },
  });

  // Update student
  const updateSantriMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.put(`/api/santris/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['santris'] });
    },
  });

  // Delete student
  const deleteSantriMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/api/santris/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['santris'] });
    },
  });

  return {
    santris: santrisQuery.data || [],
    isLoading: santrisQuery.isLoading,
    isError: santrisQuery.isError,
    createSantri: createSantriMutation.mutateAsync,
    isCreating: createSantriMutation.isPending,
    updateSantri: updateSantriMutation.mutateAsync,
    isUpdating: updateSantriMutation.isPending,
    deleteSantri: deleteSantriMutation.mutateAsync,
    isDeleting: deleteSantriMutation.isPending,
  };
};
