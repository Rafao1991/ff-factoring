import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { isValid as isValidCPF } from './cpf';
import { isValid as isValidCNPJ } from './cnpj';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCpfCnpj(value: string) {
  const cleanValue = value.replace(/\D/g, '');

  return cleanValue.length <= 11
    ? cleanValue
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1')
    : cleanValue
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
}

export function validateCpfCnpj(value: string) {
  if (value.length === 11) return isValidCPF(value);

  if (value.length === 14) return isValidCNPJ(value);

  return false;
}

export function formatPhone(value: string) {
  const cleanValue = value.replace(/\D/g, '');

  return cleanValue.length <= 10
    ? cleanValue.replace(/(\d{2})(\d)/, '$1 $2').replace(/(\d{4})(\d)/, '$1-$2')
    : cleanValue
        .replace(/(\d{2})(\d)/, '$1 $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
}
