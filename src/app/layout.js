import '@/styles/globals.css';
import SmoothScroll from '@/components/SmoothScroll';

export const metadata = {
  title: 'ATZYNC MEDIA | Creative Video Editing & Visual Studio',
  description: 'ATZYNC MEDIA — A Mint of Creativity. IDEAS → VISUALS → IMPACT. Creative video editing and visual content studio specializing in Branding Films, Commercials, and Social Media Videos.',
  keywords: ['Video Editing', 'Branding Films', 'Commercials', 'Social Media Videos', 'Post Production', 'Visual Content', 'ATZYNC MEDIA'],
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
