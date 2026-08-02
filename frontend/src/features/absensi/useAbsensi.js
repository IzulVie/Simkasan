import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';

export const useAbsensi = (filters = {}) => {
  const queryClient = useQueryClient();

  // Get attendance records
  const attendanceQuery = useQuery({
    queryKey: ['absensi', filters],
    queryFn: async () => {
      const res = await api.get('/api/absensi', { params: filters });
      return res.data.data;
    },
  });

  // Get attendance recap
  const recapQuery = useQuery({
    queryKey: ['absensi-rekap', filters],
    queryFn: async () => {
      const res = await api.get('/api/absensi/rekap', { params: filters });
      return res.data.data;
    },
  });

  // Save/Submit bulk attendance
  const saveAttendanceMutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post('/api/absensi', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['absensi'] });
      queryClient.invalidateQueries({ queryKey: ['absensi-rekap'] });
    },
  });

  return {
    records: attendanceQuery.data || [],
    isLoadingRecords: attendanceQuery.isLoading,
    recap: recapQuery.data || [],
    isLoadingRecap: recapQuery.isLoading,
    saveAttendance: saveAttendanceMutation.mutateAsync,
    isSaving: saveAttendanceMutation.isPending,
  };
};
