import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from '../../../shared/header-navigation/navigation.service';
import { EvidenceService } from '../evidenceIn.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Evidence_In } from '../evidenceIn';
import { pagination } from '../../../config/pagination';
import { Message } from '../../../config/message';
import { toLocalShort, compareDate, setZeroHours } from '../../../config/dateFormat';
import { IMyDateModel, IMyOptions } from 'mydatepicker-th';
import { SidebarService } from '../../../shared/sidebar/sidebar.component';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import { MatAutocomplete } from '@angular/material';
import swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {

    advSearch: any;
    evidenceIn = new Array<Evidence_In>();
    EvidenceInList = new Array<Evidence_In>();
    paginage = pagination;
    EvidenceInDateTo: any;
    DeliveryDateTo: any;
    _dateRecvStartFrom: any;
    _dateRecvStartTo: any;
    _dateSendStartFrom: any;
    _dateSendStartTo: any;

    StatusOption = [];
    options = [];
    rawOptions = [];
    RevenueStatus: string;

    private subOnSearch: any;
    private subSetNextPage: any;

    modal: any;

    // ----- Model ------ //
    @ViewChild('EvidenceTypeModel') evidenceTypeModel: ElementRef;

    constructor(
        private _router: Router,
        private navService: NavigationService,
        private sidebarService: SidebarService,
        private edidenceService: EvidenceService,
        private preloader: PreloaderService,
        private ngbModel: NgbModal
    ) {
        this.advSearch = this.navService.showAdvSearch;
    }

    async ngOnInit() {
        this.sidebarService.setVersion('evidenceIn II 0.0.0.1');
        this.RevenueStatus = "";
    }

    clickView(EVIDENCE_IN_ID: string, EVIDENCE_IN_TYPE: number, PROVE_ID: string) {
        switch(EVIDENCE_IN_TYPE){
            case 0 : this._router.navigate([`/evidenceIn/manage/I/R/${EVIDENCE_IN_ID}/${PROVE_ID}`]); break;
            case 1 : this._router.navigate([`/evidenceIn/manage/E/R/${EVIDENCE_IN_ID}/${PROVE_ID}`]); break;
            case 2 : this._router.navigate([`/evidenceIn/manage/G/R/${EVIDENCE_IN_ID}/${PROVE_ID}`]); break;
        }   
    }

    clickNew = () => this.modal = this.ngbModel.open(this.evidenceTypeModel, { size: 'lg', centered: true });

    clickSearch(Textsearch: any) {
        this.preloader.setShowPreloader(true);

        var paramsOther = {
            ...Textsearch,
            ACCOUNT_OFFICE_CODE: localStorage.getItem("officeCode")
        }

        this.edidenceService.getByKeyword(paramsOther).then(list => {
            this.onSearchComplete(list)

            this.preloader.setShowPreloader(false);
        }, (err: HttpErrorResponse) => {

            this.ShowAlertNoRecord();
            this.EvidenceInList = [];
            this.preloader.setShowPreloader(false);
        });
    }

    setAdvSearch() {
        this.advSearch.next(!this.advSearch.getValue());
    }

    async onAdvSearch(form: any) {
        this.preloader.setShowPreloader(true);
        let sDate, eDate, sFullDate, eFullDate;

        // วันที่รับเริ่มต้น
        if (form.value.EVIDENCE_IN_DATE_START) {
            sDate = form.value.EVIDENCE_IN_DATE_START.date;

            if (sDate != undefined) {
                sFullDate = new Date(`${sDate.year}-${sDate.month}-${sDate.day}`);
                form.value.EVIDENCE_IN_DATE_START = setZeroHours(sFullDate);
            }
        } else {
            form.value.EVIDENCE_IN_DATE_START = null;
        }

        // วันที่รับสิ้นสุด
        if (form.value.EVIDENCE_IN_DATE_TO) {
            eDate = form.value.EVIDENCE_IN_DATE_TO.date;

            if (sDate != undefined) {
                eFullDate = new Date(`${eDate.year}-${eDate.month}-${eDate.day}`);
                form.value.EVIDENCE_IN_DATE_TO = setZeroHours(eFullDate);
            }
        } else {
            form.value.EVIDENCE_IN_DATE_TO = null;
        }

        // วันที่นำส่งเริ่มต้น
        if (form.value.DELIVERY_DATE_START) {
            sDate = form.value.DELIVERY_DATE_START.date;

            if (sDate != undefined) {
                sFullDate = new Date(`${sDate.year}-${sDate.month}-${sDate.day}`);
                form.value.DELIVERY_DATE_START = setZeroHours(sFullDate);
            }
        } else {
            form.value.DELIVERY_DATE_START = null;
        }

        // วันที่นำส่งสิ้นสุด
        if (form.value.DELIVERY_DATE_TO) {
            eDate = form.value.DELIVERY_DATE_TO.date;

            if (sDate != undefined) {
                eFullDate = new Date(`${eDate.year}-${eDate.month}-${eDate.day}`);
                form.value.DELIVERY_DATE_TO = setZeroHours(eFullDate);
            }
        } else {
            form.value.DELIVERY_DATE_TO = null;
        }

        // ประเภทรายการรับ
        if (form.value.EVIDENCE_IN_TYPE == "") {
            form.value.EVIDENCE_IN_TYPE = null;
        }

        if ((form.value.chk1 == true && form.value.chk2 == true) || (form.value.chk1 == "" && form.value.chk2 == "")) {
            form.value.IS_RECEIVE = "";
        } else if (form.value.chk1 == true) {
            form.value.IS_RECEIVE = 1;
        } else if (form.value.chk2 == true) {
            form.value.IS_RECEIVE = 0;
        } else {
            form.value.IS_RECEIVE = "";
        }

        form.value.ACCOUNT_OFFICE_CODE = localStorage.getItem("officeCode");

        await this.edidenceService.getByConAdv(form.value).then(async list => {
            this.onSearchComplete(list);
            this.preloader.setShowPreloader(false);
        }, (err: HttpErrorResponse) => {
            swal('', err.message, 'error');
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
        this.evidenceIn = [];

        if (!list.length) {
            this.ShowAlertNoRecord();
            this.EvidenceInList = [];

            return false;
        }

        await list.map((item) => {
            if(item.EVIDENCE_IN_DATE){
                item.EVIDENCE_IN_DATE = toLocalShort(item.EVIDENCE_IN_DATE);
            }
            
            item.DELIVERY_DATE = toLocalShort(item.DELIVERY_DATE);

            // หน่วยงานที่รับมอบของกลางเพื่อเก็บรักษา
            item.EvidenceInStaff.filter(f => f.CONTRIBUTOR_ID == 42).map(s => {
                item.DEPT_NAME_RECV = s.OPERATION_OFFICE_NAME;
            });

            // หน่วยงานที่นำส่งของกลาง
            item.EvidenceInStaff.filter(f => f.CONTRIBUTOR_ID == 13).map(s => {
                item.DEPT_NAME_SEND = s.OPERATION_OFFICE_NAME;
            });

            switch (item.EVIDENCE_IN_TYPE) {
                case 0:
                    item.EVIDENCE_IN_TYPE_NAME = "ตรวจรับของกลางจากหน่วยงานภายใน";
                    break;
                case 1:
                    item.EVIDENCE_IN_TYPE_NAME = "ตรวจรับของกลางจากหน่วยงานภายนอก";
                    break;
                case 2:
                    item.EVIDENCE_IN_TYPE_NAME = "ตรวจรับของกลางที่ถูกนำออกไปใช้ในกิจกรรมของทางราชการ";
                    break;
            }
        })

        if (Array.isArray(list)) {
            this.evidenceIn = list;
        } else {
            this.evidenceIn.push(list);
        }

        // set total record
        this.paginage.TotalItems = this.evidenceIn.length;
        this.EvidenceInList = this.evidenceIn.slice(0, this.paginage.RowsPerPageOptions[0]);
    }

    async pageChanges(event) {
        this.EvidenceInList = await this.evidenceIn.slice(event.startIndex - 1, event.endIndex);
    }

    getCurrentDate() {
        let date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).toISOString().substring(0, 10);
    }

    // ----- Validate วันที่รับ -----
    onSRecvDateChange(event: IMyDateModel) {
        this._dateRecvStartFrom = event.date;
        this.checkDateRecv();
    }

    onERecvDateChange(event: IMyDateModel) {
        this._dateRecvStartTo = event.date;
        this.checkDateRecv();
    }

    checkDateRecv() {
        if (this._dateRecvStartFrom && this._dateRecvStartTo) {
            let sdate = `${this._dateRecvStartFrom.year}-${this._dateRecvStartFrom.month}-${this._dateRecvStartFrom.day}`;
            let edate = `${this._dateRecvStartTo.year}-${this._dateRecvStartTo.month}-${this._dateRecvStartTo.day}`;

            if (!compareDate(new Date(sdate), new Date(edate))) {
                swal('', Message.checkDate, 'warning');
                setTimeout(() => {
                    this.EvidenceInDateTo = { date: this._dateRecvStartFrom };
                }, 0);
            }
        }
    }

    // ----- Validate วันที่นำส่ง -----
    onSSendDateChange(event: IMyDateModel) {
        this._dateSendStartFrom = event.date;
        this.checkDateSend();
    }

    onESendDateChange(event: IMyDateModel) {
        this._dateSendStartTo = event.date;
        this.checkDateSend();
    }

    checkDateSend() {
        if (this._dateSendStartFrom && this._dateSendStartTo) {
            let sdate = `${this._dateSendStartFrom.year}-${this._dateSendStartFrom.month}-${this._dateSendStartFrom.day}`;
            let edate = `${this._dateSendStartTo.year}-${this._dateSendStartTo.month}-${this._dateSendStartTo.day}`;

            if (!compareDate(new Date(sdate), new Date(edate))) {
                swal('', Message.checkDate, 'warning');
                setTimeout(() => {
                    this.DeliveryDateTo = { date: this._dateSendStartFrom };
                }, 0);
            }
        }
    }
}
