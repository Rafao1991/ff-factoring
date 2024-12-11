import { CustomerSchema } from '@/components/customer/customer-form';
import { useMutation } from '@tanstack/react-query';

const updateCustomer = async (
  documentNumber: string,
  customer: CustomerSchema
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/customers/${documentNumber}`,
    {
      method: 'PUT',
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

export default function useUpdateCustomer() {
  const mutation = useMutation({
    mutationFn: ({
      documentNumber,
      customer,
    }: {
      documentNumber: string;
      customer: CustomerSchema;
    }) => updateCustomer(documentNumber, customer),
  });

  return mutation;
}