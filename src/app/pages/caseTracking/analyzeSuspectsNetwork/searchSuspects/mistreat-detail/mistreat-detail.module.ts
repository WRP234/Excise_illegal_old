import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MistreatDetailComponent } from './mistreat-detail.component';
import { CardActionsModule } from '../../../../component/card-actions/card-actions.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginationTableModule } from '../../../../component/pagination-table/pagination-table.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CardActionsModule,
    FormsModule,
    NgbModule.forRoot(),
    PaginationTableModule
  ],
  declarations: [
    MistreatDetailComponent
  ],  
  exports: [
    MistreatDetailComponent
  ],
  entryComponents:[MistreatDetailComponent],
})
export class MistreatDetailModule { }