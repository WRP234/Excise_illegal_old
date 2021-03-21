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
import { NgSelectModule, NgOption } from '@ng-select/ng-select';
// import {IOption} from 'ng-select';

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

    REWARD_SECOND_DIVISION_ID: string;
    showDataList = [];
    EFFECTIVE_DATE: any;      // วันที่สิ้นสุด
    EFFECTIVE_TEXT: any;

    // myOptions: Array<IOption> = [
    //     {label: 'Belgium', value: 'BE'},
    //     {label: 'Luxembourg', value: 'LU'},
    //     {label: 'Netherlands', value: 'NL'}
    // ];
    title = 'app';
    selectedCity: any;
    cities = [
        { id: 1, name: 'Vilnius', vlue: '111' },
        { id: 2, name: 'Kaunas', vlue: '111' },
        { id: 3, name: 'Pabradė', vlue: '111' },
        { id: 3, name: 'Pabradė', vlue: '111' },
        { id: 3, name: 'Pabradė', vlue: '111' }
    ];

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
        await this.ShowMasterData();
    }

    private active_Route() {
        this.sub = this.activeRoute.params.subscribe(p => {
            if (p['code']) {
                this.REWARD_SECOND_DIVISION_ID = p['code'];
            }
        });
    }

    ShowMasterData() {
        var paramsOther = {
            TEXT_SEARCH: "",
            POS_LEVEL: "",
            REWARD_SECOND_DIVISION_ID: `${this.REWARD_SECOND_DIVISION_ID == "0" ? "" : this.REWARD_SECOND_DIVISION_ID}`
        }

        this.showDataList = [];

        this.MasService.getByKeyword("MasRewardSecondDivisiongetByCon", paramsOther).then(list => {
            if (list.RESPONSE_DATA.length > 0) {
                this.showDataList = list.RESPONSE_DATA;

                for (var i = 0; i < this.showDataList.length; i += 1) {
                    this.showDataList[i].RateSeq = i;
                    this.showDataList[i].IsNewItem = false;
                    this.showDataList[i].IsDelItem = false;
                }

                var EffDate = list.RESPONSE_DATA[0].EFFECTIVE_DATE.toString().split(" ");
                this.EFFECTIVE_DATE = setDateMyDatepicker(new Date(EffDate[0]));

                this.PrintButton.next(false);
                this.DeleteButton.next(false);
                this.SaveButton.next(false);
                this.CancelButton.next(false);

                this.showEditField = true;
                this.EditButton.next(true);
            } else {
                this.REWARD_SECOND_DIVISION_ID = "Auto Generate";
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
        let listProd = this.showDataList.filter(f => f.POS_LEVEL_NAME == "" || f.PART.toString() == "");

        if (this.EFFECTIVE_DATE == null || this.EFFECTIVE_DATE == undefined || listProd.length > 0) {
            this.isRequired = true;
            this.ShowAlertWarning(Message.checkData);

            return false;
        }

        if (this.REWARD_SECOND_DIVISION_ID === "Auto Generate") {
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
                if (this.REWARD_SECOND_DIVISION_ID === "Auto Generate") {
                    // this.BRIBE_RATE = "";
                    // this.REWARD_RATE = "";
                    // this.TREASURY_RATE = "";
                    // this.BRIBE_MAX_MONEY = "";
                    // this.REWARD_MAX_MONEY = "";
                    // this.EFFECTIVE_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));
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

        this.EFFECTIVE_TEXT = cvEffDate;
        this.REWARD_SECOND_DIVISION_ID = `${this.REWARD_SECOND_DIVISION_ID == "Auto Generate" ? "" : this.REWARD_SECOND_DIVISION_ID}`;
    }

    async onIns() {
        this.preloader.setShowPreloader(true);
        await this.setData();

        var isSuccess = true;

        if (this.showDataList.length > 0) {
            this.showDataList.map(async item => {
                item.REWARD_SECOND_DIVISION_ID = "";
                item.POS_LEVEL = "";
                item.EFFECTIVE_DATE = this.EFFECTIVE_TEXT;
                item.EXPIRE_DATE = "";
                item.IS_ACTIVE = "1";

                await this.MasService.MasinsAll("MasRewardSecondDivisioninsAll", item).then(async item => {
                    if (!item.SUCCESS) {
                        isSuccess = item.SUCCESS;
                        return false;
                    }
                }, (error) => { isSuccess = false; console.error(error); return false; });
            });

            if (isSuccess) {
                this.ShowAlertSuccess(Message.saveComplete);
                this.onComplete();

                this.preloader.setShowPreloader(false);
                this.router.navigate([`/msRawardRateDivision/manage/${this.REWARD_SECOND_DIVISION_ID}`]);
            } else {
                this.ShowAlertError(Message.saveFail);
                this.preloader.setShowPreloader(false);
            }
        }
    }

    async onUdp() {
        this.preloader.setShowPreloader(true);
        await this.setData();

        // -----------------------------------------------------------
        //                       Call API Update
        // -----------------------------------------------------------

        let isSuccess: boolean = true;

        if (this.showDataList.length > 0) {
            // New
            this.showDataList.filter(item => item.IsNewItem === true)
                .map(async item => {
                    item.IsNewItem = false;
                    item.REWARD_SECOND_DIVISION_ID = "";
                    item.POS_LEVEL = "";
                    item.EFFECTIVE_DATE = this.EFFECTIVE_TEXT;
                    item.EXPIRE_DATE = "";
                    item.IS_ACTIVE = "1";

                    await this.MasService.MasUpdAll("MasRewardSecondDivisioninsAll", item).then(async item => {
                        if (!item.SUCCESS) {
                            isSuccess = item.SUCCESS;
                        }
                    }, (error) => { console.error(error); });
                });


            // Edit
            this.showDataList.filter(item => item.IsNewItem === false)
                .map(async item => {
                    item.EFFECTIVE_DATE = this.EFFECTIVE_TEXT;
                    item.EXPIRE_DATE = "";
                    item.IS_ACTIVE = "1";

                    await this.MasService.MasUpdAll("MasRewardSecondDivisionupdAll", item).then(async item => {
                        if (!item.SUCCESS) {
                            isSuccess = item.SUCCESS;
                        }
                    }, (error) => { console.error(error); });
                });

            // Del    
            this.showDataList.filter(item => item.IsDelItem === true)
                .map(async item => {
                    await this.MasService.MasUpdAll("MasRewardSecondDivisionupdDelete", item).then(async item => {
                        if (!item.SUCCESS) {
                            isSuccess = item.SUCCESS;
                        }
                    }, (error) => { console.error(error); });
                });
        }

        if (isSuccess) {
            this.ShowAlertSuccess(Message.saveComplete);
            this.onComplete();
            await this.ShowMasterData();
            this.preloader.setShowPreloader(false);
        } else {
            this.ShowAlertError(Message.saveFail);
            this.preloader.setShowPreloader(false);
        }
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

    getIndexOf(arr, val, prop) {
        var l = arr.length,
            k = 0;
        for (k = 0; k < l; k = k + 1) {
            if (arr[k][prop] == val) {
                return k;
            }
        }
        return -1;
    }
    // ----- End DateTime -----


    // **********************************
    // ------------ Reward -----------
    // **********************************
    AddRateDivition() {
        let oRate = {
            "POS_LEVEL_NAME": "",
            "RateSeq": this.showDataList.length,
            "IsNewItem": true,
            "IsDelItem": false
        };

        this.showDataList.push(oRate);
    }

    // async getPosition() {
    //     await this.MasService.getProduct().then(async res => {
    //         if (res) {
    //             this.rawProductOptions = res;
    //         }

    //         this.preloader.setShowPreloader(false);
    //     }, (err: HttpErrorResponse) => {
    //         this.ShowAlertError("พบปัญหาในการติดต่อ Server");
    //     });
    // }

    // ProductonAutoChange(value: string, i: number) {
    //     if (value == '') {
    //         this.Productoptions = [];
    //         this.ClearProduct(i);
    //     } else {
    //         if (this.rawProductOptions.length == 0) {
    //             this.getMasProduct();
    //         }

    //         this.Productoptions = this.rawProductOptions.filter(f => f.PRODUCT_DESC.toLowerCase().indexOf(value.toLowerCase()) > -1).slice(0, 10);
    //     }
    // }

    // ProductonAutoFocus(value: string) {
    //     if (value == '') {
    //         this.Productoptions = [];
    //     }
    // }

    // ProductonAutoSelecteWord(event, i) {
    //     var aIndex;
    //     aIndex = this.getIndexOf(this.ListEvidenceInItem, i, "ProductSeq");

    //     let IsNewItem = this.ListEvidenceInItem[aIndex].IsNewItem;
    //     let IsDelItem = this.ListEvidenceInItem[aIndex].IsDelItem;
    //     let ItemID = this.ListEvidenceInItem[aIndex].EVIDENCE_IN_ITEM_ID;
    //     let ItemCode = this.ListEvidenceInItem[aIndex].EVIDENCE_IN_ITEM_CODE;
    //     let EviInID = this.ListEvidenceInItem[aIndex].EVIDENCE_IN_ID;

    //     this.ListEvidenceInItem[aIndex] = {
    //         EVIDENCE_IN_ITEM_ID: ItemID,
    //         EVIDENCE_IN_ITEM_CODE: ItemCode,
    //         EvidenceOutItemID: "",
    //         ProductSeq: aIndex,
    //         EVIDENCE_IN_ID: EviInID,
    //         PRODUCT_GROUP_CODE: event.PRODUCT_GROUP_CODE,
    //         IS_DOMESTIC: event.IS_DOMESTIC,
    //         PRODUCT_CODE: event.PRODUCT_CODE,
    //         PRODUCT_BRAND_CODE: event.PRODUCT_BRAND_CODE,
    //         PRODUCT_BRAND_NAME_TH: event.PRODUCT_BRAND_NAME_TH,
    //         PRODUCT_BRAND_NAME_EN: event.PRODUCT_BRAND_NAME_EN,
    //         PRODUCT_SUBBRAND_CODE: event.PRODUCT_SUBBRAND_CODE,
    //         PRODUCT_SUBBRAND_NAME_TH: event.PRODUCT_SUBBRAND_NAME_TH,
    //         PRODUCT_SUBBRAND_NAME_EN: event.PRODUCT_SUBBRAND_NAME_EN,
    //         PRODUCT_MODEL_CODE: event.PRODUCT_MODEL_CODE,
    //         PRODUCT_MODEL_NAME_TH: event.PRODUCT_MODEL_NAME_TH,
    //         // FixNo1: event.FixNo1,
    //         // FixNo2: event.FixNo2,
    //         // SequenceNo: event.SequenceNo,
    //         PRODUCT_DESC: event.PRODUCT_DESC,
    //         DELIVERY_QTY: "",
    //         DELIVERY_QTY_UNIT: "",
    //         DELIVERY_SIZE: event.size,
    //         DELIVERY_SIZE_UNIT: event.SizeUnitCode,
    //         DELIVERY_NET_VOLUMN: "",
    //         DELIVERY_NET_VOLUMN_UNIT: "",
    //         DAMAGE_QTY: "",
    //         DAMAGE_QTY_UNIT: "",
    //         DAMAGE_SIZE: event.size,
    //         DAMAGE_SIZE_UNIT: event.SizeUnitCode,
    //         DAMAGE_NET_VOLUMN: "",
    //         DAMAGE_NET_VOLUMN_UNIT: "",
    //         RECEIVE_QTY: "",
    //         RECEIVE_NET_VOLUMN: "",
    //         IS_ACTIVE: "",
    //         IsNewItem: IsNewItem,
    //         IsDelItem: IsDelItem,
    //         EvidenceOutStockBalance: []
    //     }

    //     if (this.evitype == "G") {
    //         this.ListEvidenceInItem[aIndex].EVIDENCE_IN_ITEM_CODE = event.EVIDENCE_IN_ITEM_CODE;
    //         this.ListEvidenceInItem[aIndex].DELIVERY_QTY = event.DELIVERY_QTY;
    //         this.ListEvidenceInItem[aIndex].DELIVERY_QTY_UNIT = event.DELIVERY_QTY_UNIT;
    //         this.ListEvidenceInItem[aIndex].RECEIVE_QTY = event.DELIVERY_QTY;
    //         this.ListEvidenceInItem[aIndex].DAMAGE_QTY_UNIT = event.DELIVERY_QTY;
    //         this.ListEvidenceInItem[aIndex].EVIDENCE_IN_ITEM_CODE = event.EVIDENCE_IN_ITEM_CODE;

    //         this.oStockBalance = {
    //             StockID: event.StockID,
    //             WAREHOUSE_ID: this.WAREHOUSE_ID,
    //             EVIDENCE_IN_ITEM_ID: event.EVIDENCE_IN_ITEM_CODE,
    //             BALANCE_QTY: event.BALANCE_QTY
    //         }

    //         this.ListEvidenceInItem[aIndex].EvidenceOutStockBalance = [];
    //         this.ListEvidenceInItem[aIndex].EvidenceOutStockBalance.push(this.oStockBalance);
    //     }
    // }

    // ClearProduct(i: number) {
    //     var aIndex;
    //     aIndex = this.getIndexOf(this.ListEvidenceInItem, i, "ProductSeq");

    //     let IsNewItem = this.ListEvidenceInItem[aIndex].IsNewItem;
    //     let IsDelItem = this.ListEvidenceInItem[aIndex].IsDelItem;
    //     let ItemCode = this.ListEvidenceInItem[aIndex].EVIDENCE_IN_ITEM_CODE;
    //     let EviInID = this.ListEvidenceInItem[aIndex].EVIDENCE_IN_ID;
    //     let ItemID = this.ListEvidenceInItem[aIndex].EVIDENCE_IN_ITEM_ID;

    //     this.ListEvidenceInItem[aIndex] = {
    //         EVIDENCE_IN_ITEM_ID: ItemID,
    //         EVIDENCE_IN_ITEM_CODE: ItemCode,
    //         ProductSeq: aIndex,
    //         EVIDENCE_IN_ID: EviInID,
    //         PRODUCT_GROUP_CODE: "",
    //         IS_DOMESTIC: "",
    //         PRODUCT_CODE: "",
    //         PRODUCT_BRAND_CODE: "",
    //         PRODUCT_BRAND_NAME_TH: "",
    //         PRODUCT_BRAND_NAME_EN: "",
    //         PRODUCT_SUBBRAND_CODE: "",
    //         PRODUCT_SUBBRAND_NAME_TH: "",
    //         PRODUCT_SUBBRAND_NAME_EN: "",
    //         PRODUCT_MODEL_CODE: "",
    //         PRODUCT_MODEL_NAME_TH: "",
    //         // FixNo1: "",
    //         // FixNo2: "",
    //         // SequenceNo: "",
    //         PRODUCT_DESC: "",
    //         DELIVERY_QTY: "",
    //         DELIVERY_QTY_UNIT: "",
    //         DELIVERY_SIZE: "",
    //         DELIVERY_SIZE_UNIT: "",
    //         DELIVERY_NET_VOLUMN: "",
    //         DELIVERY_NET_VOLUMN_UNIT: "",
    //         DAMAGE_QTY: "",
    //         DAMAGE_QTY_UNIT: "",
    //         DAMAGE_SIZE: "",
    //         DAMAGE_SIZE_UNIT: "",
    //         DAMAGE_NET_VOLUMN: "",
    //         DAMAGE_NET_VOLUMN_UNIT: "",
    //         RECEIVE_QTY: "",
    //         RECEIVE_NET_VOLUMN: "",
    //         IS_ACTIVE: "",
    //         IsNewItem: IsNewItem,
    //         IsDelItem: IsDelItem,
    //         EvidenceOutStockBalance: []
    //     }
    // }


    DelRateDivition(i: number) {
        swal({
            title: '',
            text: 'ยืนยันการลบข้อมูล ใช่หรือไม่ ?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.value) {
                var aIndex;
                aIndex = this.getIndexOf(this.showDataList, i, "RateSeq");

                if (aIndex != -1) {
                    if (this.showDataList[aIndex].IsNewItem == false) {
                        this.showDataList[aIndex].IsDelItem = true;
                    }
                    else {
                        this.showDataList.splice(aIndex, 1);
                    }
                }
            }
        })
    }
}
