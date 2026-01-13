import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  // Login routes (completely separate)
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login | Samantha Ruth Prabhu'
  },

  // Main layout for public pages
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent),
        title: 'Samantha Ruth Prabhu | Official Website'
      },
      {
        path: 'about',
        loadComponent: () => import('./pages/about/about.component').then(c => c.AboutComponent),
        title: 'About | Samantha Ruth Prabhu'
      },
      {
        path: 'filmography',
        loadComponent: () => import('./pages/filmography/filmography.component').then(c => c.FilmographyComponent),
        title: 'Filmography | Samantha Ruth Prabhu'
      },
      {
        path: 'awards',
        loadComponent: () => import('./pages/awards/awards.component').then(c => c.AwardsComponent),
        title: 'Awards & Milestones | Samantha Ruth Prabhu'
      },
      {
        path: 'philanthropy',
        loadComponent: () => import('./pages/philanthropy/philanthropy.component').then(c => c.PhilanthropyComponent),
        title: 'Philanthropy | Samantha Ruth Prabhu'
      },
      {
        path: 'fashion',
        loadComponent: () => import('./pages/fashion/fashion.component').then(c => c.FashionComponent),
        title: 'Fashion & Style | Samantha Ruth Prabhu'
      },
      {
        path: 'gallery',
        loadComponent: () => import('./pages/gallery/gallery.component').then(c => c.GalleryComponent),
        title: 'Gallery | Samantha Ruth Prabhu'
      },
      {
        path: 'media',
        loadComponent: () => import('./pages/media/media.component').then(c => c.MediaComponent),
        title: 'Media & Press | Samantha Ruth Prabhu'
      },
      {
        path: 'contact',
        loadComponent: () => import('./pages/contact/contact.component').then(c => c.ContactComponent),
        title: 'Contact | Samantha Ruth Prabhu'
      }
    ]
  },

  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];