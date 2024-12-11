import { useQuery } from '@tanstack/react-query';

const listCustomers = async (token: string): Promise<Customer[]> => {
  if (!token) {
    throw new Error('Token is required');
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/customers`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const { data } = await response.json();
  return data;
};

export default function useListCustomers(token: string) {
  const query = useQuery({
    queryKey: ['listCustomers'],
    queryFn: () => listCustomers(token),
  });

  return query;
}
