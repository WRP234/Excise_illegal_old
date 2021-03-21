import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuspectsNetworkComponent } from './suspects-network.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardActionsModule } from '../../../../component/card-actions/card-actions.module';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { PaginationTableModule } from '../../../../component/pagination-table/pagination-table.module';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SearchSuspectsService } from '../../analyze-services/searchSuspects.service';
import { OrgChartModule } from 'ng2-org-chart';

const routes: Routes = [
    {
        path: '',
        data: {
            urls: [{ title: 'หน้าหลัก', url: '/' }, { title: 'ค้นหาผู้ต้องหา', url: '/suspectsAnalyze/list' },
            { title: 'ข้อมูลผู้ต้องหา' }, //, url: '/suspectsAnalyze/manage/R/2361'
            { title: 'เครือข่ายผู้ต้องหา' }],
            codePage: 'ILG60_O_21_00_02_00'
        },
        component: SuspectsNetworkComponent
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
        OrgChartModule
    ],
    declarations: [SuspectsNetworkComponent],
    providers: [SearchSuspectsService],
    exports: []
})
export class SuspectsNetworkModule { }