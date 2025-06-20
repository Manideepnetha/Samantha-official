import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-blank-layout',
  standalone: true,
  imports: [RouterModule],
  template: `
    <router-outlet></router-outlet>
  `
})
export class BlankLayoutComponent {} 