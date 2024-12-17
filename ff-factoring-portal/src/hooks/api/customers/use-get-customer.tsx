import { useQuery } from '@tanstack/react-query';

const getCustomer = async (
  documentNumber: string,
  customerType: CustomerType,
  token: string
): Promise<Customer> => {
  if (!token) {
    throw new Error('Token is required');
  }

  if (!documentNumber) throw new Error('Document number is required');

  if (!customerType) throw new Error('Customer type is required');

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/customers/${documentNumber}/${customerType}`,
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
  documentNumber: string,
  customerType: CustomerType,
  token: string
) {
  const query = useQuery({
    queryKey: ['getCustomer', documentNumber],
    queryFn: () => getCustomer(documentNumber, customerType, token),
  });

  return query;
}
