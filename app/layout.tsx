import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Jeu de la vie',
  description:
    'Le Jeu de la Vie (ou Game of Life en anglais) est un automate cellulaire, un modèle mathématique pour un univers de cellules sur une grille bidimensionnelle infinie. Il a été inventé par le mathématicien britannique John Horton Conway en 1970.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html className="h-min-full w-min-full" data-theme="light" lang="en">
      <body className={`${inter.className} h-screen`}>
        {children}
        <p className="fixed bottom-0 left-0 right-0 text-center text-sm text-gray-500 pb-6">
          Made with ❤️ by{' '}
          <a className="text-blue-500" href="https://x.com/LuCryptoFR">
            LuCrypto
          </a>
        </p>
      </body>
    </html>
  )
}
