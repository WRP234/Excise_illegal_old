import { FormGroup, FormArray } from "@angular/forms";
import * as moment from 'moment-timezone';
import { variable } from './variable';
import { IMyDateModel } from "mydatepicker";
import { getDateMyDatepicker, compareDate, setDateMyDatepicker, setZero } from "app/config/dateFormat";
import swal from "sweetalert2";
import { Message } from "app/config/message";
import { Observable, BehaviorSubject } from "rxjs";
import { OnDestroy, ɵConsole } from "@angular/core";

export class ShareFunctions extends variable implements OnDestroy {

    get NoticeStaff(): FormArray {
        return this.noticeForm.get('NoticeStaff') as FormArray;
    }

    get NoticeInformer(): FormArray {
        return this.noticeForm.get('NoticeInformer') as FormArray;
    }

    get NoticeLocale(): FormArray {
        return this.noticeForm.get('NoticeLocale') as FormArray;
    }

    get NoticeProduct(): FormArray {
        return this.noticeForm.get('NoticeProduct') as FormArray;
    }

    get NoticeSuspect(): FormArray {
        return this.noticeForm.get('NoticeSuspect') as FormArray;
    }

    get NoticeDocument(): FormArray {
        return this.noticeForm.get('NoticeDocument') as FormArray;
    }

    public toDateTZ(date: any) {
        return `${moment(date).format('YYYY-MM-DD HH:mm:ss.ms')}`;
    }

    public setFormatTimeControl(event: any, formControl: string, formGroup: FormGroup) {
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
            formGroup.controls[formControl].setValue(str_unSub.slice(0, str_unSub.length - 1));

        switch (true) {
            // NumPad 96-105
            case K >= 96 && K <= 105:
                if (str.length == 2)
                    formGroup.controls[formControl].setValue(`${mm}:${ss}`);
                else if (str.length == 3)
                    formGroup.controls[formControl].setValue(`${mm}:${str_unSub.substring(2)}`);
                break;
            // KeyPad 96-105
            case (K >= 48 && K <= 57):
                if (str.length == 2)
                    formGroup.controls[formControl].setValue(`${mm}:${ss}`);
                else if (str.length == 3)
                    formGroup.controls[formControl].setValue(`${mm}:${str_unSub.substring(2)}`);
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

    onClickEditField() {
        /** set false */
        this.editButton.next(false)
        this.deleteButton.next(false);
        this.printButton.next(false);
        this.showEditField = false;
        /** set true */
        this.saveButton.next(true);
        this.cancelButton.next(true);
    }

    setFormStaffForConID(start: number, end: number) {
        for (let i = start; i <= end; i++) {
            this.NoticeStaff.at(i).patchValue({
                ProgramCode: this.programSpect,
                ProcessCode: '0002',
                NoticeCode: this.noticeCode,
                IS_ACTIVE: 1,
                FULL_NAME: '',
                STAFF_CODE: '',
                OPERATION_POS_CODE: '',
                OPREATION_POS_NAME: '',
                OPERATION_DEPT_LEVEL: '',
                OPERATION_DEPT_CODE: '',
                OPERATION_DEPT_NAME: '',
                CONTRIBUTOR_ID: '',
                TITLE_NAME_TH: '',
                FIRST_NAME: '',
                LAST_NAME: '',
                OPERATION_OFFICE_CODE: '',
                OPERATION_OFFICE_NAME: '',
                OPERATION_OFFICE_SHORT_NAME: '',
                ID_CARD: '',
                OPERATION_POS_LEVEL_NAME: '',
                OPERATION_UNDER_DEPT_CODE: '',
                OPERATION_UNDER_DEPT_LEVEL: '',
                OPERATION_UNDER_DEPT_NAME: '',
                OPERATION_WORK_DEPT_CODE: '',
                OPERATION_WORK_DEPT_LEVEL: '',
                OPERATION_WORK_DEPT_NAME: '',
                OPREATION_POS_LEVEL: '',
                REMARK: '',
                STAFF_ID: '',
                STAFF_TYPE: '',
                STATUS: '',
                TITLE_ID: '',
                TITLE_NAME_EN: '',
                TITLE_SHORT_NAME_EN: '',
                TITLE_SHORT_NAME_TH: ''
            });
        }
    }

    onNoticeDateChange(event: IMyDateModel) {
        this._noticeDate = event;
        this.checkDate();

        ///### set NOTICE_DUE_DATE to follow up NOTICE_DATE ###///
        let noticeDue = this.noticeForm.value.NOTICE_DUE;
        this._noticeDate.jsdate.setDate(this._noticeDate.jsdate.getDate() + parseInt(noticeDue) - (parseInt(noticeDue) < 1 ? 0 : 1));
        this.noticeForm.patchValue({
            NOTICE_DUE_DATE: setDateMyDatepicker(this._noticeDate.jsdate),
            NOTICE_DUE_TIME: "23:59"
        })
    }

    onNoticeDueDateChange(event: IMyDateModel) {
        this._noticeDueDate = event;
        this.checkDate();
    }

    checkDate() {
        const _sdate = this._noticeDate ? this._noticeDate : this.noticeForm.value.NoticeDate;
        const _edate = this._noticeDueDate ? this._noticeDueDate : this.noticeForm.value.NoticeDueDate;

        if (_sdate && _edate) {
            const sdate = getDateMyDatepicker(_sdate);
            const edate = getDateMyDatepicker(_edate);

            if (!compareDate(sdate, edate)) {
                // this.showSwal(Message.checkDate, "warning");
                swal({
                    text: Message.checkDate,
                    type: 'warning',
                    confirmButtonText: 'ตกลง'
                })
                setTimeout(() => {
                    this.noticeForm.patchValue({
                        NoticeDueDate: { date: _sdate.date }
                    });
                }, 0);
            }
        }
    }

    getPersonTypeName(item: any) {
        if (item == 0) {
            return this._LawbreakerTypes_New[1].text
        } else if (item == 1) {
            return this._LawbreakerTypes_New[0].text
        } else if (item == 2) {
            return this._LawbreakerTypes_New[2].text
        } else return "";
    }


    getEntityTypeName(item: any) {
        if (item == 0) {
            return this.entityTypes[0].text
        } else if (item == 1) {
            return this.entityTypes[1].text
        } else return "";
    }

    searchProduct = (text$: Observable<string>) =>
        text$
            .debounceTime(300)
            .distinctUntilChanged()
            .map(term => term === '' ? []
                : this.typeheadProduct
                    .filter(v => (v.ProductDesc.toLowerCase().indexOf(term.toLowerCase()) > - 1)
                    ).slice(0, 10));


    serachOffice = (text3$: Observable<string>) =>
        text3$
            .debounceTime(200)
            .distinctUntilChanged()
            .map(term => term === '' ? []
                : this.typeheadOffice
                    .filter(v =>
                        (`${v.OFFICE_NAME || ''} ${v.OfficeShortName || ''}`.toLowerCase().indexOf(term.toLowerCase()) > -1)
                    ).slice(0, 10));

    searchUnit = (text$: Observable<string>) =>
        text$
            .debounceTime(300)
            .distinctUntilChanged()
            .map(term => term === '' ? []
                : this.typeheadProductUnit
                    .filter(v => (v.DutyCode.toLowerCase().indexOf(term.toLowerCase()) > - 1)
                    ).slice(0, 10));

    formatterProduct = (x: { PRODUCT_BRAND_NAME_TH: String }) =>
        `${x.PRODUCT_BRAND_NAME_TH || ''}`;

    formatterRegion = (x: { SUB_DISTRICT_NAME_TH: string, DISTRICT_NAME_TH: string, PROVINCE_NAME_TH: string }) =>
        `${x.SUB_DISTRICT_NAME_TH + " " || ''}${x.DISTRICT_NAME_TH + " " || ''}${x.PROVINCE_NAME_TH || ''}`;

    formatterStaff = (x: { TITLE_SHORT_NAME_TH: string, FIRST_NAME: string, LAST_NAME: string }) =>
        `${x.TITLE_SHORT_NAME_TH || ''}${x.FIRST_NAME || ''} ${x.LAST_NAME || ''}`

    formatterStaff1 = (x: { TITLE_SHORT_NAME_TH: string, FIRST_NAME: string, LAST_NAME: string }) =>
        `${x.TITLE_SHORT_NAME_TH || ''}${x.FIRST_NAME || ''} ${x.LAST_NAME || ''}`

    formatterStaff2 = (x: { TITLE_SHORT_NAME_TH: string, FIRST_NAME: string, LAST_NAME: string }) =>
        `${x.TITLE_SHORT_NAME_TH || ''}${x.FIRST_NAME || ''} ${x.LAST_NAME || ''}`

    formatterOffice = (x: { OFFICE_SHORT_NAME: string }) => x.OFFICE_SHORT_NAME

    formatterUnit = (x: { QUANTITY_UNIT: String }) =>
        `${x.QUANTITY_UNIT || ''}`;

    selectItemInformmerRegion(ele: any) {
        this.NoticeInformer.at(0).patchValue({
            SUB_DISTRICT_ID: ele.item.SUB_DISTRICT_ID
        });
    }

    selectItemUnit(ele: any, index: number) {
        this.NoticeProduct.at(index).patchValue({
            QtyUnit: ele.item.DutyUnitCode,
            DutyCode: ele.item.DutyCode
        });
        this.selectUnit = true;
    }

    selectItemOffice(e) {
        this.noticeForm.patchValue({
            OFFICE_CODE: e.item.OFFICE_CODE,
            OFFICE_ID: e.item.OFFICE_ID,
            OFFICE_NAME: e.item.OFFICE_SHORT_NAME,
            OFFICE_NAME_TEMP: e.item.OFFICE_SHORT_NAME
        });
    }

    searchDataUnit(ele: any, index: number) {
        let text = ele.value;
        let units = this.typeheadProductUnit
            .filter(v => (v.DutyCode.toLowerCase().indexOf(text.toLowerCase()) > - 1)
            ).slice(0, 10);
        if (units.length == 1) {
            this.NoticeProduct.at(index).patchValue({
                QtyUnit: units[0].DutyUnitCode,
                DutyCode: units[0].DutyCode
            });
            ele.value = units[0].DutyCode;
        }
    }

    blurSelectItemProductItem(index: number) {
        const productID = this.NoticeProduct.at(index).value.ProductID;
        if (!productID) {
            this.NoticeProduct.at(index).patchValue({
                BrandFullName: ""
            });
        }
    }

    blurSelectItemInformmerRegion(ele: any) {
        if (!ele.value) {
            this.NoticeInformer.at(0).patchValue({
                SUB_DISTRICT_ID: ""
            });
        }
    }



    blurSelectItemOffice(input) {
        let val = input.value
        if (!val) {
            this.noticeForm.patchValue({
                OFFICE_CODE: "",
                OFFICE_ID: "",
                OFFICE_NAME: "",
                OFFICE_NAME_TEMP: "",
            });
        }
    }


    blurSelectItemLocaleRegion(ele: any) {
        if (!ele.value) {
            this.NoticeLocale.at(0).patchValue({
                SUB_DISTRICT_ID: ""
            });
        }
    }

    clearStaffOfindex(i) {
        this.NoticeStaff.at(i).patchValue({
            NOTICE_ID: '',
            BIRTH_DATE: '',
            FIRST_NAME: '',
            ID_CARD: '',
            IS_ACTIVE: '',
            LAST_NAME: '',
            FULL_NAME: '',
            MANAGEMENT_DEPT_CODE: '',
            MANAGEMENT_DEPT_LEVEL: '',
            MANAGEMENT_DEPT_NAME: '',
            MANAGEMENT_OFFICE_CODE: '',
            MANAGEMENT_OFFICE_NAME: '',
            MANAGEMENT_OFFICE_SHORT_NAME: '',
            MANAGEMENT_POS_CODE: '',
            MANAGEMENT_POS_LEVEL: '',
            MANAGEMENT_POS_LEVEL_NAME: '',
            MANAGEMENT_POS_NAME: '',
            MANAGEMENT_UNDER_DEPT_CODE: '',
            MANAGEMENT_UNDER_DEPT_LEVEL: '',
            MANAGEMENT_WORK_DEPT_CODE: '',
            MANAGEMENT_WORK_DEPT_LEVEL: '',
            MANAGEMENT_WORK_DEPT_NAME: '',
            OPERATION_DEPT_CODE: '',
            OPERATION_DEPT_LEVEL: '',
            OPERATION_DEPT_NAME: '',
            OPERATION_OFFICE_CODE: '',
            OPERATION_OFFICE_NAME: '',
            OPERATION_OFFICE_SHORT_NAME: '',
            OPERATION_POS_CODE: '',
            OPERATION_POS_LEVEL_NAME: '',
            OPERATION_UNDER_DEPT_CODE: '',
            OPERATION_UNDER_DEPT_LEVEL: '',
            OPERATION_UNDER_DEPT_NAME: '',
            OPERATION_WORK_DEPT_CODE: '',
            OPERATION_WORK_DEPT_LEVEL: '',
            OPERATION_WORK_DEPT_NAME: '',
            OPREATION_POS_LEVEL: '',
            OPREATION_POS_NAME: '',
            REMARK: '',
            REPRESENT_DEPT_CODE: '',
            REPRESENT_DEPT_LEVEL: '',
            REPRESENT_DEPT_NAME: '',
            REPRESENT_OFFICE_CODE: '',
            REPRESENT_OFFICE_NAME: '',
            REPRESENT_OFFICE_SHORT_NAME: '',
            REPRESENT_POS_CODE: '',
            REPRESENT_POS_LEVEL: '',
            REPRESENT_POS_LEVEL_NAME: '',
            REPRESENT_POS_NAME: '',
            REPRESENT_UNDER_DEPT_CODE: '',
            REPRESENT_UNDER_DEPT_LEVEL: '',
            REPRESENT_UNDER_DEPT_NAME: '',
            REPRESENT_WORK_DEPT_CODE: '',
            REPRESENT_WORK_DEPT_LEVEL: '',
            REPRESENT_WORK_DEPT_NAME: '',
            STAFF_CODE: '',
            STAFF_ID: '',
            STAFF_TYPE: '',
            STATUS: '',
            TITLE_ID: '',
            TITLE_NAME_EN: '',
            TITLE_NAME_TH: '',
            TITLE_SHORT_NAME_EN: '',
            TITLE_SHORT_NAME_TH: '',
            CONTRIBUTOR_ID: '',
            IsNewItem: false,
            IsUpdate: false
        });
    }

    ngOnDestroy(): void {
        this.alertSwal.ngOnDestroy();
        this.deleteNotice.ngOnDestroy();
        this.deleteProduct.ngOnDestroy();
        this.deleteSuspect.ngOnDestroy();
        this.deleteDocument.ngOnDestroy();
        this.cancelEdit.ngOnDestroy();
    }

    public showSwal(msg: string, iconType: any) {
        this.alertSwal.text = msg;
        this.alertSwal.type = iconType; //'success' | 'error' | 'warning' | 'info' | 'question'
        this.alertSwal.show();
    }

    // ################################## toggle actions-collapse  ##################################
    public toggleCollapse(event: BehaviorSubject<Boolean>): void {
        if (event.getValue()) {
            event.next(false);
        } else {
            event.next(true);
        }
    }

    public addNoticeDueDate(e: any) {
        /// validate first input != 0
        if (/^0/.test(e.value))
            this.noticeForm.controls['NOTICE_DUE'].setValue(e.value.replace(/^0/, ""));

        const patt = /(^[0-9]+)$/;
        const _date = new Date();
        var dueDate = e.value == '' ? 0 : e.value;
        if (patt.test(e.value)) {
            dueDate = e.value
        } else {
            this.noticeForm.controls['NOTICE_DUE'].setValue(null);
            dueDate = 1;
        }

        if (!this.noticeForm.value.NOTICE_DATE) {
            this.noticeForm.patchValue({
                NOTICE_DATE: setDateMyDatepicker(_date),
                NOTICE_TIME: `${setZero((new Date).getHours())}:${setZero((new Date).getMinutes())}`
            })
        }

        let noticeDate = getDateMyDatepicker(this.noticeForm.value.NOTICE_DATE);
        noticeDate.setDate(noticeDate.getDate() + parseInt(dueDate) - (parseInt(dueDate) < 1 ? 0 : 1));

        this.noticeForm.patchValue({
            NOTICE_DUE_DATE: setDateMyDatepicker(noticeDate),
            NOTICE_DUE_TIME: "23:59"
        })
    }

    public numericOnly(event): boolean {
        let patt = /^([0-9])$/;
        let result = patt.test(event.key);
        return result;
    }


    public CreditNumericOnly(event): boolean {
        let patt = /^([0-9,-])$/;
        let result = patt.test(event.key);
        return result;
    }

    public validateFirstZelo(event: any) {
        if (/^0/.test(event.value))
            this.NoticeInformer.at(0).patchValue({
                AGE: event.value.replace(/^0/, "")
            })
    }

    public Sorter(event: BehaviorSubject<Boolean>, type: string): void {
        if (event.getValue()) event.next(false); else event.next(true);

        switch (type) {
            case 'LS':
                if (event.getValue())
                    this.notice.sort((a, b) => {
                        return <number>parseInt(b.NOTICE_CODE.substring(8)) - <number>parseInt(a.NOTICE_CODE.substring(8));
                    });
                else
                    this.notice.sort((a, b) => {
                        return <number>parseInt(a.NOTICE_CODE.substring(8)) - <number>parseInt(b.NOTICE_CODE.substring(8));
                    });
                break;
            case 'TIME':
                if (event.getValue())
                    this.notice.sort((a, b) => {
                        return <any>new Date(b.NOTICE_DATE).getTime() - <any>new Date(a.NOTICE_DATE).getTime();
                    });
                else
                    this.notice.sort((a, b) => {
                        return <any>new Date(a.NOTICE_DATE).getTime() - <any>new Date(b.NOTICE_DATE).getTime();
                    });
                break;
            default:
                break;
        }
        this.reIndex();
        this.noticeList = this.notice.slice(0, this.paginage.RowsPerPageOptions[0]);
    }

    public DateSorter(Arr: any[] = []) {
        return Arr.sort((a, b) => {
            return <any>new Date(b.NOTICE_DATE).getTime() - <any>new Date(a.NOTICE_DATE).getTime();
        });
    }

    public reIndex() {
        this.notice.map((m, i) => {
            m.index = i + 1;
        })
    }

    public canOfficeSearch(): boolean {
        const OFFICE_CODE_SLICE = this.officeCode.slice(0, 2);
        return OFFICE_CODE_SLICE == '00' ? false : true;
    }

    public setProductName(PRODUCT_GROUP_CODE, i) {
        const PRODUCT_GROUP_NAME$ = this.ProductGroup.find(f => f.PRODUCT_GROUP_CODE == PRODUCT_GROUP_CODE.value).PRODUCT_GROUP_NAME;
        this.NoticeProduct.at(i).patchValue({
            PRODUCT_GROUP_NAME: PRODUCT_GROUP_NAME$
        })
    }

    private onProductGroupChange() {
        const PROD = this.NoticeProduct.getRawValue();
        this.DuplicatePorductGroup(PROD);
    }

    public DuplicatePorductGroup(PROD: any) {
        this.ProductGroup.map(m => {
            const isSet =
                this.setProductGroupCode(PROD)
                    .filter(f => m.PRODUCT_GROUP_CODE == f.PRODUCT_GROUP_CODE)
                    .length;
            if (isSet)
                m.IS_DISABLED = true;
            else
                m.IS_DISABLED = false;
        });
    }

    public setProductGroupCode(PROD: any[]) {
        let PRODUCT_GROUP_CODE: any[] = [];
        PRODUCT_GROUP_CODE = PROD.reduce((a, c) =>
            [...a, { PRODUCT_GROUP_CODE: c.PRODUCT_GROUP_CODE }], [])
            .filter(f => f.PRODUCT_GROUP_CODE != '');
        return PRODUCT_GROUP_CODE;
    }

    public tranFormDutyGroup(o) {
        const result = o.reduce((a, c) =>
            [...a, {
                PRODUCT_GROUP_ID: c.GROUP_ID,
                PRODUCT_GROUP_CODE: c.GROUP_ID,
                PRODUCT_GROUP_NAME: c.GROUP_NAME,
                IS_ACTIVE: 1,
                CREATE_DATE: null,
                CREATE_USER_ACCOUNT_ID: null,
                UPDATE_DATE: c.UPD_DATE,
                UPDATE_USER_ACCOUNT_ID: c.UPD_USERID,
                GROUP_STATUS: c.GROUP_STATUS
            }], []).filter(f => f.GROUP_STATUS == 'Y');
        return result;
    }

    public getDisCurrDateMyDatePicker() {
        let currentdate = new Date();
        const disCurrDate = {
            begin: { year: currentdate.getFullYear(), month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 },
            end: { year: currentdate.getFullYear() + 100, month: currentdate.getMonth() + 1, day: currentdate.getDate() },
        }
        return disCurrDate;
    }

    public getDisLessthanCurrDateMyDatePicker() {
        let currentdate = new Date();
        const disCurrDate = {
            begin: { year: currentdate.getFullYear() - 100, month: currentdate.getMonth() + 1, day: currentdate.getDate() },
            end: { year: currentdate.getFullYear(), month: currentdate.getMonth() + 1, day: currentdate.getDate() },
        }
        return disCurrDate;
    }

    public swalFn(title: string, msg: string, type: any) {
        return swal({
            title: title,
            text: msg,
            type: type,
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'ตกลง'
        })
    }

    public swalFnMulti(title: string, msg: string, type: any) {
        return swal({
            title: title,
            text: msg,
            type: type,
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'ตกลง',
            cancelButtonText: 'ยกเลิก'
        })
    }

}