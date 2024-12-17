type CustomerType = 'A' | 'P' | 'I';

type Customer = {
  documentNumber: string;
  type: CustomerType;
  name: string;
  address?: string;
  addressNumber?: string;
  addressComplement?: string;
  city?: string;
  state?: string;
  zip?: string;
  emails?: string[];
  phones?: string[];
};
