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
import { DeliveryStorageService } from '../deliveryStorage.service';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ContibutorName, DeliveryStorageStaffFormControl, DeliveryStorageEvidenceIn, DeliveryStorageEvidenceInItem, DeliveryStorageEvidenceInStaff, DeliveryStorageProduct } from '../deliveryStorage';
import { MainMasterService } from 'app/services/main-master.service';
import { MasterService } from 'app/pages/arrests/services';
import { MastersConfig } from 'app/pages/masters/masters.config';
import { Document, ImageDocument, FileType } from '../deliveryStorageDocument';
import { saveAs } from 'file-saver';

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
    DeliveryStorageLawsuitDetail: any = [];
    DeliveryStorageProduct: any = []
    evidenceInItemList: any = [];
    evidenceInStaffList: any = [];
    ARREST_ID: number;
    EVIDENCE_IN_ID: number;
    deliveryStorageForm: FormGroup;
    staffData = ContibutorName;
    DELIVERY_CODE: string;
    InformTooptions = [];
    rawOfficeSendOptions = [];
    fileList: Document[] = []

    DeliveryStorageEvidenceIn: DeliveryStorageEvidenceIn;
    DeliveryStorageEvidenceInItem: DeliveryStorageEvidenceInItem[];
    DeliveryStorageEvidenceInStaff: DeliveryStorageEvidenceInStaff[];

    public destroy$: Subject<boolean> = new Subject<boolean>();
    PrintButton = new BehaviorSubject<Boolean>(false);
    SaveButton = new BehaviorSubject<Boolean>(false);
    CancelButton = new BehaviorSubject<Boolean>(false);
    DeleteButton = new BehaviorSubject<Boolean>(false);
    EditButton = new BehaviorSubject<Boolean>(false);


    isReq_DeliveryOfficeName = new BehaviorSubject<boolean>(false);
    isReq_DeliveryNo = new BehaviorSubject<boolean>(false);
    isReq_DeliveryDate = new BehaviorSubject<boolean>(false);
    isReq_DeliveryTime = new BehaviorSubject<boolean>(false);
    isReq_DeliveryTittle = new BehaviorSubject<boolean>(false);
    isReq_DeliveryDear = new BehaviorSubject<boolean>(false);

    boxI = new BehaviorSubject<Boolean>(true);
    boxII = new BehaviorSubject<Boolean>(true);
    boxIII = new BehaviorSubject<Boolean>(false);
    boxIV = new BehaviorSubject<Boolean>(false);

    //Step wizard
    INPUT_WIZARD = new BehaviorSubject<object>(null);



    // boxI
    TEMP_ARREST_CODE: string;
    TEMP_OCCURRENCE_DATE: any;
    TEMP_OCCURRENCE_TIME: any;
    TEMP_ARREST_STAFF_NAME: string;
    TEMP_OPERATION_POS_NAME: string;
    TEMP_OPERATION_OFFICE_SHORT_NAME: string;

    // boxII
    TEMP_EVIDENCE_IN_ID: string;
    TEMP_DELIVERY_CODE: string;
    TEMP_DELIVERY_OFFICE_NAME: string;
    TEMP_DELIVERY_NO: string;
    TEMP_DELIVERY_DATE: any;
    TEMP_DELIVERY_TIME: any;
    TEMP_DELIVERY_TITTLE: string;
    TEMP_DELIVERY_DEAR: string;
    TEMP_REMARK: string;

    searching: boolean = false;
    searchFailed: boolean = false;


    isReq_staff = new BehaviorSubject<boolean>(false);
    isReqDeliveryDate = new BehaviorSubject<boolean>(false);
    isReqDeliveryTime = new BehaviorSubject<boolean>(false);
    private today = new Date();
    DeliveryDateOptions: IMyOptions = {
        editableDateField: false,
        dateFormat: 'dd mmm yyyy',
        showClearDateBtn: false,
        height: '30px',
        disableDateRanges: [{
            begin: { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() + 1 },
            end: { year: this.today.getFullYear() + 100, month: this.today.getMonth() + 1, day: this.today.getDate() },
        }]
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
        private deliveryStorageService: DeliveryStorageService,
        private mainMasterService: MainMasterService,
    ) { super(); }

    // ----- Model ------ //
    @ViewChild('printDocModal') printDocModel: ElementRef;
    @ViewChild('documentModal') documentModal: ElementRef;




    get DeliveryStorageStaff(): FormArray {
        return this.deliveryStorageForm.get('DeliveryStorageStaff') as FormArray;
    }



    async ngOnInit() {

        this.preloader.setShowPreloader(true);
        await this.createDeliveryStorageForm();
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

    async DeliveryStorageGetCaseAdd(arrestId) {


        var paramsOther = {
            ARREST_ID: arrestId
        }

        //setBoxII
        this.deliveryStorageService.getDeliverStoragegetProduct(paramsOther).then(obj => {
            this.DeliveryStorageProduct = obj
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
                this.DeliveryStorageStaff.at(0).patchValue({
                    FULL_NAME: `${l.TITLE_SHORT_NAME_TH || ''}${l.FIRST_NAME || ''} ${l.LAST_NAME || ''}`,
                    STAFF_ID: l.STAFF_ID,
                    IsNewItem: true,
                    MANAGEMENT_POS_NAME: l.MANAGEMENT_POS_NAME,
                    OPERATION_OFFICE_SHORT_NAME: l.OPERATION_OFFICE_SHORT_NAME,
                    CONTRIBUTOR_ID: 59,
                });
                break;
            }
        }
        this.DeliveryStorageStaff.value.map((m, i) => {
            m.CONTRIBUTOR_NAME = this.staffData[i].as;
        })

        this.setItemFormArray(this.DeliveryStorageStaff.value, 'DeliveryStorageStaff', this.deliveryStorageForm);

        //########END SET STAFF #########

        this.preloader.setShowPreloader(false);
    }

    DeliveryStorageGetCaseEdit() {

        this.SetBoxII()
        this.preloader.setShowPreloader(false);
    }

    //============== set data

    async SetBoxI(arrestId: number) {


        var paramsOther = {
            ARREST_ID: arrestId
        }

        this.deliveryStorageService.getDeliverStoragegetByCreate(paramsOther).then(obj => {
            console.log(obj)
            this.TEMP_ARREST_CODE = obj.ARREST_CODE
            this.TEMP_OCCURRENCE_DATE = obj.OCCURRENCE_DATE
            this.TEMP_OCCURRENCE_TIME = obj.OCCURRENCE_TIME
            this.TEMP_ARREST_STAFF_NAME = obj.ARREST_STAFF_NAME
            this.TEMP_OPERATION_POS_NAME = obj.OPERATION_POS_NAME
            this.TEMP_OPERATION_OFFICE_SHORT_NAME = obj.OPERATION_OFFICE_SHORT_NAME
            this.DeliveryStorageLawsuitDetail = obj.DeliveryStorageLawsuitDetail


        }, (err: HttpErrorResponse) => {
            swal('', err.message, 'error');
        });
    }

    async SetBoxII() {

        var paramsOther = {
            EVIDENCE_IN_ID: this.EVIDENCE_IN_ID
        }

        //setBoxII
        this.deliveryStorageService.DeliverStoragegetByCon(paramsOther).then(async obj => {
            console.log(obj)
            this.TEMP_EVIDENCE_IN_ID = obj.EVIDENCE_IN_ID
            this.TEMP_DELIVERY_CODE = obj.DELIVERY_CODE
            this.TEMP_DELIVERY_DATE = setDateMyDatepicker(new Date(obj.DELIVERY_DATE));
            this.TEMP_DELIVERY_TIME = obj.DELIVERY_TIME
            this.TEMP_DELIVERY_OFFICE_NAME = obj.DELIVERY_OFFICE_NAME
            this.TEMP_DELIVERY_NO = obj.DELIVERY_NO
            this.TEMP_DELIVERY_TITTLE = obj.DELIVERY_TITTLE
            this.TEMP_DELIVERY_DEAR = obj.DELIVERY_DEAR
            this.TEMP_REMARK = obj.REMARK != "null" && obj.REMARK != null ? obj.REMARK : ""

            this.DeliveryStorageProduct = []
            obj.DeliveryStorageEvidenceInItem.forEach(ele => {
                let item = new DeliveryStorageProduct();
                item.PRODUCT_GROUP_ID = ele.PRODUCT_GROUP_ID
                item.PRODUCT_GROUP_CODE = ele.PRODUCT_GROUP_CODE
                item.PRODUCT_GROUP_NAME = ele.PRODUCT_GROUP_NAME
                item.PRODUCT_CATEGORY_CODE = ele.PRODUCT_CATEGORY_CODE
                item.PRODUCT_CATEGORY_NAME = ele.PRODUCT_CATEGORY_NAME
                item.PRODUCT_DESC = ele.PRODUCT_DESC
                item.DEGREE = ele.DEGREE
                item.PRICE = ele.PRICE
                item.SIZES = ele.DELIVERY_SIZE
                item.SIZES_UNIT = ele.DELIVERY_SIZE_UNIT
                item.QUANTITY = ele.DELIVERY_QTY
                item.QUANTITY_UNIT = ele.DELIVERY_QTY_UNIT
                item.VOLUMN = ele.DELIVERY_NET_VOLUMN
                item.VOLUMN_UNIT = ele.DELIVERY_NET_VOLUMN_UNIT
                this.DeliveryStorageProduct.push(item)
            });

            //this.setBoxIII(obj.DeliveryStorageEvidenceInStaff[0].STAFF_ID)

            //######## SET STAFF #########

            let typeheadStaff;

            await this.mainMasterService.MasStaff(obj.DeliveryStorageEvidenceInStaff[0].STAFF_ID, '').then(res1 => {
                const myObjStr = JSON.stringify(res1.RESPONSE_DATA);
                typeheadStaff = JSON.parse(myObjStr) || []
            }, (err: HttpErrorResponse) => {
                swal('', err.message, 'error');
            });

            for (let l of typeheadStaff) {
                let code = l.STAFF_ID;
                if (obj.DeliveryStorageEvidenceInStaff[0].STAFF_ID == code) {
                    this.DeliveryStorageStaff.at(0).patchValue({
                        FULL_NAME: `${l.TITLE_SHORT_NAME_TH || ''}${l.FIRST_NAME || ''} ${l.LAST_NAME || ''}`,
                        STAFF_ID: l.STAFF_ID,
                        IsNewItem: false,
                        MANAGEMENT_POS_NAME: l.MANAGEMENT_POS_NAME,
                        OPERATION_OFFICE_SHORT_NAME: l.OPERATION_OFFICE_SHORT_NAME,
                        CONTRIBUTOR_ID: 59,
                        EVIDENCE_IN_STAFF_ID: obj.DeliveryStorageEvidenceInStaff[0].EVIDENCE_IN_STAFF_ID
                    });
                    break;
                }
            }
            this.DeliveryStorageStaff.value.map((m, i) => {
                m.CONTRIBUTOR_NAME = this.staffData[i].as;
            })

            this.setItemFormArray(this.DeliveryStorageStaff.value, 'DeliveryStorageStaff', this.deliveryStorageForm);

            //########END SET STAFF #########

            // get Document
            await this.deliveryStorageService.GetDocumentByCon(9, this.EVIDENCE_IN_ID).then(async res => {
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
                                m.IMAGE_SHOW = this.deliveryStorageService.getImage(f.DOCUMENT_ID);
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

                this.deliveryStorageService.DeliverStorageupdDelete(paramsOther).then(async IsSuccess => {
                    if (IsSuccess) {
                        await Promise.all(this.fileList.filter(f => f.DOCUMENT_ID != null).map(async m => {
                            await this.deliveryStorageService.DocumentupdDelete(m.DOCUMENT_ID.toString()).then(item => {
                                if (item.IsSuccess == "True")
                                    return true;
                                else
                                    return false;
                            }, (error) => { console.error(error); return false; });
                        }));
                        this.router.navigate(['/deliveryStorage/list']);
                    } else {
                        swal('', Message.saveFail, 'error');
                    }
                }, (error) => { console.error(error); });
            }
        })
    }

    async OnSave() {

        this.DeliveryStorageEvidenceInStaff = [];
        this.DeliveryStorageStaff.value.forEach(ele => {
            let item = new DeliveryStorageEvidenceInStaff();
            item.STAFF_ID = ele.STAFF_ID
            this.DeliveryStorageEvidenceInStaff.push(item)
        });

        if (!this.TEMP_DELIVERY_OFFICE_NAME) {
            swal({
                text: 'กรุณาระบุข้อมูล "หน่วยงานนำส่ง"',
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'ตกลง'
            })
            this.boxII.next(true);
            this.isReq_DeliveryOfficeName.next(true);
            return;
        }
        if (!this.TEMP_DELIVERY_NO) {
            swal({
                text: 'กรุณาระบุข้อมูล "เลขหนังสือนำส่ง"',
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'ตกลง'
            })
            this.boxII.next(true);
            this.isReq_DeliveryNo.next(true);
            return;
        }
        if (!this.TEMP_DELIVERY_DATE) {
            swal({
                text: 'กรุณาระบุข้อมูล "วันที่นำส่ง"',
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'ตกลง'
            })
            this.boxII.next(true);
            this.isReq_DeliveryDate.next(true);
            return;
        }

        if (!this.TEMP_DELIVERY_TIME) {
            swal({
                text: 'กรุณาระบุข้อมูล "เวลานำส่ง"',
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'ตกลง'
            })
            this.boxII.next(true);
            this.isReq_DeliveryTime.next(true);
            return;
        }

        if (!this.TEMP_DELIVERY_TITTLE) {
            swal({
                text: 'กรุณาระบุข้อมูล "เรื่อง"',
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'ตกลง'
            })
            this.boxII.next(true);
            this.isReq_DeliveryTittle.next(true);
            return;
        }

        if (!this.TEMP_DELIVERY_DEAR) {
            swal({
                text: 'กรุณาระบุข้อมูล "เรียน"',
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'ตกลง'
            })
            this.boxII.next(true);
            this.isReq_DeliveryDear.next(true);
            return;
        }

        if (this.DeliveryStorageEvidenceInStaff.length > 0) {
            if (!this.DeliveryStorageEvidenceInStaff[0].STAFF_ID) {
                swal({
                    text: 'กรุณาระบุข้อมูล "ผู้นำส่งของกลาง"',
                    type: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'ตกลง'
                })
                this.boxIII.next(true);
                this.isReq_staff.next(true);
                return;
            }
        }

        console.log(this.mode)

        if (this.mode == 'ADD') {
            // generate deliveryCode
            await this.deliveryStorageService.TransactionRunninggetByCon("OPS_EVIDENCE_IN_DC", this.officeCode).then(async item => {
                if (item.length == 0) {
                    this.deliveryStorageService.TransactionRunninginsAll(this.officeCode, "OPS_EVIDENCE_IN_DC", "DC").then(async res => {
                        if (res.IsSuccess) {
                            this.DELIVERY_CODE = "DC" + this.officeCode + (setDateMyDatepicker(new Date(this.getCurrentDate())).date.year + 543).toString().substring(4, 2) + "00001";
                            console.log("DELIVERY_CODE insert" + this.DELIVERY_CODE);

                            this.saveAdd()
                        }
                        this.preloader.setShowPreloader(false);
                    }, (error) => { console.error(error); return false; });
                }
                else {
                    await this.deliveryStorageService.TransactionRunningupdByCon(item[0].RUNNING_ID).then(async res => {
                        if (res.IsSuccess) {
                            var pad = "00000"
                            var RunningNo = pad.substring(0, pad.length - item[0].RUNNING_NO.toString().length) + (+item[0].RUNNING_NO + 1);
                            this.DELIVERY_CODE = "DC" + this.officeCode + (setDateMyDatepicker(new Date(this.getCurrentDate())).date.year + 543).toString().substring(4, 2) + RunningNo;
                            console.log("DELIVERY_CODE update" + this.DELIVERY_CODE);

                            this.saveAdd()
                        }
                    }, (error) => { console.error(error); return false; });
                }
            }, (error) => { console.error(error); return false; });
        } else if (this.mode == 'EDIT') {


            let _DELIVERY_DATE;
            _DELIVERY_DATE = convertDateForSave(getDateMyDatepicker(this.TEMP_DELIVERY_DATE));
            _DELIVERY_DATE = _DELIVERY_DATE != null || "" ? `${_DELIVERY_DATE} ${this.TEMP_DELIVERY_TIME}:00.000` : "";


            this.DeliveryStorageEvidenceIn = new DeliveryStorageEvidenceIn();
            this.DeliveryStorageEvidenceIn.EVIDENCE_IN_ID = this.EVIDENCE_IN_ID
            this.DeliveryStorageEvidenceIn.ARREST_ID = this.ARREST_ID;
            this.DeliveryStorageEvidenceIn.DELIVERY_CODE = this.TEMP_DELIVERY_CODE,
                this.DeliveryStorageEvidenceIn.DELIVERY_NO = this.TEMP_DELIVERY_NO,
                this.DeliveryStorageEvidenceIn.DELIVERY_DATE = _DELIVERY_DATE,
                this.DeliveryStorageEvidenceIn.DELIVERY_OFFICE_CODE = this.officeCode
            this.DeliveryStorageEvidenceIn.DELIVERY_OFFICE_NAME = this.TEMP_DELIVERY_OFFICE_NAME,
                this.DeliveryStorageEvidenceIn.DELIVERY_TITTLE = this.TEMP_DELIVERY_TITTLE,
                this.DeliveryStorageEvidenceIn.DELIVERY_DEAR = this.TEMP_DELIVERY_DEAR,
                this.DeliveryStorageEvidenceIn.REMARK = this.TEMP_REMARK != undefined ? this.TEMP_REMARK : null



            this.DeliveryStorageEvidenceIn.DeliveryStorageEvidenceInStaff = this.DeliveryStorageEvidenceInStaff;

            console.log(this.DeliveryStorageEvidenceIn);
            console.log(this.fileList);

            this.deliveryStorageService.DeliverStorageupdByCon(this.DeliveryStorageEvidenceIn).then(async item => {
                console.log(item)
                if (item.IsSuccess == "True") {


                    await Promise.all(this.fileList.filter(f => f.IsNewItem == true && f.IsDelItem == false).map(async m => {
                        const formData = new FormData();
                        formData.append('FILE', m.FILE);
                        formData.append('DOCUMENT_NAME', m.DOCUMENT_NAME);
                        formData.append('DOCUMENT_OLD_NAME', m.DOCUMENT_OLD_NAME);
                        formData.append('DOCUMENT_TYPE', '9');
                        formData.append('FOLDER', m.FOLDER);
                        formData.append('REFERENCE_CODE', this.EVIDENCE_IN_ID.toString());

                        console.log(formData)

                        await this.deliveryStorageService.DocumentAPI("DocumentinsAll", formData).then(item => {
                            if (item.IsSuccess == "True")
                                return true;
                            else
                                return false;
                        }, (error) => { console.error(error); return false; });

                    }));

                    await Promise.all(this.fileList.filter(f => f.IsDelItem == true).map(async m => {
                        await this.deliveryStorageService.DocumentupdDelete(m.DOCUMENT_ID.toString()).then(item => {
                            if (item.IsSuccess == "True")
                                return true;
                            else
                                return false;
                        }, (error) => { console.error(error); return false; });
                    }));


                    this.ShowAlertSuccess(Message.saveComplete);
                    this.preloader.setShowPreloader(false);
                    this.initActionEdit()
                    this.router.navigate([`/deliveryStorage/manage/EDIT/${this.ARREST_ID}/${this.EVIDENCE_IN_ID}`]);
                } else {
                    this.ShowAlertError(Message.saveFail);
                }
            }, (error) => { console.error(error); return false; });
        }

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
    //=============== save ===========

    saveAdd() {

        var isSuccess = true;

        let _DELIVERY_DATE;
        _DELIVERY_DATE = convertDateForSave(getDateMyDatepicker(this.TEMP_DELIVERY_DATE));
        _DELIVERY_DATE = _DELIVERY_DATE != null || "" ? `${_DELIVERY_DATE} ${this.TEMP_DELIVERY_TIME}:00.000` : "";


        this.DeliveryStorageEvidenceIn = new DeliveryStorageEvidenceIn();
        this.DeliveryStorageEvidenceIn.ARREST_ID = this.ARREST_ID;
        this.DeliveryStorageEvidenceIn.DELIVERY_CODE = this.DELIVERY_CODE,
            this.DeliveryStorageEvidenceIn.DELIVERY_NO = this.TEMP_DELIVERY_NO,
            this.DeliveryStorageEvidenceIn.DELIVERY_DATE = _DELIVERY_DATE,
            this.DeliveryStorageEvidenceIn.DELIVERY_OFFICE_CODE = this.officeCode
        this.DeliveryStorageEvidenceIn.DELIVERY_OFFICE_NAME = this.TEMP_DELIVERY_OFFICE_NAME,
            this.DeliveryStorageEvidenceIn.DELIVERY_TITTLE = this.TEMP_DELIVERY_TITTLE,
            this.DeliveryStorageEvidenceIn.DELIVERY_DEAR = this.TEMP_DELIVERY_DEAR,
            this.DeliveryStorageEvidenceIn.REMARK = this.TEMP_REMARK != undefined ? this.TEMP_REMARK : null


        this.DeliveryStorageEvidenceInItem = [];
        this.DeliveryStorageProduct.forEach(ele => {
            let item = new DeliveryStorageEvidenceInItem();
            item.PRODUCT_GROUP_ID = ele.PRODUCT_GROUP_ID
            item.EVIDENCE_IN_ITEM_CODE = null
            item.PRODUCT_GROUP_CODE = ele.PRODUCT_GROUP_CODE
            item.PRODUCT_GROUP_NAME = ele.PRODUCT_GROUP_NAME
            item.PRODUCT_CATEGORY_CODE = ele.PRODUCT_CATEGORY_CODE
            item.PRODUCT_CATEGORY_NAME = ele.PRODUCT_CATEGORY_NAME
            item.PRODUCT_DESC = ele.PRODUCT_DESC
            item.DEGREE = ele.DEGREE
            item.PRICE = ele.PRICE
            item.DELIVERY_SIZE = ele.REMAIN_SIZES != 0 ? ele.REMAIN_SIZES : ele.SIZES
            item.DELIVERY_SIZE_UNIT = ele.REMAIN_SIZES_UNIT != null && ele.REMAIN_SIZES_UNIT != "null" ? ele.REMAIN_SIZES_UNIT : ele.SIZES_UNIT
            item.DELIVERY_QTY = ele.REMAIN_QUANTITY != 0 ? ele.REMAIN_QUANTITY : ele.QUANTITY
            item.DELIVERY_QTY_UNIT = ele.REMAIN_QUANTITY_UNIT != null && ele.REMAIN_QUANTITY_UNIT != "null" ? ele.REMAIN_QUANTITY_UNIT : ele.QUANTITY_UNIT
            item.DELIVERY_NET_VOLUMN = ele.REMAIN_VOLUMN != 0 ? ele.REMAIN_VOLUMN : ele.VOLUMN
            item.DELIVERY_NET_VOLUMN_UNIT = ele.REMAIN_VOLUMN_UNIT != null && ele.REMAIN_VOLUMN_UNIT != "null" ? ele.REMAIN_VOLUMN_UNIT : ele.VOLUMN_UNIT
            this.DeliveryStorageEvidenceInItem.push(item)
        });

        // this.DeliveryStorageEvidenceInStaff = [];
        // this.DeliveryStorageStaff.value.forEach(ele => {
        //     let item =  new DeliveryStorageEvidenceInStaff();
        //     item.STAFF_ID = ele.STAFF_ID
        //     this.DeliveryStorageEvidenceInStaff.push(item)
        //   });

        this.DeliveryStorageEvidenceIn.DeliveryStorageEvidenceInItem = this.DeliveryStorageEvidenceInItem;
        this.DeliveryStorageEvidenceIn.DeliveryStorageEvidenceInStaff = this.DeliveryStorageEvidenceInStaff;

        console.log(this.DeliveryStorageEvidenceIn);
        console.log(this.fileList);

        this.deliveryStorageService.DeliveryStorageinsAll(this.DeliveryStorageEvidenceIn).then(async item => {
            console.log(item)
            if (item.IsSuccess == "True") {

                this.EVIDENCE_IN_ID = item.EVIDENCE_IN_ID;

                if (isSuccess) {
                    let lsResult = [];

                    lsResult = await Promise.all(this.fileList.filter(f => f.IsNewItem == true && f.IsDelItem == false).map(async m => {
                        const formData = new FormData();
                        formData.append('FILE', m.FILE);
                        formData.append('DOCUMENT_NAME', m.DOCUMENT_NAME);
                        formData.append('DOCUMENT_OLD_NAME', m.DOCUMENT_OLD_NAME);
                        formData.append('DOCUMENT_TYPE', '9');
                        formData.append('FOLDER', m.FOLDER);
                        formData.append('REFERENCE_CODE', item.EVIDENCE_IN_ID);

                        let response = await this.deliveryStorageService.DocumentAPI("DocumentinsAll", formData).then(item => {
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
                    this.router.navigate([`/deliveryStorage/manage/EDIT/${this.ARREST_ID}/${this.EVIDENCE_IN_ID}`]);
                }
            } else {
                this.ShowAlertError(Message.saveFail);
            }
        }, (error) => { console.error(error); return false; });
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


        // this.InitialDataByLogin();
        this.SetBoxI(this.ARREST_ID)
        this.DeliveryStorageGetCaseAdd(this.ARREST_ID);
    }
    initActionEdit() {
        this.boxI.next(true);
        this.boxII.next(true);
        this.boxIII.next(true);
        this.boxIV.next(true);
        this.SaveButton.next(false);
        this.CancelButton.next(false);

        // set true  
        this.EditButton.next(true);
        this.DeleteButton.next(true);
        this.PrintButton.next(false);
        this.showEditField = true;

        this.SetBoxI(this.ARREST_ID)
        this.DeliveryStorageGetCaseEdit();
    }

    initActionView() {
        this.boxI.next(true);
        this.boxII.next(true);
        this.boxIII.next(true);
        this.boxIV.next(true);
        this.SaveButton.next(false);
        this.CancelButton.next(false);

        // set true  
        this.EditButton.next(false);
        this.DeleteButton.next(false);
        this.PrintButton.next(false);
        this.showEditField = true;

        this.SetBoxI(this.ARREST_ID)
        this.DeliveryStorageGetCaseEdit();
    }

    //===========init data bok II
    initDataBoxII() {
        this.TEMP_DELIVERY_CODE = this.AutoGenerate;
        this.TEMP_DELIVERY_DATE = setDateMyDatepicker(new Date(this.getCurrentDate()));
        this.TEMP_DELIVERY_TIME = this.getCurrentTime();
        this.TEMP_DELIVERY_OFFICE_NAME = this.officeShortName
        this.TEMP_DELIVERY_NO = "";
        this.TEMP_DELIVERY_TITTLE = "";
        this.TEMP_DELIVERY_DEAR = "";
        this.TEMP_REMARK = "";
    }

    public searchStaff = (text2$: Observable<string>) =>
        text2$
            .debounceTime(200)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.deliveryStorageService.MasStaffgetByCon_Search({ TEXT_SEARCH: term })
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
        if (i == 0) _ContributorID = 59;
        this.DeliveryStorageStaff.at(i).patchValue({
            IsNewItem: true,
            FULL_NAME: `${e.item.TITLE_SHORT_NAME_TH || ''}${e.item.FIRST_NAME || ''} ${e.item.LAST_NAME || ''}`,
            STAFF_ID: e.item.STAFF_ID,
            MANAGEMENT_POS_NAME: e.item.MANAGEMENT_POS_NAME,
            OPERATION_OFFICE_SHORT_NAME: e.item.OPERATION_OFFICE_SHORT_NAME,
            CONTRIBUTOR_ID: _ContributorID,
        })
    }

    onDeleteStaff(i: number) {
        let DeliveryStorageStaff = this.DeliveryStorageStaff.at(i).value;
        let mStaffId = DeliveryStorageStaff.STAFF_ID == "" ? null : DeliveryStorageStaff.STAFF_ID;

        this.clearStaffOfindex(i);
    }

    clearStaffOfindex(i) {
        this.DeliveryStorageStaff.at(i).patchValue({
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

    private createDeliveryStorageForm() {

        this.deliveryStorageForm = this.fb.group({

            DeliveryStorageStaff: this.fb.array([this.createStaffForm()]),
        });
    }

    private createStaffForm(): FormGroup {


        DeliveryStorageStaffFormControl.STAFF_ID = new FormControl(""),
            DeliveryStorageStaffFormControl.IsNewItem = new FormControl(null),
            DeliveryStorageStaffFormControl.FULL_NAME = new FormControl("", Validators.required),
            DeliveryStorageStaffFormControl.MANAGEMENT_POS_NAME = new FormControl(""),
            DeliveryStorageStaffFormControl.OPERATION_OFFICE_SHORT_NAME = new FormControl(""),
            DeliveryStorageStaffFormControl.CONTRIBUTOR_ID = new FormControl(null)

        return this.fb.group(DeliveryStorageStaffFormControl)
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
        this.deliveryStorageService.downloadFile(item.DOCUMENT_ID)
            .subscribe((data) => this.handleDownload(data, item));
    }

    handleDownload(data: any, item: any) {
        this.preloader.setShowPreloader(false);
        var blob = URL.createObjectURL(new Blob([data], { type: '*/*' }));
        saveAs(blob, item.DOCUMENT_NAME);
    }
    // **********************************
    // -------------- Document ----------
    // **********************************

    setfix(PRODUCT_GROUP_ID: string, value) {
        return value.toFixed(this.setToFixed(PRODUCT_GROUP_ID));
    }

    setToFixed(PRODUCT_GROUP_ID: string) {
        let toFixed: string;
        switch (PRODUCT_GROUP_ID.toString()) {
            case '1':
            case '2':
            case '13':
                toFixed = '3';
                break;
            default:
                toFixed = '0';
                break;
        }
        return toFixed;
    }



}
