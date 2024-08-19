import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';

@Component({
   selector: 'app-admin-panel-page',
   standalone: true,
   imports: [
      CardModule,
      PanelMenuModule,
      MenuModule,
      ButtonModule,
   ],
   templateUrl: './admin-panel-page.component.html',
   styleUrl: './admin-panel-page.component.scss',
})
export class AdminPanelPageComponent {
   items: MenuItem[] = [
      {
         label: 'Dashboard',
         items: [
            {
               label: 'Početna',
               icon: 'pi pi-home',
               routerLink: '/admin',
            },
         ]
      },
      {
         label: 'Korisnički računi',
         icon: 'pi pi-user',
         items: [
            {
               label: 'Pretraga',
               icon: 'pi pi-search',
               routerLink: 'accounts',
            },
            {
               label: 'Pretraga Karaktera',
               icon: 'pi pi-search',
               routerLink: 'characters',
            },
            {
               label: 'Pending Karakteri',
               icon: 'pi pi-hourglass',
               routerLink: 'characters/pending',
            },
         ],
      },
      {
         label: 'Fakcije',
         icon: 'pi pi-users',
         items: [
            {
               label: 'Upload',
               icon: 'pi pi-cloud-upload',
            },
            {
               label: 'Download',
               icon: 'pi pi-cloud-download',
            },
            {
               label: 'Sync',
               icon: 'pi pi-refresh',
            },
         ],
      },
      {
         label: 'Logovi',
         icon: 'pi pi-file',
         items: [],
      },
   ];

   activeMenuItem: MenuItem = this.items[0];
}