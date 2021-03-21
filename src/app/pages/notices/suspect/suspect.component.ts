import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from '../../../shared/header-navigation/navigation.service';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import { DropDown, VISATypes, BloodTypes, EntityTypes, GenderTypes, GenderTypes_ph2, LawbreakerTypes, LawbreakerTypes_New, RegionModel, MaritalStatus_ph2 } from '../../../models';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Suspect } from './suspect.interface';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import { NoticeService } from '../notice.service';
// import { getDateMyDatepicker, setDateMyDatepicker, MyDatePickerOptions, convertDateForSave } from 'app/config/dateFormat';
import {
    toLocalShort, setZero,
    compareDate,
    toLocalNumeric,
    setZeroHours,
    getDateMyDatepicker,
    setDateMyDatepicker,
    MyDatePickerOptions,
    convertDateForSave
} from '../../../config/dateFormat';
import { Message } from 'app/config/message';
import { ImageType } from 'app/config/imageType';
import { MainMasterService } from '../../../services/main-master.service';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {
    EducationFormcontrol,
    PersonEducation,
    EDUCATION_LEVEL,
    personRelationship,
    PersonAddressFormcontrol,
    ADDRESS_TYPE,
    ADDRESS_STATUS,
    RegionModel_intf,
    MasCountry,
    BLOOD_TYPE
} from './suspect.interface';
import swal from 'sweetalert2';
import { locale, locales } from 'moment';
import { SidebarService } from '../../../shared/sidebar/sidebar.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Document, ImageDocument, FileType, updDelete } from '../notice-document';
import { NoticeSuspect } from '../notice-suspect';


@Component({
    selector: 'app-suspect',
    templateUrl: './suspect.component.html',
    styleUrls: ['./suspect.component.scss']
})
export class SuspectComponent implements OnInit {
    @ViewChild('alertSwal') private alertSwal: SwalComponent;
    @Input() ModeEmit: string = '';
    @Output() d = new EventEmitter();
    @Output() c = new EventEmitter();
    @Input() PERSON_ID: string;

    months: any[];

    emailValid: boolean = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private preloader: PreloaderService,
        private navService: NavigationService,
        private noticeService: NoticeService,
        private mainMasterService: MainMasterService,
        private fb: FormBuilder,
        private router: Router,
        private sidebarService: SidebarService,
        private suspectModalService: NgbModal
    ) { }

    @ViewChild('imgNobody') imgNobody: ElementRef;
    @Output() exportSuspectData = new EventEmitter<NoticeSuspect[]>();

    get MAS_PERSON_EDUCATION(): FormArray {
        return this.SuspectFG.get('MAS_PERSON_EDUCATION') as FormArray;
    }
    get MAS_PERSON_RELATIONSHIP(): FormArray {
        return this.SuspectFG.get('MAS_PERSON_RELATIONSHIP') as FormArray;
    }
    get MAS_PERSON_ADDRESS(): FormArray {
        return this.SuspectFG.get('MAS_PERSON_ADDRESS') as FormArray;
    }
    get MAS_PERSON_PHOTO(): FormArray {
        return this.SuspectFG.get('MAS_PERSON_PHOTO') as FormArray;
    }
    get MAS_PERSON_FINGER_PRINT(): FormArray {
        return this.SuspectFG.get('MAS_PERSON_FINGER_PRINT') as FormArray;
    }
    /** ###### btn ###### */
    editButton = new BehaviorSubject<Boolean>(false);
    deleteButton = new BehaviorSubject<Boolean>(false);
    cancelButton = new BehaviorSubject<Boolean>(false);
    saveButton = new BehaviorSubject<Boolean>(false);

    SuspectItem: Suspect;
    SuspectFG: FormGroup;

    private subActivedRoute: any;
    private onSaveSubscribe: any;
    private onCancelSubscribe: any;
    private mode: any;
    // PERSON_ID: any;

    type_Foreigner: boolean = true;
    type_Entrepreneur: boolean = true;
    _EntityTypes: DropDown[] = EntityTypes;
    characteristics: any = ""//this._EntityTypes[0].text;
    EDUCATION_LEVEL = EDUCATION_LEVEL;
    ADDRESS_STATUS = ADDRESS_STATUS;
    ADDRESS_TYPE = ADDRESS_TYPE;
    // _Region: any;

    public myDatePickerOptions = MyDatePickerOptions;
    public getDateMyDatepicker = getDateMyDatepicker;
    public toLocalShort = toLocalShort;

    modal: any;
    showEditField: any;
    isRequired: boolean | false;
    visaTypes: DropDown[] = VISATypes;
    bloodTypes: any[] = BLOOD_TYPE;
    entityTypes: DropDown[] = EntityTypes;
    genderTypes = GenderTypes_ph2;
    suspectTypes: any[] = LawbreakerTypes_New;
    materialStatus = MaritalStatus_ph2;
    titleNames: any[];
    nationnalitys: any[];
    races: any[];
    religions: any[];
    countries: MasCountry[] = [];
    RelationshipType: any[];
    suspectId: any;

    typeheadRegion: RegionModel_intf[] = []

    async ngOnInit() {
        this.sidebarService.setVersion('Create Suspect 0.2.0.1');
        localStorage.setItem('IsNewSuspect', "false")
        this.preloader.setShowPreloader(true);
        this.months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        this.myDatePickerOptions.showClearDateBtn = true;

        await this.createForm();

        await this.getCountry();//////////
        await this.setRegionStore();//////////
        await this.getTitleNames();///////////
        await this.getNationality();//////////
        await this.getRace();////////
        await this.getReligion();/////////
        await this.getRelationshipType(); //////////
        this.active_route();
        // this.navigate_service();
        console.log('ngOnInit this.SuspectFG : ', this.SuspectFG)
        this.preloader.setShowPreloader(false);
    }

    private createForm(): void {
        this.SuspectFG = new FormGroup({
            PERSON_ID: new FormControl(""),
            COUNTRY_ID: new FormControl(""),
            NATIONALITY_ID: new FormControl(""),
            RACE_ID: new FormControl(""),
            RELIGION_ID: new FormControl(""),
            TITLE_ID: new FormControl(""),
            PERSON_TYPE: new FormControl(""),
            ENTITY_TYPE: new FormControl("", Validators.required),
            TITLE_NAME_TH: new FormControl("", Validators.required),
            TITLE_NAME_EN: new FormControl(""),
            TITLE_SHORT_NAME_TH: new FormControl(""),
            TITLE_SHORT_NAME_EN: new FormControl(""),
            FIRST_NAME: new FormControl("", Validators.required),
            MIDDLE_NAME: new FormControl(""),
            LAST_NAME: new FormControl(""),
            OTHER_NAME: new FormControl(""),
            COMPANY_NAME: new FormControl(""),
            COMPANY_REGISTRATION_NO: new FormControl(""),
            COMPANY_FOUND_DATE: new FormControl(""),
            COMPANY_LICENSE_NO: new FormControl(""),
            COMPANY_LICENSE_DATE_FROM: new FormControl(""),
            COMPANY_LICENSE_DATE_TO: new FormControl(""),
            EXCISE_REGISTRATION_NO: new FormControl(""),
            GENDER_TYPE: new FormControl(""),
            ID_CARD: new FormControl("", [Validators.required, Validators.maxLength(13), Validators.minLength(13)]),
            BIRTH_DATE: new FormControl(""),
            BLOOD_TYPE: new FormControl(""),
            PASSPORT_NO: new FormControl(""),
            VISA_TYPE: new FormControl(""),
            PASSPORT_DATE_IN: new FormControl(""),
            PASSPORT_DATE_OUT: new FormControl(""),
            MARITAL_STATUS: new FormControl(""),
            CAREER: new FormControl(""),
            PERSON_DESC: new FormControl(""),
            EMAIL: new FormControl(""),
            TEL_NO: new FormControl(""),
            MISTREAT_NO: new FormControl(""),
            IS_ILLEGAL: new FormControl(""),
            IS_ACTIVE: new FormControl(1),
            //######CUSTOMS#####
            Region: new FormControl(""),
            Countries: new FormControl(""),

            MAS_PERSON_ADDRESS: this.fb.array([this.createPersonAddressFormcontrol()]),
            MAS_PERSON_EDUCATION: this.fb.array([]),
            MAS_PERSON_RELATIONSHIP: this.fb.array([]),
            MAS_PERSON_PHOTO: this.fb.array([]),
            MAS_PERSON_FINGER_PRINT: this.fb.array([])
            // SuspectID: new FormControl(null),
            // EntityType: new FormControl(this.entityTypes[1].value, Validators.required),
        });
    }
    private createEducationFormcontrol(): FormGroup {
        EducationFormcontrol.EDUCATION_FINISH_DATE = new FormControl(""),
            EducationFormcontrol.EDUCATION_INSTITUTION = new FormControl(""),
            EducationFormcontrol.EDUCATION_LEVEL = new FormControl(""),
            EducationFormcontrol.EDUCATION_START_DATE = new FormControl(""),
            EducationFormcontrol.GPA = new FormControl(""),
            EducationFormcontrol.PERSON_EDUCATION_ID = new FormControl(""),
            EducationFormcontrol.PERSON_ID = new FormControl(""),
            EducationFormcontrol.IS_ACTIVE = new FormControl(1)
        // 
        return this.fb.group(EducationFormcontrol)
    }

    private createPersonAddressFormcontrol(): FormGroup {
        PersonAddressFormcontrol.PERSON_ADDRESS_ID = new FormControl(""),
            PersonAddressFormcontrol.PERSON_ID = new FormControl(this.PERSON_ID),
            PersonAddressFormcontrol.SUB_DISTRICT_ID = new FormControl(""),
            PersonAddressFormcontrol.GPS = new FormControl(""),
            PersonAddressFormcontrol.ADDRESS_NO = new FormControl(""),
            PersonAddressFormcontrol.VILLAGE_NO = new FormControl(""),
            PersonAddressFormcontrol.BUILDING_NAME = new FormControl(""),
            PersonAddressFormcontrol.ROOM_NO = new FormControl(""),
            PersonAddressFormcontrol.FLOOR = new FormControl(""),
            PersonAddressFormcontrol.VILLAGE_NAME = new FormControl(""),
            PersonAddressFormcontrol.ALLEY = new FormControl(""),
            PersonAddressFormcontrol.LANE = new FormControl(""),
            PersonAddressFormcontrol.ROAD = new FormControl(""),
            PersonAddressFormcontrol.ADDRESS_TYPE = new FormControl(""),
            PersonAddressFormcontrol.ADDRESS_DESC = new FormControl(""),
            PersonAddressFormcontrol.ADDRESS_STATUS = new FormControl(""),
            PersonAddressFormcontrol.IS_ACTIVE = new FormControl(1),

            //######CUSTOM########
            PersonAddressFormcontrol.Region = new FormControl("")

        return this.fb.group(PersonAddressFormcontrol);
    }


    addPersonEducation() {
        let education = new PersonEducation();
        education.IsNewItem = true;
        education.PERSON_ID = this.PERSON_ID;
        this.MAS_PERSON_EDUCATION.push(this.fb.group(education));
    }
    onDeleteEducation(i, params) {
        if (this.mode === 'C') {
            this.MAS_PERSON_EDUCATION.removeAt(i);
        } else if (this.mode === 'R') {
            const newItem = this.MAS_PERSON_EDUCATION.value[i].IsNewItem
            if (newItem) {
                this.MAS_PERSON_EDUCATION.removeAt(i);
            } else {
                swal({
                    title: '',
                    text: Message.confirmAction,
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Confirm!'
                }).then((result) => {
                    if (result.value) {
                        this.noticeService.MasPersonEducationupdDelete(params).then(isSuccess => {
                            let IsSuccess: boolean = isSuccess[0].SUCCESS;
                            if (IsSuccess === true) {
                                this.MAS_PERSON_EDUCATION.removeAt(i);
                                this.showSwal(Message.delComplete, "success");
                            } else if (IsSuccess === false) {
                                this.showSwal(Message.delFail, "error");
                            }
                        })
                    }
                })
            }
        }
    }

    addPersonRelationship() {
        let relationship = new personRelationship();
        relationship.IsNewItem = true;
        relationship.PERSON_ID = this.PERSON_ID;
        this.MAS_PERSON_RELATIONSHIP.push(this.fb.group(relationship));
    }

    async onDeleteRelationship(i, params) {

        if (this.mode === 'C') {
            this.MAS_PERSON_RELATIONSHIP.removeAt(i);
        } else if (this.mode === 'R') {
            const newItem = this.MAS_PERSON_RELATIONSHIP.value[i].IsNewItem
            if (newItem) {
                this.MAS_PERSON_RELATIONSHIP.removeAt(i);
            } else {
                swal({
                    title: '',
                    text: Message.confirmAction,
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Confirm!'
                }).then((result) => {
                    if (result.value) {
                        this.noticeService.MasPersonRelationshipupdDelete(params).then(isSuccess => {
                            let IsSuccess: boolean = isSuccess[0].SUCCESS;
                            if (IsSuccess === true) {
                                this.MAS_PERSON_RELATIONSHIP.removeAt(i);
                                this.showSwal(Message.delComplete, "success");
                            } else if (IsSuccess === false) {
                                this.showSwal(Message.delFail, "error");
                            }
                        })
                    }
                })
            }
        }
    }

    // ngOnDestroy(): void {
    //     this.onCancelSubscribe.unsubscribe();
    //     this.subActivedRoute.unsubscribe();
    //     this.onSaveSubscribe.unsubscribe();
    // }

    onChangeSuspectType(ev: any) {
        let suspect_type = ev.target.value
        if (suspect_type == 0) {
            this.type_Foreigner = false;
            this.type_Entrepreneur = true;
            this.characteristics = this._EntityTypes[0].text
            this.SuspectFG.patchValue({
                PERSON_TYPE: 1,
                ENTITY_TYPE: 0
            })
        } else if (suspect_type == 1) {
            this.type_Foreigner = true;
            this.type_Entrepreneur = true;
            this.characteristics = this._EntityTypes[0].text
            this.SuspectFG.patchValue({
                PERSON_TYPE: 0,
                ENTITY_TYPE: 0
            })
        } else if (suspect_type == 2) {
            this.type_Foreigner = true;
            this.type_Entrepreneur = false;
            this.characteristics = this._EntityTypes[1].text
            this.SuspectFG.patchValue({
                PERSON_TYPE: 2,
                ENTITY_TYPE: 1
            })
        }
    }

    private active_route() {
        // this.subActivedRoute = this.activatedRoute.params.subscribe(p => {
        // this.mode = p['mode']
        // p['code'] = this.PERSON_ID
        this.mode = this.ModeEmit;
        if (this.mode === 'C') {
            // set false
            this.editButton.next(false);
            this.deleteButton.next(false);
            this.showEditField = false;
            // this.navService.setEditButton(false);
            // this.navService.setEditField(false);
            // this.navService.setNextPageButton(false);
            // set true
            this.saveButton.next(true);
            this.cancelButton.next(true);
            // this.navService.setSaveButton(true);
            // this.navService.setCancelButton(true);

        } else if (this.mode === 'R') {
            // set false
            this.saveButton.next(false);
            this.cancelButton.next(false);
            // this.navService.setSaveButton(false);
            // this.navService.setCancelButton(false);
            // set true
            this.showEditField = true;
            this.editButton.next(true);
            this.deleteButton.next(true);
            // this.navService.setNextPageButton(false);
            // this.navService.setEditButton(true);
            // this.navService.setEditField(true);
            // this.navService.setDeleteButton(false);

            if (this.PERSON_ID) {
                // this.PERSON_ID = p["code"];
                this.GetByCon(this.PERSON_ID);
            }
        }
        // });
    }
    onclickSave() {
        if (!this.SuspectFG.valid) {
            this.isRequired = true;
            this.showSwal(Message.checkData, "warning");
            return false;
        }

        let email = this.SuspectFG.get("EMAIL").value;
        if (email && !this.validateEmail(email)) {
            this.emailValid = true;
            this.showSwal(Message.checkData, "warning");
            return false;
        }
        this.emailValid = false;

        let subDistId = this.MAS_PERSON_ADDRESS.value[0].SUB_DISTRICT_ID;
        subDistId = subDistId == undefined ? '' : subDistId;
        subDistId = subDistId == null ? '' : subDistId;
        subDistId = subDistId == 0 ? '' : subDistId;
        if (subDistId == '') {
            this.isRequired = true;
            this.showSwal(Message.checkData, "warning");
            return false;
        }

        switch (this.mode) {
            case 'C':

                let _BIRTH_DATE = this.SuspectFG.value.BIRTH_DATE != null || "" ? this.SuspectFG.value.BIRTH_DATE : "";
                let _COMPANY_FOUND_DATE = this.SuspectFG.value.COMPANY_FOUND_DATE != null || "" ? this.SuspectFG.value.COMPANY_FOUND_DATE : "";
                let _COMPANY_LICENSE_DATE_FROM = this.SuspectFG.value.COMPANY_LICENSE_DATE_FROM != null || "" ? this.SuspectFG.value.COMPANY_LICENSE_DATE_FROM : "";
                let _COMPANY_LICENSE_DATE_TO = this.SuspectFG.value.COMPANY_LICENSE_DATE_TO != null || "" ? this.SuspectFG.value.COMPANY_LICENSE_DATE_TO : "";
                let _PASSPORT_DATE_IN = this.SuspectFG.value.PASSPORT_DATE_IN != null || "" ? this.SuspectFG.value.PASSPORT_DATE_IN : "";
                let _PASSPORT_DATE_OUT = this.SuspectFG.value.PASSPORT_DATE_OUT != null || "" ? this.SuspectFG.value.PASSPORT_DATE_OUT : "";
                _BIRTH_DATE = convertDateForSave(getDateMyDatepicker(this.SuspectFG.value.BIRTH_DATE));
                _COMPANY_FOUND_DATE = convertDateForSave(getDateMyDatepicker(this.SuspectFG.value.COMPANY_FOUND_DATE));
                _COMPANY_LICENSE_DATE_FROM = convertDateForSave(getDateMyDatepicker(this.SuspectFG.value.COMPANY_LICENSE_DATE_FROM));
                _COMPANY_LICENSE_DATE_TO = convertDateForSave(getDateMyDatepicker(this.SuspectFG.value.COMPANY_LICENSE_DATE_TO));
                _PASSPORT_DATE_IN = convertDateForSave(getDateMyDatepicker(this.SuspectFG.value.PASSPORT_DATE_IN));
                _PASSPORT_DATE_OUT = convertDateForSave(getDateMyDatepicker(this.SuspectFG.value.PASSPORT_DATE_OUT));

                _BIRTH_DATE = _BIRTH_DATE != null || "" ? _BIRTH_DATE.slice(0, 10) : "";
                _COMPANY_FOUND_DATE = _COMPANY_FOUND_DATE != null || "" ? _COMPANY_FOUND_DATE.slice(0, 10) : "";
                _COMPANY_LICENSE_DATE_FROM = _COMPANY_LICENSE_DATE_FROM != null || "" ? _COMPANY_LICENSE_DATE_FROM.slice(0, 10) : "";
                _COMPANY_LICENSE_DATE_TO = _COMPANY_LICENSE_DATE_TO != null || "" ? _COMPANY_LICENSE_DATE_TO.slice(0, 10) : "";
                _PASSPORT_DATE_IN = _PASSPORT_DATE_IN != null || "" ? _PASSPORT_DATE_IN.slice(0, 10) : "";
                _PASSPORT_DATE_OUT = _PASSPORT_DATE_OUT != null || "" ? _PASSPORT_DATE_OUT.slice(0, 10) : "";

                this.SuspectFG.patchValue({
                    BIRTH_DATE: _BIRTH_DATE,
                    COMPANY_FOUND_DATE: _COMPANY_FOUND_DATE,
                    COMPANY_LICENSE_DATE_FROM: _COMPANY_LICENSE_DATE_FROM,
                    COMPANY_LICENSE_DATE_TO: _COMPANY_LICENSE_DATE_TO,
                    PASSPORT_DATE_IN: _PASSPORT_DATE_IN,
                    PASSPORT_DATE_OUT: _PASSPORT_DATE_OUT,
                })
                if (this.MAS_PERSON_EDUCATION.length) {
                    this.MAS_PERSON_EDUCATION.value.map(m => {
                        let _EDUCATION_START_DATE = m.EDUCATION_START_DATE != null || "" ? m.EDUCATION_START_DATE : "";
                        _EDUCATION_START_DATE = convertDateForSave(getDateMyDatepicker(_EDUCATION_START_DATE));
                        _EDUCATION_START_DATE = _EDUCATION_START_DATE != null || "" ? _EDUCATION_START_DATE.slice(0, 10) : "";
                        m.EDUCATION_START_DATE = _EDUCATION_START_DATE;


                        let _EDUCATION_FINISH_DATE = m.EDUCATION_FINISH_DATE != null || "" ? m.EDUCATION_FINISH_DATE : "";
                        _EDUCATION_FINISH_DATE = convertDateForSave(getDateMyDatepicker(_EDUCATION_FINISH_DATE));
                        _EDUCATION_FINISH_DATE = _EDUCATION_FINISH_DATE != null || "" ? _EDUCATION_FINISH_DATE.slice(0, 10) : "";
                        m.EDUCATION_FINISH_DATE = _EDUCATION_FINISH_DATE;
                    })
                }
                if (this.MAS_PERSON_RELATIONSHIP.length) {
                    this.MAS_PERSON_RELATIONSHIP.value.map(m => {
                        let _BIRTH_DATE = m.BIRTH_DATE != null || "" ? m.BIRTH_DATE : ""
                        _BIRTH_DATE = convertDateForSave(getDateMyDatepicker(_BIRTH_DATE));
                        _BIRTH_DATE = _BIRTH_DATE != null || "" ? _BIRTH_DATE.slice(0, 10) : "";
                        m.BIRTH_DATE = _BIRTH_DATE;
                    })
                }

                this.MAS_PERSON_ADDRESS.value.map(m => {
                    m.PERSON_ADDRESS_ID = "";
                    m.PERSON_ID = m.PERSON_ID;
                    m.SUB_DISTRICT_ID = m.SUB_DISTRICT_ID;
                    m.GPS = m.GPS;
                    m.ADDRESS_NO = m.ADDRESS_NO;
                    m.VILLAGE_NO = m.VILLAGE_NO;
                    m.BUILDING_NAME = m.BUILDING_NAME;
                    m.ROOM_NO = m.ROOM_NO;
                    m.FLOOR = m.FLOOR;
                    m.VILLAGE_NAME = m.VILLAGE_NAME;
                    m.ALLEY = m.ALLEY;
                    m.LANE = m.LANE;
                    m.ROAD = m.ROAD;
                    m.ADDRESS_TYPE = m.ADDRESS_TYPE;
                    m.ADDRESS_DESC = m.ADDRESS_DESC;
                    m.ADDRESS_STATUS = m.ADDRESS_STATUS;
                    m.IS_ACTIVE = 1;
                })
                console.log('onclickSave this.SuspectFG C: ', this.SuspectFG.value);
                this.OnCreate();
                break;
            case 'R':
                console.log('BEforSet onclickSave this.SuspectFG R: ', this.SuspectFG.value);

                let R_BIRTH_DATE = this.SuspectFG.value.BIRTH_DATE != null || "" ? this.SuspectFG.value.BIRTH_DATE : "";
                let R_COMPANY_FOUND_DATE = this.SuspectFG.value.COMPANY_FOUND_DATE != null || "" ? this.SuspectFG.value.COMPANY_FOUND_DATE : "";
                let R_COMPANY_LICENSE_DATE_FROM = this.SuspectFG.value.COMPANY_LICENSE_DATE_FROM != null || "" ? this.SuspectFG.value.COMPANY_LICENSE_DATE_FROM : "";
                let R_COMPANY_LICENSE_DATE_TO = this.SuspectFG.value.COMPANY_LICENSE_DATE_TO != null || "" ? this.SuspectFG.value.COMPANY_LICENSE_DATE_TO : "";
                let R_PASSPORT_DATE_IN = this.SuspectFG.value.PASSPORT_DATE_IN != null || "" ? this.SuspectFG.value.PASSPORT_DATE_IN : "";
                let R_PASSPORT_DATE_OUT = this.SuspectFG.value.PASSPORT_DATE_OUT != null || "" ? this.SuspectFG.value.PASSPORT_DATE_OUT : "";
                R_BIRTH_DATE = convertDateForSave(getDateMyDatepicker(this.SuspectFG.value.BIRTH_DATE));
                R_COMPANY_FOUND_DATE = convertDateForSave(getDateMyDatepicker(this.SuspectFG.value.COMPANY_FOUND_DATE));
                R_COMPANY_LICENSE_DATE_FROM = convertDateForSave(getDateMyDatepicker(this.SuspectFG.value.COMPANY_LICENSE_DATE_FROM));
                R_COMPANY_LICENSE_DATE_TO = convertDateForSave(getDateMyDatepicker(this.SuspectFG.value.COMPANY_LICENSE_DATE_TO));
                R_PASSPORT_DATE_IN = convertDateForSave(getDateMyDatepicker(this.SuspectFG.value.PASSPORT_DATE_IN));
                R_PASSPORT_DATE_OUT = convertDateForSave(getDateMyDatepicker(this.SuspectFG.value.PASSPORT_DATE_OUT));

                R_BIRTH_DATE = R_BIRTH_DATE != null || "" ? R_BIRTH_DATE.slice(0, 10) : "";
                R_COMPANY_FOUND_DATE = R_COMPANY_FOUND_DATE != null || "" ? R_COMPANY_FOUND_DATE.slice(0, 10) : "";
                R_COMPANY_LICENSE_DATE_FROM = R_COMPANY_LICENSE_DATE_FROM != null || "" ? R_COMPANY_LICENSE_DATE_FROM.slice(0, 10) : "";
                R_COMPANY_LICENSE_DATE_TO = R_COMPANY_LICENSE_DATE_TO != null || "" ? R_COMPANY_LICENSE_DATE_TO.slice(0, 10) : "";
                R_PASSPORT_DATE_IN = R_PASSPORT_DATE_IN != null || "" ? R_PASSPORT_DATE_IN.slice(0, 10) : "";
                R_PASSPORT_DATE_OUT = R_PASSPORT_DATE_OUT != null || "" ? R_PASSPORT_DATE_OUT.slice(0, 10) : "";

                console.log('AfterSet onclickSave this.SuspectFG R: ', this.SuspectFG.value);

                // if (!this.showEditField) { //In case R onEdit

                // } else if (this.showEditField) {
                // R_BIRTH_DATE != "" || null ? R_BIRTH_DATE = `${R_BIRTH_DATE.date.year}-${setZero(R_BIRTH_DATE.date.month)}-${setZero(R_BIRTH_DATE.date.day)}` : "";
                // R_COMPANY_FOUND_DATE != "" || null ? R_COMPANY_FOUND_DATE = `${R_COMPANY_FOUND_DATE.date.year}-${setZero(R_COMPANY_FOUND_DATE.date.month)}-${setZero(R_COMPANY_FOUND_DATE.date.day)}` : "";
                // R_COMPANY_LICENSE_DATE_FROM != "" || null ? R_COMPANY_LICENSE_DATE_FROM = `${R_COMPANY_LICENSE_DATE_FROM.date.year}-${setZero(R_COMPANY_LICENSE_DATE_FROM.date.month)}-${setZero(R_COMPANY_LICENSE_DATE_FROM.date.day)}` : "";
                // R_COMPANY_LICENSE_DATE_TO != "" || null ? R_COMPANY_LICENSE_DATE_TO = `${R_COMPANY_LICENSE_DATE_TO.date.year}-${setZero(R_COMPANY_LICENSE_DATE_TO.date.month)}-${setZero(R_COMPANY_LICENSE_DATE_TO.date.day)}` : "";
                // R_PASSPORT_DATE_IN != "" || null ? R_PASSPORT_DATE_IN = `${R_PASSPORT_DATE_IN.date.year}-${setZero(R_PASSPORT_DATE_IN.date.month)}-${setZero(R_PASSPORT_DATE_IN.date.day)}` : "";
                // R_PASSPORT_DATE_OUT != "" || null ? R_PASSPORT_DATE_OUT = `${R_PASSPORT_DATE_OUT.date.year}-${setZero(R_PASSPORT_DATE_OUT.date.month)}-${setZero(R_PASSPORT_DATE_OUT.date.day)}` : "";
                // }
                // R_BIRTH_DATE != "" || null ? R_BIRTH_DATE = R_BIRTH_DATE.slice(0, 10) : "";
                // R_COMPANY_FOUND_DATE != "" || null ? R_COMPANY_FOUND_DATE = R_COMPANY_FOUND_DATE.slice(0, 10) : "";
                // R_COMPANY_LICENSE_DATE_FROM != "" || null ? R_COMPANY_LICENSE_DATE_FROM = R_COMPANY_LICENSE_DATE_FROM.slice(0, 10) : "";
                // R_COMPANY_LICENSE_DATE_TO != "" || null ? R_COMPANY_LICENSE_DATE_TO = R_COMPANY_LICENSE_DATE_TO.slice(0, 10) : "";
                // R_PASSPORT_DATE_IN != "" || null ? R_PASSPORT_DATE_IN = R_PASSPORT_DATE_IN.slice(0, 10) : "";
                // R_PASSPORT_DATE_OUT != "" || null ? R_PASSPORT_DATE_OUT = R_PASSPORT_DATE_OUT.slice(0, 10) : "";

                this.SuspectFG.patchValue({
                    BIRTH_DATE: R_BIRTH_DATE,
                    COMPANY_FOUND_DATE: R_COMPANY_FOUND_DATE,
                    COMPANY_LICENSE_DATE_FROM: R_COMPANY_LICENSE_DATE_FROM,
                    COMPANY_LICENSE_DATE_TO: R_COMPANY_LICENSE_DATE_TO,
                    PASSPORT_DATE_IN: R_PASSPORT_DATE_IN,
                    PASSPORT_DATE_OUT: R_PASSPORT_DATE_OUT,
                })
                console.log('in save brforsave this.MAS_PERSON_EDUCATION : ', this.MAS_PERSON_EDUCATION);
                if (this.MAS_PERSON_EDUCATION.length) {
                    this.MAS_PERSON_EDUCATION.value.map(m => {
                        let _EDUCATION_START_DATE = m.EDUCATION_START_DATE != null || "" ? m.EDUCATION_START_DATE : ""
                        _EDUCATION_START_DATE = convertDateForSave(getDateMyDatepicker(_EDUCATION_START_DATE));
                        _EDUCATION_START_DATE = _EDUCATION_START_DATE != null || "" ? _EDUCATION_START_DATE.slice(0, 10) : "";
                        m.EDUCATION_START_DATE = _EDUCATION_START_DATE;

                        let _EDUCATION_FINISH_DATE = m.EDUCATION_FINISH_DATE != null || "" ? m.EDUCATION_FINISH_DATE : ""
                        _EDUCATION_FINISH_DATE = convertDateForSave(getDateMyDatepicker(_EDUCATION_FINISH_DATE));
                        _EDUCATION_FINISH_DATE = _EDUCATION_FINISH_DATE != null || "" ? _EDUCATION_FINISH_DATE.slice(0, 10) : "";
                        m.EDUCATION_FINISH_DATE = _EDUCATION_FINISH_DATE;
                    })
                }
                if (this.MAS_PERSON_RELATIONSHIP.length) {
                    this.MAS_PERSON_RELATIONSHIP.value.map(m => {
                        let _BIRTH_DATE = m.BIRTH_DATE != null || "" ? m.BIRTH_DATE : ""
                        _BIRTH_DATE = convertDateForSave(getDateMyDatepicker(_BIRTH_DATE));
                        _BIRTH_DATE = _BIRTH_DATE != null || "" ? _BIRTH_DATE.slice(0, 10) : "";
                        m.BIRTH_DATE = _BIRTH_DATE;
                    })
                }
                this.MAS_PERSON_ADDRESS.value.map(m => {
                    m.PERSON_ADDRESS_ID = m.PERSON_ADDRESS_ID;
                    m.PERSON_ID = this.PERSON_ID;
                    m.SUB_DISTRICT_ID = m.SUB_DISTRICT_ID;
                    m.GPS = m.GPS;
                    m.ADDRESS_NO = m.ADDRESS_NO;
                    m.VILLAGE_NO = m.VILLAGE_NO;
                    m.BUILDING_NAME = m.BUILDING_NAME;
                    m.ROOM_NO = m.ROOM_NO;
                    m.FLOOR = m.FLOOR;
                    m.VILLAGE_NAME = m.VILLAGE_NAME;
                    m.ALLEY = m.ALLEY;
                    m.LANE = m.LANE;
                    m.ROAD = m.ROAD;
                    m.ADDRESS_TYPE = m.ADDRESS_TYPE;
                    m.ADDRESS_DESC = m.ADDRESS_DESC;
                    m.ADDRESS_STATUS = m.ADDRESS_STATUS;
                    m.IS_ACTIVE = m.IS_ACTIVE;
                })
                console.log('onclickSave this.SuspectFG R: ', this.SuspectFG.value);
                this.OnRevice();
                break;
        }
    }
    clickDelete() {
        swal({
            title: '',
            text: Message.confirmAction,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirm!'
        }).then((result) => {
            if (result.value) {
                this.noticeService.MasPersonupdDelete(this.PERSON_ID).then(isSuccess => {
                    let IsSuccess: boolean = isSuccess.SUCCESS;
                    if (IsSuccess === true) {
                        // this.MAS_PERSON_EDUCATION.removeAt(i);
                        this.showSwal(Message.delComplete, "success");
                        this.SuspectFG.reset();
                        this.closePopup();
                        // this.router.navigate([`notice/suspect/C/NEW`]);
                    } else if (IsSuccess === false) {
                        this.showSwal(Message.delFail, "error");
                    }
                })
            }
        })
    }

    onClickEditField() {
        this.saveButton.next(true);
        this.cancelButton.next(true);
        this.showEditField = false;
        this.editButton.next(false);
        this.deleteButton.next(false);

        let entityTypes = this.SuspectFG.value.ENTITY_TYPE;
        let personType = this.SuspectFG.value.PERSON_TYPE;
        if (entityTypes == 0 && personType == 0) {
            this.type_Foreigner = true;
            this.type_Entrepreneur = true;
        } else if (entityTypes == 0 && personType == 1) {
            this.type_Foreigner = false;
            this.type_Entrepreneur = true;
        } else if (entityTypes == 1 && (personType == "" || null)) {
            this.type_Foreigner = true;
            this.type_Entrepreneur = false
        }
    }
    onCancelEdit() {
        swal({
            title: '',
            text: Message.confirmAction,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirm!'
        }).then((result) => {
            if (result.value) {
                switch (this.mode) {
                    case 'C':
                        // this.router.navigate([`notice/manage/C/NEW`]);
                        this.closePopup();
                        break;
                    case 'R':
                        // location.reload();
                        this.active_route();
                        break;
                }

            }
        })
    }

    private navigate_service() {
        // this.navService.showFieldEdit.subscribe(p => {
        //     this.showEditField = p;
        // });

        // this.onCancelSubscribe = this.navService.onCancel.subscribe(async status => {
        //     if (status) {
        //         await this.navService.setOnCancel(false);
        //         let url = sessionStorage.getItem("notice_current_page");
        //         this.router.navigateByUrl(url);
        //     }
        // });

        // this.onSaveSubscribe = this.navService.onSave.subscribe(async status => {
        //     if (status) {
        //         await this.navService.setOnSave(false);

        //         if (!this.SuspectFG.valid) {
        //             this.isRequired = true;
        //             this.showSwal(Message.checkData, "warning");
        //             return false;
        //         }

        //         let email = this.SuspectFG.get("Email").value;
        //         if (email && !this.validateEmail(email)) {
        //             this.emailValid = true;
        //             this.showSwal(Message.checkData, "warning");
        //             return false;
        //         }

        //         this.emailValid = false;

        //         // let birthDay = getDateMyDatepicker(this.SuspectFG.value.BirthDate);
        //         let birthDay = this.SuspectFG.value.BirthDate;
        //         if (birthDay && birthDay.date) {
        //             birthDay = birthDay.date.day + "-" + this.months[birthDay.date.month - 1] + "-" + birthDay.date.year;
        //         } else {
        //             birthDay = "";
        //         }
        //         let passportDateIn = this.SuspectFG.value.PassportDateIn;//getDateMyDatepicker(this.SuspectFG.value.PassportDateIn);
        //         if (passportDateIn && passportDateIn.date) {
        //             passportDateIn = passportDateIn.date.day + "-" + this.months[passportDateIn.date.month - 1] + "-" + passportDateIn.date.year;
        //         }
        //         let passportDateOut = this.SuspectFG.value.PassportDateOut;//getDateMyDatepicker(this.SuspectFG.value.PassportDateOut);
        //         if (passportDateOut && passportDateOut.date) {
        //             passportDateOut = passportDateOut.date.day + "-" + this.months[passportDateOut.date.month - 1] + "-" + passportDateOut.date.year;
        //         }

        //         this.SuspectFG.value.BirthDate = birthDay;//convertDateForSave(birthDay);
        //         this.SuspectFG.value.PassportDateIn = passportDateIn;//convertDateForSave(passportDateIn);
        //         this.SuspectFG.value.PassportDateOut = passportDateOut;//convertDateForSave(passportDateOut);

        //         if (this.mode === 'C') {
        //             this.OnCreate();

        //         } else if (this.mode === 'R') {
        //             this.OnRevice();
        //         }
        //     }
        // });
    }

    private async GetByCon(PERSON_ID: string) {
        await this.preloader.setShowPreloader(true);
        await this.noticeService.MasPersongetByCon("", PERSON_ID).then(async list => {
            let res = list.RESPONSE_DATA[0];
            console.log('res in getByCon : ', res);
            this.SuspectFG.reset({
                PERSON_ID: res.PERSON_ID,
                COUNTRY_ID: res.COUNTRY_ID,
                NATIONALITY_ID: res.NATIONALITY_ID,
                RACE_ID: res.RACE_ID,
                RELIGION_ID: res.RELIGION_ID,
                TITLE_ID: res.TITLE_ID,
                PERSON_TYPE: res.PERSON_TYPE,
                ENTITY_TYPE: res.ENTITY_TYPE,
                TITLE_NAME_TH: res.TITLE_NAME_TH,
                TITLE_NAME_EN: res.TITLE_NAME_EN,
                TITLE_SHORT_NAME_TH: res.TITLE_SHORT_NAME_TH,
                TITLE_SHORT_NAME_EN: res.TITLE_SHORT_NAME_EN,
                FIRST_NAME: res.FIRST_NAME,
                MIDDLE_NAME: res.MIDDLE_NAME,
                LAST_NAME: res.LAST_NAME,
                OTHER_NAME: res.OTHER_NAME,
                COMPANY_NAME: res.COMPANY_NAME,
                COMPANY_REGISTRATION_NO: res.COMPANY_REGISTRATION_NO,
                COMPANY_FOUND_DATE: res.COMPANY_FOUND_DATE != null || "" ? setDateMyDatepicker(res.COMPANY_FOUND_DATE) : "",
                COMPANY_LICENSE_NO: res.COMPANY_LICENSE_NO,
                COMPANY_LICENSE_DATE_FROM: res.COMPANY_LICENSE_DATE_FROM != null || "" ? setDateMyDatepicker(res.COMPANY_LICENSE_DATE_FROM) : "",
                COMPANY_LICENSE_DATE_TO: res.COMPANY_LICENSE_DATE_TO != null || "" ? setDateMyDatepicker(res.COMPANY_LICENSE_DATE_TO) : "",
                EXCISE_REGISTRATION_NO: res.EXCISE_REGISTRATION_NO,
                GENDER_TYPE: res.GENDER_TYPE,
                ID_CARD: res.ID_CARD,
                BIRTH_DATE: res.BIRTH_DATE != null || "" ? setDateMyDatepicker(res.BIRTH_DATE) : "",
                BLOOD_TYPE: res.BLOOD_TYPE,
                PASSPORT_NO: res.PASSPORT_NO,
                VISA_TYPE: res.VISA_TYPE,
                PASSPORT_DATE_IN: res.PASSPORT_DATE_IN != null || "" ? setDateMyDatepicker(res.PASSPORT_DATE_IN) : "",
                PASSPORT_DATE_OUT: res.PASSPORT_DATE_OUT != null || "" ? setDateMyDatepicker(res.PASSPORT_DATE_OUT) : "",
                MARITAL_STATUS: res.MARITAL_STATUS,
                CAREER: res.CAREER,
                PERSON_DESC: res.PERSON_DESC,
                EMAIL: res.EMAIL,
                TEL_NO: res.TEL_NO,
                MISTREAT_NO: res.MISTREAT_NO,
                IS_ILLEGAL: res.IS_ILLEGAL,
                IS_ACTIVE: res.IS_ACTIVE,
                Region: null,
                Countries: null,

                MAS_PERSON_ADDRESS: res.MAS_PERSON_ADDRESS,
                MAS_PERSON_EDUCATION: res.MAS_PERSON_EDUCATION,
                MAS_PERSON_RELATIONSHIP: res.MAS_PERSON_RELATIONSHIP,
                MAS_PERSON_PHOTO: res.MAS_PERSON_PHOTO,
                MAS_PERSON_FINGER_PRINT: res.MAS_PERSON_FINGER_PRINT

            })

            res.MAS_PERSON_EDUCATION.map(m => {
                m.EDUCATION_START_DATE = m.EDUCATION_START_DATE != null || "" ? setDateMyDatepicker(m.EDUCATION_START_DATE) : "";
                m.EDUCATION_FINISH_DATE = m.EDUCATION_FINISH_DATE != null || "" ? setDateMyDatepicker(m.EDUCATION_FINISH_DATE) : "";
            });

            res.MAS_PERSON_RELATIONSHIP.map(m => {
                m.BIRTH_DATE = m.BIRTH_DATE != null || "" ? setDateMyDatepicker(m.BIRTH_DATE) : "";
            })

            let country_id = this.SuspectFG.value.COUNTRY_ID;
            let counResult: any;
            if (country_id != null || '') {
                counResult = this.countries.find(f => f.COUNTRY_ID === country_id);
                let _Countries = `${counResult.COUNTRY_NAME_TH} ${counResult.COUNTRY_NAME_EN}`;
                this.SuspectFG.patchValue({
                    Countries: _Countries
                });
            }

            let subID = this.MAS_PERSON_ADDRESS.value[0].SUB_DISTRICT_ID;
            let subResult: any;
            if (subID != null || '') {
                subResult = this.typeheadRegion.find(f => f.SUB_DISTRICT_ID === subID);
                let _localFinded = `${subResult.SUB_DISTRICT_NAME_TH} ${subResult.DISTRICT_NAME_TH} ${subResult.PROVINCE_NAME_TH}`;
                res.MAS_PERSON_ADDRESS.map(m => { m.Region = _localFinded });
            }

            await this.setItemFormArray(res.MAS_PERSON_ADDRESS, 'MAS_PERSON_ADDRESS');
            await this.setItemFormArray(res.MAS_PERSON_EDUCATION, 'MAS_PERSON_EDUCATION');
            await this.setItemFormArray(res.MAS_PERSON_RELATIONSHIP, 'MAS_PERSON_RELATIONSHIP');
            await this.setItemFormArray(res.MAS_PERSON_PHOTO, 'MAS_PERSON_PHOTO');
            await this.setItemFormArray(res.MAS_PERSON_FINGER_PRINT, 'MAS_PERSON_FINGER_PRINT');

            let entityTypes = this.SuspectFG.value.ENTITY_TYPE;
            let personType = this.SuspectFG.value.PERSON_TYPE;
            if (entityTypes == 0 && personType == 0) {
                this.suspectTypes[1].selected = true;
                this.characteristics = this._EntityTypes[0].text;
            } else if (entityTypes == 0 && personType == 1) {
                this.suspectTypes[0].selected = true;
                this.characteristics = this._EntityTypes[0].text;
            } else if (entityTypes == 1 && (personType == "" || null)) {
                this.suspectTypes[2].selected = true;
                this.characteristics = this._EntityTypes[1].text;
            }
            console.log('SuspectFG in getBycon : ', this.SuspectFG)
            this.preloader.setShowPreloader(false);
        });

        await this.noticeService.GetDocumentByCon(11, this.PERSON_ID).subscribe(async res => {
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
                    }
                    this.fileList.push(m);
                }
            })
        })

    }

    async OnCreate() {
        this.preloader.setShowPreloader(true);
        let suspectFG = this.SuspectFG.value;
        suspectFG.IS_ILLEGAL = 0;

        let success: boolean = false;
        let PERSON_ID = "";
        console.log('suspectFG befor save : ', suspectFG)
        await this.noticeService.MasPersoninsAll(suspectFG).then(item => {
            success = item.SUCCESS == false ? false : true;
            PERSON_ID = item.RESPONSE_DATA;
        }, () => { success = false; });

        if (success) {
            await this.fileList.map(async doc => {
                // doc.DOCUMENT_ID = ""
                doc.DOCUMENT_TYPE = 11;
                doc.DATA_SOURCE = "";
                doc.REFERENCE_CODE = PERSON_ID;
                await this.noticeService.DocumentinsAll(doc).subscribe(docIsSuccess => {
                    if (!docIsSuccess) { success = false; return false; };
                }, () => { success = false; return false; });
            });
        }

        if (success) {
            // this.showSwal(Message.saveComplete, "success");
            // this.router.routeReuseStrategy.shouldReuseRoute = function () {
            //     return false;
            // };
            // this.router.navigateByUrl('/notice/suspect/R/' + PERSON_ID);
            swal({
                title: '',
                text: Message.saveComplete,
                type: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'ตกลง'
            }).then((result) => {
                if (result.value) {
                    this.preloader.setShowPreloader(true);
                    this.noticeService.MasPersongetByCon("", PERSON_ID).then(async list => {
                        if (list.RESPONSE_DATA.length)
                            this.exportData(this.setForExport(list.RESPONSE_DATA));
                        this.preloader.setShowPreloader(false);
                    })
                }
            })
        } else {
            this.showSwal(Message.saveFail, "error");
        }
        this.preloader.setShowPreloader(false);
    }

    setForExport(input: any[]) {
        input.map(item => {
            item.FULL_NAME = `${item.TITLE_SHORT_NAME_TH || ''}${item.FIRST_NAME || ''} ${item.MIDDLE_NAME || ''} ${item.LAST_NAME || ''}`;
            item.MISTREAT_NO = 0;
        })
        return input;
    }

    async exportData(form) {
        this.exportSuspectData.emit(form);
        this.closePopup();
    }

    async OnRevice() {
        // Set Preloader
        this.preloader.setShowPreloader(true);

        let IsSuccess: boolean = false;
        await this.noticeService.MasPersonupdAll(this.SuspectFG.value).then(isSuccess => {
            IsSuccess = isSuccess.SUCCESS;
        }, () => { IsSuccess = false; })

        if (IsSuccess) {
            await this.noticeService.MasPersonAddressupdAll(this.MAS_PERSON_ADDRESS.value).then(isSuccess => {
                IsSuccess = isSuccess[0].SUCCESS;
            }, () => { IsSuccess = false; })
        }

        if (IsSuccess) {
            const PersonEducation = this.MAS_PERSON_EDUCATION.value;
            if (PersonEducation && PersonEducation.length > 0) {
                for (let i in PersonEducation) {
                    let l = PersonEducation[i];
                    if (l.IsNewItem) {
                        l.IS_ACTIVE = 1;
                        await this.noticeService.MasPersonEducationinsAll(l).then(isSuccess => {
                            IsSuccess = isSuccess.SUCCESS;
                        }, () => { IsSuccess = false; })
                    } else {
                        await this.noticeService.MasPersonEducationupdAll(PersonEducation[i]).then(isSuccess => {
                            IsSuccess = isSuccess[0].SUCCESS;
                        }, () => { IsSuccess = false; })
                    }
                }
            }
        }
        if (IsSuccess) {
            const MasRelationship = this.MAS_PERSON_RELATIONSHIP.value;
            if (MasRelationship && MasRelationship.length > 0) {
                for (let i in MasRelationship) {
                    let l = MasRelationship[i];
                    if (l.IsNewItem) {
                        l.IS_ACTIVE = 1;
                        await this.noticeService.MasPersonRelationshipinsAll(l).then(isSuccess => {
                            IsSuccess = isSuccess.SUCCESS;
                        }, () => { IsSuccess = false; })
                    } else {
                        await this.noticeService.MasPersonRelationshipupdAll(MasRelationship[i]).then(isSuccess => {
                            IsSuccess = isSuccess[0].SUCCESS;
                        }, () => { IsSuccess = false; })
                    }
                }
            }
        }
        if (IsSuccess) {
            await this.fileList.map(async doc => {
                if (doc.IsNewItem) {
                    // doc.DOCUMENT_ID = ""
                    doc.DOCUMENT_TYPE = 11;
                    doc.DATA_SOURCE = "";
                    doc.REFERENCE_CODE = this.PERSON_ID;
                    await this.noticeService.DocumentinsAll(doc).subscribe(docIsSuccess => {
                        let isSuscess: any
                        isSuscess = docIsSuccess;
                        if (isSuscess.IsSuccess !== "True") { IsSuccess = false; return false; };
                    }, () => { IsSuccess = false; return false; });
                }
            });
        }
        if (IsSuccess) {
            this.active_route();
            // location.reload();
            this.showSwal(Message.saveComplete, "success");
        } else {
            this.showSwal(Message.saveFail, "error");
        }
        // Set Preloader
        this.preloader.setShowPreloader(false);
    }

    private async onComplete() {
        // set true
        await this.navService.setEditField(true);
        await this.navService.setEditButton(true);
        await this.navService.setPrintButton(false);
        await this.navService.setDeleteButton(false);
        await this.navService.setNextPageButton(false);
        // set false
        await this.navService.setSaveButton(false);
        await this.navService.setCancelButton(false);

        this.GetByCon(this.PERSON_ID);

    }

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

    //Master
    searchRegion = (text3$: Observable<string>) =>
        text3$
            .debounceTime(300)
            .distinctUntilChanged()
            .map(term => term === '' ? []
                : this.typeheadRegion
                    .filter(v =>
                        v.SUB_DISTRICT_NAME_TH.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
                        v.DISTRICT_NAME_TH.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
                        v.PROVINCE_NAME_TH.toLowerCase().indexOf(term.toLowerCase()) > -1
                    ).slice(0, 10));

    formatterRegion = (x: { SUB_DISTRICT_NAME_TH: string, DISTRICT_NAME_TH: string, PROVINCE_NAME_TH: string }) =>
        `${x.SUB_DISTRICT_NAME_TH} ${x.DISTRICT_NAME_TH} ${x.PROVINCE_NAME_TH}`;

    selectItemRegion(ele: any) {
        this.MAS_PERSON_ADDRESS.at(0).patchValue({
            SUB_DISTRICT_ID: ele.item.SUB_DISTRICT_ID
        });
        // let region = `${ele.item.SUB_DISTRICT_NAME_TH || ''} ${ele.item.DISTRICT_NAME_TH || ''} ${ele.item.PROVINCE_NAME_TH || ''}`;
        // this.SuspectFG.patchValue({
        //     SubDistrictCode: ele.item.SubdistrictCode,
        //     SubDistrict: ele.item.SubdistrictNameTH,
        //     DistrictCode: ele.item.DistrictCode,
        //     District: ele.item.DistrictNameTH,
        //     ProvinceCode: ele.item.ProvinceCode,
        //     Province: ele.item.ProvinceNameTH,
        //     Region: region
        // });
    }
    blurItemRegion(ele: any) {
        let val = ele.value;
        if (!val) {
            this.MAS_PERSON_ADDRESS.at(0).patchValue({
                SUB_DISTRICT_ID: ""
            });
            // this.SuspectFG.patchValue({
            //     SubDistrictCode: "",
            //     SubDistrict: "",
            //     DistrictCode: "",
            //     District: "",
            //     ProvinceCode: "",
            //     Province: "",
            //     Region: ""
            // });
        }
    }

    getTitleNames() {
        this.mainMasterService.MasTitlegetByCon().then(res => { this.titleNames = res.RESPONSE_DATA; });
    }
    searchTitleName = (text3$: Observable<string>) =>
        text3$
            .debounceTime(300)
            .distinctUntilChanged()
            .map(term => term === '' ? []
                : this.titleNames
                    .filter(v =>
                        (v.TITLE_SHORT_NAME_TH && v.TITLE_SHORT_NAME_TH.toLowerCase().indexOf(term.toLowerCase()) > -1) ||
                        (v.TITLE_SHORT_NAME_EN && v.TITLE_SHORT_NAME_EN.toLowerCase().indexOf(term.toLowerCase()) > -1)
                    ).slice(0, 10));
                    
    formatterTitleName = (x: { TITLE_SHORT_NAME_TH: string }) => `${x.TITLE_SHORT_NAME_TH || ''}`

    selectItemTitleName(ele: any) {
        this.SuspectFG.patchValue({
            TITLE_ID: ele.item.TITLE_ID,
            TITLE_NAME_EN: ele.item.TITLE_NAME_EN,
            TITLE_NAME_TH: ele.item.TITLE_NAME_TH,
            TITLE_SHORT_NAME_EN: ele.item.TITLE_SHORT_NAME_EN,
            TITLE_SHORT_NAME_TH: ele.item.TITLE_SHORT_NAME_TH
        });
    }
    blurItemTitleName(ele: any) {

        let val = ele.value;
        if (!val) {
            this.SuspectFG.patchValue({
                TITLE_ID: '',
                TITLE_NAME_EN: '',
                TITLE_NAME_TH: '',
                TITLE_SHORT_NAME_EN: '',
                TITLE_SHORT_NAME_TH: ''
            });
        }
    }
    // ############################Relationship##########################
    searchTitleName_rl = (text3$: Observable<string>) =>
        text3$
            .debounceTime(300)
            .distinctUntilChanged()
            .map(term => term === '' ? []
                : this.titleNames
                    .filter(v =>
                        (v.TITLE_SHORT_NAME_TH && v.TITLE_SHORT_NAME_TH.toLowerCase().indexOf(term.toLowerCase()) > -1) ||
                        (v.TITLE_SHORT_NAME_EN && v.TITLE_SHORT_NAME_EN.toLowerCase().indexOf(term.toLowerCase()) > -1)
                    ).slice(0, 10));
    formatterTitleName_rl = (x: { TITLE_SHORT_NAME_TH: string }) => `${x.TITLE_SHORT_NAME_TH || ''}`

    selectItemTitleName_rl(ele: any, i: number) {
        this.MAS_PERSON_RELATIONSHIP.at(i).patchValue({
            TITLE_ID: ele.item.TITLE_ID,
            TITLE_NAME_EN: ele.item.TITLE_NAME_EN,
            TITLE_NAME_TH: ele.item.TITLE_NAME_TH,
            TITLE_SHORT_NAME_EN: ele.item.TITLE_SHORT_NAME_EN,
            TITLE_SHORT_NAME_TH: ele.item.TITLE_SHORT_NAME_TH
        });
    }
    blurItemTitleName_rl(ele: any, i: number) {

        let val = ele.value;
        if (!val) {
            this.MAS_PERSON_RELATIONSHIP.at(i).patchValue({
                TITLE_ID: '',
                TITLE_NAME_EN: '',
                TITLE_NAME_TH: '',
                TITLE_SHORT_NAME_EN: '',
                TITLE_SHORT_NAME_TH: ''
            });
        }
    }
    // ############################End Relationship##########################
    getNationality() {
        this.mainMasterService.MasNationalitygetByCon().then(res => {
            this.nationnalitys = res.RESPONSE_DATA;
            // for (let l of res) {
            //     let code = l.NationalityCode;
            //     if (code == 1) {
            //         this.SuspectFG.patchValue({ NationalityCode: code });
            //         break;
            //     }
            // }
        });
    }
    searchNationality = (text3$: Observable<string>) =>
        text3$
            .debounceTime(300)
            .distinctUntilChanged()
            .map(term => term === '' ? []
                : this.nationnalitys
                    .filter(v =>
                        (v.NationalityNameTh && v.NationalityNameTh.toLowerCase().indexOf(term.toLowerCase()) > -1) ||
                        (v.NationalityNameEn && v.NationalityNameEn.toLowerCase().indexOf(term.toLowerCase()) > -1)
                    ).slice(0, 10));
    formatterNationality = (x: { NationalityNameTh: string }) => `${x.NationalityNameTh || ''}`
    selectItemNationality() {
        let code = this.SuspectFG.get("NATIONALITY_ID").value;
        for (let l of this.nationnalitys) {
            let _code = l.NATIONALITY_ID;
            if (code == _code) {
                this.SuspectFG.patchValue({
                    NATIONALITY_ID: l.NATIONALITY_ID
                });
                break;
            }
        }
    }
    getRace() {
        this.mainMasterService.MasRacegetByCon().then(res => {
            this.races = res.RESPONSE_DATA;
            // for (let l of res) {
            //     let code = l.RaceCode;
            //     if (code == 1) {
            //         this.SuspectFG.patchValue({ RaceCode: code });
            //         break;
            //     }
            // }
        });
    }
    searchRace = (text3$: Observable<string>) =>
        text3$
            .debounceTime(300)
            .distinctUntilChanged()
            .map(term => term === '' ? []
                : this.races
                    .filter(v =>
                        (v.RaceNameTH && v.RaceNameTH.toLowerCase().indexOf(term.toLowerCase()) > -1) ||
                        (v.RaceNameEN && v.RaceNameEN.toLowerCase().indexOf(term.toLowerCase()) > -1)
                    ).slice(0, 10));
    formatterRace = (x: { RaceNameTH: string }) => `${x.RaceNameTH || ''}`
    selectItemRace() {
        let code = this.SuspectFG.get("RACE_ID").value;
        for (let l of this.races) {
            let _code = l.RACE_ID;
            if (code == _code) {
                this.SuspectFG.patchValue({
                    RACE_ID: l.RACE_ID
                });
                break;
            }
        }
    }
    getReligion() {
        this.mainMasterService.MasReligiongetByCon().then(res => this.religions = res.RESPONSE_DATA);
    }
    searchReligion = (text3$: Observable<string>) =>
        text3$
            .debounceTime(300)
            .distinctUntilChanged()
            .map(term => term === '' ? []
                : this.religions
                    .filter(v =>
                        (v.ReligionNameTH && v.ReligionNameTH.toLowerCase().indexOf(term.toLowerCase()) > -1) ||
                        (v.ReligionNameEN && v.ReligionNameEN.toLowerCase().indexOf(term.toLowerCase()) > -1)
                    ).slice(0, 10));
    formatterReligion = (x: { RaceNameTH: string }) => `${x.RaceNameTH || ''}`
    selectItemReligion(ele: any) {
        let code = this.SuspectFG.get("RELIGION_ID").value;
        for (let l of this.religions) {
            let _code = l.RELIGION_ID;
            if (code == _code) {
                this.SuspectFG.patchValue({
                    RELIGION_ID: l.RELIGION_ID
                });
                break;
            }
        }
    }
    getRelationshipType() {
        this.mainMasterService.MasRelationshipgetByCon().then(res => this.RelationshipType = res.RESPONSE_DATA);
    }

    getCountry() { this.mainMasterService.MasCountrygetByCon().then(res => { this.countries = res.RESPONSE_DATA; }); }

    searchCountries = (text3$: Observable<string>) =>
        text3$
            .debounceTime(300)
            .distinctUntilChanged()
            .map(term => term === '' ? []
                : this.countries
                    .filter(v =>
                        (v.COUNTRY_NAME_TH.toLowerCase().indexOf(term.toLowerCase()) > -1) ||
                        (v.COUNTRY_NAME_EN.toLowerCase().indexOf(term.toLowerCase()) > -1)
                    ).slice(0, 10));

    formatterCountries = (x: { COUNTRY_NAME_TH: string, COUNTRY_NAME_EN: string }) =>
        `${x.COUNTRY_NAME_TH} ${x.COUNTRY_NAME_EN}`;

    selectItemCountries(ele: any) {
        this.SuspectFG.patchValue({
            COUNTRY_ID: ele.item.COUNTRY_ID
        });
    }
    blurItemCountries(ele: any) {
        let val = ele.value;
        if (!val) {
            this.SuspectFG.patchValue({
                COUNTRY_ID: ""
            });
        }
    }

    changeImage(e: any, img: any) {

        let file = e.target.files[0];
        let isMatch: boolean | false;

        ImageType.filter(item => file.type == item.type).map(() => isMatch = true);

        if (!isMatch) {
            this.showSwal(Message.checkImageType, "warning");
            return
        }

        let reader = new FileReader();
        reader.onload = () => {
            img.src = reader.result;
            this.SuspectFG.patchValue({
                // LinkPhoto: reader.result,
                PhotoDesc: file.name
            })
        };

        reader.readAsDataURL(file);
    }

    private showSwal(msg: string, iconType: any) {
        this.alertSwal.text = msg;
        this.alertSwal.type = iconType;
        this.alertSwal.show();
    }

    private setItemFormArray(array: any[], formControl: string) {
        if (array !== undefined && array.length) {
            const itemFGs = array.map(item => this.fb.group(item));
            const itemFormArray = this.fb.array(itemFGs);
            this.SuspectFG.setControl(formControl, itemFormArray);
        }
    }

    private validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
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
        if (!doc.DOCUMENT_ID) {
            this.fileList.splice(i, 1);
            return;
        }
        swal({
            title: '',
            text: 'ยืนยันการลบรายการหรือไม่',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirm!'
        }).then((result) => {
            if (result.value) {
                this.preloader.setShowPreloader(true);
                this.noticeService.DocumentupdDelete({ DOCUMENT_ID: doc.DOCUMENT_ID })
                    .subscribe(x => {
                        let iSuccess: any;
                        iSuccess = x;
                        if (iSuccess.IsSuccess === "True") {
                            swal('', Message.delComplete, 'success');
                            this.fileList.splice(i, 1);
                            this.preloader.setShowPreloader(false);
                        } else {
                            swal('', Message.delFail, 'error');
                            this.preloader.setShowPreloader(false);
                        }
                    });
            }
        })
    }

    Output(event: Document) {
        this.fileList = [...this.fileList, event]
        // this.fileList.map(m => {
        //     m.IsNewItem = true
        // })
    }
    // ##################################End Document##################################
    closePopup() {
        this.c.emit('Save click');
    }
}