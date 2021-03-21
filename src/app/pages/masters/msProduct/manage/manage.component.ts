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
import { Observable, forkJoin, merge } from '../../../../../../node_modules/rxjs';
import { mergeMap, map, catchError, mapTo, finalize } from 'rxjs/operators';
import * as moment from 'moment-timezone';
import { ManageConfig } from '../manage/manage.config';
import { setZero } from '../../../../config/dateFormat';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-manage',
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']
})

export class ManageComponent extends ManageConfig {

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
        await this.preloader.setShowPreloader(true);
        this.CREATE_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));
        this.EFEXPIRE_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));
        this.active_Route();
        await this.getProductGroup();

        if (this.mode == "R") {
            this.InquiryDutyTable_list = await this.getInquiryDutyTable();
            this.InquiryProductType_list = await this.getInquiryProductType();
            this.InquiryProductSubType_list = await this.getInquiryProductSubType();
            await this.getMasProductMappinggetByCon();

        } else {
            await this.getInquiryDutyTable();
            await this.getInquiryProductType();
            await this.getInquiryProductSubType();

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
                        this.PRODUCT_MAPPING_ID = p['code'];
                    }
                    break;
            }
        });
    }

    getMasProductMappinggetByCon() {
        var paramsOther = {
            PRODUCT_MAPPING_ID: this.PRODUCT_MAPPING_ID
        }

        this.MasService.getapi1111("MasProductMappinggetByCon", paramsOther)
            .then(
                (list) => {
                    console.log('MasProductMappinggetByCon list : ', list)
                    if (list) {
                        this.setData(list);
                    } else {
                        this.ShowAlertError("พบปัญหาที่ API MasProductMappinggetByCon");
                        this.preloader.setShowPreloader(false);
                        this.router.navigate(['/msProduct/list']);
                    }
                }, (err: HttpErrorResponse) => {
                    this.ShowAlertError("API MasProductMappinggetByCon :: " + err.message);
                });
    }

    async OnSave() { /** mark */
        if (!parseInt(this.PRODUCT_GROUP_CODE_TEMP)) {
            this.swalFn('', 'กรุณาระบุข้อมูล "หมวดสินค้า"', 'warning');
            this.REQ_PRODUCT_GROUP_ID.next(true);
            return;
        }

        // if ((typeof this.BRAND_MODEL === 'undefined' || typeof this.BRAND_MODEL != 'object')) {
        //     this.swalFn('', 'กรุณาระบุข้อมูล "ยี่ห้อหลัก"', 'warning');
        //     this.REQ_BRAND_MODEL.next(true);
        //     return;
        // }

        // if (!this.SIZES) {
        //     this.swalFn('', 'กรุณาระบุข้อมูล "ขนาดบรรจุ"', 'warning');
        //     this.REQ_SIZES.next(true);
        //     return;
        // }

        // if (!this.SIZES_UNIT) {
        //     this.swalFn('', 'กรุณาระบุข้อมูล "หน่วย"', 'warning');
        //     this.REQ_SIZES_UNIT.next(true);
        //     return;
        // }

        // if ((typeof this.PRODUCTUNIT_MODEL === 'undefined' || typeof this.PRODUCTUNIT_MODEL != 'object')) {
        //     this.swalFn('', 'กรุณาระบุข้อมูล "หน่วยบรรจุภัณฑ์สินค้า"', 'warning');
        //     this.REQ_PRODUCTUNIT_MODEL.next(true);
        //     return;
        // }

        /** set form */
        this.IS_ACTIVE = this.chk1 == true ? 1 : 0;
        this.oParam = {
            PRODUCT_MAPPING_ID: this.PRODUCT_MAPPING_ID,
            PRODUCT_CODE: this.PRODUCT_CODE,
            PRODUCT_REF_CODE: this.PRODUCT_REF_CODE,
            PRODUCT_GROUP_ID: this.PRODUCT_GROUP_ID,
            PRODUCT_CATEGORY_ID: this.PRODUCT_CATEGORY_ID,
            PRODUCT_TYPE_ID: "",
            PRODUCT_SUBTYPE_ID: "",
            PRODUCT_SUBSETTYPE_ID: "",
            PRODUCT_BRAND_ID: this.PRODUCT_BRAND_ID,
            PRODUCT_SUBBRAND_ID: this.PRODUCT_SUBBRAND_ID,
            PRODUCT_MODEL_ID: this.PRODUCT_MODEL_ID,
            PRODUCT_TAXDETAIL_ID: "",
            UNIT_ID: this.UNIT_ID,
            SUGAR: this.SUGAR,
            CO2: this.CO2,
            DEGREE: this.DEGREE,
            PRICE: this.PRICE ? this.removeComma(this.PRICE) : "",
            SIZES: this.SIZES ? this.removeComma(this.SIZES) : "",
            SIZES_UNIT: this.SIZES_UNIT,
            IS_DOMESTIC: this.IS_DOMESTIC,
            IS_ACTIVE: this.IS_ACTIVE,
            CATEGORY_GROUP_CODE: "",
            CATEGORY_CODE: "",
            QUANTITY_UNIT: this.QUANTITY_UNIT,
            EXPIRE_DATE: "",
            LAW_DUTY_CODE: "",
            PRODUCT_NAME_DESC: this.PRODUCT_NAME_DESC
        }

        let result = [];
        let zip$ = new Observable<any>();
        let request = new Observable<any>();

        if (this.mode === 'C') {
            request = this.onIns();
        } else if (this.mode === 'R') {
            request = this.onUdp();
        }

        zip$ = Observable.zip(request)
            .pipe(map(x => { return result = [...result, ...x]; }))

        forkJoin(zip$)
            .subscribe(x => {
                const objRes: any[] = x[0];
                if (objRes.filter(o => o['IsSuccess'] == 'False').length) {
                    swal({
                        title: '',
                        text: Message.saveFail,
                        type: 'warning',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'ตกลง'
                    })
                } else {
                    swal({
                        title: '',
                        text: Message.saveComplete,
                        type: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'ตกลง'
                    }).then((r) => {
                        if (r) {
                            switch (this.mode) {
                                case 'C':
                                    this.router.navigate(['/msProduct/manage', 'R', objRes[0]['PRODUCT_MAPPING_ID']]);
                                    setTimeout(() => {
                                        location.reload();
                                    }, 200);
                                    break;

                                case "R":
                                    location.reload();
                                    break;
                            }
                        }
                    });
                }
            }, () => {
                swal({
                    title: '',
                    text: Message.saveFail,
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'ตกลง'
                })
            }
            )
    }

    OnDelete() {
        Swal({
            title: '',
            text: "ยืนยันการทำรายการหรือไม่",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ตกลง',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {

            if (result.value) {
                this.preloader.setShowPreloader(true);
                let result$ = [];
                let zip$ = new Observable<any>();
                let request = new Observable<any>();

                const params = { PRODUCT_MAPPING_ID: this.PRODUCT_MAPPING_ID }

                request = this.MasService.MasProductMappingupdDelete(params)
                    .pipe(
                        mergeMap(x => {
                            return merge(Observable.of(x));
                        })).finally(() => this.preloader.setShowPreloader(false));

                zip$ = Observable.zip(request)
                    .pipe(map(x => { return result$ = [...result$, ...x]; }))

                forkJoin(zip$)
                    .subscribe(x => {
                        const objRes: any[] = x[0];
                        if (objRes.filter(o => o['IsSuccess'] == 'False').length) {
                            Swal({
                                title: '',
                                text: Message.saveFail,
                                type: 'warning',
                                showCancelButton: false,
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: 'ตกลง'
                            })
                        } else {
                            Swal({
                                title: '',
                                text: Message.saveComplete,
                                type: 'success',
                                showCancelButton: false,
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: 'ตกลง'
                            }).then((r) => {
                                if (r) this.router.navigate(['/msProduct/list']);
                            })
                        }
                    }), () => {
                        Swal({
                            title: '',
                            text: Message.saveFail,
                            type: 'warning',
                            showCancelButton: false,
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'ตกลง'
                        })
                    }
            }
        })
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
                    this.router.navigate(['/msProduct/list']);
                } else if (this.mode === 'R') {
                    this.getMasProductMappinggetByCon();

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

    async setData(res: any) {

        /** clear null string */
        for (let key in res) {
            if (res[key] === 'null') {
                res[key] = '';
            }
        }

        this.PRODUCT_MAPPING_ID = res.PRODUCT_MAPPING_ID
        this.PRODUCT_CODE = res.PRODUCT_CODE
        this.PRODUCT_REF_CODE = res.PRODUCT_REF_CODE
        this.PRODUCT_GROUP_ID = res.PRODUCT_GROUP_ID
        this.PRODUCT_CATEGORY_ID = res.PRODUCT_CATEGORY_ID
        this.PRODUCT_TYPE_ID = res.PRODUCT_TYPE_ID
        this.PRODUCT_SUBTYPE_ID = res.PRODUCT_SUBTYPE_ID
        this.PRODUCT_SUBSETTYPE_ID = res.PRODUCT_SUBSETTYPE_ID
        this.PRODUCT_BRAND_ID = res.PRODUCT_BRAND_ID
        this.PRODUCT_SUBBRAND_ID = res.PRODUCT_SUBBRAND_ID
        this.PRODUCT_MODEL_ID = res.PRODUCT_MODEL_ID
        this.PRODUCT_TAXDETAIL_ID = res.PRODUCT_TAXDETAIL_ID
        this.UNIT_ID = res.UNIT_ID
        this.SUGAR = res.SUGAR
        this.CO2 = res.CO2
        this.DEGREE = res.DEGREE
        this.PRICE = res.PRICE ? this.AddComma(res.PRICE.toFixed(2)) : res.PRICE
        this.SIZES = res.SIZES ? this.AddComma(res.SIZES.toFixed(this.setToFixedByPid(res.PRODUCT_GROUP_ID))) : res.SIZES
        this.SIZES_UNIT = res.SIZES_UNIT
        this.IS_DOMESTIC = res.IS_DOMESTIC
        this.CREATE_DATE = res.CREATE_DATE
        this.CREATE_USER_ACCOUNT_ID = res.CREATE_USER_ACCOUNT_ID
        this.UPDATE_DATE = res.UPDATE_DATE
        this.UPDATE_USER_ACCOUNT_ID = res.UPDATE_USER_ACCOUNT_ID
        this.CATEGORY_GROUP_CODE = res.CATEGORY_GROUP_CODE
        this.CATEGORY_CODE = res.CATEGORY_CODE
        this.QUANTITY_UNIT = res.QUANTITY_UNIT
        this.EXPIRE_DATE = res.EXPIRE_DATE
        this.LAW_DUTY_CODE = res.LAW_DUTY_CODE
        this.PRODUCT_NAME_DESC = res.PRODUCT_NAME_DESC
        this.IS_ACTIVE = res.IS_ACTIVE
        this.chk1 = this.IS_ACTIVE == 1 ? true : false;

        await this.setSelecterByProductCodeCaseR();
        await this.setNameKeypressCaseR(res);
        await this.preloader.setShowPreloader(false);
    }

    setSelecterByProductCodeCaseR() {
        const x = this.PRODUCT_CODE;

        this.PRODUCT_GROUP_CODE_TEMP = x.substring(0, 2);
        this.PRODUCT_CATEGORY_CODE_TEMP = x.substring(0, 4);
        this.PRODUCT_TYPE_CODE_TEMP = x.substring(4, 6);
        this.PRODUCT_SUBSETTYPE_CODE_TEMP = x.substring(6, 8);

        this.InquiryDutyTable_list = this.InquiryDutyTable.filter(f => f.DUTY_CODE.slice(0, 2) == this.PRODUCT_GROUP_CODE_TEMP);

        this.InquiryProductType_list = this.InquiryProductType.filter(f => f.DUTY_CODE == this.PRODUCT_CATEGORY_CODE_TEMP);

        const pType = this.InquiryProductType_list[0];
        const gId = pType ? pType['GROUP_ID'] : "";
        this.InquiryProductSubType_list = this.InquiryProductSubType.filter(f => f.DUTY_CODE == gId);
    }

    async setNameKeypressCaseR(res: any) { /** mark */
        /** set brand main name */
        this.BRAND_LIST = await this.MasService.getAPI1111("MasProductBrandgetByCon", { PRODUCT_GROUP_CODE: this.PRODUCT_GROUP_CODE_TEMP });
        this.BRAND_LIST.map(m => {
            m.PRODUCT_BRAND_NAME_TH = `${m.PRODUCT_BRAND_NAME_TH == 'null' || m.PRODUCT_BRAND_NAME_TH == null ? '' : m.PRODUCT_BRAND_NAME_TH}`;
        });
        const brandMain = this.BRAND_LIST.filter(f => f.PRODUCT_BRAND_ID == res['PRODUCT_BRAND_ID']);
        this.BRAND_MODEL = brandMain ? brandMain[0] : [];

        /** set sub brand name */
        this.SUBBRAND_LIST = await this.MasService.getapi1111("MasProductSubBrandgetByCon", { PRODUCT_GROUP_CODE: this.PRODUCT_GROUP_CODE_TEMP })
        this.SUBBRAND_LIST.map(m => {
            m.PRODUCT_SUBBRAND_NAME_TH = `${m.PRODUCT_SUBBRAND_NAME_TH == 'null' || m.PRODUCT_SUBBRAND_NAME_TH == null ? '' : m.PRODUCT_SUBBRAND_NAME_TH}`;
        });
        const subBrandMain = this.SUBBRAND_LIST.filter(f => f.PRODUCT_SUBBRAND_ID == res['PRODUCT_SUBBRAND_ID']);
        this.SUBBRAND_MODEL = subBrandMain ? subBrandMain[0] : [];

        /** set sub brand name */
        this.MODEL_LIST = await this.MasService.getapi1111("MasProductModelgetByCon", { PRODUCT_GROUP_CODE: this.PRODUCT_GROUP_CODE_TEMP })
        this.MODEL_LIST.map(m => {
            m.PRODUCT_MODEL_NAME_TH = `${m.PRODUCT_MODEL_NAME_TH == 'null' || m.PRODUCT_MODEL_NAME_TH == null ? '' : m.PRODUCT_MODEL_NAME_TH}`;
        });
        const model = this.MODEL_LIST.filter(f => f.PRODUCT_MODEL_ID == res['PRODUCT_MODEL_ID']);
        this.MODEL_MODEL = model ? model[0] : [];

        /** set unit name */
        const P_UNIT_LIST = await this.MasService.getapi1111("MasProductUnitgetByCon", { PRODUCT_GROUP_CODE: this.PRODUCT_GROUP_CODE_TEMP })
        this.PRODUCTUNIT_LIST = P_UNIT_LIST ? P_UNIT_LIST.filter(f => f.USED_FOR === "P" || f.USED_FOR === "A") : [];

        const unit = this.PRODUCTUNIT_LIST.filter(f => f.UNIT_ID == res['UNIT_ID']);
        this.PRODUCTUNIT_MODEL = unit ? unit[0] : [];
        this.UNIT_NAME_TH = unit[0] ? unit[0]['UNIT_NAME_TH'] : '';

        this.PRODUCTSIZE_LIST = P_UNIT_LIST.filter(f => f.USED_FOR === "S" || f.USED_FOR === "A");
    }

    async onSeleceChange(field: string, value: any, event: any) { /** mark */
        const index = event.target.selectedIndex;

        switch (field) {
            case 'pGroup':
                this.InquiryDutyTable_list = this.InquiryDutyTable.filter(f => f.DUTY_CODE.slice(0, 2) == value);
                this.InquiryProductType_list = [];
                this.InquiryProductSubType_list = [];

                await this.preloader.setShowPreloader(true);
                await this.getBrand('', value, '');
                await this.getSubBrand('', value, '');
                await this.getModel('', value, this.PRODUCT_BRAND_ID);
                await this.getProductUnit(value);
                await this.preloader.setShowPreloader(false);

                break;

            case 'iDutyTable':
                this.InquiryProductType_list = this.InquiryProductType.filter(f => f.DUTY_CODE == value);
                this.InquiryProductSubType_list = [];
                break;

            case 'iProductType':
                const pType = this.InquiryProductType_list[index];
                const gId = pType ? pType['GROUP_ID'] : "";
                this.InquiryProductSubType_list = this.InquiryProductSubType.filter(f => f.DUTY_CODE == gId);
                break;
        }
    }

    onSetProductCode(field: string, value: any) {
        switch (field) {
            case 'pGroup':
                this.PRODUCT_GROUP_CODE_TEMP = value;
                this.PRODUCT_CATEGORY_CODE_TEMP = "0000";
                this.PRODUCT_TYPE_CODE_TEMP = "00";
                this.PRODUCT_SUBSETTYPE_CODE_TEMP = "00";

                /** set req */
                if (!parseInt(this.PRODUCT_GROUP_CODE_TEMP)) {
                    this.REQ_PRODUCT_GROUP_ID.next(true);
                } else {
                    this.REQ_PRODUCT_GROUP_ID.next(false);
                }
                break;

            case 'iDutyTable':
                this.PRODUCT_CATEGORY_CODE_TEMP = value;
                this.PRODUCT_TYPE_CODE_TEMP = "00";
                this.PRODUCT_SUBSETTYPE_CODE_TEMP = "00";
                break;

            case 'iProductType':
                this.PRODUCT_TYPE_CODE_TEMP = value;
                this.PRODUCT_SUBSETTYPE_CODE_TEMP = "00";
                break;

            case 'iProductSubType':
                this.PRODUCT_SUBSETTYPE_CODE_TEMP = value;
                break;
        }

        /** set groupCode */
        const gc = this.PRODUCT_GROUP_CODE_TEMP;
        const cc = this.PRODUCT_CATEGORY_CODE_TEMP.substring(2, 4);
        const tc = this.PRODUCT_TYPE_CODE_TEMP;
        const stc = this.PRODUCT_SUBSETTYPE_CODE_TEMP;
        this.PRODUCT_CODE = `${gc}${cc}${tc}${stc}00`;

        console.log('produce_code : ', this.PRODUCT_CODE + '    length => ' + this.PRODUCT_CODE.length)

        /** set Id & Name */
        const $P_GROUP = this.PRODUCT_GROUP_LIST.find(f => f.PRODUCT_GROUP_CODE == gc);
        this.PRODUCT_GROUP_ID = $P_GROUP ? $P_GROUP.PRODUCT_GROUP_ID : "";
        this.PRODUCT_GROUP_NAME_TEMP = $P_GROUP ? $P_GROUP.PRODUCT_GROUP_NAME : "";

        const $P_CATEGORY = this.InquiryDutyTable_list.find(f => f.DUTY_CODE.substring(2, 4) == cc); /** mark */
        this.PRODUCT_CATEGORY_NAME_TEMP = $P_CATEGORY ? $P_CATEGORY.DUTY_NAME : "";

        const $P_TYPE = this.InquiryProductType_list.find(f => f.TYPE_CODE == tc);
        this.PRODUCT_TYPE_NAME_TEMP = $P_TYPE ? $P_TYPE.TYPE_NAME : "";
    }

    onIns() {
        const curr_date = this.toDateTZ(new Date());

        /** set product name desc in case C */
        const GName = this.PRODUCT_GROUP_NAME_TEMP;
        const CName = this.PRODUCT_CATEGORY_NAME_TEMP;
        const TName = this.PRODUCT_TYPE_NAME_TEMP;
        const Ndesc = this.PRODUCT_NAME_DESC;

        const $band = this.BRAND_LIST.find(f => f.PRODUCT_BRAND_ID == this.PRODUCT_BRAND_ID);
        const BNameTh = $band ? `${'ยี่ห้อ ' + $band.PRODUCT_BRAND_NAME_TH}` : '';
        const $model = this.MODEL_LIST.find(f => f.PRODUCT_MODEL_ID == this.PRODUCT_MODEL_ID);
        const MNameTh = $model ? $model.PRODUCT_MODEL_NAME_TH : '';

        const __ = (GName.trim() == CName.trim()) ? TName : CName;

        const size = this.SIZES != undefined ? `${'ขนาด ' + this.SIZES}` : '';
        const sizeUnit = this.SIZES_UNIT != undefined ? this.SIZES_UNIT : '';

        const $pNameDesc = `${GName} ${__} ${BNameTh} ${MNameTh} ${size} ${sizeUnit} ${Ndesc || ''}`;

        this.oParam = {
            ...this.oParam,

            CREATE_DATE: curr_date,
            UPDATE_DATE: "",
            CREATE_USER_ACCOUNT_ID: this.localUserAccountID,
            UPDATE_USER_ACCOUNT_ID: "",
            PRODUCT_NAME_DESC: $pNameDesc.replace(/\s\s+/g, ' ').trim()
        }

        console.log('onIns : ', this.oParam)

        return this.MasService.MasProductMappinginsAll(this.oParam)
            .pipe(
                mergeMap(x => {
                    this.PRODUCT_MAPPING_ID = x['PRODUCT_MAPPING_ID'];
                    return merge(Observable.of(x));
                })
            )
    }

    onUdp() {
        const curr_date = this.toDateTZ(new Date());

        this.oParam = {
            ...this.oParam,
            UPDATE_DATE: curr_date,
            UPDATE_USER_ACCOUNT_ID: this.localUserAccountID,
            CREATE_DATE: this.toDateTZ(this.CREATE_DATE),
            CREATE_USER_ACCOUNT_ID: this.CREATE_USER_ACCOUNT_ID,
        }

        console.log('onUdp : ', this.oParam);

        return this.MasService.MasProductMappingupdAll(this.oParam);
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

    //#region Product Group
    async getProductGroup() {
        var paramsOther = {
            PRODUCT_GROUP_ID: "",
            PRODUCT_GROUP_CODE: ""
        }

        await this.MasService.getapi1111("MasProductGroupgetByCon", paramsOther)
            .then(
                (list) => {
                    this.PRODUCT_GROUP_LIST = list;
                    // this.PRODUCT_GROUP_LIST.push({ PRODUCT_GROUP_ID: "", PRODUCT_GROUP_NAME: "เลือกหมวดสินค้า" });
                }, (error) => { console.error(error); return false; });
    }
    //#endregion


    //#region Brand
    async getBrand($PRODUCT_GROUP_ID: string = "", $PRODUCT_GROUP_CODE: string = "", $PRODUCT_CATEGORY_CODE: "") {
        this.preloader.setShowPreloader(true);

        var paramsOther = {
            TEXT_SEARCH: "",
            PRODUCT_GROUP_ID: $PRODUCT_GROUP_ID,
            PRODUCT_GROUP_CODE: $PRODUCT_GROUP_CODE,
            PRODUCT_CATEGORY_CODE: $PRODUCT_CATEGORY_CODE
        }

        await this.MasService.getAPI1111("MasProductBrandgetByCon", paramsOther).then(list => {
            if (list) {
                this.BRAND_LIST = list;

                this.BRAND_LIST.map(m => {
                    m.PRODUCT_BRAND_NAME_TH = `${m.PRODUCT_BRAND_NAME_TH == 'null' || m.PRODUCT_BRAND_NAME_TH == null ? '' : m.PRODUCT_BRAND_NAME_TH}`;
                });

                this.preloader.setShowPreloader(false);
            } else {
                swal('', list.MSG, 'error');
                this.preloader.setShowPreloader(false);
            }
        }, (error) => { console.error(error); return false; });
    }

    searchBrand = (text$: Observable<string>) => /** mark */
        text$.debounceTime(200)
            .map(term =>
                term == '' ? []
                    : this.BRAND_LIST
                        .filter(v => v.PRODUCT_BRAND_NAME_TH.toLowerCase().indexOf(term.toLowerCase()) > -1)
                        .slice(0, 10)
            );

    formatter_brand = (x: { PRODUCT_BRAND_NAME_TH: string }) => x.PRODUCT_BRAND_NAME_TH;

    selectItembrand(event: any) {
        this.PRODUCT_BRAND_ID = event.item.PRODUCT_BRAND_ID;

        this.getModel("", this.PRODUCT_GROUP_CODE_TEMP, this.PRODUCT_BRAND_ID);
        // /** set req */
        // setTimeout(() => {
        //     if ((typeof this.BRAND_MODEL === 'undefined' || typeof this.BRAND_MODEL != 'object')) {
        //         this.REQ_BRAND_MODEL.next(true);
        //     } else {
        //         this.REQ_BRAND_MODEL.next(false);
        //     }
        // }, 100);
    }

    blurItembrand(e: any) {
        if (!e.value)
            this.PRODUCT_BRAND_ID = null;
    }
    //#endregion


    //#region Sub Brand
    async getSubBrand($PRODUCT_SUBBRAND_ID: "", $PRODUCT_GROUP_CODE: string = "", $PRODUCT_CATEGORY_CODE: "") {
        this.preloader.setShowPreloader(true);

        var paramsOther = {
            TEXT_SEARCH: "",
            PRODUCT_SUBBRAND_ID: $PRODUCT_SUBBRAND_ID,
            PRODUCT_GROUP_CODE: $PRODUCT_GROUP_CODE,
            PRODUCT_CATEGORY_CODE: $PRODUCT_CATEGORY_CODE
        }

        await this.MasService.getapi1111("MasProductSubBrandgetByCon", paramsOther).then(list => {
            console.log('MasProductSubBrandgetByCon : ', list)
            if (list) {
                this.SUBBRAND_LIST = list;

                this.SUBBRAND_LIST.map(m => {
                    m.PRODUCT_SUBBRAND_NAME_TH = `${m.PRODUCT_SUBBRAND_NAME_TH == 'null' || m.PRODUCT_SUBBRAND_NAME_TH == null ? '' : m.PRODUCT_SUBBRAND_NAME_TH}`;
                });

                this.preloader.setShowPreloader(false);
            } else {
                swal('', list.MSG, 'error');
                this.preloader.setShowPreloader(false);
            }
        }, (error) => { console.error(error); return false; });
    }

    searchSubBrand = (text$: Observable<string>) =>
        text$.debounceTime(200)
            .map(term => term == '' ? []
                : this.SUBBRAND_LIST
                    .filter(v =>
                        v.PRODUCT_SUBBRAND_NAME_TH.toLowerCase().indexOf(term.toLowerCase()) > -1
                    )
                    .slice(0, 10)
            );

    formatter_subbrand = (x: { PRODUCT_SUBBRAND_NAME_TH: string }) => x.PRODUCT_SUBBRAND_NAME_TH;

    selectItemSubbrand(event: any) {
        this.PRODUCT_SUBBRAND_ID = event.item.PRODUCT_SUBBRAND_ID;
    }

    blurItemSubbrand(e: any) {
        if (!e.value)
            this.PRODUCT_SUBBRAND_ID = null;
    }
    //#endregion


    //#region Model
    async getModel($PRODUCT_MODEL_ID: "", $PRODUCT_GROUP_CODE: string = "", $PRODUCT_CATEGORY_CODE: "") {
        this.preloader.setShowPreloader(true);

        var paramsOther = {
            TEXT_SEARCH: "",
            PRODUCT_MODEL_ID: $PRODUCT_MODEL_ID,
            PRODUCT_GROUP_CODE: $PRODUCT_GROUP_CODE,
            PRODUCT_CATEGORY_CODE: $PRODUCT_CATEGORY_CODE
        }

        await this.MasService.getapi1111("MasProductModelgetByCon", paramsOther).then(list => {
            console.log('MasProductModelgetByCon : ', list)
            if (list) {
                this.MODEL_LIST = list;

                this.MODEL_LIST.map(m => {
                    m.PRODUCT_MODEL_NAME_TH = `${m.PRODUCT_MODEL_NAME_TH == 'null' || m.PRODUCT_MODEL_NAME_TH == null ? '' : m.PRODUCT_MODEL_NAME_TH}`;
                });

                this.preloader.setShowPreloader(false);
            } else {
                swal('', list.MSG, 'error');
                this.preloader.setShowPreloader(false);
            }
        }, (error) => { console.error(error); return false; });
    }

    searchModel = (text$: Observable<string>) =>
        text$.debounceTime(200)
            .map(term => term == '' ? []
                : this.MODEL_LIST
                    .filter(v => v.PRODUCT_MODEL_NAME_TH.toLowerCase().indexOf(term.toLowerCase()) > -1)
                    .slice(0, 10)
            );

    formatter_model = (x: { PRODUCT_MODEL_NAME_TH: string }) => x.PRODUCT_MODEL_NAME_TH;

    selectItemModel(event: any) {
        this.PRODUCT_MODEL_ID = event.item.PRODUCT_MODEL_ID;
    }

    blurItemModel(e: any) {
        if (!e.value)
            this.PRODUCT_MODEL_ID = null;
    }
    //#endregion


    // #region Product Size
    // async getProductSize() {
    // this.preloader.setShowPreloader(true);

    // var paramsOther = {
    //     TEXT_SEARCH: ""
    // }

    // await this.MasService.getapi1111("MasProductSizegetByKeyword", paramsOther).then(list => {
    //     if (list) {
    //         this.PRODUCTSIZE_LIST = list;

    //         this.PRODUCTSIZE_LIST.map(m => {
    //             m.SIZE_DESC = `${m.SIZE_DESC == 'null' || m.SIZE_DESC == null ? '' : m.SIZE_DESC}`;
    //         });

    //         this.preloader.setShowPreloader(false);
    //     } else {
    //         swal('', list.MSG, 'error');
    //         this.preloader.setShowPreloader(false);
    //     }
    // }, (error) => { console.error(error); return false; });
    // }

    // searchProductsize = (text$: Observable<string>) =>
    //     text$.debounceTime(200)
    //         .map(term => term == '' ? []
    //             : this.PRODUCTSIZE_LIST
    //                 .filter(v => v.SIZE_DESC.toLowerCase().indexOf(term.toLowerCase()) > -1)
    //                 .slice(0, 10)
    //         );

    // formatter_productsize = (x: { SIZE_DESC: string }) => x.SIZE_DESC;
    //#endregion


    //#region Product Unit
    async getProductUnit($PRODUCT_GROUP_CODE: "") {

        var paramsOther = {
            PRODUCT_GROUP_CODE: $PRODUCT_GROUP_CODE
        }

        await this.MasService.getapi1111("MasProductUnitgetByCon", paramsOther).then(list => {
            console.log('MasProductUnitgetByKeyword : ', list)
            if (list) {
                this.PRODUCTUNIT_LIST = list
                    .filter(f => f.USED_FOR === "P" || f.USED_FOR === "A");

                this.PRODUCTSIZE_LIST = list
                    .filter(f => f.USED_FOR === "S" || f.USED_FOR === "A");

            } else {
                swal('', list.MSG, 'error');
                this.preloader.setShowPreloader(false);
            }
        }, (error) => { console.error(error); return false; });
    }

    searchProductunit = (text$: Observable<string>) =>
        text$.debounceTime(200)
            .map(term => term == '' ? []
                : this.PRODUCTUNIT_LIST
                    .filter(v => v.UNIT_NAME_TH.toLowerCase().indexOf(term.toLowerCase()) > -1)
                    .slice(0, 10)
            );

    formatter_productunit = (x: { UNIT_NAME_TH: string }) => x.UNIT_NAME_TH;

    selectItemUnit(event: any) {
        this.UNIT_ID = event.item.UNIT_ID;
        this.QUANTITY_UNIT = event.item.UNIT_NAME_TH;

        /** set req */
        setTimeout(() => {
            if ((typeof this.PRODUCTUNIT_MODEL === 'undefined' || typeof this.PRODUCTUNIT_MODEL != 'object')) {
                this.REQ_PRODUCTUNIT_MODEL.next(true);
            } else {
                this.REQ_PRODUCTUNIT_MODEL.next(false);
            }
        }, 100);
    }


    searchProductsize = (text$: Observable<string>) =>
        text$.debounceTime(200)
            .map(term => term == '' ? []
                : this.PRODUCTSIZE_LIST
                    .filter(v => v.UNIT_NAME_TH.toLowerCase().indexOf(term.toLowerCase()) > -1)
                    .slice(0, 10)
            );

    formatter_productsize = (x: { UNIT_NAME_TH: string }) => x.UNIT_NAME_TH;

    selectItemSize(event: any) {
        this.SIZES_UNIT = event.item.UNIT_NAME_TH;
    }

    blurItemSize(e: any) {
        if (!e.value) {
            this.SIZES_UNIT = null;
            this.REQ_SIZES_UNIT.next(true);
        }
        else {
            this.SIZES_UNIT = e.value;
            this.REQ_SIZES_UNIT.next(false);
        }
    }

    //#endregion

    //#region InquiryDutyTable
    async getInquiryDutyTable() {

        const requestData = {
            DUTY_CODE: "",
            TYPE_CODE: "",
            DUTY_FLAG: "1"
        }

        await this.MasService.InquiryDutyTable(requestData).then(list => {
            this.InquiryDutyTable = this.setInquiryReturn(list);
        }, (error) => { console.error(error); return false; });
        return this.InquiryDutyTable
    }
    //#endregion

    //#region InquiryProductType
    async getInquiryProductType() {

        const requestData = {
            DUTY_CODE: "",
            TYPE_CODE: "",
            DUTY_FLAG: "1"
        }

        await this.MasService.InquiryProductType(requestData).then(list => {
            this.InquiryProductType = this.setInquiryReturn(list);
        }, (error) => { console.error(error); return false; });
        return this.InquiryProductType;
    }
    //#endregion

    //#region InquiryProductSubType
    async getInquiryProductSubType() {

        const requestData = {
            DUTY_CODE: "",
            SUBTYPE_CODE: "",
        }

        await this.MasService.InquiryProductSubType(requestData).then(list => {
            this.InquiryProductSubType = this.setInquiryReturn(list);
        }, (error) => { console.error(error); return false; });
        return this.InquiryProductSubType;

    }
    //#endregion

    setInquiryReturn(list: any) {
        let res: any[];
        if (list['ResponseMessage'] == "SUCCESS") {
            if (list['ResponseData'].length) {
                res = list['ResponseData'];
            } else res = [];
        } else res = [];
        return res;
    }

    getCurrentDate() {
        let date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).toISOString().substring(0, 10);
    }

    OpenPopupBrand(type: string, mode: string) {
        this.PopupType = type;
        this.PopupMode = mode;

        if (this.PopupType == 'Brand')
            this.PopupModel = {
                ...this.BRAND_MODEL,
                PRODUCT_GROUP_CODE: setZero(this.PRODUCT_GROUP_ID)
            };
        else if (this.PopupType == 'SubBrand')
            this.PopupModel = {
                ...this.SUBBRAND_MODEL,
                PRODUCT_GROUP_CODE: setZero(this.PRODUCT_GROUP_ID)
            };
        else if (this.PopupType == 'Model')
            this.PopupModel = {
                ...this.MODEL_MODEL,
                PRODUCT_GROUP_CODE: setZero(this.PRODUCT_GROUP_ID),
            };
        else if (this.PopupType == 'Size')
            this.PopupModel = this.PRODUCTSIZE_MODEL;
        else if (this.PopupType == 'Unit')
            this.PopupModel = this.PRODUCTUNIT_MODEL;

        this.modal = this.ngbModel.open(this.brandModal, { size: 'lg', centered: true });
    }

    async GetDataModal(event) { /** mark */
        if (this.PopupType == 'Brand') {
            await this.getBrand("", this.PRODUCT_GROUP_CODE_TEMP, "");
            this.BRAND_MODEL = event;
            this.PRODUCT_BRAND_ID = event.PRODUCT_BRAND_ID;
            this.PRODUCT_BRAND_NAME_TH = event.PRODUCT_BRAND_NAME_TH;
        }
        else if (this.PopupType == 'SubBrand') {
            await this.getSubBrand("", this.PRODUCT_GROUP_CODE_TEMP, "");
            this.SUBBRAND_MODEL = event;
            this.PRODUCT_SUBBRAND_ID = event.PRODUCT_SUBBRAND_ID;
            this.PRODUCT_SUBBRAND_NAME_TH = event.PRODUCT_SUBBRAND_NAME_TH;
        }
        else if (this.PopupType == 'Model') {
            await this.getModel("", this.PRODUCT_GROUP_CODE_TEMP, this.PRODUCT_BRAND_ID);
            this.MODEL_MODEL = event;
            this.PRODUCT_MODEL_ID = event.PRODUCT_MODEL_ID;
            this.PRODUCT_MODEL_NAME_TH = event.PRODUCT_MODEL_NAME_TH;
        }
        else if (this.PopupType == 'Size') {
            // await this.getProductSize();
            // this.PRODUCTSIZE_MODEL = event;
            // this.SIZE_DESC = event.SIZE_DESC;
        }
        else if (this.PopupType == 'Unit') {
            // await this.getProductUnit();
            this.PRODUCTUNIT_MODEL = event;
            this.UNIT_NAME_TH = event.UNIT_NAME_TH;
        }

        this.modal.dismiss();
    }

    public toDateTZ(date: Date) {
        return `${moment(date).format('YYYY-MM-DD HH:mm:ss.ms')}`;
    }

    stringToNumber(input: string) {
        var numeric = Number(input);
        return numeric;
    }

    AddComma(x) {
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

    NumericDotOnly(event): boolean {
        let patt = /^([0-9,.])$/;
        let result = patt.test(event.key);
        return result;
    }

    setSizesFormat() {
        let r = this.SIZES.replaceAll(",", "");
        this.SIZES = parseFloat(r).toFixed(this.setToFixedByPid(this.PRODUCT_GROUP_ID)).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }

    setPriceFormat() {
        let r = this.PRICE.replaceAll(",", "");
        this.PRICE = parseFloat(r).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }

    setToFixedByPid(P_ID: any): number {
        let toFixed: number;
        switch (parseInt(P_ID)) {
            case 1:
            case 2:
            case 13:
                toFixed = 3;
                break;
            default:
                toFixed = 0;
                break;
        }
        return toFixed;
    }

    removeComma(value) {/* Remove comma , */
        var str = String(value);
        str = str.replace(/,/g, '');
        if (String(str) == 'NaN')
            return '0';
        else
            return str;
    }
}
