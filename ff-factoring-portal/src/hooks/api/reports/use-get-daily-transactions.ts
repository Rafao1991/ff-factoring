import { useQuery } from '@tanstack/react-query';

const getDailyTransactions = async (
  token: string
): Promise<DailyTransactions> => {
  if (!token) {
    throw new Error('Token is required');
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/reports/daily-transactions`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const { data } = await response.json();
  return data;
};

export default function useGetDailyTransactions(token: string) {
  const query = useQuery({
    queryKey: ['getDailyTransactions'],
    queryFn: () => getDailyTransactions(token),
  });

  return query;
}
