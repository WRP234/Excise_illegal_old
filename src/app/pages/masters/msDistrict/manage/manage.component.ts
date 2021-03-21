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

@Component({
    selector: 'app-manage',
    templateUrl: './manage.component.html'
})
export class ManageComponent extends MastersConfig {
    private sub: any;

    mode: string;
    modal: any;
    showEditField: any;
    paginage = pagination;
    isRequired: boolean | false;

    DISTRICT_ID: string;
    DISTRICT_CODE: string;
    DISTRICT_NAME_TH: string;
    DISTRICT_NAME_EN: string;
    PROVINCE_ID: string;
    PROVINCE_NAME: string;
    IS_ACTIVE: any;
    chk1: any;

    oParam: any;

    rawOptions = [];
    options = [];

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

        await this.getProvince();

        if (this.mode == "R") {
            await this.ShowMasterData();
        } else {
            this.DISTRICT_ID = "Auto Generate";
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
                        this.DISTRICT_ID = p['code'];
                    }
                    break;
            }
        });
    }

    ShowMasterData() {
        var paramsOther = {
            TEXT_SEARCH: "",
            PROVINCE_ID: "",
            DISTRICT_ID: this.DISTRICT_ID
        }

        this.MasService.getByKeyword("MasDistrictgetByCon", paramsOther).then(list => {
            if (list.RESPONSE_DATA.length > 0) {
                this.DISTRICT_CODE = list.RESPONSE_DATA[0].DISTRICT_CODE;
                this.DISTRICT_NAME_TH = list.RESPONSE_DATA[0].DISTRICT_NAME_TH;
                this.DISTRICT_NAME_EN = list.RESPONSE_DATA[0].DISTRICT_NAME_EN;
                this.PROVINCE_ID = list.RESPONSE_DATA[0].PROVINCE_ID;
                this.PROVINCE_NAME = list.RESPONSE_DATA[0].PROVINCE_NAME_TH;
                this.IS_ACTIVE = list.RESPONSE_DATA[0].IS_ACTIVE;
                this.chk1 = `${this.IS_ACTIVE == "1" ? true : false}`;

                this.preloader.setShowPreloader(false);
            } else {
                this.ShowAlertError("พบปัญหาที่ API MasDistrictgetByCon");
                this.preloader.setShowPreloader(false);
                this.router.navigate(['/msDistrict/list']);
            }
        }, (err: HttpErrorResponse) => {
            this.ShowAlertError("API MasDistrictgetByCon :: " + err.message);
        });
    }

    async OnSave() {
        if (this.DISTRICT_CODE == null || this.DISTRICT_CODE == undefined
            || this.DISTRICT_NAME_TH == null || this.DISTRICT_NAME_TH == undefined
            || this.DISTRICT_NAME_EN == null || this.DISTRICT_NAME_EN == undefined
            || this.PROVINCE_ID == null || this.PROVINCE_ID == undefined
        ) {
            this.isRequired = true;
            this.ShowAlertWarning(Message.checkData);

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
                    this.router.navigate(['/msDistrict/list']);
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

    setData() {
        this.IS_ACTIVE = `${this.chk1 ? "1" : "0"}`;
        this.DISTRICT_ID = `${this.DISTRICT_ID == "Auto Generate" ? "" : this.DISTRICT_ID}`;

        this.oParam = {
            DISTRICT_ID: this.DISTRICT_ID,
            DISTRICT_CODE: this.DISTRICT_CODE,
            DISTRICT_NAME_TH: this.DISTRICT_NAME_TH,
            DISTRICT_NAME_EN: this.DISTRICT_NAME_EN,
            PROVINCE_ID: this.PROVINCE_ID,
            IS_ACTIVE: this.IS_ACTIVE
        }
    }

    async onIns() {
        this.preloader.setShowPreloader(true);
        await this.setData();

        this.MasService.MasinsAll("MasDistrictinsAll", this.oParam).then(async item => {
            if (item.SUCCESS) {
                this.DISTRICT_ID = item.RESPONSE_DATA;
                this.ShowAlertSuccess(Message.saveComplete);
                this.onComplete();

                this.preloader.setShowPreloader(false);
                this.router.navigate([`/msDistrict/manage/R/${this.DISTRICT_ID}`]);
            } else {
                this.ShowAlertError(Message.saveFail);
                this.preloader.setShowPreloader(false);
            }
        }, (error) => { console.error(error); return false; });
    }

    async onUdp() {
        this.preloader.setShowPreloader(true);
        await this.setData();

        this.MasService.MasUpdAll("MasDistrictupdAll", this.oParam).then(async item => {
            if (item.SUCCESS) {
                this.ShowAlertSuccess(Message.saveComplete);

                if(this.oParam.IS_ACTIVE == "1"){
                    this.onComplete();
                    await this.ShowMasterData();
                } else{
                    this.router.navigate(['/msDistrict/list']);
                }

                this.preloader.setShowPreloader(false);
            } else {
                this.ShowAlertError(Message.saveFail);
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

    // **********************************
    // -------------- Alert -------------
    // **********************************
    ShowAlertWarning(alertText: string) {
        swal({
            title: '',
            text: alertText,
            type: 'warning',
            confirmButtonText: 'ตกลง'
        });
    }

    ShowAlertSuccess(alertText: string) {
        swal({
            title: '',
            text: alertText,
            type: 'success',
            confirmButtonText: 'ตกลง'
        });
    }

    ShowAlertError(alertText: string) {
        swal({
            title: '',
            text: alertText,
            type: 'error',
            confirmButtonText: 'ตกลง'
        });
    }


    // ----- จังหวัด -----
    async getProvince() {
        var paramsOther = {
            TEXT_SEARCH: "",
            PROVINCE_ID: ""
        }

        this.MasService.getByKeyword("MasProvincegetByCon", paramsOther).then(res => {
            if (res.RESPONSE_DATA.length > 0) {
                this.rawOptions = res.RESPONSE_DATA;
            }
        }, (err: HttpErrorResponse) => { });
    }

    onAutoChange(value: string) {
        if (value == '') {
            this.options = [];

            this.PROVINCE_ID = "";
        } else {
            this.options = this.rawOptions.filter(f => f.PROVINCE_NAME_TH.toLowerCase().indexOf(value.toLowerCase()) > -1);
        }
    }

    onAutoFocus(value: string) {
        if (value == '') {
            this.options = [];
        }
    }

    onAutoSelecteWord(event) {
        this.PROVINCE_ID = event.PROVINCE_ID;
        this.PROVINCE_NAME = event.PROVINCE_NAME_TH;
    }
    // ----- End จังหวัด -----
}
