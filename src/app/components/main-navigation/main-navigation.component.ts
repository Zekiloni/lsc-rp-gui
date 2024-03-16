import {
   Component,
   Inject,
   OnDestroy,
   OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MenuModule } from 'primeng/menu';

import { AuthModalComponent } from '../auth-modal';
import { Store } from '@ngrx/store';
import { selectAccount } from '../../stores/account/account.selector';
import { AsyncPipe, NgIf } from '@angular/common';
import {
   setAccount,
   setAuthenticated,
} from '../../stores/account/account.actions';
import { LocalStorageService, StorageItemKey } from '../../core/service/local-storage.service';

@Component({
   selector: 'app-main-navigation',
   standalone: true,
   imports: [
      MenuModule,
      MenubarModule,
      ButtonModule,
      AuthModalComponent,
      NgIf,
      AsyncPipe,
   ],
   providers: [DialogService, LocalStorageService],
   templateUrl: './main-navigation.component.html',
   styleUrl: './main-navigation.component.scss',
})
export class MainNavigationComponent implements OnInit, OnDestroy {
   mainNavItems: MenuItem[] | undefined;
   accNavItems: MenuItem[] | undefined;

   userAccount$ = this.store.select(selectAccount);

   authDialogRef: DynamicDialogRef | undefined;

   constructor(
      @Inject(Store) private store: Store,
      private localStorageService: LocalStorageService,
      private dialogService: DialogService,
      private router: Router,
   ) {
   }

   ngOnInit() {
      this.mainNavItems = [
         {
            label: 'Home',
            icon: 'pi pi-fw pi-home',
            routerLink: '/',
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
         {
            label: 'Discord',
            icon: 'pi pi-fw pi-discord',
            routerLink: '',
         }
      ];

      this.accNavItems = [
         {
            label: 'Navigate',
            items: [
               {
                  label: 'Dashboard',
                  icon: 'pi pi-table',
                  routerLink: 'dashboard',
               },
            ],
         },
         {
            label: 'Options',
            items: [
               {
                  label: 'Settings',
                  icon: 'pi pi-cog',
                  routerLink: '/settings',
               },
               {
                  label: 'Logout',
                  icon: 'pi pi-sign-out',
                  command: () => this.logout(),
               },
            ],
         },
      ];
   }

   ngOnDestroy(): void {
      if (this.authDialogRef) {
         this.authDialogRef.close();
      }
   }

   logout() {
      this.store.dispatch(setAccount({ account: null }));
      this.store.dispatch(setAuthenticated({ isAuthenticated: false }));
      this.localStorageService.delete(StorageItemKey.AccessToken);
      this.router.navigate(['/']);
   }

   toggleAuthentication() {
      this.authDialogRef = this.dialogService.open(AuthModalComponent, {});

      this.authDialogRef.onClose.subscribe({
         next: (response?: true) => {
            if (response) {
               this.router.navigate(['dashboard']);
            }
         },
      });
   }
}
