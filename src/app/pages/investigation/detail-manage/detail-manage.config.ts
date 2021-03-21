import { InvestigationHelper } from "../investigation.helper";
import { SwalComponent } from "@toverux/ngx-sweetalert2";
import { ViewChild, ElementRef } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import * as fromModels from '../models';
import { FormGroup, FormArray } from "@angular/forms";
import * as fromGobalModels from 'app/models';
import { MyDatePickerOptions, setDateMyDatepicker } from 'app/config/dateFormat';
import { EntityTypes_NEW, LawbreakerTypes_New, communicate, LawbreakerTypes, EntityTypes } from '../../../models';
import { Document } from '../investigation-document';
import { IMyOptions } from "mydatepicker-th";

export class detailManageConfig extends InvestigationHelper {

    @ViewChild('alertSwal') public alertSwal: SwalComponent;
    @ViewChild('deleteStaff') public deleteStaff: SwalComponent;
    @ViewChild('deleteLocale') public deleteLocale: SwalComponent;
    @ViewChild('deleteProduct') public deleteProduct: SwalComponent;
    @ViewChild('deleteSuspect') public deleteSuspect: SwalComponent;
    @ViewChild('deleteDocument') public deleteDocument: SwalComponent;

    public saveButton = new BehaviorSubject<Boolean>(false);
    public cancelButton = new BehaviorSubject<Boolean>(false);
    public deleteButton = new BehaviorSubject<Boolean>(false);
    public printButton = new BehaviorSubject<Boolean>(false);
    public editButton = new BehaviorSubject<Boolean>(false);
    public isReq_DStart = new BehaviorSubject<boolean>(false);
    public isReq_DEnd = new BehaviorSubject<boolean>(false);
    public isReq_Value = new BehaviorSubject<boolean>(false);
    public isReq_Confidence = new BehaviorSubject<boolean>(false);
    public isReq_Detail = new BehaviorSubject<boolean>(false);
    public isReq_Staff0 = new BehaviorSubject<boolean>(false);
    public isReq_Staff1 = new BehaviorSubject<boolean>(false);
    public isReq_SubDis = new BehaviorSubject<boolean>(false);
    public isReq_ProdGroup = new BehaviorSubject<boolean>(false);
    public isEdit = false;

    public destroy$: Subject<boolean> = new Subject<boolean>();

    stateInvest: fromModels.InvestigateModelUppercase;
    uploadForm: FormGroup;
    modal: any;
    _dateStartFrom: any;
    _dateStartTo: any;

    card1 = new BehaviorSubject<Boolean>(true);
    card2 = new BehaviorSubject<Boolean>(false);
    card3 = new BehaviorSubject<Boolean>(false);
    card4 = new BehaviorSubject<Boolean>(false);
    card5 = new BehaviorSubject<Boolean>(false);
    card6 = new BehaviorSubject<Boolean>(false);
    card7 = new BehaviorSubject<Boolean>(false);

    isRequired: boolean = false;
    _isSuccess: boolean;
    public mode: string;
    invesDetailId: string = '';
    public investMode: string;
    investCode: string;
    investigateSeq: string;
    investId: number;

    showEditField: boolean;
    investigateFG: FormGroup;

    SysdateStrat = setDateMyDatepicker(new Date());
    SysdateEnd = setDateMyDatepicker(new Date());
    readonly lawbreakerType = fromGobalModels.LawbreakerTypes;
    readonly entityType = fromGobalModels.EntityTypes;
    readonly contributorInvestType = fromGobalModels.ContributorInvestType;
    readonly valueofNews = fromGobalModels.ValueofNews;
    readonly costofNews = fromGobalModels.CostofNews;
    readonly runningTable = 'OPS_INVESTIGATE';
    readonly runningOfficeId = localStorage.getItem("officeId") || '1';
    readonly runningOfficeCode = localStorage.getItem("officeCode");
    readonly runningPrefix = 'AI';
    readonly officeName = localStorage.getItem('officeShortName');
    readonly documentType = '3';
    // readonly myDatePickerOptions = MyDatePickerOptions;
    readonly _myDatePickerOptions: IMyOptions = {
        dateFormat: 'dd mmm yyyy',
        showClearDateBtn: false,
        height: '30px',
        alignSelectorRight: true,
        openSelectorOnInputClick: true,
        editableDateField: false,
        disableUntil: { year: 0, month: 0, day: 0 }
    };
    public dateFromOption = Object.assign({}, this._myDatePickerOptions);
    public dateToOption = Object.assign({}, this._myDatePickerOptions);

    public investNo;
    public investYear;
    public investSubject;

    dateTimeStart;
    dateTimeEnd;

    public searching: boolean;
    public searchFailed: boolean;

    @ViewChild('printDocModal') printDocModal: ElementRef;
    @ViewChild('productsModal') productsModal: ElementRef;

    typeheadOffice = new Array<fromGobalModels.MasOfficeModel>();
    typeheadStaff = new Array<fromGobalModels.MasStaffModel>();
    typeheadRegion = new Array<fromGobalModels.RegionModel>();
    typeheadProduct = new Array<fromGobalModels.MasProductModel>();
    typeheadQtyUnit = new Array<fromGobalModels.MasDutyProductUnitModel>();
    typeheadNetVolumeUnit = new Array<fromGobalModels.MasDutyProductUnitModel>();

    public ProductGroup = new Array<any>();
    public productDel: any[] = [];

    get InvestigateDetail(): FormArray {
        return this.investigateFG.get('InvestigateDetail') as FormArray;
    }

    get InvestigateDetailStaff(): FormArray {
        return this.investigateFG.get('InvestigateDetailStaff') as FormArray;
    }

    get InvestigateDetailSuspect(): FormArray {
        return this.investigateFG.get('InvestigateDetailSuspect') as FormArray;
    }

    get InvestigateDetailLocal(): FormArray {
        return this.investigateFG.get('InvestigateDetailLocal') as FormArray;
    }

    get InvestigateDetailProduct(): FormArray {
        return this.investigateFG.get('InvestigateDetailProduct') as FormArray;
    }

    get InvestigateDocument(): FormArray {
        return this.investigateFG.get('InvestigateDocument') as FormArray;
    }

    communicateModel = communicate;
    suspectTypes = LawbreakerTypes;
    entityTypes = EntityTypes;
    _EntityTypes_NEW = EntityTypes_NEW;
    _LawbreakerTypes_New = LawbreakerTypes_New;
    fileList: Document[] = []
    owlOption = {
        items: 5,
        nav: true,
        dots: false,
        slideBy: 5,
        margin: 10,
        responsiveClass: true
    }
}