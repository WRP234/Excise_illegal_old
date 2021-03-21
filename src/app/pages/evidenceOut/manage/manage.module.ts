import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageComponent } from './manage.component';
import { Routes, RouterModule } from '@angular/router';
import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { EvidenceOutService } from '../evidenceOut.service';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PrintDocModalModule } from '../printdoc-modal/printdoc-modal.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { PaginationTableModule } from '../../component/pagination-table/pagination-table.module';
import { MasterService } from '../../model/master.service';
import { EvidenceService } from '../../evidenceIn/evidenceIn.service';
import { IsPipeModule } from '../../../shared/pipe/IsPipe.module';
import { OwlModule } from 'ngx-owl-carousel';
import { DocumentModule } from '../document/document.module';

// Components
import * as fromComponents from '../index';

const routes: Routes = [
    {
        path: '',
        data: {
            // title: 'จัดการข้อมูล',
            urls: [
                { title: 'หน้าหลัก', url: '/' },
                { title: 'ค้นหารายการคืนของกลาง', url: '/evidenceOut/list' },
                { title: 'จัดการข้อมูลรายการคืนของกลาง' },

            ],
            nextPage: { title: '', url: '' },
            codePage: 'ILG60-11-02-00-00'
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
        NgbModule.forRoot(),
        RouterModule.forChild(routes),
        CardActionsModule,
        PrintDocModalModule,
        MyDatePickerTHModule,
        MatAutocompleteModule,
        PaginationTableModule,
        IsPipeModule,
        OwlModule,
        DocumentModule
    ],
    declarations: [
        ...fromComponents.components,
        ManageComponent
    ],
    providers: [EvidenceOutService, MasterService, EvidenceService],
    exports: [...fromComponents.components, MatAutocompleteModule]
})
export class ManageModule { }
