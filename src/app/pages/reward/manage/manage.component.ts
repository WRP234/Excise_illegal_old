import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
  OnDestroy,
  TemplateRef,
} from "@angular/core";
import { NavigationService } from "../../../shared/header-navigation/navigation.service";
import { Router, ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {
  FormGroup,
  FormControl,
  NgForm,
  FormArray,
  FormBuilder,
  FormControlName,
  Form,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { RewardService } from "../reward.service";
import { toLocalShort, setZero } from "app/config/dateFormat";
import { CurrencyPipe } from "@angular/common";
import { Document } from "../reward_document";
import swal from "sweetalert2";
import { PreloaderService } from "../../../shared/preloader/preloader.component";
import { saveAs } from "file-saver";
import { IMyDateModel, IMyOptions } from "mydatepicker-th";
import { Observable, of, generate } from "rxjs";
import {
  MasOfficeModel,
  MasOfficeModel_New,
} from "../../../models/mas-office.model";
import { MainMasterService } from "../../../services/main-master.service";
import { CommentStmt } from "@angular/compiler";
import "rxjs/add/operator/map";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/observable/of";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/do";
import "rxjs/add/operator/switchMap";
import { async } from "@angular/core/testing";
import { ignoreElements } from "rxjs-compat/operator/ignoreElements";
import { PrintDocModalComponent } from "../../reward/printdoc-modal/printdoc-modal.component";
import { param } from "jquery";
import { RewardHelper } from "../reward.helper";
import { promise } from "protractor";

@Component({
  selector: "app-manage",
  templateUrl: "./manage.component.html",
  styleUrls: ["./manage.component.scss"],
})
export class ManageComponent extends RewardHelper implements OnInit, OnDestroy {
  form_Collapse1: FormGroup;
  form_BRIBE_MONEY: FormGroup;
  form_REWARD_MONEY: FormGroup;
  controlForm: FormGroup;
  person: FormGroup;

  mode: any;
  INDICTMENT_ID: any = "";
  PAYMENT_FINE: any;
  TREASURY_MONEY: any;
  BRIBE_MONEY: any;
  REWARD_MONEY: any;
  TOTAL_BRIBE_REWARD: any;
  HAVE_NOTICE: any;
  REWARD_TYPE = 1;
  COMPARE_NO: any;
  BRIDE_ID: any;
  REWARD_ID: any;
  BRIBE_REWARD_ID: any;
  NOTICE_ID: any;
  COMPARE_ID: any;
  ///////////button///////////
  createButton: boolean = false;
  printButton: boolean = false;
  editButton: boolean = false;
  deleteButton: boolean = false;
  saveButton: boolean = false;
  saveEditButton: boolean = false;
  cancelButton: boolean = false;
  showEditField = false;
  office_code: any;
  office_id: any;
  ARREST_ID: any;
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private navService: NavigationService,
    private ngbModal: NgbModal,
    private fb: FormBuilder,
    private RewardService: RewardService,
    private currencyPipe: CurrencyPipe,
    private preloader: PreloaderService,
    private mainMasterService: MainMasterService
  ) {
    super();
  }

  ngOnInit() {
    this.preloader.setShowPreloader(true);
    localStorage.setItem("programcode", "ILG60-09-00");
    this.office_code = localStorage.getItem("officeCode");

    let params = {
      OFFICE_ID: "",
      TEXT_SEARCH: localStorage.getItem("officeShortName"),
    };
    this.RewardService.MasOfficegetByCon("MasOfficegetByCon", params).then(
      (res) => {
        this.office_id = res.RESPONSE_DATA[0].OFFICE_ID;
      }
    );

    this.myDatePickerNotSetFromOptions.disableDateRanges = [
      this.getDisCurrDateMyDatePicker(),
    ];
    this.preloader.setShowPreloader(false);
    this.setForm();
  }

  get ControlStaff(): FormArray {
    return this.controlForm.get("setStaff") as FormArray;
  }
  get PAYMENT_DETAI(): FormArray {
    return this.controlForm.get("PAYMENT_DETAI") as FormArray;
  }
  get ControlStaffBRIBE(): FormArray {
    return this.form_BRIBE_MONEY.get("setStaff") as FormArray;
  }
  get ControlStaffREWARD(): FormArray {
    return this.form_REWARD_MONEY.get("setStaff") as FormArray;
  }

  setForm() {
    this.preloader.setShowPreloader(true);
    this.activeRoute.params.subscribe((p) => {
      this.mode = p.mode;
      if (this.mode == "C") {
        this.INDICTMENT_ID = p.code;
        this.createButton = false;
        this.printButton = false;
        this.editButton = false;
        this.deleteButton = false;
        this.saveButton = true;
        this.saveEditButton = false;
        this.cancelButton = true;
        this.showEditField = false;
        this.setFormControl();
        this.loadData();
      } else if (this.mode == "R") {
        this.INDICTMENT_ID = p.code;
        this.BRIDE_ID = p.code2;
        this.REWARD_ID = p.code3;
        this.printButton = true;
        this.editButton = true;
        this.deleteButton = true;
        this.saveButton = false;
        this.saveEditButton = false;
        this.cancelButton = false;
        this.showEditField = true;
        if (this.BRIDE_ID == "0") {
          this.setOfficeStore2();
          this.collapse1 = new BehaviorSubject<Boolean>(true);
          this.collapse2 = new BehaviorSubject<Boolean>(true);
          this.collapse3 = new BehaviorSubject<Boolean>(true);
          this.collapse5 = new BehaviorSubject<Boolean>(true);
          this.collapse6 = new BehaviorSubject<Boolean>(true);
          this.collapse7 = new BehaviorSubject<Boolean>(true);
          this.setFormControl2();
          this.preloader.setShowPreloader(false);
        } else {
          this.setOfficeStore2();
          this.collapse1 = new BehaviorSubject<Boolean>(true);
          this.collapse2 = new BehaviorSubject<Boolean>(true);
          this.collapse3 = new BehaviorSubject<Boolean>(true);
          this.collapse5 = new BehaviorSubject<Boolean>(true);
          this.collapse6 = new BehaviorSubject<Boolean>(true);
          this.collapse7 = new BehaviorSubject<Boolean>(true);
          this.setFormControl3();
          this.preloader.setShowPreloader(false);
        }
      }
    });
  }

  //A_STATUS == 0 -> สายลับขอปิดนาม
  //A_STATUS == 1 -> เจ้าหน้าที่ตามเส้น api
  //A_STATUS == 2 -> เจ้าหน้าที่ที่เพิ่มเข้ามา
  //A_STAFF_TYPE == 0 -> ไม่มีปุ่มถังขยะ
  //A_STAFF_TYPE == 1 -> มีถังขยะ

  /////////////////////////////////////////////////////////////////////////////////////////////mode C///////////////////////////////////////////////////////////////////////////////////////////////
  setFormControl() {
    this.person = this.fb.group({
      detail: this.fb.array([]),
    });

    this.form_Collapse1 = this.fb.group({
      ARREST_CODE: new FormControl(""),
      OCCURRENCE_DATE: new FormControl(""),
      OCCURRENCE_TIME: new FormControl(""),
      SUB_DISTRICT_NAME: new FormControl(""),
      ARREST_STAFF: new FormControl(""),
      OPREATION_POS_NAME: new FormControl(""),
      OPERATION_OFFICE_NAME: new FormControl(""),
      SUBSECTION_NAME: new FormControl(""),
      SECTION_NAME: new FormControl(""),
      GUILTBASE_NAME: new FormControl(""),
      PENALTY_DESC: new FormControl(""),
      LAWSUIT_NO: new FormControl(""),
      LAWSUIT_NO_YEAR: new FormControl(""),
      LAWSUIT_DATE: new FormControl(""),
      LAWSUIT_TIME: new FormControl(""),
      NOTICE_ID: new FormControl(""),
      ARREST_ID: new FormControl(""),
    });

    this.form_BRIBE_MONEY = this.fb.group({
      NOTICE_CODE: new FormControl(""),
      NOTICE_DATE: new FormControl(""),
      NOTICE_TIME: new FormControl(""),
      LAWBREAKER_NAME: new FormControl(""),
      NOTICE_STAFF: new FormControl(""),
      OPERATION_DEPT_NAME: new FormControl(""),
      BRIBE_CODE: new FormControl(""),
      BRIBE_OFFICE_CODE: new FormControl(""),
      BRIBE_OFFICE_NAME: new FormControl(""),
      BRIBE_OFFICE_SHORT_NAME: new FormControl(""),
      BRIBE_OFFICE_ID: new FormControl(""),
      BRIBE_DATE: new FormControl(""),
      BRIBE_TIME: new FormControl(""),
      APPROVE_PAYMENT_DATE: new FormControl(""),
      APPROVE_PAYMENT_TIME: new FormControl(""),
      INFORMER_INFO: new FormControl(""), //ผู้แจ้งความได้ทราบว่า
      AUTHORITY_DESC: new FormControl(""), //ความเห็นของผู้มีอำนาจอนุมัติ
      IS_ACTIVE: new FormControl(""),
      IS_PAY: new FormControl(""),
      BRIBE_MONEY: new FormControl(""),
      INDICTMENT_ID: new FormControl(this.INDICTMENT_ID),
      HAVE_NOTICE: new FormControl(""),
      BRIBE_REWARD_ID: new FormControl(""),
      setStaff: this.fb.array([this.set_CONTRIBUTOR_ID38()]),
    });

    this.form_REWARD_MONEY = this.fb.group({
      COMPARE_NO: new FormControl(""),
      COMPARE_NO_YEAR: new FormControl(""),
      REWARD_CODE: new FormControl(""),
      REWARD_TYPE: new FormControl(""),
      REFFERENCE_CODE: new FormControl(""),
      REWARD_OFFICE_CODE: new FormControl(""),
      REWARD_OFFICE_NAME: new FormControl(""),
      REWARD_OFFICE_SHORT_NAME: new FormControl(""),
      REWARD_OFFICE_ID: new FormControl(""),
      REWARD_DATE: new FormControl(""),
      REWARD_TIME: new FormControl(""),
      FIRST_PART_TOTAL: new FormControl(""),
      FIRST_MONEY_TOTAL: new FormControl(""),
      FIRST_MONEY_PER_PART: new FormControl(""),
      FIRST_REMAINDER: new FormControl(""),
      SECOND_PART_TOTAL: new FormControl(""),
      SECOND_MONEY_TOTAL: new FormControl(""),
      SECOND_MONEY_PER_PART: new FormControl(""),
      SECOND_REMAINDER: new FormControl(""),
      REWARD_MONEY: new FormControl(""),
      BRIBE_MONEY: new FormControl(""),
      AUTHORITY_DESC: new FormControl(""), //ความเห็นของผู้มีอำนาจอนุมัติ รว.4 หรือ รว.5
      AUTHORITY_COMMAND_DESC: new FormControl(""), //ความเห็นและคำสั่งของผู้บังคับบัญชา รว.7
      APPROVE_PAYMENT_DATE: new FormControl(""), //วันที่จ่ายเงินรางวัล
      APPROVE_PAYMENT_TIME: new FormControl(""),
      IS_ACTIVE: new FormControl(""),
      IS_PAY: new FormControl(""),
      PAYMENT_ID: new FormControl(""),
      BRIBE_REWARD_ID: new FormControl(""),
      setStaff: this.fb.array([
        this.set_CONTRIBUTOR_ID43(),
        this.set_CONTRIBUTOR_ID44(),
        this.set_CONTRIBUTOR_ID45(),
      ]),
    });
    this.controlForm = this.fb.group({
      PAYMENT_DETAIL: this.fb.array([]),
      PAYMENT_FINE: new FormControl(""),
      TREASURY_MONEY: new FormControl(""),
      BRIBE_MONEY: new FormControl(""),
      REWARD_MONEY: new FormControl(""),
      TOTAL_BRIBE_REWARD: new FormControl(""),
    });
  }

  APPROVE_PAYMENT_TIME = false;

  async loadData() {
    let params = { INDICTMENT_ID: this.INDICTMENT_ID };
    let res = await this.RewardService.RequestArrestLawsuitProveComparegetByCon(
      "RequestArrestLawsuitProveComparegetByCon",
      params
    );

    if (res.length) {
      let re = [];
      re.push(res[0]);

      let parama = { COMPARE_ID: res[0].COMPARE_ID };
      let com = await this.RewardService.ComparegetByCon(
        "ComparegetByCon",
        parama
      );
      this.COMPARE_ID = await com.COMPARE_ID;

      let control = <FormArray>this.person.controls.detail;

      await com.CompareMapping.map(async (m) => {
        if (m.CompareArrestIndictmentDetail.length == 0) {
          this.setcollapse5 = false;
        } else {
          this.setcollapse5 = true;
          await m.CompareArrestIndictmentDetail.map((person) => {
            if (person.TITLE_SHORT_NAME_TH == "null") {
              person.TITLE_SHORT_NAME_TH = "";
            }
            if (person.TITLE_SHORT_NAME_EN == "null") {
              person.TITLE_SHORT_NAME_EN = "";
            }
            if (person.FIRST_NAME == "null") {
              person.FIRST_NAME = "";
            }
            if (person.MIDDLE_NAME == "null") {
              person.MIDDLE_NAME = "";
            }
            if (person.LAST_NAME == "null") {
              person.LAST_NAME = "";
            }
            if (person.COMPANY_NAME == "null") {
              person.COMPANY_NAME = "";
            }

            var name = "";
            if (person.PERSON_TYPE == 0) {
              name = `${person.TITLE_SHORT_NAME_TH || ""}${
                person.FIRST_NAME || ""
              } ${person.MIDDLE_NAME || ""} ${person.LAST_NAME || ""}`;
            } else if (person.PERSON_TYPE == 1) {
              name = `${person.TITLE_SHORT_NAME_EN || ""}${
                person.FIRST_NAME || ""
              } ${person.MIDDLE_NAME || ""} ${person.LAST_NAME || ""}`;
            } else {
              name = `${person.TITLE_SHORT_NAME_TH || ""}${
                person.COMPANY_NAME || ""
              }`;
            }

            m.CompareDetail.map((d) => {
              control.push(
                this.fb.group({
                  NAME: new FormControl(name),
                  // RECEIPT: new FormControl(d.RECEIPT_NO + '/' + d.RECEIPT_BOOK_NO),
                  RECEIPT: new FormControl(
                    this.setReceiotBookNo(d.RECEIPT_BOOK_NO, d.RECEIPT_NO)
                  ),
                  //setReceiotBookNo
                  BRIBE_MONEY: new FormControl(d.BRIBE_MONEY),
                  REWARD_MONEY: new FormControl(d.REWARD_MONEY),
                  TREASURY_MONEY: new FormControl(d.TREASURY_MONEY),
                  FINE: new FormControl(d.PAYMENT_FINE),
                })
              );
            });
          });
        }
      });

      await re.map(async (m) => {
        let HAVE_NOTICE;
        if (m.NOTICE_ID == null || m.NOTICE_ID == "") {
          HAVE_NOTICE = 0;
          this.HAVE_NOTICE = 0;
        } else {
          HAVE_NOTICE = 1;
          this.HAVE_NOTICE = 1;
        }
        let PAYMENT_ID;
        if (m.PAYMENT_ID == null) {
          PAYMENT_ID = "";
        } else {
          PAYMENT_ID = m.PAYMENT_ID;
        }
        this.COMPARE_NO = await m.COMPARE_NO;

        await this.form_Collapse1.patchValue({
          ARREST_CODE: m.ARREST_CODE || "",
          OCCURRENCE_DATE: m.OCCURRENCE_DATE || "",
          OCCURRENCE_TIME: m.OCCURRENCE_TIME || "",
          SUB_DISTRICT_NAME:
            m.SUB_DISTRICT_NAME_TH +
              " " +
              m.DISTRICT_NAME_TH +
              " " +
              m.PROVINCE_NAME_TH || "",
          ARREST_STAFF: m.ARREST_STAFF_NAME || "",
          OPREATION_POS_NAME: m.OPREATION_POS_NAME || "",
          OPERATION_OFFICE_NAME: m.OPERATION_OFFICE_SHORT_NAME || "",
          SUBSECTION_NAME: m.SUBSECTION_NAME || "",
          SECTION_NAME: m.SECTION_NAME || "",
          GUILTBASE_NAME: m.GUILTBASE_NAME || "",
          PENALTY_DESC: m.PENALTY_DESC || "",
          LAWSUIT_NO: m.LAWSUIT_NO ? m.LAWSUIT_NO.split("/")[0] : "",
          LAWSUIT_NO_YEAR: m.LAWSUIT_NO_YEAR || "",
          LAWSUIT_DATE: m.LAWSUIT_DATE || "",
          LAWSUIT_TIME: m.LAWSUIT_TIME || "",
          NOTICE_ID: m.NOTICE_ID || "",
          ARREST_ID: m.ARREST_ID || "",
        });

        await this.form_BRIBE_MONEY.patchValue({
          NOTICE_CODE: m.NOTICE_CODE || "",
          NOTICE_DATE: m.NOTICE_DATE || "",
          NOTICE_TIME: m.NOTICE_TIME || "",
          LAWBREAKER_NAME: m.NOTICE_INFORMER || "",
          NOTICE_STAFF: m.NOTICE_STAFF || "",
          OPERATION_DEPT_NAME: m.NOTICE_OPREATION_POS_NAME || "",
          BRIBE_CODE: "Auto Generate",
          BRIBE_OFFICE_CODE: "",
          BRIBE_OFFICE_NAME: "",
          BRIBE_OFFICE_SHORT_NAME: "",
          BRIBE_OFFICE_ID: "",
          BRIBE_DATE: this.toDatePickerFormat(new Date()),
          BRIBE_TIME: this.getTimeNow(new Date()),
          APPROVE_PAYMENT_DATE: "",
          APPROVE_PAYMENT_TIME: "",
          INFORMER_INFO: "",
          AUTHORITY_DESC: "",
          IS_ACTIVE: 1,
          IS_PAY: "",
          BRIBE_MONEY: "",
          HAVE_NOTICE: HAVE_NOTICE,
          // setStaff :[],
        });

        await this.form_REWARD_MONEY.patchValue({
          COMPARE_NO: m.COMPARE_NO,
          COMPARE_NO_YEAR: m.COMPARE_NO_YEAR,
          REWARD_CODE: "Auto Generate",
          REWARD_TYPE: "",
          REFFERENCE_CODE: "",
          REWARD_OFFICE_CODE: "",
          REWARD_OFFICE_NAME: "",
          REWARD_OFFICE_SHORT_NAME: "",
          REWARD_OFFICE_ID: "",
          REWARD_DATE: this.toDatePickerFormat(new Date()),
          REWARD_TIME: this.getTimeNow(new Date()),
          FIRST_PART_TOTAL: "",
          FIRST_MONEY_TOTAL: "",
          FIRST_MONEY_PER_PART: "",
          FIRST_REMAINDER: "",
          SECOND_PART_TOTAL: "",
          SECOND_MONEY_TOTAL: "",
          SECOND_MONEY_PER_PART: "",
          SECOND_REMAINDER: "",
          REWARD_MONEY: "",
          BRIBE_MONEY: "",
          AUTHORITY_DESC: "", //ความเห็นของผู้มีอำนาจอนุมัติ รว.4 หรือ รว.5
          AUTHORITY_COMMAND_DESC: "", //ความเห็นและคำสั่งของผู้บังคับบัญชา รว.7
          APPROVE_PAYMENT_DATE: "",
          APPROVE_PAYMENT_TIME: "",
          IS_ACTIVE: 1,
          IS_PAY: "",
          PAYMENT_ID: PAYMENT_ID,
          // setStaff :[],
        });

        this.PAYMENT_FINE = this.person_PAYMENT_FINE();
        this.TREASURY_MONEY = this.person_TREASURY_MONEY();
        this.BRIBE_MONEY = this.person_BRIBE_MONEY();
        this.REWARD_MONEY = this.person_REWARD_MONEY();
        this.TOTAL_BRIBE_REWARD =
          this.person_BRIBE_MONEY() + this.person_REWARD_MONEY();

        await this.controlForm.patchValue({
          PAYMENT_FINE: this.person_PAYMENT_FINE(),
          TREASURY_MONEY: this.person_TREASURY_MONEY(),
          BRIBE_MONEY: this.person_BRIBE_MONEY(),
          REWARD_MONEY: this.person_REWARD_MONEY(),
          TOTAL_BRIBE_REWARD:
            this.person_BRIBE_MONEY() + this.person_REWARD_MONEY(),
        });
      });
    } else {
      swal("", "RequestArrestLawsuitProveComparegetByCon no data!", "warning");
    }

    await this.mainMasterService
      .MasOfficegetByCon()
      .then((res) => (this.typeheadOffice = res.RESPONSE_DATA));

    let officeCode = await localStorage.getItem("officeCode");
    for (let l of this.typeheadOffice) {
      let code = l.OFFICE_CODE;
      if (officeCode == code) {
        this.form_BRIBE_MONEY.patchValue({
          BRIBE_OFFICE_CODE: l.OFFICE_CODE || "",
          BRIBE_OFFICE_NAME: l.OFFICE_SHORT_NAME || "",
          BRIBE_OFFICE_SHORT_NAME: l.OFFICE_SHORT_NAME || "",
          BRIBE_OFFICE_ID: l.OFFICE_ID || "",
        });
        this.form_REWARD_MONEY.patchValue({
          REWARD_OFFICE_CODE: l.OFFICE_CODE || "",
          REWARD_OFFICE_NAME: l.OFFICE_SHORT_NAME || "",
          REWARD_OFFICE_SHORT_NAME: l.OFFICE_SHORT_NAME || "",
          REWARD_OFFICE_ID: l.OFFICE_ID || "",
        });
        break;
      }
    }

    await this.setPerson();
    this.preloader.setShowPreloader(false);
  }

  private setPerson() {
    let control = <FormArray>this.controlForm.controls.PAYMENT_DETAIL;
    let params = { INDICTMENT_ID: this.INDICTMENT_ID };

    this.RewardService.RequestStaffListgetByCon(
      "RequestStaffListgetByCon",
      params
    ).then(async (res) => {
      const arrest = res.requestArrestStaffs;
      const Notice = res.requestNoticeStaffs;
      const Lawsuit = res.requestLawsuitStaffs;
      const Prove = res.requestProveStaffs;
      const Compare = res.requestCompareStaffs;
      const Revenue = res.requestRevenueStaffs;
      if (res.NOTICE_ID !== null) {
        control.push(
          this.fb.group({
            A_CONTRIBUTOR: new FormControl("ผู้แจ้งความนำจับ"),
            A_CONTRIBUTOR_ID: new FormControl(""),
            A_MANAGEMENT_POS_LEVEL: new FormControl(""),
            A_MANAGEMENT_POS_LEVEL_NAME: new FormControl(""),
            A_MANAGEMENT_POS_NAME: new FormControl(""),
            A_OPERATION_POS_LEVEL_NAME: new FormControl(""),
            A_OPREATION_POS_LEVEL: new FormControl(""),
            A_OPREATION_POS_NAME: new FormControl(""),
            A_PART_I: new FormControl(0),
            A_PART_II: new FormControl(""),
            A_STAFF: new FormControl(""),
            A_STAFF_ID: new FormControl(""),
            A_TITLE_ID: new FormControl(""),
            A_TITLE_SHORT_NAME_TH: new FormControl(""),
            A_NAME: new FormControl("สายลับ(ขอปิดนาม)"),
            A_STAFF_TYPE: new FormControl(0),
            A_MONEY_I: new FormControl(0),
            A_MONEY_II: new FormControl(0),
            MONEY_TOTAL: new FormControl(this.BRIBE_MONEY),
            A_MONEY_III: new FormControl(0),
            A_STATUS: new FormControl(0),

            FULL_NAME: new FormControl(""),
            STAFF_ID: new FormControl(""),
            REWARD_ID: new FormControl(""),
            STAFF_REF_ID: new FormControl(""),
            TITLE_ID: new FormControl(""),
            STAFF_CODE: new FormControl(""),
            ID_CARD: new FormControl(""),
            STAFF_TYPE: new FormControl(""),
            TITLE_NAME_TH: new FormControl(""),
            TITLE_NAME_EN: new FormControl(""),
            TITLE_SHORT_NAME_TH: new FormControl(""),
            TITLE_SHORT_NAME_EN: new FormControl(""),
            FIRST_NAME: new FormControl(""),
            LAST_NAME: new FormControl(""),
            AGE: new FormControl(""),
            OPERATION_POS_CODE: new FormControl(""),
            OPREATION_POS_NAME: new FormControl(""),
            OPREATION_POS_LEVEL: new FormControl(""),
            OPERATION_POS_LEVEL_NAME: new FormControl(""),
            OPERATION_DEPT_CODE: new FormControl(""),
            OPERATION_DEPT_NAME: new FormControl(""),
            OPERATION_DEPT_LEVEL: new FormControl(""),
            OPERATION_UNDER_DEPT_CODE: new FormControl(""),
            OPERATION_UNDER_DEPT_NAME: new FormControl(""),
            OPERATION_UNDER_DEPT_LEVEL: new FormControl(""),
            OPERATION_WORK_DEPT_CODE: new FormControl(""),
            OPERATION_WORK_DEPT_NAME: new FormControl(""),
            OPERATION_WORK_DEPT_LEVEL: new FormControl(""),
            OPERATION_OFFICE_CODE: new FormControl(""),
            OPERATION_OFFICE_NAME: new FormControl(""),
            OPERATION_OFFICE_SHORT_NAME: new FormControl(""),
            MANAGEMENT_POS_CODE: new FormControl(""),
            MANAGEMENT_POS_NAME: new FormControl(""),
            MANAGEMENT_POS_LEVEL: new FormControl(""),
            MANAGEMENT_POS_LEVEL_NAME: new FormControl(""),
            MANAGEMENT_DEPT_CODE: new FormControl(""),
            MANAGEMENT_DEPT_NAME: new FormControl(""),
            MANAGEMENT_DEPT_LEVEL: new FormControl(""),
            MANAGEMENT_UNDER_DEPT_CODE: new FormControl(""),
            MANAGEMENT_UNDER_DEPT_NAME: new FormControl(""),
            MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(""),
            MANAGEMENT_WORK_DEPT_CODE: new FormControl(""),
            MANAGEMENT_WORK_DEPT_NAME: new FormControl(""),
            MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(""),
            MANAGEMENT_OFFICE_CODE: new FormControl(""),
            MANAGEMENT_OFFICE_NAME: new FormControl(""),
            MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(""),
            REPRESENT_POS_CODE: new FormControl(""),
            REPRESENT_POS_NAME: new FormControl(""),
            REPRESENT_POS_LEVEL: new FormControl("ผู้แจ้งความนำจับ"),
            REPRESENT_POS_LEVEL_NAME: new FormControl(""),
            REPRESENT_DEPT_CODE: new FormControl(""),
            REPRESENT_DEPT_NAME: new FormControl(""),
            REPRESENT_DEPT_LEVEL: new FormControl(""),
            REPRESENT_UNDER_DEPT_CODE: new FormControl(""),
            REPRESENT_UNDER_DEPT_NAME: new FormControl(""),
            REPRESENT_UNDER_DEPT_LEVEL: new FormControl(""),
            REPRESENT_WORK_DEPT_CODE: new FormControl(""),
            REPRESENT_WORK_DEPT_NAME: new FormControl(""),
            REPRESENT_WORK_DEPT_LEVEL: new FormControl(""),
            REPRESENT_OFFICE_CODE: new FormControl(""),
            REPRESENT_OFFICE_NAME: new FormControl(""),
            REPRESENT_OFFICE_SHORT_NAME: new FormControl(""),
            STATUS: new FormControl(""),
            REMARK: new FormControl(""),
            FIRST_PART: new FormControl(""),
            FIRST_MONEY: new FormControl(""),
            SECOND_PART: new FormControl(""),
            SECOND_MONEY: new FormControl(""),
            TOTAL_MONEY: new FormControl(""),
            CONTRIBUTOR_ID: new FormControl(""),
            IS_ACTIVE: new FormControl(0),
            SEQ: new FormControl(""),
          })
        );
      }
      if (arrest.length !== 0) {
        arrest.map((a) => {
          if (a.ARREST_PART_I == null || a.ARREST_PART_I == "") {
            a.ARREST_PART_I = 0;
          }
          if (a.ARREST_PART_II == null || a.ARREST_PART_II == "") {
            a.ARREST_PART_II = 0;
          }
          this.RewardService.MasStaffgetByCon_Search({
            TEXT_SEARCH: a.ARREST_STAFF,
          }).subscribe((res) => {
            let r = res[0];
            control.push(
              this.fb.group({
                A_CONTRIBUTOR: new FormControl(a.ARREST_CONTRIBUTOR),
                A_CONTRIBUTOR_ID: new FormControl(a.ARREST_CONTRIBUTOR_ID),
                A_MANAGEMENT_POS_LEVEL: new FormControl(
                  a.ARREST_MANAGEMENT_POS_LEVEL
                ),
                A_MANAGEMENT_POS_LEVEL_NAME: new FormControl(
                  a.ARREST_TITLE_SHORT_NAME_TH
                ),
                A_MANAGEMENT_POS_NAME: new FormControl(
                  a.ARREST_MANAGEMENT_POS_NAME
                ),
                A_OPERATION_POS_LEVEL_NAME: new FormControl(
                  a.ARREST_OPERATION_POS_LEVEL_NAME
                ),
                A_OPREATION_POS_LEVEL: new FormControl(
                  a.ARREST_OPREATION_POS_LEVEL
                ),
                A_OPREATION_POS_NAME: new FormControl(
                  a.ARREST_OPREATION_POS_NAME
                ),
                A_PART_I: new FormControl(a.ARREST_PART_I),
                A_PART_II: new FormControl(a.ARREST_PART_II),
                A_STAFF: new FormControl(a.ARREST_STAFF),
                A_STAFF_ID: new FormControl(a.ARREST_STAFF_ID),
                A_TITLE_ID: new FormControl(a.ARREST_TITLE_ID),
                A_TITLE_SHORT_NAME_TH: new FormControl(
                  a.ARREST_TITLE_SHORT_NAME_TH
                ),
                A_NAME: new FormControl(a.ARREST_STAFF),
                A_STAFF_TYPE: new FormControl(0), //ผู้จับ
                A_MONEY_I: new FormControl(0),
                A_MONEY_II: new FormControl(0),
                A_MONEY_III: new FormControl(0),
                A_STATUS: new FormControl(1),

                FULL_NAME: new FormControl(
                  `${r.FIRST_NAME || ""} ${r.LAST_NAME || ""}`
                ),
                STAFF_ID: new FormControl(r.STAFF_ID),
                REWARD_ID: new FormControl(r.REWARD_ID),
                STAFF_REF_ID: new FormControl(r.STAFF_REF_ID),
                TITLE_ID: new FormControl(r.TITLE_ID),
                STAFF_CODE: new FormControl(r.STAFF_CODE),
                ID_CARD: new FormControl(r.ID_CARD),
                STAFF_TYPE: new FormControl(r.STAFF_TYPE),
                TITLE_NAME_TH: new FormControl(r.TITLE_NAME_TH),
                TITLE_NAME_EN: new FormControl(r.TITLE_NAME_EN),
                TITLE_SHORT_NAME_TH: new FormControl(r.TITLE_SHORT_NAME_TH),
                TITLE_SHORT_NAME_EN: new FormControl(r.TITLE_SHORT_NAME_EN),
                FIRST_NAME: new FormControl(r.FIRST_NAME),
                LAST_NAME: new FormControl(r.LAST_NAME),
                AGE: new FormControl(r.AGE),
                OPERATION_POS_CODE: new FormControl(r.OPERATION_POS_CODE),
                OPREATION_POS_NAME: new FormControl(r.OPREATION_POS_NAME),
                OPREATION_POS_LEVEL: new FormControl(r.OPREATION_POS_LEVEL),
                OPERATION_POS_LEVEL_NAME: new FormControl(
                  r.OPERATION_POS_LEVEL_NAME
                ),
                OPERATION_DEPT_CODE: new FormControl(r.OPERATION_DEPT_CODE),
                OPERATION_DEPT_NAME: new FormControl(r.OPERATION_DEPT_NAME),
                OPERATION_DEPT_LEVEL: new FormControl(r.OPERATION_DEPT_LEVEL),
                OPERATION_UNDER_DEPT_CODE: new FormControl(
                  r.OPERATION_UNDER_DEPT_CODE
                ),
                OPERATION_UNDER_DEPT_NAME: new FormControl(
                  r.OPERATION_UNDER_DEPT_NAME
                ),
                OPERATION_UNDER_DEPT_LEVEL: new FormControl(
                  r.OPERATION_UNDER_DEPT_LEVEL
                ),
                OPERATION_WORK_DEPT_CODE: new FormControl(
                  r.OPERATION_WORK_DEPT_CODE
                ),
                OPERATION_WORK_DEPT_NAME: new FormControl(
                  r.OPERATION_WORK_DEPT_NAME
                ),
                OPERATION_WORK_DEPT_LEVEL: new FormControl(
                  r.OPERATION_WORK_DEPT_LEVEL
                ),
                OPERATION_OFFICE_CODE: new FormControl(r.OPERATION_OFFICE_CODE),
                OPERATION_OFFICE_NAME: new FormControl(r.OPERATION_OFFICE_NAME),
                OPERATION_OFFICE_SHORT_NAME: new FormControl(
                  r.OPERATION_OFFICE_SHORT_NAME
                ),
                MANAGEMENT_POS_CODE: new FormControl(r.MANAGEMENT_POS_CODE),
                MANAGEMENT_POS_NAME: new FormControl(r.MANAGEMENT_POS_NAME),
                MANAGEMENT_POS_LEVEL: new FormControl(r.MANAGEMENT_POS_LEVEL),
                MANAGEMENT_POS_LEVEL_NAME: new FormControl(
                  r.MANAGEMENT_POS_LEVEL_NAME
                ),
                MANAGEMENT_DEPT_CODE: new FormControl(r.MANAGEMENT_DEPT_CODE),
                MANAGEMENT_DEPT_NAME: new FormControl(r.MANAGEMENT_DEPT_NAME),
                MANAGEMENT_DEPT_LEVEL: new FormControl(r.MANAGEMENT_DEPT_LEVEL),
                MANAGEMENT_UNDER_DEPT_CODE: new FormControl(
                  r.MANAGEMENT_UNDER_DEPT_CODE
                ),
                MANAGEMENT_UNDER_DEPT_NAME: new FormControl(
                  r.MANAGEMENT_UNDER_DEPT_NAME
                ),
                MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(
                  r.MANAGEMENT_UNDER_DEPT_LEVEL
                ),
                MANAGEMENT_WORK_DEPT_CODE: new FormControl(
                  r.MANAGEMENT_WORK_DEPT_CODE
                ),
                MANAGEMENT_WORK_DEPT_NAME: new FormControl(
                  r.MANAGEMENT_WORK_DEPT_NAME
                ),
                MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(
                  r.MANAGEMENT_WORK_DEPT_LEVEL
                ),
                MANAGEMENT_OFFICE_CODE: new FormControl(
                  r.MANAGEMENT_OFFICE_CODE
                ),
                MANAGEMENT_OFFICE_NAME: new FormControl(
                  r.MANAGEMENT_OFFICE_NAME
                ),
                MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(
                  r.MANAGEMENT_OFFICE_SHORT_NAME
                ),
                REPRESENT_POS_CODE: new FormControl(r.REPRESENT_POS_CODE),
                REPRESENT_POS_NAME: new FormControl(r.REPRESENT_POS_NAME),
                REPRESENT_POS_LEVEL: new FormControl(a.ARREST_CONTRIBUTOR),
                REPRESENT_POS_LEVEL_NAME: new FormControl(
                  r.REPRESENT_POS_LEVEL_NAME
                ),
                REPRESENT_DEPT_CODE: new FormControl(r.REPRESENT_DEPT_CODE),
                REPRESENT_DEPT_NAME: new FormControl(r.REPRESENT_DEPT_NAME),
                REPRESENT_DEPT_LEVEL: new FormControl(r.REPRESENT_DEPT_LEVEL),
                REPRESENT_UNDER_DEPT_CODE: new FormControl(
                  r.REPRESENT_UNDER_DEPT_CODE
                ),
                REPRESENT_UNDER_DEPT_NAME: new FormControl(
                  r.REPRESENT_UNDER_DEPT_NAME
                ),
                REPRESENT_UNDER_DEPT_LEVEL: new FormControl(
                  r.REPRESENT_UNDER_DEPT_LEVEL
                ),
                REPRESENT_WORK_DEPT_CODE: new FormControl(
                  r.REPRESENT_WORK_DEPT_CODE
                ),
                REPRESENT_WORK_DEPT_NAME: new FormControl(
                  r.REPRESENT_WORK_DEPT_NAME
                ),
                REPRESENT_WORK_DEPT_LEVEL: new FormControl(
                  r.REPRESENT_WORK_DEPT_LEVEL
                ),
                REPRESENT_OFFICE_CODE: new FormControl(r.REPRESENT_OFFICE_CODE),
                REPRESENT_OFFICE_NAME: new FormControl(r.REPRESENT_OFFICE_NAME),
                REPRESENT_OFFICE_SHORT_NAME: new FormControl(
                  r.REPRESENT_OFFICE_SHORT_NAME
                ),
                STATUS: new FormControl(r.STATUS),
                REMARK: new FormControl("จนท.ผู้จับ"),
                FIRST_PART: new FormControl(r.FIRST_PART),
                FIRST_MONEY: new FormControl(r.FIRST_MONEY),
                SECOND_PART: new FormControl(r.SECOND_PART),
                SECOND_MONEY: new FormControl(r.SECOND_MONEY),
                TOTAL_MONEY: new FormControl(r.TOTAL_MONEY),
                CONTRIBUTOR_ID: new FormControl(48),
                IS_ACTIVE: new FormControl(1),
                SEQ: new FormControl(r.SEQ),
              })
            );
          });
          // }
        });
      }
      if (Notice.length !== 0) {
        Notice.map((a) => {
          if (a.NOTICE_PART == null || a.NOTICE_PART == "") {
            a.NOTICE_PART = 0;
          }
          this.RewardService.MasStaffgetByCon_Search({
            TEXT_SEARCH: a.NOTICE_STAFF,
          }).subscribe((res) => {
            let r = res[0];
            control.push(
              this.fb.group({
                A_CONTRIBUTOR: new FormControl(a.NOTICE_CONTRIBUTOR),
                A_CONTRIBUTOR_ID: new FormControl(a.NOTICE_CONTRIBUTOR_ID),
                A_MANAGEMENT_POS_LEVEL: new FormControl(
                  a.NOTICE_MANAGEMENT_POS_LEVEL
                ),
                A_MANAGEMENT_POS_LEVEL_NAME: new FormControl(
                  a.NOTICE_TITLE_SHORT_NAME_TH
                ),
                A_MANAGEMENT_POS_NAME: new FormControl(
                  a.NOTICE_MANAGEMENT_POS_NAME
                ),
                A_OPERATION_POS_LEVEL_NAME: new FormControl(
                  a.NOTICE_OPERATION_POS_LEVEL_NAME
                ),
                A_OPREATION_POS_LEVEL: new FormControl(
                  a.NOTICE_OPREATION_POS_LEVEL
                ),
                A_OPREATION_POS_NAME: new FormControl(
                  a.NOTICE_OPREATION_POS_NAME
                ),
                A_PART_I: new FormControl(0),
                A_PART_II: new FormControl(a.NOTICE_PART),
                A_STAFF: new FormControl(a.NOTICE_STAFF),
                A_STAFF_ID: new FormControl(a.NOTICE_STAFF_ID),
                A_TITLE_ID: new FormControl(a.NOTICE_TITLE_ID),
                A_TITLE_SHORT_NAME_TH: new FormControl(
                  a.NOTICE_TITLE_SHORT_NAME_TH
                ),
                A_NAME: new FormControl(a.NOTICE_STAFF),
                A_STAFF_TYPE: new FormControl(1),
                A_MONEY_I: new FormControl(0),
                A_MONEY_II: new FormControl(0),
                A_MONEY_III: new FormControl(0),
                A_STATUS: new FormControl(1),

                FULL_NAME: new FormControl(
                  `${r.FIRST_NAME || ""} ${r.LAST_NAME || ""}`
                ),
                STAFF_ID: new FormControl(r.STAFF_ID),
                REWARD_ID: new FormControl(r.REWARD_ID),
                STAFF_REF_ID: new FormControl(r.STAFF_REF_ID),
                TITLE_ID: new FormControl(r.TITLE_ID),
                STAFF_CODE: new FormControl(r.STAFF_CODE),
                ID_CARD: new FormControl(r.ID_CARD),
                STAFF_TYPE: new FormControl(r.STAFF_TYPE),
                TITLE_NAME_TH: new FormControl(r.TITLE_NAME_TH),
                TITLE_NAME_EN: new FormControl(r.TITLE_NAME_EN),
                TITLE_SHORT_NAME_TH: new FormControl(r.TITLE_SHORT_NAME_TH),
                TITLE_SHORT_NAME_EN: new FormControl(r.TITLE_SHORT_NAME_EN),
                FIRST_NAME: new FormControl(r.FIRST_NAME),
                LAST_NAME: new FormControl(r.LAST_NAME),
                AGE: new FormControl(r.AGE),
                OPERATION_POS_CODE: new FormControl(r.OPERATION_POS_CODE),
                OPREATION_POS_NAME: new FormControl(r.OPREATION_POS_NAME),
                OPREATION_POS_LEVEL: new FormControl(r.OPREATION_POS_LEVEL),
                OPERATION_POS_LEVEL_NAME: new FormControl(
                  r.OPERATION_POS_LEVEL_NAME
                ),
                OPERATION_DEPT_CODE: new FormControl(r.OPERATION_DEPT_CODE),
                OPERATION_DEPT_NAME: new FormControl(r.OPERATION_DEPT_NAME),
                OPERATION_DEPT_LEVEL: new FormControl(r.OPERATION_DEPT_LEVEL),
                OPERATION_UNDER_DEPT_CODE: new FormControl(
                  r.OPERATION_UNDER_DEPT_CODE
                ),
                OPERATION_UNDER_DEPT_NAME: new FormControl(
                  r.OPERATION_UNDER_DEPT_NAME
                ),
                OPERATION_UNDER_DEPT_LEVEL: new FormControl(
                  r.OPERATION_UNDER_DEPT_LEVEL
                ),
                OPERATION_WORK_DEPT_CODE: new FormControl(
                  r.OPERATION_WORK_DEPT_CODE
                ),
                OPERATION_WORK_DEPT_NAME: new FormControl(
                  r.OPERATION_WORK_DEPT_NAME
                ),
                OPERATION_WORK_DEPT_LEVEL: new FormControl(
                  r.OPERATION_WORK_DEPT_LEVEL
                ),
                OPERATION_OFFICE_CODE: new FormControl(r.OPERATION_OFFICE_CODE),
                OPERATION_OFFICE_NAME: new FormControl(r.OPERATION_OFFICE_NAME),
                OPERATION_OFFICE_SHORT_NAME: new FormControl(
                  r.OPERATION_OFFICE_SHORT_NAME
                ),
                MANAGEMENT_POS_CODE: new FormControl(r.MANAGEMENT_POS_CODE),
                MANAGEMENT_POS_NAME: new FormControl(r.MANAGEMENT_POS_NAME),
                MANAGEMENT_POS_LEVEL: new FormControl(r.MANAGEMENT_POS_LEVEL),
                MANAGEMENT_POS_LEVEL_NAME: new FormControl(
                  r.MANAGEMENT_POS_LEVEL_NAME
                ),
                MANAGEMENT_DEPT_CODE: new FormControl(r.MANAGEMENT_DEPT_CODE),
                MANAGEMENT_DEPT_NAME: new FormControl(r.MANAGEMENT_DEPT_NAME),
                MANAGEMENT_DEPT_LEVEL: new FormControl(r.MANAGEMENT_DEPT_LEVEL),
                MANAGEMENT_UNDER_DEPT_CODE: new FormControl(
                  r.MANAGEMENT_UNDER_DEPT_CODE
                ),
                MANAGEMENT_UNDER_DEPT_NAME: new FormControl(
                  r.MANAGEMENT_UNDER_DEPT_NAME
                ),
                MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(
                  r.MANAGEMENT_UNDER_DEPT_LEVEL
                ),
                MANAGEMENT_WORK_DEPT_CODE: new FormControl(
                  r.MANAGEMENT_WORK_DEPT_CODE
                ),
                MANAGEMENT_WORK_DEPT_NAME: new FormControl(
                  r.MANAGEMENT_WORK_DEPT_NAME
                ),
                MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(
                  r.MANAGEMENT_WORK_DEPT_LEVEL
                ),
                MANAGEMENT_OFFICE_CODE: new FormControl(
                  r.MANAGEMENT_OFFICE_CODE
                ),
                MANAGEMENT_OFFICE_NAME: new FormControl(
                  r.MANAGEMENT_OFFICE_NAME
                ),
                MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(
                  r.MANAGEMENT_OFFICE_SHORT_NAME
                ),
                REPRESENT_POS_CODE: new FormControl(r.REPRESENT_POS_CODE),
                REPRESENT_POS_NAME: new FormControl(r.REPRESENT_POS_NAME),
                REPRESENT_POS_LEVEL: new FormControl(a.NOTICE_CONTRIBUTOR),
                REPRESENT_POS_LEVEL_NAME: new FormControl(
                  r.REPRESENT_POS_LEVEL_NAME
                ),
                REPRESENT_DEPT_CODE: new FormControl(r.REPRESENT_DEPT_CODE),
                REPRESENT_DEPT_NAME: new FormControl(r.REPRESENT_DEPT_NAME),
                REPRESENT_DEPT_LEVEL: new FormControl(r.REPRESENT_DEPT_LEVEL),
                REPRESENT_UNDER_DEPT_CODE: new FormControl(
                  r.REPRESENT_UNDER_DEPT_CODE
                ),
                REPRESENT_UNDER_DEPT_NAME: new FormControl(
                  r.REPRESENT_UNDER_DEPT_NAME
                ),
                REPRESENT_UNDER_DEPT_LEVEL: new FormControl(
                  r.REPRESENT_UNDER_DEPT_LEVEL
                ),
                REPRESENT_WORK_DEPT_CODE: new FormControl(
                  r.REPRESENT_WORK_DEPT_CODE
                ),
                REPRESENT_WORK_DEPT_NAME: new FormControl(
                  r.REPRESENT_WORK_DEPT_NAME
                ),
                REPRESENT_WORK_DEPT_LEVEL: new FormControl(
                  r.REPRESENT_WORK_DEPT_LEVEL
                ),
                REPRESENT_OFFICE_CODE: new FormControl(r.REPRESENT_OFFICE_CODE),
                REPRESENT_OFFICE_NAME: new FormControl(r.REPRESENT_OFFICE_NAME),
                REPRESENT_OFFICE_SHORT_NAME: new FormControl(
                  r.REPRESENT_OFFICE_SHORT_NAME
                ),
                STATUS: new FormControl(r.STATUS),
                REMARK: new FormControl("จนท.สนับสนุน"),
                FIRST_PART: new FormControl(r.FIRST_PART),
                FIRST_MONEY: new FormControl(r.FIRST_MONEY),
                SECOND_PART: new FormControl(r.SECOND_PART),
                SECOND_MONEY: new FormControl(r.SECOND_MONEY),
                TOTAL_MONEY: new FormControl(r.TOTAL_MONEY),
                CONTRIBUTOR_ID: new FormControl(49),
                IS_ACTIVE: new FormControl(1),
                SEQ: new FormControl(r.SEQ),
              })
            );
          });
          // }
        });
      }
      if (Lawsuit.length !== 0) {
        Lawsuit.map((a) => {
          if (a.LAWSUIT_PART == null || a.LAWSUIT_PART == "") {
            a.LAWSUIT_PART = 0;
          }
          this.RewardService.MasStaffgetByCon_Search({
            TEXT_SEARCH: a.LAWSUIT_STAFF,
          }).subscribe((res) => {
            let r = res[0];
            control.push(
              this.fb.group({
                A_CONTRIBUTOR: new FormControl(a.LAWSUIT_CONTRIBUTOR),
                A_CONTRIBUTOR_ID: new FormControl(a.LAWSUIT_CONTRIBUTOR_ID),
                A_MANAGEMENT_POS_LEVEL: new FormControl(
                  a.LAWSUIT_MANAGEMENT_POS_LEVEL
                ),
                A_MANAGEMENT_POS_LEVEL_NAME: new FormControl(
                  a.LAWSUIT_TITLE_SHORT_NAME_TH
                ),
                A_MANAGEMENT_POS_NAME: new FormControl(
                  a.LAWSUIT_MANAGEMENT_POS_NAME
                ),
                A_OPERATION_POS_LEVEL_NAME: new FormControl(
                  a.LAWSUIT_OPERATION_POS_LEVEL_NAME
                ),
                A_OPREATION_POS_LEVEL: new FormControl(
                  a.LAWSUIT_OPREATION_POS_LEVEL
                ),
                A_OPREATION_POS_NAME: new FormControl(
                  a.LAWSUIT_OPREATION_POS_NAME
                ),
                A_PART_I: new FormControl(0),
                A_PART_II: new FormControl(a.LAWSUIT_PART),
                A_STAFF: new FormControl(a.LAWSUIT_STAFF),
                A_STAFF_ID: new FormControl(a.LAWSUIT_STAFF_ID),
                A_TITLE_ID: new FormControl(a.LAWSUIT_TITLE_ID),
                A_TITLE_SHORT_NAME_TH: new FormControl(
                  a.LAWSUIT_TITLE_SHORT_NAME_TH
                ),
                A_NAME: new FormControl(a.LAWSUIT_STAFF),
                A_STAFF_TYPE: new FormControl(1),
                A_MONEY_I: new FormControl(0),
                A_MONEY_II: new FormControl(0),
                A_MONEY_III: new FormControl(0),
                A_STATUS: new FormControl(1),

                FULL_NAME: new FormControl(
                  `${r.FIRST_NAME || ""} ${r.LAST_NAME || ""}`
                ),
                STAFF_ID: new FormControl(r.STAFF_ID),
                REWARD_ID: new FormControl(r.REWARD_ID),
                STAFF_REF_ID: new FormControl(r.STAFF_REF_ID),
                TITLE_ID: new FormControl(r.TITLE_ID),
                STAFF_CODE: new FormControl(r.STAFF_CODE),
                ID_CARD: new FormControl(r.ID_CARD),
                STAFF_TYPE: new FormControl(r.STAFF_TYPE),
                TITLE_NAME_TH: new FormControl(r.TITLE_NAME_TH),
                TITLE_NAME_EN: new FormControl(r.TITLE_NAME_EN),
                TITLE_SHORT_NAME_TH: new FormControl(r.TITLE_SHORT_NAME_TH),
                TITLE_SHORT_NAME_EN: new FormControl(r.TITLE_SHORT_NAME_EN),
                FIRST_NAME: new FormControl(r.FIRST_NAME),
                LAST_NAME: new FormControl(r.LAST_NAME),
                AGE: new FormControl(r.AGE),
                OPERATION_POS_CODE: new FormControl(r.OPERATION_POS_CODE),
                OPREATION_POS_NAME: new FormControl(r.OPREATION_POS_NAME),
                OPREATION_POS_LEVEL: new FormControl(r.OPREATION_POS_LEVEL),
                OPERATION_POS_LEVEL_NAME: new FormControl(
                  r.OPERATION_POS_LEVEL_NAME
                ),
                OPERATION_DEPT_CODE: new FormControl(r.OPERATION_DEPT_CODE),
                OPERATION_DEPT_NAME: new FormControl(r.OPERATION_DEPT_NAME),
                OPERATION_DEPT_LEVEL: new FormControl(r.OPERATION_DEPT_LEVEL),
                OPERATION_UNDER_DEPT_CODE: new FormControl(
                  r.OPERATION_UNDER_DEPT_CODE
                ),
                OPERATION_UNDER_DEPT_NAME: new FormControl(
                  r.OPERATION_UNDER_DEPT_NAME
                ),
                OPERATION_UNDER_DEPT_LEVEL: new FormControl(
                  r.OPERATION_UNDER_DEPT_LEVEL
                ),
                OPERATION_WORK_DEPT_CODE: new FormControl(
                  r.OPERATION_WORK_DEPT_CODE
                ),
                OPERATION_WORK_DEPT_NAME: new FormControl(
                  r.OPERATION_WORK_DEPT_NAME
                ),
                OPERATION_WORK_DEPT_LEVEL: new FormControl(
                  r.OPERATION_WORK_DEPT_LEVEL
                ),
                OPERATION_OFFICE_CODE: new FormControl(r.OPERATION_OFFICE_CODE),
                OPERATION_OFFICE_NAME: new FormControl(r.OPERATION_OFFICE_NAME),
                OPERATION_OFFICE_SHORT_NAME: new FormControl(
                  r.OPERATION_OFFICE_SHORT_NAME
                ),
                MANAGEMENT_POS_CODE: new FormControl(r.MANAGEMENT_POS_CODE),
                MANAGEMENT_POS_NAME: new FormControl(r.MANAGEMENT_POS_NAME),
                MANAGEMENT_POS_LEVEL: new FormControl(r.MANAGEMENT_POS_LEVEL),
                MANAGEMENT_POS_LEVEL_NAME: new FormControl(
                  r.MANAGEMENT_POS_LEVEL_NAME
                ),
                MANAGEMENT_DEPT_CODE: new FormControl(r.MANAGEMENT_DEPT_CODE),
                MANAGEMENT_DEPT_NAME: new FormControl(r.MANAGEMENT_DEPT_NAME),
                MANAGEMENT_DEPT_LEVEL: new FormControl(r.MANAGEMENT_DEPT_LEVEL),
                MANAGEMENT_UNDER_DEPT_CODE: new FormControl(
                  r.MANAGEMENT_UNDER_DEPT_CODE
                ),
                MANAGEMENT_UNDER_DEPT_NAME: new FormControl(
                  r.MANAGEMENT_UNDER_DEPT_NAME
                ),
                MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(
                  r.MANAGEMENT_UNDER_DEPT_LEVEL
                ),
                MANAGEMENT_WORK_DEPT_CODE: new FormControl(
                  r.MANAGEMENT_WORK_DEPT_CODE
                ),
                MANAGEMENT_WORK_DEPT_NAME: new FormControl(
                  r.MANAGEMENT_WORK_DEPT_NAME
                ),
                MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(
                  r.MANAGEMENT_WORK_DEPT_LEVEL
                ),
                MANAGEMENT_OFFICE_CODE: new FormControl(
                  r.MANAGEMENT_OFFICE_CODE
                ),
                MANAGEMENT_OFFICE_NAME: new FormControl(
                  r.MANAGEMENT_OFFICE_NAME
                ),
                MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(
                  r.MANAGEMENT_OFFICE_SHORT_NAME
                ),
                REPRESENT_POS_CODE: new FormControl(r.REPRESENT_POS_CODE),
                REPRESENT_POS_NAME: new FormControl(r.REPRESENT_POS_NAME),
                REPRESENT_POS_LEVEL: new FormControl(a.LAWSUIT_CONTRIBUTOR),
                REPRESENT_POS_LEVEL_NAME: new FormControl(
                  r.REPRESENT_POS_LEVEL_NAME
                ),
                REPRESENT_DEPT_CODE: new FormControl(r.REPRESENT_DEPT_CODE),
                REPRESENT_DEPT_NAME: new FormControl(r.REPRESENT_DEPT_NAME),
                REPRESENT_DEPT_LEVEL: new FormControl(r.REPRESENT_DEPT_LEVEL),
                REPRESENT_UNDER_DEPT_CODE: new FormControl(
                  r.REPRESENT_UNDER_DEPT_CODE
                ),
                REPRESENT_UNDER_DEPT_NAME: new FormControl(
                  r.REPRESENT_UNDER_DEPT_NAME
                ),
                REPRESENT_UNDER_DEPT_LEVEL: new FormControl(
                  r.REPRESENT_UNDER_DEPT_LEVEL
                ),
                REPRESENT_WORK_DEPT_CODE: new FormControl(
                  r.REPRESENT_WORK_DEPT_CODE
                ),
                REPRESENT_WORK_DEPT_NAME: new FormControl(
                  r.REPRESENT_WORK_DEPT_NAME
                ),
                REPRESENT_WORK_DEPT_LEVEL: new FormControl(
                  r.REPRESENT_WORK_DEPT_LEVEL
                ),
                REPRESENT_OFFICE_CODE: new FormControl(r.REPRESENT_OFFICE_CODE),
                REPRESENT_OFFICE_NAME: new FormControl(r.REPRESENT_OFFICE_NAME),
                REPRESENT_OFFICE_SHORT_NAME: new FormControl(
                  r.REPRESENT_OFFICE_SHORT_NAME
                ),
                STATUS: new FormControl(r.STATUS),
                REMARK: new FormControl("จนท.สนับสนุน"),
                FIRST_PART: new FormControl(r.FIRST_PART),
                FIRST_MONEY: new FormControl(r.FIRST_MONEY),
                SECOND_PART: new FormControl(r.SECOND_PART),
                SECOND_MONEY: new FormControl(r.SECOND_MONEY),
                TOTAL_MONEY: new FormControl(r.TOTAL_MONEY),
                CONTRIBUTOR_ID: new FormControl(49),
                IS_ACTIVE: new FormControl(1),
                SEQ: new FormControl(r.SEQ),
              })
            );
          });
          // }
        });
      }
      if (Prove.length !== 0) {
        Prove.map((a) => {
          if (a.PROVE_PART == null || a.PROVE_PART == "") {
            a.PROVE_PART = 0;
          }
          this.RewardService.MasStaffgetByCon_Search({
            TEXT_SEARCH: a.PROVE_STAFF,
          }).subscribe((res) => {
            let r = res[0];
            control.push(
              this.fb.group({
                A_CONTRIBUTOR: new FormControl(a.PROVE_CONTRIBUTOR),
                A_CONTRIBUTOR_ID: new FormControl(a.PROVE_CONTRIBUTOR_ID),
                A_MANAGEMENT_POS_LEVEL: new FormControl(
                  a.PROVE_MANAGEMENT_POS_LEVEL
                ),
                A_MANAGEMENT_POS_LEVEL_NAME: new FormControl(
                  a.PROVE_TITLE_SHORT_NAME_TH
                ),
                A_MANAGEMENT_POS_NAME: new FormControl(
                  a.PROVE_MANAGEMENT_POS_NAME
                ),
                A_OPERATION_POS_LEVEL_NAME: new FormControl(
                  a.PROVE_OPERATION_POS_LEVEL_NAME
                ),
                A_OPREATION_POS_LEVEL: new FormControl(
                  a.PROVE_OPREATION_POS_LEVEL
                ),
                A_OPREATION_POS_NAME: new FormControl(
                  a.PROVE_OPREATION_POS_NAME
                ),
                A_PART_I: new FormControl(0),
                A_PART_II: new FormControl(a.PROVE_PART),
                A_STAFF: new FormControl(a.PROVE_STAFF),
                A_STAFF_ID: new FormControl(a.PROVE_STAFF_ID),
                A_TITLE_ID: new FormControl(a.PROVE_TITLE_ID),
                A_TITLE_SHORT_NAME_TH: new FormControl(
                  a.PROVE_TITLE_SHORT_NAME_TH
                ),
                A_NAME: new FormControl(a.PROVE_STAFF),
                A_STAFF_TYPE: new FormControl(1),
                A_MONEY_I: new FormControl(0),
                A_MONEY_II: new FormControl(0),
                A_MONEY_III: new FormControl(0),
                A_STATUS: new FormControl(1),

                FULL_NAME: new FormControl(
                  `${r.FIRST_NAME || ""} ${r.LAST_NAME || ""}`
                ),
                STAFF_ID: new FormControl(r.STAFF_ID),
                REWARD_ID: new FormControl(r.REWARD_ID),
                STAFF_REF_ID: new FormControl(r.STAFF_REF_ID),
                TITLE_ID: new FormControl(r.TITLE_ID),
                STAFF_CODE: new FormControl(r.STAFF_CODE),
                ID_CARD: new FormControl(r.ID_CARD),
                STAFF_TYPE: new FormControl(r.STAFF_TYPE),
                TITLE_NAME_TH: new FormControl(r.TITLE_NAME_TH),
                TITLE_NAME_EN: new FormControl(r.TITLE_NAME_EN),
                TITLE_SHORT_NAME_TH: new FormControl(r.TITLE_SHORT_NAME_TH),
                TITLE_SHORT_NAME_EN: new FormControl(r.TITLE_SHORT_NAME_EN),
                FIRST_NAME: new FormControl(r.FIRST_NAME),
                LAST_NAME: new FormControl(r.LAST_NAME),
                AGE: new FormControl(r.AGE),
                OPERATION_POS_CODE: new FormControl(r.OPERATION_POS_CODE),
                OPREATION_POS_NAME: new FormControl(r.OPREATION_POS_NAME),
                OPREATION_POS_LEVEL: new FormControl(r.OPREATION_POS_LEVEL),
                OPERATION_POS_LEVEL_NAME: new FormControl(
                  r.OPERATION_POS_LEVEL_NAME
                ),
                OPERATION_DEPT_CODE: new FormControl(r.OPERATION_DEPT_CODE),
                OPERATION_DEPT_NAME: new FormControl(r.OPERATION_DEPT_NAME),
                OPERATION_DEPT_LEVEL: new FormControl(r.OPERATION_DEPT_LEVEL),
                OPERATION_UNDER_DEPT_CODE: new FormControl(
                  r.OPERATION_UNDER_DEPT_CODE
                ),
                OPERATION_UNDER_DEPT_NAME: new FormControl(
                  r.OPERATION_UNDER_DEPT_NAME
                ),
                OPERATION_UNDER_DEPT_LEVEL: new FormControl(
                  r.OPERATION_UNDER_DEPT_LEVEL
                ),
                OPERATION_WORK_DEPT_CODE: new FormControl(
                  r.OPERATION_WORK_DEPT_CODE
                ),
                OPERATION_WORK_DEPT_NAME: new FormControl(
                  r.OPERATION_WORK_DEPT_NAME
                ),
                OPERATION_WORK_DEPT_LEVEL: new FormControl(
                  r.OPERATION_WORK_DEPT_LEVEL
                ),
                OPERATION_OFFICE_CODE: new FormControl(r.OPERATION_OFFICE_CODE),
                OPERATION_OFFICE_NAME: new FormControl(r.OPERATION_OFFICE_NAME),
                OPERATION_OFFICE_SHORT_NAME: new FormControl(
                  r.OPERATION_OFFICE_SHORT_NAME
                ),
                MANAGEMENT_POS_CODE: new FormControl(r.MANAGEMENT_POS_CODE),
                MANAGEMENT_POS_NAME: new FormControl(r.MANAGEMENT_POS_NAME),
                MANAGEMENT_POS_LEVEL: new FormControl(r.MANAGEMENT_POS_LEVEL),
                MANAGEMENT_POS_LEVEL_NAME: new FormControl(
                  r.MANAGEMENT_POS_LEVEL_NAME
                ),
                MANAGEMENT_DEPT_CODE: new FormControl(r.MANAGEMENT_DEPT_CODE),
                MANAGEMENT_DEPT_NAME: new FormControl(r.MANAGEMENT_DEPT_NAME),
                MANAGEMENT_DEPT_LEVEL: new FormControl(r.MANAGEMENT_DEPT_LEVEL),
                MANAGEMENT_UNDER_DEPT_CODE: new FormControl(
                  r.MANAGEMENT_UNDER_DEPT_CODE
                ),
                MANAGEMENT_UNDER_DEPT_NAME: new FormControl(
                  r.MANAGEMENT_UNDER_DEPT_NAME
                ),
                MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(
                  r.MANAGEMENT_UNDER_DEPT_LEVEL
                ),
                MANAGEMENT_WORK_DEPT_CODE: new FormControl(
                  r.MANAGEMENT_WORK_DEPT_CODE
                ),
                MANAGEMENT_WORK_DEPT_NAME: new FormControl(
                  r.MANAGEMENT_WORK_DEPT_NAME
                ),
                MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(
                  r.MANAGEMENT_WORK_DEPT_LEVEL
                ),
                MANAGEMENT_OFFICE_CODE: new FormControl(
                  r.MANAGEMENT_OFFICE_CODE
                ),
                MANAGEMENT_OFFICE_NAME: new FormControl(
                  r.MANAGEMENT_OFFICE_NAME
                ),
                MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(
                  r.MANAGEMENT_OFFICE_SHORT_NAME
                ),
                REPRESENT_POS_CODE: new FormControl(r.REPRESENT_POS_CODE),
                REPRESENT_POS_NAME: new FormControl(r.REPRESENT_POS_NAME),
                REPRESENT_POS_LEVEL: new FormControl(a.PROVE_CONTRIBUTOR),
                REPRESENT_POS_LEVEL_NAME: new FormControl(
                  r.REPRESENT_POS_LEVEL_NAME
                ),
                REPRESENT_DEPT_CODE: new FormControl(r.REPRESENT_DEPT_CODE),
                REPRESENT_DEPT_NAME: new FormControl(r.REPRESENT_DEPT_NAME),
                REPRESENT_DEPT_LEVEL: new FormControl(r.REPRESENT_DEPT_LEVEL),
                REPRESENT_UNDER_DEPT_CODE: new FormControl(
                  r.REPRESENT_UNDER_DEPT_CODE
                ),
                REPRESENT_UNDER_DEPT_NAME: new FormControl(
                  r.REPRESENT_UNDER_DEPT_NAME
                ),
                REPRESENT_UNDER_DEPT_LEVEL: new FormControl(
                  r.REPRESENT_UNDER_DEPT_LEVEL
                ),
                REPRESENT_WORK_DEPT_CODE: new FormControl(
                  r.REPRESENT_WORK_DEPT_CODE
                ),
                REPRESENT_WORK_DEPT_NAME: new FormControl(
                  r.REPRESENT_WORK_DEPT_NAME
                ),
                REPRESENT_WORK_DEPT_LEVEL: new FormControl(
                  r.REPRESENT_WORK_DEPT_LEVEL
                ),
                REPRESENT_OFFICE_CODE: new FormControl(r.REPRESENT_OFFICE_CODE),
                REPRESENT_OFFICE_NAME: new FormControl(r.REPRESENT_OFFICE_NAME),
                REPRESENT_OFFICE_SHORT_NAME: new FormControl(
                  r.REPRESENT_OFFICE_SHORT_NAME
                ),
                STATUS: new FormControl(r.STATUS),
                REMARK: new FormControl("จนท.สนับสนุน"),
                FIRST_PART: new FormControl(r.FIRST_PART),
                FIRST_MONEY: new FormControl(r.FIRST_MONEY),
                SECOND_PART: new FormControl(r.SECOND_PART),
                SECOND_MONEY: new FormControl(r.SECOND_MONEY),
                TOTAL_MONEY: new FormControl(r.TOTAL_MONEY),
                CONTRIBUTOR_ID: new FormControl(49),
                IS_ACTIVE: new FormControl(1),
                SEQ: new FormControl(r.SEQ),
              })
            );
          });
          // }
        });
      }
      if (Compare.length !== 0) {
        Compare.map((a) => {
          if (a.COMPARE_PART == null || a.COMPARE_PART == "") {
            a.COMPARE_PART = 0;
          }
          this.RewardService.MasStaffgetByCon_Search({
            TEXT_SEARCH: a.COMPARE_STAFF,
          }).subscribe((res) => {
            let r = res[0];
            control.push(
              this.fb.group({
                A_CONTRIBUTOR: new FormControl(a.COMPARE_CONTRIBUTOR),
                A_CONTRIBUTOR_ID: new FormControl(a.COMPARE_CONTRIBUTOR_ID),
                A_MANAGEMENT_POS_LEVEL: new FormControl(
                  a.COMPARE_MANAGEMENT_POS_LEVEL
                ),
                A_MANAGEMENT_POS_LEVEL_NAME: new FormControl(
                  a.COMPARE_TITLE_SHORT_NAME_TH
                ),
                A_MANAGEMENT_POS_NAME: new FormControl(
                  a.COMPARE_MANAGEMENT_POS_NAME
                ),
                A_OPERATION_POS_LEVEL_NAME: new FormControl(
                  a.COMPARE_OPERATION_POS_LEVEL_NAME
                ),
                A_OPREATION_POS_LEVEL: new FormControl(
                  a.COMPARE_OPREATION_POS_LEVEL
                ),
                A_OPREATION_POS_NAME: new FormControl(
                  a.COMPARE_OPREATION_POS_NAME
                ),
                A_PART_I: new FormControl(0),
                A_PART_II: new FormControl(a.COMPARE_PART),
                A_STAFF: new FormControl(a.COMPARE_STAFF),
                A_STAFF_ID: new FormControl(a.COMPARE_STAFF_ID),
                A_TITLE_ID: new FormControl(a.COMPARE_TITLE_ID),
                A_TITLE_SHORT_NAME_TH: new FormControl(
                  a.COMPARE_TITLE_SHORT_NAME_TH
                ),
                A_NAME: new FormControl(a.COMPARE_STAFF),
                A_STAFF_TYPE: new FormControl(1),
                A_MONEY_I: new FormControl(0),
                A_MONEY_II: new FormControl(0),
                A_MONEY_III: new FormControl(0),
                A_STATUS: new FormControl(1),

                FULL_NAME: new FormControl(
                  `${r.FIRST_NAME || ""} ${r.LAST_NAME || ""}`
                ),
                STAFF_ID: new FormControl(r.STAFF_ID),
                REWARD_ID: new FormControl(r.REWARD_ID),
                STAFF_REF_ID: new FormControl(r.STAFF_REF_ID),
                TITLE_ID: new FormControl(r.TITLE_ID),
                STAFF_CODE: new FormControl(r.STAFF_CODE),
                ID_CARD: new FormControl(r.ID_CARD),
                STAFF_TYPE: new FormControl(r.STAFF_TYPE),
                TITLE_NAME_TH: new FormControl(r.TITLE_NAME_TH),
                TITLE_NAME_EN: new FormControl(r.TITLE_NAME_EN),
                TITLE_SHORT_NAME_TH: new FormControl(r.TITLE_SHORT_NAME_TH),
                TITLE_SHORT_NAME_EN: new FormControl(r.TITLE_SHORT_NAME_EN),
                FIRST_NAME: new FormControl(r.FIRST_NAME),
                LAST_NAME: new FormControl(r.LAST_NAME),
                AGE: new FormControl(r.AGE),
                OPERATION_POS_CODE: new FormControl(r.OPERATION_POS_CODE),
                OPREATION_POS_NAME: new FormControl(r.OPREATION_POS_NAME),
                OPREATION_POS_LEVEL: new FormControl(r.OPREATION_POS_LEVEL),
                OPERATION_POS_LEVEL_NAME: new FormControl(
                  r.OPERATION_POS_LEVEL_NAME
                ),
                OPERATION_DEPT_CODE: new FormControl(r.OPERATION_DEPT_CODE),
                OPERATION_DEPT_NAME: new FormControl(r.OPERATION_DEPT_NAME),
                OPERATION_DEPT_LEVEL: new FormControl(r.OPERATION_DEPT_LEVEL),
                OPERATION_UNDER_DEPT_CODE: new FormControl(
                  r.OPERATION_UNDER_DEPT_CODE
                ),
                OPERATION_UNDER_DEPT_NAME: new FormControl(
                  r.OPERATION_UNDER_DEPT_NAME
                ),
                OPERATION_UNDER_DEPT_LEVEL: new FormControl(
                  r.OPERATION_UNDER_DEPT_LEVEL
                ),
                OPERATION_WORK_DEPT_CODE: new FormControl(
                  r.OPERATION_WORK_DEPT_CODE
                ),
                OPERATION_WORK_DEPT_NAME: new FormControl(
                  r.OPERATION_WORK_DEPT_NAME
                ),
                OPERATION_WORK_DEPT_LEVEL: new FormControl(
                  r.OPERATION_WORK_DEPT_LEVEL
                ),
                OPERATION_OFFICE_CODE: new FormControl(r.OPERATION_OFFICE_CODE),
                OPERATION_OFFICE_NAME: new FormControl(r.OPERATION_OFFICE_NAME),
                OPERATION_OFFICE_SHORT_NAME: new FormControl(
                  r.OPERATION_OFFICE_SHORT_NAME
                ),
                MANAGEMENT_POS_CODE: new FormControl(r.MANAGEMENT_POS_CODE),
                MANAGEMENT_POS_NAME: new FormControl(r.MANAGEMENT_POS_NAME),
                MANAGEMENT_POS_LEVEL: new FormControl(r.MANAGEMENT_POS_LEVEL),
                MANAGEMENT_POS_LEVEL_NAME: new FormControl(
                  r.MANAGEMENT_POS_LEVEL_NAME
                ),
                MANAGEMENT_DEPT_CODE: new FormControl(r.MANAGEMENT_DEPT_CODE),
                MANAGEMENT_DEPT_NAME: new FormControl(r.MANAGEMENT_DEPT_NAME),
                MANAGEMENT_DEPT_LEVEL: new FormControl(r.MANAGEMENT_DEPT_LEVEL),
                MANAGEMENT_UNDER_DEPT_CODE: new FormControl(
                  r.MANAGEMENT_UNDER_DEPT_CODE
                ),
                MANAGEMENT_UNDER_DEPT_NAME: new FormControl(
                  r.MANAGEMENT_UNDER_DEPT_NAME
                ),
                MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(
                  r.MANAGEMENT_UNDER_DEPT_LEVEL
                ),
                MANAGEMENT_WORK_DEPT_CODE: new FormControl(
                  r.MANAGEMENT_WORK_DEPT_CODE
                ),
                MANAGEMENT_WORK_DEPT_NAME: new FormControl(
                  r.MANAGEMENT_WORK_DEPT_NAME
                ),
                MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(
                  r.MANAGEMENT_WORK_DEPT_LEVEL
                ),
                MANAGEMENT_OFFICE_CODE: new FormControl(
                  r.MANAGEMENT_OFFICE_CODE
                ),
                MANAGEMENT_OFFICE_NAME: new FormControl(
                  r.MANAGEMENT_OFFICE_NAME
                ),
                MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(
                  r.MANAGEMENT_OFFICE_SHORT_NAME
                ),
                REPRESENT_POS_CODE: new FormControl(r.REPRESENT_POS_CODE),
                REPRESENT_POS_NAME: new FormControl(r.REPRESENT_POS_NAME),
                REPRESENT_POS_LEVEL: new FormControl(a.COMPARE_CONTRIBUTOR),
                REPRESENT_POS_LEVEL_NAME: new FormControl(
                  r.REPRESENT_POS_LEVEL_NAME
                ),
                REPRESENT_DEPT_CODE: new FormControl(r.REPRESENT_DEPT_CODE),
                REPRESENT_DEPT_NAME: new FormControl(r.REPRESENT_DEPT_NAME),
                REPRESENT_DEPT_LEVEL: new FormControl(r.REPRESENT_DEPT_LEVEL),
                REPRESENT_UNDER_DEPT_CODE: new FormControl(
                  r.REPRESENT_UNDER_DEPT_CODE
                ),
                REPRESENT_UNDER_DEPT_NAME: new FormControl(
                  r.REPRESENT_UNDER_DEPT_NAME
                ),
                REPRESENT_UNDER_DEPT_LEVEL: new FormControl(
                  r.REPRESENT_UNDER_DEPT_LEVEL
                ),
                REPRESENT_WORK_DEPT_CODE: new FormControl(
                  r.REPRESENT_WORK_DEPT_CODE
                ),
                REPRESENT_WORK_DEPT_NAME: new FormControl(
                  r.REPRESENT_WORK_DEPT_NAME
                ),
                REPRESENT_WORK_DEPT_LEVEL: new FormControl(
                  r.REPRESENT_WORK_DEPT_LEVEL
                ),
                REPRESENT_OFFICE_CODE: new FormControl(r.REPRESENT_OFFICE_CODE),
                REPRESENT_OFFICE_NAME: new FormControl(r.REPRESENT_OFFICE_NAME),
                REPRESENT_OFFICE_SHORT_NAME: new FormControl(
                  r.REPRESENT_OFFICE_SHORT_NAME
                ),
                STATUS: new FormControl(r.STATUS),
                REMARK: new FormControl("จนท.สนับสนุน"),
                FIRST_PART: new FormControl(r.FIRST_PART),
                FIRST_MONEY: new FormControl(r.FIRST_MONEY),
                SECOND_PART: new FormControl(r.SECOND_PART),
                SECOND_MONEY: new FormControl(r.SECOND_MONEY),
                TOTAL_MONEY: new FormControl(r.TOTAL_MONEY),
                CONTRIBUTOR_ID: new FormControl(49),
                IS_ACTIVE: new FormControl(1),
                SEQ: new FormControl(r.SEQ),
              })
            );
          });
          // }
        });
      }
      if (Revenue.length !== 0) {
        Revenue.map((a) => {
          if (a.REVENUE_PART == null || a.REVENUE_PART == "") {
            a.REVENUE_PART = 0;
          }
          this.RewardService.MasStaffgetByCon_Search({
            TEXT_SEARCH: a.REVENUE_STAFF,
          }).subscribe((res) => {
            let r = res[0];
            control.push(
              this.fb.group({
                A_CONTRIBUTOR: new FormControl(a.REVENUE_CONTRIBUTOR),
                A_CONTRIBUTOR_ID: new FormControl(a.REVENUE_CONTRIBUTOR_ID),
                A_MANAGEMENT_POS_LEVEL: new FormControl(
                  a.REVENUE_MANAGEMENT_POS_LEVEL
                ),
                A_MANAGEMENT_POS_LEVEL_NAME: new FormControl(
                  a.REVENUE_TITLE_SHORT_NAME_TH
                ),
                A_MANAGEMENT_POS_NAME: new FormControl(
                  a.REVENUE_MANAGEMENT_POS_NAME
                ),
                A_OPERATION_POS_LEVEL_NAME: new FormControl(
                  a.REVENUE_OPERATION_POS_LEVEL_NAME
                ),
                A_OPREATION_POS_LEVEL: new FormControl(
                  a.REVENUE_OPREATION_POS_LEVEL
                ),
                A_OPREATION_POS_NAME: new FormControl(
                  a.REVENUE_OPREATION_POS_NAME
                ),
                A_PART_I: new FormControl(0),
                A_PART_II: new FormControl(a.REVENUE_PART),
                A_STAFF: new FormControl(a.REVENUE_STAFF),
                A_STAFF_ID: new FormControl(a.REVENUE_STAFF_ID),
                A_TITLE_ID: new FormControl(a.REVENUE_TITLE_ID),
                A_TITLE_SHORT_NAME_TH: new FormControl(
                  a.REVENUE_TITLE_SHORT_NAME_TH
                ),
                A_NAME: new FormControl(a.REVENUE_STAFF),
                A_STAFF_TYPE: new FormControl(1),
                A_MONEY_I: new FormControl(0),
                A_MONEY_II: new FormControl(0),
                A_MONEY_III: new FormControl(0),
                A_STATUS: new FormControl(1),

                FULL_NAME: new FormControl(
                  `${r.FIRST_NAME || ""} ${r.LAST_NAME || ""}`
                ),
                STAFF_ID: new FormControl(r.STAFF_ID),
                REWARD_ID: new FormControl(r.REWARD_ID),
                STAFF_REF_ID: new FormControl(r.STAFF_REF_ID),
                TITLE_ID: new FormControl(r.TITLE_ID),
                STAFF_CODE: new FormControl(r.STAFF_CODE),
                ID_CARD: new FormControl(r.ID_CARD),
                STAFF_TYPE: new FormControl(r.STAFF_TYPE),
                TITLE_NAME_TH: new FormControl(r.TITLE_NAME_TH),
                TITLE_NAME_EN: new FormControl(r.TITLE_NAME_EN),
                TITLE_SHORT_NAME_TH: new FormControl(r.TITLE_SHORT_NAME_TH),
                TITLE_SHORT_NAME_EN: new FormControl(r.TITLE_SHORT_NAME_EN),
                FIRST_NAME: new FormControl(r.FIRST_NAME),
                LAST_NAME: new FormControl(r.LAST_NAME),
                AGE: new FormControl(r.AGE),
                OPERATION_POS_CODE: new FormControl(r.OPERATION_POS_CODE),
                OPREATION_POS_NAME: new FormControl(r.OPREATION_POS_NAME),
                OPREATION_POS_LEVEL: new FormControl(r.OPREATION_POS_LEVEL),
                OPERATION_POS_LEVEL_NAME: new FormControl(
                  r.OPERATION_POS_LEVEL_NAME
                ),
                OPERATION_DEPT_CODE: new FormControl(r.OPERATION_DEPT_CODE),
                OPERATION_DEPT_NAME: new FormControl(r.OPERATION_DEPT_NAME),
                OPERATION_DEPT_LEVEL: new FormControl(r.OPERATION_DEPT_LEVEL),
                OPERATION_UNDER_DEPT_CODE: new FormControl(
                  r.OPERATION_UNDER_DEPT_CODE
                ),
                OPERATION_UNDER_DEPT_NAME: new FormControl(
                  r.OPERATION_UNDER_DEPT_NAME
                ),
                OPERATION_UNDER_DEPT_LEVEL: new FormControl(
                  r.OPERATION_UNDER_DEPT_LEVEL
                ),
                OPERATION_WORK_DEPT_CODE: new FormControl(
                  r.OPERATION_WORK_DEPT_CODE
                ),
                OPERATION_WORK_DEPT_NAME: new FormControl(
                  r.OPERATION_WORK_DEPT_NAME
                ),
                OPERATION_WORK_DEPT_LEVEL: new FormControl(
                  r.OPERATION_WORK_DEPT_LEVEL
                ),
                OPERATION_OFFICE_CODE: new FormControl(r.OPERATION_OFFICE_CODE),
                OPERATION_OFFICE_NAME: new FormControl(r.OPERATION_OFFICE_NAME),
                OPERATION_OFFICE_SHORT_NAME: new FormControl(
                  r.OPERATION_OFFICE_SHORT_NAME
                ),
                MANAGEMENT_POS_CODE: new FormControl(r.MANAGEMENT_POS_CODE),
                MANAGEMENT_POS_NAME: new FormControl(r.MANAGEMENT_POS_NAME),
                MANAGEMENT_POS_LEVEL: new FormControl(r.MANAGEMENT_POS_LEVEL),
                MANAGEMENT_POS_LEVEL_NAME: new FormControl(
                  r.MANAGEMENT_POS_LEVEL_NAME
                ),
                MANAGEMENT_DEPT_CODE: new FormControl(r.MANAGEMENT_DEPT_CODE),
                MANAGEMENT_DEPT_NAME: new FormControl(r.MANAGEMENT_DEPT_NAME),
                MANAGEMENT_DEPT_LEVEL: new FormControl(r.MANAGEMENT_DEPT_LEVEL),
                MANAGEMENT_UNDER_DEPT_CODE: new FormControl(
                  r.MANAGEMENT_UNDER_DEPT_CODE
                ),
                MANAGEMENT_UNDER_DEPT_NAME: new FormControl(
                  r.MANAGEMENT_UNDER_DEPT_NAME
                ),
                MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(
                  r.MANAGEMENT_UNDER_DEPT_LEVEL
                ),
                MANAGEMENT_WORK_DEPT_CODE: new FormControl(
                  r.MANAGEMENT_WORK_DEPT_CODE
                ),
                MANAGEMENT_WORK_DEPT_NAME: new FormControl(
                  r.MANAGEMENT_WORK_DEPT_NAME
                ),
                MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(
                  r.MANAGEMENT_WORK_DEPT_LEVEL
                ),
                MANAGEMENT_OFFICE_CODE: new FormControl(
                  r.MANAGEMENT_OFFICE_CODE
                ),
                MANAGEMENT_OFFICE_NAME: new FormControl(
                  r.MANAGEMENT_OFFICE_NAME
                ),
                MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(
                  r.MANAGEMENT_OFFICE_SHORT_NAME
                ),
                REPRESENT_POS_CODE: new FormControl(r.REPRESENT_POS_CODE),
                REPRESENT_POS_NAME: new FormControl(r.REPRESENT_POS_NAME),
                REPRESENT_POS_LEVEL: new FormControl(a.REVENUE_CONTRIBUTOR),
                REPRESENT_POS_LEVEL_NAME: new FormControl(
                  r.REPRESENT_POS_LEVEL_NAME
                ),
                REPRESENT_DEPT_CODE: new FormControl(r.REPRESENT_DEPT_CODE),
                REPRESENT_DEPT_NAME: new FormControl(r.REPRESENT_DEPT_NAME),
                REPRESENT_DEPT_LEVEL: new FormControl(r.REPRESENT_DEPT_LEVEL),
                REPRESENT_UNDER_DEPT_CODE: new FormControl(
                  r.REPRESENT_UNDER_DEPT_CODE
                ),
                REPRESENT_UNDER_DEPT_NAME: new FormControl(
                  r.REPRESENT_UNDER_DEPT_NAME
                ),
                REPRESENT_UNDER_DEPT_LEVEL: new FormControl(
                  r.REPRESENT_UNDER_DEPT_LEVEL
                ),
                REPRESENT_WORK_DEPT_CODE: new FormControl(
                  r.REPRESENT_WORK_DEPT_CODE
                ),
                REPRESENT_WORK_DEPT_NAME: new FormControl(
                  r.REPRESENT_WORK_DEPT_NAME
                ),
                REPRESENT_WORK_DEPT_LEVEL: new FormControl(
                  r.REPRESENT_WORK_DEPT_LEVEL
                ),
                REPRESENT_OFFICE_CODE: new FormControl(r.REPRESENT_OFFICE_CODE),
                REPRESENT_OFFICE_NAME: new FormControl(r.REPRESENT_OFFICE_NAME),
                REPRESENT_OFFICE_SHORT_NAME: new FormControl(
                  r.REPRESENT_OFFICE_SHORT_NAME
                ),
                STATUS: new FormControl(r.STATUS),
                REMARK: new FormControl("จนท.สนับสนุน"),
                FIRST_PART: new FormControl(r.FIRST_PART),
                FIRST_MONEY: new FormControl(r.FIRST_MONEY),
                SECOND_PART: new FormControl(r.SECOND_PART),
                SECOND_MONEY: new FormControl(r.SECOND_MONEY),
                TOTAL_MONEY: new FormControl(r.TOTAL_MONEY),
                CONTRIBUTOR_ID: new FormControl(49),
                IS_ACTIVE: new FormControl(1),
                SEQ: new FormControl(r.SEQ),
              })
            );
          });
          // }
        });
      }
    });
  }

  get PaymentDetail(): FormArray {
    return this.controlForm.get("PAYMENT_DETAIL") as FormArray;
  }

  convertDate(date) {
    var fomat = "";
    if (date == null) {
      return fomat;
    } else {
      return this.toDatePickerFormat(new Date(date));
    }
  }
  convertTime(time) {
    var fomat = "";
    if (time == null) {
      return fomat;
    } else {
      return time.slice(10, 16).replace(/\s+/g, "");
    }
  }
  convertNo(No) {
    var fomat = "";
    if (No == 0) {
      return fomat;
    } else {
      return No;
    }
  }
  convertYear(Year) {
    var fomat = "";
    if (Year == null) {
      return fomat;
    } else {
      return parseInt(Year.slice(0, 4)) + 543;
    }
  }
  toDatePickerFormat(d: any) {
    return {
      date: {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        day: d.getDate(),
      },
      formatted: toLocalShort(d.toString()).replace(/ /g, " "),
    };
  }

  person_PAYMENT_FINE(): number {
    let per = this.person.get("detail").value;

    var sum = 0;
    per.map((m) => {
      sum += parseFloat(m.FINE);
    });

    return sum;
  }

  person_BRIBE_MONEY(): number {
    let per = this.person.get("detail").value;

    var sum = 0;
    per.map((m) => {
      sum += parseFloat(m.BRIBE_MONEY);
    });

    return sum;
  }

  person_REWARD_MONEY(): number {
    let per = this.person.get("detail").value;

    var sum = 0;
    per.map((m) => {
      sum += parseFloat(m.REWARD_MONEY);
    });

    return sum;
  }

  person_TREASURY_MONEY(): number {
    let per = this.person.get("detail").value;

    var sum = 0;
    per.map((m) => {
      sum += parseFloat(m.TREASURY_MONEY);
    });

    return sum;
  }

  getDatepiker(d, t) {
    if (d.date.month < 10 && d.date.day < 10) {
      var date =
        d.date.year + "-0" + d.date.month + "-0" + d.date.day + " " + t + ":00";
      return date;
    } else if (d.date.month < 10 && d.date.day >= 10) {
      var date =
        d.date.year + "-0" + d.date.month + "-" + d.date.day + " " + t + ":00";
      return date;
    } else if (d.date.day < 10 && d.date.month >= 10) {
      var date =
        d.date.year + "-" + d.date.month + "-0" + d.date.day + " " + t + ":00";
      return date;
    } else {
      var date =
        d.date.year + "-" + d.date.month + "-" + d.date.day + " " + t + ":00";
      return date;
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////mode R///////////////////////////////////////////////////////////////////////////////////////////////
  backupStaff = [];
  setcollapse5 = true;
  setFormControl2() {
    this.person = this.fb.group({
      detail: this.fb.array([]),
    });

    this.form_Collapse1 = this.fb.group({
      ARREST_CODE: new FormControl(""),
      OCCURRENCE_DATE: new FormControl(""),
      OCCURRENCE_TIME: new FormControl(""),
      SUB_DISTRICT_NAME: new FormControl(""),
      ARREST_STAFF: new FormControl(""),
      OPREATION_POS_NAME: new FormControl(""),
      OPERATION_OFFICE_NAME: new FormControl(""),
      SUBSECTION_NAME: new FormControl(""),
      SECTION_NAME: new FormControl(""),
      GUILTBASE_NAME: new FormControl(""),
      PENALTY_DESC: new FormControl(""),
      LAWSUIT_NO: new FormControl(""),
      LAWSUIT_NO_YEAR: new FormControl(""),
      LAWSUIT_DATE: new FormControl(""),
      LAWSUIT_TIME: new FormControl(""),
      NOTICE_ID: new FormControl(""),
      ARREST_ID: new FormControl(""),
    });

    this.form_BRIBE_MONEY = this.fb.group({
      NOTICE_CODE: new FormControl(""),
      NOTICE_DATE: new FormControl(""),
      NOTICE_TIME: new FormControl(""),
      LAWBREAKER_NAME: new FormControl(""),
      NOTICE_STAFF: new FormControl(""),
      OPERATION_DEPT_NAME: new FormControl(""),
      BRIBE_CODE: new FormControl(""),
      BRIBE_OFFICE_CODE: new FormControl(""),
      BRIBE_OFFICE_NAME: new FormControl(""),
      BRIBE_OFFICE_SHORT_NAME: new FormControl(""),
      BRIBE_OFFICE_ID: new FormControl(""),
      BRIBE_DATE: new FormControl(""),
      BRIBE_TIME: new FormControl(""),
      APPROVE_PAYMENT_DATE: new FormControl(""),
      APPROVE_PAYMENT_TIME: new FormControl(""),
      COMMAND_DETAIL_ID: new FormControl(""),
      INFORMER_INFO: new FormControl(""), //ผู้แจ้งความได้ทราบว่า
      AUTHORITY_DESC: new FormControl(""), //ความเห็นของผู้มีอำนาจอนุมัติ
      IS_ACTIVE: new FormControl(""),
      IS_PAY: new FormControl(""),
      BRIBE_MONEY: new FormControl(""),
      INDICTMENT_ID: new FormControl(this.INDICTMENT_ID),
      HAVE_NOTICE: new FormControl(""),
      BRIBE_REWARD_ID: new FormControl(""),
      setStaff: this.fb.array([this.set_CONTRIBUTOR_ID38()]),
    });
    this.form_REWARD_MONEY = this.fb.group({
      COMPARE_NO: new FormControl(""),
      COMPARE_NO_YEAR: new FormControl(""),
      REWARD_CODE: new FormControl(""),
      REWARD_TYPE: new FormControl(""),
      REFFERENCE_CODE: new FormControl(""),
      REWARD_OFFICE_CODE: new FormControl(""),
      REWARD_OFFICE_NAME: new FormControl(""),
      REWARD_OFFICE_SHORT_NAME: new FormControl(""),
      REWARD_OFFICE_ID: new FormControl(""),
      REWARD_DATE: new FormControl(""),
      REWARD_TIME: new FormControl(""),
      FIRST_PART_TOTAL: new FormControl(""),
      FIRST_MONEY_TOTAL: new FormControl(""),
      FIRST_MONEY_PER_PART: new FormControl(""),
      FIRST_REMAINDER: new FormControl(""),
      SECOND_PART_TOTAL: new FormControl(""),
      SECOND_MONEY_TOTAL: new FormControl(""),
      SECOND_MONEY_PER_PART: new FormControl(""),
      SECOND_REMAINDER: new FormControl(""),
      REWARD_MONEY: new FormControl(""),
      BRIBE_MONEY: new FormControl(""),
      AUTHORITY_DESC: new FormControl(""), //ความเห็นของผู้มีอำนาจอนุมัติ รว.4 หรือ รว.5
      AUTHORITY_COMMAND_DESC: new FormControl(""), //ความเห็นและคำสั่งของผู้บังคับบัญชา รว.7
      APPROVE_PAYMENT_DATE: new FormControl(""), //วันที่จ่ายเงินรางวัล
      APPROVE_PAYMENT_TIME: new FormControl(""),
      IS_ACTIVE: new FormControl(""),
      IS_PAY: new FormControl(""),
      PAYMENT_ID: new FormControl(""),
      BRIBE_REWARD_ID: new FormControl(""),
      REWARD_ID: new FormControl(""),
      RequestRewardDetail: this.fb.array([]),
      setStaff: this.fb.array([
        this.set_CONTRIBUTOR_ID43(),
        this.set_CONTRIBUTOR_ID44(),
        this.set_CONTRIBUTOR_ID45(),
      ]),
    });

    this.controlForm = this.fb.group({
      PAYMENT_DETAIL: this.fb.array([]),
      PAYMENT_FINE: new FormControl(""),
      TREASURY_MONEY: new FormControl(""),
      BRIBE_MONEY: new FormControl(""),
      REWARD_MONEY: new FormControl(""),
      TOTAL_BRIBE_REWARD: new FormControl(""),
    });

    let param = { INDICTMENT_ID: this.INDICTMENT_ID };
    this.RewardService.RequestArrestLawsuitProveComparegetByCon(
      "RequestArrestLawsuitProveComparegetByCon",
      param
    ).then((res) => {
      let parama = { COMPARE_ID: res[0].COMPARE_ID };
      this.RewardService.ComparegetByCon("ComparegetByCon", parama).then(
        (com) => {
          this.COMPARE_ID = com.COMPARE_ID;
          let control = <FormArray>this.person.controls.detail;
          com.CompareMapping.map((m) => {
            if (m.CompareArrestIndictmentDetail.length == 0) {
              this.setcollapse5 = false;
            } else {
              this.setcollapse5 = true;
              m.CompareArrestIndictmentDetail.map((person) => {
                if (person.TITLE_SHORT_NAME_TH == "null") {
                  person.TITLE_SHORT_NAME_TH = "";
                }
                if (person.TITLE_SHORT_NAME_EN == "null") {
                  person.TITLE_SHORT_NAME_EN = "";
                }
                if (person.FIRST_NAME == "null") {
                  person.FIRST_NAME = "";
                }
                if (person.MIDDLE_NAME == "null") {
                  person.MIDDLE_NAME = "";
                }
                if (person.LAST_NAME == "null") {
                  person.LAST_NAME = "";
                }
                if (person.COMPANY_NAME == "null") {
                  person.COMPANY_NAME = "";
                }

                var name = "";
                if (person.PERSON_TYPE == 0) {
                  name = `${person.TITLE_SHORT_NAME_TH || ""}${
                    person.FIRST_NAME || ""
                  } ${person.MIDDLE_NAME || ""} ${person.LAST_NAME || ""}`;
                } else if (person.PERSON_TYPE == 1) {
                  name = `${person.TITLE_SHORT_NAME_EN || ""}${
                    person.FIRST_NAME || ""
                  } ${person.MIDDLE_NAME || ""} ${person.LAST_NAME || ""}`;
                } else {
                  name = `${person.TITLE_SHORT_NAME_TH || ""}${
                    person.COMPANY_NAME || ""
                  }`;
                }

                m.CompareDetail.map((d) => {
                  control.push(
                    this.fb.group({
                      NAME: new FormControl(name),
                      // RECEIPT: new FormControl(d.RECEIPT_NO + '/' + d.RECEIPT_BOOK_NO),
                      RECEIPT: new FormControl(
                        this.setReceiotBookNo(d.RECEIPT_BOOK_NO, d.RECEIPT_NO)
                      ),
                      BRIBE_MONEY: new FormControl(d.BRIBE_MONEY),
                      REWARD_MONEY: new FormControl(d.REWARD_MONEY),
                      TREASURY_MONEY: new FormControl(d.TREASURY_MONEY),
                      FINE: new FormControl(d.PAYMENT_FINE),
                    })
                  );
                });
              });
            }
          });

          let re = [];
          re.push(res[0]);
          re.map((m) => {
            let HAVE_NOTICE;
            if (m.NOTICE_ID == null || m.NOTICE_ID == "") {
              HAVE_NOTICE = 0;
              this.HAVE_NOTICE = 0;
            } else {
              HAVE_NOTICE = 1;
              this.HAVE_NOTICE = 1;
            }
            this.form_Collapse1.patchValue({
              ARREST_CODE: m.ARREST_CODE || "",
              OCCURRENCE_DATE: m.OCCURRENCE_DATE || "",
              OCCURRENCE_TIME: m.OCCURRENCE_TIME || "",
              SUB_DISTRICT_NAME:
                m.SUB_DISTRICT_NAME_TH +
                  " " +
                  m.DISTRICT_NAME_TH +
                  " " +
                  m.PROVINCE_NAME_TH || "",
              ARREST_STAFF: m.ARREST_STAFF_NAME || "",
              OPREATION_POS_NAME: m.OPREATION_POS_NAME || "",
              OPERATION_OFFICE_NAME: m.OPERATION_OFFICE_SHORT_NAME || "",
              SUBSECTION_NAME: m.SUBSECTION_NAME || "",
              SECTION_NAME: m.SECTION_NAME || "",
              GUILTBASE_NAME: m.GUILTBASE_NAME || "",
              PENALTY_DESC: m.PENALTY_DESC || "",
              LAWSUIT_NO: m.LAWSUIT_NO ? m.LAWSUIT_NO.split("/")[0] : "",
              LAWSUIT_NO_YEAR: m.LAWSUIT_NO_YEAR || "",
              LAWSUIT_DATE: m.LAWSUIT_DATE || "",
              LAWSUIT_TIME: m.LAWSUIT_TIME || "",
              NOTICE_ID: m.NOTICE_ID || "",
              ARREST_ID: m.ARREST_ID || "",
            });

            let paramss = { REWARD_ID: this.REWARD_ID };
            this.RewardService.RequestRewardgetByCon(
              "RequestRewardgetByCon",
              paramss
            ).then((res) => {
              let PAYMENT_ID;
              if (m.PAYMENT_ID == null) {
                PAYMENT_ID = "";
              } else {
                PAYMENT_ID = m.PAYMENT_ID;
              }
              this.COMPARE_NO = m.COMPARE_NO;
              this.BRIBE_REWARD_ID = parseInt(res.BRIBE_REWARD_ID);

              this.form_REWARD_MONEY.patchValue({
                COMPARE_NO: m.COMPARE_NO,
                COMPARE_NO_YEAR: m.COMPARE_NO_YEAR,
                REWARD_CODE: res.REWARD_CODE,
                REWARD_TYPE: res.REWARD_TYPE,
                REFFERENCE_CODE: res.REFFERENCE_CODE,
                REWARD_OFFICE_CODE: res.REWARD_OFFICE_CODE,
                REWARD_OFFICE_NAME: res.REWARD_OFFICE_NAME,
                REWARD_OFFICE_SHORT_NAME: res.REWARD_OFFICE_NAME,
                REWARD_OFFICE_ID: res.REWARD_OFFICE_ID,
                REWARD_DATE: this.convertDate(res.REWARD_DATE),
                REWARD_TIME: this.convertTime(res.REWARD_DATE),
                FIRST_PART_TOTAL: res.FIRST_PART_TOTAL,
                FIRST_MONEY_TOTAL: res.FIRST_MONEY_TOTAL,
                FIRST_MONEY_PER_PART: res.FIRST_MONEY_PER_PART,
                FIRST_REMAINDER: res.FIRST_REMAINDER,
                SECOND_PART_TOTAL: res.SECOND_PART_TOTAL,
                SECOND_MONEY_TOTAL: res.SECOND_MONEY_TOTAL,
                SECOND_MONEY_PER_PART: res.SECOND_MONEY_PER_PART,
                SECOND_REMAINDER: res.SECOND_REMAINDER,
                REWARD_MONEY: res.REWARD_MONEY,
                BRIBE_MONEY: res.BRIBE_MONEY,
                AUTHORITY_DESC: res.AUTHORITY_DESC, //ความเห็นของผู้มีอำนาจอนุมัติ รว.4 หรือ รว.5
                AUTHORITY_COMMAND_DESC: res.AUTHORITY_COMMAND_DESC, //ความเห็นและคำสั่งของผู้บังคับบัญชา รว.7
                APPROVE_PAYMENT_DATE: res.APPROVE_PAYMENT_DATE,
                APPROVE_PAYMENT_TIME: res.APPROVE_PAYMENT_TIME,
                IS_ACTIVE: 1,
                IS_PAY: parseInt(res.IS_PAY),
                PAYMENT_ID: PAYMENT_ID,
                BRIBE_REWARD_ID: res.BRIBE_REWARD_ID,
                REWARD_ID: parseInt(res.REWARD_ID),
                // setStaff :[],
              });
              let control = this.form_REWARD_MONEY.get(
                "RequestRewardDetail"
              ) as FormArray;
              control.push(this.fb.group(res.RequestRewardDetail[0]));

              res.RequestRewardStaff.map((m) => {
                if (m.IS_ACTIVE == 1) {
                  m.CONTRIBUTOR_ID = parseInt(m.CONTRIBUTOR_ID);
                  m.FULL_NAME =
                    m.TITLE_SHORT_NAME_TH + m.FIRST_NAME + " " + m.LAST_NAME;
                  if (m.CONTRIBUTOR_ID == 43) {
                    let control = <FormArray>(
                      this.form_REWARD_MONEY.controls.setStaff
                    );
                    control.at(0).patchValue(m);
                  } else if (m.CONTRIBUTOR_ID == 44) {
                    let control = <FormArray>(
                      this.form_REWARD_MONEY.controls.setStaff
                    );
                    control.at(1).patchValue(m);
                  } else if (m.CONTRIBUTOR_ID == 45) {
                    let control = <FormArray>(
                      this.form_REWARD_MONEY.controls.setStaff
                    );
                    control.at(2).patchValue(m);
                  }
                }
              });

              this.PAYMENT_FINE = this.person_PAYMENT_FINE();
              this.TREASURY_MONEY = this.person_TREASURY_MONEY();
              this.BRIBE_MONEY = this.person_BRIBE_MONEY();
              this.REWARD_MONEY = this.person_REWARD_MONEY();
              this.TOTAL_BRIBE_REWARD =
                this.person_BRIBE_MONEY() + this.person_REWARD_MONEY();
              this.controlForm.patchValue({
                PAYMENT_FINE: this.person_PAYMENT_FINE(),
                TREASURY_MONEY: this.person_TREASURY_MONEY(),
                BRIBE_MONEY: this.person_BRIBE_MONEY(),
                REWARD_MONEY: this.person_REWARD_MONEY(),
                TOTAL_BRIBE_REWARD:
                  this.person_BRIBE_MONEY() + this.person_REWARD_MONEY(),
              });

              this.setTableStaff(res.RequestRewardStaff);
            });
          });
        }
      );
    });
  }

  setTableStaff(res) {
    let setStaff = [];
    res.map((m) => {
      if (m.IS_ACTIVE == 1) {
        if (m.LAST_NAME == null || m.LAST_NAME == "null") {
          m.LAST_NAME = "";
        }
        m.CONTRIBUTOR_ID = parseInt(m.CONTRIBUTOR_ID);
        m.FULL_NAME = m.FIRST_NAME + " " + m.LAST_NAME || "";
        m.A_CONTRIBUTOR = m.REPRESENT_POS_LEVEL;
        m.A_CONTRIBUTOR_ID = m.CONTRIBUTOR_ID;
        m.A_MANAGEMENT_POS_LEVEL = m.MANAGEMENT_POS_LEVEL;
        m.A_MANAGEMENT_POS_LEVEL_NAME = m.TITLE_SHORT_NAME_TH;
        m.A_MANAGEMENT_POS_NAME = m.MANAGEMENT_POS_NAME;
        m.A_OPERATION_POS_LEVEL_NAME = m.OPERATION_POS_LEVEL_NAME;
        m.A_OPREATION_POS_LEVEL = m.OPREATION_POS_LEVEL;
        m.A_OPREATION_POS_NAME = m.OPREATION_POS_NAME;
        m.A_PART_I = parseInt(m.FIRST_PART);
        m.A_PART_II = parseInt(m.SECOND_PART);
        m.A_STAFF = m.STAFF;
        m.A_STAFF_ID = m.STAFF_ID;
        m.A_TITLE_ID = m.TITLE_ID;
        m.A_TITLE_SHORT_NAME_TH = m.TITLE_SHORT_NAME_TH;
        m.A_NAME = m.FULL_NAME;
        m.A_STAFF_TYPE = parseInt(m.REPRESENT_DEPT_CODE);
        m.A_MONEY_I = parseFloat(m.FIRST_MONEY);
        m.A_MONEY_II = parseFloat(m.SECOND_MONEY);
        m.MONEY_TOTAL = parseFloat(m.TOTAL_MONEY);
        m.A_MONEY_III = parseFloat(m.TOTAL_MONEY);
        m.A_STATUS = parseInt(m.REPRESENT_POS_CODE);

        m.STAFF_ID = m.STAFF_ID;
        m.REWARD_ID = m.REWARD_ID;
        m.STAFF_REF_ID = m.STAFF_REF_ID;
        m.TITLE_ID = m.TITLE_ID;
        m.STAFF_CODE = m.STAFF_CODE;
        m.ID_CARD = m.ID_CARD;
        m.STAFF_TYPE = m.STAFF_TYPE;
        m.TITLE_NAME_TH = m.TITLE_NAME_TH;
        m.TITLE_NAME_EN = m.TITLE_NAME_EN;
        m.TITLE_SHORT_NAME_TH = m.TITLE_SHORT_NAME_TH;
        m.TITLE_SHORT_NAME_EN = m.TITLE_SHORT_NAME_EN;
        m.FIRST_NAME = m.FIRST_NAME;
        m.LAST_NAME = m.LAST_NAME || "";
        m.AGE = m.AGE;
        m.OPERATION_POS_CODE = m.OPERATION_POS_CODE;
        m.OPREATION_POS_NAME = m.OPREATION_POS_NAME;
        m.OPREATION_POS_LEVEL = m.OPREATION_POS_LEVEL;
        m.OPERATION_POS_LEVEL_NAME = m.OPERATION_POS_LEVEL_NAME;
        m.OPERATION_DEPT_CODE = m.OPERATION_DEPT_CODE;
        m.OPERATION_DEPT_NAME = m.OPERATION_DEPT_NAME;
        m.OPERATION_DEPT_LEVEL = m.OPERATION_DEPT_LEVEL;
        m.OPERATION_UNDER_DEPT_CODE = m.OPERATION_UNDER_DEPT_CODE;
        m.OPERATION_UNDER_DEPT_NAME = m.OPERATION_UNDER_DEPT_NAME;
        m.OPERATION_UNDER_DEPT_LEVEL = m.OPERATION_UNDER_DEPT_LEVEL;
        m.OPERATION_WORK_DEPT_CODE = m.OPERATION_WORK_DEPT_CODE;
        m.OPERATION_WORK_DEPT_NAME = m.OPERATION_WORK_DEPT_NAME;
        m.OPERATION_WORK_DEPT_LEVEL = m.OPERATION_WORK_DEPT_LEVEL;
        m.OPERATION_OFFICE_CODE = m.OPERATION_OFFICE_CODE;
        m.OPERATION_OFFICE_NAME = m.OPERATION_OFFICE_NAME;
        m.OPERATION_OFFICE_SHORT_NAME = m.OPERATION_OFFICE_SHORT_NAME;
        m.MANAGEMENT_POS_CODE = m.MANAGEMENT_POS_CODE;
        m.MANAGEMENT_POS_NAME = m.MANAGEMENT_POS_NAME;
        m.MANAGEMENT_POS_LEVEL = m.MANAGEMENT_POS_LEVEL;
        m.MANAGEMENT_POS_LEVEL_NAME = m.MANAGEMENT_POS_LEVEL_NAME;
        m.MANAGEMENT_DEPT_CODE = m.MANAGEMENT_DEPT_CODE;
        m.MANAGEMENT_DEPT_NAME = m.MANAGEMENT_DEPT_NAME;
        m.MANAGEMENT_DEPT_LEVEL = m.MANAGEMENT_DEPT_LEVEL;
        m.MANAGEMENT_UNDER_DEPT_CODE = m.MANAGEMENT_UNDER_DEPT_CODE;
        m.MANAGEMENT_UNDER_DEPT_NAME = m.MANAGEMENT_UNDER_DEPT_NAME;
        m.MANAGEMENT_UNDER_DEPT_LEVEL = m.MANAGEMENT_UNDER_DEPT_LEVEL;
        m.MANAGEMENT_WORK_DEPT_CODE = m.MANAGEMENT_WORK_DEPT_CODE;
        m.MANAGEMENT_WORK_DEPT_NAME = m.MANAGEMENT_WORK_DEPT_NAME;
        m.MANAGEMENT_WORK_DEPT_LEVEL = m.MANAGEMENT_WORK_DEPT_LEVEL;
        m.MANAGEMENT_OFFICE_CODE = m.MANAGEMENT_OFFICE_CODE;
        m.MANAGEMENT_OFFICE_NAME = m.MANAGEMENT_OFFICE_NAME;
        m.MANAGEMENT_OFFICE_SHORT_NAME = m.MANAGEMENT_OFFICE_SHORT_NAME;
        m.REPRESENT_POS_CODE = m.REPRESENT_POS_CODE;
        m.REPRESENT_POS_NAME = m.REPRESENT_POS_NAME;
        m.REPRESENT_POS_LEVEL = m.REPRESENT_POS_LEVEL;
        m.REPRESENT_POS_LEVEL_NAME = m.REPRESENT_POS_LEVEL_NAME;
        m.REPRESENT_DEPT_CODE = m.REPRESENT_DEPT_CODE;
        m.REPRESENT_DEPT_NAME = m.REPRESENT_DEPT_NAME;
        m.REPRESENT_DEPT_LEVEL = m.REPRESENT_DEPT_LEVEL;
        m.REPRESENT_UNDER_DEPT_CODE = m.REPRESENT_UNDER_DEPT_CODE;
        m.REPRESENT_UNDER_DEPT_NAME = m.REPRESENT_UNDER_DEPT_NAME;
        m.REPRESENT_UNDER_DEPT_LEVEL = m.REPRESENT_UNDER_DEPT_LEVEL;
        m.REPRESENT_WORK_DEPT_CODE = m.REPRESENT_WORK_DEPT_CODE;
        m.REPRESENT_WORK_DEPT_NAME = m.REPRESENT_WORK_DEPT_NAME;
        m.REPRESENT_WORK_DEPT_LEVEL = m.REPRESENT_WORK_DEPT_LEVEL;
        m.REPRESENT_OFFICE_CODE = m.REPRESENT_OFFICE_CODE;
        m.REPRESENT_OFFICE_NAME = m.REPRESENT_OFFICE_NAME;
        m.REPRESENT_OFFICE_SHORT_NAME = m.REPRESENT_OFFICE_SHORT_NAME;
        m.STATUS = m.STATUS;
        m.REMARK = m.REMARK;
        m.FIRST_PART = m.FIRST_PART;
        m.FIRST_MONEY = m.FIRST_MONEY;
        m.SECOND_PART = m.SECOND_PART;
        m.SECOND_MONEY = m.SECOND_MONEY;
        m.TOTAL_MONEY = m.TOTAL_MONEY;
        m.CONTRIBUTOR_ID = m.CONTRIBUTOR_ID;
        m.IS_ACTIVE = m.IS_ACTIVE;
        m.SEQ = m.SEQ;
        if (
          m.CONTRIBUTOR_ID == 47 ||
          m.CONTRIBUTOR_ID == 48 ||
          m.CONTRIBUTOR_ID == 49
        ) {
          setStaff.push(m);
        }
      }
    });
    let control = this.controlForm.get("PAYMENT_DETAIL") as FormArray;

    setStaff.sort((a, b) => {
      return <number>parseInt(a.SEQ) - <number>parseInt(b.SEQ);
    });

    setStaff.map((m, i) => {
      control.push(this.fb.group(m));
    });
    let controls = <FormArray>this.form_REWARD_MONEY.controls.setStaff;
    let controlss = <FormArray>this.form_BRIBE_MONEY.controls.setStaff;
    this.backupStaff.push({ controlTableForm: control.getRawValue() });
    this.backupStaff.push({ form_REWARD_MONEY: controls.getRawValue() });
    this.backupStaff.push({ form_BRIBE_MONEY: controlss.getRawValue() });
    // console.log("backupStaff : ",this.backupStaff[0].controlTableForm);
    // console.log("backupStaff : ",this.backupStaff[1].form_REWARD_MONEY);
    // console.log("backupStaff : ",this.backupStaff[2].form_BRIBE_MONEY);
  }

  setFormControl3() {
    this.person = this.fb.group({
      detail: this.fb.array([]),
    });

    this.form_Collapse1 = this.fb.group({
      ARREST_CODE: new FormControl(""),
      OCCURRENCE_DATE: new FormControl(""),
      OCCURRENCE_TIME: new FormControl(""),
      SUB_DISTRICT_NAME: new FormControl(""),
      ARREST_STAFF: new FormControl(""),
      OPREATION_POS_NAME: new FormControl(""),
      OPERATION_OFFICE_NAME: new FormControl(""),
      SUBSECTION_NAME: new FormControl(""),
      SECTION_NAME: new FormControl(""),
      GUILTBASE_NAME: new FormControl(""),
      PENALTY_DESC: new FormControl(""),
      LAWSUIT_NO: new FormControl(""),
      LAWSUIT_NO_YEAR: new FormControl(""),
      LAWSUIT_DATE: new FormControl(""),
      LAWSUIT_TIME: new FormControl(""),
      NOTICE_ID: new FormControl(""),
      ARREST_ID: new FormControl(""),
    });

    this.form_BRIBE_MONEY = this.fb.group({
      NOTICE_CODE: new FormControl(""),
      NOTICE_DATE: new FormControl(""),
      NOTICE_TIME: new FormControl(""),
      LAWBREAKER_NAME: new FormControl(""),
      NOTICE_STAFF: new FormControl(""),
      OPERATION_DEPT_NAME: new FormControl(""),
      BRIBE_CODE: new FormControl(""),
      BRIBE_OFFICE_CODE: new FormControl(""),
      BRIBE_OFFICE_NAME: new FormControl(""),
      BRIBE_OFFICE_SHORT_NAME: new FormControl(""),
      BRIBE_OFFICE_ID: new FormControl(""),
      BRIBE_DATE: new FormControl(""),
      BRIBE_TIME: new FormControl(""),
      APPROVE_PAYMENT_DATE: new FormControl(""),
      APPROVE_PAYMENT_TIME: new FormControl(""),
      COMMAND_DETAIL_ID: new FormControl(""),
      INFORMER_INFO: new FormControl(""), //ผู้แจ้งความได้ทราบว่า
      AUTHORITY_DESC: new FormControl(""), //ความเห็นของผู้มีอำนาจอนุมัติ
      IS_ACTIVE: new FormControl(""),
      IS_PAY: new FormControl(""),
      BRIBE_MONEY: new FormControl(""),
      INDICTMENT_ID: new FormControl(this.INDICTMENT_ID),
      HAVE_NOTICE: new FormControl(""),
      BRIBE_REWARD_ID: new FormControl(""),
      BRIBE_ID: new FormControl(""),
      setStaff: this.fb.array([this.set_CONTRIBUTOR_ID38()]),
    });
    this.form_REWARD_MONEY = this.fb.group({
      COMPARE_NO: new FormControl(""),
      COMPARE_NO_YEAR: new FormControl(""),
      REWARD_CODE: new FormControl(""),
      REWARD_TYPE: new FormControl(""),
      REFFERENCE_CODE: new FormControl(""),
      REWARD_OFFICE_CODE: new FormControl(""),
      REWARD_OFFICE_NAME: new FormControl(""),
      REWARD_OFFICE_SHORT_NAME: new FormControl(""),
      REWARD_OFFICE_ID: new FormControl(""),
      REWARD_DATE: new FormControl(""),
      REWARD_TIME: new FormControl(""),
      FIRST_PART_TOTAL: new FormControl(""),
      FIRST_MONEY_TOTAL: new FormControl(""),
      FIRST_MONEY_PER_PART: new FormControl(""),
      FIRST_REMAINDER: new FormControl(""),
      SECOND_PART_TOTAL: new FormControl(""),
      SECOND_MONEY_TOTAL: new FormControl(""),
      SECOND_MONEY_PER_PART: new FormControl(""),
      SECOND_REMAINDER: new FormControl(""),
      REWARD_MONEY: new FormControl(""),
      BRIBE_MONEY: new FormControl(""),
      AUTHORITY_DESC: new FormControl(""), //ความเห็นของผู้มีอำนาจอนุมัติ รว.4 หรือ รว.5
      AUTHORITY_COMMAND_DESC: new FormControl(""), //ความเห็นและคำสั่งของผู้บังคับบัญชา รว.7
      APPROVE_PAYMENT_DATE: new FormControl(""), //วันที่จ่ายเงินรางวัล
      APPROVE_PAYMENT_TIME: new FormControl(""),
      IS_ACTIVE: new FormControl(""),
      IS_PAY: new FormControl(""),
      PAYMENT_ID: new FormControl(""),
      BRIBE_REWARD_ID: new FormControl(""),
      REWARD_ID: new FormControl(""),
      RequestRewardDetail: this.fb.array([]),
      setStaff: this.fb.array([
        this.set_CONTRIBUTOR_ID43(),
        this.set_CONTRIBUTOR_ID44(),
        this.set_CONTRIBUTOR_ID45(),
      ]),
    });

    this.controlForm = this.fb.group({
      PAYMENT_DETAIL: this.fb.array([]),
      PAYMENT_FINE: new FormControl(""),
      TREASURY_MONEY: new FormControl(""),
      BRIBE_MONEY: new FormControl(""),
      REWARD_MONEY: new FormControl(""),
      TOTAL_BRIBE_REWARD: new FormControl(""),
    });

    let param = { INDICTMENT_ID: this.INDICTMENT_ID };
    this.RewardService.RequestArrestLawsuitProveComparegetByCon(
      "RequestArrestLawsuitProveComparegetByCon",
      param
    ).then((res) => {
      let parama = { COMPARE_ID: res[0].COMPARE_ID };
      this.RewardService.ComparegetByCon("ComparegetByCon", parama).then(
        (com) => {
          this.COMPARE_ID = com.COMPARE_ID;
          let control = <FormArray>this.person.controls.detail;
          com.CompareMapping.map((m) => {
            if (m.CompareArrestIndictmentDetail.length == 0) {
              this.setcollapse5 = false;
            } else {
              this.setcollapse5 = true;
              m.CompareArrestIndictmentDetail.map((person) => {
                if (person.TITLE_SHORT_NAME_TH == "null") {
                  person.TITLE_SHORT_NAME_TH = "";
                }
                if (person.TITLE_SHORT_NAME_EN == "null") {
                  person.TITLE_SHORT_NAME_EN = "";
                }
                if (person.FIRST_NAME == "null") {
                  person.FIRST_NAME = "";
                }
                if (person.MIDDLE_NAME == "null") {
                  person.MIDDLE_NAME = "";
                }
                if (person.LAST_NAME == "null") {
                  person.LAST_NAME = "";
                }
                if (person.COMPANY_NAME == "null") {
                  person.COMPANY_NAME = "";
                }

                var name = "";
                if (person.PERSON_TYPE == 0) {
                  name = `${person.TITLE_SHORT_NAME_TH || ""}${
                    person.FIRST_NAME || ""
                  } ${person.MIDDLE_NAME || ""} ${person.LAST_NAME || ""}`;
                } else if (person.PERSON_TYPE == 1) {
                  name = `${person.TITLE_SHORT_NAME_EN || ""}${
                    person.FIRST_NAME || ""
                  } ${person.MIDDLE_NAME || ""} ${person.LAST_NAME || ""}`;
                } else {
                  name = `${person.TITLE_SHORT_NAME_TH || ""}${
                    person.COMPANY_NAME || ""
                  }`;
                }

                m.CompareDetail.map((d) => {
                  control.push(
                    this.fb.group({
                      NAME: new FormControl(name),
                      // RECEIPT: new FormControl(d.RECEIPT_NO + '/' + d.RECEIPT_BOOK_NO),
                      RECEIPT: new FormControl(
                        this.setReceiotBookNo(d.RECEIPT_BOOK_NO, d.RECEIPT_NO)
                      ),
                      BRIBE_MONEY: new FormControl(d.BRIBE_MONEY),
                      REWARD_MONEY: new FormControl(d.REWARD_MONEY),
                      TREASURY_MONEY: new FormControl(d.TREASURY_MONEY),
                      FINE: new FormControl(d.PAYMENT_FINE),
                    })
                  );
                });
              });
            }
          });
          let re = [];
          re.push(res[0]);
          re.map((m) => {
            let HAVE_NOTICE;
            if (m.NOTICE_ID == null || m.NOTICE_ID == "") {
              HAVE_NOTICE = 0;
              this.HAVE_NOTICE = 0;
            } else {
              HAVE_NOTICE = 1;
              this.HAVE_NOTICE = 1;
            }
            this.form_Collapse1.patchValue({
              ARREST_CODE: m.ARREST_CODE || "",
              OCCURRENCE_DATE: m.OCCURRENCE_DATE || "",
              OCCURRENCE_TIME: m.OCCURRENCE_TIME || "",
              SUB_DISTRICT_NAME:
                m.SUB_DISTRICT_NAME_TH +
                  " " +
                  m.DISTRICT_NAME_TH +
                  " " +
                  m.PROVINCE_NAME_TH || "",
              ARREST_STAFF: m.ARREST_STAFF_NAME || "",
              OPREATION_POS_NAME: m.OPREATION_POS_NAME || "",
              OPERATION_OFFICE_NAME: m.OPERATION_OFFICE_SHORT_NAME || "",
              SUBSECTION_NAME: m.SUBSECTION_NAME || "",
              SECTION_NAME: m.SECTION_NAME || "",
              GUILTBASE_NAME: m.GUILTBASE_NAME || "",
              PENALTY_DESC: m.PENALTY_DESC || "",
              LAWSUIT_NO: m.LAWSUIT_NO ? m.LAWSUIT_NO.split("/")[0] : "",
              LAWSUIT_NO_YEAR: m.LAWSUIT_NO_YEAR || "",
              LAWSUIT_DATE: m.LAWSUIT_DATE || "",
              LAWSUIT_TIME: m.LAWSUIT_TIME || "",
              NOTICE_ID: m.NOTICE_ID || "",
              ARREST_ID: m.ARREST_ID || "",
            });

            let params = { BRIBE_ID: this.BRIDE_ID };
            this.RewardService.RequestBribegetByCon(
              "RequestBribegetByCon",
              params
            ).then((res) => {
              let staff = res.RequestBribeStaff[0];
              staff.FULL_NAME =
                staff.TITLE_SHORT_NAME_TH +
                staff.FIRST_NAME +
                " " +
                staff.LAST_NAME;

              this.form_BRIBE_MONEY.patchValue({
                NOTICE_CODE: m.NOTICE_CODE,
                NOTICE_DATE: m.NOTICE_DATE || "",
                NOTICE_TIME: m.NOTICE_TIME || "",
                LAWBREAKER_NAME: m.NOTICE_INFORMER || "",
                NOTICE_STAFF: m.NOTICE_STAFF || "",
                OPERATION_DEPT_NAME: m.NOTICE_OPREATION_POS_NAME || "",
                BRIBE_CODE: res.BRIBE_CODE,
                BRIBE_OFFICE_CODE: res.BRIBE_OFFICE_CODE,
                BRIBE_OFFICE_NAME: res.BRIBE_OFFICE_NAME,
                BRIBE_OFFICE_SHORT_NAME: res.BRIBE_OFFICE_NAME,
                BRIBE_OFFICE_ID: res.BRIBE_OFFICE_ID,
                BRIBE_DATE: this.convertDate(res.BRIBE_DATE),
                BRIBE_TIME: this.convertTime(res.BRIBE_DATE),
                APPROVE_PAYMENT_TIME: res.APPROVE_PAYMENT_DATE,
                APPROVE_PAYMENT_DATE: res.APPROVE_PAYMENT_DATE,
                COMMAND_DETAIL_ID: parseInt(res.COMMAND_DETAIL_ID),
                INFORMER_INFO: res.INFORMER_INFO,
                AUTHORITY_DESC: res.AUTHORITY_DESC,
                IS_ACTIVE: 1,
                IS_PAY: res.IS_PAY,
                BRIBE_MONEY: res.BRIBE_MONEY,
                HAVE_NOTICE: HAVE_NOTICE,
                BRIBE_REWARD_ID: res.BRIBE_REWARD_ID,
                BRIBE_ID: parseInt(res.BRIBE_ID),
                setStaff: res.RequestBribeStaff,
              });
            });

            let paramss = { REWARD_ID: this.REWARD_ID };
            this.RewardService.RequestRewardgetByCon(
              "RequestRewardgetByCon",
              paramss
            ).then((res) => {
              let PAYMENT_ID;
              if (m.PAYMENT_ID == null) {
                PAYMENT_ID = "";
              } else {
                PAYMENT_ID = m.PAYMENT_ID;
              }
              this.COMPARE_NO = m.COMPARE_NO;
              this.BRIBE_REWARD_ID = parseInt(res.BRIBE_REWARD_ID);

              this.form_REWARD_MONEY.patchValue({
                COMPARE_NO: m.COMPARE_NO,
                COMPARE_NO_YEAR: m.COMPARE_NO_YEAR,
                REWARD_CODE: res.REWARD_CODE,
                REWARD_TYPE: res.REWARD_TYPE,
                REFFERENCE_CODE: res.REFFERENCE_CODE,
                REWARD_OFFICE_CODE: res.REWARD_OFFICE_CODE,
                REWARD_OFFICE_NAME: res.REWARD_OFFICE_NAME,
                REWARD_OFFICE_SHORT_NAME: res.REWARD_OFFICE_NAME,
                REWARD_OFFICE_ID: res.REWARD_OFFICE_ID,
                REWARD_DATE: this.convertDate(res.REWARD_DATE),
                REWARD_TIME: this.convertTime(res.REWARD_DATE),
                FIRST_PART_TOTAL: res.FIRST_PART_TOTAL,
                FIRST_MONEY_TOTAL: res.FIRST_MONEY_TOTAL,
                FIRST_MONEY_PER_PART: res.FIRST_MONEY_PER_PART,
                FIRST_REMAINDER: res.FIRST_REMAINDER,
                SECOND_PART_TOTAL: res.SECOND_PART_TOTAL,
                SECOND_MONEY_TOTAL: res.SECOND_MONEY_TOTAL,
                SECOND_MONEY_PER_PART: res.SECOND_MONEY_PER_PART,
                SECOND_REMAINDER: res.SECOND_REMAINDER,
                REWARD_MONEY: res.REWARD_MONEY,
                BRIBE_MONEY: res.BRIBE_MONEY,
                AUTHORITY_DESC: res.AUTHORITY_DESC, //ความเห็นของผู้มีอำนาจอนุมัติ รว.4 หรือ รว.5
                AUTHORITY_COMMAND_DESC: res.AUTHORITY_COMMAND_DESC, //ความเห็นและคำสั่งของผู้บังคับบัญชา รว.7
                APPROVE_PAYMENT_DATE: res.APPROVE_PAYMENT_DATE,
                APPROVE_PAYMENT_TIME: res.APPROVE_PAYMENT_DATE,
                IS_ACTIVE: 1,
                IS_PAY: parseInt(res.IS_PAY),
                PAYMENT_ID: PAYMENT_ID,
                BRIBE_REWARD_ID: res.BRIBE_REWARD_ID,
                REWARD_ID: parseInt(res.REWARD_ID),
                // setStaff :[],
              });
              let control = this.form_REWARD_MONEY.get(
                "RequestRewardDetail"
              ) as FormArray;
              control.push(this.fb.group(res.RequestRewardDetail[0]));

              res.RequestRewardStaff.map((m) => {
                if (m.IS_ACTIVE == 1) {
                  m.CONTRIBUTOR_ID = parseInt(m.CONTRIBUTOR_ID);
                  m.FULL_NAME =
                    m.TITLE_SHORT_NAME_TH + m.FIRST_NAME + " " + m.LAST_NAME;
                  if (m.CONTRIBUTOR_ID == 43) {
                    let control = <FormArray>(
                      this.form_REWARD_MONEY.controls.setStaff
                    );
                    control.at(0).patchValue(m);
                  } else if (m.CONTRIBUTOR_ID == 44) {
                    let control = <FormArray>(
                      this.form_REWARD_MONEY.controls.setStaff
                    );
                    control.at(1).patchValue(m);
                  } else if (m.CONTRIBUTOR_ID == 45) {
                    let control = <FormArray>(
                      this.form_REWARD_MONEY.controls.setStaff
                    );
                    control.at(2).patchValue(m);
                  }
                }
              });

              this.PAYMENT_FINE = this.person_PAYMENT_FINE();
              this.TREASURY_MONEY = this.person_TREASURY_MONEY();
              this.BRIBE_MONEY = this.person_BRIBE_MONEY();
              this.REWARD_MONEY = this.person_REWARD_MONEY();
              this.TOTAL_BRIBE_REWARD =
                this.person_BRIBE_MONEY() + this.person_REWARD_MONEY();
              this.controlForm.patchValue({
                PAYMENT_FINE: this.person_PAYMENT_FINE(),
                TREASURY_MONEY: this.person_TREASURY_MONEY(),
                BRIBE_MONEY: this.person_BRIBE_MONEY(),
                REWARD_MONEY: this.person_REWARD_MONEY(),
                TOTAL_BRIBE_REWARD:
                  this.person_BRIBE_MONEY() + this.person_REWARD_MONEY(),
              });

              this.setTableStaff2(res.RequestRewardStaff);
            });
          });
        }
      );
    });
  }

  setTableStaff2(res) {
    let setStaff = [];

    setStaff.push({
      A_CONTRIBUTOR: "ผู้แจ้งความนำจับ",
      A_CONTRIBUTOR_ID: "",
      A_MANAGEMENT_POS_LEVEL: "",
      A_MANAGEMENT_POS_LEVEL_NAME: "",
      A_MANAGEMENT_POS_NAME: "",
      A_OPERATION_POS_LEVEL_NAME: "",
      A_OPREATION_POS_LEVEL: "",
      A_OPREATION_POS_NAME: "",
      A_PART_I: 0,
      A_PART_II: 0,
      A_STAFF: "",
      A_STAFF_ID: "",
      A_TITLE_ID: "",
      A_TITLE_SHORT_NAME_TH: "",
      A_NAME: "สายลับ(ขอปิดนาม)",
      A_STAFF_TYPE: 0,
      A_MONEY_I: 0,
      A_MONEY_II: 0,
      MONEY_TOTAL: this.BRIBE_MONEY,
      A_MONEY_III: 0,
      A_STATUS: 0,

      FULL_NAME: "",
      STAFF_ID: "",
      REWARD_ID: "",
      STAFF_REF_ID: "",
      TITLE_ID: "",
      STAFF_CODE: "",
      ID_CARD: "",
      STAFF_TYPE: "",
      TITLE_NAME_TH: "",
      TITLE_NAME_EN: "",
      TITLE_SHORT_NAME_TH: "",
      TITLE_SHORT_NAME_EN: "",
      FIRST_NAME: "",
      LAST_NAME: "",
      AGE: "",
      OPERATION_POS_CODE: "",
      OPREATION_POS_NAME: "",
      OPREATION_POS_LEVEL: "",
      OPERATION_POS_LEVEL_NAME: "",
      OPERATION_DEPT_CODE: "",
      OPERATION_DEPT_NAME: "",
      OPERATION_DEPT_LEVEL: "",
      OPERATION_UNDER_DEPT_CODE: "",
      OPERATION_UNDER_DEPT_NAME: "",
      OPERATION_UNDER_DEPT_LEVEL: "",
      OPERATION_WORK_DEPT_CODE: "",
      OPERATION_WORK_DEPT_NAME: "",
      OPERATION_WORK_DEPT_LEVEL: "",
      OPERATION_OFFICE_CODE: "",
      OPERATION_OFFICE_NAME: "",
      OPERATION_OFFICE_SHORT_NAME: "",
      MANAGEMENT_POS_CODE: "",
      MANAGEMENT_POS_NAME: "",
      MANAGEMENT_POS_LEVEL: "",
      MANAGEMENT_POS_LEVEL_NAME: "",
      MANAGEMENT_DEPT_CODE: "",
      MANAGEMENT_DEPT_NAME: "",
      MANAGEMENT_DEPT_LEVEL: "",
      MANAGEMENT_UNDER_DEPT_CODE: "",
      MANAGEMENT_UNDER_DEPT_NAME: "",
      MANAGEMENT_UNDER_DEPT_LEVEL: "",
      MANAGEMENT_WORK_DEPT_CODE: "",
      MANAGEMENT_WORK_DEPT_NAME: "",
      MANAGEMENT_WORK_DEPT_LEVEL: "",
      MANAGEMENT_OFFICE_CODE: "",
      MANAGEMENT_OFFICE_NAME: "",
      MANAGEMENT_OFFICE_SHORT_NAME: "",
      REPRESENT_POS_CODE: "",
      REPRESENT_POS_NAME: "",
      REPRESENT_POS_LEVEL: "ผู้แจ้งความนำจับ",
      REPRESENT_POS_LEVEL_NAME: "",
      REPRESENT_DEPT_CODE: "",
      REPRESENT_DEPT_NAME: "",
      REPRESENT_DEPT_LEVEL: "",
      REPRESENT_UNDER_DEPT_CODE: "",
      REPRESENT_UNDER_DEPT_NAME: "",
      REPRESENT_UNDER_DEPT_LEVEL: "",
      REPRESENT_WORK_DEPT_CODE: "",
      REPRESENT_WORK_DEPT_NAME: "",
      REPRESENT_WORK_DEPT_LEVEL: "",
      REPRESENT_OFFICE_CODE: "",
      REPRESENT_OFFICE_NAME: "",
      REPRESENT_OFFICE_SHORT_NAME: "",
      STATUS: "",
      REMARK: "",
      FIRST_PART: "",
      FIRST_MONEY: "",
      SECOND_PART: "",
      SECOND_MONEY: "",
      TOTAL_MONEY: "",
      CONTRIBUTOR_ID: "",
      IS_ACTIVE: 0,
      SEQ: "",
    });
    res.map((m) => {
      if (m.IS_ACTIVE == 1) {
        if (m.LAST_NAME == null || m.LAST_NAME == "null") {
          m.LAST_NAME = "";
        }
        m.CONTRIBUTOR_ID = parseInt(m.CONTRIBUTOR_ID);
        m.FULL_NAME = m.FIRST_NAME + " " + m.LAST_NAME || "";
        m.A_CONTRIBUTOR = m.REPRESENT_POS_LEVEL;
        m.A_CONTRIBUTOR_ID = m.CONTRIBUTOR_ID;
        m.A_MANAGEMENT_POS_LEVEL = m.MANAGEMENT_POS_LEVEL;
        m.A_MANAGEMENT_POS_LEVEL_NAME = m.TITLE_SHORT_NAME_TH;
        m.A_MANAGEMENT_POS_NAME = m.MANAGEMENT_POS_NAME;
        m.A_OPERATION_POS_LEVEL_NAME = m.OPERATION_POS_LEVEL_NAME;
        m.A_OPREATION_POS_LEVEL = m.OPREATION_POS_LEVEL;
        m.A_OPREATION_POS_NAME = m.OPREATION_POS_NAME;
        m.A_PART_I = parseInt(m.FIRST_PART);
        m.A_PART_II = parseInt(m.SECOND_PART);
        m.A_STAFF = m.STAFF;
        m.A_STAFF_ID = m.STAFF_ID;
        m.A_TITLE_ID = m.TITLE_ID;
        m.A_TITLE_SHORT_NAME_TH = m.TITLE_SHORT_NAME_TH;
        m.A_NAME = m.FULL_NAME;
        m.A_STAFF_TYPE = parseInt(m.REPRESENT_DEPT_CODE);
        m.A_MONEY_I = parseFloat(m.FIRST_MONEY);
        m.A_MONEY_II = parseFloat(m.SECOND_MONEY);
        m.MONEY_TOTAL = parseFloat(m.TOTAL_MONEY);
        m.A_MONEY_III = parseFloat(m.TOTAL_MONEY);
        m.A_STATUS = parseInt(m.REPRESENT_POS_CODE);

        m.STAFF_ID = m.STAFF_ID;
        m.REWARD_ID = m.REWARD_ID;
        m.STAFF_REF_ID = m.STAFF_REF_ID;
        m.TITLE_ID = m.TITLE_ID;
        m.STAFF_CODE = m.STAFF_CODE;
        m.ID_CARD = m.ID_CARD;
        m.STAFF_TYPE = m.STAFF_TYPE;
        m.TITLE_NAME_TH = m.TITLE_NAME_TH;
        m.TITLE_NAME_EN = m.TITLE_NAME_EN;
        m.TITLE_SHORT_NAME_TH = m.TITLE_SHORT_NAME_TH;
        m.TITLE_SHORT_NAME_EN = m.TITLE_SHORT_NAME_EN;
        m.FIRST_NAME = m.FIRST_NAME;
        m.LAST_NAME = m.LAST_NAME || "";
        m.AGE = m.AGE;
        m.OPERATION_POS_CODE = m.OPERATION_POS_CODE;
        m.OPREATION_POS_NAME = m.OPREATION_POS_NAME;
        m.OPREATION_POS_LEVEL = m.OPREATION_POS_LEVEL;
        m.OPERATION_POS_LEVEL_NAME = m.OPERATION_POS_LEVEL_NAME;
        m.OPERATION_DEPT_CODE = m.OPERATION_DEPT_CODE;
        m.OPERATION_DEPT_NAME = m.OPERATION_DEPT_NAME;
        m.OPERATION_DEPT_LEVEL = m.OPERATION_DEPT_LEVEL;
        m.OPERATION_UNDER_DEPT_CODE = m.OPERATION_UNDER_DEPT_CODE;
        m.OPERATION_UNDER_DEPT_NAME = m.OPERATION_UNDER_DEPT_NAME;
        m.OPERATION_UNDER_DEPT_LEVEL = m.OPERATION_UNDER_DEPT_LEVEL;
        m.OPERATION_WORK_DEPT_CODE = m.OPERATION_WORK_DEPT_CODE;
        m.OPERATION_WORK_DEPT_NAME = m.OPERATION_WORK_DEPT_NAME;
        m.OPERATION_WORK_DEPT_LEVEL = m.OPERATION_WORK_DEPT_LEVEL;
        m.OPERATION_OFFICE_CODE = m.OPERATION_OFFICE_CODE;
        m.OPERATION_OFFICE_NAME = m.OPERATION_OFFICE_NAME;
        m.OPERATION_OFFICE_SHORT_NAME = m.OPERATION_OFFICE_SHORT_NAME;
        m.MANAGEMENT_POS_CODE = m.MANAGEMENT_POS_CODE;
        m.MANAGEMENT_POS_NAME = m.MANAGEMENT_POS_NAME;
        m.MANAGEMENT_POS_LEVEL = m.MANAGEMENT_POS_LEVEL;
        m.MANAGEMENT_POS_LEVEL_NAME = m.MANAGEMENT_POS_LEVEL_NAME;
        m.MANAGEMENT_DEPT_CODE = m.MANAGEMENT_DEPT_CODE;
        m.MANAGEMENT_DEPT_NAME = m.MANAGEMENT_DEPT_NAME;
        m.MANAGEMENT_DEPT_LEVEL = m.MANAGEMENT_DEPT_LEVEL;
        m.MANAGEMENT_UNDER_DEPT_CODE = m.MANAGEMENT_UNDER_DEPT_CODE;
        m.MANAGEMENT_UNDER_DEPT_NAME = m.MANAGEMENT_UNDER_DEPT_NAME;
        m.MANAGEMENT_UNDER_DEPT_LEVEL = m.MANAGEMENT_UNDER_DEPT_LEVEL;
        m.MANAGEMENT_WORK_DEPT_CODE = m.MANAGEMENT_WORK_DEPT_CODE;
        m.MANAGEMENT_WORK_DEPT_NAME = m.MANAGEMENT_WORK_DEPT_NAME;
        m.MANAGEMENT_WORK_DEPT_LEVEL = m.MANAGEMENT_WORK_DEPT_LEVEL;
        m.MANAGEMENT_OFFICE_CODE = m.MANAGEMENT_OFFICE_CODE;
        m.MANAGEMENT_OFFICE_NAME = m.MANAGEMENT_OFFICE_NAME;
        m.MANAGEMENT_OFFICE_SHORT_NAME = m.MANAGEMENT_OFFICE_SHORT_NAME;
        m.REPRESENT_POS_CODE = m.REPRESENT_POS_CODE;
        m.REPRESENT_POS_NAME = m.REPRESENT_POS_NAME;
        m.REPRESENT_POS_LEVEL = m.REPRESENT_POS_LEVEL;
        m.REPRESENT_POS_LEVEL_NAME = m.REPRESENT_POS_LEVEL_NAME;
        m.REPRESENT_DEPT_CODE = m.REPRESENT_DEPT_CODE;
        m.REPRESENT_DEPT_NAME = m.REPRESENT_DEPT_NAME;
        m.REPRESENT_DEPT_LEVEL = m.REPRESENT_DEPT_LEVEL;
        m.REPRESENT_UNDER_DEPT_CODE = m.REPRESENT_UNDER_DEPT_CODE;
        m.REPRESENT_UNDER_DEPT_NAME = m.REPRESENT_UNDER_DEPT_NAME;
        m.REPRESENT_UNDER_DEPT_LEVEL = m.REPRESENT_UNDER_DEPT_LEVEL;
        m.REPRESENT_WORK_DEPT_CODE = m.REPRESENT_WORK_DEPT_CODE;
        m.REPRESENT_WORK_DEPT_NAME = m.REPRESENT_WORK_DEPT_NAME;
        m.REPRESENT_WORK_DEPT_LEVEL = m.REPRESENT_WORK_DEPT_LEVEL;
        m.REPRESENT_OFFICE_CODE = m.REPRESENT_OFFICE_CODE;
        m.REPRESENT_OFFICE_NAME = m.REPRESENT_OFFICE_NAME;
        m.REPRESENT_OFFICE_SHORT_NAME = m.REPRESENT_OFFICE_SHORT_NAME;
        m.STATUS = m.STATUS;
        m.REMARK = m.REMARK;
        m.FIRST_PART = m.FIRST_PART;
        m.FIRST_MONEY = m.FIRST_MONEY;
        m.SECOND_PART = m.SECOND_PART;
        m.SECOND_MONEY = m.SECOND_MONEY;
        m.TOTAL_MONEY = m.TOTAL_MONEY;
        m.CONTRIBUTOR_ID = m.CONTRIBUTOR_ID;
        m.IS_ACTIVE = m.IS_ACTIVE;
        m.SEQ = m.SEQ;
        if (
          m.CONTRIBUTOR_ID == 47 ||
          m.CONTRIBUTOR_ID == 48 ||
          m.CONTRIBUTOR_ID == 49
        ) {
          setStaff.push(m);
        }
      }
    });
    let control = this.controlForm.get("PAYMENT_DETAIL") as FormArray;

    setStaff.sort((a, b) => {
      return <number>parseInt(a.SEQ) - <number>parseInt(b.SEQ);
    });

    setStaff.map((m, i) => {
      control.push(this.fb.group(m));
    });
    let controls = <FormArray>this.form_REWARD_MONEY.controls.setStaff;
    let controlss = <FormArray>this.form_BRIBE_MONEY.controls.setStaff;
    this.backupStaff.push({ controlTableForm: control.getRawValue() });
    this.backupStaff.push({ form_REWARD_MONEY: controls.getRawValue() });
    this.backupStaff.push({ form_BRIBE_MONEY: controlss.getRawValue() });
  }

  requestBribeinsAllReq(value, BRIBE_REWARD_ID) {
    let set = [];
    if (value.HAVE_NOTICE == 0) {
      set.push({});
    } else {
      set.push({
        BRIBE_REWARD_ID: parseInt(BRIBE_REWARD_ID),
        BRIBE_ID: "",
        COMMAND_DETAIL_ID: this.COMMAND_DETAIL_ID,
        APPROVE_PAYMENT_DATE: "", //this.getDatepiker(this.toDatePickerFormat(new Date()),this.getTimeNow(new Date())),
        AUTHORITY_DESC: value.AUTHORITY_DESC,
        BRIBE_CODE: this.BRIBE_CODE,
        BRIBE_DATE: this.getDatepiker(value.BRIBE_DATE, value.BRIBE_TIME),
        BRIBE_MONEY: this.BRIBE_MONEY,
        BRIBE_OFFICE_CODE: value.BRIBE_OFFICE_CODE,
        BRIBE_OFFICE_ID: value.BRIBE_OFFICE_ID,
        BRIBE_OFFICE_NAME: value.BRIBE_OFFICE_SHORT_NAME,
        BRIBE_REMAINDER: "",
        INFORMER_INFO: value.INFORMER_INFO,
        IS_ACTIVE: 1,
        IS_PAY: 0,
        RequestBribeDetail: [this.RequestBribeDetail(value)],
        RequestBribeStaff: this.RequestBribeStaff(value.setStaff),
      });
    }
    return set[0];
  }

  RequestBribeDetail(value) {
    let set = [];
    if (value.HAVE_NOTICE == 1) {
      set.push({
        BRIBE_DETAIL_ID: "",
        BRIBE_ID: "",
        IS_ACTIVE: 1,
        // PAYMENT_DETAIL_ID: value.PAYMENT_DETAIL_ID || '',
        PAYMENT_DETAIL_ID: 1,
      });
    } else {
      set.push({});
    }
    return set[0];
  }

  RequestBribeStaff(value) {
    let set = [];
    for (var i = 0; i < value.length; i++) {
      if (value[i].IS_ACTIVE == 1) {
        set.push({
          AGE: value[i].AGE,
          BRIBE_ID: value[i].BRIBE_ID,
          CONTRIBUTOR_ID: value[i].CONTRIBUTOR_ID,
          FIRST_NAME: value[i].FIRST_NAME,
          ID_CARD: value[i].ID_CARD,
          IS_ACTIVE: value[i].IS_ACTIVE,
          LAST_NAME: value[i].LAST_NAME,
          MANAGEMENT_DEPT_CODE: value[i].MANAGEMENT_DEPT_CODE,
          MANAGEMENT_DEPT_LEVEL: value[i].MANAGEMENT_DEPT_LEVEL,
          MANAGEMENT_DEPT_NAME: value[i].MANAGEMENT_DEPT_NAME,
          MANAGEMENT_OFFICE_CODE: value[i].MANAGEMENT_OFFICE_CODE,
          MANAGEMENT_OFFICE_NAME: value[i].MANAGEMENT_OFFICE_NAME,
          MANAGEMENT_OFFICE_SHORT_NAME: value[i].MANAGEMENT_OFFICE_SHORT_NAME,
          MANAGEMENT_POS_CODE: value[i].MANAGEMENT_POS_CODE,
          MANAGEMENT_POS_LEVEL: value[i].MANAGEMENT_POS_LEVEL,
          MANAGEMENT_POS_LEVEL_NAME: value[i].MANAGEMENT_POS_LEVEL_NAME,
          MANAGEMENT_POS_NAME: value[i].MANAGEMENT_POS_NAME,
          MANAGEMENT_UNDER_DEPT_CODE: value[i].MANAGEMENT_UNDER_DEPT_CODE,
          MANAGEMENT_UNDER_DEPT_LEVEL: value[i].MANAGEMENT_UNDER_DEPT_LEVEL,
          MANAGEMENT_UNDER_DEPT_NAME: value[i].MANAGEMENT_UNDER_DEPT_NAME,
          MANAGEMENT_WORK_DEPT_CODE: value[i].MANAGEMENT_WORK_DEPT_CODE,
          MANAGEMENT_WORK_DEPT_LEVEL: value[i].MANAGEMENT_WORK_DEPT_LEVEL,
          MANAGEMENT_WORK_DEPT_NAME: value[i].MANAGEMENT_WORK_DEPT_NAME,
          OPERATION_DEPT_CODE: value[i].OPERATION_DEPT_CODE,
          OPERATION_DEPT_LEVEL: value[i].OPERATION_DEPT_LEVEL,
          OPERATION_DEPT_NAME: value[i].OPERATION_DEPT_NAME,
          OPERATION_OFFICE_CODE: value[i].OPERATION_OFFICE_CODE,
          OPERATION_OFFICE_NAME: value[i].OPERATION_OFFICE_NAME,
          OPERATION_OFFICE_SHORT_NAME: value[i].OPERATION_OFFICE_SHORT_NAME,
          OPERATION_POS_CODE: value[i].OPERATION_POS_CODE,
          OPERATION_POS_LEVEL_NAME: value[i].OPERATION_POS_LEVEL_NAME,
          OPERATION_UNDER_DEPT_CODE: value[i].OPERATION_UNDER_DEPT_CODE,
          OPERATION_UNDER_DEPT_LEVEL: value[i].OPERATION_UNDER_DEPT_LEVEL,
          OPERATION_UNDER_DEPT_NAME: value[i].OPERATION_UNDER_DEPT_NAME,
          OPERATION_WORK_DEPT_CODE: value[i].OPERATION_WORK_DEPT_CODE,
          OPERATION_WORK_DEPT_LEVEL: value[i].OPERATION_WORK_DEPT_LEVEL,
          OPERATION_WORK_DEPT_NAME: value[i].OPERATION_WORK_DEPT_NAME,
          OPREATION_POS_LEVEL: value[i].OPREATION_POS_LEVEL,
          OPREATION_POS_NAME: value[i].OPREATION_POS_NAME,
          REMARK: value[i].REMARK,
          REPRESENT_DEPT_CODE: value[i].REPRESENT_DEPT_CODE,
          REPRESENT_DEPT_LEVEL: value[i].REPRESENT_DEPT_LEVEL,
          REPRESENT_DEPT_NAME: value[i].REPRESENT_DEPT_NAME,
          REPRESENT_OFFICE_CODE: value[i].REPRESENT_OFFICE_CODE,
          REPRESENT_OFFICE_NAME: value[i].REPRESENT_OFFICE_NAME,
          REPRESENT_OFFICE_SHORT_NAME: value[i].REPRESENT_OFFICE_SHORT_NAME,
          REPRESENT_POS_CODE: value[i].REPRESENT_POS_CODE,
          REPRESENT_POS_LEVEL: value[i].REPRESENT_POS_LEVEL,
          REPRESENT_POS_LEVEL_NAME: value[i].REPRESENT_POS_LEVEL_NAME,
          REPRESENT_POS_NAME: value[i].REPRESENT_POS_NAME,
          REPRESENT_UNDER_DEPT_CODE: value[i].REPRESENT_UNDER_DEPT_CODE,
          REPRESENT_UNDER_DEPT_LEVEL: value[i].REPRESENT_UNDER_DEPT_LEVEL,
          REPRESENT_UNDER_DEPT_NAME: value[i].REPRESENT_UNDER_DEPT_NAME,
          REPRESENT_WORK_DEPT_CODE: value[i].REPRESENT_WORK_DEPT_CODE,
          REPRESENT_WORK_DEPT_LEVEL: value[i].REPRESENT_WORK_DEPT_LEVEL,
          REPRESENT_WORK_DEPT_NAME: value[i].REPRESENT_WORK_DEPT_NAME,
          STAFF_CODE: value[i].STAFF_CODE,
          STAFF_ID: value[i].STAFF_ID,
          STAFF_REF_ID: value[i].STAFF_REF_ID,
          STAFF_TYPE: value[i].STAFF_TYPE,
          STATUS: value[i].STATUS,
          TITLE_ID: value[i].TITLE_ID,
          TITLE_NAME_EN: value[i].TITLE_NAME_EN,
          TITLE_NAME_TH: value[i].TITLE_NAME_TH,
          TITLE_SHORT_NAME_EN: value[i].TITLE_SHORT_NAME_EN,
          TITLE_SHORT_NAME_TH: value[i].TITLE_SHORT_NAME_TH,
        });
      }
    }
    return set;
  }

  requestBribeRewardinsAllReq(value) {
    let set = [];
    set.push({
      BRIBE_REWARD_ID: "",
      HAVE_NOTICE: value.HAVE_NOTICE,
      INDICTMENT_ID: this.INDICTMENT_ID,
      IS_ACTIVE: 1,
    });
    return set[0];
  }

  requestRewardDetailinsAllReq(value) {
    let set = [];
    set.push({
      IS_ACTIVE: 1,
      // PAYMENT_ID: value.PAYMENT_ID || "",
      PAYMENT_ID: 1,
      REWARD_DETAIL_ID: "",
      REWARD_ID: "",
    });
    return set[0];
  }

  requestRewardinsAllReq(value, BRIBE_REWARD_ID) {
    let set = [];
    set.push({
      APPROVE_PAYMENT_DATE: "", //this.getDatepiker(this.toDatePickerFormat(new Date()),this.getTimeNow(new Date())),
      AUTHORITY_COMMAND_DESC: value.AUTHORITY_COMMAND_DESC,
      AUTHORITY_DESC: value.AUTHORITY_DESC,
      BRIBE_MONEY: this.BRIBE_MONEY,
      BRIBE_REWARD_ID: parseInt(BRIBE_REWARD_ID),
      FIRST_MONEY_PER_PART: this.one_part_three2(),
      FIRST_MONEY_TOTAL: this.one_part_three1(),
      FIRST_PART_TOTAL: this.all_PART_I(),
      FIRST_REMAINDER: this.one_fraction(),
      IS_ACTIVE: 1,
      REFFERENCE_CODE: this.COMPARE_NO,
      REWARD_CODE: this.REWARD_CODE,
      REWARD_DATE: this.getDatepiker(value.REWARD_DATE, value.REWARD_TIME),
      REWARD_ID: "",
      REWARD_MONEY: this.REWARD_MONEY,
      REWARD_OFFICE_CODE: value.REWARD_OFFICE_CODE,
      REWARD_OFFICE_ID: value.REWARD_OFFICE_ID,
      REWARD_OFFICE_NAME: value.REWARD_OFFICE_NAME,
      REWARD_TYPE: this.REWARD_TYPE,
      SECOND_MONEY_PER_PART: this.two_part_three2(),
      SECOND_MONEY_TOTAL: this.two_part_three1(),
      SECOND_PART_TOTAL: this.all_PART_II(),
      SECOND_REMAINDER: this.two_fraction(),
      IS_PAY: 0,
      RequestRewardDetail: [this.requestRewardDetailinsAllReq(value)],
      RequestRewardStaff: this.RequestRewardStaff(
        value.setStaff,
        this.controlForm.getRawValue()
      ),
    });

    return set[0];
  }

  RequestRewardStaff(value, s) {
    let set = [];
    let values = s.PAYMENT_DETAIL;
    // console.log("RequestRewardStaff : ",values)

    for (var i = 0; i < value.length; i++) {
      if (value[i].IS_ACTIVE == 1) {
        set.push({
          STAFF_ID: value[i].STAFF_ID,
          REWARD_ID: value[i].REWARD_ID,
          STAFF_REF_ID: value[i].STAFF_REF_ID,
          TITLE_ID: value[i].TITLE_ID,
          STAFF_CODE: value[i].STAFF_CODE,
          ID_CARD: value[i].ID_CARD,
          STAFF_TYPE: value[i].STAFF_TYPE,
          TITLE_NAME_TH: value[i].TITLE_NAME_TH,
          TITLE_NAME_EN: value[i].TITLE_NAME_EN,
          TITLE_SHORT_NAME_TH: value[i].TITLE_SHORT_NAME_TH,
          TITLE_SHORT_NAME_EN: value[i].TITLE_SHORT_NAME_EN,
          FIRST_NAME: value[i].FIRST_NAME,
          LAST_NAME: value[i].LAST_NAME,
          AGE: value[i].AGE,
          OPERATION_POS_CODE: value[i].OPERATION_POS_CODE,
          OPREATION_POS_NAME: value[i].OPREATION_POS_NAME,
          OPREATION_POS_LEVEL: value[i].OPREATION_POS_LEVEL,
          OPERATION_POS_LEVEL_NAME: value[i].OPERATION_POS_LEVEL_NAME,
          OPERATION_DEPT_CODE: value[i].OPERATION_DEPT_CODE,
          OPERATION_DEPT_NAME: value[i].OPERATION_DEPT_NAME,
          OPERATION_DEPT_LEVEL: value[i].OPERATION_DEPT_LEVEL,
          OPERATION_UNDER_DEPT_CODE: value[i].OPERATION_UNDER_DEPT_CODE,
          OPERATION_UNDER_DEPT_NAME: value[i].OPERATION_UNDER_DEPT_NAME,
          OPERATION_UNDER_DEPT_LEVEL: value[i].OPERATION_UNDER_DEPT_LEVEL,
          OPERATION_WORK_DEPT_CODE: value[i].OPERATION_WORK_DEPT_CODE,
          OPERATION_WORK_DEPT_NAME: value[i].OPERATION_WORK_DEPT_NAME,
          OPERATION_WORK_DEPT_LEVEL: value[i].OPERATION_WORK_DEPT_LEVEL,
          OPERATION_OFFICE_CODE: value[i].OPERATION_OFFICE_CODE,
          OPERATION_OFFICE_NAME: value[i].OPERATION_OFFICE_NAME,
          OPERATION_OFFICE_SHORT_NAME: value[i].OPERATION_OFFICE_SHORT_NAME,
          MANAGEMENT_POS_CODE: value[i].MANAGEMENT_POS_CODE,
          MANAGEMENT_POS_NAME: value[i].MANAGEMENT_POS_NAME,
          MANAGEMENT_POS_LEVEL: value[i].MANAGEMENT_POS_LEVEL,
          MANAGEMENT_POS_LEVEL_NAME: value[i].MANAGEMENT_POS_LEVEL_NAME,
          MANAGEMENT_DEPT_CODE: value[i].MANAGEMENT_DEPT_CODE,
          MANAGEMENT_DEPT_NAME: value[i].MANAGEMENT_DEPT_NAME,
          MANAGEMENT_DEPT_LEVEL: value[i].MANAGEMENT_DEPT_LEVEL,
          MANAGEMENT_UNDER_DEPT_CODE: value[i].MANAGEMENT_UNDER_DEPT_CODE,
          MANAGEMENT_UNDER_DEPT_NAME: value[i].MANAGEMENT_UNDER_DEPT_NAME,
          MANAGEMENT_UNDER_DEPT_LEVEL: value[i].MANAGEMENT_UNDER_DEPT_LEVEL,
          MANAGEMENT_WORK_DEPT_CODE: value[i].MANAGEMENT_WORK_DEPT_CODE,
          MANAGEMENT_WORK_DEPT_NAME: value[i].MANAGEMENT_WORK_DEPT_NAME,
          MANAGEMENT_WORK_DEPT_LEVEL: value[i].MANAGEMENT_WORK_DEPT_LEVEL,
          MANAGEMENT_OFFICE_CODE: value[i].MANAGEMENT_OFFICE_CODE,
          MANAGEMENT_OFFICE_NAME: value[i].MANAGEMENT_OFFICE_NAME,
          MANAGEMENT_OFFICE_SHORT_NAME: value[i].MANAGEMENT_OFFICE_SHORT_NAME,
          REPRESENT_POS_CODE: value[i].REPRESENT_POS_CODE,
          REPRESENT_POS_NAME: value[i].REPRESENT_POS_NAME,
          REPRESENT_POS_LEVEL: value[i].REPRESENT_POS_LEVEL,
          REPRESENT_POS_LEVEL_NAME: value[i].REPRESENT_POS_LEVEL_NAME,
          REPRESENT_DEPT_CODE: value[i].REPRESENT_DEPT_CODE,
          REPRESENT_DEPT_NAME: value[i].REPRESENT_DEPT_NAME,
          REPRESENT_DEPT_LEVEL: value[i].REPRESENT_DEPT_LEVEL,
          REPRESENT_UNDER_DEPT_CODE: value[i].REPRESENT_UNDER_DEPT_CODE,
          REPRESENT_UNDER_DEPT_NAME: value[i].REPRESENT_UNDER_DEPT_NAME,
          REPRESENT_UNDER_DEPT_LEVEL: value[i].REPRESENT_UNDER_DEPT_LEVEL,
          REPRESENT_WORK_DEPT_CODE: value[i].REPRESENT_WORK_DEPT_CODE,
          REPRESENT_WORK_DEPT_NAME: value[i].REPRESENT_WORK_DEPT_NAME,
          REPRESENT_WORK_DEPT_LEVEL: value[i].REPRESENT_WORK_DEPT_LEVEL,
          REPRESENT_OFFICE_CODE: value[i].REPRESENT_OFFICE_CODE,
          REPRESENT_OFFICE_NAME: value[i].REPRESENT_OFFICE_NAME,
          REPRESENT_OFFICE_SHORT_NAME: value[i].REPRESENT_OFFICE_SHORT_NAME,
          STATUS: value[i].STATUS,
          REMARK: value[i].REMARK,
          FIRST_PART: 0,
          FIRST_MONEY: 0,
          SECOND_PART: 0,
          SECOND_MONEY: 0,
          TOTAL_MONEY: 0,
          CONTRIBUTOR_ID: value[i].CONTRIBUTOR_ID,
          IS_ACTIVE: value[i].IS_ACTIVE,
          SEQ: i + 1,
        });
      }
    }

    for (var i = 0; i < values.length; i++) {
      if (values[i].IS_ACTIVE == 1) {
        if (values[i].A_PART_I == "" || values[i].A_PART_I == null) {
          values[i].A_PART_I = 0;
        }
        if (values[i].A_PART_II == "" || values[i].A_PART_II == null) {
          values[i].A_PART_II = 0;
        }
        if (values[i].A_MONEY_I == "" || values[i].A_MONEY_I == null) {
          values[i].A_MONEY_I = 0;
        }
        if (values[i].A_MONEY_II == "" || values[i].A_MONEY_II == null) {
          values[i].A_MONEY_II = 0;
        }
        if (values[i].A_MONEY_III == "" || values[i].A_MONEY_III == null) {
          values[i].A_MONEY_III = 0;
        }

        set.push({
          STAFF_ID: values[i].STAFF_ID,
          REWARD_ID: values[i].REWARD_ID,
          STAFF_REF_ID: values[i].STAFF_REF_ID,
          TITLE_ID: values[i].TITLE_ID,
          STAFF_CODE: values[i].STAFF_CODE,
          ID_CARD: values[i].ID_CARD,
          STAFF_TYPE: values[i].STAFF_TYPE,
          TITLE_NAME_TH: values[i].TITLE_NAME_TH,
          TITLE_NAME_EN: values[i].TITLE_NAME_EN,
          TITLE_SHORT_NAME_TH: values[i].TITLE_SHORT_NAME_TH,
          TITLE_SHORT_NAME_EN: values[i].TITLE_SHORT_NAME_EN,
          FIRST_NAME: values[i].FIRST_NAME,
          LAST_NAME: values[i].LAST_NAME,
          AGE: values[i].AGE,
          OPERATION_POS_CODE: values[i].OPERATION_POS_CODE,
          OPREATION_POS_NAME: values[i].OPREATION_POS_NAME,
          OPREATION_POS_LEVEL: values[i].OPREATION_POS_LEVEL,
          OPERATION_POS_LEVEL_NAME: values[i].OPERATION_POS_LEVEL_NAME,
          OPERATION_DEPT_CODE: values[i].OPERATION_DEPT_CODE,
          OPERATION_DEPT_NAME: values[i].OPERATION_DEPT_NAME,
          OPERATION_DEPT_LEVEL: values[i].OPERATION_DEPT_LEVEL,
          OPERATION_UNDER_DEPT_CODE: values[i].OPERATION_UNDER_DEPT_CODE,
          OPERATION_UNDER_DEPT_NAME: values[i].OPERATION_UNDER_DEPT_NAME,
          OPERATION_UNDER_DEPT_LEVEL: values[i].OPERATION_UNDER_DEPT_LEVEL,
          OPERATION_WORK_DEPT_CODE: values[i].OPERATION_WORK_DEPT_CODE,
          OPERATION_WORK_DEPT_NAME: values[i].OPERATION_WORK_DEPT_NAME,
          OPERATION_WORK_DEPT_LEVEL: values[i].OPERATION_WORK_DEPT_LEVEL,
          OPERATION_OFFICE_CODE: values[i].OPERATION_OFFICE_CODE,
          OPERATION_OFFICE_NAME: values[i].OPERATION_OFFICE_NAME,
          OPERATION_OFFICE_SHORT_NAME: values[i].OPERATION_OFFICE_SHORT_NAME,
          MANAGEMENT_POS_CODE: values[i].MANAGEMENT_POS_CODE,
          MANAGEMENT_POS_NAME: values[i].MANAGEMENT_POS_NAME,
          MANAGEMENT_POS_LEVEL: values[i].MANAGEMENT_POS_LEVEL,
          MANAGEMENT_POS_LEVEL_NAME: values[i].MANAGEMENT_POS_LEVEL_NAME,
          MANAGEMENT_DEPT_CODE: values[i].MANAGEMENT_DEPT_CODE,
          MANAGEMENT_DEPT_NAME: values[i].MANAGEMENT_DEPT_NAME,
          MANAGEMENT_DEPT_LEVEL: values[i].MANAGEMENT_DEPT_LEVEL,
          MANAGEMENT_UNDER_DEPT_CODE: values[i].MANAGEMENT_UNDER_DEPT_CODE,
          MANAGEMENT_UNDER_DEPT_NAME: values[i].MANAGEMENT_UNDER_DEPT_NAME,
          MANAGEMENT_UNDER_DEPT_LEVEL: values[i].MANAGEMENT_UNDER_DEPT_LEVEL,
          MANAGEMENT_WORK_DEPT_CODE: values[i].MANAGEMENT_WORK_DEPT_CODE,
          MANAGEMENT_WORK_DEPT_NAME: values[i].MANAGEMENT_WORK_DEPT_NAME,
          MANAGEMENT_WORK_DEPT_LEVEL: values[i].MANAGEMENT_WORK_DEPT_LEVEL,
          MANAGEMENT_OFFICE_CODE: values[i].MANAGEMENT_OFFICE_CODE,
          MANAGEMENT_OFFICE_NAME: values[i].MANAGEMENT_OFFICE_NAME,
          MANAGEMENT_OFFICE_SHORT_NAME: values[i].MANAGEMENT_OFFICE_SHORT_NAME,
          REPRESENT_POS_CODE: values[i].A_STATUS, //A_STATUS
          REPRESENT_POS_NAME: values[i].REPRESENT_POS_NAME,
          REPRESENT_POS_LEVEL: values[i].REPRESENT_POS_LEVEL, //REPRESENT_POS_LEVEL
          REPRESENT_POS_LEVEL_NAME: values[i].REPRESENT_POS_LEVEL_NAME,
          REPRESENT_DEPT_CODE: values[i].A_STAFF_TYPE, //A_STAFF_TYPE
          REPRESENT_DEPT_NAME: values[i].REPRESENT_DEPT_NAME,
          REPRESENT_DEPT_LEVEL: values[i].REPRESENT_DEPT_LEVEL,
          REPRESENT_UNDER_DEPT_CODE: values[i].REPRESENT_UNDER_DEPT_CODE,
          REPRESENT_UNDER_DEPT_NAME: values[i].REPRESENT_UNDER_DEPT_NAME,
          REPRESENT_UNDER_DEPT_LEVEL: values[i].REPRESENT_UNDER_DEPT_LEVEL,
          REPRESENT_WORK_DEPT_CODE: values[i].REPRESENT_WORK_DEPT_CODE,
          REPRESENT_WORK_DEPT_NAME: values[i].REPRESENT_WORK_DEPT_NAME,
          REPRESENT_WORK_DEPT_LEVEL: values[i].REPRESENT_WORK_DEPT_LEVEL,
          REPRESENT_OFFICE_CODE: values[i].REPRESENT_OFFICE_CODE,
          REPRESENT_OFFICE_NAME: values[i].REPRESENT_OFFICE_NAME,
          REPRESENT_OFFICE_SHORT_NAME: values[i].REPRESENT_OFFICE_SHORT_NAME,
          STATUS: values[i].STATUS,
          REMARK: values[i].REMARK,
          FIRST_PART: parseFloat(values[i].A_PART_I),
          FIRST_MONEY: parseFloat(values[i].A_MONEY_I),
          SECOND_PART: parseFloat(values[i].A_PART_II),
          SECOND_MONEY: parseFloat(values[i].A_MONEY_II),
          TOTAL_MONEY: parseFloat(values[i].A_MONEY_III),
          CONTRIBUTOR_ID: values[i].CONTRIBUTOR_ID,
          IS_ACTIVE: values[i].IS_ACTIVE,
          SEQ: i + 1,
        });
      }
    }

    // console.log("value : ",value);
    // console.log("values : ",values);
    // console.log("set : ",set);
    return set;
  }

  BRIBE_CODE: any = "";
  COMMAND_DETAIL_ID: any = "";
  async CAL_BRIBE_CODE() {
    let total = this.all_PART_I() + this.all_PART_II();
    let code = this.form_Collapse1.getRawValue();
    let params = {
      COMMAND_ID: "",
      ARREST_ID: code.ARREST_ID,
      COMMAND_NO: "1",
      COMMAND_DATE: this.getDatepiker(
        this.toDatePickerFormat(new Date()),
        this.getTimeNow(new Date())
      ),
      TOTAL_PART: total,
      IS_ACTIVE: "1",
      RequestCommandDetail: [
        {
          COMMAND_DETAIL_ID: "",
          COMMAND_ID: "",
          NOTICE_ID: code.NOTICE_ID,
          PART: "1",
          IS_ACTIVE: "1",
        },
      ],
    };
    // console.log("COMMAND_DETAIL_ID : ",params);
    // console.log("total : ",total);
    // console.log("NOTICE_ID : ",code);
    // console.log("ARREST_ID : ",code.ARREST_ID);
    let re = await this.RewardService.RequestCommandinsAll(
      "RequestCommandinsAll",
      params
    );
    if (re.IsSuccess == "True") {
      this.COMMAND_DETAIL_ID = re.COMMAND_DETAIL_ID[0];
      console.log("res.COMMAND_DETAIL_ID : ", re.COMMAND_DETAIL_ID[0]);
    }

    let paramiter = {
      RUNNING_OFFICE_CODE: this.office_code,
      RUNNING_TABLE: "OPS_REQUEST_BRIBE",
    };

    let res = await this.RewardService.TransactionRunninggetByCon(
      "TransactionRunninggetByCon",
      paramiter
    );
    if (res.length == 0) {
      let date = new Date();
      let year = (date.getFullYear() + 543).toString();
      let para = {
        RUNNING_ID: "",
        RUNNING_OFFICE_ID: this.office_id,
        RUNNING_NO: 1,
        RUNNING_TABLE: "OPS_REQUEST_BRIBE",
        RUNNING_PREFIX: "BR",
        RUNNING_OFFICE_CODE: this.office_code,
        RUNNING_YEAR: year.slice(2, 4),
        RUNNING_MONTH: date.getMonth(),
      };
      let re = await this.RewardService.TransactionRunninginsAll(
        "TransactionRunninginsAll",
        para
      );
      if (re.IsSuccess == "True") {
        let paramiter = {
          RUNNING_OFFICE_CODE: this.office_code,
          RUNNING_TABLE: "OPS_REQUEST_BRIBE",
        };
        let res = await this.RewardService.TransactionRunninggetByCon(
          "TransactionRunninggetByCon",
          paramiter
        );
        if (res[0].RUNNING_NO.toString().length == 1) {
          this.BRIBE_CODE =
            res[0].RUNNING_PREFIX +
            res[0].RUNNING_OFFICE_CODE +
            res[0].RUNNING_YEAR +
            "0000" +
            res[0].RUNNING_NO.toString();
        } else if (res[0].RUNNING_NO.toString().length == 2) {
          this.BRIBE_CODE =
            res[0].RUNNING_PREFIX +
            res[0].RUNNING_OFFICE_CODE +
            res[0].RUNNING_YEAR +
            "000" +
            res[0].RUNNING_NO.toString();
        } else if (res[0].RUNNING_NO.toString().length == 3) {
          this.BRIBE_CODE =
            res[0].RUNNING_PREFIX +
            res[0].RUNNING_OFFICE_CODE +
            res[0].RUNNING_YEAR +
            "00" +
            res[0].RUNNING_NO.toString();
        } else if (res[0].RUNNING_NO.toString().length == 4) {
          this.BRIBE_CODE =
            res[0].RUNNING_PREFIX +
            res[0].RUNNING_OFFICE_CODE +
            res[0].RUNNING_YEAR +
            "0" +
            res[0].RUNNING_NO.toString();
        } else if (res[0].RUNNING_NO.toString().length == 5) {
          this.BRIBE_CODE =
            res[0].RUNNING_PREFIX +
            res[0].RUNNING_OFFICE_CODE +
            res[0].RUNNING_YEAR +
            res[0].RUNNING_NO.toString();
        }
      }
    } else {
      let RUNNING_ID = { RUNNING_ID: res[0].RUNNING_ID };
      let re = await this.RewardService.TransactionRunningupdByCon(
        "TransactionRunningupdByCon",
        RUNNING_ID
      );
      if (re.IsSuccess == "True") {
        let paramiter = {
          RUNNING_OFFICE_CODE: this.office_code,
          RUNNING_TABLE: "OPS_REQUEST_BRIBE",
        };
        let res = await this.RewardService.TransactionRunninggetByCon(
          "TransactionRunninggetByCon",
          paramiter
        );
        if (res[0].RUNNING_NO.toString().length == 1) {
          this.BRIBE_CODE =
            res[0].RUNNING_PREFIX +
            res[0].RUNNING_OFFICE_CODE +
            res[0].RUNNING_YEAR +
            "0000" +
            res[0].RUNNING_NO.toString();
        } else if (res[0].RUNNING_NO.toString().length == 2) {
          this.BRIBE_CODE =
            res[0].RUNNING_PREFIX +
            res[0].RUNNING_OFFICE_CODE +
            res[0].RUNNING_YEAR +
            "000" +
            res[0].RUNNING_NO.toString();
        } else if (res[0].RUNNING_NO.toString().length == 3) {
          this.BRIBE_CODE =
            res[0].RUNNING_PREFIX +
            res[0].RUNNING_OFFICE_CODE +
            res[0].RUNNING_YEAR +
            "00" +
            res[0].RUNNING_NO.toString();
        } else if (res[0].RUNNING_NO.toString().length == 4) {
          this.BRIBE_CODE =
            res[0].RUNNING_PREFIX +
            res[0].RUNNING_OFFICE_CODE +
            res[0].RUNNING_YEAR +
            "0" +
            res[0].RUNNING_NO.toString();
        } else if (res[0].RUNNING_NO.toString().length == 5) {
          this.BRIBE_CODE =
            res[0].RUNNING_PREFIX +
            res[0].RUNNING_OFFICE_CODE +
            res[0].RUNNING_YEAR +
            res[0].RUNNING_NO.toString();
        }
      }
    }
  }
  REWARD_CODE: any = "";
  async CAL_REWARD_CODE() {
    let paramiter = {
      RUNNING_OFFICE_CODE: this.office_code,
      RUNNING_TABLE: "OPS_REQUEST_REWARD",
    };

    let res = await this.RewardService.TransactionRunninggetByCon(
      "TransactionRunninggetByCon",
      paramiter
    );
    if (res.length == 0) {
      let date = new Date();
      let year = (date.getFullYear() + 543).toString();
      let para = {
        RUNNING_ID: "",
        RUNNING_OFFICE_ID: this.office_id,
        RUNNING_NO: 1,
        RUNNING_TABLE: "OPS_REQUEST_REWARD",
        RUNNING_PREFIX: "RE",
        RUNNING_OFFICE_CODE: this.office_code,
        RUNNING_YEAR: year.slice(2, 4),
        RUNNING_MONTH: date.getMonth(),
      };
      let re = await this.RewardService.TransactionRunninginsAll(
        "TransactionRunninginsAll",
        para
      );
      if (re.IsSuccess == "True") {
        let paramiter = {
          RUNNING_OFFICE_CODE: this.office_code,
          RUNNING_TABLE: "OPS_REQUEST_REWARD",
        };
        let res = await this.RewardService.TransactionRunninggetByCon(
          "TransactionRunninggetByCon",
          paramiter
        );
        if (res[0].RUNNING_NO.toString().length == 1) {
          this.REWARD_CODE =
            res[0].RUNNING_PREFIX +
            res[0].RUNNING_OFFICE_CODE +
            res[0].RUNNING_YEAR +
            "0000" +
            res[0].RUNNING_NO.toString();
        } else if (res[0].RUNNING_NO.toString().length == 2) {
          this.REWARD_CODE =
            res[0].RUNNING_PREFIX +
            res[0].RUNNING_OFFICE_CODE +
            res[0].RUNNING_YEAR +
            "000" +
            res[0].RUNNING_NO.toString();
        } else if (res[0].RUNNING_NO.toString().length == 3) {
          this.REWARD_CODE =
            res[0].RUNNING_PREFIX +
            res[0].RUNNING_OFFICE_CODE +
            res[0].RUNNING_YEAR +
            "00" +
            res[0].RUNNING_NO.toString();
        } else if (res[0].RUNNING_NO.toString().length == 4) {
          this.REWARD_CODE =
            res[0].RUNNING_PREFIX +
            res[0].RUNNING_OFFICE_CODE +
            res[0].RUNNING_YEAR +
            "0" +
            res[0].RUNNING_NO.toString();
        } else if (res[0].RUNNING_NO.toString().length == 5) {
          this.REWARD_CODE =
            res[0].RUNNING_PREFIX +
            res[0].RUNNING_OFFICE_CODE +
            res[0].RUNNING_YEAR +
            res[0].RUNNING_NO.toString();
        }
      }
    } else {
      let RUNNING_ID = { RUNNING_ID: res[0].RUNNING_ID };
      let re = await this.RewardService.TransactionRunningupdByCon(
        "TransactionRunningupdByCon",
        RUNNING_ID
      );
      if (re.IsSuccess == "True") {
        let paramiter = {
          RUNNING_OFFICE_CODE: this.office_code,
          RUNNING_TABLE: "OPS_REQUEST_REWARD",
        };
        let res = await this.RewardService.TransactionRunninggetByCon(
          "TransactionRunninggetByCon",
          paramiter
        );
        if (res[0].RUNNING_NO.toString().length == 1) {
          this.REWARD_CODE =
            res[0].RUNNING_PREFIX +
            res[0].RUNNING_OFFICE_CODE +
            res[0].RUNNING_YEAR +
            "0000" +
            res[0].RUNNING_NO.toString();
        } else if (res[0].RUNNING_NO.toString().length == 2) {
          this.REWARD_CODE =
            res[0].RUNNING_PREFIX +
            res[0].RUNNING_OFFICE_CODE +
            res[0].RUNNING_YEAR +
            "000" +
            res[0].RUNNING_NO.toString();
        } else if (res[0].RUNNING_NO.toString().length == 3) {
          this.REWARD_CODE =
            res[0].RUNNING_PREFIX +
            res[0].RUNNING_OFFICE_CODE +
            res[0].RUNNING_YEAR +
            "00" +
            res[0].RUNNING_NO.toString();
        } else if (res[0].RUNNING_NO.toString().length == 4) {
          this.REWARD_CODE =
            res[0].RUNNING_PREFIX +
            res[0].RUNNING_OFFICE_CODE +
            res[0].RUNNING_YEAR +
            "0" +
            res[0].RUNNING_NO.toString();
        } else if (res[0].RUNNING_NO.toString().length == 5) {
          this.REWARD_CODE =
            res[0].RUNNING_PREFIX +
            res[0].RUNNING_OFFICE_CODE +
            res[0].RUNNING_YEAR +
            res[0].RUNNING_NO.toString();
        }
      }
    }
  }

  async clickSave() {
    this.preloader.setShowPreloader(true);
    if (this.HAVE_NOTICE == 1) {
      await this.CAL_BRIBE_CODE();
      await this.CAL_REWARD_CODE();
      this.preloader.setShowPreloader(false);
      this.save();
    } else {
      await this.CAL_REWARD_CODE();
      this.preloader.setShowPreloader(false);
      this.save();
    }
  }

  /////////////////////////////////////////////////////////////////////////// PRINT DOCUMENT //////////////////////////////////////////////////////////////////////////////////////////
  clickPrint() {
    const modal = this.ngbModal.open(PrintDocModalComponent, {
      size: "lg",
      centered: true,
    });

    let br = this.form_BRIBE_MONEY.getRawValue();
    let br2 = this.form_REWARD_MONEY.getRawValue();

    if (this.HAVE_NOTICE == 1) {
      modal.componentInstance.HAVE_NOTICE = this.HAVE_NOTICE;
      modal.componentInstance.BRIDE_ID = this.BRIDE_ID;
      modal.componentInstance.REWARD_ID = this.REWARD_ID;
      modal.componentInstance.BRIBE_REWARD_ID = br.BRIBE_REWARD_ID;
      modal.componentInstance.COMPARE_ID = this.COMPARE_ID;
      console.log("COMPARE_ID : ", this.COMPARE_ID);
    } else {
      let br = this.form_REWARD_MONEY.getRawValue();
      modal.componentInstance.HAVE_NOTICE = this.HAVE_NOTICE;
      modal.componentInstance.BRIDE_ID = this.BRIDE_ID;
      modal.componentInstance.REWARD_ID = this.REWARD_ID;
      modal.componentInstance.BRIBE_REWARD_ID = br2.BRIBE_REWARD_ID;
      modal.componentInstance.BRIBE_REWARD_ID = br.BRIBE_REWARD_ID;
      modal.componentInstance.COMPARE_ID = this.COMPARE_ID;
      console.log("COMPARE_ID : ", this.COMPARE_ID);
    }
  }

  clickDelete() {
    swal({
      type: "warning",
      text: "ยืนยันการทำรายการหรือไม่" + " ?",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ไม่ใช่",
      buttonsStyling: true,
    }).then((result) => {
      if (this.HAVE_NOTICE == 1) {
        this.RewardService.RequestBribeupdDelete("RequestBribeupdDelete", {
          BRIBE_ID: this.BRIDE_ID,
        }).then((res) => {
          if (res.IsSuccess == "True") {
            this.RewardService.RequestRewardupdDelete(
              "RequestRewardupdDelete",
              { REWARD_ID: this.REWARD_ID }
            ).then((re) => {
              if (re.IsSuccess == "True") {
                swal({
                  type: "success",
                  text: "ลบข้อมูลสำเร็จ",
                  confirmButtonText: "ตกลง",
                  buttonsStyling: true,
                }).then((list) => {
                  this.router.navigate([`/reward/list`]).then((e) => {
                    location.reload();
                  });
                });
              }
            });
          }
        });
      } else {
        this.RewardService.RequestRewardupdDelete("RequestRewardupdDelete", {
          REWARD_ID: this.REWARD_ID,
        }).then((re) => {
          if (re.IsSuccess == "True") {
            swal({
              type: "success",
              text: "ลบข้อมูลสำเร็จ",
              confirmButtonText: "ตกลง",
              buttonsStyling: true,
            }).then((list) => {
              this.router.navigate([`/reward/list`]).then((e) => {
                location.reload();
              });
            });
          }
        });
      }
    });
  }

  async reqBR(): Promise<any> {
    if (
      this.form_BRIBE_MONEY.getRawValue().BRIBE_OFFICE_CODE == "" ||
      this.form_BRIBE_MONEY.getRawValue().BRIBE_OFFICE_CODE == null
    ) {
      this._swal('กรุณาระบุข้อมูล "เขียนที่ (รว.3)"');
      this.collapse2 = new BehaviorSubject<Boolean>(true);
      return false;
    }

    if (
      this.form_BRIBE_MONEY.getRawValue().BRIBE_DATE == "" ||
      this.form_BRIBE_MONEY.getRawValue().BRIBE_DATE == null
    ) {
      this._swal('กรุณาระบุข้อมูล "วันที่จัดทำ (รว.3)"');
      this.collapse2 = new BehaviorSubject<Boolean>(true);
      return false;
    }

    if (
      this.form_BRIBE_MONEY.getRawValue().BRIBE_TIME == "" ||
      this.form_BRIBE_MONEY.getRawValue().BRIBE_TIME == null
    ) {
      this._swal('กรุณาระบุข้อมูล "เวลาที่จัดทำ (รว.3)"');
      this.collapse2 = new BehaviorSubject<Boolean>(true);
      return false;
    }

    if (
      this.form_BRIBE_MONEY.getRawValue().INFORMER_INFO == "" ||
      this.form_BRIBE_MONEY.getRawValue().INFORMER_INFO == null
    ) {
      this._swal('กรุณาระบุข้อมูล "ผู้แจ้งความได้ทราบว่า (รว.3)"');
      this.collapse2 = new BehaviorSubject<Boolean>(true);
      this.isReq_INFORMER_INFO = true;
      return false;
    }

    // if (this.form_BRIBE_MONEY.getRawValue().INFORMER_INFO == '' || this.form_BRIBE_MONEY.getRawValue().INFORMER_INFO == null) {
    //   this._swal('กรุณาระบุข้อมูล "ความเห็นของผู้มีอำนาจอนุมัติ (รว.3)"');
    //   this.collapse2 = new BehaviorSubject<Boolean>(true);
    //   this.isReq_AUTHORITY_DESC = true;
    //   re2 = 0;
    // } else { re2 = 1; }

    if (this.ControlStaffBRIBE.value[0].IS_ACTIVE == 0) {
      this._swal('กรุณาระบุข้อมูล "ผู้มีอำนาจอนุมัติคำร้องขอ (รว.3)"');
      this.collapse2 = new BehaviorSubject<Boolean>(true);
      this.isReq_ControlStaffBRIBE0 = true;
      return false;
    }

    return true;
  }

  async reqRE(): Promise<any> {
    if (
      this.form_REWARD_MONEY.getRawValue().REWARD_OFFICE_CODE == "" ||
      this.form_REWARD_MONEY.getRawValue().REWARD_OFFICE_CODE == null
    ) {
      this._swal('กรุณาระบุข้อมูล "เขียนที่ (รว.4)"');
      this.collapse3 = new BehaviorSubject<Boolean>(true);
      return false;
    }

    if (
      this.form_REWARD_MONEY.getRawValue().REWARD_DATE == "" ||
      this.form_REWARD_MONEY.getRawValue().REWARD_DATE == null
    ) {
      this._swal('กรุณาระบุข้อมูล "วันที่จัดทำ (รว.4)"');
      this.collapse3 = new BehaviorSubject<Boolean>(true);
      return false;
    }

    if (
      this.form_REWARD_MONEY.getRawValue().REWARD_TIME == "" ||
      this.form_REWARD_MONEY.getRawValue().REWARD_TIME == null
    ) {
      this._swal('กรุณาระบุข้อมูล "เวลาที่จัดทำ (รว.4)"');
      this.collapse3 = new BehaviorSubject<Boolean>(true);
      return false;
    }

    // if (this.form_REWARD_MONEY.getRawValue().AUTHORITY_DESC == '' || this.form_REWARD_MONEY.getRawValue().AUTHORITY_DESC == null) {
    //   this._swal('กรุณาระบุข้อมูล "ผู้แจ้งความได้ทราบว่า (รว.4)"');
    //   this.collapse3 = new BehaviorSubject<Boolean>(true);
    //   this.isReq_AUTHORITY_DESC2 = true;
    //   re5 = 0
    // } else { re5 = 1; }

    // if (this.form_REWARD_MONEY.getRawValue().AUTHORITY_COMMAND_DESC == '' || this.form_REWARD_MONEY.getRawValue().AUTHORITY_COMMAND_DESC == null) {
    //   this._swal('กรุณาระบุข้อมูล "ความเห็นและคำสั่งของผู้บังคับบัญชา (รว.7)"');
    //   this.collapse3 = new BehaviorSubject<Boolean>(true);
    //   this.isReq_AUTHORITY_COMMAND_DESC = true;
    //   re4 = 0
    // } else { re4 = 1; }

    if (this.ControlStaffREWARD.value[0].IS_ACTIVE == 0) {
      this._swal('กรุณาระบุข้อมูล "ผู้มีอำนาจอนุมัติคำร้องขอ (รว.4)"');
      this.collapse3 = new BehaviorSubject<Boolean>(true);
      this.isReq_ControlStaffREWARD0 = true;
      return false;
    }

    if (this.ControlStaffREWARD.value[1].IS_ACTIVE == 0) {
      this._swal('กรุณาระบุข้อมูล "ผู้บังคับบัญชา (รว.7)"');
      this.collapse3 = new BehaviorSubject<Boolean>(true);
      this.isReq_ControlStaffREWARD1 = true;
      return false;
    }

    if (this.ControlStaffREWARD.value[2].IS_ACTIVE == 0) {
      this._swal('กรุณาระบุข้อมูล "ผู้จ่ายเงิน (รว.8)"');
      this.collapse6 = new BehaviorSubject<Boolean>(true);
      this.isReq_ControlStaffREWARD2 = true;
      return false;
    }

    return true;
  }

  isReq_INFORMER_INFO;
  // isReq_AUTHORITY_DESC;
  isReq_ControlStaffBRIBE0;
  // isReq_AUTHORITY_COMMAND_DESC;
  // isReq_AUTHORITY_DESC2;
  isReq_ControlStaffREWARD0;
  isReq_ControlStaffREWARD1;
  isReq_ControlStaffREWARD2;

  require(e) {
    switch (e) {
      case "isReq_INFORMER_INFO":
        this.isReq_INFORMER_INFO = false;
        break;
      // case 'isReq_AUTHORITY_DESC': this.isReq_AUTHORITY_DESC = false; break;
      case "isReq_ControlStaffBRIBE0":
        this.isReq_ControlStaffBRIBE0 = false;
        break;
      // case 'isReq_AUTHORITY_COMMAND_DESC': this.isReq_AUTHORITY_COMMAND_DESC = false; break;
      // case 'isReq_AUTHORITY_DESC2': this.isReq_AUTHORITY_DESC2 = false; break;
      case "isReq_ControlStaffREWARD0":
        this.isReq_ControlStaffREWARD0 = false;
        break;
      case "isReq_ControlStaffREWARD1":
        this.isReq_ControlStaffREWARD1 = false;
        break;
      case "isReq_ControlStaffREWARD2":
        this.isReq_ControlStaffREWARD2 = false;
        break;
    }
  }

  _swal(e) {
    swal({
      type: "warning",
      text: e,
      confirmButtonText: "ตกลง",
      buttonsStyling: true,
    });
  }

  clickEdit() {
    this.createButton = false;
    this.printButton = false;
    this.editButton = false;
    this.deleteButton = false;
    this.saveButton = false;
    this.saveEditButton = true;
    this.cancelButton = true;
    this.showEditField = false;
  }

  clickCancel() {
    swal({
      type: "warning",
      text: "ยืนยันการทำรายการหรือไม่" + " ?",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ไม่ใช่",
      buttonsStyling: true,
    }).then((result) => {
      location.reload();
    });
  }

  edit_TableStaff(value, backup) {
    for (var i = 0; i < backup.length; i++) {
      if (backup[i].IS_ACTIVE == 1) {
        this.staffDel1(backup[i].STAFF_ID);
      }
    }

    for (var i = 0; i < value.length; i++) {
      if (value[i].IS_ACTIVE == 1) {
        if (value[i].A_PART_I == "" || value[i].A_PART_I == null) {
          value[i].A_PART_I = 0;
        }
        if (value[i].A_PART_II == "" || value[i].A_PART_II == null) {
          value[i].A_PART_II = 0;
        }
        if (value[i].A_MONEY_I == "" || value[i].A_MONEY_I == null) {
          value[i].A_MONEY_I = 0;
        }
        if (value[i].A_MONEY_II == "" || value[i].A_MONEY_II == null) {
          value[i].A_MONEY_II = 0;
        }
        if (value[i].A_MONEY_III == "" || value[i].A_MONEY_III == null) {
          value[i].A_MONEY_III = 0;
        }

        this.staffIns({
          STAFF_ID: value[i].STAFF_ID,
          REWARD_ID: this.REWARD_ID,
          STAFF_REF_ID: value[i].STAFF_REF_ID,
          TITLE_ID: value[i].TITLE_ID,
          STAFF_CODE: value[i].STAFF_CODE,
          ID_CARD: value[i].ID_CARD,
          STAFF_TYPE: value[i].STAFF_TYPE,
          TITLE_NAME_TH: value[i].TITLE_NAME_TH,
          TITLE_NAME_EN: value[i].TITLE_NAME_EN,
          TITLE_SHORT_NAME_TH: value[i].TITLE_SHORT_NAME_TH,
          TITLE_SHORT_NAME_EN: value[i].TITLE_SHORT_NAME_EN,
          FIRST_NAME: value[i].FIRST_NAME,
          LAST_NAME: value[i].LAST_NAME,
          AGE: value[i].AGE,
          OPERATION_POS_CODE: value[i].OPERATION_POS_CODE,
          OPREATION_POS_NAME: value[i].OPREATION_POS_NAME,
          OPREATION_POS_LEVEL: value[i].OPREATION_POS_LEVEL,
          OPERATION_POS_LEVEL_NAME: value[i].OPERATION_POS_LEVEL_NAME,
          OPERATION_DEPT_CODE: value[i].OPERATION_DEPT_CODE,
          OPERATION_DEPT_NAME: value[i].OPERATION_DEPT_NAME,
          OPERATION_DEPT_LEVEL: value[i].OPERATION_DEPT_LEVEL,
          OPERATION_UNDER_DEPT_CODE: value[i].OPERATION_UNDER_DEPT_CODE,
          OPERATION_UNDER_DEPT_NAME: value[i].OPERATION_UNDER_DEPT_NAME,
          OPERATION_UNDER_DEPT_LEVEL: value[i].OPERATION_UNDER_DEPT_LEVEL,
          OPERATION_WORK_DEPT_CODE: value[i].OPERATION_WORK_DEPT_CODE,
          OPERATION_WORK_DEPT_NAME: value[i].OPERATION_WORK_DEPT_NAME,
          OPERATION_WORK_DEPT_LEVEL: value[i].OPERATION_WORK_DEPT_LEVEL,
          OPERATION_OFFICE_CODE: value[i].OPERATION_OFFICE_CODE,
          OPERATION_OFFICE_NAME: value[i].OPERATION_OFFICE_NAME,
          OPERATION_OFFICE_SHORT_NAME: value[i].OPERATION_OFFICE_SHORT_NAME,
          MANAGEMENT_POS_CODE: value[i].MANAGEMENT_POS_CODE,
          MANAGEMENT_POS_NAME: value[i].MANAGEMENT_POS_NAME,
          MANAGEMENT_POS_LEVEL: value[i].MANAGEMENT_POS_LEVEL,
          MANAGEMENT_POS_LEVEL_NAME: value[i].MANAGEMENT_POS_LEVEL_NAME,
          MANAGEMENT_DEPT_CODE: value[i].MANAGEMENT_DEPT_CODE,
          MANAGEMENT_DEPT_NAME: value[i].MANAGEMENT_DEPT_NAME,
          MANAGEMENT_DEPT_LEVEL: value[i].MANAGEMENT_DEPT_LEVEL,
          MANAGEMENT_UNDER_DEPT_CODE: value[i].MANAGEMENT_UNDER_DEPT_CODE,
          MANAGEMENT_UNDER_DEPT_NAME: value[i].MANAGEMENT_UNDER_DEPT_NAME,
          MANAGEMENT_UNDER_DEPT_LEVEL: value[i].MANAGEMENT_UNDER_DEPT_LEVEL,
          MANAGEMENT_WORK_DEPT_CODE: value[i].MANAGEMENT_WORK_DEPT_CODE,
          MANAGEMENT_WORK_DEPT_NAME: value[i].MANAGEMENT_WORK_DEPT_NAME,
          MANAGEMENT_WORK_DEPT_LEVEL: value[i].MANAGEMENT_WORK_DEPT_LEVEL,
          MANAGEMENT_OFFICE_CODE: value[i].MANAGEMENT_OFFICE_CODE,
          MANAGEMENT_OFFICE_NAME: value[i].MANAGEMENT_OFFICE_NAME,
          MANAGEMENT_OFFICE_SHORT_NAME: value[i].MANAGEMENT_OFFICE_SHORT_NAME,
          REPRESENT_POS_CODE: value[i].A_STATUS, //A_STATUS
          REPRESENT_POS_NAME: value[i].REPRESENT_POS_NAME,
          REPRESENT_POS_LEVEL: value[i].REPRESENT_POS_LEVEL, //REPRESENT_POS_LEVEL
          REPRESENT_POS_LEVEL_NAME: value[i].REPRESENT_POS_LEVEL_NAME,
          REPRESENT_DEPT_CODE: value[i].A_STAFF_TYPE, //A_STAFF_TYPE
          REPRESENT_DEPT_NAME: value[i].REPRESENT_DEPT_NAME,
          REPRESENT_DEPT_LEVEL: value[i].REPRESENT_DEPT_LEVEL,
          REPRESENT_UNDER_DEPT_CODE: value[i].REPRESENT_UNDER_DEPT_CODE,
          REPRESENT_UNDER_DEPT_NAME: value[i].REPRESENT_UNDER_DEPT_NAME,
          REPRESENT_UNDER_DEPT_LEVEL: value[i].REPRESENT_UNDER_DEPT_LEVEL,
          REPRESENT_WORK_DEPT_CODE: value[i].REPRESENT_WORK_DEPT_CODE,
          REPRESENT_WORK_DEPT_NAME: value[i].REPRESENT_WORK_DEPT_NAME,
          REPRESENT_WORK_DEPT_LEVEL: value[i].REPRESENT_WORK_DEPT_LEVEL,
          REPRESENT_OFFICE_CODE: value[i].REPRESENT_OFFICE_CODE,
          REPRESENT_OFFICE_NAME: value[i].REPRESENT_OFFICE_NAME,
          REPRESENT_OFFICE_SHORT_NAME: value[i].REPRESENT_OFFICE_SHORT_NAME,
          STATUS: value[i].STATUS,
          REMARK: value[i].REMARK,
          FIRST_PART: parseFloat(value[i].A_PART_I),
          FIRST_MONEY: parseFloat(value[i].A_MONEY_I),
          SECOND_PART: parseFloat(value[i].A_PART_II),
          SECOND_MONEY: parseFloat(value[i].A_MONEY_II),
          TOTAL_MONEY: parseFloat(value[i].A_MONEY_III),
          CONTRIBUTOR_ID: value[i].CONTRIBUTOR_ID,
          IS_ACTIVE: value[i].IS_ACTIVE,
          SEQ: i + 1,
        });
      }
    }
  }

  edit_RewardStaff(value, backup) {
    for (var i = 0; i < backup.length; i++) {
      if (backup[i].IS_ACTIVE == 1) {
        if (
          backup[i].CONTRIBUTOR_ID == 43 ||
          backup[i].CONTRIBUTOR_ID == 44 ||
          backup[i].CONTRIBUTOR_ID == 45
        ) {
          this.staffDel2(backup[i].STAFF_ID);
        }
      }
    }

    for (var i = 0; i < value.length; i++) {
      if (value[i].IS_ACTIVE == 1) {
        if (
          value[i].CONTRIBUTOR_ID == 43 ||
          value[i].CONTRIBUTOR_ID == 44 ||
          value[i].CONTRIBUTOR_ID == 45
        ) {
          this.staffIns_Reward({
            STAFF_ID: value[i].STAFF_ID,
            REWARD_ID: this.REWARD_ID,
            STAFF_REF_ID: value[i].STAFF_REF_ID,
            TITLE_ID: value[i].TITLE_ID,
            STAFF_CODE: value[i].STAFF_CODE,
            ID_CARD: value[i].ID_CARD,
            STAFF_TYPE: value[i].STAFF_TYPE,
            TITLE_NAME_TH: value[i].TITLE_NAME_TH,
            TITLE_NAME_EN: value[i].TITLE_NAME_EN,
            TITLE_SHORT_NAME_TH: value[i].TITLE_SHORT_NAME_TH,
            TITLE_SHORT_NAME_EN: value[i].TITLE_SHORT_NAME_EN,
            FIRST_NAME: value[i].FIRST_NAME,
            LAST_NAME: value[i].LAST_NAME,
            AGE: value[i].AGE,
            OPERATION_POS_CODE: value[i].OPERATION_POS_CODE,
            OPREATION_POS_NAME: value[i].OPREATION_POS_NAME,
            OPREATION_POS_LEVEL: value[i].OPREATION_POS_LEVEL,
            OPERATION_POS_LEVEL_NAME: value[i].OPERATION_POS_LEVEL_NAME,
            OPERATION_DEPT_CODE: value[i].OPERATION_DEPT_CODE,
            OPERATION_DEPT_NAME: value[i].OPERATION_DEPT_NAME,
            OPERATION_DEPT_LEVEL: value[i].OPERATION_DEPT_LEVEL,
            OPERATION_UNDER_DEPT_CODE: value[i].OPERATION_UNDER_DEPT_CODE,
            OPERATION_UNDER_DEPT_NAME: value[i].OPERATION_UNDER_DEPT_NAME,
            OPERATION_UNDER_DEPT_LEVEL: value[i].OPERATION_UNDER_DEPT_LEVEL,
            OPERATION_WORK_DEPT_CODE: value[i].OPERATION_WORK_DEPT_CODE,
            OPERATION_WORK_DEPT_NAME: value[i].OPERATION_WORK_DEPT_NAME,
            OPERATION_WORK_DEPT_LEVEL: value[i].OPERATION_WORK_DEPT_LEVEL,
            OPERATION_OFFICE_CODE: value[i].OPERATION_OFFICE_CODE,
            OPERATION_OFFICE_NAME: value[i].OPERATION_OFFICE_NAME,
            OPERATION_OFFICE_SHORT_NAME: value[i].OPERATION_OFFICE_SHORT_NAME,
            MANAGEMENT_POS_CODE: value[i].MANAGEMENT_POS_CODE,
            MANAGEMENT_POS_NAME: value[i].MANAGEMENT_POS_NAME,
            MANAGEMENT_POS_LEVEL: value[i].MANAGEMENT_POS_LEVEL,
            MANAGEMENT_POS_LEVEL_NAME: value[i].MANAGEMENT_POS_LEVEL_NAME,
            MANAGEMENT_DEPT_CODE: value[i].MANAGEMENT_DEPT_CODE,
            MANAGEMENT_DEPT_NAME: value[i].MANAGEMENT_DEPT_NAME,
            MANAGEMENT_DEPT_LEVEL: value[i].MANAGEMENT_DEPT_LEVEL,
            MANAGEMENT_UNDER_DEPT_CODE: value[i].MANAGEMENT_UNDER_DEPT_CODE,
            MANAGEMENT_UNDER_DEPT_NAME: value[i].MANAGEMENT_UNDER_DEPT_NAME,
            MANAGEMENT_UNDER_DEPT_LEVEL: value[i].MANAGEMENT_UNDER_DEPT_LEVEL,
            MANAGEMENT_WORK_DEPT_CODE: value[i].MANAGEMENT_WORK_DEPT_CODE,
            MANAGEMENT_WORK_DEPT_NAME: value[i].MANAGEMENT_WORK_DEPT_NAME,
            MANAGEMENT_WORK_DEPT_LEVEL: value[i].MANAGEMENT_WORK_DEPT_LEVEL,
            MANAGEMENT_OFFICE_CODE: value[i].MANAGEMENT_OFFICE_CODE,
            MANAGEMENT_OFFICE_NAME: value[i].MANAGEMENT_OFFICE_NAME,
            MANAGEMENT_OFFICE_SHORT_NAME: value[i].MANAGEMENT_OFFICE_SHORT_NAME,
            REPRESENT_POS_CODE: value[i].REPRESENT_POS_CODE,
            REPRESENT_POS_NAME: value[i].REPRESENT_POS_NAME,
            REPRESENT_POS_LEVEL: value[i].REPRESENT_POS_LEVEL,
            REPRESENT_POS_LEVEL_NAME: value[i].REPRESENT_POS_LEVEL_NAME,
            REPRESENT_DEPT_CODE: value[i].REPRESENT_DEPT_CODE,
            REPRESENT_DEPT_NAME: value[i].REPRESENT_DEPT_NAME,
            REPRESENT_DEPT_LEVEL: value[i].REPRESENT_DEPT_LEVEL,
            REPRESENT_UNDER_DEPT_CODE: value[i].REPRESENT_UNDER_DEPT_CODE,
            REPRESENT_UNDER_DEPT_NAME: value[i].REPRESENT_UNDER_DEPT_NAME,
            REPRESENT_UNDER_DEPT_LEVEL: value[i].REPRESENT_UNDER_DEPT_LEVEL,
            REPRESENT_WORK_DEPT_CODE: value[i].REPRESENT_WORK_DEPT_CODE,
            REPRESENT_WORK_DEPT_NAME: value[i].REPRESENT_WORK_DEPT_NAME,
            REPRESENT_WORK_DEPT_LEVEL: value[i].REPRESENT_WORK_DEPT_LEVEL,
            REPRESENT_OFFICE_CODE: value[i].REPRESENT_OFFICE_CODE,
            REPRESENT_OFFICE_NAME: value[i].REPRESENT_OFFICE_NAME,
            REPRESENT_OFFICE_SHORT_NAME: value[i].REPRESENT_OFFICE_SHORT_NAME,
            STATUS: value[i].STATUS,
            REMARK: value[i].REMARK,
            FIRST_PART: 0,
            FIRST_MONEY: 0,
            SECOND_PART: 0,
            SECOND_MONEY: 0,
            TOTAL_MONEY: 0,
            CONTRIBUTOR_ID: value[i].CONTRIBUTOR_ID,
            IS_ACTIVE: value[i].IS_ACTIVE,
            SEQ: i + 1,
          });
        }
      }
    }
  }

  edit_BribeStaff(value, backup) {
    for (var i = 0; i < backup.length; i++) {
      if (backup[i].IS_ACTIVE == 1) {
        this.staffDel3(backup[i].STAFF_ID);
      }
    }

    for (var i = 0; i < value.length; i++) {
      if (value[i].IS_ACTIVE == 1) {
        this.staffIns_Bribe({
          AGE: value[i].AGE,
          BRIBE_ID: this.BRIDE_ID,
          CONTRIBUTOR_ID: value[i].CONTRIBUTOR_ID,
          FIRST_NAME: value[i].FIRST_NAME,
          ID_CARD: value[i].ID_CARD,
          IS_ACTIVE: value[i].IS_ACTIVE,
          LAST_NAME: value[i].LAST_NAME,
          MANAGEMENT_DEPT_CODE: value[i].MANAGEMENT_DEPT_CODE,
          MANAGEMENT_DEPT_LEVEL: value[i].MANAGEMENT_DEPT_LEVEL,
          MANAGEMENT_DEPT_NAME: value[i].MANAGEMENT_DEPT_NAME,
          MANAGEMENT_OFFICE_CODE: value[i].MANAGEMENT_OFFICE_CODE,
          MANAGEMENT_OFFICE_NAME: value[i].MANAGEMENT_OFFICE_NAME,
          MANAGEMENT_OFFICE_SHORT_NAME: value[i].MANAGEMENT_OFFICE_SHORT_NAME,
          MANAGEMENT_POS_CODE: value[i].MANAGEMENT_POS_CODE,
          MANAGEMENT_POS_LEVEL: value[i].MANAGEMENT_POS_LEVEL,
          MANAGEMENT_POS_LEVEL_NAME: value[i].MANAGEMENT_POS_LEVEL_NAME,
          MANAGEMENT_POS_NAME: value[i].MANAGEMENT_POS_NAME,
          MANAGEMENT_UNDER_DEPT_CODE: value[i].MANAGEMENT_UNDER_DEPT_CODE,
          MANAGEMENT_UNDER_DEPT_LEVEL: value[i].MANAGEMENT_UNDER_DEPT_LEVEL,
          MANAGEMENT_UNDER_DEPT_NAME: value[i].MANAGEMENT_UNDER_DEPT_NAME,
          MANAGEMENT_WORK_DEPT_CODE: value[i].MANAGEMENT_WORK_DEPT_CODE,
          MANAGEMENT_WORK_DEPT_LEVEL: value[i].MANAGEMENT_WORK_DEPT_LEVEL,
          MANAGEMENT_WORK_DEPT_NAME: value[i].MANAGEMENT_WORK_DEPT_NAME,
          OPERATION_DEPT_CODE: value[i].OPERATION_DEPT_CODE,
          OPERATION_DEPT_LEVEL: value[i].OPERATION_DEPT_LEVEL,
          OPERATION_DEPT_NAME: value[i].OPERATION_DEPT_NAME,
          OPERATION_OFFICE_CODE: value[i].OPERATION_OFFICE_CODE,
          OPERATION_OFFICE_NAME: value[i].OPERATION_OFFICE_NAME,
          OPERATION_OFFICE_SHORT_NAME: value[i].OPERATION_OFFICE_SHORT_NAME,
          OPERATION_POS_CODE: value[i].OPERATION_POS_CODE,
          OPERATION_POS_LEVEL_NAME: value[i].OPERATION_POS_LEVEL_NAME,
          OPERATION_UNDER_DEPT_CODE: value[i].OPERATION_UNDER_DEPT_CODE,
          OPERATION_UNDER_DEPT_LEVEL: value[i].OPERATION_UNDER_DEPT_LEVEL,
          OPERATION_UNDER_DEPT_NAME: value[i].OPERATION_UNDER_DEPT_NAME,
          OPERATION_WORK_DEPT_CODE: value[i].OPERATION_WORK_DEPT_CODE,
          OPERATION_WORK_DEPT_LEVEL: value[i].OPERATION_WORK_DEPT_LEVEL,
          OPERATION_WORK_DEPT_NAME: value[i].OPERATION_WORK_DEPT_NAME,
          OPREATION_POS_LEVEL: value[i].OPREATION_POS_LEVEL,
          OPREATION_POS_NAME: value[i].OPREATION_POS_NAME,
          REMARK: value[i].REMARK,
          REPRESENT_DEPT_CODE: value[i].REPRESENT_DEPT_CODE,
          REPRESENT_DEPT_LEVEL: value[i].REPRESENT_DEPT_LEVEL,
          REPRESENT_DEPT_NAME: value[i].REPRESENT_DEPT_NAME,
          REPRESENT_OFFICE_CODE: value[i].REPRESENT_OFFICE_CODE,
          REPRESENT_OFFICE_NAME: value[i].REPRESENT_OFFICE_NAME,
          REPRESENT_OFFICE_SHORT_NAME: value[i].REPRESENT_OFFICE_SHORT_NAME,
          REPRESENT_POS_CODE: value[i].REPRESENT_POS_CODE,
          REPRESENT_POS_LEVEL: value[i].REPRESENT_POS_LEVEL,
          REPRESENT_POS_LEVEL_NAME: value[i].REPRESENT_POS_LEVEL_NAME,
          REPRESENT_POS_NAME: value[i].REPRESENT_POS_NAME,
          REPRESENT_UNDER_DEPT_CODE: value[i].REPRESENT_UNDER_DEPT_CODE,
          REPRESENT_UNDER_DEPT_LEVEL: value[i].REPRESENT_UNDER_DEPT_LEVEL,
          REPRESENT_UNDER_DEPT_NAME: value[i].REPRESENT_UNDER_DEPT_NAME,
          REPRESENT_WORK_DEPT_CODE: value[i].REPRESENT_WORK_DEPT_CODE,
          REPRESENT_WORK_DEPT_LEVEL: value[i].REPRESENT_WORK_DEPT_LEVEL,
          REPRESENT_WORK_DEPT_NAME: value[i].REPRESENT_WORK_DEPT_NAME,
          STAFF_CODE: value[i].STAFF_CODE,
          STAFF_ID: value[i].STAFF_ID,
          STAFF_REF_ID: value[i].STAFF_REF_ID,
          STAFF_TYPE: value[i].STAFF_TYPE,
          STATUS: value[i].STATUS,
          TITLE_ID: value[i].TITLE_ID,
          TITLE_NAME_EN: value[i].TITLE_NAME_EN,
          TITLE_NAME_TH: value[i].TITLE_NAME_TH,
          TITLE_SHORT_NAME_EN: value[i].TITLE_SHORT_NAME_EN,
          TITLE_SHORT_NAME_TH: value[i].TITLE_SHORT_NAME_TH,
        });
      }
    }
  }

  staffIns(value) {
    this.RewardService.RequestRewardStaffinsAll(
      "RequestRewardStaffinsAll",
      value
    ).then((e) => {
      console.log("staffIns : ", e);
    });
  }

  staffIns_Reward(value) {
    this.RewardService.RequestRewardStaffinsAll(
      "RequestRewardStaffinsAll",
      value
    ).then((e) => {
      console.log("staffIns_Reward : ", e);
    });
  }

  staffIns_Bribe(value) {
    this.RewardService.RequestBribeStaffinsAll(
      "RequestBribeStaffinsAll",
      value
    ).then((e) => {
      console.log("staffIns_Bribe : ", e);
    });
  }

  staffDel1(value) {
    let params = { STAFF_ID: value };
    this.RewardService.RequestRewardStaffupdDelete(
      "RequestRewardStaffupdDelete",
      params
    ).then((e) => {
      console.log("RequestRewardStaffupdDelete : ", e);
    });
  }

  staffDel2(value) {
    let params = { STAFF_ID: value };
    this.RewardService.RequestRewardStaffupdDelete(
      "RequestRewardStaffupdDelete",
      params
    ).then((e) => {
      console.log("RequestRewardStaffupdDelete : ", e);
    });
  }

  staffDel3(value) {
    let params = { STAFF_ID: value };
    this.RewardService.RequestBribeStaffupdDelete(
      "RequestBribeStaffupdDelete",
      params
    ).then((e) => {
      console.log("RequestRewardStaffupdDelete : ", e);
    });
  }

  requestRewardinsUpdate(value, BRIBE_REWARD_ID) {
    let set = [];
    set.push({
      APPROVE_PAYMENT_DATE: value.APPROVE_PAYMENT_DATE,
      AUTHORITY_COMMAND_DESC: value.AUTHORITY_COMMAND_DESC,
      AUTHORITY_DESC: value.AUTHORITY_DESC,
      BRIBE_MONEY: this.BRIBE_MONEY,
      BRIBE_REWARD_ID: parseInt(BRIBE_REWARD_ID),
      FIRST_MONEY_PER_PART: this.one_part_three2(),
      FIRST_MONEY_TOTAL: this.one_part_three1(),
      FIRST_PART_TOTAL: this.all_PART_I(),
      FIRST_REMAINDER: this.one_fraction(),
      IS_ACTIVE: 1,
      REFFERENCE_CODE: value.REFFERENCE_CODE,
      REWARD_CODE: value.REWARD_CODE,
      REWARD_DATE: this.getDatepiker(value.REWARD_DATE, value.REWARD_TIME),
      REWARD_ID: value.REWARD_ID,
      REWARD_MONEY: this.REWARD_MONEY,
      REWARD_OFFICE_CODE: value.REWARD_OFFICE_CODE,
      REWARD_OFFICE_ID: value.REWARD_OFFICE_ID,
      REWARD_OFFICE_NAME: value.REWARD_OFFICE_NAME,
      REWARD_TYPE: this.REWARD_TYPE,
      SECOND_MONEY_PER_PART: this.two_part_three2(),
      SECOND_MONEY_TOTAL: this.two_part_three1(),
      SECOND_PART_TOTAL: this.all_PART_II(),
      SECOND_REMAINDER: this.two_fraction(),
      IS_PAY: value.IS_PAY,
      // RequestRewardDetail: value.RequestRewardDetail,
      RequestRewardDetail: [],
      RequestRewardStaff: [],
    });

    this.RewardService.RequestRewardupdByCon(
      "RequestRewardupdByCon",
      set[0]
    ).then((e) => {
      console.log("RequestRewardupdByCon : ", e);
    });
  }

  requestBribeUpdate(value, BRIBE_REWARD_ID) {
    let set = [];
    if (value.HAVE_NOTICE == 0) {
      set.push({});
    } else {
      set.push({
        BRIBE_REWARD_ID: parseInt(BRIBE_REWARD_ID),
        BRIBE_ID: value.BRIBE_ID,
        COMMAND_DETAIL_ID: value.COMMAND_DETAIL_ID,
        APPROVE_PAYMENT_DATE: value.APPROVE_PAYMENT_DATE,
        AUTHORITY_DESC: value.AUTHORITY_DESC,
        BRIBE_CODE: value.BRIBE_CODE,
        BRIBE_DATE: this.getDatepiker(value.BRIBE_DATE, value.BRIBE_TIME),
        BRIBE_MONEY: this.BRIBE_MONEY,
        BRIBE_OFFICE_CODE: value.BRIBE_OFFICE_CODE,
        BRIBE_OFFICE_ID: value.BRIBE_OFFICE_ID,
        BRIBE_OFFICE_NAME: value.BRIBE_OFFICE_SHORT_NAME,
        BRIBE_REMAINDER: value.BRIBE_REMAINDER,
        INFORMER_INFO: value.INFORMER_INFO,
        IS_ACTIVE: 1,
        IS_PAY: parseInt(value.IS_PAY),
        RequestBribeDetail: [],
        RequestBribeStaff: [],
      });
    }
    this.RewardService.RequestBribeupdByCon(
      "RequestBribeupdByCon",
      set[0]
    ).then((e) => {
      console.log("RequestBribeupdByCon : ", e);
    });
  }

  async clickSaveEdit() {
    if (this.HAVE_NOTICE == 1) {
      // let BR = await this.reqBR();
      // let RE = await this.reqRE();

      this.preloader.setShowPreloader(false);
      if ((await this.reqBR()) && (await this.reqRE())) {
        this.preloader.setShowPreloader(true);

        let control = this.controlForm.get("PAYMENT_DETAIL") as FormArray;
        let controls = <FormArray>this.form_REWARD_MONEY.controls.setStaff;
        let controlss = <FormArray>this.form_BRIBE_MONEY.controls.setStaff;

        await this.edit_TableStaff(
          control.getRawValue(),
          this.backupStaff[0].controlTableForm
        );
        await this.edit_RewardStaff(
          controls.getRawValue(),
          this.backupStaff[1].form_REWARD_MONEY
        );
        await this.edit_BribeStaff(
          controlss.getRawValue(),
          this.backupStaff[2].form_BRIBE_MONEY
        );
        await this.requestRewardinsUpdate(
          this.form_REWARD_MONEY.getRawValue(),
          this.BRIBE_REWARD_ID
        );
        await this.requestBribeUpdate(
          this.form_BRIBE_MONEY.getRawValue(),
          this.BRIBE_REWARD_ID
        );

        await this.preloader.setShowPreloader(false);

        swal({
          type: "success",
          text: "บันทึกข้อมูลสำเร็จ",
          confirmButtonText: "ตกลง",
          buttonsStyling: true,
        }).then((list) => {
          location.reload();
        });
      }
    } else {
      // let RE = await this.reqRE();
      this.preloader.setShowPreloader(false);
      if (await this.reqRE()) {
        this.preloader.setShowPreloader(true);

        let control = this.controlForm.get("PAYMENT_DETAIL") as FormArray;
        let controls = <FormArray>this.form_REWARD_MONEY.controls.setStaff;

        await this.edit_TableStaff(
          control.getRawValue(),
          this.backupStaff[0].controlTableForm
        );
        await this.edit_RewardStaff(
          controls.getRawValue(),
          this.backupStaff[1].form_REWARD_MONEY
        );
        await this.requestRewardinsUpdate(
          this.form_REWARD_MONEY.getRawValue(),
          this.BRIBE_REWARD_ID
        );

        await this.preloader.setShowPreloader(false);
        swal({
          type: "success",
          text: "บันทึกข้อมูลสำเร็จ",
          confirmButtonText: "ตกลง",
          buttonsStyling: true,
        }).then((list) => {
          location.reload();
        });
      }
    }
  }

  async save() {
    this.preloader.setShowPreloader(true);

    var BRIBE_ID = 0;
    var REWARD_ID = 0;
    // const param = {
    //         requestBribeDetailinsAllReq: this.RequestBribeDetail(this.form_BRIBE_MONEY.getRawValue()),
    // requestBribeRewardinsAllReq: this.requestBribeRewardinsAllReq(this.form_BRIBE_MONEY.getRawValue()),
    // requestBribeStaffinsAllReqs: this.RequestBribeStaff(this.form_BRIBE_MONEY.getRawValue().setStaff),
    //         requestBribeinsAllReq: this.requestBribeinsAllReq(this.form_BRIBE_MONEY.getRawValue(),0),
    //         requestRewardDetailinsAllReq: this.requestRewardDetailinsAllReq(this.form_REWARD_MONEY.getRawValue()),
    // requestRewardStaffinsAllReq: this.RequestRewardStaff(this.form_REWARD_MONEY.getRawValue().setStaff,this.controlForm.getRawValue()),
    // requestRewardinsAllReq: this.requestRewardinsAllReq(this.form_REWARD_MONEY.getRawValue(),0),
    //       }
    // console.log("param : ",param);
    // this.preloader.setShowPreloader(false);
    if (this.HAVE_NOTICE == 1) {
      // let BR = await this.reqBR();
      // let RE = await this.reqRE();
      // console.log('BR : ', BR);
      // console.log('RE : ', RE);
      this.preloader.setShowPreloader(false);
      if ((await this.reqBR()) && (await this.reqRE())) {
        this.preloader.setShowPreloader(true);
        let RequestBribeRewardinsAll = this.requestBribeRewardinsAllReq(
          this.form_BRIBE_MONEY.getRawValue()
        );
        console.log("RequestBribeRewardinsAll : ", RequestBribeRewardinsAll);
        this.RewardService.RequestBribeRewardinsAll(
          "RequestBribeRewardinsAll",
          RequestBribeRewardinsAll
        ).then((re) => {
          console.log("RequestBribeRewardinsAll res : ", re);
          const param = {
            requestBribeDetailinsAllReq: this.RequestBribeDetail(
              this.form_BRIBE_MONEY.getRawValue()
            ),
            requestBribeRewardinsAllReq: this.requestBribeRewardinsAllReq(
              this.form_BRIBE_MONEY.getRawValue()
            ),
            requestBribeStaffinsAllReqs: [],
            requestBribeinsAllReq: this.requestBribeinsAllReq(
              this.form_BRIBE_MONEY.getRawValue(),
              re.BRIBE_REWARD_ID
            ),
            requestRewardDetailinsAllReq: this.requestRewardDetailinsAllReq(
              this.form_REWARD_MONEY.getRawValue()
            ),
            requestRewardStaffinsAllReq: this.RequestRewardStaff(
              this.form_REWARD_MONEY.getRawValue().setStaff,
              this.controlForm.getRawValue()
            ),
            requestRewardinsAllReq: this.requestRewardinsAllReq(
              this.form_REWARD_MONEY.getRawValue(),
              re.BRIBE_REWARD_ID
            ),
          };

          if (re.IsSuccess == "True") {
            let RequestBribeinsAll = this.requestBribeinsAllReq(
              this.form_BRIBE_MONEY.getRawValue(),
              re.BRIBE_REWARD_ID
            );
            console.log("RequestBribeinsAll : ", RequestBribeinsAll);
            this.RewardService.RequestBribeinsAll(
              "RequestBribeinsAll",
              RequestBribeinsAll
            ).then((res) => {
              console.log("RequestBribeinsAll res : ", res);
              BRIBE_ID = res.BRIBE_ID;
              if (res.IsSuccess == "True") {
                let RequestRewardinsAll = param.requestRewardinsAllReq;
                console.log("RequestRewardinsAll : ", RequestRewardinsAll);
                this.RewardService.RequestRewardinsAll(
                  "RequestRewardinsAll",
                  RequestRewardinsAll
                ).then((ress) => {
                  console.log("RequestRewardinsAll res : ", ress);
                  REWARD_ID = ress.REWARD_ID;
                  if (ress.IsSuccess == "True") {
                    this.preloader.setShowPreloader(false);
                    swal({
                      type: "success",
                      text: "บันทึกข้อมูลสำเร็จ",
                      confirmButtonText: "ตกลง",
                      buttonsStyling: true,
                    }).then((list) => {
                      this.router
                        .navigate([
                          `/reward/manage/${"R"}/${
                            this.INDICTMENT_ID
                          }/${BRIBE_ID}/${REWARD_ID}`,
                        ])
                        .then((e) => {
                          location.reload();
                        });
                    });
                  }
                });
              }
            });
          }
        });
      }
    } else {
      // let RE = await this.reqRE();
      this.preloader.setShowPreloader(false);
      if (await this.reqRE()) {
        this.preloader.setShowPreloader(true);
        let RequestBribeRewardinsAll = this.requestBribeRewardinsAllReq(
          this.form_BRIBE_MONEY.getRawValue()
        );
        console.log("RequestBribeRewardinsAll : ", RequestBribeRewardinsAll);
        this.RewardService.RequestBribeRewardinsAll(
          "RequestBribeRewardinsAll",
          RequestBribeRewardinsAll
        ).then((res) => {
          console.log(res);
          if (res.IsSuccess == "True") {
            const param = {
              requestRewardDetailinsAllReq: this.requestRewardDetailinsAllReq(
                this.form_REWARD_MONEY.getRawValue()
              ),
              requestRewardStaffinsAllReq: this.RequestRewardStaff(
                this.form_REWARD_MONEY.getRawValue().setStaff,
                this.controlForm.getRawValue()
              ),
              requestRewardinsAllReq: this.requestRewardinsAllReq(
                this.form_REWARD_MONEY.getRawValue(),
                res.BRIBE_REWARD_ID
              ),
            };

            let RequestRewardinsAll = param.requestRewardinsAllReq;
            console.log("RequestRewardinsAll : ", RequestRewardinsAll);
            this.RewardService.RequestRewardinsAll(
              "RequestRewardinsAll",
              RequestRewardinsAll
            ).then((ress) => {
              console.log(ress);
              REWARD_ID = ress.REWARD_ID;
              if (ress.IsSuccess == "True") {
                this.preloader.setShowPreloader(false);
                swal({
                  type: "success",
                  text: "บันทึกข้อมูลสำเร็จ",
                  confirmButtonText: "ตกลง",
                  buttonsStyling: true,
                }).then((list) => {
                  this.router
                    .navigate([
                      `/reward/manage/${"R"}/${
                        this.INDICTMENT_ID
                      }/${BRIBE_ID}/${REWARD_ID}`,
                    ])
                    .then((e) => {
                      location.reload();
                    });
                });
              }
            });
          }
        });
      }
    }
  }

  stand(e, index: number) {
    let control = <FormArray>this.controlForm.controls.PAYMENT_DETAIL;
    console.log(e, " : ", control.controls[index]);
    switch (e) {
      case "up":
        if (index >= 1) this.swap(control.controls, index, index - 1);
        break;
      case "down":
        if (index < control.value.length - 1)
          this.swap(control.controls, index, index + 1);
        break;
    }
  }

  REMARK(e, i) {
    let control = <FormArray>this.controlForm.controls.PAYMENT_DETAIL;
    if (e == "ผู้สั่งการ") {
      control.at(i).get("CONTRIBUTOR_ID").setValue(47);
    } else if (e == "จนท.ผู้จับ") {
      control.at(i).get("CONTRIBUTOR_ID").setValue(48);
    } else if (e == "จนท.สนับสนุน") {
      control.at(i).get("CONTRIBUTOR_ID").setValue(49);
    }
    control.at(i).get("A_STAFF_TYPE").setValue(1);
    control.at(i).get("IS_ACTIVE").setValue(1);
  }

  REPRESENT_POS_LEVEL(e, i) {
    let control = <FormArray>this.controlForm.controls.PAYMENT_DETAIL;
    if (e == 0) {
      control.at(i).get("A_CONTRIBUTOR").setValue("เจ้าหน้าที่อื่นๆ");
      control.at(i).get("REPRESENT_POS_LEVEL").setValue(0);
    } else if (e == 1) {
      control.at(i).get("A_CONTRIBUTOR").setValue("เจ้าหน้าที่กรม");
      control.at(i).get("REPRESENT_POS_LEVEL").setValue(1);
    }
  }

  private swap(array: any[], x: any, y: any) {
    var b = array[x];
    array[x] = array[y];
    array[y] = b;
  }

  setChange(value, i) {
    if (value == "เจ้าหน้าที่อื่นๆ") {
      this.deletePerson(i);
      this.addPerson2();
    } else {
      this.deletePerson(i);
      this.addPerson();
    }
  }

  changeName(value, i) {
    let control = <FormArray>this.controlForm.controls.PAYMENT_DETAIL;
    control.at(i).get("FIRST_NAME").setValue(value);
  }

  addPerson() {
    let control = <FormArray>this.controlForm.controls.PAYMENT_DETAIL;
    var num = 0;
    control.push(
      this.fb.group({
        A_CONTRIBUTOR: new FormControl("เจ้าหน้าที่กรม"),
        A_CONTRIBUTOR_ID: new FormControl(""),
        A_MANAGEMENT_POS_LEVEL: new FormControl(""),
        A_MANAGEMENT_POS_LEVEL_NAME: new FormControl(""),
        A_MANAGEMENT_POS_NAME: new FormControl(""),
        A_OPERATION_POS_LEVEL_NAME: new FormControl(""),
        A_OPREATION_POS_LEVEL: new FormControl(""),
        A_OPREATION_POS_NAME: new FormControl(""),
        A_PART_I: new FormControl(0),
        A_PART_II: new FormControl(0),
        A_STAFF: new FormControl(""),
        A_STAFF_ID: new FormControl(""),
        A_TITLE_ID: new FormControl(""),
        A_TITLE_SHORT_NAME_TH: new FormControl(""),
        A_NAME: new FormControl(""),
        A_STAFF_TYPE: new FormControl(1),
        A_MONEY_I: new FormControl(0),
        A_MONEY_II: new FormControl(0),
        A_MONEY_III: new FormControl(0),
        A_STATUS: new FormControl(2),

        FULL_NAME: new FormControl(""),
        STAFF_ID: new FormControl(""),
        REWARD_ID: new FormControl(""),
        STAFF_REF_ID: new FormControl(""),
        TITLE_ID: new FormControl(""),
        STAFF_CODE: new FormControl(""),
        ID_CARD: new FormControl(""),
        STAFF_TYPE: new FormControl(1),
        TITLE_NAME_TH: new FormControl(""),
        TITLE_NAME_EN: new FormControl(""),
        TITLE_SHORT_NAME_TH: new FormControl(""),
        TITLE_SHORT_NAME_EN: new FormControl(""),
        FIRST_NAME: new FormControl(""),
        LAST_NAME: new FormControl(""),
        AGE: new FormControl(""),
        OPERATION_POS_CODE: new FormControl(""),
        OPREATION_POS_NAME: new FormControl(""),
        OPREATION_POS_LEVEL: new FormControl(""),
        OPERATION_POS_LEVEL_NAME: new FormControl(""),
        OPERATION_DEPT_CODE: new FormControl(""),
        OPERATION_DEPT_NAME: new FormControl(""),
        OPERATION_DEPT_LEVEL: new FormControl(""),
        OPERATION_UNDER_DEPT_CODE: new FormControl(""),
        OPERATION_UNDER_DEPT_NAME: new FormControl(""),
        OPERATION_UNDER_DEPT_LEVEL: new FormControl(""),
        OPERATION_WORK_DEPT_CODE: new FormControl(""),
        OPERATION_WORK_DEPT_NAME: new FormControl(""),
        OPERATION_WORK_DEPT_LEVEL: new FormControl(""),
        OPERATION_OFFICE_CODE: new FormControl(""),
        OPERATION_OFFICE_NAME: new FormControl(""),
        OPERATION_OFFICE_SHORT_NAME: new FormControl(""),
        MANAGEMENT_POS_CODE: new FormControl(""),
        MANAGEMENT_POS_NAME: new FormControl(""),
        MANAGEMENT_POS_LEVEL: new FormControl(""),
        MANAGEMENT_POS_LEVEL_NAME: new FormControl(""),
        MANAGEMENT_DEPT_CODE: new FormControl(""),
        MANAGEMENT_DEPT_NAME: new FormControl(""),
        MANAGEMENT_DEPT_LEVEL: new FormControl(""),
        MANAGEMENT_UNDER_DEPT_CODE: new FormControl(""),
        MANAGEMENT_UNDER_DEPT_NAME: new FormControl(""),
        MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(""),
        MANAGEMENT_WORK_DEPT_CODE: new FormControl(""),
        MANAGEMENT_WORK_DEPT_NAME: new FormControl(""),
        MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(""),
        MANAGEMENT_OFFICE_CODE: new FormControl(""),
        MANAGEMENT_OFFICE_NAME: new FormControl(""),
        MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(""),
        REPRESENT_POS_CODE: new FormControl(""),
        REPRESENT_POS_NAME: new FormControl(""),
        REPRESENT_POS_LEVEL: new FormControl("เจ้าหน้าที่กรม"),
        REPRESENT_POS_LEVEL_NAME: new FormControl(""),
        REPRESENT_DEPT_CODE: new FormControl(""),
        REPRESENT_DEPT_NAME: new FormControl(""),
        REPRESENT_DEPT_LEVEL: new FormControl(""),
        REPRESENT_UNDER_DEPT_CODE: new FormControl(""),
        REPRESENT_UNDER_DEPT_NAME: new FormControl(""),
        REPRESENT_UNDER_DEPT_LEVEL: new FormControl(""),
        REPRESENT_WORK_DEPT_CODE: new FormControl(""),
        REPRESENT_WORK_DEPT_NAME: new FormControl(""),
        REPRESENT_WORK_DEPT_LEVEL: new FormControl(""),
        REPRESENT_OFFICE_CODE: new FormControl(""),
        REPRESENT_OFFICE_NAME: new FormControl(""),
        REPRESENT_OFFICE_SHORT_NAME: new FormControl(""),
        STATUS: new FormControl(1),
        REMARK: new FormControl(""),
        FIRST_PART: new FormControl(0),
        FIRST_MONEY: new FormControl(0),
        SECOND_PART: new FormControl(0),
        SECOND_MONEY: new FormControl(0),
        TOTAL_MONEY: new FormControl(""),
        CONTRIBUTOR_ID: new FormControl(""),
        IS_ACTIVE: new FormControl(1),
        SEQ: new FormControl(""),
      })
    );
  }

  addPerson2() {
    let control = <FormArray>this.controlForm.controls.PAYMENT_DETAIL;
    var num = 0;
    control.push(
      this.fb.group({
        A_CONTRIBUTOR: new FormControl("เจ้าหน้าที่อื่นๆ"),
        A_CONTRIBUTOR_ID: new FormControl(""),
        A_MANAGEMENT_POS_LEVEL: new FormControl(""),
        A_MANAGEMENT_POS_LEVEL_NAME: new FormControl(""),
        A_MANAGEMENT_POS_NAME: new FormControl(""),
        A_OPERATION_POS_LEVEL_NAME: new FormControl(""),
        A_OPREATION_POS_LEVEL: new FormControl(""),
        A_OPREATION_POS_NAME: new FormControl(""),
        A_PART_I: new FormControl(0),
        A_PART_II: new FormControl(0),
        A_STAFF: new FormControl(""),
        A_STAFF_ID: new FormControl(""),
        A_TITLE_ID: new FormControl(""),
        A_TITLE_SHORT_NAME_TH: new FormControl(""),
        A_NAME: new FormControl(""),
        A_STAFF_TYPE: new FormControl(1),
        A_MONEY_I: new FormControl(0),
        A_MONEY_II: new FormControl(0),
        A_MONEY_III: new FormControl(0),
        A_STATUS: new FormControl(2),

        FULL_NAME: new FormControl(""),
        STAFF_ID: new FormControl(""),
        REWARD_ID: new FormControl(""),
        STAFF_REF_ID: new FormControl(""),
        TITLE_ID: new FormControl(1),
        STAFF_CODE: new FormControl(""),
        ID_CARD: new FormControl(""),
        STAFF_TYPE: new FormControl(0),
        TITLE_NAME_TH: new FormControl(""),
        TITLE_NAME_EN: new FormControl(""),
        TITLE_SHORT_NAME_TH: new FormControl(""),
        TITLE_SHORT_NAME_EN: new FormControl(""),
        FIRST_NAME: new FormControl(""),
        LAST_NAME: new FormControl(""),
        AGE: new FormControl(""),
        OPERATION_POS_CODE: new FormControl(""),
        OPREATION_POS_NAME: new FormControl(""),
        OPREATION_POS_LEVEL: new FormControl(""),
        OPERATION_POS_LEVEL_NAME: new FormControl(""),
        OPERATION_DEPT_CODE: new FormControl(""),
        OPERATION_DEPT_NAME: new FormControl(""),
        OPERATION_DEPT_LEVEL: new FormControl(""),
        OPERATION_UNDER_DEPT_CODE: new FormControl(""),
        OPERATION_UNDER_DEPT_NAME: new FormControl(""),
        OPERATION_UNDER_DEPT_LEVEL: new FormControl(""),
        OPERATION_WORK_DEPT_CODE: new FormControl(""),
        OPERATION_WORK_DEPT_NAME: new FormControl(""),
        OPERATION_WORK_DEPT_LEVEL: new FormControl(""),
        OPERATION_OFFICE_CODE: new FormControl(""),
        OPERATION_OFFICE_NAME: new FormControl(""),
        OPERATION_OFFICE_SHORT_NAME: new FormControl(""),
        MANAGEMENT_POS_CODE: new FormControl(""),
        MANAGEMENT_POS_NAME: new FormControl(""),
        MANAGEMENT_POS_LEVEL: new FormControl(""),
        MANAGEMENT_POS_LEVEL_NAME: new FormControl(""),
        MANAGEMENT_DEPT_CODE: new FormControl(""),
        MANAGEMENT_DEPT_NAME: new FormControl(""),
        MANAGEMENT_DEPT_LEVEL: new FormControl(""),
        MANAGEMENT_UNDER_DEPT_CODE: new FormControl(""),
        MANAGEMENT_UNDER_DEPT_NAME: new FormControl(""),
        MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(""),
        MANAGEMENT_WORK_DEPT_CODE: new FormControl(""),
        MANAGEMENT_WORK_DEPT_NAME: new FormControl(""),
        MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(""),
        MANAGEMENT_OFFICE_CODE: new FormControl(""),
        MANAGEMENT_OFFICE_NAME: new FormControl(""),
        MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(""),
        REPRESENT_POS_CODE: new FormControl(""),
        REPRESENT_POS_NAME: new FormControl(""),
        REPRESENT_POS_LEVEL: new FormControl("เจ้าหน้าที่อื่นๆ"),
        REPRESENT_POS_LEVEL_NAME: new FormControl(""),
        REPRESENT_DEPT_CODE: new FormControl(""),
        REPRESENT_DEPT_NAME: new FormControl(""),
        REPRESENT_DEPT_LEVEL: new FormControl(""),
        REPRESENT_UNDER_DEPT_CODE: new FormControl(""),
        REPRESENT_UNDER_DEPT_NAME: new FormControl(""),
        REPRESENT_UNDER_DEPT_LEVEL: new FormControl(""),
        REPRESENT_WORK_DEPT_CODE: new FormControl(""),
        REPRESENT_WORK_DEPT_NAME: new FormControl(""),
        REPRESENT_WORK_DEPT_LEVEL: new FormControl(""),
        REPRESENT_OFFICE_CODE: new FormControl(""),
        REPRESENT_OFFICE_NAME: new FormControl(""),
        REPRESENT_OFFICE_SHORT_NAME: new FormControl(""),
        STATUS: new FormControl(1),
        REMARK: new FormControl(""),
        FIRST_PART: new FormControl(0),
        FIRST_MONEY: new FormControl(0),
        SECOND_PART: new FormControl(0),
        SECOND_MONEY: new FormControl(0),
        TOTAL_MONEY: new FormControl(""),
        CONTRIBUTOR_ID: new FormControl(""),
        IS_ACTIVE: new FormControl(1),
        SEQ: new FormControl(""),
      })
    );
  }

  deletePerson(index) {
    let control = <FormArray>this.controlForm.controls.PAYMENT_DETAIL;
    control.removeAt(index);

    for (var i = 0; i < control.value.length; i++) {
      if (control.value[i].A_PART_I == "") {
        control.value[i].A_PART_I = 0;
      } else {
        control.value[i].A_PART_I = parseFloat(control.value[i].A_PART_I);
      }
      if (control.value[i].A_PART_II == "") {
        control.value[i].A_PART_II = 0;
      } else {
        control.value[i].A_PART_II = parseFloat(control.value[i].A_PART_II);
      }
      if (control.value[i].A_CONTRIBUTOR_ID == 14) {
        let aa = parseFloat(
          (
            this.one_part_three2() * control.value[i].A_PART_I +
            this.one_fraction()
          ).toFixed(2)
        );
        let bb = parseFloat(
          (
            this.two_part_three2() * control.value[i].A_PART_II +
            this.two_fraction()
          ).toFixed(2)
        );
        let cc = aa + bb;
        control.at(i).get("A_MONEY_I").setValue(aa);
        control.at(i).get("FIRST_MONEY").setValue(aa);
        control.at(i).get("A_MONEY_II").setValue(bb);
        control.at(i).get("SECOND_MONEY").setValue(bb);
        control
          .at(i)
          .get("A_MONEY_III")
          .setValue(parseFloat(cc.toFixed(2)));
        control
          .at(i)
          .get("TOTAL_MONEY")
          .setValue(parseFloat(cc.toFixed(2)));
      } else {
        let aa = parseFloat(
          (this.one_part_three2() * control.value[i].A_PART_I).toFixed(2)
        );
        let bb = parseFloat(
          (this.two_part_three2() * control.value[i].A_PART_II).toFixed(2)
        );
        let cc = aa + bb;
        control.at(i).get("A_MONEY_I").setValue(aa);
        control.at(i).get("FIRST_MONEY").setValue(aa);
        control.at(i).get("A_MONEY_II").setValue(bb);
        control.at(i).get("SECOND_MONEY").setValue(bb);
        control
          .at(i)
          .get("A_MONEY_III")
          .setValue(parseFloat(cc.toFixed(2)));
        control
          .at(i)
          .get("TOTAL_MONEY")
          .setValue(parseFloat(cc.toFixed(2)));
      }
    }
  }

  private set_PART_I(item, j) {
    let control = <FormArray>this.controlForm.controls.PAYMENT_DETAIL;

    for (var i = 0; i < control.value.length; i++) {
      if (control.value[i].A_PART_I == "") {
        control.value[i].A_PART_I = 0;
      } else {
        control.value[i].A_PART_I = parseFloat(control.value[i].A_PART_I);
      }
      if (control.value[i].A_PART_II == "") {
        control.value[i].A_PART_II = 0;
      } else {
        control.value[i].A_PART_II = parseFloat(control.value[i].A_PART_II);
      }
      if (control.value[i].A_CONTRIBUTOR_ID == 14) {
        let aa = parseFloat(
          (
            this.one_part_three2() * control.value[i].A_PART_I +
            this.one_fraction()
          ).toFixed(2)
        );
        let bb = parseFloat(
          (
            this.two_part_three2() * control.value[i].A_PART_II +
            this.two_fraction()
          ).toFixed(2)
        );
        let cc = aa + bb;
        control.at(i).get("A_MONEY_I").setValue(aa);
        control.at(i).get("FIRST_MONEY").setValue(aa);
        control.at(i).get("A_MONEY_II").setValue(bb);
        control.at(i).get("SECOND_MONEY").setValue(bb);
        control
          .at(i)
          .get("A_MONEY_III")
          .setValue(parseFloat(cc.toFixed(2)));
        control
          .at(i)
          .get("TOTAL_MONEY")
          .setValue(parseFloat(cc.toFixed(2)));
      } else {
        let aa = parseFloat(
          (this.one_part_three2() * control.value[i].A_PART_I).toFixed(2)
        );
        let bb = parseFloat(
          (this.two_part_three2() * control.value[i].A_PART_II).toFixed(2)
        );
        let cc = aa + bb;
        control.at(i).get("A_MONEY_I").setValue(aa);
        control.at(i).get("FIRST_MONEY").setValue(aa);
        control.at(i).get("A_MONEY_II").setValue(bb);
        control.at(i).get("SECOND_MONEY").setValue(bb);
        control
          .at(i)
          .get("A_MONEY_III")
          .setValue(parseFloat(cc.toFixed(2)));
        control
          .at(i)
          .get("TOTAL_MONEY")
          .setValue(parseFloat(cc.toFixed(2)));
      }
    }
  }

  private set_PART_II(item, j) {
    let control = <FormArray>this.controlForm.controls.PAYMENT_DETAIL;

    for (var i = 0; i < control.value.length; i++) {
      if (control.value[i].A_PART_I == "") {
        control.value[i].A_PART_I = 0;
      } else {
        control.value[i].A_PART_I = parseFloat(control.value[i].A_PART_I);
      }
      if (control.value[i].A_PART_II == "") {
        control.value[i].A_PART_II = 0;
      } else {
        control.value[i].A_PART_II = parseFloat(control.value[i].A_PART_II);
      }
      if (control.value[i].A_CONTRIBUTOR_ID == 14) {
        let aa = parseFloat(
          (
            this.one_part_three2() * control.value[i].A_PART_I +
            this.one_fraction()
          ).toFixed(2)
        );
        let bb = parseFloat(
          (
            this.two_part_three2() * control.value[i].A_PART_II +
            this.two_fraction()
          ).toFixed(2)
        );
        let cc = aa + bb;
        control.at(i).get("A_MONEY_I").setValue(aa);
        control.at(i).get("FIRST_MONEY").setValue(aa);
        control.at(i).get("A_MONEY_II").setValue(bb);
        control.at(i).get("SECOND_MONEY").setValue(bb);
        control
          .at(i)
          .get("A_MONEY_III")
          .setValue(parseFloat(cc.toFixed(2)));
        control
          .at(i)
          .get("TOTAL_MONEY")
          .setValue(parseFloat(cc.toFixed(2)));
      } else {
        let aa = parseFloat(
          (this.one_part_three2() * control.value[i].A_PART_I).toFixed(2)
        );
        let bb = parseFloat(
          (this.two_part_three2() * control.value[i].A_PART_II).toFixed(2)
        );
        let cc = aa + bb;
        control.at(i).get("A_MONEY_I").setValue(aa);
        control.at(i).get("FIRST_MONEY").setValue(aa);
        control.at(i).get("A_MONEY_II").setValue(bb);
        control.at(i).get("SECOND_MONEY").setValue(bb);
        control
          .at(i)
          .get("A_MONEY_III")
          .setValue(parseFloat(cc.toFixed(2)));
        control
          .at(i)
          .get("TOTAL_MONEY")
          .setValue(parseFloat(cc.toFixed(2)));
      }
    }
  }

  private setCal() {
    let control = <FormArray>this.controlForm.controls.PAYMENT_DETAIL;

    for (var i = 0; i < control.value.length; i++) {
      if (control.value[i].A_PART_I == "") {
        control.value[i].A_PART_I = 0;
      } else {
        control.value[i].A_PART_I = parseFloat(control.value[i].A_PART_I);
      }
      if (control.value[i].A_PART_II == "") {
        control.value[i].A_PART_II = 0;
      } else {
        control.value[i].A_PART_II = parseFloat(control.value[i].A_PART_II);
      }
      if (control.value[i].A_CONTRIBUTOR_ID == 14) {
        let aa = parseFloat(
          (
            this.one_part_three2() * control.value[i].A_PART_I +
            this.one_fraction()
          ).toFixed(2)
        );
        let bb = parseFloat(
          (
            this.two_part_three2() * control.value[i].A_PART_II +
            this.two_fraction()
          ).toFixed(2)
        );
        let cc = aa + bb;
        control.at(i).get("A_MONEY_I").setValue(aa);
        control.at(i).get("FIRST_MONEY").setValue(aa);
        control.at(i).get("A_MONEY_II").setValue(bb);
        control.at(i).get("SECOND_MONEY").setValue(bb);
        control
          .at(i)
          .get("A_MONEY_III")
          .setValue(parseFloat(cc.toFixed(2)));
        control
          .at(i)
          .get("TOTAL_MONEY")
          .setValue(parseFloat(cc.toFixed(2)));
      } else {
        let aa = parseFloat(
          (this.one_part_three2() * control.value[i].A_PART_I).toFixed(2)
        );
        let bb = parseFloat(
          (this.two_part_three2() * control.value[i].A_PART_II).toFixed(2)
        );
        let cc = aa + bb;
        control.at(i).get("A_MONEY_I").setValue(aa);
        control.at(i).get("FIRST_MONEY").setValue(aa);
        control.at(i).get("A_MONEY_II").setValue(bb);
        control.at(i).get("SECOND_MONEY").setValue(bb);
        control
          .at(i)
          .get("A_MONEY_III")
          .setValue(parseFloat(cc.toFixed(2)));
        control
          .at(i)
          .get("TOTAL_MONEY")
          .setValue(parseFloat(cc.toFixed(2)));
      }
    }
  }

  all_PART_I(): number {
    var sum = 0;
    let control = <FormArray>this.controlForm.controls.PAYMENT_DETAIL;
    for (var i = 0; i < control.value.length; i++) {
      if (control.value[i].A_PART_I == "") {
        control.value[i].A_PART_I = 0;
      }
      sum += parseFloat(control.value[i].A_PART_I);
    }
    return sum;
  }

  all_PART_II(): number {
    var sum = 0;
    let control = <FormArray>this.controlForm.controls.PAYMENT_DETAIL;
    for (var i = 0; i < control.value.length; i++) {
      if (control.value[i].A_PART_II == "") {
        control.value[i].A_PART_II = 0;
      }
      sum += parseFloat(control.value[i].A_PART_II);
    }
    return sum;
  }

  all_part_I(): number {
    var sum = 0;
    let control = <FormArray>this.controlForm.controls.PAYMENT_DETAIL;
    for (var i = 0; i < control.value.length; i++) {
      if (control.value[i].A_MONEY_I == "") {
        control.value[i].A_MONEY_I = 0;
      }
      sum += parseFloat(control.value[i].A_MONEY_I);
    }
    return sum;
  }

  all_part_II(): number {
    var sum = 0;
    let control = <FormArray>this.controlForm.controls.PAYMENT_DETAIL;
    for (var i = 0; i < control.value.length; i++) {
      if (control.value[i].A_MONEY_II == "") {
        control.value[i].A_MONEY_II = 0;
      }
      sum += parseFloat(control.value[i].A_MONEY_II);
    }
    return sum;
  }

  all_part_III(): number {
    var sum = 0;
    let control = <FormArray>this.controlForm.controls.PAYMENT_DETAIL;
    for (var i = 0; i < control.value.length; i++) {
      if (control.value[i].A_MONEY_III == "") {
        control.value[i].A_MONEY_III = 0;
      }
      sum += parseFloat(control.value[i].A_MONEY_III);
    }
    return sum;
  }

  all_part_IIII(): number {
    var sum = 0;
    let control = <FormArray>this.controlForm.controls.PAYMENT_DETAIL;
    for (var i = 0; i < control.value.length; i++) {
      if (control.value[i].A_MONEY_III == "") {
        control.value[i].A_MONEY_III = 0;
      }
      sum += parseFloat(control.value[i].A_MONEY_III);
    }
    return sum + parseFloat(this.BRIBE_MONEY);
  }

  one_part_three1(): number {
    var sum = 0;
    sum = parseFloat(((this.REWARD_MONEY * 1) / 3).toFixed(2));
    return sum;
  }

  one_part_three2(): number {
    var sum = 0;
    sum = parseFloat((this.one_part_three1() / this.all_PART_I()).toFixed(2));
    return sum;
  }

  one_part_three3(): number {
    var sum = 0;
    sum = parseFloat((this.one_part_three2() * this.all_PART_I()).toFixed(2));
    return sum;
  }

  one_fraction(): number {
    var sum = 0;
    sum = parseFloat(
      (this.one_part_three1() - this.one_part_three3()).toFixed(2)
    );
    return sum;
  }

  two_part_three1(): number {
    var sum = 0;
    sum = parseFloat((this.REWARD_MONEY - this.one_part_three1()).toFixed(2));
    return sum;
  }

  two_part_three2(): number {
    var sum = 0;
    sum = parseFloat((this.two_part_three1() / this.all_PART_II()).toFixed(2));
    return sum;
  }

  two_part_three3(): number {
    var sum = 0;
    sum = parseFloat((this.two_part_three2() * this.all_PART_II()).toFixed(2));
    return sum;
  }

  two_fraction(): number {
    var sum = 0;
    sum = parseFloat(
      (this.two_part_three1() - this.two_part_three3()).toFixed(2)
    );
    return sum;
  }

  getTimeNow(d: any = new Date(), isZero: any = null) {
    let h = d.getHours().toString();
    let m = d.getMinutes().toString();
    if (+h < 10) {
      h = "0" + h;
    }
    if (+m < 10) m = "0" + m;
    return h + ":" + m + "";
  }

  check(e) {
    switch (e) {
      case "IS_APPROVE1":
        this.form_BRIBE_MONEY.get("IS_ACTIVE").setValue(1);
        break;
      case "IS_APPROVE2":
        this.form_BRIBE_MONEY.get("IS_ACTIVE").setValue(0);
        break;
      case "IS_APPROVE3":
        this.form_REWARD_MONEY.get("IS_ACTIVE").setValue(1);
        break;
      case "IS_APPROVE4":
        this.form_REWARD_MONEY.get("IS_ACTIVE").setValue(0);
        break;
    }
  }

  myDatePickerNotSetFromOptions: IMyOptions = {
    editableDateField: false,
    dateFormat: "dd mmm yyyy",
    showClearDateBtn: false,
    height: "30px",
  };

  getDisCurrDateMyDatePicker() {
    let currentdate = new Date();
    const disCurrDate = {
      begin: {
        year: currentdate.getFullYear(),
        month: currentdate.getMonth() + 1,
        day: currentdate.getDate() + 1,
      },
      end: {
        year: currentdate.getFullYear() + 100,
        month: currentdate.getMonth() + 1,
        day: currentdate.getDate(),
      },
    };
    return disCurrDate;
  }

  /////////////////////////////////////////////////////////////////////////// SEARCH OFFICE //////////////////////////////////////////////////////////////////////////////////////////
  typeheadOffice = new Array<MasOfficeModel_New>();
  serachOffice = (text3$: Observable<string>) =>
    text3$
      .debounceTime(200)
      .distinctUntilChanged()
      .map((term) =>
        term === ""
          ? []
          : this.typeheadOffice
              .filter(
                (v) =>
                  `${v.OFFICE_NAME || ""} ${v.OFFICE_SHORT_NAME || ""}`
                    .toLowerCase()
                    .indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      );

  formatterOffice1 = (x: { OFFICE_SHORT_NAME: string }) => x.OFFICE_SHORT_NAME;
  formatterOffice2 = (x: { OFFICE_SHORT_NAME: string }) => x.OFFICE_SHORT_NAME;

  selectItemOffice(e) {
    this.form_BRIBE_MONEY.patchValue({
      BRIBE_OFFICE_CODE: e.item.OFFICE_CODE,
      BRIBE_OFFICE_NAME: e.item.OFFICE_NAME,
      BRIBE_OFFICE_SHORT_NAME: e.item.OFFICE_SHORT_NAME,
      BRIBE_OFFICE_ID: e.item.OFFICE_ID,
    });
  }

  selectItemOffice2(e) {
    this.form_REWARD_MONEY.patchValue({
      REWARD_OFFICE_CODE: e.item.OFFICE_CODE,
      REWARD_OFFICE_NAME: e.item.OFFICE_NAME,
      REWARD_OFFICE_SHORT_NAME: e.item.OFFICE_SHORT_NAME,
      REWARD_OFFICE_ID: e.item.OFFICE_ID,
    });
  }

  blurSelectItemOffice(input) {
    let val = input.value;
    if (!val) {
      this.form_BRIBE_MONEY.patchValue({
        BRIBE_OFFICE_CODE: "",
        BRIBE_OFFICE_NAME: "",
        BRIBE_OFFICE_SHORT_NAME: "",
        BRIBE_OFFICE_ID: "",
      });
    }
  }

  blurSelectItemOffice2(input) {
    let val = input.value;
    if (!val) {
      this.form_REWARD_MONEY.patchValue({
        REWARD_OFFICE_CODE: "",
        REWARD_OFFICE_NAME: "",
        REWARD_OFFICE_SHORT_NAME: "",
        REWARD_OFFICE_ID: "",
      });
    }
  }

  isReq_OffName = new BehaviorSubject<boolean>(false);
  ///////////////////////////////////////////////////////////////////////// SETMasOffice //////////////////////////////////////////////////////////////////////////////////////////

  private async setOfficeStore2() {
    await this.mainMasterService
      .MasOfficegetByCon()
      .then((res) => (this.typeheadOffice = res.RESPONSE_DATA));
  }

  ////////////////////////////////////////////////////////////////////////// SEARCH STAFF //////////////////////////////////////////////////////////////////////////////////////////
  searching = false;
  searchFailed = false;
  public searchStaff = (text2$: Observable<string>) =>
    text2$
      .debounceTime(200)
      .distinctUntilChanged()
      .do(() => (this.searching = true))
      .switchMap((term) =>
        this.RewardService.MasStaffgetByCon_Search({ TEXT_SEARCH: term })
          .do(() => (this.searchFailed = false))
          .catch(() => {
            this.searchFailed = true;
            return Observable.of([]);
          })
      )
      .do(() => (this.searching = false));

  formatterStaff = (x: {
    TITLE_SHORT_NAME_TH: string;
    FIRST_NAME: string;
    LAST_NAME: string;
  }) =>
    `${x.TITLE_SHORT_NAME_TH || ""}${x.FIRST_NAME || ""} ${x.LAST_NAME || ""}`;

  selectItemStaff(e, i) {
    let control = <FormArray>this.controlForm.controls.PAYMENT_DETAIL;
    control.at(i).patchValue({
      FULL_NAME: `${e.item.FIRST_NAME || ""} ${e.item.LAST_NAME || ""}`,
      STAFF_ID: e.item.STAFF_ID || "",
      REWARD_ID: e.item.REWARD_ID || "",
      STAFF_REF_ID: e.item.STAFF_REF_ID || "",
      TITLE_ID: e.item.TITLE_ID || "",
      STAFF_CODE: e.item.STAFF_CODE || "",
      ID_CARD: e.item.ID_CARD || "",
      STAFF_TYPE: e.item.STAFF_TYPE || "",
      TITLE_NAME_TH: e.item.TITLE_NAME_TH || "",
      TITLE_NAME_EN: e.item.TITLE_NAME_EN || "",
      TITLE_SHORT_NAME_TH: e.item.TITLE_SHORT_NAME_TH || "",
      TITLE_SHORT_NAME_EN: e.item.TITLE_SHORT_NAME_EN || "",
      FIRST_NAME: e.item.FIRST_NAME || "",
      LAST_NAME: e.item.LAST_NAME || "",
      AGE: e.item.AGE || "",
      OPERATION_POS_CODE: e.item.OPERATION_POS_CODE || "",
      OPREATION_POS_NAME: e.item.OPREATION_POS_NAME || "",
      OPREATION_POS_LEVEL: e.item.OPREATION_POS_LEVEL || "",
      OPERATION_POS_LEVEL_NAME: e.item.OPERATION_POS_LEVEL_NAME || "",
      OPERATION_DEPT_CODE: e.item.OPERATION_DEPT_CODE || "",
      OPERATION_DEPT_NAME: e.item.OPERATION_DEPT_NAME || "",
      OPERATION_DEPT_LEVEL: e.item.OPERATION_DEPT_LEVEL || "",
      OPERATION_UNDER_DEPT_CODE: e.item.OPERATION_UNDER_DEPT_CODE || "",
      OPERATION_UNDER_DEPT_NAME: e.item.OPERATION_UNDER_DEPT_NAME || "",
      OPERATION_UNDER_DEPT_LEVEL: e.item.OPERATION_UNDER_DEPT_LEVEL || "",
      OPERATION_WORK_DEPT_CODE: e.item.OPERATION_WORK_DEPT_CODE || "",
      OPERATION_WORK_DEPT_NAME: e.item.OPERATION_WORK_DEPT_NAME || "",
      OPERATION_WORK_DEPT_LEVEL: e.item.OPERATION_WORK_DEPT_LEVEL || "",
      OPERATION_OFFICE_CODE: e.item.OPERATION_OFFICE_CODE || "",
      OPERATION_OFFICE_NAME: e.item.OPERATION_OFFICE_NAME || "",
      OPERATION_OFFICE_SHORT_NAME: e.item.OPERATION_OFFICE_SHORT_NAME || "",
      MANAGEMENT_POS_CODE: e.item.MANAGEMENT_POS_CODE || "",
      MANAGEMENT_POS_NAME: e.item.MANAGEMENT_POS_NAME || "",
      MANAGEMENT_POS_LEVEL: "",
      MANAGEMENT_POS_LEVEL_NAME: e.item.MANAGEMENT_POS_LEVEL_NAME || "",
      MANAGEMENT_DEPT_CODE: e.item.MANAGEMENT_DEPT_CODE || "",
      MANAGEMENT_DEPT_NAME: e.item.MANAGEMENT_DEPT_NAME || "",
      MANAGEMENT_DEPT_LEVEL: e.item.MANAGEMENT_DEPT_LEVEL || "",
      MANAGEMENT_UNDER_DEPT_CODE: e.item.MANAGEMENT_UNDER_DEPT_CODE || "",
      MANAGEMENT_UNDER_DEPT_NAME: e.item.MANAGEMENT_UNDER_DEPT_NAME || "",
      MANAGEMENT_UNDER_DEPT_LEVEL: e.item.MANAGEMENT_UNDER_DEPT_LEVEL || "",
      MANAGEMENT_WORK_DEPT_CODE: e.item.MANAGEMENT_WORK_DEPT_CODE || "",
      MANAGEMENT_WORK_DEPT_NAME: e.item.MANAGEMENT_WORK_DEPT_NAME || "",
      MANAGEMENT_WORK_DEPT_LEVEL: e.item.MANAGEMENT_WORK_DEPT_LEVEL || "",
      MANAGEMENT_OFFICE_CODE: e.item.MANAGEMENT_OFFICE_CODE || "",
      MANAGEMENT_OFFICE_NAME: e.item.MANAGEMENT_OFFICE_NAME || "",
      MANAGEMENT_OFFICE_SHORT_NAME: e.item.MANAGEMENT_OFFICE_SHORT_NAME || "",
      REPRESENT_POS_CODE: e.item.REPRESENT_POS_CODE || "",
      REPRESENT_POS_NAME: e.item.REPRESENT_POS_NAME || "",
      // REPRESENT_POS_LEVEL: e.item.REPRESENT_POS_LEVEL || '',
      REPRESENT_POS_LEVEL_NAME: e.item.REPRESENT_POS_LEVEL_NAME || "",
      REPRESENT_DEPT_CODE: e.item.REPRESENT_DEPT_CODE || "",
      REPRESENT_DEPT_NAME: e.item.REPRESENT_DEPT_NAME || "",
      REPRESENT_DEPT_LEVEL: e.item.REPRESENT_DEPT_LEVEL || "",
      REPRESENT_UNDER_DEPT_CODE: e.item.REPRESENT_UNDER_DEPT_CODE || "",
      REPRESENT_UNDER_DEPT_NAME: e.item.REPRESENT_UNDER_DEPT_NAME || "",
      REPRESENT_UNDER_DEPT_LEVEL: e.item.REPRESENT_UNDER_DEPT_LEVEL || "",
      REPRESENT_WORK_DEPT_CODE: e.item.REPRESENT_WORK_DEPT_CODE || "",
      REPRESENT_WORK_DEPT_NAME: e.item.REPRESENT_WORK_DEPT_NAME || "",
      REPRESENT_WORK_DEPT_LEVEL: e.item.REPRESENT_WORK_DEPT_LEVEL || "",
      REPRESENT_OFFICE_CODE: e.item.REPRESENT_OFFICE_CODE || "",
      REPRESENT_OFFICE_NAME: e.item.REPRESENT_OFFICE_NAME || "",
      REPRESENT_OFFICE_SHORT_NAME: e.item.REPRESENT_OFFICE_SHORT_NAME || "",
      STATUS: e.item.STATUS,
      REMARK: "",
      FIRST_PART: "",
      FIRST_MONEY: "",
      SECOND_PART: "",
      SECOND_MONEY: "",
      TOTAL_MONEY: "",
      CONTRIBUTOR_ID: "",
      IS_ACTIVE: 1,
      SEQ: i,
    });
  }

  selectItemStaff38(e, i) {
    this.ControlStaffBRIBE.at(i).patchValue({
      FULL_NAME: `${e.item.TITLE_SHORT_NAME_TH || " "}${
        e.item.FIRST_NAME || ""
      } ${e.item.LAST_NAME || ""}`,
      STAFF_ID: e.item.STAFF_ID || "",
      BRIBE_ID: e.item.BRIBE_ID || "",
      STAFF_REF_ID: e.item.STAFF_REF_ID || "",
      TITLE_ID: e.item.TITLE_ID || "",
      STAFF_CODE: e.item.STAFF_CODE || "",
      ID_CARD: e.item.ID_CARD || "",
      STAFF_TYPE: e.item.STAFF_TYPE || "",
      TITLE_NAME_TH: e.item.TITLE_NAME_TH || "",
      TITLE_NAME_EN: e.item.TITLE_NAME_EN || "",
      TITLE_SHORT_NAME_TH: e.item.TITLE_SHORT_NAME_TH || "",
      TITLE_SHORT_NAME_EN: e.item.TITLE_SHORT_NAME_EN || "",
      FIRST_NAME: e.item.FIRST_NAME || "",
      LAST_NAME: e.item.LAST_NAME || "",
      AGE: e.item.AGE || "",
      OPERATION_POS_CODE: e.item.OPERATION_POS_CODE || "",
      OPREATION_POS_NAME: e.item.OPREATION_POS_NAME || "",
      OPREATION_POS_LEVEL: e.item.OPREATION_POS_LEVEL || "",
      OPERATION_POS_LEVEL_NAME: e.item.OPERATION_POS_LEVEL_NAME || "",
      OPERATION_DEPT_CODE: e.item.OPERATION_DEPT_CODE || "",
      OPERATION_DEPT_NAME: e.item.OPERATION_DEPT_NAME || "",
      OPERATION_DEPT_LEVEL: e.item.OPERATION_DEPT_LEVEL || "",
      OPERATION_UNDER_DEPT_CODE: e.item.OPERATION_UNDER_DEPT_CODE || "",
      OPERATION_UNDER_DEPT_NAME: e.item.OPERATION_UNDER_DEPT_NAME || "",
      OPERATION_UNDER_DEPT_LEVEL: e.item.OPERATION_UNDER_DEPT_LEVEL || "",
      OPERATION_WORK_DEPT_CODE: e.item.OPERATION_WORK_DEPT_CODE || "",
      OPERATION_WORK_DEPT_NAME: e.item.OPERATION_WORK_DEPT_NAME || "",
      OPERATION_WORK_DEPT_LEVEL: e.item.OPERATION_WORK_DEPT_LEVEL || "",
      OPERATION_OFFICE_CODE: e.item.OPERATION_OFFICE_CODE || "",
      OPERATION_OFFICE_NAME: e.item.OPERATION_OFFICE_NAME || "",
      OPERATION_OFFICE_SHORT_NAME: e.item.OPERATION_OFFICE_SHORT_NAME || "",
      MANAGEMENT_POS_CODE: e.item.MANAGEMENT_POS_CODE || "",
      MANAGEMENT_POS_NAME: e.item.MANAGEMENT_POS_NAME || "",
      MANAGEMENT_POS_LEVEL: e.item.MANAGEMENT_POS_LEVEL || "",
      MANAGEMENT_POS_LEVEL_NAME: e.item.MANAGEMENT_POS_LEVEL_NAME || "",
      MANAGEMENT_DEPT_CODE: e.item.MANAGEMENT_DEPT_CODE || "",
      MANAGEMENT_DEPT_NAME: e.item.MANAGEMENT_DEPT_NAME || "",
      MANAGEMENT_DEPT_LEVEL: e.item.MANAGEMENT_DEPT_LEVEL || "",
      MANAGEMENT_UNDER_DEPT_CODE: e.item.MANAGEMENT_UNDER_DEPT_CODE || "",
      MANAGEMENT_UNDER_DEPT_NAME: e.item.MANAGEMENT_UNDER_DEPT_NAME || "",
      MANAGEMENT_UNDER_DEPT_LEVEL: e.item.MANAGEMENT_UNDER_DEPT_LEVEL || "",
      MANAGEMENT_WORK_DEPT_CODE: e.item.MANAGEMENT_WORK_DEPT_CODE || "",
      MANAGEMENT_WORK_DEPT_NAME: e.item.MANAGEMENT_WORK_DEPT_NAME || "",
      MANAGEMENT_WORK_DEPT_LEVEL: e.item.MANAGEMENT_WORK_DEPT_LEVEL || "",
      MANAGEMENT_OFFICE_CODE: e.item.MANAGEMENT_OFFICE_CODE || "",
      MANAGEMENT_OFFICE_NAME: e.item.MANAGEMENT_OFFICE_NAME || "",
      MANAGEMENT_OFFICE_SHORT_NAME: e.item.MANAGEMENT_OFFICE_SHORT_NAME || "",
      REPRESENT_POS_CODE: e.item.REPRESENT_POS_CODE || "",
      REPRESENT_POS_NAME: e.item.REPRESENT_POS_NAME || "",
      REPRESENT_POS_LEVEL: e.item.REPRESENT_POS_LEVEL || "",
      REPRESENT_POS_LEVEL_NAME: e.item.REPRESENT_POS_LEVEL_NAME || "",
      REPRESENT_DEPT_CODE: e.item.REPRESENT_DEPT_CODE || "",
      REPRESENT_DEPT_NAME: e.item.REPRESENT_DEPT_NAME || "",
      REPRESENT_DEPT_LEVEL: e.item.REPRESENT_DEPT_LEVEL || "",
      REPRESENT_UNDER_DEPT_CODE: e.item.REPRESENT_UNDER_DEPT_CODE || "",
      REPRESENT_UNDER_DEPT_NAME: e.item.REPRESENT_UNDER_DEPT_NAME || "",
      REPRESENT_UNDER_DEPT_LEVEL: e.item.REPRESENT_UNDER_DEPT_LEVEL || "",
      REPRESENT_WORK_DEPT_CODE: e.item.REPRESENT_WORK_DEPT_CODE || "",
      REPRESENT_WORK_DEPT_NAME: e.item.REPRESENT_WORK_DEPT_NAME || "",
      REPRESENT_WORK_DEPT_LEVEL: e.item.REPRESENT_WORK_DEPT_LEVEL || "",
      REPRESENT_OFFICE_CODE: e.item.REPRESENT_OFFICE_CODE || "",
      REPRESENT_OFFICE_NAME: e.item.REPRESENT_OFFICE_NAME || "",
      REPRESENT_OFFICE_SHORT_NAME: e.item.REPRESENT_OFFICE_SHORT_NAME || "",
      STATUS: e.item.STATUS || "",
      REMARK: e.item.REMARK || "",
      CONTRIBUTOR_ID: 38,
      IS_ACTIVE: 1,
    });
  }

  deleteContri38(i) {
    this.ControlStaffBRIBE.at(i).patchValue({
      FULL_NAME: "",
      STAFF_ID: "",
      BRIBE_ID: "",
      STAFF_REF_ID: "",
      TITLE_ID: "",
      STAFF_CODE: "",
      ID_CARD: "",
      STAFF_TYPE: "",
      TITLE_NAME_TH: "",
      TITLE_NAME_EN: "",
      TITLE_SHORT_NAME_TH: "",
      TITLE_SHORT_NAME_EN: "",
      FIRST_NAME: "",
      LAST_NAME: "",
      AGE: "",
      OPERATION_POS_CODE: "",
      OPREATION_POS_NAME: "",
      OPREATION_POS_LEVEL: "",
      OPERATION_POS_LEVEL_NAME: "",
      OPERATION_DEPT_CODE: "",
      OPERATION_DEPT_NAME: "",
      OPERATION_DEPT_LEVEL: "",
      OPERATION_UNDER_DEPT_CODE: "",
      OPERATION_UNDER_DEPT_NAME: "",
      OPERATION_UNDER_DEPT_LEVEL: "",
      OPERATION_WORK_DEPT_CODE: "",
      OPERATION_WORK_DEPT_NAME: "",
      OPERATION_WORK_DEPT_LEVEL: "",
      OPERATION_OFFICE_CODE: "",
      OPERATION_OFFICE_NAME: "",
      OPERATION_OFFICE_SHORT_NAME: "",
      MANAGEMENT_POS_CODE: "",
      MANAGEMENT_POS_NAME: "",
      MANAGEMENT_POS_LEVEL: "",
      MANAGEMENT_POS_LEVEL_NAME: "",
      MANAGEMENT_DEPT_CODE: "",
      MANAGEMENT_DEPT_NAME: "",
      MANAGEMENT_DEPT_LEVEL: "",
      MANAGEMENT_UNDER_DEPT_CODE: "",
      MANAGEMENT_UNDER_DEPT_NAME: "",
      MANAGEMENT_UNDER_DEPT_LEVEL: "",
      MANAGEMENT_WORK_DEPT_CODE: "",
      MANAGEMENT_WORK_DEPT_NAME: "",
      MANAGEMENT_WORK_DEPT_LEVEL: "",
      MANAGEMENT_OFFICE_CODE: "",
      MANAGEMENT_OFFICE_NAME: "",
      MANAGEMENT_OFFICE_SHORT_NAME: "",
      REPRESENT_POS_CODE: "",
      REPRESENT_POS_NAME: "",
      REPRESENT_POS_LEVEL: "",
      REPRESENT_POS_LEVEL_NAME: "",
      REPRESENT_DEPT_CODE: "",
      REPRESENT_DEPT_NAME: "",
      REPRESENT_DEPT_LEVEL: "",
      REPRESENT_UNDER_DEPT_CODE: "",
      REPRESENT_UNDER_DEPT_NAME: "",
      REPRESENT_UNDER_DEPT_LEVEL: "",
      REPRESENT_WORK_DEPT_CODE: "",
      REPRESENT_WORK_DEPT_NAME: "",
      REPRESENT_WORK_DEPT_LEVEL: "",
      REPRESENT_OFFICE_CODE: "",
      REPRESENT_OFFICE_NAME: "",
      REPRESENT_OFFICE_SHORT_NAME: "",
      STATUS: "",
      REMARK: "",
      CONTRIBUTOR_ID: 38,
      IS_ACTIVE: 0,
    });
  }

  selectItemStaff43(e, i) {
    this.ControlStaffREWARD.at(0).patchValue({
      FULL_NAME: `${e.item.TITLE_SHORT_NAME_TH || " "}${
        e.item.FIRST_NAME || ""
      } ${e.item.LAST_NAME || ""}`,
      STAFF_ID: e.item.STAFF_ID || "",
      REWARD_ID: e.item.REWARD_ID || "",
      STAFF_REF_ID: e.item.STAFF_REF_ID || "",
      TITLE_ID: e.item.TITLE_ID || "",
      STAFF_CODE: e.item.STAFF_CODE || "",
      ID_CARD: e.item.ID_CARD || "",
      STAFF_TYPE: e.item.STAFF_TYPE || "",
      TITLE_NAME_TH: e.item.TITLE_NAME_TH || "",
      TITLE_NAME_EN: e.item.TITLE_NAME_EN || "",
      TITLE_SHORT_NAME_TH: e.item.TITLE_SHORT_NAME_TH || "",
      TITLE_SHORT_NAME_EN: e.item.TITLE_SHORT_NAME_EN || "",
      FIRST_NAME: e.item.FIRST_NAME || "",
      LAST_NAME: e.item.LAST_NAME || "",
      AGE: e.item.AGE || "",
      OPERATION_POS_CODE: e.item.OPERATION_POS_CODE || "",
      OPREATION_POS_NAME: e.item.OPREATION_POS_NAME || "",
      OPREATION_POS_LEVEL: e.item.OPREATION_POS_LEVEL || "",
      OPERATION_POS_LEVEL_NAME: e.item.OPERATION_POS_LEVEL_NAME || "",
      OPERATION_DEPT_CODE: e.item.OPERATION_DEPT_CODE || "",
      OPERATION_DEPT_NAME: e.item.OPERATION_DEPT_NAME || "",
      OPERATION_DEPT_LEVEL: e.item.OPERATION_DEPT_LEVEL || "",
      OPERATION_UNDER_DEPT_CODE: e.item.OPERATION_UNDER_DEPT_CODE || "",
      OPERATION_UNDER_DEPT_NAME: e.item.OPERATION_UNDER_DEPT_NAME || "",
      OPERATION_UNDER_DEPT_LEVEL: e.item.OPERATION_UNDER_DEPT_LEVEL || "",
      OPERATION_WORK_DEPT_CODE: e.item.OPERATION_WORK_DEPT_CODE || "",
      OPERATION_WORK_DEPT_NAME: e.item.OPERATION_WORK_DEPT_NAME || "",
      OPERATION_WORK_DEPT_LEVEL: e.item.OPERATION_WORK_DEPT_LEVEL || "",
      OPERATION_OFFICE_CODE: e.item.OPERATION_OFFICE_CODE || "",
      OPERATION_OFFICE_NAME: e.item.OPERATION_OFFICE_NAME || "",
      OPERATION_OFFICE_SHORT_NAME: e.item.OPERATION_OFFICE_SHORT_NAME || "",
      MANAGEMENT_POS_CODE: e.item.MANAGEMENT_POS_CODE || "",
      MANAGEMENT_POS_NAME: e.item.MANAGEMENT_POS_NAME || "",
      MANAGEMENT_POS_LEVEL: e.item.MANAGEMENT_POS_LEVEL || "",
      MANAGEMENT_POS_LEVEL_NAME: e.item.MANAGEMENT_POS_LEVEL_NAME || "",
      MANAGEMENT_DEPT_CODE: e.item.MANAGEMENT_DEPT_CODE || "",
      MANAGEMENT_DEPT_NAME: e.item.MANAGEMENT_DEPT_NAME || "",
      MANAGEMENT_DEPT_LEVEL: e.item.MANAGEMENT_DEPT_LEVEL || "",
      MANAGEMENT_UNDER_DEPT_CODE: e.item.MANAGEMENT_UNDER_DEPT_CODE || "",
      MANAGEMENT_UNDER_DEPT_NAME: e.item.MANAGEMENT_UNDER_DEPT_NAME || "",
      MANAGEMENT_UNDER_DEPT_LEVEL: e.item.MANAGEMENT_UNDER_DEPT_LEVEL || "",
      MANAGEMENT_WORK_DEPT_CODE: e.item.MANAGEMENT_WORK_DEPT_CODE || "",
      MANAGEMENT_WORK_DEPT_NAME: e.item.MANAGEMENT_WORK_DEPT_NAME || "",
      MANAGEMENT_WORK_DEPT_LEVEL: e.item.MANAGEMENT_WORK_DEPT_LEVEL || "",
      MANAGEMENT_OFFICE_CODE: e.item.MANAGEMENT_OFFICE_CODE || "",
      MANAGEMENT_OFFICE_NAME: e.item.MANAGEMENT_OFFICE_NAME || "",
      MANAGEMENT_OFFICE_SHORT_NAME: e.item.MANAGEMENT_OFFICE_SHORT_NAME || "",
      REPRESENT_POS_CODE: e.item.REPRESENT_POS_CODE || "",
      REPRESENT_POS_NAME: e.item.REPRESENT_POS_NAME || "",
      REPRESENT_POS_LEVEL: e.item.REPRESENT_POS_LEVEL || "",
      REPRESENT_POS_LEVEL_NAME: e.item.REPRESENT_POS_LEVEL_NAME || "",
      REPRESENT_DEPT_CODE: e.item.REPRESENT_DEPT_CODE || "",
      REPRESENT_DEPT_NAME: e.item.REPRESENT_DEPT_NAME || "",
      REPRESENT_DEPT_LEVEL: e.item.REPRESENT_DEPT_LEVEL || "",
      REPRESENT_UNDER_DEPT_CODE: e.item.REPRESENT_UNDER_DEPT_CODE || "",
      REPRESENT_UNDER_DEPT_NAME: e.item.REPRESENT_UNDER_DEPT_NAME || "",
      REPRESENT_UNDER_DEPT_LEVEL: e.item.REPRESENT_UNDER_DEPT_LEVEL || "",
      REPRESENT_WORK_DEPT_CODE: e.item.REPRESENT_WORK_DEPT_CODE || "",
      REPRESENT_WORK_DEPT_NAME: e.item.REPRESENT_WORK_DEPT_NAME || "",
      REPRESENT_WORK_DEPT_LEVEL: e.item.REPRESENT_WORK_DEPT_LEVEL || "",
      REPRESENT_OFFICE_CODE: e.item.REPRESENT_OFFICE_CODE || "",
      REPRESENT_OFFICE_NAME: e.item.REPRESENT_OFFICE_NAME || "",
      REPRESENT_OFFICE_SHORT_NAME: e.item.REPRESENT_OFFICE_SHORT_NAME || "",
      STATUS: e.item.STATUS || "",
      REMARK: "ผู้มีอำนาจอนุมัติคำร้องขอรับเงินรางวัลใน รว.4",
      FIRST_PART: e.item.FIRST_PART || "",
      FIRST_MONEY: e.item.FIRST_MONEY || "",
      SECOND_PART: e.item.SECOND_PART || "",
      SECOND_MONEY: e.item.SECOND_MONEY || "",
      TOTAL_MONEY: e.item.TOTAL_MONEY || "",
      CONTRIBUTOR_ID: 43,
      IS_ACTIVE: 1,
      SEQ: e.item.SEQ || "",
    });
  }

  deleteContri43(i) {
    this.ControlStaffREWARD.at(0).patchValue({
      FULL_NAME: "",
      STAFF_ID: "",
      REWARD_ID: "",
      STAFF_REF_ID: "",
      TITLE_ID: "",
      STAFF_CODE: "",
      ID_CARD: "",
      STAFF_TYPE: "",
      TITLE_NAME_TH: "",
      TITLE_NAME_EN: "",
      TITLE_SHORT_NAME_TH: "",
      TITLE_SHORT_NAME_EN: "",
      FIRST_NAME: "",
      LAST_NAME: "",
      AGE: "",
      OPERATION_POS_CODE: "",
      OPREATION_POS_NAME: "",
      OPREATION_POS_LEVEL: "",
      OPERATION_POS_LEVEL_NAME: "",
      OPERATION_DEPT_CODE: "",
      OPERATION_DEPT_NAME: "",
      OPERATION_DEPT_LEVEL: "",
      OPERATION_UNDER_DEPT_CODE: "",
      OPERATION_UNDER_DEPT_NAME: "",
      OPERATION_UNDER_DEPT_LEVEL: "",
      OPERATION_WORK_DEPT_CODE: "",
      OPERATION_WORK_DEPT_NAME: "",
      OPERATION_WORK_DEPT_LEVEL: "",
      OPERATION_OFFICE_CODE: "",
      OPERATION_OFFICE_NAME: "",
      OPERATION_OFFICE_SHORT_NAME: "",
      MANAGEMENT_POS_CODE: "",
      MANAGEMENT_POS_NAME: "",
      MANAGEMENT_POS_LEVEL: "",
      MANAGEMENT_POS_LEVEL_NAME: "",
      MANAGEMENT_DEPT_CODE: "",
      MANAGEMENT_DEPT_NAME: "",
      MANAGEMENT_DEPT_LEVEL: "",
      MANAGEMENT_UNDER_DEPT_CODE: "",
      MANAGEMENT_UNDER_DEPT_NAME: "",
      MANAGEMENT_UNDER_DEPT_LEVEL: "",
      MANAGEMENT_WORK_DEPT_CODE: "",
      MANAGEMENT_WORK_DEPT_NAME: "",
      MANAGEMENT_WORK_DEPT_LEVEL: "",
      MANAGEMENT_OFFICE_CODE: "",
      MANAGEMENT_OFFICE_NAME: "",
      MANAGEMENT_OFFICE_SHORT_NAME: "",
      REPRESENT_POS_CODE: "",
      REPRESENT_POS_NAME: "",
      REPRESENT_POS_LEVEL: "",
      REPRESENT_POS_LEVEL_NAME: "",
      REPRESENT_DEPT_CODE: "",
      REPRESENT_DEPT_NAME: "",
      REPRESENT_DEPT_LEVEL: "",
      REPRESENT_UNDER_DEPT_CODE: "",
      REPRESENT_UNDER_DEPT_NAME: "",
      REPRESENT_UNDER_DEPT_LEVEL: "",
      REPRESENT_WORK_DEPT_CODE: "",
      REPRESENT_WORK_DEPT_NAME: "",
      REPRESENT_WORK_DEPT_LEVEL: "",
      REPRESENT_OFFICE_CODE: "",
      REPRESENT_OFFICE_NAME: "",
      REPRESENT_OFFICE_SHORT_NAME: "",
      STATUS: "",
      REMARK: "",
      FIRST_PART: "",
      FIRST_MONEY: "",
      SECOND_PART: "",
      SECOND_MONEY: "",
      TOTAL_MONEY: "",
      CONTRIBUTOR_ID: 43,
      IS_ACTIVE: 0,
      SEQ: "",
    });
  }

  selectItemStaff44(e, i) {
    this.ControlStaffREWARD.at(1).patchValue({
      FULL_NAME: `${e.item.TITLE_SHORT_NAME_TH || " "}${
        e.item.FIRST_NAME || ""
      } ${e.item.LAST_NAME || ""}`,
      STAFF_ID: e.item.STAFF_ID || "",
      REWARD_ID: e.item.REWARD_ID || "",
      STAFF_REF_ID: e.item.STAFF_REF_ID || "",
      TITLE_ID: e.item.TITLE_ID || "",
      STAFF_CODE: e.item.STAFF_CODE || "",
      ID_CARD: e.item.ID_CARD || "",
      STAFF_TYPE: e.item.STAFF_TYPE || "",
      TITLE_NAME_TH: e.item.TITLE_NAME_TH || "",
      TITLE_NAME_EN: e.item.TITLE_NAME_EN || "",
      TITLE_SHORT_NAME_TH: e.item.TITLE_SHORT_NAME_TH || "",
      TITLE_SHORT_NAME_EN: e.item.TITLE_SHORT_NAME_EN || "",
      FIRST_NAME: e.item.FIRST_NAME || "",
      LAST_NAME: e.item.LAST_NAME || "",
      AGE: e.item.AGE || "",
      OPERATION_POS_CODE: e.item.OPERATION_POS_CODE || "",
      OPREATION_POS_NAME: e.item.OPREATION_POS_NAME || "",
      OPREATION_POS_LEVEL: e.item.OPREATION_POS_LEVEL || "",
      OPERATION_POS_LEVEL_NAME: e.item.OPERATION_POS_LEVEL_NAME || "",
      OPERATION_DEPT_CODE: e.item.OPERATION_DEPT_CODE || "",
      OPERATION_DEPT_NAME: e.item.OPERATION_DEPT_NAME || "",
      OPERATION_DEPT_LEVEL: e.item.OPERATION_DEPT_LEVEL || "",
      OPERATION_UNDER_DEPT_CODE: e.item.OPERATION_UNDER_DEPT_CODE || "",
      OPERATION_UNDER_DEPT_NAME: e.item.OPERATION_UNDER_DEPT_NAME || "",
      OPERATION_UNDER_DEPT_LEVEL: e.item.OPERATION_UNDER_DEPT_LEVEL || "",
      OPERATION_WORK_DEPT_CODE: e.item.OPERATION_WORK_DEPT_CODE || "",
      OPERATION_WORK_DEPT_NAME: e.item.OPERATION_WORK_DEPT_NAME || "",
      OPERATION_WORK_DEPT_LEVEL: e.item.OPERATION_WORK_DEPT_LEVEL || "",
      OPERATION_OFFICE_CODE: e.item.OPERATION_OFFICE_CODE || "",
      OPERATION_OFFICE_NAME: e.item.OPERATION_OFFICE_NAME || "",
      OPERATION_OFFICE_SHORT_NAME: e.item.OPERATION_OFFICE_SHORT_NAME || "",
      MANAGEMENT_POS_CODE: e.item.MANAGEMENT_POS_CODE || "",
      MANAGEMENT_POS_NAME: e.item.MANAGEMENT_POS_NAME || "",
      MANAGEMENT_POS_LEVEL: e.item.MANAGEMENT_POS_LEVEL || "",
      MANAGEMENT_POS_LEVEL_NAME: e.item.MANAGEMENT_POS_LEVEL_NAME || "",
      MANAGEMENT_DEPT_CODE: e.item.MANAGEMENT_DEPT_CODE || "",
      MANAGEMENT_DEPT_NAME: e.item.MANAGEMENT_DEPT_NAME || "",
      MANAGEMENT_DEPT_LEVEL: e.item.MANAGEMENT_DEPT_LEVEL || "",
      MANAGEMENT_UNDER_DEPT_CODE: e.item.MANAGEMENT_UNDER_DEPT_CODE || "",
      MANAGEMENT_UNDER_DEPT_NAME: e.item.MANAGEMENT_UNDER_DEPT_NAME || "",
      MANAGEMENT_UNDER_DEPT_LEVEL: e.item.MANAGEMENT_UNDER_DEPT_LEVEL || "",
      MANAGEMENT_WORK_DEPT_CODE: e.item.MANAGEMENT_WORK_DEPT_CODE || "",
      MANAGEMENT_WORK_DEPT_NAME: e.item.MANAGEMENT_WORK_DEPT_NAME || "",
      MANAGEMENT_WORK_DEPT_LEVEL: e.item.MANAGEMENT_WORK_DEPT_LEVEL || "",
      MANAGEMENT_OFFICE_CODE: e.item.MANAGEMENT_OFFICE_CODE || "",
      MANAGEMENT_OFFICE_NAME: e.item.MANAGEMENT_OFFICE_NAME || "",
      MANAGEMENT_OFFICE_SHORT_NAME: e.item.MANAGEMENT_OFFICE_SHORT_NAME || "",
      REPRESENT_POS_CODE: e.item.REPRESENT_POS_CODE || "",
      REPRESENT_POS_NAME: e.item.REPRESENT_POS_NAME || "",
      REPRESENT_POS_LEVEL: e.item.REPRESENT_POS_LEVEL || "",
      REPRESENT_POS_LEVEL_NAME: e.item.REPRESENT_POS_LEVEL_NAME || "",
      REPRESENT_DEPT_CODE: e.item.REPRESENT_DEPT_CODE || "",
      REPRESENT_DEPT_NAME: e.item.REPRESENT_DEPT_NAME || "",
      REPRESENT_DEPT_LEVEL: e.item.REPRESENT_DEPT_LEVEL || "",
      REPRESENT_UNDER_DEPT_CODE: e.item.REPRESENT_UNDER_DEPT_CODE || "",
      REPRESENT_UNDER_DEPT_NAME: e.item.REPRESENT_UNDER_DEPT_NAME || "",
      REPRESENT_UNDER_DEPT_LEVEL: e.item.REPRESENT_UNDER_DEPT_LEVEL || "",
      REPRESENT_WORK_DEPT_CODE: e.item.REPRESENT_WORK_DEPT_CODE || "",
      REPRESENT_WORK_DEPT_NAME: e.item.REPRESENT_WORK_DEPT_NAME || "",
      REPRESENT_WORK_DEPT_LEVEL: e.item.REPRESENT_WORK_DEPT_LEVEL || "",
      REPRESENT_OFFICE_CODE: e.item.REPRESENT_OFFICE_CODE || "",
      REPRESENT_OFFICE_NAME: e.item.REPRESENT_OFFICE_NAME || "",
      REPRESENT_OFFICE_SHORT_NAME: e.item.REPRESENT_OFFICE_SHORT_NAME || "",
      STATUS: e.item.STATUS || "",
      REMARK: "ผู้บังคับบัญชาใน รว.7",
      FIRST_PART: e.item.FIRST_PART || "",
      FIRST_MONEY: e.item.FIRST_MONEY || "",
      SECOND_PART: e.item.SECOND_PART || "",
      SECOND_MONEY: e.item.SECOND_MONEY || "",
      TOTAL_MONEY: e.item.TOTAL_MONEY || "",
      CONTRIBUTOR_ID: 44,
      IS_ACTIVE: 1,
      SEQ: e.item.SEQ || "",
    });
  }

  deleteContri44(i) {
    this.ControlStaffREWARD.at(1).patchValue({
      FULL_NAME: "",
      STAFF_ID: "",
      REWARD_ID: "",
      STAFF_REF_ID: "",
      TITLE_ID: "",
      STAFF_CODE: "",
      ID_CARD: "",
      STAFF_TYPE: "",
      TITLE_NAME_TH: "",
      TITLE_NAME_EN: "",
      TITLE_SHORT_NAME_TH: "",
      TITLE_SHORT_NAME_EN: "",
      FIRST_NAME: "",
      LAST_NAME: "",
      AGE: "",
      OPERATION_POS_CODE: "",
      OPREATION_POS_NAME: "",
      OPREATION_POS_LEVEL: "",
      OPERATION_POS_LEVEL_NAME: "",
      OPERATION_DEPT_CODE: "",
      OPERATION_DEPT_NAME: "",
      OPERATION_DEPT_LEVEL: "",
      OPERATION_UNDER_DEPT_CODE: "",
      OPERATION_UNDER_DEPT_NAME: "",
      OPERATION_UNDER_DEPT_LEVEL: "",
      OPERATION_WORK_DEPT_CODE: "",
      OPERATION_WORK_DEPT_NAME: "",
      OPERATION_WORK_DEPT_LEVEL: "",
      OPERATION_OFFICE_CODE: "",
      OPERATION_OFFICE_NAME: "",
      OPERATION_OFFICE_SHORT_NAME: "",
      MANAGEMENT_POS_CODE: "",
      MANAGEMENT_POS_NAME: "",
      MANAGEMENT_POS_LEVEL: "",
      MANAGEMENT_POS_LEVEL_NAME: "",
      MANAGEMENT_DEPT_CODE: "",
      MANAGEMENT_DEPT_NAME: "",
      MANAGEMENT_DEPT_LEVEL: "",
      MANAGEMENT_UNDER_DEPT_CODE: "",
      MANAGEMENT_UNDER_DEPT_NAME: "",
      MANAGEMENT_UNDER_DEPT_LEVEL: "",
      MANAGEMENT_WORK_DEPT_CODE: "",
      MANAGEMENT_WORK_DEPT_NAME: "",
      MANAGEMENT_WORK_DEPT_LEVEL: "",
      MANAGEMENT_OFFICE_CODE: "",
      MANAGEMENT_OFFICE_NAME: "",
      MANAGEMENT_OFFICE_SHORT_NAME: "",
      REPRESENT_POS_CODE: "",
      REPRESENT_POS_NAME: "",
      REPRESENT_POS_LEVEL: "",
      REPRESENT_POS_LEVEL_NAME: "",
      REPRESENT_DEPT_CODE: "",
      REPRESENT_DEPT_NAME: "",
      REPRESENT_DEPT_LEVEL: "",
      REPRESENT_UNDER_DEPT_CODE: "",
      REPRESENT_UNDER_DEPT_NAME: "",
      REPRESENT_UNDER_DEPT_LEVEL: "",
      REPRESENT_WORK_DEPT_CODE: "",
      REPRESENT_WORK_DEPT_NAME: "",
      REPRESENT_WORK_DEPT_LEVEL: "",
      REPRESENT_OFFICE_CODE: "",
      REPRESENT_OFFICE_NAME: "",
      REPRESENT_OFFICE_SHORT_NAME: "",
      STATUS: "",
      REMARK: "",
      FIRST_PART: "",
      FIRST_MONEY: "",
      SECOND_PART: "",
      SECOND_MONEY: "",
      TOTAL_MONEY: "",
      CONTRIBUTOR_ID: 44,
      IS_ACTIVE: 0,
      SEQ: "",
    });
  }

  selectItemStaff45(e, i) {
    this.ControlStaffREWARD.at(2).patchValue({
      FULL_NAME: `${e.item.TITLE_SHORT_NAME_TH || " "}${
        e.item.FIRST_NAME || ""
      } ${e.item.LAST_NAME || ""}`,
      STAFF_ID: e.item.STAFF_ID || "",
      REWARD_ID: e.item.REWARD_ID || "",
      STAFF_REF_ID: e.item.STAFF_REF_ID || "",
      TITLE_ID: e.item.TITLE_ID || "",
      STAFF_CODE: e.item.STAFF_CODE || "",
      ID_CARD: e.item.ID_CARD || "",
      STAFF_TYPE: e.item.STAFF_TYPE || "",
      TITLE_NAME_TH: e.item.TITLE_NAME_TH || "",
      TITLE_NAME_EN: e.item.TITLE_NAME_EN || "",
      TITLE_SHORT_NAME_TH: e.item.TITLE_SHORT_NAME_TH || "",
      TITLE_SHORT_NAME_EN: e.item.TITLE_SHORT_NAME_EN || "",
      FIRST_NAME: e.item.FIRST_NAME || "",
      LAST_NAME: e.item.LAST_NAME || "",
      AGE: e.item.AGE || "",
      OPERATION_POS_CODE: e.item.OPERATION_POS_CODE || "",
      OPREATION_POS_NAME: e.item.OPREATION_POS_NAME || "",
      OPREATION_POS_LEVEL: e.item.OPREATION_POS_LEVEL || "",
      OPERATION_POS_LEVEL_NAME: e.item.OPERATION_POS_LEVEL_NAME || "",
      OPERATION_DEPT_CODE: e.item.OPERATION_DEPT_CODE || "",
      OPERATION_DEPT_NAME: e.item.OPERATION_DEPT_NAME || "",
      OPERATION_DEPT_LEVEL: e.item.OPERATION_DEPT_LEVEL || "",
      OPERATION_UNDER_DEPT_CODE: e.item.OPERATION_UNDER_DEPT_CODE || "",
      OPERATION_UNDER_DEPT_NAME: e.item.OPERATION_UNDER_DEPT_NAME || "",
      OPERATION_UNDER_DEPT_LEVEL: e.item.OPERATION_UNDER_DEPT_LEVEL || "",
      OPERATION_WORK_DEPT_CODE: e.item.OPERATION_WORK_DEPT_CODE || "",
      OPERATION_WORK_DEPT_NAME: e.item.OPERATION_WORK_DEPT_NAME || "",
      OPERATION_WORK_DEPT_LEVEL: e.item.OPERATION_WORK_DEPT_LEVEL || "",
      OPERATION_OFFICE_CODE: e.item.OPERATION_OFFICE_CODE || "",
      OPERATION_OFFICE_NAME: e.item.OPERATION_OFFICE_NAME || "",
      OPERATION_OFFICE_SHORT_NAME: e.item.OPERATION_OFFICE_SHORT_NAME || "",
      MANAGEMENT_POS_CODE: e.item.MANAGEMENT_POS_CODE || "",
      MANAGEMENT_POS_NAME: e.item.MANAGEMENT_POS_NAME || "",
      MANAGEMENT_POS_LEVEL: e.item.MANAGEMENT_POS_LEVEL || "",
      MANAGEMENT_POS_LEVEL_NAME: e.item.MANAGEMENT_POS_LEVEL_NAME || "",
      MANAGEMENT_DEPT_CODE: e.item.MANAGEMENT_DEPT_CODE || "",
      MANAGEMENT_DEPT_NAME: e.item.MANAGEMENT_DEPT_NAME || "",
      MANAGEMENT_DEPT_LEVEL: e.item.MANAGEMENT_DEPT_LEVEL || "",
      MANAGEMENT_UNDER_DEPT_CODE: e.item.MANAGEMENT_UNDER_DEPT_CODE || "",
      MANAGEMENT_UNDER_DEPT_NAME: e.item.MANAGEMENT_UNDER_DEPT_NAME || "",
      MANAGEMENT_UNDER_DEPT_LEVEL: e.item.MANAGEMENT_UNDER_DEPT_LEVEL || "",
      MANAGEMENT_WORK_DEPT_CODE: e.item.MANAGEMENT_WORK_DEPT_CODE || "",
      MANAGEMENT_WORK_DEPT_NAME: e.item.MANAGEMENT_WORK_DEPT_NAME || "",
      MANAGEMENT_WORK_DEPT_LEVEL: e.item.MANAGEMENT_WORK_DEPT_LEVEL || "",
      MANAGEMENT_OFFICE_CODE: e.item.MANAGEMENT_OFFICE_CODE || "",
      MANAGEMENT_OFFICE_NAME: e.item.MANAGEMENT_OFFICE_NAME || "",
      MANAGEMENT_OFFICE_SHORT_NAME: e.item.MANAGEMENT_OFFICE_SHORT_NAME || "",
      REPRESENT_POS_CODE: e.item.REPRESENT_POS_CODE || "",
      REPRESENT_POS_NAME: e.item.REPRESENT_POS_NAME || "",
      REPRESENT_POS_LEVEL: e.item.REPRESENT_POS_LEVEL || "",
      REPRESENT_POS_LEVEL_NAME: e.item.REPRESENT_POS_LEVEL_NAME || "",
      REPRESENT_DEPT_CODE: e.item.REPRESENT_DEPT_CODE || "",
      REPRESENT_DEPT_NAME: e.item.REPRESENT_DEPT_NAME || "",
      REPRESENT_DEPT_LEVEL: e.item.REPRESENT_DEPT_LEVEL || "",
      REPRESENT_UNDER_DEPT_CODE: e.item.REPRESENT_UNDER_DEPT_CODE || "",
      REPRESENT_UNDER_DEPT_NAME: e.item.REPRESENT_UNDER_DEPT_NAME || "",
      REPRESENT_UNDER_DEPT_LEVEL: e.item.REPRESENT_UNDER_DEPT_LEVEL || "",
      REPRESENT_WORK_DEPT_CODE: e.item.REPRESENT_WORK_DEPT_CODE || "",
      REPRESENT_WORK_DEPT_NAME: e.item.REPRESENT_WORK_DEPT_NAME || "",
      REPRESENT_WORK_DEPT_LEVEL: e.item.REPRESENT_WORK_DEPT_LEVEL || "",
      REPRESENT_OFFICE_CODE: e.item.REPRESENT_OFFICE_CODE || "",
      REPRESENT_OFFICE_NAME: e.item.REPRESENT_OFFICE_NAME || "",
      REPRESENT_OFFICE_SHORT_NAME: e.item.REPRESENT_OFFICE_SHORT_NAME || "",
      STATUS: e.item.STATUS || "",
      REMARK: "ผู้จ่ายเงิน",
      FIRST_PART: e.item.FIRST_PART || "",
      FIRST_MONEY: e.item.FIRST_MONEY || "",
      SECOND_PART: e.item.SECOND_PART || "",
      SECOND_MONEY: e.item.SECOND_MONEY || "",
      TOTAL_MONEY: e.item.TOTAL_MONEY || "",
      CONTRIBUTOR_ID: 45,
      IS_ACTIVE: 1,
      SEQ: e.item.SEQ || "",
    });
  }

  deleteContri45(i) {
    this.ControlStaffREWARD.at(2).patchValue({
      FULL_NAME: "",
      STAFF_ID: "",
      REWARD_ID: "",
      STAFF_REF_ID: "",
      TITLE_ID: "",
      STAFF_CODE: "",
      ID_CARD: "",
      STAFF_TYPE: "",
      TITLE_NAME_TH: "",
      TITLE_NAME_EN: "",
      TITLE_SHORT_NAME_TH: "",
      TITLE_SHORT_NAME_EN: "",
      FIRST_NAME: "",
      LAST_NAME: "",
      AGE: "",
      OPERATION_POS_CODE: "",
      OPREATION_POS_NAME: "",
      OPREATION_POS_LEVEL: "",
      OPERATION_POS_LEVEL_NAME: "",
      OPERATION_DEPT_CODE: "",
      OPERATION_DEPT_NAME: "",
      OPERATION_DEPT_LEVEL: "",
      OPERATION_UNDER_DEPT_CODE: "",
      OPERATION_UNDER_DEPT_NAME: "",
      OPERATION_UNDER_DEPT_LEVEL: "",
      OPERATION_WORK_DEPT_CODE: "",
      OPERATION_WORK_DEPT_NAME: "",
      OPERATION_WORK_DEPT_LEVEL: "",
      OPERATION_OFFICE_CODE: "",
      OPERATION_OFFICE_NAME: "",
      OPERATION_OFFICE_SHORT_NAME: "",
      MANAGEMENT_POS_CODE: "",
      MANAGEMENT_POS_NAME: "",
      MANAGEMENT_POS_LEVEL: "",
      MANAGEMENT_POS_LEVEL_NAME: "",
      MANAGEMENT_DEPT_CODE: "",
      MANAGEMENT_DEPT_NAME: "",
      MANAGEMENT_DEPT_LEVEL: "",
      MANAGEMENT_UNDER_DEPT_CODE: "",
      MANAGEMENT_UNDER_DEPT_NAME: "",
      MANAGEMENT_UNDER_DEPT_LEVEL: "",
      MANAGEMENT_WORK_DEPT_CODE: "",
      MANAGEMENT_WORK_DEPT_NAME: "",
      MANAGEMENT_WORK_DEPT_LEVEL: "",
      MANAGEMENT_OFFICE_CODE: "",
      MANAGEMENT_OFFICE_NAME: "",
      MANAGEMENT_OFFICE_SHORT_NAME: "",
      REPRESENT_POS_CODE: "",
      REPRESENT_POS_NAME: "",
      REPRESENT_POS_LEVEL: "",
      REPRESENT_POS_LEVEL_NAME: "",
      REPRESENT_DEPT_CODE: "",
      REPRESENT_DEPT_NAME: "",
      REPRESENT_DEPT_LEVEL: "",
      REPRESENT_UNDER_DEPT_CODE: "",
      REPRESENT_UNDER_DEPT_NAME: "",
      REPRESENT_UNDER_DEPT_LEVEL: "",
      REPRESENT_WORK_DEPT_CODE: "",
      REPRESENT_WORK_DEPT_NAME: "",
      REPRESENT_WORK_DEPT_LEVEL: "",
      REPRESENT_OFFICE_CODE: "",
      REPRESENT_OFFICE_NAME: "",
      REPRESENT_OFFICE_SHORT_NAME: "",
      STATUS: "",
      REMARK: "",
      FIRST_PART: "",
      FIRST_MONEY: "",
      SECOND_PART: "",
      SECOND_MONEY: "",
      TOTAL_MONEY: "",
      CONTRIBUTOR_ID: 45,
      IS_ACTIVE: 0,
      SEQ: "",
    });
  }

  deleteStaff(i) {}

  private set_CONTRIBUTOR_ID38(): FormGroup {
    //ผู้มีอำนาจอนุมัติคำร้องขอรับเงินสินบน
    const SetFormControl = {
      FULL_NAME: new FormControl(""),
      STAFF_ID: new FormControl(""),
      BRIBE_ID: new FormControl(""),
      STAFF_REF_ID: new FormControl(""),
      TITLE_ID: new FormControl(""),
      STAFF_CODE: new FormControl(""),
      ID_CARD: new FormControl(""),
      STAFF_TYPE: new FormControl(""),
      TITLE_NAME_TH: new FormControl(""),
      TITLE_NAME_EN: new FormControl(""),
      TITLE_SHORT_NAME_TH: new FormControl(""),
      TITLE_SHORT_NAME_EN: new FormControl(""),
      FIRST_NAME: new FormControl(""),
      LAST_NAME: new FormControl(""),
      AGE: new FormControl(""),
      OPERATION_POS_CODE: new FormControl(""),
      OPREATION_POS_NAME: new FormControl(""),
      OPREATION_POS_LEVEL: new FormControl(""),
      OPERATION_POS_LEVEL_NAME: new FormControl(""),
      OPERATION_DEPT_CODE: new FormControl(""),
      OPERATION_DEPT_NAME: new FormControl(""),
      OPERATION_DEPT_LEVEL: new FormControl(""),
      OPERATION_UNDER_DEPT_CODE: new FormControl(""),
      OPERATION_UNDER_DEPT_NAME: new FormControl(""),
      OPERATION_UNDER_DEPT_LEVEL: new FormControl(""),
      OPERATION_WORK_DEPT_CODE: new FormControl(""),
      OPERATION_WORK_DEPT_NAME: new FormControl(""),
      OPERATION_WORK_DEPT_LEVEL: new FormControl(""),
      OPERATION_OFFICE_CODE: new FormControl(""),
      OPERATION_OFFICE_NAME: new FormControl(""),
      OPERATION_OFFICE_SHORT_NAME: new FormControl(""),
      MANAGEMENT_POS_CODE: new FormControl(""),
      MANAGEMENT_POS_NAME: new FormControl(""),
      MANAGEMENT_POS_LEVEL: new FormControl(""),
      MANAGEMENT_POS_LEVEL_NAME: new FormControl(""),
      MANAGEMENT_DEPT_CODE: new FormControl(""),
      MANAGEMENT_DEPT_NAME: new FormControl(""),
      MANAGEMENT_DEPT_LEVEL: new FormControl(""),
      MANAGEMENT_UNDER_DEPT_CODE: new FormControl(""),
      MANAGEMENT_UNDER_DEPT_NAME: new FormControl(""),
      MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(""),
      MANAGEMENT_WORK_DEPT_CODE: new FormControl(""),
      MANAGEMENT_WORK_DEPT_NAME: new FormControl(""),
      MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(""),
      MANAGEMENT_OFFICE_CODE: new FormControl(""),
      MANAGEMENT_OFFICE_NAME: new FormControl(""),
      MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(""),
      REPRESENT_POS_CODE: new FormControl(""),
      REPRESENT_POS_NAME: new FormControl(""),
      REPRESENT_POS_LEVEL: new FormControl(""),
      REPRESENT_POS_LEVEL_NAME: new FormControl(""),
      REPRESENT_DEPT_CODE: new FormControl(""),
      REPRESENT_DEPT_NAME: new FormControl(""),
      REPRESENT_DEPT_LEVEL: new FormControl(""),
      REPRESENT_UNDER_DEPT_CODE: new FormControl(""),
      REPRESENT_UNDER_DEPT_NAME: new FormControl(""),
      REPRESENT_UNDER_DEPT_LEVEL: new FormControl(""),
      REPRESENT_WORK_DEPT_CODE: new FormControl(""),
      REPRESENT_WORK_DEPT_NAME: new FormControl(""),
      REPRESENT_WORK_DEPT_LEVEL: new FormControl(""),
      REPRESENT_OFFICE_CODE: new FormControl(""),
      REPRESENT_OFFICE_NAME: new FormControl(""),
      REPRESENT_OFFICE_SHORT_NAME: new FormControl(""),
      STATUS: new FormControl(""),
      REMARK: new FormControl(""),
      CONTRIBUTOR_ID: new FormControl(38),
      IS_ACTIVE: new FormControl(0),
    };
    return this.fb.group(SetFormControl);
  }

  private set_CONTRIBUTOR_ID43(): FormGroup {
    //ผู้มีอำนาจอนุมัติคำร้องขอรับเงินรางวัลใน รว.4 หรือ รว.5
    const SetFormControl = {
      FULL_NAME: new FormControl(""),
      STAFF_ID: new FormControl(""),
      REWARD_ID: new FormControl(""),
      STAFF_REF_ID: new FormControl(""),
      TITLE_ID: new FormControl(""),
      STAFF_CODE: new FormControl(""),
      ID_CARD: new FormControl(""),
      STAFF_TYPE: new FormControl(""),
      TITLE_NAME_TH: new FormControl(""),
      TITLE_NAME_EN: new FormControl(""),
      TITLE_SHORT_NAME_TH: new FormControl(""),
      TITLE_SHORT_NAME_EN: new FormControl(""),
      FIRST_NAME: new FormControl(""),
      LAST_NAME: new FormControl(""),
      AGE: new FormControl(""),
      OPERATION_POS_CODE: new FormControl(""),
      OPREATION_POS_NAME: new FormControl(""),
      OPREATION_POS_LEVEL: new FormControl(""),
      OPERATION_POS_LEVEL_NAME: new FormControl(""),
      OPERATION_DEPT_CODE: new FormControl(""),
      OPERATION_DEPT_NAME: new FormControl(""),
      OPERATION_DEPT_LEVEL: new FormControl(""),
      OPERATION_UNDER_DEPT_CODE: new FormControl(""),
      OPERATION_UNDER_DEPT_NAME: new FormControl(""),
      OPERATION_UNDER_DEPT_LEVEL: new FormControl(""),
      OPERATION_WORK_DEPT_CODE: new FormControl(""),
      OPERATION_WORK_DEPT_NAME: new FormControl(""),
      OPERATION_WORK_DEPT_LEVEL: new FormControl(""),
      OPERATION_OFFICE_CODE: new FormControl(""),
      OPERATION_OFFICE_NAME: new FormControl(""),
      OPERATION_OFFICE_SHORT_NAME: new FormControl(""),
      MANAGEMENT_POS_CODE: new FormControl(""),
      MANAGEMENT_POS_NAME: new FormControl(""),
      MANAGEMENT_POS_LEVEL: new FormControl(""),
      MANAGEMENT_POS_LEVEL_NAME: new FormControl(""),
      MANAGEMENT_DEPT_CODE: new FormControl(""),
      MANAGEMENT_DEPT_NAME: new FormControl(""),
      MANAGEMENT_DEPT_LEVEL: new FormControl(""),
      MANAGEMENT_UNDER_DEPT_CODE: new FormControl(""),
      MANAGEMENT_UNDER_DEPT_NAME: new FormControl(""),
      MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(""),
      MANAGEMENT_WORK_DEPT_CODE: new FormControl(""),
      MANAGEMENT_WORK_DEPT_NAME: new FormControl(""),
      MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(""),
      MANAGEMENT_OFFICE_CODE: new FormControl(""),
      MANAGEMENT_OFFICE_NAME: new FormControl(""),
      MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(""),
      REPRESENT_POS_CODE: new FormControl(""),
      REPRESENT_POS_NAME: new FormControl(""),
      REPRESENT_POS_LEVEL: new FormControl(""),
      REPRESENT_POS_LEVEL_NAME: new FormControl(""),
      REPRESENT_DEPT_CODE: new FormControl(""),
      REPRESENT_DEPT_NAME: new FormControl(""),
      REPRESENT_DEPT_LEVEL: new FormControl(""),
      REPRESENT_UNDER_DEPT_CODE: new FormControl(""),
      REPRESENT_UNDER_DEPT_NAME: new FormControl(""),
      REPRESENT_UNDER_DEPT_LEVEL: new FormControl(""),
      REPRESENT_WORK_DEPT_CODE: new FormControl(""),
      REPRESENT_WORK_DEPT_NAME: new FormControl(""),
      REPRESENT_WORK_DEPT_LEVEL: new FormControl(""),
      REPRESENT_OFFICE_CODE: new FormControl(""),
      REPRESENT_OFFICE_NAME: new FormControl(""),
      REPRESENT_OFFICE_SHORT_NAME: new FormControl(""),
      STATUS: new FormControl(""),
      REMARK: new FormControl(""),
      FIRST_PART: new FormControl(""),
      FIRST_MONEY: new FormControl(""),
      SECOND_PART: new FormControl(""),
      SECOND_MONEY: new FormControl(""),
      TOTAL_MONEY: new FormControl(""),
      CONTRIBUTOR_ID: new FormControl(43),
      IS_ACTIVE: new FormControl(0),
      SEQ: new FormControl(""),
    };
    return this.fb.group(SetFormControl);
  }

  private set_CONTRIBUTOR_ID44(): FormGroup {
    //ผู้บังคับบัญชาใน รว.7
    const SetFormControl = {
      FULL_NAME: new FormControl(""),
      STAFF_ID: new FormControl(""),
      REWARD_ID: new FormControl(""),
      STAFF_REF_ID: new FormControl(""),
      TITLE_ID: new FormControl(""),
      STAFF_CODE: new FormControl(""),
      ID_CARD: new FormControl(""),
      STAFF_TYPE: new FormControl(""),
      TITLE_NAME_TH: new FormControl(""),
      TITLE_NAME_EN: new FormControl(""),
      TITLE_SHORT_NAME_TH: new FormControl(""),
      TITLE_SHORT_NAME_EN: new FormControl(""),
      FIRST_NAME: new FormControl(""),
      LAST_NAME: new FormControl(""),
      AGE: new FormControl(""),
      OPERATION_POS_CODE: new FormControl(""),
      OPREATION_POS_NAME: new FormControl(""),
      OPREATION_POS_LEVEL: new FormControl(""),
      OPERATION_POS_LEVEL_NAME: new FormControl(""),
      OPERATION_DEPT_CODE: new FormControl(""),
      OPERATION_DEPT_NAME: new FormControl(""),
      OPERATION_DEPT_LEVEL: new FormControl(""),
      OPERATION_UNDER_DEPT_CODE: new FormControl(""),
      OPERATION_UNDER_DEPT_NAME: new FormControl(""),
      OPERATION_UNDER_DEPT_LEVEL: new FormControl(""),
      OPERATION_WORK_DEPT_CODE: new FormControl(""),
      OPERATION_WORK_DEPT_NAME: new FormControl(""),
      OPERATION_WORK_DEPT_LEVEL: new FormControl(""),
      OPERATION_OFFICE_CODE: new FormControl(""),
      OPERATION_OFFICE_NAME: new FormControl(""),
      OPERATION_OFFICE_SHORT_NAME: new FormControl(""),
      MANAGEMENT_POS_CODE: new FormControl(""),
      MANAGEMENT_POS_NAME: new FormControl(""),
      MANAGEMENT_POS_LEVEL: new FormControl(""),
      MANAGEMENT_POS_LEVEL_NAME: new FormControl(""),
      MANAGEMENT_DEPT_CODE: new FormControl(""),
      MANAGEMENT_DEPT_NAME: new FormControl(""),
      MANAGEMENT_DEPT_LEVEL: new FormControl(""),
      MANAGEMENT_UNDER_DEPT_CODE: new FormControl(""),
      MANAGEMENT_UNDER_DEPT_NAME: new FormControl(""),
      MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(""),
      MANAGEMENT_WORK_DEPT_CODE: new FormControl(""),
      MANAGEMENT_WORK_DEPT_NAME: new FormControl(""),
      MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(""),
      MANAGEMENT_OFFICE_CODE: new FormControl(""),
      MANAGEMENT_OFFICE_NAME: new FormControl(""),
      MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(""),
      REPRESENT_POS_CODE: new FormControl(""),
      REPRESENT_POS_NAME: new FormControl(""),
      REPRESENT_POS_LEVEL: new FormControl(""),
      REPRESENT_POS_LEVEL_NAME: new FormControl(""),
      REPRESENT_DEPT_CODE: new FormControl(""),
      REPRESENT_DEPT_NAME: new FormControl(""),
      REPRESENT_DEPT_LEVEL: new FormControl(""),
      REPRESENT_UNDER_DEPT_CODE: new FormControl(""),
      REPRESENT_UNDER_DEPT_NAME: new FormControl(""),
      REPRESENT_UNDER_DEPT_LEVEL: new FormControl(""),
      REPRESENT_WORK_DEPT_CODE: new FormControl(""),
      REPRESENT_WORK_DEPT_NAME: new FormControl(""),
      REPRESENT_WORK_DEPT_LEVEL: new FormControl(""),
      REPRESENT_OFFICE_CODE: new FormControl(""),
      REPRESENT_OFFICE_NAME: new FormControl(""),
      REPRESENT_OFFICE_SHORT_NAME: new FormControl(""),
      STATUS: new FormControl(""),
      REMARK: new FormControl(""),
      FIRST_PART: new FormControl(""),
      FIRST_MONEY: new FormControl(""),
      SECOND_PART: new FormControl(""),
      SECOND_MONEY: new FormControl(""),
      TOTAL_MONEY: new FormControl(""),
      CONTRIBUTOR_ID: new FormControl(44),
      IS_ACTIVE: new FormControl(0),
      SEQ: new FormControl(""),
    };
    return this.fb.group(SetFormControl);
  }

  private set_CONTRIBUTOR_ID45(): FormGroup {
    //ผู้จ่ายเงิน
    const staff = JSON.parse(localStorage.getItem("staffInfo"));
    // console.log(staff);
    var title;
    if (staff.TITLE_SHORT_NAME_TH == "" || staff.TITLE_SHORT_NAME_TH == null) {
      title = staff.TITLE_NAME_TH;
    } else {
      title = staff.TITLE_SHORT_NAME_TH;
    }

    const SetFormControl = {
      FULL_NAME: new FormControl(
        title + staff.FIRST_NAME + " " + staff.LAST_NAME
      ),
      STAFF_ID: new FormControl(staff.STAFF_ID || ""),
      REWARD_ID: new FormControl(staff.REWARD_ID || ""),
      STAFF_REF_ID: new FormControl(staff.STAFF_REF_ID || ""),
      TITLE_ID: new FormControl(staff.TITLE_ID || ""),
      STAFF_CODE: new FormControl(staff.STAFF_CODE || ""),
      ID_CARD: new FormControl(staff.ID_CARD || ""),
      STAFF_TYPE: new FormControl(staff.STAFF_TYPE || ""),
      TITLE_NAME_TH: new FormControl(staff.TITLE_NAME_TH || ""),
      TITLE_NAME_EN: new FormControl(staff.TITLE_NAME_EN || ""),
      TITLE_SHORT_NAME_TH: new FormControl(staff.TITLE_SHORT_NAME_TH || ""),
      TITLE_SHORT_NAME_EN: new FormControl(staff.TITLE_SHORT_NAME_EN || ""),
      FIRST_NAME: new FormControl(staff.FIRST_NAME || ""),
      LAST_NAME: new FormControl(staff.LAST_NAME || ""),
      AGE: new FormControl(staff.AGE || ""),
      OPERATION_POS_CODE: new FormControl(staff.OPERATION_POS_CODE || ""),
      OPREATION_POS_NAME: new FormControl(staff.OPREATION_POS_NAME || ""),
      OPREATION_POS_LEVEL: new FormControl(staff.OPREATION_POS_LEVEL || ""),
      OPERATION_POS_LEVEL_NAME: new FormControl(
        staff.OPERATION_POS_LEVEL_NAME || ""
      ),
      OPERATION_DEPT_CODE: new FormControl(staff.OPERATION_DEPT_CODE || ""),
      OPERATION_DEPT_NAME: new FormControl(staff.OPERATION_DEPT_NAME || ""),
      OPERATION_DEPT_LEVEL: new FormControl(staff.OPERATION_DEPT_LEVEL || ""),
      OPERATION_UNDER_DEPT_CODE: new FormControl(
        staff.OPERATION_UNDER_DEPT_CODE || ""
      ),
      OPERATION_UNDER_DEPT_NAME: new FormControl(
        staff.OPERATION_UNDER_DEPT_NAME || ""
      ),
      OPERATION_UNDER_DEPT_LEVEL: new FormControl(
        staff.OPERATION_UNDER_DEPT_LEVEL || ""
      ),
      OPERATION_WORK_DEPT_CODE: new FormControl(
        staff.OPERATION_WORK_DEPT_CODE || ""
      ),
      OPERATION_WORK_DEPT_NAME: new FormControl(
        staff.OPERATION_WORK_DEPT_NAME || ""
      ),
      OPERATION_WORK_DEPT_LEVEL: new FormControl(
        staff.OPERATION_WORK_DEPT_LEVEL || ""
      ),
      OPERATION_OFFICE_CODE: new FormControl(staff.OPERATION_OFFICE_CODE || ""),
      OPERATION_OFFICE_NAME: new FormControl(staff.OPERATION_OFFICE_NAME || ""),
      OPERATION_OFFICE_SHORT_NAME: new FormControl(
        staff.OPERATION_OFFICE_SHORT_NAME || ""
      ),
      MANAGEMENT_POS_CODE: new FormControl(staff.MANAGEMENT_POS_CODE || ""),
      MANAGEMENT_POS_NAME: new FormControl(staff.MANAGEMENT_POS_NAME || ""),
      MANAGEMENT_POS_LEVEL: new FormControl(staff.MANAGEMENT_POS_LEVEL || ""),
      MANAGEMENT_POS_LEVEL_NAME: new FormControl(
        staff.MANAGEMENT_POS_LEVEL_NAME || ""
      ),
      MANAGEMENT_DEPT_CODE: new FormControl(staff.MANAGEMENT_DEPT_CODE || ""),
      MANAGEMENT_DEPT_NAME: new FormControl(staff.MANAGEMENT_DEPT_NAME || ""),
      MANAGEMENT_DEPT_LEVEL: new FormControl(staff.MANAGEMENT_DEPT_LEVEL || ""),
      MANAGEMENT_UNDER_DEPT_CODE: new FormControl(
        staff.MANAGEMENT_UNDER_DEPT_CODE || ""
      ),
      MANAGEMENT_UNDER_DEPT_NAME: new FormControl(
        staff.MANAGEMENT_UNDER_DEPT_NAME || ""
      ),
      MANAGEMENT_UNDER_DEPT_LEVEL: new FormControl(
        staff.MANAGEMENT_UNDER_DEPT_LEVEL || ""
      ),
      MANAGEMENT_WORK_DEPT_CODE: new FormControl(
        staff.MANAGEMENT_WORK_DEPT_CODE || ""
      ),
      MANAGEMENT_WORK_DEPT_NAME: new FormControl(
        staff.MANAGEMENT_WORK_DEPT_NAME || ""
      ),
      MANAGEMENT_WORK_DEPT_LEVEL: new FormControl(
        staff.MANAGEMENT_WORK_DEPT_LEVEL || ""
      ),
      MANAGEMENT_OFFICE_CODE: new FormControl(
        staff.MANAGEMENT_OFFICE_CODE || ""
      ),
      MANAGEMENT_OFFICE_NAME: new FormControl(
        staff.MANAGEMENT_OFFICE_NAME || ""
      ),
      MANAGEMENT_OFFICE_SHORT_NAME: new FormControl(
        staff.MANAGEMENT_OFFICE_SHORT_NAME || ""
      ),
      REPRESENT_POS_CODE: new FormControl(staff.REPRESENT_POS_CODE || ""),
      REPRESENT_POS_NAME: new FormControl(staff.REPRESENT_POS_NAME || ""),
      REPRESENT_POS_LEVEL: new FormControl(staff.REPRESENT_POS_LEVEL || ""),
      REPRESENT_POS_LEVEL_NAME: new FormControl(
        staff.REPRESENT_POS_LEVEL_NAME || ""
      ),
      REPRESENT_DEPT_CODE: new FormControl(staff.REPRESENT_DEPT_CODE || ""),
      REPRESENT_DEPT_NAME: new FormControl(staff.REPRESENT_DEPT_NAME || ""),
      REPRESENT_DEPT_LEVEL: new FormControl(staff.REPRESENT_DEPT_LEVEL || ""),
      REPRESENT_UNDER_DEPT_CODE: new FormControl(
        staff.REPRESENT_UNDER_DEPT_CODE || ""
      ),
      REPRESENT_UNDER_DEPT_NAME: new FormControl(
        staff.REPRESENT_UNDER_DEPT_NAME || ""
      ),
      REPRESENT_UNDER_DEPT_LEVEL: new FormControl(
        staff.REPRESENT_UNDER_DEPT_LEVEL || ""
      ),
      REPRESENT_WORK_DEPT_CODE: new FormControl(
        staff.REPRESENT_WORK_DEPT_CODE || ""
      ),
      REPRESENT_WORK_DEPT_NAME: new FormControl(
        staff.REPRESENT_WORK_DEPT_NAME || ""
      ),
      REPRESENT_WORK_DEPT_LEVEL: new FormControl(
        staff.REPRESENT_WORK_DEPT_LEVEL || ""
      ),
      REPRESENT_OFFICE_CODE: new FormControl(staff.REPRESENT_OFFICE_CODE || ""),
      REPRESENT_OFFICE_NAME: new FormControl(staff.REPRESENT_OFFICE_NAME || ""),
      REPRESENT_OFFICE_SHORT_NAME: new FormControl(
        staff.REPRESENT_OFFICE_SHORT_NAME || ""
      ),
      STATUS: new FormControl(staff.STATUS || ""),
      REMARK: new FormControl(staff.REMARK || ""),
      FIRST_PART: new FormControl(staff.FIRST_PART || ""),
      FIRST_MONEY: new FormControl(staff.FIRST_MONEY || ""),
      SECOND_PART: new FormControl(staff.SECOND_PART || ""),
      SECOND_MONEY: new FormControl(staff.SECOND_MONEY || ""),
      TOTAL_MONEY: new FormControl(staff.TOTAL_MONEY || ""),
      CONTRIBUTOR_ID: new FormControl(45),
      IS_ACTIVE: new FormControl(1),
      SEQ: new FormControl(staff.SEQ || ""),
    };
    return this.fb.group(SetFormControl);
  }

  ///////////////////////////////////////////////////////////////////////// toggleCollapse //////////////////////////////////////////////////////////////////////////////////////////
  collapse1 = new BehaviorSubject<Boolean>(true);
  collapse2 = new BehaviorSubject<Boolean>(false);
  collapse3 = new BehaviorSubject<Boolean>(false);
  collapse4 = new BehaviorSubject<Boolean>(false);
  collapse5 = new BehaviorSubject<Boolean>(false);
  collapse6 = new BehaviorSubject<Boolean>(false);
  collapse7 = new BehaviorSubject<Boolean>(false);
  toggleCollapse(event: BehaviorSubject<Boolean>): void {
    if (event.getValue()) {
      event.next(false);
    } else {
      event.next(true);
    }
  }

  ///////////////////////////////////////////////////////////////////////// set time //////////////////////////////////////////////////////////////////////////////////////////
  public setFormatTimeControl(
    event: any,
    formControl: string,
    formGroup: FormGroup
  ) {
    let str = event.target.value;
    let str_unSub = event.target.value;
    let substr: any[] = [];
    let mm: string = "";
    let ss: string = "";
    substr = str.split(":");
    mm = substr[0] == undefined ? "" : substr[0].slice(0, 2);
    ss = substr[1] == undefined ? "" : substr[1].slice(0, 2);
    const K = event.keyCode;

    if (!/([0-9])$/.test(event.target.value))
      formGroup.controls[formControl].setValue(
        str_unSub.slice(0, str_unSub.length - 1)
      );

    switch (true) {
      // NumPad 96-105
      case K >= 96 && K <= 105:
        if (str.length == 2)
          formGroup.controls[formControl].setValue(`${mm}:${ss}`);
        else if (str.length == 3)
          formGroup.controls[formControl].setValue(
            `${mm}:${str_unSub.substring(2)}`
          );
        break;
      // KeyPad 96-105
      case K >= 48 && K <= 57:
        if (str.length == 2)
          formGroup.controls[formControl].setValue(`${mm}:${ss}`);
        else if (str.length == 3)
          formGroup.controls[formControl].setValue(
            `${mm}:${str_unSub.substring(2)}`
          );
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
  }

  // require(e){
  //   switch (e){
  //       case 'isReq_COMPARE_NO' : this.isReq_COMPARE_NO = false; break;
  //     }
  // }

  ///////////////////////////////////////////////////////////////////////// document //////////////////////////////////////////////////////////////////////////////////////////
  fileList: Document[] = [];
  DelDoc: any[] = [];
  owlOption = {
    items: 5,
    nav: true,
    dots: false,
    slideBy: 5,
    margin: 10,
    responsiveClass: true,
  };

  modal: any;
  openModal(e) {
    this.modal = this.ngbModal.open(e, { size: "lg", centered: true });
  }

  deleteItem(i: number) {
    const doc = this.fileList[i];
    if (!doc.DOCUMENT_ID) {
      this.fileList.splice(i, 1);
      return;
    }
    Swal({
      title: "",
      text: "ยืนยันการลบรายการหรือไม่",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.value) {
        if (!doc.DOCUMENT_ID) {
          this.fileList.splice(i, 1);
          return;
        }
        this.DelDoc.push(
          [doc.DOCUMENT_ID].reduce((acc, curr) => {
            return { DOCUMENT_ID: curr };
          }, {})
        );
        this.fileList.splice(i, 1);
        // this.preLoaderService.setShowPreloader(true);
        // this.lawsuitService.DocumentupdDelete({ DOCUMENT_ID: doc.DOCUMENT_ID })
        //   .subscribe(x => {
        //     let iSuccess: any;
        //     iSuccess = x;
        //     if (iSuccess.IsSuccess === "True") {
        //       Swal({
        //         title: '',
        //         text: Message.delComplete,
        //         type: 'success',
        //         confirmButtonColor: '#3085d6',
        //         confirmButtonText: 'ตกลง'
        //       })
        //       this.fileList.splice(i, 1);
        //       this.preLoaderService.setShowPreloader(false);
        //     } else {
        //       Swal({
        //         title: '',
        //         text: Message.delFail,
        //         type: 'error',
        //         confirmButtonColor: '#3085d6',
        //         confirmButtonText: 'ตกลง'
        //       })
        //       this.preLoaderService.setShowPreloader(false);
        //     }
        //   });
      }
    });
  }

  DownloadItem(item) {
    this.preloader.setShowPreloader(true);
    this.RewardService.downloadFile(item.DOCUMENT_ID).subscribe((data) =>
      this.handleDownload(data, item)
    );
  }

  handleDownload(data: any, item: any) {
    this.preloader.setShowPreloader(false);
    var blob = URL.createObjectURL(new Blob([data], { type: "*/*" }));
    saveAs(blob, item.DOCUMENT_NAME);
  }

  Output(event: Document) {
    this.fileList = [...this.fileList, event];
    console.log("fileList : ", this.fileList);
  }

  // async testsavedoc(){
  // await this.fileList.map(async doc => {
  //         if (doc.IsNewItem) {
  //           const formData = new FormData();
  //           formData.append('FILE', doc.FILE);
  //           formData.append('DOCUMENT_NAME', doc.DOCUMENT_NAME);
  //           formData.append('DOCUMENT_OLD_NAME', doc.DOCUMENT_OLD_NAME);
  //           formData.append('DOCUMENT_TYPE', '6');
  //           formData.append('FOLDER', doc.FOLDER);
  //           formData.append('REFERENCE_CODE', '402');

  //           console.log("this.compare_ID : ",this.compare_ID)
  //           console.log("this.mode : ",this.mode)
  //           console.log("formData : ",formData)
  //           let result = await this.fineService.DocumentinsAll(formData);
  //           console.log("result : ",result)
  //         }
  //       });
  // }

  // testdeldoc(){
  // const DelDoc = this.DelDoc;
  //       for (let i in DelDoc) {
  //         let l = DelDoc[i]
  //         if (l)
  //           this.fineService.DocumentupdDelete({ DOCUMENT_ID: l.DOCUMENT_ID }).subscribe(isSuccess => { console.log("result : ",isSuccess) })
  //       }
  // }

  ngOnDestroy() {}
}
