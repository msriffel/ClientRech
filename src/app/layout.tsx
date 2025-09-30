import type { Metadata } from 'next'
import { PT_Sans } from 'next/font/google'
import './globals.css'

const ptSans = PT_Sans({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans'
})

export const metadata: Metadata = {
  title: 'ClientReach - CRM Inteligente',
  description: 'Gerencie seus clientes com inteligência artificial',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={ptSans.variable}>
      <body className={`${ptSans.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
