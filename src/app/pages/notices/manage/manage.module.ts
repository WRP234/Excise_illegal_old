import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageComponent } from './manage.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardActionsModule } from '../../component/card-actions/card-actions.module';
import { NoticeService } from '../notice.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { NgbModule, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
// import { SuspectModalModule } from '../../component/suspect-modal/suspect-modal.module';
import { NoticeSuspectModalModule } from '../../component/notice-suspect-modal/notice-suspect-modal.module';
import { PrintDocModalModule } from '../print-doc-modal/print-doc-modal.module';
import { ProductsModule } from '../products/products.module'
// import { ArrestsService } from '../../arrests/arrests.service';
// import { ModalLawbreakerModule } from '../../component/modal-lawbreaker/modal-lawbreaker.module';
import { DatepickerI18nService } from '../../../services/datepicker-i18n.service';
// import { ProveService } from '../../prove/prove.service';
import { MyDatePickerTHModule } from 'mydatepicker-th';
import { MainMasterService } from '../../../services/main-master.service';
import { SuspectModule } from '../suspect/suspect.module'
import { SuspectComponent } from '../suspect/suspect.component'
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { OwlModule } from 'ngx-owl-carousel';
import { DocumentModule } from '../document/document.module';
import { StepWizardModule } from '../../component/step-wizard/step-wizard.module';
import { ArrestModule } from '../../arrests/arrest.module'

const routes: Routes = [
    {
        path: '',
        data: {
            urls: [
                { title: 'หน้าหลัก', url: '/' },
                { title: 'ค้นหาใบแจ้งความนำจับ', url: '/notice/list' },
                { title: 'จัดการข้อมูลใบแจ้งความนำจับ' }
            ],
            codePage: 'ILG60_O_01_04_02_00'
        },
        component: ManageComponent
    }
];

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpModule,
        NgbModule.forRoot(),
        RouterModule.forChild(routes),
        CardActionsModule,
        // SuspectModalModule,
        // ModalLawbreakerModule,
        ArrestModule,
        SuspectModule,
        PrintDocModalModule,
        ProductsModule,
        MyDatePickerTHModule,
        NoticeSuspectModalModule,
        OwlModule,
        DocumentModule,
        StepWizardModule,
        SweetAlert2Module.forRoot()
    ],
    declarations: [ManageComponent],
    providers: [
        { provide: NgbDatepickerI18n, useClass: DatepickerI18nService },
        NoticeService,
        // ArrestsService,
        // ProveService,
        MainMasterService
    ]
})
export class ManageModule { }
