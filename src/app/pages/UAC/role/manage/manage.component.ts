import { Component, OnInit, ViewEncapsulation , ViewChild } from '@angular/core';
import { FormGroup,NgForm } from '@angular/forms';
import { NavigationService } from 'app/shared/header-navigation/navigation.service';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PreloaderService } from '../../../../shared/preloader/preloader.component';
import swal from 'sweetalert2'
import { SidebarService } from '../../../../shared/sidebar/sidebar.component';
import { ManageService } from './manage.service';
import * as uacdatamodel from '../../uac-user-datamodel';

@Component({
  selector: 'app-user-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class RoleManageComponent implements OnInit {
  @ViewChild('advForm') advForm: NgForm;
  @ViewChild('masterForm') masterForm: NgForm;
  
  form: FormGroup;
  private roleID: number;
  roleCode: string;
  roleName: string;
  is_active: boolean;
  role_desc: string;
  
  showEditField: any;
  private roleinsAllRequest: uacdatamodel.RoleinsAllRequest;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  rolePermission: any = {};
  constructor(
    private navService: NavigationService,
    private router: Router,
    private sidebarService: SidebarService,
    private activeRoute: ActivatedRoute,
    private manageService: ManageService) {

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
  }
  public programList: Array<any> = new Array<any>();
  private getModuleAll:Array<any>=[]
  private listModuleAll: Array<any> = [];
  private rolePositionList : Array<any> = [];

  private programListTemplate: Array<any> = [
    { "programType": "Entry", "programCode": "ILG60-01-0", "programName": "งานสืบสวน", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Entry", "programCode": "ILG60-02-0", "programName": "ใบแจ้งความนำจับ", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Entry", "programCode": "ILG60-03-0", "programName": "งานจับกุม", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Entry", "programCode": "ILG60-04-0", "programName": "บันทึกรับคำกล่าวโทษ", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Entry", "programCode": "ILG60-05-0", "programName": "งานตรวจรับและพิสูจน์ของกลาง", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Entry", "programCode": "ILG60-06-0", "programName": "งานเปรียบเทียบและชำระค่าปรับ", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Entry", "programCode": "ILG60-07-0", "programName": "งานนำส่งรายได้", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Entry", "programCode": "ILG60-08-1", "programName": "คำร้องขอรับเงินสินบน", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Entry", "programCode": "ILG60-08-2", "programName": "คำร้องขอรับเงินรางวัล", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Entry", "programCode": "ILG60-09-0", "programName": "งานปรับเพิ่ม-ลดค่าปรับ", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Entry", "programCode": "ILG60-10-0", "programName": "งานตรวจรับของกลางเพื่อเก็บรักษา", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Entry", "programCode": "ILG60-11-0", "programName": "งานคืนของกลาง", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Entry", "programCode": "ILG60-12-0", "programName": "งานจัดเก็บของกลางเข้าพิพิธภัณฑ์", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Entry", "programCode": "ILG60-13-0", "programName": "งานขายทอดตลาด", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Entry", "programCode": "ILG60-14-0", "programName": "งานทำลายของกลาง", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Entry", "programCode": "ILG60-15-0", "programName": "งานนำของกลางออกจากคลัง", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Entry", "programCode": "ILG60-16-0", "programName": "งานโอนย้ายของกลาง", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Entry", "programCode": "ILG60-17-0", "programName": "งานทะเบียนบัญชีสินค้าและของกลาง", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Entry", "programCode": "ILG60-18-0", "programName": "หมายค้น", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Entry", "programCode": "ILG60-19-0", "programName": "ใบรับรองความบริสุทธิ์", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Master", "programCode": "ILG60-99-1", "programName": "ข้อมูลผู้ต้องสงสัย", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Master", "programCode": "ILG60-99-2", "programName": "ข้อมูลผู้ต้องหา", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Master", "programCode": "ILG60-99-3", "programName": "ข้อมูลเชื้อชาติ", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Master", "programCode": "ILG60-99-4", "programName": "ข้อมูลสัญชาติ", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Master", "programCode": "ILG60-99-5", "programName": "ข้อมูลศาสนา", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Master", "programCode": "ILG60-99-6", "programName": "ข้อมูลประเทศ", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Master", "programCode": "ILG60-99-7", "programName": "ข้อมูลคำนำหน้าชื่อ", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Master", "programCode": "ILG60-99-8", "programName": "ข้อมูลศาล", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Master", "programCode": "ILG60-99-9", "programName": "ข้อมูลสัดส่วนเงินสินบน รางวัล และส่งคลัง", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Master", "programCode": "ILG60-99-10", "programName": "ข้อมูลสัดส่วนเงินรางวัล", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Master", "programCode": "ILG60-99-11", "programName": "ข้อมูลคลังสินค้า", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Master", "programCode": "ILG60-99-12", "programName": "ข้อมูลหมวด/ส่วนของพรบ.", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Master", "programCode": "ILG60-99-13", "programName": "ข้อมูลมาตราของพรบ.", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Master", "programCode": "ILG60-99-14", "programName": "ข้อมูลข้อย่อย/วรรคของพรบ.", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Master", "programCode": "ILG60-99-15", "programName": "ข้อมูลหมวดของสินค้า", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Master", "programCode": "ILG60-99-16", "programName": "ข้อมูลประเภทของสินค้า", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Master", "programCode": "ILG60-99-17", "programName": "ข้อมูลยี่ห้อหลักของสินค้า", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Master", "programCode": "ILG60-99-18", "programName": "ข้อมูลยี่ห้อรองของสินค้า", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Master", "programCode": "ILG60-99-19", "programName": "ข้อมูลรุ่นของสินค้า", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false },
    { "programType": "Master", "programCode": "ILG60-99-20", "programName": "ข้อมูลหน่วย", "isCreate": false, "isRead": false, "isUpdate": false, "isDelete": false }
  ];

  public uacRolePermissionResponse: uacdatamodel.UacRolePermissionResponse;
  private visableEditBtn: Boolean = true
  private visableUpdateBtn: Boolean = false
  private visableCancelBtn: Boolean = false
  private classForPosition: String = "not-click"
  private moduleAllList:Array<any>=[]
  private moduleFilterAllList:Array<any>=[]

  public getProgramCodeList(programType: string): Array<any> {
    return this.programList.filter(item => item.programType == programType);
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(p => { this.roleID = p['roleId'] });
      this.getAllModule().then(result_r => {
      if(this.roleID == 0){
        this.visableEditBtn = false
        this.visableUpdateBtn = true
        this.visableCancelBtn = false
        this.classForPosition = "can-click"
        // this.searchStaff();
      }else{
        localStorage.setItem('programcode', 'ILG60-12-00');
        this.sidebarService.setVersion('Role Manage 0.0.0.1');

        this.navigate_Service();
        this.programList = JSON.parse(JSON.stringify(this.programListTemplate));
        this.roleinsAllRequest = new uacdatamodel.RoleinsAllRequest();
        // this.roleID = +localStorage.getItem("roleID");
        this.getEditDataFunc()
      }
    });

  }

  async getEditDataFunc() {
    await this.manageService.loadRolegetByCon(this.roleID).then(result => {
      this.uacRolePermissionResponse = result;
      this.roleCode = this.uacRolePermissionResponse.ROLE_CODE;
      this.roleName = this.uacRolePermissionResponse.ROLE_NAME;
      this.is_active = this.uacRolePermissionResponse.IS_ACTIVE;
      this.role_desc = this.uacRolePermissionResponse.ROLE_DESCRIPTION;
      if(this.uacRolePermissionResponse.MasOperationPosition != null) {
        this.rolePositionList.push({
          "OPERATION_POS_ID": this.uacRolePermissionResponse.MasOperationPosition.OPERATION_POS_ID,
          "OPERATION_POS_CODE": this.uacRolePermissionResponse.MasOperationPosition.OPERATION_POS_CODE,
          "OPERATION_POS_NAME": this.uacRolePermissionResponse.MasOperationPosition.OPERATION_POS_NAME,
          "IS_ACTIVE": this.uacRolePermissionResponse.MasOperationPosition.IS_ACTIVE,
        })
      }

      this.uacRolePermissionResponse.RolePermission.forEach(permission => {
        let program: any
        // if(permission.MODULE_DETAIL_ID != 0) {
          program = this.moduleAllList.find(item => (item.MODULE_ID == permission.MODULE_ID) && (item.MODULE_DETAIL_ID == permission.MODULE_DETAIL_ID));
        // }else{
          // program = this.moduleAllList.find(item => item.MODULE_ID == permission.MODULE_ID);
        // }
        if (program != null) {
          program.IS_CREATE = permission.IS_CREATE;
          program.IS_READ = permission.IS_READ;
          program.IS_UPDATE = permission.IS_UPDATE;
          program.IS_DELETE = permission.IS_DELETE;
          program.ROLE_PERMISSION_ID = permission.ROLE_PERMISSION_ID;
          if(this.roleID != 0) {
            this.moduleFilterAllList.push(program)
          }
        }

            // console.log(permission.IS_CREATE)
            // console.log(program.IS_CREATE)
        //     // this.moduleAllList = [];
        //     // program.ROLE_ID = this.roleID
          
        //   console.log(this.moduleFilterAllList)
        //   // this.roleinsAllRequest.RolePermission.push(program);
        });
      // this.uacRolePermissionResponse.RolePermission.forEach(permission => {
      //   this.roleinsAllRequest.RolePermission.push(permission);
      // });
      console.log(this.rolePositionList)

    }).catch(error => {
      alert("ERROR")
      console.log(error)
    });
  }

  addRole() {
    this.rolePositionList.push({})
  }

  deleteRolePosition() {
    this.rolePositionList.shift()
  }

  clickCancel() {
    this.visableEditBtn = true
    this.visableUpdateBtn = false
    this.visableCancelBtn = false
    this.classForPosition = "not-click"
  }
  
  clickDelete() {
    const params = {
      ROLE_ID: this.roleID,
    }
    this.manageService.RoleDelete(params).subscribe(data=>{
      if(data.IsSuccess){
        swal({
          title: '',
          text: "ลบสำเร็จ",
          type: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            this.router.navigate(['/uac/role/list']);
            this.visableEditBtn = true
            this.visableUpdateBtn = false
            this.visableCancelBtn = false
            this.classForPosition = "not-click"

          }
        })
      }
    })
  }

  async getAllModule(){
    await this.manageService.modulegetAll().then(data=>{
      this.listModuleAll = data as any;
      // this.getModuleAll = data ;
      for(var x = 0;x<this.listModuleAll.length;x++){
        if(this.listModuleAll[x].MODULE_CODE != null){
          const params ={
            PROGRAM_CODE: this.listModuleAll[x].MODULE_CODE,
            MODULE_NAME:this.listModuleAll[x].MODULE_NAME,
            // USER_PERMISSION_ID:0,
            MODULE_ID: this.listModuleAll[x].MODULE_ID,
            IS_READ:0,
            IS_CREATE:0,
            IS_UPDATE:0,
            IS_DELETE:0,
          }
          if(this.listModuleAll[x].MODULE_ID != 99) {
            this.moduleAllList.push(params)
          }
          let check_moduleCode ;
          let print_moduleID ;
          if(this.listModuleAll[x].ModuleDetail.length > 0){
            for(var a = 0;a<this.listModuleAll[x].ModuleDetail.length;a++){
              if(this.listModuleAll[x].ModuleDetail != undefined){
                if (
                  this.listModuleAll[x].MODULE_CODE !=
                  this.listModuleAll[x].ModuleDetail[a].MODULE_DETAIL_CODE
                ) {
                  const paramsDetail ={
                    MODULE_DETAIL_CODE:this.listModuleAll[x].ModuleDetail[a].MODULE_DETAIL_CODE,
                    MODULE_NAME_DETIAL:  this.listModuleAll[x].ModuleDetail[a].MODULE_DETAIL_NAME,
                    ROLE_PERMISSION_ID:  this.listModuleAll[x].ModuleDetail[a].ROLE_PERMISSION_ID,
                    MODULE_ID: this.listModuleAll[x].ModuleDetail[a].MODULE_ID,
                    MODULE_DETAIL_ID: this.listModuleAll[x].ModuleDetail[a].MODULE_DETAIL_ID,
                    IS_READ:0,
                    IS_CREATE:0,
                    IS_UPDATE:0,
                    IS_DELETE:0,
                  }
                  if(this.listModuleAll[x].ModuleDetail[a].MODULE_ID != 99) {
                    this.moduleAllList.push(paramsDetail)
                    // this.moduleAllList[x].MODULE_DETAIL_ID = this.getModuleAll[x].ModuleDetail[a].MODULE_DETAIL_ID
                  }
                }else{
                  check_moduleCode = this.listModuleAll[x].ModuleDetail[a].MODULE_DETAIL_CODE
                  print_moduleID = this.listModuleAll[x].ModuleDetail[a].MODULE_DETAIL_ID
                  
                  // if(this.getModuleAll[x].ModuleDetail[a].MODULE_DETAIL_CODE == this.getModuleAll[x].MODULE_CODE) {
                  //   this.moduleAllList[x].MODULE_DETAIL_ID = this.getModuleAll[x].ModuleDetail[a].MODULE_DETAIL_ID
                  // }
                  // console.log(this.getModuleAll[x].ModuleDetail[a].MODULE_DETAIL_CODE , this.getModuleAll[x].MODULE_CODE)
                  // params.MODULE_DETAIL_ID = this.getModuleAll[x].ModuleDetail[a].MODULE_DETAIL_ID
                }
                
              }
            }
      
          }
          if(this.listModuleAll[x].MODULE_CODE == check_moduleCode) {
            let newMapListRoelPerssion = this.moduleAllList.filter(item => item.PROGRAM_CODE == check_moduleCode)
            if(newMapListRoelPerssion[0]) {
              newMapListRoelPerssion[0].MODULE_DETAIL_ID = print_moduleID
            }
          }
        }
      }
    })
  }

  doCheckbox(e , type) {
    let program: any = this.programList.find(item => item.programCode == e.programCode);
    if (program != null) {
      if(type == "isCreate") {
        program.isCreate = !e.isCreate;
      }else if(type == "isRead") {
        program.isRead = !e.isRead;
      }else if(type == "isUpdate") {
        program.isUpdate = !e.isUpdate;
      }else if(type == "isDelete") {
        program.isDelete = !e.isDelete;
      }
    }
  }

  private navigate_Service() {
    this.navService.showFieldEdit.subscribe(p => {
      this.showEditField = p;
    });

    this.navService.onSave.takeUntil(this.destroy$).subscribe(async status => {
      if (status) {
        await this.navService.setOnSave(false);
        this.roleinsAllRequest.ROLE_ID = this.roleID;
        let persistMode: boolean = this.roleinsAllRequest.RolePermission.length == 0;

        if (persistMode) {
          for (let program of this.programList) {
            let rolePermission: uacdatamodel.RolePermission = new uacdatamodel.RolePermission();
            rolePermission.ROLE_ID = this.roleID;
            // rolePermission.programCode = program.programCode;
            rolePermission.IS_CREATE = program.isCreate;
            rolePermission.IS_READ = program.isRead;
            rolePermission.IS_UPDATE = program.isUpdate;
            rolePermission.IS_DELETE = program.isDelete;

            this.roleinsAllRequest.RolePermission.push(rolePermission);
          }
        } else {
          for (let program of this.programList) {
            let rolePermission: uacdatamodel.RolePermission = this.roleinsAllRequest.RolePermission.find(permission => permission.MODULE_ID == program.programCode);
            rolePermission.ROLE_ID = this.roleID;
            // rolePermission.programCode = program.programCode;
            rolePermission.IS_CREATE = program.isCreate;
            rolePermission.IS_READ = program.isRead;
            rolePermission.IS_UPDATE = program.isUpdate;
            rolePermission.IS_DELETE = program.isDelete;

            this.roleinsAllRequest.RolePermission.push(rolePermission);
          }
        }

        if (persistMode) {
          this.manageService.roleinsAll(this.roleinsAllRequest).then(result => {
            if (result == "OK") {
              swal({
                title: '',
                text: "บันทึกสำเร็จ",
                type: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'OK'
              }).then((result) => {
                if (result.value) {
                  this.router.navigate(['/uac/role/manage']);
                }
              })
            } else {
              swal('', 'manageService.roleinsAll', 'error');
            }
          }).catch(error => {
            swal('', error, 'error');
          });
        } else {
          this.manageService.roleupdByCon(this.roleinsAllRequest).then(result => {
            if (result == "OK") {
              swal({
                title: '',
                text: "บันทึกสำเร็จ",
                type: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'OK'
              }).then((result) => {
                if (result.value) {
                  this.router.navigate([`/uac/role/manage`]);
                }
              })
            } else {
              swal('', 'manageService.roleupdByCon', 'error');
            }
          }).catch(error => {
            swal('', error, 'error');
          });
        }
      }
    });
    this.navService.onCancel.takeUntil(this.destroy$).subscribe(async status => {
      if (status) {
        swal('', 'ยกเลิกการทำรายการ', 'warning');
        await this.navService.setOnCancel(false);
        await this.router.navigate(['/uac/role/list']);
      }
    })
  }

  clickEdit() {
    if(this.visableEditBtn) {
      this.visableEditBtn = false
      this.visableUpdateBtn = true
      this.visableCancelBtn = true
      this.classForPosition = "can-click"
    }else{
      this.visableEditBtn = true
      this.visableUpdateBtn = false
      this.visableCancelBtn = false
      this.classForPosition = "not-click"
    }
  }

  
  clickSave() {
    if(this.roleID != 0) {
      for (let i = 0; i < this.moduleFilterAllList.length; i++) {
        const permission = this.moduleFilterAllList[i]
        this.moduleFilterAllList[i].IS_CREATE = (permission.IS_CREATE) ? 1 : 0 ;
        this.moduleFilterAllList[i].IS_READ = (permission.IS_READ) ? 1 : 0 ;
        this.moduleFilterAllList[i].IS_UPDATE = (permission.IS_UPDATE) ? 1 : 0 ;
        this.moduleFilterAllList[i].IS_DELETE = (permission.IS_DELETE) ? 1 : 0 ;
        // this.moduleFilterAllList[i].ROLE_PERMISSION_ID = this.roleID
        this.moduleFilterAllList[i].ROLE_ID = this.roleID
        }
      this.updateRolePermission(this.moduleFilterAllList)
    }else{
      for (let i = 0; i < this.moduleAllList.length; i++) {
        const permission = this.moduleAllList[i]
        this.moduleAllList[i].IS_CREATE = (permission.IS_CREATE) ? 1 : 0 ;
        this.moduleAllList[i].IS_READ = (permission.IS_READ) ? 1 : 0 ;
        this.moduleAllList[i].IS_UPDATE = (permission.IS_UPDATE) ? 1 : 0 ;
        this.moduleAllList[i].IS_DELETE = (permission.IS_DELETE) ? 1 : 0 ;
        this.moduleAllList[i].ROLE_ID = 0;
        this.moduleAllList[i].ROLE_PERMISSION_ID = 0;
      }
      this.insertRolePermission(this.moduleAllList)
    }
  }

  updateRolePermission(list) {
    var roleCode = this.advForm.value.RoleCode
    var roleName = this.advForm.value.RoleName
    if(this.advForm.value.RoleCode == "" || this.advForm.value.RoleCode == null ) {
      roleCode = this.roleCode
    }
    if(this.advForm.value.RoleName == "" || this.advForm.value.RoleName == null ) {
      roleName = this.roleName
    }
    let listPermission: any
    const params = {
      IS_ACTIVE: this.is_active,
      ROLE_CODE: roleCode,
      ROLE_DESCRIPTION: this.role_desc,
      ROLE_ID: this.roleID,
      ROLE_NAME: roleName,
      RolePermission: list,
    }
    this.manageService.RoleUpdate(params).subscribe(data=>{
      if(data.IsSuccess){
        swal({
          title: '',
          text: "บันทึกสำเร็จ",
          type: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            this.router.navigate(['/uac/role/manage/' + this.roleID]);
            this.visableEditBtn = true
            this.visableUpdateBtn = false
            this.visableCancelBtn = false
            this.classForPosition = "not-click"
          }
        })
      //   this.listCaseStatusDetail = result.CASE_STATUS;
      }
    })
  }

  insertRolePermission(list) {
    var roleCode = this.advForm.value.RoleCode
    var roleName = this.advForm.value.RoleName
    if(this.advForm.value.RoleCode == "" || this.advForm.value.RoleCode == null ) {
      roleCode = this.roleCode
    }
    if(this.advForm.value.RoleName == "" || this.advForm.value.RoleName == null ) {
      roleName = this.roleName
    }
    let listPermission: any
    const params = {
      IS_ACTIVE: 1,
      ROLE_CODE: roleCode,
      ROLE_DESCRIPTION: "",
      ROLE_ID: 0,
      ROLE_NAME: roleName,
      RolePermission: list,
    }
    console.log(params)
    this.manageService.RoleInsert(params).subscribe(data=>{
      if(data.IsSuccess){
        swal({
          title: '',
          text: "บันทึกสำเร็จ",
          type: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.value) {
            if(this.roleID != 0) {
              this.router.navigate(['/uac/role/manage/' + this.roleID]);
            }else{
              this.router.navigate(['/uac/role/list/']);
            }
            this.visableEditBtn = true
            this.visableUpdateBtn = false
            this.visableCancelBtn = false
            this.classForPosition = "not-click"
          }
        })
      //   this.listCaseStatusDetail = result.CASE_STATUS;
      }
    })
  }
}