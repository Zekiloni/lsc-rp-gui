import { Component, Input, OnInit } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { catchError, map, of, startWith } from 'rxjs';
import { SharedModule } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Warn } from '../../../core/model/warn';
import { WarnApiService } from '../../../core/api/warnApi.service';

@Component({
  selector: 'app-warns-table',
  standalone: true,
  imports: [
    DatePipe,
    NgIf,
    SharedModule,
    TableModule,
  ],
  providers: [WarnApiService],
  templateUrl: './warns-table.component.html',
  styleUrl: './warns-table.component.scss'
})
export class WarnsTableComponent implements OnInit {
  @Input() accountId!: number;

  warns: Warn[] | undefined;

  constructor(private warnApiService: WarnApiService) {
  }

  ngOnInit(): void {
    this.warnApiService.listAccountWarns(this.accountId).pipe(
       startWith([]),
       catchError(() => of([])),
       map(warns => warns || []),
    ).subscribe(
       warns => this.warns = warns,
       error => console.error('Error loading warns:', error),
    );
  }
}
