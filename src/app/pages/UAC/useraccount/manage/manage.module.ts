import { Routes, RouterModule } from '@angular/router';
import { UserManageComponent } from './manage.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { CardActionsModule } from '../../../component/card-actions/card-actions.module';
import { ManageService } from './manage.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material';
const routes: Routes = [
    {
        path: '',
        data: {
            urls: [{ title: 'หน้าหลัก', url: '/' },{ title: 'ค้นหาเจ้าพนักงานเพื่อจัดการสิทธิเข้าถึงข้อมูล', url: '/uac/useraccount/list' }, 
            { title: 'การจัดการสิทธิเข้าถึงข้อมูลระบบผู้กระทำผิด' }],
            pageType: 'list',
            // nextPage: { title: 'แจ้งความ', url: '' },
            codePage: 'ILG60-24-02-00-00'
        },
        component: UserManageComponent
    }
]

@NgModule({
    imports: [
      CommonModule,
      HttpModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      RouterModule.forChild(routes),
      CardActionsModule,
      MatAutocompleteModule,
      MatFormFieldModule
    ],
    declarations: [UserManageComponent],
    providers: [ManageService],
    exports: [MatAutocompleteModule,ReactiveFormsModule,MatFormFieldModule]
})
export class ManageModule { }