import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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

export function formatPhone(value: string) {
  const cleanValue = value.replace(/\D/g, '');

  return cleanValue.length <= 8
    ? cleanValue.replace(/(\d{4})(\d)/, '$1-$2')
    : cleanValue.replace(/(\d{5})(\d)/, '$1-$2');
}
