import { Movie, MovieDownloadAsset } from '../../services/api.service';
import { FALLBACK_POSTER_URL, normalizeMovie } from './movie.utils';

interface MovieDownloadGroup {
  matchTitles: string[];
  assets: MovieDownloadAsset[];
}

const DOWNLOAD_GROUPS: MovieDownloadGroup[] = [
  {
    matchTitles: ['Seethamma Vakitlo Sirimalle Chettu', 'SVSC'],
    assets: [{ label: 'Download SVSC Files', url: 'https://drive.google.com/file/d/1bf7BqaXsFi_Oez_uLl1I5fjBBRGviOVt/view?usp=drive_link' }]
  },
  {
    matchTitles: ['Kushi'],
    assets: [{ label: 'Download Kushi Files', url: 'https://drive.google.com/file/d/15IKcsIvbgx_kVVPSbO9fT_fkJ8gEUsQn/view?usp=drive_link' }]
  },
  {
    matchTitles: ['A Aa', 'Aaa'],
    assets: [{ label: 'Download A Aa Files', url: 'https://drive.google.com/file/d/1np-Q2iFVp3PTggj3SDO7D3YIrDXihzTy/view?usp=drive_link' }]
  },
  {
    matchTitles: ['Alludu Seenu'],
    assets: [{ label: 'Download Alludu Seenu Files', url: 'https://drive.google.com/file/d/1miCDWkdhi20jKi6aYFhoPpL4Fsgo9-ia/view?usp=drive_link' }]
  },
  {
    matchTitles: ['Attarintiki Daredi'],
    assets: [{ label: 'Download Attarintiki Daredi Files', url: 'https://drive.google.com/file/d/1PtwVBelmgUNvNQPP7FRB3NwSDiUjLlFp/view?usp=drive_link' }]
  },
  {
    matchTitles: ['Autonagar Surya'],
    assets: [{ label: 'Download Autonagar Surya Files', url: 'https://drive.google.com/file/d/1mK1ntxPHa1noAetkyt_H5ELYgjz9RUlc/view?usp=drive_link' }]
  },
  {
    matchTitles: ['Brahmotsavam'],
    assets: [{ label: 'Download Brahmotsavam Files', url: 'https://drive.google.com/file/d/16Bn_8HC4BrkZ-ba-4WmCGZsJlwQLANOd/view?usp=drive_link' }]
  },
  {
    matchTitles: ['Brindavanam', 'Brindavama'],
    assets: [{ label: 'Download Brindavanam Files', url: 'https://drive.google.com/file/d/1In3jBwrfoUFq83bmvqDjlzVwhW0ZKuz7/view?usp=drive_link' }]
  },
  {
    matchTitles: ['Ramayya Vasthavayya', 'Ramayavastayava'],
    assets: [{ label: 'Download Ramayya Vasthavayya Files', url: 'https://drive.google.com/file/d/1la21mJ3pl267r97MzAXFGSQZ4bexzjOV/view?usp=drive_link' }]
  },
  {
    matchTitles: ['Dookudu', 'Dookud'],
    assets: [{ label: 'Download Dookudu Files', url: 'https://drive.google.com/file/d/12_zOatprH3Rcqb3V6m10NTXo8mI9wdXV/view?usp=drive_link' }]
  },
  {
    matchTitles: ['Eega / Naan Ee', 'Eega', 'Naan Ee'],
    assets: [{ label: 'Download Eega Files', url: 'https://drive.google.com/file/d/1xCESJEhkvugMCjlGYsoJKYSfbSJNk-sw/view?usp=drive_link' }]
  },
  {
    matchTitles: ['Janatha Garage', 'Jannatha Garage'],
    assets: [{ label: 'Download Janatha Garage Files', url: 'https://drive.google.com/file/d/1K_Qe4MQVK9PhJvWj16_xrcl7YrvRV56w/view?usp=drive_link' }]
  },
  {
    matchTitles: ['Mahanati', 'Mahnati'],
    assets: [{ label: 'Download Mahanati Files', url: 'https://drive.google.com/file/d/13-oxtATea2mpkwO498-MF-EQSFt7QM5l/view?usp=drive_link' }]
  },
  {
    matchTitles: ['Manam'],
    assets: [{ label: 'Download Manam Files', url: 'https://drive.google.com/file/d/1LIJdLZTPD3iSp5GKFjIAN-DvgKTyFxHn/view?usp=drive_link' }]
  },
  {
    matchTitles: ['Thanga Magan', 'Nava Manmadhudu'],
    assets: [{ label: 'Download Nava Manmadhudu Files', url: 'https://drive.google.com/file/d/1zMR-LlGAPq4q1X1J60qKl54cgTFIInfs/view?usp=drive_link' }]
  },
  {
    matchTitles: ['Rabhasa'],
    assets: [{ label: 'Download Rabhasa Files', url: 'https://drive.google.com/file/d/18Ryl-B4qqx3U6kABDMxXNUyts7zNqP2y/view?usp=drive_link' }]
  },
  {
    matchTitles: ['Rangasthalam'],
    assets: [{ label: 'Download Rangasthalam Files', url: 'https://drive.google.com/file/d/1I6aISuPLa8-IKMKjf0SDFBB9_J3jKE9X/view?usp=drive_link' }]
  },
  {
    matchTitles: ['Shaakuntalam'],
    assets: [{ label: 'Download Shaakuntalam Files', url: 'https://drive.google.com/file/d/1Ifa_OdyZR2lVsDGQqXuUb4d9ygkMveHf/view?usp=drive_link' }]
  },
  {
    matchTitles: ['S/O Satyamurthy', 'Son Of Sathyamurthy', 'Son Of Satyamurthy'],
    assets: [{ label: 'Download S/O Satyamurthy Files', url: 'https://drive.google.com/file/d/1oPCLaJTX6Fs8n1ueOtjyaiEGrE7pGbr8/view?usp=drive_link' }]
  },
  {
    matchTitles: ['Kaathuvaakula Rendu Kaadhal', 'Kaathu Vakula Redu Kadhal', 'Kanmani Rambo Khatija', 'Kanmani Rambo Kathija'],
    assets: [
      { label: 'Download Kaathuvaakula Rendu Kaadhal Files', url: 'https://drive.google.com/file/d/1NdnyK_E22kJpNlEFK4X-oiuQphvsDYNF/view?usp=drive_link' },
      { label: 'Download Kanmani Rambo Khatija Files', url: 'https://drive.google.com/file/d/1WZ9QaBfO15Me23idgqI2i3w4nsqtSWs9/view?usp=drive_link' }
    ]
  },
  {
    matchTitles: ['Seemaraja', 'Seema Raja'],
    assets: [{ label: 'Download Seemaraja Files', url: 'https://drive.google.com/file/d/17eVkWdVUkcaNUCVHoo2QrzREUOAHbZ-7/view?usp=drive_link' }]
  },
  {
    matchTitles: ['Super Deluxe'],
    assets: [{ label: 'Download Super Deluxe Files', url: 'https://drive.google.com/file/d/1Ch5t8lZe5AbmgQm3YUgUcCeZytRd6pj6/view?usp=drive_link' }]
  },
  {
    matchTitles: ['Neethane En Ponvasantham / Yeto Vellipoyindhi Manasu', 'Yeto Vellipoyindhi Manasu', 'Yeto Vellipoyidhi Manasu'],
    assets: [{ label: 'Download Yeto Vellipoyindhi Manasu Files', url: 'https://drive.google.com/file/d/1z_ser7hXGZe1WaaGZYeBSZaflxHDE-LG/view?usp=drive_link' }]
  },
  {
    matchTitles: ['The Family Man (Season 2)', 'The Family Man', 'The Family Man 2'],
    assets: [{ label: 'Download The Family Man Files', url: 'https://drive.google.com/drive/folders/1eIR3de_d0ydqShsOBqH9KgM71zG1yT4y?usp=drive_link' }]
  },
  {
    matchTitles: ['Citadel: Honey Bunny', 'Citadel'],
    assets: [{ label: 'Download Citadel Files', url: 'https://drive.google.com/drive/folders/1EGcqO4N-YjIAIiVEN3lK5KOfKMhb2yK9?usp=drive_link' }]
  },
  {
    matchTitles: ['Majili'],
    assets: [{ label: 'Download Majili Files', url: 'https://drive.google.com/drive/folders/1kx_7QZM9WBUS9f9xIc4mSOqtmbUoPx19?usp=drive_link' }]
  },
  {
    matchTitles: ['No.1 Yaari with Rana', 'No 1 Yaari With Rana', 'No1 Yaari', 'No1 Yaari Show'],
    assets: [{ label: 'Download No.1 Yaari Files', url: 'https://drive.google.com/drive/folders/1z8jzYQK_yJ1oMJF3KW-UNoMLx3lINWyB?usp=drive_link' }]
  }
];

const SUPPLEMENTAL_MOVIES: Movie[] = [
  normalizeMovie({
    id: 9001,
    title: 'No.1 Yaari with Rana',
    year: 2018,
    releaseDate: '2018-11-11',
    language: 'Telugu',
    genre: ['Talk Show', 'Reality'],
    role: 'Guest Appearance',
    director: 'Sanjeev K. Kumar',
    poster: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748011805/8F9A6978_1_jd2efv.jpg',
    description: 'Talk show appearance. Samantha featured with Chinmayi Sripaada and Nandini Reddy in a No.1 Yaari with Rana episode aired on November 11, 2018.'
  })
];

const DOWNLOAD_LOOKUP = new Map<string, MovieDownloadAsset[]>();

for (const group of DOWNLOAD_GROUPS) {
  for (const title of group.matchTitles) {
    DOWNLOAD_LOOKUP.set(normalizeMovieLookupKey(title), group.assets);
  }
}

export function enrichMoviesWithDownloads(movies: Movie[]): Movie[] {
  const merged = [...movies];

  for (const supplementalMovie of SUPPLEMENTAL_MOVIES) {
    if (merged.some(movie => normalizeMovieLookupKey(movie.title) === normalizeMovieLookupKey(supplementalMovie.title))) {
      continue;
    }

    merged.push(supplementalMovie);
  }

  return merged.map(movie => {
    const assets = getMovieDownloadAssets(movie);
    return assets.length > 0
      ? { ...movie, downloadAssets: assets }
      : movie;
  });
}

export function getMovieDownloadAssets(movie: Movie | null | undefined): MovieDownloadAsset[] {
  if (!movie) {
    return [];
  }

  const directAssets = movie.downloadAssets?.filter(asset => !!asset?.label && !!asset?.url) || [];
  if (directAssets.length > 0) {
    return dedupeAssets(directAssets);
  }

  const matchedAssets = DOWNLOAD_LOOKUP.get(normalizeMovieLookupKey(movie.title)) || [];
  return dedupeAssets(matchedAssets);
}

function dedupeAssets(assets: MovieDownloadAsset[]): MovieDownloadAsset[] {
  const seen = new Set<string>();
  const deduped: MovieDownloadAsset[] = [];

  for (const asset of assets) {
    const key = `${asset.label}|${asset.url}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    deduped.push(asset);
  }

  return deduped;
}

function normalizeMovieLookupKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '')
    .trim();
}

export const FILMOGRAPHY_DOWNLOAD_MATCHES = DOWNLOAD_GROUPS.map(group => group.matchTitles[0]);
export const FILMOGRAPHY_SUPPLEMENTAL_TITLES = SUPPLEMENTAL_MOVIES.map(movie => movie.title);
export const FILMOGRAPHY_FALLBACK_POSTER_URL = FALLBACK_POSTER_URL;
