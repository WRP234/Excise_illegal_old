import { Routes } from '@angular/router';

// Components
import * as fromComponents from './components';

export const ROUTES: Routes = [
  {
    path: 'list',
    data: {
        urls: [{ title: 'หน้าหลัก', url: '/' }, { title: 'ค้นหาหมายค้น' }],
        codePage: 'ILG60-03-01-00-00'
    },
    component: fromComponents.ListComponent
  },
  {
    path: 'manage/:mode/:code',
    data: {
      urls: [
        { title: 'หน้าหลัก', url: '/' },
        { title: 'ค้นหาหมายค้น ', url: '/searchWarrant/list' },
        { title: 'จัดการข้อมูลหมายค้น\n' }
      ],
      codePage: 'ILG60-03-02-00-00'
    },
    component: fromComponents.ManageComponent
  },
];
