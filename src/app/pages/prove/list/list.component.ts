import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ProveService } from '../prove.service';
import { Prove } from '../prove';
import { NavigationService } from '../../../shared/header-navigation/navigation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Message } from '../../../config/message';
import { pagination } from '../../../config/pagination';
import { NgForm, FormBuilder } from '@angular/forms';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import { SidebarService } from '../../../shared/sidebar/sidebar.component';
import { toLocalShort, compareDate, setZeroHours, toLocalYear, MyDatePickerOptions, getDateMyDatepicker, setDateMyDatepicker } from '../../../config/dateFormat';
import { IMyDateModel, IMyOptions } from 'mydatepicker-th';
import swal from 'sweetalert2';
import { BehaviorSubject, Observable } from '../../../../../node_modules/rxjs';
import { MasterService } from '../../masters/masters.service';
import { IMyDpOptions } from "mydatepicker";

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

    private subOnSearch: any;

    dataTable: any;
    advSearch: any;
    _dateDeliveryStartFrom: any;
    _dateDeliveryStartTo: any;
    _dateProveStartFrom: any;
    _dateProveStartTo: any;

    OFFICE_LIST = [];
    officeShortName: any;
    PROVE_STATUS: string;
    // STATION_MODEL: any;

    paginage = pagination;
    Prove = [];
    ListProve = [];

    TEMP_TEXT_SEARCH: any = '';
    TEMP_ARREST_CODE: any = '';
    TEMP_OCCURRENCE_DATE_FROM: any = '';
    TEMP_OCCURRENCE_DATE_TO: any = '';
    TEMP_ARREST_STAFF_NAME: any = '';
    TEMP_LAWBREAKER_STAFF_NAME: any = '';
    TEMP_LAWSUIT_TYPE: any = '';
    TEMP_SECTION_NAME: any = '';
    TEMP_GUILTBASE_NAME: any = '';
    TEMP_ARREST_OFFICE_NAME: any = '';
    TEMP_LAWSUIT_NO: any = '';
    TEMP_LAWSUIT_NO_YEAR: any = '';
    TEMP_LAWSUIT_IS_OUTSIDE: any = '';
    TEMP_LAWSUIT_DATE_FROM: any = '';
    TEMP_LAWSUIT_DATE_TO: any = '';
    TEMP_LAWSUIT_STAFF_NAME: any = '';
    TEMP_PROVE_NO: any = '';
    TEMP_PROVE_NO_YEAR: any = '';
    TEMP_PROVE_DATE_FROM: any = '';
    TEMP_PROVE_DATE_TO: any = '';
    TEMP_PROVE_STAFF_NAME: any = '';
    TEMP_PROVE_IS_OUTSIDE: any = '';

    public dateFromOption = Object.assign({}, MyDatePickerOptions);
    public dateToOption = Object.assign({}, MyDatePickerOptions);

    public dateFromProveOption = Object.assign({}, MyDatePickerOptions);
    public dateToProveOption = Object.assign({}, MyDatePickerOptions);

    public dateFromArrestOption = Object.assign({}, MyDatePickerOptions);
    public dateToArrestOption = Object.assign({}, MyDatePickerOptions);

    // public dateFromOption: IMyDpOptions = {
    //     editableDateField: false,
    //     dateFormat: 'dd mmm yyyy',
    //     showClearDateBtn: false,
    //     height: '30px'
    // };

    // public dateToOption: IMyDpOptions = {
    //     editableDateField: false,
    //     dateFormat: 'dd mmm yyyy',
    //     showClearDateBtn: false,
    //     height: '30px'
    // };

    // public dateFromProveOption: IMyDpOptions = {
    //     editableDateField: false,
    //     dateFormat: 'dd mmm yyyy',
    //     showClearDateBtn: false,
    //     height: '30px'
    // };

    // public dateToProveOption: IMyDpOptions = {
    //     editableDateField: false,
    //     dateFormat: 'dd mmm yyyy',
    //     showClearDateBtn: false,
    //     height: '30px'
    // };

    // public dateFromArrestOption: IMyDpOptions = {
    //     editableDateField: false,
    //     dateFormat: 'dd mmm yyyy',
    //     showClearDateBtn: false,
    //     height: '30px'
    // };

    // public dateToArrestOption: IMyDpOptions = {
    //     editableDateField: false,
    //     dateFormat: 'dd mmm yyyy',
    //     showClearDateBtn: false,
    //     height: '30px'
    // };

    public TN_SORTING = new BehaviorSubject<Boolean>(true);
    public TIME_SORTING = new BehaviorSubject<Boolean>(true);
    public LSN_SORTING = new BehaviorSubject<Boolean>(true);
    public LSD_SORTING = new BehaviorSubject<Boolean>(true);
    public FPN_SORTING = new BehaviorSubject<Boolean>(true);
    public RD_SORTING = new BehaviorSubject<Boolean>(true);

    @ViewChild('advForm') advForm: NgForm;

    DeliveryDateFrom = "";
    DeliveryDateTo: any;
    ProveDateFrom = "";
    ProveDateTo: any;
    RECEIVE_OFFICE_MODEL: any;
    // isSortC1Asc: boolean = true;
    // isSortC2Asc: boolean = true;
    // isSortC3Asc: boolean = true;
    // isSortC4Asc: boolean = true;
    // isSortC5Asc: boolean = true;
    // isSortC6Asc: boolean = true;
    // isSortC7Asc: boolean = true;
    // isSortC8Asc: boolean = true;
    // isSortC9Asc: boolean = true;
    // isSortC10Asc: boolean = true;
    // isSortC11Asc: boolean = true;
    // isSortC12Asc: boolean = true;
    // isSortC13Asc: boolean = true;
    // isSortC14Asc: boolean = true;
    // isSortC15Asc: boolean = true;

    OCCURRENCE_DATE_TO: any;
    PROVE_DATE_TO: any;
    LAWSUIT_DATE_TO: any;

    public I18N_VALUES = {
        weekdays: ['อ.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'],
        months: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
    };

    constructor(
        private _router: Router,
        private navService: NavigationService,
        private proveService: ProveService,
        private sidebarService: SidebarService,
        private preloader: PreloaderService,
        private MasService: MasterService
    ) {
        this.navService.showAdvSearch = new BehaviorSubject<Boolean>(true);
        this.advSearch = this.navService.showAdvSearch;
    }

    async ngOnInit() {
        this.sidebarService.setVersion('Prove II 0.0.0.4');

        this.DeliveryDateTo = null;
        this.ProveDateTo = null;

        let currentdate = new Date();
        // this.dateFromArrestOption.disableSince = { year: currentdate.getFullYear(), month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 };
        // this.dateToArrestOption.disableSince = { year: currentdate.getFullYear(), month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 };
        // this.dateFromOption.disableSince = { year: currentdate.getFullYear(), month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 };
        // this.dateToOption.disableSince = { year: currentdate.getFullYear(), month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 };
        // this.dateFromProveOption.disableSince = { year: currentdate.getFullYear(), month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 };
        // this.dateToProveOption.disableSince = { year: currentdate.getFullYear(), month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 };

        this.dateFromArrestOption.disableDateRanges = [{
            begin: { year: currentdate.getFullYear(), month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 },
            end: { year: currentdate.getFullYear() + 100, month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 }
        }];

        this.dateToArrestOption.disableDateRanges = [{
            begin: { year: currentdate.getFullYear(), month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 },
            end: { year: currentdate.getFullYear() + 100, month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 }
        }];

        this.dateFromOption.disableDateRanges = [{
            begin: { year: currentdate.getFullYear(), month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 },
            end: { year: currentdate.getFullYear() + 100, month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 }
        }];

        this.dateToOption.disableDateRanges = [{
            begin: { year: currentdate.getFullYear(), month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 },
            end: { year: currentdate.getFullYear() + 100, month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 }
        }];

        this.dateFromProveOption.disableDateRanges = [{
            begin: { year: currentdate.getFullYear(), month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 },
            end: { year: currentdate.getFullYear() + 100, month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 }
        }];

        this.dateToProveOption.disableDateRanges = [{
            begin: { year: currentdate.getFullYear(), month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 },
            end: { year: currentdate.getFullYear() + 100, month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 }
        }];


        this.preloader.setShowPreloader(true);

        await this.getOffice();
        await this.InitialDataByLogin();

        this.PROVE_STATUS = "0";

        await this.proveService.getByConAdv({ PROVE_STATUS: "0", ACCOUNT_OFFICE_CODE: localStorage.getItem("officeCode") }).then(async list => {
            this.onSearchComplete(list);
        }, (err: HttpErrorResponse) => {
            this.ShowAlertNoRecord();
            this.preloader.setShowPreloader(false);
        });
    }

    InitialDataByLogin() {
        // this.OFFICE_LIST.filter(f => f.OFFICE_CODE == localStorage.getItem('officeCode')).map(m => {
        //     this.RECEIVE_OFFICE_MODEL = m;
        // });
        this.officeShortName = localStorage.getItem('officeShortName');
    }

    // Change => V18: 2020-02-25
    // clickNew = () => this._router.navigate([`/prove/manage/C/1/0/0`]);

    clickView(PROVE_TYPE: string, LAWSUIT_ID: string, PROVE_ID: string, INDICTMENT_ID: string) {
        if (PROVE_ID == "" || PROVE_ID == undefined) {
            PROVE_ID = "0";
        }

        if (PROVE_TYPE == "" || PROVE_TYPE == undefined) {
            PROVE_TYPE = "0";
        }

        if (PROVE_ID == "0")
            this._router.navigate([`/prove/manage/C/${PROVE_TYPE}/${PROVE_ID}/${LAWSUIT_ID}/${INDICTMENT_ID}`]);
        else
            this._router.navigate([`/prove/manage/R/${PROVE_TYPE}/${PROVE_ID}/${LAWSUIT_ID}/${INDICTMENT_ID}`]);
    }

    clickSearch(Textsearch: any) {
        this.preloader.setShowPreloader(true);

        var paramsOther = {
            ...Textsearch,
            ACCOUNT_OFFICE_CODE: localStorage.getItem("officeCode")
        }

        this.setDefualtInputSearch(1);

        this.proveService.getByKeyword(paramsOther).then(list => {
            this.onSearchComplete(list)
        }, (err: HttpErrorResponse) => {
            this.ShowAlertNoRecord();
            //alert(Message.noRecord);
            this.ListProve = [];
            this.preloader.setShowPreloader(false);
        });
    }

    setAdvSearch() {
        this.advSearch.next(!this.advSearch.getValue());
    }

    async onAdvSearch(form: any) {
        if (!form.value.OCCURRENCE_DATE_FROM && form.value.OCCURRENCE_DATE_TO) {
            this.TEMP_OCCURRENCE_DATE_FROM = setDateMyDatepicker(form.value.OCCURRENCE_DATE_TO);
            form.value.OCCURRENCE_DATE_FROM = form.value.OCCURRENCE_DATE_TO;

            this.onSArrestDateChange(form.value.OCCURRENCE_DATE_FROM);

        } else if (form.value.OCCURRENCE_DATE_FROM && !form.value.OCCURRENCE_DATE_TO) {
            const currDate = setDateMyDatepicker(new Date());
            this.TEMP_OCCURRENCE_DATE_TO = setDateMyDatepicker(currDate);
            form.value.OCCURRENCE_DATE_TO = this.TEMP_OCCURRENCE_DATE_TO

            this.onEArrestDateChange(form.value.OCCURRENCE_DATE_TO);
        }

        if (!form.value.PROVE_DATE_FROM && form.value.PROVE_DATE_TO) {
            this.TEMP_PROVE_DATE_FROM = setDateMyDatepicker(form.value.PROVE_DATE_TO);
            form.value.PROVE_DATE_FROM = form.value.PROVE_DATE_TO;

            this.onSProveDateChange(form.value.PROVE_DATE_FROM);

        } else if (form.value.PROVE_DATE_FROM && !form.value.PROVE_DATE_TO) {
            const currDate = setDateMyDatepicker(new Date());
            this.TEMP_PROVE_DATE_TO = setDateMyDatepicker(currDate);
            form.value.PROVE_DATE_TO = this.TEMP_PROVE_DATE_TO

            this.onEProveDateChange(form.value.PROVE_DATE_TO);
        }

        if (!form.value.LAWSUIT_DATE_FROM && form.value.LAWSUIT_DATE_TO) {
            this.TEMP_LAWSUIT_DATE_FROM = setDateMyDatepicker(form.value.LAWSUIT_DATE_TO);
            form.value.LAWSUIT_DATE_FROM = form.value.LAWSUIT_DATE_TO;

            this.onSDeliveryDateChange(form.value.LAWSUIT_DATE_FROM);

        } else if (form.value.LAWSUIT_DATE_FROM && !form.value.LAWSUIT_DATE_TO) {
            const currDate = setDateMyDatepicker(new Date());
            this.TEMP_LAWSUIT_DATE_TO = setDateMyDatepicker(currDate);
            form.value.LAWSUIT_DATE_TO = this.TEMP_LAWSUIT_DATE_TO;

            this.onEDeliveryDateChange(form.value.LAWSUIT_DATE_TO);
        }

        let sDate, eDate, sDateDelivery, eDateDelivery, sDateProve, eDateProve, sDatelsw, eDatelsw;

        if (form.value.OCCURRENCE_DATE_FROM) {
            sDate = form.value.OCCURRENCE_DATE_FROM.date;

            if (sDate != undefined) {
                form.value.OCCURRENCE_DATE_FROM = `${sDate.year}-${("00" + sDate.month).slice(-2)}-${("00" + sDate.day).slice(-2)}`;
            }

            if (!form.value.OCCURRENCE_DATE_TO) {
                this.OCCURRENCE_DATE_TO = setDateMyDatepicker(new Date(this.getCurrentDate()));
            }
        }

        if (form.value.OCCURRENCE_DATE_TO) {
            eDate = form.value.OCCURRENCE_DATE_TO.date;

            if (sDate != undefined) {
                form.value.OCCURRENCE_DATE_TO = `${eDate.year}-${("00" + eDate.month).slice(-2)}-${("00" + eDate.day).slice(-2)}`;
            }
        }

        if (form.value.PROVE_DATE_FROM) {
            sDate = form.value.PROVE_DATE_FROM.date;

            if (sDate != undefined) {
                form.value.PROVE_DATE_FROM = `${sDate.year}-${("00" + sDate.month).slice(-2)}-${("00" + sDate.day).slice(-2)}`;
            }

            if (!form.value.PROVE_DATE_TO) {
                this.PROVE_DATE_TO = setDateMyDatepicker(new Date(this.getCurrentDate()));
            }
        }

        if (form.value.PROVE_DATE_TO) {
            eDate = form.value.PROVE_DATE_TO.date;

            if (sDate != undefined) {
                form.value.PROVE_DATE_TO = `${eDate.year}-${("00" + eDate.month).slice(-2)}-${("00" + eDate.day).slice(-2)}`;
            }
        }

        if (form.value.LAWSUIT_DATE_FROM) {
            sDate = form.value.LAWSUIT_DATE_FROM.date;

            if (sDate != undefined) {
                form.value.LAWSUIT_DATE_FROM = `${sDate.year}-${("00" + sDate.month).slice(-2)}-${("00" + sDate.day).slice(-2)}`;
            }

            if (!form.value.LAWSUIT_DATE_TO) {
                this.LAWSUIT_DATE_TO = setDateMyDatepicker(new Date(this.getCurrentDate()));
            }
        }

        if (form.value.LAWSUIT_DATE_TO) {
            eDate = form.value.LAWSUIT_DATE_TO.date;

            if (sDate != undefined) {
                form.value.LAWSUIT_DATE_TO = `${eDate.year}-${("00" + eDate.month).slice(-2)}-${("00" + eDate.day).slice(-2)}`;
            }
        }

        form.value.ACCOUNT_OFFICE_CODE = localStorage.getItem("officeCode");

        // if (this.PROVE_STATUS != "")
        //     form.value.RECEIVE_OFFICE_NAME = "";
        // else {
        if (this.RECEIVE_OFFICE_MODEL != undefined && this.RECEIVE_OFFICE_MODEL != null && this.RECEIVE_OFFICE_MODEL != "") {
            if (this.RECEIVE_OFFICE_MODEL.OFFICE_SHORT_NAME)
                form.value.RECEIVE_OFFICE_NAME = this.RECEIVE_OFFICE_MODEL.OFFICE_SHORT_NAME;
            else
                form.value.RECEIVE_OFFICE_NAME = this.RECEIVE_OFFICE_MODEL;

            console.log(form.value.RECEIVE_OFFICE_NAME);
        }

        // else
        //     form.value.RECEIVE_OFFICE_NAME = this.officeShortName;
        //}


        if (this.PROVE_STATUS == "0") {
            form.value.PROVE_NO = "";
            //form.value.PROVE_NO_YEAR = "";
        }

        this.setDefualtInputSearch(0);

        this.preloader.setShowPreloader(true);

        await this.proveService.getByConAdv(form.value).then(async list => {
            this.onSearchComplete(list);
            this.preloader.setShowPreloader(false);
        }, (err: HttpErrorResponse) => {
            this.ShowAlertNoRecord();
            this.preloader.setShowPreloader(false);
        });
    }

    ShowAlertNoRecord() {
        swal({
            title: '',
            text: Message.noRecord,
            type: 'warning',
            confirmButtonText: 'ตกลง'
        });
    }

    async onSearchComplete(list: any) {
        this.Prove = [];

        // console.log(list);

        if (!list.length) {
            this.ShowAlertNoRecord();
            this.ListProve = [];
            this.preloader.setShowPreloader(false);

            return false;
        }

        await list.map((item) => {
            item.PROVE_TYPE_NAME = `${item.PROVE_TYPE == 0 ? 'พิสูจน์ให้หน่วยงานภายใน' : 'พิสูจน์ให้หน่วยงานภายนอก'}`;
            item.PROVE_STATUS = `${item.PROVE_ID == 0 ? 'ยังไม่ได้พิสูจน์' : 'พิสูจน์แล้ว'}`;
            item.LAWSUIT_IS_OUTSIDE_NAME = `${item.LAWSUIT_IS_OUTSIDE == 0 ? 'คดีในสถานที่ทำการ' : 'คดีนอกสถานที่ทำการ'}`;
            item.FULL_PROVE_NO = `${item.IS_OUTSIDE == "1" ? "น. " : ""}` + this.MappingNullData(item.PROVE_NO);
            item.FULL_LAWSUIT_NO = `${item.LAWSUIT_IS_OUTSIDE == "1" ? "น. " : ""}` + this.MappingNullData(item.LAWSUILT_NO);

            // item.FULL_PROVE_NO = this.MappingNullData(item.PROVE_NO) + "/" + this.MappingNullData(toLocalYear(item.PROVE_NO_YEAR));
            // item.FULL_PROVE_NO = `${item.FULL_PROVE_NO == "/" ? "" : item.FULL_PROVE_NO}`;
            // item.FULL_LAWSUIT_NO = this.MappingNullData(item.LAWSUIT_NO) + "/" + this.MappingNullData(toLocalYear(item.LAWSUIT_NO_YEAR));
            // item.FULL_LAWSUIT_NO = `${item.FULL_LAWSUIT_NO == "/" ? "" : item.FULL_LAWSUIT_NO}`;

            item.RECEIVE_OFFICE_NAME = this.MappingNullData(item.RECEIVE_OFFICE_NAME);
            item.PROVE_STAFF_NAME = this.MappingNullData(item.PROVE_STAFF_NAME);
            item.ARREST_STAFF_NAME = this.MappingNullData(item.ARREST_STAFF_NAME);

            item.ARREST_OFFICE_NAME = this.MappingNullData(item.ARREST_OFFICE_NAME);
            item.SECTION_NAME = this.MappingNullData(item.SECTION_NAME);
            item.GUILTBASE_NAME = this.MappingNullData(item.GUILTBASE_NAME);

            item.LAWSUIT_DATE = this.MappingNullData(item.LAWSUIT_DATE);
            item.LAWSUIT_OFFICE_NAME = this.MappingNullData(item.LAWSUIT_OFFICE_NAME);
            item.LAWSUIT_STAFF_NAME = this.MappingNullData(item.LAWSUIT_STAFF_NAME);
            item.PROVE_STATUS = this.MappingNullData(item.PROVE_STATUS);

            if (item.LAWSUIT_TYPE == 0)
                item.LAWSUIT_TYPE_NAME = "ส่งฟ้องศาล";
            else if (item.LAWSUIT_TYPE == 1)
                item.LAWSUIT_TYPE_NAME = "เปรียบเทียบปรับ";
            else if (item.LAWSUIT_TYPE == 2)
                item.LAWSUIT_TYPE_NAME = "ส่งพนักงานสอบสวน";

            this.preloader.setShowPreloader(false);
        })

        if (Array.isArray(list)) {
            this.Prove = list;
        } else {
            this.Prove.push(list);
        }

        // set total record
        this.Prove.sort((a, b) => b.ARREST_DATE.localeCompare(a.ARREST_DATE));

        this.Prove.sort((a, b) => {
            let aArrestDate = a.ARREST_DATE;
            let bArrestDate = b.ARREST_DATE;
            let aArrestCode = a.ARREST_CODE;
            let bArrestCode = b.ARREST_CODE;

            if (aArrestDate == bArrestDate) {
                return (aArrestCode > bArrestCode) ? -1 : (aArrestCode < bArrestCode) ? 1 : 0;
            }
            else {
                return (aArrestDate > aArrestDate) ? -1 : 1;
            }
        });

        this.paginage.TotalItems = this.Prove.length;
        this.ListProve = this.Prove.slice(0, this.paginage.RowsPerPageOptions[0]);
    }

    async pageChanges(event) {
        this.ListProve = await this.Prove.slice(event.startIndex - 1, event.endIndex);
    }

    getCurrentDate() {
        let date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).toISOString().substring(0, 10);
    }

    onSDeliveryDateChange(event: IMyDateModel) {
        if (event.jsdate) {
            var d = new Date(event.jsdate);
            d.setDate(d.getDate() - 1);
            this.dateToOption = {
                disableDateRanges: [{
                    begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
                    end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() },
                }, this.getDisCurrDateMyDatePicker()]
            }
        } else {
            this.dateToOption = {
                disableDateRanges: [this.getDisCurrDateMyDatePicker()]
            }
        }
    }

    onEDeliveryDateChange(event: IMyDateModel) {
        if (event.jsdate) {
            var d = new Date(event.jsdate);
            this.dateFromOption = {
                disableDateRanges: [{
                    begin: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 },
                    end: { year: d.getFullYear() + 100, month: d.getMonth() + 1, day: d.getDate() },
                }]
            }
        } else {
            this.dateFromOption = {
                disableDateRanges: [this.getDisCurrDateMyDatePicker()]
            }
        }
    }

    onSProveDateChange(event: IMyDateModel) {
        if (event.jsdate) {
            var d = new Date(event.jsdate);
            d.setDate(d.getDate() - 1);
            this.dateToProveOption = {
                disableDateRanges: [{
                    begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
                    end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() },
                }, this.getDisCurrDateMyDatePicker()]
            }
        } else {
            this.dateToProveOption = {
                disableDateRanges: [this.getDisCurrDateMyDatePicker()]
            }
        }
    }

    onEProveDateChange(event: IMyDateModel) {
        if (event.jsdate) {
            var d = new Date(event.jsdate);
            this.dateFromProveOption = {
                disableDateRanges: [{
                    begin: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 },
                    end: { year: d.getFullYear() + 100, month: d.getMonth() + 1, day: d.getDate() },
                }]
            }
        } else {
            this.dateFromProveOption = {
                disableDateRanges: [this.getDisCurrDateMyDatePicker()]
            }
        }
    }

    onSArrestDateChange(event: IMyDateModel) {
        if (event.jsdate) {
            var d = new Date(event.jsdate);
            d.setDate(d.getDate() - 1);
            this.dateToArrestOption = {
                disableDateRanges: [{
                    begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
                    end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() },
                }, this.getDisCurrDateMyDatePicker()]
            }
        } else {
            this.dateToArrestOption = {
                disableDateRanges: [this.getDisCurrDateMyDatePicker()]
            }
        }
    }

    onEArrestDateChange(event: IMyDateModel) {
        if (event.jsdate) {
            var d = new Date(event.jsdate);
            this.dateFromArrestOption = {
                disableDateRanges: [{
                    begin: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() + 1 },
                    end: { year: d.getFullYear() + 100, month: d.getMonth() + 1, day: d.getDate() },
                }]
            }
        } else {
            this.dateFromArrestOption = {
                disableDateRanges: [this.getDisCurrDateMyDatePicker()]
            }
        }
    }

    MappingNullData(str: string) {
        return `${str == 'null' || str == null ? '' : str}`
    }

    Sorter(event: BehaviorSubject<Boolean>, type: string): void {
        if (event.getValue()) event.next(false); else event.next(true);

        switch (type) {
            case 'TN':
                if (event.getValue())
                    this.Prove.sort((a, b) => {
                        return <number>parseInt(b.ARREST_CODE.substring(2))
                            - <number>parseInt(a.ARREST_CODE.substring(2));
                    });
                else
                    this.Prove.sort((a, b) => {
                        return <number>parseInt(a.ARREST_CODE.substring(2))
                            - <number>parseInt(b.ARREST_CODE.substring(2));
                    });
                break;
            case 'TIME':
                if (event.getValue())
                    this.Prove.sort((a, b) => b.ARREST_DATE.localeCompare(a.ARREST_DATE))
                else
                    this.Prove.sort((a, b) => a.ARREST_DATE.localeCompare(b.ARREST_DATE));
                break;
            case 'LSN':
                if (event.getValue())
                    this.Prove.sort((a, b) => b.FULL_LAWSUIT_NO.localeCompare(a.FULL_LAWSUIT_NO));
                else
                    this.Prove.sort((a, b) => a.FULL_LAWSUIT_NO.localeCompare(b.FULL_LAWSUIT_NO));
                break;
            case 'LSD':
                if (event.getValue())
                    this.Prove.sort((a, b) => b.LAWSUIT_DATE.localeCompare(a.LAWSUIT_DATE));
                else
                    this.Prove.sort((a, b) => a.LAWSUIT_DATE.localeCompare(b.LAWSUIT_DATE));
                break;
            case 'FPN':
                if (event.getValue())
                    this.Prove.sort((a, b) => b.FULL_PROVE_NO.localeCompare(a.FULL_PROVE_NO));
                else
                    this.Prove.sort((a, b) => a.FULL_PROVE_NO.localeCompare(b.FULL_PROVE_NO));
                break;
            case 'RD':
                if (event.getValue())
                    this.Prove.sort((a, b) => b.RECEIVE_DOC_DATE.localeCompare(a.RECEIVE_DOC_DATE));
                else
                    this.Prove.sort((a, b) => a.RECEIVE_DOC_DATE.localeCompare(b.RECEIVE_DOC_DATE));
                break;
            default:
                break;
        }

        this.ListProve = this.Prove.slice(0, this.paginage.RowsPerPageOptions[0]);
    }

    setDateStruct(date) {
        if (date) {
            const months = this.I18N_VALUES.months;
            const temp = date = new Date(date);
            const CompDate = `${temp.getDate()} ${months[temp.getMonth()]} ${temp.getUTCFullYear() + 543}`;
            return CompDate;
        } else return null;
    }

    getDisCurrDateMyDatePicker() {
        let currentdate = new Date();
        const disCurrDate = {
            begin: { year: currentdate.getFullYear(), month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 },
            end: { year: currentdate.getFullYear() + 100, month: currentdate.getMonth() + 1, day: currentdate.getDate() },
        }
        return disCurrDate;
    }
    // ****************************************************
    // ------------------ ค้นหา สถานที่พิสูจน์ -----------------
    // ****************************************************
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

    public canOfficeSearch(): boolean {
        const OFFICE_CODE_SLICE = localStorage.getItem("officeCode").slice(0, 2);
        return OFFICE_CODE_SLICE == '00' ? false : true;
        // return false;
    }
    //#endregion

    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }


    setDefualtInputSearch(type: number) {
        switch (type) {
            case 0:
                this.TEMP_TEXT_SEARCH = '';
                break;
            case 1:
                this.TEMP_ARREST_CODE = '';
                this.TEMP_OCCURRENCE_DATE_FROM = '';
                this.TEMP_OCCURRENCE_DATE_TO = '';
                this.TEMP_ARREST_STAFF_NAME = '';
                this.TEMP_LAWBREAKER_STAFF_NAME = '';
                this.TEMP_LAWSUIT_TYPE = '';
                this.TEMP_SECTION_NAME = '';
                this.TEMP_GUILTBASE_NAME = '';
                this.TEMP_ARREST_OFFICE_NAME = '';
                this.TEMP_LAWSUIT_NO = '';
                this.TEMP_LAWSUIT_NO_YEAR = '';
                this.TEMP_LAWSUIT_IS_OUTSIDE = '';
                this.TEMP_LAWSUIT_DATE_FROM = '';
                this.TEMP_LAWSUIT_DATE_TO = '';
                this.TEMP_LAWSUIT_STAFF_NAME = '';
                this.TEMP_PROVE_NO = '';
                this.TEMP_PROVE_NO_YEAR = '';
                this.TEMP_PROVE_DATE_FROM = '';
                this.TEMP_PROVE_DATE_TO = '';
                this.TEMP_PROVE_STAFF_NAME = '';
                this.TEMP_PROVE_IS_OUTSIDE = '';
                this.PROVE_STATUS = '';
                this.RECEIVE_OFFICE_MODEL = '';

                this.dateToArrestOption = {
                    disableDateRanges: [this.getDisCurrDateMyDatePicker()]
                }

                this.dateToOption = {
                    disableDateRanges: [this.getDisCurrDateMyDatePicker()]
                }

                this.dateToProveOption = {
                    disableDateRanges: [this.getDisCurrDateMyDatePicker()]
                }
                break;
            default:
                break;
        }
    }

}
