import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'BM Agency - Agence de Communication Digitale 360°',
  description: 'BM Agency est votre partenaire de confiance pour la communication digitale, le marketing, les objets publicitaires et la création de contenu au Cameroun.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          defaultTheme="light"
          storageKey="bm-agency-theme"
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
