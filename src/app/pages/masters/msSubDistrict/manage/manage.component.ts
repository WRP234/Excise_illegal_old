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
// , OnInit, OnDestroy
export class ManageComponent extends MastersConfig {
    private sub: any;

    mode: string;
    modal: any;
    showEditField: any;
    paginage = pagination;
    isRequired: boolean | false;

    SUB_DISTRICT_ID: string;
    SUB_DISTRICT_CODE: string;
    SUB_DISTRICT_NAME_TH: string;
    SUB_DISTRICT_NAME_EN: string;
    DISTRICT_ID: string;
    DISTRICT_NAME: string;
    OFFICE_CODE: string;
    OFFICE_NAME: string;
    ZIP_CODE: string;
    IS_ACTIVE: any;
    chk1: any;

    oParam: any;

    rawOptions = [];
    options = [];

    FrawOptions = [];
    Foptions = [];

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

        await this.getDistrict();
        await this.getStation();

        if (this.mode == "R") {
            await this.ShowMasterData();
        } else {
            this.SUB_DISTRICT_ID = "Auto Generate";
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
                        this.SUB_DISTRICT_ID = p['code'];
                    }
                    break;
            }
        });
    }

    ShowMasterData() {
        var paramsOther = {
            TEXT_SEARCH: "",
            SUB_DISTRICT_ID: this.SUB_DISTRICT_ID
        }

        this.MasService.getByKeyword("MasSubDistrictgetByCon", paramsOther).then(list => {
            if (list.RESPONSE_DATA.length > 0) {
                this.SUB_DISTRICT_CODE = list.RESPONSE_DATA[0].SUB_DISTRICT_CODE;
                this.SUB_DISTRICT_NAME_TH = list.RESPONSE_DATA[0].SUB_DISTRICT_NAME_TH;
                this.SUB_DISTRICT_NAME_EN = list.RESPONSE_DATA[0].SUB_DISTRICT_NAME_EN;
                this.DISTRICT_ID = list.RESPONSE_DATA[0].DISTRICT_ID;
                this.DISTRICT_NAME = list.RESPONSE_DATA[0].DISTRICT_NAME_TH + " ( จังหวัด" + list.RESPONSE_DATA[0].PROVINCE_NAME_TH + " )";
                this.OFFICE_CODE = list.RESPONSE_DATA[0].OFFICE_CODE;
                this.OFFICE_NAME = list.RESPONSE_DATA[0].OFFICE_CODE;
                this.ZIP_CODE = list.RESPONSE_DATA[0].ZIP_CODE;
                this.IS_ACTIVE = list.RESPONSE_DATA[0].IS_ACTIVE;
                this.chk1 = `${this.IS_ACTIVE == "1" ? true : false}`;

                this.preloader.setShowPreloader(false);
            } else {
                this.ShowAlertError("พบปัญหาที่ API MasSubDistrictgetByCon");
                this.preloader.setShowPreloader(false);
                this.router.navigate(['/msSubDistrict/list']);
            }
        }, (err: HttpErrorResponse) => {
            this.ShowAlertError("API MasSubDistrictgetByCon :: " + err.message);
        });
    }

    async OnSave() {
        if (this.SUB_DISTRICT_CODE == null || this.SUB_DISTRICT_CODE == undefined
            || this.SUB_DISTRICT_NAME_TH == null || this.SUB_DISTRICT_NAME_TH == undefined
            || this.SUB_DISTRICT_NAME_EN == null || this.SUB_DISTRICT_NAME_EN == undefined
            || this.DISTRICT_ID == null || this.DISTRICT_ID == undefined
            || this.OFFICE_CODE == null || this.OFFICE_CODE == undefined
            || this.ZIP_CODE == null || this.ZIP_CODE == undefined
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
                    this.router.navigate(['/msSubDistrict/list']);
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
        this.SUB_DISTRICT_ID = `${this.SUB_DISTRICT_ID == "Auto Generate" ? "" : this.SUB_DISTRICT_ID}`;

        this.oParam = {
            SUB_DISTRICT_ID: this.SUB_DISTRICT_ID,
            SUB_DISTRICT_CODE: this.SUB_DISTRICT_CODE,
            SUB_DISTRICT_NAME_TH: this.SUB_DISTRICT_NAME_TH,
            SUB_DISTRICT_NAME_EN: this.SUB_DISTRICT_NAME_EN,
            DISTRICT_ID: this.DISTRICT_ID,
            OFFICE_CODE: this.OFFICE_CODE,
            ZIP_CODE: this.ZIP_CODE,
            IS_ACTIVE: this.IS_ACTIVE
        }
    }

    async onIns() {
        this.preloader.setShowPreloader(true);
        await this.setData();

        this.MasService.MasinsAll("MasSubDistrictinsAll", this.oParam).then(async item => {
            if (item.SUCCESS) {
                this.SUB_DISTRICT_ID = item.RESPONSE_DATA;
                this.ShowAlertSuccess(Message.saveComplete);
                this.onComplete();

                this.preloader.setShowPreloader(false);
                this.router.navigate([`/msSubDistrict/manage/R/${this.SUB_DISTRICT_ID}`]);
            } else {
                this.ShowAlertError(Message.saveFail);
                this.preloader.setShowPreloader(false);
            }
        }, (error) => { console.error(error); return false; });
    }

    async onUdp() {
        this.preloader.setShowPreloader(true);
        await this.setData();

        this.MasService.MasUpdAll("MasSubDistrictupdAll", this.oParam).then(async item => {
            if (item.SUCCESS) {
                this.ShowAlertSuccess(Message.saveComplete);
                
                if(this.oParam.IS_ACTIVE == "1"){
                    this.onComplete();
                    await this.ShowMasterData();
                } else{
                    this.router.navigate(['/msSubDistrict/list']);
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


    // ----- อำเภอ -----
    async getDistrict() {
        var paramsOther = {
            TEXT_SEARCH: "",
            DISTRICT_ID: ""
        }

        this.MasService.getByKeyword("MasDistrictgetByCon", paramsOther).then(res => {
            if (res.RESPONSE_DATA.length > 0) {
                this.rawOptions = res.RESPONSE_DATA;
            }
        }, (err: HttpErrorResponse) => { });
    }

    onAutoChange(value: string) {
        if (value == '') {
            this.options = [];

            this.DISTRICT_ID = "";
        } else {
            this.rawOptions.map(m => {
                m.DISTRICT_NAME = m.DISTRICT_NAME_TH + " ( จังหวัด" + m.PROVINCE_NAME_TH + " )"
            });

            this.options = this.rawOptions.filter(f => f.DISTRICT_NAME.toLowerCase().indexOf(value.toLowerCase()) > -1);
        }
    }

    onAutoFocus(value: string) {
        if (value == '') {
            this.options = [];
        }
    }

    onAutoSelecteWord(event) {
        this.DISTRICT_ID = event.DISTRICT_ID;
        this.DISTRICT_NAME = event.DISTRICT_NAME;
    }
    // ----- End อำเภอ -----


    // --- หน่วยงาน ---
    async getStation() {
        await this.MasService.getStation().then(res => {
            if (res) {
                this.FrawOptions = res;
            }

        }, (err: HttpErrorResponse) => {
            //alert(err.message);
        });
    }

    OfficeonAutoChange(value: string) {
        // 
        if (value == '') {
            this.Foptions = [];

            this.OFFICE_CODE = "";
            this.OFFICE_NAME = "";
        } else {
            this.Foptions = this.FrawOptions.filter(f => f.OfficeName.toLowerCase().indexOf(value.toLowerCase()) > -1);
        }
    }

    OfficeonAutoFocus(value: string) {
        if (value == '') {
            this.Foptions = [];
        }
    }

    OfficeonAutoSelecteWord(event) {
        this.OFFICE_CODE = event.OfficeCode;
        this.OFFICE_NAME = event.OfficeName;
    }
    // ----- End หน่วยงาน ---
}
