import {
  Component,
  OnInit,
  ViewEncapsulation,
  OnDestroy,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Ilg60M01010200Config } from "./ilg60-m-01-01-02-00.config";
import {
  MasterService,
  MasPersonService,
  MasSubDistrictService,
  ArrestDocumentService,
} from "../../services";
import { ActivatedRoute, Router } from "@angular/router";
import { LocalStoreage as LS } from "../../entities";
import swal from "sweetalert2";
import { Message } from "../../../../config/message";
import { Observable } from "rxjs";
import { LoaderService } from "../../../../core/loader/loader.service";
import { merge } from "rxjs/observable/merge";
import { forkJoin } from "rxjs/observable/forkJoin";
import {
  MasPerson,
  IMasTitle,
  IMasRace,
  IMasReligion,
  IMasCountry,
  IMasNationality,
  MasSubDistrict,
  IMasRelationship,
  ArrestLawbreaker,
  ArrestMasPerson,
} from "../../models";
import {
  setDateMyDatepicker,
  MyDatePickerOptions,
} from "../../../../config/dateFormat";
import { IMyDateModel } from "mydatepicker";
import { mergeMap, map, catchError, mapTo, finalize } from "rxjs/operators";
import { from } from "rxjs/observable/from";

@Component({
  selector: "app-ilg60-m-01-01-02-00",
  templateUrl: "./ilg60-m-01-01-02-00.component.html",
  styleUrls: ["./ilg60-m-01-01-02-00.component.scss"],
  encapsulation: ViewEncapsulation.Emulated,
})
export class Ilg60M01010200Component
  extends Ilg60M01010200Config
  implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.destroy();
    this.destroy$.next();
    this.destroy$.complete();
  }

  constructor(
    private ngModalService: NgbModal,
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private s_MasMaster: MasterService,
    private s_Subdistinct: MasSubDistrictService,
    private s_Document: ArrestDocumentService,
    private router: Router,
    private s_Person: MasPersonService,
    private loaderService: LoaderService
  ) {
    super();
    this.destroy();
  }

  typeheadTitleNames = new Array<IMasTitle>();
  typeheadRaces = new Array<IMasRace>();
  typeheadReligions = new Array<IMasReligion>();
  typeheadCountry = new Array<IMasCountry>();
  typeheadNationality = new Array<IMasNationality>();
  typeheadSubDistinct = new Array<MasSubDistrict>();
  typeheadRelationShip = new Array<IMasRelationship>();

  characteristics: string = "";
  isRequired: boolean | false;
  MyDatePickerOptions = MyDatePickerOptions;

  private destroy() {
    localStorage.removeItem(LS.TrashMasPersonAddress);
    localStorage.removeItem(LS.TrashMasPersonEducation);
    localStorage.removeItem(LS.TrashMasPersonRelationship);
    localStorage.removeItem(LS.TrashMasPersonPhoto);
    localStorage.removeItem(LS.TrashMasPersonFingerPrint);
  }
  @ViewChild("LawBrSearchModal") public LawBrSearchModal: ElementRef;

  ngOnInit() {
    this.loaderService.showLoader();
    this.formGroup = this.fb.group({
      ...this.formGroup.controls,
      MAS_PERSON_ADDRESS: this.fb.array([this.addPersonAddress()]),
      MAS_PERSON_EDUCATION: this.fb.array([]),
      MAS_PERSON_RELATIONSHIP: this.fb.array([]),
      MAS_PERSON_PHOTO: this.fb.array([]),
      MAS_PERSON_FINGER_PRINT: this.fb.array([]),
    });

    Observable.combineLatest(
      this.s_MasMaster.MasCountrygetByCon(),
      this.s_Subdistinct.MasSubDistrictgetByCon(),
      this.s_MasMaster.MasTitlegetByCon(),
      this.s_MasMaster.MasNationalitygetByCon(),
      this.s_MasMaster.MasRacegetByCon(),
      this.s_MasMaster.MasReligiongetByCon(),
      this.s_MasMaster.MasRelationshipgetByCon()
    )
      .pipe(finalize(() => this.loaderService.onEnd()))
      .subscribe((x) => {
        this.typeheadCountry = x[0];
        this.typeheadSubDistinct = x[1];
        this.typeheadTitleNames = x[2];
        this.typeheadNationality = x[3];
        this.typeheadRaces = x[4];
        this.typeheadReligions = x[5];
        this.typeheadRelationShip = x[6];
        this.ActiveRoute();
      });

    let currentdate = new Date();

    // this.MyDatePickerOptions.disableSince = { year: currentdate.getFullYear(), month: currentdate.getMonth() + 1, day: currentdate.getDate() + 1 };
    this.MyDatePickerOptions.disableDateRanges = [
      {
        begin: {
          year: currentdate.getFullYear(),
          month: currentdate.getMonth() + 1,
          day: currentdate.getDate() + 1,
        },
        end: {
          year: currentdate.getFullYear() + 100,
          month: currentdate.getMonth() + 1,
          day: currentdate.getDate() + 1,
        },
      },
    ];
  }

  ActiveRoute() {
    this.activeRoute.params.subscribe((p) => {
      // const PERSON_ID = p['code'];
      // this.mode = p['mode'];
      this.mode = this.ModeEmit;
      const PERSON_ID = this.PERSON_ID;

      switch (this.mode) {
        case this.ModeAction.C:
          this.card1_3 = false;
          this.card1_2 = false;
          this.waitForDucument = true;
          break;
        case this.ModeAction.R:
          this.s_Person
            .MasPersongetByCon({ TEXT_SEARCH: "", PERSON_ID })
            .pipe(
              mergeMap((x) => {
                const params = {
                  DOCUMENT_TYPE: this.DOCUMENT_TYPE$,
                  REFERENCE_CODE: PERSON_ID,
                };
                return this.s_Document.GetDocumentByCon(params).pipe(
                  map((o) => {
                    return x.reduce((a, c) => {
                      return [...a, { ...c, Document: o }];
                    }, []);
                  })
                ); //{ ...x, Document: o }
              })
            )
            .subscribe((x) => {
              const obj = x.find((x) => x.PERSON_ID == PERSON_ID);
              this._ILG60_03_02_00_00_E28$.next(obj["Document"]);
              this.card1_3 = true;
              this.card1_2 = true;
              this.waitForDucument = true;
              this.setForm(obj);
            });
          break;
      }
      this.setButton();
    });
  }

  setForm(obj: MasPerson) {
    ///=== set date ===///
    const BIRTH_DATE = obj.BIRTH_DATE
      ? setDateMyDatepicker(new Date(obj.BIRTH_DATE))
      : null;
    const COMPANY_FOUND_DATE = obj.COMPANY_FOUND_DATE
      ? setDateMyDatepicker(new Date(obj.COMPANY_FOUND_DATE))
      : null;
    const COMPANY_LICENSE_DATE_FROM = obj.COMPANY_LICENSE_DATE_FROM
      ? setDateMyDatepicker(new Date(obj.COMPANY_LICENSE_DATE_FROM))
      : null;
    const COMPANY_LICENSE_DATE_TO = obj.COMPANY_LICENSE_DATE_TO
      ? setDateMyDatepicker(new Date(obj.COMPANY_LICENSE_DATE_TO))
      : null;
    const PASSPORT_DATE_IN = obj.PASSPORT_DATE_IN
      ? setDateMyDatepicker(new Date(obj.PASSPORT_DATE_IN))
      : null;
    const PASSPORT_DATE_OUT = obj.PASSPORT_DATE_IN
      ? setDateMyDatepicker(new Date(obj.PASSPORT_DATE_IN))
      : null;
    ///=== set all id ===///
    const RACE_NAME_TH = obj.RACE_ID
      ? this.typeheadRaces.length
        ? this.typeheadRaces.find((f) => obj.RACE_ID == f.RACE_ID).RACE_NAME_TH
        : ""
      : "";
    const NATIONALITY_NAME_TH = obj.NATIONALITY_ID
      ? this.typeheadNationality.length
        ? this.typeheadNationality.find(
            (f) => obj.NATIONALITY_ID == f.NATIONALITY_ID
          ).NATIONALITY_NAME_TH
        : ""
      : "";
    const RELIGION_NAME_TH = obj.RELIGION_ID
      ? this.typeheadReligions.length
        ? this.typeheadReligions.find((f) => obj.RELIGION_ID == f.RELIGION_ID)
            .RELIGION_NAME_TH
        : ""
      : "";
    const COUNTRY_NAME_TH = obj.COUNTRY_ID
      ? this.typeheadCountry.length
        ? this.typeheadCountry.find((f) => obj.COUNTRY_ID == f.COUNTRY_ID)
            .COUNTRY_NAME_TH
        : ""
      : "";
    console.log(obj);

    this.formGroup.patchValue({
      ...obj,
      BIRTH_DATE,
      COMPANY_FOUND_DATE,
      COMPANY_LICENSE_DATE_FROM,
      COMPANY_LICENSE_DATE_TO,
      PASSPORT_DATE_IN,
      PASSPORT_DATE_OUT,
      RACE_NAME_TH,
      NATIONALITY_NAME_TH,
      RELIGION_NAME_TH,
      COUNTRY_NAME_TH,
    });

    const MAS_PERSON_ADDRESS = obj.MAS_PERSON_ADDRESS.reduce((a, c) => {
      let la = c.GPS ? c.GPS.split(",")[0] : "";
      let lo = c.GPS ? c.GPS.split(",")[1] : "";

      la = la == "null" ? "" : la;
      lo = lo == "null" ? "" : lo;

      return [
        ...a,
        {
          ...c,
          LATITUDE: la ? la : "",
          LONGITUDE: lo ? lo : "",
          SUB_DISTRICT: c.SUB_DISTRICT_ID,
        },
      ];
    }, []);

    const MAS_PERSON_EDUCATION = obj.MAS_PERSON_EDUCATION.reduce((a, c) => {
      const EDUCATION_START_DATE = c.EDUCATION_START_DATE
        ? setDateMyDatepicker(new Date(c.EDUCATION_START_DATE))
        : null;
      const EDUCATION_FINISH_DATE = c.EDUCATION_FINISH_DATE
        ? setDateMyDatepicker(new Date(c.EDUCATION_FINISH_DATE))
        : null;
      return [...a, { ...c, EDUCATION_START_DATE, EDUCATION_FINISH_DATE }];
    }, []);

    const MAS_PERSON_RELATIONSHIP = obj.MAS_PERSON_RELATIONSHIP.reduce(
      (a, c, i) => {
        if (i == 0) {
          this.RELATIONSHIP_TITLE_ID = c.TITLE_ID;
          this.RELATIONSHIP_TITLE_SHORT_NAME_TH = c.TITLE_SHORT_NAME_TH;
          this.RELATIONSHIP_FIRST_NAME = c.FIRST_NAME;
          this.RELATIONSHIP_LAST_NAME = c.LAST_NAME;
        }

        const RELATIONSHIP_NAME = c.RELATIONSHIP_ID
          ? this.typeheadRelationShip.length
            ? this.typeheadRelationShip.find(
                (f) => c.RELATIONSHIP_ID == f.RELATIONSHIP_ID
              ).RELATIONSHIP_NAME
            : ""
          : "";

        const BIRTH_DATE = c.BIRTH_DATE
          ? setDateMyDatepicker(new Date(c.BIRTH_DATE))
          : null;

        return [
          ...a,
          {
            ...c,
            BIRTH_DATE,
            RELATIONSHIP_NAME,
            ACTION: this.Action.EDIT,
          },
        ];
      },
      []
    );

    // this._ILG60_03_02_00_00_E28$.next(obj['Document']);

    let e = this.formGroup.get("ENTITY_TYPE").value;
    this.characteristics = this.ENTITY_TYPE.find((f) => f.value == e).text;

    this.setItemFormArray(MAS_PERSON_ADDRESS, "MAS_PERSON_ADDRESS");
    this.setItemFormArray(MAS_PERSON_EDUCATION, "MAS_PERSON_EDUCATION");
    this.setItemFormArray(MAS_PERSON_RELATIONSHIP, "MAS_PERSON_RELATIONSHIP");
    this.toggleCard();
  }

  private setItemFormArray(array: any[], formControl: string) {
    if (array !== undefined && array.length) {
      const itemFGs = array.map((item) => this.fb.group(item));
      const itemFormArray = this.fb.array(itemFGs);
      this.formGroup.setControl(formControl, itemFormArray);
    }
  }

  toggleCard() {
    const e = this.formGroup.get("ENTITY_TYPE").value;
    const p = this.formGroup.get("PERSON_TYPE").value;
    this.disableForeign = false;
    this.disableCompany = false;
    this.requiredCompanyRegister = false;
    this.requiredPassport = false;

    setTimeout(() => {
      if (p == "1") {
        // บุคคลธรรมดา, ต่างชาติ
        this.characteristics = this.ENTITY_TYPE.find((f) => f.value == 0).text;
        this.formGroup.controls["ENTITY_TYPE"].setValue(0);
        this.disableCompany = true;
        this.requiredPassport = true;
        // this.card3 = true;
        // this.card4 = false;
        this.RelationshipCard = true;
        this.entityType = true;
      } else if (p == "0") {
        // บุคคลธรรมดา, ชาวไทย
        this.characteristics = this.ENTITY_TYPE.find((f) => f.value == 0).text;
        this.formGroup.controls["ENTITY_TYPE"].setValue(0);
        this.disableCompany = true;
        this.disableForeign = true;
        // this.card3 = false;
        // this.card4 = false;
        this.RelationshipCard = true;
        this.entityType = true;
      } else if (p == "2") {
        // นิติบุคคล
        // let r = this.MAS_PERSON_RELATIONSHIP.length;
        // r < 1 ? this.addPersonRelationship() : false;

        this.characteristics = this.ENTITY_TYPE.find((f) => f.value == 1).text;

        this.disableForeign = true;
        this.requiredCompanyRegister = true;
        // this.card3 = false;
        // this.card4 = true;
        this.RelationshipCard = false;
        this.entityType = false;
        if (this.mode == this.ModeAction.C) {
          this.formGroup.controls["ENTITY_TYPE"].setValue(1);
          this.onEntityChange();
        }
      }
    }, 100);
  }

  onEntityChange() {
    const e = this.formGroup.get("ENTITY_TYPE").value;
    setTimeout(() => {
      if (e == "0") {
        this.formGroup.controls["COMPANY_REGISTRATION_NO"].setValue("");
        this.formGroup.controls["EXCISE_REGISTRATION_NO"].setValue("");
      } else if (e == "1") {
        this.formGroup.controls["ID_CARD"].setValue("");
      }
    }, 100);
  }

  // searchMasCountry = this.s_MasMaster.searchMasCountry;

  // searchMasTitle = this.s_MasMaster.searchMasTitle;

  // searchMasRace = this.s_MasMaster.searchMasRace;

  // searchMasNationality = this.s_MasMaster.searchMasNationality;

  // searchMasReligion = this.s_MasMaster.searchMasReligion;

  // searchMasRelationship = this.s_MasMaster.searchMasRelationship;

  // searchLocale = this.s_MasMaster.searchLocale;

  searchRelationship = (text3$: Observable<string>) =>
    text3$
      .debounceTime(300)
      .distinctUntilChanged()
      .map((term) =>
        term === ""
          ? []
          : this.typeheadRelationShip
              .filter((v) => v.RELATIONSHIP_NAME.indexOf(term) > -1)
              .slice(0, 10)
      );

  searchSuDistinct = (text3$: Observable<string>) =>
    text3$
      .debounceTime(300)
      .distinctUntilChanged()
      .map((term) =>
        term === ""
          ? []
          : this.typeheadSubDistinct
              .filter(
                (v) =>
                  `${v.SUB_DISTRICT_NAME_TH} ${v.DISTRICT_NAME_TH} ${v.PROVINCE_NAME_TH}`.indexOf(
                    term
                  ) > -1
              )
              .slice(0, 10)
      );

  searchTitleName = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .map((term) =>
        term == ""
          ? []
          : this.typeheadTitleNames
              .filter(
                (v) =>
                  (v.TITLE_SHORT_NAME_TH &&
                    v.TITLE_SHORT_NAME_TH.indexOf(term) > -1) ||
                  (v.TITLE_NAME_TH && v.TITLE_NAME_TH.indexOf(term) > -1) ||
                  (v.TITLE_SHORT_NAME_EN &&
                    v.TITLE_SHORT_NAME_EN.indexOf(term) > -1) ||
                  (v.TITLE_NAME_EN && v.TITLE_NAME_EN.indexOf(term) > -1)
              )
              .slice(0, 10)
      );

  searchNationality = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .map((term) =>
        term == ""
          ? []
          : this.typeheadNationality
              .filter((v) => v.NATIONALITY_NAME_TH.indexOf(term) > -1)
              .slice(0, 10)
      );

  searchRace = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .map((term) =>
        term == ""
          ? []
          : this.typeheadRaces
              .filter((v) => v.RACE_NAME_TH.indexOf(term) > -1)
              .slice(0, 10)
      );

  searchReligion = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .map((term) =>
        term == ""
          ? []
          : this.typeheadReligions
              .filter((v) => v.RELIGION_NAME_TH.indexOf(term) > -1)
              .slice(0, 10)
      );

  searchCountry = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .map((term) =>
        term == ""
          ? []
          : this.typeheadCountry
              .filter(
                (v) =>
                  (v.COUNTRY_SHORT_NAME &&
                    v.COUNTRY_SHORT_NAME.indexOf(term) > -1) ||
                  (v.COUNTRY_NAME_TH && v.COUNTRY_NAME_TH.indexOf(term) > -1)
              )
              .slice(0, 10)
      );

  addPersonAddress(): FormGroup {
    // this.MAS_PERSON_ADDRESS.push(
    return this.fb.group({
      PERSON_ADDRESS_ID: new FormControl(null),
      PERSON_ID: new FormControl(null),
      SUB_DISTRICT_ID: new FormControl(null, Validators.required),
      LATITUDE: new FormControl(null),
      LONGITUDE: new FormControl(null),
      ADDRESS_NO: new FormControl(null),
      VILLAGE_NO: new FormControl(null),
      BUILDING_NAME: new FormControl(null),
      GPS: new FormControl(null),
      ROOM_NO: new FormControl(null),
      FLOOR: new FormControl(null),
      VILLAGE_NAME: new FormControl(null),
      ALLEY: new FormControl(null),
      LANE: new FormControl(null),
      ROAD: new FormControl(null),
      ADDRESS_TYPE: new FormControl(null),
      ADDRESS_DESC: new FormControl(null),
      ADDRESS_STATUS: new FormControl(null),
      IS_ACTIVE: new FormControl(null),
      SUB_DISTRICT_NAME_TH: new FormControl(null),
      SUB_DISTRICT_NAME_EN: new FormControl(null),
      DISTRICT_NAME_TH: new FormControl(null),
      DISTRICT_NAME_EN: new FormControl(null),
      PROVINCE_NAME_TH: new FormControl(null),
      PROVINCE_NAME_EN: new FormControl(null),
      ///=== Customs ===///
      SUB_DISTRICT: new FormControl(null, Validators.required),
    });
    // );
  }

  // private createPersonAddressFormcontrol(): FormGroup {
  //   return this.fb.group(
  //     PERSON_ADDRESS_ID: new FormControl(null),
  //     PERSON_ID: new FormControl(null),
  //     SUB_DISTRICT_ID: new FormControl(null),
  //     LATITUDE: new FormControl(null),
  //     LONGITUDE: new FormControl(null),
  //     ADDRESS_NO: new FormControl(null),
  //     VILLAGE_NO: new FormControl(null),
  //     BUILDING_NAME: new FormControl(null),
  //     ROOM_NO: new FormControl(null),
  //     FLOOR: new FormControl(null),
  //     VILLAGE_NAME: new FormControl(null),
  //     ALLEY: new FormControl(null),
  //     LANE: new FormControl(null),
  //     ROAD: new FormControl(null),
  //     ADDRESS_TYPE: new FormControl(null),
  //     ADDRESS_DESC: new FormControl(null),
  //     ADDRESS_STATUS: new FormControl(null),
  //     IS_ACTIVE: new FormControl(null),
  //     SUB_DISTRICT_NAME_TH: new FormControl(null),
  //     SUB_DISTRICT_NAME_EN: new FormControl(null),
  //     DISTRICT_NAME_TH: new FormControl(null),
  //     DISTRICT_NAME_EN: new FormControl(null),
  //     PROVINCE_NAME_TH: new FormControl(null),
  //     PROVINCE_NAME_EN: new FormControl(null)
  //   )
  // }

  addPersonRelationship() {
    this.MAS_PERSON_RELATIONSHIP.push(
      this.fb.group({
        PERSON_RELATIONSHIP_ID: new FormControl(null),
        RELATIONSHIP_ID: new FormControl(null),
        PERSON_ID: new FormControl(null),
        TITLE_ID: new FormControl(null),
        TITLE_NAME_TH: new FormControl(null),
        TITLE_NAME_EN: new FormControl(null),
        TITLE_SHORT_NAME_TH: new FormControl(null),
        TITLE_SHORT_NAME_EN: new FormControl(null),
        FIRST_NAME: new FormControl(null),
        MIDDLE_NAME: new FormControl(null),
        LAST_NAME: new FormControl(null),
        OTHER_NAME: new FormControl(null),
        GENDER_TYPE: new FormControl(null),
        ID_CARD: new FormControl(null),
        BIRTH_DATE: new FormControl(null),
        BLOOD_TYPE: new FormControl(null),
        CAREER: new FormControl(null),
        PERSON_DESC: new FormControl(null),
        EMAIL: new FormControl(null),
        TEL_NO: new FormControl(null),
        IS_ACTIVE: new FormControl(null),
        ACTION: new FormControl(this.Action.ADD),
      })
    );
  }

  addPersonEducation() {
    this.MAS_PERSON_EDUCATION.push(
      this.fb.group({
        PERSON_EDUCATION_ID: new FormControl(null),
        PERSON_ID: new FormControl(null),
        EDUCATION_INSTITUTION: new FormControl(null),
        EDUCATION_LEVEL: new FormControl(null),
        EDUCATION_START_DATE: new FormControl(null),
        EDUCATION_FINISH_DATE: new FormControl(null),
        GPA: new FormControl(null),
        IS_ACTIVE: new FormControl(null),
      })
    );
  }

  openModal(e) {
    this.modal = this.ngModalService.open(e, { size: "lg", centered: true });
  }

  onPassportDateInChange(event: IMyDateModel) {
    let d = new Date(event.jsdate);
    d.setDate(d.getDate() - 1);
    this.passPortDateOutOption = {
      ...this.passPortDateOutOption,
      disableDateRanges: [
        {
          begin: {
            year: d.getFullYear() - 100,
            month: d.getMonth() + 1,
            day: d.getDate() + 1,
          },
          end: {
            year: d.getFullYear(),
            month: d.getMonth() + 1,
            day: d.getDate(),
          },
        },
      ],
    };
  }

  onPassportDateOutChange(event: IMyDateModel) {
    if (event.jsdate) {
      let d = new Date(event.jsdate);
      d.setDate(d.getDate() + 1);
      this.passportDateInOption = {
        ...this.passportDateInOption,
        disableDateRanges: [
          {
            begin: {
              year: d.getFullYear(),
              month: d.getMonth() + 1,
              day: d.getDate(),
            },
            end: {
              year: d.getFullYear() + 100,
              month: d.getMonth() + 1,
              day: d.getDate() + 1,
            },
          },
        ],
      };
    } else {
      this.passportDateInOption = {
        ...this.passportDateInOption,
        disableDateRanges: [
          {
            begin: { year: 0, month: 0, day: 0 },
            end: { year: 0, month: 0, day: 0 },
          },
        ],
      };
    }
  }

  onLicenseDateFromChange(event: IMyDateModel) {
    let d = new Date(event.jsdate);
    d.setDate(d.getDate() - 1);
    this.licenseDateToOption = {
      ...this.licenseDateToOption,
      disableUntil: {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        day: d.getDate(),
      },
    };
  }

  onLicenseDateToChange(event: IMyDateModel) {
    let d = new Date(event.jsdate);
    d.setDate(d.getDate() + 1);
    this.licenseDateFromOption = {
      ...this.licenseDateFromOption,
      disableSince: {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        day: d.getDate(),
      },
    };
  }

  selectItemCountry(e: any) {
    this.formGroup.patchValue({
      COUNTRY_ID: e.item.COUNTRY_ID,
      COUNTRY_NAME_TH: e.item.COUNTRY_NAME_TH,
    });
  }

  blurItemCountry(e: any) {
    if (!e.value)
      this.formGroup.patchValue({
        COUNTRY_ID: "",
        COUNTRY_NAME_TH: "",
      });
  }

  selectItemTitle(e: any) {
    this.formGroup.patchValue({
      TITLE: e.item,
      TITLE_ID: e.item.TITLE_ID,
      TITLE_NAME_EN: e.item.TITLE_NAME_EN,
      TITLE_NAME_TH: e.item.TITLE_NAME_TH,
      TITLE_SHORT_NAME_EN: e.item.TITLE_SHORT_NAME_EN,
      TITLE_SHORT_NAME_TH: e.item.TITLE_SHORT_NAME_TH,
    });
  }

  blurItemTitle(e: any) {
    if (!e.value)
      this.formGroup.patchValue({
        TITLE: "",
        TITLE_ID: "",
        TITLE_NAME_EN: "",
        TITLE_NAME_TH: "",
        TITLE_SHORT_NAME_EN: "",
        TITLE_SHORT_NAME_TH: "",
      });
  }

  selectItemTitle_ll(e: any) {
    // this.formGroup.patchValue({
    //   TITLE: e,
    //   TITLE_ID: e
    // })
  }

  selectItemTitleRelationship(e: any) {
    this.RELATIONSHIP_TITLE_ID = e.item.TITLE_ID;
    this.RELATIONSHIP_TITLE_SHORT_NAME_TH = e.item.TITLE_SHORT_NAME_TH;

    // this.MAS_PERSON_RELATIONSHIP.at(0).patchValue({
    //   TITLE: e,
    //   TITLE_ID: e,
    // // TITLE_NAME_EN: e.item.TITLE_NAME_EN,
    //  // TITLE_NAME_TH: e.item.TITLE_NAME_TH,
    // // TITLE_SHORT_NAME_EN: e.item.TITLE_SHORT_NAME_EN,
    // // TITLE_SHORT_NAME_TH: e.item.TITLE_SHORT_NAME_TH
    // })
  }

  selectItemRace(e: any) {
    this.formGroup.patchValue({
      RACE_ID: e.item.RACE_ID,
      RACE_NAME_TH: e.item.RACE_NAME_TH,
    });
  }

  blurItemRace(e: any) {
    if (!e.value)
      this.formGroup.patchValue({
        RACE_ID: "",
        RACE_NAME_TH: "",
      });
  }

  selectItemNationality(e: any) {
    this.formGroup.patchValue({
      NATIONALITY_ID: e.item.NATIONALITY_ID,
      NATIONALITY_NAME_TH: e.item.NATIONALITY_NAME_TH,
    });
  }

  blurItemNationality(e: any) {
    if (!e.value)
      this.formGroup.patchValue({
        NATIONALITY_ID: "",
        NATIONALITY_NAME_TH: "",
      });
  }

  selectItemReligion(e: any) {
    this.formGroup.patchValue({
      RELIGION_ID: e.item.RELIGION_ID,
      RELIGION_NAME_TH: e.item.RELIGION_NAME_TH,
    });
  }

  blurItemReligion(e: any) {
    if (!e.value)
      this.formGroup.patchValue({
        RELIGION_ID: "",
        RELIGION_NAME_TH: "",
      });
  }

  selectItemRelationship(e: any, i: number) {
    this.MAS_PERSON_RELATIONSHIP.at(i).patchValue({
      RELATIONSHIP_ID: e.item.RELATIONSHIP_ID,
    });
  }

  selectItemRelationTitle(e: any, i: number) {
    this.MAS_PERSON_RELATIONSHIP.at(i).patchValue({
      TITLE_ID: e.item.TITLE_ID,
      TITLE_NAME_TH: e.item.TITLE_NAME_TH,
      TITLE_NAME_EN: e.item.TITLE_NAME_EN,
      TITLE_SHORT_NAME_TH: e.item.TITLE_SHORT_NAME_TH,
      TITLE_SHORT_NAME_EN: e.item.TITLE_SHORT_NAME_EN,
    });
  }

  selectItemLocale(e: any, i: number) {
    this.MAS_PERSON_ADDRESS.at(i).patchValue({
      SUB_DISTRICT: e.item.SUB_DISTRICT_ID,
      SUB_DISTRICT_ID: e.item.SUB_DISTRICT_ID,
      SUB_DISTRICT_NAME_TH: e.item.SUB_DISTRICT_NAME_TH,
      SUB_DISTRICT_NAME_EN: e.item.SUB_DISTRICT_NAME_EN,
      DISTRICT_NAME_TH: e.item.DISTRICT_NAME_TH,
      DISTRICT_NAME_EN: e.item.DISTRICT_NAME_EN,
      PROVINCE_NAME_TH: e.item.PROVINCE_NAME_TH,
      PROVINCE_NAME_EN: e.item.PROVINCE_NAME_EN,
    });
  }

  blurSelectItemRegion(ele: any) {
    if (!ele.value)
      this.MAS_PERSON_ADDRESS.at(0).patchValue({
        SUB_DISTRICT: "",
        SUB_DISTRICT_ID: "",
        SUB_DISTRICT_NAME_TH: "",
        SUB_DISTRICT_NAME_EN: "",
        DISTRICT_NAME_TH: "",
        DISTRICT_NAME_EN: "",
        PROVINCE_NAME_TH: "",
        PROVINCE_NAME_EN: "",
      });
  }

  onDeleteEducation(i: number) {
    let trash = this.TrashMasPersonEducation;
    trash = [...trash, this.MAS_PERSON_EDUCATION.at(i).value];
    localStorage.setItem(LS.TrashMasPersonEducation, JSON.stringify(trash));

    this.MAS_PERSON_EDUCATION.removeAt(i);
  }

  onDeleteRelationship(i: number) {
    this.swalFnMulti("", Message.confirmAction, "warning").then((r) => {
      if (r.value) {
        this.TrashRelationship$.push(this.MAS_PERSON_RELATIONSHIP.at(i).value);
        this.MAS_PERSON_RELATIONSHIP.removeAt(i);
      }
    });
  }

  onDeleteAddress(i: number) {
    let trash = this.TrashMasPersonAddress;
    trash = [...trash, this.MAS_PERSON_ADDRESS.at(i).value];
    localStorage.setItem(LS.TrashMasPersonAddress, JSON.stringify(trash));

    this.MAS_PERSON_ADDRESS.removeAt(i);
  }

  RepresentativeCheckDel(e: any) {
    if (!e.value) {
      const MP_RELATIONSHIP = this.MAS_PERSON_RELATIONSHIP.length;
      this.RELATIONSHIP_TITLE_SHORT_NAME_TH = "";
      this.RELATIONSHIP_FIRST_NAME = "";
      this.RELATIONSHIP_LAST_NAME = "";
      if (MP_RELATIONSHIP > 0) {
        this.TrashRelationship$.push(this.MAS_PERSON_RELATIONSHIP.at(0).value);
        this.MAS_PERSON_RELATIONSHIP.removeAt(0);
      }
    }
    this.ReqRelationTitleName(e);
  }

  ReqRelationTitleName(e: any) {
    if (!e.value) this.REQ_RE_TITLE_NAME.next(false);
    else this.REQ_RE_TITLE_NAME.next(true);
  }

  RelationshipTitleNameChkDel(e: any) {
    if (!e.value) {
      if (this.MAS_PERSON_RELATIONSHIP.length)
        this.MAS_PERSON_RELATIONSHIP.at(0).patchValue({
          TITLE_ID: "",
          TITLE_NAME_TH: "",
          TITLE_NAME_EN: "",
          TITLE_SHORT_NAME_TH: "",
          TITLE_SHORT_NAME_EN: "",
        });
      this.RELATIONSHIP_TITLE_ID = "";
      this.RELATIONSHIP_TITLE_SHORT_NAME_TH = "";
    }
  }

  clickEdit() {
    this.enableBtnCreate();
  }

  clickSave() {
    const f = this.formGroup.getRawValue();
    if (f.PERSON_TYPE == null) {
      this.isRequired = true;
      this.swalFn("", `กรุณาระบุข้อมูล "ประเภทผู้ต้องหา"`, "warning");
      return false;
    }

    if (!f.TITLE_ID) {
      this.REQ_TITLE_NAME.next(true);
      this.swalFn("", `กรุณาระบุข้อมูล "คำนำหน้าชื่อ"`, "warning");
      return false;
    }

    if (!f.FIRST_NAME && f.PERSON_TYPE != 2) {
      this.REQ_FIRST_NAME.next(true);
      this.swalFn("", `กรุณาระบุข้อมูล "ชื่อจริง"`, "warning");
      return false;
    }

    this.setRelationshipWhenPersonType();

    if (f.PERSON_TYPE == "2") {
      if (!f.COMPANY_NAME) {
        this.REQ_COMPANY_NAME.next(true);
        this.swalFn("", `กรุณาระบุข้อมูล "ชื่อผู้ประกอบการ"`, "warning");
        return false;
      }

      const RELATION_TITLE = this.REQ_RE_TITLE_NAME.value;
      if (RELATION_TITLE)
        if (!this.RELATIONSHIP_TITLE_ID) {
          this.REQ_SUB_DISTRICT.next(true);
          this.swalFn("", `กรุณาระบุข้อมูล "คำนำหน้าชื่อผู้แทน"`, "warning");
          return false;
        }
    }

    if (!f.MAS_PERSON_ADDRESS[0].SUB_DISTRICT_ID) {
      this.REQ_SUB_DISTRICT.next(true);
      this.swalFn("", `กรุณาระบุข้อมูล "ตำบล/อำเภอ/จังหวัด"`, "warning");
      return false;
    }

    let obj = Object.assign({}, this.formGroup.value);
    obj["BIRTH_DATE"] = obj["BIRTH_DATE"]
      ? this.convertDateForSave(this.getDateMyDatepicker(obj["BIRTH_DATE"]))
      : null;
    obj["COMPANY_FOUND_DATE"] = obj["COMPANY_FOUND_DATE"]
      ? this.convertDateForSave(
          this.getDateMyDatepicker(obj["COMPANY_FOUND_DATE"])
        )
      : null;
    obj["COMPANY_LICENSE_DATE_FROM"] = obj["COMPANY_LICENSE_DATE_FROM"]
      ? this.convertDateForSave(
          this.getDateMyDatepicker(obj["COMPANY_LICENSE_DATE_FROM"])
        )
      : null;
    obj["COMPANY_LICENSE_DATE_TO"] = obj["COMPANY_LICENSE_DATE_TO"]
      ? this.convertDateForSave(
          this.getDateMyDatepicker(obj["COMPANY_LICENSE_DATE_TO"])
        )
      : null;
    obj["PASSPORT_DATE_IN"] = obj["PASSPORT_DATE_IN"]
      ? this.convertDateForSave(
          this.getDateMyDatepicker(obj["PASSPORT_DATE_IN"])
        )
      : null;
    obj["PASSPORT_DATE_OUT"] = obj["PASSPORT_DATE_OUT"]
      ? this.convertDateForSave(
          this.getDateMyDatepicker(obj["PASSPORT_DATE_OUT"])
        )
      : null;

    obj.MAS_PERSON_EDUCATION = obj.MAS_PERSON_EDUCATION.reduce((a, c) => {
      return [
        ...a,
        {
          ...c,
          EDUCATION_START_DATE: c.EDUCATION_START_DATE
            ? this.convertDateForSave(
                this.getDateMyDatepicker(c.EDUCATION_START_DATE)
              )
            : null,
          EDUCATION_FINISH_DATE: c.EDUCATION_FINISH_DATE
            ? this.convertDateForSave(
                this.getDateMyDatepicker(c.EDUCATION_FINISH_DATE)
              )
            : null,
        },
      ];
    }, []);

    obj.MAS_PERSON_ADDRESS = obj.MAS_PERSON_ADDRESS.reduce((a, c) => {
      return [
        ...a,
        {
          ...c,
          GPS: `${c["LATITUDE"]},${c["LONGITUDE"]}`,
        },
      ];
    }, []);

    obj.MAS_PERSON_RELATIONSHIP = obj.MAS_PERSON_RELATIONSHIP.reduce((a, c) => {
      return [
        ...a,
        {
          ...c,
          BIRTH_DATE: c.BIRTH_DATE
            ? this.convertDateForSave(this.getDateMyDatepicker(c.BIRTH_DATE))
            : null,
        },
      ];
    }, []);

    switch (this.mode) {
      case this.ModeAction.C:
        this.PersonInsert(obj);
        break;

      case this.ModeAction.R:
        this.PersonUpdate(obj);
        break;
    }
  }

  clickCancel() {
    this.swalFnMulti("", Message.confirmAction, "warning").then((result) => {
      if (result.value) {
        switch (this.mode) {
          case this.ModeAction.C:
            this.c.emit("close click");
            break;
          case this.ModeAction.R:
            this.ActiveRoute();
            break;

          default:
            break;
        }
      }
    });
  }

  PersonInsert(obj: any) {
    this.loaderService.showLoader();
    const observe = this.s_Person.MasPersoninsAll(obj).pipe(
      mergeMap((x) => {
        const PERSON_ID = x.RESPONSE_DATA;
        this.PERSON_ID = x.RESPONSE_DATA;
        return merge(
          Observable.of(x),
          this.PersonDocumentModify(PERSON_ID)
        ).finally(() => this.loaderService.onEnd());
      })
    );
    let result = [];
    let zip$ = new Observable<any>();

    zip$ = Observable.zip(observe).pipe(
      map((x) => {
        return (result = [...result, ...x]);
      })
    );

    forkJoin(zip$).subscribe(
      (x) => {
        const objRes: any[] = x[0];

        if (objRes.filter((o) => o["IsSuccess"] == "False").length) {
          this.swalFn("", Message.saveFail, "warning");
        } else {
          this.swalFn("", Message.saveComplete, "success").then((r) => {
            if (r) this.transferringData(this.PERSON_ID);
          });
        }
      },
      () => {
        this.swalFn("", Message.saveFail, "warning");
      }
    );
  }

  PersonUpdate(obj: any) {
    this.loaderService.showLoader();
    let result = [];
    let zip$ = new Observable<any>();
    const PERSON_ID = obj["PERSON_ID"];

    const observe = merge(
      this.s_Person.MasPersonupdAll(obj),
      this.modifyMasPersonAddress(PERSON_ID),
      this.modifyMasPersonEducation(PERSON_ID),
      this.modifyMasPersonRelationship(PERSON_ID),
      this.PersonDocumentModify(PERSON_ID)
    ).finally(() => this.loaderService.onEnd());

    zip$ = Observable.zip(observe).pipe(
      map((x) => {
        return (result = [...result, ...x]);
      })
    );

    forkJoin(zip$).subscribe(
      (x) => {
        const objRes: any[] = x[0];
        console.log(objRes);

        if (objRes.filter((o) => o["IsSuccess"] == "False").length) {
          this.swalFn("", Message.saveFail, "warning");
        } else {
          this.swalFn("", Message.saveComplete, "success").then((r) => {
            if (r) this.ActiveRoute();
          });
        }
      },
      () => {
        this.swalFn("", Message.saveFail, "warning");
      }
    );
  }

  transferringData(PERSON_ID) {
    this.loaderService.showLoader();
    this.s_Person
      .MasPersongetByCon({ TEXT_SEARCH: "", PERSON_ID })
      .subscribe((x) => {
        const obj = x.find((x) => x.PERSON_ID == PERSON_ID);
        this.loaderService.onEnd();
        const newObj: any[] = [];
        newObj.push(obj);
        const lawbreakerObj = newObj.map((x: any) => {
          const lawbreaker: any = {
            LAWBREAKER_ID: null,
            ARREST_ID: null,
            PERSON_ID: x.PERSON_ID,
            TITLE_ID: null,
            PERSON_TYPE: x.PERSON_TYPE,
            ENTITY_TYPE: x.ENTITY_TYPE,
            TITLE_NAME_TH: x.TITLE_NAME_TH,
            TITLE_NAME_EN: x.TITLE_NAME_EN,
            TITLE_SHORT_NAME_TH: x.TITLE_SHORT_NAME_TH,
            TITLE_SHORT_NAME_EN: x.TITLE_SHORT_NAME_EN,
            FIRST_NAME: x.FIRST_NAME,
            MIDDLE_NAME: x.MIDDLE_NAME,
            LAST_NAME: x.LAST_NAME,
            OTHER_NAME: x.OTHER_NAME,
            COMPANY_REGISTRATION_NO: x.COMPANY_REGISTRATION_NO,
            COMPANY_NAME: x.COMPANY_NAME,
            EXCISE_REGISTRATION_NO: null,
            ID_CARD: x.ID_CARD,
            AGE: null,
            PASSPORT_NO: x.PASSPORT_NO,
            CAREER: null,
            PERSON_DESC: null,
            EMAIL: null,
            TEL_NO: null,
            MISTREAT_NO: x.MISTREAT_NO,
            IS_ACTIVE: 1,
          };
          return lawbreaker;
        });
        this.Output.emit(lawbreakerObj);
        this.c.emit("Save click");
      });
  }

  PersonDocumentModify(REFERENCE_CODE: string): Observable<any> {
    let ins = this.ILG60_03_02_00_00_E28$.getValue();

    let del = this.DELDOC_E28$.getValue();

    ins = this.filterAction(ins, this.Action.ADD);

    if (ins.length > 0)
      ins = ins.reduce(
        (accu, curr) => [
          ...accu,
          { ...curr, REFERENCE_CODE, DOCUMENT_TYPE: this.DOCUMENT_TYPE$ },
        ],
        []
      );

    if (del.length)
      del = del.reduce(
        (acc, curr) => [...acc, { DOCUMENT_ID: curr.DOCUMENT_ID }],
        []
      );

    let ins$ = () =>
      from(ins).pipe(mergeMap((x) => this.s_Document.DocumentinsAll(x)));

    let del$ = () =>
      from(del).pipe(mergeMap((x) => this.s_Document.DocumentupdDelete(x)));

    return merge(
      ins.length > 0 ? ins$() : Observable.of(),
      del.length > 0 ? del$() : Observable.of()
    );
  }

  filterAction = (form: any[], action: string) =>
    form.filter((x) => x["ACTION"] === action);

  reducerArrayItem = (form: any[], item: string): any[] =>
    form.reduce((accu, curr) => [...accu, { [item]: curr[item] }], []);

  modifyMasPersonEducation(PERSON_ID: number) {
    let ins = this.filterAction(
      this.MAS_PERSON_EDUCATION.value,
      this.Action.ADD
    );
    let upd = this.filterAction(
      this.MAS_PERSON_EDUCATION.value,
      this.Action.EDIT
    );
    let del = this.TrashMasPersonEducation as any[];

    if (ins.length > 0)
      ins = ins.reduce((accu, curr) => [...accu, { ...curr, PERSON_ID }], []);

    if (del.length > 0) del = this.reducerArrayItem(del, "PERSON_EDUCATION_ID");

    return merge(
      ins.length > 0
        ? this.s_Person.MasPersonEducationinsAll(ins)
        : Observable.of(),
      upd.length > 0
        ? this.s_Person.MasPersonEducationupdAll(upd)
        : Observable.of(),
      del.length > 0
        ? this.s_Person.MasPersonEducationupdDelete(del)
        : Observable.of()
    );
  }

  modifyMasPersonRelationship(PERSON_ID: number) {
    let ins = this.filterAction(
      this.MAS_PERSON_RELATIONSHIP.value,
      this.Action.ADD
    );
    let upd = this.filterAction(
      this.MAS_PERSON_RELATIONSHIP.value,
      this.Action.EDIT
    );
    let del = this.TrashRelationship$; // this.TrashMasPersonRelationship as any[];

    if (ins.length > 0)
      ins = ins.reduce((accu, curr) => [...accu, { ...curr, PERSON_ID }], []);

    if (del.length > 0)
      del = this.reducerArrayItem(del, "PERSON_RELATIONSHIP_ID");

    let ins$ = () =>
      from(ins).pipe(
        mergeMap((x) => this.s_Person.MasPersonRelationshipinsAll(x))
      );
    console.log("upd : ", upd);
    return merge(
      ins.length > 0 ? ins$() : Observable.of(),
      upd.length > 0
        ? this.s_Person.MasPersonRelationshipupdAll(upd)
        : Observable.of(),
      del.length > 0
        ? this.s_Person.MasPersonRelationshipupdDelete(del)
        : Observable.of()
    );
  }

  modifyMasPersonAddress(PERSON_ID: number) {
    let ins = this.filterAction(this.MAS_PERSON_ADDRESS.value, this.Action.ADD);
    let upd = this.filterAction(
      this.MAS_PERSON_ADDRESS.value,
      this.Action.EDIT
    );
    let del = this.TrashMasPersonAddress as any[];

    if (ins.length > 0)
      ins = ins.reduce((accu, curr) => [...accu, { ...curr, PERSON_ID }], []);

    if (del.length > 0) del = this.reducerArrayItem(del, "PERSON_ADDRESS_ID");

    return merge(
      ins.length > 0
        ? this.s_Person.MasPersonAddressinsAll(ins)
        : Observable.of(),
      upd.length > 0
        ? this.s_Person.MasPersonAddressupdAll(upd)
        : Observable.of(),
      del.length > 0
        ? this.s_Person.MasPersonAddressupdDelete(del)
        : Observable.of()
    );
  }

  setButton() {
    if (this.mode === this.ModeAction.C) {
      this.enableBtnCreate();
    } else if (this.mode === this.ModeAction.R) {
      this.enableBtnEdit();
    }
  }

  setRelationshipWhenPersonType() {
    const p = this.formGroup.get("PERSON_TYPE").value;
    if (p == 2)
      if (this.RELATIONSHIP_FIRST_NAME) {
        let r = this.MAS_PERSON_RELATIONSHIP.length;
        r < 1 ? this.addPersonRelationship() : false;
        this.MAS_PERSON_RELATIONSHIP.at(0).patchValue({
          TITLE_ID: this.RELATIONSHIP_TITLE_ID,
          TITLE_SHORT_NAME_TH: this.RELATIONSHIP_TITLE_SHORT_NAME_TH,
          FIRST_NAME: this.RELATIONSHIP_FIRST_NAME,
          LAST_NAME: this.RELATIONSHIP_LAST_NAME,
          RELATIONSHIP_ID: 3,
        });
      }
  }

  enableBtnCreate() {
    // set false
    this.btn_onPrint.next(false);
    this.btn_onEdit.next(false);
    this.btn_onDelete.next(false);
    this.isEdit = false;
    // set true
    this.btn_onSave.next(true);
    this.btn_onCancel.next(true);
  }

  enableBtnEdit() {
    // set false
    this.btn_onSave.next(false);
    this.btn_onCancel.next(false);
    // set true
    this.btn_onPrint.next(true);
    this.btn_onEdit.next(true);
    this.btn_onDelete.next(true);
    this.isEdit = true;
  }

  closePopup() {
    this.c.emit("Save click");
  }
}
