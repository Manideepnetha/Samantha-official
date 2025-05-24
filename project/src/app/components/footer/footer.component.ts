import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="bg-charcoal dark:bg-deep-black text-ivory py-12">
      <div class="container mx-auto px-4 md:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Logo & About -->
          <div class="space-y-4">
            <h3 class="font-playfair text-2xl font-bold text-royal-gold">Samantha Ruth Prabhu</h3>
            <p class="text-sm opacity-80">Official website of Indian actress, philanthropist, and entrepreneur.</p>
            <div class="flex space-x-4 pt-2">
              <a href="https://instagram.com/samantharuthprabhuoffl" target="_blank" class="text-ivory hover:text-royal-gold transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://twitter.com/samanthaprabhu2" target="_blank" class="text-ivory hover:text-royal-gold transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.036 10.036 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/share/1BfbgU1yKq/" target="_blank" class="text-ivory hover:text-royal-gold transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a href="https://youtube.com/@samanthaofficial?si=bqXC1Es5AkFHxBAV" target="_blank" class="text-ivory hover:text-royal-gold transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="font-playfair text-lg font-bold text-royal-gold mb-4">Quick Links</h4>
            <ul class="space-y-2">
              <li><a routerLink="/about" class="text-sm text-ivory hover:text-royal-gold transition-colors">About</a></li>
              <li><a routerLink="/filmography" class="text-sm text-ivory hover:text-royal-gold transition-colors">Filmography</a></li>
              <li><a routerLink="/gallery" class="text-sm text-ivory hover:text-royal-gold transition-colors">Gallery</a></li>
              <li><a routerLink="/philanthropy" class="text-sm text-ivory hover:text-royal-gold transition-colors">Philanthropy</a></li>
              <li><a routerLink="/contact" class="text-sm text-ivory hover:text-royal-gold transition-colors">Contact</a></li>
            </ul>
          </div>

          <!-- Legal -->
          <div>
            <h4 class="font-playfair text-lg font-bold text-royal-gold mb-4">Legal</h4>
            <ul class="space-y-2">
              <li><a href="#" class="text-sm text-ivory hover:text-royal-gold transition-colors">Privacy Policy</a></li>
              <li><a href="#" class="text-sm text-ivory hover:text-royal-gold transition-colors">Terms of Use</a></li>
              <li><a href="#" class="text-sm text-ivory hover:text-royal-gold transition-colors">Copyright Notice</a></li>
              <li><a href="#" class="text-sm text-ivory hover:text-royal-gold transition-colors">Cookie Policy</a></li>
            </ul>
          </div>

          <!-- Newsletter -->
          <div>
            <h4 class="font-playfair text-lg font-bold text-royal-gold mb-4">Stay Updated</h4>
            <p class="text-sm opacity-80 mb-4">Subscribe to receive updates about Samantha's latest projects and events.</p>
            <form class="space-y-2">
              <input 
                type="email" 
                placeholder="Your email" 
                class="w-full px-3 py-2 bg-ivory/10 border border-ivory/20 rounded text-ivory focus:border-royal-gold focus:ring-1 focus:ring-royal-gold outline-none transition-all" 
              />
              <button type="submit" class="w-full bg-royal-gold text-deep-black font-medium py-2 px-4 rounded hover:bg-royal-gold/80 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <!-- Bottom Section -->
        <div class="mt-12 pt-8 border-t border-ivory/10 flex flex-col md:flex-row justify-between items-center">
          <p class="text-sm opacity-70 text-center md:text-left mb-4 md:mb-0">
            © 2025 Samantha Ruth Prabhu Website. All rights reserved.
          </p>
          <p class="text-sm opacity-70">
            Website designed with 💖 for Samantha
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent {}