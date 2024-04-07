import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
   selector: 'app-not-found-page',
   standalone: true,
   imports: [
      ButtonModule,
      RippleModule,
   ],
   templateUrl: './not-found-page.component.html',
   styleUrl: './not-found-page.component.scss',
})
export class NotFoundPageComponent {

   constructor(private router: Router, private location: Location) {
   }

   goToDashboard() {
      this.router.navigate(['ucp']);
   }

   goBack() {
      this.location.back();
   }
}
