import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageSearchComponent } from './image-search.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardActionsModule } from '../../../../component/card-actions/card-actions.module';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { PaginationTableModule } from '../../../../component/pagination-table/pagination-table.module';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OwlModule } from 'ngx-owl-carousel';


const routes: Routes = [
    {
        path: '',
        data: {
            urls: [{ title: 'หน้าหลัก', url: '/' },
            { title: 'ค้นหาผู้ต้องหา', url: '/suspectsAnalyze/list' },
            { title: 'ค้นหาด้วยรูปภาพ' }],
            codePage: 'ILG60_O_21_00_01_01'
        },
        component: ImageSearchComponent
    }
]

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        HttpModule,
        HttpClientModule,
        RouterModule.forChild(routes),
        CardActionsModule,
        PaginationTableModule,
        MyDatePickerTHModule,
        MatAutocompleteModule,
        NgbModule.forRoot(),
        OwlModule
    ],
    declarations: [ImageSearchComponent],
    providers: [ImageSearchComponent],
    exports: []
})
export class ImageSearchModule { }