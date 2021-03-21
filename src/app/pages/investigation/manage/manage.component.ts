import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as fromModels from '../models';
import * as fromService from '../services';
import { NavigationService } from 'app/shared/header-navigation/navigation.service';
import { SidebarService } from 'app/shared/sidebar/sidebar.component';
import { Message } from 'app/config/message';
import { setZero, getDateMyDatepicker, compareDate, setDateMyDatepicker } from 'app/config/dateFormat';
import { IMyDateModel } from 'mydatepicker-th';
import * as moment from 'moment';
import { ManageConfig } from '../manage/manage.config';


@Component({
    selector: 'app-manage',
    templateUrl: './manage.component.html'
})
export class ManageComponent extends ManageConfig implements OnInit, OnDestroy, AfterViewInit {

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private activeRoute: ActivatedRoute,
        private navService: NavigationService,
        private ngbModel: NgbModal,
        private sidebarService: SidebarService,
        private s_invest: fromService.InvestgateService,
        // private store: Store<fromStore.AppState>
    ) {
        super();
        // set false
        this.navService.setNewButton(false);
        this.navService.setSearchBar(false);

        // this.obInvest = store.select(s => s.invest);
        // this.obInvest
        //     .takeUntil(this.destroy$)
        //     .subscribe((x: fromModels.InvestigateModelUppercase) => this.stateInvest = x)
    }

    ngOnInit() {

        localStorage.setItem('programcode', 'ILG60-01-00');
        this.sidebarService.setVersion(this.s_invest.version);
        this.active_Route();
        this.createForm();
        this.dateFromOption.disableDateRanges = [this.getDisCurrDateMyDatePicker()];
        this.dateToOption.disableDateRanges = [this.getDisCurrDateMyDatePicker()];
        this.pageLoad();
    }

    ngAfterViewInit(): void {
        switch (this.mode) {
            case 'C':
                // this.investigateForm.patchValue({
                //     INVESTIGATE_NO_YEAR: ((new Date).getFullYear() + 543)
                //     });
                break;
        }
    }

    printFullName(staff) {
        return `${staff.TITLE_NAME_TH} ${staff.FIRST_NAME} ${staff.LAST_NAME}`;
    }

    private createForm() {
        const date = this.mode == 'C' ? setDateMyDatepicker(new Date()) : null;
        const time = this.mode == 'C' ? `${setZero((new Date).getHours())}:${setZero((new Date).getMinutes())}` : null;
        this.investigateForm = this.fb.group({
            INVESTIGATE_CODE: new FormControl(this.investCode, Validators.required),
            INVESTIGATE_NO: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(9)]),
            INVESTIGATE_NO_YEAR: new FormControl(((new Date).getFullYear() + 543), Validators.required),
            DATE_START: new FormControl(date, Validators.required),
            DATE_END: new FormControl(date, Validators.required),
            TIME_START: new FormControl(time, Validators.required),
            TIME_END: new FormControl(time, Validators.required),
            SUBJECT: new FormControl(null, Validators.required),
            IS_ACTIVE: new FormControl(1),
            INVESTIGATE_DETAIL: this.fb.array([]),
            InvestigateDetailSuspect: this.fb.array([]),
            InvestigateDetailProduct: this.fb.array([])
        });
        this.sysdateStart = date;
        this.sysdateEnd = date;
    }

    private active_Route() {
        this.activeRoute.params.takeUntil(this.destroy$).subscribe(p => {
            this.mode = p['mode'];
            this.investCode = p['code'];
            this.investId = p['code'];
            if (this.investCode === 'NEW') {
                this.investCode = 'Auto Generate';
            }
            this.setButton();
        });
    }

    setButton() {
        if (this.mode === 'C') {
            this.enableBtnCreate();
        } else if (this.mode === 'R') {
            this.enableBtnEdit();
        }
    }

    enableBtnCreate() {
        // set false
        this.printButton.next(false);
        this.editButton.next(false);
        this.deleteButton.next(false);
        this.cancelButton.next(true);
        this.saveButton.next(true);
        this.showEditField = false;
    }

    enableBtnEdit() {
        // set false
        this.printButton.next(true);
        this.editButton.next(true);
        this.deleteButton.next(true);
        this.cancelButton.next(false);
        this.saveButton.next(false);
        this.showEditField = true;
    }

    private enableBtnModeC() {
        // set false
        this.navService.setPrintButton(false);
        this.navService.setEditButton(false);
        this.navService.setDeleteButton(false);
        this.navService.setEditField(false);
        this.navService.setPrevPageButton(false);
        this.navService.setNextPageButton(false);
        // set true
        this.navService.setSaveButton(true);
        this.navService.setCancelButton(true);
    }

    private enableBtnModeR() {
        // set false
        this.navService.setSaveButton(false);
        this.navService.setCancelButton(false);
        this.navService.setPrevPageButton(false);
        this.navService.setNextPageButton(false);
        // set true
        this.navService.setPrintButton(true);
        this.navService.setEditButton(true);
        this.navService.setDeleteButton(true);
        this.navService.setEditField(true);
    }

    onSave() {
        const f = this.investigateForm.value;
        const INVESTIGATE_NO = f.INVESTIGATE_NO;
        if (!INVESTIGATE_NO) {
            this.isRequired = true;
            this.isReq_No.next(true);
            this.swalFn('', `กรุณาระบุข้อมูล "คดีสืบสวนที่"`, 'warning');
            return false;
        }

        const DATE_START = f.DATE_START;
        if (!DATE_START) {
            this.isRequired = true;
            this.isReq_DStart.next(true);
            this.swalFn('', `กรุณาระบุข้อมูล "วันที่เริ่มสืบสวน"`, 'warning');
            return false;
        }

        const TIME_START = f.TIME_START;
        if (!TIME_START) {
            this.isRequired = true;
            this.isReq_TStart.next(true);
            this.swalFn('', `กรุณาระบุข้อมูล "เวลา"`, 'warning');
            return false;
        }

        const DATE_END = f.DATE_END;
        if (!DATE_END) {
            this.isRequired = true;
            this.isReq_DEnd.next(true);
            this.swalFn('', `กรุณาระบุข้อมูล "วันที่สิ้นสุดสืบสวน"`, 'warning');
            return false;
        }

        const TIME_END = f.TIME_END;
        if (!TIME_END) {
            this.isRequired = true;
            this.isReq_TEnd.next(true);
            this.swalFn('', `กรุณาระบุข้อมูล "เวลา"`, 'warning');
            return false;
        }

        const SUBJECT = f.SUBJECT;
        if (!SUBJECT) {
            this.isRequired = true;
            this.isReq_Subject.next(true);
            this.swalFn('', `กรุณาระบุข้อมูล "หัวข้อการสืบสวน"`, 'warning');
            return false;
        }

        if (!this.InvestigateDetail.length) {
            this.swalFn('', 'ส่วนรายงานการสืบสวน ต้องมีอย่างน้อย 1 รายการ', 'warning');
            return;
        }

        // f.DateStart = setZeroHours(getDateMyDatepicker(f.DateStart));
        // f.DateEnd = setZeroHours(getDateMyDatepicker(f.DateEnd));
        const timeStart = f.TIME_START;
        const timeEnd = f.TIME_END;
        f.DateStart = f.DATE_START.date.year + "-" + setZero(f.DATE_START.date.month) + "-" + f.DATE_START.date.day + " " + timeStart;
        f.DateEnd = f.DATE_END.date.year + "-" + setZero(f.DATE_END.date.month) + "-" + f.DATE_END.date.day + " " + timeEnd;

        switch (this.mode) {
            case 'R':
                this.updateInvestigate(f);
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

    onClickDelete() {
        this.onDelete();
    }

    addSuspect(suspect: any[]) {
        if (suspect.length) {
            suspect.map(item => {
                let noticeSuspect = {
                    SUSPECT_ID: '',
                    NOTICE_ID: this.NOTICE_ID || "",
                    PERSON_ID: item.PERSON_ID || "",
                    TITLE_ID: item.TITLE_ID || "",
                    PERSON_TYPE: item.PERSON_TYPE || "",
                    PERSON_TYPE_NAME: '',
                    ENTITY_TYPE: item.ENTITY_TYPE || "",
                    ENTITY_TYPE_NAME: '',
                    TITLE_NAME_TH: item.TITLE_NAME_TH || "",
                    TITLE_NAME_EN: item.TITLE_NAME_EN || "",
                    TITLE_SHORT_NAME_TH: item.TITLE_SHORT_NAME_TH || "",
                    TITLE_SHORT_NAME_EN: item.TITLE_SHORT_NAME_EN || "",
                    FIRST_NAME: item.FIRST_NAME || "",
                    MIDDLE_NAME: item.MIDDLE_NAME || "",
                    LAST_NAME: item.LAST_NAME || "",
                    OTHER_NAME: item.OTHER_NAME || "",
                    FULL_NAME: item.FULL_NAME || "",
                    COMPANY_NAME: item.COMPANY_NAME || "",
                    COMPANY_REGISTRATION_NO: item.COMPANY_REGISTRATION_NO || "",
                    EXCISE_REGISTRATION_NO: item.EXCISE_REGISTRATION_NO || "",
                    ID_CARD: item.ID_CARD || "",
                    AGE: item.AGE || "",
                    PASSPORT_NO: item.PASSPORT_NO || "",
                    CAREER: item.CAREER || "",
                    PERSON_DESC: item.PERSON_DESC || "",
                    EMAIL: item.EMAIL || "",
                    TEL_NO: item.TEL_NO || "",
                    MISTREAT_NO: item.MISTREAT_NO || 0,
                    IS_ACTIVE: 1,
                    IsNewItem: true
                }

                this.InvestigateDetailSuspect.push(this.fb.group(noticeSuspect))
                console.log('Fn addSuspect this.NoticeSuspect : ', this.InvestigateDetailSuspect)
            })
        }
    }

    private pageLoad() {
        console.log('pageLoad');
        switch (this.mode) {
            case 'C':
                this.enableBtnModeC();
                if (this.stateInvest) {
                    this.pageRefreshInvestigate(this.stateInvest);
                }
                break;

            case 'R':
                this.enableBtnModeR();
                this.s_invest.InvestigategetByCon(this.investCode)
                    .takeUntil(this.destroy$)
                    .subscribe((x) => {
                        if (!this.checkResponse(x)) return;
                        this.pageRefreshInvestigate(x);
                    });
                break;
        }
    }

    private async pageRefreshInvestigate(x) {
        const _investStartDate = new Date(x.DATE_START);
        const _investEndDate = new Date(x.DATE_START);
        // x.DATE_START = (setDateMyDatepicker(x.DATE_START));
        // x.DATE_END = (setDateMyDatepicker(x.DATE_END));

        // let investDetail = x.INVESTIGATE_DETAIL
        //     .filter(x => x.InvestigateDetailID)
        //     .sort((a, b) => {
        //         return parseInt(a.InvestigateSeq) - parseInt(b.InvestigateSeq);
        //     });
        const investDetail = x.InvestigateDetail
        this.investigateDetail = investDetail;
        console.log(x)
        // if (!investDetail) return;
        // await investDetail.map(id => {
        //     let staff: fromModels.InvestigateDetailStaff[] = id.InvestigateDetailStaff
        //         .filter(staff => staff.ContributorID == '2' || staff.ContributorID == '3')
        //         .map(staff => {
        //             switch (parseInt(staff.ContributorID)) {
        //                 case 2:
        //                     staff.Investigator = `${staff.TitleName} ${staff.FirstName} ${staff.LastName}`;
        //                     break;
        //                 case 3:
        //                     staff.Commander = `${staff.TitleName} ${staff.FirstName} ${staff.LastName}`;
        //                     break;
        //             }
        //             return staff;
        //         });

        //     id.InvestigateDetailStaff = staff;
        // })

        this.setItemFormArray(investDetail, 'INVESTIGATE_DETAIL');
        this.investigateForm.patchValue(x);
        this.investigateForm.patchValue({
            DATE_START: {
                date: {
                    day: _investStartDate.getDate(),
                    month: _investStartDate.getMonth() + 1,
                    year: _investStartDate.getFullYear(),
                }
            },
            TIME_START: x.DATE_START.slice(11, 16),
            DATE_END: {
                date: {
                    day: _investEndDate.getDate(),
                    month: _investEndDate.getMonth() + 1,
                    year: _investEndDate.getFullYear(),
                }
            },
            TIME_END: x.DATE_END.slice(11, 16)
        });
        console.log(this.InvestigateDetail.controls)
        // this.investigateNo0.nativeElement.value = x.INVESTIGATE_NO ? x.INVESTIGATE_NO : '';
        // this.investigateNo1.nativeElement.value = x.INVESTIGATE_NO_YEAR ? x.INVESTIGATE_NO_YEAR : '';
    }

    onChangeInvestigateNo() {
        const f = this.investigateForm.value;
        const i0 = f.INVESTIGATE_NO;
        const i1 = f.INVESTIGATE_NO_YEAR;
        this.investigateForm.patchValue({
            INVESTIGATE_NO: i0,
            INVESTIGATE_NO_YEAR: i1
        })
    }

    checkResponse(res: any) {
        switch (res.IsSuccess) {
            case 'False':
            case false:
                return false;
            default:
                return true;
        }
    }

    checkIsSuccess(res: any) {
        switch (res.IsSuccess) {
            case 'True':
            case true:
                return true;
            default:
                return false;
        }
    }

    public onSDateChange(event: IMyDateModel) {
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

    public onEDateChange(event: IMyDateModel) {
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

    onCreateInvestDetail() {
        const f = this.investigateForm.value;
        const INVESTIGATE_NO = f.INVESTIGATE_NO;
        if (!INVESTIGATE_NO) {
            this.isRequired = true;
            this.isReq_No.next(true);
            this.swalFn('', `กรุณาระบุข้อมูล "คดีสืบสวนที่"`, 'warning');
            return false;
        }

        const DATE_START = f.DATE_START;
        if (!DATE_START) {
            this.isRequired = true;
            this.isReq_DStart.next(true);
            this.swalFn('', `กรุณาระบุข้อมูล "วันที่เริ่มสืบสวน"`, 'warning');
            return false;
        }

        const TIME_START = f.TIME_START;
        if (!TIME_START) {
            this.isRequired = true;
            this.isReq_TStart.next(true);
            this.swalFn('', `กรุณาระบุข้อมูล "เวลา"`, 'warning');
            return false;
        }

        const DATE_END = f.DATE_END;
        if (!DATE_END) {
            this.isRequired = true;
            this.isReq_DEnd.next(true);
            this.swalFn('', `กรุณาระบุข้อมูล "วันที่สิ้นสุดสืบสวน"`, 'warning');
            return false;
        }

        const TIME_END = f.TIME_END;
        if (!TIME_END) {
            this.isRequired = true;
            this.isReq_TEnd.next(true);
            this.swalFn('', `กรุณาระบุข้อมูล "เวลา"`, 'warning');
            return false;
        }

        const SUBJECT = f.SUBJECT;
        if (!SUBJECT) {
            this.isRequired = true;
            this.isReq_Subject.next(true);
            this.swalFn('', `กรุณาระบุข้อมูล "หัวข้อการสืบสวน"`, 'warning');
            return false;
        }
        const invest = this.investigateForm.value;
        // const dateStart = getDateMyDatepicker(invest.DateStart);
        // const dateEnd = getDateMyDatepicker(invest.DateEnd);
        // invest.DateStart = setZeroHours(dateStart);
        // invest.DateEnd = setZeroHours(dateEnd);

        const timeStart = invest.TIME_START.replace('.', ':');
        const timeEnd = invest.TIME_END.replace('.', ':');
        invest.DATE_START = invest.DATE_START.date.year + "-" + setZero(invest.DATE_START.date.month) + "-" + setZero(invest.DATE_START.date.day) + " " + timeStart + ":00.000";
        invest.DATE_END = invest.DATE_END.date.year + "-" + setZero(invest.DATE_END.date.month) + "-" + setZero(invest.DATE_END.date.day) + " " + timeEnd + ":00.000";
        // this.store.dispatch(new fromStore.CreateInvestigate(invest));
        let InvestigateSeq = 1;
        if (this.investigateDetail && this.investigateDetail.length) {
            InvestigateSeq = +this.investigateDetail[this.investigateDetail.length - 1].INVESTIGATE_SEQUENCE + 1
        }

        this.router.navigate(
            [`investigation/detail-manage`, 'C'],
            {
                queryParams: {
                    investMode: this.mode,
                    investCode: this.investCode,
                    investigateSeq: InvestigateSeq,
                    investDStart: invest.DATE_START,
                    investDEnd: invest.DATE_END,
                    investNo: invest.INVESTIGATE_NO,
                    investYear: invest.INVESTIGATE_NO_YEAR,
                    investSubject: invest.SUBJECT
                }
            });
    }

    onViewInvesDetail(invesDetailId: string, investigateSeq: string) {
        const invest = this.investigateForm.value as fromModels.InvestigateModelUppercase;
        this.router.navigate(
            [`investigation/detail-manage`, 'R'],
            {
                queryParams: {
                    investMode: this.mode,
                    investCode: this.investCode,
                    invesDetailId: invesDetailId,
                    InvestigateSeq: investigateSeq,
                    investDStart: invest.DATE_START,
                    investDEnd: invest.DATE_END
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
        this.investigateForm.reset();
        this.clearFormArray(this.InvestigateDetail);

        // this.navService.setOnEdit(false);
        // this.navService.setOnSave(false);
        // this.navService.setOnDelete(false);
        // this.navService.setOnCancel(false);
        // this.navService.setOnSearch(false);
        // this.navService.setOnPrint(false);
        // this.navService.setOnNextPage(false);
        // this.navService.setOnPrevPage(false);
        //
        // this.navService.setEditField(false);
        // this.navService.setSearchBar(false);
        // this.navService.setPrintButton(false);
        // this.navService.setEditButton(false);
        // this.navService.setDeleteButton(false);
        // this.navService.setSaveButton(false);
        // this.navService.setCancelButton(false);
        // this.navService.setNewButton(false);
        // this.navService.setNextPageButton(false);
        // this.navService.setPrevPageButton(false);

    }

    catchError(error: any) {
        console.log(error);
        this.swalFn('', Message.saveFail, 'error');
    }

    clearFormArray = (formArray: FormArray) => {
        while (formArray.length !== 0) {
            formArray.removeAt(0)
        }
    }

    private setItemFormArray(array: any[], formControl: string) {
        if (array !== undefined && array.length) {
            const itemFGs = array.map(item => this.fb.group(item));
            const itemFormArray = this.fb.array(itemFGs);
            this.investigateForm.setControl(formControl, itemFormArray);
        }
    }

    private async onDelete() {
        this.swalFnMulti('', Message.confirmAction, 'warning')
            .then((result) => {
                if (result.value) {
                    this.s_invest.InvestigateupdDelete(this.investCode)
                        .takeUntil(this.destroy$)
                        .subscribe(x => {
                            if (this.checkIsSuccess(x)) {
                                this.swalFn('', Message.delComplete, 'success');
                                this.router.navigate(['/investigation/list']);
                            } else {
                                this.swalFn('', Message.delFail, 'error');
                            }
                        })
                }
            })

    }

    private updateInvestigate(form: any) {
        // const dateStart = getDateMyDatepicker(invest.DateStart);
        // const dateEnd = getDateMyDatepicker(invest.DateEnd);
        // invest.DateStart = setZeroHours(dateStart);
        // invest.DateEnd = setZeroHours(dateEnd);

        const timeStart = form.TIME_START;
        const timeEnd = form.TIME_END;
        const dateTimeStart = form.DATE_START.date.year + "-" + setZero(form.DATE_START.date.month) + "-" + setZero(form.DATE_START.date.day) + " " + timeStart + ":00.000";
        const dateTimeEnd = form.DATE_END.date.year + "-" + setZero(form.DATE_END.date.month) + "-" + setZero(form.DATE_END.date.day) + " " + timeEnd + ":00.000";
        const invest = {
            INVESTIGATE_ID: this.investId,
            INVESTIGATE_CODE: form.INVESTIGATE_CODE,
            INVESTIGATE_NO: form.INVESTIGATE_NO,
            INVESTIGATE_NO_YEAR: form.INVESTIGATE_NO_YEAR,
            DATE_START: dateTimeStart,
            DATE_END: dateTimeEnd,
            SUBJECT: form.SUBJECT,
            IS_ACTIVE: form.IS_ACTIVE,
            InvestigateDetail: this.investigateDetail
        }

        console.log(invest)
        this.s_invest.InvestigateupdByCon(invest)
            .takeUntil(this.destroy$)
            .subscribe(x => {
                if (this.checkIsSuccess(x)) {
                    this.swalFnMulti('', Message.saveComplete, 'success')
                        .then(async (result) => {
                            if (result.value) {
                                this.pageLoad();
                                //   this.router.navigate(['/investigation/list']);
                            }
                        });
                } else {
                    this.swalFn('', Message.saveFail, 'error');
                }
            }, (error) => this.catchError(error));
    }


    private dbDateFormat(date) {
        if (date.date) {
            return moment(`${date.date.year}-${date.date.month}-${date.date.day}`).format('DD-MMM-YYYY');
        }
        return date ? moment(date).format('DD-MMM-YYYY') : '';
    }

    public clickCancel() {
        this.swalFn('', Message.confirmAction, 'warning')
            .then((result) => {
                if (result.value) {
                    this.router.navigate([`/investigation/list`]);

                }
            })
    }

    clickPrint() {
        this.modal = this.ngbModel.open(this.printDocModal, { size: 'lg', centered: true })
    }

}
