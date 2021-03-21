import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavigationService } from '../../../shared/header-navigation/navigation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatAutocomplete } from '@angular/material';
import { Message } from '../../../config/message';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import { toLocalShort, compareDate, setZeroHours, setZero, setDateMyDatepicker, getDateMyDatepicker, toLocalYear, convertDateForSave2, MyDatePickerOptions } from '../../../config/dateFormat';
import { IMyDateModel, IMyOptions } from 'mydatepicker-th';
import swal from 'sweetalert2'
import { async } from 'q';
import { MastersConfig } from '../../masters/masters.config';
import { ProveService } from '../prove.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { MasterService } from '../../masters/masters.service';
import { IMyDpOptions } from 'mydatepicker';
import { Document, ImageDocument, FileType } from '../proveDocument';
import { pagination } from '../../../config/pagination';
import { saveAs } from 'file-saver';

declare var $: any;

@Component({
    selector: 'app-manage',
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']

})
export class ManageComponent extends MastersConfig {
    private sub: any;
    mode: string;
    modal: any;
    param: any;
    programSpect = 'ILG60-05-02-00';

    PROVE_ID: string;
    SCIENCE_ID: string;
    PROVE_TYPE: string;
    INDICTMENT_ID: string;

    // ข้อมูลการจับกุม
    LAWSUIT_ID: string;
    ARREST_CODE: string;
    ARREST_DATE: string;
    OCCURRENCE_DATE: string;
    ARREST_TIME: string;
    OCCURRENCE_TIME: string;
    ARREST_STAFF_NAME: string;
    ARREST_STAFF_OPREATION_POS_NAME: string;
    ARREST_STAFF_OPERATION_OFFICE_NAME: string;
    OFFICE_NAME: string;
    GROUP_SECTION_SECTION_ID: string;
    PENALTY_SECTION_ID: string;
    GUILTBASE_NAME: string;
    PENALTY_DESC: string;
    LAWSUIT_NO: string;
    LAWSUIT_NO_TEXT: string;
    LAWSUIT_NO_YEAR: any;
    LAWSUIT_DATE: string;
    LAWSUIT_DATE_TIME: string;
    LAWSUIT_STAFF_NAME: string;
    LAWSUIT_STAFF_OPREATION_POS_NAME: string;
    LAWSUIT_STAFF_OPERATION_OFFICE_NAME: string;

    // ตรวจรับของกลาง
    OFFICE_LIST = [];
    STATION_MODEL: any;
    DELIVERY_OFFICE_CODE: string;
    RECEIVE_DOC_DATE: any;
    RECEIVE_DOC_TIME: any;
    PROVE_NO_YEAR: any;
    PROVE_IS_OUTSIDE: boolean;
    PROVE_IS_SCIENCE: boolean;
    PROVE_DATE: any;
    PROVE_TIME: any;
    DELIVERY_DOC_NO_1: string;
    DELIVERY_DOC_DATE: any;
    DELIVERY_DOC_TIME: any;
    PROVE_RESULT: string;
    PROVE_RESULT1: string;
    PROVE_RESULT2: string;
    PROVE_RESULT3: string;
    PROVE_RESULT_ALL: string;
    RECEIVE_OFFICE_CODE: string;

    STAFF_LIST = [];
    PROVE_STAFF_LIST = [];

    TITLE_LIST = [];
    TITLE_MODEL: any;

    LIST_YEAR = [];
    LIST_ARREST_PRODUCT = [];
    PRODUCT_MODEL: any;

    fileList: Document[] = []

    PROVE_NO: string;
    oParamProve: any;
    oParamProveSciecne: any;

    sumVat: any;

    paginage = pagination;

    private today = new Date();
    // public ProveDateOptions = Object.assign({}, MyDatePickerOptions);
    public ProveDateOptions: IMyDpOptions = {
        editableDateField: false,
        dateFormat: 'dd mmm yyyy',
        showClearDateBtn: false,
        height: '30px',
        // disableSince: { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() + 1 },
    };

    //#region 
    isReq_proveNo = new BehaviorSubject<boolean>(false);
    isReq_stationName = new BehaviorSubject<boolean>(false);
    isReq_proveDate = new BehaviorSubject<boolean>(false);
    isReq_proveTime = new BehaviorSubject<boolean>(false);
    isReq_deliveryDocNo = new BehaviorSubject<boolean>(false);
    isReq_deliveryDocDateDate = new BehaviorSubject<boolean>(false);
    isReq_deliveryDocDateTime = new BehaviorSubject<boolean>(false);
    isReq_receiveDate = new BehaviorSubject<boolean>(false);
    isReq_receiveTime = new BehaviorSubject<boolean>(false);
    isReq_proveResult = new BehaviorSubject<boolean>(false);
    isReq_staff1 = new BehaviorSubject<boolean>(false);
    isReq_staff2 = new BehaviorSubject<boolean>(false);
    isReq_staff3 = new BehaviorSubject<boolean>(false);

    cl_1 = new BehaviorSubject<Boolean>(false);
    // cl_2 = new BehaviorSubject<Boolean>(false);
    cl_3 = new BehaviorSubject<Boolean>(false);
    cl_4 = new BehaviorSubject<Boolean>(false);
    cl_5 = new BehaviorSubject<Boolean>(false);
    cl_6 = new BehaviorSubject<Boolean>(false);
    cl_7 = new BehaviorSubject<Boolean>(false);
    cl_8 = new BehaviorSubject<Boolean>(false);
    cl_9 = new BehaviorSubject<Boolean>(false);
    //#endregion

    //Step wizard
    INPUT_WIZARD = new BehaviorSubject<object>(null);

    searchFailed = false;
    searching = false;

    // ----- Model ------ //
    @ViewChild('printDocModal') printDocModel: ElementRef;
    @ViewChild('proveScienceModal') proveScienceModal: ElementRef;
    @ViewChild('searchProductModal') searchProductModal: ElementRef;
    @ViewChild('vatProveModal') vatProveModal: ElementRef;
    @ViewChild('priceRecommendModal') priceRecommendModal: ElementRef;
    @ViewChild('documentModal') documentModal: ElementRef;
    @ViewChild('proveEvidenceJoinModal') poveEvidenceJoinModal: ElementRef;

    constructor(
        private navService: NavigationService,
        private ngbModel: NgbModal,
        private activeRoute: ActivatedRoute,
        private router: Router,
        private preloader: PreloaderService,
        private ProveSV: ProveService,
        private MasService: MasterService
    ) { super(); }

    async ngOnInit() {
        this.PROVE_STAFF_LIST = [
            {
                STAFFNAME: "",
                POSNAME: "",
                DEPTNAME: "",
                ROLE: "ผู้พิสูจน์ของกลาง",
                CONTRIBUTOR_ID: 25
            },
            {
                STAFFNAME: "",
                POSNAME: "",
                DEPTNAME: "",
                ROLE: "ผู้ส่งมอบ",
                CONTRIBUTOR_ID: 26
            },
            {
                STAFFNAME: "",
                POSNAME: "",
                DEPTNAME: "",
                ROLE: "ผู้รับมอบ",
                CONTRIBUTOR_ID: 22
            },
            {
                STAFFNAME: "",
                POSNAME: "",
                DEPTNAME: "",
                ROLE: "พยานคนที่ 1 ในการตรวจรับ",
                CONTRIBUTOR_ID: 23
            },
            {
                STAFFNAME: "",
                POSNAME: "",
                DEPTNAME: "",
                ROLE: "พยานคนที่ 2 ในการตรวจรับ",
                CONTRIBUTOR_ID: 24
            }
        ];

        let date = new Date();

        this.preloader.setShowPreloader(true);
        this.showEditField = true;

        this.intialDate();
        this.active_Route();

        //this.getDDLYear(date);
        this.setYear();

        await this.getOffice();
        await this.getStaff();
        await this.InitialDataByLogin();


        //this.PROVE_NO_YEAR = date.getFullYear() + 543;
        this.LAWSUIT_NO_YEAR = date.getFullYear() + 543;
        //this.SCIENCE_DELIVERY_DOC_NO_2 = date.getFullYear() + 543;

        // --- พิสูจน์ให้หน่วยงานภายใน ---
        if (this.PROVE_TYPE == "0") {
            this.ShowArrestData();
        }

        this.cl_1.next(true);
        // this.cl_2.next(true);
        this.cl_4.next(true);

        if (this.mode == "R") {
            // this.cl_2.next(true);
            this.cl_3.next(true);
            this.cl_4.next(true);
            this.cl_5.next(true);
            this.cl_6.next(true);
            this.cl_7.next(true);
            this.cl_8.next(true);
            this.cl_9.next(true);

            await this.ShowProveData();
        }
        else {
            this.getProveNoRunning();
            this.preloader.setShowPreloader(false);
        }
    }

    private intialDate() {
        let currentdate = new Date();

        this.LAWSUIT_NO_YEAR = setDateMyDatepicker(new Date(this.getCurrentDate()));


        this.PROVE_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));
        this.PROVE_TIME = `${setZero((new Date).getHours())}:${setZero((new Date).getMinutes())}`;
        this.DELIVERY_DOC_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));
        this.DELIVERY_DOC_TIME = `${setZero((new Date).getHours())}:${setZero((new Date).getMinutes())}`;
        this.RECEIVE_DOC_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));
        this.RECEIVE_DOC_TIME = `${setZero((new Date).getHours())}:${setZero((new Date).getMinutes())}`;

        // this.ProveDateOptions.disableSince = { year: currentdate.getFullYear(), month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 };

        this.ProveDateOptions.disableDateRanges = [{
            begin: { year: currentdate.getFullYear(), month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 },
            end: { year: currentdate.getFullYear() + 100, month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 }
        }];
    }

    InitialDataByLogin() {
        if (this.mode == 'C') {
            let temp = this.STAFF_LIST.find(f => f.STAFF_ID == localStorage.getItem('UserAccountID'));

            if (temp != undefined) {
                this.PROVE_STAFF_LIST.filter(f => f.CONTRIBUTOR_ID == 25).map(m => {
                    m.STAFF = temp;

                    m.POSNAME = temp.OPREATION_POS_NAME;
                    m.DEPTNAME = temp.OPERATION_OFFICE_SHORT_NAME;
                    m.STAFFNAME = `${temp.TITLE_SHORT_NAME_TH == 'null' ? "" : " " + temp.TITLE_SHORT_NAME_TH}`
                        + `${temp.FIRST_NAME == 'null' ? "" : " " + temp.FIRST_NAME}`
                        + `${temp.LAST_NAME == 'null' ? "" : " " + temp.LAST_NAME}`;
                });
            }
        }

        this.OFFICE_LIST.filter(f => f.OFFICE_CODE == localStorage.getItem('officeCode')).map(m => {
            this.STATION_MODEL = m;
            this.RECEIVE_OFFICE_CODE = m.OFFICE_CODE;
        });
    }

    private getProveNoRunning() {
        const IS_OUTSIDE = `${this.PROVE_IS_OUTSIDE ? "1" : "0"}`;

        let param = {
            "OFFICE_CODE": localStorage.getItem('officeCode'),
            "YEAR": +this.PROVE_NO_YEAR.substring(0, 4) + 543,
            "IS_OUTSIDE": IS_OUTSIDE
        }
        this.ProveSV.getProveAPI("ProveRunningProveNo", param).then(m => {
            this.PROVE_NO = m.RUNNING_NO;
        }, (err: HttpErrorResponse) => {
            this.ShowAlertError("API ProveRunningProveNo :: " + err.message);
        });
    }

    private active_Route() {
        this.sub = this.activeRoute.params.subscribe(p => {
            this.mode = p['mode'];

            if (p['mode'] === 'C') {
                // set false
                this.PrintButton.next(false);
                this.EditButton.next(false);
                this.DeleteButton.next(false);
                this.showEditField = false;
                // set true
                this.SaveButton.next(true);
                this.CancelButton.next(true);
            } else if (p['mode'] === 'R') {
                // set false
                this.SaveButton.next(false);
                this.CancelButton.next(false);
                // set true
                this.PrintButton.next(true);
                this.showEditField = true;
            }

            if (p['code1']) {
                this.PROVE_TYPE = p['code1'];
            }

            if (p['code2']) {
                this.PROVE_ID = p['code2'];
            }

            if (p['code3']) {
                this.LAWSUIT_ID = p['code3'];
            }

            if (p['code4']) {
                this.INDICTMENT_ID = p['code4'];
            }

            this.checkRevenue();
        });
    }

    private checkRevenue() {
        this.ProveSV.getProveAPI("ProveComparegetByProveID", { "PROVE_ID": this.PROVE_ID }).then(list => {
            if (this.mode == 'R') {
                if (list && list.COMPARE_ID == 0) {
                    this.EditButton.next(true);
                    this.DeleteButton.next(true);
                }
                else {
                    this.EditButton.next(false);
                    this.DeleteButton.next(false);
                }
            }
        }, (err: HttpErrorResponse) => {
            this.ShowAlertError("API ProveComparegetByProveID :: " + err.message);
            this.router.navigate(['/prove/list']);
        });
    }

    private ShowArrestData() {
        this.ProveSV.getProveAPI("ProveArrestgetByCon", { "LAWSUIT_ID": this.LAWSUIT_ID }).then(m => {
            this.ARREST_CODE = m.ARREST_CODE;

            this.INPUT_WIZARD.next({ 'VALUE': this.PROVE_ID, 'RESERVE_VALUE': this.ARREST_CODE });

            var aDate = m.ARREST_DATE.toString().split(" ");
            var oDate = m.OCCURRENCE_DATE.toString().split(" ");

            this.ARREST_DATE = toLocalShort(aDate[0]);
            this.ARREST_TIME = aDate[1].substring(0, 5);
            this.OCCURRENCE_DATE = toLocalShort(oDate[0]);
            this.OCCURRENCE_TIME = oDate[1].substring(0, 5);

            //this.ARREST_DATE = setDateMyDatepicker(new Date(tempDate[0]));
            this.ARREST_STAFF_NAME = this.MappingNullData(m.ARREST_STAFF_NAME);
            this.ARREST_STAFF_OPREATION_POS_NAME = this.MappingNullData(m.ARREST_MANAGEMENT_POS_NAME);
            this.ARREST_STAFF_OPERATION_OFFICE_NAME = this.MappingNullData(m.ARREST_OPERATION_OFFICE_SHORT_NAME);

            this.OFFICE_NAME = this.MappingNullData(m.SUB_DISTRICT_NAME_TH)
                + " " + this.MappingNullData(m.DISTRICT_NAME_TH)
                + " " + this.MappingNullData(m.PROVINCE_NAME_TH);

            this.GROUP_SECTION_SECTION_ID = this.MappingNullData(m.SUBSECTION_NAME);
            this.PENALTY_SECTION_ID = m.SECTION_NAME.replace("มาตรา ", "");
            this.GUILTBASE_NAME = this.MappingNullData(m.GUILTBASE_NAME);
            this.PENALTY_DESC = this.MappingNullData(m.PENALTY_DESC);
            this.LAWSUIT_NO = this.MappingNullData(m.LAWSUIT_NO);
            this.LAWSUIT_NO_TEXT = `${m.IS_OUTSIDE == 1 ? 'น.' : ''}` + this.MappingNullData(m.LAWSUIT_NO);
            this.LAWSUIT_NO_YEAR = toLocalYear(m.LAWSUIT_NO_YEAR);
            //this.LAWSUIT_DATE = setDateMyDatepicker(new Date(m.LAWSUIT_DATE));
            this.LAWSUIT_DATE = toLocalShort(m.LAWSUIT_DATE);

            let lawsult_datetime = m.LAWSUIT_DATE.split(" ");
            this.LAWSUIT_DATE_TIME = lawsult_datetime[1].substring(0, 5);

            // this.LAWSUIT_DATE_TIME = m.LAWSUIT_DATE != undefined ? m.LAWSUIT_DATE.substring(0, 5) : "";

            // --- ผู้รับคดี ---
            this.LAWSUIT_STAFF_NAME = this.MappingNullData(m.LAWSUIT_STAFF_NAME);
            this.LAWSUIT_STAFF_OPREATION_POS_NAME = this.MappingNullData(m.LAWSUIT_MANAGEMENT_POS_NAME);
            this.LAWSUIT_STAFF_OPERATION_OFFICE_NAME = this.MappingNullData(m.LAWSUIT_OPERATION_OFFICE_SHORT_NAME);

            // --- set default prove is out side ---
            this.PROVE_IS_OUTSIDE = m.IS_OUTSIDE;
            this.getProveNoRunning();
            if (this.mode == "C")
                this.ShowArrestProduct();
        }, (err: HttpErrorResponse) => {
            this.ShowAlertError("API ProveArrestgetByCon :: " + err.message);
        });
    }

    private ShowArrestProduct() {
        this.ProveSV.getProveAPI("ProveArrestIndictmentProductgetByCon", { "INDICTMENT_ID": this.INDICTMENT_ID }).then(list => {
            if (list && list.ProveArrestProduct.length > 0) {
                this.LIST_ARREST_PRODUCT = [];

                let i = 0;
                list.ProveArrestProduct.map(m => {
                    let ArrestProduct = m;

                    ArrestProduct.SEQ = i;
                    ArrestProduct.INDICTMENT_ID = this.INDICTMENT_ID;
                    ArrestProduct.PRODUCT_INDICTMENT_ID = this.INDICTMENT_ID;

                    if (m.QUANTITY == "null" || m.QUANTITY == 0)
                        ArrestProduct.QUANTITY = "";
                    else
                        ArrestProduct.QUANTITY = m.QUANTITY.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 5 });

                    ArrestProduct.QUANTITY_UNIT = m.QUANTITY_UNIT;
                    ArrestProduct.SIZES = m.SIZES;
                    ArrestProduct.SIZES_UNIT = m.SIZES_UNIT;
                    ArrestProduct.SUGAR = m.SUGAR;

                    if (m.VOLUMN == "null" || m.VOLUMN == 0)
                        ArrestProduct.VOLUMN = "";
                    else {
                        ArrestProduct.VOLUMN = `${m.PRODUCT_GROUP_ID != '1'
                            && m.PRODUCT_GROUP_ID != '2'
                            && m.PRODUCT_GROUP_ID != '13'
                            ? m.VOLUMN.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
                            : m.VOLUMN.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`;
                    }

                    ArrestProduct.VOLUMN_UNIT = m.VOLUMN_UNIT;
                    ArrestProduct.SCIENCE_RESULT_DESC = "";
                    ArrestProduct.ISPROVE = false;
                    ArrestProduct.ISPROVESCIENCE = true;

                    if (m.REMAIN_QUANTITY == "null" || m.REMAIN_QUANTITY == 0)
                        ArrestProduct.REMAIN_QUANTITY = "";
                    else
                        ArrestProduct.REMAIN_QUANTITY = m.REMAIN_QUANTITY.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 5 });


                    if (m.REMAIN_VOLUMN == "null" || m.REMAIN_QUANTITY == 0)
                        ArrestProduct.REMAIN_VOLUMN = "";
                    else
                        ArrestProduct.REMAIN_VOLUMN = `${m.PRODUCT_GROUP_ID != '1'
                            && m.PRODUCT_GROUP_ID != '2'
                            && m.PRODUCT_GROUP_ID != '13'
                            ? m.REMAIN_VOLUMN.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
                            : m.REMAIN_VOLUMN.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`;

                    /** set default */
                    ArrestProduct.REMAIN_QUANTITY = m.QUANTITY;
                    ArrestProduct.REMAIN_VOLUMN = m.VOLUMN;

                    ArrestProduct.REMAIN_QUANTITY_UNIT = m.QUANTITY_UNIT;
                    ArrestProduct.REMAIN_VOLUMN_UNIT = m.VOLUMN_UNIT;
                    ArrestProduct.PRICE = m.PRICE;

                    // ArrestProduct.PRICE = m.PRICE.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    // ArrestProduct.REMAIN_VOLUMN = m.REMAIN_VOLUMN;
                    // ArrestProduct.PRODUCT_FULLNAME = `${m.PRODUCT_CATEGORY_NAME == null ? "" : m.PRODUCT_CATEGORY_NAME}`
                    //     + `${m.PRODUCT_TYPE_NAME == 'null' ? "" : " " + m.PRODUCT_TYPE_NAME}`
                    //     + `${m.PRODUCT_DESC == 'null' ? "" : " " + m.PRODUCT_DESC}`
                    //     + `${m.SIZES == 'null' ? "" : " ขนาด " + m.SIZES}`
                    //     + `${m.SIZES_UNIT == 'null' ? "" : " " + m.SIZES_UNIT}`
                    //     + `${m.QUANTITY == 'null' ? "" : " จำนวน " + m.QUANTITY}`
                    //     + `${m.QUANTITY_UNIT == 'null' ? "" : " " + m.QUANTITY_UNIT}`
                    //     + `${m.VOLUMN == 'null' ? "" : " รวมปริมาณสุทธิ " + m.VOLUMN}`
                    //     + `${m.VOLUMN_UNIT == 'null' ? "" : " " + m.VOLUMN_UNIT}`;

                    ArrestProduct.PRODUCT_FULLNAME = `${m.PRODUCT_DESC == 'null' ? "" : " " + m.PRODUCT_DESC}`;

                    if (m.PRODUCT_GROUP_ID != '2'
                        && m.PRODUCT_GROUP_ID != '6'
                        && m.PRODUCT_GROUP_ID != '13'
                        && m.PRODUCT_GROUP_ID != '7'
                        && m.PRODUCT_GROUP_ID != '8')
                        ArrestProduct.DEGREE = "";
                    else {
                        if (m.PRODUCT_GROUP_ID == "2")
                            ArrestProduct.DEGREE = `${m.SUGAR == 'null' || m.SUGAR == "" || m.SUGAR == "0" ? "" : m.SUGAR.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
                        else if (m.PRODUCT_GROUP_ID == "6" || m.PRODUCT_GROUP_ID == "7" || m.PRODUCT_GROUP_ID == "8")
                            ArrestProduct.DEGREE = `${m.CO2 == 'null' || m.CO2 == "" || m.CO2 == "0" ? "" : m.CO2.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
                        else
                            ArrestProduct.DEGREE = `${m.DEGREE == 'null' || m.DEGREE == "" || m.DEGREE == "0" ? "" : m.DEGREE.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
                    }

                    ArrestProduct.ENGINE_NO = this.MappingNullData(ArrestProduct.ENGINE_NO);
                    ArrestProduct.CHASSIS_NO = this.MappingNullData(ArrestProduct.CHASSIS_NO);
                    ArrestProduct.LICENSE_PLATE = this.MappingNullData(ArrestProduct.LICENSE_PLATE);
                    ArrestProduct.REMARK = `${m.REMARK == null || m.REMARK == 'null' ? "" : "" + m.REMARK}`;
                    ArrestProduct.PRODUCT_MAPPING_ID = ArrestProduct.PRODUCT_ID;

                    ArrestProduct.IsNewItem = true;
                    ArrestProduct.IsDelItem = false;
                    i += 1;

                    this.LIST_ARREST_PRODUCT.push(ArrestProduct);
                });

                // console.log(this.LIST_ARREST_PRODUCT);

                this.CalVatWithMulti();

                this.preloader.setShowPreloader(false);
            } else {
                this.ShowAlertWarning("ไม่พบข้อมูลของกลาง");
                this.preloader.setShowPreloader(false);
                //this.router.navigate(['/prove/list']);
            }
        }, (err: HttpErrorResponse) => {
            this.ShowAlertError("API ProveArrestIndictmentProductgetByCon :: " + err.message);
            this.router.navigate(['/prove/list']);
        });
    }

    private ShowProveData() {
        this.ProveSV.getProveAPI("ProvegetByCon", { "PROVE_ID": this.PROVE_ID }).then(async item => {
            if (item) {
                this.PROVE_NO = item.PROVE_NO;
                this.PROVE_NO_YEAR = item.PROVE_NO_YEAR;

                this.LIST_YEAR.map(m => {
                    m.selected = m.value == this.PROVE_NO_YEAR ? true : false;
                })

                if (item.PROVE_DATE) {
                    var proveDate = item.PROVE_DATE.toString().split(" ");
                    this.PROVE_DATE = setDateMyDatepicker(new Date(proveDate[0]));
                    this.PROVE_TIME = proveDate[1].substring(0, 5);
                }

                if (item.DELIVERY_DOC_DATE) {
                    var deliveryDate = item.DELIVERY_DOC_DATE.toString().split(" ");
                    this.DELIVERY_DOC_DATE = setDateMyDatepicker(new Date(deliveryDate[0]));
                    this.DELIVERY_DOC_TIME = deliveryDate[1].substring(0, 5);
                }

                if (item.RECEIVE_DOC_DATE) {
                    var receiveDate = item.RECEIVE_DOC_DATE.toString().split(" ");
                    this.RECEIVE_DOC_DATE = setDateMyDatepicker(new Date(receiveDate[0]));
                    this.RECEIVE_DOC_TIME = receiveDate[1].substring(0, 5);
                }

                this.DELIVERY_DOC_NO_1 = item.DELIVERY_DOC_NO_1;
                this.PROVE_RESULT_ALL = `${item.PROVE_RESULT || ''}${item.PROVE_RESULT1 || ''}${item.PROVE_RESULT2 || ''}${item.PROVE_RESULT3 || ''}`,

                    this.PROVE_IS_OUTSIDE = item.IS_OUTSIDE == "1" ? true : false;
                this.OFFICE_LIST.filter(f => f.OFFICE_CODE == item.RECEIVE_OFFICE_CODE).map(m => {
                    this.STATION_MODEL = m;
                });

                await this.MasService.GetDocumentByCon(5, this.PROVE_ID).subscribe(async res => {
                    this.fileList = [];
                    let temp: any;
                    temp = res;
                    let i = 1;
                    temp.map(m => {
                        if (m.IS_ACTIVE === "1") {
                            let f = m;
                            let idx = f.FILE_PATH.lastIndexOf('.');
                            let FILE_TYPE = (idx < 1) ? "" : f.FILE_PATH.substr(idx + 1);
                            switch (FILE_TYPE) {
                                case FileType.xlsx:
                                case FileType.xls:
                                    m.IMAGE_SHOW = ImageDocument.xlsx;
                                    break;

                                case FileType.doc:
                                case FileType.docx:
                                    m.IMAGE_SHOW = ImageDocument.docx;
                                    break;

                                case FileType.pdf:
                                    m.IMAGE_SHOW = ImageDocument.pdf;
                                    break;
                                case FileType.jpg:
                                case FileType.jpeg:
                                case FileType.png:
                                case FileType.gif:
                                    m.IMAGE_SHOW = this.MasService.getImage(f.DOCUMENT_ID);
                                    break;
                                default:
                                    m.IMAGE_SHOW = ImageDocument.docx;
                                    break;
                            }

                            m.DOC_SEQ = i;
                            m.IsNewItem = false;
                            m.IsDelItem = false;

                            i += 1;

                            this.fileList.push(m);
                        }
                    })
                })

                await this.ShowProveProduct();
                await this.ShowProveStaff();
            } else {
                this.ShowAlertWarning("ไม่พบข้อมูลการพิสูจน์ของกลาง");
                this.preloader.setShowPreloader(false);
                this.router.navigate(['/prove/list']);
            }
            this.INPUT_WIZARD.next({ 'VALUE': this.PROVE_ID, 'RESERVE_VALUE': this.ARREST_CODE });
        }, (err: HttpErrorResponse) => {
            this.ShowAlertError("API ProveArrestgetByCon :: " + err.message);
        });

        this.proveVerifyCourtJudgment();
    }

    private proveVerifyCourtJudgment(): void {
        this.ProveSV.ProveVerifyCourtJudgment({ "PROVE_ID": this.PROVE_ID }).subscribe(async item => {
            const o: number = item.reduce((a, c) => a + c.FINE, 0);
            if (o > 0) {
                this.EditButton.next(false);
                this.DeleteButton.next(false);
            }
        }, (err: HttpErrorResponse) => {
            this.ShowAlertError("API proveVerifyCourtJudgment :: " + err.message);
        });
    }

    private ShowProveProduct() {
        this.ProveSV.getProveAPI("ProveProductgetByProveId", { "PROVE_ID": this.PROVE_ID }).then(list => {
            if (list.length > 0) {
                this.LIST_ARREST_PRODUCT = [];

                let i = 0;
                list.map(m => {

                    /** clear string null */
                    for (let key in m) {
                        if (m[key] === 'null') {
                            m[key] = '';
                        }
                    }

                    let Product = m;

                    Product.SEQ = i;
                    Product.ISPROVE = m.IS_PROVE == 1 ? true : false;
                    Product.ISPROVESCIENCE = m.IS_SCIENCE == 1 ? true : false;

                    if (m.QUANTITY == 'null' || m.QUANTITY == 0)
                        Product.QUANTITY = "";
                    else
                        Product.QUANTITY = m.QUANTITY.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 5 });
                    Product.QUANTITY_UNIT = this.MappingNullData(m.QUANTITY_UNIT);
                    Product.VOLUMN_UNIT = this.MappingNullData(m.VOLUMN_UNIT);

                    if (m.REMAIN_QUANTITY == 'null' || m.REMAIN_QUANTITY == 0)
                        Product.REMAIN_QUANTITY = "";
                    else
                        Product.REMAIN_QUANTITY = m.REMAIN_QUANTITY.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 5 });

                    Product.REMAIN_QUANTITY_UNIT = this.MappingNullData(m.QUANTITY_UNIT);
                    Product.REMAIN_VOLUMN_UNIT = this.MappingNullData(m.VOLUMN_UNIT);
                    Product.PRICE = m.PRICE;
                    // Product.PRODUCT_FULLNAME = `${m.PRODUCT_CATEGORY_NAME == null ? "" : m.PRODUCT_CATEGORY_NAME}`
                    //     + `${m.PRODUCT_DESC == null ? "" : " " + m.PRODUCT_DESC}`
                    //     + `${m.PRODUCT_TYPE_NAME == null ? "" : " " + m.PRODUCT_TYPE_NAME}`
                    //     + `${m.SIZES == null ? "" : " ขนาด " + m.SIZES}`
                    //     + `${m.SIZES_UNIT == null ? "" : " " + m.SIZES_UNIT}`
                    //     + `${m.QUANTITY == null ? "" : " จำนวน " + m.QUANTITY}`
                    //     + `${m.QUANTITY_UNIT == null ? "" : " " + m.QUANTITY_UNIT}`
                    //     + `${m.VOLUMN == null ? "" : " รวมปริมาณสุทธิ " + m.VOLUMN}`
                    //     + `${m.VOLUMN_UNIT == null ? "" : " " + m.VOLUMN_UNIT}`;

                    Product.PRODUCT_FULLNAME = `${m.PRODUCT_DESC == null ? "" : " " + m.PRODUCT_DESC}`;

                    if (m.VOLUMN == 'null' || m.VOLUMN == 0)
                        Product.VOLUMN = "";
                    else
                        Product.VOLUMN = `${m.PRODUCT_GROUP_ID != '1'
                            && m.PRODUCT_GROUP_ID != '2'
                            && m.PRODUCT_GROUP_ID != '13'
                            ? m.VOLUMN.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
                            : m.VOLUMN.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`;

                    if (m.REMAIN_VOLUMN == 'null' || m.REMAIN_VOLUMN == 0)
                        Product.REMAIN_VOLUMN = "";
                    else
                        Product.REMAIN_VOLUMN = `${m.PRODUCT_GROUP_ID != '1'
                            && m.PRODUCT_GROUP_ID != '2'
                            && m.PRODUCT_GROUP_ID != '13'
                            ? m.REMAIN_VOLUMN.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
                            : m.REMAIN_VOLUMN.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`;

                    // if (m.DEGREE == 'null' || m.DEGREE == 0)
                    //     Product.DEGREE = "";
                    // else
                    //     Product.DEGREE = `${m.PRODUCT_GROUP_ID != '2'
                    //         && m.PRODUCT_GROUP_ID != '6'
                    //         && m.PRODUCT_GROUP_ID != '13'
                    //         && m.PRODUCT_GROUP_ID != '7'
                    //         && m.PRODUCT_GROUP_ID != '8' ? "" : m.DEGREE.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

                    if (m.PRODUCT_GROUP_ID != '2'
                        && m.PRODUCT_GROUP_ID != '6'
                        && m.PRODUCT_GROUP_ID != '13'
                        && m.PRODUCT_GROUP_ID != '7'
                        && m.PRODUCT_GROUP_ID != '8')
                        Product.DEGREE = "";
                    else {
                        if (m.PRODUCT_GROUP_ID == "2")
                            Product.DEGREE = `${m.SUGAR == 'null' || m.SUGAR == "" || m.SUGAR == "0" ? "" : m.SUGAR.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
                        else if (m.PRODUCT_GROUP_ID == "6" || m.PRODUCT_GROUP_ID == "7" || m.PRODUCT_GROUP_ID == "8")
                            Product.DEGREE = `${m.CO2 == 'null' || m.CO2 == "" || m.CO2 == "0" ? "" : m.CO2.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
                        else
                            Product.DEGREE = `${m.DEGREE == 'null' || m.DEGREE == "" || m.DEGREE == "0" ? "" : m.DEGREE.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
                    }

                    Product.REMARK = `${m.REMARK == null || m.REMARK == 'null' ? "" : "" + Product.REMARK}`;
                    Product.ENGINE_NO = this.MappingNullData(Product.ENGINE_NO);
                    Product.CHASSIS_NO = this.MappingNullData(Product.CHASSIS_NO);
                    Product.LICENSE_PLATE = this.MappingNullData(Product.LICENSE_PLATE);
                    Product.SCIENCE_RESULT_DESC = this.MappingNullData(Product.SCIENCE_RESULT_DESC);

                    Product.IsNewItem = false;
                    Product.IsDelItem = false;
                    i += 1;

                    this.LIST_ARREST_PRODUCT.push(Product);
                });

                this.CalVatWithMulti();
            }
            else {
                this.ShowAlertWarning("ไม่พบข้อมูลของกลาง");
            }
        }, (err: HttpErrorResponse) => {
            this.ShowAlertError("API ProveProductgetByProveId :: " + err.message);
        });
    }

    private ShowProveStaff() {
        this.ProveSV.getProveAPI("ProveStaffgetByCon", { "PROVE_ID": this.PROVE_ID }).then(item => {
            if (item) {
                this.PROVE_STAFF_LIST.map(m => {

                    let temp = item.find(f => f.CONTRIBUTOR_ID == m.CONTRIBUTOR_ID);

                    if (temp != undefined) {
                        m.STAFF = temp;
                        m.STAFF_ID = temp.STAFF_ID;
                        m.STAFF.NAME = this.MappingNullData(temp.TITLE_NAME_TH) + this.MappingNullData(temp.FIRST_NAME) + " " + this.MappingNullData(temp.LAST_NAME);
                        m.STAFFNAME = this.MappingNullData(temp.TITLE_NAME_TH) + this.MappingNullData(temp.FIRST_NAME) + " " + this.MappingNullData(temp.LAST_NAME);
                        m.POSNAME = this.MappingNullData(temp.OPREATION_POS_NAME);
                        m.DEPTNAME = this.MappingNullData(temp.OPERATION_OFFICE_SHORT_NAME);
                        m.IsNewItem = false;
                        m.IsDelItem = false;
                    }
                    else {
                        m.IsNewItem = true;
                        m.IsDelItem = false;
                    }
                });

                this.preloader.setShowPreloader(false);
            }
        }, (err: HttpErrorResponse) => {
            this.ShowAlertError("API ProveStaffgetByCon :: " + err.message);
        });
    }


    // **********************************
    // -------------- Action -----------
    // **********************************
    //#region
    async CheckProveNo() {
        let IS_OUTSIDE = `${this.PROVE_IS_OUTSIDE ? "1" : "0"}`;

        let param = {
            "IS_OUTSIDE": IS_OUTSIDE,
            "PROVE_NO": this.PROVE_NO,
            "PROVE_NO_YEAR": this.PROVE_NO_YEAR.substring(0, 4),
            "PROVE_TYPE": this.PROVE_TYPE,
            "RECEIVE_OFFICE_CODE": localStorage.getItem('officeCode')
        }

        await this.ProveSV.getProveAPI("ProveVerifyProveNo", param).then(list => {
            if (list.IsSuccess != "false") {
                if (list.length == 0)
                    this.OnInsProve();
                else
                    this.ShowAlertWarning('ทะเบียนตรวจพิสูจน์ซ้ำ กรุณาระบุใหม่');
            }
            else
                this.ShowAlertError("API ProveVerifyProveNo :: " + list.Msg);
        }, (err: HttpErrorResponse) => {
            this.ShowAlertError("API ProveVerifyProveNo :: " + err.message);
        });
    }

    async OnSave() {
        if (this.PROVE_NO == null || this.PROVE_NO == undefined || this.PROVE_NO == "") {
            this.isReq_proveNo.next(true);
            this.ShowAlertWarning('กรุณาระบุข้อมูล "ทะเบียนตรวจพิสูจน์"');
            this.cl_4.next(true);

            return false;
        }

        if (this.RECEIVE_OFFICE_CODE == null || this.RECEIVE_OFFICE_CODE == undefined || this.RECEIVE_OFFICE_CODE == "") {
            this.isReq_stationName.next(true);
            this.ShowAlertWarning('กรุณาระบุข้อมูล "เขียนที่"');
            this.cl_4.next(true);

            return false;
        }

        if (this.PROVE_DATE == null || this.PROVE_DATE == undefined || this.PROVE_DATE == "") {
            this.isReq_proveDate.next(true);
            this.ShowAlertWarning('กรุณาระบุข้อมูล "วันที่พิสูจน์"');
            this.cl_4.next(true);

            return false;
        }

        if (this.PROVE_TIME == null || this.PROVE_TIME == undefined || this.PROVE_TIME == "") {
            this.isReq_proveTime.next(true);
            this.ShowAlertWarning('กรุณาระบุข้อมูล "เวลาที่พิสูจน์"');
            this.cl_4.next(true);

            return false;
        }

        if (this.DELIVERY_DOC_NO_1 == null || this.DELIVERY_DOC_NO_1 == undefined || this.DELIVERY_DOC_NO_1 == "") {
            this.isReq_deliveryDocNo.next(true);
            this.ShowAlertWarning('กรุณาระบุข้อมูล "เลขที่หนังสือนำส่งพิสูจน์"');
            this.cl_4.next(true);

            return false;
        }

        if (this.DELIVERY_DOC_DATE == null || this.DELIVERY_DOC_DATE == undefined || this.DELIVERY_DOC_DATE == "") {
            this.isReq_deliveryDocDateDate.next(true);
            this.ShowAlertWarning('กรุณาระบุข้อมูล "วันที่นำส่ง"');
            this.cl_4.next(true);

            return false;
        }

        if (this.DELIVERY_DOC_TIME == null || this.DELIVERY_DOC_TIME == undefined || this.DELIVERY_DOC_TIME == "") {
            this.isReq_deliveryDocDateTime.next(true);
            this.ShowAlertWarning('กรุณาระบุข้อมูล "เวลาที่นำส่งพิสูจน์"');
            this.cl_4.next(true);

            return false;
        }

        if (this.RECEIVE_DOC_DATE == null || this.RECEIVE_DOC_DATE == undefined || this.RECEIVE_DOC_DATE == "") {
            this.isReq_receiveDate.next(true);
            this.ShowAlertWarning('กรุณาระบุข้อมูล "วันที่ตรวจรับ"');
            this.cl_4.next(true);

            return false;
        }

        if (this.RECEIVE_DOC_TIME == null || this.RECEIVE_DOC_TIME == undefined || this.RECEIVE_DOC_TIME == "") {
            this.isReq_receiveTime.next(true);
            this.ShowAlertWarning('กรุณาระบุข้อมูล "เวลาที่ตรวจรับพิสูจน์"');
            this.cl_4.next(true);

            return false;
        }

        if (this.LIST_ARREST_PRODUCT.length > 0) {
            // const mVat = this.LIST_ARREST_PRODUCT.filter(f => f.VAT == 0 || f.VAT == "" || f.VAT == null).length;
            const mRemain_qunatity = this.LIST_ARREST_PRODUCT.filter(f => f.REMAIN_QUANTITY == 0 || f.REMAIN_QUANTITY == "" || f.REMAIN_QUANTITY == null).length;
            const mRemain_volumn = this.LIST_ARREST_PRODUCT.filter(f => f.REMAIN_VOLUMN == 0 || f.REMAIN_VOLUMN == "" || f.REMAIN_VOLUMN == null).length;

            // if (mVat > 0) {
            //     this.ShowAlertWarning('กรุณาระบุข้อมูล "รวมมูลค่าภาษี"');
            //     this.cl_4.next(true);

            //     return false;
            // }

            if (mRemain_qunatity > 0) {
                this.ShowAlertWarning('กรุณาระบุข้อมูล "จำนวนคงเหลือ"');
                this.cl_4.next(true);

                return false;
            }

            if (mRemain_volumn > 0) {
                this.ShowAlertWarning('กรุณาระบุข้อมูล "ปริมาณสุทธิคงเหลือ"');
                this.cl_4.next(true);

                return false;
            }
        }

        if (this.PROVE_RESULT_ALL == null || this.PROVE_RESULT_ALL == undefined || this.PROVE_RESULT_ALL == "") {
            this.isReq_proveResult.next(true);
            this.ShowAlertWarning('กรุณาระบุข้อมูล "รายงานผลการพิสูจน์"');
            this.cl_7.next(true);

            return false;
        }

        if (this.PROVE_STAFF_LIST.length > 0) {
            if (!this.PROVE_STAFF_LIST[0].STAFF || this.PROVE_STAFF_LIST[0].STAFF.STAFF_ID == null || this.PROVE_STAFF_LIST[0].STAFF.STAFF_ID == "") {
                this.isReq_staff1.next(true);
                this.ShowAlertWarning('กรุณาระบุข้อมูล "ผู้พิสูจน์ของกลาง"');
                this.cl_8.next(true);

                return false;
            }

            // if (!this.PROVE_STAFF_LIST[1].STAFF || this.PROVE_STAFF_LIST[1].STAFF.STAFF_ID == null || this.PROVE_STAFF_LIST[1].STAFF.STAFF_ID == "") {
            //     this.isReq_staff2.next(true);
            //     this.ShowAlertWarning('กรุณาระบุข้อมูล "ผู้ส่งมอบ"');
            //     this.cl_8.next(true);

            //     return false;
            // }

            // if (!this.PROVE_STAFF_LIST[2].STAFF || this.PROVE_STAFF_LIST[2].STAFF.STAFF_ID == null || this.PROVE_STAFF_LIST[2].STAFF.STAFF_ID == "") {
            //     this.isReq_staff3.next(true);
            //     this.ShowAlertWarning('กรุณาระบุข้อมูล "ผู้รับมอบ"');
            //     this.cl_8.next(true);

            //     return false;
            // }

        }

        if (this.mode === 'C') {
            await this.CheckProveNo();
        }
        else {
            await this.OnUpdProve();
        }

        // this.setProveData();
    }


    OnEdit() {
        this.showEditField = false;
        this.SaveButton.next(true);
        this.CancelButton.next(true);

        this.PrintButton.next(false);
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
                    this.router.navigate(['/prove/list']);
                } else if (this.mode === 'R') {
                    this.ShowProveData();

                    // set false
                    this.SaveButton.next(false);
                    this.CancelButton.next(false);

                    // set true  
                    this.PrintButton.next(true);
                    this.EditButton.next(true);
                    this.DeleteButton.next(true);
                    this.showEditField = true;
                }
            }
        });
    }


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
        }).then(async result => {
            if (result.value) {
                this.preloader.setShowPreloader(true);

                let oParam = {
                    PROVE_ID: this.PROVE_ID
                }

                this.MasService.getAPI1111("ProveupdDelete", oParam).then(async item => {
                    if (item.IsSuccess) {
                        this.preloader.setShowPreloader(false);
                        this.ShowAlertSuccess(Message.saveComplete);
                        this.router.navigate(['/prove/list']);
                    } else {
                        this.ShowAlertError(Message.saveFail);
                    }
                }, (error) => { console.error(error); });
            }
        })
    }


    OnchangeProveIsScience() {
        if (this.PROVE_IS_SCIENCE == true) {
            this.LIST_ARREST_PRODUCT.map(m => {
                m.ISPROVESCIENCE = true;
            });
        } else {
            this.LIST_ARREST_PRODUCT.map(m => {
                m.ISPROVESCIENCE = false;
            });
        }
    }
    //#endregion



    // **********************************
    // ------- Function For Action ------
    // **********************************
    //#region 
    setProveData() {
        let IS_OUTSIDE = `${this.PROVE_IS_OUTSIDE ? "1" : "0"}`;
        let IS_SCIENCE;

        if (this.PROVE_TYPE == "1")
            IS_SCIENCE = `${this.PROVE_IS_SCIENCE ? "1" : "0"}`;

        let cvProveDate = convertDateForSave2(this.PROVE_DATE, this.PROVE_TIME);
        let cvDeliveryDate = convertDateForSave2(this.DELIVERY_DOC_DATE, this.DELIVERY_DOC_TIME);
        let cvReceiveDate = convertDateForSave2(this.RECEIVE_DOC_DATE, this.RECEIVE_DOC_TIME);

        this.oParamProve = {
            PROVE_ID: this.PROVE_ID,                                                // รหัสตารางการพิสูจน์ของกลาง
            LAWSUIT_ID: this.LAWSUIT_ID,                                            // รหัสตารางบันทึกรับคำกล่าวโทษ
            LAWSUIT_NO: this.LAWSUIT_NO,                                            // เลขคดี (กรณีพิสูจน์ให้หน่วยงานภายนอกเท่านั้น)
            LAWSUIT_NO_YEAR: "",                                                    // ปีของเลขที่คดีรับคำกล่าวโทษ (กรณีพิสูจน์ให้หน่วยงานภายนอกเท่านั้น)
            PROVE_TYPE: this.PROVE_TYPE,                                            // "ประเภทการตรวจพิสูจน์ของกลาง 0 = ตรวจพิสูจน์ของกลางให้หน่วยงานภายใน 1 = ตรวจพิสูจน์ของกลางให้หน่วยงานภายนอก"
            IS_OUTSIDE: IS_OUTSIDE,                                                 // "พิสูจน์นอกสถานที่ทำการหรือไม่ 0 = พิสูจน์ในสถานที่ทำการ 1 = พิสูจน์นอกสถานที่ทำการ"
            PROVE_NO: this.PROVE_NO,
            // PROVE_NO_YEAR: this.PROVE_NO_YEAR,                                           // เลขทะเบียนตรวจพิสูจน์ (ใช้ทั้งพิสูจน์ให้หน่วยงานภายในและหน่วยงานภายนอก)
            PROVE_NO_YEAR: `${this.mode === 'C' ? this.PROVE_NO_YEAR : (+this.PROVE_NO_YEAR) + '-01-01 00:00:00.0000'}`,             // ปีของเลขทะเบียนตรวจพิสูจน์ (ใช้ทั้งพิสูจน์ให้หน่วยงานภายในและหน่วยงานภายนอก)
            RECEIVE_OFFICE_ID: this.STATION_MODEL.OFFICE_ID,                        // รหัสตารางหน่วยงานที่ตรวจรับของกลาง
            RECEIVE_OFFICE_CODE: this.STATION_MODEL.OFFICE_CODE,                    // รหัสอ้างอิงหน่วยงานที่ตรวจรับของกลาง (ใช้ทั้งพิสูจน์ให้หน่วยงานภายในและหน่วยงานภายนอก)
            RECEIVE_OFFICE_NAME: this.STATION_MODEL.OFFICE_SHORT_NAME,                    // รชื่อหน่วยงานที่ตรวจรับของกลาง (ใช้ทั้งพิสูจน์ให้หน่วยงานภายในและหน่วยงานภายนอก)
            PROVE_DATE: cvProveDate,                                                // วันที่พิสูจน์
            DELIVERY_DOC_NO_1: this.DELIVERY_DOC_NO_1,                              // เลขที่อ้างอิงหนังสือนำส่งของกลางเพื่อจัดเก็บ 1 (ใช้ทั้งพิสูจน์ให้หน่วยงานภายในและหน่วยงานภายนอก)
            DELIVERY_DOC_DATE: cvDeliveryDate,                                      // หนังสือนำส่งของกลางเพื่อจัดเก็บลงวันที่ (ใช้ทั้งพิสูจน์ให้หน่วยงานภายในและหน่วยงานภายนอก)
            RECEIVE_DOC_DATE: cvReceiveDate,                                        // วันเวลาที่ตรวจรับของกลาง (ใช้ทั้งพิสูจน์ให้หน่วยงานภายในและหน่วยงานภายนอก)
            OCCURRENCE_DATE: "",                                                    // วันที่เกิดเหตุ (กรณีพิสูจน์ให้หน่วยงานภายนอกเท่านั้น) 
            PROVE_RESULT: this.PROVE_RESULT_ALL.substring(0, 2000),                                         // สรุปผลรายงานการพิสูจน์
            PROVE_RESULT1: this.PROVE_RESULT_ALL.substring(2000, 4000),                                         // สรุปผลรายงานการพิสูจน์
            PROVE_RESULT2: this.PROVE_RESULT_ALL.substring(4000, 6000),                                         // สรุปผลรายงานการพิสูจน์
            PROVE_RESULT3: this.PROVE_RESULT_ALL.substring(6000, 8000),                                         // สรุปผลรายงานการพิสูจน์
            IS_ACTIVE: 1
        }

        const nScience = this.LIST_ARREST_PRODUCT.filter(f => f.ISPROVESCIENCE == true);
    }

    async OnInsProve() {
        this.preloader.setShowPreloader(true);
        this.setProveData();

        let isSuccess: boolean = true;

        // Prove
        isSuccess = await this.MasService.getAPI1111("ProveinsAll", this.oParamProve).then(item => {
            if (item.IsSuccess == "True") {
                this.PROVE_ID = item.PROVE_ID;
                return true;
            }
            else
                return false;

        }, (error) => { console.error(error); return false; });


        // Prove Staff
        if (isSuccess) {
            let lsResult = [];
            lsResult = await Promise.all(this.PROVE_STAFF_LIST.filter(f => f.STAFF != undefined).map(async m => {
                m.STAFF.CONTRIBUTOR_ID = m.CONTRIBUTOR_ID;
                m.STAFF.PROVE_ID = this.PROVE_ID;

                let response = await this.MasService.getAPI1111("ProveStaffinsAll", m.STAFF).then(item => {
                    if (item.IsSuccess == "True")
                        return true;
                    else
                        return false;
                }, (error) => { console.error(error); return false; });

                return response;
            }));

            isSuccess = lsResult.filter(f => false).length == 0;
        }


        // Arrest Product
        if (isSuccess) {
            let lsResult = [];
            lsResult = await Promise.all(this.LIST_ARREST_PRODUCT.map(async m => {
                m.PROVE_ID = this.PROVE_ID;
                m.PRICE = m.PRICE.replace(/,/g, "");
                m.QUANTITY = m.QUANTITY.replace(/,/g, "");
                m.REMAIN_QUANTITY = m.REMAIN_QUANTITY.replace(/,/g, "");
                m.VOLUMN = m.VOLUMN.replace(/,/g, "");
                m.REMAIN_VOLUMN = m.REMAIN_VOLUMN.replace(/,/g, "");
                m.DEGREE = m.DEGREE.replace(/,/g, "");
                m.VAT = m.VAT.replace(/,/g, "");
                m.IS_PROVE = `${m.ISPROVE ? "1" : "0"}`;
                m.IS_SCIENCE = `${m.ISPROVESCIENCE ? "1" : "0"}`;

                let response = await this.MasService.getAPI1111("ProveProductinsAll", m).then(item => {
                    if (item.IsSuccess == "True")
                        return true;
                    else
                        return false;
                }, (error) => { console.error(error); return false; });

                return response;
            }));

            isSuccess = lsResult.filter(f => false).length == 0;
        }


        // Arrest Remain Product
        if (isSuccess) {
            let lsResult = [];
            lsResult = await Promise.all(this.LIST_ARREST_PRODUCT.map(async m => {
                m.PROVE_ID = this.PROVE_ID;
                m.REMAIN_QUANTITY = m.REMAIN_QUANTITY.replace(/,/g, "");
                m.REMAIN_VOLUMN = m.REMAIN_VOLUMN.replace(/,/g, "");
                m.IS_STATUS = "0";
                m.ARREST_PRODUCT_ID = m.PRODUCT_ID;
                m.REMAIN_SIZES = m.SIZES;
                m.REMAIN_SIZES_UNIT = m.SIZES_UNIT;

                let response = await this.MasService.getAPI1111("RemainProductinsAll", m).then(item => {
                    if (item.IsSuccess == "True")
                        return true;
                    else
                        return false;
                }, (error) => { console.error(error); return false; });

                return response;
            }));

            isSuccess = lsResult.filter(f => false).length == 0;
        }


        // Document
        if (isSuccess) {
            let lsResult = [];

            lsResult = await Promise.all(this.fileList.filter(f => f.IsDelItem != true).map(async m => {
                const formData = new FormData();
                formData.append('FILE', m.FILE);
                formData.append('DOCUMENT_NAME', m.DOCUMENT_NAME);
                formData.append('DOCUMENT_OLD_NAME', m.DOCUMENT_OLD_NAME);
                formData.append('DOCUMENT_TYPE', '5');
                formData.append('FOLDER', m.FOLDER);
                formData.append('REFERENCE_CODE', this.PROVE_ID);

                let response = await this.MasService.DocumentAPI("DocumentinsAll", formData).then(item => {
                    if (item.IsSuccess == "True")
                        return true;
                    else
                        return false;
                }, (error) => { console.error(error); return false; });

                return response;
            }));

            isSuccess = lsResult.filter(f => false).length == 0;
        }

        if (isSuccess) {
            this.ShowAlertSuccess(Message.saveComplete);
            this.onComplete();
            this.ShowProveData();
            this.preloader.setShowPreloader(false);

            this.router.navigate([`/prove/manage/R/${this.PROVE_TYPE}/${this.PROVE_ID}/${this.LAWSUIT_ID}/${this.INDICTMENT_ID}`]);
        }
        else {
            this.ShowAlertError(Message.saveFail);
            this.preloader.setShowPreloader(false);
        }
    }


    async OnUpdProve() {
        this.preloader.setShowPreloader(true);
        this.setProveData();

        let isSuccess: boolean = true;

        isSuccess = await this.MasService.getAPI1111("ProveupdByCon", this.oParamProve).then(item => {
            if (item.IsSuccess == "True")
                return true;
            else
                return false;
        }, (error) => { console.error(error); return false; });



        // **********************************
        // -------------- Staff -------------
        // **********************************
        //#region 
        if (isSuccess) {
            let lsResult = [];
            lsResult = await Promise.all(this.PROVE_STAFF_LIST.filter(f => f.STAFF != undefined && f.IsNewItem == true).map(async m => {
                m.STAFF.CONTRIBUTOR_ID = m.CONTRIBUTOR_ID;
                m.STAFF.PROVE_ID = this.PROVE_ID;

                let response = await this.MasService.getAPI1111("ProveStaffinsAll", m.STAFF).then(item => {
                    if (item.IsSuccess == "True")
                        return true;
                    else
                        return false;
                }, (error) => { console.error(error); return false; });

                return response;
            }));

            isSuccess = lsResult.filter(f => false).length == 0;
        }


        if (isSuccess) {
            let lsResult = [];
            lsResult = await Promise.all(this.PROVE_STAFF_LIST.filter(f => f.STAFF != undefined && f.IsNewItem == false && f.IsDelItem == false).map(async m => {
                m.STAFF.CONTRIBUTOR_ID = m.CONTRIBUTOR_ID;
                m.STAFF.PROVE_ID = this.PROVE_ID;
                m.STAFF.STAFF_ID = m.STAFF_ID;

                let response = await this.MasService.getAPI1111("ProveStaffupdByCon", m.STAFF).then(item => {
                    if (item.IsSuccess == "True")
                        return true;
                    else
                        return false;
                }, (error) => { console.error(error); return false; });

                return response;
            }));

            isSuccess = lsResult.filter(f => false).length == 0;
        }

        if (isSuccess) {
            let lsResult = [];
            lsResult = await Promise.all(this.PROVE_STAFF_LIST.filter(f => f.IsDelItem == true).map(async m => {
                let response = await this.MasService.getAPI1111("ProveStaffupdDelete", { STAFF_ID: m.STAFF_ID }).then(item => {
                    if (item.IsSuccess == "True") {
                        m.STAFF_ID = "";
                        m.IsDelItem = false;
                        return true;
                    }
                    else
                        return false;
                }, (error) => { console.error(error); return false; });

                return response;
            }));

            isSuccess = lsResult.filter(f => false).length == 0;
        }
        //#endregion



        // **********************************
        // -------------- Product -----------
        // **********************************
        //#region 
        if (isSuccess) {
            let lsResult = [];
            lsResult = await Promise.all(this.LIST_ARREST_PRODUCT.filter(f => f.IsNewItem == true).map(async m => {
                m.PROVE_ID = this.PROVE_ID;
                m.PRICE = m.PRICE.replace(/,/g, "");
                m.QUANTITY = m.QUANTITY.replace(/,/g, "");
                m.REMAIN_QUANTITY = m.REMAIN_QUANTITY.replace(/,/g, "");
                m.VOLUMN = m.VOLUMN.replace(/,/g, "");
                m.REMAIN_VOLUMN = m.REMAIN_VOLUMN.replace(/,/g, "");
                m.VAT = m.VAT.replace(/,/g, "");
                m.DEGREE = m.DEGREE.replace(/,/g, "");
                m.IS_PROVE = `${m.ISPROVE ? "1" : "0"}`;
                m.IS_SCIENCE = `${m.ISPROVESCIENCE ? "1" : "0"}`;

                let response = await this.MasService.getAPI1111("ProveProductinsAll", m).then(item => {
                    if (item.IsSuccess == "True")
                        return true;
                    else
                        return false;
                }, (error) => { console.error(error); return false; });

                return response;
            }));

            isSuccess = lsResult.filter(f => false).length == 0;
        }

        if (isSuccess) {
            let lsResult = [];
            lsResult = await Promise.all(this.LIST_ARREST_PRODUCT.filter(f => f.IsNewItem == false && f.IsDelItem == false).map(async m => {
                m.PROVE_ID = this.PROVE_ID;
                m.PRICE = m.PRICE.replace(/,/g, "");
                m.QUANTITY = m.QUANTITY.replace(/,/g, "");
                m.REMAIN_QUANTITY = m.REMAIN_QUANTITY.replace(/,/g, "");
                m.VOLUMN = m.VOLUMN.replace(/,/g, "");
                m.REMAIN_VOLUMN = m.REMAIN_VOLUMN.replace(/,/g, "");
                m.VAT = m.VAT.replace(/,/g, "");
                m.DEGREE = m.DEGREE.replace(/,/g, "");
                m.IS_PROVE = `${m.ISPROVE ? "1" : "0"}`;
                m.IS_SCIENCE = `${m.ISPROVESCIENCE ? "1" : "0"}`;

                let response = await this.MasService.getAPI1111("ProveProductupdByCon", m).then(item => {
                    if (item.IsSuccess == "True")
                        return true;
                    else
                        return false;
                }, (error) => { console.error(error); return false; });

                return response;
            }));

            isSuccess = lsResult.filter(f => false).length == 0;
        }

        if (isSuccess) {
            let lsResult = [];
            lsResult = await Promise.all(this.LIST_ARREST_PRODUCT.filter(f => f.IsDelItem == true).map(async m => {
                let response = await this.MasService.getAPI1111("ProveProductupdDelete", { PRODUCT_ID: m.PRODUCT_ID }).then(item => {
                    if (item.IsSuccess == "True")
                        return true;
                    else
                        return false;
                }, (error) => { console.error(error); return false; });

                return response;
            }));

            isSuccess = lsResult.filter(f => false).length == 0;
        }
        //#endregion


        // **********************************
        // -------------- Document ----------
        // **********************************
        //#region 
        if (isSuccess) {
            let lsResult = [];

            lsResult = await Promise.all(this.fileList.filter(f => f.IsNewItem == true && f.IsDelItem == false).map(async m => {
                const formData = new FormData();
                formData.append('FILE', m.FILE);
                formData.append('DOCUMENT_NAME', m.DOCUMENT_NAME);
                formData.append('DOCUMENT_OLD_NAME', m.DOCUMENT_OLD_NAME);
                formData.append('DOCUMENT_TYPE', '5');
                formData.append('FOLDER', m.FOLDER);
                formData.append('REFERENCE_CODE', this.PROVE_ID);

                let response = await this.MasService.DocumentAPI("DocumentinsAll", formData).then(item => {
                    if (item.IsSuccess == "True")
                        return true;
                    else
                        return false;
                }, (error) => { console.error(error); return false; });

                return response;
            }));

            isSuccess = lsResult.filter(f => false).length == 0;
        }

        if (isSuccess) {
            let lsResult = [];
            lsResult = await Promise.all(this.fileList.filter(f => f.IsDelItem == true).map(async m => {
                let response = await this.MasService.DocumentupdDelete(m.DOCUMENT_ID.toString()).then(item => {
                    if (item.IsSuccess == "True")
                        return true;
                    else
                        return false;
                }, (error) => { console.error(error); return false; });

                return response;
            }));

            isSuccess = lsResult.filter(f => false).length == 0;
        }
        //#endregion


        if (isSuccess) {
            this.ShowAlertSuccess(Message.saveComplete);

            this.onComplete();
            this.ShowProveData();
            this.preloader.setShowPreloader(false);
        }
        else {
            this.ShowAlertError(Message.saveFail);
            this.preloader.setShowPreloader(false);
        }
    }
    //#endregion


    onComplete() {
        this.showEditField = true;
        this.EditButton.next(true);
        this.DeleteButton.next(true);
        this.PrintButton.next(true);

        this.CancelButton.next(false);
        this.SaveButton.next(false);
    }

    OnPrint() {
        this.modal = this.ngbModel.open(this.printDocModel, { size: 'lg', centered: true })
    }


    // **********************************
    // ------------- DateTime -----------
    // **********************************
    //#region 
    getCurrentDate() {
        let date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).toISOString().substring(0, 10);
    }

    getCurrentTime() {
        let date = new Date();
        return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });
    }

    getDDLYear(date: any) {
        let yearLocal = +toLocalYear(date);

        for (var i = 0; i < 10; i++) {
            let item = {
                VALUE: yearLocal - 543 - i,
                TEXT: yearLocal - i
            };

            this.LIST_YEAR.push(item);
        }
    }
    //#endregion




    // **********************************
    // -------------- Popup -------------
    // **********************************
    //#region
    OpenPopupProduct() {
        this.modal = this.ngbModel.open(this.searchProductModal, { size: 'lg', centered: true });
    }

    OpenPopupVatProve() {
        this.modal = this.ngbModel.open(this.vatProveModal, { size: 'lg', centered: true });
    }

    OpenPopupProveJoinProduct() {
        this.modal = this.ngbModel.open(this.poveEvidenceJoinModal, { size: 'lg', centered: true });
    }

    OpenPopupPriceRecommend(i: number) {
        this.PRODUCT_MODEL = {};

        Object.assign(this.PRODUCT_MODEL, this.LIST_ARREST_PRODUCT[i]);
        this.modal = this.ngbModel.open(this.priceRecommendModal, { size: 'lg', centered: true });
    }

    OpenPopupProveScience(i: number) {
        this.PRODUCT_MODEL = {};

        Object.assign(this.PRODUCT_MODEL, this.LIST_ARREST_PRODUCT[i]);
        this.modal = this.ngbModel.open(this.proveScienceModal, { size: 'lg', centered: true });
    }

    ProveScienceResult(event) {
        if (event != 'Close') {
            this.LIST_ARREST_PRODUCT.filter(f => f.SEQ == event.SEQ).map(m => {
                Object.assign(m, event);
            })
        }

        this.modal.dismiss();
    }

    ProveProductResult(event) {
        if (event != 'Close') {
            event.map(m => {
                let isProduct = this.LIST_ARREST_PRODUCT.filter(x => x.PRODUCT_MAPPING_ID === m.PRODUCT_MAPPING_ID)

                if (isProduct.length == 0) {
                    this.LIST_ARREST_PRODUCT.push(m);
                }
            });

            this.CalVatWithMulti();
        }

        this.modal.dismiss();
    }
    //#endregion




    // **********************************
    // -------------- Staff -------------
    // **********************************
    //#region
    async getStaff() {
        this.preloader.setShowPreloader(true);

        var paramsOther = {
            TEXT_SEARCH: "",
            STAFF_ID: localStorage.getItem('UserAccountID')
        }

        await this.MasService.getAPI1111("MasStaffgetByCon", paramsOther).then(list => {
            if (list.SUCCESS == true) {
                this.STAFF_LIST = list.RESPONSE_DATA;

                this.STAFF_LIST.map(m => {
                    m.NAME = m.TITLE_SHORT_NAME_TH + m.FIRST_NAME + " " + m.LAST_NAME;
                    m.CONTRIBUTOR_ID = "";
                });

                this.preloader.setShowPreloader(false);
            } else {
                this.ShowAlertError("พบปัญหาที่ API MasStaffgetByCon");
                this.preloader.setShowPreloader(false);
            }
        });
    }

    // searchStaff = (text$: Observable<string>) =>
    //     text$.debounceTime(200)
    //         .map(term => term == '' ? []
    //             : this.STAFF_LIST
    //                 .filter(v => v.NAME.toLowerCase().indexOf(term.toLowerCase()) > -1)
    //                 .slice(0, 10)
    //         );

    // formatter = (x: { NAME: string }) => x.NAME;

    formatterStaff = (x: { TITLE_SHORT_NAME_TH: string, FIRST_NAME: string, LAST_NAME: string }) =>
        `${x.TITLE_SHORT_NAME_TH || ''}${x.FIRST_NAME || ''} ${x.LAST_NAME || ''}`

    public searchStaff = (text2$: Observable<string>) =>
        text2$
            .debounceTime(200)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.MasService.MasStaffgetByCon_Search({ TEXT_SEARCH: term })
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of([]);
                    })
            )
            .do(() => this.searching = false);

    StaffselectItem(i: number, event) {
        this.PROVE_STAFF_LIST[i].POSNAME = event.item.MANAGEMENT_POS_NAME;
        this.PROVE_STAFF_LIST[i].DEPTNAME = event.item.OPERATION_OFFICE_SHORT_NAME;
        this.PROVE_STAFF_LIST[i].STAFFNAME = `${event.item.TITLE_SHORT_NAME_TH || ''}${event.item.FIRST_NAME || ''} ${event.item.LAST_NAME || ''}`;

        if (this.PROVE_STAFF_LIST[i].STAFF_ID != "") {
            this.PROVE_STAFF_LIST[i].IsDelItem = false;
        }
    }

    StaffClear(i: number, event) {
        if (typeof this.PROVE_STAFF_LIST == "object") {
            this.PROVE_STAFF_LIST[i].POSNAME = "";
            this.PROVE_STAFF_LIST[i].DEPTNAME = "";
            this.PROVE_STAFF_LIST[i].STAFFNAME = "";
            this.PROVE_STAFF_LIST[i].STAFF = null;

            if (this.PROVE_STAFF_LIST[i].STAFF_ID != "") {
                this.PROVE_STAFF_LIST[i].IsDelItem = true;
            }
        }
    }
    //#endregion




    // **********************************
    // -------------- Station ----------
    // **********************************
    //#region
    async getOffice() {
        await this.MasService.getAPI1111("MasOfficegetByCon", { "TEXT_SEARCH": "" }).then(list => {
            if (list) {
                this.OFFICE_LIST = list.RESPONSE_DATA;
            }
        }, (err: HttpErrorResponse) => { console.log(err); });
    }

    searchOffice = (text$: Observable<string>) =>
        text$.debounceTime(200)
            .map(term => term == '' ? []
                : this.OFFICE_LIST
                    .filter(v => this.MappingNullData(v.OFFICE_SHORT_NAME).toLowerCase().indexOf(term.toLowerCase()) > -1)
                    .slice(0, 10)
            );

    formatter_Office = (x: { OFFICE_SHORT_NAME: string }) => x.OFFICE_SHORT_NAME;

    // searchOffice = (text2$: Observable<string>) =>
    //     text2$
    //         .debounceTime(200)
    //         .distinctUntilChanged()
    //         .do(() => this.searching = true)
    //         .switchMap(term =>
    //             this.MasService.MasOfficegetByCon_forSearch({ TEXT_SEARCH: term })
    //                 .do(() => this.searchFailed = false)
    //                 .catch(() => {
    //                     this.searchFailed = true;
    //                     return Observable.of([]);
    //                 })
    //         )
    //         .do(() => this.searching = false);

    StationselectItem(event) {
        this.RECEIVE_OFFICE_CODE = event.item.OFFICE_CODE;
    }

    StationClear() {
        if (typeof this.STATION_MODEL == "object") {
            this.RECEIVE_OFFICE_CODE = "";
        }
    }
    //#endregion


    CloseModal(event) {
        this.modal.dismiss();
    }


    // **********************************
    // ---------------- NULL ------------
    // **********************************
    //#region
    MappingNullData(str: string) {
        return `${str == 'null' || str == null ? '' : str}`;
    }

    MappingNullNumberData(str: string) {
        return `${str == 'null' || str == null ? "0" : str}`;
    }

    //#endregion



    // *******************************************
    // ---------------- Action Product -----------
    // *******************************************
    //#region
    CalVatWithMulti() {
        this.LIST_ARREST_PRODUCT.map(m => {
            //     let vatValue = 0, vatVolumn = 0;

            //     if (m.PRODUCT_GROUP_ID == 13) {  // สุรา
            //         if (m.IS_TAX_VALUE == "1")
            //             vatValue = (+this.MappingNullNumberData(m.DEGREE.replace(/,/g, "")) * +this.MappingNullNumberData(m.PRICE) * +this.MappingNullNumberData(m.TAX_VALUE)) / 100

            //         if (m.IS_TAX_VOLUMN == "1")
            //             vatVolumn = (+this.MappingNullNumberData(m.DEGREE.replace(/,/g, "")) * +this.MappingNullNumberData(m.VOLUMN.replace(/,/g, "")) * +this.MappingNullNumberData(m.TAX_VOLUMN)) / 100
            //     }
            //     else { // ไม่ใช่สุรา
            //         if (m.IS_TAX_VALUE == "1")
            //             vatValue = (+this.MappingNullNumberData(m.PRICE) * +this.MappingNullNumberData(m.TAX_VALUE)) / 100

            //         if (m.IS_TAX_VOLUMN == "1")
            //             vatVolumn = (+this.MappingNullNumberData(m.VOLUMN.replace(/,/g, "")) * +this.MappingNullNumberData(m.TAX_VOLUMN)) / 100
            //     }

            //     // m.VAT = m.PRODUCT_GROUP_ID == 2 || m.PRODUCT_GROUP_ID == 1 || m.PRODUCT_GROUP_ID == 13 || m.PRODUCT_GROUP_ID == 14
            //     //     ? (vatValue + vatVolumn).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })
            //     //     : (vatValue + vatVolumn).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });


            //     m.VAT = (vatValue + vatVolumn).toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 });
            //     m.PRICE = m.PRICE.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            m.VAT = m.VAT.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 });
            m.PRICE = m.PRICE.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        });

        this.CalVatSummary();
    }

    CalVat(i: number) {
        let m = this.LIST_ARREST_PRODUCT.find(f => f.SEQ == i);

        if (m != undefined) {
            let vatValue = 0, vatVolumn = 0;

            if (m.PRODUCT_GROUP_ID == 13) {  // สุรา
                if (m.IS_TAX_VALUE == "1")
                    vatValue = (+this.MappingNullNumberData(m.DEGREE.replace(/,/g, "")) * +this.MappingNullNumberData(m.PRICE) * +this.MappingNullNumberData(m.TAX_VALUE)) / 100

                if (m.IS_TAX_VOLUMN == "1")
                    vatVolumn = (+this.MappingNullNumberData(m.DEGREE.replace(/,/g, "")) * +this.MappingNullNumberData(m.VOLUMN.replace(/,/g, "")) * +this.MappingNullNumberData(m.TAX_VOLUMN)) / 100
            }
            else { // ไม่ใช่สุรา
                if (m.IS_TAX_VALUE == "1")
                    vatValue = (+this.MappingNullNumberData(m.PRICE.replace(/,/g, "")) * +this.MappingNullNumberData(m.TAX_VALUE)) / 100

                if (m.IS_TAX_VOLUMN == "1")
                    vatVolumn = (+this.MappingNullNumberData(m.VOLUMN.replace(/,/g, "")) * +this.MappingNullNumberData(m.TAX_VOLUMN)) / 100
            }

            // m.VAT = m.PRODUCT_GROUP_ID == 2 || m.PRODUCT_GROUP_ID == 1 || m.PRODUCT_GROUP_ID == 13 || m.PRODUCT_GROUP_ID == 14
            //     ? (vatValue + vatVolumn).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })
            //     : (vatValue + vatVolumn).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            m.VAT = (vatValue + vatVolumn).toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 });
        }
        else
            m.VAT = 0.0000;
        // m.VAT = m.PRODUCT_GROUP_ID == 2 || m.PRODUCT_GROUP_ID == 1 || m.PRODUCT_GROUP_ID == 13 || m.PRODUCT_GROUP_ID == 14 ? 0.000 : 0.00;

        this.CalVatSummary();
    }

    calVolumn(i: number) {
        let m = this.LIST_ARREST_PRODUCT.find(f => f.SEQ == i);

        if (m.SIZES * m.QUANTITY.replace(/,/g, "") > 0) {
            m.VOLUMN = `${m.PRODUCT_GROUP_ID != '1'
                && m.PRODUCT_GROUP_ID != '2'
                && m.PRODUCT_GROUP_ID != '13'
                ? (m.SIZES * m.QUANTITY.replace(/,/g, "")).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
                : (m.SIZES * m.QUANTITY.replace(/,/g, "")).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`;
        }
        else {
            m.VOLUMN = "";
        }
    }

    CalVatSummary() {
        let oVat = 0;

        this.LIST_ARREST_PRODUCT.map(m => {
            oVat += +(m.VAT).replace(/,/g, "");
        });

        this.sumVat = oVat;
    }

    FormatNumber(i: number) {
        this.LIST_ARREST_PRODUCT[i].PRICE = (+this.LIST_ARREST_PRODUCT[i].PRICE.replace(/,/g, "")).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    FormatQuantityNumber(i: number) {
        this.LIST_ARREST_PRODUCT[i].QUANTITY = (+this.LIST_ARREST_PRODUCT[i].QUANTITY.replace(/,/g, "")).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 5 });
    }

    FormatRemainQuantityNumber(i: number) {
        this.LIST_ARREST_PRODUCT[i].REMAIN_QUANTITY = (+this.LIST_ARREST_PRODUCT[i].REMAIN_QUANTITY.replace(/,/g, "")).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 5 });
    }

    FormatValumnNumber(i: number) {
        this.LIST_ARREST_PRODUCT[i].VOLUMN = `${this.LIST_ARREST_PRODUCT[i].PRODUCT_GROUP_ID != '1'
            && this.LIST_ARREST_PRODUCT[i].PRODUCT_GROUP_ID != '2'
            && this.LIST_ARREST_PRODUCT[i].PRODUCT_GROUP_ID != '13'
            ? (+this.LIST_ARREST_PRODUCT[i].VOLUMN.replace(/,/g, "")).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : (+this.LIST_ARREST_PRODUCT[i].VOLUMN.replace(/,/g, "")).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`;
    }

    FormatRemainValumnNumber(i: number) {
        this.LIST_ARREST_PRODUCT[i].REMAIN_VOLUMN = `${this.LIST_ARREST_PRODUCT[i].PRODUCT_GROUP_ID != '1'
            && this.LIST_ARREST_PRODUCT[i].PRODUCT_GROUP_ID != '2'
            && this.LIST_ARREST_PRODUCT[i].PRODUCT_GROUP_ID != '13'
            ? (+this.LIST_ARREST_PRODUCT[i].REMAIN_VOLUMN.replace(/,/g, "")).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : (+this.LIST_ARREST_PRODUCT[i].REMAIN_VOLUMN.replace(/,/g, "")).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`;
    }

    EditQuantity(i: number) {
        // this.LIST_ARREST_PRODUCT[i].REMAIN_QUANTITY = (+this.LIST_ARREST_PRODUCT[i].QUANTITY).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 5 });
        this.calVolumn(i);
        this.CalVat(i);
    }

    EditRemainQuantity(i: number) {
        let m = this.LIST_ARREST_PRODUCT.find(f => f.SEQ == i);

        if (m.SIZES * m.REMAIN_QUANTITY.replace(/,/g, "") > 0) {
            m.REMAIN_VOLUMN = `${m.PRODUCT_GROUP_ID != '1'
                && m.PRODUCT_GROUP_ID != '2'
                && m.PRODUCT_GROUP_ID != '13'
                ? (m.SIZES * m.REMAIN_QUANTITY.replace(/,/g, "")).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
                : (m.SIZES * m.REMAIN_QUANTITY.replace(/,/g, "")).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`;
        }
        else {
            m.REMAIN_VOLUMN = "";
        }
    }

    FormatDegreeNumber(i: number) {
        this.LIST_ARREST_PRODUCT[i].DEGREE = (+this.LIST_ARREST_PRODUCT[i].DEGREE).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }

    FormatVatNumber(i: number) {
        this.LIST_ARREST_PRODUCT[i].VAT = (+this.LIST_ARREST_PRODUCT[i].VAT.replace(/,/g, "")).toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 });

        this.CalVatSummary();
    }

    EditQuantityUnit(i: number) {
        this.LIST_ARREST_PRODUCT[i].REMAIN_QUANTITY_UNIT = this.LIST_ARREST_PRODUCT[i].QUANTITY_UNIT;
    }

    EditVolumn(i: number) {
        // this.LIST_ARREST_PRODUCT[i].REMAIN_VOLUMN = `${this.LIST_ARREST_PRODUCT[i].PRODUCT_GROUP_ID != '1'
        //     && this.LIST_ARREST_PRODUCT[i].PRODUCT_GROUP_ID != '2'
        //     && this.LIST_ARREST_PRODUCT[i].PRODUCT_GROUP_ID != '13'
        //     ? (+this.LIST_ARREST_PRODUCT[i].VOLUMN).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        //     : (+this.LIST_ARREST_PRODUCT[i].VOLUMN).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`;

        this.CalVat(i);
    }

    EditVolumnUnit(i: number) {
        this.LIST_ARREST_PRODUCT[i].REMAIN_VOLUMN_UNIT = this.LIST_ARREST_PRODUCT[i].VOLUMN_UNIT;
    }

    //#endregion




    // **********************************
    // -------------- Document ----------
    // **********************************
    //#region

    owlOption = {
        items: 5,
        nav: true,
        dots: false,
        slideBy: 5,
        margin: 10,
        responsiveClass: true
    }

    openModal(e) {
        this.modal = this.ngbModel.open(e, { size: 'lg', centered: true });
    }

    OutputImage(event: Document) {
        //console.log('event : ', event)
        event.DOC_SEQ = this.fileList.length + 1;
        this.fileList = [...this.fileList, event]
    }

    deleteItem(i: number) {
        if (this.showEditField) return;
        swal({
            title: '',
            text: 'ยืนยันการลบรายการหรือไม่',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ตกลง',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.value) {
                this.fileList.filter(f => f.DOC_SEQ == i).map(doc => {
                    doc.IsDelItem = true;
                    //this.fileList.splice(i, 1);
                    return;
                });
            }
        })
    }

    DownloadItem(item) {
        this.preloader.setShowPreloader(true);
        this.ProveSV.downloadFile(item.DOCUMENT_ID)
            .subscribe((data) => this.handleDownload(data, item));
    }

    handleDownload(data: any, item: any) {
        this.preloader.setShowPreloader(false);
        var blob = URL.createObjectURL(new Blob([data], { type: '*/*' }));
        saveAs(blob, item.DOCUMENT_NAME);
    }
    //#endregion



    // **********************************
    // -------------- Message ----------
    // **********************************
    //#region 
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

    ShowAlertWarning(alertText: string) {
        swal({
            title: '',
            text: alertText,
            type: 'warning',
            confirmButtonText: 'ตกลง'
        });
    }
    //#endregion



    public canOfficeSearch(): boolean {
        const OFFICE_CODE_SLICE = localStorage.getItem("officeCode").slice(0, 2);
        return OFFICE_CODE_SLICE == '00' ? false : true;

        // return false;
    }

    setYear() {
        let newDate = new Date();
        let temp = newDate.getFullYear() + 543
        let YearSelected = (acc, curr) => acc == curr ? true : false;
        for (let i = 0; i <= 1; i++) {
            let _temp = temp - i;
            let js: any = {
                year: _temp,
                value: _temp - 543,
                selected: YearSelected(newDate.getFullYear(), _temp - 543)
            }
            this.LIST_YEAR.push(js);
        }

        const year = this.LIST_YEAR.find(f => YearSelected(newDate.getFullYear(), f.value)).value;
        this.changeYear(year);
    }

    changeYear(ev: Number): void {
        const newDate = new Date();
        let m = setZero((newDate).getMonth() + 1);
        let d = setZero((newDate).getDate());
        let h = setZero((newDate).getHours());
        let min = setZero((newDate).getMinutes());
        let s = setZero((newDate).getSeconds());
        let ms = newDate.getMilliseconds();
        const seted = `${Number(ev)}-${m}-${d} ${h}:${min}:${s}.${ms}`;
        this.PROVE_NO_YEAR = seted;

        this.getProveNoRunning();
    }

    public setFormatTimeControl(event: any) {
        let str = event.target.value;
        let str_unSub = event.target.value;
        let substr: any[] = []
        let mm: string = '';
        let ss: string = '';
        substr = str.split(':');
        mm = substr[0] == undefined ? '' : substr[0].slice(0, 2);
        ss = substr[1] == undefined ? '' : substr[1].slice(0, 2);
        const K = event.keyCode;

        if (!/([0-9])$/.test(event.target.value))
            event.target.value = str_unSub.slice(0, str_unSub.length - 1);

        switch (true) {
            // NumPad 96-105
            case K >= 96 && K <= 105:
                if (str.length == 2)
                    event.target.value = `${mm}:${ss}`;
                else if (str.length == 3)
                    event.target.value = `${mm}:${str_unSub.substring(2)}`;
                break;
            // KeyPad 96-105
            case (K >= 48 && K <= 57):
                if (str.length == 2)
                    event.target.value = `${mm}:${ss}`;
                else if (str.length == 3)
                    event.target.value = `${mm}:${str_unSub.substring(2)}`;
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
    }

    public setProveNoControl(event: any) {
        let str = event.target.value;

        if (!/([0-9])$/.test(event.target.value) || (str.length == 1 && str == 0))
            event.target.value = str.slice(0, str.length - 1);
    }

    NumericDotOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    NumericDotOnlyPatt(event): boolean {
        let patt = /^([0-9,.])$/;
        let result = patt.test(event.key);
        return result;
    }

    validateFirstZelo(event: any) {
        if (/^0/.test(event.value))
            this.PROVE_NO = event.value.replace(/^0/, "");
    }
}
