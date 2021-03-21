// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { PrintdocModelComponent } from '../printdoc-model/printdoc-model.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { PrintDocModalComponent } from './printdoc-modal.component';
import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    CardActionsModule,
    FormsModule,
    NgbModule.forRoot()
  ],
  declarations: [PrintdocModelComponent],
  exports: [
    PrintdocModelComponent
  ],
  entryComponents:[
    PrintdocModelComponent
  ]

})
export class PrintDocModalModule { }
