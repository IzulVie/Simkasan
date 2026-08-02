import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';

export const useKelas = () => {
  const queryClient = useQueryClient();

  // Get list of classes
  const classesQuery = useQuery({
    queryKey: ['kelas'],
    queryFn: async () => {
      const res = await api.get('/api/kelas');
      return res.data.data;
    },
  });

  // Create class
  const createClassMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post('/api/kelas', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kelas'] });
    },
  });

  // Update class
  const updateClassMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.put(`/api/kelas/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kelas'] });
    },
  });

  // Delete class
  const deleteClassMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/api/kelas/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kelas'] });
    },
  });

  return {
    classes: classesQuery.data || [],
    isLoading: classesQuery.isLoading,
    isError: classesQuery.isError,
    createClass: createClassMutation.mutateAsync,
    isCreating: createClassMutation.isPending,
    updateClass: updateClassMutation.mutateAsync,
    isUpdating: updateClassMutation.isPending,
    deleteClass: deleteClassMutation.mutateAsync,
    isDeleting: deleteClassMutation.isPending,
  };
};
