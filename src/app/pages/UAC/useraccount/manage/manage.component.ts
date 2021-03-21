import { ListStaffModel } from "./list-staff-model";
import { async } from "@angular/core/testing";

import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  ValidatorFn
} from "@angular/forms";
import { NavigationService } from "app/shared/header-navigation/navigation.service";
import { Subject } from "rxjs";
import { Message } from "app/config/message";
import { Router, ActivatedRoute } from "@angular/router";
import { PreloaderService } from "../../../../shared/preloader/preloader.component";
import { SidebarService } from "../../../../shared/sidebar/sidebar.component";
import swal from "sweetalert2";
import { ManageService } from "./manage.service";
import * as uacdatamodel from "../../uac-user-datamodel";
import { UserAccountManagement } from "./user-account-management-model";
import { MasStaffService } from "app/pages/investigation/services/mas-staff.service";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

@Component({
  selector: "app-user-manage",
  templateUrl: "./manage.component.html",
  styleUrls: ["./manage.component.scss"],
  encapsulation: ViewEncapsulation.Emulated
})
export class UserManageComponent implements OnInit {
  form: FormGroup;
  // private userAccountID: number;
  private userAccountId: number = 0;
  UserName: string;
  name: string;
  positionName: string;
  officeName: string;
  staffID: number;
  showEditField: any;

  private userDetail: UserAccountManagement = null;

  private visableDeleteBtn: Boolean = true;
  private visableEditBtn: Boolean = true;
  private visableUpdateBtn: Boolean = false;
  private visableCancelBtn: Boolean = false;

  private visableUserDetail: Boolean = false;

  private visableCreateUserAccount: Boolean = false;

  private userAccountRequest: uacdatamodel.UserAccountinsAllRequest;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(
    private navService: NavigationService,
    private router: Router,
    private sidebarService: SidebarService,
    private preloader: PreloaderService,
    private manageService: ManageService,
    private activeRoute: ActivatedRoute
  ) {
    // set button false
    this.navService.setEditButton(false);
    this.navService.setDeleteButton(false);
    this.navService.setPrintButton(false);
    this.navService.setSaveButton(false);
    this.navService.setCancelButton(false);
    this.navService.setNextPageButton(false);
    this.navService.setSearchBar(false);
    // set button true
    this.navService.setSaveButton(true);
    this.navService.setCancelButton(true);

    //let userAccountID: number = +localStorage.getItem("userAccount");

    //this.userAccountRequest.uacUserpermissions = new
  }
  public programList: Array<any> = new Array<any>();
  private test: Array<any> = [
    {
      MODULE_ID: 1,
      MODULE_NAME: "1. งานปราบปราม",
      MODULE_SEQUENCE: 0,
      MODULE_CODE: "ILG60-01-00",
      MODULE_DETAIL: [
        {
          MODULE_DETAIL_ID: 2,
          MODULE_DETAIL_CODE: "ILG60-01-00-02",
          MODULE_DETAIL_NAME: "1.2 ใบรับรองความบริสุทธิ์",
          MODULE_DETAIL_SEQUENCE: 0
        },
        {
          MODULE_DETAIL_ID: 2,
          MODULE_DETAIL_CODE: "ILG60-01-00-01",
          MODULE_DETAIL_NAME: "1.0 งานสืบสวน",
          MODULE_DETAIL_SEQUENCE: 0
        }
      ]
    },
    {
      MODULE_ID: 2,
      MODULE_NAME: "2 บันทึกจับกุม",
      MODULE_SEQUENCE: 0,
      MODULE_CODE: "ILG60-02-00",
      MODULE_DETAIL: []
    },
    {
      MODULE_ID: 3,
      MODULE_NAME: "3 TEST",
      MODULE_SEQUENCE: 0,
      MODULE_CODE: "ILG60-01",
      MODULE_DETAIL: []
    }
  ];

  private username: string = "";
  private nameOfUser: string = "";
  private position: string = "";
  private deparment: string = "";

  private test2: Array<any> = [];
  private test3: Array<any> = [];
  private moduleForm: Array<any> = [];
  private listModuleAll: Array<any> = [];
  private programListTemplate: Array<any> = [
    {
      programType: "Entry",
      programCode: "ILG60-01-00",
      programName: "งานสืบสวน",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Entry",
      programCode: "ILG60-02-00",
      programName: "ใบแจ้งความนำจับ",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Entry",
      programCode: "ILG60-03-00",
      programName: "งานจับกุม",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Entry",
      programCode: "ILG60-04-00",
      programName: "บันทึกรับคำกล่าวโทษ",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Entry",
      programCode: "ILG60-05-00",
      programName: "งานตรวจรับและพิสูจน์ของกลาง",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Entry",
      programCode: "ILG60-06-00",
      programName: "งานเปรียบเทียบและชำระค่าปรับ",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Entry",
      programCode: "ILG60-07-00",
      programName: "งานนำส่งรายได้",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Entry",
      programCode: "ILG60-08-01",
      programName: "คำร้องขอรับเงินสินบน",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Entry",
      programCode: "ILG60-08-02",
      programName: "คำร้องขอรับเงินรางวัล",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Entry",
      programCode: "ILG60-09-00",
      programName: "งานปรับเพิ่ม-ลดค่าปรับ",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Entry",
      programCode: "ILG60-10-00",
      programName: "งานตรวจรับของกลางเพื่อเก็บรักษา",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Entry",
      programCode: "ILG60-11-00",
      programName: "งานคืนของกลาง",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Entry",
      programCode: "ILG60-12-00",
      programName: "งานจัดเก็บของกลางเข้าพิพิธภัณฑ์",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Entry",
      programCode: "ILG60-13-00",
      programName: "งานขายทอดตลาด",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Entry",
      programCode: "ILG60-14-00",
      programName: "งานทำลายของกลาง",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Entry",
      programCode: "ILG60-15-00",
      programName: "งานนำของกลางออกจากคลัง",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Entry",
      programCode: "ILG60-16-00",
      programName: "งานโอนย้ายของกลาง",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Entry",
      programCode: "ILG60-17-00",
      programName: "งานทะเบียนบัญชีสินค้าและของกลาง",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Entry",
      programCode: "ILG60-18-00",
      programName: "หมายค้น",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Entry",
      programCode: "ILG60-19-00",
      programName: "ใบรับรองความบริสุทธิ์",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Master",
      programCode: "ILG60-99-01",
      programName: "ข้อมูลผู้ต้องสงสัย",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Master",
      programCode: "ILG60-99-02",
      programName: "ข้อมูลผู้ต้องหา",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Master",
      programCode: "ILG60-99-03",
      programName: "ข้อมูลเชื้อชาติ",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Master",
      programCode: "ILG60-99-04",
      programName: "ข้อมูลสัญชาติ",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Master",
      programCode: "ILG60-99-05",
      programName: "ข้อมูลศาสนา",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Master",
      programCode: "ILG60-99-06",
      programName: "ข้อมูลประเทศ",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Master",
      programCode: "ILG60-99-07",
      programName: "ข้อมูลคำนำหน้าชื่อ",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Master",
      programCode: "ILG60-99-08",
      programName: "ข้อมูลศาล",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Master",
      programCode: "ILG60-99-09",
      programName: "ข้อมูลสัดส่วนเงินสินบน รางวัล และส่งคลัง",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Master",
      programCode: "ILG60-99-10",
      programName: "ข้อมูลสัดส่วนเงินรางวัล",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Master",
      programCode: "ILG60-99-11",
      programName: "ข้อมูลคลังสินค้า",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Master",
      programCode: "ILG60-99-12",
      programName: "ข้อมูลหมวด/ส่วนของพรบ.",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Master",
      programCode: "ILG60-99-13",
      programName: "ข้อมูลมาตราของพรบ.",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Master",
      programCode: "ILG60-99-14",
      programName: "ข้อมูลข้อย่อย/วรรคของพรบ.",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Master",
      programCode: "ILG60-99-15",
      programName: "ข้อมูลหมวดของสินค้า",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Master",
      programCode: "ILG60-99-16",
      programName: "ข้อมูลประเภทของสินค้า",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Master",
      programCode: "ILG60-99-17",
      programName: "ข้อมูลยี่ห้อหลักของสินค้า",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Master",
      programCode: "ILG60-99-18",
      programName: "ข้อมูลยี่ห้อรองของสินค้า",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Master",
      programCode: "ILG60-99-19",
      programName: "ข้อมูลรุ่นของสินค้า",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    },
    {
      programType: "Master",
      programCode: "ILG60-99-20",
      programName: "ข้อมูลหน่วย",
      isCreate: false,
      isRead: false,
      isUpdate: false,
      isDelete: false
    }
  ];
  private positionList: Array<any> = [];
  
  public userPermissionResponse: uacdatamodel.UacUserpermissionResponse;

  public getProgramCodeList(programType: string): Array<any> {
    return this.programList.filter(item => item.programType == programType);
  }
  listStaff: ListStaffModel;
  myControl = new FormControl();
  options: Array<any> = [
    { programType: "Master", programCode: "AAA" },
    { programType: "Master", programCode: "BBB" }
  ];
  filteredOptions: Observable<any>;
  ngOnInit() {
    this.activeRoute.params.subscribe(data => {
      this.userAccountId = data["accountId"];
      // console.log(this.userAccountId);
    });

    if (this.userAccountId == 0) {
      this.getAllModule();
      this.visableEditBtn = false;
      this.visableDeleteBtn = false;
      this.visableUpdateBtn = true;
      this.visableCancelBtn = false;
      this.visableCreateUserAccount = true;
      this.searchStaff("อรสา").then(() => {
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value))
        );
      });
      this.visableUserDetail = true;
    } else {
      this.visableUserDetail = false;
      this.getConUserAccount(this.userAccountId);
    }
  }
  private _filter(value: string) {
    const filterValue = value.toLowerCase();

    this.searchStaff(value);
    // console.log(this.listStaff.RESPONSE_DATA);

    if (this.listStaff.RESPONSE_DATA.length > 0) {
      return this.listStaff.RESPONSE_DATA.filter(
        option =>
          option.FIRST_NAME.toLowerCase().includes(filterValue) ||
          option.LAST_NAME.toLowerCase().includes(filterValue) ||
          option.TITLE_NAME_TH.toLowerCase().includes(filterValue)
      );
    }
  }
  async searchStaff(value) {
    const params = {
      TEXT_SEARCH: value
    };
    await this.manageService.searchStaff(params).then(data => {
      this.listStaff = data as ListStaffModel;
    });
  }
  async searchStaffDetail() {
    const params = {
      TEXT_SEARCH: "",
      STAFF_ID: this.staffID
    };
    await this.manageService.searchStaff(params).then(data => {
      const detail = data as ListStaffModel;
      if (detail.RESPONSE_DATA.length > 0) {
        this.position = detail.RESPONSE_DATA[0].OPREATION_POS_NAME;
        this.deparment = detail.RESPONSE_DATA[0].OPERATION_DEPT_NAME;
        this.name =
          detail.RESPONSE_DATA[0].TITLE_NAME_TH +
          " " +
          detail.RESPONSE_DATA[0].FIRST_NAME +
          " " +
          detail.RESPONSE_DATA[0].LAST_NAME;
      }
    });
  }

  addPositionList() {
    if(this.positionList.length<1){
    this.positionList.push({})
  }

  }
  deletePositionList() {
    this.positionList.shift()
  }
  setSatff(obj) {
    this.position = obj.OPREATION_POS_NAME;
    this.deparment = obj.OPERATION_DEPT_NAME;
    this.staffID = obj.STAFF_ID;
  }
  getConUserAccount(userAccountId) {
    const params = {
      USER_ACCOUNT_ID: userAccountId
    };

    this.getAllModule().then(() => {
      this.moduleForm = [];
      this.manageService
        .userAccountgetByCon(params)
        .then(data => {
          this.userDetail = data as UserAccountManagement;
          this.username = this.userDetail.USER_NAME;
          this.staffID = this.userDetail.STAFF_ID;

          // console.log(this.username);
          // console.log(this.userDetail);
          // this.nameOfUser = this.userDetail.STAFF_ID.toString(),
          // this.position = this.userDetail.

          this.programList = this.programListTemplate;
          for (
            var i = 0;
            i < this.userDetail.UserAccountPermission.length;
            i++
          ) {
            for (var x = 0; x < this.listModuleAll.length; x++) {
              if(!this.listModuleAll[x].MODULE_CODE.startsWith("ILG60-99")){
              if (this.listModuleAll[x].MODULE_CODE != null) {
                if (
                  this.userDetail.UserAccountPermission[i].PROGRAM_CODE ==
                  this.listModuleAll[x].MODULE_CODE
                ) {
                  const params = {
                    PROGRAM_CODE: this.userDetail.UserAccountPermission[i]
                      .PROGRAM_CODE,
                    MODULE_NAME: this.listModuleAll[x].MODULE_NAME,
                    USER_PERMISSION_ID: this.userDetail.UserAccountPermission[i]
                      .USER_PERMISSION_ID,
                    isRead: this.userDetail.UserAccountPermission[i].IS_READ,
                    isCreate: this.userDetail.UserAccountPermission[i]
                      .IS_CREATE,
                    isUpdate: this.userDetail.UserAccountPermission[i]
                      .IS_UPDATE,
                    isDelete: this.userDetail.UserAccountPermission[i].IS_DELETE
                  };
                  // console.log(params)
                  this.moduleForm.push(params);
                }
                if (this.listModuleAll[x].ModuleDetail.length > 0) {
                  for (
                    var a = 0;
                    a < this.listModuleAll[x].ModuleDetail.length;
                    a++
                  ) {
                    if (this.listModuleAll[x].ModuleDetail != undefined) {
                      if (
                        this.userDetail.UserAccountPermission[i].PROGRAM_CODE ==
                        this.listModuleAll[x].ModuleDetail[a].MODULE_DETAIL_CODE
                      ) {
                        if (
                          this.listModuleAll[x].MODULE_CODE !=
                          this.listModuleAll[x].ModuleDetail[a].MODULE_DETAIL_CODE
                        ) {
                        const paramsDetail = {
                          PROGRAM_CODE: this.listModuleAll[x].ModuleDetail[a]
                            .MODULE_DETAIL_CODE,
                          MODULE_NAME_DETIAL: this.listModuleAll[x]
                            .ModuleDetail[a].MODULE_DETAIL_NAME,
                          USER_PERMISSION_ID: this.userDetail
                            .UserAccountPermission[i].USER_PERMISSION_ID,
                          isRead: this.userDetail.UserAccountPermission[i]
                            .IS_READ,
                          isCreate: this.userDetail.UserAccountPermission[i]
                            .IS_CREATE,
                          isUpdate: this.userDetail.UserAccountPermission[i]
                            .IS_UPDATE,
                          isDelete: this.userDetail.UserAccountPermission[i]
                            .IS_DELETE
                        };
                        // console.log(paramsDetail)
                        this.moduleForm.push(paramsDetail);
                      }
                    }
                    }
                  }
                }
              }
            }
          }
        } // console.log(this.moduleForm)
        })
        .then(() => {
          this.searchStaffDetail();
          this.positionList.push({})
        });
    });
  }
  ngDoCheck(): void {}
  clickCancel() {
    this.visableEditBtn = true;
    this.visableDeleteBtn = true;
    this.visableUpdateBtn = false;
    this.visableCancelBtn = false;
  }
  clickEdit() {
    if (this.visableEditBtn) {
      this.visableEditBtn = false;
      this.visableDeleteBtn = false;
      this.visableUpdateBtn = true;
      this.visableCancelBtn = true;
    } else {
      this.visableEditBtn = true;
      this.visableDeleteBtn = true;
      this.visableUpdateBtn = false;
      this.visableCancelBtn = false;
    }
  }
  clickSave() {
    // console.log('clickSave')
    var userAccountPermission = [];
    for (var x = 0; x < this.moduleForm.length; x++) {
      var isCreate = 0;
      var isRead = 0;
      var isUpdate = 0;
      var isDelete = 0;
      if (this.moduleForm[x].isCreate) {
        isCreate = 1;
      }
      if (this.moduleForm[x].isRead) {
        isRead = 1;
      }
      if (this.moduleForm[x].isUpdate) {
        isUpdate = 1;
      }
      if (this.moduleForm[x].isDelete) {
        isDelete = 1;
      }
      if (this.userAccountId != 0) {
        const accountPermission = {
          USER_PERMISSION_ID: this.moduleForm[x].USER_PERMISSION_ID,
          USER_ACCOUNT_ID: this.userDetail.USER_ACCOUNT_ID,
          PROGRAM_CODE: this.moduleForm[x].PROGRAM_CODE,
          IS_CREATE: isCreate,
          IS_READ: isRead,
          IS_UPDATE: isUpdate,
          IS_DELETE: isDelete
        };
        userAccountPermission.push(accountPermission);
      } else {
        const accountPermission = {
          USER_PERMISSION_ID: 0,
          USER_ACCOUNT_ID: 0,
          PROGRAM_CODE: this.moduleForm[x].PROGRAM_CODE,
          IS_CREATE: isCreate,
          IS_READ: isRead,
          IS_UPDATE: isUpdate,
          IS_DELETE: isDelete
        };
        userAccountPermission.push(accountPermission);
      }
    }
    // console.log(this.userAccountId)
    if (this.userAccountId != 0) {
      const params = {
        USER_ACCOUNT_ID: this.userDetail.USER_ACCOUNT_ID,
        STAFF_ID: this.userDetail.STAFF_ID,
        ROLE_ID: this.userDetail.ROLE_ID,
        USER_TYPE: this.userDetail.USER_TYPE,
        USER_NAME: this.userDetail.USER_NAME,
        PASSWORD: this.userDetail.PASSWORD,
        IS_SIGN_ON: this.userDetail.IS_SIGN_ON,
        SIGN_ON_IP: this.userDetail.SIGN_ON_IP,
        APPROVE_CODE: this.userDetail.APPROVE_CODE,
        IS_ACTIVE: this.userDetail.IS_ACTIVE,
        UserAccountPermission: userAccountPermission
      };
      // console.log(params)
      this.updateUserAccount(params);
    } else {
      const params = {
        USER_ACCOUNT_ID: 0,
        STAFF_ID: this.staffID,
        ROLE_ID: 1,
        USER_TYPE: "",
        USER_NAME: this.username,
        PASSWORD: "1234",
        IS_SIGN_ON: "",
        SIGN_ON_IP: "",
        APPROVE_CODE: "",
        IS_ACTIVE: 1,
        UserAccountPermission: userAccountPermission
      };
      // console.log(params)
      this.insertUserAccount(params);
    }
  }

  insertUserAccount(obj) {
    this.manageService.userAccountinsAll(obj).then(data => {
      const result = data as any;
      // console.log(result)
      if (result.IsSuccess == "True") {
        this.router.navigate([`/uac/useraccount/list`]);
      }
    });
  }
  updateUserAccount(obj) {
    this.manageService.userAccountupdByCon(obj).then(data => {
      const result = data as any;

      if (result.IsSuccess == "True") {
        this.visableEditBtn = true;
        this.visableUpdateBtn = false;
        this.visableCancelBtn = false;
        this.getConUserAccount(this.userAccountId);
      }
    });
  }

  clickDelete() {
    const params = {
      USER_ACCOUNT_ID: this.userAccountId
    };
    this.manageService.userAccountupdDelete(params).then(data => {
      const result = data as any;
      if (result.IsSuccess == "True") {
        this.router.navigate([`/uac/useraccount/list`]);
      }
    });
  }

  async getAllModule() {
    await this.manageService.modulegetAll().then(data => {
      this.listModuleAll = data as any;
      console.log(this.listModuleAll);
      for (var x = 0; x < this.listModuleAll.length; x++) {
        if(!this.listModuleAll[x].MODULE_CODE.startsWith("ILG60-99")){
        if (this.listModuleAll[x].MODULE_CODE != null) {
          const params = {
            PROGRAM_CODE: this.listModuleAll[x].MODULE_CODE,
            MODULE_NAME: this.listModuleAll[x].MODULE_NAME,
            USER_PERMISSION_ID: 0,
            isRead: false,
            isCreate: false,
            isUpdate: false,
            isDelete: false
          };
          this.moduleForm.push(params);

          if (this.listModuleAll[x].ModuleDetail.length > 0) {
            for (
              var a = 0;
              a < this.listModuleAll[x].ModuleDetail.length;
              a++
            ) {
              if (this.listModuleAll[x].ModuleDetail != undefined) {
                if (
                  this.listModuleAll[x].MODULE_CODE !=
                  this.listModuleAll[x].ModuleDetail[a].MODULE_DETAIL_CODE
                ) {
                  const paramsDetail = {
                    PROGRAM_CODE: this.listModuleAll[x].ModuleDetail[a]
                      .MODULE_DETAIL_CODE,
                    MODULE_NAME_DETIAL: this.listModuleAll[x].ModuleDetail[a]
                      .MODULE_DETAIL_NAME,
                    USER_PERMISSION_ID: 0,
                    isRead: false,
                    isCreate: false,
                    isUpdate: false,
                    isDelete: false
                  };
                  this.moduleForm.push(paramsDetail);
                }
              }
            }
          }
        }
      }}
    });
  }
  private navigate_Service() {
    // this.navService.showFieldEdit.subscribe(p => {
    //   this.showEditField = p;
    // });
    // this.navService.onSave.takeUntil(this.destroy$).subscribe(async status => {
    //   if (status) {
    //     await this.navService.setOnSave(false);
    //     this.userAccountRequest.userAccountID = this.userAccountID;
    //     let persistMode: boolean = this.userAccountRequest.uacUserpermissions.length == 0;
    //     if (persistMode) {
    //       for (let item of this.programList) {
    //         let uacUserpermission: uacdatamodel.UacUserpermission = new uacdatamodel.UacUserpermission();
    //         uacUserpermission.userAccountID = this.userAccountID;
    //         uacUserpermission.programCode = item.programCode;
    //         uacUserpermission.isCreate = item.isCreate;
    //         uacUserpermission.isRead = item.isRead;
    //         uacUserpermission.isUpdate = item.isUpdate;
    //         uacUserpermission.isDelete = item.isDelete;
    //         this.userAccountRequest.uacUserpermissions.push(uacUserpermission);
    //       }
    //     } else {
    //       this.programList.forEach(program => {
    //         let uacUserpermission: uacdatamodel.UacUserpermission = this.userAccountRequest.uacUserpermissions.find(permission => permission.programCode == program.programCode);
    //         uacUserpermission.userAccountID = this.userAccountID;
    //         uacUserpermission.programCode = program.programCode;
    //         uacUserpermission.isCreate = program.isCreate;
    //         uacUserpermission.isRead = program.isRead;
    //         uacUserpermission.isUpdate = program.isUpdate;
    //         uacUserpermission.isDelete = program.isDelete;
    //       });
    //     }
    //     if (persistMode) {
    //       this.manageService.userAccountinsAll(this.userAccountRequest, this.userAccountRequest.uacUserpermissions).then(result => {
    //         if (result == "OK") {
    //           swal({
    //             title: '',
    //             text: "บันทึกสำเร็จ",
    //             type: 'success',
    //             showCancelButton: false,
    //             confirmButtonColor: '#3085d6',
    //             cancelButtonColor: '#d33',
    //             confirmButtonText: 'OK'
    //           }).then((result) => {
    //             if (result.value) {
    //               this.router.navigate([`/uac/useraccount/manage`]);
    //             }
    //           })
    //         } else {
    //           swal('', 'manageService.userAccountinsAll', 'error');
    //         }
    //       }).catch(error => {
    //         //reject("Data Submission Error::" + JSON.stringify(error));
    //       });
    //     } else {
    //       this.manageService.userAccountupdByCon(this.userAccountRequest, this.userAccountRequest.uacUserpermissions).then(result => {
    //         if (result == "OK") {
    //           swal({
    //             title: '',
    //             text: "บันทึกสำเร็จ",
    //             type: 'success',
    //             showCancelButton: false,
    //             confirmButtonColor: '#3085d6',
    //             cancelButtonColor: '#d33',
    //             confirmButtonText: 'OK'
    //           }).then((result) => {
    //             if (result.value) {
    //               this.router.navigate([`/uac/useraccount/manage`]);
    //             }
    //           })
    //         } else {
    //           swal('', 'manageService.userAccountupdByCon', 'error');
    //         }
    //       }).catch(error => {
    //         //reject("Data Submission Error::" + JSON.stringify(error));
    //       });
    //     }
    //   }
    // });
    // this.navService.onCancel.takeUntil(this.destroy$).subscribe(async status => {
    //   if (status) {
    //     //console.log("onCancel")
    //     swal('', 'ยกเลิกการทำรายการ', 'warning');
    //     await this.navService.setOnCancel(false);
    //     await this.router.navigate([`/uac/useraccount/list`]);
    //   }
    // })
  }
}
