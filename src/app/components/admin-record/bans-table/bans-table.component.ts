import { Component, Input, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { catchError, map, of, startWith } from 'rxjs';
import { BanApiService } from '../../../core/api/api';
import { Ban } from '../../../core/model/ban';

@Component({
   selector: 'app-bans-table',
   standalone: true,
   imports: [
      TableModule,
      AsyncPipe,
      DatePipe,
      NgIf,
   ],
   providers: [
      BanApiService,
   ],
   templateUrl: './bans-table.component.html',
   styleUrl: './bans-table.component.scss',
})
export class BansTableComponent implements OnInit {
   @Input() accountId!: number;

   bans: Ban[] | undefined;

   constructor(private banApiService: BanApiService) {}

   ngOnInit(): void {
      this.banApiService.listAccountBans(this.accountId).pipe(
         startWith([]),  // Start with an empty array
         catchError(() => of([])),  // Handle errors by emitting an empty array
         map(bans => bans || [])  // Ensure bans is never null
      ).subscribe(
         bans => this.bans = bans,
         error => console.error('Error loading bans:', error)
      );
   }
}
