import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FactionMember, ApiError } from '../../../core/model/models';
import { FactionApiService } from '../../../core/api/api';
import { beautifyName, getSkinImage } from '../../../util/character.util';
import { UpdateMemberRankDialogComponent } from '../update-member-rank-dialog';
import { BadgeModule } from 'primeng/badge';

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
      NgClass,
      BadgeModule,
   ],
   providers: [ConfirmationService, FactionApiService, DialogService],
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

   constructor(private factionApiService: FactionApiService,
               private messageService: MessageService,
               public dialogService: DialogService,
               private confirmationService: ConfirmationService) {
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
            this.factionApiService.kickFactionMember(factionMember.characterId)
               .subscribe({
                  next: (response) => {
                     this.messageService.add({
                        severity: 'success',
                        detail: response.message,
                     });

                     this.factionMembers = this.factionMembers.slice(this.factionMembers.indexOf(factionMember), 1);
                  },
                  error: (response: ApiError) => this.messageService.add({
                     severity: 'error',
                     summary: 'Greška',
                     detail: response.message,
                  }),
               });
         },
      });
   }

   updateFactionMemberRank(member: FactionMember) {
      const updateRankDialogRef: DynamicDialogRef = this.dialogService.open(UpdateMemberRankDialogComponent, {
         header: 'Ažuriraj rank',
         data: member,
         style: {
            minWidth: '325px',
         },
      });

      updateRankDialogRef.onClose.subscribe({
         next: (rankName?: string) => {
            if (!rankName) return;

            this.factionApiService.patchFactionMemberRank({ rankName }, member.characterId)
               .subscribe({
                  next: (response) => {
                     const memberIndex = this.factionMembers.indexOf(member);
                     this.factionMembers[memberIndex] = response;
                     this.messageService.add({
                        severity: 'success',
                        summary: 'Uspešno',
                        detail: `Ažurirali ste rank ${member.characterName} na ${response.rankName}`,
                     });
                  },
                  error: (response: ApiError) => this.messageService.add({
                     severity: 'error',
                     detail: response.message,
                  }),
               });
         },
      });
   }
}
