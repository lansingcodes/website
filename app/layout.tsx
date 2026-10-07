import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import '@/lib/fontawesome'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const montserrat = Montserrat({
  weight: ['500', '700'],
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Lansing Codes',
  url: 'https://www.lansing.codes/',
  description: 'Resources for coders and community organizers of Lansing, MI.',
  logo: 'https://www.lansing.codes/favicon.ico'
}

export const metadata: Metadata = {
  title: 'Lansing Codes',
  description: 'Resources for coders and community organizers of Lansing, MI.',
  keywords:
    'lansing mi,lansing codes,meetups,events,code,coding,programming,hackathon,learning to code,coding resources,programming resources,learn to code',
  openGraph: {
    title: 'Lansing Codes',
    description: 'Resources for coders and community organizers of Lansing, MI.',
    type: 'website',
    url: 'https://www.lansing.codes/',
    locale: 'en_US',
    siteName: 'Lansing Codes',
    images: [
      {
        url: 'https://www.lansing.codes/resources-for-lansing-coders.jpg',
        width: 2850,
        height: 1420,
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@lansingcodes',
    creator: '@lansingcodes',
  },
  other: {
    'geo.region': 'US-MI',
    'geo.placename': 'Greater Lansing',
    'geo.position': '42.734552;-84.480615',
    ICBM: '42.734552, -84.480615',
    'fb:admins': '2327791',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-US" className={montserrat.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="icon" type="image/png" href="/favicon.ico?v=1" />
        <link rel="apple-touch-icon" type="image/png" href="/favicon.ico?v=1" />
        <link rel="image_src" type="image/png" href="/favicon.ico?v=1" />
        <link
          rel="preload"
          as="style"
          href="https://cdn.jsdelivr.net/npm/@lansingcodes/webfont@latest/font-lansing-codes.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@lansingcodes/webfont@latest/font-lansing-codes.css"
        />
        <link
          rel="preload"
          as="style"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-mfizz/2.4.1/font-mfizz.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-mfizz/2.4.1/font-mfizz.min.css"
        />
      </head>
      <body>
        <a className="sr-only focus:block" href="#mainContent">
          Skip to main content
        </a>
        <header>
          <Navigation />
        </header>
        <main id="mainContent">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
