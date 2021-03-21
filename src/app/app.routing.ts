import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { AuthGuard } from './pages/login/auth.guard';

export const routes: Routes = [


    {
        path: '', redirectTo: 'home', pathMatch: 'full'
    }, {
        path: 'login', loadChildren: './pages/login/login.module#LoginModule'
    }, {
        path: 'home', loadChildren: './pages/starter/starter.module#StarterModule', component: LayoutComponent, canActivate: [AuthGuard],
    },
    {
        path: 'logout', loadChildren: './pages/login/login.module#LoginModule'
    },

    {
        path: 'searchWarrant', component: LayoutComponent, canActivate: [AuthGuard],
        loadChildren: './pages/search-warrant/search-warrant.module#SearchWarrantModule'
    },
    {
        path: 'accordion',
        component: LayoutComponent,
        loadChildren: './pages/component/accordion/accordion.module#AccordionModule'
    },
    {
        path: 'alert',
        component: LayoutComponent,
        loadChildren: './pages/component/alert/alert.module#NgAlertModule'
    },
    {
        path: 'carousel',
        component: LayoutComponent,
        loadChildren: './pages/component/carousel/carousel.module#ButtonsModule'
    },
    {
        path: 'datepicker',
        component: LayoutComponent,
        loadChildren:
            './pages/component/datepicker/datepicker.module#DatepickerModule'
    },
    {
        path: 'dropdown',
        component: LayoutComponent,
        loadChildren:
            './pages/component/dropdown-collapse/dropdown-collapse.module#DropdownModule'
    },
    {
        path: 'modal',
        component: LayoutComponent,
        loadChildren: './pages/component/modal/modal.module#ModalModule'
    },
    {
        path: 'pagination',
        component: LayoutComponent,
        loadChildren:
            './pages/component/pagination/pagination.module#paginationModule'
    },
    {
        path: 'Popovertooltip',
        component: LayoutComponent,
        loadChildren:
            './pages/component/popover-tooltip/popover-tooltip.module#PopoverTooltipModule'
    },
    {
        path: 'progressbar',
        component: LayoutComponent,
        loadChildren:
            './pages/component/progressbar/progressbar.module#progressbarModule'
    },
    {
        path: 'rating',
        component: LayoutComponent,
        loadChildren: './pages/component/rating/rating.module#RatingModule'
    },
    {
        path: 'tabs',
        component: LayoutComponent,
        loadChildren: './pages/component/tabs/tabs.module#TabsModule'
    },
    {
        path: 'timepicker',
        component: LayoutComponent,
        loadChildren:
            './pages/component/timepicker/timepicker.module#TimepickerModule'
    },
    {
        path: 'typehead',
        component: LayoutComponent,
        loadChildren: './pages/component/typehead/typehead.module#TypeheadModule'
    },
    {
        path: 'fontawesome',
        component: LayoutComponent,
        loadChildren:
            './pages/icons/fontawesome/fontawesome.module#FontawesomeModule'
    },
    {
        path: 'simpleline',
        component: LayoutComponent,
        loadChildren:
            './pages/icons/simpleline/simpleline.module#SimplelineIconModule'
    },
    {
        path: 'material',
        component: LayoutComponent,
        loadChildren:
            './pages/icons/material/material.module#MaterialComponentModule'
    },
    {
        path: 'arrest', component: LayoutComponent, canActivate: [AuthGuard],
        loadChildren: './pages/arrests/arrest.module#ArrestModule'
    },
    {
        path: 'puritycerts', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/puritycerts/list/list.module#ListModule' },
            { path: 'manage/:mode/:code', loadChildren: './pages/puritycerts/manage/manage.module#ManageModule' }
        ]
    },
    {
        path: 'accusations', component: LayoutComponent,
        children: [
            { path: 'list', loadChildren: './pages/accusations/list/list.module#ListModule' },
            { path: 'manage/:mode/:code', loadChildren: './pages/accusations/manage/manage.module#ManageModule' }
        ]
    },
    {
        path: 'lawsuit', component: LayoutComponent, canActivate: [AuthGuard],
        loadChildren: './pages/lawsuit/lawsuit.module#LawsuitModule'
    },
    {
        path: 'SuppressTarget', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/suppressTarget/list/list.module#ListModule' },
            { path: 'manage/:mode/:code', loadChildren: './pages/suppressTarget/manage/manage.module#ManageModule' },
            { path: 'manages/:name/:code/:id', loadChildren: './pages/suppressTarget/manages/manages.module#ManagesModule' },
            { path: 'manages/view/:code/:year/:num', loadChildren: './pages/suppressTarget/manages/view/view.module#ViewModule' },

            // { path: 'manages/target/:mode', loadChildren: './pages/suppressTarget/create/create.module#CreateModule' },

            // ofarea SuppressTarget/targetOfarea/list
            { path: 'targetArea/list', loadChildren: './pages/suppressTarget/targetArea/list/list.module#ListModule' },
            { path: 'targetArea/view/:name/:off/:id', loadChildren: './pages/suppressTarget/targetArea/view/view.module#ViewModule' },

            // ofarea SuppressTarget/ParkTarget/list
            { path: 'ParkTarget/list', loadChildren: './pages/suppressTarget/ParkTarget/list/list.module#ListModule' },
            { path: 'ParkTarget/view', loadChildren: './pages/suppressTarget/ParkTarget/view/view.module#ViewModule' },

        ]
    },
    {
        path: 'msArrestTeam', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/masters/msArrestTeam/list/list.module#ListModule' },
            { path: 'manage/:mode/:code', loadChildren: './pages/masters/msArrestTeam/manage/manage.module#ManageModule' }
        ]
    },
    {
        path: 'msCourt', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/masters/msCourt/list/list.module#ListModule' },
            { path: 'manage/:mode/:code', loadChildren: './pages/masters/msCourt/manage/manage.module#ManageModule' }
        ]
    },
    {
        path: 'msCountry', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/masters/msCountry/list/list.module#ListModule' },
            { path: 'manage/:mode/:code', loadChildren: './pages/masters/msCountry/manage/manage.module#ManageModule' }
        ]
    },
    {
        path: 'msProvince', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/masters/msProvince/list/list.module#ListModule' },
            { path: 'manage/:mode/:code', loadChildren: './pages/masters/msProvince/manage/manage.module#ManageModule' }
        ]
    },
    {
        path: 'msDistrict', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/masters/msDistrict/list/list.module#ListModule' },
            { path: 'manage/:mode/:code', loadChildren: './pages/masters/msDistrict/manage/manage.module#ManageModule' }
        ]
    },
    {
        path: 'msSubDistrict', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/masters/msSubDistrict/list/list.module#ListModule' },
            { path: 'manage/:mode/:code', loadChildren: './pages/masters/msSubDistrict/manage/manage.module#ManageModule' }
        ]
    },
    {
        path: 'msRelation', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/masters/msRelation/list/list.module#ListModule' },
            { path: 'manage/:mode/:code', loadChildren: './pages/masters/msRelation/manage/manage.module#ManageModule' }
        ]
    },
    {
        path: 'msNationality', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/masters/msNationality/list/list.module#ListModule' },
            { path: 'manage/:mode/:code', loadChildren: './pages/masters/msNationality/manage/manage.module#ManageModule' }
        ]
    },
    {
        path: 'msRace', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/masters/msRace/list/list.module#ListModule' },
            { path: 'manage/:mode/:code', loadChildren: './pages/masters/msRace/manage/manage.module#ManageModule' }
        ]
    },
    {
        path: 'msReligion', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/masters/msReligion/list/list.module#ListModule' },
            { path: 'manage/:mode/:code', loadChildren: './pages/masters/msReligion/manage/manage.module#ManageModule' }
        ]
    },
    {
        path: 'msTitle', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/masters/msTitle/list/list.module#ListModule' },
            { path: 'manage/:mode/:code', loadChildren: './pages/masters/msTitle/manage/manage.module#ManageModule' }
        ]
    },
    {
        path: 'msDivisionRate', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/masters/msDivisionRate/list/list.module#ListModule' },
            { path: 'manage/:mode/:code', loadChildren: './pages/masters/msDivisionRate/manage/manage.module#ManageModule' }
        ]
    },
    {
        path: 'msRawardDivision', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/masters/msRawardDivision/list/list.module#ListModule' },
            { path: 'manage/:mode/:code', loadChildren: './pages/masters/msRawardDivision/manage/manage.module#ManageModule' }
        ]
    },
    // {
    //     path: 'msRawardRateDivision', component: LayoutComponent, canActivate: [AuthGuard],
    //     children: [
    //         { path: 'manage/:code', loadChildren: './pages/masters/msRawardRateDivision/manage/manage.module#ManageModule' }
    //     ]
    // },
    {
        path: 'msLawGroup', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/masters/msLawGroup/list/list.module#ListModule' },
            { path: 'manage/:mode/:code', loadChildren: './pages/masters/msLawGroup/manage/manage.module#ManageModule' }
        ]
    },
    {
        path: 'msLawGroupSection', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/masters/msLawGroupSection/list/list.module#ListModule' },
            { path: 'manage/:mode/:code', loadChildren: './pages/masters/msLawGroupSection/manage/manage.module#ManageModule' }
        ]
    },
    {
        path: 'msLawGroupSubSectionRule', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/masters/msLawGroupSubSectionRule/list/list.module#ListModule' },
            { path: 'manage/:mode/:code', loadChildren: './pages/masters/msLawGroupSubSectionRule/manage/manage.module#ManageModule' }
        ]
    },
    {
        path: 'msModule', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/masters/msModule/list/list.module#ListModule' },
            { path: 'manage/:mode/:code', loadChildren: './pages/masters/msModule/manage/manage.module#ManageModule' }
        ]
    },
    {
        path: 'msWarehouse', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/masters/msWarehouse/list/list.module#ListModule' },
            { path: 'manage/:mode/:code', loadChildren: './pages/masters/msWarehouse/manage/manage.module#ManageModule' }
        ]
    },
    {
        path: 'msProduct', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/masters/msProduct/list/list.module#ListModule' },
            { path: 'manage/:mode/:code', loadChildren: './pages/masters/msProduct/manage/manage.module#ManageModule' }
        ]
    },
    {
        path: 'msProductSize', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/masters/msProductSize/list/list.module#ListModule' },
            { path: 'manage/:mode/:code', loadChildren: './pages/masters/msProductSize/manage/manage.module#ManageModule' }
        ]
    },
    {
        path: 'msProductUnit', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/masters/msProductUnit/list/list.module#ListModule' },
            { path: 'manage/:mode/:code', loadChildren: './pages/masters/msProductUnit/manage/manage.module#ManageModule' }
        ]
    },
    {
        path: 'msUnit', component: LayoutComponent, canActivate: [AuthGuard],
        loadChildren: './pages/masters/msUnit/masUnit.module#masUnitModule'
    },
    {
        path: 'caseStatus', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/caseTracking/caseStatus/list/list.module#ListModule' },
            { path: 'case-details/:arrestId', loadChildren: './pages/caseTracking/caseStatus/case-details/case-details.module#CaseDetailsModule' }
        ]
    },
    {
        path: 'uac', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'role/list', loadChildren: './pages/UAC/role/list/list.module#ListModule' },
            { path: 'role/manage/:roleId', loadChildren: './pages/UAC/role/manage/manage.module#ManageModule' },
            { path: 'useraccount/list', loadChildren: './pages/UAC/useraccount/list/list.module#ListModule' },
            { path: 'useraccount/manage/:accountId', loadChildren: './pages/UAC/useraccount/manage/manage.module#ManageModule' }
        ]
    },
    {
        path: 'suspectsAnalyze', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/caseTracking/analyzeSuspectsNetwork/searchSuspects/list/list.module#ListModule' },
            { path: 'manage/:mode/:code', loadChildren: './pages/caseTracking/analyzeSuspectsNetwork/searchSuspects/manage/manage.module#ManageModule' },
            { path: 'imageSearch', loadChildren: './pages/caseTracking/analyzeSuspectsNetwork/searchSuspects/image-search/image-search.module#ImageSearchModule' },
            { path: 'suspectsNetwork/:code', loadChildren: './pages/caseTracking/analyzeSuspectsNetwork/searchSuspects/suspects-network/suspects-network.module#SuspectsNetworkModule' }
        ]
    },
    {
        path: 'investigation', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/investigation/list/list.module#ListModule' },
            { path: 'manage/:mode/:code', loadChildren: './pages/investigation/manage/manage.module#ManageModule' },
            { path: 'detail-manage/:mode', loadChildren: './pages/investigation/detail-manage/detail-manage.module#DetailManageModule' },
            { path: 'suspect/:mode/:code', loadChildren: './pages/investigation/suspect/suspect.module#SuspectModule' }
        ]
    },
    {
        path: 'notice', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/notices/list/list.module#ListModule' },
            { path: 'manage/:mode/:code', loadChildren: './pages/notices/manage/manage.module#ManageModule' }
        ]
    },
    // {
    //     path: 'evidenceIn', component: LayoutComponent, canActivate: [AuthGuard],
    //     children: [
    //         { path: 'list', loadChildren: './pages/evidenceIn/list/list.module#ListModule' },
    //         { path: 'manage/:type/:mode/:code/:proveid', loadChildren: './pages/evidenceIn/manage/manage.module#ManageModule' }
    //     ]
    // },
    {
        path: 'receivedFromTransfer', component: LayoutComponent, canActivate: [AuthGuard],
        loadChildren: './pages/evidenceReceivedTransfer/receivedTransfer.module#ReceivedTransferModule'

    },
    {
        path: 'evidenceOut', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list/:type', loadChildren: './pages/evidenceOut/list/list.module#ListModule' },
            { path: 'manage/:type/:mode/:code', loadChildren: './pages/evidenceOut/manage/manage.module#ManageModule' }
        ]
    },
    {
        path: 'evidenceStock', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/evidenceStock/list/list.module#ListModule' },
            { path: 'manage/:code', loadChildren: './pages/evidenceStock/manage/manage.module#ManageModule' },
        ]
    },
    {
        path: 'prove', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/prove/list/list.module#ListModule' },
            { path: 'manage/:mode/:code1/:code2/:code3/:code4', loadChildren: './pages/prove/manage/manage.module#ManageModule' }
        ]
    },
    {
        path: 'revenue', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/revenue/list/list.module#ListModule' },
            { path: 'manage/:mode/:code', loadChildren: './pages/revenue/manage/manage.module#ManageModule' }
        ]
    },
    {
        path: 'fine', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/fine/list/list.module#ListModule' },
            { path: 'manage/:mode/:code/:code2/:code3', loadChildren: './pages/fine/manage/manage.module#ManageModule' },
            { path: 'detail', loadChildren: './pages/fine/detail/detail.module#DetailModule' },
        ]
    },
    {
        path: 'reduction', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/reduction/list/list.module#ListModule' },
            { path: 'manage/:mode/:code/:code2/:code3', loadChildren: './pages/reduction/manage/manage.module#ManageModule' },
        ]
    },
    {
        path: 'report', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'case-report/list', loadChildren: './pages/report/case-report/list/list.module#ListModule' },
            { path: 'case-report/list/criteria', loadChildren: './pages/report/case-report/manage/manage.module#ManageModule' },
            // { path: 'revenue-report/criteria', loadChildren: './pages/report/revenue-report/criteria/criteria.module#CriteriaModule' },
            // { path: 'statistical-caseResults-report/criteria', loadChildren: './pages/report/statistical-caseResults-report/criteria/criteria.module#CriteriaModule' },
            // { path: 'status-caseResults-report/criteria', loadChildren: './pages/report/status-caseResults-report/criteria/criteria.module#CriteriaModule' },
            // { path: 'statistical-suppressionOffenders-report/criteria', loadChildren: './pages/report/statistical-suppressionOffenders-report/criteria/criteria.module#CriteriaModule' }
        ]
    },
    {
        path: 'reward', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/reward/list/list.module#ListModule' },
            // { path: 'manage/:mode/:code', loadChildren: './pages/reward/manage/manage.module#ManageModule' },
            { path: 'manage/:mode/:code/:code2/:code3', loadChildren: './pages/reward/manage/manage.module#ManageModule' },
        ],
    },
    {
        path: 'deliveryStorage', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/deliveryStorage/list/list.module#ListModule' },
            { path: 'manage/:mode/:arrestId/:evidenceInId', loadChildren: './pages/deliveryStorage/manage/manage.module#ManageModule' }
        ]
    },
    {
        path: 'proveStorage', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/proveStorage/list/list.module#ListModule' },
            { path: 'manage/:mode/:arrestId/:evidenceInId', loadChildren: './pages/proveStorage/manage/manage.module#ManageModule' }
        ]
    },
    {
        path: 'evidenceOutStorage', component: LayoutComponent, canActivate: [AuthGuard],
        children: [
            { path: 'list', loadChildren: './pages/evidenceOutStorage/list/list.module#ListModule' },
            { path: 'manage/:mode/:evidenceOutId', loadChildren: './pages/evidenceOutStorage/manage/manage.module#ManageModule' }
        ]
    },

];
