import { useMutation } from '@tanstack/react-query';
import { useFetchRecords } from 'lib/Record/fetchRecords';

export const useRecord = () => {
  const { fetchInsertRecord } = useFetchRecords();
  const { mutateAsync, isPending, isError, data, error } = useMutation({
    mutationFn: (data) => {
      return fetchInsertRecord(data);
    }
  });

  const insertRecords = mutateAsync;

  return {
    insertRecords,
    isPending,
    isError,
    data,
    error
  };
};
