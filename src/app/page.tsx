import { EisenhowerContainer, EisenhowerMatrix } from '@/modules/todo';

export default function Home() {
  return (
    <main className='h-full container mx-auto py-5 overflow-auto'>
      <div className='flex flex-col items-center justify-center'>
        <h1 className='text-3xl mb-3'>Eisenhower Matrix</h1>
      </div>
      <EisenhowerContainer>
        <EisenhowerMatrix />
      </EisenhowerContainer>
    </main>
  );
}
