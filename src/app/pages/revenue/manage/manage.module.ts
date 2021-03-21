import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageComponent } from './manage.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { RevenueService } from '../revenue.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { PaginationTableModule } from '../../component/pagination-table/pagination-table.module';
import { IsPipeModule } from '../../../shared/pipe/IsPipe.module';
import { MasterService } from '../../masters/masters.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PrintDocModalModule } from '../print-doc-modal/print-doc-modal.module';
import { StepWizardModule } from '../../component/step-wizard/step-wizard.module';
import { RevenueMasterService } from '../revenue.mas.service'

const routes: Routes = [
    {
        path: '',
        data: {
            // title: 'จัดการข้อมูล',
            urls: [
                { title: 'หน้าหลัก', url: '/' },
                { title: 'ค้นหางานนำส่งเงินรายได้', url: '/revenue/list' },
                { title: 'จัดการงานนำส่งเงินรายได้' },

            ],
            nextPage: { title: '', url: '' },
            codePage: 'ILG60_O_06_00_02_00'
        },
        component: ManageComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        HttpModule,
        HttpClientModule,
        FormsModule,
        RouterModule.forChild(routes),
        CardActionsModule,
        MyDatePickerTHModule,
        PaginationTableModule,
        IsPipeModule,
        PrintDocModalModule,
        NgbModule.forRoot(),
        StepWizardModule
    ],
    declarations: [ManageComponent],
    providers: [RevenueService, MasterService, RevenueMasterService],
    exports: []
})
export class ManageModule { }
