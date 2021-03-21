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

    REWARD_DIVISION_ID: string;
    FIRST_PART: string;       // สัดส่วนเงินส่วนแรก
    SECOND_PART: string;      // สัดส่วนเงินส่วนหลัง
    TOTAL_PART: string;       // สัดส่วนทั้งหมด
    EFFECTIVE_DATE: any;      // วันที่เริ่มมีผล
    //EFEXPIRE_DATE: any;     // วันที่สิ้นสุด

    oParam: any;

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
                        this.REWARD_DIVISION_ID = p['code'];
                    }
                    break;
            }
        });
    }

    ShowMasterData() {
        var paramsOther = {
            TEXT_SEARCH: "",
            REWARD_DIVISION_ID: `${this.REWARD_DIVISION_ID == "0" ? "" : this.REWARD_DIVISION_ID}`
        }

        this.MasService.getByKeyword("MasRewardDivisiongetByCon", paramsOther).then(list => {
            if (list.RESPONSE_DATA.length > 0) {
                this.REWARD_DIVISION_ID = list.RESPONSE_DATA[0].REWARD_DIVISION_ID;
                this.FIRST_PART = (+list.RESPONSE_DATA[0].FIRST_PART).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
                this.SECOND_PART = (+list.RESPONSE_DATA[0].SECOND_PART).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
                var EffDate = list.RESPONSE_DATA[0].EFFECTIVE_DATE.toString().split(" ");
                this.EFFECTIVE_DATE = setDateMyDatepicker(new Date(EffDate[0]));
                //this.EFEXPIRE_DATE = list.RESPONSE_DATA[0].EFEXPIRE_DATE;
                
                this.CalTotalPart();

                this.PrintButton.next(false);
                this.DeleteButton.next(false);
                this.SaveButton.next(false);
                this.CancelButton.next(false);

                this.showEditField = true;
                this.EditButton.next(true);
            } else {
                this.REWARD_DIVISION_ID = "Auto Generate";
                this.EFFECTIVE_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));
                //this.EFEXPIRE_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));
                //this.EFEXPIRE_DATE = setDateMyDatepicker(new Date("9456-12-31"));

                // set false
                this.PrintButton.next(false);
                this.EditButton.next(false);
                this.DeleteButton.next(false);
                this.showEditField = false;
                // set true
                this.SaveButton.next(true);
                this.CancelButton.next(true);
            }

            this.preloader.setShowPreloader(false);
        }, (err: HttpErrorResponse) => {
            this.ShowAlertError("API MasDivisionRategetByCon :: " + err.message);
        });
    }

    async OnSave() {
        if (this.FIRST_PART == null || this.FIRST_PART == undefined
            || this.SECOND_PART == null || this.SECOND_PART == undefined
            || this.EFFECTIVE_DATE == null || this.EFFECTIVE_DATE == undefined
            //|| this.EFEXPIRE_DATE == null || this.EFEXPIRE_DATE == undefined
        ) {
            this.isRequired = true;
            this.ShowAlertWarning(Message.checkData);

            return false;
        }

        if (this.REWARD_DIVISION_ID === "Auto Generate") {
            await this.onIns();
        } else {
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
                if (this.REWARD_DIVISION_ID === "Auto Generate") {
                    this.FIRST_PART = "";
                    this.SECOND_PART = "";
                    this.TOTAL_PART = "";
                    this.EFFECTIVE_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));
                } else {
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
        let EffDate, cvEffDate, ExpDate, cvExpDate;

        EffDate = this.EFFECTIVE_DATE.date;
        if (EffDate != undefined) {
            cvEffDate = EffDate.year + '-' + EffDate.month + '-' + EffDate.day;
        }

        // ExpDate = this.EFEXPIRE_DATE.date;
        // if (EffDate != undefined) {
        //     cvExpDate = ExpDate.year + '-' + ExpDate.month + '-' + ExpDate.day;
        // }

        this.REWARD_DIVISION_ID = `${this.REWARD_DIVISION_ID == "Auto Generate" ? "" : this.REWARD_DIVISION_ID}`;

        this.oParam = {
            REWARD_DIVISION_ID: this.REWARD_DIVISION_ID,
            FIRST_PART: this.FIRST_PART.replace(/,/g, ""),
            SECOND_PART: this.SECOND_PART.replace(/,/g, ""),
            EFFECTIVE_DATE: cvEffDate,
            EFEXPIRE_DATE: "",
            IS_ACTIVE: "1"
        }
    }

    async onIns() {
        this.preloader.setShowPreloader(true);
        await this.setData();

        this.MasService.MasinsAll("MasRewardDivisioninsAll", this.oParam).then(async item => {
            if (item.SUCCESS) {
                this.REWARD_DIVISION_ID = item.RESPONSE_DATA;
                this.ShowAlertSuccess(Message.saveComplete);
                this.onComplete();

                this.preloader.setShowPreloader(false);
                this.router.navigate([`/msRawardDivision/manage/${this.REWARD_DIVISION_ID}`]);
            } else {
                this.ShowAlertError(Message.saveFail);
                this.preloader.setShowPreloader(false);
            }
        }, (error) => { console.error(error); return false; });
    }

    async onUdp() {
        this.preloader.setShowPreloader(true);
        await this.setData();

        this.MasService.MasUpdAll("MasRewardDivisionupdAll", this.oParam).then(async item => {
            if (item.SUCCESS) {
                this.ShowAlertSuccess(Message.saveComplete);
                
                if(this.oParam.IS_ACTIVE == "1"){
                    this.onComplete();
                    await this.ShowMasterData();
                } else{
                    this.router.navigate(['/msRawardDivision/list']);
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

    // ----- DateTime -----
    getCurrentDate() {
        let date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).toISOString().substring(0, 10);
    }

    getCurrentTime() {
        let date = new Date();
        return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false }) + " น.";
    }
    // ----- End DateTime -----

    VaridateNumber(event) {
        let e = <KeyboardEvent>event;
        if (e.keyCode > 31 && ((e.keyCode < 48 || e.keyCode > 57) && e.keyCode != 44 && e.keyCode != 46)) {
            return false;
        }
        return true;
    }

    FirstPartFormat() {
        if (this.FIRST_PART)
            this.FIRST_PART = (+this.FIRST_PART.replace(/,/g, "")).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

        this.CalTotalPart();
    }

    SecondPartFormat() {
        if (this.SECOND_PART)
            this.SECOND_PART = (+this.SECOND_PART.replace(/,/g, "")).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

        this.CalTotalPart();
    }

    CalTotalPart() {
        if (this.FIRST_PART && this.SECOND_PART)
            this.TOTAL_PART = (+this.FIRST_PART.replace(/,/g, "") + +this.SECOND_PART.replace(/,/g, "")).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }
}
