/**
 * ATZYNC MEDIA - Project Portfolio Data Architecture
 */

export const projects = [
  {
    id: 'project-01',
    title: 'NOCTURNE',
    category: 'Branding Film',
    year: '2026',
    client: 'EDITORIAL CUT',
    description: 'High-fashion pacing, meticulous audio architecture, and custom color grading crafted to elevate brand perception.',
    video: '/videos/project-01.mp4',
    poster: '/images/project-01.jpg',
    slug: 'nocturne-branding-film',
    featured: true,
    aspect: '16/9',
  },
  {
    id: 'project-02',
    title: 'KINETIC RHYTHM',
    category: 'Commercial',
    year: '2026',
    client: 'HIGH retention CUT',
    description: 'Fast-paced, commercial editing engineered to capture immediate audience attention and drive conversion.',
    video: '/videos/project-02.mp4',
    poster: '/images/project-02.jpg',
    slug: 'kinetic-rhythm-commercial',
    featured: true,
    aspect: '16/9',
  },
  {
    id: 'project-03',
    title: 'AURA',
    category: 'Social Media Video',
    year: '2026',
    client: 'VIRAL REEL',
    description: 'Platform-optimized visual storytelling, motion graphics integration, and rhythmic cuts tailored for social engagement.',
    video: '/videos/project-03.mp4',
    poster: '/images/project-03.jpg',
    slug: 'aura-social-media',
    featured: true,
    aspect: '16/9',
  },
];

export const getFeaturedProjects = () => projects.filter((p) => p.featured);
export const getProjectBySlug = (slug) => projects.find((p) => p.slug === slug);
