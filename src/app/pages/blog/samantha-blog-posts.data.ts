export interface BlogPostSection {
  heading: string;
  quote?: string;
  paragraphs: string[];
}

export interface SamanthaBlogPost {
  id: string;
  title: string;
  summary: string;
  coverImage: string;
  publishedAt: string;
  isPublished: boolean;
  sections: BlogPostSection[];
  discussionQuestion: string;
  hashtags: string[];
}

export const SAMANTHA_BLOG_POSTS: SamanthaBlogPost[] = [
  {
    id: 'seed-promo-day',
    title: 'A Day In My Life During Movie Promotions',
    summary:
      'Promotion days look glamorous from the outside, but they are really built on preparation, pacing, gratitude, and the tiny rituals that help me stay present.',
    coverImage: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008413/PAND7159_k4qlvo.jpg',
    publishedAt: '2026-04-18T09:00:00+05:30',
    isPublished: true,
    sections: [
      {
        heading: 'The Quiet Hour Before The Cameras',
        quote: 'The busiest days need the gentlest beginnings.',
        paragraphs: [
          `Promotion days usually begin long before the first camera is switched on. I have learned to protect the first hour of the morning because it quietly decides how the rest of the day will feel. If I wake up in a rush, I carry that energy into every interview, every fitting, and every room. If I wake up with intention, the whole day feels more anchored.`,
          `That first stretch of time is rarely dramatic. It is water, a light meal, a little movement, and a moment of silence before the schedule gets loud. Some mornings I journal. Some mornings I stretch. Some mornings I simply sit still and let my mind catch up with my body. I have stopped underestimating how much those simple things matter when the day ahead is packed.`,
          `People often imagine that glamour starts in the makeup chair. For me, it starts much earlier, in the way I choose to meet myself before the world does. That private calm is what helps me stay honest once the public part of the day begins.`
        ]
      },
      {
        heading: 'Glam, Styling, And The Mood Of The Day',
        paragraphs: [
          `By the time I sit for hair and makeup, the pace begins to change. The team is discussing timelines, fittings, touch-ups, travel between venues, and how each appearance should feel. I love that fashion can tell a story, but I also know that on promotion days style has to do more than look beautiful. It has to move with the schedule.`,
          `An outfit has to survive studio lights, long car rides, quick changes, and that strange balance between comfort and presentation. I care deeply about feeling like myself inside whatever I wear. There is no point in a look that photographs well if it makes you feel disconnected from your own body.`,
          `Over the years I have become much more interested in clothes that support confidence rather than perform it. The right styling on a busy day does not make you feel like someone else. It helps the most grounded version of you show up.`
        ]
      },
      {
        heading: 'Interviews, Energy, And Staying Honest',
        quote: 'Looking composed and feeling centered are not always the same thing.',
        paragraphs: [
          `Once the interviews start, the day becomes a moving train. It is fascinating because you may answer similar questions many times, but no two conversations are ever exactly the same. One person wants to talk about the emotional heart of the project. Another wants a fun memory from set. Someone else wants to know what the role changed in me.`,
          `The real challenge is not repetition. It is presence. I never want my answers to feel mechanical, because the work itself was never mechanical. So much heart, discipline, fear, hope, and collaboration go into a film or series. Promotion is not just a marketing exercise to me. It is a way of honoring that journey and the people who made it possible.`,
          `There are also the in-between moments no one sees. A quick meal. A bottle of water handed to me in the car. Five minutes of silence before stepping on stage. Those little pauses are where I check in with myself. Am I tired? Am I breathing properly? Do I need quiet for a minute? Wellness matters most when life is least convenient.`
        ]
      },
      {
        heading: 'Why Fans Change Everything',
        paragraphs: [
          `No matter how full the schedule is, meeting fans changes the energy of the day immediately. A message, a smile, a letter, a piece of fan art, or one sentence about how a character stayed with someone can shift something inside me. Those moments remind me that the work keeps traveling after we finish making it.`,
          `Promotion days can be exhausting, but they are also a privilege. They remind me that storytelling is a circle. We create from one place, but the story becomes complete only when it reaches people and begins to live in their memories. That is why I never take those interactions lightly.`,
          `When the day finally ends and the makeup comes off, I usually feel two things at once: fatigue and gratitude. The schedule may be intense, but so is the joy of still getting to do work that challenges me and connects me to so many people.`
        ]
      }
    ],
    discussionQuestion:
      'What part of a promotion day would you love to see more of from me: glam prep, interviews, the quiet in-between moments, or fan interactions?',
    hashtags: ['#MoviePromotions', '#SamanthaRuthPrabhu', '#BehindTheScenes', '#WellnessOnTheGo', '#FanLove']
  },
  {
    id: 'seed-fitness-journey',
    title: 'My Fitness Journey: Then Vs Now',
    summary:
      'My relationship with fitness has changed from pressure and appearance-driven goals to strength, recovery, self-respect, and long-term balance.',
    coverImage: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748295799/5_6185746542628962570_c68nyo.jpg',
    publishedAt: '2026-04-16T09:00:00+05:30',
    isPublished: true,
    sections: [
      {
        heading: 'When Fitness Felt Like Pressure',
        paragraphs: [
          `There was a phase in my life when fitness was deeply tied to appearance. I wanted visible results quickly, and I thought discipline meant pushing harder even when my body was already asking for something gentler. That mindset is more common than we admit. We celebrate extremes so loudly that we sometimes forget to ask whether they are actually sustainable.`,
          `Back then, I was more likely to measure progress by the mirror or by how close I felt to some impossible standard. I confused exhaustion with achievement. If I was completely drained, I assumed I had done enough. Looking back, I can see how much of that came from pressure rather than care.`,
          `At some point I had to ask a better question. Not how do I change my body faster, but how do I support my body better? That one shift changed the meaning of fitness for me.`
        ]
      },
      {
        heading: 'What Strength Means To Me Now',
        quote: 'Strength feels different when it comes from self-respect instead of self-criticism.',
        paragraphs: [
          `These days fitness is less about shrinking or proving and more about building trust. I want to feel strong when I wake up, steady through a long workday, and resilient enough to recover well. That has changed the way I train, the way I eat, and the way I speak to myself.`,
          `I still love discipline, but I no longer believe that every workout has to leave me shattered to count. Some days strength training feels right. Some days mobility work, walking, or slower movement is exactly what my system needs. I have become much more interested in consistency than intensity.`,
          `That change has brought freedom. When fitness is rooted in care, it begins to support your life instead of competing with it.`
        ]
      },
      {
        heading: 'Listening To The Body Is Part Of Training',
        paragraphs: [
          `One of the biggest lessons movement has taught me is that the body is always communicating. Earlier in my journey, I did not listen very well. If I was tired, I pushed through. If I was under-recovered, I told myself to be tougher. Now I understand that real strength includes the ability to pause.`,
          `Rest is not laziness. Recovery is not weakness. Sleep, hydration, nourishment, and good form are not side notes. They are part of the work. I think this matters even more when life is busy, because those are exactly the moments when our bodies need us to be honest.`,
          `I also see fitness much more clearly as a mental health practice now. Some workouts build muscle, but some rebuild trust. Some sessions help me process noise, reconnect with myself, and feel calm again. That part of the journey is just as important as anything visible.`
        ]
      },
      {
        heading: 'If You Are Beginning Again',
        quote: 'The strongest version of you may not be the one that trains the hardest. It may be the one that listens best.',
        paragraphs: [
          `Food has changed alongside fitness for me too. I care more about energy, recovery, balance, and how I actually feel than about rigid rules. I want meals that support my day, not a constant internal argument about whether I have earned them.`,
          `If you are returning to movement after burnout, heartbreak, illness, a long pause, or simply a difficult season, I want to say this gently: you do not need to earn your way back into wellness. Start honestly. Start with what your body can receive today.`,
          `I think kindness is an underrated fitness tool. It is much easier to stay consistent with routines that do not make you feel at war with yourself.`
        ]
      }
    ],
    discussionQuestion:
      'Has your definition of fitness changed over time? I would love to know what feeling healthy means to you now.',
    hashtags: ['#FitnessJourney', '#Wellness', '#SelfCare', '#StrengthAndGrace', '#SamanthaRuthPrabhu']
  },
  {
    id: 'seed-family-man-2',
    title: 'Behind The Scenes Of The Family Man 2',
    summary:
      'The Family Man 2 challenged me emotionally and creatively, and it reminded me that the most meaningful roles often begin where comfort ends.',
    coverImage: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748296812/SRP_q8wmpl.jpg',
    publishedAt: '2026-04-14T09:00:00+05:30',
    isPublished: true,
    sections: [
      {
        heading: 'Why The Role Stayed With Me',
        paragraphs: [
          `Some roles ask you to perform. Others ask you to transform. The Family Man 2 felt very much like the second kind for me. What drew me in first was the complexity of the character. I have always been interested in people who cannot be explained in a single line, because real human beings are almost never that simple.`,
          `From the beginning, I knew this role would require me to leave behind comfort, familiarity, and vanity. It was not something I could approach from the surface. I had to listen carefully, prepare deeply, and be willing to stay in emotionally difficult spaces for longer than usual.`,
          `That was intimidating, but it was also exactly what made the project exciting. I value roles that ask more of me than I first think I can give.`
        ]
      },
      {
        heading: 'Preparation Was Emotional As Much As Physical',
        quote: 'Some characters visit you. Others move in for a while.',
        paragraphs: [
          `People often ask first about the physical transformation behind intense work, and yes, that is one part of the process. The body carries so much information on screen. But for me the more demanding preparation on this project was emotional. I spent a lot of time thinking about tension, survival, isolation, and what happens when pain and purpose live together inside one person.`,
          `I did not want to judge the character or try to simplify her. I wanted to understand her rhythms, her silence, and the emotional weather she carried. That meant surrendering to the discomfort of not always being able to explain everything neatly.`,
          `Projects like this also teach you to let go of polish. Truth is always more powerful than perfection, especially in stories that depend on inner turbulence.`
        ]
      },
      {
        heading: 'The Gift Of Collaboration',
        paragraphs: [
          `One of the biggest strengths of the experience was the environment on set. When the material is layered and intense, trust matters so much. Working with directors who understand tone, pace, and emotional ambiguity gives an actor enormous confidence. Clear direction does not limit you. It steadies you.`,
          `I also came away with even more respect for collaboration. Performances may be discussed individually, but they are built collectively. The energy of the set, the focus of the crew, the generosity of co-actors, the patience required to find the right note in a scene, all of that shapes the final work in ways the audience may never fully see.`,
          `The strongest creative rooms are the ones where everyone is protecting the same thing: honesty. I felt that deeply on this project.`
        ]
      },
      {
        heading: 'What The Response Meant To Me',
        quote: 'You cannot keep opening emotional doors without learning how to close them gently too.',
        paragraphs: [
          `Emotionally demanding work also asks for recovery. That is something I think more actors should speak about openly. A role may end when the day wraps, but your nervous system does not always switch off so neatly. Rest, quiet, movement, and decompression became a real part of the process for me.`,
          `When the series released and I started hearing from audiences, I felt relief, gratitude, and a lot of emotion. Taking creative risks always comes with vulnerability. You hope people will understand what you were trying to do. You hope the work lands in the spirit it was made.`,
          `What moved me most was hearing from viewers who said they had seen a different side of me as an actor. Growth is one of the things I value most in my career, and this project reminded me that fear is not always a warning. Sometimes it is an invitation.`
        ]
      }
    ],
    discussionQuestion:
      'If you watched The Family Man 2, what was the one moment or layer of the performance that stayed with you most?',
    hashtags: ['#TheFamilyMan2', '#BehindTheScenes', '#ActingJourney', '#SamanthaRuthPrabhu', '#Storytelling']
  },
  {
    id: 'seed-pratyusha-visit',
    title: 'Visiting The Pratyusha Foundation Center',
    summary:
      'Foundation visits always bring me back to what matters, because compassion is not performance. It is presence, listening, and follow-through.',
    coverImage: 'assets/images/philanthropy/samantha-pratyusha.png',
    publishedAt: '2026-04-12T09:00:00+05:30',
    isPublished: true,
    sections: [
      {
        heading: 'Why These Visits Matter To Me',
        paragraphs: [
          `Some visits stay with you long after you leave the room. Spending time at the Pratyusha Foundation center is always that kind of experience for me. The minute I step into a space built around care, the noise of schedules, deadlines, and appearances begins to soften. What remains are people, stories, needs, resilience, and love.`,
          `That is one of the reasons this work matters so deeply to me. It keeps me connected to life outside the bubble of visibility. It reminds me that compassion is not a caption, a photograph, or a passing emotional moment. It is attention. It is consistency. It is choosing to stay present long enough for another person's reality to become real to you.`,
          `I think service becomes most meaningful when it stops being about how helping makes us look and starts becoming about what other people actually need.`
        ]
      },
      {
        heading: 'The Energy Inside The Center',
        quote: 'Service becomes meaningful when it stops being about us.',
        paragraphs: [
          `What struck me most during the visit was the warmth in the room. Not perfection. Not performance. Warmth. You could feel it in the way the team greeted families, in the details of the space, and in the gentle dignity built into everyday care.`,
          `I spent time listening to caregivers, speaking with the team, and observing the quiet strength that lives inside community work. These spaces hold so many emotions at once: hope, fatigue, determination, humor, gratitude, and worry. That complexity is exactly why they deserve our full attention.`,
          `The most powerful moments are rarely the loudest ones. They are often the quieter exchanges that remind you how much courage exists in ordinary days.`
        ]
      },
      {
        heading: 'The Stories That Stay With Me',
        paragraphs: [
          `A child warming up slowly and then smiling. A caregiver speaking with equal parts exhaustion and dignity. A volunteer saying, very simply, that they just want people to feel seen. Those are the moments that do not leave quickly, and they should not.`,
          `There is a temptation online to reduce charity work to one inspiring photograph and one hopeful line. But real support is always more layered than that. It requires systems, patience, resources, follow-up, empathy, and long-term commitment. It asks us to listen before we decide what help should look like.`,
          `Every time I visit, I leave with even more respect for the people who do this work every single day. They are the heartbeat of impact, and they deserve so much more recognition than they usually receive.`
        ]
      },
      {
        heading: 'Turning Emotion Into Action',
        quote: 'Hope is often carried by ordinary people doing extraordinary things consistently.',
        paragraphs: [
          `I never want a foundation visit to end at emotion alone. Emotion can open the heart, but action is what carries that feeling into the world. So I always leave asking myself what was learned, what is urgently needed, and how support can be offered in a way that is actually useful.`,
          `Support can absolutely be financial, but it can also be volunteering, advocacy, consistency, visibility, and responsible conversation. Sometimes meaningful help begins with refusing to look away from a challenge simply because it is complicated.`,
          `To everyone who supports this work in any form, thank you. Communities are strengthened by many hands, many forms of care, and many people who choose to keep showing up.`
        ]
      }
    ],
    discussionQuestion:
      'What is one cause close to your heart, and how do you think all of us can support it more thoughtfully and consistently?',
    hashtags: ['#PratyushaFoundation', '#CommunityCare', '#GiveBack', '#CompassionInAction', '#SamanthaRuthPrabhu']
  },
  {
    id: 'seed-throwback-thursday',
    title: 'What #ThrowbackThursday Means To Me',
    summary:
      'Throwbacks are not just about how life looked. They are reminders of who we were becoming, what we survived, and how far the journey has brought us.',
    coverImage: 'https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748008412/DSC_9143-1_ayf7fl.jpg',
    publishedAt: '2026-04-10T09:00:00+05:30',
    isPublished: true,
    sections: [
      {
        heading: 'Every Old Photograph Holds Two Stories',
        paragraphs: [
          `There is something special about an old photograph. Not because it freezes time, but because it brings it back in layers. A picture can return you to a set, a season, a friendship, an early dream, or a version of yourself that was still learning how to belong.`,
          `That is why #ThrowbackThursday has always felt like more than a trend to me. When I look at an old picture, I do not just see the hairstyle, the outfit, the location, or the year. I also wonder what I was carrying emotionally that day. What was I hoping for? What had I not yet learned? Who was walking beside me then?`,
          `That second story, the invisible one beneath the image, is the part of nostalgia that moves me most now.`
        ]
      },
      {
        heading: 'Looking Back At My Journey',
        quote: 'A throwback is never just about how things looked. It is about who we were becoming.',
        paragraphs: [
          `When I look back at older moments from my career, I feel many things at once: affection, pride, tenderness, and sometimes surprise. There is a kind of innocence in the beginning of any journey. You are working hard, hoping to grow, and learning in public whether you are ready or not.`,
          `Old photographs often make growth visible in a way daily life does not. We do not always notice ourselves becoming stronger, calmer, wiser, or more certain of our voice while it is happening. Then one day a photograph from years ago appears, and suddenly the distance becomes clear.`,
          `I think that is why I feel grateful for every version of myself that kept going, even when she had no idea what was ahead.`
        ]
      },
      {
        heading: 'Why Honest Nostalgia Matters',
        paragraphs: [
          `I also do not want to romanticize every past version of myself. Some old photos represent seasons that were more complicated than they appeared from the outside. There are smiles that were real, but incomplete. There are glamorous moments that existed alongside fatigue, uncertainty, or private questions I had not yet learned how to name.`,
          `Looking back honestly does not reduce the beauty of memory. It deepens it. Nostalgia becomes far more meaningful when it includes truth instead of perfection. Sometimes the bravest thing a throwback can reveal is how far healing has come.`,
          `That perspective has changed the way I share old moments. I am less interested in presenting the past as flawless and more interested in honoring it as context.`
        ]
      },
      {
        heading: 'Why I Love Sharing Throwbacks With You',
        quote: 'Sometimes the bravest thing a throwback can show us is how far healing has come.',
        paragraphs: [
          `One of the loveliest parts of sharing throwbacks is seeing how all of you respond. A single image can open up a flood of memory from people who remember a film, a scene, a costume, a song, or even a specific expression from years ago. I love that because it reminds me that memory is not always a solo experience.`,
          `Sometimes you remember details I had forgotten completely. Sometimes your stories turn one old photo into a shared conversation about where all of us were in that chapter of life. That makes these posts feel less like archives and more like bridges.`,
          `For me, #ThrowbackThursday is a small ritual of gratitude. It is my way of pausing in the rush of what comes next and saying thank you to the road that got me here.`
        ]
      }
    ],
    discussionQuestion:
      'What kind of throwback would you love to see more of from me: early career moments, old set memories, travel diaries, festival celebrations, or personal candid photos?',
    hashtags: ['#ThrowbackThursday', '#Memories', '#CareerJourney', '#Gratitude', '#SamanthaRuthPrabhu']
  }
];
