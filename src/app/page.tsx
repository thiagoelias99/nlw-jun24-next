import CreateTripForm from '@/components/forms/create-trip-form'
import Image from 'next/image'

export default function HomePage() {
  return (
    <div className='w-screen h-screen p-4 flex flex-col justify-center items-center bg-pattern bg-no-repeat bg-center'>
      <header className='w-full flex flex-col justify-center items-center gap-3.5'>
        <Image src='/Logo.png' width={172} height={0} alt='Planner Logo' />
        <span className='text-lg'>Convide seus amigos e planeje sua próxima viagem!</span>
      </header>
      <main className='w-full py-10'>
        <CreateTripForm />
      </main>
      <footer className='w-full flex justify-center items-center'>
        <p className='text-center text-sm text-muted'>Ao planejar sua viagem pela plann.er você automaticamente concorda
          com nossos <strong className='text-foreground underline'>termos de uso</strong> e <strong className='text-foreground underline'>políticas de privacidade</strong>.</p>
      </footer>
    </div>
  )
}