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
import { MainMasterService } from 'app/services/main-master.service';
import { MasterService } from 'app/pages/arrests/services';
import { MastersConfig } from 'app/pages/masters/masters.config';
import { Document, ImageDocument, FileType } from '../evidenceOutStorageDocument';
import { saveAs } from 'file-saver';
import { EvidenceOutStorageService } from '../evidenceOutStorage.service';
import { ContibutorName, EvidenceOutStorageStaffFormControl, EvidenceOutStockBalanceByLawsuitNo, EvidenceOutStaff, EvidenceOut, EvidenceOutDetail, EvidenceOutItem } from '../evidenceOutStorage';

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
    showEditItem: any;
    // DeliveryStorageLawsuitDetail: any = [];
    // DeliveryStorageProduct: any = []
    // evidenceInItemList: any = [];
    // evidenceInStaffList: any = [];
    EVIDENCE_OUT_CODE: string
    EVIDENCE_OUT_ID: number;
    evidenceOutStorageForm: FormGroup;
    staffData = ContibutorName;
    InformTooptions = [];
    rawOfficeSendOptions = [];
    fileList: Document[] = []

    EvidenceOutStockBalanceByLawsuitNo: EvidenceOutStockBalanceByLawsuitNo[];
    EvidenceOut: EvidenceOut;
    EvidenceOutStaff: EvidenceOutStaff[];
    EvidenceOutDetail: EvidenceOutDetail[];
    EvidenceOutItem: EvidenceOutItem[];

    public destroy$: Subject<boolean> = new Subject<boolean>();
    PrintButton = new BehaviorSubject<Boolean>(false);
    SaveButton = new BehaviorSubject<Boolean>(false);
    CancelButton = new BehaviorSubject<Boolean>(false);
    DeleteButton = new BehaviorSubject<Boolean>(false);
    EditButton = new BehaviorSubject<Boolean>(false);

    isReq_EvidenceOutNo = new BehaviorSubject<boolean>(false);
    isReq_EvidenceOutDate = new BehaviorSubject<boolean>(false);
    isReq_EvidenceOutTime = new BehaviorSubject<boolean>(false);
    isReq_EvidenceOutNoDate = new BehaviorSubject<boolean>(false);
    isReq_EvidenceOutNoTime = new BehaviorSubject<boolean>(false);
    isReq_SendToOfficeCode = new BehaviorSubject<boolean>(false);
    isReq_Remark = new BehaviorSubject<boolean>(false);
    isReq_ApproveTime = new BehaviorSubject<boolean>(false);

    isReq_EvidenceOutCode = new BehaviorSubject<boolean>(false);

    isRequired: boolean | false;

    
    boxI = new BehaviorSubject<Boolean>(true);
    boxII = new BehaviorSubject<Boolean>(true);
    boxIII = new BehaviorSubject<Boolean>(false);
    boxIV = new BehaviorSubject<Boolean>(false);

    //Step wizard
    INPUT_WIZARD = new BehaviorSubject<object>(null);

    

    // boxI
    TEMP_EVIDENCE_OUT_NO: string
    TEMP_EVIDENCE_OUT_DATE: any;
    TEMP_EVIDENCE_OUT_TIME: any;
    TEMP_EVIDENCE_OUT_NO_DATE: any;
    TEMP_EVIDENCE_OUT_NO_TIME: any;
    TEMP_SEND_TO_OFFICE_CODE: string
    TEMP_APPROVE_NO: string
    TEMP_APPROVE_DATE: any
    TEMP_APPROVE_TIME: any
    TEMP_DELIVERY: string
    TEMP_REMARK: string;


    // boxII
    TEMP_EVIDENCE_OUT_CODE: string
    

    searching: boolean = false;
    searchFailed: boolean = false;

    private today = new Date();
    EvidenceOutDateOptions: IMyOptions = {
        editableDateField: false,
        dateFormat: 'dd mmm yyyy',
        showClearDateBtn: false,
        height: '30px',
        disableDateRanges: [{
        begin: { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() + 1 },
        end: { year: this.today.getFullYear() + 100, month: this.today.getMonth() + 1, day: this.today.getDate() },
        }]
    };

    EvidenceOutNoDateOptions: IMyOptions = {
        editableDateField: false,
        dateFormat: 'dd mmm yyyy',
        showClearDateBtn: false,
        height: '30px',
        disableDateRanges: [{
        begin: { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() + 1 },
        end: { year: this.today.getFullYear() + 100, month: this.today.getMonth() + 1, day: this.today.getDate() },
        }]
    };

    ApproveDateOptions: IMyOptions = {
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
        private evidenceOutStorageService: EvidenceOutStorageService,
        private mainMasterService: MainMasterService,
    ) { super(); }

    // ----- Model ------ //
    @ViewChild('printDocModal') printDocModel: ElementRef;
    @ViewChild('documentModal') documentModal: ElementRef;
    @ViewChild('item') itemModel: ElementRef;

    
    get EvidenceOutStorageStaff(): FormArray {
        return this.evidenceOutStorageForm.get('EvidenceOutStorageStaff') as FormArray;
    }
    
    

    async ngOnInit() {
        
        //this.preloader.setShowPreloader(true);
        await this.createEvidenceOutStorageForm();
        this.active_Route();
        this.EvidenceOutStockBalanceByLawsuitNo = []

    }

    private active_Route() {
        this.sub = this.activeRoute.params.subscribe(p => {
            this.mode = p['mode'];
            this.EVIDENCE_OUT_ID =p['evidenceOutId']

            switch (this.mode) {
                case this.ModeAction.ADD: // new
                    this.initDataAdd()
                    this.initActionAdd()
                    break;

                case this.ModeAction.EDIT: // edit
                    
                    this.initActionEdit()
                    break;

                case this.ModeAction.VIEW: // view
                    
                    //this.initActionView()
                    break;
            }
        });
    }

    async SetBoxIII(){

        
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
            this.EvidenceOutStorageStaff.at(0).patchValue({
              FULL_NAME: `${l.TITLE_SHORT_NAME_TH || ''}${l.FIRST_NAME || ''} ${l.LAST_NAME || ''}`,
              STAFF_ID: l.STAFF_ID,
              IsNewItem: true,
              MANAGEMENT_POS_NAME: l.MANAGEMENT_POS_NAME,
              OPERATION_OFFICE_SHORT_NAME: l.OPERATION_OFFICE_SHORT_NAME,
              CONTRIBUTOR_ID: 81,
            });
            this.EvidenceOutStorageStaff.at(2).patchValue({
                FULL_NAME: `${l.TITLE_SHORT_NAME_TH || ''}${l.FIRST_NAME || ''} ${l.LAST_NAME || ''}`,
                STAFF_ID: l.STAFF_ID,
                IsNewItem: true,
                MANAGEMENT_POS_NAME: l.MANAGEMENT_POS_NAME,
                OPERATION_OFFICE_SHORT_NAME: l.OPERATION_OFFICE_SHORT_NAME,
                CONTRIBUTOR_ID: 77,
              });
            break;
          }
        }
        this.EvidenceOutStorageStaff.value.map((m, i) => {
          m.CONTRIBUTOR_NAME = this.staffData[i].as;
        })

        this.setItemFormArray(this.EvidenceOutStorageStaff.value, 'EvidenceOutStorageStaff', this.evidenceOutStorageForm);

        //########END SET STAFF #########

        this.preloader.setShowPreloader(false);
    }

    //============== set data ==============

    async EvidenceOutStorageGetCaseEdit(){
        
        var paramsOther = {
            EVIDENCE_OUT_ID: this.EVIDENCE_OUT_ID
        }

        this.evidenceOutStorageService.EvidenceOutgetByCon(paramsOther).then(async obj => {
            console.log(obj)

            this.TEMP_EVIDENCE_OUT_NO = obj.EVIDENCE_OUT_NO
            this.TEMP_SEND_TO_OFFICE_CODE = obj.SEND_TO_OFFICE_NAME
            this.TEMP_APPROVE_NO = obj.APPROVE_NO
            this.TEMP_DELIVERY = obj.DELIVERY
            this.TEMP_REMARK = obj.REMARK
            this.TEMP_EVIDENCE_OUT_NO_DATE = setDateMyDatepicker(new Date(obj.EVIDENCE_OUT_NO_DATE));
            this.TEMP_EVIDENCE_OUT_NO_TIME = obj.EVIDENCE_OUT_NO_TIME
            this.TEMP_APPROVE_DATE = setDateMyDatepicker(new Date(obj.APPROVE_DATE));
            this.TEMP_APPROVE_TIME = obj.APPROVE_TIME

            
            this.TEMP_EVIDENCE_OUT_CODE = obj.EVIDENCE_OUT_CODE
            this.TEMP_EVIDENCE_OUT_DATE = setDateMyDatepicker(new Date(obj.EVIDENCE_OUT_DATE));
            this.TEMP_EVIDENCE_OUT_TIME = obj.EVIDENCE_OUT_TIME


            //######## SET STAFF #########
            
            for(let l of obj.EvidenceOutStaff){
                console.log(l)
                let index ;
                if (l.CONTRIBUTOR_ID == 81){
                    index = 0
                }else if(l.CONTRIBUTOR_ID == 82){
                    index = 1
                }else if(l.CONTRIBUTOR_ID == 77){
                    index = 2
                }
                
                this.EvidenceOutStorageStaff.at(index).patchValue({
                    FULL_NAME: `${l.TITLE_SHORT_NAME_TH || ''}${l.FIRST_NAME || ''} ${l.LAST_NAME || ''}`,
                    STAFF_ID: l.STAFF_REF_ID,
                    IsNewItem: false,
                    MANAGEMENT_POS_NAME: l.MANAGEMENT_POS_NAME,
                    OPERATION_OFFICE_SHORT_NAME: l.OPERATION_OFFICE_SHORT_NAME,
                    CONTRIBUTOR_ID: l.CONTRIBUTOR_ID,
                    EVIDENCE_IN_STAFF_ID:l.EVIDENCE_OUT_STAFF_ID
                });
            }

            this.EvidenceOutStorageStaff.value.map((m, i) => {
                m.CONTRIBUTOR_NAME = this.staffData[i].as;
            })

            this.setItemFormArray(this.EvidenceOutStorageStaff.value, 'EvidenceOutStorageStaff', this.evidenceOutStorageForm);

        //########END SET STAFF #########

        // get Document
        await this.evidenceOutStorageService.GetDocumentByCon(10, this.EVIDENCE_OUT_ID).then(async res => {
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
                            m.IMAGE_SHOW = this.evidenceOutStorageService.getImage(f.DOCUMENT_ID);
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

        this.evidenceOutStorageService.EvidenceOutStockBalanceByEvidenceOutId(paramsOther).then(async objs => {
            console.log(objs)
            this.EvidenceOutStockBalanceByLawsuitNo = objs
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
        this.showEditItem = true;
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
                    EVIDENCE_OUT_ID: this.EVIDENCE_OUT_ID
                }
                
                this.evidenceOutStorageService.EvidenceOutupdDelete(paramsOther).then(async IsSuccess => {
                    if (IsSuccess) {
                                await Promise.all(this.fileList.filter(f => f.DOCUMENT_ID != null).map(async m => {
                                    await this.evidenceOutStorageService.DocumentupdDelete(m.DOCUMENT_ID.toString()).then(item => {
                                        if (item.IsSuccess == "True")
                                            return true;
                                        else
                                            return false;
                                    }, (error) => { console.error(error); return false; });
                                }));
                        this.router.navigate(['/evidenceOutStorage/list']);
                    } else {
                        swal('', Message.saveFail, 'error');
                    }
                }, (error) => { console.error(error); });
            }
        })
    }

    async OnSave() {

        this.EvidenceOutStaff = [];
            this.EvidenceOutStorageStaff.value.forEach(ele => {
                let item =  new EvidenceOutStaff();
                item.STAFF_ID = ele.STAFF_ID
                item.CONTRIBUTOR_ID = ele.CONTRIBUTOR_ID
                this.EvidenceOutStaff.push(item)
        });
        
        this.valid();

        console.log(this.mode)

        if(this.mode == 'ADD'){
            //generate deliveryCode
            await this.evidenceOutStorageService.TransactionRunninggetByCon("OPS_EVIDENCE_OUT", this.officeCode).then(async item => {
                if (item.length == 0) {
                    this.evidenceOutStorageService.TransactionRunninginsAll(this.officeCode, "OPS_EVIDENCE_OUT", "TF").then(async res => {
                        if (res.IsSuccess) {
                            this.EVIDENCE_OUT_CODE = "TF" + this.officeCode + (setDateMyDatepicker(new Date(this.getCurrentDate())).date.year + 543).toString().substring(4, 2) + "00001";
                            console.log("EVIDENCE_OUT_CODE insert"+this.EVIDENCE_OUT_CODE);

                            this.saveAdd()
                        }
                        this.preloader.setShowPreloader(false);
                    }, (error) => { console.error(error); return false; });
                }
                else {
                    await this.evidenceOutStorageService.TransactionRunningupdByCon(item[0].RUNNING_ID).then(async res => {
                        if (res.IsSuccess) {
                            var pad = "00000"
                            var RunningNo = pad.substring(0, pad.length - item[0].RUNNING_NO.toString().length) + (+item[0].RUNNING_NO + 1);
                            this.EVIDENCE_OUT_CODE = "TF" + this.officeCode + (setDateMyDatepicker(new Date(this.getCurrentDate())).date.year + 543).toString().substring(4, 2) + RunningNo;
                            console.log("EVIDENCE_OUT_CODE update"+this.EVIDENCE_OUT_CODE);

                            this.saveAdd()
                        }
                    }, (error) => { console.error(error); return false; });
                }
            }, (error) => { console.error(error); return false; });
        }else if(this.mode == 'EDIT'){

            let _EVIDENCE_OUT_NO_DATE ;
            let _APPROVE_DATE ;
            let _EVIDENCE_OUT_DATE ;

            _EVIDENCE_OUT_NO_DATE = convertDateForSave(getDateMyDatepicker(this.TEMP_EVIDENCE_OUT_NO_DATE));
            _EVIDENCE_OUT_NO_DATE = _EVIDENCE_OUT_NO_DATE != null || "" ? `${_EVIDENCE_OUT_NO_DATE} ${this.TEMP_EVIDENCE_OUT_NO_TIME}:00.000` : "";

            _APPROVE_DATE = convertDateForSave(getDateMyDatepicker(this.TEMP_APPROVE_DATE));
            _APPROVE_DATE = _APPROVE_DATE != null || "" ? `${_APPROVE_DATE} ${this.TEMP_APPROVE_TIME}:00.000` : "";

            _EVIDENCE_OUT_DATE = convertDateForSave(getDateMyDatepicker(this.TEMP_EVIDENCE_OUT_DATE));
            _EVIDENCE_OUT_DATE = _EVIDENCE_OUT_DATE != null || "" ? `${_EVIDENCE_OUT_DATE} ${this.TEMP_EVIDENCE_OUT_TIME}:00.000` : "";


            this.EvidenceOut = new EvidenceOut();
            this.EvidenceOut.EVIDENCE_OUT_ID = this.EVIDENCE_OUT_ID
            this.EvidenceOut.EVIDENCE_OUT_CODE = this.TEMP_EVIDENCE_OUT_CODE
            this.EvidenceOut.EVIDENCE_OUT_DATE = _EVIDENCE_OUT_DATE

            this.EvidenceOut.EVIDENCE_OUT_NO = this.TEMP_EVIDENCE_OUT_NO
            this.EvidenceOut.EVIDENCE_OUT_NO_DATE = _EVIDENCE_OUT_NO_DATE
            this.EvidenceOut.SEND_TO_OFFICE_NAME = this.TEMP_SEND_TO_OFFICE_CODE
            this.EvidenceOut.APPROVE_NO = this.TEMP_APPROVE_NO
            this.EvidenceOut.APPROVE_DATE = _APPROVE_DATE
            this.EvidenceOut.DELIVERY = this.TEMP_DELIVERY
            this.EvidenceOut.REMARK = this.TEMP_REMARK != undefined ? this.TEMP_REMARK : null

            this.EvidenceOutStaff = [];
            this.EvidenceOutStorageStaff.value.forEach(ele => {
                if(ele.STAFF_ID != ""){
                    let item =  new EvidenceOutStaff();
                    item.STAFF_ID = ele.STAFF_ID
                    item.CONTRIBUTOR_ID = ele.CONTRIBUTOR_ID
                    this.EvidenceOutStaff.push(item)
                }
            });

            this.EvidenceOut.EvidenceOutStaff = this.EvidenceOutStaff;

            console.log(this.EvidenceOut);
            console.log(this.fileList);
            

            this.evidenceOutStorageService.EvidenceOutupdByCon(this.EvidenceOut).then(async item => {
                console.log(item)
                if (item.IsSuccess == "True") {


                            await Promise.all(this.fileList.filter(f => f.IsNewItem == true && f.IsDelItem == false).map(async m => {
                                const formData = new FormData();
                                formData.append('FILE', m.FILE);
                                formData.append('DOCUMENT_NAME', m.DOCUMENT_NAME);
                                formData.append('DOCUMENT_OLD_NAME', m.DOCUMENT_OLD_NAME);
                                formData.append('DOCUMENT_TYPE', '910');
                                formData.append('FOLDER', m.FOLDER);
                                formData.append('REFERENCE_CODE', this.EVIDENCE_OUT_ID.toString());

                                console.log(formData)
                
                                await this.evidenceOutStorageService.DocumentAPI("DocumentinsAll", formData).then(item => {
                                    if (item.IsSuccess == "True")
                                        return true;
                                    else
                                        return false;
                                }, (error) => { console.error(error); return false; });
                
                            }));

                            await Promise.all(this.fileList.filter(f => f.IsDelItem == true).map(async m => {
                                    await this.evidenceOutStorageService.DocumentupdDelete(m.DOCUMENT_ID.toString()).then(item => {
                                        if (item.IsSuccess == "True")
                                            return true;
                                        else
                                            return false;
                                    }, (error) => { console.error(error); return false; });
                            }));


                        this.ShowAlertSuccess(Message.saveComplete);
                        this.preloader.setShowPreloader(false);
                        this.initActionEdit()
                        this.router.navigate([`/evidenceOutStorage/manage/EDIT/${this.EVIDENCE_OUT_ID}`]);
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
            
            if(this.mode == "EDIT"){
                this.initActionEdit()
                    
            }else if(this.mode == "ADD"){
                this.initActionAdd()
                this.initDataAdd()
            }
            //this.router.navigate([`/deliveryStorage/manage/R/${this.ARREST_ID}`]);
        });
    }
    //=============== save ===========

    saveAdd(){

        var isSuccess = true;

        let _EVIDENCE_OUT_NO_DATE ;
        let _APPROVE_DATE ;
        let _EVIDENCE_OUT_DATE ;

        _EVIDENCE_OUT_NO_DATE = convertDateForSave(getDateMyDatepicker(this.TEMP_EVIDENCE_OUT_NO_DATE));
        _EVIDENCE_OUT_NO_DATE = _EVIDENCE_OUT_NO_DATE != null || "" ? `${_EVIDENCE_OUT_NO_DATE} ${this.TEMP_EVIDENCE_OUT_NO_TIME}:00.000` : "";

        _APPROVE_DATE = convertDateForSave(getDateMyDatepicker(this.TEMP_APPROVE_DATE));
        _APPROVE_DATE = _APPROVE_DATE != null || "" ? `${_APPROVE_DATE} ${this.TEMP_APPROVE_TIME}:00.000` : "";

        _EVIDENCE_OUT_DATE = convertDateForSave(getDateMyDatepicker(this.TEMP_EVIDENCE_OUT_DATE));
        _EVIDENCE_OUT_DATE = _EVIDENCE_OUT_DATE != null || "" ? `${_EVIDENCE_OUT_DATE} ${this.TEMP_EVIDENCE_OUT_TIME}:00.000` : "";


        this.EvidenceOut = new EvidenceOut();
        this.EvidenceOut.EVIDENCE_OUT_CODE = this.EVIDENCE_OUT_CODE
        this.EvidenceOut.EVIDENCE_OUT_DATE = _EVIDENCE_OUT_DATE

        this.EvidenceOut.EVIDENCE_OUT_NO = this.TEMP_EVIDENCE_OUT_NO
        this.EvidenceOut.EVIDENCE_OUT_NO_DATE = _EVIDENCE_OUT_NO_DATE
        this.EvidenceOut.SEND_TO_OFFICE_NAME = this.TEMP_SEND_TO_OFFICE_CODE
        this.EvidenceOut.APPROVE_NO = this.TEMP_APPROVE_NO
        this.EvidenceOut.APPROVE_DATE = _APPROVE_DATE
        this.EvidenceOut.DELIVERY = this.TEMP_DELIVERY
        this.EvidenceOut.REMARK = this.TEMP_REMARK != undefined ? this.TEMP_REMARK : null


        this.EvidenceOutDetail = [];
        this.EvidenceOutItem = []

        this.EvidenceOutStockBalanceByLawsuitNo.forEach(ele =>{
            let item1 =  new EvidenceOutDetail();
            item1.EVIDENCE_IN_ID = ele.EVIDENCE_IN_ID
            item1.IS_ACTIVE = 1
            this.EvidenceOutDetail.push(item1)

            
            if(ele.EvidenceInItem.length > 0){
                for(let obj of ele.EvidenceInItem){
                    console.log(obj)
                    let item2 = new EvidenceOutItem()
                    item2.STOCK_ID = obj.EvidenceOutStockBalance[0].STOCK_ID
                    item2.QTY = obj.EvidenceOutStockBalance[0].BALANCE_QTY
                    item2.QTY_UNIT =  obj.EvidenceOutStockBalance[0].BALANCE_QTY_UNIT
                    item2.PRODUCT_SIZE = obj.EvidenceOutStockBalance[0].BALANCE_SIZE
                    item2.PRODUCT_SIZE_UNIT = obj.EvidenceOutStockBalance[0].BALANCE_SIZE_UNIT
                    item2.NET_VOLUMN =  obj.EvidenceOutStockBalance[0].BALANCE_NET_VOLUMN
                    item2.NET_VOLUMN_UNIT =  obj.EvidenceOutStockBalance[0].BALANCE_NET_VOLUMN_UNIT
                    this.EvidenceOutItem.push(item2)

                }
            }
        })
        this.EvidenceOutStaff = [];
        this.EvidenceOutStorageStaff.value.forEach(ele => {
            if(ele.STAFF_ID != ""){
                let item =  new EvidenceOutStaff();
                item.STAFF_ID = ele.STAFF_ID
                item.CONTRIBUTOR_ID = ele.CONTRIBUTOR_ID
                this.EvidenceOutStaff.push(item)
            }
          });

        this.EvidenceOut.EvidenceOutDetail = this.EvidenceOutDetail;
        this.EvidenceOut.EvidenceOutItem = this.EvidenceOutItem;
        this.EvidenceOut.EvidenceOutStaff = this.EvidenceOutStaff;

        console.log("data edit ",this.EvidenceOut);
        console.log(this.fileList);

        this.evidenceOutStorageService.EvidenceOutinsAll(this.EvidenceOut).then(async item => {
            console.log(item)
            if (item.IsSuccess == "True") {
                
                this.EVIDENCE_OUT_ID = item.EVIDENCE_OUT_ID;
                
                if (isSuccess) {
                    let lsResult = [];
        
                    lsResult = await Promise.all(this.fileList.filter(f => f.IsNewItem == true && f.IsDelItem == false).map(async m => {
                        const formData = new FormData();
                        formData.append('FILE', m.FILE);
                        formData.append('DOCUMENT_NAME', m.DOCUMENT_NAME);
                        formData.append('DOCUMENT_OLD_NAME', m.DOCUMENT_OLD_NAME);
                        formData.append('DOCUMENT_TYPE', '10');
                        formData.append('FOLDER', m.FOLDER);
                        formData.append('REFERENCE_CODE', item.EVIDENCE_OUT_ID);
        
                        let response = await this.evidenceOutStorageService.DocumentAPI("DocumentinsAll", formData).then(item => {
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
                    this.router.navigate([`/evidenceOutStorage/manage/EDIT/${this.EVIDENCE_OUT_ID}`]);
                }
            } else {
                this.ShowAlertError(Message.saveFail);
            }
        }, (error) => { console.error(error); return false; });
    }

    //======== init btn =========

    initActionAdd(){
        // set false
        this.PrintButton.next(false);
        this.EditButton.next(false);
        this.DeleteButton.next(false);
        this.showEditField = false;
        this.showEditItem = false;
        // set true
        this.SaveButton.next(true);
        this.CancelButton.next(true);

        this.SetBoxIII();
    }
    initActionEdit(){
        this.boxI.next(true);
        this.boxII.next(true);
        this.boxIII.next(true);
        this.boxIV.next(true);
        this.SaveButton.next(false);
        this.CancelButton.next(false);

        // set true  
        this.EditButton.next(true);
        this.DeleteButton.next(true);
        this.PrintButton.next(true);
        this.showEditField = true;
        this.showEditItem = true;

        this.EvidenceOutStorageGetCaseEdit();
    }

    initActionView(){
        this.boxI.next(true);
        this.boxII.next(true);
        this.boxIII.next(true);
        this.boxIV.next(true);
        this.SaveButton.next(false);
        this.CancelButton.next(false);

        // set true  
        this.EditButton.next(false);
        this.DeleteButton.next(false);
        this.PrintButton.next(true);
        this.showEditField = true;

        //this.SetBoxI(this.ARREST_ID)
        this.EvidenceOutStorageGetCaseEdit();
    }

    //===========init data bok II
    initDataAdd(){
        this.TEMP_EVIDENCE_OUT_CODE = this.AutoGenerate;
    }

    //=========== valid =========

    valid(){


        if(!this.TEMP_EVIDENCE_OUT_NO){
            swal({
                text: 'กรุณาระบุข้อมูล "เลขที่หนังสือนำส่ง"',
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'ตกลง'
              })
              this.boxI.next(true);
              this.isReq_EvidenceOutCode.next(true);
              return;
        }
        if(!this.TEMP_EVIDENCE_OUT_NO_DATE){
            swal({
                text: 'กรุณาระบุข้อมูล "ลงวันที่"',
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'ตกลง'
              })
              this.boxI.next(true);
              this.isReq_EvidenceOutNoDate.next(true);
              return;
        }

        if(!this.TEMP_EVIDENCE_OUT_NO_TIME){
            swal({
                text: 'กรุณาระบุข้อมูล "เวลาลงวันที่"',
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'ตกลง'
              })
              this.boxI.next(true);
              this.isReq_EvidenceOutNoTime.next(true);
              return;
        }

        if(this.TEMP_EVIDENCE_OUT_NO_TIME.invalid){
            swal({
                text: 'กรุณาระบุข้อมูล "เวลาลงวันที่"',
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'ตกลง'
              })
              this.boxI.next(true);
              this.isReq_EvidenceOutNoTime.next(true);
              return;
        }
        if(!this.TEMP_EVIDENCE_OUT_DATE){
            swal({
                text: 'กรุณาระบุข้อมูล "วันที่นำออก"',
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'ตกลง'
              })
              this.boxI.next(true);
              this.isReq_EvidenceOutDate.next(true);
              return;
        }

        if(!this.TEMP_EVIDENCE_OUT_TIME){
            swal({
                text: 'กรุณาระบุข้อมูล "เวลาที่นำออก"',
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'ตกลง'
              })
              this.boxI.next(true);
              this.isReq_EvidenceOutTime.next(true);
              return;
        }

        if(this.TEMP_EVIDENCE_OUT_TIME.invalid){
            swal({
                text: 'กรุณาระบุข้อมูล "เวลาที่นำออก"',
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'ตกลง'
              })
              this.boxI.next(true);
              this.isReq_EvidenceOutTime.next(true);
              return;
        }

        if(!this.TEMP_SEND_TO_OFFICE_CODE){
            swal({
                text: 'กรุณาระบุข้อมูล "หน่วยงานปลายทาง"',
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'ตกลง'
              })
              this.boxI.next(true);
              this.isReq_SendToOfficeCode.next(true);
              return;
        }

        if(!this.TEMP_REMARK){
            swal({
                text: 'กรุณาระบุข้อมูล "เหตุผลในการโอนย้าย"',
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'ตกลง'
              })
              this.boxI.next(true);
              this.isReq_Remark.next(true);
              return;
        }
        

         if (this.EvidenceOutStockBalanceByLawsuitNo.length == 0) {
            swal({
                text: 'กรุณาระบุข้อมูล "กรุณาเพิ่มของกลาง"',
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'ตกลง'
              })
              return;
        }
        
        if (this.EvidenceOutStorageStaff.length > 0) {
            if (!this.EvidenceOutStorageStaff.value[0].STAFF_ID) {
                swal({
                    text: 'กรุณาระบุข้อมูล "ผู้ขอโอนย้าย"',
                    type: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'ตกลง'
                  })
                //   this.boxIII.next(true);
                //   this.isReq_staff.next(true);
                  return;
            }

            if (!this.EvidenceOutStorageStaff.value[2].STAFF_ID) {
                swal({
                    text: 'กรุณาระบุข้อมูล "ผู้นำออก"',
                    type: 'warning',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'ตกลง'
                  })
                //   this.boxIII.next(true);
                //   this.isReq_staff.next(true);
                  return;
            }
        }
    }

    onDeleteItem(EVIDENCE_IN_ID: number) {
        this.EvidenceOutStockBalanceByLawsuitNo = this.EvidenceOutStockBalanceByLawsuitNo.filter(item => item.EVIDENCE_IN_ID !== EVIDENCE_IN_ID)
    }
    

    public searchStaff = (text2$: Observable<string>) =>
    text2$
      .debounceTime(200)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term =>
        this.evidenceOutStorageService.MasStaffgetByCon_Search({ TEXT_SEARCH: term })
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
        var _ContributorID
        if (i == 0){
            _ContributorID = 81
        }else if(i == 1){
            _ContributorID = 82
        }else if(i == 2){
            _ContributorID = 77
        }

        this.EvidenceOutStorageStaff.at(i).patchValue({
          IsNewItem: true,
          FULL_NAME: `${e.item.TITLE_SHORT_NAME_TH || ''}${e.item.FIRST_NAME || ''} ${e.item.LAST_NAME || ''}`,
          STAFF_ID: e.item.STAFF_ID,
          MANAGEMENT_POS_NAME: e.item.MANAGEMENT_POS_NAME,
          OPERATION_OFFICE_SHORT_NAME: e.item.OPERATION_OFFICE_SHORT_NAME,
          CONTRIBUTOR_ID: _ContributorID,
        })
    }

    onDeleteStaff(i: number) {
        let EvidenceOutStorageStaff = this.EvidenceOutStorageStaff.at(i).value;
        let mStaffId = EvidenceOutStorageStaff.STAFF_ID == "" ? null : EvidenceOutStorageStaff.STAFF_ID;
        
        this.clearStaffOfindex(i);
    }

    clearStaffOfindex(i) {
        this.EvidenceOutStorageStaff.at(i).patchValue({
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

    public setFormatTimeEvidenceOut(event: any) {
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
                this.TEMP_EVIDENCE_OUT_TIME = str_unSub.slice(0, str_unSub.length - 1);

            switch (true) {
                // NumPad 96-105
                case K >= 96 && K <= 105:
                    if (str.length == 2)
                        this.TEMP_EVIDENCE_OUT_TIME = `${mm}:${ss}`;
                    else if (str.length == 3)
                        this.TEMP_EVIDENCE_OUT_TIME = `${mm}:${str_unSub.substring(2)}`;
                    break;
                // KeyPad 96-105
                case (K >= 48 && K <= 57):
                    if (str.length == 2)
                        this.TEMP_EVIDENCE_OUT_TIME = `${mm}:${ss}`;
                    else if (str.length == 3)
                        this.TEMP_EVIDENCE_OUT_TIME = `${mm}:${str_unSub.substring(2)}`;
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
        if (!patt.test(this.TEMP_EVIDENCE_OUT_TIME)) {
            this.isReq_EvidenceOutTime.next(!patt.test(this.TEMP_EVIDENCE_OUT_TIME));
        }

    }

    public setFormatTimeEvidenceOutNoDate(event: any) {
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
                this.TEMP_EVIDENCE_OUT_NO_TIME = str_unSub.slice(0, str_unSub.length - 1);

            switch (true) {
                // NumPad 96-105
                case K >= 96 && K <= 105:
                    if (str.length == 2)
                        this.TEMP_EVIDENCE_OUT_NO_TIME = `${mm}:${ss}`;
                    else if (str.length == 3)
                        this.TEMP_EVIDENCE_OUT_NO_TIME = `${mm}:${str_unSub.substring(2)}`;
                    break;
                // KeyPad 96-105
                case (K >= 48 && K <= 57):
                    if (str.length == 2)
                        this.TEMP_EVIDENCE_OUT_NO_TIME = `${mm}:${ss}`;
                    else if (str.length == 3)
                        this.TEMP_EVIDENCE_OUT_NO_TIME = `${mm}:${str_unSub.substring(2)}`;
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
        if (!patt.test(this.TEMP_EVIDENCE_OUT_NO_TIME)) {
            this.isReq_EvidenceOutNoTime.next(!patt.test(this.TEMP_EVIDENCE_OUT_NO_TIME));
        }

    }

    public setFormatTimeApprove(event: any) {
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
                this.TEMP_APPROVE_TIME = str_unSub.slice(0, str_unSub.length - 1);

            switch (true) {
                // NumPad 96-105
                case K >= 96 && K <= 105:
                    if (str.length == 2)
                        this.TEMP_APPROVE_TIME = `${mm}:${ss}`;
                    else if (str.length == 3)
                        this.TEMP_APPROVE_TIME = `${mm}:${str_unSub.substring(2)}`;
                    break;
                // KeyPad 96-105
                case (K >= 48 && K <= 57):
                    if (str.length == 2)
                        this.TEMP_APPROVE_TIME = `${mm}:${ss}`;
                    else if (str.length == 3)
                        this.TEMP_APPROVE_TIME = `${mm}:${str_unSub.substring(2)}`;
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
        if (!patt.test(this.TEMP_APPROVE_TIME)) {
            this.isReq_ApproveTime.next(!patt.test(this.TEMP_APPROVE_TIME));
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

    private createEvidenceOutStorageForm() {
    
        this.evidenceOutStorageForm = this.fb.group({
    
            EvidenceOutStorageStaff: this.fb.array([this.createStaffForm(),this.createStaffForm(),this.createStaffForm()]),
        });
    }

    private createStaffForm(): FormGroup {


        EvidenceOutStorageStaffFormControl.STAFF_ID = new FormControl(""),
        EvidenceOutStorageStaffFormControl.IsNewItem = new FormControl(null),
        EvidenceOutStorageStaffFormControl.FULL_NAME = new FormControl("", Validators.required),
        EvidenceOutStorageStaffFormControl.MANAGEMENT_POS_NAME = new FormControl(""),
        EvidenceOutStorageStaffFormControl.OPERATION_OFFICE_SHORT_NAME = new FormControl(""),
        EvidenceOutStorageStaffFormControl.CONTRIBUTOR_ID = new FormControl(null)

        return this.fb.group(EvidenceOutStorageStaffFormControl)
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
        this.modal = this.ngbModel.open(e, { size: 'lg', centered: true , windowClass: 'modal-xl'});
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
        this.evidenceOutStorageService.downloadFile(item.DOCUMENT_ID)
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

    // **********************************
    // -------------- ITEM ----------
    // **********************************
    
    

    openModalItem(e) {
        this.modal = this.ngbModel.open(e, { size: 'lg', centered: true });
    }

    OutputItem(items: EvidenceOutStockBalanceByLawsuitNo[]) {
        //console.log('item select : ', items)
        this.EvidenceOutStockBalanceByLawsuitNo = []
        this.EvidenceOutStockBalanceByLawsuitNo = items
        console.log(this.EvidenceOutStockBalanceByLawsuitNo)
    }

    
    // **********************************
    // -------------- item ----------
    // **********************************

}
