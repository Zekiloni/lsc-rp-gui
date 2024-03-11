import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { AuthModalComponent } from '../auth-modal';
import { Router } from '@angular/router';

@Component({
   selector: 'app-main-navigation',
   standalone: true,
   imports: [MenubarModule, ButtonModule, AuthModalComponent],
   providers: [DialogService],
   templateUrl: './main-navigation.component.html',
   styleUrl: './main-navigation.component.scss',
})
export class MainNavigationComponent implements OnInit, OnDestroy {
   items: MenuItem[] | undefined;

   authDialogRef: DynamicDialogRef | undefined;

   constructor(private dialogService: DialogService, private router: Router) {}

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

   ngOnDestroy(): void {
      if (this.authDialogRef) {
         this.authDialogRef.close();
      }
   }

   toggleAuthentication() {
      this.authDialogRef = this.dialogService.open(AuthModalComponent, {});

      this.authDialogRef.onClose.subscribe({
         next: (response?: true) => {
            if (response) {
               this.router.navigate(['ucp']);
            }
         },
      });
   }
}
