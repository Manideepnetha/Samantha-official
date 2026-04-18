export interface DailyQuote {
  text: string;
  source: string;
}

export interface ThisDayEvent {
  dateKey: string;
  year: number;
  title: string;
  description: string;
  kind: 'Movie' | 'Award' | 'Milestone';
  route?: string;
}

export interface TimelineMilestone {
  year: number;
  title: string;
  description: string;
  kind: 'Milestone';
  imageUrl: string;
}

export interface WallpaperItem {
  key: string;
  title: string;
  category: 'desktop' | 'mobile';
  imageUrl: string;
  previewUrl?: string;
  resolution: string;
  collection: string;
  accent: string;
}

export interface MusicTrackBlueprint {
  key: string;
  title: string;
  subtitle: string;
  coverUrl: string;
  audioUrlSettingKey?: string;
  defaultAudioUrl?: string;
  ambientPreset: 'antava-glow' | 'maaya-twilight' | 'honey-pulse';
}

export interface InstagramFeedConfig {
  profileUrl: string;
  handle: string;
  embedUrl: string;
  previewCards: Array<{
    title: string;
    imageUrl: string;
    caption: string;
    href: string;
  }>;
}

export interface FanPollDefinition {
  key: string;
  title: string;
  prompt: string;
  description: string;
  options: Array<{
    key: string;
    label: string;
  }>;
}

export const SAMANTHA_BIRTHDAY = {
  month: 4,
  day: 28
};

export const DAILY_QUOTES: DailyQuote[] = [
  {
    text: 'I have never met a strong person with an easy past.',
    source: 'Samantha Ruth Prabhu'
  },
  {
    text: 'Healing is not linear, but showing up for yourself still matters every day.',
    source: 'Samantha Ruth Prabhu'
  },
  {
    text: 'Reinvention begins when you stop being afraid of your own truth.',
    source: 'Samantha Ruth Prabhu'
  },
  {
    text: 'Discipline gives dreams a shape that hope alone never can.',
    source: 'Samantha Ruth Prabhu'
  },
  {
    text: 'There is power in softness when it comes from clarity.',
    source: 'Samantha Ruth Prabhu'
  },
  {
    text: 'Every chapter changes you, but courage is what lets you keep writing.',
    source: 'Samantha Ruth Prabhu'
  }
];


export const THIS_DAY_EVENTS: ThisDayEvent[] = [
  { dateKey: '04-12', year: 2013, title: 'Attarintiki Daredi Announced', description: 'Samantha confirmed as female lead in Trivikram\'s blockbuster family drama opposite Pawan Kalyan — one of the biggest Telugu films of the decade.', kind: 'Movie', route: '/filmography' },
  { dateKey: '04-15', year: 2016, title: 'A Aa Released', description: 'Trivikram\'s romantic comedy A Aa hit screens with Samantha in the lead. Her performance earned her the Filmfare Award for Best Actress Telugu.', kind: 'Movie', route: '/filmography' },
  { dateKey: '04-28', year: 1987, title: 'Birthday', description: 'Celebrating Samantha Ruth Prabhu and the journey that would go on to reshape modern South Indian stardom.', kind: 'Milestone' },
  { dateKey: '01-01', year: 2025, title: 'New Year, New Chapter', description: 'Samantha began 2025 with a peaceful church visit, sharing a message of hope and renewal with her fans.', kind: 'Milestone' },
  { dateKey: '01-28', year: 2022, title: 'Tralala Moving Pictures Founded', description: 'Samantha officially launched her production company, stepping into the role of producer and storyteller.', kind: 'Milestone', route: '/about' },
  { dateKey: '02-14', year: 2014, title: 'Manam Trailer Launch', description: 'The trailer for Manam featuring three generations of the Akkineni family was launched, with Samantha in a pivotal role.', kind: 'Movie', route: '/filmography' },
  { dateKey: '02-26', year: 2010, title: 'Ye Maaya Chesave Released', description: 'The romantic drama introduced Samantha as Jessie and launched a defining screen journey. She won Filmfare Best Female Debut South.', kind: 'Movie', route: '/filmography' },
  { dateKey: '03-08', year: 2014, title: 'Women\'s Day Philanthropy Drive', description: 'Samantha led a special health camp through Pratyusha Support on International Women\'s Day, providing free medical screenings.', kind: 'Milestone', route: '/philanthropy' },
  { dateKey: '03-25', year: 2022, title: 'Myositis Diagnosis Revealed', description: 'Samantha publicly shared her Myositis diagnosis, turning personal vulnerability into a message of courage for millions.', kind: 'Milestone' },
  { dateKey: '05-09', year: 2025, title: 'Subham Released', description: 'Samantha\'s debut as a film producer — Subham, a horror comedy — released in theatres, marking a bold new chapter.', kind: 'Movie', route: '/filmography' },
  { dateKey: '05-27', year: 2025, title: 'Vogue Beauty & Wellness Honours', description: 'Samantha graced the Vogue India Beauty & Wellness Honours 2025, receiving widespread acclaim.', kind: 'Milestone' },
  { dateKey: '06-04', year: 2021, title: 'The Family Man 2 Arrived', description: 'Her action turn as Raji expanded her audience pan-India. She won the Filmfare OTT Award for Best Actress.', kind: 'Milestone', route: '/fan-zone' },
  { dateKey: '07-06', year: 2012, title: 'Eega Took Flight', description: 'Her role as Bindu anchored one of Telugu cinema\'s most inventive fantasy hits. She won Best Actress at multiple ceremonies.', kind: 'Movie', route: '/filmography' },
  { dateKey: '07-22', year: 2016, title: 'Theri Released', description: 'The Tamil action blockbuster Theri with Vijay released, with Samantha delivering a memorable performance as the female lead.', kind: 'Movie', route: '/filmography' },
  { dateKey: '08-11', year: 2017, title: 'Mersal Released', description: 'Samantha starred alongside Vijay in the blockbuster Mersal, one of the highest-grossing Tamil films of 2017.', kind: 'Movie', route: '/filmography' },
  { dateKey: '08-28', year: 2019, title: 'Oh! Baby Premiered', description: 'A playful fantasy with a warm emotional core became one of Samantha\'s most beloved lead performances.', kind: 'Movie', route: '/filmography' },
  { dateKey: '09-05', year: 2018, title: 'Mahanati Released', description: 'The biographical epic Mahanati, in which Samantha played a journalist, became a landmark film and won multiple National Awards.', kind: 'Movie', route: '/filmography' },
  { dateKey: '09-29', year: 2025, title: 'Heartfelt Post Goes Viral', description: 'Samantha shared a personal note on Instagram about finding peace and love in her thirties — resonating with millions worldwide.', kind: 'Milestone' },
  { dateKey: '10-22', year: 2021, title: 'Pushpa: The Rise Promotions', description: 'Samantha began promotions for her iconic Oo Antava number — a performance that broke records and trended globally.', kind: 'Movie', route: '/filmography' },
  { dateKey: '11-05', year: 2021, title: 'S10 Fitness Launch', description: 'Samantha launched her fitness brand S10 Fitness, combining her wellness journey with a mission to inspire healthy living.', kind: 'Milestone' },
  { dateKey: '11-17', year: 2024, title: 'Citadel: Honey Bunny Released', description: 'Samantha starred as Honey in the Prime Video action series alongside Varun Dhawan — her biggest international project.', kind: 'Movie', route: '/filmography' },
  { dateKey: '12-01', year: 2025, title: 'Wedding with Raj Nidimoru', description: 'Samantha Ruth Prabhu married filmmaker Raj Nidimoru in a private ceremony in Coimbatore, surrounded by close family and friends.', kind: 'Milestone' },
  { dateKey: '12-17', year: 2021, title: 'Pushpa: The Rise Released', description: 'Pushpa: The Rise released nationwide with Samantha\'s Oo Antava becoming the most-watched item number of the year.', kind: 'Movie', route: '/filmography' },
];

export const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    year: 2010,
    title: 'Debut Breakthrough',
    description: 'A debut year that immediately positioned Samantha as a lead talent with both audience recall and critical attention.',
    kind: 'Milestone',
    imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008414/8F9A7087_koclpw.jpg'
  },
  {
    year: 2014,
    title: 'Purpose Beyond Screen',
    description: 'Her philanthropic path matured into a public identity rooted in care, advocacy, and practical support.',
    kind: 'Milestone',
    imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008412/DSC_9143-1_ayf7fl.jpg'
  },
  {
    year: 2021,
    title: 'Streaming Era Pivot',
    description: 'The leap into prestige streaming projects marked a new action-forward chapter and widened her reach beyond traditional film circuits.',
    kind: 'Milestone',
    imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748011805/8F9A6978_1_jd2efv.jpg'
  },
  {
    year: 2025,
    title: 'Producer Mindset',
    description: 'A new phase focused on authorship, curation, and creating stories with longer personal resonance.',
    kind: 'Milestone',
    imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748045346/Samantha29_clxsnm.jpg'
  }
];

export const WALLPAPERS: WallpaperItem[] = [
  { key: 'sunlit-editorial-desktop', title: 'Sunlit Editorial', category: 'desktop', imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748045346/Samantha29_clxsnm.jpg', resolution: '2560 x 1440', collection: 'Desktop Series', accent: '#d7b18a' },
  { key: 'classic-portrait-desktop', title: 'Classic Portrait', category: 'desktop', imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748011805/8F9A6978_1_jd2efv.jpg', resolution: '2560 x 1440', collection: 'Desktop Series', accent: '#b68562' },
  { key: 'crimson-motion-desktop', title: 'Crimson Motion', category: 'desktop', imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008414/8F9A7087_koclpw.jpg', resolution: '2560 x 1440', collection: 'Desktop Series', accent: '#8f3b2d' },
  { key: 'honey-twilight-mobile', title: 'Honey Twilight', category: 'mobile', imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748010072/8F9A7985_m86vsc.jpg', resolution: '1440 x 2560', collection: 'Mobile Portraits', accent: '#c99a6f' },
  { key: 'ivory-icon-mobile', title: 'Ivory Icon', category: 'mobile', imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008413/PAND7159_k4qlvo.jpg', resolution: '1440 x 2560', collection: 'Mobile Portraits', accent: '#9a7a68' },
  { key: 'cinema-glow-mobile', title: 'Cinema Glow', category: 'mobile', imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008412/DSC_9143-1_ayf7fl.jpg', resolution: '1440 x 2560', collection: 'Mobile Portraits', accent: '#8a6e62' }
];

export const MUSIC_TRACK_BLUEPRINTS: MusicTrackBlueprint[] = [
  {
    key: 'thassadiya',
    title: 'Thassadiya',
    subtitle: 'Maa Inti Bangaram',
    coverUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1776277916/samantha-official-website/music/Maa-Inti-Bangaram_xb1fuc.webp',
    audioUrlSettingKey: 'music_track_1_url',
    defaultAudioUrl: 'https://res.cloudinary.com/dpnd6ve1e/video/upload/v1776277706/samantha-official-website/music/WhatsApp_Audio_2026-04-15_at_10.45.02_PM_iimghz.mp3',
    ambientPreset: 'antava-glow'
  }
];

export const INSTAGRAM_FEED_CONFIG: InstagramFeedConfig = {
  profileUrl: 'https://www.instagram.com/samantharuthprabhuoffl/',
  handle: '@samantharuthprabhuoffl',
  embedUrl: 'https://www.instagram.com/samantharuthprabhuoffl/',
  previewCards: [
    { title: 'Editorial Portraits', imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748011805/8F9A6978_1_jd2efv.jpg', caption: 'Campaign stills, wellness notes, and close-up editorial moments.', href: 'https://www.instagram.com/samantharuthprabhuoffl/' },
    { title: 'Behind The Frame', imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008412/DSC_9143-1_ayf7fl.jpg', caption: 'On-set atmosphere and process-led glimpses from recent appearances.', href: 'https://www.instagram.com/samantharuthprabhuoffl/' },
    { title: 'Style Diary', imageUrl: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748045346/Samantha29_clxsnm.jpg', caption: 'A rolling moodboard of fashion, travel, and story-led visuals.', href: 'https://www.instagram.com/samantharuthprabhuoffl/' }
  ]
};

export const FAN_POLL_DEFINITION: FanPollDefinition = {
  key: 'favorite-samantha-movie',
  title: 'Fan Poll',
  prompt: 'Which Samantha project lives rent-free in your heart?',
  description: 'Vote once and watch the live community split reshape in real time.',
  options: [
    { key: 'ye-maaya-chesave', label: 'Ye Maaya Chesave' },
    { key: 'eega', label: 'Eega' },
    { key: 'mahanati', label: 'Mahanati' },
    { key: 'the-family-man-2', label: 'The Family Man 2' },
    { key: 'citadel-honey-bunny', label: 'Citadel: Honey Bunny' }
  ]
};
