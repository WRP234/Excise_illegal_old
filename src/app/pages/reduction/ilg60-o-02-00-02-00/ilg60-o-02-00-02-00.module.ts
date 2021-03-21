import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ilg60O02000200Component } from './ilg60-o-02-00-02-00.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { PaginationTableModule } from '../../component/pagination-table/pagination-table.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        CardActionsModule,
        PaginationTableModule
    ],
    declarations: [Ilg60O02000200Component],
    exports: [Ilg60O02000200Component]
})
export class DocumentModule { }