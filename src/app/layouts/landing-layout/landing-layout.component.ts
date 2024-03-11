import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainNavigationComponent } from '../../components/main-navigation';

@Component({
   selector: 'app-landing-layout',
   standalone: true,
   imports: [MainNavigationComponent, RouterOutlet],
   templateUrl: './landing-layout.component.html',
   styleUrl: './landing-layout.component.scss',
})
export class LandingLayoutComponent {}
