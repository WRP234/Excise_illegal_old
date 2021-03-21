import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageComponent } from './manage.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { ProveService } from '../prove.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PrintDocModalModule } from '../printdoc-modal/printdoc-modal.module';
import { ProveScienceModalModule } from '../provescience-modal/provescience-modal.module';
import { SearchProductModalModule } from '../searchproduct-modal/searchproduct-modal.module';
import { VatProveModalModule } from '../vatprove-modal/vatprove-modal.module';
import { PriceRecommendModalModule } from '../pricerecommand-modal/pricerecommend-modal.module';
import { ProveEvidenceJoinModalModule } from '../proveevidencejoin-modal/proveevidencejoin-modal.module';
import { IsPipeModule } from "../../../shared/pipe/IsPipe.module";
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MasterService } from '../../masters/masters.service';
import { DocumentModalModule } from '../document-modal/document-modal.module';
import { OwlModule } from 'ngx-owl-carousel';
import { StepWizardModule } from '../../component/step-wizard/step-wizard.module';
import { PaginationTableModule } from '../../component/pagination-table/pagination-table.module';

const routes: Routes = [
    {
        path: '',
        data: {
            // title: 'จัดการข้อมูล',
            urls: [
                { title: 'หน้าหลัก', url: '/' },
                { title: 'ค้นหางานตรวจรับและพิสูจน์ของกลาง', url: '/prove/list' },
                { title: 'จัดการงานตรวจรับและพิสูจน์ของกลาง' }
            ],
            codePage: 'ILG60_O_04_00_02_00'
        },
        component: ManageComponent
    }
];

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        RouterModule.forChild(routes),
        HttpModule,
        HttpClientModule,
        CardActionsModule,
        MatAutocompleteModule,
        PrintDocModalModule,
        ProveScienceModalModule,
        SearchProductModalModule,
        VatProveModalModule,
        PriceRecommendModalModule,
        DocumentModalModule,
        ProveEvidenceJoinModalModule,
        MyDatePickerTHModule,
        IsPipeModule,
        StepWizardModule,
        OwlModule,
        NgbModule.forRoot(),
        StepWizardModule,
        PaginationTableModule
    ],
    providers: [ProveService, MasterService],
    declarations: [ManageComponent],
    exports: [MatAutocompleteModule]
})
export class ManageModule { }
