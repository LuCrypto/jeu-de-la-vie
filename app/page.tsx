'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  return (
    <div className="h-full w-full p-6 flex flex-col">
      <h1 className="text-6xl text-center">Jeu de la vie</h1>
      <div className="flex flex-row gap-6 justify-center items-center h-full">
        <button
          className="text-3xl text-black border border-black p-5 rounded-full transition-transform transform hover:scale-110 hover:text-white hover:bg-black"
          onClick={() => {
            router.push('/classique')
          }}
        >
          Classique
        </button>
        <button
          className="text-3xl text-black border border-black p-5 rounded-full transition-transform transform hover:scale-110 hover:text-white hover:bg-black"
          onClick={() => {
            router.push('/lenia')
          }}
        >
          Lenia
        </button>
      </div>
    </div>
  )
}
