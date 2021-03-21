import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintDocModalComponent } from './printdoc-modal.component';
import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ManageComponent} from '../manage/manage.component'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CardActionsModule,
    FormsModule,
    NgbModule.forRoot(),
    ReactiveFormsModule,
  ],
  declarations: [
      PrintDocModalComponent
  ],  
  exports: [
    PrintDocModalComponent
  ],
  entryComponents:[PrintDocModalComponent],
})
export class PrintDocModalModule { }
