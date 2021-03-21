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

    DIVISIONRATE_ID: string;
    TREASURY_RATE: string;   // สัดส่วนเงินส่งคลัง
    BRIBE_RATE: string;      // สัดส่วนเงินสินบน
    REWARD_RATE: string;     // สัดส่วนเงินรางวัล
    BRIBE_MAX_MONEY: string; // เงินสินบนสูงสุด
    REWARD_MAX_MONEY: string;// เงินรางวัลสูงสุด
    EFFECTIVE_DATE: any;     // วันที่เริ่มมีผล
    EXPIRE_DATE: any;      // วันที่สิ้นสุด

    IS_REPORT: boolean;
    IS_RECEIVE: boolean;

    oParam: any;

    isReq_treasuryRate = new BehaviorSubject<boolean>(false);
    isReq_bribeRate = new BehaviorSubject<boolean>(false);
    isReq_bribeMaxMoney = new BehaviorSubject<boolean>(false);
    isReq_rewardRate = new BehaviorSubject<boolean>(false);
    isReq_rewardMaxMoney = new BehaviorSubject<boolean>(false);
    isReq_effectiveDate = new BehaviorSubject<boolean>(false);
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

        this.EFFECTIVE_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));
        this.EXPIRE_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));

        if (this.mode == "R") {
            await this.ShowMasterData();
        } else {
            this.DIVISIONRATE_ID = "Auto Generate";
            this.IS_REPORT = true;
            this.IS_RECEIVE = true;

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
                        this.DIVISIONRATE_ID = p['code'];
                    }
                    break;
            }
        });
    }

    ShowMasterData() {
        var paramsOther = {
            TEXT_SEARCH: "",
            DIVISIONRATE_ID: `${this.DIVISIONRATE_ID == "0" ? "" : this.DIVISIONRATE_ID}`
        }

        this.MasService.getByKeyword("MasDivisionRategetByCon", paramsOther).then(list => {
            if (list.RESPONSE_DATA.length > 0) {
                this.DIVISIONRATE_ID = list.RESPONSE_DATA[0].DIVISIONRATE_ID;
                this.TREASURY_RATE = (+list.RESPONSE_DATA[0].TREASURY_RATE).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
                this.BRIBE_RATE = (+list.RESPONSE_DATA[0].BRIBE_RATE).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
                this.REWARD_RATE = (+list.RESPONSE_DATA[0].REWARD_RATE).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
                this.BRIBE_MAX_MONEY = (+list.RESPONSE_DATA[0].BRIBE_MAX_MONEY).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
                this.REWARD_MAX_MONEY = (+list.RESPONSE_DATA[0].REWARD_MAX_MONEY).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

                if(list.RESPONSE_DATA[0].EFFECTIVE_DATE)
                {
                    var EffDate = list.RESPONSE_DATA[0].EFFECTIVE_DATE.toString().split(" ");
                    this.EFFECTIVE_DATE = setDateMyDatepicker(new Date(EffDate[0]));
                }
                
                if(list.RESPONSE_DATA[0].EXPIRE_DATE){
                    var ExpDate = list.RESPONSE_DATA[0].EXPIRE_DATE.toString().split(" ");
                    this.EXPIRE_DATE = setDateMyDatepicker(new Date(ExpDate[0]));
                }

                if (+this.MappingNullNumberData(this.BRIBE_RATE) > 0)
                    this.IS_REPORT = true;

                if (+this.MappingNullNumberData(this.REWARD_RATE) > 0)
                    this.IS_RECEIVE = true;

                this.PrintButton.next(false);
                this.DeleteButton.next(false);
                this.SaveButton.next(false);
                this.CancelButton.next(false);

                this.showEditField = true;
                this.EditButton.next(true);
            } else {
                this.DIVISIONRATE_ID = "Auto Generate";
                this.EFFECTIVE_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));
                this.EXPIRE_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));
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
            swal('', "พบปัญหาที่ API MasDivisionRategetByCon", 'error');
        });
    }

    async OnSave() {
        if ((this.BRIBE_RATE == null || this.BRIBE_RATE == undefined || this.BRIBE_RATE == "") && this.IS_REPORT) {
            this.isReq_bribeRate.next(true);
            swal('', "กรุณาระบุข้อมูล 'สัดส่วนเงินสินบน'", 'warning');

            return false;
        }

        if ((this.REWARD_RATE == null || this.REWARD_RATE == undefined || this.REWARD_RATE == "") && this.IS_RECEIVE) {
            this.isReq_rewardRate.next(true);
            swal('', "กรุณาระบุข้อมูล 'สัดส่วนเงินรางวัล'", 'warning');

            return false;
        }

        if (this.TREASURY_RATE == null || this.TREASURY_RATE == undefined || this.TREASURY_RATE == "") {
            this.isReq_treasuryRate.next(true);
            swal('', "กรุณาระบุข้อมูล 'สัดส่วนเงินส่งคลัง'", 'warning');

            return false;
        }

        if ((this.BRIBE_MAX_MONEY == null || this.BRIBE_MAX_MONEY == undefined || this.BRIBE_MAX_MONEY == "") && this.IS_REPORT) {
            this.isReq_bribeMaxMoney.next(true);
            swal('', "กรุณาระบุข้อมูล 'เงินสินบนสูงสุด'", 'warning');

            return false;
        }

        if ((this.REWARD_MAX_MONEY == null || this.REWARD_MAX_MONEY == undefined || this.REWARD_MAX_MONEY == "") && this.IS_RECEIVE) {
            this.isReq_rewardMaxMoney.next(true);
            swal('', "กรุณาระบุข้อมูล 'เงินรางวัลสูงสุด'", 'warning');

            return false;
        }

        if (this.EFFECTIVE_DATE == null || this.EFFECTIVE_DATE == undefined || this.EFFECTIVE_DATE == "") {
            this.isReq_effectiveDate.next(true);
            swal('', "กรุณาระบุข้อมูล 'วันที่เริ่มใช้งาน'", 'warning');

            return false;
        }

        if (this.EXPIRE_DATE == null || this.EXPIRE_DATE == undefined || this.EXPIRE_DATE == "") {
            this.isReq_expDate.next(true);
            swal('', "กรุณาระบุข้อมูล 'วันที่สิ้นสุดใช้งาน'", 'warning');

            return false;
        }

        if (this.mode == "C") {
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
                if (this.DIVISIONRATE_ID === "Auto Generate") {
                    this.BRIBE_RATE = "";
                    this.REWARD_RATE = "";
                    this.TREASURY_RATE = "";
                    this.BRIBE_MAX_MONEY = "";
                    this.REWARD_MAX_MONEY = "";
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
            cvEffDate = EffDate.year + '-' + ("0" + EffDate.month).slice(-2) + '-' + ("0" + EffDate.day).slice(-2);
        }

        ExpDate = this.EXPIRE_DATE.date;
        if (EffDate != undefined) {
            cvExpDate = ExpDate.year + '-' + ("0" + ExpDate.month).slice(-2) + '-' + ("0" + ExpDate.day).slice(-2);
        }

        this.DIVISIONRATE_ID = `${this.DIVISIONRATE_ID == "Auto Generate" ? "" : this.DIVISIONRATE_ID}`;

        this.oParam = {
            DIVISIONRATE_ID: this.DIVISIONRATE_ID,
            TREASURY_RATE: `${this.TREASURY_RATE == null ? "" : this.TREASURY_RATE.replace(/,/g, "")}`,
            BRIBE_RATE: `${this.BRIBE_RATE == null ? "" : this.BRIBE_RATE.replace(/,/g, "")}`,
            REWARD_RATE: `${this.REWARD_RATE == null ? "" : this.REWARD_RATE.replace(/,/g, "")}`,
            BRIBE_MAX_MONEY: `${this.BRIBE_MAX_MONEY == null ? "" : this.BRIBE_MAX_MONEY.replace(/,/g, "")}`,
            REWARD_MAX_MONEY: `${this.REWARD_MAX_MONEY == null ? "" : this.REWARD_MAX_MONEY.replace(/,/g, "")}`,
            EFFECTIVE_DATE: cvEffDate,
            EXPIRE_DATE: cvExpDate,
            IS_ACTIVE: "1"
        }
    }

    async onIns() {
        this.preloader.setShowPreloader(true);
        await this.setData();

        this.MasService.MasinsAll("MasDivisionRateinsAll", this.oParam).then(async item => {
            if (item.SUCCESS) {
                this.DIVISIONRATE_ID = item.RESPONSE_DATA;
                swal('', Message.saveComplete, 'success');
                this.onComplete();

                this.preloader.setShowPreloader(false);
                this.router.navigate([`/msDivisionRate/manage/${this.DIVISIONRATE_ID}`]);
            } else {
                swal('', Message.saveFail, 'error');
                this.preloader.setShowPreloader(false);
            }
        }, (error) => { console.error(error); return false; });
    }

    async onUdp() {
        this.preloader.setShowPreloader(true);
        await this.setData();

        this.MasService.MasUpdAll("MasDivisionRateupdAll", this.oParam).then(async item => {
            if (item.SUCCESS) {
                swal('', Message.saveComplete, 'success');

                if (this.oParam.IS_ACTIVE == "1") {
                    this.onComplete();
                    await this.ShowMasterData();
                } else {
                    this.router.navigate(['/msDivisionRate/list']);
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

    BribeRateFormat() {
        if (this.BRIBE_RATE)
            this.BRIBE_RATE = (+this.BRIBE_RATE.replace(/,/g, "")).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }

    RewardRateFormat() {
        if (this.REWARD_RATE)
            this.REWARD_RATE = (+this.REWARD_RATE.replace(/,/g, "")).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }

    TreasuryRateFormat() {
        if (this.TREASURY_RATE)
            this.TREASURY_RATE = (+this.TREASURY_RATE.replace(/,/g, "")).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }

    BribeMaxMoneyFormat() {
        if (this.BRIBE_MAX_MONEY)
            this.BRIBE_MAX_MONEY = (+this.BRIBE_MAX_MONEY.replace(/,/g, "")).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }

    RewardMaxMoneyFormat() {
        if (this.REWARD_MAX_MONEY)
            this.REWARD_MAX_MONEY = (+this.REWARD_MAX_MONEY.replace(/,/g, "")).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }

    MappingNullNumberData(str: string) {
        return `${str == 'null' || str == null ? "0" : str}`;
    }

    clearDataBribeRate(event){
        if(!this.IS_REPORT){
            this.BRIBE_RATE = "";
            this.BRIBE_MAX_MONEY = "";
        }
    }

    clearDataRewardRate(){
        if(!this.IS_RECEIVE){
            this.REWARD_RATE = "";
            this.REWARD_MAX_MONEY = "";
        }
    }
}