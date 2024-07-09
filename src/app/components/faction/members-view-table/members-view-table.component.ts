import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { beautifyName, getSkinImage } from '../../../util/character.util';
import { Table, TableModule } from 'primeng/table';
import { FactionApiService } from '../../../core/api/factionApi.service';
import { InputTextModule } from 'primeng/inputtext';
import { FactionMember } from '../../../core/model/factionMember';
import { NgIf } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
   selector: 'app-members-view-table',
   standalone: true,
   imports: [
      TableModule,
      InputTextModule,
      NgIf,
      TooltipModule,
      FormsModule,
      ButtonModule,
      MenuModule,
      TagModule,
      ConfirmDialogModule,
   ],
   providers: [ConfirmationService, FactionApiService],
   templateUrl: './members-view-table.component.html',
   styleUrl: './members-view-table.component.scss',
})
export class MembersViewTableComponent implements OnInit {
   protected readonly getSkinImage = getSkinImage;
   protected readonly beautifyName = beautifyName;

   @ViewChild('factionMembersTable') factionMembersTable!: Table;

   @Input() factionId !: number;
   @Input() showActions!: boolean;

   factionMembers: FactionMember[] = [];
   searchValue: string | undefined;

   constructor(private factionApiService: FactionApiService, private confirmationService: ConfirmationService) {
   }

   ngOnInit(): void {
      this.fetchFactionMembers(this.factionId);

   }

   private fetchFactionMembers(factionId: number) {
      this.factionApiService.listFactionMembers(factionId)
         .subscribe({
            next: (members) => {
               this.factionMembers = members;
            },
         });
   }

   filterMembersTable(eventTarget: EventTarget) {
      this.factionMembersTable.filterGlobal((<HTMLInputElement>eventTarget)['value'], 'contains');
   }

   kickFactionMember(factionMember: FactionMember) {
      this.confirmationService.confirm({
         message: `Da li ste sigurni da želite da izbacite ${factionMember.characterName} iz fakcije?`,
         header: 'Potvrda',
         acceptLabel: 'Da',
         rejectLabel: 'Ne',
         accept: () => {

         }
      })
   }
}
