import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';

export const useRole = () => {
  const queryClient = useQueryClient();

  // Fetch list of roles
  const rolesQuery = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const res = await api.get('/api/roles');
      return res.data.data;
    },
  });

  // Fetch list of all permissions
  const permissionsQuery = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const res = await api.get('/api/permissions');
      return res.data.data;
    },
  });

  // Create a new role
  const createRoleMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post('/api/roles', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });

  // Update a role (name and permissions)
  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, name, permissions }) => {
      const res = await api.put(`/api/roles/${id}`, { name, permissions });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });

  // Delete a role
  const deleteRoleMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/api/roles/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });

  return {
    roles: rolesQuery.data || [],
    isLoadingRoles: rolesQuery.isLoading,
    permissions: permissionsQuery.data || [],
    isLoadingPermissions: permissionsQuery.isLoading,
    createRole: createRoleMutation.mutateAsync,
    isCreating: createRoleMutation.isPending,
    updateRole: updateRoleMutation.mutateAsync,
    isUpdating: updateRoleMutation.isPending,
    deleteRole: deleteRoleMutation.mutateAsync,
    isDeleting: deleteRoleMutation.isPending,
  };
};
