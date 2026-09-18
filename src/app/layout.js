import '@/styles/globals.css';
import '@/styles/admin.css';
import SmoothScroll from '@/components/SmoothScroll';

export const metadata = {
  metadataBase: new URL('https://atzyncmedia.com'),
  title: {
    default: 'ATZYNC MEDIA | Creative Video Production & Digital Marketing',
    template: '%s | ATZYNC MEDIA',
  },
  description: 'ATZYNC MEDIA — A Mint of Creativity. IDEAS → VISUALS → IMPACT. Premium video production and visual studio specializing in Commercial Ad Films, Product Photography, Corporate Videos, Real Estate Videos, Promotional Videos, and Meta Ads.',
  keywords: ['Video Editing', 'Commercial Ad Film', 'Product Photography', 'Corporate Videos', 'Real Estate Videos', 'Promotional Videos', 'Meta Ads', 'Post Production', 'Visual Content', 'ATZYNC MEDIA'],
  authors: [{ name: 'ATZYNC MEDIA' }],
  creator: 'ATZYNC MEDIA',
  publisher: 'ATZYNC MEDIA',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'ATZYNC MEDIA | Creative Video Production & Digital Marketing',
    description: 'ATZYNC MEDIA — A Mint of Creativity. IDEAS → VISUALS → IMPACT. Premium video production and visual studio specializing in Commercial Ad Films, Product Photography, Corporate Videos, Real Estate Videos, Promotional Videos, and Meta Ads.',
    url: 'https://atzyncmedia.com',
    siteName: 'ATZYNC MEDIA',
    images: [
      {
        url: '/logo-black.png',
        width: 1200,
        height: 630,
        alt: 'ATZYNC MEDIA Studio Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ATZYNC MEDIA | Creative Video Production & Digital Marketing',
    description: 'ATZYNC MEDIA — A Mint of Creativity. Premium Video Production & Visual Studio.',
    images: ['/logo-black.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/logo-black.png', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0a0a',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
