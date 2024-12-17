import { CustomerSchema } from '@/components/customer/customer-form';
import { useMutation } from '@tanstack/react-query';

const updateCustomer = async (
  documentNumber: string,
  customer: CustomerSchema,
  token: string
) => {
  if (!token) {
    throw new Error('Token is required');
  }

  const { type } = customer;

  if (!type) {
    throw new Error('Type is required');
  }

  if (!documentNumber) {
    throw new Error('Document number is required');
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/customers/${documentNumber}/${type}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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

export default function useUpdateCustomer(token: string) {
  const mutation = useMutation({
    mutationFn: ({
      documentNumber,
      customer,
    }: {
      documentNumber: string;
      customer: CustomerSchema;
    }) => updateCustomer(documentNumber, customer, token),
  });

  return mutation;
}
