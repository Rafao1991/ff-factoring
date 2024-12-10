import { useQuery } from '@tanstack/react-query';

const listTransactions = async (): Promise<Transaction[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/transactions`
  );
  const { data } = await response.json();
  return data;
};

export default function useListTransactions() {
  const query = useQuery({
    queryKey: ['listTransactions'],
    queryFn: listTransactions,
  });

  return query;
}
