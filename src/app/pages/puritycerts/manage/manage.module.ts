import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageComponent } from './manage.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { MasterService } from '../../arrests/services';
import { MasStaffService } from '../services/mas-staff.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MyDatePickerModule } from 'mydatepicker';
import * as fromComponents from './index';
import { PuritycertService } from '../puritycert.service';
import { ArrestStaffService } from "../services/arrest-staff.service";
import { ManageConfig } from "./manage.config";
import { PaginationTableModule } from '../../component/pagination-table/pagination-table.module';
import { ArrestMasGuiltBaseService } from "../services/arrest-mas-guilt-base.service";
import { OwlModule } from 'ngx-owl-carousel';
import {DocumentModule} from '../document_puritycerts/document.module';

const routes: Routes = [
    {
        path: '',
        data: {
            // title: 'จัดการข้อมูล',
            urls: [
                { title: 'หน้าหลัก', url: '/' }, { title: 'ค้นหาใบรับรองความบริสุทธิ์', url: '/puritycerts/manage' },
                { title: 'จัดการข้อมูลใบรับรองความบริสุทธิ์' }
            ],
          codePage: 'ILG60_O_01_02_02_00'
            // nextPage: { title: 'งานจับกุม', url: '/puritycerts/manage' }
        },
        component: ManageComponent
    }
];

@NgModule({
  imports: [
    FormsModule,
    NgbModule,
    CommonModule,
    RouterModule.forChild(routes),
    CardActionsModule,
    MyDatePickerModule,
    ReactiveFormsModule,
    PaginationTableModule,
    OwlModule,
    DocumentModule
  ],
    declarations: [
        ManageComponent,
        ...fromComponents.components
    ],
    exports: [...fromComponents.components],
    providers: [MasterService, MasStaffService, PuritycertService, ArrestStaffService, ArrestMasGuiltBaseService, ManageConfig]

})
export class ManageModule { }
