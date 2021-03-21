import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavigationService } from '../../../shared/header-navigation/navigation.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NoticeService } from '../notice.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import { setZero, setDateMyDatepicker, getDateMyDatepicker, convertDateForSave } from '../../../config/dateFormat';
import { Message } from '../../../config/message';
import { NoticeProductFormControl } from '../notice-product';
import { NoticeDocument, Document, ImageDocument, FileType } from '../notice-document';
import { NoticeStaffFormControl } from '../notice-staff';
import { NoticeInformerFormControl } from '../notice-informer';
import { NoticeLocaleFormControl } from '../notice-locale';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import { SidebarService } from '../../../shared/sidebar/sidebar.component';
import { MainMasterService } from '../../../services/main-master.service';
import { TransactionRunningService } from 'app/services/transaction-running.service';
import swal from 'sweetalert2';
import { merge, from, forkJoin } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { ShareFunctions } from '../share/function';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-manage',
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']
})

export class ManageComponent extends ShareFunctions implements OnInit, OnDestroy {

    constructor(
        private activeRoute: ActivatedRoute,
        private suspectModalService: NgbModal,
        private router: Router,
        private fb: FormBuilder,
        private navService: NavigationService,
        private noticeService: NoticeService,
        private ngbModel: NgbModal,
        private preloader: PreloaderService,
        private sidebarService: SidebarService,
        private mainMasterService: MainMasterService,
        private preLoaderService: PreloaderService,
        private transactionRunningService: TransactionRunningService,
        private activatedRoute: ActivatedRoute,
    ) {
        super();
        this.active_route();
        this.createForm();
        // set false
        this.navService.setNewButton(false);
        this.navService.setSearchBar(false);
        this.navService.setInnerTextNextPageButton('งานจับกุม');
    }

    async ngOnInit() {
        this.sidebarService.setVersion('Notice 0.2.0.7');

        localStorage.setItem('programcode', 'ILG60-02-00');

        sessionStorage.removeItem("notice_form_data");

        this.myDatePickerOptions.disableDateRanges = [this.getDisCurrDateMyDatePicker()];

        this.months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

        this.activatedRoute.queryParams.subscribe(params => {
            this.actionFrom = params['from'];
        });

        this.preloader.setShowPreloader(true);

        let officeCode = localStorage.getItem("officeCode");

        await this.setOfficeStore('');

        await this.MasProductGroup();

        if (this.mode == 'R') {

            await this.getByCon(this.NOTICE_ID);
            this.showEditField = true;

        } else if (this.mode == "C") {

            this.showEditField = false;

            this.NoticeInformer.at(0).patchValue({
                InformerType: true
            });

            this.onChangeConceal();
            let e = { value: 1 };
            this.addNoticeDueDate(e);

            for (let l of this.typeheadOffice) {
                let code = l.OFFICE_CODE;
                if (officeCode == code) {
                    this.noticeForm.patchValue({
                        OFFICE_CODE: l.OFFICE_CODE || '-',
                        OFFICE_NAME: l.OFFICE_SHORT_NAME,
                        OFFICE_NAME_TEMP: l.OFFICE_SHORT_NAME,
                        OFFICE_ID: l.OFFICE_ID
                    });
                    break;
                }
            }

            let UserAccountID = localStorage.getItem("UserAccountID");
            await this.mainMasterService.MasStaff(UserAccountID, '').then(res =>
                this.typeheadStaff = res.RESPONSE_DATA || []
            )

            ///=== set staff ===///
            this.DisconID = false;
            this.seq2 = 1;
            this.seq3 = 2;
            this.setStaffOfindex(1);
        }

        if (this.actionFrom == "edit") {
            let res = JSON.parse(sessionStorage.getItem("notice_form_data"));
            if (res) {
                let noticeDate = res.NoticeDate;
                if (noticeDate) {
                    let date = noticeDate.date;
                    res.NoticeDate = date.year + "-" + this.months[date.month - 1] + "-" + date.day;
                }
                let noticeDueDate = res.NoticeDueDate;
                if (noticeDueDate) {
                    let date = noticeDueDate.date;
                    res.NoticeDueDate = date.year + "-" + this.months[date.month - 1] + "-" + date.day;
                }
                this.setDataInit(res);
            }
        }

        this.preloader.setShowPreloader(false);

        let url = this.router.url;
        let tmps = url.split("?");
        sessionStorage.setItem("notice_current_page", tmps[0] + "?from=edit");
    }

    checkingEditDelBtn(IsArrest) {
        if (IsArrest == 1) { this.editButton.next(false); this.deleteButton.next(false); }
        else if (IsArrest == 2) this.editButton.next(false);
        else this.editButton.next(true);
    }

    public active_route() {
        this.activeRoute.params.subscribe(p => {
            this.mode = p['mode'];
            if (p['mode'] === 'C') {
                this.printButton.next(false);
                this.editButton.next(false);
                this.deleteButton.next(false);
                this.cancelButton.next(true);
                this.saveButton.next(true);
                this.noticeCode = this.Auto_Generate;
                this.arrestCode = `TN-${(new Date).getTime()}`;
                this.localEditField = false;
            } else if (p['mode'] === 'R') {
                // Set Buuton Add Edit Delete Print Cancel
                this.printButton.next(true);
                this.editButton.next(true);
                this.deleteButton.next(true);
                this.cancelButton.next(false);
                this.saveButton.next(false);
                this.NOTICE_ID = p['code'];
                this.localEditField = true;

                // Set Action Collapse
                this.MasNotice.next(true);
                this.NoticeInfo.next(true);
                this.NoticeStf.next(true);
                this.NoticeLoc.next(true);
                this.NoticeProd.next(true);
                this.NoticeSusp.next(true);
                this.NoticeDoc.next(true);
            }
        });
    }

    async onclickSave() {
        let NOTICE_DATE = this.noticeForm.value.NOTICE_DATE;
        if (!NOTICE_DATE) {
            this.isRequired = true;
            this.isReq_NoticeDate.next(true);
            swal({
                text: 'กรุณาระบุข้อมูล "วันที่รับแจ้งความ"',
                type: 'warning',
                confirmButtonText: 'ตกลง',
            })
            return false;
        }

        const sDateCompare = getDateMyDatepicker(this.noticeForm.value.NOTICE_DATE);
        const eDateCompare = getDateMyDatepicker(this.noticeForm.value.NOTICE_DUE_DATE);
        if (sDateCompare.valueOf() > eDateCompare.valueOf()) {
            swal({
                text: '"วันที่รับแจ้งความ" ต้องไม่มากกว่า "สิ้นสุดวันที่"',
                type: 'warning',
                confirmButtonText: 'ตกลง'
            })
            return false;
        }

        let NOTICE_TIME_VALUE = this.noticeForm.value.NOTICE_TIME;
        if (!NOTICE_TIME_VALUE) {
            this.isRequired = true;
            this.isReq_NoticeDate.next(true);
            swal({
                text: 'กรุณาระบุข้อมูล "เวลา"',
                type: 'warning',
                confirmButtonText: 'ตกลง',
            })
            return false;
        }

        let NOTICE_TIME = this.noticeForm.controls.NOTICE_TIME;
        if (NOTICE_TIME.invalid) {
            this.isRequired = true;
            this.isReq_NoticeDate.next(true);
            swal({
                text: 'กรุณาระบุข้อมูล "เวลา hh:mm"',
                type: 'warning',
                confirmButtonText: 'ตกลง',
            })
            return false;
        }

        let NOTICE_DUE = this.noticeForm.value.NOTICE_DUE;
        if (!NOTICE_DUE) {
            this.isRequired = true;
            this.isReq_NoticeDue.next(true);
            swal({
                text: 'กรุณาระบุข้อมูล "ใช้ได้ภายในกำหนด(วัน)"',
                type: 'warning',
                confirmButtonText: 'ตกลง'
            })
            return false;
        }

        let OFFICE_NAME = this.noticeForm.value.OFFICE_NAME;
        if (!OFFICE_NAME) {
            this.isRequired = true;
            this.isReq_OffName.next(true);
            swal({
                text: 'กรุณาระบุข้อมูล "เขียนที่"',
                type: 'warning',
                confirmButtonText: 'ตกลง'
            })
            return false;
        }


        //################# NoticeStaff ####################
        let index: number = 0;
        index = this.DisconID ? 0 : 1;
        let FULL_NAME = this.NoticeStaff.value[index].FULL_NAME;
        if (!FULL_NAME) {
            this.isRequired = true;
            index == 0 ? this.isReq_Staff0.next(true) : this.isReq_Staff1.next(true);
            index == 0 ? this.isReq_Staff1.next(false) : this.isReq_Staff0.next(false);
            this.NoticeStf.next(true);
            swal({
                text: `กรุณาระบุข้อมูล "${this.getContributorID(index)}" `,
                type: 'warning',
                confirmButtonText: 'ตกลง'
            })
            return false;
        }

        //################# NoticeInformer ####################
        let FIRST_NAME = this.NoticeInformer.value[0].FIRST_NAME;
        if (!FIRST_NAME) {
            this.isRequired = true;
            this.isReq_fristName.next(true);
            this.NoticeInfo.next(true);
            swal({
                text: 'กรุณาระบุข้อมูล "ชื่อ(นามแฝง) ผู้แจ้ง"',
                type: 'warning',
                confirmButtonText: 'ตกลง'
            })
            return false;
        }

        let INFORMER_INFO = this.NoticeInformer.value[0].INFORMER_INFO;
        if (!INFORMER_INFO) {
            this.isRequired = true;
            this.isReq_informerInfo.next(true);
            this.NoticeInfo.next(true);
            swal({
                text: 'กรุณาระบุข้อมูล "รายละเอียดแจ้งความ"',
                type: 'warning',
                confirmButtonText: 'ตกลง'
            })
            return false;
        }

        //################# NoticeLocale ####################
        let LOCATION = this.NoticeLocale.value[0].LOCATION;
        if (!LOCATION) {
            this.isRequired = true;
            this.NoticeLoc.next(true);
            this.isReq_Local_Name.next(true);
            swal({
                text: `กรุณาระบุข้อมูล "สถานที่เกิดเหตุ"`,
                type: 'warning',
                confirmButtonText: 'ตกลง'
            })
            return false;
        }

        let SUB_DISTRICT_ID_LOCAL = this.NoticeLocale.value[0].SUB_DISTRICT_ID;
        if (!SUB_DISTRICT_ID_LOCAL) {
            this.isRequired = true;
            this.NoticeLoc.next(true);
            this.isReq_Local.next(true);
            swal({
                text: `กรุณาระบุข้อมูล "ตำบล/อำเภอ/จังหวัด"`,
                type: 'warning',
                confirmButtonText: 'ตกลง'
            })
            return false;
        }

        ///################# NoticeProduct ####################
        const PRODUCT: any = this.NoticeProduct.value;
        if (PRODUCT.length) {
            const PROD_NULL: boolean = PRODUCT.every(e => e.PRODUCT_GROUP_CODE != "" || null);
            if (!PROD_NULL) {
                this.isReq_Prod.next(!PROD_NULL);
                this.NoticeProd.next(true);
                swal({
                    text: `กรุณาระบุข้อมูล "หมวดสินค้า"`,
                    type: 'warning',
                    confirmButtonText: 'ตกลง'
                })
                return false;
            }
        }

        switch (this.mode) {
            case 'C':
                this.TransactionRunningHandling();
                break;
            case 'R':
                this.onReviced();
                break;
        }
    }

    async TransactionRunningHandling() {
        this.preloader.setShowPreloader(true);
        await this.transactionRunningService.TransactionRunninggetByCon_ph2("OPS_NOTICE", this.officeCode).then(async item => {
            if (item.length == 0) {
                this.TransactionRunninginsAll();
            } else {
                await this.transactionRunningService.TransactionRunningupdByCon_ph2(item[0].RUNNING_ID).then(async res => {
                    if (res.IsSuccess) {
                        let str = "" + item[0].RUNNING_NO;
                        var pad = "00000";
                        const RUNNING_NO = pad.substring(0, pad.length - str.length) + (parseInt(str)).toString();
                        this.noticeCode = "LS" + item[0].RUNNING_OFFICE_CODE + "" + item[0].RUNNING_YEAR + RUNNING_NO;

                        this.noticeForm.patchValue({
                            NOTICE_CODE: this.noticeCode
                        });
                        this.onCreate();
                    }
                }, (error) => {
                    console.error(error); this.preloader.setShowPreloader(false);
                    this.swalFn('', this.msgTransectionFailed, 'error'); return false;
                });
            }
        }, (error) => {
            console.error(error); this.preloader.setShowPreloader(false);
            this.swalFn('', this.msgTransectionFailed, 'error'); return false;

        });
    }

    async TransactionRunninginsAll() {
        await this.transactionRunningService.TransactionRunninginsAll_ph2(this.officeId, this.officeCode, "OPS_NOTICE", "LS")
            .then(async res => {
                if (res.IsSuccess == 'False') {
                    this.swalFn('', this.msgTransectionFailed, 'error');
                    this.preloader.setShowPreloader(false); return false;
                }
                this.TransactionRunningHandling();
            }, (error) => {
                console.error(error); this.preloader.setShowPreloader(false);
                this.swalFn('', this.msgTransectionFailed, 'error'); return false;
            });
    }

    clickDelete() {
        swal({
            title: '',
            text: Message.confirmAction,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ตกลง',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.value) {
                this.preloader.setShowPreloader(true);
                this.noticeService.NoticeupdDelete_Ph2(this.NOTICE_ID).then(IsSuccess => {
                    this.preloader.setShowPreloader(false);
                    if (IsSuccess.IsSuccess === "True") {
                        swal({
                            text: Message.delComplete,
                            type: 'success',
                            confirmButtonText: 'ตกลง'
                        })
                        this.router.navigate(['/notice/list']);
                        this.preloader.setShowPreloader(false);
                    } else {
                        swal({
                            text: Message.delFail,
                            type: 'error',
                            confirmButtonText: 'ตกลง'
                        })
                        this.preloader.setShowPreloader(false);
                    }
                });
            }
        })
    }

    private createForm() {
        const newDate = new Date();
        let y = newDate.getFullYear();
        let m = setZero((newDate).getMonth() + 1);
        let d = setZero((newDate).getDate());
        let h = setZero((newDate).getHours());
        let min = setZero((newDate).getMinutes());
        let s = setZero((newDate).getSeconds());
        let ms = newDate.getMilliseconds();
        const dateTimeNow = `${y}-${m}-${d} ${h}:${min}:${s}.${ms}`

        let noticeDate = this.mode == 'C' ? setDateMyDatepicker(newDate) : null;
        let noticeTime = this.mode == 'C' ? `${h}:${min}` : null;
        let _noticeTime = this.mode == 'C' ? `${h}:${min}:${s}.${ms}` : null;

        let CREATE_DATE = dateTimeNow;
        let noticeDueDate = noticeDate;
        this.noticeForm = this.fb.group({

            NOTICE_ID: new FormControl(this.NOTICE_ID),
            ARREST_ID: new FormControl(""),
            OFFICE_ID: new FormControl(""),
            NOTICE_CODE: new FormControl(this.noticeCode),
            OFFICE_CODE: new FormControl(""),
            OFFICE_NAME: new FormControl(""),
            OFFICE_NAME_TEMP: new FormControl(""),
            NOTICE_DATE: new FormControl(noticeDate, Validators.required),
            NOTICE_TIME: new FormControl(noticeTime),
            NOTICE_DUE: new FormControl(1, Validators.required),
            NOTICE_DUE_DATE: new FormControl("", Validators.required),
            NOTICE_DUE_TIME: new FormControl("23:59"),
            COMMUNICATION_CHANNEL: new FormControl(0),
            IS_ARREST: new FormControl(0),
            IS_AUTHORITY: new FormControl(1),
            IS_ACTIVE: new FormControl(1),
            IS_MATCH: new FormControl(""),
            CREATE_DATE: new FormControl(CREATE_DATE),
            CREATE_USER_ACCOUNT_ID: new FormControl(""),
            UPDATE_DATE: new FormControl(""),
            UPDATE_USER_ACCOUNT_ID: new FormControl(""),
            _NOTICE_TIME: new FormControl(_noticeTime),

            NoticeStaff: this.fb.array([this.createStaffForm(), this.createStaffForm(), this.createStaffForm()]),
            NoticeInformer: this.fb.array([this.createInformerForm()]),
            NoticeLocale: this.fb.array([this.createLocaleForm()]),
            NoticeProduct: this.fb.array([]),
            NoticeSuspect: this.fb.array([])
        });
    }

    private createStaffForm(): FormGroup {
        NoticeStaffFormControl.STAFF_ID = new FormControl(""),
            NoticeStaffFormControl.NOTICE_ID = new FormControl(""),
            NoticeStaffFormControl.STAFF_REF_ID = new FormControl(""),
            NoticeStaffFormControl.TITLE_SHORT_NAME_TH = new FormControl(""),
            NoticeStaffFormControl.FIRST_NAME = new FormControl(""),
            NoticeStaffFormControl.LAST_NAME = new FormControl(""),
            NoticeStaffFormControl.FULL_NAME = new FormControl(""),
            NoticeStaffFormControl.OPREATION_POS_NAME = new FormControl(""),
            NoticeStaffFormControl.OPERATION_OFFICE_SHORT_NAME = new FormControl(""),
            NoticeStaffFormControl.STATUS = new FormControl(""),
            NoticeStaffFormControl.REMARK = new FormControl(""),
            NoticeStaffFormControl.IS_ACTIVE = new FormControl(""),
            NoticeStaffFormControl.TITLE_ID = new FormControl(""),
            NoticeStaffFormControl.STAFF_CODE = new FormControl(""),
            NoticeStaffFormControl.ID_CARD = new FormControl(""),
            NoticeStaffFormControl.STAFF_TYPE = new FormControl(""),
            NoticeStaffFormControl.TITLE_NAME_TH = new FormControl(""),
            NoticeStaffFormControl.TITLE_NAME_EN = new FormControl(""),
            NoticeStaffFormControl.TITLE_SHORT_NAME_EN = new FormControl(""),
            NoticeStaffFormControl.AGE = new FormControl(""),
            NoticeStaffFormControl.OPERATION_POS_CODE = new FormControl(""),
            NoticeStaffFormControl.OPREATION_POS_LEVEL = new FormControl(""),
            NoticeStaffFormControl.OPERATION_POS_LEVEL_NAME = new FormControl(""),
            NoticeStaffFormControl.OPERATION_DEPT_CODE = new FormControl(""),
            NoticeStaffFormControl.OPERATION_DEPT_NAME = new FormControl(""),
            NoticeStaffFormControl.OPERATION_DEPT_LEVEL = new FormControl(""),
            NoticeStaffFormControl.OPERATION_UNDER_DEPT_CODE = new FormControl(""),
            NoticeStaffFormControl.OPERATION_UNDER_DEPT_NAME = new FormControl(""),
            NoticeStaffFormControl.OPERATION_UNDER_DEPT_LEVEL = new FormControl(""),
            NoticeStaffFormControl.OPERATION_WORK_DEPT_CODE = new FormControl(""),
            NoticeStaffFormControl.OPERATION_WORK_DEPT_NAME = new FormControl(""),
            NoticeStaffFormControl.OPERATION_OFFICE_CODE = new FormControl(""),
            NoticeStaffFormControl.OPERATION_OFFICE_NAME = new FormControl(""),
            NoticeStaffFormControl.MANAGEMENT_POS_CODE = new FormControl(""),
            NoticeStaffFormControl.MANAGEMENT_POS_NAME = new FormControl(""),
            NoticeStaffFormControl.MANAGEMENT_POS_LEVEL = new FormControl(""),
            NoticeStaffFormControl.MANAGEMENT_POS_LEVEL_NAME = new FormControl(""),
            NoticeStaffFormControl.MANAGEMENT_DEPT_CODE = new FormControl(""),
            NoticeStaffFormControl.MANAGEMENT_DEPT_NAME = new FormControl(""),
            NoticeStaffFormControl.MANAGEMENT_DEPT_LEVEL = new FormControl(""),
            NoticeStaffFormControl.MANAGEMENT_UNDER_DEPT_CODE = new FormControl(""),
            NoticeStaffFormControl.MANAGEMENT_UNDER_DEPT_NAME = new FormControl(""),
            NoticeStaffFormControl.MANAGEMENT_UNDER_DEPT_LEVEL = new FormControl(""),
            NoticeStaffFormControl.MANAGEMENT_WORK_DEPT_CODE = new FormControl(""),
            NoticeStaffFormControl.MANAGEMENT_WORK_DEPT_NAME = new FormControl(""),
            NoticeStaffFormControl.MANAGEMENT_WORK_DEPT_LEVEL = new FormControl(""),
            NoticeStaffFormControl.MANAGEMENT_OFFICE_CODE = new FormControl(""),
            NoticeStaffFormControl.MANAGEMENT_OFFICE_NAME = new FormControl(""),
            NoticeStaffFormControl.MANAGEMENT_OFFICE_SHORT_NAME = new FormControl(""),
            NoticeStaffFormControl.REPRESENT_POS_CODE = new FormControl(""),
            NoticeStaffFormControl.REPRESENT_POS_NAME = new FormControl(""),
            NoticeStaffFormControl.REPRESENT_POS_LEVEL = new FormControl(""),
            NoticeStaffFormControl.REPRESENT_POS_LEVEL_NAME = new FormControl(""),
            NoticeStaffFormControl.REPRESENT_DEPT_CODE = new FormControl(""),
            NoticeStaffFormControl.REPRESENT_DEPT_NAME = new FormControl(""),
            NoticeStaffFormControl.REPRESENT_DEPT_LEVEL = new FormControl(""),
            NoticeStaffFormControl.REPRESENT_UNDER_DEPT_CODE = new FormControl(""),
            NoticeStaffFormControl.REPRESENT_UNDER_DEPT_NAME = new FormControl(""),
            NoticeStaffFormControl.REPRESENT_UNDER_DEPT_LEVEL = new FormControl(""),
            NoticeStaffFormControl.REPRESENT_WORK_DEPT_CODE = new FormControl(""),
            NoticeStaffFormControl.REPRESENT_WORK_DEPT_NAME = new FormControl(""),
            NoticeStaffFormControl.REPRESENT_WORK_DEPT_LEVEL = new FormControl(""),
            NoticeStaffFormControl.REPRESENT_OFFICE_CODE = new FormControl(""),
            NoticeStaffFormControl.REPRESENT_OFFICE_NAME = new FormControl(""),
            NoticeStaffFormControl.REPRESENT_OFFICE_SHORT_NAME = new FormControl(""),
            NoticeStaffFormControl.CONTRIBUTOR_ID = new FormControl(""),
            NoticeStaffFormControl.IsNewItem = new FormControl(false),
            NoticeStaffFormControl.IsUpdate = new FormControl(false)
        return this.fb.group(NoticeStaffFormControl)
    }

    private createInformerForm(): FormGroup {
        NoticeInformerFormControl.INFORMER_STATUS = new FormControl(""),
            NoticeInformerFormControl.TITLE_SHORT_NAME_TH = new FormControl(""),
            NoticeInformerFormControl.FIRST_NAME = new FormControl(""),
            NoticeInformerFormControl.LAST_NAME = new FormControl(""),
            NoticeInformerFormControl.AGE = new FormControl(""),
            NoticeInformerFormControl.ADDRESS_NO = new FormControl(""),
            NoticeInformerFormControl.VILLAGE_NO = new FormControl(""),
            NoticeInformerFormControl.BUILDING_NAME = new FormControl(""),
            NoticeInformerFormControl.ROOM_NO = new FormControl(""),
            NoticeInformerFormControl.FLOOR = new FormControl(""),
            NoticeInformerFormControl.ALLEY = new FormControl(""),
            NoticeInformerFormControl.LANE = new FormControl(""),
            NoticeInformerFormControl.ROAD = new FormControl(""),
            NoticeInformerFormControl.INFORMER_INFO = new FormControl(""),
            NoticeInformerFormControl.IS_ACTIVE = new FormControl(1),
            NoticeInformerFormControl.INFORMER_ID = new FormControl(""),
            NoticeInformerFormControl.TITLE_ID = new FormControl(""),
            NoticeInformerFormControl.SUB_DISTRICT_ID = new FormControl(""),
            NoticeInformerFormControl.TITLE_NAME_TH = new FormControl(""),
            NoticeInformerFormControl.TITLE_NAME_EN = new FormControl(""),
            NoticeInformerFormControl.TITLE_SHORT_NAME_EN = new FormControl(""),
            NoticeInformerFormControl.MIDDLE_NAME = new FormControl(""),
            NoticeInformerFormControl.OTHER_NAME = new FormControl(""),
            NoticeInformerFormControl.ID_CARD = new FormControl(""),
            NoticeInformerFormControl.CAREER = new FormControl(""),
            NoticeInformerFormControl.POSITION = new FormControl(""),
            NoticeInformerFormControl.PERSON_DESC = new FormControl(""),
            NoticeInformerFormControl.EMAIL = new FormControl(""),
            NoticeInformerFormControl.TEL_NO = new FormControl(""),
            NoticeInformerFormControl.GPS = new FormControl(""),
            NoticeInformerFormControl.VILLAGE_NAME = new FormControl(""),
            NoticeInformerFormControl.INFORMER_PHOTO = new FormControl(""),
            NoticeInformerFormControl.INFORMER_FINGER_PRINT = new FormControl(""),
            NoticeInformerFormControl.Region = new FormControl("");
        return this.fb.group(NoticeInformerFormControl)
    }

    private createLocaleForm(): FormGroup {
        NoticeLocaleFormControl.LOCALE_ID = new FormControl(""),
            NoticeLocaleFormControl.NOTICE_ID = new FormControl(""),
            NoticeLocaleFormControl.SUB_DISTRICT_ID = new FormControl(""),
            NoticeLocaleFormControl.GPS = new FormControl(""),
            NoticeLocaleFormControl.ADDRESS_NO = new FormControl(""),
            NoticeLocaleFormControl.VILLAGE_NO = new FormControl(""),
            NoticeLocaleFormControl.BUILDING_NAME = new FormControl(""),
            NoticeLocaleFormControl.ROOM_NO = new FormControl(""),
            NoticeLocaleFormControl.FLOOR = new FormControl(""),
            NoticeLocaleFormControl.VILLAGE_NAME = new FormControl(""),
            NoticeLocaleFormControl.ALLEY = new FormControl(""),
            NoticeLocaleFormControl.LANE = new FormControl(""),
            NoticeLocaleFormControl.ROAD = new FormControl(""),
            NoticeLocaleFormControl.ADDRESS_TYPE = new FormControl(""),
            NoticeLocaleFormControl.ADDRESS_STATUS = new FormControl(""),
            NoticeLocaleFormControl.POLICE_STATION = new FormControl(""),
            NoticeLocaleFormControl.LOCATION = new FormControl(""),
            NoticeLocaleFormControl.IS_ACTIVE = new FormControl(""),
            NoticeLocaleFormControl.Region = new FormControl("");
        return this.fb.group(NoticeLocaleFormControl)
    }

    private setItemFormArray(array: any[], formControl: string) {
        if (array !== undefined && array.length) {
            const itemFGs = array.map(item => this.fb.group(item));
            const itemFormArray = this.fb.array(itemFGs);
            this.noticeForm.setControl(formControl, itemFormArray);
        }
    }

    private async setDataInit(res: any) {
        this.noticeCode = res.NoticeCode;
        this.arrestCode = res.ArrestCode;
        await this.noticeForm.reset({
            NoticeCode: res.NoticeCode,
            NoticeStationCode: res.NoticeStationCode,
            NoticeStation: res.NoticeStation,
            NoticeDate: setDateMyDatepicker(new Date(res.NoticeDate)),
            NoticeTime: res.NoticeTime,
            NoticeDueTime: "23:59",
            NoticeDue: res.NoticeDue,
            NoticeDueDate: setDateMyDatepicker(new Date(res.NoticeDueDate)),
            GroupNameDesc: res.GroupNameDesc || 'N/A',
            CommunicationChanelID: res.CommunicationChanelID,
            ArrestCode: res.ArrestCode,
            IsActive: res.IsActive,
            IsArrest: res.IsArrest || 0
        });

        if (res.IsArrest == 1) {
            this.navService.setDeleteButton(false);
        }

        const staff = res.NoticeStaff.filter(item => item.IsActive == 1);
        staff.map(item => {
            item.StaffFullName = `${item.TitleName} ${item.FirstName} ${item.LastName}`
        });

        await res.NoticeLocale.map(item =>
            item.Region = `${item.SubDistrict + "/" || ''}${item.District + "/" || ''}${item.Province}`
        )

        const informer = res.NoticeInformer.filter(item => item.IsActive == 1);
        informer.map(item => {
            this.isConceal = item.InformerType == 1 ? true : false;
            item.Region = !item.SubDistrict ? '' : `${item.SubDistrict}`;
            item.Region += !item.District ? '' : `/${item.District}`;
            item.Region += !item.Province ? '' : `/${item.Province}`;
            item.Age = !item.Age || item.Age == 0 ? "" : item.Age;
        });

        const suspect = res.NoticeSuspect.filter(item => item.IsActive == 1);
        suspect.map(item => {
            item.SuspectFullName = !item.SuspectTitleName ? '' : item.SuspectTitleName;
            item.SuspectFullName += !item.SuspectFirstName ? '' : ` ${item.SuspectFirstName}`;
            item.SuspectFullName += !item.SuspectMiddleName ? '' : ` ${item.SuspectMiddleName}`;
            item.SuspectFullName += !item.SuspectLastName ? '' : ` ${item.SuspectLastName}`;

            item.CompanyFullName = !item.CompanyTitleName ? '' : item.CompanyTitleName;
            item.CompanyFullName += !item.CompanyName ? '' : ` ${item.CompanyName}`;

            item.SuspectType = item.SuspectType || 0;
            item.EntityType = item.EntityType || 0;
            item.SuspectTypeName = item.SuspectTypeName || this.suspectTypes.find(el => parseInt(el.value) == item.SuspectType).text;
            item.EntityTypeName = item.EntityTypeName || this.entityTypes.find(el => parseInt(el.value) == item.EntityType).text;
        });

        const product = res.NoticeProduct.filter(item => item.IsActive == 1);
        product.map(item => {
            item.BrandFullName = item.ProductDesc ? item.ProductDesc : "";
            item.NetWeight = item.NetWeight || '0';
            item.NetWeightUnit = item.NetWeightUnit || '0';
            item.DutyCode = this.typeheadProductUnit.find(el => parseInt(el.DutyUnitCode) == item.QtyUnit).DutyCode;
        });

        await this.setItemFormArray(staff, 'NoticeStaff');
        await this.setItemFormArray(informer, 'NoticeInformer');
        await this.setItemFormArray(res.NoticeLocale, 'NoticeLocale');
        await this.setItemFormArray(product, 'NoticeProduct');
        await this.setItemFormArray(suspect, 'NoticeSuspect');
    }

    private async getByCon(code: string) {
        this.preLoaderService.setShowPreloader(true);

        await this.setRegionStore();

        await this.noticeService.getByCon(code).then(async res => {
            this.showEditField = true;
            this.noticeCode = res.NOTICE_CODE;
            this.INPUT_WIZARD.next({ 'VALUE': res.NOTICE_CODE, 'RESERVE_VALUE': '' });

            this.IS_AUTHORITY = res.IS_AUTHORITY;
            const _noticeDate = new Date(res.NOTICE_DATE);

            await this.noticeForm.reset({
                NOTICE_CODE: res.NOTICE_CODE,
                NOTICE_ID: res.NOTICE_ID,
                ARREST_ID: res.ARREST_ID,
                NOTICE_DATE: {
                    date: {
                        day: _noticeDate.getDate(),
                        month: _noticeDate.getMonth() + 1,
                        year: _noticeDate.getFullYear(),
                    }
                },
                NOTICE_TIME: res.NOTICE_DATE ? res.NOTICE_DATE.slice(11, 16) : '',
                NOTICE_DUE: res.NOTICE_DUE,
                NOTICE_DUE_DATE: setDateMyDatepicker(new Date(res.NOTICE_DUE_DATE)),
                NOTICE_DUE_TIME: '23:59',
                CREATE_DATE: `${res.CREATE_DATE}.${new Date().getMilliseconds()}`,
                IS_ARREST: res.IS_ARREST,
                IS_ACTIVE: res.IS_ACTIVE,
                IS_AUTHORITY: res.IS_AUTHORITY,
                IS_MATCH: res.IS_MATCH,
                COMMUNICATION_CHANNEL: res.COMMUNICATION_CHANNEL,
                CREATE_USER_ACCOUNT_ID: res.CREATE_USER_ACCOUNT_ID,
                OFFICE_NAME: res.OFFICE_NAME,
                OFFICE_NAME_TEMP: res.OFFICE_NAME,
                OFFICE_CODE: res.OFFICE_CODE,
                OFFICE_ID: res.OFFICE_ID,
                UPDATE_DATE: res.UPDATE_DATE,
                UPDATE_USER_ACCOUNT_ID: res.UPDATE_USER_ACCOUNT_ID,

                NoticeInformer: res.NoticeInformer,
                NoticeStaff: res.NoticeStaff,
                NoticeLocale: res.NoticeLocale,
                NoticeProduct: res.NoticeProduct,
                NoticeSuspect: res.NoticeSuspect
            });

            /** NoticeInformer */
            res.NoticeInformer.map(item => {
                for (var key in item) {
                    if (item[key] === 'null')
                        item[key] = null;
                }
                this.isConceal = item.INFORMER_STATUS == 0 ? true : false;
                item.AGE = Number(item.AGE) > 0 ? item.AGE : ''
            });

            /** NoticeStaff */
            const is_authority = this.noticeForm.controls['IS_AUTHORITY'].value;
            if (is_authority == 1) {
                this.DisconID = false;
                this.seq2 = 1;
                this.seq3 = 2;
            } else {
                this.DisconID = true;
            }

            this.setFormStaffForConID(0, 2);

            res.NoticeStaff.map(m => {
                for (var key in m) {
                    if (m[key] === 'null')
                        m[key] = null;
                }

                m.FULL_NAME = m.TITLE_SHORT_NAME_TH + m.FIRST_NAME + ' ' + m.LAST_NAME;
                if (m.CONTRIBUTOR_ID == 7) { this.NoticeStaff.value[0] = m }
                if (m.CONTRIBUTOR_ID == 8) { this.NoticeStaff.value[1] = m }
                if (m.CONTRIBUTOR_ID == 9) { this.NoticeStaff.value[2] = m }
                m.IsNewItem = false;
                m.IsUpdate = true;
            })

            /** NoticeSUspect */
            res.NoticeSuspect.map(item => {
                if (item.ENTITY_TYPE == '0') { item.ENTITY_TYPE_NAME = 'บุคคลธรรมดา' } else if (item.ENTITY_TYPE == '1') { item.ENTITY_TYPE_NAME = 'นิติบุคคล' };
                if (item.PERSON_TYPE == '0') { item.PERSON_TYPE_NAME = 'คนไทย' }
                else if (item.PERSON_TYPE == '1') { item.PERSON_TYPE_NAME = 'คนต่างชาติ' }
                else if (item.PERSON_TYPE == '2') { item.PERSON_TYPE_NAME = 'ผู้ประกอบการ' };
                if (item.MISTREAT_NO == '0') { item.MISTREAT_NO_TEXT = 'ไม่พบการกระทำผิด' } else { item.MISTREAT_NO_TEXT = item.MISTREAT_NO };
                item.FULL_NAME = `${item.TITLE_SHORT_NAME_TH || ''}${item.FIRST_NAME || ''} ${item.LAST_NAME || ''}`;
            })

            let Locale: any = [];
            Locale = this.typeheadRegion.filter(f => f.SUB_DISTRICT_ID == this.noticeForm.value.NoticeLocale[0].SUB_DISTRICT_ID);
            if (Locale.length) {
                res.NoticeLocale.map((item, i) => {
                    for (var key in item) {
                        if (item[key] === 'null')
                            item[key] = null;
                    }
                    item.Region = Locale[i].SUB_DISTRICT_NAME_TH == null ? '' : `${Locale[i].SUB_DISTRICT_NAME_TH}`;
                    item.Region += Locale[i].DISTRICT_NAME_TH == null ? '' : ` ${Locale[i].DISTRICT_NAME_TH}`;
                    item.Region += Locale[i].PROVINCE_NAME_TH == null ? '' : ` ${Locale[i].PROVINCE_NAME_TH}`;
                });
            } else {
                res.NoticeLocale.map((item, i) => {
                    item.Region = ""
                })
            }

            let LocInform: any = [];
            LocInform = this.typeheadRegion.filter(f => f.SUB_DISTRICT_ID == this.noticeForm.value.NoticeInformer[0].SUB_DISTRICT_ID);
            if (LocInform.length) {
                res.NoticeInformer.map((item, i) => {
                    for (var key in item) {
                        if (item[key] === 'null')
                            item[key] = null;
                    }
                    item.Region = LocInform[i].SUB_DISTRICT_NAME_TH == null ? '' : `${LocInform[i].SUB_DISTRICT_NAME_TH}`;
                    item.Region += LocInform[i].DISTRICT_NAME_TH == null ? '' : ` ${LocInform[i].DISTRICT_NAME_TH}`;
                    item.Region += LocInform[i].PROVINCE_NAME_TH == null ? '' : ` ${LocInform[i].PROVINCE_NAME_TH}`;
                });
            } else {
                res.NoticeInformer.map((item, i) => {
                    item.Region = ""
                })
            }

            /** NoticeProducts */
            const product = res.NoticeProduct.filter(item => item.IS_ACTIVE == 1);
            product.map(item => {
                for (var key in item) {
                    if (item[key] === 'null')
                        item[key] = '';
                }
                item.IsNewItem = false;
            })

            this.DuplicatePorductGroup(product);

            await this.setItemFormArray(this.NoticeStaff.value, 'NoticeStaff');
            await this.setItemFormArray(res.NoticeInformer, 'NoticeInformer');
            await this.setItemFormArray(res.NoticeLocale, 'NoticeLocale');
            await this.setItemFormArray(res.NoticeProduct, 'NoticeProduct');
            await this.setItemFormArray(res.NoticeSuspect, 'NoticeSuspect');

            this.checkingEditDelBtn(this.noticeForm.controls['IS_ARREST'].value);

            this.preLoaderService.setShowPreloader(false);
        });

        await this.noticeService.GetDocumentByCon(2, this.NOTICE_ID).subscribe(async res => {
            this.fileList = [];
            let temp: any;
            temp = res;
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
                            m.IMAGE_SHOW = this.noticeService.getImage(f.DOCUMENT_ID);
                            break;
                    }
                    this.fileList.push(m);
                }
            })
        })
    }

    private async onCreate() {
        const noticeDate = this.noticeForm.value.NOTICE_DATE;
        const noticeDueDate = this.noticeForm.value.NOTICE_DUE_DATE;
        const _noticeDueTime = `${this.noticeForm.value.NOTICE_DUE_TIME}:59.000`;
        const _noticeTime = `${this.noticeForm.value.NOTICE_TIME}:00.000`;
        let t = this.noticeForm.value.NOTICE_DATE = noticeDate.date.year + "-" + setZero(noticeDate.date.month) + "-" + noticeDate.date.day + " " + _noticeTime;
        this.noticeForm.value.NOTICE_DUE_DATE = noticeDueDate.date.year + "-" + setZero(noticeDueDate.date.month) + "-" + noticeDueDate.date.day + " " + _noticeDueTime;

        let noticeForm = this.noticeForm.value;
        let noticeStaff = [];
        let noticeInformer = [];
        let noticeLocale = [];
        let noticeProduct = [];
        let noticeSuspect = [];

        for (let l of noticeForm.NoticeStaff) {
            if (l.CONTRIBUTOR_ID != '') {
                l.NOTICE_CODE = this.noticeCode;
                l.IS_ACTIVE = 1;
                noticeStaff.push(l);
            }
        }

        for (let l of noticeForm.NoticeInformer) {
            l.NOTICE_CODE = this.noticeCode;
            l.IS_ACTIVE = 1;
            noticeInformer.push(l);
        }

        for (let l of noticeForm.NoticeLocale) {
            l.NOTICE_CODE = this.noticeCode;
            l.IS_ACTIVE = 1;
            noticeLocale.push(l);
        }

        for (let l of noticeForm.NoticeProduct) {
            l.NOTICE_CODE = this.noticeCode;
            l.IS_ACTIVE = 1;
            noticeProduct.push(l);
        }

        for (let l of noticeForm.NoticeSuspect) {
            l.NOTICE_CODE = this.noticeCode;
            l.IS_ACTIVE = 1;
            noticeSuspect.push(l);
        }

        this.noticeForm.value.NoticeStaff = noticeStaff;
        this.noticeForm.value.NoticeInformer = noticeInformer;
        this.noticeForm.value.NoticeLocale = noticeLocale;
        this.noticeForm.value.NoticeProduct = noticeProduct;
        this.noticeForm.value.NoticeSuspect = noticeSuspect;

        this.NoticeInformer.value.map(m => {
            m.ADDRESS_NO = m.ADDRESS_NO || ""
            m.AGE = m.AGE || ""
            m.ALLEY = m.ALLEY || ""
            m.BUILDING_NAME = m.BUILDING_NAME || ""
            m.CAREER = m.CAREER || ""
            m.EMAIL = m.EMAIL || ""
            m.FIRST_NAME = m.FIRST_NAME || ""
            m.FLOOR = m.FLOOR || ""
            m.GPS = m.GPS || ""
            m.ID_CARD = m.ID_CARD || ""
            m.INFORMER_FINGER_PRINT = m.INFORMER_FINGER_PRINT || ""
            m.INFORMER_ID = m.INFORMER_ID || ""
            m.INFORMER_INFO = m.INFORMER_INFO || ""
            m.INFORMER_PHOTO = m.INFORMER_PHOTO || ""
            m.INFORMER_STATUS = m.INFORMER_STATUS
            m.IS_ACTIVE = m.IS_ACTIVE || 0
            m.LANE = m.LANE || ""
            m.LAST_NAME = m.LAST_NAME || ""
            m.MIDDLE_NAME = m.MIDDLE_NAME || ""
            m.NOTICE_ID = m.NOTICE_ID || ""
            m.OTHER_NAME = m.OTHER_NAME || ""
            m.PERSON_DESC = m.PERSON_DESC || ""
            m.POSITION = m.POSITION || ""
            m.ROAD = m.ROAD || ""
            m.ROOM_NO = m.ROOM_NO || ""
            m.SUB_DISTRICT_ID = m.SUB_DISTRICT_ID || null
            m.TEL_NO = m.TEL_NO || ""
            m.TITLE_ID = m.TITLE_ID || null
            m.TITLE_NAME_EN = m.TITLE_NAME_EN || ""
            m.TITLE_NAME_TH = m.TITLE_NAME_TH || ""
            m.TITLE_SHORT_NAME_EN = m.TITLE_SHORT_NAME_EN || ""
            m.TITLE_SHORT_NAME_TH = m.TITLE_SHORT_NAME_TH || ""
            m.VILLAGE_NAME = m.VILLAGE_NAME || ""
            m.VILLAGE_NO = m.VILLAGE_NO || ""
        })

        this.NoticeLocale.value.map(m => {
            m.ADDRESS_NO = m.ADDRESS_NO || "";
            m.ADDRESS_STATUS = m.ADDRESS_STATUS || "";
            m.ADDRESS_TYPE = m.ADDRESS_TYPE || "";
            m.ALLEY = m.ALLEY || "";
            m.BUILDING_NAME = m.BUILDING_NAME || "";
            m.FLOOR = m.FLOOR || "";
            m.GPS = m.GPS || "";
            m.IS_ACTIVE = m.IS_ACTIVE || "";
            m.LANE = m.LANE || "";
            m.LOCALE_ID = m.LOCALE_ID || "";
            m.LOCATION = m.LOCATION || "";
            m.NOTICE_CODE = this.noticeCode || "";
            m.NOTICE_ID = this.NOTICE_ID || "";
            m.POLICE_STATION = m.POLICE_STATION || "";
            m.ROAD = m.ROAD || "";
            m.ROOM_NO = m.ROOM_NO || "";
            m.Region = m.Region || "";
            m.SUB_DISTRICT_ID = m.SUB_DISTRICT_ID || "";
            m.VILLAGE_NAME = m.VILLAGE_NAME || "";
            m.VILLAGE_NO = m.VILLAGE_NO || "";
        })

        this.preloader.setShowPreloader(true);

        let result = [];
        let zip$ = new Observable<any>();
        let request = new Observable<any>();

        request = this.noticeService.NoticeinsAll(this.noticeForm.value).pipe(
            mergeMap(x => {
                this.NOTICE_ID = x['NOTICE_ID'];
                return merge(
                    Observable.of(x),
                    this.NoticeDocumentModify(this.NOTICE_ID)
                );
            })
        ).finally(() => this.preloader.setShowPreloader(false))

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
                            this.router.navigateByUrl('/notice/manage/R/' + this.NOTICE_ID);
                            setTimeout(() => {
                                location.reload();
                            }, 300);
                        }
                    })
                }
            }), () => {
                swal({
                    title: '',
                    text: Message.saveFail,
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'ตกลง'
                })
            }
    }


    private async onReviced() {
        const newDate = new Date();
        let y = newDate.getFullYear();
        let m = setZero((newDate).getMonth() + 1);
        let d = setZero((newDate).getDate());
        let h = setZero((newDate).getHours());
        let min = setZero((newDate).getMinutes());
        let s = setZero((newDate).getSeconds());
        let ms = newDate.getMilliseconds();
        const dateTimeNow = `${y}-${m}-${d} ${h}:${min}:${s}.${ms}`

        const noticeDate = convertDateForSave(getDateMyDatepicker(this.noticeForm.value.NOTICE_DATE));
        const noticeDueDate = convertDateForSave(getDateMyDatepicker(this.noticeForm.value.NOTICE_DUE_DATE));

        const _noticeTime = `${this.noticeForm.value.NOTICE_TIME}`;
        const _noticeDueTime = `${this.noticeForm.value.NOTICE_DUE_TIME}`;

        this.noticeForm.value.NOTICE_DATE = this.toDateTZ(`${noticeDate} ${_noticeTime}`);
        this.noticeForm.value.NOTICE_DUE_DATE = this.toDateTZ(`${noticeDueDate} ${_noticeDueTime}`);
        this.noticeForm.value.UPDATE_DATE = dateTimeNow;

        this.noticeForm.value.UPDATE_USER_ACCOUNT_ID = localStorage.getItem('UserAccountID');

        this.NoticeInformer.value.map(m => {
            m.ADDRESS_NO = m.ADDRESS_NO || ""
            m.AGE = m.AGE || ""
            m.ALLEY = m.ALLEY || ""
            m.BUILDING_NAME = m.BUILDING_NAME || ""
            m.CAREER = m.CAREER || ""
            m.EMAIL = m.EMAIL || ""
            m.FIRST_NAME = m.FIRST_NAME || ""
            m.FLOOR = m.FLOOR || ""
            m.GPS = m.GPS || ""
            m.ID_CARD = m.ID_CARD || ""
            m.INFORMER_FINGER_PRINT = m.INFORMER_FINGER_PRINT || ""
            m.INFORMER_ID = m.INFORMER_ID || ""
            m.INFORMER_INFO = m.INFORMER_INFO || ""
            m.INFORMER_PHOTO = m.INFORMER_PHOTO || ""
            m.INFORMER_STATUS = m.INFORMER_STATUS
            m.IS_ACTIVE = m.IS_ACTIVE || 0
            m.LANE = m.LANE || ""
            m.LAST_NAME = m.LAST_NAME || ""
            m.MIDDLE_NAME = m.MIDDLE_NAME || ""
            m.NOTICE_ID = m.NOTICE_ID || ""
            m.OTHER_NAME = m.OTHER_NAME || ""
            m.PERSON_DESC = m.PERSON_DESC || ""
            m.POSITION = m.POSITION || ""
            m.ROAD = m.ROAD || ""
            m.ROOM_NO = m.ROOM_NO || ""
            m.SUB_DISTRICT_ID = m.SUB_DISTRICT_ID || null
            m.TEL_NO = m.TEL_NO || ""
            m.TITLE_ID = m.TITLE_ID || null
            m.TITLE_NAME_EN = m.TITLE_NAME_EN || ""
            m.TITLE_NAME_TH = m.TITLE_NAME_TH || ""
            m.TITLE_SHORT_NAME_EN = m.TITLE_SHORT_NAME_EN || ""
            m.TITLE_SHORT_NAME_TH = m.TITLE_SHORT_NAME_TH || ""
            m.VILLAGE_NAME = m.VILLAGE_NAME || ""
            m.VILLAGE_NO = m.VILLAGE_NO || ""
        })

        this.NoticeLocale.value.map(m => {
            m.ADDRESS_NO = m.ADDRESS_NO || "";
            m.ADDRESS_STATUS = m.ADDRESS_STATUS || "";
            m.ADDRESS_TYPE = m.ADDRESS_TYPE || "";
            m.ALLEY = m.ALLEY || "";
            m.BUILDING_NAME = m.BUILDING_NAME || "";
            m.FLOOR = m.FLOOR || "";
            m.GPS = m.GPS || "";
            m.IS_ACTIVE = m.IS_ACTIVE || "";
            m.LANE = m.LANE || "";
            m.LOCALE_ID = m.LOCALE_ID || "";
            m.LOCATION = m.LOCATION || "";
            m.NOTICE_CODE = this.noticeCode || "";
            m.NOTICE_ID = this.NOTICE_ID || "";
            m.POLICE_STATION = m.POLICE_STATION || "";
            m.ROAD = m.ROAD || "";
            m.ROOM_NO = m.ROOM_NO || "";
            m.Region = m.Region || "";
            m.SUB_DISTRICT_ID = m.SUB_DISTRICT_ID || "";
            m.VILLAGE_NAME = m.VILLAGE_NAME || "";
            m.VILLAGE_NO = m.VILLAGE_NO || "";
        })

        this.NoticeSuspect.value.map(m => {
            m.AGE = m.AGE;
            m.CAREER = m.CAREER;
            m.COMPANY_NAME = m.COMPANY_NAME || "";
            m.COMPANY_REGISTRATION_NO = m.COMPANY_REGISTRATION_NO;
            m.EMAIL = m.EMAIL || "";
            m.ENTITY_TYPE = m.ENTITY_TYPE;
            m.ENTITY_TYPE_NAME = m.ENTITY_TYPE_NAME || "";
            m.EXCISE_REGISTRATION_NO = m.EXCISE_REGISTRATION_NO;
            m.FIRST_NAME = m.FIRST_NAME || "";
            m.FULL_NAME = m.FULL_NAME || "";
            m.ID_CARD = m.ID_CARD;
            m.IS_ACTIVE = m.IS_ACTIVE;
            m.LAST_NAME = m.LAST_NAME || "";
            m.MIDDLE_NAME = m.MIDDLE_NAME || "";
            m.MISTREAT_NO = m.MISTREAT_NO;
            m.MISTREAT_NO_TEXT = m.MISTREAT_NO_TEXT || "";
            m.NOTICE_ID = m.NOTICE_ID;
            m.OTHER_NAME = m.OTHER_NAME || "";
            m.PASSPORT_NO = m.PASSPORT_NO;
            m.PERSON_DESC = m.PERSON_DESC || "";
            m.PERSON_ID = m.PERSON_ID;
            m.PERSON_TYPE = m.PERSON_TYPE;
            m.PERSON_TYPE_NAME = m.PERSON_TYPE_NAME || "";
            m.SUSPECT_ID = m.SUSPECT_ID;
            m.TEL_NO = m.TEL_NO || "";
            m.TITLE_ID = m.TITLE_ID;
            m.TITLE_NAME_EN = m.TITLE_NAME_EN || "";
            m.TITLE_NAME_TH = m.TITLE_NAME_TH || "";
            m.TITLE_SHORT_NAME_EN = m.TITLE_SHORT_NAME_EN || "";
            m.TITLE_SHORT_NAME_TH = m.TITLE_SHORT_NAME_TH || "";
        })

        this.preloader.setShowPreloader(true);

        let result = [];
        let zip$ = new Observable<any>();
        let request = new Observable<any>();

        request = this.noticeService.NoticeupdByCon(this.noticeForm.value).pipe(
            mergeMap(x => {
                return merge(
                    Observable.of(x),
                    this.NoticeStaffModify(this.NoticeStaff.value),
                    this.NoticeProductModify(this.NoticeProduct.value),
                    this.NoticeSuspectModify(this.NoticeSuspect.value),
                    this.NoticeDocumentModify(this.NOTICE_ID)
                );
            })
        ).finally(() => this.preloader.setShowPreloader(false))

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
                            setTimeout(() => {
                                location.reload();
                            }, 300);
                        }
                    })
                }
            }), () => {
                swal({
                    title: '',
                    text: Message.saveFail,
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'ตกลง'
                })
            }
    }

    NoticeDocumentModify(REFERENCE_CODE: string): Observable<any> {
        let ins = this.fileList.filter(f => f.IsNewItem == true);

        let del = this.DelDoc;

        if (ins.length > 0)
            ins = ins.reduce((accu, curr) => [...accu, { ...curr, REFERENCE_CODE }], []);

        if (del.length)
            del = del.reduce((acc, curr) => [...acc, { DOCUMENT_ID: curr.DOCUMENT_ID }], []);

        let ins$ = () => from(ins).pipe(mergeMap(x => this.noticeService.DocumentinsAll(x)));

        let del$ = () => from(del).pipe(mergeMap(x => this.noticeService.DocumentupdDelete(x)));

        return merge(
            ins.length > 0 ? ins$() : Observable.of(),
            del.length > 0 ? del$() : Observable.of()
        )
    }

    NoticeProductModify(Product: any[]): Observable<any> {
        let ins = Product.filter(f => f.IsNewItem == true);

        let upd = Product.filter(f => f.IsNewItem == false);

        let del = this.productDel;

        if (ins)
            ins = ins.reduce((a, c) => {
                return [...a,
                {
                    ...c,
                    IS_ACTIVE: 1,
                    NOTICE_CODE: this.noticeCode,
                    NOTICE_ID: this.NOTICE_ID,
                    VOLUMN: c.VOLUMN ? c.VOLUMN : 0
                }]
            }, []);
        let ins$ = () => from(ins).pipe(mergeMap(x => this.noticeService.NoticeProductinsAll(x)));

        let upd$ = () => from(upd).pipe(mergeMap(x => this.noticeService.NoticeProductupdByCon(x)));

        let del$ = () => from(del).pipe(mergeMap(x => this.noticeService.NoticeProductupdDelete(x)));

        return merge(
            ins.length > 0 ? ins$() : Observable.of(),
            upd.length > 0 ? upd$() : Observable.of(),
            del.length > 0 ? del$() : Observable.of()
        )
    }

    NoticeStaffModify(Staff: any[]): Observable<any> {
        let ins = Staff.filter(f => f.IsNewItem == true);

        let upd = Staff.filter(f => f.IsUpdate == true);

        let del = this.DelStaff;

        let ins$ = () => from(ins).pipe(mergeMap(x => this.noticeService.NoticeStaffinsAll(x)));

        let upd$ = () => from(upd).pipe(mergeMap(x => this.noticeService.NoticeStaffupdByCon(x)));

        let del$ = () => from(del).pipe(mergeMap(x => this.noticeService.NoticeStaffupdDelete(x.STAFF_ID)));

        return merge(
            ins.length > 0 ? ins$() : Observable.of(),
            upd.length > 0 ? upd$() : Observable.of(),
            del.length > 0 ? del$() : Observable.of()
        )
    }

    NoticeSuspectModify(Suspect: any[]): Observable<any> {
        let ins = Suspect.filter(f => f.IsNewItem == true);

        let del = this.DelSuspect;

        let ins$ = () => from(ins).pipe(mergeMap(x => this.noticeService.NoticeSupectinsAll(x)));

        let del$ = () => from(del).pipe(mergeMap(x => this.noticeService.NoticeSuspectupdDelete(x.SUSPECT_ID)));

        return merge(
            ins.length > 0 ? ins$() : Observable.of(),
            del.length > 0 ? del$() : Observable.of()
        )
    }

    private async onComplete() {
        // // set true
        this.showEditField = false;
        await this.editButton.next(true);
        await this.printButton.next(true);
        await this.deleteButton.next(true);
        // // set false
        await this.saveButton.next(false);
        await this.cancelButton.next(false);

        this.getByCon(this.NOTICE_ID);
    }

    AddPorduct() {
        const prod = { ...NoticeProductFormControl, IsNewItem: true, PRODUCT_GROUP_CODE: '', PRODUCT_DESC: '' };

        const newObj = [...this.NoticeProduct.value, prod];

        this.setItemFormArray(newObj, 'NoticeProduct');
    }

    addProduct() {
        this.modal = this.ngbModel.open(this.productsModel, { size: 'lg', centered: true });
    }

    addSuspect(suspect: any[]) {
        if (suspect.length) {

            let SUSP: any[] = [];

            SUSP = this.NoticeSuspect.value

            let PERSON_ID = SUSP.reduce((a, c) => { return [...a, { PERSON_ID: c.PERSON_ID }] }, []);

            let pFilter = PERSON_ID.map(p => { return p.PERSON_ID; });

            let filteredSuspect = suspect.filter(suspect => !pFilter.includes(suspect.PERSON_ID));

            filteredSuspect.map(item => {
                let noticeSuspect = {
                    SUSPECT_ID: '',
                    NOTICE_ID: this.NOTICE_ID || "",
                    PERSON_ID: item.PERSON_ID || "",
                    TITLE_ID: item.TITLE_ID || "",
                    PERSON_TYPE: item.PERSON_TYPE || "",
                    PERSON_TYPE_NAME: this.getPersonTypeName(item.PERSON_TYPE),
                    ENTITY_TYPE: item.ENTITY_TYPE || "",
                    ENTITY_TYPE_NAME: this.getEntityTypeName(item.ENTITY_TYPE),
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
                    MISTREAT_NO_TEXT: item.MISTREAT_NO == 0 ? "ไม่พบการกระทำผิด" : item.MISTREAT_NO,
                    IS_ACTIVE: 1,
                    IsNewItem: true
                }
                this.NoticeSuspect.push(this.fb.group(noticeSuspect));
            })
        }
    }

    addDocument() {
        const lastIndex = this.NoticeDocument.length - 1;
        let document = new NoticeDocument();
        document.DocumentID = "" + (lastIndex + 1);
        document.DocumentName = "";
        document.FilePath = "";
        document.IsNewItem = true;
        document.DocumentType = 2;
        if (lastIndex < 0) {
            this.NoticeDocument.push(this.fb.group(document));
        } else {
            const lastDoc = this.NoticeDocument.at(lastIndex).value;
            if (lastDoc.DocumentName && lastDoc.FilePath) {
                this.NoticeDocument.push(this.fb.group(document));
            }
        }
    }

    private async setOfficeStore(OFFICE_CODE) {
        await this.noticeService.MasOfficegetByCon(OFFICE_CODE).then(res =>
            this.typeheadOffice = res.RESPONSE_DATA
        )
    }
    private async MasProductGroup() {
        await this.noticeService.MasProductGroupgetByCon('', '').then(res => {
            this.ProductGroup = res;
            if (this.ProductGroup.length) {
                this.ProductGroup = this.ProductGroup.reduce((a, c) =>
                    [...a, { ...c, IS_DISABLED: false }], [])
                    .filter(f => f.PRODUCT_GROUP_ID != 88); //ตัดหมวด "ของอื่นๆจากระบบคดี" ออก
            }
        })

        // //##### Exsice Service #####///
        // this.noticeService.DutyGroup().subscribe(t => {
        //     this.ProductGroup = this.tranFormDutyGroup(t);
        //     if (this.ProductGroup.length) {
        //         this.ProductGroup = this.ProductGroup.reduce((a, c) =>
        //             [...a, { ...c, IS_DISABLED: false }], []);
        //     }
        // })
    }

    // private async setStaffStore() {
    //     await this.mainMasterService.MasStaffgetByCon('').then(res =>
    //         this.typeheadStaff = res.RESPONSE_DATA
    //     )
    // }

    // private async setProductStore() {
    //     await this.mainMasterService.masProductMaingetAll().then(res => {
    //         this.typeheadProduct = res;
    //     })
    // }

    // private async setProductUnitStore() {
    //     await this.mainMasterService.masDutyUnitMaingetAll().then(res => {
    //         this.typeheadProductUnit = res;
    //     })
    // }

    // private async setCommunicateStore() {
    //     await this.mainMasterService.masCommunicationchanelMaingetAll().then(res => {
    //         this.typeheadcommunicateModel = res;
    //     })
    // }
    private async setRegionStore() {
        await this.mainMasterService.MasLocalegetByCon().then(res => {
            let Locale = res.RESPONSE_DATA;
            if (Locale.length > 0) {
                Locale.map(m =>
                    this.typeheadRegion.push({
                        SUB_DISTRICT_ID: m.SUB_DISTRICT_ID,
                        SUB_DISTRICT_NAME_TH: m.SUB_DISTRICT_NAME_TH,
                        SUB_DISTRICT_NAME_EN: m.SUB_DISTRICT_NAME_EN,
                        DISTRICT_NAME_TH: m.DISTRICT_NAME_TH,
                        DISTRICT_NAME_EN: m.DISTRICT_NAME_EN,
                        PROVINCE_NAME_TH: m.PROVINCE_NAME_TH,
                        PROVINCE_NAME_EN: m.PROVINCE_NAME_EN,
                    })
                )
            }
        })
    }

    selectItemLocaleRegion(ele: any) {
        this.NoticeLocale.at(0).patchValue({
            SUB_DISTRICT_ID: ele.item.SUB_DISTRICT_ID
        });

        // ///********SET LOCALE_OFFICE_CODE*********//
        const MasSubDrt: any = {
            TEXT_SEARCH: "",
            SUB_DISTRICT_ID: ele.item.SUB_DISTRICT_ID,
            DISTRICT_ID: null
        }
        this.preloader.setShowPreloader(true);
        this.mainMasterService.MasSubDistrictgetByCon(MasSubDrt).subscribe(s => {
            if (s.length)
                this.LOCALE_OFFICE_CODE = s[0].OFFICE_CODE;
            this.preLoaderService.setShowPreloader(false);
        });
    }

    public searchRegion = (text2$: Observable<string>) =>
        text2$
            .debounceTime(200)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.noticeService.MasLocalegetByCon_Search({ TEXT_SEARCH: term })
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of([]);
                    })
            )
            .do(() => this.searching = false);

    public searchStaff = (text2$: Observable<string>) =>
        text2$
            .debounceTime(200)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.noticeService.MasStaffgetByCon_Search({ TEXT_SEARCH: term })
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of([]);
                    })
            )
            .do(() => this.searching = false);

    selectItemStaff(e, i) {
        var _ContributorID;

        if (i == 0) _ContributorID = 7;
        else if (i == 1) _ContributorID = 8;
        else if (i == 2) _ContributorID = 9;

        this.NoticeStaff.at(i).patchValue({
            IsNewItem: true,
            NOTICE_ID: this.NOTICE_ID,
            CONTRIBUTOR_ID: _ContributorID,
            BIRTH_DATE: e.item.BIRTH_DATE,
            FIRST_NAME: e.item.FIRST_NAME,
            ID_CARD: e.item.ID_CARD,
            IS_ACTIVE: e.item.IS_ACTIVE,
            LAST_NAME: e.item.LAST_NAME,
            FULL_NAME: `${e.item.TITLE_SHORT_NAME_TH || ''}${e.item.FIRST_NAME || ''} ${e.item.LAST_NAME || ''}`,
            MANAGEMENT_DEPT_CODE: e.item.MANAGEMENT_DEPT_CODE,
            MANAGEMENT_DEPT_LEVEL: e.item.MANAGEMENT_DEPT_LEVEL,
            MANAGEMENT_DEPT_NAME: e.item.MANAGEMENT_DEPT_NAME,
            MANAGEMENT_OFFICE_CODE: e.item.MANAGEMENT_OFFICE_CODE,
            MANAGEMENT_OFFICE_NAME: e.item.MANAGEMENT_OFFICE_NAME,
            MANAGEMENT_OFFICE_SHORT_NAME: e.item.MANAGEMENT_OFFICE_SHORT_NAME,
            MANAGEMENT_POS_CODE: e.item.MANAGEMENT_POS_CODE,
            MANAGEMENT_POS_LEVEL: e.item.MANAGEMENT_POS_LEVEL,
            MANAGEMENT_POS_LEVEL_NAME: e.item.MANAGEMENT_POS_LEVEL_NAME,
            MANAGEMENT_POS_NAME: e.item.MANAGEMENT_POS_NAME,
            MANAGEMENT_UNDER_DEPT_CODE: e.item.MANAGEMENT_UNDER_DEPT_CODE,
            MANAGEMENT_UNDER_DEPT_LEVEL: e.item.MANAGEMENT_UNDER_DEPT_LEVEL,
            MANAGEMENT_UNDER_DEPT_NAME: e.item.MANAGEMENT_UNDER_DEPT_NAME,
            MANAGEMENT_WORK_DEPT_CODE: e.item.MANAGEMENT_WORK_DEPT_CODE,
            MANAGEMENT_WORK_DEPT_LEVEL: e.item.MANAGEMENT_WORK_DEPT_LEVEL,
            MANAGEMENT_WORK_DEPT_NAME: e.item.MANAGEMENT_WORK_DEPT_NAME,
            OPERATION_DEPT_CODE: e.item.OPERATION_DEPT_CODE,
            OPERATION_DEPT_LEVEL: e.item.OPERATION_DEPT_LEVEL,
            OPERATION_DEPT_NAME: e.item.OPERATION_DEPT_NAME,
            OPERATION_OFFICE_CODE: e.item.OPERATION_OFFICE_CODE,
            OPERATION_OFFICE_NAME: e.item.OPERATION_OFFICE_NAME,
            OPERATION_OFFICE_SHORT_NAME: e.item.OPERATION_OFFICE_SHORT_NAME,
            OPERATION_POS_CODE: e.item.OPERATION_POS_CODE,
            OPERATION_POS_LEVEL_NAME: e.item.OPERATION_POS_LEVEL_NAME,
            OPERATION_UNDER_DEPT_CODE: e.item.OPERATION_UNDER_DEPT_CODE,
            OPERATION_UNDER_DEPT_LEVEL: e.item.OPERATION_UNDER_DEPT_LEVEL,
            OPERATION_UNDER_DEPT_NAME: e.item.OPERATION_UNDER_DEPT_NAME,
            OPERATION_WORK_DEPT_CODE: e.item.OPERATION_WORK_DEPT_CODE,
            OPERATION_WORK_DEPT_LEVEL: e.item.OPERATION_WORK_DEPT_LEVEL,
            OPERATION_WORK_DEPT_NAME: e.item.OPERATION_WORK_DEPT_NAME,
            OPREATION_POS_LEVEL: e.item.OPREATION_POS_LEVEL,
            OPREATION_POS_NAME: e.item.OPREATION_POS_NAME,
            REMARK: e.item.REMARK,
            REPRESENT_DEPT_CODE: e.item.REPRESENT_DEPT_CODE,
            REPRESENT_DEPT_LEVEL: e.item.REPRESENT_DEPT_LEVEL,
            REPRESENT_DEPT_NAME: e.item.REPRESENT_DEPT_NAME,
            REPRESENT_OFFICE_CODE: e.item.REPRESENT_OFFICE_CODE,
            REPRESENT_OFFICE_NAME: e.item.REPRESENT_OFFICE_NAME,
            REPRESENT_OFFICE_SHORT_NAME: e.item.REPRESENT_OFFICE_SHORT_NAME,
            REPRESENT_POS_CODE: e.item.REPRESENT_POS_CODE,
            REPRESENT_POS_LEVEL: e.item.REPRESENT_POS_LEVEL,
            REPRESENT_POS_LEVEL_NAME: e.item.REPRESENT_POS_LEVEL_NAME,
            REPRESENT_POS_NAME: e.item.REPRESENT_POS_NAME,
            REPRESENT_UNDER_DEPT_CODE: e.item.REPRESENT_UNDER_DEPT_CODE,
            REPRESENT_UNDER_DEPT_LEVEL: e.item.REPRESENT_UNDER_DEPT_LEVEL,
            REPRESENT_UNDER_DEPT_NAME: e.item.REPRESENT_UNDER_DEPT_NAME,
            REPRESENT_WORK_DEPT_CODE: e.item.REPRESENT_WORK_DEPT_CODE,
            REPRESENT_WORK_DEPT_LEVEL: e.item.REPRESENT_WORK_DEPT_LEVEL,
            REPRESENT_WORK_DEPT_NAME: e.item.REPRESENT_WORK_DEPT_NAME,
            STAFF_CODE: e.item.STAFF_CODE,
            STAFF_REF_ID: e.item.STAFF_REF_ID,
            // STAFF_ID: this.NoticeStaff.value[i].STAFF_ID,
            STAFF_TYPE: e.item.STAFF_TYPE,
            STATUS: e.item.STATUS,
            TITLE_ID: e.item.TITLE_ID,
            TITLE_NAME_EN: e.item.TITLE_NAME_EN,
            TITLE_NAME_TH: e.item.TITLE_NAME_TH,
            TITLE_SHORT_NAME_EN: e.item.TITLE_SHORT_NAME_EN,
            TITLE_SHORT_NAME_TH: e.item.TITLE_SHORT_NAME_TH,
        })
    }

    deleteStaff(i: number) {
        let noticeStaff = this.NoticeStaff.at(i).value;

        let mStaffId = noticeStaff.STAFF_ID;

        mStaffId = noticeStaff.STAFF_ID == "" ? null : noticeStaff.STAFF_ID;

        if (mStaffId)
            this.DelStaff.push([noticeStaff].reduce((acc, curr) => { return { STAFF_ID: curr.STAFF_ID } }, {}));

        this.clearStaffOfindex(i);
    }

    setStaffOfindex(i) {
        var _ContributorID;

        if (i == 0) _ContributorID = 7;
        else if (i == 1) _ContributorID = 8;
        else if (i == 2) _ContributorID = 9;

        let UserAccountID = localStorage.getItem("UserAccountID");

        for (let l of this.typeheadStaff) {
            let code: any = l.STAFF_ID;

            if (UserAccountID == code) {

                this.NoticeStaff.at(i).patchValue({
                    ProgramCode: this.programSpect,
                    ProcessCode: '0002',
                    NoticeCode: this.noticeCode,
                    IS_ACTIVE: 1,
                    FULL_NAME: `${l.TITLE_SHORT_NAME_TH || ''}${l.FIRST_NAME || ''} ${l.LAST_NAME || ''}`,
                    STAFF_CODE: code,
                    OPERATION_POS_CODE: l.OPERATION_POS_CODE || l.OPERATION_POS_CODE,
                    OPREATION_POS_NAME: l.OPREATION_POS_NAME || l.OPREATION_POS_NAME,
                    MANAGEMENT_POS_NAME: l.MANAGEMENT_POS_NAME,
                    MANAGEMENT_POS_CODE: l.MANAGEMENT_POS_CODE,
                    MANAGEMENT_POS_LEVEL: l.MANAGEMENT_POS_LEVEL,
                    MANAGEMENT_POS_LEVEL_NAME: l.MANAGEMENT_POS_LEVEL_NAME,
                    MANAGEMENT_DEPT_CODE: l.MANAGEMENT_DEPT_CODE,
                    MANAGEMENT_DEPT_NAME: l.MANAGEMENT_DEPT_NAME,
                    MANAGEMENT_DEPT_LEVEL: l.MANAGEMENT_DEPT_LEVEL,
                    MANAGEMENT_UNDER_DEPT_CODE: l.MANAGEMENT_UNDER_DEPT_CODE,
                    MANAGEMENT_UNDER_DEPT_NAME: l.MANAGEMENT_UNDER_DEPT_NAME,
                    MANAGEMENT_UNDER_DEPT_LEVEL: l.MANAGEMENT_UNDER_DEPT_LEVEL,
                    MANAGEMENT_WORK_DEPT_CODE: l.MANAGEMENT_WORK_DEPT_CODE,
                    MANAGEMENT_WORK_DEPT_NAME: l.MANAGEMENT_WORK_DEPT_NAME,
                    MANAGEMENT_WORK_DEPT_LEVEL: l.MANAGEMENT_WORK_DEPT_LEVEL,
                    MANAGEMENT_OFFICE_CODE: l.MANAGEMENT_OFFICE_CODE,
                    MANAGEMENT_OFFICE_NAME: l.MANAGEMENT_OFFICE_NAME,
                    MANAGEMENT_OFFICE_SHORT_NAME: l.MANAGEMENT_OFFICE_SHORT_NAME,
                    OPERATION_DEPT_LEVEL: l.OPERATION_DEPT_LEVEL,
                    OPERATION_DEPT_CODE: l.OPERATION_DEPT_CODE,
                    OPERATION_DEPT_NAME: `${l.OPERATION_DEPT_NAME}`,
                    CONTRIBUTOR_ID: _ContributorID,
                    TITLE_NAME_TH: l.TITLE_NAME_TH,
                    FIRST_NAME: l.FIRST_NAME,
                    LAST_NAME: l.LAST_NAME,
                    OPERATION_OFFICE_CODE: l.OPERATION_OFFICE_CODE,
                    OPERATION_OFFICE_NAME: l.OPERATION_OFFICE_NAME,
                    OPERATION_OFFICE_SHORT_NAME: l.OPERATION_OFFICE_SHORT_NAME,
                    ID_CARD: l.ID_CARD,
                    OPERATION_POS_LEVEL_NAME: l.OPERATION_POS_LEVEL_NAME,
                    OPERATION_UNDER_DEPT_CODE: l.OPERATION_UNDER_DEPT_CODE,
                    OPERATION_UNDER_DEPT_LEVEL: l.OPERATION_UNDER_DEPT_LEVEL,
                    OPERATION_UNDER_DEPT_NAME: l.OPERATION_UNDER_DEPT_NAME,
                    OPERATION_WORK_DEPT_CODE: l.OPERATION_WORK_DEPT_CODE,
                    OPERATION_WORK_DEPT_LEVEL: l.OPERATION_WORK_DEPT_LEVEL,
                    OPERATION_WORK_DEPT_NAME: l.OPERATION_WORK_DEPT_NAME,
                    OPREATION_POS_LEVEL: l.OPREATION_POS_LEVEL,
                    REMARK: l.REMARK,
                    STAFF_ID: l.STAFF_ID,
                    STAFF_TYPE: l.STAFF_TYPE,
                    STATUS: l.STATUS,
                    TITLE_ID: l.TITLE_ID,
                    TITLE_NAME_EN: l.TITLE_NAME_EN,
                    TITLE_SHORT_NAME_EN: l.TITLE_SHORT_NAME_EN,
                    TITLE_SHORT_NAME_TH: l.TITLE_SHORT_NAME_TH
                });

                break;
            }
        }
    }

    blurDataUnit(ele: any, index: number) {
        let text = ele.value;
        if (!ele.value) {
            this.NoticeProduct.at(index).patchValue({
                QtyUnit: "",
                DutyCode: ""
            });
            ele.value = "";
        } else {
            let units = this.typeheadProductUnit
                .filter(v => (v.DutyCode.toLowerCase().indexOf(text.toLowerCase()) > - 1)
                ).slice(0, 10);
            if (units.length < 0 || units.length > 0 && !this.selectUnit) {
                this.NoticeProduct.at(index).patchValue({
                    QtyUnit: "",
                    DutyCode: ""
                });
                ele.value = "";
            }

            this.selectUnit = true;
        }
    }

    beforeDeleteProduct(id: string, index: number) {
        this.productId = id;
        this.productIndex = index;
        this.deleteProduct.text = Message.confirmAction;
        this.deleteProduct.show();
    }

    async onDeleteProduct() {
        if (this.mode === 'C')
            this.NoticeProduct.removeAt(this.productIndex);
        else if (this.mode === 'R') {
            if (this.NoticeProduct.at(this.productIndex).value.IsNewItem) {
                this.NoticeProduct.removeAt(this.productIndex);
                return;
            }
            this.productDel.push(this.productId);
            this.NoticeProduct.removeAt(this.productIndex);
        }
    }

    async onDelete() { }
    async onDeleteSuspect() { }
    async onDeleteDocument() { }
    Ilg60O02000204_Output () { }

    beforeDeleteSuspect(id: string, index: number) {
        this.suspectId = id;
        this.suspectIndex = index;
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
                if (this.mode === 'C')
                    this.NoticeSuspect.removeAt(index);
                else if (this.mode === 'R') {
                    this.DelSuspect.push([id].reduce((acc, curr) => { return { SUSPECT_ID: curr } }, {}));
                    this.NoticeSuspect.removeAt(index);
                }
            }
        })
    }

    beforeDeleteDocument(id: string, index: number) {
        this.documentId = id;
        this.documentIndex = index;
        if (this.mode === 'C') {
            this.NoticeDocument.removeAt(index);
        } else if (this.mode === 'R') {
            if (this.NoticeDocument.at(index).value.IsNewItem) {
                this.NoticeDocument.removeAt(index);
                return;
            }

            this.deleteDocument.text = Message.confirmAction;
            this.deleteDocument.show();
        }
    }

    getContributorID(conId: any) {
        let result = this.CONTRIBUTOR.find(m => m.value == conId).text;
        return result;
    }

    openSuspect(e) {
        this.modal = this.suspectModalService.open(e, { size: 'lg', centered: true });
    }

    onChangeConceal() {
        this.isConceal = !this.isConceal;
        const informName = 'สายลับ (ขอปิดนาม)';
        this.NoticeInformer.at(0).patchValue({
            FIRST_NAME: !this.isConceal ? '' : informName,
            INFORMER_STATUS: !this.isConceal ? 1 : 0,
            // AGE: null,
            // ADDRESS_NO: '',
            // VILLAGE_NO: '',
            // BUILDING_NAME: '',
            // ROOM_NO: '',
            // FLOOR: '',
            // ALLEY: '',
            // LANE: '',
            // ROAD: '',
            // Region: '',
            // SUB_DISTRICT_ID: ''
        })
    }

    getRefer(item: any) {
        item = item.value;
        if (item.ENTITY_TYPE == 0 && item.PERSON_TYPE == 0) {
            return item.ID_CARD || '';
        } else if (item.ENTITY_TYPE == 0 && item.PERSON_TYPE == 1) {
            return item.PASSPORT_NO || '';
        } else if (item.ENTITY_TYPE == 1) {
            return item.COMPANY_REGISTRATION_NO || '';
        } else {
            return "";
        }
    }

    onCancelEdit() {
        this.router.navigate(['/notice/list']);
        this.cancelButton.next(false);
    }

    async onCancelConfirmClick() {
        swal({
            title: '',
            text: 'ยืนยันการทำรายการหรือไม่',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ตกลง',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.value) {
                if (this.mode === "R")
                    this.onComplete();
                else
                    this.onCancelEdit();
            }
        })
    }

    onSelectionForm(ev: any) {
        let ByID = ev.target.id;
        switch (this.mode) {
            case 'C':
                if (ByID === 'rv1') {
                    this.DisconID = false;
                    this.seq2 = 1;
                    this.seq3 = 2;
                    this.isReq_Staff0.next(false);
                    this.isReq_Staff1.next(false);
                    this.noticeForm.controls['IS_AUTHORITY'].setValue(1);
                    this.setStaffOfindex(1);
                    this.clearStaffOfindex(0);
                } else if (ByID === 'rv2') {
                    this.DisconID = true;
                    this.seq1 = 1;
                    this.seq2 = 2;
                    this.seq3 = 3;
                    this.isReq_Staff0.next(false);
                    this.isReq_Staff1.next(false);
                    this.noticeForm.controls['IS_AUTHORITY'].setValue(0);
                    this.setStaffOfindex(0);
                    this.clearStaffOfindex(1);
                }
                break;
            case 'R':
                if (ByID === 'rv1') {
                    this.DisconID = false;
                    this.seq2 = 1;
                    this.seq3 = 2;
                    this.isReq_Staff0.next(false);
                    this.isReq_Staff1.next(false);
                } else if (ByID === 'rv2') {
                    this.DisconID = true;
                    this.seq1 = 1;
                    this.seq2 = 2;
                    this.seq3 = 3;
                    this.isReq_Staff0.next(false);
                    this.isReq_Staff1.next(false);
                }
                break;

            default:
                break;
        }
    }
    // ##################################Document##################################
    fileList: Document[] = []
    owlOption = {
        items: 5,
        nav: true,
        dots: false,
        slideBy: 5,
        margin: 10,
        responsiveClass: true
    }

    openModal(e) {
        this.modal = this.suspectModalService.open(e, { size: 'lg', centered: true });
    }

    deleteItem(i: number) {
        const doc = this.fileList[i];
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
                if (!doc.DOCUMENT_ID) {
                    this.fileList.splice(i, 1);
                    return;
                }
                this.DelDoc.push([doc.DOCUMENT_ID].reduce((acc, curr) => { return { DOCUMENT_ID: curr } }, {}));
                this.fileList.splice(i, 1);
            }
        })
    }

    DownloadItem(item) {
        this.preloader.setShowPreloader(true);
        this.noticeService.downloadFile(item.DOCUMENT_ID)
            .subscribe(
                (data) => this.handleDownload(data, item));
    }

    handleDownload(data: any, item: any) {
        this.preloader.setShowPreloader(false);
        var blob = URL.createObjectURL(new Blob([data], { type: '*/*' }));
        saveAs(blob, item.DOCUMENT_NAME);
    }

    Output(event: Document) {
        this.fileList = [...this.fileList, event]
    }
    // ##################################End Document##################################

    // ################################## Print Report ##################################
    clickPrint() {
        this.modal = this.ngbModel.open(this.printDocModel, { size: 'lg', centered: true })
    }
    // ################################## End Print Report ##################################

    CreateSuspect(Event) {
        this.PERSON_ID = Event.PERSON_ID;
        switch (Event.e) {
            case 'Create':
                this.ModeEmit = 'C';
                this.selecterSuspectView(this.ModeEmit, Event.MISTREAT_NO);
                break;
            case 'Read':
                this.ModeEmit = 'R';
                this.selecterSuspectView(this.ModeEmit, Event.MISTREAT_NO);
                break;
            default:
                break;
        }
    }

    selecterSuspectView(Mode, MISTREAT_NO) {
        if (MISTREAT_NO == 0 || Mode == 'C')
            setTimeout(() => {
                this.modal = this.ngbModel.open(this.CreateSuspectModal, { windowClass: 'my-class' });
            }, 200);
        else
            setTimeout(() => {
                this.modal = this.ngbModel.open(this.ViewLawbreakerModal, { size: <any>'lg', centered: true });
            }, 200);
    }

}
