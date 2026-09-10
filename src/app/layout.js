import '@/styles/globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import CustomCursor from '@/components/CustomCursor';

export const metadata = {
  title: 'ATZINC MEDIA | Creative Video Editing & Visual Studio',
  description: 'ATZINC MEDIA — A Mint of Creativity. IDEAS → VISUALS → IMPACT. Creative video editing and visual content studio specializing in Branding Films, Commercials, and Social Media Videos.',
  keywords: ['Video Editing', 'Branding Films', 'Commercials', 'Social Media Videos', 'Post Production', 'Visual Content', 'ATZINC MEDIA'],
  authors: [{ name: 'ATZINC MEDIA' }],
  robots: 'index, follow',
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
        <CustomCursor />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
