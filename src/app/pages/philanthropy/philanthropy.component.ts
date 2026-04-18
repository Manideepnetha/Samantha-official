import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService, Philanthropy } from '../../services/api.service';

interface PhilanthropyPageContent {
  logo: string;
  heroImage: string;
  heroAlt: string;
  heroTitlePrimary: string;
  heroTitleSecondary: string;
  heroSubtitle: string;
  heroDescription: string;
  heroTags: string[];
  officialNote: string;
  missionKicker: string;
  missionTitle: string;
  missionDescription: string;
  visionTitle: string;
  visionDescription: string;
}

interface PhilanthropyStat {
  value: string;
  label: string;
  detail: string;
}

interface PhilanthropyValue {
  title: string;
  description: string;
}

interface PhilanthropyObjective {
  title: string;
  description: string;
}

interface PhilanthropyProgram {
  kicker: string;
  title: string;
  metric: string;
  description: string;
}

interface PhilanthropyFootprint {
  kicker: string;
  title: string;
  metric: string;
  description: string;
}

interface PhilanthropyOrganization {
  kicker: string;
  title: string;
  role: string;
  description: string;
  contributionLabel: string;
  contribution: string;
  logo: string;
  logoAlt: string;
  logoScale?: 'wide' | 'compact';
  linkHref: string;
  linkLabel: string;
}

interface PhilanthropyStory {
  kicker: string;
  title: string;
  description: string;
  brief: string;
  image: string;
  alt: string;
  sourceLabel: string;
  sourceHref: string;
}

interface PhilanthropyLeader {
  name: string;
  role: string;
  description: string;
  image: string;
  alt: string;
}

interface PhilanthropyAction {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  label: string;
  image: string;
  alt: string;
  variant: 'solid' | 'outline';
}

interface PhilanthropyContact {
  label: string;
  value: string;
  href?: string;
}

interface PhilanthropySource {
  label: string;
  href: string;
  description: string;
}

interface PhilanthropyClosing {
  kicker: string;
  title: string;
  description: string;
}

const PHILANTHROPY_PAGE_CONTENT: PhilanthropyPageContent = {
  logo: 'assets/images/philanthropy/pratyusha-logo.png',
  heroImage: 'assets/images/philanthropy/samantha-pratyusha.png',
  heroAlt: 'Samantha Ruth Prabhu during philanthropy outreach',
  heroTitlePrimary: 'Samantha Ruth Prabhu',
  heroTitleSecondary: 'Philanthropy & Social Impact',
  heroSubtitle: 'Founder-led care, live-source verification, and advocacy grounded in real public records.',
  heroDescription: 'This page brings together Samantha\'s live foundation work, verified advocacy partnerships, and clearly labeled outreach records across medical aid, menstrual dignity, child welfare, myositis awareness, and women\'s digital safety.',
  heroTags: ['Founded Pratyusha Support in 2014', '150+ critical surgeries on the live homepage', 'Current leadership team listed on the official site', 'UN Women India partnership announced on 25 November 2025'],
  officialNote: 'This page was re-verified against live public sources on 18 April 2026. Archive material and dated media coverage are separated from current foundation claims so the record stays accurate.',
  missionKicker: 'Philosophy of Giving',
  missionTitle: 'Grounded in empathy, dignity, and accountable long-term care',
  missionDescription: 'The current Pratyusha Support pages frame the work around medical aid, menstrual dignity, emergency relief, vaccination drives, wish fulfilment, long-term care, and health-equity awareness. Across those areas, the through-line is practical help delivered with urgency rather than symbolic charity.',
  visionTitle: 'What the live record shows now',
  visionDescription: 'The strongest current evidence sits with Pratyusha Support\'s medical and child-welfare work, then broadens into patient advocacy through Myositis India, early-years development through Ekam, and campaign-based women\'s-safety work with UN Women India.'
};

const PHILANTHROPY_STATS: PhilanthropyStat[] = [
  {
    value: '150+',
    label: 'Critical surgeries supported',
    detail: 'The official homepage says Pratyusha Support has sponsored more than 150 critical surgeries for underprivileged patients.'
  },
  {
    value: '28',
    label: 'Children in the shelter partnership',
    detail: 'The official homepage says about 28 orphaned children are being sheltered and supported through the partner trust association.'
  },
  {
    value: '2014',
    label: 'Year the foundation was established',
    detail: 'Both the homepage and the About page state that Samantha Ruth Prabhu founded Pratyusha Support in 2014.'
  }
];

const PHILANTHROPY_VALUES: PhilanthropyValue[] = [
  {
    title: 'Founded Pratyusha Support in 2014',
    description: 'The current foundation homepage and About page still identify 2014 as the starting point of Samantha\'s formal humanitarian platform.'
  },
  {
    title: 'Published impact of 150+ critical surgeries',
    description: 'The live homepage continues to state that more than 150 critical surgeries have been sponsored for underprivileged patients.'
  },
  {
    title: 'Women and children remain the stated priority',
    description: 'Across the live mission and About pages, the foundation consistently frames women and children as the first focus of care.'
  },
  {
    title: 'Menstrual dignity and period-poverty action',
    description: 'The live About page explicitly includes menstrual dignity, sanitary-kit distribution, and support against period poverty.'
  },
  {
    title: 'Shelter, education, and daily care support',
    description: 'The homepage still presents shelter, education, healthcare, and essential amenities for children in the Nadargul trust association.'
  },
  {
    title: 'Child development beyond emergency response',
    description: 'Ekam widens the picture from crisis support to early-years development, creativity, and stronger beginnings for children.'
  },
  {
    title: 'Myositis India brand ambassador role',
    description: 'The current Myositis India site presents Samantha as a brand ambassador using lived experience to support awareness, care access, and mental-health visibility.'
  },
  {
    title: 'UN Women India campaign partnership',
    description: 'On 25 November 2025, UN Women India announced Samantha as a partner for the 16 Days of Activism campaign on ending digital violence against women and girls.'
  }
];

const PHILANTHROPY_OBJECTIVES: PhilanthropyObjective[] = [
  {
    title: 'Medical Aid',
    description: 'Funding critical surgeries, treatments, and ongoing care for underprivileged children and women.'
  },
  {
    title: 'Menstrual Dignity',
    description: 'Promoting menstrual health awareness and distributing sanitary kits through the End Period Poverty campaign.'
  },
  {
    title: 'Emergency Relief',
    description: 'Providing immediate support for families facing health, hospitalisation, medication, or rehabilitation crises.'
  },
  {
    title: 'Vaccination Drives',
    description: 'Organising seasonal and need-based vaccination camps for vulnerable communities.'
  },
  {
    title: 'Wish Come True',
    description: 'Fulfilling heartfelt wishes for children in NGOs, shelters, and underserved communities.'
  },
  {
    title: 'Long-term Care Support',
    description: 'Supporting orphanages, shelters, and survivor homes with essentials, education aid, and health assistance.'
  },
  {
    title: 'Health Equity Awareness',
    description: 'Building awareness around affordable and dignified healthcare for women and children.'
  }
];

const PHILANTHROPY_PROGRAMS: PhilanthropyProgram[] = [
  {
    kicker: 'Official Homepage',
    title: 'Medical aid still anchors the live homepage',
    metric: '150+ surgeries, plus newborn, heart, and urgent-care support',
    description: 'The current homepage continues to center surgery funding and also names newborn patients, heart patients, and urgent medical needs as active parts of the support model.'
  },
  {
    kicker: 'Official About Page',
    title: 'Menstrual dignity and crisis response',
    metric: 'Hospitalisation, medication, rehabilitation, period poverty',
    description: 'The live About page frames menstrual dignity, emergency support, medication, hospitalisation, and rehabilitation assistance as part of the foundation\'s response when women and families face medical or financial crisis.'
  },
  {
    kicker: 'Official Homepage',
    title: 'Awareness in schools, orphanages, and community spaces',
    metric: 'Schools, orphanages, and community settings',
    description: 'The live homepage says the team runs campaigns on sensitive social issues in government schools, orphanages, and other community settings where practical guidance matters most.'
  },
  {
    kicker: 'Official Homepage',
    title: 'Shelter and full-time trust association',
    metric: 'Pyaram Vijayabharathi Vidyasagar Charitable Trust, Nadargul',
    description: 'Pratyusha Support says it is associated full-time with this trust in Nadargul and supports orphaned children there with shelter, education, healthcare, and other essential amenities.'
  },
  {
    kicker: 'Official Homepage',
    title: 'Wish Come True',
    metric: 'Joy, recognition, and emotional relief for children in crisis',
    description: 'Wish Come True remains part of the live foundation language and is also echoed in dated public records where Samantha and Pratyusha Support fulfilled specific wishes for children linked to NGOs and care homes.'
  }
];

const PHILANTHROPY_FOOTPRINT: PhilanthropyFootprint[] = [
  {
    kicker: 'Healthcare Access',
    title: 'Dignity-led care',
    metric: 'Critical surgeries, urgent relief, health awareness',
    description: 'Across Pratyusha Support, Samantha\'s strongest documented contribution lies in connecting visibility with treatment, recovery, dignity, and practical support for women and children.'
  },
  {
    kicker: 'Children and Education',
    title: 'Care that looks beyond crisis',
    metric: 'Shelter support, wish fulfilment, outreach, early childhood learning',
    description: 'Her social-impact record moves from immediate child welfare through Pratyusha Support to long-term developmental thinking through Ekam, linking protection, belonging, creativity, and education.'
  },
  {
    kicker: 'Public Advocacy',
    title: 'Health awareness and women\'s safety',
    metric: 'Myositis awareness, patient support, digital safety advocacy',
    description: 'By speaking on myositis and joining UN Women India\'s campaign against digital violence, Samantha extends her role from charitable support to public advocacy on health, safety, and voice.'
  }
];

const PHILANTHROPY_ORGANIZATIONS: PhilanthropyOrganization[] = [
  {
    kicker: 'Primary Foundation',
    title: 'Pratyusha Support',
    role: 'Live official foundation and primary source for the record.',
    description: 'The current Pratyusha Support homepage and About page present the foundation as Samantha\'s central platform for medical aid, menstrual dignity, urgent relief, and long-term care for women and children.',
    contributionLabel: 'Why it matters here',
    contribution: 'This is the main live source for the page\'s core claims, impact figures, leadership details, and public call-to-action links.',
    logo: 'assets/images/philanthropy/pratyusha-logo.png',
    logoAlt: 'Pratyusha Support logo',
    logoScale: 'wide',
    linkHref: 'https://pratyushasupport.org/',
    linkLabel: 'Open Pratyusha Support'
  },
  {
    kicker: 'Documented Outreach',
    title: 'DESIRE Society',
    role: 'A live NGO in the record, with Samantha-specific ties documented through dated outreach reports rather than the current Pratyusha homepage.',
    description: 'DESIRE Society\'s live site shows an active nonprofit serving children living with HIV/AIDS across five states. Samantha\'s connection is documented through specific public records from 2014, 2015, and 2018, not through a current official partner listing on the live Pratyusha Support site.',
    contributionLabel: 'Why it appears here',
    contribution: 'It belongs on the page as a documented outreach touchpoint, not as a blanket claim of ongoing institutional partnership.',
    logo: 'assets/images/philanthropy/partners/desire-society-logo.png',
    logoAlt: 'DESIRE Society logo',
    logoScale: 'wide',
    linkHref: 'https://desiresociety.org/Default/Pages/Default.aspx',
    linkLabel: 'Open DESIRE Society'
  },
  {
    kicker: 'Education Venture',
    title: 'Ekam Early Learning Centre',
    role: 'Founder-linked early-learning initiative, separate from the medical foundation.',
    description: 'The official founder page presents Samantha as a founder, while the current Ekam site positions the institution as an active early-learning network with campuses in Hyderabad and Visakhapatnam.',
    contributionLabel: 'Why it matters here',
    contribution: 'It rounds out her broader child-development profile without being overstated as Pratyusha Support programming.',
    logo: 'assets/images/philanthropy/partners/ekam-logo.png',
    logoAlt: 'Ekam Early Learning Centre logo',
    logoScale: 'wide',
    linkHref: 'https://www.ekamelc.com/samantha-ruth-prabhu/',
    linkLabel: 'Open official founder page'
  },
  {
    kicker: 'Health Advocacy',
    title: 'Myositis India',
    role: 'Current patient-awareness partnership rooted in lived experience.',
    description: 'Myositis India\'s current homepage and brand ambassador page present Samantha as the organisation\'s brand ambassador, amplifying diagnosis awareness, access to care, and mental-health visibility for patients and families.',
    contributionLabel: 'Why it matters here',
    contribution: 'This is one of the clearest live examples of Samantha translating personal health experience into public advocacy.',
    logo: 'assets/images/philanthropy/partners/myositis-india-logo.jpeg',
    logoAlt: 'Myositis India logo',
    logoScale: 'wide',
    linkHref: 'https://myositisindia.org/',
    linkLabel: 'Open Myositis India'
  },
  {
    kicker: 'Campaign Advocacy',
    title: 'UN Women India',
    role: 'Confirmed 16 Days of Activism partnership announced on 25 November 2025.',
    description: 'UN Women India announced Samantha as a partner for the 2025 16 Days of Activism campaign focused on ending digital violence against women and girls.',
    contributionLabel: 'Why it matters here',
    contribution: 'It extends her public-impact profile beyond charity into policy-facing advocacy on online abuse, dignity, and accountability.',
    logo: 'assets/images/philanthropy/partners/un-women-logo.png',
    logoAlt: 'UN Women logo',
    logoScale: 'wide',
    linkHref: 'https://asiapacific.unwomen.org/en/stories/press-release/2025/11/actor-samantha-ruth-prabhu-joins-un-women-india',
    linkLabel: 'Open UN Women release'
  }
];

const PHILANTHROPY_ARCHIVE_RECORD = {
  kicker: 'Archive Context',
  title: 'Legacy hospitals, trusts, and care institutions preserved from the archived foundation site',
  description: 'These names come from the archived Pratyusha Support pages, where they appear in treatment cases, camps, shelter support, and institutional visits.',
  entities: [
    'Rainbow Hospitals',
    'Continental Hospitals',
    'Livlife Hospitals',
    'Ankura Hospitals',
    'Andhra Hospitals',
    'Lakshmi Neuro Center',
    'Pyaram Vijayabharathi Vidyasagar Charitable Trust',
    'Sphoorti Foundation',
    'Hemophilia Society'
  ],
  note: 'They remain useful historical context, but this page does not treat them as current endorsed partners unless the live public record still does so.',
  href: 'https://pratyushasupport.org/index.php/about',
  linkLabel: 'Open legacy archive'
};

const PHILANTHROPY_STORIES: PhilanthropyStory[] = [
  {
    kicker: 'Public Record | 11 March 2014',
    title: 'Wish fulfilment outreach for two children connected to DESIRE Society',
    description: 'A Tupaki report connected Samantha\'s organisation with two HIV-positive children from DESIRE Society whose wishes to visit the Taj Mahal and experience air travel were fulfilled through the outreach effort.',
    brief: 'This item documents an early Wish Come True-style outreach moment focused on emotional relief and a memorable life experience for children living with HIV.',
    image: 'https://content.tupaki.com/twdata/2014/0314/news/Samantha-fulfills-wish-of-HIV-patients-1593.jpg',
    alt: 'Samantha Ruth Prabhu in public-record outreach coverage connected to children from DESIRE Society in March 2014',
    sourceLabel: 'View Tupaki report',
    sourceHref: 'https://english.tupaki.com/entertainment/article/samantha-fulfills-wish-of-hiv-patients/20276'
  },
  {
    kicker: 'Public Record | 01 December 2015',
    title: 'World AIDS Day support for children at DESIRE Society',
    description: 'Public coverage reported that Samantha took up the cause of supporting children at DESIRE Society with a monthly protein-support pledge through Pratyusha Support.',
    brief: 'This record is about sustained nutrition support and awareness-focused care for children affected by HIV/AIDS, not a one-off publicity visit.',
    image: 'https://content.tupaki.com/twdata/2015/1215/news/December-1st--Samantha-takes-up-a-cause-1448944082-1493.jpg',
    alt: 'Samantha Ruth Prabhu in World AIDS Day support coverage tied to DESIRE Society children in December 2015',
    sourceLabel: 'View Tupaki report',
    sourceHref: 'https://english.tupaki.com/entertainment/article/samantha-on-world-aids-day/34555'
  },
  {
    kicker: 'Public Record | 26 December 2018',
    title: 'Christmas visit, gifts, and shopping day with DESIRE Society children',
    description: 'India Today published a photo gallery showing Samantha celebrating Christmas with the children, dancing with them, and taking them shopping so they could pick what they wanted.',
    brief: 'This coverage is about companionship, joy, and a holiday visit built around the children\'s experience, with the page keeping it clearly labeled as dated outreach reporting.',
    image: 'https://akm-img-a-in.tosshub.com/indiatoday/images/photogallery/201812/Sam_1.png',
    alt: 'Samantha Ruth Prabhu with children during a Christmas outreach visit documented by India Today in December 2018',
    sourceLabel: 'View India Today gallery',
    sourceHref: 'https://www.indiatoday.in/movies/photo/samantha-turns-santa-claus-to-bring-hiv-positive-kids-some-christmas-cheer-see-pics-1417502-2018-12-26'
  }
];

const PHILANTHROPY_CLOSING: PhilanthropyClosing = {
  kicker: 'Closing Perspective',
  title: 'A public record shaped by care, clarity, and follow-through',
  description: 'Taken together, the live foundation record and clearly labeled public outreach reports show a social-impact profile built on treatment, dignity, and repeat commitment. What stands out is not celebrity proximity, but the consistency with which visibility is redirected toward practical support.'
};

const PHILANTHROPY_LEADERSHIP: PhilanthropyLeader[] = [
  {
    name: 'Samantha Ruth Prabhu',
    role: 'Founder',
    description: 'The live homepage and About page present Samantha as founder and the public voice of the mission, with direct involvement in campaigns, individual cases, and outreach.',
    image: 'assets/images/philanthropy/samantha-pratyusha.png',
    alt: 'Samantha Ruth Prabhu for Pratyusha Support'
  },
  {
    name: 'Dr. Manjula Anagani',
    role: 'Co-Founder',
    description: 'The current site credits Dr. Manjula Anagani with guiding the foundation\'s medical vision and grounding its interventions in ethical, accessible care.',
    image: 'assets/images/philanthropy/dr-manjula-anagani.png',
    alt: 'Dr. Manjula Anagani for Pratyusha Support'
  },
  {
    name: 'Seshanka Binesh',
    role: 'Executive Director',
    description: 'The live leadership pages describe Seshanka Binesh as executive director overseeing operations, community programs, and digital advocacy.',
    image: 'assets/images/philanthropy/seshanka-binesh.png',
    alt: 'Seshanka Binesh for Pratyusha Support'
  }
];

const PHILANTHROPY_ACTIONS: PhilanthropyAction[] = [
  {
    eyebrow: 'Official Donate Page',
    title: 'Give With Love',
    description: 'The live donation page asks supporters to back medical care for children in need and notes that contributions are tax exempt under Section 80G.',
    href: 'https://pratyushasupport.org/donate/',
    label: 'Donate Now',
    image: 'assets/images/philanthropy/donate-art.png',
    alt: 'Pratyusha Support donation artwork',
    variant: 'solid'
  },
  {
    eyebrow: 'Official Volunteer Page',
    title: 'Join the Movement',
    description: 'The live volunteer page invites supporters to give their time and skills to help create better tomorrows through the foundation\'s work.',
    href: 'https://pratyushasupport.org/volunteer/',
    label: 'Register as Volunteer',
    image: 'assets/images/philanthropy/volunteer-art.png',
    alt: 'Pratyusha Support volunteer artwork',
    variant: 'outline'
  }
];

const PHILANTHROPY_CONTACTS: PhilanthropyContact[] = [
  {
    label: 'Website',
    value: 'pratyushasupport.org',
    href: 'https://pratyushasupport.org/'
  },
  {
    label: 'General Contact',
    value: 'info@pratyushasupport.org',
    href: 'mailto:info@pratyushasupport.org'
  },
  {
    label: 'Foundation Contact',
    value: 'seshi@pratyushasupport.org',
    href: 'mailto:seshi@pratyushasupport.org'
  },
  {
    label: 'Base',
    value: 'Hyderabad, India'
  }
];

const PHILANTHROPY_SOURCES: PhilanthropySource[] = [
  {
    label: 'Official Homepage',
    href: 'https://pratyushasupport.org/',
    description: 'Primary live source for the foundation\'s current impact statements, leadership panel, shelter statistic, and core program framing.'
  },
  {
    label: 'About Pratyusha Support',
    href: 'https://pratyushasupport.org/aboutus/',
    description: 'Primary live source for mission, values, core objectives, and the language around menstrual dignity, emergency relief, and sustainable care.'
  },
  {
    label: 'Pratyusha Support Donate Page',
    href: 'https://pratyushasupport.org/donate/',
    description: 'Current live source for the donation call to action and Section 80G tax-exemption language.'
  },
  {
    label: 'Pratyusha Support Volunteer Page',
    href: 'https://pratyushasupport.org/volunteer/',
    description: 'Current live source for the volunteer recruitment language and public involvement call to action.'
  },
  {
    label: 'Pratyusha Support Contact Page',
    href: 'https://pratyushasupport.org/contactus/',
    description: 'Current live source for the public contact emails and Hyderabad base information.'
  },
  {
    label: 'Legacy Official Foundation Archive',
    href: 'https://pratyushasupport.org/index.php/about',
    description: 'Archived official record used only for historical institution names, older outreach context, and patient-support references that no longer appear on the live site.'
  },
  {
    label: 'Official Ekam Founder Page',
    href: 'https://www.ekamelc.com/samantha-ruth-prabhu/',
    description: 'Used to verify Samantha\'s founder association with Ekam and her stated early-years education philosophy on the official site.'
  },
  {
    label: 'Official Ekam Site',
    href: 'https://ekamelc.com/',
    description: 'Used to verify Ekam\'s live positioning as an active early-learning network and to avoid overstating it as foundation work.'
  },
  {
    label: 'Official DESIRE Society Site',
    href: 'https://desiresociety.org/Default/Pages/Default.aspx',
    description: 'Used to verify that DESIRE Society is a live, standalone NGO serving children living with HIV/AIDS across multiple states.'
  },
  {
    label: 'Myositis India Homepage',
    href: 'https://myositisindia.org/',
    description: 'Used to verify Samantha\'s live presentation as brand ambassador and the organisation\'s current patient-support framing.'
  },
  {
    label: 'Myositis India Brand Ambassador Page',
    href: 'https://www.myositisindia.org/samantha',
    description: 'Used to verify Samantha\'s formal presentation as a myositis awareness ambassador and public advocate.'
  },
  {
    label: 'World Myositis Day 2024',
    href: 'https://www.myositisindia.org/word-myositis-day-2024',
    description: 'Used to verify Samantha\'s participation in public awareness efforts and Myositis India\'s continuing support mission.'
  },
  {
    label: 'UN Women India 2025 Campaign Release',
    href: 'https://asiapacific.unwomen.org/en/stories/press-release/2025/11/actor-samantha-ruth-prabhu-joins-un-women-india',
    description: 'Used to verify Samantha\'s participation in the 2025 16 Days of Activism campaign focused on ending digital violence against women and girls.'
  },
  {
    label: 'Public Record: Tupaki Wish Fulfilment',
    href: 'https://english.tupaki.com/entertainment/article/samantha-fulfills-wish-of-hiv-patients/20276',
    description: 'Used for the 11 March 2014 report connecting Samantha\'s organisation with two DESIRE Society children\'s travel wish fulfilment.'
  },
  {
    label: 'Public Record: Wish Come True',
    href: 'https://idlebrain.com/news/today/ramcharan-pratushafoundation.html',
    description: 'Used for the 03 November 2014 record of Rahul from DESIRE Society meeting Ram Charan through the Wish Come True initiative.'
  },
  {
    label: 'Public Record: World AIDS Day Support',
    href: 'https://english.tupaki.com/entertainment/article/samantha-on-world-aids-day/34555',
    description: 'Used for the 01 December 2015 report of Pratyusha Support\'s monthly protein-support pledge for DESIRE Society children.'
  },
  {
    label: 'Public Record: India Today Christmas Visit',
    href: 'https://www.indiatoday.in/movies/photo/samantha-turns-santa-claus-to-bring-hiv-positive-kids-some-christmas-cheer-see-pics-1417502-2018-12-26',
    description: 'Used for the 26 December 2018 record of Samantha celebrating Christmas with DESIRE Society children.'
  }
];

const PHILANTHROPY_VERIFICATION_NOTE = 'Re-verified against live public pages on 18 April 2026. Archive and media-reported outreach remain labeled separately from current foundation claims.';

function normalizePhilanthropyKey(value: string): string {
  return value.trim().toLowerCase();
}

@Component({
  selector: 'app-philanthropy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sr-page philanthropy-page">
      <section class="sr-hero-shell">
        <div class="sr-hero-frame">
          <div class="sr-hero-panel philanthropy-hero-panel">
            <div class="philanthropy-hero-grid">
              <div class="philanthropy-hero-copy">
                <div class="philanthropy-logo-lockup">
                  <div class="philanthropy-brand-mark">
                    <img [src]="heroLogo" alt="Pratyusha Support logo" class="philanthropy-logo" />
                  </div>
                  <div class="philanthropy-brand-copy">
                    <span class="sr-kicker">Official Foundation</span>
                    <p class="philanthropy-logo-note">Verified public philanthropy overview</p>
                  </div>
                </div>

                <h1 class="sr-hero-title">
                  <span class="philanthropy-hero-title-primary">{{ content.heroTitlePrimary }}</span>
                  <span class="philanthropy-hero-title-secondary">{{ content.heroTitleSecondary }}</span>
                </h1>
                <p class="sr-hero-subtitle">{{ content.heroSubtitle }}</p>
                <p class="philanthropy-hero-description">{{ content.heroDescription }}</p>

                <div class="philanthropy-tag-row">
                  <span *ngFor="let tag of content.heroTags" class="philanthropy-tag">{{ tag }}</span>
                </div>

                <div class="philanthropy-hero-actions">
                  <a
                    *ngFor="let action of actions"
                    [href]="action.href"
                    target="_blank"
                    rel="noopener noreferrer"
                    [class.sr-button]="action.variant === 'solid'"
                    [class.sr-button-outline]="action.variant === 'outline'">
                    {{ action.label }}
                  </a>
                </div>

                <p class="philanthropy-source-note">{{ content.officialNote }}</p>
              </div>

              <div class="philanthropy-hero-art">
                <div class="philanthropy-hero-image-shell sr-surface-soft">
                  <img [src]="content.heroImage" [alt]="content.heroAlt" class="philanthropy-hero-image" />
                </div>

                <div class="philanthropy-hero-meta">
                  <div class="philanthropy-hero-fact sr-surface">
                    <span class="philanthropy-hero-fact-label">Impact Snapshot</span>
                    <p class="philanthropy-hero-fact-value">{{ stats[0].value }}</p>
                    <p class="philanthropy-hero-fact-copy">{{ stats[0].label }}</p>
                  </div>

                  <div class="philanthropy-hero-seal sr-surface">
                    <img [src]="heroLogo" alt="" aria-hidden="true" class="philanthropy-seal-logo" />
                    <div>
                      <span class="philanthropy-seal-label">Verified social-impact profile</span>
                      <p class="philanthropy-seal-copy">Foundation work, outreach records, education initiatives, health advocacy, and campaign participation are separated carefully so the page stays accurate and professional.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="sr-section">
        <div class="philanthropy-mission-grid">
          <article class="sr-surface philanthropy-mission-card">
            <span class="sr-kicker">{{ content.missionKicker }}</span>
            <h2 class="sr-card-title philanthropy-display-title">{{ content.missionTitle }}</h2>
            <p class="sr-card-text philanthropy-body-copy">{{ content.missionDescription }}</p>

            <div class="philanthropy-vision-block sr-surface-soft">
              <h3 class="philanthropy-subheading">{{ content.visionTitle }}</h3>
              <p class="sr-card-text">{{ content.visionDescription }}</p>
            </div>

            <div class="philanthropy-values-grid">
              <div *ngFor="let value of values" class="philanthropy-value-card">
                <h3>{{ value.title }}</h3>
                <p>{{ value.description }}</p>
              </div>
            </div>
          </article>

          <div class="philanthropy-stat-grid">
            <article *ngFor="let stat of stats" class="sr-surface-soft philanthropy-stat-card">
              <img [src]="heroLogo" alt="" aria-hidden="true" class="philanthropy-stat-logo" />
              <p class="philanthropy-stat-value">{{ stat.value }}</p>
              <h3 class="philanthropy-stat-label">{{ stat.label }}</h3>
              <p class="philanthropy-stat-detail">{{ stat.detail }}</p>
            </article>
          </div>
        </div>
      </section>

      <section class="sr-section">
        <div class="philanthropy-section-heading">
          <span class="sr-kicker">Pratyusha Support</span>
          <h2>Founder-led humanitarian work at the center of the record</h2>
          <p>Founded by Samantha Ruth Prabhu in 2014, Pratyusha Support remains the biggest and most clearly documented expression of her public service, centered on women and children in need.</p>
        </div>

        <div class="philanthropy-objective-grid">
          <article *ngFor="let objective of objectives; let index = index" class="sr-surface philanthropy-objective-card sr-hover-card">
            <span class="philanthropy-objective-index">{{ index + 1 | number:'2.0-0' }}</span>
            <h3 class="sr-card-title">{{ objective.title }}</h3>
            <p class="sr-card-text">{{ objective.description }}</p>
          </article>
        </div>
      </section>

      <section class="sr-section" *ngIf="leadership.length > 0">
        <div class="philanthropy-section-heading">
          <span class="sr-kicker">People Behind The Cause</span>
          <h2>The team publicly connected with Samantha's philanthropy work</h2>
          <p>Alongside Samantha, these are the people credited in the foundation's public record with helping guide the mission, shape the care model, and keep the outreach work moving.</p>
        </div>

        <div class="philanthropy-leadership-grid">
          <article *ngFor="let leader of leadership" class="sr-surface philanthropy-leader-card sr-hover-card">
            <div class="philanthropy-leader-media">
              <img [src]="leader.image" [alt]="leader.alt" loading="lazy" />
            </div>

            <div class="philanthropy-leader-body">
              <span class="sr-kicker">{{ leader.role }}</span>
              <h3 class="sr-card-title mt-3">{{ leader.name }}</h3>
              <p class="sr-card-text">{{ leader.description }}</p>
            </div>
          </article>
        </div>
      </section>

      <section class="sr-section">
        <div class="philanthropy-section-heading">
          <span class="sr-kicker">Pratyusha In Practice</span>
          <h2>Healthcare, relief, awareness, shelter, and wish fulfilment</h2>
          <p>Rather than dry program labels alone, these cards show how the foundation\'s stated work translates into treatment, daily care, awareness, and emotional support.</p>
        </div>

        <div class="philanthropy-program-grid">
          <article *ngFor="let program of programs" class="sr-surface philanthropy-program-card sr-hover-card">
            <div class="philanthropy-program-top">
              <div>
                <span class="sr-kicker">{{ program.kicker }}</span>
                <h3 class="sr-card-title mt-3">{{ program.title }}</h3>
              </div>
              <img [src]="heroLogo" alt="" aria-hidden="true" class="philanthropy-program-logo" />
            </div>

            <p class="philanthropy-program-metric">{{ program.metric }}</p>
            <p class="sr-card-text">{{ program.description }}</p>
          </article>
        </div>
      </section>

      <section class="sr-section">
        <div class="philanthropy-section-heading">
          <span class="sr-kicker">Key Organisations</span>
          <h2>Live institutions, advocacy platforms, and documented outreach touchpoints</h2>
          <p>Each card explains the nature of the association so current foundation work, public advocacy, education, and older outreach records do not get blurred together.</p>
        </div>

        <div class="philanthropy-organization-grid">
          <article *ngFor="let organization of organizations" class="sr-surface philanthropy-organization-card sr-hover-card">
            <div class="philanthropy-organization-top">
              <div
                class="philanthropy-organization-mark"
                [class.is-wide]="organization.logoScale === 'wide'"
                [class.is-compact]="organization.logoScale === 'compact'">
                <img
                  [src]="organization.logo"
                  [alt]="organization.logoAlt"
                  class="philanthropy-organization-logo"
                  loading="lazy" />
              </div>

              <div class="philanthropy-organization-copy">
                <span class="sr-kicker">{{ organization.kicker }}</span>
                <h3 class="sr-card-title mt-3">{{ organization.title }}</h3>
                <p class="philanthropy-organization-role">{{ organization.role }}</p>
              </div>
            </div>

            <p class="sr-card-text">{{ organization.description }}</p>

            <div class="philanthropy-organization-proof sr-surface-soft">
              <span class="philanthropy-contact-label">{{ organization.contributionLabel }}</span>
              <p class="philanthropy-organization-contribution">{{ organization.contribution }}</p>
            </div>

            <a
              [href]="organization.linkHref"
              target="_blank"
              rel="noopener noreferrer"
              class="philanthropy-organization-link">
              {{ organization.linkLabel }}
            </a>
          </article>
        </div>

        <article class="sr-surface philanthropy-archive-card">
          <div class="philanthropy-archive-copy">
            <div>
              <span class="sr-kicker">{{ archiveRecord.kicker }}</span>
              <h3 class="sr-card-title mt-3">{{ archiveRecord.title }}</h3>
            </div>
            <p class="sr-card-text">{{ archiveRecord.description }}</p>
          </div>

          <div class="philanthropy-archive-pill-row">
            <span *ngFor="let entity of archiveRecord.entities" class="philanthropy-archive-pill">{{ entity }}</span>
          </div>

          <div class="philanthropy-archive-footer">
            <p class="sr-card-text">{{ archiveRecord.note }}</p>
            <a
              [href]="archiveRecord.href"
              target="_blank"
              rel="noopener noreferrer"
              class="philanthropy-organization-link">
              {{ archiveRecord.linkLabel }}
            </a>
          </div>
        </article>
      </section>

      <section class="sr-section" *ngIf="stories.length > 0">
        <div class="philanthropy-section-heading">
          <span class="sr-kicker">Documented Outreach Gallery</span>
          <h2>Sourced images and dated public records of Samantha's work with children</h2>
          <p>These photo cards use publicly documented reporting to show what the outreach was actually about, while keeping archive coverage separate from current live-foundation claims.</p>
        </div>

        <div class="philanthropy-story-grid">
          <article *ngFor="let story of stories" class="sr-surface philanthropy-story-card sr-hover-card">
            <div class="philanthropy-story-media">
              <img [src]="story.image" [alt]="story.alt" loading="lazy" />
            </div>

            <div class="philanthropy-story-body">
              <span class="sr-kicker">{{ story.kicker }}</span>
              <h3 class="sr-card-title">{{ story.title }}</h3>
              <p class="sr-card-text">{{ story.description }}</p>

              <div class="philanthropy-story-brief sr-surface-soft">
                <span class="philanthropy-contact-label">What this is about</span>
                <p>{{ story.brief }}</p>
              </div>

              <a
                [href]="story.sourceHref"
                target="_blank"
                rel="noopener noreferrer"
                class="philanthropy-organization-link philanthropy-story-link">
                {{ story.sourceLabel }}
              </a>
            </div>
          </article>
        </div>
      </section>

      <section class="sr-section">
        <div class="philanthropy-section-heading">
          <span class="sr-kicker">Broader Impact</span>
          <h2>A social-impact profile that extends beyond one institution</h2>
          <p>Taken together, the work connects healthcare access, women and child welfare, educational support, patient advocacy, and dignity-led public service into one coherent record.</p>
        </div>

        <div class="philanthropy-footprint-grid">
          <article *ngFor="let item of footprint" class="sr-surface philanthropy-footprint-card sr-hover-card">
            <span class="sr-kicker">{{ item.kicker }}</span>
            <h3 class="sr-card-title mt-3">{{ item.title }}</h3>
            <p class="philanthropy-program-metric">{{ item.metric }}</p>
            <p class="sr-card-text">{{ item.description }}</p>
          </article>
        </div>
      </section>

      <section class="sr-section">
        <article class="sr-surface philanthropy-closing-card">
          <span class="sr-kicker">{{ closing.kicker }}</span>
          <h2 class="sr-card-title philanthropy-closing-title">{{ closing.title }}</h2>
          <p class="sr-card-text philanthropy-closing-copy">{{ closing.description }}</p>
        </article>
      </section>

      <section class="sr-section pb-12">
        <div class="sr-surface philanthropy-source-shell">
          <div class="philanthropy-section-heading is-left">
            <span class="sr-kicker">Sources & Verification</span>
            <h2>Live pages, archive context, and dated public reporting</h2>
            <p>The links below show where each class of claim comes from, so foundation work, education, patient advocacy, campaign participation, and older outreach records remain properly separated.</p>
            <p class="philanthropy-source-note">{{ verificationNote }}</p>
          </div>

          <div class="philanthropy-source-grid">
            <a
              *ngFor="let source of sources"
              class="philanthropy-source-card"
              [href]="source.href"
              target="_blank"
              rel="noopener noreferrer">
              <div>
                <h3>{{ source.label }}</h3>
                <p>{{ source.description }}</p>
              </div>
              <span class="philanthropy-source-arrow">Visit source</span>
            </a>
          </div>

          <div class="philanthropy-contact-grid">
            <div *ngFor="let contact of contacts" class="philanthropy-contact-card">
              <span class="philanthropy-contact-label">{{ contact.label }}</span>
              <a
                *ngIf="contact.href; else plainContact"
                [href]="contact.href"
                class="philanthropy-contact-value">
                {{ contact.value }}
              </a>
              <ng-template #plainContact>
                <span class="philanthropy-contact-value">{{ contact.value }}</span>
              </ng-template>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .philanthropy-page {
      --editorial-ink: #fff3e6;
      --editorial-muted: rgba(255, 241, 225, 0.82);
      --editorial-soft: rgba(255, 241, 225, 0.64);
      --editorial-accent: #ddb078;
      --editorial-accent-strong: #f4cfa7;
      --editorial-line: rgba(244, 207, 167, 0.18);
      --editorial-card: rgba(34, 18, 14, 0.86);
      position: relative;
      overflow: hidden;
      isolation: isolate;
      padding-bottom: 6rem;
      background:
        radial-gradient(circle at top center, rgba(175, 101, 54, 0.22), transparent 28%),
        radial-gradient(circle at 12% 20%, rgba(238, 180, 125, 0.12), transparent 22%),
        radial-gradient(circle at 88% 14%, rgba(140, 79, 49, 0.16), transparent 24%),
        linear-gradient(180deg, #070303 0%, #0d0504 18%, #140907 52%, #0f0605 100%);
      color: var(--editorial-ink);
    }

    .philanthropy-page a {
      text-decoration: none;
    }

    .philanthropy-page img {
      display: block;
    }

    .philanthropy-page::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at top right, rgba(214, 169, 93, 0.18), transparent 30%),
        radial-gradient(circle at 18% 30%, rgba(214, 120, 78, 0.16), transparent 24%),
        linear-gradient(180deg, rgba(18, 11, 10, 0) 0%, rgba(18, 11, 10, 0.2) 100%);
      pointer-events: none;
      z-index: -1;
    }

    .philanthropy-page::after {
      content: '';
      position: absolute;
      inset: 0;
      background:
        linear-gradient(90deg, rgba(255, 223, 193, 0.03) 0%, transparent 22%, transparent 78%, rgba(255, 223, 193, 0.03) 100%),
        linear-gradient(180deg, transparent 0%, rgba(255, 223, 193, 0.02) 100%);
      pointer-events: none;
      z-index: -1;
    }

    .philanthropy-hero-panel {
      min-height: clamp(560px, 78vh, 760px);
      padding: clamp(1.25rem, 2.3vw, 2rem);
      background: linear-gradient(135deg, rgba(27, 12, 9, 0.92) 0%, rgba(17, 8, 6, 0.98) 100%);
      box-shadow: inset 0 0 0 1px rgba(255, 248, 239, 0.04);
    }

    .philanthropy-hero-panel::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 24% 28%, rgba(248, 190, 133, 0.14), transparent 24%),
        radial-gradient(circle at 75% 35%, rgba(166, 96, 60, 0.24), transparent 28%),
        linear-gradient(100deg, rgba(8, 4, 3, 0.18) 0%, rgba(8, 4, 3, 0.08) 44%, rgba(8, 4, 3, 0.22) 100%);
      z-index: 0;
    }

    .philanthropy-hero-grid,
    .philanthropy-mission-grid,
    .philanthropy-action-grid {
      display: grid;
      gap: clamp(1.5rem, 3vw, 2.2rem);
    }

    .philanthropy-hero-grid {
      position: relative;
      z-index: 1;
    }

    .philanthropy-hero-copy {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding: clamp(1.5rem, 2.7vw, 2.5rem);
      border-radius: 2.1rem;
      background: linear-gradient(180deg, rgba(46, 24, 19, 0.76), rgba(21, 10, 8, 0.42));
      border: 1px solid rgba(244, 207, 167, 0.09);
      backdrop-filter: blur(14px);
      box-shadow:
        inset 0 1px 0 rgba(255, 249, 242, 0.06),
        0 24px 60px rgba(6, 2, 2, 0.2);
    }

    .philanthropy-hero-copy::after {
      content: '';
      position: absolute;
      inset: auto 1.4rem 1.1rem;
      height: 1px;
      background: linear-gradient(90deg, rgba(244, 207, 167, 0), rgba(244, 207, 167, 0.3), rgba(244, 207, 167, 0));
      opacity: 0.65;
      pointer-events: none;
    }

    .philanthropy-logo-lockup {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1.1rem;
      margin-bottom: 1.8rem;
    }

    .philanthropy-brand-mark {
      display: flex;
      align-items: center;
      justify-content: center;
      width: clamp(6.8rem, 14vw, 8.5rem);
      aspect-ratio: 1;
      padding: 1rem;
      border-radius: 1.8rem;
      border: 1px solid rgba(244, 207, 167, 0.14);
      background:
        radial-gradient(circle at top, rgba(244, 207, 167, 0.14), transparent 58%),
        linear-gradient(180deg, rgba(255, 248, 240, 0.08), rgba(255, 248, 240, 0.03));
      box-shadow:
        inset 0 1px 0 rgba(255, 250, 245, 0.08),
        0 16px 42px rgba(12, 4, 3, 0.24);
    }

    .philanthropy-brand-copy {
      display: grid;
      gap: 0.3rem;
    }

    .philanthropy-logo {
      width: 100%;
      max-width: 6.6rem;
      height: auto;
      filter: drop-shadow(0 18px 34px rgba(0, 0, 0, 0.24));
    }

    .philanthropy-logo-note,
    .philanthropy-source-note,
    .philanthropy-seal-copy {
      margin: 0;
      color: rgba(255, 241, 225, 0.74);
      line-height: 1.75;
    }

    .philanthropy-hero-copy .sr-hero-title {
      display: grid;
      gap: 0.45rem;
      margin-top: 0.55rem;
      line-height: 0.92;
      color: #fff4e8;
      text-shadow: 0 12px 34px rgba(0, 0, 0, 0.26);
    }

    .philanthropy-hero-title-primary,
    .philanthropy-hero-title-secondary {
      display: block;
    }

    .philanthropy-hero-title-primary {
      max-width: 8.5ch;
      font-size: clamp(3.35rem, 5.2vw, 5.4rem);
      letter-spacing: -0.03em;
    }

    .philanthropy-hero-title-secondary {
      max-width: 9.5ch;
      font-size: clamp(2.2rem, 3.05vw, 3.35rem);
      color: rgba(255, 241, 225, 0.94);
      letter-spacing: -0.02em;
    }

    .philanthropy-hero-copy .sr-hero-subtitle {
      max-width: 42rem;
      margin-top: 0.85rem;
      color: rgba(255, 244, 231, 0.92);
      font-size: clamp(0.98rem, 1.3vw, 1.12rem);
      line-height: 1.72;
    }

    .philanthropy-hero-description {
      margin-top: 1rem;
      max-width: 38rem;
      color: rgba(255, 241, 225, 0.78);
      font-size: 0.98rem;
      line-height: 1.76;
    }

    .philanthropy-tag-row,
    .philanthropy-hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-top: 1.2rem;
    }

    .philanthropy-tag {
      display: inline-flex;
      align-items: center;
      padding: 0.72rem 0.98rem;
      border-radius: 999px;
      border: 1px solid rgba(244, 207, 167, 0.18);
      background:
        linear-gradient(180deg, rgba(255, 246, 236, 0.06), rgba(255, 246, 236, 0.02)),
        rgba(255, 255, 255, 0.02);
      box-shadow: inset 0 1px 0 rgba(255, 250, 245, 0.06);
      color: rgba(255, 241, 225, 0.92);
      font-size: 0.76rem;
      font-family: 'Manrope', 'Inter', sans-serif;
      font-weight: 700;
      letter-spacing: 0.065em;
      text-transform: uppercase;
    }

    .philanthropy-hero-actions .sr-button {
      box-shadow: 0 18px 46px rgba(236, 182, 126, 0.22);
    }

    .philanthropy-hero-actions .sr-button-outline {
      background: rgba(255, 243, 230, 0.05);
      border-color: rgba(244, 207, 167, 0.3);
    }

    .philanthropy-source-note {
      margin-top: 1.3rem;
      max-width: 38rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(244, 207, 167, 0.12);
    }

    .philanthropy-hero-art {
      position: relative;
      display: grid;
      grid-template-rows: minmax(0, 1fr) auto;
      gap: 0.95rem;
      min-height: 100%;
      padding: 0.35rem 0.35rem 0;
    }

    .philanthropy-hero-image-shell {
      position: relative;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      overflow: hidden;
      min-height: clamp(28rem, 42vw, 39rem);
      height: 100%;
      padding: 0.85rem 0.85rem 0;
      border-radius: 2.25rem;
      border: 1px solid rgba(244, 207, 167, 0.12);
      background:
        radial-gradient(circle at top, rgba(244, 207, 167, 0.14), transparent 44%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.02));
      box-shadow:
        inset 0 1px 0 rgba(255, 250, 245, 0.08),
        0 30px 70px rgba(12, 4, 3, 0.22);
    }

    .philanthropy-hero-meta {
      display: grid;
      gap: 0.95rem;
      margin-top: 0;
    }

    .philanthropy-hero-image-shell::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 72% 24%, rgba(255, 210, 164, 0.12), transparent 20%),
        linear-gradient(180deg, rgba(17, 8, 7, 0) 55%, rgba(17, 8, 7, 0.18) 100%);
      pointer-events: none;
    }

    .philanthropy-hero-image {
      width: 100%;
      height: 100%;
      max-height: none;
      object-fit: cover;
      object-position: center top;
      filter: drop-shadow(0 28px 48px rgba(0, 0, 0, 0.3));
    }

    .philanthropy-hero-fact {
      position: static;
      width: 100%;
      padding: 0.95rem 1rem;
      border-radius: 1.45rem;
      border: 1px solid rgba(244, 207, 167, 0.16);
      background:
        linear-gradient(180deg, rgba(255, 244, 231, 0.1), rgba(19, 10, 8, 0.94)),
        rgba(28, 14, 11, 0.88);
      backdrop-filter: blur(18px);
      box-shadow: 0 22px 54px rgba(7, 2, 2, 0.24);
    }

    .philanthropy-hero-seal {
      position: static;
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.1rem;
      border-radius: 1.45rem;
      border: 1px solid rgba(244, 207, 167, 0.12);
      background: rgba(19, 10, 8, 0.86);
      backdrop-filter: blur(18px);
      box-shadow: 0 20px 48px rgba(8, 2, 2, 0.24);
    }

    .philanthropy-seal-logo {
      width: 7.2rem;
      height: auto;
      flex-shrink: 0;
    }

    .philanthropy-hero-fact-label,
    .philanthropy-seal-label,
    .philanthropy-program-metric,
    .philanthropy-contact-label,
    .philanthropy-source-arrow {
      display: inline-flex;
      color: #f2c88f;
      font-size: 0.82rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    .philanthropy-hero-fact-value {
      margin: 0.75rem 0 0;
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2.6rem, 5vw, 3.8rem);
      line-height: 0.9;
      color: #fff4e8;
    }

    .philanthropy-hero-fact-copy {
      margin: 0.55rem 0 0;
      color: rgba(255, 241, 225, 0.74);
      line-height: 1.65;
    }

    .philanthropy-display-title {
      margin-top: 1rem;
      font-size: clamp(2.5rem, 4vw, 4.2rem);
    }

    .philanthropy-body-copy {
      margin-top: 1.3rem;
      max-width: 46rem;
      font-size: 1.04rem;
      line-height: 1.95;
    }

    .philanthropy-mission-card,
    .philanthropy-source-shell {
      padding: clamp(1.65rem, 3vw, 2.8rem);
      background:
        linear-gradient(180deg, rgba(255, 247, 239, 0.06), rgba(18, 10, 8, 0.94)),
        rgba(28, 14, 11, 0.84);
    }

    .philanthropy-vision-block {
      margin-top: 1.6rem;
      padding: 1.35rem;
      border-radius: 1.4rem;
      border: 1px solid rgba(244, 207, 167, 0.1);
      background:
        linear-gradient(180deg, rgba(255, 247, 239, 0.06), rgba(18, 10, 8, 0.68)),
        rgba(33, 17, 13, 0.58);
    }

    .philanthropy-subheading {
      margin: 0 0 0.75rem;
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.65rem;
      color: #f8f0e3;
    }

    .philanthropy-values-grid,
    .philanthropy-stat-grid,
    .philanthropy-objective-grid,
    .philanthropy-program-grid,
    .philanthropy-organization-grid,
    .philanthropy-footprint-grid,
    .philanthropy-story-grid,
    .philanthropy-leadership-grid,
    .philanthropy-source-grid,
    .philanthropy-contact-grid {
      display: grid;
      gap: 1rem;
    }

    .philanthropy-values-grid {
      margin-top: 1.7rem;
      gap: 1.1rem;
    }

    .philanthropy-value-card,
    .philanthropy-contact-card {
      padding: 1.05rem 1.15rem;
      border-radius: 1.2rem;
      border: 1px solid rgba(244, 207, 167, 0.12);
      background:
        linear-gradient(180deg, rgba(255, 247, 239, 0.04), rgba(18, 10, 8, 0.6)),
        rgba(255, 255, 255, 0.02);
    }

    .philanthropy-value-card h3,
    .philanthropy-contact-value,
    .philanthropy-source-card h3 {
      margin: 0;
      color: #f8f0e3;
      font-weight: 600;
    }

    .philanthropy-value-card p,
    .philanthropy-source-card p {
      margin: 0.45rem 0 0;
      color: rgba(255, 241, 225, 0.72);
      line-height: 1.7;
    }

    .philanthropy-stat-card {
      position: relative;
      overflow: hidden;
      padding: 1.55rem;
      border-radius: 1.65rem;
      border: 1px solid rgba(244, 207, 167, 0.12);
      background:
        linear-gradient(180deg, rgba(255, 247, 239, 0.09), rgba(255, 247, 239, 0.03)),
        linear-gradient(135deg, rgba(214, 169, 93, 0.12), transparent 60%);
      box-shadow:
        inset 0 1px 0 rgba(255, 250, 245, 0.06),
        0 24px 60px rgba(6, 2, 2, 0.18);
    }

    .philanthropy-stat-card::after {
      content: '';
      position: absolute;
      inset: auto -2rem -2rem auto;
      width: 7rem;
      height: 7rem;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(214, 169, 93, 0.18), transparent 70%);
      pointer-events: none;
    }

    .philanthropy-stat-logo,
    .philanthropy-program-logo {
      width: 5.4rem;
      height: auto;
      opacity: 0.9;
      filter: drop-shadow(0 12px 22px rgba(0, 0, 0, 0.2));
    }

    .philanthropy-stat-value {
      margin: 1.15rem 0 0;
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2.8rem, 6vw, 4.5rem);
      line-height: 0.95;
      color: #f8f0e3;
    }

    .philanthropy-stat-label {
      margin: 0.95rem 0 0;
      color: #f8f0e3;
      font-size: 1.1rem;
      line-height: 1.4;
    }

    .philanthropy-stat-detail {
      margin: 0.75rem 0 0;
      color: rgba(255, 241, 225, 0.72);
      line-height: 1.75;
    }

    .philanthropy-section-heading {
      max-width: 44rem;
      margin: 0 auto 1.8rem;
      text-align: center;
    }

    .philanthropy-section-heading.is-left {
      margin: 0 0 1.5rem;
      text-align: left;
    }

    .philanthropy-section-heading h2 {
      margin: 0.8rem 0 0;
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2.1rem, 4vw, 3.5rem);
      line-height: 1.02;
      color: #f8f0e3;
    }

    .philanthropy-section-heading p,
    .philanthropy-action-text {
      margin: 1rem 0 0;
      color: rgba(255, 241, 225, 0.78);
      line-height: 1.8;
    }

    .philanthropy-objective-card,
    .philanthropy-program-card,
    .philanthropy-organization-card,
    .philanthropy-footprint-card,
    .philanthropy-leader-card,
    .philanthropy-action-card {
      height: 100%;
      overflow: hidden;
    }

    .philanthropy-objective-card {
      position: relative;
      padding: 1.55rem;
      border: 1px solid rgba(244, 207, 167, 0.12);
      background:
        linear-gradient(180deg, rgba(255, 247, 239, 0.06), rgba(18, 10, 8, 0.9)),
        rgba(28, 14, 11, 0.84);
    }

    .philanthropy-objective-card::before,
    .philanthropy-program-card::before,
    .philanthropy-organization-card::before,
    .philanthropy-footprint-card::before,
    .philanthropy-story-card::before,
    .philanthropy-leader-card::before,
    .philanthropy-action-card::before {
      content: '';
      position: absolute;
      inset: 0 0 auto;
      height: 1px;
      background: linear-gradient(90deg, rgba(244, 207, 167, 0), rgba(244, 207, 167, 0.3), rgba(244, 207, 167, 0));
      pointer-events: none;
    }

    .philanthropy-objective-index {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.7rem;
      height: 2.7rem;
      margin-bottom: 1rem;
      border-radius: 999px;
      border: 1px solid rgba(214, 169, 93, 0.24);
      background: rgba(214, 169, 93, 0.08);
      color: #d6a95d;
      font-size: 0.9rem;
      font-weight: 700;
      letter-spacing: 0.12em;
    }

    .philanthropy-program-card {
      position: relative;
      padding: 1.6rem;
      border: 1px solid rgba(244, 207, 167, 0.12);
      background:
        linear-gradient(180deg, rgba(255, 247, 239, 0.08), rgba(255, 247, 239, 0.025)),
        linear-gradient(120deg, rgba(122, 153, 118, 0.12), transparent 52%);
    }

    .philanthropy-organization-card {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
      padding: 1.6rem;
      border: 1px solid rgba(244, 207, 167, 0.12);
      background:
        linear-gradient(180deg, rgba(255, 247, 239, 0.08), rgba(255, 247, 239, 0.025)),
        linear-gradient(132deg, rgba(84, 118, 150, 0.18), transparent 58%);
    }

    .philanthropy-footprint-card {
      position: relative;
      padding: 1.6rem;
      border: 1px solid rgba(244, 207, 167, 0.12);
      background:
        linear-gradient(180deg, rgba(255, 247, 239, 0.07), rgba(255, 247, 239, 0.025)),
        linear-gradient(120deg, rgba(93, 117, 147, 0.16), transparent 56%);
    }

    .philanthropy-program-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
    }

    .philanthropy-organization-top {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      align-items: start;
      gap: 1rem;
    }

    .philanthropy-organization-mark {
      --org-mark-width: clamp(7.2rem, 18vw, 8.9rem);
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--org-mark-width);
      min-height: 6.15rem;
      padding: 0.95rem 1rem;
      border-radius: 1.45rem;
      border: 1px solid rgba(244, 207, 167, 0.12);
      background:
        radial-gradient(circle at top, rgba(255, 255, 255, 0.78), rgba(255, 248, 241, 0.94) 52%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(245, 232, 221, 0.94));
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.72),
        0 18px 42px rgba(10, 3, 3, 0.16);
    }

    .philanthropy-organization-mark.is-wide {
      --org-mark-width: clamp(9rem, 20vw, 11.5rem);
    }

    .philanthropy-organization-mark.is-compact {
      --org-mark-width: 6.5rem;
      padding: 0.85rem;
    }

    .philanthropy-organization-logo {
      width: auto;
      max-width: 100%;
      max-height: 4.8rem;
      object-fit: contain;
      object-position: center;
    }

    .philanthropy-organization-copy {
      display: grid;
      gap: 0.3rem;
    }

    .philanthropy-organization-role {
      margin: 0.75rem 0 0;
      color: rgba(255, 243, 231, 0.92);
      font-size: 0.98rem;
      font-weight: 600;
      line-height: 1.65;
    }

    .philanthropy-organization-proof {
      padding: 1rem 1.1rem;
      border-radius: 1.25rem;
      border: 1px solid rgba(244, 207, 167, 0.1);
      background:
        linear-gradient(180deg, rgba(255, 247, 239, 0.08), rgba(18, 10, 8, 0.68)),
        rgba(33, 17, 13, 0.56);
    }

    .philanthropy-organization-contribution {
      margin: 0.55rem 0 0;
      color: rgba(255, 241, 225, 0.76);
      line-height: 1.72;
    }

    .philanthropy-organization-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: auto;
      color: #f4cfa7;
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .philanthropy-organization-link::after {
      content: '->';
      font-size: 0.95rem;
      line-height: 1;
    }

    .philanthropy-program-metric {
      margin: 1.2rem 0 0.7rem;
    }

    .philanthropy-archive-card {
      display: grid;
      gap: 1.2rem;
      margin-top: 1rem;
      padding: 1.6rem;
      border: 1px solid rgba(244, 207, 167, 0.12);
      background:
        linear-gradient(180deg, rgba(255, 247, 239, 0.07), rgba(255, 247, 239, 0.025)),
        linear-gradient(128deg, rgba(160, 119, 76, 0.14), transparent 58%);
    }

    .philanthropy-archive-copy,
    .philanthropy-archive-footer {
      display: grid;
      gap: 0.9rem;
    }

    .philanthropy-archive-pill-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.7rem;
    }

    .philanthropy-archive-pill {
      display: inline-flex;
      align-items: center;
      padding: 0.7rem 0.95rem;
      border-radius: 999px;
      border: 1px solid rgba(244, 207, 167, 0.14);
      background:
        linear-gradient(180deg, rgba(255, 247, 239, 0.07), rgba(18, 10, 8, 0.52)),
        rgba(255, 255, 255, 0.03);
      color: rgba(255, 241, 225, 0.84);
      font-size: 0.83rem;
      font-weight: 600;
      letter-spacing: 0.03em;
      line-height: 1.4;
    }

    .philanthropy-closing-card {
      padding: clamp(1.75rem, 3vw, 2.8rem);
      border: 1px solid rgba(244, 207, 167, 0.12);
      background:
        linear-gradient(180deg, rgba(255, 247, 239, 0.07), rgba(18, 10, 8, 0.9)),
        linear-gradient(128deg, rgba(109, 190, 129, 0.12), transparent 58%);
    }

    .philanthropy-closing-title {
      margin-top: 0.9rem;
      font-size: clamp(2rem, 3.4vw, 3.4rem);
      line-height: 1.04;
    }

    .philanthropy-closing-copy {
      max-width: 56rem;
      margin-top: 1.1rem;
      color: rgba(255, 241, 225, 0.82);
      font-size: 1.03rem;
      line-height: 1.9;
    }

    .philanthropy-story-card {
      position: relative;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid rgba(244, 207, 167, 0.12);
      background:
        linear-gradient(180deg, rgba(255, 247, 239, 0.06), rgba(18, 10, 8, 0.92)),
        rgba(28, 14, 11, 0.84);
    }

    .philanthropy-story-media {
      min-height: 16rem;
      background:
        radial-gradient(circle at top, rgba(214, 169, 93, 0.18), transparent 48%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent);
    }

    .philanthropy-story-media img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center top;
      filter: saturate(1.02) contrast(1.04) brightness(0.96);
    }

    .philanthropy-story-body {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: 0.95rem;
      padding: 1.5rem;
    }

    .philanthropy-story-brief {
      margin-top: 0.1rem;
      padding: 0.95rem 1rem;
      border: 1px solid rgba(244, 207, 167, 0.1);
      background:
        linear-gradient(180deg, rgba(255, 247, 239, 0.06), rgba(18, 10, 8, 0.62)),
        rgba(255, 255, 255, 0.02);
    }

    .philanthropy-story-brief p {
      margin: 0.45rem 0 0;
      color: rgba(255, 241, 225, 0.76);
      line-height: 1.7;
    }

    .philanthropy-story-link {
      margin-top: auto;
    }

    .philanthropy-leader-card {
      position: relative;
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(244, 207, 167, 0.12);
      background:
        linear-gradient(180deg, rgba(255, 247, 239, 0.06), rgba(18, 10, 8, 0.92)),
        rgba(28, 14, 11, 0.84);
    }

    .philanthropy-leader-media {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      min-height: 18rem;
      padding: 1.5rem 1.5rem 0;
      background:
        radial-gradient(circle at top, rgba(214, 169, 93, 0.18), transparent 48%),
        linear-gradient(180deg, rgba(255, 255, 255, 0.06), transparent);
    }

    .philanthropy-leader-media img {
      width: min(100%, 17rem);
      max-height: 17rem;
      object-fit: contain;
      object-position: center bottom;
      filter: drop-shadow(0 24px 36px rgba(0, 0, 0, 0.25));
    }

    .philanthropy-leader-body,
    .philanthropy-action-body {
      padding: 1.5rem;
    }

    .philanthropy-action-card {
      position: relative;
      display: grid;
      gap: 0;
      border: 1px solid rgba(244, 207, 167, 0.12);
      background:
        linear-gradient(180deg, rgba(255, 247, 239, 0.06), rgba(18, 10, 8, 0.92)),
        rgba(28, 14, 11, 0.84);
    }

    .philanthropy-action-media {
      min-height: 17rem;
      background:
        radial-gradient(circle at top, rgba(214, 169, 93, 0.16), transparent 50%),
        rgba(255, 255, 255, 0.03);
    }

    .philanthropy-action-media img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      filter: saturate(1.02) contrast(1.03) brightness(0.94);
    }

    .philanthropy-source-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 1rem;
      padding: 1.25rem 1.35rem;
      border-radius: 1.25rem;
      border: 1px solid rgba(244, 207, 167, 0.12);
      background:
        linear-gradient(180deg, rgba(255, 247, 239, 0.05), rgba(18, 10, 8, 0.78)),
        rgba(255, 255, 255, 0.03);
      text-decoration: none;
      transition: transform 180ms ease, border-color 180ms ease, background-color 180ms ease;
    }

    .philanthropy-source-card:hover {
      transform: translateY(-4px);
      border-color: rgba(244, 207, 167, 0.3);
      background:
        linear-gradient(180deg, rgba(255, 247, 239, 0.08), rgba(18, 10, 8, 0.74)),
        rgba(255, 255, 255, 0.05);
    }

    .philanthropy-contact-value {
      display: inline-flex;
      margin-top: 0.4rem;
      text-decoration: none;
      line-height: 1.7;
      color: #fff1df;
    }

    @media (min-width: 768px) {
      .philanthropy-values-grid,
      .philanthropy-stat-grid,
      .philanthropy-program-grid,
      .philanthropy-organization-grid,
      .philanthropy-footprint-grid,
      .philanthropy-story-grid,
      .philanthropy-source-grid,
      .philanthropy-contact-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .philanthropy-objective-grid,
      .philanthropy-leadership-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .philanthropy-action-card {
        grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
      }
    }

    @media (min-width: 1024px) {
      .philanthropy-hero-grid {
        grid-template-columns: minmax(0, 1.22fr) minmax(20rem, 0.78fr);
        align-items: stretch;
      }

      .philanthropy-hero-copy {
        min-height: 100%;
        justify-content: flex-start;
      }

      .philanthropy-hero-meta {
        grid-template-columns: minmax(13rem, 14.5rem) minmax(0, 1fr);
        align-items: stretch;
      }

      .philanthropy-mission-grid {
        grid-template-columns: minmax(0, 1.15fr) minmax(18rem, 0.85fr);
        align-items: start;
      }

      .philanthropy-values-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .philanthropy-objective-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .philanthropy-leadership-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .philanthropy-footprint-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .philanthropy-organization-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .philanthropy-story-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }

    @media (max-width: 767px) {
      .philanthropy-hero-panel {
        min-height: auto;
      }

      .philanthropy-hero-copy {
        padding: 1.35rem;
        border-radius: 1.6rem;
      }

      .philanthropy-brand-mark {
        width: 5.8rem;
        padding: 0.85rem;
        border-radius: 1.35rem;
      }

      .philanthropy-hero-copy .sr-hero-title {
        gap: 0.35rem;
      }

      .philanthropy-hero-title-primary {
        max-width: none;
        font-size: clamp(3rem, 13vw, 4.35rem);
      }

      .philanthropy-hero-title-secondary {
        max-width: 9ch;
        font-size: clamp(1.85rem, 7vw, 2.65rem);
      }

      .philanthropy-hero-image-shell {
        min-height: 20.5rem;
      }

      .philanthropy-hero-meta {
        grid-template-columns: 1fr;
        margin-top: 0;
      }

      .philanthropy-hero-fact {
        width: auto;
      }

      .philanthropy-hero-image {
        max-height: none;
      }

      .philanthropy-organization-top {
        grid-template-columns: 1fr;
      }

      .philanthropy-organization-mark {
        width: 100%;
      }

      .philanthropy-action-media {
        min-height: 13rem;
      }
    }
  `]
})
export class PhilanthropyComponent implements OnInit {
  readonly content = PHILANTHROPY_PAGE_CONTENT;
  readonly heroLogo = 'assets/images/philanthropy/pratyusha-logo-white.png';
  readonly verificationNote = PHILANTHROPY_VERIFICATION_NOTE;
  stats = PHILANTHROPY_STATS;
  readonly values = PHILANTHROPY_VALUES;
  objectives = PHILANTHROPY_OBJECTIVES;
  readonly programs = PHILANTHROPY_PROGRAMS;
  readonly organizations = PHILANTHROPY_ORGANIZATIONS;
  readonly archiveRecord = PHILANTHROPY_ARCHIVE_RECORD;
  readonly footprint = PHILANTHROPY_FOOTPRINT;
  stories = PHILANTHROPY_STORIES;
  readonly closing = PHILANTHROPY_CLOSING;
  readonly leadership = PHILANTHROPY_LEADERSHIP;
  readonly actions = PHILANTHROPY_ACTIONS;
  readonly contacts = PHILANTHROPY_CONTACTS;
  readonly sources = PHILANTHROPY_SOURCES;

  constructor(private readonly apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getPhilanthropies().subscribe({
      next: (items) => {
        if (!items || items.length === 0) {
          return;
        }

        const stats = items.filter((item) => item.type === 'Stat');
        const initiatives = items.filter((item) => item.type === 'Initiative');
        const stories = items.filter((item) => item.type === 'Story');

        const mappedStats = this.mapStats(stats);
        if (mappedStats.length > 0) {
          this.stats = mappedStats;
        }

        const verifiedObjectives = initiatives
          .filter((item) => this.isVerifiedObjective(item.title))
          .map((item) => ({
            title: item.title,
            description: this.getObjectiveFallback(item.title) || 'Verified objective published on the foundation site.'
          }));

        if (verifiedObjectives.length > 0) {
          this.objectives = verifiedObjectives;
        }

        const verifiedStories = stories
          .filter((item) => this.isVerifiedStory(item.title))
          .map((item) => {
            const fallback = this.getStoryFallback(item.title);
            return {
              kicker: fallback?.kicker || 'Public Record',
              title: fallback?.title || item.title,
              description: fallback?.description || 'Verified public-record highlight connected to the foundation.',
              brief: fallback?.brief || 'Documented outreach record connected to Samantha and the foundation.',
              image: fallback?.image || item.imageUrl || PHILANTHROPY_PAGE_CONTENT.heroImage,
              alt: fallback?.alt || `${item.title} for Pratyusha Support`,
              sourceLabel: fallback?.sourceLabel || 'View source',
              sourceHref: fallback?.sourceHref || 'https://pratyushasupport.org/'
            };
          });

        if (verifiedStories.length > 0) {
          this.stories = verifiedStories;
        }
      },
      error: (error) => {
        console.error('Failed to load philanthropy records for the public page', error);
      }
    });
  }

  private mapStats(items: Philanthropy[]): PhilanthropyStat[] {
    return items.flatMap((item) => {
      const fallback = this.getStatFallback(item.title);
      if (!fallback) {
        return [];
      }

      return {
        value: this.formatStatValue(item, fallback),
        label: fallback.label,
        detail: fallback.detail
      };
    });
  }

  private formatStatValue(item: Philanthropy, fallback?: PhilanthropyStat): string {
    if (typeof item.value === 'number') {
      const baseValue = item.value.toLocaleString('en-IN');
      return fallback?.value.includes('+') ? `${baseValue}+` : baseValue;
    }

    return fallback?.value || '0';
  }

  private getObjectiveFallback(title: string): string | undefined {
    return PHILANTHROPY_OBJECTIVES.find((entry) => normalizePhilanthropyKey(entry.title) === normalizePhilanthropyKey(title))?.description;
  }

  private getStatFallback(title: string): PhilanthropyStat | undefined {
    const key = normalizePhilanthropyKey(title);

    if (key.includes('surger')) {
      return PHILANTHROPY_STATS[0];
    }

    if (key.includes('shelter') || key.includes('children')) {
      return PHILANTHROPY_STATS[1];
    }

    if (key.includes('established') || key.includes('founded')) {
      return PHILANTHROPY_STATS[2];
    }

    return undefined;
  }

  private getStoryFallback(title: string): PhilanthropyStory | undefined {
    const key = normalizePhilanthropyKey(title);

    if (key.includes('taj mahal') || key.includes('flight') || key.includes('two desire') || key.includes('hiv patients') || key.includes('historic patient') || key.includes('sponsor')) {
      return PHILANTHROPY_STORIES[0];
    }

    if (key.includes('ram charan') || key.includes('wish') || key.includes('rahul')) {
      return PHILANTHROPY_STORIES[1];
    }

    if (key.includes('2015') || key.includes('2018') || key.includes('christmas') || key.includes('protein') || key.includes('community') || key.includes('preventive') || key.includes('menstrual')) {
      return PHILANTHROPY_STORIES[2];
    }

    return undefined;
  }

  private isVerifiedObjective(title: string): boolean {
    return PHILANTHROPY_OBJECTIVES.some((entry) => normalizePhilanthropyKey(entry.title) === normalizePhilanthropyKey(title));
  }

  private isVerifiedStory(title: string): boolean {
    return this.getStoryFallback(title) !== undefined;
  }
}
