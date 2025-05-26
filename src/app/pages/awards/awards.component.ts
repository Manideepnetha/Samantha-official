import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-awards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-ivory dark:bg-deep-black">
      <!-- Hero Section -->
      <section class="relative h-[50vh] overflow-hidden">
        <div class="absolute inset-0">
          <img 
            src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748038033/ad7ccf187002995.6580064d3e931_ajzyv5.jpg" 
            alt="Awards & Milestones" 
            class="w-full h-full object-cover object-[center_top_30%]" 
          />
          <div class="absolute inset-0 bg-gradient-to-b from-deep-black/80 to-deep-black/40"></div>
        </div>
        
        <div class="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
          <span class="inline-block text-royal-gold font-inter text-sm uppercase tracking-wider mb-2">Recognition</span>
          <h1 class="text-4xl md:text-6xl font-playfair font-bold text-ivory mb-6 text-shadow">Awards & Milestones</h1>
          <p class="text-xl md:text-2xl text-ivory/90 font-lora italic max-w-3xl">Celebrating moments of excellence and recognition throughout Samantha's illustrious career.</p>
        </div>
      </section>

      <!-- Awards Timeline -->
      <section class="py-20 bg-ivory dark:bg-deep-black">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- 2025 Awards -->
            <div class="relative pl-8 sm:pl-32 py-6 group">
              <div class="font-playfair text-2xl text-royal-gold font-bold mb-1 sm:mb-0 sm:absolute sm:left-0 sm:top-6">2025</div>
              <div class="absolute left-2 sm:left-20 top-0 h-full w-0.5 bg-royal-gold/30"></div>
              <div class="absolute left-0 sm:left-[4.5rem] top-8 w-6 h-6 bg-royal-gold rounded-full"></div>
              <div class="bg-white dark:bg-charcoal p-5 rounded-lg shadow-md hover-lift">
                <h3 class="font-playfair text-xl font-bold mb-2 text-charcoal dark:text-ivory">Vogue Power List - Power Performer of the Year</h3>
                <p class="text-charcoal/80 dark:text-ivory/80 mb-3">Featured in Vogue's elite list celebrating influential women in entertainment.</p>
                <blockquote class="border-l-4 border-royal-gold pl-4 italic text-charcoal/90 dark:text-ivory/90">
                  "An unstoppable force in cinema and beyond."
                </blockquote>
              </div>
            </div>

            <!-- 2024 Awards -->
            <div class="relative pl-8 sm:pl-32 py-6 group">
              <div class="font-playfair text-2xl text-royal-gold font-bold mb-1 sm:mb-0 sm:absolute sm:left-0 sm:top-6">2024</div>
              <div class="absolute left-2 sm:left-20 top-0 h-full w-0.5 bg-royal-gold/30"></div>
              <div class="absolute left-0 sm:left-[4.5rem] top-8 w-6 h-6 bg-royal-gold rounded-full"></div>
              <div class="bg-white dark:bg-charcoal p-5 rounded-lg shadow-md hover-lift">
                <h3 class="font-playfair text-xl font-bold mb-2 text-charcoal dark:text-ivory">IIFA Utsavam - Woman of the Year in Indian Cinema</h3>
                <p class="text-charcoal/80 dark:text-ivory/80 mb-3">Recognized for her contributions to Indian cinema.</p>
                <blockquote class="border-l-4 border-royal-gold pl-4 italic text-charcoal/90 dark:text-ivory/90">
                  "A testament to her enduring impact on the industry."
                </blockquote>
              </div>
            </div>

            <!-- 2023 Awards -->
            <div class="relative pl-8 sm:pl-32 py-6 group">
              <div class="font-playfair text-2xl text-royal-gold font-bold mb-1 sm:mb-0 sm:absolute sm:left-0 sm:top-6">2023</div>
              <div class="absolute left-2 sm:left-20 top-0 h-full w-0.5 bg-royal-gold/30"></div>
              <div class="absolute left-0 sm:left-[4.5rem] top-8 w-6 h-6 bg-royal-gold rounded-full"></div>
              <div class="bg-white dark:bg-charcoal p-5 rounded-lg shadow-md hover-lift">
                <h3 class="font-playfair text-xl font-bold mb-2 text-charcoal dark:text-ivory">Indian Film Festival Melbourne - Excellence in Cinema</h3>
                <p class="text-charcoal/80 dark:text-ivory/80 mb-3">Recognized for outstanding contribution to Indian cinema and breaking stereotypes.</p>
                <blockquote class="border-l-4 border-royal-gold pl-4 italic text-charcoal/90 dark:text-ivory/90">
                  "Cinema has the power to transform lives and challenge perspectives."
                </blockquote>
              </div>
            </div>

            <!-- 2022 Awards -->
            <div class="relative pl-8 sm:pl-32 py-6 group">
              <div class="font-playfair text-2xl text-royal-gold font-bold mb-1 sm:mb-0 sm:absolute sm:left-0 sm:top-6">2022</div>
              <div class="absolute left-2 sm:left-20 top-0 h-full w-0.5 bg-royal-gold/30"></div>
              <div class="absolute left-0 sm:left-[4.5rem] top-8 w-6 h-6 bg-royal-gold rounded-full"></div>
              <div class="bg-white dark:bg-charcoal p-5 rounded-lg shadow-md hover-lift">
                <h3 class="font-playfair text-xl font-bold mb-2 text-charcoal dark:text-ivory">Critics' Choice Award - Best Actress</h3>
                <p class="text-charcoal/80 dark:text-ivory/80 mb-3">For the powerful portrayal in "Yashoda" that showcased unprecedented versatility.</p>
                <blockquote class="border-l-4 border-royal-gold pl-4 italic text-charcoal/90 dark:text-ivory/90">
                  "Every role is an opportunity to push boundaries and discover new dimensions."
                </blockquote>
              </div>
            </div>

            <!-- 2021 Awards -->
            <div class="relative pl-8 sm:pl-32 py-6 group">
              <div class="font-playfair text-2xl text-royal-gold font-bold mb-1 sm:mb-0 sm:absolute sm:left-0 sm:top-6">2021</div>
              <div class="absolute left-2 sm:left-20 top-0 h-full w-0.5 bg-royal-gold/30"></div>
              <div class="absolute left-0 sm:left-[4.5rem] top-8 w-6 h-6 bg-royal-gold rounded-full"></div>
              <div class="bg-white dark:bg-charcoal p-5 rounded-lg shadow-md hover-lift">
                <h3 class="font-playfair text-xl font-bold mb-2 text-charcoal dark:text-ivory">Best Performance in a Series - Filmfare OTT Awards</h3>
                <p class="text-charcoal/80 dark:text-ivory/80 mb-3">For the groundbreaking role of Raji in "The Family Man 2" that redefined digital entertainment.</p>
                <blockquote class="border-l-4 border-royal-gold pl-4 italic text-charcoal/90 dark:text-ivory/90">
                  "Digital platforms have opened new avenues for storytelling and character exploration."
                </blockquote>
              </div>
            </div>

            <!-- 2020 Awards -->
            <div class="relative pl-8 sm:pl-32 py-6 group">
              <div class="font-playfair text-2xl text-royal-gold font-bold mb-1 sm:mb-0 sm:absolute sm:left-0 sm:top-6">2020</div>
              <div class="absolute left-2 sm:left-20 top-0 h-full w-0.5 bg-royal-gold/30"></div>
              <div class="absolute left-0 sm:left-[4.5rem] top-8 w-6 h-6 bg-royal-gold rounded-full"></div>
              <div class="bg-white dark:bg-charcoal p-5 rounded-lg shadow-md hover-lift">
                <h3 class="font-playfair text-xl font-bold mb-2 text-charcoal dark:text-ivory">Zee Cine Awards (Telugu) - Best Actress</h3>
                <p class="text-charcoal/80 dark:text-ivory/80 mb-3">Honored for her performance in Oh! Baby.</p>
                <blockquote class="border-l-4 border-royal-gold pl-4 italic text-charcoal/90 dark:text-ivory/90">
                  "A powerful blend of humor and emotion."
                </blockquote>
              </div>
            </div>

            <div class="relative pl-8 sm:pl-32 py-6 group">
              <div class="font-playfair text-2xl text-royal-gold font-bold mb-1 sm:mb-0 sm:absolute sm:left-0 sm:top-6">2020</div>
              <div class="absolute left-2 sm:left-20 top-0 h-full w-0.5 bg-royal-gold/30"></div>
              <div class="absolute left-0 sm:left-[4.5rem] top-8 w-6 h-6 bg-royal-gold rounded-full"></div>
              <div class="bg-white dark:bg-charcoal p-5 rounded-lg shadow-md hover-lift">
                <h3 class="font-playfair text-xl font-bold mb-2 text-charcoal dark:text-ivory">Zee Cine Awards (Telugu) - Best Actress</h3>
                <p class="text-charcoal/80 dark:text-ivory/80 mb-3">Awarded for her role in Majili.</p>
                <blockquote class="border-l-4 border-royal-gold pl-4 italic text-charcoal/90 dark:text-ivory/90">
                  "An emotionally stirring performance."
                </blockquote>
              </div>
            </div>

            <!-- 2019 Awards -->
            <div class="relative pl-8 sm:pl-32 py-6 group">
              <div class="font-playfair text-2xl text-royal-gold font-bold mb-1 sm:mb-0 sm:absolute sm:left-0 sm:top-6">2019</div>
              <div class="absolute left-2 sm:left-20 top-0 h-full w-0.5 bg-royal-gold/30"></div>
              <div class="absolute left-0 sm:left-[4.5rem] top-8 w-6 h-6 bg-royal-gold rounded-full"></div>
              <div class="bg-white dark:bg-charcoal p-5 rounded-lg shadow-md hover-lift">
                <h3 class="font-playfair text-xl font-bold mb-2 text-charcoal dark:text-ivory">SIIMA Awards - Critics Best Actress (Telugu)</h3>
                <p class="text-charcoal/80 dark:text-ivory/80 mb-3">Awarded for her outstanding performance in Rangasthalam.</p>
                <blockquote class="border-l-4 border-royal-gold pl-4 italic text-charcoal/90 dark:text-ivory/90">
                  "An unforgettable role with immense depth."
                </blockquote>
              </div>
            </div>

            <div class="relative pl-8 sm:pl-32 py-6 group">
              <div class="font-playfair text-2xl text-royal-gold font-bold mb-1 sm:mb-0 sm:absolute sm:left-0 sm:top-6">2019</div>
              <div class="absolute left-2 sm:left-20 top-0 h-full w-0.5 bg-royal-gold/30"></div>
              <div class="absolute left-0 sm:left-[4.5rem] top-8 w-6 h-6 bg-royal-gold rounded-full"></div>
              <div class="bg-white dark:bg-charcoal p-5 rounded-lg shadow-md hover-lift">
                <h3 class="font-playfair text-xl font-bold mb-2 text-charcoal dark:text-ivory">TV9 Nava Nakshatra Sanmanam - Best Actor (Female)</h3>
                <p class="text-charcoal/80 dark:text-ivory/80 mb-3">Honored for her roles in Rangasthalam, Mahanati, and Oh! Baby.</p>
                <blockquote class="border-l-4 border-royal-gold pl-4 italic text-charcoal/90 dark:text-ivory/90">
                  "A golden year of powerful performances."
                </blockquote>
              </div>
            </div>

            <!-- 2016 Awards -->
            <div class="relative pl-8 sm:pl-32 py-6 group">
              <div class="font-playfair text-2xl text-royal-gold font-bold mb-1 sm:mb-0 sm:absolute sm:left-0 sm:top-6">2016</div>
              <div class="absolute left-2 sm:left-20 top-0 h-full w-0.5 bg-royal-gold/30"></div>
              <div class="absolute left-0 sm:left-[4.5rem] top-8 w-6 h-6 bg-royal-gold rounded-full"></div>
              <div class="bg-white dark:bg-charcoal p-5 rounded-lg shadow-md hover-lift">
                <h3 class="font-playfair text-xl font-bold mb-2 text-charcoal dark:text-ivory">Filmfare Awards South - Best Actress (Telugu)</h3>
                <p class="text-charcoal/80 dark:text-ivory/80 mb-3">Awarded for her role in A Aa.</p>
                <blockquote class="border-l-4 border-royal-gold pl-4 italic text-charcoal/90 dark:text-ivory/90">
                  "A delightful performance that charmed audiences."
                </blockquote>
              </div>
            </div>

            <!-- 2014 Awards -->
            <div class="relative pl-8 sm:pl-32 py-6 group">
              <div class="font-playfair text-2xl text-royal-gold font-bold mb-1 sm:mb-0 sm:absolute sm:left-0 sm:top-6">2014</div>
              <div class="absolute left-2 sm:left-20 top-0 h-full w-0.5 bg-royal-gold/30"></div>
              <div class="absolute left-0 sm:left-[4.5rem] top-8 w-6 h-6 bg-royal-gold rounded-full"></div>
              <div class="bg-white dark:bg-charcoal p-5 rounded-lg shadow-md hover-lift">
                <h3 class="font-playfair text-xl font-bold mb-2 text-charcoal dark:text-ivory">SIIMA Awards - Critics Best Actress (Telugu)</h3>
                <p class="text-charcoal/80 dark:text-ivory/80 mb-3">Recognized for her performance in Manam.</p>
                <blockquote class="border-l-4 border-royal-gold pl-4 italic text-charcoal/90 dark:text-ivory/90">
                  "A nuanced role that showcased her acting prowess."
                </blockquote>
              </div>
            </div>

            <!-- 2013 Awards -->
            <div class="relative pl-8 sm:pl-32 py-6 group">
              <div class="font-playfair text-2xl text-royal-gold font-bold mb-1 sm:mb-0 sm:absolute sm:left-0 sm:top-6">2013</div>
              <div class="absolute left-2 sm:left-20 top-0 h-full w-0.5 bg-royal-gold/30"></div>
              <div class="absolute left-0 sm:left-[4.5rem] top-8 w-6 h-6 bg-royal-gold rounded-full"></div>
              <div class="bg-white dark:bg-charcoal p-5 rounded-lg shadow-md hover-lift">
                <h3 class="font-playfair text-xl font-bold mb-2 text-charcoal dark:text-ivory">SIIMA Awards - Best Actress (Telugu)</h3>
                <p class="text-charcoal/80 dark:text-ivory/80 mb-3">Honored for her role in Attarintiki Daredi.</p>
                <blockquote class="border-l-4 border-royal-gold pl-4 italic text-charcoal/90 dark:text-ivory/90">
                  "A performance that blended charm and depth."
                </blockquote>
              </div>
            </div>

            <!-- ===== 2012 Awards ===== -->
            <div class="relative pl-8 sm:pl-32 py-6 group">
              <div class="font-playfair text-2xl text-royal-gold font-bold mb-1 sm:mb-0 sm:absolute sm:left-0 sm:top-6">2012</div>
              <div class="absolute left-2 sm:left-20 top-0 h-full w-0.5 bg-royal-gold/30"></div>
              <div class="absolute left-0 sm:left-[4.5rem] top-8 w-6 h-6 bg-royal-gold rounded-full"></div>
              <div class="bg-white dark:bg-charcoal p-5 rounded-lg shadow-md hover-lift">
                <h3 class="font-playfair text-xl font-bold mb-2 text-charcoal dark:text-ivory">Filmfare Awards South - Best Actress (Telugu)</h3>
                <p class="text-charcoal/80 dark:text-ivory/80 mb-3">Awarded for her role in Eega.</p>
                <blockquote class="border-l-4 border-royal-gold pl-4 italic text-charcoal/90 dark:text-ivory/90">
                  "A transformative role showcasing her versatility."
                </blockquote>
              </div>
            </div>

            <div class="relative pl-8 sm:pl-32 py-6 group">
              <div class="font-playfair text-2xl text-royal-gold font-bold mb-1 sm:mb-0 sm:absolute sm:left-0 sm:top-6">2012</div>
              <div class="absolute left-2 sm:left-20 top-0 h-full w-0.5 bg-royal-gold/30"></div>
              <div class="absolute left-0 sm:left-[4.5rem] top-8 w-6 h-6 bg-royal-gold rounded-full"></div>
              <div class="bg-white dark:bg-charcoal p-5 rounded-lg shadow-md hover-lift">
                <h3 class="font-playfair text-xl font-bold mb-2 text-charcoal dark:text-ivory">Filmfare Awards South - Best Actress (Tamil)</h3>
                <p class="text-charcoal/80 dark:text-ivory/80 mb-3">Recognized for her performance in Neethaane En Ponvasantham.</p>
                <blockquote class="border-l-4 border-royal-gold pl-4 italic text-charcoal/90 dark:text-ivory/90">
                  "A heartfelt portrayal that resonated with many."
                </blockquote>
              </div>
            </div>

            <!-- ===== 2010 Awards ===== -->
            <div class="relative pl-8 sm:pl-32 py-6 group">
              <div class="font-playfair text-2xl text-royal-gold font-bold mb-1 sm:mb-0 sm:absolute sm:left-0 sm:top-6">2010</div>
              <div class="absolute left-2 sm:left-20 top-0 h-full w-0.5 bg-royal-gold/30"></div>
              <div class="absolute left-0 sm:left-[4.5rem] top-8 w-6 h-6 bg-royal-gold rounded-full"></div>
              <div class="bg-white dark:bg-charcoal p-5 rounded-lg shadow-md hover-lift">
                <h3 class="font-playfair text-xl font-bold mb-2 text-charcoal dark:text-ivory">Filmfare Awards South - Best Female Debut</h3>
                <p class="text-charcoal/80 dark:text-ivory/80 mb-3">Recognized for her debut performance in Ye Maaya Chesave.</p>
                <blockquote class="border-l-4 border-royal-gold pl-4 italic text-charcoal/90 dark:text-ivory/90">
                  "A stellar debut that marked the rise of a new star."
                </blockquote>
              </div>
            </div>

            <div class="relative pl-8 sm:pl-32 py-6 group">
              <div class="font-playfair text-2xl text-royal-gold font-bold mb-1 sm:mb-0 sm:absolute sm:left-0 sm:top-6">2010</div>
              <div class="absolute left-2 sm:left-20 top-0 h-full w-0.5 bg-royal-gold/30"></div>
              <div class="absolute left-0 sm:left-[4.5rem] top-8 w-6 h-6 bg-royal-gold rounded-full"></div>
              <div class="bg-white dark:bg-charcoal p-5 rounded-lg shadow-md hover-lift">
                <h3 class="font-playfair text-xl font-bold mb-2 text-charcoal dark:text-ivory">Nandi Awards - Special Jury Award</h3>
                <p class="text-charcoal/80 dark:text-ivory/80 mb-3">Honored for her performance in Ye Maaya Chesave.</p>
                <blockquote class="border-l-4 border-royal-gold pl-4 italic text-charcoal/90 dark:text-ivory/90">
                  "A performance that captivated audiences and critics alike."
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Awards Gallery -->
      <section class="py-20 bg-white dark:bg-charcoal">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl md:text-4xl font-playfair font-bold text-center text-charcoal dark:text-ivory mb-16">Award Gallery</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Card 1 -->
            <div class="relative group overflow-hidden rounded-lg hover-lift">
              <img src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249628/samantha-ritz-style-awards-2014-hq-012_mznaor.jpg" alt="Ritz Style Award" class="w-full aspect-[3/4] object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-deep-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <h3 class="font-playfair text-xl font-bold text-ivory mb-2">Ritz Style Award</h3>
                  <p class="text-ivory/90">2014</p>
                </div>
              </div>
            </div>

            <!-- Card 2 -->
            <div class="relative group overflow-hidden rounded-lg hover-lift">
              <img src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249626/Samantha_in_Pink_Saree_Photo_Gallery_5_ww73qx.jpg" alt="Pink Saree Event" class="w-full aspect-[3/4] object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-deep-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <h3 class="font-playfair text-xl font-bold text-ivory mb-2">Special Appearance</h3>
                  <p class="text-ivory/90">Pink Saree Event</p>
                </div>
              </div>
            </div>

            <!-- Card 3 -->
            <div class="relative group overflow-hidden rounded-lg hover-lift">
              <img src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249626/IMG_20160704_171051_sgdwig.jpg" alt="Award Ceremony" class="w-full aspect-[3/4] object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-deep-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <h3 class="font-playfair text-xl font-bold text-ivory mb-2">Award Ceremony</h3>
                  <p class="text-ivory/90">2016</p>
                </div>
              </div>
            </div>

            <!-- Card 4 -->
            <div class="relative group overflow-hidden rounded-lg hover-lift">
              <img src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249625/insta630823-___B6W1hyBB_p8___-_xtgwdh.jpg" alt="Instagram Event" class="w-full aspect-[3/4] object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-deep-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <h3 class="font-playfair text-xl font-bold text-ivory mb-2">Instagram Special</h3>
                  <p class="text-ivory/90">Fan Event</p>
                </div>
              </div>
            </div>

            <!-- Card 5 -->
            <div class="relative group overflow-hidden rounded-lg hover-lift">
              <img src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249624/images_3_16_fujcje.jpg" alt="Press Event" class="w-full aspect-[3/4] object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-deep-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <h3 class="font-playfair text-xl font-bold text-ivory mb-2">Press Event</h3>
                  <p class="text-ivory/90">2017</p>
                </div>
              </div>
            </div>

            <!-- Card 6 -->
            <div class="relative group overflow-hidden rounded-lg hover-lift">
              <img src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249621/images_3_13_szn72z.jpg" alt="Award Show" class="w-full aspect-[3/4] object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-deep-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <h3 class="font-playfair text-xl font-bold text-ivory mb-2">Award Show</h3>
                  <p class="text-ivory/90">2018</p>
                </div>
              </div>
            </div>

            <!-- Card 7 -->
            <div class="relative group overflow-hidden rounded-lg hover-lift">
              <img src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249611/DCVZboIUQAE5KAE_msxjzx.jpg" alt="Special Recognition" class="w-full aspect-[3/4] object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-deep-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <h3 class="font-playfair text-xl font-bold text-ivory mb-2">Special Recognition</h3>
                  <p class="text-ivory/90">2019</p>
                </div>
              </div>
            </div>

            <!-- Card 8 -->
            <div class="relative group overflow-hidden rounded-lg hover-lift">
              <img src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249610/BPpBBG8CYAAL16J_yrhmnj.jpg" alt="Special Award" class="w-full aspect-[3/4] object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-deep-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <h3 class="font-playfair text-xl font-bold text-ivory mb-2">Special Award</h3>
                  <p class="text-ivory/90">2020</p>
                </div>
              </div>
            </div>

            <!-- Card 9 -->
            <div class="relative group overflow-hidden rounded-lg hover-lift">
              <img src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249610/BLrxRoNCMAEKIY6_ywdro0.jpg" alt="Fashion Icon Award" class="w-full aspect-[3/4] object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-deep-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <h3 class="font-playfair text-xl font-bold text-ivory mb-2">Fashion Icon Award</h3>
                  <p class="text-ivory/90">2021</p>
                </div>
              </div>
            </div>

            <!-- Card 10 -->
            <div class="relative group overflow-hidden rounded-lg hover-lift">
              <img src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249610/behindwoods-gold-medals-2014_1438582220200_nojatw.jpg" alt="Behindwoods Gold Medal" class="w-full aspect-[3/4] object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-deep-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <h3 class="font-playfair text-xl font-bold text-ivory mb-2">Behindwoods Gold Medal</h3>
                  <p class="text-ivory/90">2014</p>
                </div>
              </div>
            </div>

            <!-- Card 11 -->
            <div class="relative group overflow-hidden rounded-lg hover-lift">
              <img src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249610/20230206_182208_zftdrl.jpg" alt="Recent Achievement" class="w-full aspect-[3/4] object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-deep-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <h3 class="font-playfair text-xl font-bold text-ivory mb-2">Recent Achievement</h3>
                  <p class="text-ivory/90">2023</p>
                </div>
              </div>
            </div>

            <!-- Card 12 -->
            <div class="relative group overflow-hidden rounded-lg hover-lift">
              <img src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249610/21242093_fw7vkl.jpg" alt="Award Ceremony" class="w-full aspect-[3/4] object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-deep-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <h3 class="font-playfair text-xl font-bold text-ivory mb-2">Award Ceremony</h3>
                  <p class="text-ivory/90">2022</p>
                </div>
              </div>
            </div>

            <!-- Card 13 -->
            <div class="relative group overflow-hidden rounded-lg hover-lift">
              <img src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249609/20230206_173648_ewtlvj.jpg" alt="Special Honor" class="w-full aspect-[3/4] object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-deep-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <h3 class="font-playfair text-xl font-bold text-ivory mb-2">Special Honor</h3>
                  <p class="text-ivory/90">2023</p>
                </div>
              </div>
            </div>

            <!-- Card 14 -->
            <div class="relative group overflow-hidden rounded-lg hover-lift">
              <img src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249609/20230206_173107_h3vlh8.jpg" alt="Achievement Award" class="w-full aspect-[3/4] object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-deep-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <h3 class="font-playfair text-xl font-bold text-ivory mb-2">Achievement Award</h3>
                  <p class="text-ivory/90">2023</p>
                </div>
              </div>
            </div>

            <!-- Card 15 -->
            <div class="relative group overflow-hidden rounded-lg hover-lift">
              <img src="https://res.cloudinary.com/dpnd6ve1e/image/upload/v1748249609/20230206_172356_lesaha.jpg" alt="Recognition Event" class="w-full aspect-[3/4] object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-deep-black/80 via-deep-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <h3 class="font-playfair text-xl font-bold text-ivory mb-2">Recognition Event</h3>
                  <p class="text-ivory/90">2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: []
})
export class AwardsComponent {}