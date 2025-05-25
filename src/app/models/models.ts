// Film model
export interface Film {
  id: number;
  title: string;
  year: number;
  language: 'Tamil' | 'Telugu' | 'Hindi' | 'Multilingual';
  genre: string[];
  role: string;
  director: string;
  poster: string;
  description: string;
  trailer?: string;
}

// Award model
export interface Award {
  id: number;
  title: string;
  year: number;
  category: string;
  film: string;
  icon: string;
  description: string;
  image?: string;
}

// Philanthropy project model
export interface PhilanthropyProject {
  id: number;
  title: string;
  category: string;
  description: string;
  impact: string;
  image: string;
  link?: string;
}

// Gallery image model
export interface GalleryImage {
  id: number;
  url: string;
  alt: string;
  category: string;
  caption: string;
  date?: string;
  width: number;
  height: number;
}

// Media item model
export interface MediaItem {
  id: number;
  title: string;
  source: string;
  date: string;
  type: 'interview' | 'article' | 'press' | 'video';
  image: string;
  link: string;
  excerpt: string;
}

// Fashion item model
export interface FashionItem {
  id: number;
  name: string;
  designer: string;
  date: string;
  event: string;
  category: 'red carpet' | 'photoshoot' | 'casual' | 'brand';
  image: string;
  description: string;
}

// News item model
export interface NewsItem {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  link: string;
}