import { useQuery } from '@tanstack/react-query';

const getCustomer = async (
  documentNumber: string | null
): Promise<Customer> => {
  if (!documentNumber) throw new Error('Document number is required');

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/customers/${documentNumber}`
  );
  const { data } = await response.json();
  return data;
};

export default function useGetCustomer(documentNumber: string | null) {
  const query = useQuery({
    queryKey: ['getCustomer', documentNumber],
    queryFn: () => getCustomer(documentNumber),
  });

  return query;
}
