import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { MasterService } from '../../masters.service';
import { MatAutocomplete } from '@angular/material';
import * as formatDate from '../../../../config/dateFormat';
import { Message } from '../../../../config/message';
import { PreloaderService } from '../../../../shared/preloader/preloader.component';
import { toLocalShort, compareDate, setZeroHours, setDateMyDatepicker, getDateMyDatepicker } from '../../../../config/dateFormat';
import { IMyDateModel, IMyOptions } from 'mydatepicker-th';
import swal from 'sweetalert2';
import { pagination } from '../../../../config/pagination';
import { async } from '../../../../../../node_modules/@types/q';
import { MastersConfig } from '../../masters.config';
import { BehaviorSubject } from '../../../../../../node_modules/rxjs';

@Component({
    selector: 'app-manage',
    templateUrl: './manage.component.html'
})
// , OnInit, OnDestroy
export class ManageComponent extends MastersConfig {
    private sub: any;

    mode: string;
    modal: any;
    showEditField: any;
    paginage = pagination;
    isRequired: boolean | false;

    COURT_ID: string;
    COURT_CODE: string;
    COURT_NAME: string;
    IS_ACTIVE: any;
    chk1: any;

    oParam: any;

    isReq_courtCode = new BehaviorSubject<boolean>(false);
    isReq_courtName = new BehaviorSubject<boolean>(false);

    // ----- Model ------ //
    //@ViewChild('printDocModal') printDocModel: ElementRef;

    constructor(
        private activeRoute: ActivatedRoute,
        private ngbModel: NgbModal,
        private MasService: MasterService,
        private preloader: PreloaderService,
        private router: Router
    ) {
        super();
    }

    async ngOnInit() {
        this.preloader.setShowPreloader(true);
        this.active_Route();
        
        if (this.mode == "R") {
            await this.ShowMasterData();
        } else {
            this.COURT_ID = "Auto Generate";
            this.chk1 = true;
            this.preloader.setShowPreloader(false);
        }
    }

    private active_Route() {
        this.sub = this.activeRoute.params.subscribe(p => {
            this.mode = p['mode'];

            switch (this.mode) {
                case 'C':
                    // set false
                    this.PrintButton.next(false);
                    this.EditButton.next(false);
                    this.DeleteButton.next(false);
                    this.showEditField = false;
                    // set true
                    this.SaveButton.next(true);
                    this.CancelButton.next(true);
                    break;

                case 'R':
                    // set false
                    this.SaveButton.next(false);
                    this.CancelButton.next(false);
                    this.PrintButton.next(false);

                    // set true  
                    this.EditButton.next(true);
                    this.DeleteButton.next(true);
                    this.showEditField = true;

                    if (p['code']) {
                        this.COURT_ID = p['code'];
                    }
                    break;
            }
        });
    }

    ShowMasterData() {
        var paramsOther = {
            TEXT_SEARCH: "",
            COURT_ID: this.COURT_ID
        }

        this.MasService.getByKeyword("MasCourtgetByCon", paramsOther).then(list => {
            if (list.RESPONSE_DATA.length > 0) {
                this.COURT_CODE = list.RESPONSE_DATA[0].COURT_CODE;
                this.COURT_NAME = list.RESPONSE_DATA[0].COURT_NAME;
                this.IS_ACTIVE = list.RESPONSE_DATA[0].IS_ACTIVE;
                this.chk1 = `${this.IS_ACTIVE == "1" ? true : false}`;

                this.preloader.setShowPreloader(false);
            } else {
                swal('', "พบปัญหาที่ API MasCourtgetByCon", 'error');
                this.preloader.setShowPreloader(false);
                this.router.navigate(['/msCourt/list']);
            }
        }, (err: HttpErrorResponse) => {
            swal('', "API MasCourtgetByCon :: " + err.message, 'error');
        });
    }

    async OnSave() {
        if (this.COURT_CODE == null || this.COURT_CODE == undefined || this.COURT_CODE == "") {
            this.isReq_courtCode.next(true);
            swal('', "กรุณาระบุข้อมูล 'รหัสศาล'", 'warning');

            return false;
        }

        if (this.COURT_NAME == null || this.COURT_NAME == undefined || this.COURT_NAME == "") {
            this.isReq_courtName.next(true);
            swal('', "กรุณาระบุข้อมูล 'ชื่อศาล'", 'warning');

            return false;
        }

        if (this.mode === 'C') {
            await this.onIns();
        } else if (this.mode === 'R') {
            await this.onUdp();
        }
    }

    OnEdit() {
        this.showEditField = false;
        this.SaveButton.next(true);
        this.CancelButton.next(true);

        this.EditButton.next(false);
        this.DeleteButton.next(false);
    }

    OnCancel() {
        swal({
            title: '',
            text: Message.confirmAction,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.value) {
                if (this.mode === 'C') {
                    this.router.navigate(['/msCourt/list']);
                } else if (this.mode === 'R') {
                    this.ShowMasterData();
                    
                    // set false
                    this.SaveButton.next(false);
                    this.CancelButton.next(false);
                    this.PrintButton.next(false);

                    // set true  
                    this.EditButton.next(true);
                    this.DeleteButton.next(true);
                    this.showEditField = true;
                }
            }
        });
    }

    /*
    OnDelete() {
        swal({
            title: '',
            text: Message.confirmAction,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.value) {
                this.oParam = {
                    COURT_ID: this.COURT_ID
                }
                
                this.MasService.MasDelAll("MasCourtupdDelete", this.oParam).then(async IsSuccess => {
                    if (IsSuccess) {
                        //this.ShowAlertSuccess(Message.saveComplete);
                        this.router.navigate(['/msCourt/list']);
                    } else {
                        this.ShowAlertError(Message.saveFail);
                    }
                }, (error) => { console.error(error); });
            }
        })
    }
*/

    setData(){
        this.IS_ACTIVE = `${this.chk1 ? "1" : "0"}`;
        this.COURT_ID = `${this.COURT_ID == "Auto Generate" ? "" : this.COURT_ID}`;

        this.oParam = {
            COURT_ID: this.COURT_ID,
            COURT_CODE: this.COURT_CODE,
            COURT_NAME: this.COURT_NAME,
            IS_ACTIVE: this.IS_ACTIVE
        }
    }

    async onIns() {
        this.preloader.setShowPreloader(true);
        await this.setData();

        this.MasService.MasinsAll("MasCourtinsAll", this.oParam).then(async item => {
            if (item.SUCCESS) {
                this.COURT_ID = item.RESPONSE_DATA;
                swal('', Message.saveComplete, 'success');
                this.onComplete();

                this.preloader.setShowPreloader(false);
                this.router.navigate([`/msCourt/manage/R/${this.COURT_ID}`]);
            } else {
                swal('', Message.saveFail, 'error');
                this.preloader.setShowPreloader(false);
            }
        }, (error) => { console.error(error); return false; });
    }

    async onUdp() {
        this.preloader.setShowPreloader(true);
        await this.setData();

        this.MasService.MasUpdAll("MasCourtupdAll", this.oParam).then(async item => {
            if (item.SUCCESS) {
                swal('', Message.saveComplete, 'success');

                if(this.oParam.IS_ACTIVE == "1"){
                    this.onComplete();
                    await this.ShowMasterData();
                } else{
                    this.router.navigate(['/msCourt/list']);
                }

                this.preloader.setShowPreloader(false);
            } else {
                swal('', Message.saveFail, 'error');
            this.preloader.setShowPreloader(false);
            }
        }, (error) => { console.error(error); return false; });
    }

    onComplete() {
        this.showEditField = true;
        this.EditButton.next(true);
        this.DeleteButton.next(true);

        this.CancelButton.next(false);
        this.SaveButton.next(false);
    }
}
