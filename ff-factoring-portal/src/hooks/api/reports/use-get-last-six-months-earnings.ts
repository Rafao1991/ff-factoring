import { useQuery } from '@tanstack/react-query';

const getLastSixMonthsEarnings = async (
  token: string
): Promise<LastSixMonthsEarnings> => {
  if (!token) {
    throw new Error('Token is required');
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/reports/last-six-months-earnings`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const { data } = await response.json();
  return data;
};

export default function useGetLastSixMonthsEarnings(token: string) {
  const query = useQuery({
    queryKey: ['getLastSixMonthsEarnings'],
    queryFn: () => getLastSixMonthsEarnings(token),
  });

  return query;
}
