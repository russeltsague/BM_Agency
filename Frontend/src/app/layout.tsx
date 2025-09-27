import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BM Agency - Agence de Communication Digitale 360°',
  description: 'BM Agency est votre partenaire de confiance pour la communication digitale, le marketing, les objets publicitaires et la création de contenu.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          defaultTheme="light"
          storageKey="bm-agency-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
