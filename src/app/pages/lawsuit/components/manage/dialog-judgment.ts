import { Component } from "@angular/core";
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { LawsuitService } from "../../lawsuit.service";
import { ActivatedRoute } from "@angular/router";
import { PreloaderService } from "../../../../shared/preloader/preloader.component";
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable, BehaviorSubject, of, merge } from "rxjs";
import { FormGroup, FormBuilder, FormControl, FormArray } from "@angular/forms";
import { every } from 'rxjs/operators';
import * as moment from 'moment-timezone';
import {
    PaymentBank,
    PaymentChannel,
    PaymentDueUnit
} from "../../models/lawsuit"

import {
    setZero,
    setDateMyDatepicker,
    getDateMyDatepicker,
    convertDateForSave
} from '../../../../config/dateFormat';
import { IMyDpOptions } from "mydatepicker";
import swal from 'sweetalert2';

@Component({
    selector: 'dialog-judgment',
    templateUrl: 'dialog-judgment.html',
    styleUrls: ['./dialog-judgment.scss']
})

export class DialogJudgment {
    public LawsuitDetailFG: FormGroup;
    public LawsuitPaymentGet: any[] = [];
    public editMode = false;
    public LawsuitID: string;
    public validStatus = false;
    public isPayAll = null;
    public COURT_ALL: any[] = [];
    public arrestData = [];
    public MasCourtList: any = []
    public SearchMasCourtList = []
    public lawsuitArrestFormDialog: any = {}
    public LawsuitArrest: any = [];
    public PaymentBank = PaymentBank;
    public PaymentChannel = PaymentChannel;
    public PaymentDueUnit = PaymentDueUnit;
    public PAYMENT_CHANNEL_TEXT = 'โอนเงินอิเล็กทรอนิกส์';
    public PAYMENT_DELETE: any[] = [];
    public BANK: any[] = [];

    isReq_fine = new BehaviorSubject<Boolean>(false);
    isReq_payfine = new BehaviorSubject<Boolean>(false);
    isReq_payRefNo = new BehaviorSubject<Boolean>(false);

    disableFine: boolean;
    disablePayOne: boolean;
    disablePayTwo: boolean;
    showEditField: boolean = false;

    WarnPaymentPeriod: any = new Object();
    isChk_CourtDis = new BehaviorSubject<Boolean>(false);
    isChk_Fine = new BehaviorSubject<Boolean>(false);
    isChk_Prison = new BehaviorSubject<Boolean>(false);

    CourtDismissAll: any = {
        CourtDismissal: null,
        ImprisonTime: false,
        ImprisonUnit: true,
        NoBlack: null,
        YearBlack: null,
        NoRed: null,
        YearRed: null,
        JudgementDate: true,
        JudgementTime: true,
        payOnceRadio1: null,
        payOnceRadio2: null,
        disableRadio1: null
    };

    private today = new Date();

    public LawsuitDateOptions: IMyDpOptions = {
        editableDateField: false,
        dateFormat: 'dd mmm yyyy',
        showClearDateBtn: true,
        height: '30px',
    };

    showPreloader = new BehaviorSubject<Boolean>(false);

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private lawsuitService: LawsuitService,
        public dialog: MatDialog,
        private activatedRoute: ActivatedRoute,
        private dialogRef: MatDialogRef<DialogJudgment>,
        private preLoaderService: PreloaderService,
        private fb: FormBuilder
    ) {
        this.createFromLawDetail();
    }
    public toDateTZ(date: any) {
        return `${moment(date).format('YYYY-MM-DD HH:mm:ss.ms')}`;
    }

    get LawsuitPayment(): FormArray {
        return this.LawsuitDetailFG.get('LawsuitPayment') as FormArray;
    }

    async ngOnInit() {
        this.showPreloader.next(true);
        this.LawsuitDateOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];
        this.activeRoute();
        this.COURT_ALL = await this.getMasCourt();
        await this.getBank();
        await this.mergeInputData2from(this.data);
        this.showPreloader.next(false);
    }

    activeRoute() {
        this.activatedRoute.queryParams.subscribe(
            params => {
                this.LawsuitID = params.LawsuitID;
            }
        );
    }

    createFromLawDetail() {
        this.LawsuitDetailFG = this.fb.group({
            COURT_ID: new FormControl(""),
            COURT_NAME: new FormControl(""),
            DECIDE_NO_1: new FormControl(""),
            DECIDE_NO_2: new FormControl(""),
            DECIDE_NO_YEAR_1: new FormControl(""),
            DECIDE_NO_YEAR_2: new FormControl(""),
            FINE: new FormControl(""),
            FINE_DATE: new FormControl(""),
            IMPRISON_TIME: new FormControl(""),
            IMPRISON_TIME_UNIT: new FormControl(""),
            INDICTMENT_DETAIL_ID: new FormControl(""),
            IS_ACTIVE: new FormControl(""),
            IS_DISMISS: new FormControl(""),
            IS_FINE: new FormControl(""),
            IS_IMPRISON: new FormControl(""),
            IS_PAYONCE: new FormControl(""),
            JUDGEMENT_DATE: new FormControl(""),
            JUDGEMENT_NO: new FormControl(""),
            JUDGEMENT_NO_YEAR: new FormControl(""),
            LAWSUIT_DETAIL_ID: new FormControl(""),
            LAWSUIT_END: new FormControl(""),
            LAWSUIT_ID: new FormControl(""),
            LAWSUIT_TYPE: new FormControl(""),
            PAYMENT_BANK: new FormControl("006"),
            PAYMENT_CHANNEL: new FormControl(8),
            PAYMENT_DATE: new FormControl(""),
            PAYMENT_PERIOD: new FormControl(""),
            PAYMENT_PERIOD_DUE: new FormControl(""),
            PAYMENT_PERIOD_DUE_UNIT: new FormControl(""),
            PAYMENT_REF_NO: new FormControl(""),
            UNDECIDE_NO_1: new FormControl(""),
            UNDECIDE_NO_2: new FormControl(""),
            UNDECIDE_NO_YEAR_1: new FormControl(""),
            UNDECIDE_NO_YEAR_2: new FormControl(""),
            UNJUDGEMENT_NO: new FormControl(""),
            UNJUDGEMENT_NO_YEAR: new FormControl(""),
            LawsuitPayment: this.fb.array([]),

            //======= Customs =======//
            PAYMENT_CHANNEL_TEXT: new FormControl(""),
            A_EntityType: new FormControl(""),
            A_LawbreakerType: new FormControl(""),
            A_LawsuitNoRef: new FormControl(""),
            A_LawBrakerFullName: new FormControl("")
        })
    }

    private createLawsuitPaymentForm(): FormGroup {
        return this.fb.group({
            COMPARE_DETAIL_ID: new FormControl(""),
            FINE: new FormControl(""),
            FINE_TYPE: new FormControl(""),
            IS_ACTIVE: new FormControl(""),
            IS_REQUEST_REWARD: new FormControl(""),
            LAWSUIT_DETAIL_ID: new FormControl(""),
            PAYMENT_CHANNEL: new FormControl(8),
            PAYMENT_BANK: new FormControl("006"),
            PAYMENT_REF_NO: new FormControl(""),
            LawsuitPaymentDetail: this.fb.array([]),
            PAYMENT_DATE: new FormControl(""),
            PAYMENT_ID: new FormControl(""),
            PAYMENT_PERIOD_NO: new FormControl(""),

            //======= Customs =======//
            PAYMENT_CHANNEL_TEXT: new FormControl(this.PAYMENT_CHANNEL_TEXT)

        })
    }

    async mergeInputData2from(data: any) {
        console.log('data : ', data)

        let d = this.CourtDismissAll;
        this.showEditField = data['JudgmentEditField'];

        ///=== reset LawsuitDetailForm ===///
        this.LawsuitDetailFG.reset(data.lawsuitArrest);

        ///=== set Lawsuit payment & Detail ===
        this.LawsuitPaymentGet = await this.lawsuitService.LawsuitPaymentgetByCon(data.lawsuitArrest.LAWSUIT_DETAIL_ID || 0);

        // //=== disable RadioPayOnce ===///
        // if (this.LawsuitPaymentGet.length > 1)
        //     d.disableRadio1 = true;

        let LawsuitPaymentGetResult: any[] = [];

        LawsuitPaymentGetResult = this.LawsuitPaymentGet.length
            ? this.LawsuitPaymentGet
            : data.lawsuitArrest.LawsuitPayment;

        const IS_NEWPAYMENT = this.LawsuitPaymentGet.length
            ? false
            : true;

        LawsuitPaymentGetResult.sort((a, b) =>
            a.PAYMENT_PERIOD_NO - b.PAYMENT_PERIOD_NO);

        let control = <FormArray>this.LawsuitDetailFG.controls.LawsuitPayment;

        LawsuitPaymentGetResult.map(m => {
            control.push(this.fb.group({
                COMPARE_DETAIL_ID: new FormControl(m.COMPARE_DETAIL_ID),
                FINE: new FormControl(m.FINE ? this.AddComma(parseFloat(m.FINE).toFixed(2)) : ''),
                FINE_TYPE: new FormControl(m.FINE_TYPE),
                IS_ACTIVE: new FormControl(m.IS_ACTIVE),
                IS_REQUEST_REWARD: new FormControl(m.IS_REQUEST_REWARD),
                LAWSUIT_DETAIL_ID: new FormControl(m.LAWSUIT_DETAIL_ID),
                PAYMENT_CHANNEL: new FormControl(m.PAYMENT_CHANNEL),
                PAYMENT_BANK: new FormControl(m.PAYMENT_BANK),
                PAYMENT_REF_NO: new FormControl(m.PAYMENT_REF_NO == 'null' ? '' : m.PAYMENT_REF_NO),
                PAYMENT_DATE: new FormControl(m.PAYMENT_DATE ? setDateMyDatepicker(m.PAYMENT_DATE) : null),
                PAYMENT_ID: new FormControl(m.PAYMENT_ID),
                PAYMENT_PERIOD_NO: new FormControl(m.PAYMENT_PERIOD_NO),
                IS_REVENUE: new FormControl(m.IS_REVENUE),
                LawsuitPaymentDetail: this.setLawsuitPaymentDtl(m.LawsuitPaymentDetail),

                /** customs */
                IS_NEWPAYMENT: new FormControl(IS_NEWPAYMENT),
                CAN_EDIT: new FormControl(this.CanEditPayment(m.LawsuitPaymentDetail)),
                PAYMENT_CHANNEL_TEXT: new FormControl(this.PAYMENT_CHANNEL_TEXT)

            }))
        })

        ///=== patchValue Court ===///
        const COURT_ID = this.LawsuitDetailFG.controls['COURT_ID'].value;
        let court: any = new Object();
        court.COURT_ID = '';
        court.COURT_NAME = '';
        this.COURT_ALL
            .filter(f => f.COURT_ID == COURT_ID)
            .map(m => {
                court.COURT_ID = m.COURT_ID
                court.COURT_NAME = m.COURT_NAME
            })
        this.LawsuitDetailFG.patchValue({
            COURT_ID: court.COURT_ID,
            COURT_NAME: court.COURT_NAME
        });

        ///=== set IS_DISMISS ===/// 
        const IS_DISMISS = this.LawsuitDetailFG.controls['IS_DISMISS'].value;

        IS_DISMISS == 1 ?
            this.isChk_CourtDis.next(true)
            : this.isChk_CourtDis.next(false);

        ///=== set IS_FINE ===/// 
        const IS_FINE = this.LawsuitDetailFG.controls['IS_FINE'].value;
        switch (IS_FINE) {
            case 1:
                this.isChk_Fine.next(true);
                this.disableFine = true;
                d.CourtDismissal = true;
                break;
            case 2:
                this.isChk_Fine.next(true);
                this.disableFine = true;
                d.CourtDismissal = true;
                break;
            default:
                this.isChk_Fine.next(false);
                this.disableFine = false;
                break;
        }

        ///=== set IS_PAYONCE ===/// 
        const IS_PAYONCE = this.LawsuitDetailFG.controls['IS_PAYONCE'].value;
        switch (IS_PAYONCE) {
            case 0:
                this.disablePayOne = false;
                this.disablePayTwo = true;
                d.payOnceRadio1 = false;
                d.payOnceRadio2 = true;
                break;
            case 1:
                this.disablePayOne = true
                this.disablePayTwo = false;
                d.payOnceRadio1 = true;
                d.payOnceRadio2 = false;
                break;
            default:
                this.disablePayOne = false;
                this.disablePayTwo = false;
                d.payOnceRadio1 = false;
                d.payOnceRadio2 = false;
                // d.payOnceRadio = 0;
                break;
        }

        ///=== set IS_IMPRISON ===/// 
        const IS_IMPRISON = this.LawsuitDetailFG.controls['IS_IMPRISON'].value;
        switch (IS_IMPRISON) {
            case 0:
                // d.isPrison = true;
                d.ImprisonTime = true;
                break;
            case 1:
                // d.isPrison = false;
                d.ImprisonTime = false;
                d.CourtDismissal = true;
                break;
            default:
                break;
        }

        /** set LawsuitDetailFG */
        ///=== slice dateTime for Year ===///
        let lawsuitDtail = this.LawsuitDetailFG.controls;
        ///UNDECIDE_NO_YEAR_1
        let UNDECIDE_NO_YEAR_1 = lawsuitDtail['UNDECIDE_NO_YEAR_1'].value;
        UNDECIDE_NO_YEAR_1 = UNDECIDE_NO_YEAR_1 ? UNDECIDE_NO_YEAR_1.slice(0, 4) : "";
        lawsuitDtail['UNDECIDE_NO_YEAR_1'].setValue(UNDECIDE_NO_YEAR_1);
        ///DECIDE_NO_YEAR_1
        let DECIDE_NO_YEAR_1 = lawsuitDtail['DECIDE_NO_YEAR_1'].value;
        DECIDE_NO_YEAR_1 = DECIDE_NO_YEAR_1 ? DECIDE_NO_YEAR_1.slice(0, 4) : "";
        lawsuitDtail['DECIDE_NO_YEAR_1'].setValue(DECIDE_NO_YEAR_1);
        ///UNDECIDE_NO_YEAR_2
        let UNDECIDE_NO_YEAR_2 = lawsuitDtail['UNDECIDE_NO_YEAR_2'].value;
        UNDECIDE_NO_YEAR_2 = UNDECIDE_NO_YEAR_2 ? UNDECIDE_NO_YEAR_2.slice(0, 4) : "";
        lawsuitDtail['UNDECIDE_NO_YEAR_2'].setValue(UNDECIDE_NO_YEAR_2);
        ///DECIDE_NO_YEAR_2
        let DECIDE_NO_YEAR_2 = lawsuitDtail['DECIDE_NO_YEAR_2'].value;
        DECIDE_NO_YEAR_2 = DECIDE_NO_YEAR_2 ? DECIDE_NO_YEAR_2.slice(0, 4) : "";
        lawsuitDtail['DECIDE_NO_YEAR_2'].setValue(DECIDE_NO_YEAR_2);
        ///UNJUDGEMENT_NO_YEAR
        let UNJUDGEMENT_NO_YEAR = lawsuitDtail['UNJUDGEMENT_NO_YEAR'].value;
        UNJUDGEMENT_NO_YEAR = UNJUDGEMENT_NO_YEAR ? UNJUDGEMENT_NO_YEAR.slice(0, 4) : "";
        lawsuitDtail['UNJUDGEMENT_NO_YEAR'].setValue(UNJUDGEMENT_NO_YEAR);
        ///JUDGEMENT_NO_YEAR
        let JUDGEMENT_NO_YEAR = lawsuitDtail['JUDGEMENT_NO_YEAR'].value;
        JUDGEMENT_NO_YEAR = JUDGEMENT_NO_YEAR ? JUDGEMENT_NO_YEAR.slice(0, 4) : "";
        lawsuitDtail['JUDGEMENT_NO_YEAR'].setValue(JUDGEMENT_NO_YEAR);
        ///JUDGEMENT_DATE
        let JUDGEMENT_DATE = lawsuitDtail['JUDGEMENT_DATE'].value;
        JUDGEMENT_DATE = JUDGEMENT_DATE ? setDateMyDatepicker(JUDGEMENT_DATE) : "";
        lawsuitDtail['JUDGEMENT_DATE'].setValue(JUDGEMENT_DATE);
        // FINE_DATE
        let FINE_DATE = lawsuitDtail['FINE_DATE'].value;
        FINE_DATE = FINE_DATE ? setDateMyDatepicker(FINE_DATE) : "";
        lawsuitDtail['FINE_DATE'].setValue(FINE_DATE);

        // FINE
        let FINE = lawsuitDtail['FINE'].value;
        FINE = FINE ? this.AddComma(parseFloat(this.removeComma(FINE)).toFixed(2)) : "";
        lawsuitDtail['FINE'].setValue(FINE);

        console.log(' merge.LawsuitDetailFG.getRawValue() : ', this.LawsuitDetailFG.getRawValue())
    }

    setLawsuitPaymentDtl(value: any): FormArray {
        let PaymentDtl = new FormArray([])
        value.map(m => {
            PaymentDtl.push(this.fb.group(m))
        })
        return PaymentDtl;
    }

    EventChangeAll(e: Event) {
        const target = e.target as HTMLInputElement;
        let d = this.CourtDismissAll;
        //######## CourtDismissal #########
        if (target.id === 'CourtDismissal') {
            this.isChk_CourtDis.next(target.checked);

            ///=== set disable ===///
            d.ImprisonTime = target.checked;
            d.ImprisonUnit = target.checked;

            d.NoBlack = target.checked;
            d.YearBlack = target.checked;
            d.NoRed = target.checked;
            d.YearRed = target.checked;
            d.JudgementDate = target.checked;
            d.JudgementTime = target.checked;
            d.fine = target.checked;
            d.isPrison = target.checked;

            ///=== set IS_DISMISS ===///
            this.isChk_CourtDis
                .subscribe(s => {
                    let temp: number;
                    s.valueOf() ? temp = 1 : temp = 0
                    this.LawsuitDetailFG.controls['IS_DISMISS'].setValue(temp)
                })

            ///=== set dismissAll ===//
            this.disableFine = false
            this.isChk_Fine.next(false);
            this.LawsuitDetailFG.controls['IS_FINE'].setValue("");

            this.disablePayOne = false;
            this.disablePayTwo = false;
            this.LawsuitDetailFG.controls['IS_PAYONCE'].setValue("");

            this.LawsuitDetailFG.controls['IS_IMPRISON'].setValue("");
            this.LawsuitDetailFG.controls['IMPRISON_TIME'].setValue("");
            d.ImprisonTime = true;
        }

        //######## isPrison #########
        if (target.id === 'isPrison') {
            this.isChk_Prison.next(target.checked);
            d.ImprisonTime = !target.checked;
            d.ImprisonUnit = !target.checked;
            // d.CourtDismissal = !d.isPrison;
            let temp: number;
            target.checked ? temp = 1 : temp = 0;
            this.LawsuitDetailFG.controls['IS_IMPRISON'].setValue(temp);
            this.LawsuitDetailFG.controls['IMPRISON_TIME'].setValue("");
            merge(of(this.isChk_Fine, this.isChk_Prison)
                .map(m => m = m)
                .pipe(every(e => e.getValue() == false)))
                .subscribe(s => d.CourtDismissal = !s)
        }

        //######## fine #########
        if (target.id === 'fine') {
            this.isChk_Fine.next(target.checked);
            this.disableFine = target.checked;
            merge(of(this.isChk_Fine, this.isChk_Prison)
                .map(m => m = m)
                .pipe(every(e => e.getValue() == false)))
                .subscribe(s => d.CourtDismissal = !s)
            ///=== set IS_DISMISS ===///
            this.isChk_Fine
                .subscribe(s => {
                    let isChk_Fine: number;
                    s.valueOf() ? isChk_Fine = 1 : isChk_Fine = 0;
                    this.LawsuitDetailFG.controls['IS_FINE'].setValue(isChk_Fine);
                    isChk_Fine == 0 ? this.LawsuitDetailFG.controls['IS_PAYONCE'].setValue("") : false;
                });
        }
        ///=== set Is Payonce ===///
        if (target.id === 'payRadio1') {
            this.disablePayOne = target.checked;
            this.disablePayTwo = !target.checked;
            this.LawsuitDetailFG.controls['IS_PAYONCE'].setValue(1);

            switch (this.LawsuitPaymentGet.length) {
                case 0:
                    let arr: any[] = [];
                    this.setLawsuitPaymentDetail()
                        .getRawValue()
                        .map(m => arr.push(m))
                    this.clearFormArray(this.LawsuitPayment);
                    let control = <FormArray>this.LawsuitDetailFG.controls.LawsuitPayment;
                    control.push(this.fb.group({
                        COMPARE_DETAIL_ID: new FormControl(""),
                        FINE: new FormControl(""),
                        FINE_TYPE: new FormControl(0),
                        IS_ACTIVE: new FormControl(1),
                        IS_REQUEST_REWARD: new FormControl(0),
                        LAWSUIT_DETAIL_ID: new FormControl(this.data.lawsuitArrest.LAWSUIT_DETAIL_ID),
                        PAYMENT_CHANNEL: new FormControl(8),
                        PAYMENT_BANK: new FormControl("006"),
                        PAYMENT_REF_NO: new FormControl(""),
                        LawsuitPaymentDetail: this.fb.array(arr),
                        PAYMENT_DATE: new FormControl(""),
                        PAYMENT_ID: new FormControl(""),
                        PAYMENT_PERIOD_NO: new FormControl(1),
                        IS_REVENUE: new FormControl(0),
                        IS_NEWPAYMENT: new FormControl(true),

                        /** customs */
                        CAN_EDIT: new FormControl(false),
                        PAYMENT_CHANNEL_TEXT: new FormControl(this.PAYMENT_CHANNEL_TEXT)

                    }))
                    this.LawsuitDetailFG.get('PAYMENT_PERIOD').setValue(control.length);

                    break;
                default:
                    break;
            }
        }
        if (target.id === 'payRadio2') {
            this.disablePayTwo = target.checked;
            this.disablePayOne = !target.checked;
            this.LawsuitDetailFG.controls['IS_PAYONCE'].setValue(0);

        }
    }

    CanEditPayment(LawsuitPaymentDetail: any[] = []) {
        let result: boolean = false;
        if (LawsuitPaymentDetail.length)
            result = LawsuitPaymentDetail.every(e => e.IS_REQUEST_BRIBE == 1);
        return result as boolean;
    }

    serachCourt = (text3$: Observable<string>) =>
        text3$
            .debounceTime(200)
            .distinctUntilChanged()
            .map(term => term === '' ? []
                : this.COURT_ALL
                    .filter(v =>
                        (`${v.COURT_NAME || ''}`
                            .toLowerCase()
                            .indexOf(term
                                .toLowerCase()) > -1))
                    .slice(0, 10));

    formatterCourt = (x: { COURT_NAME: string }) => x.COURT_NAME

    selectItemCourt = (e: any) =>
        this.LawsuitDetailFG.patchValue({
            COURT_ID: e.item.COURT_ID,
            COURT_NAME: e.item.COURT_NAME
        });

    getMasCourt = () => this.lawsuitService.MasCourtgetByConAdv('', '');

    async getBank() {
        await this.lawsuitService.InquiryBank().then(bank => {
            if (bank['ResponseMessage'] == "SUCCESS") {
                if (bank['ResponseData'].length) {
                    this.BANK = bank['ResponseData'];
                } else this.BANK = [];
            } else this.BANK = [];
        })
    }

    formatterBank = (x: { BANK_NAME: string }) => `${x.BANK_NAME || ''}`;

    serachBank = (text3$: Observable<string>) =>
        text3$
            .debounceTime(200)
            .distinctUntilChanged()
            .map(term => term === '' ? []
                : this.BANK
                    .filter(v =>
                        (`${v.BANK_NAME || ''} `
                            .toLowerCase()
                            .indexOf(term.toLowerCase()) > -1)
                    ).slice(0, 10));

    selectItemBank(e: any, index: number) {
        const o = e.item;
        let control = <FormArray>this.LawsuitDetailFG.controls.LawsuitPayment;
        control.at(index).patchValue({
            PAYMENT_BANK: o['BANK_CODE']
        });
    }

    deleteBank(e: any, index: number) {
        if (!e.value) {
            let control = <FormArray>this.LawsuitDetailFG.controls.LawsuitPayment;
            control.at(index).patchValue({
                PAYMENT_BANK: ''
            });
        }
    }

    getBankName(PAYMENT_BANK) {
        const o = this.BANK.find(f => f.BANK_CODE == PAYMENT_BANK);
        return o ? o.BANK_NAME : '';
    }

    closePopup = () => this.dialogRef.close();

    setDataBeforSubmit() {
        let f = Object.freeze(this.LawsuitDetailFG.getRawValue());

        f = { ...f };

        if (!parseFloat(f['FINE'])) {
            swal({
                text: 'กรุณาระบุข้อมูล "สั่งปรับเป็นจำนวนเงิน"',
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'ตกลง'
            });
            this.isReq_fine.next(true);
            return;
        }

        const pay = f['LawsuitPayment'];
        if (pay.length) {
            const r = pay.filter(f => !parseFloat(f['PAYMENT_REF_NO'])).length;
            if (r > 0) {
                swal({
                    text: 'กรุณาระบุข้อมูล "เลขที่เช็ค/เลขที่บัญชี"',
                    type: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'ตกลง'
                });
                this.isReq_payRefNo.next(true);
                return;
            }

            const o = pay.filter(f => !parseFloat(f['FINE'])).length;
            if (o > 0) {
                swal({
                    text: 'กรุณาระบุข้อมูล "มูลค่าเช็คจากศาล"',
                    type: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'ตกลง'
                });

                this.isReq_payfine.next(true);
                return;
            }
        }

        switch (this.LawsuitID) {
            case '0':
                f.UNDECIDE_NO_YEAR_1 = this.setFormatYearAll(f.UNDECIDE_NO_YEAR_1);
                f.DECIDE_NO_YEAR_1 = this.setFormatYearAll(f.DECIDE_NO_YEAR_1);
                f.UNDECIDE_NO_YEAR_2 = this.setFormatYearAll(f.UNDECIDE_NO_YEAR_2);
                f.DECIDE_NO_YEAR_2 = this.setFormatYearAll(f.DECIDE_NO_YEAR_2);
                f.UNJUDGEMENT_NO_YEAR = this.setFormatYearAll(f.UNJUDGEMENT_NO_YEAR);
                f.JUDGEMENT_NO_YEAR = this.setFormatYearAll(f.JUDGEMENT_NO_YEAR);
                f.JUDGEMENT_DATE = this.setFormatTimeAll(f.JUDGEMENT_DATE);
                f.FINE_DATE = this.setFormatTimeAll(f.FINE_DATE);
                f.FINE = f.FINE ? parseFloat(this.removeComma(f.FINE)) : '';
                f.PAYMENT_DELETE = this.PAYMENT_DELETE;
                f.LawsuitPayment.map(m => {
                    m.PAYMENT_DATE = this.setFormatTimeAll(m.PAYMENT_DATE);
                    m.FINE = this.removeComma(m.FINE);
                })
                break;

            default:
                f.UNDECIDE_NO_YEAR_1 = this.setFormatYearAll(f.UNDECIDE_NO_YEAR_1);
                f.DECIDE_NO_YEAR_1 = this.setFormatYearAll(f.DECIDE_NO_YEAR_1);
                f.UNDECIDE_NO_YEAR_2 = this.setFormatYearAll(f.UNDECIDE_NO_YEAR_2);
                f.DECIDE_NO_YEAR_2 = this.setFormatYearAll(f.DECIDE_NO_YEAR_2);
                f.UNJUDGEMENT_NO_YEAR = this.setFormatYearAll(f.UNJUDGEMENT_NO_YEAR);
                f.JUDGEMENT_NO_YEAR = this.setFormatYearAll(f.JUDGEMENT_NO_YEAR);
                f.JUDGEMENT_DATE = this.setFormatTimeAll(f.JUDGEMENT_DATE);
                f.FINE_DATE = this.setFormatTimeAll(f.FINE_DATE);
                f.FINE = f.FINE ? parseFloat(this.removeComma(f.FINE)) : '';
                f.PAYMENT_DELETE = this.PAYMENT_DELETE;
                f.LawsuitPayment.map(m => {
                    m.PAYMENT_DATE = this.setFormatTimeAll(m.PAYMENT_DATE);
                    m.FINE = this.removeComma(m.FINE);
                })
                break;
        }

        ////### Filter LawsuitPayment check Null 5 field Living on UI ###////
        const FieldOfCheck = ['PAYMENT_DATE', 'FINE', 'PAYMENT_CHANNEL', 'PAYMENT_BANK', 'PAYMENT_REF_NO'];
        f.LawsuitPayment = f.LawsuitPayment.filter(f => {
            let temp: any[] = [];
            for (let field$ of FieldOfCheck) {
                if (f[`${field$}`] === "") temp.push(true);
                else temp.push(false);
            }
            return !temp.every(e => e == true);
        })

        // ////### Set Payment_Period Length After Reduce LawsuitPayment ###////
        // f.PAYMENT_PERIOD = f.LawsuitPayment.length;

        this.Submit(f);
    }

    Submit(f: any) {
        const object = new Object();
        Object.defineProperties(object, {
            index: {
                value: this.data.index,
                writable: true
            },
            LawsuitDetailFG: {
                value: Object.assign(f),
                writable: true
            },
        });
        this.dialogRef.close(object);
    }

    setFormatYearAll = (year: any) => {
        if (year == "") {
            return ""
        } else {
            let m = setZero((this.today).getMonth() + 1);
            let d = setZero((this.today).getDate());
            let h = setZero((this.today).getHours());
            let min = setZero((this.today).getMinutes());
            const seted = this.toDateTZ(`${year}-${m}-${d} ${h}:${min}`);
            return seted;
        }
    }

    setFormatTimeAll = (deteTime: any) => {
        if (!deteTime) {
            return ""
        } else {
            let h = setZero((this.today).getHours());
            let min = setZero((this.today).getMinutes());
            let temp = convertDateForSave(getDateMyDatepicker(deteTime)).slice(0, 10);
            const seted = this.toDateTZ(`${temp} ${'00'}:${'00'}.000`);
            return seted;
        }
    }

    addPaymentPeriod(PaymentPeriod: any) {
        this.WarnPaymentPeriod.MsgShow = false;
        this.WarnPaymentPeriod.limit = 72;
        this.WarnPaymentPeriod.Msg = `จำนวนงวดไม่เกิน ${this.WarnPaymentPeriod.limit} งวด`;
        let index = parseInt(PaymentPeriod.value) as number;
        index = index ? index : 1;
        index = index >= 1 ? index : 1;
        let control = <FormArray>this.LawsuitDetailFG.controls.LawsuitPayment;
        if (index <= this.WarnPaymentPeriod.limit) {
            this.WarnPaymentPeriod.MsgShow = false;
            let arr = new FormArray([])
            this.setLawsuitPaymentDetail()
                .getRawValue()
                .map(m => arr.push(this.fb.group(m)));
            control.push(this.fb.group({
                COMPARE_DETAIL_ID: new FormControl(""),
                FINE: new FormControl(""),
                FINE_TYPE: new FormControl(0),
                IS_ACTIVE: new FormControl(1),
                IS_REQUEST_REWARD: new FormControl(0),
                LAWSUIT_DETAIL_ID: new FormControl(this.data.lawsuitArrest.LAWSUIT_DETAIL_ID),
                PAYMENT_CHANNEL: new FormControl(8),
                PAYMENT_BANK: new FormControl("006"),
                PAYMENT_REF_NO: new FormControl(""),
                LawsuitPaymentDetail: this.fb.array(arr.getRawValue()),
                PAYMENT_DATE: new FormControl(""),
                PAYMENT_ID: new FormControl(""),
                PAYMENT_PERIOD_NO: new FormControl(control.length + 1),
                IS_REVENUE: new FormControl(0),
                IS_NEWPAYMENT: new FormControl(true),

                /** customs */
                CAN_EDIT: new FormControl(false),
                PAYMENT_CHANNEL_TEXT: new FormControl(this.PAYMENT_CHANNEL_TEXT)

            }))

            // this.LawsuitDetailFG.get('PAYMENT_PERIOD').setValue(control.length);
        } else {
            this.WarnPaymentPeriod.MsgShow = true;
            // this.LawsuitDetailFG.get('PAYMENT_PERIOD').setValue(1);
            this.setItemFormArray([this.createLawsuitPaymentForm().getRawValue()], 'LawsuitPayment', this.LawsuitDetailFG);
            setTimeout(() => {
                this.WarnPaymentPeriod.MsgShow = false;
            }, 4000);
        }
    }

    DeletePayment(item, index) {
        swal({
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
                if (item.value.IS_REVENUE == 0) {
                    if (item.value.PAYMENT_ID) {
                        this.PAYMENT_DELETE.push(item.value);
                    }
                    let control = <FormArray>this.LawsuitDetailFG.controls.LawsuitPayment;
                    control.removeAt(index);
                } else {
                    swal({
                        title: '',
                        text: "นำส่งรายได้แล้ว ไม่สามารถลบได้",
                        type: 'warning',
                        confirmButtonText: 'ตกลง',
                    })
                }
            }
        })
    }

    clearFormArray = (formArray: FormArray) => {
        while (formArray.length !== 0) {
            formArray.removeAt(0)
        }
    }

    setLawsuitPaymentDetail() {
        let lawsuitNotice = new FormArray([]);
        this.data.LawsuitNotice.map(m => {
            m.IS_ACTIVE = 1,
                m.IS_REQUEST_BRIBE = "",
                m.NOTICE_ID = m.NOTICE_ID,
                m.PAYMENT_DETAIL_ID = "",
                m.PAYMENT_ID = ""
            lawsuitNotice.push(this.fb.group(m))
        })

        return lawsuitNotice;
    }

    private setItemFormArray(array: any[], formControl: string, formGroup: FormGroup) {
        if (array !== undefined && array.length) {
            const itemFGs = array.map(item => this.fb.group(item));
            const itemFormArray = this.fb.array(itemFGs);
            formGroup.setControl(formControl, itemFormArray);
        }
    }

    public CreditNumericOnly(event): boolean {
        let patt = /^([0-9,-])$/;
        let result = patt.test(event.key);
        return result;
    }

    public DotNumericOnly(event): boolean {
        let patt = /^([0-9,.])$/;
        let result = patt.test(event.key);
        return result;
    }

    public NumericOnly(event): boolean {
        let patt = /^([0-9])$/;
        let result = patt.test(event.key);
        return result;
    }

    public AddComma(str) { /* Formate Number 9,999.00 */
        return ("" + str).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }

    public removeComma(value) {/* Remove comma , */
        var str = String(value);
        str = str.replace(/,/g, '');
        if (String(str) == 'NaN')
            return '0';
        else
            return str;
    }

    public getDisCurrDateMyDatePicker() {
        let currentdate = new Date();
        const disCurrDate = {
            begin: { year: currentdate.getFullYear(), month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 },
            end: { year: currentdate.getFullYear() + 100, month: currentdate.getMonth() + 1, day: currentdate.getDate() },
        }
        return disCurrDate;
    }

    public setDecimalLawsuitPayment(value: any, index: number, field: any) {
        let element = this.LawsuitPayment.at(index) as FormGroup;
        if (value)
            element.controls[`${field}`]
                .setValue(parseFloat(this.removeComma(value))
                    .toFixed(2));
    }

    public setDecimalLawsuitDetail(value: any, field: any) {
        let element = this.LawsuitDetailFG.controls;
        if (value)
            element[`${field}`]
                .setValue(parseFloat(this.removeComma(value))
                    .toFixed(2));
    }
}