import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, LoginComponent, MainLayoutComponent],
  template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'Samantha Ruth Prabhu';
}