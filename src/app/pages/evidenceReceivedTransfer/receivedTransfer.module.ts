import * as componentsAll from './index';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PaginationTableModule } from '../component/pagination-table/pagination-table.module';
import { CardActionsModule } from '../component/card-actions/card-actions.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ROUTES } from './receivedTransfer.routing';
import { MyDatePickerModule } from 'mydatepicker';
import { NguCarouselModule } from '@ngu/carousel';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { OwlModule } from 'ngx-owl-carousel';
import { RouterModule } from '@angular/router';
import { ReceivedTransferService } from './receivedTransfer.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule.forChild(ROUTES),
        NgbModule.forRoot(),
        CardActionsModule,
        PaginationTableModule,
        MyDatePickerModule,
        MyDatePickerTHModule,
        OwlModule,
        MyDatePickerTHModule,
        NguCarouselModule
    ],
    declarations: [...componentsAll.components],
    exports: [...componentsAll.components],
    providers: [ReceivedTransferService]
})
export class ReceivedTransferModule {

}
