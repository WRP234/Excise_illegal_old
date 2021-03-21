import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageComponent } from './manage.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardActionsModule } from '../../../../component/card-actions/card-actions.module';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { PaginationTableModule } from '../../../../component/pagination-table/pagination-table.module';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchSuspectsService } from '../../analyze-services/searchSuspects.service';
import { MistreatDetailModule } from '../mistreat-detail/mistreat-detail.module'
import { OwlModule } from 'ngx-owl-carousel';
import { DocumentModule } from '../document/document.module'


const routes: Routes = [
    {
        path: '',
        data: {
            urls: [{ title: 'หน้าหลัก', url: '/' }, { title: 'ค้นหาผู้ต้องหา', url: '/suspectsAnalyze/list' },
            { title: 'ข้อมูลผู้ต้องหา' }],
            codePage: 'ILG60_M_01_01_02_00'
        },
        component: ManageComponent
    }
]

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        HttpModule,
        HttpClientModule,
        RouterModule.forChild(routes),
        CardActionsModule,
        PaginationTableModule,
        MyDatePickerTHModule,
        MatAutocompleteModule,
        NgbModule.forRoot(),
        MistreatDetailModule,
        OwlModule,
        DocumentModule
    ],
    declarations: [ManageComponent],
    providers: [SearchSuspectsService],
    exports: []
})
export class ManageModule { }