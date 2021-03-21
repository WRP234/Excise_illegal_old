import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageComponent } from './manage.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { EvidenceService } from '../evidenceIn.service';
import { MasterService } from '../../masters/masters.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { PrintDocModalModule } from '../printdoc-modal/printdoc-modal.module';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { PaginationTableModule } from '../../component/pagination-table/pagination-table.module';
import { IsPipeModule } from '../../../shared/pipe/IsPipe.module';
import { EvidenceOutService } from '../../evidenceOut/evidenceOut.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
    {
        path: '',
        data: {
            // title: 'จัดการข้อมูล',
            urls: [
                { title: 'หน้าหลัก', url: '/' },
                { title: 'ค้นหารายการตรวจรับของกลาง', url: '/evidenceIn/list' },
                { title: 'จัดการข้อมูลรายการตรวจรับของกลาง' },
                
            ],
            nextPage: { title: '', url: '' },
            codePage: 'ILG60-10-02-00-00'
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
        PrintDocModalModule,
        MyDatePickerTHModule,
        MatAutocompleteModule,
        PaginationTableModule,
        IsPipeModule,
        NgbModule.forRoot()
    ],
    declarations: [ManageComponent],
    providers: [EvidenceService, MasterService, EvidenceOutService],
    exports: [MatAutocompleteModule]
})
export class ManageModule { }
