import { Component, Input, OnInit } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { SharedModule } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { catchError, map, of, startWith } from 'rxjs';
import { Kick } from '../../../core/model/kick';
import { KickApiService } from '../../../core/api/kickApi.service';

@Component({
   selector: 'app-kicks-table',
   standalone: true,
   imports: [
      DatePipe,
      NgIf,
      SharedModule,
      TableModule,
   ],
   providers: [KickApiService],
   templateUrl: './kicks-table.component.html',
   styleUrl: './kicks-table.component.scss',
})
export class KicksTableComponent implements OnInit {
   @Input() accountId!: number;

   kicks: Kick[] | undefined;

   constructor(private kickApiService: KickApiService) {
   }

   ngOnInit(): void {
      this.kickApiService.listAccountKicks(this.accountId).pipe(
         startWith([]),  // Start with an empty array
         catchError(() => of([])),  // Handle errors by emitting an empty array
         map(bans => bans || []),  // Ensure bans is never null
      ).subscribe(
         kicks => this.kicks = kicks,
         error => console.error('Error loading kicks:', error),
      );
   }
}
