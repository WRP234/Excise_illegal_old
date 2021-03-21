import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import {Nav_target_Service} from '../../../shared/header-navigation/nav_target.service';
import { pagination } from '../../../config/pagination';
import { SuppressTarget } from '../suppressTarget.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
// import { NavigateService } from '../navigate/navigate.service';
import swal from 'sweetalert2';
import { Messages_target} from '../new_message';
import { async } from '@angular/core/testing';
import { stat } from 'fs';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrintdocModelComponent } from '../printdoc-model/printdoc-model.component';
import {TargetItemDetail} from '../CreateITEM'


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class CreateComponent implements OnInit {
  // staffForm: FormGroup;
  staffForm = new FormGroup ({
    name: new FormControl()
  }); 
  @ViewChild('printDocModal') printDocModel: ElementRef;
  isRequired: boolean | false;
  private onNextPageSubscribe: any;
  private onCancelSubscribe: any;
  private subOnSearch: any;
  modal: any;
  advSearch: any;
  paginage = pagination;

  
  QTY_s : number;
  QTY_per : number;
  QTY_PERCENT_s : any;

  public targetDetail: Array<any> = new Array<any>();
  
  targetItemDetail: Array<any> = [
    {ID: 0,  MONTH : 'ตุลาคม', OLD_QTY: 210, QTY: 210, QTY_PERCENT: '0%',OLD_FINE: 2300, FINE: 2300, FINE_PERCENT: '0%' },
    {ID: 1,  MONTH : 'พฤศจิกายน', OLD_QTY: 210, QTY: 210, QTY_PERCENT: '0%',OLD_FINE: 2300, FINE: 2300, FINE_PERCENT: '0%' },
    {ID: 2,  MONTH : 'ธันวาคม', OLD_QTY: 210, QTY: 210, QTY_PERCENT: '0%',OLD_FINE: 2300, FINE: 2300, FINE_PERCENT: '0%' },
    {ID: 3,  MONTH : 'มกราคม', OLD_QTY: 210, QTY: 210, QTY_PERCENT: '0%',OLD_FINE: 2300, FINE: 2300, FINE_PERCENT: '0%' },
    {ID: 4,  MONTH : 'กุมภาพันธ์', OLD_QTY: 210, QTY: 210, QTY_PERCENT: '0%',OLD_FINE: 2300, FINE: 2300, FINE_PERCENT: '0%' },
    {ID: 5,  MONTH : 'มีนาคม', OLD_QTY: 210, QTY: 210, QTY_PERCENT: '0%',OLD_FINE: 2300, FINE: 2300, FINE_PERCENT: '0%' },
    {ID: 6,  MONTH : 'เมษายน', OLD_QTY: 210, QTY: 210, QTY_PERCENT: '0%',OLD_FINE: 2300, FINE: 2300, FINE_PERCENT: '0%' },
    {ID: 7,  MONTH : 'พฤษภาคม', OLD_QTY: 210, QTY: 210, QTY_PERCENT: '0%',OLD_FINE: 2300, FINE: 2300, FINE_PERCENT: '0%' },
    {ID: 8,  MONTH : 'มิถุนายน', OLD_QTY: 210, QTY: 210, QTY_PERCENT: '0%',OLD_FINE: 2300, FINE: 2300, FINE_PERCENT: '0%' },
    {ID: 9,  MONTH : 'กรกฎาคม', OLD_QTY: 210, QTY: 210, QTY_PERCENT: '0%',OLD_FINE: 2300, FINE: 2300, FINE_PERCENT: '0%' },
    {ID: 10, MONTH : 'สิงหาคม', OLD_QTY: 210, QTY: 210, QTY_PERCENT: '0%',OLD_FINE: 2300, FINE: 2300, FINE_PERCENT: '0%' },
    {ID: 11, MONTH : 'กันยายน', OLD_QTY: 210, QTY: 210, QTY_PERCENT: '0%',OLD_FINE: 2300, FINE: 2300, FINE_PERCENT: '0%' },
  ]
  
  // itemDetail = new TargetItemDetail(ID,);
  public getTargetDetail(MONTH:string):Array<any>{
    return this.targetDetail.filter(item => item.MONTH == MONTH);
  }
  

  private destroy$: Subject<boolean> = new Subject<boolean>();
  target_create_Form: FormGroup;
  form_edit:FormGroup;


  // showEditField: any;
  mode: string;

  // constructor(aaaaaa){}
  
  // set_Btn
  print_btn = <boolean>(false);
  edit_btn = <boolean>(false);
  delete_btn = <boolean>(false);
  save_btn = <boolean>(false);
  cancel_btn = <boolean>(false);

  constructor(
    // private navService: Nav_target_Service,
    private SuppressTarget: SuppressTarget,
    private activeRoute: ActivatedRoute,
    private preloader: PreloaderService,
    private ngbModel: NgbModal,
    private fb: FormBuilder,
    private router: Router, ) {
      this.createForm();
  }

  // editID:number;
  doChange_QTY(index:number){
    let keyID = index;
    // let per =  this.targetItemDetail[keyID].QTY_PERCENT;
    let qty = Number(this.targetItemDetail[keyID].QTY);
    let old_qty = Number(this.targetItemDetail[keyID].OLD_QTY);
    this.targetItemDetail[keyID].QTY_PERCENT = (((qty-old_qty)*100)/old_qty).toFixed(2)+'%';
    
  }

  doChange_QTY_PERCENT(index:number){
    let keyID = index;
    // console.log('data',this.targetItemDetail[keyID])
    let per = this.targetItemDetail[keyID].QTY_PERCENT+'%';
    // let per_s = per.split
    this.targetItemDetail[keyID].QTY_PERCENT = per;
    // console.log('data',this.targetItemDetail[keyID]);
    let per_s = this.targetItemDetail[keyID].QTY_PERCENT.toString().split('%')[0];
    // console.log('per_s',per_s)
    let per_num = Number(per_s);
    // console.log('per_num',per_num)

    // let qty = Number(this.targetItemDetail[keyID].QTY);
    let old_qty = Number(this.targetItemDetail[keyID].OLD_QTY);

    // this.QTY_s = Number(Number(OLD_QTY)+((a*Number(OLD_QTY))/100));
    this.targetItemDetail[keyID].QTY = (old_qty+(per_num*old_qty)/100).toFixed();
    // let a = this.targetItemDetail[keyID].QTY.toFixed(2)
    // this.targetItemDetail[keyID].QTY = a;
    // console.log('a',a)
  }

  doChange_FINE(index:number){
    let keyID = index;
    let old_fine = Number(this.targetItemDetail[keyID].OLD_FINE);
    let fine = Number(this.targetItemDetail[keyID].FINE);

    this.targetItemDetail[keyID].FINE_PERCENT = (((fine-old_fine)*100)/old_fine).toFixed(2)+'%';
  }
  doChange_FINE_PERCENT(index:number){
    let keyID = index;
    let per = this.targetItemDetail[keyID].FINE_PERCENT+'%';
    // let per_s = per.split
    this.targetItemDetail[keyID].FINE_PERCENT = per;

    let old_fine = Number(this.targetItemDetail[keyID].OLD_FINE);
    
    let per_s = this.targetItemDetail[keyID].FINE_PERCENT.toString().split('%')[0];
    // console.log('per_s',per_s)
    let per_num = Number(per_s);
    // this.targetItemDetail[keyID].QTY = (old_qty+(per_num*old_qty)/100).toFixed(2);
    this.targetItemDetail[keyID].FINE = (old_fine+(per_num*old_fine)/100).toFixed(2);
    
  }

  createForm(){
    this.staffForm = this.fb.group({
      name: '', // <--- the FormControl called "name"
    });
  }
  calChange_check(a:any){
    console.log('target',a);
  }
  // calChange_check(){
  //   console.log('target',a);
  // }
   
  calChange_per(OLD_QTY:number,QTY:number){
    // this.QTY_PERCENT_s = 
    this.QTY_per = (Number(Number(QTY)-Number(OLD_QTY))*100)/Number(OLD_QTY);
    console.log('QTY_per',this.QTY_per);
    console.log('OLD_QTY',OLD_QTY);
    console.log('QTY',QTY);
    // this.targetItemDetail[keyID]
  }


  calChangeQTY(OLD_QTY:number,QTY_PERCENT:number){
    this.QTY_PERCENT_s = QTY_PERCENT.toString().split('%')[0];
    var a = Number(this.QTY_PERCENT_s);
    Number(OLD_QTY);
    // this.QTY_s = ((OLD_QTY * QTY)/100)+OLD_QTY;
    this.QTY_s = Number(Number(OLD_QTY)+((a*Number(OLD_QTY))/100));
    console.log('QTY_s',this.QTY_s);
    console.log('OLD_QTY_1',OLD_QTY);
    console.log('a',a);
    console.log('QTY_PERCENT',QTY_PERCENT.toString().split('%')[0]);


  }

  async ngOnInit() {
    localStorage.setItem('programcode', 'ILG60-99-03');
    // set true
    this.save_btn =true;
    this.cancel_btn =true;
    // this.navService.setSaveButton(true);
    // this.navService.setCancelButton(true);
    // this.navService.setSendButton(true);
    // await this.navService.setEditField(true);
    
    this.active_route();
    this.navigate_service();

    if (this.mode == 'C'){
      
      
    }else if (this.mode == 'R'){
      // alert('craete now');
    }
    
  }

  // if (this.mode == 'C'){}
  private active_route(){
    this.activeRoute.params.subscribe(p =>{
      this.mode = p['mode'];

      if (p['mode'] === 'C'){
        // this.ngOnDestroy();
        // this.onCreate_Edit();
        
      }else if (p['mode'] === 'R'){
        // this.ngOnSave_target();
      }
    });

    
  }

  clickSave() {

    swal({
      type: 'success',
      text: Messages_target.save_mes + Messages_target.complete,
      confirmButtonText: 'ยืนยัน',
      buttonsStyling: true,

    });
    this.save_btn = false;
    this.cancel_btn = false;
    // this.craeteTarget_btn = false;

    this.print_btn = true;
    this.edit_btn = true;
  }

  clickCancel() {
    swal({
      type: 'warning',
      text: Messages_target.confirm_mes + ' ?',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
      buttonsStyling: true,

    }).then((result) => {
      if (result.value) {
        let isSuccess: boolean = true;
        if (isSuccess) {
          this.router.navigate(['/SuppressTarget/list']);
        } else {
          swal({
            type: 'error',
            text: 'ไม่สามารถทำรายการได้'
          });
        }
      }
    });
  }

  private navigate_service() {

    
    // this.navService.onCancel.takeUntil(this.destroy$).subscribe(async status =>{
    //   if (status){
        
    //     swal({
    //       type:'warning',
    //       text: Messages_target.confirm_mes+' ?',
    //       showCancelButton: true,
    //       // confirmButtonColor: '#FFFF',
    //       // confirmButtonTextColor:'#3085d6',
    //       cancelButtonColor: '#d33',
    //       confirmButtonText:'ยืนยัน',
    //       cancelButtonText:'ยกเลิก',
    //       buttonsStyling:true,
    //       // cancelTextColor:'#d33'
    //     }).then((result) =>{
    //       if(result.value){
    //         let isSuccess: boolean = true;
    //         if (isSuccess) {
    //           // this.ShowAlertSuccess(Message.saveComplete);
    //           //alert(Message.saveComplete);
    //           this.ngOnDestroy();
    //           this.router.navigate(['/SuppressTarget/manages']);
    //           this.ngOnSave_target();
    //       } else {
    //           // this.ShowAlertError(Message.saveFail);
    //           //alert(Message.saveFail);
    //           swal({
    //             type: 'error',
    //             text: 'ไม่สามารถทำรายการได้'
    //           });
    //       }
    //       }
    //     });
    //   }
      
    // });
    // this.navService.onCancel.takeUntil(this.destroy$).subscribe(async status =>{
    //   if (status){
    //     // swal('',Messages_target.confirm_mes+' ?','warning');
    //     // this.OnCancel();
    //     swal({
    //       type:'warning',
    //       text: Messages_target.confirm_mes+' ?',
    //       showCancelButton: true,
    //       // confirmButtonColor: '#FFFF',
    //       // confirmButtonTextColor:'#3085d6',
    //       cancelButtonColor: '#d33',
    //       confirmButtonText:'ยืนยัน',
    //       cancelButtonText:'ยกเลิก',
    //       buttonsStyling:true,
    //       // cancelTextColor:'#d33'
    //     }).then((result) =>{
    //       if(result.value){
    //         let isSuccess: boolean = true;
    //         if (isSuccess) {
    //           // this.ShowAlertSuccess(Message.saveComplete);
    //           //alert(Message.saveComplete);
    //           this.ngOnDestroy();
    //           this.router.navigate(['/SuppressTarget/manages/target/R']);
    //           this.ngOnSave_target();
    //       } else {
    //           // this.ShowAlertError(Message.saveFail);
    //           //alert(Message.saveFail);
    //           swal({
    //             type: 'error',
    //             text: 'ไม่สามารถทำรายการได้'
    //           });
    //       }
    //       }
    //     });
    //   }
      
    // });

    // this.navService.onCancel_target
    

    // this.navService.onSave.takeUntil(this.destroy$).subscribe(async status =>{
    //   if (status){
    //     swal('',Messages_target.save_mes+Messages_target.complete,'success')
    //     this.isRequired = true;
    //     this.router.navigateByUrl('/SuppressTarget/manages/target/R');
    //     this.ngOnDestroy();  
    //     this.ngOnSave_target();
    //   }
    // });
    
    // this.navService.onEdit.takeUntil(this.destroy$).subscribe(async status =>{
    //   if(status){
    //     this.router.navigateByUrl('/SuppressTarget/manages/target/U');
    //     await this.ngOnDestroy();
    //     await this.onCreate_Edit();
        


    //   }
    // });

    
    
    // this.navService.onPrint.takeUntil(this.destroy$).subscribe(async status =>{
    //   if(status){
    //     // this.preloader.setShowPreloader(true);
    //     // await this.navService.setOnPrint(false);

    //     this.modal = this.ngbModel.open(PrintdocModelComponent,{backdrop:'static',size:'lg',})
    //   }
    // });

    // this.navService.onSendTarget.takeUntil(this.destroy$).subscribe(async status =>{
    //   if (status){
    //     await this.ngOnSend_target();
    //     this.router.navigate(['/SuppressTarget/manages/target/R']);
    //   }
    // });
    // // this.navService.
    // this.navService.onDelete.takeUntil(this.destroy$).subscribe(async status =>{
    //   if (status){
    //     swal({
    //       type: 'warning',
    //       text: Messages_target.confirm_mes + ' ?',
    //       showCancelButton: true,
    //       // confirmButtonColor: '#FFFF',
    //       // confirmButtonTextColor:'#3085d6',
    //       cancelButtonColor: '#d33',
    //       confirmButtonText: 'ยืนยัน',
    //       cancelButtonText: 'ยกเลิก',
    //       buttonsStyling: true,
    //       // cancelTextColor:'#d33'
    //     }).then((result) => {
    //       if (result.value) {
    //         let isSuccess: boolean = true;
    //         if (isSuccess) {
    //           // this.ShowAlertSuccess(Message.saveComplete);
    //           //alert(Message.saveComplete);
    //           this.router.navigate(['/SuppressTarget/list']);
    //         } else {
    //           // this.ShowAlertError(Message.saveFail);
    //           //alert(Message.saveFail);
    //           swal({
    //             type: 'error',
    //             text: 'ไม่สามารถทำรายการได้'
    //           });
    //         }
    //       }
    //     });
    //     // this.router.navigate(['/SuppressTarget/list']);
    //   }
    // });
    
    
  }
  ngOnCancelInEdit(): void{
    // this.navService.setPrintButton(true);
    // this.navService.setEditButton(true);
    // this.navService.setDeleteButton(true);
    // this.navService.setSendButton(true);
    // // this.navService.setSendTargetButton_target(true);
    // this.navService.setEditField(false);

    // this.navService.setSaveButton(false);
    
  }

  ngOnSend_target(): void{
    // this.navService.setEditButton(false);
    // this.navService.setDeleteButton(false);
    // this.navService.setSendButton(false);
    // this.navService.setSendTargetButton_target(false);
  }
  ngOnSave_target(): void {
    // this.navService.setOnSendIncome_target(true);
    // this.navService.setPrintButton(true);
    // this.navService.setEditButton(true);
    // this.navService.setDeleteButton(true);
    // this.navService.setSendButton(true);
    // this.navService.setSendTargetButton_target(true);
    // this.navService.setEditField(false);
    // this.navService.setEditField_target(true);
  }


  
  onCreate_Edit():void {
    // this.navService.setSaveButton(true);
    // this.navService.setCancelButton(true);
    // this.navService.setCancelButtonOnEdit(true);
    // this.navService.setC
    // this.navService.setPrintButton(false);
    // this.navService.setEditButton(false);
    // this.navService.setDeleteButton(false);
  }

  async onCancelEdit(){
    this.ngOnDestroy();
    this.ngOnSave_target();
    
    // this.router.navigate(['/SuppressTarget/manages/target/U'])
  }

  // async 
  oNdestroy(){
    // this.navService.set
  }
  ngOnDestroy(): void {
    
    // this.navService.setSaveButton(false);
    // this.navService.setCancelButton(false);
    // this.navService.setPrintButton(false);
    // this.navService.setEditButton(false);
    // this.navService.setDeleteButton(false);
    // this.navService.setSendButton(false);
    // this.navService.setSendTargetButton(false);
    // this.navService.setCancelButtonOnEdit(false);
    // this.navService.setCancelButton(false);
    // this.navService.setOnCancel(false);
    // this.navService.setOnCancel(false);
    // this.navService.setOncancell(false);
    
    // this.navService.setOnSendTarget(false);
    // this.destroy$

    this.destroy$.unsubscribe();
    // this.navService.setOnCancel(false);
    // this.navService.setOnSave(false);
    // this.navService.setOnEdit(false);
    // this.navService.setOnEditCancel(false);
    // this.navService.setOnDelete(false);
    // this.navService.onSendTarget.unsubscribe();
    // this.navigate_service.unsubscribe();
  }
  
}

