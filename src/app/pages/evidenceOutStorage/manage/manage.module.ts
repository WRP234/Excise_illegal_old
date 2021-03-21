import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageComponent } from './manage.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { PaginationTableModule } from '../../component/pagination-table/pagination-table.module';
import { IsPipeModule } from '../../../shared/pipe/IsPipe.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PrintDocModalModule } from '../print-doc-modal/print-doc-modal.module';
import { StepWizardModule } from '../../component/step-wizard/step-wizard.module';
import { MasterService } from 'app/pages/arrests/services';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { OwlModule } from 'ngx-owl-carousel';
import { DocumentModalModule } from '../document-modal/document-modal.module';
import { EvidenceOutStorageService } from '../evidenceOutStorage.service';
import { EvidenceOutItemModalModule } from '../evidenceOut-Item-modal/evidence-out-item-modal.module';


const routes: Routes = [
    {
        path: '',
        data: {
            // title: 'จัดการข้อมูล',
            urls: [
                { title: 'หน้าหลัก', url: '/' },
                { title: 'ค้นหารายการโอนย้ายของกลาง', url: '/evidenceOutStorage/list' },
                { title: 'จัดการข้อมูลการโอนย้ายของกลาง' },

            ],
            nextPage: { title: '', url: '' },
            codePage: 'ILG60_O_11_01_02_00'
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
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        CardActionsModule,
        MyDatePickerTHModule,
        PaginationTableModule,
        IsPipeModule,
        PrintDocModalModule,
        NgbModule.forRoot(),
        StepWizardModule,
        MatAutocompleteModule,
        OwlModule,
        DocumentModalModule,
        EvidenceOutItemModalModule
    ],
    declarations: [ManageComponent],
    providers: [EvidenceOutStorageService, MasterService],
    exports: []
})
export class ManageModule { }

