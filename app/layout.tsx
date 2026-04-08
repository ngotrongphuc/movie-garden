import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Movie Garden — Classic Cinema, Streaming Free',
    template: '%s · Movie Garden',
  },
  description:
    'Watch thousands of classic films, silent movies, cult cartoons, and public domain cinema for free. Powered by the Internet Archive.',
  keywords: [
    'free movies',
    'classic cinema',
    'public domain',
    'silent films',
    'film noir',
    'classic cartoons',
  ],
  openGraph: {
    title: 'Movie Garden',
    description:
      'Watch thousands of classic films, silent movies, and public domain cinema for free.',
    type: 'website',
    siteName: 'Movie Garden',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
