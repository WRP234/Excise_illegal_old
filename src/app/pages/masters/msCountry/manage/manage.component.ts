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

    COUNTRY_ID: string;
    COUNTRY_CODE: string;
    COUNTRY_NAME_TH: string;
    COUNTRY_NAME_EN: string;
    COUNTRY_SHORT_NAME: string;
    IS_ACTIVE: any;
    chk1: any;

    oParam: any;

    // ----- Model ------ //
    //@ViewChild('printDocModal') printDocModel: ElementRef;

    constructor(
        private activeRoute: ActivatedRoute,
        private ngbModel: NgbModal,
        private MasService: MasterService,
        private preloader: PreloaderService,
        private router: Router
    ) { super(); }

    async ngOnInit() {
        this.preloader.setShowPreloader(true);
        this.active_Route();

        if (this.mode == "R") {
            await this.ShowMasterData();
        } else {
            this.COUNTRY_ID = "Auto Generate";
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
                        this.COUNTRY_ID = p['code'];
                    }
                    break;
            }
        });
    }

    ShowMasterData(){
        var paramsOther = {
            TEXT_SEARCH: "",
            COUNTRY_ID: this.COUNTRY_ID
        }

        this.MasService.getByKeyword("MasCountrygetByCon", paramsOther).then(list => {
            if(list.RESPONSE_DATA.length > 0){
                this.COUNTRY_CODE = list.RESPONSE_DATA[0].COUNTRY_CODE;
                this.COUNTRY_NAME_TH = list.RESPONSE_DATA[0].COUNTRY_NAME_TH;
                this.COUNTRY_NAME_EN = list.RESPONSE_DATA[0].COUNTRY_NAME_EN;
                this.COUNTRY_SHORT_NAME = list.RESPONSE_DATA[0].COUNTRY_SHORT_NAME;
                this.IS_ACTIVE = list.RESPONSE_DATA[0].IS_ACTIVE;
                this.chk1 = `${this.IS_ACTIVE == "1" ? true : false}`;

                this.preloader.setShowPreloader(false);
            } else {
                this.ShowAlertError("พบปัญหาที่ API MasCountrygetByCon");
                this.preloader.setShowPreloader(false);
                this.router.navigate(['/msCountry/list']);
            }
        }, (err: HttpErrorResponse) => {
            this.ShowAlertError("API MasCountrygetByCon :: " + err.message);
        });
    }

    async OnSave() {
        if (this.COUNTRY_CODE == null || this.COUNTRY_CODE == undefined
            || this.COUNTRY_NAME_TH == null || this.COUNTRY_NAME_TH == undefined
            || this.COUNTRY_NAME_EN == null || this.COUNTRY_NAME_EN == undefined
            || this.COUNTRY_SHORT_NAME == null || this.COUNTRY_SHORT_NAME == undefined) {
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
                    this.router.navigate(['/msCountry/list']);
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

    setData(){
        this.IS_ACTIVE = `${this.chk1 ? "1" : "0"}`;
        this.COUNTRY_ID = `${this.COUNTRY_ID == "Auto Generate" ? "" : this.COUNTRY_ID}`;

        this.oParam = {
            COUNTRY_ID: this.COUNTRY_ID,
            COUNTRY_CODE: this.COUNTRY_CODE,
            COUNTRY_NAME_TH: this.COUNTRY_NAME_TH,
            COUNTRY_NAME_EN: this.COUNTRY_NAME_EN,
            COUNTRY_SHORT_NAME: this.COUNTRY_SHORT_NAME,
            IS_ACTIVE: this.IS_ACTIVE
        }
    }
    
    async onIns() {
        this.preloader.setShowPreloader(true);
        await this.setData();

        this.MasService.MasinsAll("MasCountryinsAll", this.oParam).then(async item => {
            if (item.SUCCESS) {
                this.COUNTRY_ID = item.RESPONSE_DATA;
                this.ShowAlertSuccess(Message.saveComplete);
                this.onComplete();

                this.preloader.setShowPreloader(false);
                this.router.navigate([`/msCountry/manage/R/${this.COUNTRY_ID}`]);
            } else {
                this.ShowAlertError(Message.saveFail);
                this.preloader.setShowPreloader(false);
            }
        }, (error) => { console.error(error); return false; });
    }

    async onUdp() {
        await this.setData();

        this.MasService.MasUpdAll("MasCountryupdAll", this.oParam).then(async item => {
            if (item.SUCCESS) {
                this.ShowAlertSuccess(Message.saveComplete);
                this.onComplete();
                await this.ShowMasterData();
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
}
