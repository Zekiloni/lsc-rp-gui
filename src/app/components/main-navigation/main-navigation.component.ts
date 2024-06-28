import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
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
import { setAccount, setAuthenticated } from '../../stores/account/account.actions';
import { LocalStorageService, StorageItemKey } from '../../core/service/local-storage.service';
import { environment } from '../../../environments/environment';
import { DiscordApiService } from '../../core/api/discordApi.service';
import { map } from 'rxjs';

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
   providers: [DialogService, LocalStorageService, DiscordApiService],
   templateUrl: './main-navigation.component.html',
   styleUrl: './main-navigation.component.scss',
})
export class MainNavigationComponent implements OnInit, OnDestroy {
   mainNavItems: MenuItem[] | undefined;
   accountNavItems: MenuItem[] | undefined;

   userAccount$ = this.store.select(selectAccount);

   authDialogRef: DynamicDialogRef | undefined;

   constructor(
      @Inject(Store) private store: Store,
      private discordApiService: DiscordApiService,
      private localStorageService: LocalStorageService,
      private dialogService: DialogService,
      private router: Router,
   ) {
   }

   ngOnInit() {
      this.mainNavItems = [
         {
            label: 'Početna',
            icon: 'pi pi-fw pi-home',
            routerLink: '/',
         },
         {
            label: 'O nama',
            icon: 'pi pi-fw pi-info-circle',
            routerLink: '/about',
         },
         {
            label: 'Forum',
            icon: 'pi pi-fw pi-comments',
            url: environment.forumUrl,
         },
         {
            label: 'Discord',
            icon: 'pi pi-fw pi-discord',
            command: () => this.inviteToDiscord(),
         },
      ];

      this.userAccount$.pipe(
         map(account => account ? account!.admin : 0))
         .subscribe(admin => {
            this.accountNavItems = [
               {
                  label: 'Navigacija',
                  items: [
                     {
                        label: 'User Control Panel',
                        icon: 'pi pi-user',
                        routerLink: 'ucp',
                     },

                     ...(admin > 0 ? [{
                        label: 'Admin Panel',
                        icon: 'pi pi-shield',
                        routerLink: 'admin',
                     }] : []),
                  ],
               },
               {
                  label: 'Opcije',
                  items: [
                     {
                        label: 'Podešavanja računa',
                        icon: 'pi pi-cog',
                        routerLink: '/settings',
                     },
                     {
                        label: 'Odjavi se',
                        icon: 'pi pi-sign-out',
                        command: () => this.logout(),
                     },
                  ],
               },
            ];
         });
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
      this.authDialogRef = this.dialogService.open(AuthModalComponent, {
         header: 'Authorization',
      });

      this.authDialogRef.onClose.subscribe({
         next: (response?: true) => {
            if (response) {
               this.router.navigate(['ucp']);
            }
         },
      });
   }

   private inviteToDiscord() {
      return this.discordApiService.getDiscordServer().subscribe({
         next: (response) => {

            window.open(response.instant_invite);
         },
      });
   }
}
