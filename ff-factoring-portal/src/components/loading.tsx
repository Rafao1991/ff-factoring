import { Loader2 } from 'lucide-react';

export default function Loading({
  message = 'Carregando',
}: {
  message?: string;
}) {
  return (
    <div className='flex items-center justify-center h-screen'>
      <Loader2 className='animate-spin w-12 h-12' />
      <p className='text-center'>{message}</p>
    </div>
  );
}
