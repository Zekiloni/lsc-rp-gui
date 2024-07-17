import { AfterViewInit, Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FactionMember } from '../../../core/model/factionMember';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';

@Component({
   selector: 'app-update-member-rank-dialog',
   standalone: true,
   imports: [
      ButtonModule,
      FloatLabelModule,
      InputTextModule,
      PaginatorModule,
      ReactiveFormsModule,
   ],
   templateUrl: './update-member-rank-dialog.component.html',
   styleUrl: './update-member-rank-dialog.component.scss',
})
export class UpdateMemberRankDialogComponent {
   factionMember: FactionMember | undefined;

   updateRankForm = this.formBuilder.group({
      rankName: [''],
   });

   get isSaveDisabled() {
      return this.updateRankForm.get('rankName')!.value == this.factionMember!.rankName;
   }

   constructor(private dialogRef: DynamicDialogRef, public config: DynamicDialogConfig, private formBuilder: FormBuilder) {
      this.factionMember = config.data;
      this.updateRankForm.get('rankName')!.setValue(this.factionMember!.rankName || '');
   }

   updateRank() {
      this.dialogRef.close(this.updateRankForm.get('rankName')!.value);
   }
}
