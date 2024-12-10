import { useQuery } from '@tanstack/react-query';

const listCustomers = async (): Promise<Customer[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/customers`);
  const { data } = await response.json();
  return data;
};

export default function useListCustomers() {
  const query = useQuery({
    queryKey: ['listCustomers'],
    queryFn: listCustomers,
  });

  return query;
}
