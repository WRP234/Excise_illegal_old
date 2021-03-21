import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormControlName, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { setDateMyDatepicker, setZero, getDateMyDatepicker } from 'app/config/dateFormat';
import { IMasStaffgetByCon } from 'app/pages/model';
import { Observable, merge, forkJoin, from, observable } from 'rxjs';
import { takeUntil, mergeMap, map, finalize } from 'rxjs/operators';
// import { Message } from '../../../config/message';
import { NavigationService } from '../../../shared/header-navigation/navigation.service';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import { SidebarService } from '../../../shared/sidebar/sidebar.component';
import { EvidenceService } from '../../evidenceIn/evidenceIn.service';
import { MasterService } from '../../model/master.service';
import { Mode } from '../evidenceOut-Interface/mode';
import { EviStaffFC, staff, StaffVariable } from '../evidenceOut-Interface/staff';
import { EvidenceOut } from '../evidenceOut-Interface/evidenceOut'
import { EvidenceOutService } from '../evidenceOut.service';
import { ManageConfig } from './manage.component.config';
import { FileType, ImageDocument as imgDoc } from '../evidenceOut-Interface/evidenceOut-document';
import { saveAs } from 'file-saver';
import { EvidenceOutItem } from "../evidenceOut-Interface/evidenceOut-item";

@Component({
    selector: 'app-manage',
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss'],

})
export class ManageComponent extends ManageConfig implements OnInit {

    constructor(
        private activeRoute: ActivatedRoute,
        private fb: FormBuilder,
        private ngbModel: NgbModal,
        private navService: NavigationService,
        private EvidenceOutService: EvidenceOutService,
        private EviService: EvidenceService,
        private MasService: MasterService,
        private preloader: PreloaderService,
        private router: Router,
        private sidebarService: SidebarService
    ) {
        super();
    }

    ngOnInit() {
        this.preloader.setShowPreloader(true);

        this.createForm();

        this.active_Route();

        this.createFormStaffByEvidenceType();
    }

    private createForm() {
        const d = this.today;
        let nowDate = setDateMyDatepicker(d);
        let nowTime = `${setZero(d.getHours())}:${setZero(d.getMinutes())}`;

        this.evidenceOutFG = this.fb.group({
            EVIDENCE_OUT_ID: new FormControl(""),
            OFFICE_CODE: new FormControl(""),
            EVIDENCE_OUT_CODE: new FormControl(this.EVIDENCE_OUT_CODE),
            EVIDENCE_OUT_DATE: new FormControl(nowDate),
            EVIDENCE_OUT_TYPE: new FormControl(""),
            EVIDENCE_OUT_NO: new FormControl("", Validators.required),
            EVIDENCE_OUT_NO_DATE: new FormControl(nowDate, Validators.required),
            BOOK_NO: new FormControl(""),
            RECEIPT_NO: new FormControl(""),
            PAY_DATE: new FormControl(""),
            APPROVE_DATE: new FormControl(nowDate),
            RETURN_DATE: new FormControl(""),
            REMARK: new FormControl(""),
            APPROVE_NO: new FormControl(""),
            EVIDENCE_IN_ID: new FormControl(""),
            WAREHOUSE_ID: new FormControl(""),
            DELIVERY: new FormControl(""),
            REMARK_CANCEL: new FormControl(""),
            SEND_TO_OFFICE_CODE: new FormControl(""),
            SEND_TO_OFFICE_NAME: new FormControl(""),
            IS_ACTIVE: new FormControl(""),

            EvidenceOutItem: this.fb.array([]),
            EvidenceOutDetail: this.fb.array([]),
            EvidenceOutStaff: this.fb.array([]),

            /** customs */
            EVIDENCE_OUT_TIME: new FormControl(nowTime),
            EVIDENCE_OUT_NO_TIME: new FormControl(nowTime),
            APPROVE_TIME: new FormControl(nowTime),
            _EvidenceOutDetail: this.fb.array([])
        });

    }

    private active_Route() {
        this.sub = this.activeRoute.params.subscribe(p => {
            this.mode = p['mode'];
            this.moduleType = p['type'];
            console.log('this.moduleType : ', this.moduleType)
            switch (this.mode) {
                case Mode.C:
                    // set false
                    this.PrintButton.next(false);
                    this.EditButton.next(false);
                    this.DeleteButton.next(false);
                    this.showEditField = false;
                    // set true
                    this.SaveButton.next(true);
                    this.CancelButton.next(true);

                    this.setStaffByLogin();
                    break;

                case Mode.R:
                    // set false
                    this.SaveButton.next(false);
                    this.CancelButton.next(false);

                    // set true
                    this.PrintButton.next(true);
                    this.EditButton.next(true);
                    this.DeleteButton.next(true);
                    this.showEditField = true;

                    if (p['code']) {
                        this.EVIDENCE_OUT_ID = p['code'];
                    }

                    this.EvidenceOutService.EvidenceOutgetByCon(this.EVIDENCE_OUT_ID)
                        .pipe(
                            mergeMap(x => {
                                const params = { DOCUMENT_TYPE: this.DOCUMENT_TYPE, REFERENCE_CODE: x.EVIDENCE_OUT_ID };
                                return this.EvidenceOutService.GetDocumentByCon(params)
                                    .pipe(map(o => { return { ...x, Document: o } }))
                            })
                        )
                        .finally(() => this.preloader.setShowPreloader(false))
                        .subscribe(x => { this.setEvidenceOutForm(x) },
                            (err) => this.swalFn('', `EvidenceOutgetByCon ${err.name}`, 'error').then(() => location.reload()));
                    break;
            }

            this.activeRoute.data.subscribe(
                (data) => {

                    data.urls[1].url = `/evidenceOut/list/${this.moduleType}`;

                    switch (this.moduleType) {
                        case '11':
                            data.urls[1].title = "ค้นหารายการคืนของกลาง";
                            data.urls[2].title = "จัดการข้อมูลรายการคืนของกลาง";
                            data.codePage = "ILG60-11-02-00-00";
                            this.EVIDENCE_OUT_PREFIX = "RT";
                            this.EVIDENCE_OUT_TYPE = 0;
                            this.DOCUMENT_TYPE = "20";
                            break;
                        case '12':
                            data.urls[1].title = "ค้นหารายการจัดเก็บเข้าพิพิธภัณฑ์";
                            data.urls[2].title = "จัดการข้อมูลรายการจัดเก็บเข้าพิพิธภัณฑ์";
                            data.codePage = "ILG60-12-02-00-00";
                            this.EVIDENCE_OUT_PREFIX = "MU";
                            this.EVIDENCE_OUT_TYPE = 5;
                            this.DOCUMENT_TYPE = "24";
                            break;
                        case '13':
                            data.urls[1].title = "ค้นหารายการขายทอดตลาด";
                            data.urls[2].title = "จัดการข้อมูลรายการขายทอดตลาด";
                            data.codePage = "ILG60-13-02-00-00";
                            this.EVIDENCE_OUT_PREFIX = "SL";
                            this.EVIDENCE_OUT_TYPE = 3;
                            this.DOCUMENT_TYPE = "22";
                            break;
                        case '14':
                            data.urls[1].title = "ค้นหารายการทำลายของกลาง";
                            data.urls[2].title = "จัดการข้อมูลรายการทำลายของกลาง";
                            data.codePage = "ILG60-14-02-00-00";
                            this.EVIDENCE_OUT_PREFIX = "DT";
                            this.EVIDENCE_OUT_TYPE = 2;
                            this.DOCUMENT_TYPE = "21";
                            break;
                        case '15G':
                            data.urls[1].title = "ค้นหารายการนำของกลางออกจากคลัง";
                            data.urls[1].url = `/evidenceOut/list/15`;
                            data.urls[2].title = "จัดการข้อมูลนำของกลางออกจากคลังไปใช้ทางราชการ";
                            data.codePage = "ILG60-15-02-00-00";
                            this.EVIDENCE_OUT_PREFIX = "BO";
                            this.EVIDENCE_OUT_TYPE = 6;
                            this.DOCUMENT_TYPE = "23";
                            break;
                        case '15D':
                            data.urls[1].title = "ค้นหารายการนำของกลางออกจากคลัง";
                            data.urls[1].url = `/evidenceOut/list/15`;
                            data.urls[2].title = "จัดการข้อมูลรายการนำของกลางออกจากคลังไปบริจาค";
                            data.codePage = "ILG60-15-03-00-00";
                            this.EVIDENCE_OUT_PREFIX = "DN";
                            this.EVIDENCE_OUT_TYPE = 7;
                            this.DOCUMENT_TYPE = "23";
                            break;
                        case '16':
                            data.urls[1].title = "ค้นหารายการโอนย้ายของกลาง";
                            data.urls[2].title = "จัดการข้อมูลรายการโอนย้ายของกลาง";
                            data.codePage = "ILG60-16-02-00-00";
                            this.EVIDENCE_OUT_PREFIX = "TF";
                            this.EVIDENCE_OUT_TYPE = 8;
                            this.DOCUMENT_TYPE = "19";
                            break;
                    }

                }
            );
        });
    }

    setEvidenceOutForm(e: EvidenceOut) {
        for (var key in e) {
            if (e[key] === 'null') e[key] = null;
        }

        this.EVIDENCE_OUT_CODE = e.EVIDENCE_OUT_CODE;
        this.EVIDENCE_OUT_TYPE = e.EVIDENCE_OUT_TYPE

        /** set date */
        const EVIDENCE_OUT_DATE = setDateMyDatepicker(new Date(e.EVIDENCE_OUT_DATE));
        const EVIDENCE_OUT_NO_DATE = setDateMyDatepicker(new Date(e.EVIDENCE_OUT_NO_DATE));
        const APPROVE_DATE = setDateMyDatepicker(new Date(e.APPROVE_DATE));
        const RETURN_DATE = e.RETURN_DATE ? setDateMyDatepicker(new Date(e.RETURN_DATE)) : '';
        const PAY_DATE = e.PAY_DATE ? setDateMyDatepicker(new Date(e.PAY_DATE)) : '';

        /** set time */
        const eOutDate = new Date(e.EVIDENCE_OUT_DATE);
        const EVIDENCE_OUT_TIME = `${setZero(eOutDate.getHours())}:${setZero(eOutDate.getMinutes())}`;
        const eOutNoDate = new Date(e.EVIDENCE_OUT_NO_DATE);
        const EVIDENCE_OUT_NO_TIME = `${setZero(eOutNoDate.getHours())}:${setZero(eOutNoDate.getMinutes())}`;
        const approveDate = new Date(e.APPROVE_DATE);
        const APPROVE_TIME = `${setZero(approveDate.getHours())}:${setZero(approveDate.getMinutes())}`;


        this.evidenceOutFG.patchValue({
            EVIDENCE_OUT_ID: e.EVIDENCE_OUT_ID,
            OFFICE_CODE: e.OFFICE_CODE,
            EVIDENCE_OUT_CODE: e.EVIDENCE_OUT_CODE,
            EVIDENCE_OUT_DATE: EVIDENCE_OUT_DATE,
            EVIDENCE_OUT_TYPE: e.EVIDENCE_OUT_TYPE,
            EVIDENCE_OUT_NO: e.EVIDENCE_OUT_NO,
            EVIDENCE_OUT_NO_DATE: EVIDENCE_OUT_NO_DATE,
            BOOK_NO: e.BOOK_NO,
            RECEIPT_NO: e.RECEIPT_NO,
            PAY_DATE: PAY_DATE,
            APPROVE_DATE: APPROVE_DATE,
            RETURN_DATE: RETURN_DATE,
            REMARK: e.REMARK,
            APPROVE_NO: e.APPROVE_NO,
            EVIDENCE_IN_ID: e.EVIDENCE_IN_ID,
            WAREHOUSE_ID: e.WAREHOUSE_ID,
            DELIVERY: e.DELIVERY,
            REMARK_CANCEL: e.REMARK_CANCEL,
            SEND_TO_OFFICE_CODE: e.SEND_TO_OFFICE_CODE,
            SEND_TO_OFFICE_NAME: e.SEND_TO_OFFICE_NAME,
            IS_ACTIVE: e.IS_ACTIVE,

            EvidenceOutItem: e.EvidenceOutItem,
            __EvidenceOutDetail: e.EvidenceOutDetail,

            /** customs */
            EVIDENCE_OUT_TIME: EVIDENCE_OUT_TIME,
            EVIDENCE_OUT_NO_TIME: EVIDENCE_OUT_NO_TIME,
            APPROVE_TIME: APPROVE_TIME
        });

        /** set item */
        const eOutItem = e.EvidenceOutItem.reduce((a, c) => {
            const x = this.getItemDetailObj(e['EvidenceOutDetail'], c.EvidenceOutStockBalance[0]['EVIDENCE_IN_ITEM_ID']);
            return [...a, {
                ...c,

                /** set for display on eOutItem table is case 'R'*/
                LAWSUIT_NO: "", // wait data return
                EVIDENCE_IN_ITEM_CODE: x.EVIDENCE_IN_ITEM_CODE,
                PRODUCT_DESC: x.PRODUCT_DESC,

                EvidenceOutStockBalance: this.setFormArray(c.EvidenceOutStockBalance)
            }]
        }, []);

        this.setItemFormArray(eOutItem, 'EvidenceOutItem');

        /** set evidenceOutDetail*/
        // const eOutDetail = e.EvidenceOutDetail.reduce((a, c) => {
        //     return [...a, {
        //         EVIDENCE_OUT_DETAIL_ID: c.EVIDENCE_OUT_DETAIL_ID,
        //         EVIDENCE_OUT_ID: c.EVIDENCE_OUT_ID,
        //         EVIDENCE_IN_ID: c.EVIDENCE_IN_ID,
        //         IS_ACTIVE: c.IS_ACTIVE
        //     }]
        // }, []);
        this.setItemFormArray(e.EvidenceOutDetail, '__EvidenceOutDetail');

        /** set document */
        this.fileList = e['Document'].map(o => {
            let idx = o.DOCUMENT_OLD_NAME.lastIndexOf('.');
            const FILE_TYPE = (idx < 1) ? "" : o.DOCUMENT_OLD_NAME.substr(idx + 1);
            let IMAGE_SHOW;
            switch (FILE_TYPE) {
                case FileType.xlsx:
                case FileType.xls:
                    IMAGE_SHOW = imgDoc.xlsx;
                    break;

                case FileType.doc:
                case FileType.docx:
                    IMAGE_SHOW = imgDoc.docx;
                    break;

                case FileType.pdf:
                    IMAGE_SHOW = imgDoc.pdf;
                    break;
                case FileType.jpg:
                case FileType.jpeg:
                case FileType.png:
                case FileType.gif:
                    IMAGE_SHOW = this.EvidenceOutService.getImage(o.DOCUMENT_ID);
                    break;
            }
            return { ...o, FILE_TYPE, IMAGE_SHOW, ACTION: this.Action.EDIT };

        }).filter(f => f.IS_ACTIVE == 1);

        /** set staff */
        this.setStaffByContributorId(e.EvidenceOutStaff, this.Action.EDIT, false);

        console.log('getbyCon this.evidenceOutFG : ', this.evidenceOutFG.getRawValue())
    }


    // **********************************
    // -------------- Action -----------
    // **********************************
    clickSave() {
        const x = this.evidenceOutFG.getRawValue();
        const m = this.moduleType;

        /** collap 1 */
        if (m == '11' && !x.BOOK_NO) {
            this.evidenceOutFG.get('BOOK_NO').markAsDirty();
            this.swalFn('', 'กรุณาระบุข้อมูล "ใบเสร็จรับเงินภาษีเล่มที่"', 'warning');
            return;
        }

        if (m == '11' && !x.RECEIPT_NO) {
            this.evidenceOutFG.get('RECEIPT_NO').markAsDirty();
            this.swalFn('', 'กรุณาระบุข้อมูล "ใบเสร็จรับเงินภาษีเลขที่"', 'warning');
            return;
        }

        if (m == '11' && !x.PAY_DATE) {
            this.evidenceOutFG.get('PAY_DATE').markAsDirty();
            this.swalFn('', 'กรุณาระบุข้อมูล "วันที่ชำระภาษี"', 'warning');
            return;
        }


        if (!x.EVIDENCE_OUT_NO) {
            this.evidenceOutFG.get('EVIDENCE_OUT_NO').markAsDirty();
            this.swalFn('', 'กรุณาระบุข้อมูล "เลขหนังสือ"', 'warning');
            return;
        }

        if (!x.EVIDENCE_OUT_NO_DATE) {
            this.evidenceOutFG.get('EVIDENCE_OUT_NO_DATE').markAsDirty();
            this.swalFn('', 'กรุณาระบุข้อมูล "ลงวันที่"', 'warning');
            return;
        }

        if (this.evidenceOutFG.get('EVIDENCE_OUT_NO_TIME').invalid && x.EVIDENCE_OUT_NO_DATE) {
            this.swalFn('', 'กรุณาตรวจสอบข้อมูล "เวลา"', 'warning');
            return;
        }

        if (this.evidenceOutFG.get('APPROVE_TIME').invalid && x.APPROVE_DATE) {
            this.swalFn('', 'กรุณาตรวจสอบข้อมูล "เวลา"', 'warning');
            return;
        }

        if (m == '15G' && !x.REMARK) {
            this.evidenceOutFG.get('REMARK').markAsDirty();
            this.swalFn('', 'กรุณาระบุข้อมูล "เหตุผลในการนำออก"', 'warning');
            return;
        }

        if (m == '15D' && !this.RECIPIENT_STAFF.FULL_NAME) {
            this.RECIPIENT_FULL_NAME_REQ.next(true);
            this.swalFn('', 'กรุณาระบุข้อมูล "ชื่อผู้รับบริจาค"', 'warning');
            return;
        }

        if (m == '15D' && !this.RECIPIENT_STAFF.OPERATION_OFFICE_SHORT_NAME) {
            this.RECIPIENT_OFFICE_NAME_REQ.next(true);
            this.swalFn('', 'กรุณาระบุข้อมูล "หน่วยงาน"', 'warning');
            return;
        }

        if (m == '15D' && !x.REMARK) {
            this.evidenceOutFG.get('REMARK').markAsDirty();
            this.swalFn('', 'กรุณาระบุข้อมูล "เหตุผลในการบริจาค"', 'warning');
            return;
        }

        /** collap 2 */
        if (m == '13' && !x.EVIDENCE_OUT_DATE) {
            this.evidenceOutFG.get('EVIDENCE_OUT_DATE').markAsDirty();
            this.swalFn('', 'กรุณาระบุข้อมูล "วันที่ขาย"', 'warning');
            return;
        }

        if (this.evidenceOutFG.get('EVIDENCE_OUT_TIME').invalid && x.EVIDENCE_OUT_DATE) {
            this.swalFn('', 'กรุณาตรวจสอบข้อมูล "เวลา"', 'warning');
            return;
        }

        /** staff */
        const reqIsEmpty = this.EvidenceOutStaff.getRawValue().filter(f => f.IS_REQUIRE == true && !f.FULL_NAME);

        if (reqIsEmpty.length) {
            const pos_name = reqIsEmpty.reduce((a, c, i) => [...a,
            `${this.comma(i)}${this.STAFF_CONTRIBUTOR.find(f => f.value == c['CONTRIBUTOR_ID']).text}`
            ], "");

            this.swalFn('', `กรุณาระบุข้อมูล ${pos_name}`, 'warning');
            return;
        }

        /** set office code by staff first index */
        const s = this.EvidenceOutStaff.getRawValue();
        this.evidenceOutFG.patchValue({
            OFFICE_CODE: s[0]['OPERATION_OFFICE_CODE']
        });


        switch (this.mode) {
            case Mode.C:
                this.TransactionRunningHandling();
                break;
            case Mode.R:
                this.onSave();
                break;
        }
    }

    clickEdit() {
        this.showEditField = false;
        this.SaveButton.next(true);
        this.CancelButton.next(true);

        this.EditButton.next(false);
        this.DeleteButton.next(false);
        this.PrintButton.next(false);
    }

    clickCancel() {
        this.swalFnMulti('', this.Message.confirmAction, 'warning')
            .then((result) => {
                if (result.value) {
                    if (this.mode === Mode.C) {
                        this.router.navigate([`/evidenceOut/list/${this.moduleType.slice(0, 2)}`]);

                    } else if (this.mode === Mode.R) {
                        // set false
                        this.SaveButton.next(false);
                        this.CancelButton.next(false);
                        // set true
                        this.EditButton.next(true);
                        this.DeleteButton.next(true);
                        this.PrintButton.next(true);
                        this.showEditField = true;
                        location.reload();
                    }
                }
                else {
                    this.SaveButton.next(true);
                    this.CancelButton.next(true);

                    this.EditButton.next(false);
                    this.DeleteButton.next(false);
                    this.PrintButton.next(false);
                    this.showEditField = false;
                }
            })
    }

    clickDelete() {
        this.swalFnMulti('', this.Message.confirmAction, 'warning')
            .then((result) => {
                if (result.value) {
                    this.onEvidenceDeleteAll();
                }
            })
    }

    clickPrint() {
        this.modal = this.ngbModel.open(this.printDocModel, { size: 'lg', centered: true });
    }

    // **********************************
    // -------------- Function -----------
    // **********************************

    async TransactionRunningHandling() {
        this.preloader.setShowPreloader(true);
        const d: any = {
            RUNNING_TABLE: `${this.RUNNING_TABLE + '_' + this.EVIDENCE_OUT_TYPE.toString()}`,
            RUNNING_OFFICE_CODE: this.evidenceOutFG.controls['OFFICE_CODE'].value//this.localOfficeCode
        }
        await this.EvidenceOutService.TransactionRunninggetByCon(d).then(async (item) => {
            if (item.length == 0) {
                this.TransactionRunninginsAll();
            } else {
                await this.EvidenceOutService.TransactionRunningupdByCon(item[0].RUNNING_ID).then(async res => {
                    if (res.IsSuccess) {
                        let str = "" + item[0].RUNNING_NO;
                        var pad = "00000";
                        const RUNNING_NO = pad.substring(0, pad.length - str.length) + (parseInt(str)).toString();
                        this.EVIDENCE_OUT_CODE = this.EVIDENCE_OUT_PREFIX + item[0].RUNNING_OFFICE_CODE + "" + item[0].RUNNING_YEAR + RUNNING_NO;
                        this.onSave();
                    }
                }, (error) => {
                    console.error(error); this.preloader.setShowPreloader(false);
                    this.swalFn('', this.msgTransectionFailed, 'warning'); return false;
                });
            }
        }, (error) => {
            console.error(error); this.preloader.setShowPreloader(false);
            this.swalFn('', this.msgTransectionFailed, 'warning'); return false;
        });
    }

    async TransactionRunninginsAll() {
        const d: any = {
            RUNNING_ID: 1,
            RUNNING_MONTH: `${setZero((new Date()).getMonth() + 1)}`,
            RUNNING_NO: 1,
            RUNNING_OFFICE_CODE: this.evidenceOutFG.controls['OFFICE_CODE'].value,//this.localOfficeCode,
            RUNNING_OFFICE_ID: parseInt(this.localOfficeId),
            RUNNING_PREFIX: this.EVIDENCE_OUT_PREFIX,
            RUNNING_TABLE: `${this.RUNNING_TABLE + '_' + this.EVIDENCE_OUT_TYPE.toString()}`,
            RUNNING_YEAR: this.yy_th
        }

        await this.EvidenceOutService.TransactionRunninginsAll(d)
            .then(async res => {
                if (res.IsSuccess == 'False') {
                    this.swalFn('', this.msgTransectionFailed, 'warning');
                    this.preloader.setShowPreloader(false); return false;
                }
                this.TransactionRunningHandling();
            }, (error) => {
                console.error(error); this.preloader.setShowPreloader(false);
                this.swalFn('', this.msgTransectionFailed, 'warning'); return false;
            });
    }

    onSave() {
        this.preloader.setShowPreloader(true);
        let e = Object.assign({}, this.evidenceOutFG.getRawValue());

        e.EVIDENCE_OUT_CODE = this.EVIDENCE_OUT_CODE;
        e.EVIDENCE_OUT_TYPE = this.EVIDENCE_OUT_TYPE;

        /** get date */
        let eOutDate = getDateMyDatepicker(e.EVIDENCE_OUT_DATE) as Date;
        let eOutNoDate = getDateMyDatepicker(e.EVIDENCE_OUT_NO_DATE) as Date;
        let approveDate = getDateMyDatepicker(e.APPROVE_DATE) as Date;
        let returnDate = getDateMyDatepicker(e.RETURN_DATE) as Date;
        let payDate = getDateMyDatepicker(e.PAY_DATE) as Date;

        /** get time */ /** set time */
        if (e.EVIDENCE_OUT_TIME) {
            const eOutHours = parseInt(e.EVIDENCE_OUT_TIME.split(':')[0]);
            const eOutMin = parseInt(e.EVIDENCE_OUT_TIME.split(':')[1]);

            eOutDate.setHours(eOutHours, eOutMin);
        }

        if (e.EVIDENCE_OUT_NO_TIME) {
            const eOutNoHours = parseInt(e.EVIDENCE_OUT_NO_TIME.split(':')[0]);
            const eOutNoMin = parseInt(e.EVIDENCE_OUT_NO_TIME.split(':')[1]);

            eOutNoDate.setHours(eOutNoHours, eOutNoMin);
        }

        if (e.APPROVE_TIME) {
            const approveHours = parseInt(e.APPROVE_TIME.split(':')[0]);
            const approveMin = parseInt(e.APPROVE_TIME.split(':')[1]);

            approveDate.setHours(approveHours, approveMin);
        }

        /** set date */
        e.EVIDENCE_OUT_DATE = e.EVIDENCE_OUT_DATE ? this.toDateTZ(eOutDate) : '';
        e.EVIDENCE_OUT_NO_DATE = e.EVIDENCE_OUT_NO_DATE ? this.toDateTZ(eOutNoDate) : '';
        e.APPROVE_DATE = e.APPROVE_DATE ? this.toDateTZ(approveDate) : '';
        e.RETURN_DATE = e.RETURN_DATE ? this.toDateTZ(returnDate) : '';
        e.PAY_DATE = e.PAY_DATE ? this.toDateTZ(payDate) : '';

        let result = [];
        let zip$ = new Observable<any>();
        let request = new Observable<any>();

        switch (this.mode) {
            case Mode.C:
                request = this.onEvidenceOutIns(e).pipe(
                    finalize(() => this.preloader.setShowPreloader(false))
                );
                break;
            case Mode.R:
                request = this.onEvidenceOutUdp(e).pipe(
                    finalize(() => this.preloader.setShowPreloader(false))
                );
                break;
        }

        zip$ = Observable.zip(request)
            .pipe(map(x => { return result = [...result, ...x]; }))

        forkJoin(zip$)
            .subscribe(x => {
                const objRes: any[] = x[0];
                if (objRes.filter(o => o['IsSuccess'] == 'False').length) {
                    this.swalFn('', this.Message.saveFail, 'warning');
                } else {
                    this.swalFn('', this.Message.saveComplete, 'success')
                        .then((r) => {
                            if (r) {
                                switch (this.mode) {
                                    case Mode.C:
                                        this.router.navigate([`/evidenceOut/manage/${this.moduleType}`, 'R', objRes[0]['EVIDENCE_OUT_ID']]);
                                        setTimeout(() => {
                                            location.reload();
                                        }, 200);
                                        break;

                                    case Mode.R:
                                        location.reload();
                                        break;
                                }
                            }
                        });
                }
            }, () => { this.swalFn('', this.Message.saveFail, 'warning') });
    }

    onEvidenceOutIns(evidenceOut: any) {
        let insert = Object.assign({}, evidenceOut);

        /** set staff */
        const staff = [...this.EvidenceOutStaff.getRawValue(), this.RECIPIENT_STAFF, this.GETBACK_STAFF];
        const EvidenceOutStaff = this.filterAction(staff, this.Action.ADD);

        /** set evidence out detail */
        let EvidenceOutDetail = insert['EvidenceOutItem'].reduce((a, c) => [...a, {
            EVIDENCE_OUT_DETAIL_ID: "",
            EVIDENCE_OUT_ID: "",
            EVIDENCE_IN_ID: c['EVIDENCE_IN_ID'],
            IS_ACTIVE: 1,
        }], []);
        EvidenceOutDetail = this.filterDuplicate(EvidenceOutDetail, 'EVIDENCE_IN_ID');

        insert = { ...insert, EvidenceOutStaff, EvidenceOutDetail };

        return this.EvidenceOutService.EvidenceOutinsAll(insert)
            .pipe(
                mergeMap(x => {
                    const EVIDENCE_OUT_ID = x['EVIDENCE_OUT_ID'];
                    return merge(
                        Observable.of(x),
                        this.EvidenceOutDocumentModify(EVIDENCE_OUT_ID, this.DOCUMENT_TYPE)
                    );
                })
            )

    }

    onEvidenceOutUdp(evidenceOut: any) {
        let update = Object.assign({}, evidenceOut);

        /** set staff */
        let EvidenceOutStaff = this.EvidenceOutStaff.getRawValue();
        /** set for update staff contributor id 87 only */
        if (this.RECIPIENT_STAFF.FULL_NAME) {
            EvidenceOutStaff = [...EvidenceOutStaff, this.RECIPIENT_STAFF];
        }
        /** set for update staff contributor id 64 only */
        if (this.GETBACK_STAFF.FULL_NAME) {
            EvidenceOutStaff = [...EvidenceOutStaff, this.GETBACK_STAFF];
        }
        EvidenceOutStaff = EvidenceOutStaff.filter(f => f['ACTION'] == this.Action.EDIT && f['NEW_ITEM'] == false);

        update = { ...update, EvidenceOutStaff };

        return this.EvidenceOutService.EvidenceOutupdByCon(update)
            .pipe(
                mergeMap(x => {
                    return merge(
                        Observable.of(x),
                        this.EvidenceOutDocumentModify(this.EVIDENCE_OUT_ID, this.DOCUMENT_TYPE),
                        this.EvidenceOutStaffModify(),
                        this.EvidenceOutItemModify(this.EVIDENCE_OUT_ID),
                        this.EvidenceOutDetailModify(update, this.EVIDENCE_OUT_ID)
                    );
                })
            )
    }

    EvidenceOutItemModify(EVIDENCE_OUT_ID: string): Observable<any> {
        const ins = this.EvidenceOutItem
            .getRawValue()
            .reduce((a, c) => [...a, { ...c, EVIDENCE_OUT_ID: EVIDENCE_OUT_ID }], [])
            .filter(f => f['ACTION'] == this.Action.ADD && f['NEW_ITEM'] == true);

        const del = this.eOutItemDel.reduce((a, c) => [...a, {
            EVIDENCE_OUT_ITEM_ID: c['EVIDENCE_OUT_ITEM_ID'],
            STOCK_ID: c['STOCK_ID'],
            BALANCE_QTY: c['QTY']
        }], []);

        return merge(
            ins.length > 0 ? this.EvidenceOutService.EvidenceOutIteminsAll(ins) : Observable.of(),
            del.length > 0 ? this.EvidenceOutService.EvidenceOutItemupdDelete(del) : Observable.of()
        )
    }

    EvidenceOutDetailModify(UPD_VALUE: any, EVIDENCE_OUT_ID: string): Observable<any> {

        let ins = UPD_VALUE['EvidenceOutItem']
            ? UPD_VALUE['EvidenceOutItem'].filter(f => f['ACTION'] == this.Action.ADD && f['NEW_ITEM'] == true)
            : [];

        let del = this.eOutItemDel;

        if (ins.length > 0) {
            ins = ins.reduce((a, c) => [...a, {
                EVIDENCE_OUT_DETAIL_ID: "",
                EVIDENCE_OUT_ID: EVIDENCE_OUT_ID,
                EVIDENCE_IN_ID: c['EVIDENCE_IN_ID'],
                IS_ACTIVE: 1,
            }], []);
        }


        if (del.length > 0) {
            if (UPD_VALUE['__EvidenceOutDetail']) {
                del = del.reduce((a, c) => {

                    const o = UPD_VALUE['__EvidenceOutDetail']
                        .filter(
                            (f) => f.EvidenceOutIn['EvidenceOutInItem']
                                .some(s => s.EVIDENCE_IN_ITEM_ID == c.EvidenceOutStockBalance[0].EVIDENCE_IN_ITEM_ID)
                        ).map(m => { return { EVIDENCE_OUT_DETAIL_ID: m.EVIDENCE_OUT_DETAIL_ID } });

                    return [...a, ...o];
                }, []);

            } else {
                del = [];
            }
        }

        let del$ = () => from(del).pipe(mergeMap(x => this.EvidenceOutService.EvidenceOutDetailupdDelete(x)));

        return merge(
            ins.length > 0 ? this.EvidenceOutService.EvidenceOutDetailinsAll(ins) : Observable.of(),
            del.length > 0 ? del$() : Observable.of()
        )
    }

    EvidenceOutDocumentModify(REFERENCE_CODE: string, DOCUMENT_TYPE: string): Observable<any> {

        let ins = this.fileList.filter(f => f.IsNewItem == true);

        let del = this.docDel;

        if (ins.length > 0)
            ins = ins.reduce((accu, curr) => [...accu, { ...curr, REFERENCE_CODE, DOCUMENT_TYPE }], []);

        if (del.length)
            del = del.reduce((acc, curr) => [...acc, { DOCUMENT_ID: curr.DOCUMENT_ID }], []);

        let ins$ = () => from(ins).pipe(mergeMap(x => this.EvidenceOutService.DocumentinsAll(x)));

        let del$ = () => from(del).pipe(mergeMap(x => this.EvidenceOutService.DocumentupdDelete(x)));

        return merge(
            ins.length > 0 ? ins$() : Observable.of(),
            del.length > 0 ? del$() : Observable.of()
        )
    }

    EvidenceOutStaffModify(): Observable<any> {
        const staff = [...this.EvidenceOutStaff.getRawValue(), this.RECIPIENT_STAFF, this.GETBACK_STAFF];

        let ins = staff.filter(f => f['ACTION'] == this.Action.ADD && f['NEW_ITEM'] == true);

        let del = this.staffDel;

        const s = Object.assign([], [{ ...this.RECIPIENT_STAFF, ...this.GETBACK_STAFF }]);

        const staffSpecial_del = s.filter(f => f['ACTION'] == this.Action.DELETE);

        del = [...del, ...staffSpecial_del];

        if (ins.length > 0)
            ins = ins.reduce((accu, curr) =>
                [...accu, {
                    ...curr,
                    EVIDENCE_OUT_ID: this.EVIDENCE_OUT_ID
                }], []);

        let del$ = () => from(del).pipe(mergeMap(x => this.EvidenceOutService.EvidenceOutStaffupdDelete(x)));

        return merge(
            ins.length > 0 ? this.EvidenceOutService.EvidenceOutStaffinsAll(ins) : Observable.of(),
            del.length > 0 ? del$() : Observable.of()
        )
    }

    onEvidenceDeleteAll() {
        this.preloader.setShowPreloader(true);

        let result = [];
        let zip$ = new Observable<any>();

        const observe = this.EvidenceOutService.EvidenceOutupdDelete(this.EVIDENCE_OUT_ID)
            .pipe(
                mergeMap(x => {
                    /** set doc delete */
                    const docDel = this.fileList.reduce((acc, curr) => [...acc, { DOCUMENT_ID: curr.DOCUMENT_ID }], []);
                    let docDel$ = () => from(docDel).pipe(mergeMap(x => this.EvidenceOutService.DocumentupdDelete(x)));

                    /** set detail delete */
                    const eDetail = this.evidenceOutFG.controls['__EvidenceOutDetail'].value;
                    const eDetailDel = eDetail.reduce((a, c) => [...a, { EVIDENCE_OUT_DETAIL_ID: c.EVIDENCE_OUT_DETAIL_ID }], []);
                    let eDetailDel$ = () => from(eDetailDel).pipe(mergeMap(x => this.EvidenceOutService.EvidenceOutDetailupdDelete(x)));

                    return merge(
                        Observable.of(x),
                        docDel.length > 0 ? docDel$() : Observable.of(),
                        eDetailDel.length > 0 ? eDetailDel$() : Observable.of()
                    );
                })
            ).finally(() => this.preloader.setShowPreloader(false))

        zip$ = Observable.zip(observe)
            .pipe(map(x => { return result = [...result, ...x]; }))

        forkJoin(zip$)
            .subscribe(x => {
                const objRes: any[] = x[0];
                if (objRes.filter(o => o['IsSuccess'] == 'False').length) {
                    this.swalFn('', this.Message.delFail, 'warning');
                } else {
                    this.swalFn('', this.Message.delComplete, 'success')
                        .then((r) => {
                            if (r) this.router.navigate([`/evidenceOut/list/${this.moduleType.slice(0, 2)}`]);
                        });
                }
            }, () => { this.swalFn('', this.Message.delFail, 'warning') });
    }

    onComplete() {
        this.navService.setPrintButton(true);
        this.navService.setDeleteButton(true);
        this.navService.setEditButton(true);
        this.navService.setSearchBar(false);
        this.navService.setCancelButton(false);
        this.navService.setSaveButton(false);

        this.showEditField = true;
    }

    // *******************************************
    // -------------- Set Staff -------------
    // *******************************************

    private createStaffForm = (): FormGroup => this.fb.group(StaffVariable);

    deleteStaff(i: number) {
        let eStaff = this.EvidenceOutStaff.at(i).value;
        let mStaffId = eStaff.EVIDENCE_OUT_STAFF_ID;

        mStaffId = eStaff.EVIDENCE_OUT_STAFF_ID == "" ? null : eStaff.EVIDENCE_OUT_STAFF_ID;

        if (mStaffId)
            this.staffDel.push([eStaff].reduce((acc, curr) => { return { EVIDENCE_OUT_STAFF_ID: curr.EVIDENCE_OUT_STAFF_ID } }, {}));

        this.clearStaffOfindex(i);
    }

    clearStaffOfindex(i: number) {
        let s = this.EvidenceOutStaff.controls[i].value;

        for (var key in s) {
            if (key != "IS_REQUIRE" && key != "CONTRIBUTOR_ID")
                s[key] = '';
        }

        this.EvidenceOutStaff.at(i).patchValue(s);
    }

    setStaffByContributorId(staff: any[], Action: string, IsNewItem: boolean) {
        staff.forEach(o => {
            const s = { ...o, ACTION: Action, NEW_ITEM: IsNewItem }

            if (o['CONTRIBUTOR_ID'] == 87) {
                this.RECIPIENT_STAFF = { ...s, FULL_NAME: s.FIRST_NAME }

            } else if (o['CONTRIBUTOR_ID'] == 64) {
                this.GETBACK_STAFF = { ...s, FULL_NAME: s.FIRST_NAME }

            } else {
                const index = this.STAFF_CONTRIBUTOR.findIndex(f => f.value == o['CONTRIBUTOR_ID']);
                this.setStaffOfIndex(s, index);
            }
        });
    }

    createFormStaffByEvidenceType() {
        this.activeRoute.data.subscribe(
            () => {
                switch (this.moduleType) {
                    case '11':
                        this.STAFF_CONTRIBUTOR = [
                            { value: 65, text: 'ผู้คืน', is_req: true },
                            { value: 88, text: 'ผู้อนุมัติหนังสือ', is_req: false }
                        ];
                        this.createFormStaffAmount(2);
                        break;
                    case '12':
                        this.STAFF_CONTRIBUTOR = [
                            { value: 66, text: 'ผู้เสนอพิจารณาเห็นชอบ', is_req: true },
                            { value: 67, text: 'ผู้พิจารณาเห็นชอบ', is_req: false },
                            { value: 68, text: 'ผู้จัดเก็บ', is_req: false }
                        ];

                        this.createFormStaffAmount(3);
                        break;
                    case '13':
                        this.STAFF_CONTRIBUTOR = [
                            { value: 69, text: 'ผู้เสนออนุมัติ', is_req: true },
                            { value: 70, text: 'ผู้พิจารณาอนุมัติ', is_req: false },
                            { value: 71, text: 'ประธานขายของกลาง', is_req: false }
                        ];

                        this.createFormStaffAmount(3);
                        break;
                    case '14':
                        this.STAFF_CONTRIBUTOR = [
                            { value: 72, text: 'ผู้เสนออนุมัติ', is_req: true },
                            { value: 73, text: 'ผู้พิจารณาอนุมัติ', is_req: false },
                            { value: 74, text: 'ประธานฯทำลายของกลาง', is_req: false }
                        ];

                        this.createFormStaffAmount(3);
                        break;
                    case '15G':
                        this.STAFF_CONTRIBUTOR = [
                            { value: 89, text: 'ผู้รับมอบ', is_req: true },
                            { value: 61, text: 'ประธานกรรมการ', is_req: false },
                            { value: 62, text: 'กรรมการ', is_req: false },
                            { value: 63, text: 'กรรมการและเลขานุการ', is_req: false }
                        ];

                        this.createFormStaffAmount(4);
                        break;
                    case '15D':
                        this.STAFF_CONTRIBUTOR = [
                            { value: 78, text: 'ผู้เสนออนุมัติ', is_req: true },
                            { value: 79, text: 'ผู้พิจารณาอนุมัติ', is_req: false },
                            { value: 80, text: 'ผู้นำออก', is_req: false }
                        ];
                        this.createFormStaffAmount(3);
                        break;
                }

            }
        );
    }

    createFormStaffAmount(count: number) {
        //clear befor set
        this.clearFormArray(this.EvidenceOutStaff);

        let i: number = 0;
        do {
            let staff = this.EvidenceOutStaff.controls;

            staff.push(this.createStaffForm());

            i++;
        } while (i < count);
    }

    clearFormArray = (formArray: FormArray) => {
        while (formArray.length !== 0) {
            formArray.removeAt(0)
        }
    }

    setStaffByLogin() {
        const form: IMasStaffgetByCon = {
            STAFF_ID: parseInt(this.localUserAccountID),
            TEXT_SEARCH: ''
        }
        this.EvidenceOutService.MasStaffgetByCon(form)
            .pipe(takeUntil(this.destroy$))
            .finally(() => this.preloader.setShowPreloader(false))
            .subscribe(x => {

                let arr = [...x];

                arr = arr.reduce((accu, curr) =>
                    [...accu, {
                        ...curr,
                        ACTION: this.Action.ADD,
                        NEW_ITEM: true
                    }], []);

                const obj = Object.assign({}, ...arr);
                this.setStaffOfIndex(obj, 0);

                switch (this.moduleType) {
                    case '12':
                    case '13':
                        this.setStaffOfIndex(obj, 2);
                        break;
                }
                this.evidenceOutFG.patchValue({
                    OFFICE_CODE: obj['OPERATION_OFFICE_CODE']
                });

            }, (err) =>
                this.swalFn('', `MasStaffgetByCon ${err.name}`, 'warning')
                    .then(() => location.reload())
            );
    }

    getContributorName(index: number) {
        const t = this.STAFF_CONTRIBUTOR[index];
        return t ? t.text : '';
    }

    getContributorId(index: number) {
        const t = this.STAFF_CONTRIBUTOR[index];
        return t ? t.value : '';
    }

    getIsReqStaffByContributorId(conIn: any): boolean {
        const t = this.STAFF_CONTRIBUTOR.find(f => conIn == f.value)
        return t ? t.is_req : false;
    }

    public searchStaff = (text2$: Observable<string>) =>
        text2$
            .debounceTime(200)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.EvidenceOutService.MasStaffgetByCon({ TEXT_SEARCH: term })
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of([]);
                    })
            )
            .do(() => this.searching = false);

    selectItemStaff(e: any, i: number) {
        const staff = { ...e.item, ACTION: this.Action.ADD, NEW_ITEM: true };
        this.setStaffOfIndex(staff, i);
    }

    setStaffOfIndex(staff: any, index: number) {
        const contributorID = this.getContributorId(index);

        this.EvidenceOutStaff.at(index).patchValue({
            ...staff,
            FULL_NAME: `${staff.TITLE_SHORT_NAME_TH || ''}${staff.FIRST_NAME || ''} ${staff.LAST_NAME || ''}`,
            CONTRIBUTOR_ID: contributorID,
            ACTION: staff.ACTION,
            NEW_ITEM: staff.NEW_ITEM,
            IS_REQUIRE: this.getIsReqStaffByContributorId(contributorID)
        });
    }

    setReceipientStaff(event: any) {
        const e = event;

        switch (e.field) {
            case 'FULL_NAME':
                this.RECIPIENT_STAFF.FULL_NAME = e.value;
                break;

            case 'MANAGEMENT_POS_NAME':
                this.RECIPIENT_STAFF.MANAGEMENT_POS_NAME = e.value;

                break;
            case 'OPERATION_OFFICE_SHORT_NAME':
                this.RECIPIENT_STAFF.OPERATION_OFFICE_SHORT_NAME = e.value;

                break;
        }

        this.RECIPIENT_STAFF = {
            ...this.RECIPIENT_STAFF,
            EVIDENCE_OUT_ID: this.EVIDENCE_OUT_ID,
            CONTRIBUTOR_ID: 87,
            FIRST_NAME: this.RECIPIENT_STAFF.FULL_NAME,
            STAFF_TYPE: 1,
            STATUS: 1,
            IS_ACTIVE: 1,
        }

        switch (this.mode) {
            case Mode.C:
                if (this.RECIPIENT_STAFF.FULL_NAME) {
                    this.RECIPIENT_STAFF = {
                        ...this.RECIPIENT_STAFF, NEW_ITEM: true, ACTION: this.Action.ADD,
                    }

                } else {
                    this.RECIPIENT_STAFF = {
                        ...this.RECIPIENT_STAFF, NEW_ITEM: false, ACTION: ''
                    }
                }
                break;

            case Mode.R:
                if (this.RECIPIENT_STAFF.FULL_NAME) {

                    if (this.RECIPIENT_STAFF.EVIDENCE_OUT_STAFF_ID) {
                        this.RECIPIENT_STAFF = {
                            ...this.RECIPIENT_STAFF, NEW_ITEM: false, ACTION: this.Action.EDIT
                        }
                    } else {
                        this.RECIPIENT_STAFF = {
                            ...this.RECIPIENT_STAFF, NEW_ITEM: true, ACTION: this.Action.ADD,
                        }
                    }


                } else {

                    if (this.RECIPIENT_STAFF.EVIDENCE_OUT_STAFF_ID) {
                        this.RECIPIENT_STAFF = {
                            ...this.RECIPIENT_STAFF, NEW_ITEM: false, ACTION: this.Action.DELETE
                        }
                    } else {
                        this.RECIPIENT_STAFF = {
                            ...this.RECIPIENT_STAFF, NEW_ITEM: false, ACTION: ''
                        }
                    }

                }
                break;
        }
    }

    setGetBackStaff(event: any) {
        const e = event;

        this.GETBACK_STAFF.FULL_NAME = e.value;

        this.GETBACK_STAFF = {
            ...this.GETBACK_STAFF,
            EVIDENCE_OUT_ID: this.EVIDENCE_OUT_ID,
            CONTRIBUTOR_ID: 64,
            FIRST_NAME: this.GETBACK_STAFF.FULL_NAME,
            STAFF_TYPE: 1,
            STATUS: 1,
            IS_ACTIVE: 1,
        }

        switch (this.mode) {
            case Mode.C:
                if (this.GETBACK_STAFF.FULL_NAME) {
                    this.GETBACK_STAFF = {
                        ...this.GETBACK_STAFF, NEW_ITEM: true, ACTION: this.Action.ADD
                    }

                } else {
                    this.GETBACK_STAFF = {
                        ...this.GETBACK_STAFF, NEW_ITEM: false, ACTION: ''
                    }
                }
                break;

            case Mode.R:
                if (this.GETBACK_STAFF.FULL_NAME) {

                    if (this.GETBACK_STAFF.EVIDENCE_OUT_STAFF_ID) {
                        this.GETBACK_STAFF = {
                            ...this.GETBACK_STAFF, NEW_ITEM: false, ACTION: this.Action.EDIT
                        }
                    } else {
                        this.GETBACK_STAFF = {
                            ...this.GETBACK_STAFF, NEW_ITEM: true, ACTION: this.Action.ADD
                        }
                    }


                } else {

                    if (this.GETBACK_STAFF.EVIDENCE_OUT_STAFF_ID) {
                        this.GETBACK_STAFF = {
                            ...this.GETBACK_STAFF, NEW_ITEM: false, ACTION: this.Action.DELETE
                        }
                    } else {
                        this.GETBACK_STAFF = {
                            ...this.GETBACK_STAFF, NEW_ITEM: false, ACTION: ''
                        }
                    }

                }
                break;
        }

        console.log('this.GETBACK_STAFF : ', this.GETBACK_STAFF)
    }


    // **********************************
    // ------------ Document -----------
    // **********************************
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

    deleteItem(i: number) {
        const doc = this.fileList[i];
        this.swalFnMulti('', 'ยืนยันการลบรายการหรือไม่', 'warning')
            .then((result) => {
                if (result.value) {
                    if (!doc.DOCUMENT_ID) {
                        this.fileList.splice(i, 1);
                        return;
                    }
                    this.docDel.push([doc.DOCUMENT_ID].reduce((acc, curr) => { return { DOCUMENT_ID: curr } }, {}));
                    this.fileList.splice(i, 1);
                }
            })
    }

    DownloadItem(item) {
        this.preloader.setShowPreloader(true);
        this.EvidenceOutService.downloadFile(item.DOCUMENT_ID)
            .subscribe(
                (data) => this.handleDownload(data, item));
    }

    handleDownload(data: any, item: any) {
        this.preloader.setShowPreloader(false);
        var blob = URL.createObjectURL(new Blob([data], { type: '*/*' }));
        saveAs(blob, item.DOCUMENT_NAME);
    }

    setItemDocument(event: Document) {
        this.fileList = [...this.fileList, event] as any;
    }

    async pageChanges(event) {
        // this.ProductList = await this.rawProductList.slice(event.startIndex - 1, event.endIndex);
    }

    private setItemFormArray(array: any[], formControl: string) {
        if (array !== undefined && array.length) {
            const itemFGs = array.map(item => this.fb.group(item));
            const itemFormArray = this.fb.array(itemFGs);
            this.evidenceOutFG.setControl(formControl, itemFormArray);
        }
    }

    evidenceOutItemSelected(item: any[]) {
        const eOutItem = item.reduce((a, c) => {
            const o: EvidenceOutItem[] = c['EvidenceInItem'].reduce((accInItem, currInItem) =>
                [...accInItem, {
                    EVIDENCE_OUT_ITEM_ID: "",
                    EVIDENCE_OUT_ID: this.EVIDENCE_OUT_ID,
                    EVIDENCE_IN_ITEM_CODE: currInItem['EVIDENCE_IN_ITEM_CODE'],
                    EVIDENCE_IN_ID: currInItem['EVIDENCE_IN_ID'],
                    STOCK_ID: currInItem['EvidenceOutStockBalance'][0]['STOCK_ID'],
                    QTY: currInItem['EvidenceOutStockBalance'][0]['BALANCE_QTY'],
                    QTY_UNIT: currInItem['EvidenceOutStockBalance'][0]['BALANCE_QTY_UNIT'],
                    PRODUCT_SIZE: currInItem['EvidenceOutStockBalance'][0]['BALANCE_SIZE'],
                    PRODUCT_SIZE_UNIT: currInItem['EvidenceOutStockBalance'][0]['BALANCE_SIZE_UNIT'],
                    PRODUCT_DESC: currInItem['PRODUCT_DESC'],
                    NET_VOLUMN: currInItem['EvidenceOutStockBalance'][0]['BALANCE_NET_VOLUMN'],
                    NET_VOLUMN_UNIT: currInItem['EvidenceOutStockBalance'][0]['BALANCE_NET_VOLUMN_UNIT'],
                    COST: "",
                    RECEIPT_NO: "",
                    BOOK_NO: "",
                    IS_RETURN: 0,
                    IS_ACTIVE: 1,
                    EvidenceOutStockBalance: currInItem['EvidenceOutStockBalance'],

                    /**customs */
                    LAWSUIT_NO: c['LAWSUIT_NO'],
                    ACTION: this.Action.ADD,
                    NEW_ITEM: true
                }], []);

            return [...a, ...o];
        }, []);

        const newItem = [...this.EvidenceOutItem.getRawValue(), ...eOutItem];
        let x = newItem.map((x, i) => {
            return Object.assign(x, {
                ROW_ID: i + 1,
                EvidenceOutStockBalance: this.setFormArray(x['EvidenceOutStockBalance'])
            });
        });

        x = this.filterDuplicate(x, 'STOCK_ID');
        this.setItemFormArray(x, 'EvidenceOutItem');
    }

    eOutItemDelete(i: number) {
        this.swalFnMulti('', this.Message.confirmAction, 'warning')
            .then(
                (result) => {
                    if (result.value) {
                        const eOutItem: any[] = this.EvidenceOutItem.at(i).value;

                        if (eOutItem['EVIDENCE_OUT_ITEM_ID'])
                            this.eOutItemDel.push(eOutItem);

                        this.EvidenceOutItem.removeAt(i);
                    }
                });
    }

    getItemDetailObj(item: any[], eInItemId: number) {
        const EvidenceOutIn = item.reduce((a, c) => [...a, c.EvidenceOutIn], []);
        const EvidenceOutInItem = EvidenceOutIn.reduce((a, c) => [...a, ...c.EvidenceOutInItem], []);
        const eItemFilter = EvidenceOutInItem.filter(f => f.EVIDENCE_IN_ITEM_ID == eInItemId);

        return Object.assign({}, ...eItemFilter);
    }

    setEvidenceOutItemFormArray(item: any[]): FormArray {
        const arr = item.reduce((a, c) => [...a, {
            ...c,
            EvidenceOutStockBalance: this.setFormArray(c.EvidenceOutStockBalance)
        }], []);

        return this.setFormArray(arr)
    }

    setFormArray(value: any[]): FormArray {
        let arr = new FormArray([])
        value.map(m => arr.push(this.fb.group(m)));
        return arr;
    }

}
