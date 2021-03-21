import { Component, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { Message } from '../../../config/message';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import { toLocalShort, setDateMyDatepicker, convertDateForSave, setZero, getDateMyDatepicker } from '../../../config/dateFormat';
import swal from 'sweetalert2';
import { Observable, merge, forkJoin, from, combineLatest, of, Subject, BehaviorSubject } from 'rxjs';
import { Mode, Action } from 'app/pages/model/mode';
import { IMyOptions } from 'mydatepicker-th';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ContibutorName, ProveStorageProduct, ProveStorageStaffFormControl, ProveStorageEvidenceInItem, ProveStorageEvidenceInStaff, ProveStorageEvidenceIn, } from '../proveStorage';
import { MainMasterService } from 'app/services/main-master.service';
import { MasterService } from 'app/pages/arrests/services';
import { MastersConfig } from 'app/pages/masters/masters.config';
import { Document, ImageDocument, FileType } from '../proveStorageDocument';
import { saveAs } from 'file-saver';
import { ProveStorageService } from '../proveStorage.service';
import { async } from '@angular/core/testing';

@Component({
    selector: 'app-manage',
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']
})
// , OnInit, OnDestroy
export class ManageComponent extends MastersConfig implements OnDestroy {

    public officeId = localStorage.getItem("officeId") || '2';
    public officeCode = localStorage.getItem("officeCode");
    public staffCode = localStorage.getItem('staffCode');
    public officeShortName = localStorage.getItem('officeShortName');
    public userAccountId = localStorage.getItem('UserAccountID');

    public sub: any;
    mode: string;
    ModeAction = Action;
    AutoGenerate: string = "Auto Generate"
    modal: any;
    showEditField: any;
    ProveStorageLawsuitDetail: any = [];
    ProveStorageProduct: any = []
    evidenceInItemList: any = [];
    evidenceInStaffList: any = [];
    ARREST_ID: number;
    EVIDENCE_IN_ID: number;
    proveStorageForm: FormGroup;
    staffData = ContibutorName;
    EVIDENCE_IN_CODE: string;
    InformTooptions = [];
    rawOfficeSendOptions = [];
    fileList: Document[] = []

    ProveStorageEvidenceIn: ProveStorageEvidenceIn;
    ProveStorageEvidenceInItem: ProveStorageEvidenceInItem[];
    ProveStorageEvidenceInStaff: ProveStorageEvidenceInStaff[];

    public destroy$: Subject<boolean> = new Subject<boolean>();
    PrintButton = new BehaviorSubject<Boolean>(false);
    SaveButton = new BehaviorSubject<Boolean>(false);
    CancelButton = new BehaviorSubject<Boolean>(false);
    DeleteButton = new BehaviorSubject<Boolean>(false);
    EditButton = new BehaviorSubject<Boolean>(false);


    isReq_ReceiveOfficeName = new BehaviorSubject<boolean>(false);
    isReq_EvidenceInDate = new BehaviorSubject<boolean>(false);
    isReq_EvidenceInTime = new BehaviorSubject<boolean>(false);

    boxI = new BehaviorSubject<Boolean>(true);
    boxII = new BehaviorSubject<Boolean>(true);
    boxIII = new BehaviorSubject<Boolean>(true);
    boxIV = new BehaviorSubject<Boolean>(true);

    // boxI
    TEMP_DELIVERY_CODE: string;
    TEMP_DELIVERY_OFFICE_NAME: string;
    TEMP_DELIVERY_NO: string;
    TEMP_DELIVERY_DATE: string;
    TEMP_DELIVERY_TIME: string;
    TEMP_DELIVERY_TITTLE: string;
    TEMP_DELIVERY_DEAR: string;
    TEMP_DELIVERY_FULL_NAME: string;
    TEMP_DELIVERY_OPERATION_POS_NAME: string;
    TEMP_DELIVERY_OPERATION_OFFICE_SHORT_NAME: string;
    TEMP_ARREST_CODE: any;
    TEMP_OCCURRENCE_DATE: any;
    TEMP_OCCURRENCE_TIME: string;
    TEMP_ARREST_STAFF_NAME: string;
    TEMP_ARREST_OPREATION_POS_NAME: string;
    TEMP_ARREST_OPERATION_OFFICE_SHORT_NAME: string;

    // boxII
    TEMP_EVIDENCE_IN_ID: string;
    TEMP_EVIDENCE_IN_CODE: string;
    TEMP_EVIDENCE_IN_DATE: any;
    TEMP_EVIDENCE_IN_TIME: any;
    TEMP_RECEIVE_OFFICE_NAME: string;
    TEMP_RECEIVE_OFFICE_CODE: string;
    TEMP_COMMENT1: string;

    searching: boolean = false;
    searchFailed: boolean = false;

    isRequired: boolean | false;
    isReqDeliveryDate = new BehaviorSubject<boolean>(false);
    isReqDeliveryTime = new BehaviorSubject<boolean>(false);

    myDatePickerOptions: IMyOptions = {
        editableDateField: false,
        dateFormat: 'dd mmm yyyy',
        showClearDateBtn: true,
        height: '30px'
    };


    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    constructor(
        private activeRoute: ActivatedRoute,
        private ngbModel: NgbModal,
        private fb: FormBuilder,
        private masService: MasterService,
        private preloader: PreloaderService,
        private router: Router,
        private proveStorageService: ProveStorageService,
        private mainMasterService: MainMasterService,
    ) { super(); }

    // ----- Model ------ //
    @ViewChild('printDocModal') printDocModel: ElementRef;
    @ViewChild('documentModal') documentModal: ElementRef;




    get ProveStorageStaff(): FormArray {
        return this.proveStorageForm.get('ProveStorageStaff') as FormArray;
    }



    async ngOnInit() {
        this.preloader.setShowPreloader(true);
        await this.createProveStorageForm();
        this.active_Route();

    }

    private active_Route() {
        this.sub = this.activeRoute.params.subscribe(p => {
            this.mode = p['mode'];
            this.ARREST_ID = p['arrestId'];
            this.EVIDENCE_IN_ID = p['evidenceInId']

            switch (this.mode) {
                case this.ModeAction.ADD: // new
                    this.initDataBoxII()
                    this.initActionAdd()
                    break;

                case this.ModeAction.EDIT: // edit

                    this.initActionEdit()
                    break;

                case this.ModeAction.VIEW: // view

                    this.initActionView()
                    break;
            }
        });
    }

    async ProveStorageGetCaseAdd(evidenceInId) {


        var paramsOther = {
            EVIDENCE_IN_ID: evidenceInId
        }

        //setBoxII
        this.proveStorageService.getProveStoragegetProduct(paramsOther).then(obj => {
            this.ProveStorageProduct = obj
        }, (err: HttpErrorResponse) => {
            swal('', err.message, 'error');
        });

        //######## SET STAFF #########

        let typeheadStaff;

        await this.mainMasterService.MasStaff(this.userAccountId, '').then(res1 => {
            const myObjStr = JSON.stringify(res1.RESPONSE_DATA);
            typeheadStaff = JSON.parse(myObjStr) || []
        }, (err: HttpErrorResponse) => {
            swal('', err.message, 'error');
        });

        for (let l of typeheadStaff) {

            let code = l.STAFF_ID;
            if (this.userAccountId == code) {
                await this.ProveStorageStaff.at(0).patchValue({
                    FULL_NAME: `${l.TITLE_SHORT_NAME_TH || ''}${l.FIRST_NAME || ''} ${l.LAST_NAME || ''}`,
                    STAFF_ID: l.STAFF_ID,
                    IsNewItem: true,
                    MANAGEMENT_POS_NAME: l.MANAGEMENT_POS_NAME,
                    OPERATION_OFFICE_SHORT_NAME: l.OPERATION_OFFICE_SHORT_NAME,
                    CONTRIBUTOR_ID: 61,
                });
                break;
            }
        }

        this.ProveStorageStaff.value.map((m, i) => {
            m.CONTRIBUTOR_NAME = this.staffData[i].as;
        })

        await this.setItemFormArray(this.ProveStorageStaff.value, 'ProveStorageStaff', this.proveStorageForm);

        //########END SET STAFF #########

        this.preloader.setShowPreloader(false);
    }

    ProveStorageGetCaseEdit() {

        this.SetBoxII()
        this.preloader.setShowPreloader(false);
    }

    //============== set data

    async SetBoxI(evidenceInId: number) {


        console.log(evidenceInId)

        var paramsOther = {
            EVIDENCE_IN_ID: evidenceInId
        }

        this.proveStorageService.getProveStoragegetByCreate(paramsOther).then(obj => {
            console.log(obj)

            /** clear null string */
            for (let key in obj) {
                if (obj[key] === 'null') {
                    obj[key] = null;
                }
            }
            /** clear null string */
            obj.ProveStorageLawsuitDetail.map(m => {
                for (let key2 in m) {
                    if (m[key2] === 'null') {
                        m[key2] = null;
                    }
                }
            })

            this.TEMP_DELIVERY_CODE = obj.DELIVERY_CODE
            this.TEMP_DELIVERY_OFFICE_NAME = obj.DELIVERY_OFFICE_NAME
            this.TEMP_DELIVERY_NO = obj.DELIVERY_NO
            this.TEMP_DELIVERY_DATE = obj.DELIVERY_DATE
            this.TEMP_DELIVERY_TIME = obj.DELIVERY_TIME
            this.TEMP_DELIVERY_TITTLE = obj.DELIVERY_TITTLE
            this.TEMP_DELIVERY_DEAR = obj.DELIVERY_DEAR
            this.TEMP_DELIVERY_FULL_NAME = obj.DELIVERY_FULL_NAME
            this.TEMP_DELIVERY_OPERATION_POS_NAME = obj.DELIVERY_OPERATION_POS_NAME
            this.TEMP_DELIVERY_OPERATION_OFFICE_SHORT_NAME = obj.DELIVERY_OPERATION_OFFICE_SHORT_NAME
            this.TEMP_ARREST_CODE = obj.ARREST_CODE
            this.TEMP_OCCURRENCE_DATE = obj.OCCURRENCE_DATE
            this.TEMP_OCCURRENCE_TIME = obj.OCCURRENCE_TIME
            this.TEMP_ARREST_STAFF_NAME = obj.ARREST_STAFF_NAME
            this.TEMP_ARREST_OPREATION_POS_NAME = obj.ARREST_OPREATION_POS_NAME
            this.TEMP_ARREST_OPERATION_OFFICE_SHORT_NAME = obj.ARREST_OPERATION_OFFICE_SHORT_NAME
            this.ProveStorageLawsuitDetail = obj.ProveStorageLawsuitDetail

        }, (err: HttpErrorResponse) => {
            swal('', err.message, 'error');
        });
    }

    async SetBoxII() {

        var paramsOther = {
            EVIDENCE_IN_ID: this.EVIDENCE_IN_ID
        }

        //setBoxII
        this.proveStorageService.ProveStoragegetByCon(paramsOther).then(async obj => {
            console.log(obj)

            for (let key in obj) {
                if (obj[key] === 'null') {
                    obj[key] = null;
                }
            }

            this.TEMP_EVIDENCE_IN_ID = obj.EVIDENCE_IN_ID
            this.TEMP_EVIDENCE_IN_CODE = obj.EVIDENCE_IN_CODE
            this.TEMP_EVIDENCE_IN_DATE = setDateMyDatepicker(new Date(obj.EVIDENCE_IN_DATE));
            this.TEMP_EVIDENCE_IN_TIME = obj.EVIDENCE_IN_TIME
            this.TEMP_RECEIVE_OFFICE_NAME = obj.RECEIVE_OFFICE_NAME
            this.TEMP_RECEIVE_OFFICE_CODE = obj.RECEIVE_OFFICE_CODE
            this.TEMP_COMMENT1 = obj.COMMENT1 != "null" ? obj.COMMENT1 : ""

            this.ProveStorageProduct = []
            obj.ProveStorageEvidenceInItem.forEach(ele => {
                let item = new ProveStorageProduct();
                item = Object.assign(item, ele);
                this.ProveStorageProduct.push(item)
            });

            //this.setBoxIII(obj.ProveStorageEvidenceInStaff[0].STAFF_ID)

            //######## SET STAFF #########

            obj.ProveStorageEvidenceInStaff.forEach(async (element, index, array) => {
                let typeheadStaff;

                await this.mainMasterService.MasStaff(element.STAFF_ID, '').then(res1 => {
                    const myObjStr = JSON.stringify(res1.RESPONSE_DATA);
                    typeheadStaff = JSON.parse(myObjStr) || []
                }, (err: HttpErrorResponse) => {
                    swal('', err.message, 'error');
                });

                for (let l of typeheadStaff) {
                    this.ProveStorageStaff.at(index).patchValue({
                        FULL_NAME: `${l.TITLE_SHORT_NAME_TH || ''}${l.FIRST_NAME || ''} ${l.LAST_NAME || ''}`,
                        STAFF_ID: l.STAFF_ID,
                        IsNewItem: false,
                        MANAGEMENT_POS_NAME: l.MANAGEMENT_POS_NAME,
                        OPERATION_OFFICE_SHORT_NAME: l.OPERATION_OFFICE_SHORT_NAME,
                        CONTRIBUTOR_ID: element.CONTRIBUTOR_ID,
                        EVIDENCE_IN_STAFF_ID: element.EVIDENCE_IN_STAFF_ID
                    });
                }
                this.ProveStorageStaff.value.map((m, i) => {
                    m.CONTRIBUTOR_NAME = this.staffData[i].as;
                })

                this.setItemFormArray(this.ProveStorageStaff.value, 'ProveStorageStaff', this.proveStorageForm);
            });

            // //########END SET STAFF #########

            // // get Document
            await this.proveStorageService.GetDocumentByCon(10, this.EVIDENCE_IN_ID).then(async res => {
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
                                m.IMAGE_SHOW = this.proveStorageService.getImage(f.DOCUMENT_ID);
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


        }, (err: HttpErrorResponse) => {
            swal('', err.message, 'error');
        });
    }



    // ================ action bnt =============
    OnPrint() {
        this.modal = this.ngbModel.open(this.printDocModel, { size: 'lg', centered: true })
    }

    OnEdit() {
        this.showEditField = false;
        this.SaveButton.next(true);
        this.CancelButton.next(true);

        this.EditButton.next(false);
        this.DeleteButton.next(false);
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
        }).then((result) => {
            if (result.value) {

                var paramsOther = {
                    EVIDENCE_IN_ID: this.EVIDENCE_IN_ID
                }

                this.proveStorageService.ProveStorageupdDelete(paramsOther).then(async IsSuccess => {
                    if (IsSuccess) {
                        await Promise.all(this.fileList.filter(f => f.DOCUMENT_ID != null).map(async m => {
                            await this.proveStorageService.DocumentupdDelete(m.DOCUMENT_ID.toString()).then(item => {
                                if (item.IsSuccess == "True")
                                    return true;
                                else
                                    return false;
                            }, (error) => { console.error(error); return false; });
                        }));
                        this.router.navigate(['/proveStorage/list']);
                    } else {
                        swal('', Message.saveFail, 'error');
                    }
                }, (error) => { console.error(error); });
            }
        })
    }

    async OnSave() {

        if (!this.TEMP_EVIDENCE_IN_DATE) {
            swal({
                text: 'กรุณาระบุข้อมูล "วันที่นำส่ง"',
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'ตกลง'
            })
            this.boxII.next(true);
            this.isReq_EvidenceInDate.next(true);
            return;
        }

        if (!this.TEMP_RECEIVE_OFFICE_NAME) {
            swal({
                text: 'กรุณาระบุข้อมูล "หน่วยงาน"',
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'ตกลง'
            })
            this.boxII.next(true);
            this.isReq_ReceiveOfficeName.next(true);
            return;
        }

        if (!this.TEMP_EVIDENCE_IN_TIME) {
            swal({
                text: 'กรุณาระบุข้อมูล "เวลานำส่ง"',
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'ตกลง'
            })
            this.boxII.next(true);
            this.isReq_EvidenceInTime.next(true);
            return;
        }

        if (this.TEMP_EVIDENCE_IN_TIME.invalid) {
            swal({
                text: 'กรุณาระบุข้อมูล "เวลานำส่ง"',
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'ตกลง'
            })
            this.boxII.next(true);
            this.isReq_EvidenceInTime.next(true);
            return;
        }

        console.log(this.mode)

        if (this.mode == 'ADD') {
            // generate deliveryCode
            await this.proveStorageService.TransactionRunninggetByCon("OPS_EVIDENCE_IN_RC", this.officeCode).then(async item => {
                if (item.length == 0) {
                    this.proveStorageService.TransactionRunninginsAll(this.officeCode, "OPS_EVIDENCE_IN_RC", "RC").then(async res => {
                        if (res.IsSuccess) {
                            this.EVIDENCE_IN_CODE = "RC" + this.officeCode + (setDateMyDatepicker(new Date(this.getCurrentDate())).date.year + 543).toString().substring(4, 2) + "00001";
                            console.log("EVIDENCE_IN_CODE insert" + this.EVIDENCE_IN_CODE);

                            this.saveAdd()
                        }
                        this.preloader.setShowPreloader(false);
                    }, (error) => { console.error(error); return false; });
                }
                else {
                    await this.proveStorageService.TransactionRunningupdByCon(item[0].RUNNING_ID).then(async res => {
                        if (res.IsSuccess) {
                            var pad = "00000"
                            var RunningNo = pad.substring(0, pad.length - item[0].RUNNING_NO.toString().length) + (+item[0].RUNNING_NO + 1);
                            this.EVIDENCE_IN_CODE = "RC" + this.officeCode + (setDateMyDatepicker(new Date(this.getCurrentDate())).date.year + 543).toString().substring(4, 2) + RunningNo;
                            console.log("EVIDENCE_IN_CODE update" + this.EVIDENCE_IN_CODE);

                            this.saveAdd()
                        }
                    }, (error) => { console.error(error); return false; });
                }
            }, (error) => { console.error(error); return false; });
        } else if (this.mode == 'EDIT') {


            let _EVIDENCE_IN_DATE;
            _EVIDENCE_IN_DATE = convertDateForSave(getDateMyDatepicker(this.TEMP_EVIDENCE_IN_DATE));
            _EVIDENCE_IN_DATE = _EVIDENCE_IN_DATE != null || "" ? `${_EVIDENCE_IN_DATE} ${this.TEMP_EVIDENCE_IN_TIME}:00.000` : "";

            this.ProveStorageEvidenceIn = new ProveStorageEvidenceIn();
            this.ProveStorageEvidenceIn.EVIDENCE_IN_ID = this.EVIDENCE_IN_ID;
            this.ProveStorageEvidenceIn.EVIDENCE_IN_CODE = this.TEMP_EVIDENCE_IN_CODE,
                this.ProveStorageEvidenceIn.EVIDENCE_IN_DATE = _EVIDENCE_IN_DATE,
                this.ProveStorageEvidenceIn.RECEIVE_OFFICE_NAME = this.TEMP_RECEIVE_OFFICE_NAME,
                this.ProveStorageEvidenceIn.RECEIVE_OFFICE_CODE = this.TEMP_RECEIVE_OFFICE_CODE,
                this.ProveStorageEvidenceIn.COMMENT1 = this.TEMP_COMMENT1 != undefined ? this.TEMP_COMMENT1 : null

            this.ProveStorageEvidenceInItem = [];
            this.ProveStorageProduct.forEach(ele => {
                let item = new ProveStorageEvidenceInItem();
                item = Object.assign(item, ele);
                item.DAMAGE_NET_VOLUMN_UNIT = item.DELIVERY_NET_VOLUMN_UNIT
                item.DAMAGE_QTY_UNIT = item.DELIVERY_QTY_UNIT
                item.DAMAGE_SIZE_UNIT = item.DELIVERY_SIZE_UNIT

                item.BALANCE_NET_VOLUMN_UNIT = item.DELIVERY_NET_VOLUMN_UNIT
                item.BALANCE_QTY_UNIT = item.DELIVERY_QTY_UNIT
                item.BALANCE_SIZE = item.DELIVERY_SIZE
                item.BALANCE_SIZE_UNIT = item.DELIVERY_SIZE_UNIT

                item.RECEIVE_NET_VOLUMN_UNIT = item.DELIVERY_NET_VOLUMN_UNIT
                item.RECEIVE_QTY_UNIT = item.DELIVERY_QTY_UNIT
                item.RECEIVE_SIZE_UNIT = item.DELIVERY_SIZE_UNIT

                item.RECEIVE_NET_VOLUMN = item.DELIVERY_NET_VOLUMN
                item.RECEIVE_QTY = item.DELIVERY_QTY
                item.RECEIVE_SIZE = item.DELIVERY_SIZE
                this.ProveStorageEvidenceInItem.push(item)

            });

            this.ProveStorageEvidenceInStaff = [];
            this.ProveStorageStaff.value.forEach(ele => {
                let item = new ProveStorageEvidenceInStaff();
                if (ele.STAFF_ID != "") {
                    item.STAFF_ID = ele.STAFF_ID
                    item.CONTRIBUTOR_ID = ele.CONTRIBUTOR_ID
                    this.ProveStorageEvidenceInStaff.push(item)
                }
            });



            this.ProveStorageEvidenceIn.ProveStorageEvidenceInItem = this.ProveStorageEvidenceInItem;
            this.ProveStorageEvidenceIn.ProveStorageEvidenceInStaff = this.ProveStorageEvidenceInStaff;
            console.log(this.ProveStorageEvidenceIn)
            this.proveStorageService.ProveStorageupdByCon(this.ProveStorageEvidenceIn).then(async item => {
                console.log(item)
                if (item.IsSuccess == "True") {


                    await Promise.all(this.fileList.filter(f => f.IsNewItem == true && f.IsDelItem == false).map(async m => {
                        const formData = new FormData();
                        formData.append('FILE', m.FILE);
                        formData.append('DOCUMENT_NAME', m.DOCUMENT_NAME);
                        formData.append('DOCUMENT_OLD_NAME', m.DOCUMENT_OLD_NAME);
                        formData.append('DOCUMENT_TYPE', '10');
                        formData.append('FOLDER', m.FOLDER);
                        formData.append('REFERENCE_CODE', this.EVIDENCE_IN_ID.toString());

                        console.log(formData)

                        await this.proveStorageService.DocumentAPI("DocumentinsAll", formData).then(item => {
                            if (item.IsSuccess == "True")
                                return true;
                            else
                                return false;
                        }, (error) => { console.error(error); return false; });

                    }));

                    await Promise.all(this.fileList.filter(f => f.IsDelItem == true).map(async m => {
                        await this.proveStorageService.DocumentupdDelete(m.DOCUMENT_ID.toString()).then(item => {
                            if (item.IsSuccess == "True")
                                return true;
                            else
                                return false;
                        }, (error) => { console.error(error); return false; });
                    }));


                    this.ShowAlertSuccess(Message.saveComplete);
                    this.preloader.setShowPreloader(false);
                    this.initActionEdit()
                    this.router.navigate([`/proveStorage/manage/EDIT/${this.ARREST_ID}/${this.EVIDENCE_IN_ID}`]);
                } else {
                    this.ShowAlertError(Message.saveFail);
                }
            }, (error) => { console.error(error); return false; });
        }
    }

    //=============== save ===========

    saveAdd() {

        var isSuccess = true;

        let _EVIDENCE_IN_DATE;
        _EVIDENCE_IN_DATE = convertDateForSave(getDateMyDatepicker(this.TEMP_EVIDENCE_IN_DATE));
        _EVIDENCE_IN_DATE = _EVIDENCE_IN_DATE != null || "" ? `${_EVIDENCE_IN_DATE} ${this.TEMP_EVIDENCE_IN_TIME}:00.000` : "";


        this.ProveStorageEvidenceIn = new ProveStorageEvidenceIn();
        this.ProveStorageEvidenceIn.EVIDENCE_IN_ID = this.EVIDENCE_IN_ID;
        this.ProveStorageEvidenceIn.EVIDENCE_IN_CODE = this.EVIDENCE_IN_CODE,
            this.ProveStorageEvidenceIn.EVIDENCE_IN_DATE = _EVIDENCE_IN_DATE,
            this.ProveStorageEvidenceIn.RECEIVE_OFFICE_NAME = this.TEMP_RECEIVE_OFFICE_NAME,
            this.ProveStorageEvidenceIn.RECEIVE_OFFICE_CODE = this.TEMP_RECEIVE_OFFICE_CODE,
            this.ProveStorageEvidenceIn.COMMENT1 = this.TEMP_COMMENT1 != undefined ? this.TEMP_COMMENT1 : null


        //console.log(this.ProveStorageStaff.value)

        this.ProveStorageEvidenceInItem = [];
        this.ProveStorageProduct.forEach(ele => {
            console.log(ele)
            let item = new ProveStorageEvidenceInItem();
            item = Object.assign(item, ele);
            item.DAMAGE_NET_VOLUMN_UNIT = item.DELIVERY_NET_VOLUMN_UNIT
            item.DAMAGE_QTY_UNIT = item.DELIVERY_QTY_UNIT
            item.DAMAGE_SIZE_UNIT = item.DELIVERY_SIZE_UNIT

            item.BALANCE_NET_VOLUMN_UNIT = item.DELIVERY_NET_VOLUMN_UNIT
            item.BALANCE_QTY_UNIT = item.DELIVERY_QTY_UNIT
            item.BALANCE_SIZE = item.DELIVERY_SIZE
            item.BALANCE_SIZE_UNIT = item.DELIVERY_SIZE_UNIT

            item.RECEIVE_NET_VOLUMN_UNIT = item.DELIVERY_NET_VOLUMN_UNIT
            item.RECEIVE_QTY_UNIT = item.DELIVERY_QTY_UNIT
            item.RECEIVE_SIZE_UNIT = item.DELIVERY_SIZE_UNIT

            item.RECEIVE_NET_VOLUMN = item.DELIVERY_NET_VOLUMN
            item.RECEIVE_QTY = item.DELIVERY_QTY
            item.RECEIVE_SIZE = item.DELIVERY_SIZE




            this.ProveStorageEvidenceInItem.push(item)
        });

        this.ProveStorageEvidenceInStaff = [];
        this.ProveStorageStaff.value.forEach(ele => {
            let item = new ProveStorageEvidenceInStaff();
            if (ele.STAFF_ID != "") {
                item.STAFF_ID = ele.STAFF_ID
                item.CONTRIBUTOR_ID = ele.CONTRIBUTOR_ID
                this.ProveStorageEvidenceInStaff.push(item)
            }
        });

        this.ProveStorageEvidenceIn.ProveStorageEvidenceInItem = this.ProveStorageEvidenceInItem;
        this.ProveStorageEvidenceIn.ProveStorageEvidenceInStaff = this.ProveStorageEvidenceInStaff;

        console.log(this.ProveStorageEvidenceIn);
        //console.log(this.fileList);

        this.proveStorageService.ProveStorageinsAll(this.ProveStorageEvidenceIn).then(async item => {
            console.log(item)
            if (item.IsSuccess == "True") {

                //this.EVIDENCE_IN_ID = item.EVIDENCE_IN_ID;

                if (isSuccess) {
                    let lsResult = [];

                    lsResult = await Promise.all(this.fileList.filter(f => f.IsNewItem == true && f.IsDelItem == false).map(async m => {
                        const formData = new FormData();
                        formData.append('FILE', m.FILE);
                        formData.append('DOCUMENT_NAME', m.DOCUMENT_NAME);
                        formData.append('DOCUMENT_OLD_NAME', m.DOCUMENT_OLD_NAME);
                        formData.append('DOCUMENT_TYPE', '10');
                        formData.append('FOLDER', m.FOLDER);
                        formData.append('REFERENCE_CODE', this.EVIDENCE_IN_ID.toString());

                        let response = await this.proveStorageService.DocumentAPI("DocumentinsAll", formData).then(item => {
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
                    this.preloader.setShowPreloader(false);
                    this.router.navigate([`/proveStorage/manage/EDIT/${this.ARREST_ID}/${this.EVIDENCE_IN_ID}`]);
                }
            } else {
                this.ShowAlertError(Message.saveFail);
            }
        }, (error) => { console.error(error); return false; });
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

            if (this.mode == "EDIT") {
                this.initActionEdit()

            } else if (this.mode == "ADD") {
                this.initActionAdd()
                this.initDataBoxII()
            }
            //this.router.navigate([`/deliveryStorage/manage/R/${this.ARREST_ID}`]);
        });
    }

    //======== init btn =========

    initActionAdd() {
        // set false
        this.PrintButton.next(false);
        this.EditButton.next(false);
        this.DeleteButton.next(false);
        this.showEditField = false;
        // set true
        this.SaveButton.next(true);
        this.CancelButton.next(true);

        //set box
        this.boxIII.next(false);
        this.boxIV.next(false);

        // this.InitialDataByLogin();
        this.SetBoxI(this.EVIDENCE_IN_ID)
        this.ProveStorageGetCaseAdd(this.EVIDENCE_IN_ID);
    }

    initActionEdit() {
        this.SaveButton.next(false);
        this.CancelButton.next(false);

        // set true  
        this.EditButton.next(true);
        this.DeleteButton.next(true);
        this.PrintButton.next(true);
        this.showEditField = true;

        this.SetBoxI(this.EVIDENCE_IN_ID)
        this.ProveStorageGetCaseEdit();
    }

    initActionView() {
        this.SaveButton.next(false);
        this.CancelButton.next(false);

        // set true  
        this.EditButton.next(false);
        this.DeleteButton.next(false);
        this.PrintButton.next(true);
        this.showEditField = true;

        this.SetBoxI(this.ARREST_ID)
        this.ProveStorageGetCaseEdit();
    }

    //===========init data bok II
    initDataBoxII() {
        this.TEMP_EVIDENCE_IN_CODE = this.AutoGenerate;
        this.TEMP_EVIDENCE_IN_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));
        this.TEMP_EVIDENCE_IN_TIME = this.getCurrentTime();
        this.TEMP_RECEIVE_OFFICE_NAME = this.officeShortName
        this.TEMP_RECEIVE_OFFICE_CODE = this.officeCode
        this.TEMP_COMMENT1 = "";
    }

    public searchStaff = (text2$: Observable<string>) =>
        text2$
            .debounceTime(200)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.proveStorageService.MasStaffgetByCon_Search({ TEXT_SEARCH: term })
                    .do(() => this.searchFailed = false)
                    .catch(() => {
                        this.searchFailed = true;
                        return Observable.of([]);
                    })
            )
            .do(() => this.searching = false);

    formatterStaff = (x: { TITLE_NAME_TH: string, FIRST_NAME: string, LAST_NAME: string }) =>
        `${x.TITLE_NAME_TH || ''}${x.FIRST_NAME || ''} ${x.LAST_NAME || ''}`


    selectItemStaff(e, i) {
        var _ContributorID;
        if (i == 0) { _ContributorID = 61; }
        else if (i == 1) { _ContributorID = 62; }
        else if (i == 2) { _ContributorID = 63; }
        else if (i == 3) { _ContributorID = 60; }
        this.ProveStorageStaff.at(i).patchValue({
            IsNewItem: true,
            FULL_NAME: `${e.item.TITLE_SHORT_NAME_TH || ''}${e.item.FIRST_NAME || ''} ${e.item.LAST_NAME || ''}`,
            STAFF_ID: e.item.STAFF_ID,
            MANAGEMENT_POS_NAME: e.item.MANAGEMENT_POS_NAME,
            OPERATION_OFFICE_SHORT_NAME: e.item.OPERATION_OFFICE_SHORT_NAME,
            CONTRIBUTOR_ID: _ContributorID,
        })
    }

    onDeleteStaff(i: number) {
        let ProveStorageStaff = this.ProveStorageStaff.at(i).value;
        let mStaffId = ProveStorageStaff.STAFF_ID == "" ? null : ProveStorageStaff.STAFF_ID;

        this.clearStaffOfindex(i);
    }

    clearStaffOfindex(i) {
        this.ProveStorageStaff.at(i).patchValue({
            IsNewItem: false,
            FULL_NAME: '',
            STAFF_ID: '',
            MANAGEMENT_POS_NAME: '',
            OPERATION_OFFICE_SHORT_NAME: '',
            CONTRIBUTOR_ID: '',
        });
    }

    private setItemFormArray(array: any[], formControl: string, formGroup: FormGroup) {
        if (array !== undefined && array.length) {
            const itemFGs = array.map(item => this.fb.group(item));
            const itemFormArray = this.fb.array(itemFGs);
            formGroup.setControl(formControl, itemFormArray);
        }
    }

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

            if (!/([0-9])$/.test(event.target.value))
                this.TEMP_DELIVERY_TIME = str_unSub.slice(0, str_unSub.length - 1);

            switch (true) {
                // NumPad 96-105
                case K >= 96 && K <= 105:
                    if (str.length == 2)
                        this.TEMP_DELIVERY_TIME = `${mm}:${ss}`;
                    else if (str.length == 3)
                        this.TEMP_DELIVERY_TIME = `${mm}:${str_unSub.substring(2)}`;
                    break;
                // KeyPad 96-105
                case (K >= 48 && K <= 57):
                    if (str.length == 2)
                        this.TEMP_DELIVERY_TIME = `${mm}:${ss}`;
                    else if (str.length == 3)
                        this.TEMP_DELIVERY_TIME = `${mm}:${str_unSub.substring(2)}`;
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
        }, 100);

        //** check format time */
        const patt = /([01]?[0-9]|2[0-3]):[0-5][0-9]/;
        if (!patt.test(this.TEMP_DELIVERY_TIME)) {
            this.isReqDeliveryTime.next(!patt.test(this.TEMP_DELIVERY_TIME));
        }

    }

    getCurrentDate() {
        let date = new Date();
        return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).toISOString().substring(0, 10);
    }

    getCurrentTime() {
        let date = new Date();
        return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });
    }

    toggleCollapse(event: BehaviorSubject<Boolean>): void {
        if (event.getValue())
            event.next(false);
        else
            event.next(true);
    }

    private createProveStorageForm() {

        this.proveStorageForm = this.fb.group({

            ProveStorageStaff: this.fb.array([this.createStaffForm(), this.createStaffForm(), this.createStaffForm(), this.createStaffForm()]),
        });
    }

    private createStaffForm(): FormGroup {


        ProveStorageStaffFormControl.STAFF_ID = new FormControl(""),
            ProveStorageStaffFormControl.IsNewItem = new FormControl(null),
            ProveStorageStaffFormControl.FULL_NAME = new FormControl("", Validators.required),
            ProveStorageStaffFormControl.MANAGEMENT_POS_NAME = new FormControl(""),
            ProveStorageStaffFormControl.OPERATION_OFFICE_SHORT_NAME = new FormControl(""),
            ProveStorageStaffFormControl.CONTRIBUTOR_ID = new FormControl(null)

        return this.fb.group(ProveStorageStaffFormControl)
    }


    InformToonAutoChange(value: string) {
        if (value == '') {
            this.InformTooptions = [];
        } else {
            if (this.rawOfficeSendOptions.length == 0) {
                this.getOffice();
            }
            this.InformTooptions = this.rawOfficeSendOptions.filter(f => f.OFFICE_NAME.toLowerCase().indexOf(value.toLowerCase()) > -1);
        }
    }

    async getOffice() {
        const body = {
            'TEXT_SEARCH': "",
            'OFFICE_ID': null
        };
        await this.masService.MasOfficegetByCon(body).toPromise().then(async res => {
            //console.log(res);
            if (res) {
                this.rawOfficeSendOptions = res;
            }
        }, (err: HttpErrorResponse) => {
            this.ShowAlertError("พบปัญหาในการติดต่อ Server");
            //alert("พบปัญหาในการติดต่อ Server");
        });
    }

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

    // **********************************
    // -------------- Document ----------
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
        this.proveStorageService.downloadFile(item.DOCUMENT_ID)
            .subscribe((data) => this.handleDownload(data, item));
    }

    handleDownload(data: any, item: any) {
        this.preloader.setShowPreloader(false);
        var blob = URL.createObjectURL(new Blob([data], { type: '*/*' }));
        saveAs(blob, item.DOCUMENT_NAME);
    }
    // **********************************
    // -------------- Document ----------
    // **********************************.

    NumericDotOnly(event): boolean {
        let patt = /^([0-9,.])$/;
        let result = patt.test(event.key);
        return result;
    }

    CalQty(i: number) {
        //let m = this.ProveStorageProduct.find(f => f.SEQ == i);
        console.log(this.ProveStorageProduct[i])
        // console.log(this.ProveStorageProduct[i].RECEIVE_QTY)
        // console.log(this.ProveStorageProduct[i].DELIVERY_QTY)
        let deliveryQty = parseFloat(this.ProveStorageProduct[i].DELIVERY_QTY);
        let receiveQty = parseFloat(this.ProveStorageProduct[i].BALANCE_QTY);
        // console.log("receiveQty"+receiveQty)
        // console.log("deliveryQty"+deliveryQty)

        if (deliveryQty >= receiveQty) {
            console.log("next")
            let damageQty = deliveryQty - receiveQty
            this.ProveStorageProduct[i].DAMAGE_QTY = damageQty
        } else {
            console.log("err")
            this.ShowAlertError("จำนวนรับห้ามมากกว่าจำนวนส่ง");
            this.ProveStorageProduct[i].BALANCE_QTY = 0
            this.ProveStorageProduct[i].DAMAGE_QTY = 0
        }
    }

    CalNetVolumn(i: number) {
        //let m = this.ProveStorageProduct.find(f => f.SEQ == i);
        console.log(this.ProveStorageProduct[i])
        // console.log(this.ProveStorageProduct[i].RECEIVE_QTY)
        // console.log(this.ProveStorageProduct[i].DELIVERY_QTY)
        let delivery = parseFloat(this.ProveStorageProduct[i].DELIVERY_NET_VOLUMN);
        let receive = parseFloat(this.ProveStorageProduct[i].BALANCE_NET_VOLUMN);
        // console.log("receiveQty"+receiveQty)
        // console.log("deliveryQty"+deliveryQty)

        if (delivery >= receive) {
            console.log("next")
            let damage = delivery - receive
            this.ProveStorageProduct[i].DAMAGE_NET_VOLUMN = damage
        } else {
            console.log("err")
            this.ShowAlertError("ปริมาณรับห้ามมากกว่าปริมาณส่ง");
            this.ProveStorageProduct[i].BALANCE_NET_VOLUMN = 0
            this.ProveStorageProduct[i].DAMAGE_NET_VOLUMN = 0
        }
    }

}
