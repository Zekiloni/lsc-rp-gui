import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';

import { AuthModalComponent } from '../auth-modal';

@Component({
   selector: 'app-main-navigation',
   standalone: true,
   imports: [MenubarModule, ButtonModule, AuthModalComponent],
   templateUrl: './main-navigation.component.html',
   styleUrl: './main-navigation.component.scss',
})
export class MainNavigationComponent implements OnInit {
   isAuthModalActive: boolean = false;
   items: MenuItem[] | undefined;

   ngOnInit() {
      this.items = [
         {
            label: 'Home',
            icon: 'pi pi-fw pi-home',
            routerLink: '',
         },
         {
            label: 'About',
            icon: 'pi pi-fw pi-info-circle',
            routerLink: '/about',
         },
         {
            label: 'Forum',
            icon: 'pi pi-fw pi-comments',
            routerLink: '/forum',
         },
      ];
   }

   toggleAuthModal() {
      this.isAuthModalActive = !this.isAuthModalActive;
   }
}
