
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import {
    PERSON_TYPE,
    ENTITY_TYPE,
    GENDER_TYPE,
    MARITAL_STATUS,
    VISA_TYPE,
    BLOOD_TYPE,
    EDUCATION_LEVEL,
    ADDRESS_TYPE,
    ADDRESS_STATUS,
    MasPersonEducation,
    MasPersonRelationship,
    MasPersonAddress,
    ArrestLawbreaker,
    IArrestDocument
} from "../../models";
import { ArrestHelper } from "../../arrest.helper";
import { Mode } from "../../entities/mode";
import { BehaviorSubject, Subject } from "rxjs";
import { Action, LocalStoreage as LS } from "../../entities";
import { Output, EventEmitter, Input } from "@angular/core";


export class Ilg60M01010200Config extends ArrestHelper {

    @Input() ModeEmit: string;
    @Input() PERSON_ID: number;

    @Output() d = new EventEmitter();
    @Output() c = new EventEmitter();
    @Output() Output = new EventEmitter<ArrestLawbreaker[]>();

    public ILG60_03_02_00_00_E28$ = new BehaviorSubject<IArrestDocument[]>([]);
    public _ILG60_03_02_00_00_E28$ = new BehaviorSubject<IArrestDocument[]>([]);
    public waitForDucument = false;

    public DELDOC_E28$ = new BehaviorSubject<any[]>([]);
    public DOCUMENT_TYPE$: any = '14';

    PERSON_TYPE = PERSON_TYPE;
    ENTITY_TYPE = ENTITY_TYPE;
    GENDER_TYPE = GENDER_TYPE;
    MARITAL_STATUS = MARITAL_STATUS;
    VISA_TYPE = VISA_TYPE;
    BLOOD_TYPE = BLOOD_TYPE;
    EDUCATION_LEVEL = EDUCATION_LEVEL;
    ADDRESS_TYPE = ADDRESS_TYPE;
    ADDRESS_STATUS = ADDRESS_STATUS;

    passportDateInOption = Object.assign({}, this.myDatePickerOptions);
    passPortDateOutOption = Object.assign({}, this.myDatePickerOptions);
    licenseDateFromOption = Object.assign({}, this.myDatePickerOptions);
    licenseDateToOption = Object.assign({}, this.myDatePickerOptions);
    disableForeign = false;
    disableCompany = false;
    requiredPassport = false;
    requiredCompanyRegister = false;

    modal: any;
    mode: string;
    ModeAction = Mode;
    public Action = Action;

    public btn_onPrint = new BehaviorSubject<Boolean>(false);
    public btn_onSave = new BehaviorSubject<Boolean>(false);
    public btn_onCancel = new BehaviorSubject<Boolean>(false);
    public btn_onDelete = new BehaviorSubject<Boolean>(false);
    public btn_onEdit = new BehaviorSubject<Boolean>(false);

    public REQ_TITLE_NAME = new BehaviorSubject<Boolean>(false);
    public REQ_FIRST_NAME = new BehaviorSubject<Boolean>(false);
    public REQ_COMPANY_NAME = new BehaviorSubject<Boolean>(false);
    public REQ_SUB_DISTRICT = new BehaviorSubject<Boolean>(false);
    public REQ_RE_TITLE_NAME = new BehaviorSubject<Boolean>(false);
    // public _REQ_RE_TITLE_NAME = new Subject<string>();

    RELATIONSHIP_TITLE_ID: any = null;
    RELATIONSHIP_TITLE_SHORT_NAME_TH: any = null;
    RELATIONSHIP_FIRST_NAME: string = null;
    RELATIONSHIP_LAST_NAME: string = null;

    TrashRelationship$: any[] = [];

    isEdit: boolean;
    card1 = true;
    card1_1 = true;
    card1_2 = true;
    card1_3 = true;
    RelationshipCard = false;
    card3 = false;
    card4 = false;
    entityType = true;

    public formGroup = new FormGroup({
        PERSON_ID: new FormControl(null),
        COUNTRY_ID: new FormControl(null),
        COUNTRY_NAME_TH: new FormControl(null),
        NATIONALITY_ID: new FormControl(null),
        NATIONALITY_NAME_TH: new FormControl(null),
        RACE_ID: new FormControl(null),
        RACE_NAME_TH: new FormControl(null),
        RELIGION_ID: new FormControl(null),
        RELIGION_NAME_TH: new FormControl(null),
        TITLE_ID: new FormControl(null, Validators.required),
        PERSON_TYPE: new FormControl(null, Validators.required),
        ENTITY_TYPE: new FormControl(null, Validators.required),
        TITLE_NAME_TH: new FormControl(null),
        TITLE_NAME_EN: new FormControl(null),
        TITLE_SHORT_NAME_TH: new FormControl(null),
        TITLE_SHORT_NAME_EN: new FormControl(null),
        FIRST_NAME: new FormControl(null, Validators.required),
        MIDDLE_NAME: new FormControl(null),
        LAST_NAME: new FormControl(null),
        OTHER_NAME: new FormControl(null),
        COMPANY_NAME: new FormControl(null),
        COMPANY_REGISTRATION_NO: new FormControl(null),
        COMPANY_FOUND_DATE: new FormControl(null),
        COMPANY_LICENSE_NO: new FormControl(null),
        COMPANY_LICENSE_DATE_FROM: new FormControl(null),
        COMPANY_LICENSE_DATE_TO: new FormControl(null),
        EXCISE_REGISTRATION_NO: new FormControl(null),
        GENDER_TYPE: new FormControl(null),
        ID_CARD: new FormControl(null),
        ID_CARD_2: new FormControl(null),
        BIRTH_DATE: new FormControl(null),
        BLOOD_TYPE: new FormControl(null),
        PASSPORT_NO: new FormControl(null),
        VISA_TYPE: new FormControl(null),
        PASSPORT_DATE_IN: new FormControl(null),
        PASSPORT_DATE_OUT: new FormControl(null),
        MARITAL_STATUS: new FormControl(null),
        CAREER: new FormControl(null),
        PERSON_DESC: new FormControl(null),
        EMAIL: new FormControl(null),
        TEL_NO: new FormControl(null),
        MISTREAT_NO: new FormControl(0),
        IS_ILLEGAL: new FormControl(null),
        IS_ACTIVE: new FormControl(null),
        ///=== Customs ===////
        TITLE: new FormControl(null),
        SUB_DISTRICT: new FormControl(null, Validators.required),
    })

    public MasPersonPhotoFg = new FormGroup({
        PHOTO_ID: new FormControl(null),
        PERSON_ID: new FormControl(null),
        PERSON_RELATIONSHIP_ID: new FormControl(null),
        PHOTO: new FormControl(null),
        TYPE: new FormControl(null),
        IS_ACTIVE: new FormControl(null),
    })

    public MasPersonFingerPrint = new FormGroup({
        FINGER_PRINT_ID: new FormControl(null),
        PERSON_ID: new FormControl(null),
        PERSON_RELATIONSHIP_ID: new FormControl(null),
        FINGER_PRINT: new FormControl(null),
        TYPE: new FormControl(null),
        IS_ACTIVE: new FormControl(null),
    })

    TrashMasPersonEducation = (JSON.parse(localStorage.getItem(LS.TrashMasPersonEducation)) || []) as MasPersonEducation[];
    TrashMasPersonRelationship = (JSON.parse(localStorage.getItem(LS.TrashMasPersonRelationship)) || []) as MasPersonRelationship[];
    TrashMasPersonAddress = (JSON.parse(localStorage.getItem(LS.TrashMasPersonAddress)) || []) as MasPersonAddress[];
    TrashMasPersonPhoto = (JSON.parse(localStorage.getItem(LS.TrashMasPersonPhoto)) || []) as MasPersonAddress[];
    TrashMasPersonFingerPrint = (JSON.parse(localStorage.getItem(LS.TrashMasPersonFingerPrint)) || []) as MasPersonAddress[];

    get MAS_PERSON_EDUCATION(): FormArray {
        return this.formGroup.get('MAS_PERSON_EDUCATION') as FormArray;
    }

    get MAS_PERSON_RELATIONSHIP(): FormArray {
        return this.formGroup.get('MAS_PERSON_RELATIONSHIP') as FormArray;
    }

    get MAS_PERSON_ADDRESS(): FormArray {
        return this.formGroup.get('MAS_PERSON_ADDRESS') as FormArray;
    }

}