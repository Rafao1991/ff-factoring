import { useQuery } from '@tanstack/react-query';

const getCustomer = async (
  documentNumber: string | null,
  token: string
): Promise<Customer> => {
  if (!token) {
    throw new Error('Token is required');
  }

  if (!documentNumber) throw new Error('Document number is required');

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/customers/${documentNumber}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const { data } = await response.json();
  return data;
};

export default function useGetCustomer(
  documentNumber: string | null,
  token: string
) {
  const query = useQuery({
    queryKey: ['getCustomer', documentNumber],
    queryFn: () => getCustomer(documentNumber, token),
  });

  return query;
}
