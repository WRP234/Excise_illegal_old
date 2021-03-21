import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { RevenueService } from '../revenue.service';
import { Message } from '../../../config/message';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import { toLocalShort, setDateMyDatepicker, convertDateForSave } from '../../../config/dateFormat';
import swal from 'sweetalert2';
import { Observable, merge, forkJoin, from, combineLatest } from 'rxjs';;
import { MasterService } from '../../masters/masters.service';
import { ManageConfig } from './manage.config';
import { RevenueMasterService } from '../revenue.mas.service';
import { mergeMap, map, takeUntil, groupBy, toArray } from 'rxjs/operators';

@Component({
    selector: 'app-manage',
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']
})

export class ManageComponent extends ManageConfig implements OnInit, OnDestroy {

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    constructor(
        private activeRoute: ActivatedRoute,
        private ngbModel: NgbModal,
        private revService: RevenueService,
        private MasService: MasterService,
        private preloader: PreloaderService,
        private router: Router,
        private RevenueMasService: RevenueMasterService
    ) {
        super();
    }

    searchStaff = this.RevenueMasService.searchStaff;

    async ngOnInit() {
        this.preloader.setShowPreloader(true);

        await this.getOffice();
        await this.getStaff();
        await this.getBank();
        await this.getDutyGroup();

        this.PAYMENT_FINE_TOTAL = 0;
        this.BRIBE_MONEY_TOTAL = 0;
        this.REWARD_MONEY_TOTAL = 0;
        this.TREASURY_MONEY_TOTAL = 0;

        this.COURT_CHECK_MONEY_TOTAL = 0;
        this.COURT_BRIBE_MONEY_TOTAL = 0;
        this.COURT_REWARD_MONEY_TOTAL = 0;

        this.isSortCompareAsc = false;
        this.isSortReceiptAsc = false;
        this.isSortPaymentDateAsc = false;

        this.active_Route();
    }

    private active_Route() {
        this.sub = this.activeRoute.params.subscribe(p => {
            this.mode = p['mode'];

            switch (this.mode) {
                case this.ModeAction.C:
                    // set false
                    this.PrintButton.next(false);
                    this.EditButton.next(false);
                    this.DeleteButton.next(false);
                    this.showEditField = false;
                    // set true
                    this.SaveButton.next(true);
                    this.CancelButton.next(true);

                    this.REVENUE_CODE = this.AutoGenerate;
                    this.REVENUE_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));
                    this.REVENUE_TIME = this.getCurrentTime();
                    this.REVENUE_STATUS = this.getRevenueStatusText(0);//"ยังไม่นำส่งเงินรายได้";

                    this.InitialDataByLogin();
                    this.RevenueGetCase_C();
                    this.preloader.setShowPreloader(false);
                    break;

                case this.ModeAction.R:
                    // set false
                    this.SaveButton.next(false);
                    this.CancelButton.next(false);

                    // set true  
                    this.EditButton.next(true);
                    this.PrintButton.next(true);
                    this.showEditField = true;

                    if (p['code']) {
                        this.REVENUE_ID = p['code'];
                    }

                    this.INPUT_WIZARD.next({ 'VALUE': this.REVENUE_ID, 'RESERVE_VALUE': '' });

                    this.RevenueGetCase_R();
                    this.preloader.setShowPreloader(false);
                    break;
            }
        });
    }

    InitialDataByLogin() {
        this.STAFF_LIST.filter(f => f.STAFF_ID == parseInt(this.localUserAccountID)).map(m => {
            this.STAFF_SEND_MODEL = {};
            this.STAFF_SIGN_MODEL = {};

            Object.assign(this.STAFF_SEND_MODEL, m);
            Object.assign(this.STAFF_SIGN_MODEL, m);

            this.STAFF_SEND_POS_NAME = m.OPREATION_POS_NAME;
            this.STAFF_SEND_OFFICE_NAME = m.OPERATION_OFFICE_SHORT_NAME;
            this.STAFF_SEND_CODE = m.STAFF_ID;
            this.STAFF_SEND_NAME = m.TITLE_NAME_TH + m.FIRST_NAME + " " + m.LAST_NAME;


            this.STAFF_SIGN_POS_NAME = m.OPREATION_POS_NAME;
            this.STAFF_SIGN_OFFICE_NAME = m.OPERATION_OFFICE_SHORT_NAME;
            this.STAFF_SIGN_CODE = m.STAFF_ID;
            this.STAFF_SIGN_NAME = m.TITLE_NAME_TH + m.FIRST_NAME + " " + m.LAST_NAME;

        });

        this.OFFICE_LIST.filter(f => f.OFFICE_CODE == this.localOfficeCode).map(m => {
            this.STATION_FROM_MODEL = m;
            this.STATION_TO_MODEL = m;

            this.DELIVERY_OFFICE_ID = m.OFFICE_ID;
            this.DELIVERY_OFFICE_CODE = m.OFFICE_CODE;
            this.DELIVERY_OFFICE_NAME = m.OFFICE_SHORT_NAME;

            this.RECEIVE_OFFICE_ID = m.OFFICE_ID;
            this.RECEIVE_OFFICE_CODE = m.OFFICE_CODE;
            this.RECEIVE_OFFICE_NAME = m.OFFICE_SHORT_NAME;
        });
    }

    // **********************************
    // ---------------- Table -----------
    // **********************************
    //#region 
    RevenueGetCase_C() {
        var paramsOther = {
            OFFICE_CODE: this.localOfficeCode
        }

        this.revService.requestAPI("RevenueComparegetByCreate", paramsOther).then(list => {

            /**getByCreate set isCheck  */
            const byCreate = list.reduce((accu, curr) => {
                let rcMapping = [];

                if (curr.RevenueCompareMapping) {
                    rcMapping = curr.RevenueCompareMapping
                        .reduce((accuMap, currMap) => {

                            let detail = [];
                            if (currMap.RevenueCompareDetail) {
                                detail = currMap.RevenueCompareDetail
                                    .reduce((accuRC, currRC) => {
                                        return [...accuRC, {
                                            IsCheck: true,
                                            ACTION: this.Action.ADD,
                                            ...currRC
                                        }]
                                    }, []);
                            }
                            return [...accuMap, {
                                IsCheck: true,
                                ACTION: this.Action.ADD,
                                ...currMap,
                                RevenueCompareDetail: detail,
                            }]
                        }, []);
                }
                return [...accu, {
                    ...curr,
                    IsCheck: true,
                    ACTION: this.Action.ADD,
                    RevenueCompareMapping: rcMapping,
                }]
            }, []);

            this.setRevenueCompareTable(byCreate);
        }, (err: HttpErrorResponse) => {
            this.ShowAlertError("API RevenueComparegetByCon :: " + err.message);
        });

        this.revService.requestAPI("RevenueCourtDetailgetByCreate", paramsOther).then(Court => {

            const byCreate = Court.reduce((a, c) =>
                [...a, {
                    REVENUE_ID: '',
                    LAWSUIT_ID: c.LAWSUIT_ID,
                    INDICTMENT_ID: c.INDICTMENT_ID,
                    OFFICE_ID: c.OFFICE_ID,
                    OFFICE_CODE: c.OFFICE_CODE,
                    OFFICE_NAME: c.OFFICE_NAME,
                    LAWSUIT_NO: c.LAWSUIT_NO,
                    IS_LAWSUIT: c.IS_LAWSUIT,
                    LAWSUIT_DATE: c.LAWSUIT_DATE,
                    IS_OUTSIDE: c.IS_OUTSIDE,
                    LawsuiltDetail: c.LawsuiltDetail,
                    ACTION: this.Action.ADD,
                    IsCheck: true
                }], []);

            this.setRevenueCourtTable(byCreate);
        }, (err: HttpErrorResponse) => {
            this.ShowAlertError("API RevenueCourtDetailgetByCon :: " + err.message);
        });
    }

    async RevenueGetCase_R() {
        const paramsgetByCon = {
            REVENUE_ID: this.REVENUE_ID
        }
        const paramsgetByCreate = {
            OFFICE_CODE: this.localOfficeCode
        }

        await this.revService.requestAPI("RevenuegetByCon", paramsgetByCon).then(list => {
            for (var key in list) {
                if (list[key] === 'null') list[key] = null;
            }

            this.REVENUE_CODE = list.REVENUE_CODE;
            this.REVENUE_NO = list.REVENUE_NO;
            this.REVENUE_STATUS = list.REVENUE_STATUS;
            this.REVENUE_STATUS_TEXT = this.getRevenueStatusText(list.REVENUE_STATUS);
            this.RECEIVE_REF_NO = list.RECEIVE_REF_NO;
            this.RECEIVE_DATE = list.RECEIVE_DATE;
            this.FROM_OFFICE_NAME = list.DELIVERY_OFFICE_NAME;
            this.TO_OFFICE_NAME = list.RECEIVE_OFFICE_NAME;

            if (list.REVENUE_DATE) {
                var RevDate = list.REVENUE_DATE.toString().split(" ");
                this.REVENUE_DATE = setDateMyDatepicker(new Date(RevDate[0]));
                this.REVENUE_TIME = RevDate[1].slice(0, 5);
            } else {
                this.REVENUE_DATE = "";
                this.REVENUE_TIME = "";
            }

            this.DELIVERY_OFFICE_ID = list.DELIVERY_OFFICE_ID;
            this.DELIVERY_OFFICE_CODE = list.DELIVERY_OFFICE_CODE;
            this.DELIVERY_OFFICE_NAME = list.DELIVERY_OFFICE_NAME;

            this.RECEIVE_OFFICE_ID = list.RECEIVE_OFFICE_ID;
            this.RECEIVE_OFFICE_CODE = list.RECEIVE_OFFICE_CODE;
            this.RECEIVE_OFFICE_NAME = list.RECEIVE_OFFICE_NAME;

            list.RevenueStaff.filter(f => f.CONTRIBUTOR_ID == "35").map(m => {
                this.STAFF_INFORM_NAME = m.FIRST_NAME;
                this.STAFF_INFORM_MODEL = m;
            });

            list.RevenueStaff.filter(f => f.CONTRIBUTOR_ID == "36").map(m => {
                this.STAFF_SEND_NAME = m.TITLE_NAME_TH + m.FIRST_NAME + " " + m.LAST_NAME;
                this.STAFF_SEND_POS_NAME = m.OPREATION_POS_NAME;
                this.STAFF_SEND_OFFICE_NAME = this.MappingNullData(m.OPERATION_OFFICE_SHORT_NAME);
                this.STAFF_SEND_CODE = m.STAFF_ID;
                this.STAFF_SEND_MODEL = m;

            });

            list.RevenueStaff.filter(f => f.CONTRIBUTOR_ID == "37").map(m => {
                this.STAFF_SIGN_NAME = m.TITLE_NAME_TH + m.FIRST_NAME + " " + m.LAST_NAME;
                this.STAFF_SIGN_POS_NAME = m.OPREATION_POS_NAME;
                this.STAFF_SIGN_OFFICE_NAME = this.MappingNullData(m.OPERATION_OFFICE_SHORT_NAME);
                this.STAFF_SIGN_CODE = m.STAFF_ID;
                this.STAFF_SIGN_MODEL = m;
            });

            this.oParam = {
                RECEIVE_DATE: list.RECEIVE_DATE,
                IS_ACTIVE: list.IS_ACTIVE,
                RevenueDetailForRefID: list.RevenueDetail,
                RevenueDetail: [],
                RevenueStaff: [],
            }

        }, (err: HttpErrorResponse) => {
            this.ShowAlertError("API RevenuegetByCon :: " + err.message);
        });

        combineLatest(this.revService.RevenueComparegetByCreate(paramsgetByCreate), this.revService.RevenueComparegetByCon(paramsgetByCon))
            .pipe(takeUntil(this.destroy$))
            .subscribe((RevenueCompare) => {
                /**getByCreate set isCheck  */
                const byCreate = RevenueCompare[0].reduce((accu, curr) => {

                    let rcMapping = [];
                    if (curr.RevenueCompareMapping) {
                        rcMapping = curr.RevenueCompareMapping
                            .reduce((accuMap, currMap) => {

                                let detail = [];
                                if (currMap.RevenueCompareDetail) {
                                    detail = currMap.RevenueCompareDetail
                                        .reduce((accuRC, currRC) => {
                                            return [...accuRC, {
                                                IsCheck: false,
                                                ACTION: this.Action.ADD,
                                                ...currRC
                                            }]
                                        }, []);
                                }
                                return [...accuMap, {
                                    IsCheck: false,
                                    ACTION: this.Action.ADD,
                                    ...currMap,
                                    RevenueCompareDetail: detail,
                                }]
                            }, []);
                    }
                    return [...accu, {
                        ...curr,
                        IsCheck: false,
                        ACTION: this.Action.ADD,
                        RevenueCompareMapping: rcMapping,
                    }]
                }, []);

                /**getByCon set isCheck  */
                const byCon = RevenueCompare[1].reduce((accu, curr) => {

                    let rcMapping = [];
                    if (curr.RevenueCompareMapping) {
                        rcMapping = curr.RevenueCompareMapping
                            .reduce((accuMap, currMap) => {

                                let detail = [];
                                if (currMap.RevenueCompareDetail) {
                                    detail = currMap.RevenueCompareDetail
                                        .reduce((accuRC, currRC) => {
                                            return [...accuRC, {
                                                IsCheck: true,
                                                ACTION: this.Action.EDIT,
                                                ...currRC
                                            }]
                                        }, []);
                                }
                                return [...accuMap, {
                                    IsCheck: true,
                                    ACTION: this.Action.EDIT,
                                    ...currMap,
                                    RevenueCompareDetail: detail,
                                }]
                            }, []);
                    }
                    return [...accu, {
                        ...curr,
                        IsCheck: true,
                        ACTION: this.Action.EDIT,
                        RevenueCompareMapping: rcMapping,
                    }]
                }, []);

                /**concat data seted */
                const seted = [...byCon, ...byCreate];
                this.setRevenueCompareTable(seted);


                this.checkIfAllChbSelected();

            }, (err: HttpErrorResponse) => {
                this.ShowAlertError("API RevenueComparegetByCon :: " + err.message);
            });

        combineLatest(this.revService.RevenueCourtDetailgetByCreate(paramsgetByCreate), this.revService.RevenueCourtgetByCon(paramsgetByCon))
            .pipe(takeUntil(this.destroy$))
            .subscribe((RevenueCourt) => {

                /**getByCreate set model & isCheck*/
                const byCreate = RevenueCourt[0].reduce((a, c) =>
                    [...a, {
                        REVENUE_ID: this.REVENUE_ID,
                        LAWSUIT_ID: c.LAWSUIT_ID,
                        INDICTMENT_ID: c.INDICTMENT_ID,
                        OFFICE_ID: c.OFFICE_ID,
                        OFFICE_CODE: c.OFFICE_CODE,
                        OFFICE_NAME: c.OFFICE_NAME,
                        LAWSUIT_NO: c.LAWSUIT_NO,
                        IS_LAWSUIT: c.IS_LAWSUIT,
                        LAWSUIT_DATE: c.LAWSUIT_DATE,
                        IS_OUTSIDE: c.IS_OUTSIDE,
                        LawsuiltDetail: c.LawsuiltDetail,
                        ACTION: this.Action.ADD,
                        IsCheck: false
                    }], []);

                /**getByCon set model & isCheck*/
                const byCon = RevenueCourt[1].reduce((a, c) =>
                    [...a, {
                        REVENUE_ID: c.REVENUE_ID,
                        LAWSUIT_ID: c.LAWSUIT_ID,
                        INDICTMENT_ID: c.INDICTMENT_ID,
                        OFFICE_ID: c.OFFICE_ID,
                        OFFICE_CODE: c.OFFICE_CODE,
                        OFFICE_NAME: c.OFFICE_NAME,
                        LAWSUIT_NO: c.LAWSUILT_NO,
                        IS_LAWSUIT: c.IS_LAWSUIT,
                        LAWSUIT_DATE: c.LAWSUIT_DATE,
                        IS_OUTSIDE: c.IS_OUTSIDE,
                        LawsuiltDetail: c.RevenueLawsuitDetail,
                        ACTION: this.Action.EDIT,
                        IsCheck: true
                    }], []);

                /**concat data seted */
                const seted = [...byCon, ...byCreate];
                this.setRevenueCourtTable(seted);

            }, (err: HttpErrorResponse) => {
                this.ShowAlertError("API RevenueCourtgetByCon :: " + err.message);
            });
    }

    setRevenueCompareTable(res: any[]) {
        if (res.length > 0) {
            this.ListRevenueCompare = [];

            res.map(m => {
                let ListRevenueCompareDetail = [];
                m.RevenueCompareMapping.map(cm => {
                    let comma = (i) => i != 0 ? ', ' : '';
                    let lawbreaker = cm.RevenueCompareArrestIndictmentDetail.RevenueLawbreaker;
                    let lsProd = cm.RevenueCompareArrestIndictmentDetail.RevenueProductDetail;
                    let lawbreakerName = `${lawbreaker.TITLE_SHORT_NAME_TH == 'null' || lawbreaker.TITLE_SHORT_NAME_TH == null ? '' : lawbreaker.TITLE_SHORT_NAME_TH}`
                        + `${lawbreaker.FIRST_NAME == 'null' || lawbreaker.FIRST_NAME == null ? '' : lawbreaker.FIRST_NAME}` + ' '
                        + `${lawbreaker.LAST_NAME == 'null' || lawbreaker.LAST_NAME == null ? '' : lawbreaker.LAST_NAME}`;
                    if (cm.RevenueCompareDetail.length > 0) {

                        cm.RevenueCompareDetail.forEach(async cd => {
                            /** Fn */
                            const getIncProductGroupIdFn = async () => {
                                let res: any = "";
                                if (cm.RevenueCompareArrestIndictmentDetail['IS_PROVE'] == '0') {
                                    if (lsProd.length != 1) {
                                        let Inc: any = await this.revService.IncPaymentListGetByCon(this.REVENUE_ID);
                                        if (Inc.IncPayment) {
                                            Inc = Inc.IncPayment
                                                .reduce((a, c) => [...a, {
                                                    ...c,
                                                    COMPARE_DETAIL_ID: c.COMPARE_DETAIL_ID.split(",")
                                                }], [])
                                                .filter(f => f.COMPARE_DETAIL_ID
                                                    .some((s) => s == cd['COMPARE_DETAIL_ID'])
                                                ).reduce((a, c) => [...a, { PRODUCT_GROUP_ID: c.GROUPID }], []);

                                            res = Inc.length ? Inc[0]['PRODUCT_GROUP_ID'] : res;
                                        }
                                    } else if (lsProd.length == 1) {
                                        res = await lsProd[0]['PRODUCT_GROUP_ID'];
                                    }
                                }

                                return parseInt(res || 0);
                            }
                            /**end Fn */

                            let temp = {
                                IsCheck: this.mode == this.ModeAction.C ? true : cd.IsCheck,
                                COMPARE_DETAIL_ID: cd.COMPARE_DETAIL_ID,
                                LAWSUIT_DETAIL_ID: "",
                                COMPARE_MAPPING_ID: cm.COMPARE_MAPPING_ID,
                                RECEIPT_BOOK_NO: this.setReceiotBookNo(cd.RECEIPT_BOOK_NO),
                                LAWBREAKER_NAME: lawbreakerName,
                                PAYMENT_DATE: toLocalShort(cd.PAYMENT_DATE),
                                PAYMENT_FINE: cd.PAYMENT_FINE.toString(),
                                BRIBE_MONEY: cd.BRIBE_MONEY.toString(),
                                REWARD_MONEY: cd.REWARD_MONEY.toString(),
                                TREASURY_MONEY: cd.TREASURY_MONEY.toString(),
                                IS_PROVE: cm.RevenueCompareArrestIndictmentDetail['IS_PROVE'],
                                IS_PROD_LENGTH: lsProd.length, //temp
                                PRODUCT_GROUP_ID_TEMP: await getIncProductGroupIdFn(), //temp
                                RevenuePayment: cd['RevenuePayment'],
                                PRODUCT_DESC: this.filterDuplicate(lsProd, 'PRODUCT_GROUP_NAME')
                                    .reduce((a, c, i) => [...a,
                                    `${comma(i)}${c.PRODUCT_GROUP_NAME == 'null' || c.PRODUCT_GROUP_NAME == null ? '' : c.PRODUCT_GROUP_NAME}`
                                    ], "")
                            }
                            ListRevenueCompareDetail.push(temp);

                            await this.checkIfAllChbSelected();
                            await this.autoSetProductgroupcodeCaseNoProve_response();
                        });
                    }
                })

                const RevenueCompare = {
                    ...m,
                    COMPARE_ID: m.COMPARE_ID,
                    COMPARE_NO: m.COMPARE_NO,
                    LAWSUIT_ID: m.LAWSUIT_ID,
                    IsCheck: this.mode == this.ModeAction.C ? true : m.IsCheck,
                    RevenueCompareDetail: ListRevenueCompareDetail
                }

                this.ListRevenueCompare.push(RevenueCompare);
            });

            this.checkIfAllChbSelected();
            console.log('this.ListRevenueCompare : ', this.ListRevenueCompare)

            // this.paginage.TotalItems = this.ListRevenueCompareDetail.length;
            // this.ListRevenueCompareDetailPaging = this.ListRevenueCompareDetail.slice(0, this.paginage.RowsPerPageOptions[0]);

        } else {
            this.revenueCompare_collapes.next(false);
            this.preloader.setShowPreloader(false);
        }
    }

    setReceiotBookNo(input: string): string {
        let o: any[] = input.split("/");

        let recBookNo = '' + o[0];
        let pad = '00000';
        let $recBookNo = pad.substring(0, pad.length - recBookNo.length) + recBookNo;

        let recNo = '' + o[1];
        let pad1 = '00';
        let $recNo = pad.substring(0, pad1.length - recNo.length) + recNo;
        return `${$recBookNo}/${$recNo}`;
    }

    setRevenueCourtTable(res: any[]) {
        this.ListRevenueCourt = [];

        if (res.length > 0) {
            this.ListRevenueCourt = res.reduce((a, c) =>
                [...a, {
                    ...c,
                    IsCheck: this.mode == this.ModeAction.C ? true : c.IsCheck
                }], []);

            this.checkIfAllCourtChbSelected();
        } else {
            this.revenueLawsuit_collapes.next(false);
        }
        // this.courtpaginage.TotalItems = this.ListRevenueCourt.length;
        // this.ListRevenueCourtPaging = this.ListRevenueCourtPaging.slice(0, this.courtpaginage.RowsPerPageOptions[0]);
    }

    toggleRevenueCompareChk(i: number, value: any) {
        let RevenueCompareDetail$ = this.ListRevenueCompare[i].RevenueCompareDetail;
        RevenueCompareDetail$.map(m => m.IsCheck = value);
    }

    selectedChkAll() {
        this.ListRevenueCompare
            .map(rc => {
                rc.IsCheck = this.selectAllChb;
                rc.RevenueCompareDetail
                    .map(rcd => rcd.IsCheck = this.selectAllChb);
            })

        this.RevenueSummary();
    }

    checkIfAllChbSelected() {
        let RevenueCompareDetail = this.ListRevenueCompare
            .reduce((a, c) => { return [...a, ...c.RevenueCompareDetail] }, []);

        this.selectAllChb = RevenueCompareDetail.every(function (item: any) {
            return item.IsCheck == true;
        });

        this.RevenueSummary();
    }

    selectedCourtChkAll() {
        for (var i = 0; i < this.ListRevenueCourt.length; i++) {
            this.ListRevenueCourt[i].IsCheck = this.courtSelectAllChb;
        }

        this.CourtSummary();
    }

    checkIfAllCourtChbSelected() {
        this.courtSelectAllChb = this.ListRevenueCourt.every(function (item: any) {
            return item.IsCheck == true;
        });

        this.CourtSummary();
    }

    revenueTimeInvalidSet = (invalid) => this.revenueTimeInvalidCheck = invalid;

    // **********************************
    // -------------- Action -------------
    // **********************************
    //#region 
    async OnSave() {

        if (this.STAFF_SEND_CODE == "") {
            this.STAFF_SEND_NAME = "";
            this.STAFF_SEND_MODEL = null;
        }

        if (this.STAFF_SIGN_CODE == "") {
            this.STAFF_SIGN_NAME = "";
            this.STAFF_SIGN_MODEL = null;
        }

        if (this.DELIVERY_OFFICE_CODE == "") {
            this.FROM_OFFICE_NAME = "";
            this.STATION_FROM_MODEL = null;
        }

        if (this.RECEIVE_OFFICE_CODE == "") {
            this.TO_OFFICE_NAME = "";
            this.STATION_TO_MODEL = null;
        }

        // if (this.STAFF_INFORM_MODEL == undefined || this.STAFF_INFORM_MODEL.STAFF_ID == null || this.STAFF_INFORM_MODEL.STAFF_ID == undefined) {
        //     this.STAFF_INFORM_MODEL = null;
        // }
        if (this.STAFF_INFORM_NAME == null || this.STAFF_INFORM_NAME == '' || this.STAFF_INFORM_NAME == undefined) {
            this.STAFF_INFORM_NAME = null;
        }

        if (this.REVENUE_DATE == null || this.REVENUE_DATE == undefined || this.REVENUE_DATE == "") {
            this.isReq_revDate.next(true);
            this.ShowAlertWarning('กรุณาระบุข้อมูล "วันที่นำส่ง"');

            return false;
        }

        if (this.revenueTimeInvalidCheck == true) {
            this.isReq_revTime.next(true);
            this.ShowAlertWarning('กรุณาระบุข้อมูล "เวลานำส่งเป็น hh:mm"');

            return false;
        }

        if (this.REVENUE_TIME == null || this.REVENUE_TIME == undefined || this.REVENUE_TIME == "") {
            this.isReq_revTime.next(true);
            this.ShowAlertWarning('กรุณาระบุข้อมูล "เวลานำส่ง"');

            return false;
        }

        if (this.REVENUE_NO == null || this.REVENUE_NO == undefined) {
            this.isReq_revNo.next(true);
            this.ShowAlertWarning('กรุณาระบุข้อมูล "เลขที่หนังสือนำส่ง"');

            return false;
        }

        if (this.DELIVERY_OFFICE_CODE == null || this.DELIVERY_OFFICE_CODE == undefined || this.DELIVERY_OFFICE_CODE == "") {
            this.isReq_deliveryOfficeCode.next(true);
            this.ShowAlertWarning('กรุณาระบุข้อมูล "สถานที่นำส่งเงิน"');

            return false;
        }

        // if (this.RECEIVE_OFFICE_CODE == null || this.RECEIVE_OFFICE_CODE == undefined || this.RECEIVE_OFFICE_CODE == "") {
        //     this.isReq_receiveOfficeCode.next(true);
        //     this.ShowAlertWarning('กรุณาระบุข้อมูล "หน่วยงานปลายทาง"');

        //     return false;
        // }

        if (this.STAFF_SEND_NAME == null || this.STAFF_SEND_NAME == undefined || this.STAFF_SEND_NAME == "") {
            this.isReq_staffSend.next(true);
            this.ShowAlertWarning('กรุณาระบุข้อมูล "ชื่อผู้นำส่งเงิน"');

            return false;
        }

        if (this.STAFF_SIGN_NAME == null || this.STAFF_SIGN_NAME == undefined || this.STAFF_SIGN_NAME == "") {
            this.isReq_staffSign.next(true);
            this.ShowAlertWarning('กรุณาระบุข้อมูล "ชื่อผู้มีอำนาจลงนาม"');

            return false;
        }

        if (this.isReq_pGroupId_noProve.getValue()) {
            this.ShowAlertWarning('กรุณาเลือกหมวดของกลาง');

            return false;
        }

        let RevenueCompare = this.ListRevenueCompare
            .filter(item => item.IsCheck === true)
            .reduce((a, c) => { return [...a, ...c.RevenueCompareDetail] }, []);

        let RevenueCourt = this.ListRevenueCourt
            .filter(item => item.IsCheck === true)
            .reduce((a, c) => { return [...a, ...c.LawsuiltDetail] }, []);

        const revenueDtail = [...RevenueCompare, ...RevenueCourt];

        if (revenueDtail.length == 0) {
            this.ShowAlertWarning("กรุณาเลือกรายการนำส่งเงินรายได้");

            return false;
        }

        switch (this.mode) {
            case this.ModeAction.C:
                await this.OnInsRevenue();
                break;

            case this.ModeAction.R:
                this.OnUpdRevenue();
                break;

            default:
                break;
        }
    }

    OnEdit() {
        /**check RecStatus */
        this.preloader.setShowPreloader(true);
        const d = this.oParam['RevenueDetailForRefID'];
        this.revService.IncFri8100(this.REVENUE_CODE).subscribe(res => {
            let temp = [res].reduce((a, c) =>
                [...a, {
                    ...c ? c : [],
                    RevenueDetail: d,
                    REVENUE_ID: this.REVENUE_ID
                }], [])
                .filter(f => f['PenaltyList'])
                .filter(f => f['PenaltyList'][0]['RecStatus'] == '1');

            if (temp.length > 0) {
                const RecStatusEqualto1 = temp.reduce((a, c) =>
                    [...a, {
                        REVENUE_ID: c['REVENUE_ID'],
                        RECEIVE_DATE: "",
                        RECEIVE_REF_NO: "",
                        COMPARE_DETAIL: c['RevenueDetail']
                            .reduce((a, c) => { return [...a, { COMPARE_DETAIL_ID: c['COMPARE_DETAIL_ID'] }] }, [])
                            .filter(f => f['COMPARE_DETAIL_ID']),

                        PAYMENT: c['RevenueDetail']
                            .reduce((a, c) => { return [...a, { PAYMENT_ID: c['PAYMENT_ID'] }] }, [])
                            .filter(f => f['PAYMENT_ID']),

                        REVENUE_DETAIL: c['RevenueDetail']
                            .reduce((a, c) => { return [...a, { REVENUE_DETAIL_ID: c['REVENUE_DETAIL_ID'] }] }, [])
                            .filter(f => f['REVENUE_DETAIL_ID'])
                    }], []);

                if (RecStatusEqualto1.length) {
                    this.revService.RevenueReturnUpdateREFno(RecStatusEqualto1).subscribe(x => {
                        const objRes: any[] = [x];
                        if (objRes.filter(o => o['IsSuccess'] == 'False').length) {
                            this.swalFn('', 'RevenueReturnUpdateREFno service failed!', 'warning')
                                .then(next => { if (next) this.router.navigate(['/revenue/list']); })
                        }
                    });
                }

                this.ShowAlertWarning(this.cannotEditMgs);
                this.preloader.setShowPreloader(false);
                return;
            }

            this.SaveButton.next(true);
            this.CancelButton.next(true);
            this.EditButton.next(false);
            this.DeleteButton.next(false);
            this.PrintButton.next(false);
            this.showEditField = false;

            this.preloader.setShowPreloader(false);
        });
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
                if (this.mode === this.ModeAction.C) {
                    this.router.navigate(['/revenue/list']);
                } else if (this.mode === this.ModeAction.R) {
                    this.RevenueGetCase_R();

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

    // OnDelete() {
    //     swal({
    //         title: '',
    //         text: Message.confirmAction,
    //         type: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'ยืนยัน',
    //         cancelButtonText: 'ยกเลิก'
    //     }).then((result) => {
    //         if (result.value) {
    //             this.oParam = {
    //                 REVENUE_ID: this.REVENUE_ID
    //             }
    //             let isSuccess: boolean = true;

    //             this.revService.requestAPI("RevenueupdDelete", this.oParam).then(async IsSuccess => {
    //                 if (IsSuccess) {
    //                     // this.ListRevenueCompareDetail.map(async m => {
    //                     //     this.revService.requestAPI("RevenueCompareDetailReceiptupdDelete", { COMPARE_DETAIL_ID: m.COMPARE_DETAIL_ID }).then(pRes => {
    //                     //         if (!pRes.IsSuccess) {
    //                     //             isSuccess = pRes.IsSuccess;
    //                     //             return false;
    //                     //         }
    //                     //     }, (error) => { console.error(error); return false; });
    //                     // });

    //                     this.ListRevenueCourt.map(async m => {
    //                         this.revService.requestAPI("RevenueCourtDetailupdDelete", { LAWSUIT_DETAIL_ID: m.LAWSUIT_DETAIL_ID }).then(pRes => {
    //                             if (!pRes.IsSuccess) {
    //                                 isSuccess = pRes.IsSuccess;
    //                                 return false;
    //                             }
    //                         }, (error) => { console.error(error); return false; });
    //                     });

    //                     if (isSuccess) {
    //                         this.router.navigate(['/revenue/list']);
    //                     } else {
    //                         this.ShowAlertError(Message.saveFail);
    //                         this.preloader.setShowPreloader(false);
    //                     }
    //                 } else {
    //                     this.ShowAlertError(Message.saveFail);
    //                     this.preloader.setShowPreloader(false);
    //                 }
    //             }, (error) => { console.error(error); });
    //         }
    //     })
    // }

    onComplete() {
        this.showEditField = true;
        this.EditButton.next(true);
        this.DeleteButton.next(true);

        this.CancelButton.next(false);
        this.SaveButton.next(false);
    }

    OnPrint() {
        this.modal = this.ngbModel.open(this.printDocModel, { size: 'lg', centered: true })
    }

    //#endregion



    // **********************************
    // -------------- Event -------------
    // **********************************
    //#region 
    async OnInsRevenue() {
        this.REVENUE_CODE = `${this.REVENUE_CODE == this.AutoGenerate ? "" : this.REVENUE_CODE}`;

        const RevDate = this.REVENUE_DATE
            ? this.toDateTZ(`${convertDateForSave(this.getDateMyDatepicker(this.REVENUE_DATE))} ${this.REVENUE_TIME}`)
            : '';

        let RevenueCompare$ = this.ListRevenueCompare
            .filter(item => item.IsCheck === true);
        let RevenueCourt$ = this.ListRevenueCourt
            .filter(item => item.IsCheck === true);
        const revenue_count = [...RevenueCompare$, ...RevenueCourt$];
        this.REVENUE_COUNT = revenue_count.length;

        this.oParam = {
            DELIVERY_OFFICE_ID: this.DELIVERY_OFFICE_ID,
            RECEIVE_OFFICE_ID: this.RECEIVE_OFFICE_ID,
            REVENUE_CODE: "",
            DELIVERY_OFFICE_CODE: this.DELIVERY_OFFICE_CODE,
            DELIVERY_OFFICE_NAME: this.DELIVERY_OFFICE_NAME,
            RECEIVE_OFFICE_CODE: this.RECEIVE_OFFICE_CODE,
            RECEIVE_OFFICE_NAME: this.RECEIVE_OFFICE_NAME,
            REVENUE_ID: 0,
            REVENUE_NO: this.REVENUE_NO,
            REVENUE_DATE: RevDate,
            REVENUE_STATUS: "1",
            REVENUE_COUNT: this.REVENUE_COUNT,
            FINE: 0,//this.PAYMENT_FINE_TOTAL,
            TREASURY_MONEY: 0,//this.TREASURY_MONEY_TOTAL,
            BRIBE_MONEY: 0,//this.BRIBE_MONEY_TOTAL,
            REWARD_MONEY: 0,//this.COURT_REWARD_MONEY_TOTAL,
            RECEIVE_REF_NO: "",
            RECEIVE_DATE: "",
            IS_ACTIVE: "1",
            RevenueDetail: [],
            RevenueStaff: [],
        }

        let STAFF_SEND = { CONTRIBUTOR_ID: "" };
        let STAFF_SIGN = { CONTRIBUTOR_ID: "" };
        let STAFF_INFORM = { CONTRIBUTOR_ID: "", FIRST_NAME: "", STAFF_TYPE: 0, STATUS: 1, IS_ACTIVE: 1 };

        Object.assign(STAFF_SEND, this.STAFF_SEND_MODEL);
        Object.assign(STAFF_SIGN, this.STAFF_SIGN_MODEL);
        // Object.assign(STAFF_INFORM, this.STAFF_INFORM_NAME);

        STAFF_SEND.CONTRIBUTOR_ID = "36";
        STAFF_SIGN.CONTRIBUTOR_ID = "37";

        this.oParam.RevenueStaff.push(STAFF_SEND);
        this.oParam.RevenueStaff.push(STAFF_SIGN);


        if (this.STAFF_INFORM_NAME != null) {
            STAFF_INFORM.CONTRIBUTOR_ID = "35";
            STAFF_INFORM.FIRST_NAME = this.STAFF_INFORM_NAME;
            this.oParam.RevenueStaff.push(STAFF_INFORM);
        }

        /** RevenueCompare */

        let ListRevenueCompareDetail = this.ListRevenueCompare
            .filter(item => item.IsCheck === true)
            .reduce((a, c) => {

                let RevenueCompareDetail = [];
                if (c.RevenueCompareDetail) {
                    RevenueCompareDetail = c.RevenueCompareDetail.reduce((accuRC, currRC) => {

                        let payment = [];
                        if (currRC.RevenuePayment) {
                            payment = currRC.RevenuePayment.reduce((accuPm, currPm) => {
                                return [...accuPm, {
                                    IsCheck: c['IsCheck'],
                                    ACTION: c['ACTION'],
                                    ...currPm
                                }]
                            }, []);
                        }

                        return [...accuRC, {
                            ...currRC,
                            IsCheck: c['IsCheck'],
                            ACTION: c['ACTION'],
                            RevenuePayment: payment
                        }]
                    }, []);
                }
                return [...a, ...RevenueCompareDetail];
            }, []);

        let RevenuePayment = ListRevenueCompareDetail.reduce((a, c) => { return [...a, ...c.RevenuePayment] }, []);

        RevenuePayment.map(async item => {
            let oDetail = {
                REVENUE_DETAIL_ID: "",
                REVENUE_ID: "",
                COMPARE_DETAIL_ID: item.COMPARE_DETAIL_ID,
                REVENUE_STATUS: 1,
                IS_ACTIVE: 1,
                LAWSUIT_DETAIL_ID: item.LAWSUIT_DETAIL_ID,
                PAYMENT_ID: item.PAYMENT_ID,
                IsCheck: item.IsCheck,
                ACTION: item.ACTION,
            }

            this.oParam.RevenueDetail.push(oDetail);
        })

        let FINE_TOTAL = 0;
        let TREASURY_MONEY_TOTAL = 0;
        let BRIBE_MONEY_TOTAL = 0;
        let REWARD_MONEY_TOTAL = 0;

        FINE_TOTAL = RevenuePayment.reduce((a, c) =>
            a + parseFloat(c.FINE), FINE_TOTAL);
        TREASURY_MONEY_TOTAL = ListRevenueCompareDetail.reduce((a, c) =>
            a + parseFloat(c.TREASURY_MONEY), TREASURY_MONEY_TOTAL);
        BRIBE_MONEY_TOTAL = ListRevenueCompareDetail.reduce((a, c) =>
            a + parseFloat(c.BRIBE_MONEY), BRIBE_MONEY_TOTAL);
        REWARD_MONEY_TOTAL = ListRevenueCompareDetail.reduce((a, c) =>
            a + parseFloat(c.REWARD_MONEY), REWARD_MONEY_TOTAL);

        /** RevenueCourt */

        // let lawsuiltDetail = this.ListRevenueCourt
        //     .filter(item => item.IsCheck === true)
        //     .reduce((a, c) => { return [...a, ...c.LawsuiltDetail] }, []);
        let lawsuiltDetail = this.ListRevenueCourt
            .filter(item => item.IsCheck === true)
            .reduce((a, c) => {

                let LawsuiltDetail = [];
                if (c.LawsuiltDetail) {
                    LawsuiltDetail = c.LawsuiltDetail.reduce((accuLD, currLD) => {

                        let payment = [];
                        if (currLD.Payment) {
                            payment = currLD.Payment.reduce((accuPm, currPm) => {
                                return [...accuPm, {
                                    IsCheck: c['IsCheck'],
                                    ACTION: c['ACTION'],
                                    ...currPm
                                }]
                            }, []);
                        }

                        return [...accuLD, {
                            ...currLD,
                            IsCheck: c['IsCheck'],
                            ACTION: c['ACTION'],
                            Payment: payment
                        }]
                    }, []);
                }
                return [...a, ...LawsuiltDetail]
            }, []);


        let Payment = lawsuiltDetail.reduce((a, c) => { return [...a, ...c.Payment] }, []);

        Payment.map(async item => {
            let oDetail = {
                REVENUE_DETAIL_ID: "",
                REVENUE_ID: "",
                COMPARE_DETAIL_ID: item.COMPARE_DETAIL_ID,
                REVENUE_STATUS: 1,
                IS_ACTIVE: 1,
                LAWSUIT_DETAIL_ID: item.LAWSUIT_DETAIL_ID,
                PAYMENT_ID: item.PAYMENT_ID,
                IsCheck: item.IsCheck,
                ACTION: item.ACTION,
            }

            this.oParam.RevenueDetail.push(oDetail);
        })

        FINE_TOTAL = Payment.reduce((a, c) =>
            a + parseFloat(c.FINE), FINE_TOTAL);
        TREASURY_MONEY_TOTAL = Payment.reduce((a, c) =>
            a + parseFloat(c.TREASURY_MONEY), TREASURY_MONEY_TOTAL);
        BRIBE_MONEY_TOTAL = Payment.reduce((a, c) =>
            a + parseFloat(c.BRIBE_MONEY), BRIBE_MONEY_TOTAL);
        REWARD_MONEY_TOTAL = Payment.reduce((a, c) =>
            a + parseFloat(c.REWARD_MONEY), REWARD_MONEY_TOTAL);

        this.oParam.FINE = parseFloat(FINE_TOTAL.toFixed(2));
        this.oParam.TREASURY_MONEY = parseFloat(TREASURY_MONEY_TOTAL.toFixed(2));
        this.oParam.BRIBE_MONEY = parseFloat(BRIBE_MONEY_TOTAL.toFixed(2));
        this.oParam.REWARD_MONEY = parseFloat(REWARD_MONEY_TOTAL.toFixed(2));

        await this.TransactionRunningHandling();
    }

    OnUpdRevenue() {
        let RevenueCompare$ = this.ListRevenueCompare
            .filter(item => item.IsCheck === true)
        let RevenueCourt$ = this.ListRevenueCourt
            .filter(item => item.IsCheck === true)
        const REVENUE_COUNT = [...RevenueCompare$, ...RevenueCourt$];
        this.REVENUE_COUNT = REVENUE_COUNT.length;

        this.oParam = {
            ...this.oParam,
            DELIVERY_OFFICE_ID: this.DELIVERY_OFFICE_ID,
            RECEIVE_OFFICE_ID: this.RECEIVE_OFFICE_ID,
            REVENUE_CODE: this.REVENUE_CODE,
            DELIVERY_OFFICE_CODE: this.DELIVERY_OFFICE_CODE,
            DELIVERY_OFFICE_NAME: this.DELIVERY_OFFICE_NAME,
            RECEIVE_OFFICE_CODE: this.RECEIVE_OFFICE_CODE,
            RECEIVE_OFFICE_NAME: this.RECEIVE_OFFICE_NAME,
            REVENUE_ID: this.REVENUE_ID,
            REVENUE_NO: this.REVENUE_NO,
            REVENUE_DATE: this.REVENUE_DATE
                ? this.toDateTZ(`${convertDateForSave(this.getDateMyDatepicker(this.REVENUE_DATE))} ${this.REVENUE_TIME}`)
                : '',
            REVENUE_STATUS: this.REVENUE_STATUS,
            REVENUE_COUNT: this.REVENUE_COUNT,
            FINE: this.PAYMENT_FINE_TOTAL,
            TREASURY_MONEY: this.TREASURY_MONEY_TOTAL,
            BRIBE_MONEY: this.BRIBE_MONEY_TOTAL,
            REWARD_MONEY: this.COURT_REWARD_MONEY_TOTAL,
            RECEIVE_REF_NO: this.RECEIVE_REF_NO,
            RECEIVE_DATE: this.RECEIVE_DATE ? this.toDateTZ(this.RECEIVE_DATE) : '',
            RevenueDetail: [],
            RevenueStaff: [],
        }

        let getRevDetailRefID = (refId: any, feildRef: string) =>
            this.oParam['RevenueDetailForRefID'].find(f => f[`${feildRef}`] == `${refId}`);

        /** RevenueCompare */

        // let ListRevenueCompareDetail_old = this.ListRevenueCompare
        //     // .filter(item => item.IsCheck === true)
        //     .reduce((a, c) => { return [...a, ...c.RevenueCompareDetail] }, []);
        let ListRevenueCompareDetail = this.ListRevenueCompare.reduce((a, c) => {

            let RevenueCompareDetail = [];
            if (c.RevenueCompareDetail) {
                RevenueCompareDetail = c.RevenueCompareDetail.reduce((accuRC, currRC) => {

                    let payment = [];
                    if (currRC.RevenuePayment) {
                        payment = currRC.RevenuePayment.reduce((accuPm, currPm) => {
                            return [...accuPm, {
                                IsCheck: c['IsCheck'],
                                ACTION: c['ACTION'],
                                ...currPm
                            }]
                        }, []);
                    }

                    return [...accuRC, {
                        ...currRC,
                        IsCheck: c['IsCheck'],
                        ACTION: c['ACTION'],
                        RevenuePayment: payment
                    }]
                }, []);
            }
            return [...a, ...RevenueCompareDetail]
        }, []);

        let RevenuePayment = ListRevenueCompareDetail.reduce((a, c) => { return [...a, ...c.RevenuePayment] }, []);
        let oDetailCompare = RevenuePayment.reduce((a, c) =>
            [...a, {
                REVENUE_DETAIL_ID: getRevDetailRefID(c.PAYMENT_ID, 'PAYMENT_ID')
                    ? getRevDetailRefID(c.PAYMENT_ID, 'PAYMENT_ID').REVENUE_DETAIL_ID
                    : '', //ถ้า err แสดงว่าไม่มี PAYMENT_ID ไว้สำหรับอ้างอิง เกิดจากทั้งสองเส้น return ไม่เหมือนกัน
                REVENUE_ID: this.REVENUE_ID,
                COMPARE_DETAIL_ID: c.COMPARE_DETAIL_ID,
                REVENUE_STATUS: getRevDetailRefID(c.PAYMENT_ID, 'PAYMENT_ID')
                    ? getRevDetailRefID(c.PAYMENT_ID, 'PAYMENT_ID').REVENUE_STATUS
                    : '',
                IS_ACTIVE: c.IS_ACTIVE,
                LAWSUIT_DETAIL_ID: c.LAWSUIT_DETAIL_ID,
                PAYMENT_ID: c.PAYMENT_ID,
                IsCheck: c.IsCheck,
                ACTION: c.ACTION,
            }], []);
        this.oParam.RevenueDetail = [...this.oParam.RevenueDetail, ...oDetailCompare];

        let FINE_TOTAL = 0;
        let TREASURY_MONEY_TOTAL = 0;
        let BRIBE_MONEY_TOTAL = 0;
        let REWARD_MONEY_TOTAL = 0;

        FINE_TOTAL = RevenuePayment.reduce((a, c) =>
            a + parseFloat(c.FINE), FINE_TOTAL);
        TREASURY_MONEY_TOTAL = ListRevenueCompareDetail.reduce((a, c) =>
            a + parseFloat(c.TREASURY_MONEY), TREASURY_MONEY_TOTAL);
        BRIBE_MONEY_TOTAL = ListRevenueCompareDetail.reduce((a, c) =>
            a + parseFloat(c.BRIBE_MONEY), BRIBE_MONEY_TOTAL);
        REWARD_MONEY_TOTAL = ListRevenueCompareDetail.reduce((a, c) =>
            a + parseFloat(c.REWARD_MONEY), REWARD_MONEY_TOTAL);

        /** RevenueCourt */

        // let lawsuiltDetail_old = this.ListRevenueCourt
        //     .reduce((a, c) => { return [...a, ...c.LawsuiltDetail] }, []);
        let lawsuiltDetail = this.ListRevenueCourt.reduce((a, c) => {

            let LawsuiltDetail = [];
            if (c.LawsuiltDetail) {
                LawsuiltDetail = c.LawsuiltDetail.reduce((accuLD, currLD) => {

                    let payment = [];
                    if (currLD.Payment) {
                        payment = currLD.Payment.reduce((accuPm, currPm) => {
                            return [...accuPm, {
                                IsCheck: c['IsCheck'],
                                ACTION: c['ACTION'],
                                ...currPm
                            }]
                        }, []);
                    }

                    return [...accuLD, {
                        ...currLD,
                        IsCheck: c['IsCheck'],
                        ACTION: c['ACTION'],
                        Payment: payment
                    }]
                }, []);
            }
            return [...a, ...LawsuiltDetail]
        }, []);

        let Payment = lawsuiltDetail.reduce((a, c) => { return [...a, ...c.Payment] }, []);
        let oDetailCourt = Payment.reduce((a, c) =>
            [...a, {
                REVENUE_DETAIL_ID: getRevDetailRefID(c.PAYMENT_ID, 'PAYMENT_ID')
                    ? getRevDetailRefID(c.PAYMENT_ID, 'PAYMENT_ID').REVENUE_DETAIL_ID
                    : '',
                REVENUE_ID: this.REVENUE_ID,
                COMPARE_DETAIL_ID: c.COMPARE_DETAIL_ID,
                REVENUE_STATUS: getRevDetailRefID(c.PAYMENT_ID, 'PAYMENT_ID')
                    ? getRevDetailRefID(c.PAYMENT_ID, 'PAYMENT_ID').REVENUE_STATUS
                    : '',
                IS_ACTIVE: c.IS_ACTIVE,
                LAWSUIT_DETAIL_ID: c.LAWSUIT_DETAIL_ID,
                PAYMENT_ID: c.PAYMENT_ID,
                IsCheck: c.IsCheck,
                ACTION: c.ACTION,
            }], []);
        this.oParam.RevenueDetail = [...this.oParam.RevenueDetail, ...oDetailCourt];

        FINE_TOTAL = Payment.reduce((a, c) =>
            a + parseFloat(c.FINE), FINE_TOTAL);
        TREASURY_MONEY_TOTAL = Payment.reduce((a, c) =>
            a + parseFloat(c.TREASURY_MONEY), TREASURY_MONEY_TOTAL);
        BRIBE_MONEY_TOTAL = Payment.reduce((a, c) =>
            a + parseFloat(c.BRIBE_MONEY), BRIBE_MONEY_TOTAL);
        REWARD_MONEY_TOTAL = Payment.reduce((a, c) =>
            a + parseFloat(c.REWARD_MONEY), REWARD_MONEY_TOTAL);

        this.oParam.FINE = parseFloat(FINE_TOTAL.toFixed(2));
        this.oParam.TREASURY_MONEY = parseFloat(TREASURY_MONEY_TOTAL.toFixed(2));
        this.oParam.BRIBE_MONEY = parseFloat(BRIBE_MONEY_TOTAL.toFixed(2));
        this.oParam.REWARD_MONEY = parseFloat(REWARD_MONEY_TOTAL.toFixed(2));

        let STAFF_INFORM = {
            CONTRIBUTOR_ID: "35", REVENUE_ID: this.REVENUE_ID, FIRST_NAME: "",
            STAFF_ID: "", STAFF_TYPE: 0, STATUS: 1, IS_ACTIVE: 1
        };
        let STAFF_SEND = { CONTRIBUTOR_ID: "36", REVENUE_ID: this.REVENUE_ID, };
        let STAFF_SIGN = { CONTRIBUTOR_ID: "37", REVENUE_ID: this.REVENUE_ID, };

        this.STAFF_SEND_MODEL.STAFF_ID = this.STAFF_SEND_CODE;
        this.STAFF_SIGN_MODEL.STAFF_ID = this.STAFF_SIGN_CODE;

        Object.assign(STAFF_SEND, this.STAFF_SEND_MODEL);
        Object.assign(STAFF_SIGN, this.STAFF_SIGN_MODEL);
        // Object.assign(STAFF_INFORM, this.STAFF_INFORM_NAME);

        this.oParam.RevenueStaff.push(STAFF_SEND);
        this.oParam.RevenueStaff.push(STAFF_SIGN);

        if (this.STAFF_INFORM_NAME != null) {
            STAFF_INFORM.STAFF_ID = this.STAFF_INFORM_MODEL.STAFF_ID;
            STAFF_INFORM.REVENUE_ID = this.STAFF_INFORM_MODEL.REVENUE_ID;
            STAFF_INFORM.FIRST_NAME = this.STAFF_INFORM_NAME;
            this.oParam.RevenueStaff.push(STAFF_INFORM);
        }

        let result = [];
        let zip$ = new Observable<any>();
        let request = new Observable<any>();

        this.preloader.setShowPreloader(true);

        request = this.revService.RevenueupdByCon(this.oParam).pipe(
            mergeMap(x => {
                return merge(
                    Observable.of(x),
                    this.RevenueCompareModify(),
                    this.RevenuePaymentModify(),
                    this.RevenueDetailModify_caseUpdateOnly()
                )
            })
        )

        zip$ = Observable.zip(request)
            .pipe(map(x => { return result = [...result, ...x]; }));

        forkJoin(zip$)
            .subscribe(x => {
                const objRes: any[] = x[0];
                this.revenueDetailUpdResponse = objRes;

                if (objRes.filter(o => o['IsSuccess'] == 'False').length) {
                    this.revenueUpdateReverse();
                } else {
                    let incResult = [];
                    let incZip$ = new Observable<any>();
                    let incRequest = new Observable<any>();

                    incRequest = this.IncModify();

                    incZip$ = Observable.zip(incRequest)
                        .pipe(map(x => { return incResult = [...incResult, ...x]; }))

                    forkJoin(incZip$).subscribe(x => {
                        const incObjRes: any[] = x[0];
                        this.IncUpdResponse = incObjRes;
                        if (incObjRes.filter(o => o['IsSuccess'] == 'False').length) {
                            this.revenueUpdateReverse();
                        } else {
                            this.preloader.setShowPreloader(false);
                            this.swalFn('', Message.saveComplete, 'success')
                                .then((r) => {
                                    if (r) {
                                        this.router.navigate([`/revenue/manage/R/${this.REVENUE_ID}`]);
                                        setTimeout(() => {
                                            location.reload();
                                        }, 200);
                                    }
                                });
                        }
                    });
                }

            }, () => {
                this.preloader.setShowPreloader(false);
                this.ShowAlertWarning(Message.saveFail);
            });
    }

    async TransactionRunningHandling() {
        this.preloader.setShowPreloader(true);
        await this.revService.TransactionRunninggetByCon("OPS_REVENUE", this.localOfficeCode).then(async item => {
            if (item.length == 0) {
                this.TransactionRunninginsAll();
            } else {
                await this.revService.TransactionRunningupdByCon(item[0].RUNNING_ID).then(async res => {
                    if (res.IsSuccess) {
                        let str = "" + item[0].RUNNING_NO;
                        var pad = "00000";
                        const RUNNING_NO = pad.substring(0, pad.length - str.length) + (parseInt(str)).toString();
                        this.REVENUE_CODE = "LC" + item[0].RUNNING_OFFICE_CODE + "" + item[0].RUNNING_YEAR + RUNNING_NO;
                        this.InsRevenue();
                    }
                }, (error) => {
                    console.error(error); this.preloader.setShowPreloader(false);
                    this.ShowAlertError(this.msgTransectionFailed); return false;
                });
            }
        }, (error) => {
            console.error(error); this.preloader.setShowPreloader(false);
            this.ShowAlertError(this.msgTransectionFailed); return false;
        });
    }

    async TransactionRunninginsAll() {
        await this.revService.TransactionRunninginsAll(this.OFFICE_LIST.find(f => f.OFFICE_CODE == this.localOfficeCode).OFFICE_ID
            , this.localOfficeCode, "OPS_REVENUE", "LC"
            , (this.REVENUE_DATE.date.year + 543).toString().substring(4, 2)
            , this.REVENUE_DATE.date.month)
            .then(async res => {
                if (res.IsSuccess == 'False') {
                    this.ShowAlertError(this.msgTransectionFailed);
                    this.preloader.setShowPreloader(false); return false;
                }
                this.TransactionRunningHandling();
            }, (error) => {
                console.error(error); this.preloader.setShowPreloader(false);
                this.ShowAlertError(this.msgTransectionFailed); return false;
            });
    }

    InsRevenue() {
        this.preloader.setShowPreloader(true);

        this.oParam.REVENUE_CODE = this.REVENUE_CODE;

        let result = [];
        let zip$ = new Observable<any>();
        let request = new Observable<any>();

        request = this.revService.RevenueinsAll(this.oParam).pipe(
            mergeMap(x => {
                this.REVENUE_ID = x['REVENUE_ID'];
                return merge(
                    Observable.of(x),
                    this.RevenueCompareModify(),
                    this.RevenuePaymentModify()
                )
            })
        ).finally(() => this.preloader.setShowPreloader(false));

        zip$ = Observable.zip(request)
            .pipe(map(x => { return result = [...result, ...x]; }))

        forkJoin(zip$)
            .subscribe(x => {
                const objRes: any[] = x[0];
                if (objRes.filter(o => o['IsSuccess'] == 'False').length) {
                    this.RevenueDeleteAll(Message.saveFail);
                } else {
                    //ส่งไป insert INC แล้วเช็ค response อีกที ถ้าไม่สำเร็จส่งลบทั้งหมดเลย
                    this.preloader.setShowPreloader(true);
                    let incResult = [];
                    let incZip$ = new Observable<any>();
                    let incRequest = new Observable<any>();

                    incRequest = this.IncModify();

                    incZip$ = Observable.zip(incRequest)
                        .pipe(map(x => { return incResult = [...incResult, ...x]; }))

                    forkJoin(incZip$).subscribe(x => {
                        const incObjRes: any[] = x[0];
                        if (incObjRes.filter(o => o['IsSuccess'] == 'False').length) {
                            this.preloader.setShowPreloader(false);
                            this.RevenueDeleteAll(Message.RevenueIncFail);
                        } else {
                            this.swalFn('', Message.saveComplete, 'success')
                                .then((r) => {
                                    if (r) {
                                        this.preloader.setShowPreloader(false);
                                        this.router.navigate([`/revenue/manage/R/${this.REVENUE_ID}`]);
                                        setTimeout(() => {
                                            location.reload();
                                        }, 200);
                                    }
                                });
                        }
                    })
                }

            }, () => {
                this.preloader.setShowPreloader(false);
                this.ShowAlertWarning(Message.saveFail);
            });
    }
    //#endregion

    RevenueDeleteAll(errorMessage: string) {
        this.preloader.setShowPreloader(true);
        let result = [];
        let zip$ = new Observable<any>();
        let request = new Observable<any>();

        request = this.RevenueDeleteAllModify();

        zip$ = Observable.zip(request)
            .pipe(map(x => { return result = [...result, ...x]; }))

        forkJoin(zip$)
            .subscribe(x => {
                const objRes: any[] = x[0];
                if (objRes.filter(o => o['IsSuccess'] == 'False').length) {
                    this.swalFn('', Message.saveFail, 'warning')
                        .then(v => { if (v) this.RevenueDeleteAll(Message.saveFail_plsContactAdm) }); // May not leave the loop when response is false
                } else {
                    this.preloader.setShowPreloader(false);
                    this.swalFn('', errorMessage, 'warning')
                        .then((r) => {
                            if (r) {
                                this.router.navigate([`/revenue/manage/C/NEW`]);
                                setTimeout(() => {
                                    location.reload();
                                }, 100);
                            }
                        });
                }
            }, () => {
                this.preloader.setShowPreloader(false);
                this.swalFn('', Message.saveFail, 'warning');
            });
    }

    revenueUpdateReverse() {
        this.preloader.setShowPreloader(true);
        let result = [];
        let zip$ = new Observable<any>();
        let request = new Observable<any>();

        request = this.RevenueUpdateReverseModify();

        zip$ = Observable.zip(request)
            .pipe(map(x => { return result = [...result, ...x]; }))

        forkJoin(zip$)
            .subscribe(x => {
                const objRes: any[] = x[0];
                if (objRes.filter(o => o['IsSuccess'] == 'False').length) {
                    this.preloader.setShowPreloader(false);
                    this.swalFn('', Message.saveFail, 'warning')
                    // .then(v => { if (v) this.revenueUpdateReverse() }); // May not leave the loop when response is false
                } else {
                    this.preloader.setShowPreloader(false);
                    this.swalFn('', Message.saveFail, 'warning')
                        .then((r) => { if (r) location.reload() });
                }
            }, () => {
                this.preloader.setShowPreloader(false);
                this.swalFn('', Message.saveFail, 'warning');
            });
    }

    RevenueUpdateReverseModify(): Observable<any> {
        /** check RevenueDetail Reverse from upd response for Reverse */
        let revenueDetailUpdReverse = from(this.revenueDetailUpdResponse)
            .pipe(takeUntil(this.destroy$),
                mergeMap(x => {
                    const objRes: any[] = [x];
                    if (objRes.filter(o => o['IsSuccess'] == 'True').length) {
                        let RevenueDetailinsAll = objRes
                            .filter(item => item.RESPONSE_FROM == "REVENUE_DETAIL_SERVICE")
                            .filter(item => item.REVENUE_DETAIL_EVENT == this.Action.DELETE)
                            .reduce((a, c) => [...a, ...c['REVENUE_DETAIL_FORM_DELETE']], []);

                        let RevenueDetailupdDelete = objRes
                            .filter(item => item.RESPONSE_FROM == "REVENUE_DETAIL_SERVICE")
                            .filter(item => item.REVENUE_DETAIL_EVENT == this.Action.ADD);

                        let RevenueDetailinsAll$ = () => from(RevenueDetailinsAll).pipe(
                            mergeMap(x => this.revService.RevenueDetailinsAll(x))
                        );

                        let RevenueDetailupdDelete$ = () => from(RevenueDetailupdDelete).pipe(
                            mergeMap(x => this.revService.RevenueDetailupdDelete({ REVENUE_DETAIL_ID: x['REVENUE_DETAIL_ID'] }))
                        );

                        return merge(
                            RevenueDetailinsAll.length > 0 ? RevenueDetailinsAll$() : Observable.of(),
                            RevenueDetailupdDelete.length > 0 ? RevenueDetailupdDelete$() : Observable.of(),
                        );

                    } else return merge(Observable.of());
                })
            );

        // /** check Inc Reverse from upd response for Reverse */
        // let IncUpdReverse = from(this.IncUpdResponse)
        //     .pipe(takeUntil(this.destroy$),
        //         mergeMap(x => {
        //             const IncObjRes: any[] = [x]; 
        //             if (IncObjRes.filter(o => o['RESPONSE_FROM'] == "INC_US_SERVICE" && (o['IsSuccess'] == "True")).length) {
        //                 let IncDel = this.IncUpdResponse
        //                     .filter(f => f['INC_XCS_SERVICE_EVENT'] == 'ADD')
        //                     .filter(f => f['RESPONSE_FROM'] == 'INC_XCS_SERVICE')
        //                     .filter(f => f['IsSuccess'] == 'False');

        //                 return merge(
        //                     IncDel.length > 0
        //                         ? this.revService.IncPaymentListUpdDelete(this.REVENUE_ID)
        //                         : Observable.of()
        //                 );
        //             } else return merge(Observable.of());
        //         })
        // );

        /** Compare Reverse */
        let RevenueCompareStatus1: any[] = this.ListRevenueCompare
            .filter(item => item.IsCheck === false && item.ACTION == this.Action.EDIT)
            .reduce((a, c) => { return [...a, ...c.RevenueCompareDetail] }, []);

        let RevenueCompareStatus0: any[] = this.ListRevenueCompare
            .filter(item => item.IsCheck === true && item.ACTION == this.Action.ADD)
            .reduce((a, c) => { return [...a, ...c.RevenueCompareDetail] }, []);

        let RevenueCompareStatus1$ = () => from(RevenueCompareStatus1).pipe(
            mergeMap(x => this.revService.RevenueCompareStatus({ COMPARE_DETAIL_ID: x.COMPARE_DETAIL_ID, IS_REVENUE: 1 }))
        );

        let RevenueCompareStatus0$ = () => from(RevenueCompareStatus0).pipe(
            mergeMap(x => this.revService.RevenueCompareStatus({ COMPARE_DETAIL_ID: x.COMPARE_DETAIL_ID, IS_REVENUE: 0 }))
        );

        /** Payment Reverse */
        let RevenuePaymentupdByCon1: any[] = this.oParam.RevenueDetail
            .filter(item => item.IsCheck === false && item.ACTION == this.Action.EDIT);

        let RevenuePaymentupdByCon0: any[] = this.oParam.RevenueDetail
            .filter(item => item.IsCheck === true && item.ACTION == this.Action.ADD);

        let RevenuePaymentupdByCon1$ = () => from(RevenuePaymentupdByCon1).pipe(
            mergeMap(x => this.revService.RevenuePaymentupdByCon({ PAYMENT_ID: x.PAYMENT_ID, IS_REVENUE: 1 }))
        );

        let RevenuePaymentupdByCon0$ = () => from(RevenuePaymentupdByCon0).pipe(
            mergeMap(x => this.revService.RevenuePaymentupdByCon({ PAYMENT_ID: x.PAYMENT_ID, IS_REVENUE: 0 }))
        );

        return merge(
            revenueDetailUpdReverse,
            // IncUpdReverse,
            RevenueCompareStatus1.length > 0 ? RevenueCompareStatus1$() : Observable.of(),
            RevenueCompareStatus0.length > 0 ? RevenueCompareStatus0$() : Observable.of(),
            RevenuePaymentupdByCon1.length > 0 ? RevenuePaymentupdByCon1$() : Observable.of(),
            RevenuePaymentupdByCon0.length > 0 ? RevenuePaymentupdByCon0$() : Observable.of(),
        )
    }

    RevenueDeleteAllModify(): Observable<any> {
        var paramsgetByCon = {
            REVENUE_ID: this.REVENUE_ID
        }

        return combineLatest(
            this.revService.RevenuegetByCon(paramsgetByCon),
            this.revService.RevenueComparegetByCon(paramsgetByCon),
            this.revService.RevenueCourtgetByCon(paramsgetByCon))
            .pipe(
                takeUntil(this.destroy$),
                mergeMap(o => {

                    let revenue: any[] = o[0];
                    let compare: any[] = o[1];
                    let court: any[] = o[2];

                    /**Revenue */
                    let RevenueDetail = [revenue]
                        .reduce((a, c) => [...a, ...c['RevenueDetail']], []);

                    let RevenueDetail_id = RevenueDetail
                        .reduce((a, c) => [...a, { REVENUE_DETAIL_ID: c['REVENUE_DETAIL_ID'] }], []);

                    let RevenueDetailupdDelete$ = () => from(RevenueDetail_id).pipe(
                        mergeMap(x => this.revService.RevenueDetailupdDelete(x))
                    );

                    /**Compare */
                    let RevenueCompareMapping = compare
                        .reduce((a, c) => { return [...a, ...c['RevenueCompareMapping']] }, []);

                    let RevenueCompareDetail = RevenueCompareMapping
                        .reduce((a, c) => { return [...a, ...c['RevenueCompareDetail']] }, []);

                    let RevenueCompareStatus$ = () => from(RevenueCompareDetail).pipe(
                        mergeMap(x => this.revService.RevenueCompareStatus({ COMPARE_DETAIL_ID: x['COMPARE_DETAIL_ID'], IS_REVENUE: 0 }))
                    );

                    /** Court */
                    let RevenueLawsuitDetail = court
                        .reduce((a, c) => { return [...a, ...c['RevenueLawsuitDetail']] }, []);

                    let Payment = RevenueLawsuitDetail
                        .reduce((a, c) => { return [...a, ...c['Payment']] }, []);

                    let RevenuePaymentupdByCon$ = () => from(Payment).pipe(
                        mergeMap(x => this.revService.RevenuePaymentupdByCon({ PAYMENT_ID: x['PAYMENT_ID'], IS_REVENUE: 0 }))
                    );


                    return merge(
                        RevenueCompareDetail.length > 0 ? RevenueCompareStatus$() : Observable.of(),
                        Payment.length > 0 ? RevenuePaymentupdByCon$() : Observable.of(),
                        RevenueDetail_id.length > 0 ? RevenueDetailupdDelete$() : Observable.of(),
                        this.REVENUE_ID ? this.revService.IncPaymentListUpdDelete(this.REVENUE_ID) : Observable.of(),
                        this.REVENUE_ID ? this.revService.RevenueupdDelete(this.REVENUE_ID) : Observable.of()
                    )
                })
            );
    }

    RevenueCompareModify(): Observable<any> {
        let ins: any[] = this.ListRevenueCompare
            .filter(item => item.IsCheck === true && item.ACTION == this.Action.ADD)
            .reduce((a, c) => { return [...a, ...c.RevenueCompareDetail] }, []);

        let del: any[] = this.ListRevenueCompare
            .filter(item => item.IsCheck === false && item.ACTION == this.Action.EDIT)
            .reduce((a, c) => { return [...a, ...c.RevenueCompareDetail] }, []);

        let ins$ = () => from(ins).pipe(
            mergeMap(x => this.revService.RevenueCompareStatus({ COMPARE_DETAIL_ID: x.COMPARE_DETAIL_ID, IS_REVENUE: 1 }))
        );

        let del$ = () => from(del).pipe(
            mergeMap(x => this.revService.RevenueCompareStatus({ COMPARE_DETAIL_ID: x.COMPARE_DETAIL_ID, IS_REVENUE: 0 }))
        );

        return merge(
            ins.length > 0 ? ins$() : Observable.of(),
            del.length > 0 ? del$() : Observable.of()
        );
    }

    RevenuePaymentModify(): Observable<any> {

        let ins: any[] = this.oParam.RevenueDetail
            .filter(item => item.IsCheck === true && item.ACTION == this.Action.ADD);

        let del: any[] = this.oParam.RevenueDetail
            .filter(item => item.IsCheck === false && item.ACTION == this.Action.EDIT);

        let ins$ = () => from(ins).pipe(
            mergeMap(x => this.revService.RevenuePaymentupdByCon({ PAYMENT_ID: x.PAYMENT_ID, IS_REVENUE: 1 }))
        );

        let del$ = () => from(del).pipe(
            mergeMap(x => this.revService.RevenuePaymentupdByCon({ PAYMENT_ID: x.PAYMENT_ID, IS_REVENUE: 0 }))
        );

        return merge(
            ins.length > 0 ? ins$() : Observable.of(),
            del.length > 0 ? del$() : Observable.of()
        );
    }

    RevenueDetailModify_caseUpdateOnly(): Observable<any> {/** use in case R only */

        let ins = this.oParam.RevenueDetail
            .filter(item => item.IsCheck === true && item.ACTION == this.Action.ADD);

        let formDelete = this.oParam.RevenueDetail
            .filter(item => item.IsCheck === false && item.ACTION == this.Action.EDIT)

        let del = formDelete
            .reduce((a, c) => [...a, { REVENUE_DETAIL_ID: c['REVENUE_DETAIL_ID'] }], []);

        del = this.filterDuplicate(del, 'REVENUE_DETAIL_ID');

        let ins$ = () => from(ins).pipe(
            mergeMap(x => this.revService.RevenueDetailinsAll(x))
        );

        let del$ = () => from(del).pipe(
            mergeMap(x => this.revService.RevenueDetailupdDelete_forReverseCase(x, formDelete))
        );

        return merge(
            ins.length > 0 ? ins$() : Observable.of(),
            del.length > 0 ? del$() : Observable.of()
        );
    }

    IncModify(): Observable<any> {
        switch (this.mode) {
            case this.ModeAction.C:
                /**Inc Compare */
                let RevenueCompareMapping = this.ListRevenueCompare
                    .filter(f => f.IsCheck == true && f.ACTION == this.Action.ADD)
                    .reduce((a, c) => { return [...a, ...c.RevenueCompareMapping] }, []);

                let RevenueCompareDetail = RevenueCompareMapping
                    .reduce((a, c) => { return [...a, ...c.RevenueCompareDetail] }, []);

                let RevenueCompareDetailFine: any[] = RevenueCompareDetail
                    .reduce((a, c) => { return [...a, ...c.RevenueCompareDetailFine] }, []);

                let RevenuePayment: any[] = RevenueCompareDetail
                    .reduce((a, c) => { return [...a, ...c.RevenuePayment] }, []);

                let productGroupBy = [];
                let SEQ_NO: number = 0;
                let IncPayment: any[] = [];
                let $IncPayment: any[] = [];
                let $IncPaymentType: any[] = [];

                // from(RevenueCompareDetailFine).pipe(
                //     groupBy(o => o.PRODUCT_GROUP_ID),
                //     mergeMap(group => group.pipe(toArray()))
                // ).subscribe(groupBy => {
                //     productGroupBy = [...productGroupBy, ...groupBy[0]];
                // });
                productGroupBy = RevenueCompareDetailFine.reduce(function (results, org) {
                    (results[org.PRODUCT_GROUP_ID] = results[org.PRODUCT_GROUP_ID] || []).push(org);
                    return results;
                }, {});

                if (RevenueCompareMapping.length > 0) { /**เช็คว่ามีการ selected ที่จะส่งรายได้ส่วนของ compare */
                    // let IncPayment = productGroupBy.reduce((a, c) => {
                    //     return [...a, {
                    //         BRIBE_AMT: parseFloat(c.BRIBE_MONEY),
                    //         COUNT_NUM: this.getCountNumLengthByProdID(c['PRODUCT_GROUP_ID'], RevenueCompareMapping),
                    //         GROUPID: this.convertProductGroupID(c['PRODUCT_GROUP_ID']),
                    //         INC_PAYMENT_ID: 0,
                    //         IS_ACTIVE: 1,
                    //         REVENUE_ID: this.REVENUE_ID,
                    //         REWARD_AMT: parseFloat(c.REWARD_MONEY),
                    //         SEQ_NO: SEQ_NO += 1,
                    //         TAX_AMT: parseFloat(c.TREASURY_MONEY)
                    //     }]
                    // }, []);
                    for (let key in productGroupBy) {
                        let BRIBE_AMT: number = 0, REWARD_AMT: number = 0, TAX_AMT: number = 0;
                        let comma = (i) => i != 0 ? ',' : '';

                        productGroupBy[key].forEach(f => {
                            BRIBE_AMT += parseFloat(f.BRIBE_MONEY);
                            REWARD_AMT += parseFloat(f.REWARD_MONEY);
                            TAX_AMT += parseFloat(f.TREASURY_MONEY);
                        });

                        const pGroupId = parseInt(key);
                        const compDId: string = productGroupBy[key].reduce((a, c, i) => [...a, `${comma(i)}${c.COMPARE_DETAIL_ID}`], "");

                        const o = {
                            BRIBE_AMT: BRIBE_AMT,
                            COUNT_NUM: this.getCountNumLengthByProdID(pGroupId, RevenueCompareMapping),
                            GROUPID: this.convertProductGroupID(pGroupId),
                            INC_PAYMENT_ID: "",
                            IS_ACTIVE: 1,
                            REVENUE_ID: this.REVENUE_ID,
                            REWARD_AMT: REWARD_AMT,
                            SEQ_NO: SEQ_NO += 1,
                            TAX_AMT: TAX_AMT,
                            COMPARE_DETAIL_ID: compDId
                        }

                        IncPayment.push(o);
                    }
                    console.log('**case C** product :', IncPayment.length + ' ' + 'Payment :' + RevenuePayment.length) /** check */

                    let IncPaymentType: any[] = RevenuePayment.reduce((a, c) => {
                        return [...a, {
                            ADJUST_TYPE: '',
                            BANK_CODE: c.PAYMENT_CHANNEL != this.PaymentMode.Cash ? c.PAYMENT_BANK : '',
                            BRANCH_CODE: '',//req PAYMENT_CHANNEL == 2
                            CHEQUE_DATE: '',//req PAYMENT_CHANNEL == 2
                            CHEQUE_FLAG: '',//req PAYMENT_CHANNEL == 2
                            CHEQUE_TYPE: '',//req PAYMENT_CHANNEL == 2
                            CHWQUE_NO: (c.PAYMENT_CHANNEL == this.PaymentMode.Credit || this.PaymentMode.Debit) ? c.PAYMENT_REF_NO : '',
                            REVENUE_ID: this.REVENUE_ID,
                            INC_PAYMENT_TYPE_ID: '',
                            IS_ACTIVE: 1,
                            PAYMENT_AMT: c.FINE,
                            PAYMENT_ID: c.PAYMENT_ID,
                            PAYMENT_TYPE: c.PAYMENT_CHANNEL
                        }]
                    }, []);

                    let IncPayEqualType1: any[] = [];
                    if (IncPaymentType.filter(f => f.PAYMENT_TYPE == 1).length > 0) {
                        let amtPayType1: number = IncPaymentType.filter(f => f.PAYMENT_TYPE == 1).reduce((a, c) => a += c.PAYMENT_AMT, 0)
                        IncPayEqualType1 = [{
                            ADJUST_TYPE: "",
                            BANK_CODE: "",
                            BRANCH_CODE: "",
                            CHEQUE_DATE: "",
                            CHEQUE_FLAG: "",
                            CHEQUE_TYPE: "",
                            CHWQUE_NO: null,
                            REVENUE_ID: this.REVENUE_ID,
                            INC_PAYMENT_TYPE_ID: "",
                            IS_ACTIVE: 1,
                            PAYMENT_AMT: amtPayType1,
                            PAYMENT_ID: "",
                            PAYMENT_TYPE: 1
                        }];
                    }
                    const IncPayWithOutType1: any[] = IncPaymentType.filter(f => f.PAYMENT_TYPE != 1);
                    const incPayType = [...IncPayWithOutType1, ...IncPayEqualType1];
                    $IncPayment.push(...IncPayment);
                    $IncPaymentType.push(...incPayType);
                }

                /**Inc Court */
                console.log('this.ListRevenueCourt : ', this.ListRevenueCourt)
                let Payment = this.ListRevenueCourt
                    .filter(f => f.IsCheck == true && f.ACTION == this.Action.ADD)
                    .reduce((a, c) => { return [...a, ...c.LawsuiltDetail] }, [])
                    .reduce((a, c) => { return [...a, ...c.Payment] }, []);

                if (Payment.length) {
                    let BRIBE_AMT: number = 0, REWARD_AMT: number = 0;
                    let IncPaymentType = Payment.reduce((a, c) => {

                        BRIBE_AMT += parseFloat(c.BRIBE_MONEY);
                        REWARD_AMT += parseFloat(c.REWARD_MONEY);

                        return [...a, {
                            ADJUST_TYPE: '',
                            BANK_CODE: c.PAYMENT_CHANNEL != this.PaymentMode.Cash ? c.PAYMENT_BANK : '',
                            BRANCH_CODE: '',
                            CHEQUE_DATE: '',
                            CHEQUE_FLAG: '',
                            CHEQUE_TYPE: '',
                            CHWQUE_NO: (c.PAYMENT_CHANNEL == this.PaymentMode.Credit || this.PaymentMode.Debit) ? c.PAYMENT_REF_NO : '',
                            REVENUE_ID: this.REVENUE_ID,
                            INC_PAYMENT_TYPE_ID: '',
                            IS_ACTIVE: 1,
                            PAYMENT_AMT: c.FINE,
                            PAYMENT_ID: c.PAYMENT_ID,
                            PAYMENT_TYPE: c.PAYMENT_CHANNEL
                        }]
                    }, []);

                    let IncPayment = [{
                        BRIBE_AMT: BRIBE_AMT,
                        COUNT_NUM: this.getConutNumLengthByLawsuitID(this.ListRevenueCourt),
                        GROUPID: this.IncCourtGroupId,
                        INC_PAYMENT_ID: "",
                        IS_ACTIVE: 1,
                        REVENUE_ID: this.REVENUE_ID,
                        REWARD_AMT: REWARD_AMT,
                        SEQ_NO: SEQ_NO += 1,
                        TAX_AMT: 0
                    }];
                    $IncPayment.push(...IncPayment);
                    $IncPaymentType.push(...IncPaymentType);
                }
                console.log('$IncPayment : ', $IncPayment);
                console.log('$IncPaymentType : ', $IncPaymentType);

                const $inc_illegalService = {
                    IncPayment: $IncPayment,
                    RevenueIncPaymentType: $IncPaymentType
                }

                /** tranfromToXcsService */
                let $IncPayment_XcsService: any[] = [];
                let $IncPaymentType_XcsService: any[] = [];

                if ($IncPayment.length > 0) {
                    $IncPayment_XcsService = $IncPayment
                        .reduce((a, c) => {
                            return [...a, {
                                seqNo: c['SEQ_NO'],
                                groupId: c['GROUPID'] != this.IncCourtGroupId ? this.convertProductGroupID(c['GROUPID']) : this.IncCourtGroupId,
                                taxAmt: c['TAX_AMT'],
                                bribeAmt: c['BRIBE_AMT'],
                                rewardAmt: c['REWARD_AMT'],
                                countNum: c['COUNT_NUM'],
                            }]
                        }, []);
                }

                if ($IncPaymentType.length > 0) {
                    $IncPaymentType_XcsService = $IncPaymentType
                        .reduce((accuPmt, currPmt) => {
                            return [...accuPmt, {
                                paymentType: currPmt['PAYMENT_TYPE'],
                                bankCode: currPmt['BANK_CODE'] || '',
                                branchCode: currPmt['BRANCH_CODE'],
                                chequeType: currPmt['CHEQUE_TYPE'],
                                chequeFlag: currPmt['CHEQUE_FLAG'],
                                chequeNo: currPmt['CHWQUE_NO'] || '',
                                chequeDate: currPmt['CHEQUE_DATE'],
                                paymentAmt: currPmt['PAYMENT_AMT']
                            }]
                        }, []);
                }
                console.log('$IncPayment_XcsService : ', $IncPayment_XcsService);
                console.log('$IncPaymentType_XcsService : ', $IncPaymentType_XcsService);

                return merge(
                    [...$IncPayment_XcsService, ...$IncPaymentType_XcsService].length > 0
                        ? this.revService.IncFrm8000(
                            this.REVENUE_CODE,
                            this.localOfficeCode,
                            $IncPayment_XcsService,
                            $IncPaymentType_XcsService
                        ).pipe(
                            mergeMap(x => {

                                let IncPaymentListinsAll$ = () =>
                                    this.revService.IncPaymentListinsAll($inc_illegalService);

                                return merge(
                                    Observable.of(x),
                                    x['IsSuccess'] == 'True' ? IncPaymentListinsAll$() : Observable.of()
                                )
                            })
                        ) : Observable.of()
                );
                break;


            case this.ModeAction.R:
                /**Inc Compare */
                let RevenueCompareMapping_R = this.ListRevenueCompare
                    .filter(f => ((f.IsCheck == true && f.ACTION == this.Action.ADD) || (f.IsCheck == true && f.ACTION == this.Action.EDIT)))
                    .reduce((a, c) => { return [...a, ...c.RevenueCompareMapping] }, []);

                let RevenueCompareDetail_R = RevenueCompareMapping_R
                    .reduce((a, c) => { return [...a, ...c.RevenueCompareDetail] }, []);

                let RevenueCompareDetailFine_R: any[] = RevenueCompareDetail_R
                    .reduce((a, c) => { return [...a, ...c.RevenueCompareDetailFine] }, []);

                let RevenuePayment_R: any[] = RevenueCompareDetail_R
                    .reduce((a, c) => { return [...a, ...c.RevenuePayment] }, []);
                console.log('RevenueCompareDetailFine_R : ', RevenueCompareDetailFine_R)

                let productGroupBy_R = [];
                let SEQ_NO_R: number = 0;
                let IncPayment_R: any[] = [];
                let $IncPayment_R: any[] = [];
                let $IncPaymentType_R: any[] = [];
                // from(RevenueCompareDetailFine_R).pipe(
                //     groupBy(o => o.PRODUCT_GROUP_ID),
                //     mergeMap(group => group.pipe(toArray()))
                // ).subscribe(groupBy_R => {
                //     productGroupBy_R = [...productGroupBy_R, ...groupBy_R[0]];
                // });
                // console.log('productGroupBy_R : ', productGroupBy_R)

                productGroupBy_R = RevenueCompareDetailFine_R.reduce(function (results, org) {
                    (results[org.PRODUCT_GROUP_ID] = results[org.PRODUCT_GROUP_ID] || []).push(org);
                    return results;
                }, {});

                if (RevenueCompareMapping_R.length > 0) { /**เช็คว่ามีการ selected ที่จะส่งรายได้ส่วนของ compare */

                    // let IncPayment_R = productGroupBy_R.reduce((a, c) => {
                    //     return [...a, {
                    //         BRIBE_AMT: parseFloat(c.BRIBE_MONEY),
                    //         COUNT_NUM: this.getCountNumLengthByProdID(c['PRODUCT_GROUP_ID'], RevenueCompareMapping_R),
                    //         GROUPID: this.convertProductGroupID(c['PRODUCT_GROUP_ID']),
                    //         INC_PAYMENT_ID: "",
                    //         IS_ACTIVE: 1,
                    //         REVENUE_ID: this.REVENUE_ID,
                    //         REWARD_AMT: parseFloat(c.REWARD_MONEY),
                    //         SEQ_NO: SEQ_NO_R += 1,
                    //         TAX_AMT: parseFloat(c.TREASURY_MONEY)
                    //     }]
                    // }, []);
                    for (let key in productGroupBy_R) {
                        let BRIBE_AMT_R: number = 0, REWARD_AMT_R: number = 0, TAX_AMT_R: number = 0;
                        let comma = (i) => i != 0 ? ',' : '';

                        productGroupBy_R[key].forEach(f => {
                            BRIBE_AMT_R += parseFloat(f.BRIBE_MONEY);
                            REWARD_AMT_R += parseFloat(f.REWARD_MONEY);
                            TAX_AMT_R += parseFloat(f.TREASURY_MONEY);
                        });

                        const pGroupId = parseInt(key);
                        const compDId: string = productGroupBy_R[key].reduce((a, c, i) => [...a, `${comma(i)}${c.COMPARE_DETAIL_ID}`], "");

                        const o = {
                            BRIBE_AMT: BRIBE_AMT_R,
                            COUNT_NUM: this.getCountNumLengthByProdID(pGroupId, RevenueCompareMapping_R),
                            GROUPID: this.convertProductGroupID(pGroupId),
                            INC_PAYMENT_ID: "",
                            IS_ACTIVE: 1,
                            REVENUE_ID: this.REVENUE_ID,
                            REWARD_AMT: REWARD_AMT_R,
                            SEQ_NO: SEQ_NO_R += 1,
                            TAX_AMT: TAX_AMT_R,
                            COMPARE_DETAIL_ID: compDId
                        }

                        IncPayment_R.push(o);
                    }
                    console.log('**case R** product :', IncPayment_R.length + ' ' + 'Payment :' + RevenuePayment_R.length) /** check */

                    let IncPaymentType_R: any[] = RevenuePayment_R.reduce((a, c) => {
                        return [...a, {
                            ADJUST_TYPE: '',
                            BANK_CODE: c.PAYMENT_CHANNEL != this.PaymentMode.Cash ? c.PAYMENT_BANK : '',
                            BRANCH_CODE: '',
                            CHEQUE_DATE: '',
                            CHEQUE_FLAG: '',
                            CHEQUE_TYPE: '',
                            CHWQUE_NO: (c.PAYMENT_CHANNEL == this.PaymentMode.Credit || this.PaymentMode.Debit) ? c.PAYMENT_REF_NO : '',
                            REVENUE_ID: this.REVENUE_ID,
                            INC_PAYMENT_TYPE_ID: '',
                            IS_ACTIVE: 1,
                            PAYMENT_AMT: c.FINE,
                            PAYMENT_ID: c.PAYMENT_ID,
                            PAYMENT_TYPE: c.PAYMENT_CHANNEL
                        }]
                    }, []);

                    let amtPayType1_R: number = IncPaymentType_R.filter(f => f.PAYMENT_TYPE == 1).reduce((a, c) => a += c.PAYMENT_AMT, 0)
                    const IncPayEqualType1_R = [{
                        ADJUST_TYPE: "",
                        BANK_CODE: "",
                        BRANCH_CODE: "",
                        CHEQUE_DATE: "",
                        CHEQUE_FLAG: "",
                        CHEQUE_TYPE: "",
                        CHWQUE_NO: null,
                        REVENUE_ID: this.REVENUE_ID,
                        INC_PAYMENT_TYPE_ID: "",
                        IS_ACTIVE: 1,
                        PAYMENT_AMT: amtPayType1_R,
                        PAYMENT_ID: "",
                        PAYMENT_TYPE: 1
                    }];
                    let IncPayWithOutType1_R = IncPaymentType_R.filter(f => f.PAYMENT_TYPE != 1);
                    const incPayType_R = [...IncPayWithOutType1_R, ...IncPayEqualType1_R];
                    $IncPayment_R.push(...IncPayment_R);
                    $IncPaymentType_R.push(...incPayType_R);
                }

                /**Inc Court */
                let Payment_R = this.ListRevenueCourt
                    .filter(f => ((f.IsCheck == true && f.ACTION == this.Action.ADD) || (f.IsCheck == true && f.ACTION == this.Action.EDIT)))
                    .reduce((a, c) => { return [...a, ...c.LawsuiltDetail] }, [])
                    .reduce((a, c) => { return [...a, ...c.Payment] }, []);

                if (Payment_R.length) {
                    let BRIBE_AMT_R: number = 0, REWARD_AMT_R: number = 0;
                    let IncPaymentType_R = Payment_R.reduce((a, c) => {

                        BRIBE_AMT_R += parseFloat(c.BRIBE_MONEY);
                        REWARD_AMT_R += parseFloat(c.REWARD_MONEY);

                        return [...a, {
                            ADJUST_TYPE: '',
                            BANK_CODE: c.PAYMENT_CHANNEL != this.PaymentMode.Cash ? c.PAYMENT_BANK : '',
                            BRANCH_CODE: '',
                            CHEQUE_DATE: '',
                            CHEQUE_FLAG: '',
                            CHEQUE_TYPE: '',
                            CHWQUE_NO: (c.PAYMENT_CHANNEL == this.PaymentMode.Credit || this.PaymentMode.Debit) ? c.PAYMENT_REF_NO : '',
                            REVENUE_ID: this.REVENUE_ID,
                            INC_PAYMENT_TYPE_ID: '',
                            IS_ACTIVE: 1,
                            PAYMENT_AMT: c.FINE,
                            PAYMENT_ID: c.PAYMENT_ID,
                            PAYMENT_TYPE: c.PAYMENT_CHANNEL
                        }]
                    }, []);

                    let IncPayment_R = [{
                        BRIBE_AMT: BRIBE_AMT_R,
                        COUNT_NUM: this.getConutNumLengthByLawsuitID(this.ListRevenueCourt),
                        GROUPID: this.IncCourtGroupId,
                        INC_PAYMENT_ID: "",
                        IS_ACTIVE: 1,
                        REVENUE_ID: this.REVENUE_ID,
                        REWARD_AMT: REWARD_AMT_R,
                        SEQ_NO: SEQ_NO_R += 1,
                        TAX_AMT: 0
                    }];
                    $IncPayment_R.push(...IncPayment_R);
                    $IncPaymentType_R.push(...IncPaymentType_R);
                }
                console.log('$IncPayment_R : ', $IncPayment_R);
                console.log('$IncPaymentType_R : ', $IncPaymentType_R);

                const $inc_illegalService_R = {
                    IncPayment: $IncPayment_R,
                    RevenueIncPaymentType: $IncPaymentType_R
                }

                /** tranfromToXcsService */
                let $IncPayment_XcsService_R: any[] = [];
                let $IncPaymentType_XcsService_R: any[] = [];

                if ($IncPayment_R.length > 0) {
                    $IncPayment_XcsService_R = $IncPayment_R
                        .reduce((a, c) => {
                            return [...a, {
                                seqNo: c['SEQ_NO'],
                                groupId: c['GROUPID'] != this.IncCourtGroupId ? this.convertProductGroupID(c['GROUPID']) : this.IncCourtGroupId,
                                taxAmt: c['TAX_AMT'],
                                bribeAmt: c['BRIBE_AMT'],
                                rewardAmt: c['REWARD_AMT'],
                                countNum: c['COUNT_NUM'],
                            }]
                        }, []);
                }

                if ($IncPaymentType_R.length > 0) {
                    $IncPaymentType_XcsService_R = $IncPaymentType_R
                        .reduce((accuPmt, currPmt) => {
                            return [...accuPmt, {
                                paymentType: currPmt['PAYMENT_TYPE'],
                                bankCode: currPmt['BANK_CODE'] || '',
                                branchCode: currPmt['BRANCH_CODE'],
                                chequeType: currPmt['CHEQUE_TYPE'],
                                chequeFlag: currPmt['CHEQUE_FLAG'],
                                chequeNo: currPmt['CHWQUE_NO'] || '',
                                chequeDate: currPmt['CHEQUE_DATE'],
                                paymentAmt: currPmt['PAYMENT_AMT']
                            }]
                        }, []);
                }
                console.log('$IncPayment_XcsService_R : ', $IncPayment_XcsService_R);
                console.log('$IncPaymentType_XcsService_R : ', $IncPaymentType_XcsService_R);
                /** end case insert */

                return merge(
                    [...$IncPayment_XcsService_R, ...$IncPaymentType_XcsService_R].length > 0
                        ? this.revService.IncFrm8000(
                            this.REVENUE_CODE,
                            this.localOfficeCode,
                            $IncPayment_XcsService_R,
                            $IncPaymentType_XcsService_R
                        ).pipe(
                            mergeMap(IncFrm8000 => {

                                let IncPaymentListUpdDelete$ = () =>
                                    this.revService.IncPaymentListUpdDelete(this.REVENUE_ID);

                                let IncPaymentListinsAll$ = () =>
                                    this.revService.IncPaymentListinsAll($inc_illegalService_R);

                                return merge(
                                    Observable.of(IncFrm8000),

                                    IncFrm8000['IsSuccess'] == 'True'
                                        ? IncPaymentListUpdDelete$().pipe(
                                            mergeMap(incDel => {
                                                return merge(

                                                    Observable.of(incDel),

                                                    incDel['IsSuccess'] == 'True'
                                                        ? IncPaymentListinsAll$()
                                                        : Observable.of()

                                                )
                                            })
                                        ) : Observable.of()
                                )

                            })

                        ) : Observable.of(),
                );
                break;
            default:
                break;
        }

    }

    getCountNumLengthByProdID(productGroupId: any, revCompMapping: any[]): number {
        const RevenueCompareDetail = revCompMapping
            .reduce((a, c) => [...a, ...c.RevenueCompareDetail
                .reduce((accuCd, currCd) => {
                    return [...accuCd, { ...currCd, COMPARE_ID: c['COMPARE_ID'] }]
                }, [])
            ], []);

        const revCompDetailFine: any[] = RevenueCompareDetail
            .reduce((a, c) => [...a, ...c.RevenueCompareDetailFine
                .reduce((accuCd, currCd) => {
                    return [...accuCd, { ...currCd, COMPARE_ID: c['COMPARE_ID'] }]
                }, [])
            ], []);

        const o = revCompDetailFine.filter(f => f.PRODUCT_GROUP_ID == productGroupId);
        return o ? this.filterDuplicate(o, 'COMPARE_ID').length : 0;
    }

    getConutNumLengthByLawsuitID(ListRevenueCourt): any {
        let LawsuiltDetail: any[] = [];
        switch (this.mode) {
            case this.ModeAction.C:
                LawsuiltDetail = ListRevenueCourt
                    .filter(f => f.IsCheck == true && f.ACTION == this.Action.ADD);
                break;

            case this.ModeAction.R:
                LawsuiltDetail = ListRevenueCourt
                    .filter(f => ((f.IsCheck == true && f.ACTION == this.Action.ADD) || (f.IsCheck == true && f.ACTION == this.Action.EDIT)));
                break;
        }

        LawsuiltDetail = LawsuiltDetail.reduce((a, c) => [...a, ...c.LawsuiltDetail
            .reduce((acculd, currld) => {
                return [...acculd, { ...currld, LAWSUIT_ID: c['LAWSUIT_ID'] }]
            }, [])
        ], []);

        const Payment: any[] = LawsuiltDetail
            .reduce((a, c) => [...a, ...c.Payment
                .reduce((accuPm, currPm) => {
                    return [...accuPm, { ...currPm, LAWSUIT_ID: c['LAWSUIT_ID'] }]
                }, [])
            ], []);

        return Payment ? this.filterDuplicate(Payment, 'LAWSUIT_ID').length : 0;
    }

    autoSetProductgroupcodeCaseNoProve_response() {
        this.ListRevenueCompare.forEach((f, i) => {
            f.RevenueCompareDetail.map(m => {
                if (m['IS_PROVE'] == 0) { //&& m['IS_PROD_LENGTH'] != 1
                    this.setProductgroupcodeCaseNoProve(m['PRODUCT_GROUP_ID_TEMP'], i);
                }
            });
        });
    }

    autoSetProductgroupcodeCaseNoProve_selected(PRODUCT_GROUP_ID_TEMP: any) {
        this.ListRevenueCompare.forEach((f, i) => {
            f.RevenueCompareDetail.map(m => {
                if (m['IS_PROVE'] == 0 && m['IS_PROD_LENGTH'] != 1) {
                    this.setProductgroupcodeCaseNoProve(PRODUCT_GROUP_ID_TEMP, i);
                }
            });
        });
    }

    setProductgroupcodeCaseNoProve(productGroupId: any, index: number) {
        const temp = [this.ListRevenueCompare[index]];

        let __ = temp.reduce((accu, curr) => {
            let rcMapping = [];

            if (curr.RevenueCompareMapping) {
                rcMapping = curr.RevenueCompareMapping
                    .reduce((accuMap, currMap) => {

                        let detail = [];
                        if (currMap.RevenueCompareDetail) {
                            detail = currMap.RevenueCompareDetail
                                .reduce((accuRC, currRC) => {

                                    let detailFine = [];
                                    if (currRC.RevenueCompareDetailFine) {
                                        detailFine = currRC.RevenueCompareDetailFine
                                            .reduce((accuRCDF, currRCDF) => {
                                                return [...accuRCDF, {
                                                    ...currRCDF,
                                                    PRODUCT_GROUP_ID: parseInt(productGroupId)
                                                }]
                                            }, [])
                                    }

                                    return [...accuRC, {
                                        ...currRC,
                                        RevenueCompareDetailFine: detailFine
                                    }]
                                }, []);
                        }

                        return [...accuMap, {
                            ...currMap,
                            RevenueCompareDetail: detail,
                        }]
                    }, []);
            }

            return [...accu, {
                ...curr,
                RevenueCompareMapping: rcMapping,
            }]
        }, []);

        this.ListRevenueCompare.splice(index, 1, ...__);
    }

    RevenueSummary() {
        let PaymentFine: number = 0, BribeMoney: number = 0, RewardMoney: number = 0, TreasuryMoney: number = 0;
        this.ListRevenueCompare.map(m => {
            m.RevenueCompareDetail
                .filter(item => item.IsCheck === true)
                .map(item => {
                    PaymentFine += +item.PAYMENT_FINE.replace(/,/g, "");
                    BribeMoney += +item.BRIBE_MONEY.replace(/,/g, "");
                    RewardMoney += +item.REWARD_MONEY.replace(/,/g, "");
                    TreasuryMoney += +item.TREASURY_MONEY.replace(/,/g, "");
                });
        })

        this.PAYMENT_FINE_TOTAL = PaymentFine;
        this.BRIBE_MONEY_TOTAL = BribeMoney;
        this.REWARD_MONEY_TOTAL = RewardMoney;
        this.TREASURY_MONEY_TOTAL = TreasuryMoney;
    }

    CourtSummary() {
        let CheckMoney: number = 0, BribeMoney: number = 0, RewardMoney: number = 0;

        let lawsuiltDetail = this.ListRevenueCourt
            .filter(item => item.IsCheck === true)
            .reduce((a, c) => { return [...a, ...c.LawsuiltDetail] }, []);

        let Payment = lawsuiltDetail.reduce((a, c) => { return [...a, ...c.Payment] }, []);

        Payment.map(async item => {
            CheckMoney += +(this.MappingNulNumber(item.FINE)).replace(/,/g, "");
            BribeMoney += +(this.MappingNulNumber(item.BRIBE_MONEY)).replace(/,/g, "");
            RewardMoney += +(this.MappingNulNumber(item.REWARD_MONEY)).replace(/,/g, "");
        });

        this.COURT_CHECK_MONEY_TOTAL = CheckMoney;
        this.COURT_BRIBE_MONEY_TOTAL = BribeMoney;
        this.COURT_REWARD_MONEY_TOTAL = RewardMoney;
    }
    //#endregion

    // **********************************
    // -------------- Gourp -------------
    // **********************************
    getDutyGroup() {
        this.revService.MasProductGroupgetByCon()
            .subscribe(res => {
                this.ProductGroup_illg_sys = res
                this.ProductGroup_illg_sys.splice(this.ProductGroup_illg_sys.findIndex(x => x.PRODUCT_GROUP_ID == 88), 1)
            });
    }


    // **********************************
    // -------------- Bank -------------
    // **********************************
    async getBank() {
        await this.revService.InquiryBank().then(bank => {
            if (bank['ResponseMessage'] == "SUCCESS") {
                if (bank['ResponseData'].length) {
                    this.BANK = bank['ResponseData'];
                } else this.BANK = [];
            } else this.BANK = [];
        })
    }


    // **********************************
    // -------------- Staff -------------
    // **********************************
    //#region 
    async getStaff() {
        var paramsOther = {
            TEXT_SEARCH: "",
            STAFF_ID: parseInt(this.localUserAccountID)
        }

        await this.MasService.getAPI1111("MasStaffgetByCon", paramsOther).then(list => {
            if (list.SUCCESS == true) {
                this.STAFF_LIST = list.RESPONSE_DATA;

                this.STAFF_LIST.map(m => {
                    m.NAME = m.TITLE_SHORT_NAME_TH + m.FIRST_NAME + " " + m.LAST_NAME;
                    m.CONTRIBUTOR_ID = "";
                });
            } else {
                this.ShowAlertError("พบปัญหาที่ API MasStaffgetByCon");
                this.preloader.setShowPreloader(false);
            }
        });
    }

    StaffSignselectItem(event) {
        this.STAFF_SIGN_POS_NAME = event.item.OPREATION_POS_NAME;
        this.STAFF_SIGN_OFFICE_NAME = event.item.OPERATION_OFFICE_SHORT_NAME;
        this.STAFF_SIGN_NAME = event.item.TITLE_NAME_TH + event.item.FIRST_NAME + " " + event.item.LAST_NAME;
        // this.STAFF_SIGN_CODE = event.item.STAFF_ID;
    }

    StaffSignClear() {
        if (typeof this.STAFF_SIGN_MODEL == "object") {
            this.STAFF_SIGN_POS_NAME = "";
            this.STAFF_SIGN_OFFICE_NAME = "";
            this.STAFF_SIGN_NAME = "";
            // this.STAFF_SIGN_CODE = "";
        }
    }

    StaffSendselectItem(event) {
        this.STAFF_SEND_POS_NAME = event.item.OPREATION_POS_NAME;
        this.STAFF_SEND_OFFICE_NAME = event.item.OPERATION_OFFICE_SHORT_NAME;
        this.STAFF_SEND_NAME = event.item.TITLE_NAME_TH + event.item.FIRST_NAME + " " + event.item.LAST_NAME;
        // this.STAFF_SEND_CODE = event.item.STAFF_ID;
    }

    StaffSendClear() {
        if (typeof this.STAFF_SEND_MODEL == "object") {
            this.STAFF_SEND_POS_NAME = "";
            this.STAFF_SEND_OFFICE_NAME = "";
            this.STAFF_SEND_NAME = "";
            // this.STAFF_SEND_CODE = "";
        }
    }

    // **********************************
    // ------------ Station ------------
    // **********************************
    //#region 
    async getOffice() {
        await this.MasService.getAPI1111("MasOfficegetByCon", { "TEXT_SEARCH": "" }).then(list => {
            if (list.RESPONSE_DATA)
                this.OFFICE_LIST = list.RESPONSE_DATA;
        }, (err: HttpErrorResponse) => { console.log(err); this.preloader.setShowPreloader(false); });
    }

    StaffStationFromselectItem(event) {
        this.DELIVERY_OFFICE_ID = event.item.OFFICE_ID;
        this.DELIVERY_OFFICE_CODE = event.item.OFFICE_CODE;
        this.DELIVERY_OFFICE_NAME = event.item.OFFICE_SHORT_NAME;
    }

    StationFromClear() {
        if (typeof this.STATION_FROM_MODEL == "object") {
            this.DELIVERY_OFFICE_ID = "";
            this.DELIVERY_OFFICE_CODE = "";
            this.DELIVERY_OFFICE_NAME = "";
        }
    }

    StaffStationToselectItem(event) {
        this.RECEIVE_OFFICE_ID = event.item.OFFICE_ID;
        this.RECEIVE_OFFICE_CODE = event.item.OFFICE_CODE;
        this.RECEIVE_OFFICE_NAME = event.item.OFFICE_SHORT_NAME;
    }

    StationToClear() {
        if (typeof this.STATION_TO_MODEL == "object") {
            this.RECEIVE_OFFICE_ID = "";
            this.RECEIVE_OFFICE_CODE = "";
            this.RECEIVE_OFFICE_NAME = "";
        }
    }
    //#endregion

    public setFormatTime(event: any) {
        setTimeout(() => {
            let str = event.target.value;
            let str_unSub = event.target.value;
            let substr: any[] = []
            let mm: string = '';
            let ss: string = '';

            substr = str.split(':');
            mm = substr[0] == undefined ? '' : substr[0].slice(0, 2);
            ss = substr[1] == undefined ? '' : substr[1].slice(0, 2);

            const K = event.keyCode;

            // if (!/([0-9])$/.test(event.target.value))
            //     this.REVENUE_TIME = str_unSub.slice(0, str_unSub.length - 1);

            switch (true) {
                case (!/([0-9])$/.test(event.target.value)):
                    this.REVENUE_TIME = str_unSub.slice(0, str_unSub.length - 1);
                    break;
                // NumPad 96-105
                case K >= 96 && K <= 105:
                    if (str.length == 2)
                        this.REVENUE_TIME = `${mm}:${ss}`;
                    else if (str.length == 3)
                        this.REVENUE_TIME = `${mm}:${str_unSub.substring(2)}`;
                    break;
                // KeyPad 96-105
                case (K >= 48 && K <= 57):
                    if (str.length == 2)
                        this.REVENUE_TIME = `${mm}:${ss}`;
                    else if (str.length == 3)
                        this.REVENUE_TIME = `${mm}:${str_unSub.substring(2)}`;
                    break;
                // backspace 8
                case K == 8:
                    break;
                //delete 46
                case K == 46:
                    break;
                default:
                    break;
            }
        }, 0);

        //** check format time */
        const patt = /([01]?[0-9]|2[0-3]):[0-5][0-9]/;
        if (!patt.test(this.REVENUE_TIME)) {
            this.isReq_revTime.next(!patt.test(this.REVENUE_TIME));
        }

    }

    getPaymentChannelText(INPUT: number) {
        if (!INPUT) return '';
        const TEMP = this.PAYMENT_CHANNEL.find(f => f.VALUE == INPUT);
        return TEMP ? TEMP.NAME : '';
    }

    getPaymentBankText(INPUT: any) {
        if (!INPUT) return '';
        const TEMP = this.BANK.find(f => f.BANK_CODE == INPUT);
        return TEMP ? TEMP.BANK_NAME : '';
    }

    setReqCaseNoProve(IsCheck: boolean, pGroupTemp: any) {
        if (IsCheck && !parseInt(pGroupTemp)) {
            this.isReq_pGroupId_noProve.next(true);
            return true;
        }
        this.isReq_pGroupId_noProve.next(false);
        return false;
    }

    getProductNameSelecterByID(pGroupId: number) {
        const temp = this.ProductGroup_illg_sys.find(f => f.PRODUCT_GROUP_ID == pGroupId)
        return temp ? temp.PRODUCT_GROUP_NAME : '';
    }

}
