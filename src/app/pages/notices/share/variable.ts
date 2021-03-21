import { BehaviorSubject } from "rxjs";
import { ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { MasDutyUnitModel } from "app/models/mas-duty-unit.model";
import {
    communicate,
    RegionModel_New,
    MasDistrictModel,
    MasProvinceModel,
    MasSubdistrictModel,
    CommunicationChanelModel,
    LawbreakerTypes,
    EntityTypes,
    MasStaffModel_New,
    EntityTypes_NEW,
    LawbreakerTypes_New,
    MasProductModel,
    MasOfficeModel_New
} from '../../../models';
import { FormGroup } from "@angular/forms";
import { SwalComponent } from "@toverux/ngx-sweetalert2";
import { notice_list } from '../notice';
import { pagination } from '../../../config/pagination';
import { IMyOptions } from "mydatepicker";

export class variable {

    @ViewChild('printDocModal') public printDocModel: ElementRef;
    @ViewChild('productsModel') public productsModel: ElementRef;
    @ViewChild('alertSwal') public alertSwal: SwalComponent;
    @ViewChild('deleteNotice') public deleteNotice: SwalComponent;
    @ViewChild('deleteProduct') public deleteProduct: SwalComponent;
    @ViewChild('deleteSuspect') public deleteSuspect: SwalComponent;
    @ViewChild('deleteDocument') public deleteDocument: SwalComponent;
    @ViewChild('cancelEdit') public cancelEdit: SwalComponent;

    paginage = pagination;

    _noticeDate: any;
    _noticeDueDate: any;

    DisconID: boolean = true;

    public seq1: number = 1;
    public seq2: number = 2;
    public seq3: number = 3;

    selectUnit: boolean = false;
    actionFrom: string;
    months: any[];
    programSpect: string = 'ILG60-02-02-00-00';
    mode: string;
    showEditField: Boolean;
    localEditField: Boolean;
    modal: any;
    noticeCode: string;
    Auto_Generate: string = "Auto Generate";
    arrestCode: string;
    noticeForm: FormGroup;
    searching = false;
    searchFailed = false;
    isConceal = false;
    isRequired: boolean;

    //Step wizard
    INPUT_WIZARD = new BehaviorSubject<object>(null);

    //set btn
    printButton = new BehaviorSubject<Boolean>(false);
    editButton = new BehaviorSubject<Boolean>(false);
    deleteButton = new BehaviorSubject<Boolean>(false);
    cancelButton = new BehaviorSubject<Boolean>(false);
    saveButton = new BehaviorSubject<Boolean>(false);

    //toggleCollapse
    MasNotice = new BehaviorSubject<Boolean>(true);
    NoticeInfo = new BehaviorSubject<Boolean>(false);
    NoticeStf = new BehaviorSubject<Boolean>(false);
    NoticeLoc = new BehaviorSubject<Boolean>(false);
    NoticeProd = new BehaviorSubject<Boolean>(false);
    NoticeSusp = new BehaviorSubject<Boolean>(false);
    NoticeDoc = new BehaviorSubject<Boolean>(false);

    //MasNotice 
    isReq_NoticeDate = new BehaviorSubject<boolean>(false);
    isReq_OffName = new BehaviorSubject<boolean>(false);
    isReq_NoticeDue = new BehaviorSubject<boolean>(false);

    // NoticeInformer 
    isReq_subDisID = new BehaviorSubject<boolean>(false);
    isReq_informerInfo = new BehaviorSubject<boolean>(false);
    isReq_fristName = new BehaviorSubject<boolean>(false);

    // NoticeStf
    isReq_Staff0 = new BehaviorSubject<boolean>(false);
    isReq_Staff1 = new BehaviorSubject<boolean>(false);

    // NoticeLoc
    isReq_Local = new BehaviorSubject<boolean>(false);
    isReq_Local_Name = new BehaviorSubject<boolean>(false);

    //NoticeProd
    isReq_Prod = new BehaviorSubject<boolean>(false);
    //SEARCH_SORTING
    LS_SORTING = new BehaviorSubject<Boolean>(true);
    TIME_SORTING = new BehaviorSubject<Boolean>(true);

    //LIST
    notice = new Array<notice_list>();
    noticeList = new Array<notice_list>();

    //PRODUCT
    productId: any = "";
    productIndex: any = "";
    productDel: any[] = [];

    //SUSPECT
    suspectId: any = "";
    suspectIndex: any = "";

    //DOCUMENT
    documentId: any = "";
    documentIndex: any = "";

    /** NEW */
    NOTICE_CODE: string = '';
    NOTICE_ID: string = '';
    IS_AUTHORITY: number = null;

    //OnDelete
    DelSuspect: any[] = [];
    DelStaff: any[] = [];
    DelDoc: any[] = [];

    //Messenge alert
    public msgTransectionFailed: string = 'TransactionRunningins Failed';

    //for gen LS
    public LOCALE_OFFICE_CODE: string = '';

    public officeCode = localStorage.getItem("officeCode");
    public officeId = localStorage.getItem("officeId") || '1';

    public ProductGroup = new Array<any>();

    COMMUNICATION_CHANNEL = [
        { value: 0, label: 'โทรศัพท์' },
        { value: 1, label: 'อีเมล์' },
        { value: 2, label: 'จดหมาย' },
        { value: 3, label: 'โทรสาร' },
        { value: 4, label: 'ช่องทางอื่นๆ' },
    ];

    CONTRIBUTOR = [
        { value: 0, text: 'ผู้รับเเจ้งความ' },
        { value: 1, text: 'ผู้มีอำนาจรับเเจ้งความ' },
        { value: 2, text: 'ผู้รับรอง' }
    ]

    myDatePickerOptions: IMyOptions = {
        dateFormat: 'dd mmm yyyy',
        showClearDateBtn: false,
        height: '30px',
        alignSelectorRight: true,
        openSelectorOnInputClick: true,
        editableDateField: false,
        disableUntil: { year: 0, month: 0, day: 0 }
    };

    communicateModel = communicate;
    suspectTypes = LawbreakerTypes;
    entityTypes = EntityTypes;
    _EntityTypes_NEW = EntityTypes_NEW;
    _LawbreakerTypes_New = LawbreakerTypes_New;

    subdistrict = new Array<MasSubdistrictModel>();
    district = new Array<MasDistrictModel>();
    province = new Array<MasProvinceModel>();
    typeheadRegion = new Array<RegionModel_New>();
    typeheadProduct = new Array<MasProductModel>();
    typeheadOffice = new Array<MasOfficeModel_New>();
    typeheadStaff = new Array<MasStaffModel_New>();
    typeheadProductUnit = new Array<MasDutyUnitModel>();
    typeheadcommunicateModel = new Array<CommunicationChanelModel>();

    ///Notice Suspect
    @ViewChild('CreateSuspectModal') public CreateSuspectModal: ElementRef;
    @ViewChild('ViewLawbreakerModal') public ViewLawbreakerModal: ElementRef;

    @Output() ModeEmit: string = '';
    @Output() d = new EventEmitter();
    @Output() c = new EventEmitter();
    @Output() PERSON_ID: number;

}