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

    UNIT_ID: string;
    UNIT_NAME_TH: string;
    UNIT_NAME_EN: string;
    UNIT_SHORT_NAME: string;
    CREATE_DATE: any;
    EXPIRE_DATE: any;
    IS_ACTIVE: any;
    chk1: any;

    oParam: any;

    isReq_unitNameTH = new BehaviorSubject<boolean>(false);
    isReq_unitNameEN = new BehaviorSubject<boolean>(false);
    isReq_unitShortName = new BehaviorSubject<boolean>(false);
    isReq_createDate = new BehaviorSubject<boolean>(false);
    isReq_expDate = new BehaviorSubject<boolean>(false);

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

        this.CREATE_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));
        this.EXPIRE_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));

        if (this.mode == "R") {
            await this.ShowMasterData();
        } else {
            this.UNIT_ID = "Auto Generate";
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
                        this.UNIT_ID = p['code'];
                    }
                    break;
            }
        });
    }

    ShowMasterData() {
        var paramsOther = {
            UNIT_ID: this.UNIT_ID
        }

        this.MasService.getByKeyword("MasProductUnitgetByCon", paramsOther).then(list => {
            if (list.RESPONSE_DATA.length > 0) {
                this.UNIT_NAME_TH = list.RESPONSE_DATA[0].UNIT_NAME_TH;
                this.UNIT_NAME_EN = list.RESPONSE_DATA[0].UNIT_NAME_EN;
                this.UNIT_SHORT_NAME = list.RESPONSE_DATA[0].UNIT_SHORT_NAME;
                this.chk1 = `${this.IS_ACTIVE == "1" ? true : false}`;

                var EffDate = list.RESPONSE_DATA[0].CREATE_DATE.toString().split(" ");
                this.CREATE_DATE = setDateMyDatepicker(new Date(EffDate[0]));

                var ExpDate = list.RESPONSE_DATA[0].EFEXPIRE_DATE.toString().split(" ");
                this.EXPIRE_DATE = setDateMyDatepicker(new Date(ExpDate[0]));

                this.preloader.setShowPreloader(false);
            } else {
                if (list.SUCCESS == false)
                    swal('', "พบปัญหาที่ API MasProductUnitgetByCon", 'error');

                this.preloader.setShowPreloader(false);
                this.router.navigate(['/msProductUnit/list']);
            }
        }, (err: HttpErrorResponse) => {
            swal('', "API MasProductUnitgetByCon :: " + err.message, 'error');
        });
    }

    async OnSave() {
        if (this.UNIT_NAME_TH == null || this.UNIT_NAME_TH == undefined || this.UNIT_NAME_TH == "") {
            this.isReq_unitNameTH.next(true);
            swal('', "กรุณาระบุข้อมูล 'ชื่อหน่วยปริมาณภาษาไทย'", 'warning');

            return false;
        }

        if (this.UNIT_NAME_EN == null || this.UNIT_NAME_EN == undefined || this.UNIT_NAME_EN == "") {
            this.isReq_unitNameEN.next(true);
            swal('', "กรุณาระบุข้อมูล 'ชื่อหน่วยปริมาณภาษาอังกฤษ'", 'warning');

            return false;
        }

        if (this.UNIT_SHORT_NAME == null || this.UNIT_SHORT_NAME == undefined || this.UNIT_SHORT_NAME == "") {
            this.isReq_unitShortName.next(true);
            swal('', "กรุณาระบุข้อมูล 'ชื่อย่อหน่วยปริมาณ'", 'warning');

            return false;
        }

        if (this.CREATE_DATE == null || this.CREATE_DATE == undefined || this.CREATE_DATE == "") {
            this.isReq_createDate.next(true);
            swal('', "กรุณาระบุข้อมูล 'วันที่เริ่มใช้งาน'", 'warning');

            return false;
        }

        if (this.EXPIRE_DATE == null || this.EXPIRE_DATE == undefined || this.EXPIRE_DATE == "") {
            this.isReq_expDate.next(true);
            swal('', "กรุณาระบุข้อมูล 'วันที่สิ้นสุดใช้งาน'", 'warning');

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
                    this.router.navigate(['/msProductUnit/list']);
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

    setData() {
        this.IS_ACTIVE = `${this.chk1 ? "1" : "0"}`;
        this.UNIT_ID = `${this.UNIT_ID == "Auto Generate" ? "" : this.UNIT_ID}`;

        let EffDate, cvEffDate, ExpDate, cvExpDate;

        EffDate = this.EXPIRE_DATE.date;
        if (EffDate != undefined) {
            cvEffDate = EffDate.year + '-' + EffDate.month + '-' + EffDate.day;
        }

        ExpDate = this.EXPIRE_DATE.date;
        if (ExpDate != undefined) {
            cvExpDate = ExpDate.year + '-' + ExpDate.month + '-' + ExpDate.day;
        }

        this.oParam = {
            UNIT_ID: this.UNIT_ID,
            UNIT_NAME_TH: this.UNIT_NAME_TH,
            UNIT_NAME_EN: this.UNIT_NAME_EN,
            UNIT_SHORT_NAME: this.UNIT_SHORT_NAME,
            CREATE_DATE: setZeroHours(cvEffDate),
            EFEXPIRE_DATE: setZeroHours(cvExpDate),
            CREATE_USER_ACCOUNT_ID: localStorage.getItem("staffCode"),
            IS_ACTIVE: this.IS_ACTIVE
        }
    }

    async onIns() {
        this.preloader.setShowPreloader(true);
        await this.setData();

        this.MasService.MasinsAll("MasProductUnitinsAll", this.oParam).then(async item => {
            if (item.SUCCESS) {
                this.UNIT_ID = item.RESPONSE_DATA;
                swal('', Message.saveComplete, 'success');
                this.onComplete();

                this.preloader.setShowPreloader(false);
                this.router.navigate([`/msProductUnit/manage/R/${this.UNIT_ID}`]);
            } else {
                swal('', Message.saveFail, 'error');
                this.preloader.setShowPreloader(false);
            }
        }, (error) => { console.error(error); return false; });
    }

    async onUdp() {
        this.preloader.setShowPreloader(true);
        await this.setData();

        this.MasService.MasUpdAll("MasProductUnitupdAll", this.oParam).then(async item => {
            if (item.SUCCESS) {
                swal('', Message.saveComplete, 'success');

                if (this.oParam.IS_ACTIVE == "1") {
                    this.onComplete();
                    await this.ShowMasterData();
                } else {
                    this.router.navigate(['/msProductUnit/list']);
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

    getCurrentDate() {
        let date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).toISOString().substring(0, 10);
    }

    getCurrentTime() {
        let date = new Date();
        return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false }) + " น.";
    }
}
