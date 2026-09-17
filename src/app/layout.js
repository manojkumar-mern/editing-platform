import '@/styles/globals.css';
import '@/styles/admin.css';
import SmoothScroll from '@/components/SmoothScroll';

export const metadata = {
  title: 'ATZYNC MEDIA | Creative Video Production & Digital Marketing',
  description: 'ATZYNC MEDIA — A Mint of Creativity. IDEAS → VISUALS → IMPACT. Premium video production and visual studio specializing in Commercial Ad Films, Product Photography, Corporate Videos, Real Estate Videos, Promotional Videos, and Meta Ads.',
  keywords: ['Video Editing', 'Commercial Ad Film', 'Product Photography', 'Corporate Videos', 'Real Estate Videos', 'Promotional Videos', 'Meta Ads', 'Post Production', 'Visual Content', 'ATZYNC MEDIA'],
  authors: [{ name: 'ATZYNC MEDIA' }],
  robots: 'index, follow',
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
