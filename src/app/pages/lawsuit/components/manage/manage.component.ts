import { MasLawGuitBase } from "../../models/mas_law_guitbase";
import { MasLawGroupSection } from "../../models/mas_law_group_section";
import { MasOffice } from "../../models/mas_office";
import { MasStaff } from "../../models/mas_staff";
import { Observable } from "rxjs/Observable";
import { LawsuitService } from "../../lawsuit.service";
import {
  Year,
  LawsuitType,
  LawsuitEnd,
  ContibutorName,
} from "../../models/lawsuit";
import { Router, ActivatedRoute } from "@angular/router";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from "@angular/core";
import { Arrest } from "../../../arrests/models/arrest";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder } from "@angular/forms";
import { SidebarService } from "../../../../shared/sidebar/sidebar.component";
import { LawsuitStaffFormControl } from "../../models/lawsuit_staff";
import {
  LawsuitDocument,
  Document,
  FileType,
  ImageDocument,
} from "../../models/lawsuit_document";
import { LawsuitArrestStaffFormControl } from "../../models/lawsuit_arreststaff";
import { FormGroup, FormArray, FormControl, Validators } from "@angular/forms";
import { Message } from "../../../../config/message";
import { MatDialog, MatTableDataSource } from "@angular/material";
import { IMyDpOptions } from "mydatepicker";
import { PreloaderService } from "../../../../shared/preloader/preloader.component";
import Swal from "sweetalert2";
import { MainMasterService } from "../../../../services/main-master.service";
import {
  toLocalShort,
  setZero,
  setDateMyDatepicker,
  getDateMyDatepicker,
  convertDateForSave,
} from "../../../../config/dateFormat";
import { DialogJudgment } from "./dialog-judgment";
import { SwalComponent } from "@toverux/ngx-sweetalert2";
import { MasOfficeModel_New } from "app/models";
import * as moment from "moment-timezone";
import { BehaviorSubject, from, merge, forkJoin } from "rxjs";
import { pagination } from "../../../../config/pagination";
import { saveAs } from "file-saver";
import { mergeMap, map } from "rxjs/operators";
import { ArrestLawbreaker } from "app/pages/model";
import { data } from "jquery";

@Component({
  selector: "app-manage",
  templateUrl: "./manage.component.html",
  styleUrls: ["./manage.component.scss"],
})
export class ManageComponent implements OnInit, OnDestroy {
  @ViewChild("alertSwal") private alertSwal: SwalComponent;

  public officeCode = localStorage.getItem("officeCode");

  navState: any = {
    print: false,
    new: false,
    edit: false,
    delete: false,
    save: false,
    cancel: false,
    next: false,
    next_text: "",
  };

  ArrestCode: string;
  IsLawsuitComplete: Number;
  ArrestIndictment: any = {};
  arrestList: Arrest[] = [];

  lawsuitDoc: LawsuitDocument[] = [];
  lawsuitList: any;

  masOfficeList: MasOffice[] = [];
  typeheadOffice = new Array<MasOfficeModel_New>();
  masStaffList: MasStaff[] = [];
  masLawGroupSectionList: MasLawGroupSection[] = [];
  masLawGuitBaseList: MasLawGuitBase[] = [];
  MasStaff = new Array<MasStaff>();
  staffData = ContibutorName;
  staffState: any[] = [];
  DelStaff: any[] = [];

  errorShow: any;
  modal: any;
  OnEditField_Judgment: Boolean = true;
  disabled: Boolean;
  enabled: Boolean;
  isRequired: boolean;

  lawBraker: any[] = [];
  lawsuitArrestForm: FormGroup;
  lawsuitForm: FormGroup;
  uploadForm: FormGroup;
  lawBrakerForm: FormArray;
  LawsuitArrestStaffShow: boolean = false;
  LawsuitArrestIndictmentProduct: any = [];

  LAIPDisplayOnly: any = [];

  LawsuitTableListShow = false;

  fileToUpload: File = null;
  fileToUploadList: File[] = [];

  DelDoc: any[] = [];

  lawsuitFormNoData: boolean;
  LawsuitStaffOnsave: any = [];
  LawsuitLocationOnSave: any = [];

  IsLawsuitType: any;
  prove: any;
  ProveOrCompareIsCompleted$: boolean;

  staff: any = {};

  searching: boolean = false;
  searchFailed: boolean = false;

  OnEdit: boolean = true;
  OnEdit_LawsuitType: boolean = true;
  OnEdit_LawsuitEnd: boolean = true;
  OnEdit_JudgmentBtn: boolean = true;

  yearList = new Array<Year>();

  private getDataFromListPage: any;
  private onPrintSubscribe: any;
  private onSaveSubscribe: any;
  private onCancelSubscribe: any;
  private LawsuitID: any;
  private IndictmentID: string;
  private ArrestID: number;

  private today = new Date();

  @ViewChild("printDocModal") printDocModel: ElementRef;
  @ViewChild("indicmetModal") indicmetModal: ElementRef;

  private IS_LAWSUIT: any;
  private LAWSUIT_TYPE: any;
  lawsuitType = LawsuitType;
  lawsuitEnd = LawsuitEnd;
  lawsuitTypeSelected: number;

  suggestions: any[] = [];
  suggestionsStation: any[] = [];

  public LawsuitDateOptions: IMyDpOptions = {
    editableDateField: false,
    dateFormat: "dd mmm yyyy",
    showClearDateBtn: false,
    height: "30px",
    disableDateRanges: [
      {
        begin: {
          year: this.today.getFullYear(),
          month: this.today.getMonth() + 1,
          day: this.today.getDate() + 1,
        },
        end: {
          year: this.today.getFullYear() + 100,
          month: this.today.getMonth() + 1,
          day: this.today.getDate(),
        },
      },
    ],
  };

  ///=== Req alert var ===///
  isReq_LawsuitNo = new BehaviorSubject<boolean>(false);
  isReq_LawsuitNoYear = new BehaviorSubject<boolean>(false);
  isReq_LawsuitDate = new BehaviorSubject<boolean>(false);
  isReq_LawsuitTime = new BehaviorSubject<boolean>(false);
  isReq_OfficeName = new BehaviorSubject<boolean>(false);
  isReq_Testimony = new BehaviorSubject<boolean>(false);
  isReq_REMARK = new BehaviorSubject<boolean>(false);

  //toggleCollapse
  LawsuitArrest = new BehaviorSubject<Boolean>(true);
  LawsuitStf = new BehaviorSubject<Boolean>(true);
  LawsuitDoc = new BehaviorSubject<Boolean>(true);
  LawsuitConf = new BehaviorSubject<Boolean>(true);

  paginage = pagination;

  LawsuitNotice: any;

  //Step wizard
  INPUT_WIZARD = new BehaviorSubject<object>(null);

  //Lawsuit payment
  public PAYMENT_DELETE: any[] = [];

  //Test Concat
  concat = ["คำให้การของผู้ต้องหา......"];
  dataSource = new MatTableDataSource<ArrestLawbreaker>();

  result = ["ArrestCode" + ""];

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private ngbModel: NgbModal,
    private sidebarService: SidebarService,
    private preLoaderService: PreloaderService,
    private lawsuitService: LawsuitService,
    public dialog: MatDialog,
    private mainMasterService: MainMasterService
  ) {
    this.createForm();
    this.navState.new = false;
  }

  public onPrint = (content) => {
    this.modal = this.ngbModel.open(content, { size: "lg", centered: true });
  };

  get LawsuitArrestStaff(): FormArray {
    return this.lawsuitArrestForm.get("LawsuitArrestStaff") as FormArray;
  }

  get LawsuitStaff(): FormArray {
    return this.lawsuitForm.get("LawsuitStaff") as FormArray;
  }

  get LawsuitDetail(): FormArray {
    return this.lawsuitForm.get("LawsuitDetail") as FormArray;
  }

  get LawsuitPayment(): FormArray {
    return this.lawsuitForm.get("LawsuitPayment") as FormArray;
  }

  get LawsuitDocument(): FormArray {
    return this.lawsuitForm.get("LawsuitDocument") as FormArray;
  }

  get staffDatas(): FormArray {
    return this.lawsuitForm.get("staffDatas") as FormArray;
  }

  public toDateTZ(date: any) {
    return `${moment(date).format("YYYY-MM-DD HH:mm:ss.ms")}`;
  }

  async ngOnInit() {
    //test function concat//
    // this.feedData();

    this.paginage.TotalItems = 0;

    this.sidebarService.setVersion("0.0.0.34");

    this.preLoaderService.setShowPreloader(true);

    //test concat
    // this.concatLawsuit();

    await this.getParamFromActiveRoute();
    await this.createForm();
    await this.createLawsuitForm();
    await this.tools_bar(this.LawsuitID);

    this.setYear();

    await this.ArrestgetByCon(this.IndictmentID, this.LawsuitID);

    this.preLoaderService.setShowPreloader(false);
  }

  //test function concat//
  // feedData() {
  //   const dummy: ArrestLawbreaker{
  //     this.ArrestLawbreaker
  //     };
  //   this.dataSource.data = dummy;
  // }

  // concatLawsuit(){
  //   this.lawsuitService
  //   .ArrestgetByCon
  //   .subscribe((data: any) =>{
  //     console.log(data);
  //     this.ArrestIndictment = data.data;
  //   });
  // }

  private lawsuitRunningLawsuitNo() {
    const o = this.lawsuitForm.getRawValue();
    const OFFICE_CODE = localStorage.getItem("officeCode");
    const IS_OUTSIDE = o["IS_OUTSIDE"] ? "1" : "0";
    const LAWSUIT_NO_YEAR$ =
      (parseInt(o["LAWSUIT_NO_YEAR"].slice(0, 4)) + 543).toString() || "0";

    this.lawsuitService
      .LawsuitRunningLawsuitNo(OFFICE_CODE, LAWSUIT_NO_YEAR$, IS_OUTSIDE)
      .subscribe((res) => {
        this.lawsuitForm.controls["LAWSUIT_NO"].setValue(res["RUNNING_NO"]);
      });
  }

  private createLawsuitForm() {
    const newDate = new Date();
    let y = newDate.getFullYear();
    let h = setZero(newDate.getHours());
    let min = setZero(newDate.getMinutes());

    let LawsuitDate =
      Number(this.LawsuitID) === 0 ? setDateMyDatepicker(newDate) : "";
    let LawsuitTime = Number(this.LawsuitID) === 0 ? `${h}:${min}` : "";

    this.lawsuitForm = this.fb.group({
      LAWSUIT_ID: new FormControl(""),
      INDICTMENT_ID: new FormControl(""),
      OFFICE_ID: new FormControl(""),
      OFFICE_CODE: new FormControl(""),
      OFFICE_NAME: new FormControl("", Validators.required),
      IS_LAWSUIT: new FormControl(false),
      REMARK_NOT_LAWSUIT: new FormControl(""),
      LAWSUIT_NO: new FormControl("", Validators.required),
      LAWSUIT_NO_YEAR: new FormControl(""),
      LAWSUIT_DATE: new FormControl(LawsuitDate),
      TESTIMONY: new FormControl("", Validators.required),
      DELIVERY_DOC_NO_1: new FormControl(""),
      DELIVERY_DOC_NO_2: new FormControl(""),
      DELIVERY_DOC_DATE: new FormControl(""),
      IS_OUTSIDE: new FormControl(false),
      IS_SEIZE: new FormControl(""),
      IS_ACTIVE: new FormControl(1),
      CREATE_DATE: new FormControl(""),
      CREATE_USER_ACCOUNT_ID: new FormControl(""),
      UPDATE_DATE: new FormControl(""),
      UPDATE_USER_ACCOUNT_ID: new FormControl(""),

      LAWSUIT_TIME: new FormControl(LawsuitTime),
      FULL_NAME: new FormControl(""),

      LawsuitStaff: this.fb.array([
        this.createStaffForm(),
        this.createStaffForm(),
        this.createStaffForm(),
        this.createStaffForm(),
        this.createStaffForm(),
      ]),
      LawsuitArrestIndictmentDetail: this.fb.array([
        this.createLawsuitArrestIndictmentDetailForm(),
      ]),
      LawsuitDetail: this.fb.array([this.createLawsuitDetailForm()]),
    });
  }

  private createForm() {
    this.lawsuitArrestForm = this.fb.group({
      ArrestCode: new FormControl(null, Validators.required),
      OccurrenceDate: new FormControl(null),
      OccurrenceTime: new FormControl(null, Validators.required),
      ArrestStation: new FormControl(null, Validators.required),
      SubSectionType: new FormControl(null, Validators.required),
      GuiltBaseName: new FormControl(null, Validators.required),
      SectionNo: new FormControl(null, Validators.required),
      PenaltyDesc: new FormControl(null),
      LawsuitArrestStaff: this.fb.array([this.createArrestStaffForm()]),
      LawsuitArrestIndictmentProduct: this.fb.array([]),
      LawsuitArrestIndictmentProductDisplayOnly: this.fb.array([]),
    });
  }

  private createStaffForm(): FormGroup {
    LawsuitStaffFormControl.LAWSUIT_ID = new FormControl(this.LawsuitID);
    (LawsuitStaffFormControl.STAFF_ID = new FormControl("")),
      (LawsuitStaffFormControl.STAFF_REF_ID = new FormControl("")),
      (LawsuitStaffFormControl.TITLE_SHORT_NAME_TH = new FormControl("")),
      (LawsuitStaffFormControl.FIRST_NAME = new FormControl("")),
      (LawsuitStaffFormControl.LAST_NAME = new FormControl("")),
      (LawsuitStaffFormControl.OPREATION_POS_NAME = new FormControl("")),
      (LawsuitStaffFormControl.OPERATION_OFFICE_SHORT_NAME = new FormControl(
        ""
      )),
      (LawsuitStaffFormControl.STATUS = new FormControl("")),
      (LawsuitStaffFormControl.REMARK = new FormControl("")),
      (LawsuitStaffFormControl.IS_ACTIVE = new FormControl("")),
      (LawsuitStaffFormControl.FULL_NAME = new FormControl(
        "",
        Validators.required
      )),
      (LawsuitStaffFormControl.TITLE_ID = new FormControl("")),
      (LawsuitStaffFormControl.STAFF_CODE = new FormControl("")),
      (LawsuitStaffFormControl.ID_CARD = new FormControl("")),
      (LawsuitStaffFormControl.STAFF_TYPE = new FormControl("")),
      (LawsuitStaffFormControl.TITLE_NAME_TH = new FormControl("")),
      (LawsuitStaffFormControl.TITLE_NAME_EN = new FormControl("")),
      (LawsuitStaffFormControl.TITLE_SHORT_NAME_EN = new FormControl("")),
      (LawsuitStaffFormControl.AGE = new FormControl("")),
      (LawsuitStaffFormControl.OPERATION_POS_CODE = new FormControl("")),
      (LawsuitStaffFormControl.OPREATION_POS_LEVEL = new FormControl("")),
      (LawsuitStaffFormControl.OPERATION_POS_LEVEL_NAME = new FormControl("")),
      (LawsuitStaffFormControl.OPERATION_DEPT_CODE = new FormControl("")),
      (LawsuitStaffFormControl.OPERATION_DEPT_NAME = new FormControl("")),
      (LawsuitStaffFormControl.OPERATION_DEPT_LEVEL = new FormControl("")),
      (LawsuitStaffFormControl.OPERATION_UNDER_DEPT_CODE = new FormControl("")),
      (LawsuitStaffFormControl.OPERATION_UNDER_DEPT_NAME = new FormControl("")),
      (LawsuitStaffFormControl.OPERATION_UNDER_DEPT_LEVEL = new FormControl(
        ""
      )),
      (LawsuitStaffFormControl.OPERATION_WORK_DEPT_CODE = new FormControl("")),
      (LawsuitStaffFormControl.OPERATION_WORK_DEPT_NAME = new FormControl("")),
      (LawsuitStaffFormControl.OPERATION_WORK_DEPT_LEVEL = new FormControl("")),
      (LawsuitStaffFormControl.OPERATION_OFFICE_CODE = new FormControl("")),
      (LawsuitStaffFormControl.OPERATION_OFFICE_NAME = new FormControl("")),
      (LawsuitStaffFormControl.MANAGEMENT_POS_CODE = new FormControl("")),
      (LawsuitStaffFormControl.MANAGEMENT_POS_NAME = new FormControl("")),
      (LawsuitStaffFormControl.MANAGEMENT_POS_LEVEL = new FormControl("")),
      (LawsuitStaffFormControl.MANAGEMENT_POS_LEVEL_NAME = new FormControl("")),
      (LawsuitStaffFormControl.MANAGEMENT_DEPT_CODE = new FormControl("")),
      (LawsuitStaffFormControl.MANAGEMENT_DEPT_NAME = new FormControl("")),
      (LawsuitStaffFormControl.MANAGEMENT_DEPT_LEVEL = new FormControl("")),
      (LawsuitStaffFormControl.MANAGEMENT_UNDER_DEPT_CODE = new FormControl(
        ""
      )),
      (LawsuitStaffFormControl.MANAGEMENT_UNDER_DEPT_NAME = new FormControl(
        ""
      )),
      (LawsuitStaffFormControl.MANAGEMENT_UNDER_DEPT_LEVEL = new FormControl(
        ""
      )),
      (LawsuitStaffFormControl.MANAGEMENT_WORK_DEPT_CODE = new FormControl("")),
      (LawsuitStaffFormControl.MANAGEMENT_WORK_DEPT_NAME = new FormControl("")),
      (LawsuitStaffFormControl.MANAGEMENT_WORK_DEPT_LEVEL = new FormControl(
        ""
      )),
      (LawsuitStaffFormControl.MANAGEMENT_OFFICE_CODE = new FormControl("")),
      (LawsuitStaffFormControl.MANAGEMENT_OFFICE_NAME = new FormControl("")),
      (LawsuitStaffFormControl.MANAGEMENT_OFFICE_SHORT_NAME = new FormControl(
        ""
      )),
      (LawsuitStaffFormControl.REPRESENT_POS_CODE = new FormControl("")),
      (LawsuitStaffFormControl.REPRESENT_POS_NAME = new FormControl("")),
      (LawsuitStaffFormControl.REPRESENT_POS_LEVEL = new FormControl("")),
      (LawsuitStaffFormControl.REPRESENT_POS_LEVEL_NAME = new FormControl("")),
      (LawsuitStaffFormControl.REPRESENT_DEPT_CODE = new FormControl("")),
      (LawsuitStaffFormControl.REPRESENT_DEPT_NAME = new FormControl("")),
      (LawsuitStaffFormControl.REPRESENT_DEPT_LEVEL = new FormControl("")),
      (LawsuitStaffFormControl.REPRESENT_UNDER_DEPT_CODE = new FormControl("")),
      (LawsuitStaffFormControl.REPRESENT_UNDER_DEPT_NAME = new FormControl("")),
      (LawsuitStaffFormControl.REPRESENT_UNDER_DEPT_LEVEL = new FormControl(
        ""
      )),
      (LawsuitStaffFormControl.REPRESENT_WORK_DEPT_CODE = new FormControl("")),
      (LawsuitStaffFormControl.REPRESENT_WORK_DEPT_NAME = new FormControl("")),
      (LawsuitStaffFormControl.REPRESENT_WORK_DEPT_LEVEL = new FormControl("")),
      (LawsuitStaffFormControl.REPRESENT_OFFICE_CODE = new FormControl("")),
      (LawsuitStaffFormControl.REPRESENT_OFFICE_NAME = new FormControl("")),
      (LawsuitStaffFormControl.REPRESENT_OFFICE_SHORT_NAME = new FormControl(
        ""
      )),
      (LawsuitStaffFormControl.CONTRIBUTOR_ID = new FormControl(null)),
      (LawsuitStaffFormControl.IsNewItem = new FormControl(null)),
      (LawsuitStaffFormControl.IsActive = new FormControl(null)),
      (LawsuitStaffFormControl.StaffFullName = new FormControl("")),
      (LawsuitStaffFormControl.DeptLevel = new FormControl(""));
    return this.fb.group(LawsuitStaffFormControl);
  }

  private createArrestStaffForm(): FormGroup {
    LawsuitArrestStaffFormControl.LawsuitID = new FormControl(this.LawsuitID);
    return this.fb.group(LawsuitArrestStaffFormControl);
  }

  private createLawsuitDetailForm(): FormGroup {
    return this.fb.group({
      PERSON_ID: new FormControl(""),
      LAWSUIT_DETAIL_ID: new FormControl(""),
      LAWSUIT_ID: new FormControl(""),
      INDICTMENT_DETAIL_ID: new FormControl(""),
      COURT_ID: new FormControl(""),
      LAWSUIT_TYPE: new FormControl(1),
      LAWSUIT_END: new FormControl(1),
      COURT_NAME: new FormControl(""),
      UNDECIDE_NO_1: new FormControl(""),
      UNDECIDE_NO_YEAR_1: new FormControl(""),
      DECIDE_NO_1: new FormControl(""),
      DECIDE_NO_YEAR_1: new FormControl(""),
      UNDECIDE_NO_2: new FormControl(""),
      UNDECIDE_NO_YEAR_2: new FormControl(""),
      DECIDE_NO_2: new FormControl(""),
      DECIDE_NO_YEAR_2: new FormControl(""),
      JUDGEMENT_NO: new FormControl(""),
      JUDGEMENT_NO_YEAR: new FormControl(""),
      JUDGEMENT_DATE: new FormControl(""),
      IS_IMPRISON: new FormControl(""),
      IMPRISON_TIME: new FormControl(""),
      IMPRISON_TIME_UNIT: new FormControl(""),
      IS_FINE: new FormControl(""),
      FINE: new FormControl(""),
      IS_PAYONCE: new FormControl(null),
      FINE_DATE: new FormControl(""),
      PAYMENT_PERIOD: new FormControl(""),
      PAYMENT_PERIOD_DUE: new FormControl(""),
      PAYMENT_PERIOD_DUE_UNIT: new FormControl(""),
      PAYMENT_DATE: new FormControl(""),
      IS_DISMISS: new FormControl(""),
      IS_ACTIVE: new FormControl(""),
      UNJUDGEMENT_NO: new FormControl(""),
      UNJUDGEMENT_NO_YEAR: new FormControl(""),
      LawsuitPayment: this.fb.array([this.createLawsuitPaymentForm()]),

      //Customs
      A_EntityType: new FormControl(""),
      A_LawbreakerType: new FormControl(""),
      A_LawsuitNoRef: new FormControl(""),
      A_LawBrakerFullName: new FormControl(""),
      A_LawsuitDtlID: new FormControl(""),
    });
  }

  private createLawsuitPaymentForm(): FormGroup {
    return this.fb.group({
      COMPARE_DETAIL_ID: new FormControl(""),
      FINE: new FormControl(""),
      FINE_TYPE: new FormControl(""),
      IS_ACTIVE: new FormControl(""),
      IS_REQUEST_REWARD: new FormControl(""),
      LAWSUIT_DETAIL_ID: new FormControl(""),
      PAYMENT_CHANNEL: new FormControl(""),
      PAYMENT_BANK: new FormControl(""),
      PAYMENT_REF_NO: new FormControl(""),
      LawsuitPaymentDetail: this.fb.array([
        this.fb.group({
          IS_ACTIVE: new FormControl(""),
          IS_REQUEST_BRIBE: new FormControl(""),
          NOTICE_ID: new FormControl(""),
          PAYMENT_DETAIL_ID: new FormControl(""),
          PAYMENT_ID: new FormControl(""),
        }),
      ]),
      PAYMENT_DATE: new FormControl(""),
      PAYMENT_ID: new FormControl(""),
      PAYMENT_PERIOD_NO: new FormControl(""),
    });
  }

  private createLawsuitArrestIndictmentDetailForm(): FormGroup {
    return this.fb.group({
      COMPANY_REGISTRATION_NO: new FormControl(null),
      ENTITY_TYPE: new FormControl(null),
      EXCISE_REGISTRATION_NO: new FormControl(null),
      FIRST_NAME: new FormControl(null),
      ID_CARD: new FormControl(null),
      INDICTMENT_DETAIL_ID: new FormControl(null),
      INDICTMENT_ID: new FormControl(null),
      LAST_NAME: new FormControl(null),
      LAWBREAKER_ID: new FormControl(null),
      MIDDLE_NAME: new FormControl(null),
      MISTREAT_NO: new FormControl(null),
      OTHER_NAME: new FormControl(null),
      PASSPORT_NO: new FormControl(null),
      PERSON_ID: new FormControl(null),
      PERSON_TYPE: new FormControl(null),
      TITLE_NAME_EN: new FormControl(null),
      TITLE_NAME_TH: new FormControl(null),
      TITLE_SHORT_NAME_EN: new FormControl(null),
      TITLE_SHORT_NAME_TH: new FormControl(null),
    });
  }

  private tools_bar(LawsuitID) {
    if (LawsuitID > 0) {
      this.navState.save = false;
      this.navState.cancel = false;
      this.navState.print = true;
      this.navState.delete = true;
      this.navState.edit = true;
    } else {
      this.navState.save = true;
      this.navState.cancel = true;
    }
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.lawsuitForm.controls;
    for (const name in controls) {
      if (controls[name].invalid && name != "LawsuitTableList") {
        invalid.push(name);
      }
    }
    return invalid;
  }

  private getParamFromActiveRoute() {
    this.getDataFromListPage = this.activeRoute.queryParams.subscribe(
      async (params) => {
        this.LawsuitID = params.LawsuitID;
        this.IndictmentID = params.IndictmentID;
      }
    );
  }

  ngOnDestroy() {
    try {
      this.alertSwal.ngOnDestroy();
      this.getDataFromListPage.unsubscribe();
      this.onPrintSubscribe.unsubscribe();
      this.onSaveSubscribe.unsubscribe();
      this.onCancelSubscribe.unsubscribe();
    } catch (err) {}
  }

  private async onNextPage() {
    let lawsuitID = this.LawsuitID;
    let indictmentID = this.IndictmentID;
    let IsProve = 0;
    IsProve = await this.lawsuitService
      .LawsuitgetByCon(indictmentID)
      .then((res) => {
        return res[0].LawsuitArrestIndicment[0].IsProve;
      });
    if (IsProve == 0) {
      /// IdProve = 0 (goto ILG60-06-02-00-00)
      await this.lawsuitService
        .LawsuitComparegetByLawsuitID(lawsuitID)
        .then((res) => {
          if (res.length == 0) {
            /// if not found data
            this.router.navigate([
              "/fine/manage/R/" + 0 + "/" + indictmentID + "/TN0006036200001",
            ]);
          } else {
            ///if found data
            this.router.navigate([
              "/fine/manage/R/" +
                res[0].FineID +
                "/" +
                indictmentID +
                "/TN0006036200001",
            ]);
          }
        });
    } else {
      /// IdProve = 1 (goto ILG60-05-02-00-00)
      await this.lawsuitService
        .LawsuitProvegetByLawsuitID(lawsuitID)
        .then((res) => {
          if (res.length == 0) {
            /// if not found data
            this.router.navigate(["/prove/manage/C/" + 0 + "/" + indictmentID]);
          } else {
            ///if found data
            this.router.navigate([
              "/prove/manage/R/" + res[0].ProveID + "/" + indictmentID,
            ]);
          }
        });
    }
  }

  private async onCancel() {
    Swal({
      title: "",
      text: "ยืนยันการทำรายการหรือไม่",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.value) {
        this.router.navigate(["/lawsuit/list"]);
        this.navState.edit = true;
        this.navState.cancel = false;
        this.navState.save = false;
      } else {
        return;
      }
    });
  }

  private onDelete() {
    Swal({
      title: "",
      text: "ยืนยันการทำรายการหรือไม่",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.value) {
        let result$ = [];
        let zip$ = new Observable<any>();
        let request = new Observable<any>();

        request = this.lawsuitService
          .LawsuitupdDelete(this.LawsuitID)
          .pipe(
            mergeMap((x) => {
              return merge(
                Observable.of(x),
                this.LawsuiltArrestIndictmentCheckCompleteModify(),
                this.LawsuitMistreatNoupdDeleteModify()
              );
            })
          )
          .finally(() => this.preLoaderService.setShowPreloader(false));

        zip$ = Observable.zip(request).pipe(
          map((x) => {
            return (result$ = [...result$, ...x]);
          })
        );

        forkJoin(zip$).subscribe((x) => {
          const objRes: any[] = x[0];
          if (objRes.filter((o) => o["IsSuccess"] == "False").length) {
            Swal({
              title: "",
              text: Message.saveFail,
              type: "warning",
              showCancelButton: false,
              confirmButtonColor: "#3085d6",
              confirmButtonText: "ตกลง",
            });
          } else {
            Swal({
              title: "",
              text: Message.saveComplete,
              type: "success",
              showCancelButton: false,
              confirmButtonColor: "#3085d6",
              confirmButtonText: "ตกลง",
            }).then((r) => {
              if (r) this.router.navigate(["/lawsuit/list"]);
            });
          }
        }),
          () => {
            Swal({
              title: "",
              text: Message.saveFail,
              type: "warning",
              showCancelButton: false,
              confirmButtonColor: "#3085d6",
              confirmButtonText: "ตกลง",
            });
          };
      } else {
        this.navState.delete = true;
        return;
      }
    });
  }

  async OnCreate() {
    let isOut = this.lawsuitForm.controls["IS_OUTSIDE"].value ? 1 : 0;
    let isLaw = this.lawsuitForm.controls["IS_LAWSUIT"].value ? 0 : 1;
    let isLawBoolean: boolean = this.lawsuitForm.controls["IS_LAWSUIT"].value;

    //#### Set Year For Service ####
    let LAWSUIT_NO_YEAR =
      isLaw == 1 ? this.lawsuitForm.controls["LAWSUIT_NO_YEAR"].value : "";
    this.lawsuitForm.controls["LAWSUIT_NO_YEAR"].setValue(LAWSUIT_NO_YEAR);

    let LAWSUIT_DATE =
      isLaw == 1 ? this.lawsuitForm.controls["LAWSUIT_DATE"].value : "";
    this.lawsuitForm.controls["LAWSUIT_DATE"].setValue(LAWSUIT_DATE);

    const LAWSUIT_NO = this.lawsuitForm.controls["LAWSUIT_NO"].value;
    const OFFICE_CODE = localStorage.getItem("officeCode");
    const LAWSUIT_NO_YEAR$ = LAWSUIT_NO_YEAR.slice(0, 4);

    this.preLoaderService.setShowPreloader(true);

    await this.lawsuitService
      .LawsuitVerifyLawsuitNo(LAWSUIT_NO, OFFICE_CODE, isOut, LAWSUIT_NO_YEAR$)
      .then(async (res) => {
        if (res.length && !isLawBoolean) {
          this.isReq_LawsuitNo.next(true);

          this.preLoaderService.setShowPreloader(false);

          await Swal({
            text: "เลขที่คดีซ้ำ กรุณาระบุใหม่",
            type: "warning",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "ตกลง",
          });
        } else {
          this.lawsuitForm.controls["IS_LAWSUIT"].setValue(isLaw);
          this.lawsuitForm.controls["IS_OUTSIDE"].setValue(isOut);

          let f = Object.assign(this.lawsuitForm.getRawValue());
          f = { ...f };

          isLaw == 0 ? (f.LAWSUIT_DATE = "") : f.LAWSUIT_DATE;

          // // === SetNewPayment ===///
          f.LawsuitDetail.map((m) => {
            m.LawsuitPayment = this.getOldPaymentToUpd(m.LawsuitPayment);
          });
          console.log("C Befor save LawsuitinsAll : ", f);

          let result = [];
          let zip$ = new Observable<any>();
          let request = new Observable<any>();

          request = this.lawsuitService
            .LawsuitinsAll(f)
            .pipe(
              mergeMap((x) => {
                const LAWSUIT_ID = x["LAWSUIT_ID"];
                return merge(
                  Observable.of(x),
                  this.lawsuitService.LawsuiltArrestIndictmentupdArrestComplete(
                    this.ArrestID
                  ),
                  this.lawsuitService.LawsuiltArrestIndictmentupdIndictmentComplete(
                    this.IndictmentID
                  ),
                  this.LawsuitMistreatNoupModify(
                    f.LawsuitArrestIndictmentDetail
                  ),
                  this.LawsuitDocumentModify(LAWSUIT_ID)
                );
              })
            )
            .finally(() => this.preLoaderService.setShowPreloader(false));

          zip$ = Observable.zip(request).pipe(
            map((x) => {
              return (result = [...result, ...x]);
            })
          );

          forkJoin(zip$).subscribe((x) => {
            const objRes: any[] = x[0];
            if (objRes.filter((o) => o["IsSuccess"] == "False").length) {
              Swal({
                title: "",
                text: Message.saveFail,
                type: "warning",
                showCancelButton: false,
                confirmButtonColor: "#3085d6",
                confirmButtonText: "ตกลง",
              });
            } else {
              Swal({
                title: "",
                text: Message.saveComplete,
                type: "success",
                showCancelButton: false,
                confirmButtonColor: "#3085d6",
                confirmButtonText: "ตกลง",
              }).then((r) => {
                if (r) {
                  this.router.navigate(["/lawsuit/manage", "R"], {
                    queryParams: {
                      IndictmentID: this.IndictmentID,
                      LawsuitID: objRes[0]["LAWSUIT_ID"],
                    },
                  });

                  this.ArrestgetByCon(
                    this.IndictmentID,
                    objRes[0]["LAWSUIT_ID"]
                  );

                  setTimeout(() => {
                    location.reload();
                  }, 300);
                }
              });
            }
          }),
            () => {
              Swal({
                title: "",
                text: Message.saveFail,
                type: "warning",
                showCancelButton: false,
                confirmButtonColor: "#3085d6",
                confirmButtonText: "ตกลง",
              });
            };
        }
      });
  }

  async OnRevice() {
    if (Number(this.LawsuitID) > 0) {
      //##### Set isLaw && isOut #####
      let isOut = this.lawsuitForm.controls["IS_OUTSIDE"].value ? 1 : 0;
      let isLaw = this.lawsuitForm.controls["IS_LAWSUIT"].value ? 0 : 1;

      this.lawsuitForm.controls["IS_OUTSIDE"].setValue(isOut);
      this.lawsuitForm.controls["IS_LAWSUIT"].setValue(isLaw);

      let f = Object.assign(this.lawsuitForm.getRawValue());

      f = { ...f };

      f.LawsuitDetail.map((m) => {
        m.FINE_DATE = m.FINE_DATE ? this.toDateTZ(m.FINE_DATE) : "";
        m.PAYMENT_DATE = m.PAYMENT_DATE ? this.toDateTZ(m.PAYMENT_DATE) : "";
        m.JUDGEMENT_DATE = m.JUDGEMENT_DATE
          ? this.toDateTZ(m.JUDGEMENT_DATE)
          : "";
        m.UNDECIDE_NO_YEAR_1 = m.UNDECIDE_NO_YEAR_1
          ? this.toDateTZ(m.UNDECIDE_NO_YEAR_1)
          : "";
        m.DECIDE_NO_YEAR_1 = m.DECIDE_NO_YEAR_1
          ? this.toDateTZ(m.DECIDE_NO_YEAR_1)
          : "";
        m.UNDECIDE_NO_YEAR_2 = m.UNDECIDE_NO_YEAR_2
          ? this.toDateTZ(m.UNDECIDE_NO_YEAR_2)
          : "";
        m.DECIDE_NO_YEAR_2 = m.DECIDE_NO_YEAR_2
          ? this.toDateTZ(m.DECIDE_NO_YEAR_2)
          : "";
        m.UNJUDGEMENT_NO_YEAR = m.UNJUDGEMENT_NO_YEAR
          ? this.toDateTZ(m.UNJUDGEMENT_NO_YEAR)
          : "";
        m.JUDGEMENT_NO_YEAR = m.JUDGEMENT_NO_YEAR
          ? this.toDateTZ(m.JUDGEMENT_NO_YEAR)
          : "";
        m.LawsuitPayment.map((Payment) => {
          Payment.PAYMENT_DATE = Payment.PAYMENT_DATE
            ? this.toDateTZ(Payment.PAYMENT_DATE)
            : "";
        });
      });

      this.preLoaderService.setShowPreloader(true);

      let result = [];
      let zip$ = new Observable<any>();
      let request = new Observable<any>();

      request = this.lawsuitService
        .LawsuitupdAll(f)
        .pipe(
          mergeMap((x) => {
            return merge(
              Observable.of(x),
              this.LawsuitStaffModify(this.LawsuitStaff.value),
              this.LawsuitPaymentInsModify(f.LawsuitDetail),
              this.LawsuitDocumentModify(this.LawsuitID)
            );
          })
        )
        .finally(() => this.preLoaderService.setShowPreloader(false));

      zip$ = Observable.zip(request).pipe(
        map((x) => {
          return (result = [...result, ...x]);
        })
      );

      forkJoin(zip$).subscribe((x) => {
        const objRes: any[] = x[0];
        if (objRes.filter((o) => o["IsSuccess"] == "False").length) {
          Swal({
            title: "",
            text: Message.saveFail,
            type: "warning",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "ตกลง",
          });
        } else {
          Swal({
            title: "",
            text: Message.saveComplete,
            type: "success",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "ตกลง",
          }).then((r) => {
            if (r) {
              location.reload();
            }
          });
        }
      }),
        () => {
          Swal({
            title: "",
            text: Message.saveFail,
            type: "warning",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "ตกลง",
          });
        };
    }
  }

  LawsuitStaffModify(Staff: any[]): Observable<any> {
    for (var key in Staff) if (Staff[key] === "null") Staff[key] = null;

    let ins = Staff.filter((f) => f.IsNewItem == true);

    // let upd = Staff.filter(f => f.IsNewItem == false && f.STAFF_ID);
    // console.log('Staff upd : ', upd)

    let del = this.DelStaff;

    let ins$ = () =>
      from(ins).pipe(mergeMap((x) => this.lawsuitService.insStaff(x)));

    // let upd$ = () => from(upd).pipe(mergeMap(x => this.lawsuitService.LawsuitStaffupdAll(x)));

    let del$ = () =>
      from(del).pipe(
        mergeMap((x) => this.lawsuitService.LawsuitStaffupdDelete(x))
      );

    return merge(
      ins.length > 0 ? ins$() : Observable.of(),
      // upd.length > 0 ? upd$() : Observable.of(),
      del.length > 0 ? del$() : Observable.of()
    );
  }

  LawsuitMistreatNoupModify(IndictmentDetail): Observable<any> {
    const PERSON_ID = IndictmentDetail.filter((f) => f.PERSON_ID).reduce(
      (a, c) => {
        return [...a, c.PERSON_ID];
      },
      []
    );

    let result$ = () =>
      from(PERSON_ID).pipe(
        mergeMap((x) => this.lawsuitService.LawsuitMistreatNoupByCon(x))
      );

    return merge(PERSON_ID.length > 0 ? result$() : Observable.of());
  }

  LawsuitDocumentModify(REFERENCE_CODE: string): Observable<any> {
    let ins = this.fileList.filter((f) => f.IsNewItem == true);

    let del = this.DelDoc;

    if (ins.length > 0)
      ins = ins.reduce(
        (accu, curr) => [...accu, { ...curr, REFERENCE_CODE }],
        []
      );

    if (del.length)
      del = del.reduce(
        (acc, curr) => [...acc, { DOCUMENT_ID: curr.DOCUMENT_ID }],
        []
      );

    let ins$ = () =>
      from(ins).pipe(mergeMap((x) => this.lawsuitService.DocumentinsAll(x)));

    let del$ = () =>
      from(del).pipe(mergeMap((x) => this.lawsuitService.DocumentupdDelete(x)));

    return merge(
      ins.length > 0 ? ins$() : Observable.of(),
      del.length > 0 ? del$() : Observable.of()
    );
  }

  LawsuitPaymentInsModify(LawsuitDetail: any[] = []): Observable<any> {
    let LawsuitPayment = LawsuitDetail.reduce(
      (accu, curr) => [...accu, ...curr.LawsuitPayment],
      []
    );

    let ins = LawsuitPayment.filter((f) => f.IS_NEWPAYMENT == true);

    let del = this.PAYMENT_DELETE.reduce(
      (a, c) => [...a, { PAYMENT_ID: c.PAYMENT_ID }],
      []
    );

    let ins$ = () =>
      from(ins).pipe(
        mergeMap((x) => this.lawsuitService.LawsuitPaymentinsAll(x))
      );

    return merge(
      ins.length > 0 ? ins$() : Observable.of(),
      del.length > 0
        ? this.lawsuitService.LawsuitPaymentupdDelete(del)
        : Observable.of()
    );
  }

  LawsuiltArrestIndictmentCheckCompleteModify(): Observable<any> {
    return this.lawsuitService
      .LawsuiltArrestIndictmentupdDeleteIndictmentComplete(this.IndictmentID)
      .pipe(
        mergeMap((x) => {
          return merge(
            Observable.of(x),
            this.lawsuitService
              .LawsuiltArrestIndictmentCheckComplete(this.ArrestID)
              .pipe(
                mergeMap((x) => {
                  return x.length == 0
                    ? this.lawsuitService.LawsuiltArrestIndictmentupdDeleteArrestComplete(
                        this.ArrestID
                      )
                    : Observable.of();
                })
              )
          );
        })
      );
  }

  LawsuitMistreatNoupdDeleteModify(): Observable<any> {
    const l = this.lawsuitForm.getRawValue();
    const LawsuitDetail: any[] = l["LawsuitDetail"] || [];

    let lawBraker = LawsuitDetail.reduce(
      (a, c) => [...a, { PERSON_ID: c["PERSON_ID"] }],
      []
    );
    lawBraker = this.filterDuplicate(lawBraker, "PERSON_ID");
    lawBraker = lawBraker.filter((f) => f["PERSON_ID"] != 0);

    let lessen$ = () =>
      from(lawBraker).pipe(
        mergeMap((x) => this.lawsuitService.LawsuitMistreatNoupdDelete(x))
      );

    return lawBraker.length > 0 ? lessen$() : Observable.of();
  }

  getOldPaymentToUpd(LawsuitPayment: any[] = []) {
    let filter = LawsuitPayment.filter((f) => f.IS_NEWPAYMENT == false);
    return filter;
  }

  setNulltoEmpty() {
    let m = this.lawsuitForm.value;
    this.lawsuitForm.patchValue({
      CREATE_DATE: m.CREATE_DATE,
      CREATE_USER_ACCOUNT_ID: m.CREATE_USER_ACCOUNT_ID,
      DELIVERY_DOC_DATE: m.DELIVERY_DOC_DATE,
      DELIVERY_DOC_NO_1: m.DELIVERY_DOC_NO_1,
      DELIVERY_DOC_NO_2: m.DELIVERY_DOC_NO_2,
      INDICTMENT_ID: m.INDICTMENT_ID,
      IS_ACTIVE: m.IS_ACTIVE,
      IS_LAWSUIT: m.IS_LAWSUIT,
      IS_OUTSIDE: m.IS_OUTSIDE,
      IS_SEIZE: m.IS_SEIZE,
      LAWSUIT_DATE: m.LAWSUIT_DATE,
      LAWSUIT_ID: m.LAWSUIT_ID,
      LAWSUIT_NO: m.LAWSUIT_NO,
      LAWSUIT_NO_YEAR: m.LAWSUIT_NO_YEAR,
      LAWSUIT_TIME: m.LAWSUIT_TIME,
      OFFICE_CODE: m.OFFICE_CODE,
      OFFICE_ID: m.OFFICE_ID,
      OFFICE_NAME: m.OFFICE_NAME,
      REMARK_NOT_LAWSUIT: m.REMARK_NOT_LAWSUIT,
      TESTIMONY: m.TESTIMONY,
      UPDATE_DATE: m.UPDATE_DATE,
      UPDATE_USER_ACCOUNT_ID: m.UPDATE_USER_ACCOUNT_ID,
    });
  }

  private setItemFormArray(
    array: any[],
    formControl: string,
    formGroup: FormGroup
  ) {
    if (array !== undefined && array.length) {
      const itemFGs = array.map((item) => this.fb.group(item));
      const itemFormArray = this.fb.array(itemFGs);
      formGroup.setControl(formControl, itemFormArray);
    }
  }

  getNowTime() {
    let hours = "000" + new Date().getHours();
    let min = "000" + new Date().getMinutes();
    return (
      hours.substr(hours.length - 2, hours.length) +
      ":" +
      min.substr(min.length - 2, min.length)
    );
  }

  getNowDate() {
    let now = new Date();
    return {
      date: {
        day: now.getDate(),
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      },
    };
  }

  //#############################################      START  ARRESTGETBYCON     ######################################################
  //##################################################                      ###########################################################
  //###################################################################################################################################
  private async ArrestgetByCon(IndictmentID: string, LawsuitID: string) {
    let ArrestIndictmentProduct = await this.lawsuitService.LawsuiltArrestIndictmentgetByCon(
      IndictmentID
    );
    for (var key in ArrestIndictmentProduct) {
      if (ArrestIndictmentProduct[key] === "null")
        ArrestIndictmentProduct[key] = "";
    }
    this.ArrestIndictment = this.jsonCopy(ArrestIndictmentProduct);

    if (ArrestIndictmentProduct) {
      this.ArrestCode = ArrestIndictmentProduct.ARREST_CODE;
      this.ArrestID = ArrestIndictmentProduct.ARREST_ID;
      this.LawsuitNotice = ArrestIndictmentProduct.LawsuitNotice;
      this.LawsuitArrestIndictmentProduct =
        ArrestIndictmentProduct.LawsuitArrestIndictmentProduct;

      this.INPUT_WIZARD.next({
        VALUE: this.LawsuitID,
        RESERVE_VALUE: this.ArrestCode,
      });

      this.LAIPDisplayOnly =
        ArrestIndictmentProduct.LawsuitArrestIndictmentProduct;

      if (this.LAIPDisplayOnly.length)
        this.LAIPDisplayOnly.map((m, i) => {
          m.RowId = i + 1;
          for (var key in m) if (m[key] === "null") m[key] = null;
        });

      let LawsuitLocale: string = "";
      if (ArrestIndictmentProduct.LawsuitLocale.length) {
        const l = ArrestIndictmentProduct.LawsuitLocale[0];
        LawsuitLocale = `${l.SUB_DISTRICT_NAME_TH} ${l.DISTRICT_NAME_TH} ${l.PROVINCE_NAME_TH}`;
      }

      this.paginage.TotalItems =
        ArrestIndictmentProduct.LawsuitArrestIndictmentProduct.length;

      await this.lawsuitArrestForm.reset({
        ArrestCode: ArrestIndictmentProduct.ARREST_CODE,
        OccurrenceDate: toLocalShort(ArrestIndictmentProduct.OCCURRENCE_DATE),
        OccurrenceTime: ArrestIndictmentProduct.OCCURRENCE_DATE.slice(10, 16),
        ArrestStation: LawsuitLocale,
        SubSectionType: ArrestIndictmentProduct.SUBSECTION_NAME,
        GuiltBaseName: ArrestIndictmentProduct.GUILTBASE_NAME,
        SectionNo: ArrestIndictmentProduct.SECTION_NAME.substr(6),
        PenaltyDesc: ArrestIndictmentProduct.PENALTY_DESC,
        LawsuitArrestIndictmentProduct: this.LawsuitArrestIndictmentProduct,
      });

      this.setItemFormArray(
        this.LawsuitArrestIndictmentProduct,
        "LawsuitArrestIndictmentProduct",
        this.lawsuitArrestForm
      );

      const arreststaff: any = [ArrestIndictmentProduct];
      await arreststaff.map((item) => {
        item.FullName = `${item.ACCUSER_TITLE_SHORT_NAME_TH}${item.ACCUSER_FIRST_NAME} ${item.ACCUSER_LAST_NAME}`;
        item.PositionName = item.ACCUSER_MANAGEMENT_POS_NAME;
        item.DepartmentName = item.ACCUSER_OPERATION_OFFICE_SHORT_NAME;
      });

      /// set LawsuitArrestStaff to lawsuitArrestForm
      this.LawsuitArrestStaffShow = true;
      this.setItemFormArray(
        arreststaff,
        "LawsuitArrestStaff",
        this.lawsuitArrestForm
      );
    }

    //########################    LawsuitgetByCon    #############################
    await this.lawsuitService.LawsuitgetByCon(LawsuitID).then(async (res) => {
      this.IsLawsuitComplete = 1;
      this.lawsuitList = this.jsonCopy(ArrestIndictmentProduct);
      this.lawsuitFormNoData = true;

      if (Number(this.LawsuitID) === 0) {
        this.OnEdit = false;
        this.OnEdit_LawsuitType = false;
        this.OnEdit_LawsuitEnd = false;
        this.OnEdit_JudgmentBtn = false;
        ///=== set action Collapse ===///
        this.LawsuitStf.next(false);
        this.LawsuitDoc.next(false);
        this.LawsuitConf.next(true);

        //#### set offfice name ####
        await this.lawsuitService.MasOfficeMaingetAll().then((masoffice) => {
          const _masoffice = masoffice.RESPONSE_DATA;
          this.typeheadOffice = masoffice.RESPONSE_DATA;
          let officeCode = localStorage.getItem("officeCode");
          for (let l of _masoffice) {
            let code = l.OFFICE_CODE;
            if (officeCode == code) {
              this.lawsuitForm.patchValue({
                OFFICE_CODE: l.OFFICE_CODE || "",
                OFFICE_NAME: l.OFFICE_SHORT_NAME,
                OFFICE_ID: l.OFFICE_ID,
              });
              break;
            }
          }
        });

        //######## SET STAFF IN CASE LAWID == 0 #########
        let UserAccountID = localStorage.getItem("UserAccountID");
        let typeheadStaff;

        await this.mainMasterService
          .MasStaff(UserAccountID, "")
          .then((res1) => (typeheadStaff = res1.RESPONSE_DATA || []));

        for (let l of typeheadStaff) {
          let code = l.STAFF_ID;

          if (UserAccountID == code) {
            this.LawsuitStaff.at(0).patchValue({
              LAWSUIT_ID: this.LawsuitID,
              IS_ACTIVE: 1,
              FULL_NAME: `${l.TITLE_SHORT_NAME_TH || ""}${l.FIRST_NAME || ""} ${
                l.LAST_NAME || ""
              }`,
              STAFF_CODE: code,
              OPERATION_POS_CODE: l.OPERATION_POS_CODE || l.OPERATION_POS_CODE,
              OPREATION_POS_NAME: l.OPREATION_POS_NAME || l.OPREATION_POS_NAME,
              OPERATION_DEPT_LEVEL: l.OPERATION_DEPT_LEVEL,
              OPERATION_DEPT_CODE: l.OPERATION_DEPT_CODE,
              OPERATION_DEPT_NAME: `${l.OPERATION_DEPT_NAME}`,
              CONTRIBUTOR_ID: 16,
              TITLE_NAME_TH: l.TITLE_NAME_TH,
              FIRST_NAME: l.FIRST_NAME,
              LAST_NAME: l.LAST_NAME,
              OPERATION_OFFICE_CODE: l.OPERATION_OFFICE_CODE,
              OPERATION_OFFICE_NAME: l.OPERATION_OFFICE_NAME,
              OPERATION_OFFICE_SHORT_NAME: l.OPERATION_OFFICE_SHORT_NAME,
              ID_CARD: l.ID_CARD,
              OPERATION_POS_LEVEL_NAME: l.OPERATION_POS_LEVEL_NAME,
              OPERATION_UNDER_DEPT_CODE: l.OPERATION_UNDER_DEPT_CODE,
              OPERATION_UNDER_DEPT_LEVEL: l.OPERATION_UNDER_DEPT_LEVEL,
              OPERATION_UNDER_DEPT_NAME: l.OPERATION_UNDER_DEPT_NAME,
              OPERATION_WORK_DEPT_CODE: l.OPERATION_WORK_DEPT_CODE,
              OPERATION_WORK_DEPT_LEVEL: l.OPERATION_WORK_DEPT_LEVEL,
              OPERATION_WORK_DEPT_NAME: l.OPERATION_WORK_DEPT_NAME,
              OPREATION_POS_LEVEL: l.OPREATION_POS_LEVEL,
              MANAGEMENT_POS_CODE: l.MANAGEMENT_POS_CODE,
              MANAGEMENT_POS_NAME: l.MANAGEMENT_POS_NAME,
              REMARK: l.REMARK,
              STAFF_ID: l.STAFF_ID,
              STAFF_TYPE: l.STAFF_TYPE,
              STATUS: l.STATUS,
              TITLE_ID: l.TITLE_ID,
              TITLE_NAME_EN: l.TITLE_NAME_EN,
              TITLE_SHORT_NAME_EN: l.TITLE_SHORT_NAME_EN,
              TITLE_SHORT_NAME_TH: l.TITLE_SHORT_NAME_TH,
              IsNewItem: true,
            });
            break;
          }
        }

        this.LawsuitStaff.value.map((m, i) => {
          m.CONTRIBUTOR_NAME = this.staffData[i].as;
        });

        this.setItemFormArray(
          this.LawsuitStaff.value,
          "LawsuitStaff",
          this.lawsuitForm
        );
        //########END SET STAFF IN CASE LAWID == 0 #########

        this.lawsuitRunningLawsuitNo();
      }

      if (res) {
        try {
          //##### SET ISOUT & ISLAW ########

          //#debugging IS_LAWSUIT not set case R is false
          this.lawsuitForm.get("IS_LAWSUIT").setValue(true);

          let islaw = res.IS_LAWSUIT;
          let isout = res.IS_OUTSIDE;

          let IsLawsuitCheck = true;
          let IsOutsideCheck = false;

          if (islaw == 1) {
            IsLawsuitCheck = false;
          }

          if (isout == 1) {
            this.IsLawsuitType = " น. ";
            IsOutsideCheck = true;
          }

          ///### SET EDIT & DEL BTN
          try {
            let prove$;

            let compare$;

            await this.lawsuitService
              .LawsuitProvegetByLawsuitID(this.LawsuitID)
              .then((Prove) => (prove$ = Prove ? Prove.PROVE_ID : null));

            await this.lawsuitService
              .LawsuitComparegetByLawsuitID(this.LawsuitID)
              .then(
                (Compare) => (compare$ = Compare ? Compare.COMPARE_ID : null)
              );

            this.setEditDelButtonOfCase(prove$, compare$);

            this.ProveOrCompareIsCompleted(prove$, compare$);
          } catch (err) {
            console.log(err);
          }

          //### SET LAWSUIT_NO_YEAR ###
          if (res.LAWSUIT_NO_YEAR)
            this.yearList
              .filter(
                (year) =>
                  year.value == parseInt(res.LAWSUIT_NO_YEAR.slice(0, 4))
              )
              .map((m) => (m.selected = true));

          /** SET LAWSUIT_TYPE */
          if (res.LawsuitDetail.length) {
            const d = res.LawsuitDetail;
            this.LAWSUIT_TYPE = d[0]["LAWSUIT_TYPE"];
          }

          /** SET IS_LAWSUIT */
          this.IS_LAWSUIT = res.IS_LAWSUIT;

          //##### END SET ISOUT & ISLAW ########
          await this.lawsuitForm.reset({
            LAWSUIT_ID: res.LAWSUIT_ID,
            INDICTMENT_ID: res.INDICTMENT_ID,
            OFFICE_ID: res.OFFICE_ID,
            OFFICE_CODE: res.OFFICE_CODE,
            OFFICE_NAME: res.OFFICE_NAME,
            IS_LAWSUIT: IsLawsuitCheck,
            REMARK_NOT_LAWSUIT: res.REMARK_NOT_LAWSUIT || "",
            LAWSUIT_NO: res.LAWSUIT_NO == 0 ? "" : res.LAWSUIT_NO,
            LAWSUIT_NO_YEAR: res.LAWSUIT_NO_YEAR,
            LAWSUIT_DATE:
              res.LAWSUIT_DATE != null
                ? setDateMyDatepicker(new Date(res.LAWSUIT_DATE))
                : "",
            TESTIMONY: res.TESTIMONY,
            DELIVERY_DOC_NO_1: res.DELIVERY_DOC_NO_1,
            DELIVERY_DOC_NO_2: res.DELIVERY_DOC_NO_2,
            DELIVERY_DOC_DATE: res.DELIVERY_DOC_DATE,
            IS_OUTSIDE: IsOutsideCheck,
            IS_SEIZE: res.IS_SEIZE,
            IS_ACTIVE: res.IS_ACTIVE,
            CREATE_DATE:
              res.CREATE_DATE != null
                ? setDateMyDatepicker(new Date(res.CREATE_DATE))
                : "",
            CREATE_USER_ACCOUNT_ID: res.CREATE_USER_ACCOUNT_ID,
            UPDATE_DATE: res.UPDATE_DATE,
            UPDATE_USER_ACCOUNT_ID: res.UPDATE_USER_ACCOUNT_ID,
            LawsuitStaff: res.LawsuitStaff,
            LawsuitDetail: res.LawsuitDetail,
            LawsuitArrestIndictmentDetail: this.ArrestIndictment
              .LawsuitArrestIndictmentDetail,

            //##### CUSTOMS ####
            LAWSUIT_TIME: res.LAWSUIT_DATE
              ? res.LAWSUIT_DATE.substring(11, 16)
              : "",
            IsLawsuitCheck: IsLawsuitCheck,
          });
        } catch (err) {
          console.log(err);
        }
        //################### MasOfficeMaingetAll #####################
        try {
          await this.lawsuitService.MasOfficeMaingetAll().then((masoffice) => {
            this.typeheadOffice = masoffice.RESPONSE_DATA || [];
          });
        } catch (err) {
          this.typeheadOffice = [];
          console.log(err);
        }

        let IsLawsuitComplete = res["IS_LAWSUIT"];
        if (
          IsLawsuitComplete == 1 ||
          (IsLawsuitComplete == 0 && Number(this.LawsuitID) > 0)
        ) {
          const staff = res["LawsuitStaff"].filter(
            (item) => item.IS_ACTIVE == 1
          );
          await staff.map((item) => {
            item.FULL_NAME = `${item.TITLE_SHORT_NAME_TH} ${item.FIRST_NAME} ${item.LAST_NAME}`;
          });

          //######################## SET STAFF #############################
          try {
            //#### Set Staff by ConId ####
            this.setFormStaffForConID(0, 4);
            res.LawsuitStaff.map((m, i) => {
              for (var key in m) {
                if (m[key] === "null") m[key] = "";
              }
              m.FULL_NAME =
                m.TITLE_SHORT_NAME_TH + m.FIRST_NAME + " " + m.LAST_NAME;
              if (m.CONTRIBUTOR_ID == 16) {
                this.LawsuitStaff.value[0] = m;
              }
              if (m.CONTRIBUTOR_ID == 17) {
                this.LawsuitStaff.value[1] = m;
              }
              if (m.CONTRIBUTOR_ID == 18) {
                this.LawsuitStaff.value[2] = m;
              }
              if (m.CONTRIBUTOR_ID == 19) {
                this.LawsuitStaff.value[3] = m;
              }
              if (m.CONTRIBUTOR_ID == 20) {
                this.LawsuitStaff.value[4] = m;
              }
              m.IsNewItem = false;
            });
            this.LawsuitStaff.value.map((m, i) => {
              m.CONTRIBUTOR_NAME = this.staffData[i].as;
            });
            this.setItemFormArray(
              this.LawsuitStaff.value,
              "LawsuitStaff",
              this.lawsuitForm
            );
          } catch (e) {
            console.log("error==>", e);
          }
          //######################### END SET STAFF ##############################

          // }
          //####################LawsuitArrestIndictmentDetail######################
          let IsProve = ArrestIndictmentProduct.IS_PROVE;
          this.prove = IsProve;

          let arrList: any[] = [];
          await ArrestIndictmentProduct["LawsuitArrestIndictmentDetail"].map(
            (item, i) => {
              if (item) {
                this.LawsuitTableListShow = true;

                ////LawBreakerName
                let LAWBREAKER_NAME: string = "";
                const t_th = item.TITLE_SHORT_NAME_TH || "";
                const t_en = item.TITLE_SHORT_NAME_EN || "";
                const f = item.FIRST_NAME || "";
                const m = item.MIDDLE_NAME || "";
                const l = item.LAST_NAME || "";
                const comp = item.COMPANY_NAME || "";
                switch (item.PERSON_TYPE) {
                  case 0: //คนไทย
                    LAWBREAKER_NAME = `${t_th}${f} ${m} ${l}`;
                    break;
                  case 1: //ต่างชาติ
                    LAWBREAKER_NAME = `${t_en}${f} ${m} ${l}`;
                    break;
                  case 2: //ผู้ประกอบการ
                    LAWBREAKER_NAME = `${t_th}${comp}`;
                    break;
                }

                /// add LawsuitDetail
                /// set ENTITY_TYPE
                if (item.ENTITY_TYPE == 0) {
                  item.EntityType = "บุคคลธรรมดา";
                } else if (item.ENTITY_TYPE == 1) {
                  item.EntityType = "นิติบุคคล";
                }
                /// add LawbreakerType
                if (item.PERSON_TYPE == 0) {
                  item.LawbreakerType = "คนไทย";
                } else if (item.PERSON_TYPE == 1) {
                  item.LawbreakerType = "คนต่างชาติ";
                } else if (item.PERSON_TYPE == 2) {
                  item.LawbreakerType = "ผู้ประกอบการ";
                }
                /// add LawsuitNoRef
                if (item.ID_CARD) {
                  item.LawsuitNoRef = item.ID_CARD;
                } else if (item.PASSPORT_NO) {
                  item.LawsuitNoRef = item.PASSPORT_NO;
                } else {
                  if (item.COMPANY_REGISTRATION_NO) {
                    item.LawsuitNoRef = item.COMPANY_REGISTRATION_NO;
                  }
                }

                let LawDtl: any;
                try {
                  if (res.LawsuitDetail) {
                    LawDtl = res.LawsuitDetail[i];
                    let lawDtail = {
                      PERSON_ID: item.PERSON_ID,
                      LAWSUIT_DETAIL_ID: LawDtl.LAWSUIT_DETAIL_ID || "",
                      LAWSUIT_ID: this.LawsuitID,
                      INDICTMENT_DETAIL_ID: LawDtl.INDICTMENT_DETAIL_ID || "",
                      COURT_ID: LawDtl.COURT_ID,
                      LAWSUIT_TYPE: LawDtl.LAWSUIT_TYPE,
                      LAWSUIT_END: LawDtl.LAWSUIT_END,
                      COURT_NAME: LawDtl.COURT_NAME || "",
                      UNDECIDE_NO_1: LawDtl.UNDECIDE_NO_1 || "",
                      UNDECIDE_NO_YEAR_1: LawDtl.UNDECIDE_NO_YEAR_1 || "",
                      DECIDE_NO_1: LawDtl.DECIDE_NO_1 || "",
                      DECIDE_NO_YEAR_1: LawDtl.DECIDE_NO_YEAR_1 || "",
                      UNDECIDE_NO_2: LawDtl.UNDECIDE_NO_2 || "",
                      UNDECIDE_NO_YEAR_2: LawDtl.UNDECIDE_NO_YEAR_2 || "",
                      DECIDE_NO_2: LawDtl.DECIDE_NO_2 || "",
                      DECIDE_NO_YEAR_2: LawDtl.DECIDE_NO_YEAR_2 || "",
                      JUDGEMENT_NO: LawDtl.JUDGEMENT_NO || "",
                      JUDGEMENT_NO_YEAR: LawDtl.JUDGEMENT_NO_YEAR || "",
                      JUDGEMENT_DATE: LawDtl.JUDGEMENT_DATE || "",
                      IS_IMPRISON: LawDtl.IS_IMPRISON,
                      IMPRISON_TIME: LawDtl.IMPRISON_TIME || "",
                      IMPRISON_TIME_UNIT: LawDtl.IMPRISON_TIME_UNIT,
                      IS_FINE: LawDtl.IS_FINE,
                      FINE: LawDtl.FINE,
                      IS_PAYONCE: LawDtl.IS_PAYONCE,
                      FINE_DATE: LawDtl.FINE_DATE || "",
                      PAYMENT_PERIOD: LawDtl.PAYMENT_PERIOD,
                      PAYMENT_PERIOD_DUE: LawDtl.PAYMENT_PERIOD_DUE,
                      PAYMENT_PERIOD_DUE_UNIT: LawDtl.PAYMENT_PERIOD_DUE_UNIT,
                      PAYMENT_DATE: LawDtl.PAYMENT_DATE || "",
                      IS_DISMISS: LawDtl.IS_DISMISS,
                      IS_ACTIVE: LawDtl.IS_ACTIVE,
                      UNJUDGEMENT_NO: LawDtl.UNJUDGEMENT_NO || "",
                      UNJUDGEMENT_NO_YEAR: LawDtl.UNJUDGEMENT_NO_YEAR || "",
                      LawsuitPayment: [LawDtl.LawsuitPayment],

                      //Customs
                      A_EntityType: item.EntityType,
                      A_LawbreakerType: item.LawbreakerType,
                      A_LawsuitNoRef: item.LawsuitNoRef,
                      A_LawBrakerFullName: LAWBREAKER_NAME,
                    };

                    arrList.push(lawDtail);
                  }
                } catch (err) {
                  console.log(err);
                }
              }
            }
          );
          this.setItemFormArray(arrList, "LawsuitDetail", this.lawsuitForm);

          //#################LawsuitArrestIndictmentDetail######################
        }

        await this.lawsuitService
          .GetDocumentByCon(4, this.LawsuitID)
          .subscribe(async (res) => {
            this.fileList = [];
            let temp: any;
            temp = res;
            temp.map((m) => {
              if (m.IS_ACTIVE === "1") {
                let f = m;
                let idx = f.FILE_PATH.lastIndexOf(".");
                let FILE_TYPE = idx < 1 ? "" : f.FILE_PATH.substr(idx + 1);
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
                    m.IMAGE_SHOW = this.lawsuitService.getImage(f.DOCUMENT_ID);
                    break;
                }
                this.fileList.push(m);
              }
            });
          });
      } else {
        //===== set table lawsuit detail list in case C =======//
        const lawsuitList = this.jsonCopy(ArrestIndictmentProduct);
        this.lawsuitFormNoData = true;
        let arrList = [];
        lawsuitList["LawsuitArrestIndictmentDetail"].map((item, i) => {
          this.LawsuitTableListShow = true;

          ////LawBreakerName
          let LAWBREAKER_NAME: string = "";
          const t_th = item.TITLE_SHORT_NAME_TH || "";
          const t_en = item.TITLE_SHORT_NAME_EN || "";
          const f = item.FIRST_NAME || "";
          const m = item.MIDDLE_NAME || "";
          const l = item.LAST_NAME || "";
          const comp = item.COMPANY_NAME || "";
          switch (item.PERSON_TYPE) {
            case 0: //คนไทย
              LAWBREAKER_NAME = `${t_th}${f} ${m} ${l}`;
              break;
            case 1: //ต่างชาติ
              LAWBREAKER_NAME = `${t_en}${f} ${m} ${l}`;
              break;
            case 2: //ผู้ประกอบการ
              LAWBREAKER_NAME = `${t_th}${comp}`;
              break;
          }

          // set ProductDesc
          let LAIProd = lawsuitList["LawsuitArrestIndictmentProduct"];
          if (LAIProd != null && LAIProd.length) {
            item.ProductDesc = LAIProd[0].PRODUCT_BRAND_NAME_TH;
          } else {
            item.ProductDesc = "";
          }

          /// set ENTITY_TYPE
          if (item.ENTITY_TYPE == 0) {
            item.EntityType = "บุคคลธรรมดา";
          } else if (item.ENTITY_TYPE == 1) {
            item.EntityType = "นิติบุคคล";
          }

          /// add LawbreakerType
          if (item.PERSON_TYPE == 0) {
            item.LawbreakerType = "คนไทย";
          } else if (item.PERSON_TYPE == 1) {
            item.LawbreakerType = "คนต่างชาติ";
          } else if (item.PERSON_TYPE == 2) {
            item.LawbreakerType = "ผู้ประกอบการ";
          }

          /// add LawsuitNoRef
          if (item.ID_CARD) {
            item.LawsuitNoRef = item.ID_CARD;
          } else if (item.PASSPORT_NO) {
            item.LawsuitNoRef = item.PASSPORT_NO;
          } else {
            if (item.COMPANY_REGISTRATION_NO) {
              item.LawsuitNoRef = item.COMPANY_REGISTRATION_NO;
            }
          }

          let lawDtail = {
            PERSON_ID: item.PERSON_ID,
            LAWSUIT_DETAIL_ID: "",
            LAWSUIT_ID: "",
            INDICTMENT_DETAIL_ID: item.INDICTMENT_DETAIL_ID,
            COURT_ID: "",
            LAWSUIT_TYPE: item.PERSON_ID ? 1 : 2,
            LAWSUIT_END: item.PERSON_ID ? 1 : 2,
            COURT_NAME: "",
            UNDECIDE_NO_1: "",
            UNDECIDE_NO_YEAR_1: "",
            DECIDE_NO_1: "",
            DECIDE_NO_YEAR_1: "",
            UNDECIDE_NO_2: "",
            UNDECIDE_NO_YEAR_2: "",
            DECIDE_NO_2: "",
            DECIDE_NO_YEAR_2: "",
            JUDGEMENT_NO: "",
            JUDGEMENT_NO_YEAR: "",
            JUDGEMENT_DATE: "",
            IS_IMPRISON: "",
            IMPRISON_TIME: "",
            IMPRISON_TIME_UNIT: "",
            IS_FINE: "",
            FINE: "",
            IS_PAYONCE: null,
            FINE_DATE: "", //wait value from judgment UI
            PAYMENT_PERIOD: "",
            PAYMENT_PERIOD_DUE: "",
            PAYMENT_PERIOD_DUE_UNIT: "",
            PAYMENT_DATE: "", //wait value from judgment UI
            IS_DISMISS: "",
            IS_ACTIVE: 1,
            UNJUDGEMENT_NO: "",
            UNJUDGEMENT_NO_YEAR: "",
            LawsuitPayment: this.fb.array([]),

            //======= Customs =======//
            A_EntityType: item.EntityType,
            A_LawbreakerType: item.LawbreakerType,
            A_LawsuitNoRef: item.LawsuitNoRef,
            A_LawBrakerFullName: LAWBREAKER_NAME,
          };

          arrList.push(lawDtail);
        });

        this.setItemFormArray(
          this.ArrestIndictment.LawsuitArrestIndictmentDetail,
          "LawsuitArrestIndictmentDetail",
          this.lawsuitForm
        );
        this.setItemFormArray(arrList, "LawsuitDetail", this.lawsuitForm);
      }
    });
  }
  //#############################################      END  ARRESTGETBYCON     ######################################################
  //##################################################                      #########################################################
  //#################################################################################################################################

  setFormStaffForConID(start: number, end: number) {
    for (let i = start; i <= end; i++) {
      this.LawsuitStaff.at(i).patchValue({
        LAWSUIT_ID: this.LawsuitID,
        IS_ACTIVE: 1,
        FULL_NAME: "",
        STAFF_CODE: "",
        OPERATION_POS_CODE: "",
        OPREATION_POS_NAME: "",
        OPERATION_DEPT_LEVEL: "",
        OPERATION_DEPT_CODE: "",
        OPERATION_DEPT_NAME: "",
        CONTRIBUTOR_ID: "",
        TITLE_NAME_TH: "",
        FIRST_NAME: "",
        LAST_NAME: "",
        OPERATION_OFFICE_CODE: "",
        OPERATION_OFFICE_NAME: "",
        OPERATION_OFFICE_SHORT_NAME: "",
        ID_CARD: "",
        OPERATION_POS_LEVEL_NAME: "",
        OPERATION_UNDER_DEPT_CODE: "",
        OPERATION_UNDER_DEPT_LEVEL: "",
        OPERATION_UNDER_DEPT_NAME: "",
        OPERATION_WORK_DEPT_CODE: "",
        OPERATION_WORK_DEPT_LEVEL: "",
        OPERATION_WORK_DEPT_NAME: "",
        OPREATION_POS_LEVEL: "",
        MANAGEMENT_POS_CODE: "",
        MANAGEMENT_POS_NAME: "",
        REMARK: "",
        STAFF_ID: "",
        STAFF_TYPE: "",
        STATUS: "",
        TITLE_ID: "",
        TITLE_NAME_EN: "",
        TITLE_SHORT_NAME_EN: "",
        TITLE_SHORT_NAME_TH: "",
      });
    }
  }

  isLawsuitCheckReq(e) {
    const newDate = new Date();
    let h = setZero(newDate.getHours());
    let min = setZero(newDate.getMinutes());
    let LawsuitDate =
      Number(this.LawsuitID) === 0 ? setDateMyDatepicker(newDate) : "";
    let LawsuitTime = Number(this.LawsuitID) === 0 ? `${h}:${min}` : "";

    if (e == "check1") {
      this.lawsuitForm.controls["IS_LAWSUIT"].setValue(false);
      this.lawsuitForm.controls["REMARK_NOT_LAWSUIT"].setValue("");
      this.lawsuitForm.controls["LAWSUIT_TIME"].setValue(LawsuitTime);
      this.lawsuitForm.controls["LAWSUIT_DATE"].setValue(LawsuitDate);
    } else {
      this.lawsuitForm.controls["IS_LAWSUIT"].setValue(true);
      this.lawsuitForm.controls["TESTIMONY"].clearValidators();
      this.lawsuitForm.controls["LAWSUIT_NO"].clearValidators();
      this.lawsuitForm.controls["IS_OUTSIDE"].setValue(false);
      this.lawsuitForm.controls["LAWSUIT_TIME"].setValue("");
      this.lawsuitForm.controls["LAWSUIT_DATE"].setValue("");
      this.lawsuitForm.controls["LAWSUIT_NO"].setValue("");
      this.lawsuitForm.controls["TESTIMONY"].setValue("");
    }
  }

  LawsuitTypeChangeAll(Lawsuit_Type: any) {
    const lawsuitType = parseInt(Lawsuit_Type);
    let LawsuitDetail = this.lawsuitForm.get("LawsuitDetail") as FormArray;
    LawsuitDetail.controls.forEach((d) => {
      d.get("LAWSUIT_TYPE").setValue(lawsuitType);
      d.get("LAWSUIT_END").setValue(lawsuitType);
    });
  }

  LawsuitEndChangeAll(Lawsuit_End: any) {
    const LawsuitEnd = parseInt(Lawsuit_End);
    let LawsuitDetail = this.lawsuitForm.get("LawsuitDetail") as FormArray;
    LawsuitDetail.controls.forEach((d) => {
      d.get("LAWSUIT_END").setValue(LawsuitEnd);
    });
  }

  disableLawsuitEndDropdow(Lawsuit_Type: any) {
    switch (parseInt(Lawsuit_Type)) {
      case 0:
        this.lawsuitEnd[0].disable = false;
        this.lawsuitEnd[1].disable = true;
        this.lawsuitEnd[2].disable = false;
        break;
      case 1:
        this.lawsuitEnd[0].disable = true;
        this.lawsuitEnd[1].disable = false;
        this.lawsuitEnd[2].disable = true;
        break;
      case 2:
        this.lawsuitEnd[0].disable = true;
        this.lawsuitEnd[1].disable = true;
        this.lawsuitEnd[2].disable = false;
        break;
    }
  }

  IsOutsideCheckReq() {
    if (this.lawsuitForm.controls["IS_OUTSIDE"].value === true) {
      this.IsLawsuitType = " น. ";
      this.lawsuitForm.controls["REMARK_NOT_LAWSUIT"].clearValidators();
    } else {
      this.IsLawsuitType = "";
    }
  }
  public validateData = function (data) {
    if (data) {
      return data;
    }
    return "";
  };

  formatterStaff = (x: {
    TITLE_NAME_TH: string;
    FIRST_NAME: string;
    LAST_NAME: string;
  }) => `${x.TITLE_NAME_TH || ""}${x.FIRST_NAME || ""} ${x.LAST_NAME || ""}`;

  formatterOffice = (x: { OFFICE_NAME: string }) => x.OFFICE_NAME;

  public searchStaff = (text2$: Observable<string>) =>
    text2$
      .debounceTime(200)
      .distinctUntilChanged()
      .do(() => (this.searching = true))
      .switchMap((term) =>
        this.lawsuitService
          .MasStaffgetByCon_Search({ TEXT_SEARCH: term })
          .do(() => (this.searchFailed = false))
          .catch(() => {
            this.searchFailed = true;
            return Observable.of([]);
          })
      )
      .do(() => (this.searching = false));

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
                  `${v.OFFICE_NAME || ""} ${v.OfficeShortName || ""}`
                    .toLowerCase()
                    .indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      );

  selectItemOffice(e) {
    this.lawsuitForm.patchValue({
      OFFICE_ID: e.item.OFFICE_ID,
      OFFICE_CODE: e.item.OFFICE_CODE,
      OFFICE_NAME: e.item.OFFICE_SHORT_NAME,
    });
  }

  selectItemStaff(e, i) {
    var _ContributorID;
    if (i == 0) _ContributorID = 16;
    else if (i == 1) _ContributorID = 17;
    else if (i == 2) _ContributorID = 18;
    else if (i == 3) _ContributorID = 19;
    else if (i == 4) _ContributorID = 20;
    this.LawsuitStaff.at(i).patchValue({
      IsNewItem: true,
      LAWSUIT_ID: this.LawsuitID,
      CONTRIBUTOR_ID: _ContributorID,
      BIRTH_DATE: e.item.BIRTH_DATE,
      FIRST_NAME: e.item.FIRST_NAME,
      ID_CARD: e.item.ID_CARD,
      IS_ACTIVE: e.item.IS_ACTIVE,
      LAST_NAME: e.item.LAST_NAME,
      FULL_NAME: `${e.item.TITLE_SHORT_NAME_TH || ""}${
        e.item.FIRST_NAME || ""
      } ${e.item.LAST_NAME || ""}`,
      MANAGEMENT_DEPT_CODE: e.item.MANAGEMENT_DEPT_CODE,
      MANAGEMENT_DEPT_LEVEL: e.item.MANAGEMENT_DEPT_LEVEL,
      MANAGEMENT_DEPT_NAME: e.item.MANAGEMENT_DEPT_NAME,
      MANAGEMENT_OFFICE_CODE: e.item.MANAGEMENT_OFFICE_CODE,
      MANAGEMENT_OFFICE_NAME: e.item.MANAGEMENT_OFFICE_NAME,
      MANAGEMENT_OFFICE_SHORT_NAME: e.item.MANAGEMENT_OFFICE_SHORT_NAME,
      MANAGEMENT_POS_CODE: e.item.MANAGEMENT_POS_CODE,
      MANAGEMENT_POS_LEVEL: e.item.MANAGEMENT_POS_LEVEL,
      MANAGEMENT_POS_LEVEL_NAME: e.item.MANAGEMENT_POS_LEVEL_NAME,
      MANAGEMENT_POS_NAME: e.item.MANAGEMENT_POS_NAME,
      MANAGEMENT_UNDER_DEPT_CODE: e.item.MANAGEMENT_UNDER_DEPT_CODE,
      MANAGEMENT_UNDER_DEPT_LEVEL: e.item.MANAGEMENT_UNDER_DEPT_LEVEL,
      MANAGEMENT_UNDER_DEPT_NAME: e.item.MANAGEMENT_UNDER_DEPT_NAME,
      MANAGEMENT_WORK_DEPT_CODE: e.item.MANAGEMENT_WORK_DEPT_CODE,
      MANAGEMENT_WORK_DEPT_LEVEL: e.item.MANAGEMENT_WORK_DEPT_LEVEL,
      MANAGEMENT_WORK_DEPT_NAME: e.item.MANAGEMENT_WORK_DEPT_NAME,
      OPERATION_DEPT_CODE: e.item.OPERATION_DEPT_CODE,
      OPERATION_DEPT_LEVEL: e.item.OPERATION_DEPT_LEVEL,
      OPERATION_DEPT_NAME: e.item.OPERATION_DEPT_NAME,
      OPERATION_OFFICE_CODE: e.item.OPERATION_OFFICE_CODE,
      OPERATION_OFFICE_NAME: e.item.OPERATION_OFFICE_NAME,
      OPERATION_OFFICE_SHORT_NAME: e.item.OPERATION_OFFICE_SHORT_NAME,
      OPERATION_POS_CODE: e.item.OPERATION_POS_CODE,
      OPERATION_POS_LEVEL_NAME: e.item.OPERATION_POS_LEVEL_NAME,
      OPERATION_UNDER_DEPT_CODE: e.item.OPERATION_UNDER_DEPT_CODE,
      OPERATION_UNDER_DEPT_LEVEL: e.item.OPERATION_UNDER_DEPT_LEVEL,
      OPERATION_UNDER_DEPT_NAME: e.item.OPERATION_UNDER_DEPT_NAME,
      OPERATION_WORK_DEPT_CODE: e.item.OPERATION_WORK_DEPT_CODE,
      OPERATION_WORK_DEPT_LEVEL: e.item.OPERATION_WORK_DEPT_LEVEL,
      OPERATION_WORK_DEPT_NAME: e.item.OPERATION_WORK_DEPT_NAME,
      OPREATION_POS_LEVEL: e.item.OPREATION_POS_LEVEL,
      OPREATION_POS_NAME: e.item.OPREATION_POS_NAME,
      REMARK: e.item.REMARK,
      REPRESENT_DEPT_CODE: e.item.REPRESENT_DEPT_CODE,
      REPRESENT_DEPT_LEVEL: e.item.REPRESENT_DEPT_LEVEL,
      REPRESENT_DEPT_NAME: e.item.REPRESENT_DEPT_NAME,
      REPRESENT_OFFICE_CODE: e.item.REPRESENT_OFFICE_CODE,
      REPRESENT_OFFICE_NAME: e.item.REPRESENT_OFFICE_NAME,
      REPRESENT_OFFICE_SHORT_NAME: e.item.REPRESENT_OFFICE_SHORT_NAME,
      REPRESENT_POS_CODE: e.item.REPRESENT_POS_CODE,
      REPRESENT_POS_LEVEL: e.item.REPRESENT_POS_LEVEL,
      REPRESENT_POS_LEVEL_NAME: e.item.REPRESENT_POS_LEVEL_NAME,
      REPRESENT_POS_NAME: e.item.REPRESENT_POS_NAME,
      REPRESENT_UNDER_DEPT_CODE: e.item.REPRESENT_UNDER_DEPT_CODE,
      REPRESENT_UNDER_DEPT_LEVEL: e.item.REPRESENT_UNDER_DEPT_LEVEL,
      REPRESENT_UNDER_DEPT_NAME: e.item.REPRESENT_UNDER_DEPT_NAME,
      REPRESENT_WORK_DEPT_CODE: e.item.REPRESENT_WORK_DEPT_CODE,
      REPRESENT_WORK_DEPT_LEVEL: e.item.REPRESENT_WORK_DEPT_LEVEL,
      REPRESENT_WORK_DEPT_NAME: e.item.REPRESENT_WORK_DEPT_NAME,
      STAFF_CODE: e.item.STAFF_CODE,
      // STAFF_ID: e.item.STAFF_ID,
      STAFF_TYPE: e.item.STAFF_TYPE,
      STATUS: e.item.STATUS,
      TITLE_ID: e.item.TITLE_ID,
      TITLE_NAME_EN: e.item.TITLE_NAME_EN,
      TITLE_NAME_TH: e.item.TITLE_NAME_TH,
      TITLE_SHORT_NAME_EN: e.item.TITLE_SHORT_NAME_EN,
      TITLE_SHORT_NAME_TH: e.item.TITLE_SHORT_NAME_TH,
    });
  }

  blurSelectItemOffice(input) {
    let val = input.value;
    if (!val)
      this.lawsuitForm.patchValue({
        OFFICE_ID: "",
        OFFICE_CODE: "",
        OFFICE_NAME: "",
        OFFICE_SHORT_NAME: "",
      });
  }

  onDeleteStaff(i: number) {
    let LawsuitStaff = this.LawsuitStaff.at(i).value;
    let mStaffId = LawsuitStaff.STAFF_ID == "" ? null : LawsuitStaff.STAFF_ID;
    const mLawsuitID = Number(this.LawsuitID);

    if (mLawsuitID === 0) this.clearStaffOfindex(i);
    else if (mLawsuitID > 0) {
      if (mStaffId) {
        const mStaffDel = Object.assign({ STAFF_ID: LawsuitStaff.STAFF_ID });
        this.DelStaff.push(mStaffDel);
      }

      this.clearStaffOfindex(i);
    }
  }

  // deleteStaff(ev, i) {
  //   let LawsuitStaff = this.LawsuitStaff.at(i).value;
  //   let mStaffRefId = LawsuitStaff.STAFF_REF_ID === "" ? null : LawsuitStaff.STAFF_REF_ID;
  //   const nLawsuitID = Number(this.LawsuitID);

  //   if (nLawsuitID === 0) {
  //     if (!ev.value)
  //       this.clearStaffOfindex(i);

  //   } else if (nLawsuitID > 0) {
  //     if (!ev.value && mStaffRefId != null) {
  //       const mStaffDel = Object.assign({ STAFF_ID: LawsuitStaff.STAFF_ID });
  //       this.DelStaff.push(mStaffDel);
  //       this.clearStaffOfindex(i);

  //     } else {
  //       if (!ev.value)
  //         this.clearStaffOfindex(i);
  //     }
  //   }
  // }

  clearStaffOfindex(i) {
    this.LawsuitStaff.at(i).patchValue({
      NOTICE_ID: "",
      BIRTH_DATE: "",
      FIRST_NAME: "",
      ID_CARD: "",
      IS_ACTIVE: "",
      LAST_NAME: "",
      FULL_NAME: "",
      MANAGEMENT_DEPT_CODE: "",
      MANAGEMENT_DEPT_LEVEL: "",
      MANAGEMENT_DEPT_NAME: "",
      MANAGEMENT_OFFICE_CODE: "",
      MANAGEMENT_OFFICE_NAME: "",
      MANAGEMENT_OFFICE_SHORT_NAME: "",
      MANAGEMENT_POS_CODE: "",
      MANAGEMENT_POS_LEVEL: "",
      MANAGEMENT_POS_LEVEL_NAME: "",
      MANAGEMENT_POS_NAME: "",
      MANAGEMENT_UNDER_DEPT_CODE: "",
      MANAGEMENT_UNDER_DEPT_LEVEL: "",
      MANAGEMENT_WORK_DEPT_CODE: "",
      MANAGEMENT_WORK_DEPT_LEVEL: "",
      MANAGEMENT_WORK_DEPT_NAME: "",
      OPERATION_DEPT_CODE: "",
      OPERATION_DEPT_LEVEL: "",
      OPERATION_DEPT_NAME: "",
      OPERATION_OFFICE_CODE: "",
      OPERATION_OFFICE_NAME: "",
      OPERATION_OFFICE_SHORT_NAME: "",
      OPERATION_POS_CODE: "",
      OPERATION_POS_LEVEL_NAME: "",
      OPERATION_UNDER_DEPT_CODE: "",
      OPERATION_UNDER_DEPT_LEVEL: "",
      OPERATION_UNDER_DEPT_NAME: "",
      OPERATION_WORK_DEPT_CODE: "",
      OPERATION_WORK_DEPT_LEVEL: "",
      OPERATION_WORK_DEPT_NAME: "",
      OPREATION_POS_LEVEL: "",
      OPREATION_POS_NAME: "",
      REMARK: "",
      REPRESENT_DEPT_CODE: "",
      REPRESENT_DEPT_LEVEL: "",
      REPRESENT_DEPT_NAME: "",
      REPRESENT_OFFICE_CODE: "",
      REPRESENT_OFFICE_NAME: "",
      REPRESENT_OFFICE_SHORT_NAME: "",
      REPRESENT_POS_CODE: "",
      REPRESENT_POS_LEVEL: "",
      REPRESENT_POS_LEVEL_NAME: "",
      REPRESENT_POS_NAME: "",
      REPRESENT_UNDER_DEPT_CODE: "",
      REPRESENT_UNDER_DEPT_LEVEL: "",
      REPRESENT_UNDER_DEPT_NAME: "",
      REPRESENT_WORK_DEPT_CODE: "",
      REPRESENT_WORK_DEPT_LEVEL: "",
      REPRESENT_WORK_DEPT_NAME: "",
      STAFF_CODE: "",
      STAFF_ID: "",
      STAFF_TYPE: "",
      STATUS: "",
      TITLE_ID: "",
      TITLE_NAME_EN: "",
      TITLE_NAME_TH: "",
      TITLE_SHORT_NAME_EN: "",
      TITLE_SHORT_NAME_TH: "",
      CONTRIBUTOR_ID: "",
      IsNewItem: false,
    });
  }

  Judgment(item: any, index: number) {
    let LawsuitNoticeArr: any[] = [];
    if (this.LawsuitNotice) {
      this.LawsuitNotice.map((m) => {
        LawsuitNoticeArr.push({
          NOTICE_ID: m.NOTICE_ID,
        });
      });
    }

    const dialogRef = this.dialog.open(DialogJudgment, {
      width: "90%",
      // maxWidth: 'none',
      // height: '750px',
      // maxHeight: 'none',
      data: {
        LawsuitNotice: LawsuitNoticeArr,
        lawsuitArrest: item,
        index: index,
        indicmentID: this.IndictmentID,
        LawsuitID: this.LawsuitID,
        yearList: this.yearList,
        JudgmentEditField: this.OnEditField_Judgment,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("B afterClosed dialogRef : ", result);
      let PAYMENT_DELETE$ = [];
      if (result) {
        this.LawsuitDetail.at(result.index).patchValue(result.LawsuitDetailFG);
        PAYMENT_DELETE$ = result.LawsuitDetailFG["PAYMENT_DELETE"];
        this.PAYMENT_DELETE = PAYMENT_DELETE$;
      }
    });
  }

  async clickPrint() {
    this.modal = this.ngbModel.open(this.printDocModel, {
      size: "lg",
      centered: true,
    });
  }

  async clickEdit() {
    if (this.ProveOrCompareIsCompleted$) {
      this.OnEdit_LawsuitType = false;
      this.OnEdit_LawsuitEnd = false;
      this.OnEdit_JudgmentBtn = false;

      this.navState.edit = false;
      this.navState.print = false;
      this.navState.delete = false;
      this.navState.save = true;
      this.navState.cancel = true;
    } else {
      this.OnEdit = false;
      this.OnEdit_LawsuitType = false;
      this.OnEdit_LawsuitEnd = false;
      this.OnEdit_JudgmentBtn = false;

      this.navState.edit = false;
      this.navState.print = false;
      this.navState.save = true;
      this.navState.cancel = true;
      this.navState.delete = false;
    }
    this.OnEditField_Judgment = false;
  }

  clickDelete() {
    this.navState.delete = false;
    this.onDelete();
  }

  async clickSave() {
    let isLawBoolean: boolean = this.lawsuitForm.controls["IS_LAWSUIT"].value;
    if (!isLawBoolean) {
      let lawsuitNo = this.lawsuitForm.controls["LAWSUIT_NO"].value;
      if (!lawsuitNo) {
        Swal({
          text: 'กรุณาระบุข้อมูล "เลขที่คดี"',
          type: "warning",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "ตกลง",
        });
        this.LawsuitConf.next(true);
        this.isReq_LawsuitNo.next(true);
        return;
      }

      let lawsuitDate = this.lawsuitForm.controls["LAWSUIT_DATE"].value;
      if (!lawsuitDate) {
        Swal({
          text: 'กรุณาระบุข้อมูล "วันที่รับคดี"',
          type: "warning",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "ตกลง",
        });
        this.LawsuitConf.next(true);
        this.isReq_LawsuitDate.next(true);
        return;
      }

      let lawsuitTime = this.lawsuitForm.controls["LAWSUIT_TIME"].value;
      if (!lawsuitTime) {
        Swal({
          text: 'กรุณาระบุข้อมูล "เวลา"',
          type: "warning",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "ตกลง",
        });
        this.LawsuitConf.next(true);
        this.isReq_LawsuitTime.next(true);
        return;
      }

      let lawsuitTimeInvalid = this.lawsuitForm.controls["LAWSUIT_TIME"]
        .invalid;
      if (lawsuitTimeInvalid) {
        Swal({
          text: 'กรุณาระบุข้อมูล "เวลา hh:mm"',
          type: "warning",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "ตกลง",
        });
        this.LawsuitConf.next(true);
        this.isReq_LawsuitTime.next(true);
        return;
      }

      let offficeName = this.lawsuitForm.controls["OFFICE_NAME"].value;
      if (!offficeName) {
        Swal({
          text: 'กรุณาระบุข้อมูล "ส่วนราชการ"',
          type: "warning",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "ตกลง",
        });
        this.LawsuitConf.next(true);
        this.isReq_OfficeName.next(true);
        return;
      }

      let testimony = this.lawsuitForm.controls["TESTIMONY"].value;
      if (!testimony) {
        Swal({
          text: 'กรุณาระบุข้อมูล "คำให้การผู้กล่าวโทษ"',
          type: "warning",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "ตกลง",
        });
        this.LawsuitConf.next(true);
        this.isReq_Testimony.next(true);
        return;
      }
    } else {
      let REMARK_NOT_LAWSUIT = this.lawsuitForm.controls["REMARK_NOT_LAWSUIT"]
        .value;
      if (!REMARK_NOT_LAWSUIT) {
        Swal({
          text: 'กรุณาระบุข้อมูล "ไม่รับคดี เหตุผล"',
          type: "warning",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "ตกลง",
        });
        this.LawsuitConf.next(true);
        this.isReq_REMARK.next(true);
        return;
      }
    }
    let staff = this.LawsuitStaff.getRawValue();
    if (!staff[0].FULL_NAME) {
      Swal({
        text: 'กรุณาระบุข้อมูล "ผู้รับคดี"',
        type: "warning",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "ตกลง",
      });
      this.LawsuitStf.next(true);
      this.isRequired = true;
      return;
    }

    //####Revice Date befor save #####
    if (Number(this.LawsuitID) == 0) {
      //#### In Case C ####

      //##### Set Staff NewItem #####
      const staffs = this.LawsuitStaff.value;
      let arrStaff: any[] = [];
      for (let i in staffs) {
        let l = staffs[i];
        if (l.IsNewItem) {
          arrStaff.push(l);
        }
      }

      this.setItemFormArray(arrStaff, "LawsuitStaff", this.lawsuitForm);

      //#### Set DateTime ####
      const newDate = new Date();

      let _CREATE_DATE = this.toDateTZ(newDate);
      let _LAWSUIT_DATE =
        this.lawsuitForm.get("LAWSUIT_DATE").value != null || ""
          ? this.lawsuitForm.get("LAWSUIT_DATE").value
          : "";
      _LAWSUIT_DATE = convertDateForSave(
        getDateMyDatepicker(this.lawsuitForm.get("LAWSUIT_DATE").value)
      );
      _LAWSUIT_DATE =
        _LAWSUIT_DATE != null || ""
          ? `${_LAWSUIT_DATE} ${
              this.lawsuitForm.get("LAWSUIT_TIME").value
            }:00.000`
          : "";

      this.lawsuitForm.controls["CREATE_DATE"].setValue(_CREATE_DATE);
      this.lawsuitForm.controls["LAWSUIT_DATE"].setValue(_LAWSUIT_DATE);
      this.lawsuitForm.controls["INDICTMENT_ID"].setValue(this.IndictmentID);

      this.OnCreate();
    } else {
      //#### In Case R ####

      //#### Set LawsuitDetail ####
      const newDate = new Date();

      let _LAWSUIT_DATE =
        this.lawsuitForm.value.LAWSUIT_DATE != null || ""
          ? this.lawsuitForm.value.LAWSUIT_DATE
          : "";
      _LAWSUIT_DATE = convertDateForSave(
        getDateMyDatepicker(this.lawsuitForm.value.LAWSUIT_DATE)
      );

      let R_LAWSUIT_NO_YEAR = `${
        this.lawsuitForm.value.LAWSUIT_NO_YEAR
      } ${newDate.getMilliseconds()}`;
      let R_LAWSUIT_DATE =
        this.lawsuitForm.value.LAWSUIT_DATE == null
          ? ""
          : `${_LAWSUIT_DATE} ${
              this.lawsuitForm.value.LAWSUIT_TIME
            }:${R_LAWSUIT_NO_YEAR.substring(
              17,
              19
            )} ${newDate.getMilliseconds()}`;
      let R_DELIVERY_DOC_DATE =
        this.lawsuitForm.value.DELIVERY_DOC_DATE == null
          ? ""
          : `${
              this.lawsuitForm.value.DELIVERY_DOC_DATE
            } ${newDate.getMilliseconds()}`;
      let R_DELIVERY_DOC_NO_1 =
        this.lawsuitForm.value.DELIVERY_DOC_NO_1 == null
          ? ""
          : this.lawsuitForm.value.DELIVERY_DOC_NO_1;
      let R_DELIVERY_DOC_NO_2 =
        this.lawsuitForm.value.DELIVERY_DOC_NO_2 == null
          ? ""
          : this.lawsuitForm.value.DELIVERY_DOC_NO_2;

      this.lawsuitForm.controls["UPDATE_DATE"].setValue(this.toDateTZ(newDate));
      this.lawsuitForm.controls["LAWSUIT_DATE"].setValue(R_LAWSUIT_DATE);
      this.lawsuitForm.controls["LAWSUIT_NO_YEAR"].setValue(R_LAWSUIT_NO_YEAR);
      this.lawsuitForm.controls["DELIVERY_DOC_DATE"].setValue(
        R_DELIVERY_DOC_DATE
      );
      this.lawsuitForm.controls["DELIVERY_DOC_NO_1"].setValue(
        R_DELIVERY_DOC_NO_1
      );
      this.lawsuitForm.controls["DELIVERY_DOC_NO_2"].setValue(
        R_DELIVERY_DOC_NO_2
      );

      this.OnRevice();
    }
  }
  async clickCancel() {
    this.onCancel();
  }
  async clickNextPage() {
    this.navState.next = false;
    this.onNextPage();
  }

  private showSwal(msg: string, iconType: any) {
    this.alertSwal.text = msg;
    this.alertSwal.type = iconType;
    this.alertSwal.show();
  }

  setYear() {
    let newDate = new Date();
    let temp = newDate.getFullYear() + 543;
    let YearSelected = (acc, curr) => (acc == curr ? true : false);
    for (let i = 0; i <= 1; i++) {
      let _temp = temp - i;
      let js: any = {
        year: _temp,
        value: _temp - 543,
        selected: YearSelected(newDate.getFullYear(), _temp - 543),
      };
      this.yearList.push(js);
    }
    /// set yesr in case 'C'
    const year = this.yearList.find((f) =>
      YearSelected(newDate.getFullYear(), f.value)
    ).value;
    this.changeyear(year);
  }

  changeyear(ev: Number): void {
    const newDate = new Date();
    let m = setZero(newDate.getMonth() + 1);
    let d = setZero(newDate.getDate());
    let h = setZero(newDate.getHours());
    let min = setZero(newDate.getMinutes());
    let s = setZero(newDate.getSeconds());
    let ms = newDate.getMilliseconds();
    const seted = `${Number(ev)}-${m}-${d} ${h}:${min}:${s}.${ms}`;
    this.lawsuitForm.controls["LAWSUIT_NO_YEAR"].setValue(seted);
  }

  // ##################################Document##################################
  fileList: Document[] = [];
  owlOption = {
    items: 5,
    nav: true,
    dots: false,
    slideBy: 5,
    margin: 10,
    responsiveClass: true,
  };

  openModal(e) {
    this.modal = this.ngbModel.open(e, { size: "lg", centered: true });
  }

  deleteItem(i: number) {
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
        const doc = this.fileList[i];

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
      }
    });
  }

  DownloadItem(item) {
    this.preLoaderService.setShowPreloader(true);
    this.lawsuitService
      .downloadFile(item.DOCUMENT_ID)
      .subscribe((data) => this.handleDownload(data, item));
  }

  handleDownload(data: any, item: any) {
    this.preLoaderService.setShowPreloader(false);
    var blob = URL.createObjectURL(new Blob([data], { type: "*/*" }));
    saveAs(blob, item.DOCUMENT_NAME);
  }

  Output(event: Document) {
    this.fileList = [...this.fileList, event];
  }
  // ##################################End Document##################################

  toggleCollapse(event: BehaviorSubject<Boolean>): void {
    if (event.getValue()) event.next(false);
    else event.next(true);
  }

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

  isNumberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  validateFirstZelo(event: any, formControl: string, formGroup: FormGroup) {
    if (/^0/.test(event.value))
      formGroup.controls[formControl].setValue(event.value.replace(/^0/, ""));
  }

  public canOfficeSearch(): boolean {
    const OFFICE_CODE_SLICE = this.officeCode.slice(0, 2);
    return OFFICE_CODE_SLICE == "00" ? false : true;
  }

  jsonCopy(Obj: any) {
    return JSON.parse(JSON.stringify(Obj));
  }

  setEditDelButtonOfCase(prove, compare) {
    if (prove) {
      this.navState.edit = true;
      this.navState.delete = false;
    }
    if (compare) {
      // this.navState.edit = false;
      this.navState.delete = false;
    }
  }

  ProveOrCompareIsCompleted(prove, compare) {
    this.ProveOrCompareIsCompleted$ = [prove, compare].some((e) => e);
  }

  setToFixed(PRODUCT_GROUP_ID: string) {
    let toFixed: string;
    switch (PRODUCT_GROUP_ID.toString()) {
      case "1":
      case "2":
      case "13":
        toFixed = "1.3";
        break;
      default:
        toFixed = "1.0";
        break;
    }
    return toFixed;
  }

  public filterDuplicate(array: any[], prop: string) {
    return array.filter(
      (v, i, a) => a.map((x) => x[prop]).indexOf(v[prop]) === i
    );
  }
}
