import { CustomerSchema } from '@/components/customer/customer-form';
import { useMutation } from '@tanstack/react-query';

const createCustomer = async (customer: CustomerSchema) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/customers`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customer),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `${response.status} - ${response.statusText} - ${error.message}`
    );
  }
};

export default function useCreateCustomer() {
  const mutation = useMutation({
    mutationFn: (customer: CustomerSchema) => createCustomer(customer),
  });

  return mutation;
}
