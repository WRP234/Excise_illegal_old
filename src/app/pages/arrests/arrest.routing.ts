import { Routes } from '@angular/router';

// Components
import * as fromComponents from './components';

export const ROUTES: Routes = [
    {

        path: 'list',
        data: {
            urls: [{ title: 'หน้าหลัก', url: '/' }, { title: 'ค้นหางานบันทึกจับกุม' }],
            codePage: 'ILG60-O-02-00-01-00'
        },
        component: fromComponents.ListComponent
    },
    {
        path: 'manage/:mode/:code',
        data: {
            urls: [
                { title: 'หน้าหลัก', url: '/' },
                { title: 'ค้นหางานบันทึกจับกุม', url: '/arrest/list' },
                { title: 'จัดการงานบันทึกจับกุม' }
            ],
            codePage: 'ILG60-O-02-00-02-00',
            nextPage: { title: 'รับคำกล่าวโทษ', url: '/accusations/manage' }
        },
        component: fromComponents.ManageComponent
    },
    {
        path: 'lawbreaker/:mode/:code',
        data: {
            urls: [
                { title: 'หน้าหลัก', url: '/' },
                { title: 'ค้นหางานบันทึกจับกุม', url: '/arrest/list' },
                { title: 'จัดการงานบันทึกจับกุม', url: '/arrest/manage/C/NEW' },
                { title: 'จัดการข้อมูลผู้ต้องหา' }
            ],
            codePage: 'ILG60_M_01_01_02_00',
            nextPage: { title: 'งานจับกุม', url: '/' }
        },
        component: fromComponents.Ilg60M01010200Component
    },
    // {
    //     path: 'allegation/:mode',
    //     data: {
    //         urls: [
    //             { title: 'หน้าหลัก', url: '/' },
    //             { title: 'ค้นหางานจับกุม', url: '/arrest/list' },
    //             { title: 'จัดการข้อมูลงานจับกุม', url: '/arrest/manage/C/NEW' },
    //             { title: 'จัดการข้อมูลข้อกล่าวหา' }
    //         ],
    //         codePage: 'ILG60-03-03-00-00',
    //         nextPage: { title: 'รับคำกล่าวโทษ', url: '/accusations/manage' }
    //     },
    //     component: fromComponents.AllegationComponent
    // }, 


]
