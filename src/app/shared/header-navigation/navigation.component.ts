import { Component, OnInit, HostListener, Input, ElementRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NavigationService } from './navigation.service';
import {Nav_target_Service} from './nav_target.service'
import { NgForm } from '@angular/forms';
import swal from 'sweetalert2';
import { async } from '@angular/core/testing';
// import {Nav_Parktarget_Service} from '../../../app/pages/suppressTarget/ParkTarget/nav_target.service';
// import {Nav_Areatarget_Service} from '../../../app/pages/suppressTarget/targetArea/nav_target.service';

// declare var jQuery: any;

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'ma-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss']

})
export class NavigationComponent implements OnInit, OnDestroy {
    // เป้าปราบปราม สาขา
    newButton: any;
    printButton: any;
    editButton: any;
    deleteButton: any;
    cancelButton: any;
    saveButton: any;
    searchBar: any;
    nextPageButton: any;
    prevPageButton: any;
    sendInComeButton: any;
    nextPage: any = '';
    nextPageTitle: any;
    prevPageTitle: any;
    sendTargetButton: any;
    permisCheck: any
    perBeforReturn: any

    // Park_target
    newButtonPark_target: any;
    printButtonPark_target: any;
    editButtonPark_target: any;
    deleteButtonPark_target: any;
    cancelButtonPark_target: any;
    saveButtonPark_target: any;
    searchBarPark_target: any;
    nextPageButtonPark_target: any;
    prevPageButtonPark_target: any;
    sendInComeButtonPark_target: any;
    nextPagePark_target: any = '';
    nextPageTitlePark_target: any;
    prevPageTitlePark_target: any;
    sendTargetButtonPark_target: any;
    permisCheckPark_target: any
    perBeforReturnPark_target: any
    
    // Area_target
    newButtonArea_target: any;
    printButtonArea_target: any;
    editButtonArea_target: any;
    deleteButtonArea_target: any;
    cancelButtonArea_target: any;
    saveButtonArea_target: any;
    searchBarArea_target: any;
    nextPageButtonArea_target: any;
    prevPageButtonArea_target: any;
    sendInComeButtonArea_target: any;
    nextPageArea_target: any = '';
    nextPageTitleArea_target: any;
    prevPageTitleArea_target: any;
    sendTargetButtonArea_target: any;
    permisCheckArea_target: any
    perBeforReturnArea_target: any

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private navService: NavigationService,
        private nav_targetService:Nav_target_Service,
        // private Nav_Parktarget_Service:Nav_Parktarget_Service,
        // private Nav_Areatarget_Service:Nav_Areatarget_Service,
    ) {
        // target
        this.newButton = this.nav_targetService.showNewButton;
        this.printButton = this.nav_targetService.showPrintButton;
        this.editButton = this.nav_targetService.showEditButton;
        this.deleteButton = this.nav_targetService.showDeleteButton;
        this.cancelButton = this.nav_targetService.showCancelButton;
        this.saveButton = this.nav_targetService.showSaveButton;
        this.searchBar = this.nav_targetService.showSearchBar;
        this.sendTargetButton = this.nav_targetService.showSendTargetButton;

        // Park_target
        this.newButtonPark_target = this.nav_targetService.showNewButton;
        this.printButtonPark_target = this.nav_targetService.showPrintButton;
        this.editButtonPark_target = this.nav_targetService.showEditButton;
        this.deleteButtonPark_target = this.nav_targetService.showDeleteButton;
        this.cancelButtonPark_target = this.nav_targetService.showCancelButton;
        this.saveButtonPark_target = this.nav_targetService.showSaveButton;
        this.searchBarPark_target = this.nav_targetService.showSearchBar;
        this.sendTargetButtonPark_target = this.nav_targetService.showSendTargetButton;

        // Area_target
        this.newButtonArea_target = this.nav_targetService.showNewButton;
        this.printButtonArea_target = this.nav_targetService.showPrintButton;
        this.editButtonArea_target = this.nav_targetService.showEditButton;
        this.deleteButtonArea_target = this.nav_targetService.showDeleteButton;
        this.cancelButtonArea_target = this.nav_targetService.showCancelButton;
        this.saveButtonArea_target = this.nav_targetService.showSaveButton;
        this.searchBarArea_target = this.nav_targetService.showSearchBar;
        this.sendTargetButtonArea_target = this.nav_targetService.showSendTargetButton;
    }

    ngOnInit() {
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }

            const scrollToTop = window.setInterval(function () {
                const pos = window.pageYOffset;
                if (pos > 0) {
                    window.scrollTo(0, pos - 20); // how far to scroll on each step
                } else {
                    window.clearInterval(scrollToTop);
                }
            }, 16); // how fast to scroll (this equals roughly 60 fps)
        });
    }

    ngOnDestroy(): void {
    }

    clickAdvSearch_Area_target() {
        
        this.nav_targetService.setAdvSearch();
    }
    clickAdvSearch_Park_target() {
        
        this.nav_targetService.setAdvSearch();
    }
    

    async clickNew() {
        var pmCheck = this.permissionCheck('IsCreate')
        if (await pmCheck != 1) {
            swal('', 'ผู้ใช้งานไม่มีสิทธิ์สร้างข้อมูล กรุณาติดต่อผู้ดูแลระบบ', 'warning');
        } else if (await pmCheck == 1) {
            this.nav_targetService.setOnNextPage(true);
           
        }
        // this.navService.setOnNextPage(true); //Old
    }

    async clickNextPage() {
        this.nav_targetService.setOnNextPage(true);
        
    }

    clickPrevPage() {
        this.nav_targetService.setOnPrevPage(true);
        
    }
    clickSendTarget(){
        this.nav_targetService.setOnSendTarget(true);
        
    }
    clickSendTarget_Area_target(){
        this.nav_targetService.setOnSendTarget(true);
        
    }

    clickPrint() {
        this.nav_targetService.setOnPrint(true);
        
        
    }
    clickPrint_Area_target() {
        this.nav_targetService.setOnPrint(true);
        
        
    }
    // clickNew(){

    // }
    clickPrint_Park_target() {
        this.nav_targetService.setOnPrint(true);
        // this.Nav_Parktarget_Service.setOnPrint(true);
        // this.Nav_Areatarget_Service.setOnPrint(true);
        
    }

    async clickEdit() {
        var pmCheck = this.permissionCheck('IsUpdate')
        if (await pmCheck != 1) {
            swal('', 'ผู้ใช้งานไม่มีสิทธิ์แก้ไขข้อมูล กรุณาติดต่อผู้ดูแลระบบ', 'warning');
        } else if (await pmCheck == 1) {
             // set false
            this.nav_targetService.setEditField(false);
            this.nav_targetService.setEditButton(false);
            this.nav_targetService.setPrintButton(false);
            this.nav_targetService.setDeleteButton(false);
            // set true
            this.nav_targetService.setSaveButton(true);
            this.nav_targetService.setCancelButton(true);
            // set event click edit
            this.nav_targetService.setOnEdit(true);
        }
    }

    clickCancel() {
        // this.Nav_Parktarget_Service.setOnCancel(true);
        this.nav_targetService.setOnCancel(true);
        // this.Nav_Areatarget_Service.setOnCancel(true);

    }
    

    async clickSave() {
        var pmCheck = this.permissionCheck('IsUpdate')
        if (await pmCheck != 1) {
            swal('', 'ผู้ใช้งานไม่มีสิทธิ์บันทึก กรุณาติดต่อผู้ดูแลระบบ', 'warning');
        } else if (await pmCheck == 1) {
            this.nav_targetService.setOnSave(true);
            // this.Nav_Parktarget_Service.setOnSave(true);
            // this.Nav_Areatarget_Service.setOnSave(true);
        }
        
    }

    async clickDelete() {
        // this.navService.setOnDelete(true); //Old

        var pmCheck = this.permissionCheck('IsDelete')
        if (await pmCheck != 1) {
            swal('', 'ผู้ใช้งานไม่มีสิทธิ์ลบข้อมูล กรุณาติดต่อผู้ดูแลระบบ', 'warning');
        } else if (await pmCheck == 1) {
            this.nav_targetService.setOnDelete(true);
            // this.Nav_Parktarget_Service.setOnDelete(true);
            // this.Nav_Areatarget_Service.setOnDelete(true);
        }
    }

   
    async permissionCheck(subscribe) {
        var userAccountID = localStorage.getItem('UserAccountID')
        var programCode = localStorage.getItem('programcode')
        const params = {
            UserAccountID: userAccountID,
            ProgramCode: programCode
        };
        await this.nav_targetService.PermissionCheck(params).then(Res => {
            this.permisCheck = Res;
            console.log('subscribe : ', subscribe)
            console.log('params : ', params)
            console.log('PermisRes : ', this.permisCheck)
            if (subscribe == 'IsCreate') {
                this.perBeforReturn = !this.permisCheck ? this.permisCheck = { "IsCreate": 0 } : this.permisCheck.IsCreate;
                // this.perBeforReturn = this.permisCheck.IsCreate;
            } else if (subscribe == 'IsDelete') {
                this.perBeforReturn = !this.permisCheck ? this.permisCheck = { "IsDelete": 0 } : this.permisCheck.IsDelete;
            } else if (subscribe == 'IsRead') {
                this.perBeforReturn = !this.permisCheck ? this.permisCheck = { "IsRead": 0 } : this.permisCheck.IsRead;
            } else if (subscribe == 'IsUpdate') {
                this.perBeforReturn = !this.permisCheck ? this.permisCheck = { "IsUpdate": 0 } : this.permisCheck.IsUpdate;
            }

        }, (error) => { console.error('error : ', error); });

        return this.perBeforReturn
    }

}
