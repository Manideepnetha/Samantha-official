import { GalleryCollection, MediaGallery } from '../../services/api.service';

export interface GalleryStoryImage {
  id: number;
  caption: string;
  imageUrl: string;
  altText: string;
  type: string;
  date?: string;
  collectionKey: string;
  displayOrder: number;
}

export interface GalleryStorySet {
  id?: number;
  key: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  coverImageUrl: string;
  accentTone: string;
  sortOrder: number;
  images: GalleryStoryImage[];
  itemCount: number;
  leadImage: GalleryStoryImage | null;
  previewImages: GalleryStoryImage[];
}

export const GALLERY_CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Collections' },
  { value: 'films', label: 'Film Frames' },
  { value: 'events', label: 'Event Highlights' },
  { value: 'fashion', label: 'Fashion Editorials' },
  { value: 'bts', label: 'Behind The Scenes' },
  { value: 'photoshoots', label: 'Cover Shoots' }
];

const GALLERY_COLLECTION_PRESETS: GalleryCollection[] = [
  {
    key: 'fashion-editorials',
    title: 'Fashion Editorials',
    subtitle: 'Minimal silhouettes and statement styling',
    description: 'A polished runway of Samantha\'s editorial looks, arranged with generous space and a cinematic rhythm.',
    category: 'fashion',
    coverImageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748298223/d5wj1d4ydqe61_fr3adf.jpg',
    accentTone: '#d0a05a',
    sortOrder: 1
  },
  {
    key: 'event-highlights',
    title: 'Event Highlights',
    subtitle: 'Appearances, arrivals, and public moments',
    description: 'A bright layer of event photography paced like a premium social reel.',
    category: 'events',
    coverImageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748295435/5_6185746542628962569_bgalhv.jpg',
    accentTone: '#b87050',
    sortOrder: 2
  },
  {
    key: 'cover-shoots',
    title: 'Cover Shoots',
    subtitle: 'Magazine-ready frames',
    description: 'Large-format portrait work and cover-shoot imagery designed to feel elegant and immersive.',
    category: 'photoshoots',
    coverImageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748295799/5_6185746542628962570_c68nyo.jpg',
    accentTone: '#d3b598',
    sortOrder: 3
  },
  {
    key: 'film-frames',
    title: 'Film Frames',
    subtitle: 'Projects, production stills, and screen presence',
    description: 'A contained look at project imagery with a stronger editorial focus on composition and atmosphere.',
    category: 'films',
    coverImageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748296812/SRP_q8wmpl.jpg',
    accentTone: '#69808f',
    sortOrder: 4
  },
  {
    key: 'behind-the-scenes',
    title: 'Behind The Scenes',
    subtitle: 'Candid process and atmosphere',
    description: 'Production energy, in-between moments, and the softer documentary layer of the gallery.',
    category: 'bts',
    coverImageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748296881/53885681037_6a705301cf_o_ztjyeg.jpg',
    accentTone: '#7a7f68',
    sortOrder: 5
  }
];

const PRESET_LOOKUP = new Map(GALLERY_COLLECTION_PRESETS.map(item => [item.key, item]));

export function buildGalleryStorySets(
  collections: GalleryCollection[],
  mediaItems: MediaGallery[]
): GalleryStorySet[] {
  const groupedImages = new Map<string, GalleryStoryImage[]>();
  const collectionLookup = new Map<string, GalleryCollection>();

  for (const collection of collections) {
    const preset = PRESET_LOOKUP.get(collection.key);
    collectionLookup.set(collection.key, {
      ...preset,
      ...collection,
      subtitle: collection.subtitle || preset?.subtitle || '',
      description: collection.description || preset?.description || '',
      coverImageUrl: collection.coverImageUrl || preset?.coverImageUrl || '',
      accentTone: collection.accentTone || preset?.accentTone || '#d0a05a'
    });
  }

  mediaItems
    .filter(item => item.type !== 'Home')
    .forEach((item, index) => {
      const resolvedKey = item.collectionKey?.trim() || getFallbackCollectionKey(item.type);
      const mappedImage: GalleryStoryImage = {
        id: item.id ?? index + 1,
        caption: item.caption,
        imageUrl: item.imageUrl,
        altText: item.altText || item.caption,
        type: item.type,
        date: item.date,
        collectionKey: resolvedKey,
        displayOrder: item.displayOrder ?? 0
      };

      const existing = groupedImages.get(resolvedKey) || [];
      existing.push(mappedImage);
      groupedImages.set(resolvedKey, existing);
    });

  groupedImages.forEach((images, key) => {
    if (collectionLookup.has(key)) {
      return;
    }

    const firstImage = images[0];
    const preset = PRESET_LOOKUP.get(key);
    collectionLookup.set(key, preset || createFallbackCollection(firstImage?.type || 'gallery', key, firstImage?.imageUrl || '', collectionLookup.size + 1));
  });

  return Array.from(collectionLookup.values())
    .map(collection => {
      const images = (groupedImages.get(collection.key) || [])
        .sort((left, right) => {
          if (left.displayOrder !== right.displayOrder) {
            return left.displayOrder - right.displayOrder;
          }

          return left.id - right.id;
        });

      const leadImage = images[0] || null;
      const preset = PRESET_LOOKUP.get(collection.key);

      return {
        id: collection.id,
        key: collection.key,
        title: collection.title || preset?.title || toTitleCase(collection.key),
        subtitle: collection.subtitle || preset?.subtitle || getGalleryCategoryLabel(collection.category),
        description: collection.description || preset?.description || 'A curated visual story built from Samantha\'s image archive.',
        category: collection.category,
        coverImageUrl: collection.coverImageUrl || leadImage?.imageUrl || preset?.coverImageUrl || '',
        accentTone: collection.accentTone || preset?.accentTone || '#d0a05a',
        sortOrder: collection.sortOrder,
        images,
        itemCount: images.length,
        leadImage,
        previewImages: images.slice(0, 4)
      };
    })
    .filter(set => set.itemCount > 0)
    .sort((left, right) => {
      if (left.sortOrder !== right.sortOrder) {
        return left.sortOrder - right.sortOrder;
      }

      return left.title.localeCompare(right.title);
    });
}

export function getGalleryCategoryLabel(category: string): string {
  return GALLERY_CATEGORY_OPTIONS.find(option => option.value === category)?.label || toTitleCase(category);
}

export function createEmptyGalleryCollection(): GalleryCollection {
  return {
    key: '',
    title: '',
    subtitle: '',
    description: '',
    category: 'fashion',
    coverImageUrl: '',
    accentTone: '#d0a05a',
    sortOrder: 1
  };
}

export function createEmptyGalleryImage(): MediaGallery {
  return {
    caption: '',
    imageUrl: '',
    altText: '',
    type: 'fashion',
    date: '',
    collectionKey: '',
    displayOrder: 1
  };
}

export function normalizeGalleryCollectionKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getFallbackCollectionKey(category: string): string {
  switch (category) {
    case 'fashion':
      return 'fashion-editorials';
    case 'events':
      return 'event-highlights';
    case 'photoshoots':
      return 'cover-shoots';
    case 'films':
      return 'film-frames';
    case 'bts':
      return 'behind-the-scenes';
    default:
      return normalizeGalleryCollectionKey(category || 'gallery-set');
  }
}

function createFallbackCollection(category: string, key: string, coverImageUrl: string, sortOrder: number): GalleryCollection {
  return {
    key,
    title: toTitleCase(key),
    subtitle: getGalleryCategoryLabel(category),
    description: 'A curated visual story built from the current gallery archive.',
    category,
    coverImageUrl,
    accentTone: '#d0a05a',
    sortOrder
  };
}

function toTitleCase(value: string): string {
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, char => char.toUpperCase());
}
