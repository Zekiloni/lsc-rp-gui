import {
   ChangeDetectorRef,
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
   providers: [DialogService],
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
      private dialogService: DialogService,
      private router: Router
   ) {}

   ngOnInit() {
      this.mainNavItems = [
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

      this.accNavItems = [
         {
            label: 'Options',
            items: [
               {
                  label: 'Update',
                  icon: 'pi pi-refresh',
                  command: () => {},
               },
               {
                  label: 'Logout',
                  icon: 'pi pi-sign-out',
                  command: () => this.logout,
               },
            ],
         },
         {
            label: 'Navigate',
            items: [
               {
                  label: 'Angular',
                  icon: 'pi pi-external-link',
                  url: 'http://angular.io',
               },
               {
                  label: 'Router',
                  icon: 'pi pi-upload',
                  routerLink: '/fileupload',
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
