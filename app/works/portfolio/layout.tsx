import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Palleti Jashwanth — Creative Technologist',
  description:
    'Creative Technologist: music composer, short film director, 3D artist, and software engineer. Production AI engineering meets film/music/3D craft.',
  openGraph: {
    title: 'Palleti Jashwanth — Creative Technologist',
    description:
      'Creative Technologist: music composer, short film director, 3D artist, and software engineer.',
    url: 'https://jashtechno.com/portfolio',
    type: 'website',
  },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
