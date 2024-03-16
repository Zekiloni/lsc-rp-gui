import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainNavigationComponent } from '../../components/main-navigation';

@Component({
   selector: 'app-main-layout',
   standalone: true,
   imports: [MainNavigationComponent, RouterOutlet],
   templateUrl: './main-layout.component.html',
   styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {}
