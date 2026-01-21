import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ManageMoviesComponent } from './pages/manage-movies/manage-movies.component';
import { authGuard } from './auth.guard';

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent, title: 'Dashboard | Admin Panel' },
            { path: 'movies', component: ManageMoviesComponent, title: 'Manage Movies | Admin Panel' },
            { path: 'awards', loadComponent: () => import('./pages/manage-awards/manage-awards.component').then(m => m.ManageAwardsComponent), title: 'Manage Awards | Admin Panel' },
            { path: 'philanthropy', loadComponent: () => import('./pages/manage-philanthropy/manage-philanthropy.component').then(m => m.ManagePhilanthropyComponent), title: 'Manage Philanthropy | Admin Panel' },
            { path: 'home', loadComponent: () => import('./pages/manage-home/manage-home.component').then(m => m.ManageHomeComponent), title: 'Manage Home | Admin Panel' },
            { path: 'fashion', loadComponent: () => import('./pages/manage-fashion/manage-fashion.component').then(m => m.ManageFashionComponent), title: 'Manage Fashion | Admin Panel' },
            { path: 'gallery', loadComponent: () => import('./pages/manage-gallery/manage-gallery.component').then(m => m.ManageGalleryComponent), title: 'Manage Gallery | Admin Panel' },
            { path: 'settings', loadComponent: () => import('./pages/manage-settings/manage-settings.component').then(m => m.ManageSettingsComponent), title: 'Manage Settings | Admin Panel' },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    }
];
