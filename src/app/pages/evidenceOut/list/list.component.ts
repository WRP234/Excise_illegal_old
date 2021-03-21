import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Routes } from '@angular/router';
import { NavigationService } from '../../../shared/header-navigation/navigation.service';
import { EvidenceOutService } from '../evidenceOut.service';
import { HttpErrorResponse } from '@angular/common/http';
import { pagination } from '../../../config/pagination';
import { Message } from '../../../config/message';
import { toLocalShort, compareDate, setZeroHours, getDateMyDatepicker, convertDateForSave, setDateMyDatepicker } from '../../../config/dateFormat';
import { IMyDateModel, IMyOptions } from 'mydatepicker-th';
import { SidebarService } from '../../../shared/sidebar/sidebar.component';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import { evidenceOutHelpers } from '../evidenceOut.helper';
import swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ["./list.component.scss"]
})

export class ListComponent extends evidenceOutHelpers implements OnInit {
    private sub: any;
    evitype: any;

    advSearch: any;
    evidenceOut = new Array<any>();
    EvidenceOutList = new Array<any>();
    paginage = pagination;
    DateStartTo: any;
    _dateEviStartFrom: any;
    _dateEviStartTo: any;
    _dateEviNoStartFrom: any;
    _dateEviNoStartTo: any;

    StatusOption = [];
    options = [];
    rawOptions = [];
    lsData = [];

    RevenueStatus: string;
    EvidenceOutType: string;
    EvidenceOutTypeSelected: string = '';
    EvidenceOutCode: string;
    EvidenceOutDateStart: any;
    EvidenceOutDateTo: any;
    EvidenceOutNo: string;
    EvidenceOutNoDateStart: any;
    EvidenceOutNoDateTo: any;
    StaffName: string;
    OfficeName: string;

    private subOnSearch: any;
    private subSetNextPage: any;

    modal: any;

    // ----- Model ------ //
    @ViewChild('EvidenceTypeModel') evidenceTypeModel: ElementRef;

    constructor(
        private activeRoute: ActivatedRoute,

        private _router: Router,
        private navService: NavigationService,
        private sidebarService: SidebarService,
        private EvidenceService: EvidenceOutService,
        private preloader: PreloaderService,
        private ngbModel: NgbModal
    ) {
        super();
        this.advSearch = this.navService.showAdvSearch;
    }

    async ngOnInit() {
        this.sidebarService.setVersion('evidenceOut II 0.0.0.1');
        this.RevenueStatus = "";
        this.EvidenceOutList = [];
        this.active_Route();
    }


    private active_Route() {
        this.sub = this.activeRoute.params.subscribe(p => {
            this.evitype = p['type'];

            this.activeRoute.data.subscribe(
                (data) => {
                    switch (this.evitype) {
                        case '11':
                            data.urls[1].title = "ค้นหารายการคืนของกลาง";
                            data.codePage = "ILG60-11-01-00-00";
                            this.EvidenceOutType = "0";
                            break;
                        case '12':
                            data.urls[1].title = "ค้นหารายการจัดเก็บเข้าพิพิธภัณฑ์";
                            data.codePage = "ILG60_O_11_06_01_00";
                            this.EvidenceOutType = "5";
                            break;
                        case '13':
                            data.urls[1].title = "ค้นหารายการขายทอดตลาด";
                            data.codePage = "ILG60_O_11_04_01_00";
                            this.EvidenceOutType = "3";
                            break;
                        case '14':
                            data.urls[1].title = "ค้นหารายการทำลายของกลาง";
                            data.codePage = "ILG60_O_11_03_01_00";
                            this.EvidenceOutType = "2";
                            break;
                        case '15':
                            data.urls[1].title = "ค้นหารายการนำของกลางออกจากคลัง";
                            data.codePage = "ILG60_O_11_05_01_00";
                            this.EvidenceOutType = "6";
                            break;
                        // case '16':
                        //     data.urls[1].title = "ค้นหารายการโอนย้ายของกลาง";
                        //     data.codePage = "ILG60-16-01-00-00";
                        //     this.EvidenceOutType = "8";
                        //     break;
                    }

                }
            );

            this.EvidenceOutList = [];
        });
    }

    clickView(EvidenceOutID: string, EvidenceOutType: string) {
        // if (this.evitype == "11") {
        //     if (EvidenceOutType == "0")
        //         this._router.navigate(['/evidenceOut/manage', '11I', 'R', EvidenceOutID]);
        //     else if (EvidenceOutType == "1")
        //         this._router.navigate(['/evidenceOut/manage', "11E", 'R', EvidenceOutID]);

        // } else
        if (this.evitype == "15") {
            if (EvidenceOutType == "6")
                this._router.navigate(['/evidenceOut/manage', "15G", 'R', EvidenceOutID]);
            else if (EvidenceOutType == "7")
                this._router.navigate(['/evidenceOut/manage', "15D", 'R', EvidenceOutID]);

        } else {
            this._router.navigate(['/evidenceOut/manage', this.evitype, 'R', EvidenceOutID]);
        }

    }

    clickNew() {
        // if (this.evitype == "11") {
        //     this.modal = this.ngbModel.open(this.evidenceTypeModel, { size: 'lg', centered: true });
        // } else
        if (this.evitype == '15') {
            this.modal = this.ngbModel.open(this.evidenceTypeModel, { size: 'lg', centered: true });
        } else {
            this._router.navigate(['/evidenceOut/manage', this.evitype, 'C', 'NEW']);
        }
    }

    async clickKeywordSearch(Textsearch: any) {
        this.preloader.setShowPreloader(true);

        this.lsData = [];
        // if (this.evitype == "11") {
        //     await this.getByKeyword(Textsearch, ["0", "1"]);

        // } else 
        if (this.evitype == "15") {
            await this.getByKeyword(Textsearch, ["6", "7"]);

        } else {
            await this.getByKeyword(Textsearch, [this.EvidenceOutType]);
        }

        this.onSearchComplete(this.lsData)
        this.preloader.setShowPreloader(false);
    }

    async clickAdvSearch() {
        this.preloader.setShowPreloader(true);

        this.lsData = [];
        // if (this.evitype == "11") {
        //     const e = this.EvidenceOutTypeSelected ? this.EvidenceOutTypeSelected : `${'0' + ',' + '1'}`;
        //     await this.GetAdvSearch(e);

        // } else 
        if (this.evitype == "15") {
            const e = this.EvidenceOutTypeSelected ? this.EvidenceOutTypeSelected : `${'6' + ',' + '7'}`;
            await this.GetAdvSearch(e);

        } else {
            await this.GetAdvSearch(this.EvidenceOutType);
        }

        this.onSearchComplete(this.lsData)
        this.preloader.setShowPreloader(false);
    }

    async getByKeyword(p: any, pOutType: any[]) {
        var paramsOther = {
            ...p,
            EVIDENCE_OUT_TYPE: pOutType,
            OPERATION_OFFICE_CODE: localStorage.getItem("officeCode")
        }

        await this.EvidenceService.getByKeyword(paramsOther).then(async list => {
            list.map(f => {
                this.lsData.push(f);
            })
        });
    }

    async GetAdvSearch(pOutType: any) {

        let sDate, eDate, sFullDate, eFullDate;
        // วันที่คืน/วันที่ขาย/วันที่ทำลาย/วันที่นำออก/วันที่โอนย้าย/วันที่จัดเก็บพิพิธภัณฑ์ เริ่มต้น
        // if (this.EvidenceOutDateStart) {
        //     sDate = this.EvidenceOutDateStart.date;

        //     if (sDate != undefined) {
        //         sFullDate = new Date(`${sDate.year}-${sDate.month}-${sDate.day}`);
        //         this.EvidenceOutDateStart = setZeroHours(sFullDate);
        //     }
        // } else {
        //     this.EvidenceOutDateStart = null;
        // }
        // // วันที่คืน/วันที่ขาย/วันที่ทำลาย/วันที่นำออก/วันที่โอนย้าย/วันที่จัดเก็บพิพิธภัณฑ์ สิ้นสุด
        // if (this.EvidenceOutDateTo) {
        //     eDate = this.EvidenceOutDateTo.date;

        //     if (sDate != undefined) {
        //         eFullDate = new Date(`${eDate.year}-${eDate.month}-${eDate.day}`);
        //         this.EvidenceOutDateTo = setZeroHours(eFullDate);
        //     }
        // } else {
        //     this.EvidenceOutDateTo = null;
        // }

        //NEW
        // if (!this.EvidenceOutDateStart && this.EvidenceOutDateTo) {
        //     this.EvidenceOutDateStart = setDateMyDatepicker(this.EvidenceOutDateTo);

        //     var d = new Date(getDateMyDatepicker(this.EvidenceOutDateStart));
        //     // this.myDatePickerOptions = {
        //     //     disableDateRanges: [{
        //     //         begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
        //     //         end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() - 1 }
        //     //     }, this.getDisCurrDateMyDatePicker()]
        //     // }
        // } else if (this.EvidenceOutDateStart && !this.EvidenceOutDateTo) {
        //     const currDate = setDateMyDatepicker(new Date());
        //     this.EvidenceOutDateTo = setDateMyDatepicker(currDate);
        // }
        //END NEW

        // วันที่ขอคืน/วันที่อนุมัติ เริ่มต้น
        // if (this.EvidenceOutNoDateStart) {
        //     sDate = this.EvidenceOutNoDateStart.date;

        //     if (sDate != undefined) {
        //         sFullDate = new Date(`${sDate.year}-${sDate.month}-${sDate.day}`);
        //         this.EvidenceOutNoDateStart = setZeroHours(sFullDate);
        //     }
        // } else {
        //     this.EvidenceOutNoDateStart = null;
        // }
        // // วันที่ขอคืน/วันที่อนุมัติ สิ้นสุด
        // if (this.EvidenceOutNoDateTo) {
        //     eDate = this.EvidenceOutNoDateTo.date;

        //     if (sDate != undefined) {
        //         eFullDate = new Date(`${eDate.year}-${eDate.month}-${eDate.day}`);
        //         this.EvidenceOutNoDateTo = setZeroHours(eFullDate);
        //     }
        // } else {
        //     this.EvidenceOutNoDateTo = null;
        // }

        //NEW
        // if (!this.EvidenceOutNoDateStart && this.EvidenceOutNoDateTo) {
        //     this.EvidenceOutNoDateStart = setDateMyDatepicker(this.EvidenceOutNoDateTo);

        //     var d = new Date(getDateMyDatepicker(this.EvidenceOutNoDateStart));
        //     // this.myDatePickerOptions = {
        //     //     disableDateRanges: [{
        //     //         begin: { year: d.getFullYear() - 100, month: d.getMonth() + 1, day: d.getDate() },
        //     //         end: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() - 1 }
        //     //     }, this.getDisCurrDateMyDatePicker()]
        //     // }
        // } else if (this.EvidenceOutNoDateStart && !this.EvidenceOutNoDateTo) {
        //     const currDate = setDateMyDatepicker(new Date());
        //     this.EvidenceOutNoDateTo = setDateMyDatepicker(currDate);
        // }
        //END NEW
        let sdate = getDateMyDatepicker(this.EvidenceOutDateStart);
        this.EvidenceOutDateStart = convertDateForSave(sdate) || '';

        let edate = getDateMyDatepicker(this.EvidenceOutDateTo);
        this.EvidenceOutDateTo = convertDateForSave(edate) || convertDateForSave(new Date());

        let onSdate = getDateMyDatepicker(this.EvidenceOutNoDateStart);
        this.EvidenceOutNoDateStart = convertDateForSave(onSdate) || '';

        let onEdate = getDateMyDatepicker(this.EvidenceOutNoDateTo);
        this.EvidenceOutNoDateTo = convertDateForSave(onEdate) || convertDateForSave(new Date());

        let oEvidenceOut = {
            EVIDENCE_OUT_CODE: this.EvidenceOutCode,
            EVIDENCE_OUT_DATE_FROM: this.EvidenceOutDateStart,
            EVIDENCE_OUT_DATE_TO: this.EvidenceOutDateTo,
            EVIDENCE_OUT_NO: this.EvidenceOutNo,
            EVIDENCE_OUT_NO_DATE_FROM: this.EvidenceOutNoDateStart,
            EVIDENCE_OUT_NO_DATE_TO: this.EvidenceOutNoDateTo,
            STAFF_NAME: this.StaffName,
            STAFF_OFFICE_NAME: this.OfficeName,
            EVIDENCE_OUT_TYPE: [pOutType],
            OPERATION_OFFICE_CODE: localStorage.getItem("officeCode")
        }


        await this.EvidenceService.getByConAdv(oEvidenceOut).then(async list => {
            list.map(f => {
                this.lsData.push(f);
            })
        }, (err: HttpErrorResponse) => {
            swal('', err.message, 'error');
            this.preloader.setShowPreloader(false);
        });
    }

    async onSearchComplete(list: any) {
        console.log('onSearchComplete : ', list)
        this.evidenceOut = [];

        if (!list.length) {
            this.ShowAlertNoRecord();
            this.EvidenceOutList = [];
            return false;
        }

        if (Array.isArray(list)) {
            this.evidenceOut = list;
        } else {
            this.evidenceOut.push(list);
        }

        // set for 'null'
        this.evidenceOut = this.evidenceOut.map(l => {
            l.EvidenceOutStaff.map(m => {
                for (var key in m)
                    if (m[key] === 'null') m[key] = null;
            });
            return l;
        });

        //sort date
        this.evidenceOut = this.DateSorter(this.evidenceOut);

        // set total record
        this.paginage.TotalItems = this.evidenceOut.length;
        this.EvidenceOutList = this.evidenceOut.slice(0, this.paginage.RowsPerPageOptions[0]);
    }

    async pageChanges(event) {
        this.EvidenceOutList = await this.evidenceOut.slice(event.startIndex - 1, event.endIndex);
    }

    // ----- Validate วันที่คืน/วันที่ขาย/วันที่ทำลาย/วันที่นำออก/วันที่โอนย้าย/วันที่จัดเก็บพิพิธภัณฑ์ -----
    onSEviDateChange(event: IMyDateModel) {
        this._dateEviStartFrom = event.date;
        this.checkDateEvidence();
    }

    onEEviDateChange(event: IMyDateModel) {
        this._dateEviStartTo = event.date;
        this.checkDateEvidence();
    }

    checkDateEvidence() {
        if (this._dateEviStartFrom && this._dateEviStartTo) {
            let sdate = `${this._dateEviStartFrom.year}-${this._dateEviStartFrom.month}-${this._dateEviStartTo.day}`;
            let edate = `${this._dateEviStartFrom.year}-${this._dateEviStartFrom.month}-${this._dateEviStartTo.day}`;

            if (!compareDate(new Date(sdate), new Date(edate))) {
                swal('', Message.checkDate, 'warning');
                setTimeout(() => {
                    this.EvidenceOutDateTo = { date: this._dateEviStartFrom };
                }, 0);
            }
        }
    }

    // ----- Validate วันที่ขอคืน/วันที่อนุมัติ -----
    onSEviNoDateChange(event: IMyDateModel) {
        this._dateEviNoStartFrom = event.date;
        this.checkDateEvidenceNo();
    }

    onEEviNoDateChange(event: IMyDateModel) {
        this._dateEviNoStartFrom = event.date;
        this.checkDateEvidenceNo();
    }

    checkDateEvidenceNo() {
        if (this._dateEviNoStartFrom && this._dateEviNoStartTo) {
            let sdate = `${this._dateEviNoStartFrom.year}-${this._dateEviNoStartFrom.month}-${this._dateEviNoStartFrom.day}`;
            let edate = `${this._dateEviNoStartTo.year}-${this._dateEviNoStartTo.month}-${this._dateEviNoStartTo.day}`;

            if (!compareDate(new Date(sdate), new Date(edate))) {
                swal('', Message.checkDate, 'warning');
                setTimeout(() => {
                    this.EvidenceOutDateTo = { date: this._dateEviNoStartFrom };
                }, 0);
            }
        }
    }

    getEvidenceTypeName(evidenceOut_type: any) {
        const e = this.outTypeSelect.find(f => f.value == evidenceOut_type);
        return e ? e.text : '';
    }

    setAdvSearch() {
        this.advSearch.next(!this.advSearch.getValue());
    }

    ShowAlertNoRecord() {
        swal({
            title: '',
            text: Message.noRecord,
            type: 'warning',
            confirmButtonText: 'ตกลง'
        });
    }
}
