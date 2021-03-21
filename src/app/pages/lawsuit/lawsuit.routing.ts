import { Routes } from '@angular/router';
import * as fromComponents from './components';

export const ROUTES: Routes = [
    {

        path: 'list',
        data: {
            urls: [{ title: 'หน้าหลัก', url: '/' }, { title: 'ค้นหางานรับคดีคำกล่าวโทษ' }],
            codePage: 'ILG60_O_03_00_01_00'
        },
        component: fromComponents.ListComponent
    },
    {

        path: 'manage/:mode',
        data: {
            urls: [{ title: 'หน้าหลัก', url: '/' }, { title: 'ค้นหางานรับคดีคำกล่าวโทษ', url: '/lawsuit/list' },
            { title: 'จัดการงานรับคดีคำกล่าวโทษ' }],
            codePage: 'ILG60_O_03_00_02_00'
        },
        component: fromComponents.ManageComponent
    }
]
