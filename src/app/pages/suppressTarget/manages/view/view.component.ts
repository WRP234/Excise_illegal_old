import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { Nav_target_Service } from "../../../../shared/header-navigation/nav_target.service";
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrintdocModelComponent } from '../../printdoc-model/printdoc-model.component';
import { PreloaderService } from '../../../../shared/preloader/preloader.component';
import { TargetService } from '../../target.service';
import { pagination } from '../../../../config/pagination';
import { SuppressTarget } from '../../suppressTarget.service';
import swal from 'sweetalert2';
import { Messages_target } from '../../new_message'
import { range } from 'rxjs';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html'
})

export class ViewComponent implements OnInit {

  @ViewChild('printDocModal') printDocModel: ElementRef;

  private prevPageButton = true;
  private onNextPageSubscribe: any;
  private subOnSearch: any;
  private sub: any;
  advSearch: any;

  paginage = pagination;

  private mode: String;
  modal: any;
  // advSearch: any;
  // paginage = pagination;
  target_code : any;
  sequence: any;
  year : any;
  product : any;
  type: any;
  office_name : any;
  qty : any;
  fine : any;
  office_code : any;
  item_id : any;
  target_item_id0 : any;
  target_item_id1 : any;
  target_item_id2 : any;
  target_item_id3 : any;
  target_item_id4 : any;
  target_item_id5 : any;
  target_item_id6 : any;
  target_item_id7 : any;
  target_item_id8 : any;
  target_item_id9 : any;
  target_item_id10 : any;
  target_item_id11 : any;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  // ListMasProd: any;
  tagetForm: FormGroup;

  craete_btn = <Boolean>(false);
  search_text= <Boolean>(false);

  private subSetNextPage: any;
  // set_Btn
  print_btn = <boolean>(false);
  edit_btn = <boolean>(false);
  delete_btn = <boolean>(false);
  save_btn = <boolean>(false);
  send_btn = <boolean>(false);
  cancel_btn = <boolean>(false);
  edit = <boolean>(false);
  edit2 = <boolean>(true);

  craeteTarget_btn = <boolean>(false);

  lawsuit_1: boolean = false;
  fine_1: boolean = false;
  treasury_1: boolean = false;
  bribe: boolean = false;
  award: boolean = false;
  bribe2: boolean = true;
  award2: boolean = true;

  toggleVisibility(e){

    e.target.checked;
    console.log(e);
  }

  constructor(
    private navService: Nav_target_Service,
    private ngbModel: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private preloader: PreloaderService,
    private targetService: TargetService
    
  ) { 

  }


  async ngOnInit() {
    this.navigate_service();
    localStorage.setItem('programcode', 'ILG60-99-02');
    // this.save_btn = true;
    // this.craeteTarget_btn = true;
    this.prevPageButton = true
    this.navService.setSearchBar(true)
    this.active_Route();
    this.navService.setSendButton(true);
    this.navService.setPrintButton(true);
    

  }

  private active_Route() {
    this.activeRoute.params.takeUntil(this.destroy$).subscribe(p => {
      this.mode = p['mode'];
    });
  }

  ngOnDestroy(): void {
    this.print_btn = false;
    this.edit_btn = false;
    this.save_btn = false;
    this.cancel_btn = false;
    this.navService.setSearchBar(false)
    this.navService.setSendButton(false);
    this.navService.setPrintButton(false);
  }
  OnCancle(): void {
  }
  OnCreate(): void {
    this.ngOnDestroy();
  }
  OnSave(): void {
    this.ngOnDestroy();
  }
  OnEdit(): void {
    this.ngOnDestroy();
  }



  private navigate_service() {
    
    this.sub = this.activeRoute.params.subscribe(p => {

      const office_code = p.year;
      const office_name = p.code;
      const item_id = p.num;

      this.office_name = office_name;
      this.office_code = office_code;
      this.item_id = item_id;

      // console.log(p.year);
      // console.log(p.code);
      // console.log(p.num);

      var ts = { ITEM_ID: item_id ,OFFICE_CODE: office_code}

      // console.log (this.item_id)

      this.targetService.getByCon("TargetgetByCon",ts).then(list =>{
        //  console.log(list);

          switch (list[0].LAWSUIT_TYPE_TARGET) {
              case 0:
                list[0].LAWSUIT = "เปรียบเทียบปรับ";
                  break;
              case 1:
                list[0].LAWSUIT = "ส่งฟ้องศาล";
                  break;
              case 2:
                list[0].LAWSUIT = "ไม่มีตัว";
                  break;
          }

          // console.log(list);
          this.target_code = list[0].TARGET_CODE;
          this.sequence = list[0].SEQUENCE;
          this.year = list[0].BUDGET_YEAR;
          this.product = list[0].PRODUCT_GROUP_NAME;
          this.type = list[0].LAWSUIT;
          this.target_item_id0 = list[0].ITEM_DETAIL_ID;
          this.target_item_id1 = list[1].ITEM_DETAIL_ID;
          this.target_item_id2 = list[2].ITEM_DETAIL_ID;
          this.target_item_id3 = list[3].ITEM_DETAIL_ID;
          this.target_item_id4 = list[4].ITEM_DETAIL_ID;
          this.target_item_id5 = list[5].ITEM_DETAIL_ID;
          this.target_item_id6 = list[6].ITEM_DETAIL_ID;
          this.target_item_id7 = list[7].ITEM_DETAIL_ID;
          this.target_item_id8 = list[8].ITEM_DETAIL_ID;
          this.target_item_id9 = list[9].ITEM_DETAIL_ID;
          this.target_item_id10 = list[10].ITEM_DETAIL_ID;
          this.target_item_id11 = list[11].ITEM_DETAIL_ID;
          

          for(var i=0; i < this.targetItemDetail_Call.length; i++){
            this.targetItemDetail_Call[i].QTY = list[i].QTY_CASE;
            this.targetItemDetail_Call[i].FINE = list[i].FINE;
            this.targetItemDetail_Call[i].sum_QTY = this.targetItemDetail_Call[i].QTY;
            this.targetItemDetail_Call[i].sum_FINE = this.targetItemDetail_Call[i].FINE;
            this.targetItemDetail_Call[i].qty_case = list[i].QTY_CASE_PERCENT;
            this.targetItemDetail_Call[i].fine_case = list[i].FINE_PERCENT;
            }


          const para = { TEXT_SEARCH : "",OFFICE_CODE : this.office_code}
          this.targetService.TargetListgetByKeyword(para).subscribe(list=>{

            for (var i = 0; i<list.length; i++){
              if (list[i].TARGET_CODE == this.target_code){
                if (list[i].IS_SEND == 1){
                  this.print_btn = <boolean>(true);
                  this.edit_btn = <boolean>(false);
                  this.delete_btn = <boolean>(false);
                  this.save_btn = <boolean>(false);
                  this.send_btn = <boolean>(false);
                  this.cancel_btn = <boolean>(false);
                  // console.log(this.target_id);
                  // console.log(this.item_id);
                }else{
                  this.print_btn = <boolean>(true);
                  this.edit_btn = <boolean>(true);
                  this.delete_btn = <boolean>(true);
                  this.save_btn = <boolean>(false);
                  this.send_btn = <boolean>(true);
                  this.cancel_btn = <boolean>(false);
                  // console.log(this.target_id);
                  // console.log(this.item_id);
                }
              }
            }

          });
          
      })


    });

    // console.log("target name : ",this.office_name,"office code :",this.office_code,"target id : ", this.office_id);
    let params = {	ACCOUNT_OFFICE_CODE : this.office_code}
    this.targetService.TargetDetailgetByCon("TargetDetailgetByCon",params).then(list=>{
      // console.log(list);

        if(list.length != 0){
          this.qty =  list[0].OLD_QTY;
          this.fine =  list[0].SUM_FINE;
        }else{
          this.qty =0;
          this.fine=0;
        }
  

    });
    
  }

  ngOnSend_target(): void{
    this.navService.setEditButton(false);
    this.navService.setDeleteButton(false);
    this.navService.setSendButton(false);
    // this.navService.setSendTargetButton_target(false);
  }


  targetItemDetail_Call: Array<any> = [
    { ID: 0, MONTH: 'ตุลาคม', QTY: 0, FINE: 0, BRI: 0.2, AWA: 0.2, TRE: 0.6, cal_QTY: 0,sum_QTY: 0, cal_FINE: 0,sum_FINE: 0, qty_case :0 , fine_case:0},
    { ID: 1, MONTH: 'พฤศจิกายน', QTY: 0, FINE: 0, BRI: 0.2, AWA: 0.2, TRE: 0.6, cal_QTY: 0,sum_QTY: 0, cal_FINE: 0,sum_FINE: 0, qty_case :0 , fine_case:0},
    { ID: 2, MONTH: 'ธันวาคม', QTY: 0, FINE: 0, BRI: 0.2, AWA: 0.2, TRE: 0.6, cal_QTY: 0,sum_QTY: 0, cal_FINE: 0,sum_FINE: 0, qty_case :0 , fine_case:0},
    { ID: 3, MONTH: 'มกราคม', QTY: 0, FINE: 0, BRI: 0.2, AWA: 0.2, TRE: 0.6, cal_QTY: 0,sum_QTY: 0, cal_FINE: 0,sum_FINE: 0, qty_case :0 , fine_case:0},
    { ID: 4, MONTH: 'กุมภาพันธ์', QTY: 0, FINE: 0, BRI: 0.2, AWA: 0.2, TRE: 0.6, cal_QTY: 0,sum_QTY: 0, cal_FINE: 0,sum_FINE: 0, qty_case :0 , fine_case:0},
    { ID: 5, MONTH: 'มีนาคม', QTY: 0, FINE: 0, BRI: 0.2, AWA: 0.2, TRE: 0.6, cal_QTY: 0,sum_QTY: 0, cal_FINE: 0,sum_FINE: 0, qty_case :0 , fine_case:0},
    { ID: 6, MONTH: 'เมษายน',  QTY: 0, FINE: 0, BRI: 0.2, AWA: 0.2, TRE: 0.6, cal_QTY: 0,sum_QTY: 0, cal_FINE: 0,sum_FINE: 0, qty_case :0 , fine_case:0},
    { ID: 7, MONTH: 'พฤษภาคม', QTY: 0, FINE: 0, BRI: 0.2, AWA: 0.2, TRE: 0.6, cal_QTY: 0,sum_QTY: 0, cal_FINE: 0,sum_FINE: 0, qty_case :0 , fine_case:0},
    { ID: 8, MONTH: 'มิถุนายน', QTY: 0, FINE: 0, BRI: 0.2, AWA: 0.2, TRE: 0.6, cal_QTY: 0,sum_QTY: 0, cal_FINE: 0,sum_FINE: 0, qty_case :0 , fine_case:0},
    { ID: 9, MONTH: 'กรกฎาคม', QTY: 0, FINE: 0, BRI: 0.2, AWA: 0.2, TRE: 0.6, cal_QTY: 0,sum_QTY: 0, cal_FINE: 0,sum_FINE: 0, qty_case :0 , fine_case:0},
    { ID: 10, MONTH: 'สิงหาคม', QTY: 0, FINE: 0, BRI: 0.2, AWA: 0.2, TRE: 0.6, cal_QTY: 0,sum_QTY: 0, cal_FINE: 0,sum_FINE: 0, qty_case :0 , fine_case:0},
    { ID: 11, MONTH: 'กันยายน', QTY: 0, FINE: 0, BRI: 0.2, AWA: 0.2, TRE: 0.6, cal_QTY: 0,sum_QTY: 0, cal_FINE: 0,sum_FINE: 0, qty_case :0 , fine_case:0},
  ];

  qty_Case: Array<any> = [
    {id : 0, qty_case : 0},
    {id : 1, qty_case : 0},
    {id : 2, qty_case : 0},
    {id : 3, qty_case : 0},
    {id : 4, qty_case : 0},
    {id : 5, qty_case : 0},
    {id : 6, qty_case : 0},
    {id : 7, qty_case : 0},
    {id : 8, qty_case : 0},
    {id : 9, qty_case : 0},
    {id : 10, qty_case : 0},
    {id : 11, qty_case : 0},
  ];

  fine_Case: Array<any> = [
    {id : 0, fine_case : 0},
    {id : 1, fine_case : 0},
    {id : 2, fine_case : 0},
    {id : 3, fine_case : 0},
    {id : 4, fine_case : 0},
    {id : 5, fine_case : 0},
    {id : 6, fine_case : 0},
    {id : 7, fine_case : 0},
    {id : 8, fine_case : 0},
    {id : 9, fine_case : 0},
    {id : 10, fine_case : 0},
    {id : 11, fine_case : 0},
  ];

  calTarget(calForm){

    // console.log(calForm);
    var qty = calForm.params;
    var fine = calForm.params;
    var fmonth = calForm.fmonth;
    var first = 0;
    var lmonth = calForm.lmonth;
    var last = 0;

    //set month12
    if (fmonth == 0){first = 0;}if (fmonth == 1){first = 1;}if (fmonth == 2){first = 2;}if (fmonth == 3){first = 3;}if (fmonth == 4){first = 4;}
    if (fmonth == 5){first = 5;}if (fmonth == 6){first = 6;}if (fmonth == 7){first = 7;}if (fmonth == 8){first = 8;}if (fmonth == 9){first = 9;}
    if (fmonth == 10){first = 10;}if (fmonth == 11){first = 11;}

    if (lmonth == 0){last = 0;}if (lmonth == 1){last = 1;}if (lmonth == 2){last = 2;}if (lmonth == 3){last = 3;}if (lmonth == 4){last = 4;}
    if (lmonth == 5){last = 5;}if (lmonth == 6){last = 6;}if (lmonth == 7){last = 7;}if (lmonth == 8){last = 8;}if (lmonth == 9){last = 9;}
    if (lmonth == 10){last = 10;}if (lmonth == 11){last = 11;}
    
    //QTY
    if (calForm.QTY == true){
      
        if (qty != ""){

        // console.log( qty , qty/100);
        // console.log( fmonth, lmonth);
        
        //forAllQTY
        for (var i = 0; i < this.targetItemDetail_Call.length; i++){
          this.targetItemDetail_Call[i].sum_QTY = this.targetItemDetail_Call[i].QTY;
          this.qty_Case[i].qty_case = 0;
        }

        //ifBetweenMonth-Month
        if (fmonth != "" && lmonth != ""){
        if (first == last){
           for (var i = 0; i < this.targetItemDetail_Call.length; i++){
           this.targetItemDetail_Call[fmonth].cal_QTY = (this.targetItemDetail_Call[fmonth].QTY*(qty/100));
           this.targetItemDetail_Call[fmonth].sum_QTY = Math.ceil(this.targetItemDetail_Call[fmonth].cal_QTY+this.targetItemDetail_Call[fmonth].QTY);
           this.qty_Case[fmonth].qty_case = qty;
          }
        }else if (first < last && first != last){
          for (var i = first; i<=last ; i++){
            this.targetItemDetail_Call[i].cal_QTY = (this.targetItemDetail_Call[i].QTY*(qty/100));
            this.targetItemDetail_Call[i].sum_QTY = Math.ceil(this.targetItemDetail_Call[i].cal_QTY+this.targetItemDetail_Call[i].QTY);
            this.qty_Case[i].qty_case = qty;
          }
        }else if (first == 11 && last == 0){
          for (var i = 0 ; i <= last ; i++){
            this.targetItemDetail_Call[i].cal_QTY = (this.targetItemDetail_Call[i].QTY*(qty/100));
            this.targetItemDetail_Call[i].sum_QTY = Math.ceil(this.targetItemDetail_Call[i].cal_QTY+this.targetItemDetail_Call[i].QTY);
            this.qty_Case[i].qty_case = qty;
          }
          this.targetItemDetail_Call[11].cal_QTY = (this.targetItemDetail_Call[11].QTY*(qty/100));
          this.targetItemDetail_Call[11].sum_QTY = Math.ceil(this.targetItemDetail_Call[11].cal_QTY+this.targetItemDetail_Call[11].QTY);
          this.qty_Case[11].qty_case = qty;
        }else if (first == 11 && last == 1){
          for (var i = 0 ; i <= last ; i++){
            this.targetItemDetail_Call[i].cal_QTY = (this.targetItemDetail_Call[i].QTY*(qty/100));
            this.targetItemDetail_Call[i].sum_QTY = Math.ceil(this.targetItemDetail_Call[i].cal_QTY+this.targetItemDetail_Call[i].QTY);
            this.qty_Case[i].qty_case = qty;
          }
          this.targetItemDetail_Call[11].cal_QTY = (this.targetItemDetail_Call[11].QTY*(qty/100));
          this.targetItemDetail_Call[11].sum_QTY = Math.ceil(this.targetItemDetail_Call[11].cal_QTY+this.targetItemDetail_Call[11].QTY);
          this.qty_Case[11].qty_case = qty;
        }else if (first == 11 && last == 2){
          for (var i = 0 ; i <= last ; i++){
            this.targetItemDetail_Call[i].cal_QTY = (this.targetItemDetail_Call[i].QTY*(qty/100));
            this.targetItemDetail_Call[i].sum_QTY = Math.ceil(this.targetItemDetail_Call[i].cal_QTY+this.targetItemDetail_Call[i].QTY);
            this.qty_Case[i].qty_case = qty;
          }
          this.targetItemDetail_Call[11].cal_QTY = (this.targetItemDetail_Call[11].QTY*(qty/100));
          this.targetItemDetail_Call[11].sum_QTY = Math.ceil(this.targetItemDetail_Call[11].cal_QTY+this.targetItemDetail_Call[11].QTY);
          this.qty_Case[11].qty_case = qty;
        }
      }
      }
    }

    if (calForm.FINE == true){

      if (fine != ""){

        // console.log( fine , fine/100);
        // console.log( fmonth, lmonth);

        //forAllFINE
        for (var i = 0; i < this.targetItemDetail_Call.length; i++){
          this.targetItemDetail_Call[i].sum_FINE = this.targetItemDetail_Call[i].FINE;
          this.fine_Case[i].fine_case = 0;
        }

        //ifBetweenMonth-Month
        if (fmonth != "" && lmonth != ""){
        if (first == last){
           for (var i = 0; i < this.targetItemDetail_Call.length; i++){
           this.targetItemDetail_Call[fmonth].cal_FINE = (this.targetItemDetail_Call[fmonth].FINE*(fine/100));
           this.targetItemDetail_Call[fmonth].sum_FINE = Math.ceil(this.targetItemDetail_Call[fmonth].cal_FINE+this.targetItemDetail_Call[fmonth].FINE);
           this.fine_Case[fmonth].fine_case = fine;
          }
        }else if (first < last && first != last){
          for (var i = first; i<=last ; i++){
            this.targetItemDetail_Call[i].cal_FINE = (this.targetItemDetail_Call[i].FINE*(fine/100));
            this.targetItemDetail_Call[i].sum_FINE = Math.ceil(this.targetItemDetail_Call[i].cal_FINE+this.targetItemDetail_Call[i].FINE);
            this.fine_Case[i].fine_case = fine;
          }
        }else if (first == 11 && last == 0){
          for (var i = 0 ; i <= last ; i++){
            this.targetItemDetail_Call[i].cal_FINE = (this.targetItemDetail_Call[i].FINE*(fine/100));
            this.targetItemDetail_Call[i].sum_FINE = Math.ceil(this.targetItemDetail_Call[i].cal_FINE+this.targetItemDetail_Call[i].FINE);
            this.fine_Case[i].fine_case = fine;
          }
          this.targetItemDetail_Call[i].cal_FINE = (this.targetItemDetail_Call[i].FINE*(fine/100));
            this.targetItemDetail_Call[i].sum_FINE = Math.ceil(this.targetItemDetail_Call[i].cal_FINE+this.targetItemDetail_Call[i].FINE);
            this.fine_Case[i].fine_case = fine;
        }else if (first == 11 && last == 1){
          for (var i = 0 ; i <= last ; i++){
            this.targetItemDetail_Call[i].cal_FINE = (this.targetItemDetail_Call[i].FINE*(fine/100));
            this.targetItemDetail_Call[i].sum_FINE = Math.ceil(this.targetItemDetail_Call[i].cal_FINE+this.targetItemDetail_Call[i].FINE);
            this.fine_Case[i].fine_case = fine;
          }
          this.targetItemDetail_Call[i].cal_FINE = (this.targetItemDetail_Call[i].FINE*(fine/100));
            this.targetItemDetail_Call[i].sum_FINE = Math.ceil(this.targetItemDetail_Call[i].cal_FINE+this.targetItemDetail_Call[i].FINE);
            this.fine_Case[i].fine_case = fine;
        }else if (first == 11 && last == 2){
          for (var i = 0 ; i <= last ; i++){
            this.targetItemDetail_Call[i].cal_FINE = (this.targetItemDetail_Call[i].FINE*(fine/100));
            this.targetItemDetail_Call[i].sum_FINE = Math.ceil(this.targetItemDetail_Call[i].cal_FINE+this.targetItemDetail_Call[i].FINE);
            this.fine_Case[i].fine_case = fine;
          }
          this.targetItemDetail_Call[i].cal_FINE = (this.targetItemDetail_Call[i].FINE*(fine/100));
            this.targetItemDetail_Call[i].sum_FINE = Math.ceil(this.targetItemDetail_Call[i].cal_FINE+this.targetItemDetail_Call[i].FINE);
            this.fine_Case[i].fine_case = fine;
        }
      }
      }
    }
  }

    //ยอดรวม
    public getTotalQTY(): number {
      var total = 0;
      for (var i = 0; i < this.targetItemDetail_Call.length; i++) {
        total += this.targetItemDetail_Call[i].QTY
      }
      // console.log('total',total)
      return total;
      
    }

    public totalsum_QTY(): number {
      var total = 0;
      for (var i = 0; i < this.targetItemDetail_Call.length; i++) {
        total += this.targetItemDetail_Call[i].sum_QTY
      }
      // console.log('total',total)
      return total;
      
    }

    public getTotalFINE(): number {
      var total = 0;
      for (var i = 0; i < this.targetItemDetail_Call.length; i++) {
        total += this.targetItemDetail_Call[i].FINE
      }
      // console.log('total',total)
      return total;
      
    }

    public totalsum_FINE(): number {
      var total = 0;
      for (var i = 0; i < this.targetItemDetail_Call.length; i++) {
        total += this.targetItemDetail_Call[i].sum_FINE
      }
      // console.log('total',total)
      return total;
      
    }


    public getTotalBRI(): number {
      var total = 0;
      for (var i = 0; i < this.targetItemDetail_Call.length; i++) {
        total += this.targetItemDetail_Call[i].sum_FINE*this.targetItemDetail_Call[i].BRI
      }
      // console.log('total',total)
      return total;
      
    }


    public getTotalAWA(): number {
      var total = 0;
      for (var i = 0; i < this.targetItemDetail_Call.length; i++) {
        total += this.targetItemDetail_Call[i].sum_FINE*this.targetItemDetail_Call[i].AWA
      }
      // console.log('total',total)
      return total;
      
    } 

    public getTotalTRE(): number {
      var total = 0;
      for (var i = 0; i < this.targetItemDetail_Call.length; i++) {
        total += this.targetItemDetail_Call[i].FINE*this.targetItemDetail_Call[i].TRE
      }
      // console.log('total',total)
      return total;
      
    }

    public getTotalTRE2(): number {
      var total = 0;
      for (var i = 0; i < this.targetItemDetail_Call.length; i++) {
        total += this.targetItemDetail_Call[i].sum_FINE*this.targetItemDetail_Call[i].TRE
      }
      // console.log('total',total)
      return total;
      
    }

    viewTarget() {

      this.router.navigate(['/SuppressTarget/manages/view']);
      this.navService.setSendButton(true);
      this.navService.setPrintButton(true);
    }
    clickSave() {


      const params = [
        {
          ITEM_DETAIL_ID: this.target_item_id0,
          ITEM_ID: this.item_id,
          QTY_CASE: this.targetItemDetail_Call[0].sum_QTY,
          QTY_CASE_PERCENT:  this.targetItemDetail_Call[0].qty_case+this.qty_Case[0].qty_case,
          FINE: this.targetItemDetail_Call[0].sum_FINE,
          FINE_PERCENT:  this.targetItemDetail_Call[0].fine_case+this.fine_Case[0].fine_case,
          TREASURY_MONEY: Math.ceil(this.targetItemDetail_Call[0].sum_FINE*this.targetItemDetail_Call[0].TRE),
          MONTH: "0",
          BRIBE: Math.ceil(this.targetItemDetail_Call[0].sum_FINE*this.targetItemDetail_Call[0].BRI),
          REWARD: Math.ceil(this.targetItemDetail_Call[0].sum_FINE*this.targetItemDetail_Call[0].AWA),
          OLD_BRIBE: 0,
          OLD_FINE: 0,
          OLD_QTY: 0,
          OLD_REWARD: 0,
          OLD_TREASURY: 0
        },
        {
          ITEM_DETAIL_ID: this.target_item_id1,
          ITEM_ID: this.item_id,
          QTY_CASE: this.targetItemDetail_Call[1].sum_QTY,
          QTY_CASE_PERCENT:  this.targetItemDetail_Call[1].qty_case+this.qty_Case[1].qty_case,
          FINE: this.targetItemDetail_Call[1].sum_FINE,
          FINE_PERCENT:  this.targetItemDetail_Call[1].fine_case+this.fine_Case[1].fine_case,
          TREASURY_MONEY: Math.ceil(this.targetItemDetail_Call[1].sum_FINE*this.targetItemDetail_Call[1].TRE),
          MONTH: "1",
          BRIBE: Math.ceil(this.targetItemDetail_Call[1].sum_FINE*this.targetItemDetail_Call[1].BRI),
          REWARD: Math.ceil(this.targetItemDetail_Call[1].sum_FINE*this.targetItemDetail_Call[1].AWA),
          OLD_BRIBE: 0,
          OLD_FINE: 0,
          OLD_QTY: 0,
          OLD_REWARD: 0,
          OLD_TREASURY: 0
        },
        {
          ITEM_DETAIL_ID: this.target_item_id2,
          ITEM_ID: this.item_id,
          QTY_CASE: this.targetItemDetail_Call[2].sum_QTY,
          QTY_CASE_PERCENT:  this.targetItemDetail_Call[2].qty_case+this.qty_Case[2].qty_case,
          FINE: this.targetItemDetail_Call[2].sum_FINE,
          FINE_PERCENT:  this.targetItemDetail_Call[2].fine_case+this.fine_Case[2].fine_case,
          TREASURY_MONEY: Math.ceil(this.targetItemDetail_Call[2].sum_FINE*this.targetItemDetail_Call[2].TRE),
          MONTH: "2",
          BRIBE: Math.ceil(this.targetItemDetail_Call[2].sum_FINE*this.targetItemDetail_Call[2].BRI),
          REWARD: Math.ceil(this.targetItemDetail_Call[2].sum_FINE*this.targetItemDetail_Call[2].AWA),
          OLD_BRIBE: 0,
          OLD_FINE: 0,
          OLD_QTY: 0,
          OLD_REWARD: 0,
          OLD_TREASURY: 0
        },
        {
          ITEM_DETAIL_ID: this.target_item_id3,
          ITEM_ID: this.item_id,
          QTY_CASE: this.targetItemDetail_Call[3].sum_QTY,
          QTY_CASE_PERCENT:  this.targetItemDetail_Call[3].qty_case+this.qty_Case[3].qty_case,
          FINE: this.targetItemDetail_Call[3].sum_FINE,
          FINE_PERCENT:  this.targetItemDetail_Call[3].fine_case+this.fine_Case[3].fine_case,
          TREASURY_MONEY: Math.ceil(this.targetItemDetail_Call[3].sum_FINE*this.targetItemDetail_Call[3].TRE),
          MONTH: "3",
          BRIBE: Math.ceil(this.targetItemDetail_Call[3].sum_FINE*this.targetItemDetail_Call[3].BRI),
          REWARD: Math.ceil(this.targetItemDetail_Call[3].sum_FINE*this.targetItemDetail_Call[3].AWA),
          OLD_BRIBE: 0,
          OLD_FINE: 0,
          OLD_QTY: 0,
          OLD_REWARD: 0,
          OLD_TREASURY: 0
        },
        {
          ITEM_DETAIL_ID: this.target_item_id4,
          ITEM_ID: this.item_id,
          QTY_CASE: this.targetItemDetail_Call[4].sum_QTY,
          QTY_CASE_PERCENT:  this.targetItemDetail_Call[4].qty_case+this.qty_Case[4].qty_case,
          FINE: this.targetItemDetail_Call[4].sum_FINE,
          FINE_PERCENT:  this.targetItemDetail_Call[4].fine_case+this.fine_Case[4].fine_case,
          TREASURY_MONEY: this.targetItemDetail_Call[4].sum_FINE*this.targetItemDetail_Call[4].TRE,
          MONTH: "4",
          BRIBE: this.targetItemDetail_Call[4].sum_FINE*this.targetItemDetail_Call[4].BRI,
          REWARD: this.targetItemDetail_Call[4].sum_FINE*this.targetItemDetail_Call[4].AWA,
          OLD_BRIBE: 0,
          OLD_FINE: 0,
          OLD_QTY: 0,
          OLD_REWARD: 0,
          OLD_TREASURY: 0
        },
        {
          ITEM_DETAIL_ID: this.target_item_id5,
          ITEM_ID: this.item_id,
          QTY_CASE: this.targetItemDetail_Call[5].sum_QTY,
          QTY_CASE_PERCENT:  this.targetItemDetail_Call[5].qty_case+this.qty_Case[5].qty_case,
          FINE: this.targetItemDetail_Call[5].sum_FINE,
          FINE_PERCENT:  this.targetItemDetail_Call[5].fine_case+this.fine_Case[5].fine_case,
          TREASURY_MONEY: Math.ceil(this.targetItemDetail_Call[5].sum_FINE*this.targetItemDetail_Call[5].TRE),
          MONTH: "5",
          BRIBE: Math.ceil(this.targetItemDetail_Call[5].sum_FINE*this.targetItemDetail_Call[5].BRI),
          REWARD: Math.ceil(this.targetItemDetail_Call[5].sum_FINE*this.targetItemDetail_Call[5].AWA),
          OLD_BRIBE: 0,
          OLD_FINE: 0,
          OLD_QTY: 0,
          OLD_REWARD: 0,
          OLD_TREASURY: 0
        },
        {
          ITEM_DETAIL_ID: this.target_item_id6,
          ITEM_ID: this.item_id,
          QTY_CASE: this.targetItemDetail_Call[6].sum_QTY,
          QTY_CASE_PERCENT:  this.targetItemDetail_Call[6].qty_case+this.qty_Case[6].qty_case,
          FINE: this.targetItemDetail_Call[6].sum_FINE,
          FINE_PERCENT:  this.targetItemDetail_Call[6].fine_case+this.fine_Case[6].fine_case,
          TREASURY_MONEY: Math.ceil(this.targetItemDetail_Call[6].sum_FINE*this.targetItemDetail_Call[6].TRE),
          MONTH: "6",
          BRIBE: Math.ceil(this.targetItemDetail_Call[6].sum_FINE*this.targetItemDetail_Call[6].BRI),
          REWARD: Math.ceil(this.targetItemDetail_Call[6].sum_FINE*this.targetItemDetail_Call[6].AWA),
          OLD_BRIBE: 0,
          OLD_FINE: 0,
          OLD_QTY: 0,
          OLD_REWARD: 0,
          OLD_TREASURY: 0
        },
        {
          ITEM_DETAIL_ID: this.target_item_id7,
          ITEM_ID: this.item_id,
          QTY_CASE: this.targetItemDetail_Call[7].sum_QTY,
          QTY_CASE_PERCENT:  this.targetItemDetail_Call[7].qty_case+this.qty_Case[7].qty_case,
          FINE: this.targetItemDetail_Call[7].sum_FINE,
          FINE_PERCENT:  this.targetItemDetail_Call[7].fine_case+this.fine_Case[7].fine_case,
          TREASURY_MONEY: Math.ceil(this.targetItemDetail_Call[7].sum_FINE*this.targetItemDetail_Call[7].TRE),
          MONTH: "7",
          BRIBE: Math.ceil(this.targetItemDetail_Call[7].sum_FINE*this.targetItemDetail_Call[7].BRI),
          REWARD: Math.ceil(this.targetItemDetail_Call[7].sum_FINE*this.targetItemDetail_Call[7].AWA),
          OLD_BRIBE: 0,
          OLD_FINE: 0,
          OLD_QTY: 0,
          OLD_REWARD: 0,
          OLD_TREASURY: 0
        },
        {
          ITEM_DETAIL_ID: this.target_item_id8,
          ITEM_ID: this.item_id,
          QTY_CASE: this.targetItemDetail_Call[8].sum_QTY,
          QTY_CASE_PERCENT:  this.targetItemDetail_Call[8].qty_case+this.qty_Case[8].qty_case,
          FINE: this.targetItemDetail_Call[8].sum_FINE,
          FINE_PERCENT:  this.targetItemDetail_Call[8].fine_case+this.fine_Case[8].fine_case,
          TREASURY_MONEY: Math.ceil(this.targetItemDetail_Call[8].sum_FINE*this.targetItemDetail_Call[8].TRE),
          MONTH: "8",
          BRIBE: Math.ceil(this.targetItemDetail_Call[8].sum_FINE*this.targetItemDetail_Call[8].BRI),
          REWARD: Math.ceil(this.targetItemDetail_Call[8].sum_FINE*this.targetItemDetail_Call[8].AWA),
          OLD_BRIBE: 0,
          OLD_FINE: 0,
          OLD_QTY: 0,
          OLD_REWARD: 0,
          OLD_TREASURY: 0
        },
        {
          ITEM_DETAIL_ID: this.target_item_id9,
          ITEM_ID: this.item_id,
          QTY_CASE: this.targetItemDetail_Call[9].sum_QTY,
          QTY_CASE_PERCENT:  this.targetItemDetail_Call[9].qty_case+this.qty_Case[9].qty_case,
          FINE: this.targetItemDetail_Call[9].sum_FINE,
          FINE_PERCENT:  this.targetItemDetail_Call[9].fine_case+this.fine_Case[9].fine_case,
          TREASURY_MONEY: Math.ceil(this.targetItemDetail_Call[9].sum_FINE*this.targetItemDetail_Call[9].TRE),
          MONTH: "9",
          BRIBE: Math.ceil(this.targetItemDetail_Call[9].sum_FINE*this.targetItemDetail_Call[9].BRI),
          REWARD: Math.ceil(this.targetItemDetail_Call[9].sum_FINE*this.targetItemDetail_Call[9].AWA),
          OLD_BRIBE: 0,
          OLD_FINE: 0,
          OLD_QTY: 0,
          OLD_REWARD: 0,
          OLD_TREASURY: 0
        },
        {
          ITEM_DETAIL_ID: this.target_item_id10,
          ITEM_ID: this.item_id,
          QTY_CASE: this.targetItemDetail_Call[10].sum_QTY,
          QTY_CASE_PERCENT:  this.targetItemDetail_Call[10].qty_case+this.qty_Case[10].qty_case,
          FINE: this.targetItemDetail_Call[10].sum_FINE,
          FINE_PERCENT:  this.targetItemDetail_Call[10].fine_case+this.fine_Case[10].fine_case,
          TREASURY_MONEY: Math.ceil(this.targetItemDetail_Call[1].sum_FINE*this.targetItemDetail_Call[10].TRE),
          MONTH: "10",
          BRIBE: Math.ceil(this.targetItemDetail_Call[10].sum_FINE*this.targetItemDetail_Call[10].BRI),
          REWARD: Math.ceil(this.targetItemDetail_Call[10].sum_FINE*this.targetItemDetail_Call[10].AWA),
          OLD_BRIBE: 0,
          OLD_FINE: 0,
          OLD_QTY: 0,
          OLD_REWARD: 0,
          OLD_TREASURY: 0
        },
        {
          ITEM_DETAIL_ID: this.target_item_id11,
          ITEM_ID: this.item_id,
          QTY_CASE: this.targetItemDetail_Call[11].sum_QTY,
          QTY_CASE_PERCENT:  this.targetItemDetail_Call[11].qty_case+this.qty_Case[11].qty_case,
          FINE: this.targetItemDetail_Call[11].sum_FINE,
          FINE_PERCENT:  this.targetItemDetail_Call[11].fine_case+this.fine_Case[11].fine_case,
          TREASURY_MONEY: Math.ceil(this.targetItemDetail_Call[11].sum_FINE*this.targetItemDetail_Call[11].TRE),
          MONTH: "11",
          BRIBE: Math.ceil(this.targetItemDetail_Call[11].sum_FINE*this.targetItemDetail_Call[11].BRI),
          REWARD: Math.ceil(this.targetItemDetail_Call[11].sum_FINE*this.targetItemDetail_Call[11].AWA),
          OLD_BRIBE: 0,
          OLD_FINE: 0,
          OLD_QTY: 0,
          OLD_REWARD: 0,
          OLD_TREASURY: 0
        }
      ]

      swal({
        type: 'warning',
        text: Messages_target.confirm_mes + ' ?',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่ใช่',
        buttonsStyling: true,
  
      }).then((result) => {
        if (result.value) {
          let isSuccess: boolean = true;
          if (isSuccess) {
            this.targetService.TargetItemDetailupdByCon("TargetItemDetailupdByCon",params).then(list=>{
              location.reload();
            });
          } else {
            swal({
              type: 'error',
              text: 'ไม่สามารถทำรายการได้'
            });
          }
        }
      });

    }
  
    clickCancel() {
      swal({
        type: 'warning',
        text: Messages_target.cancel_mes + ' ?',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่ใช่',
        buttonsStyling: true,
  
      }).then((result) => {
        if (result.value) {
          let isSuccess: boolean = true;
          if (isSuccess) {
            location.reload();
          } else {
            swal({
              type: 'error',
              text: 'ไม่สามารถทำรายการได้'
            });
          }
        }
      });
    }
  
    clickPrint() {
      this.modal = this.ngbModel.open(PrintdocModelComponent, { backdrop: 'static', size: 'lg', })
    }
  
    clickEdit() {
  
      this.edit = true;
      this.print_btn = false;
      this.edit_btn = false;
      this.delete_btn = false;
      this.save_btn = true;
      this.send_btn = false;
      this.cancel_btn = true;
      this.edit2 = <boolean>(false);
    }
  
    clickSend(){

      swal({
        type: 'warning',
        text: Messages_target.confirm_mes + ' ?',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่ใช่',
        buttonsStyling: true,
  
      }).then((result) => {
        if (result.value) {
          let isSuccess: boolean = true;
          if (isSuccess) {

            const param = { ITEM_ID : this.item_id}
  
          this.targetService.IsSentTargetupdByCon("IsSentTargetupdByCon",param).then(list=>{
            // console.log(list);
            if(list.IsSuccess == 'True'){
              location.reload();
            }else {
              swal({
                type: 'error',
                text: 'ไม่สามารถส่งข้อมูลได้',
                confirmButtonText: 'ยืนยัน',
                reverseButtons: false,
              });
            }
      
          });

          } else {
            swal({
              type: 'error',
              text: 'ไม่สามารถทำรายการได้'
            });
          }
        }
      });
    }
  
    clickDelete(){

      swal({
        type: 'warning',
        text: Messages_target.confirm_mes + ' ?',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่ใช่',
        buttonsStyling: true,
  
      }).then((result) => {
        if (result.value) {
          let isSuccess: boolean = true;
          if (isSuccess) {

            const param = { ITEM_ID : this.item_id}
  
            this.targetService.TargetupdDelete("TargetupdDelete",param).then(list=>{
              // console.log(list);
              if(list.IsSuccess == 'True'){
                swal({
                  type: 'success',
                  text: 'ลบข้อมูลสำเร็จ',
                  confirmButtonText: 'ยืนยัน',
                  buttonsStyling: true,
                }).then((result) => {
                  this.router.navigate([`/SuppressTarget/list/`]);
                });
        
              }else {
                swal({
                  type: 'error',
                  text: 'ไม่สามารถลบข้อมูลได้',
                  confirmButtonText: 'ยืนยัน',
                  reverseButtons: false,
                });
              }
        
            });
          } else {
            swal({
              type: 'error',
              text: 'ไม่สามารถทำรายการได้'
            });
          }
        }
      });
      
    }
  
  
}
