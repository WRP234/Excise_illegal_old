import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// import { Nav_Areatarget_Service } from '../nav_target.service';
import { Nav_target_Service } from "../../../../shared/header-navigation/nav_target.service";
import { pagination } from '../../../../config/pagination';
import { SuppressTarget } from '../../suppressTarget.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
// import { Nav_target_Service } from '../../../../shared/header-navigation/nav_target.service';
import { TargetService } from '../../target.service';

import { Subject } from 'rxjs/Subject';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
// import { NavigateService } from '../navigate/navigate.service';
import swal from 'sweetalert2';
import { Messages_target} from '../../new_message';
import { async } from '@angular/core/testing';
import { stat } from 'fs';
import { PreloaderService } from '../../../../shared/preloader/preloader.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrintdocModelComponent } from '../../printdoc-model/printdoc-model.component';
import { sequence } from '@angular/core/src/animation/dsl';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})

export class ViewComponent implements OnInit {

  lawsuit: boolean = true;
  fine: boolean = true;
  bribe: boolean = false;
  award: boolean = false;
  treasury: boolean = false;
  save_btn: boolean = false;
  cancel_btn: boolean = true;
  print_btn: boolean = false;
  delete_btn: boolean = true;
  mode : any;
  sub : any;
  marked = true;
  offfice_code : any;
  offfice_id : any;
  target_id :any;
  item_id : any
  sequence : any;
  year : any;
  product : any;
  lawsult_type : any;
  lawsult_name : any;
  office_name : any;
  old_qty = 0;
  old_fine = 0;
  issend : any;
  sum_sequence = 1;

  //ภาค
  condition_sepuence = 0;
  condition_sepuence1 = 0;
  condition_sepuence2 = 0;
  condition_sepuence3 = 0;
  condition_sepuence4 = 0;
  condition_sepuence5 = 0;
  condition_sepuence6 = 0;
  condition_sepuence7 = 0;
  condition_sepuence8 = 0;
  condition_sepuence9 = 0;
  condition_sepuence10 = 0;
  condition_sepuence11 = 0;
  condition_sepuence12 = 0;

  table = <boolean>(false);
  table1 = <boolean>(false);
  table2 = <boolean>(false);
  table3 = <boolean>(false);
  table4 = <boolean>(false);
  table5 = <boolean>(false);
  table6 = <boolean>(false);
  table7 = <boolean>(false);
  table8 = <boolean>(false);
  table9 = <boolean>(false);
  table10 = <boolean>(false);
  table11 = <boolean>(false);
  table12 = <boolean>(false);
  targetTotal = <boolean>(false);
  row = <boolean>(false);
  row1 = <boolean>(true);
  row2 = <boolean>(true);

  office_table = [];
  office_id_table = [];

  toggleVisibility(e){
    this.marked= e.target.checked;
  }

   //checkbox
  list = [
    {
      ตาราง: 'ทั้งหมด',
      checked: false,
    }
  ]
  list1 = [
    {
      ตาราง: 'เงินสินบน',
      checked: false,
    }
  ]
  list2 = [
    {
      ตาราง: 'จำนวนคดี',
      checked: true,
    }
  ]
  list3 = [
    {
      ตาราง: 'เงินรางวัล',
      checked: false,
    }
  ]
  list4 = [
    {
      ตาราง: 'เงินค่าปรับ',
      checked: true,
    }
  ]
  list5 = [
    {
      ตาราง: 'เงินส่งคลัง',
      checked: false,
    }
  ]

  //data พื้นที่/ภาค
  public condition_zone: any[] = [];
  public tempData: any[] = [];
  public tempDatas: any[] = [
  { ID: 0, MONTH: 'ตุลาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
  { ID: 1, MONTH: 'พฤศจิกายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
  { ID: 2, MONTH: 'ธันวาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
  { ID: 3, MONTH: 'มกราคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
  { ID: 4, MONTH: 'กุมภาพันธ์', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
  { ID: 5, MONTH: 'มีนาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
  { ID: 6, MONTH: 'เมษายน',  QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
  { ID: 7, MONTH: 'พฤษภาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
  { ID: 8, MONTH: 'มิถุนายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
  { ID: 9, MONTH: 'กรกฎาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
  { ID: 10, MONTH: 'สิงหาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
  { ID: 11, MONTH: 'กันยายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },];
  public tempDatas1: any[] = [    
  { ID: 0, MONTH: 'ตุลาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
  { ID: 1, MONTH: 'พฤศจิกายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
  { ID: 2, MONTH: 'ธันวาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
  { ID: 3, MONTH: 'มกราคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
  { ID: 4, MONTH: 'กุมภาพันธ์', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
  { ID: 5, MONTH: 'มีนาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
  { ID: 6, MONTH: 'เมษายน',  QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
  { ID: 7, MONTH: 'พฤษภาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
  { ID: 8, MONTH: 'มิถุนายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
  { ID: 9, MONTH: 'กรกฎาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
  { ID: 10, MONTH: 'สิงหาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
  { ID: 11, MONTH: 'กันยายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },];
  public tempDatas2: any[] = [    
    { ID: 0, MONTH: 'ตุลาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 1, MONTH: 'พฤศจิกายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 2, MONTH: 'ธันวาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 3, MONTH: 'มกราคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 4, MONTH: 'กุมภาพันธ์', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 5, MONTH: 'มีนาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 6, MONTH: 'เมษายน',  QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 7, MONTH: 'พฤษภาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 8, MONTH: 'มิถุนายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 9, MONTH: 'กรกฎาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 10, MONTH: 'สิงหาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 11, MONTH: 'กันยายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },];
  public tempDatas3: any[] = [ 
    { ID: 0, MONTH: 'ตุลาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 1, MONTH: 'พฤศจิกายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 2, MONTH: 'ธันวาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 3, MONTH: 'มกราคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 4, MONTH: 'กุมภาพันธ์', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 5, MONTH: 'มีนาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 6, MONTH: 'เมษายน',  QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 7, MONTH: 'พฤษภาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 8, MONTH: 'มิถุนายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 9, MONTH: 'กรกฎาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 10, MONTH: 'สิงหาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 11, MONTH: 'กันยายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },];
  public tempDatas4: any[] = [ 
    { ID: 0, MONTH: 'ตุลาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 1, MONTH: 'พฤศจิกายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 2, MONTH: 'ธันวาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 3, MONTH: 'มกราคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 4, MONTH: 'กุมภาพันธ์', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 5, MONTH: 'มีนาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 6, MONTH: 'เมษายน',  QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 7, MONTH: 'พฤษภาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 8, MONTH: 'มิถุนายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 9, MONTH: 'กรกฎาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 10, MONTH: 'สิงหาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 11, MONTH: 'กันยายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },];
  public tempDatas5: any[] = [ 
    { ID: 0, MONTH: 'ตุลาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 1, MONTH: 'พฤศจิกายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 2, MONTH: 'ธันวาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 3, MONTH: 'มกราคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 4, MONTH: 'กุมภาพันธ์', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 5, MONTH: 'มีนาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 6, MONTH: 'เมษายน',  QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 7, MONTH: 'พฤษภาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 8, MONTH: 'มิถุนายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 9, MONTH: 'กรกฎาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 10, MONTH: 'สิงหาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 11, MONTH: 'กันยายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },];
  public tempDatas6: any[] = [ 
    { ID: 0, MONTH: 'ตุลาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 1, MONTH: 'พฤศจิกายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 2, MONTH: 'ธันวาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 3, MONTH: 'มกราคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 4, MONTH: 'กุมภาพันธ์', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 5, MONTH: 'มีนาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 6, MONTH: 'เมษายน',  QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 7, MONTH: 'พฤษภาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 8, MONTH: 'มิถุนายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 9, MONTH: 'กรกฎาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 10, MONTH: 'สิงหาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 11, MONTH: 'กันยายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },];
  public tempDatas7: any[] = [
    { ID: 0, MONTH: 'ตุลาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 1, MONTH: 'พฤศจิกายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 2, MONTH: 'ธันวาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 3, MONTH: 'มกราคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 4, MONTH: 'กุมภาพันธ์', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 5, MONTH: 'มีนาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 6, MONTH: 'เมษายน',  QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 7, MONTH: 'พฤษภาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 8, MONTH: 'มิถุนายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 9, MONTH: 'กรกฎาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 10, MONTH: 'สิงหาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 11, MONTH: 'กันยายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },];
  public tempDatas8: any[] = [
    { ID: 0, MONTH: 'ตุลาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 1, MONTH: 'พฤศจิกายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 2, MONTH: 'ธันวาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 3, MONTH: 'มกราคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 4, MONTH: 'กุมภาพันธ์', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 5, MONTH: 'มีนาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 6, MONTH: 'เมษายน',  QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 7, MONTH: 'พฤษภาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 8, MONTH: 'มิถุนายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 9, MONTH: 'กรกฎาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 10, MONTH: 'สิงหาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 11, MONTH: 'กันยายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },];
  public tempDatas9: any[] = [ 
    { ID: 0, MONTH: 'ตุลาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 1, MONTH: 'พฤศจิกายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 2, MONTH: 'ธันวาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 3, MONTH: 'มกราคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 4, MONTH: 'กุมภาพันธ์', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 5, MONTH: 'มีนาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 6, MONTH: 'เมษายน',  QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 7, MONTH: 'พฤษภาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 8, MONTH: 'มิถุนายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 9, MONTH: 'กรกฎาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 10, MONTH: 'สิงหาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 11, MONTH: 'กันยายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },];
  public tempDatas10: any[] = [ 
    { ID: 0, MONTH: 'ตุลาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 1, MONTH: 'พฤศจิกายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 2, MONTH: 'ธันวาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 3, MONTH: 'มกราคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 4, MONTH: 'กุมภาพันธ์', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 5, MONTH: 'มีนาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 6, MONTH: 'เมษายน',  QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 7, MONTH: 'พฤษภาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 8, MONTH: 'มิถุนายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 9, MONTH: 'กรกฎาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 10, MONTH: 'สิงหาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 11, MONTH: 'กันยายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },];
  public tempDatas11: any[] = [ 
      { ID: 0, MONTH: 'ตุลาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
      { ID: 1, MONTH: 'พฤศจิกายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
      { ID: 2, MONTH: 'ธันวาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
      { ID: 3, MONTH: 'มกราคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
      { ID: 4, MONTH: 'กุมภาพันธ์', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
      { ID: 5, MONTH: 'มีนาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
      { ID: 6, MONTH: 'เมษายน',  QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
      { ID: 7, MONTH: 'พฤษภาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
      { ID: 8, MONTH: 'มิถุนายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
      { ID: 9, MONTH: 'กรกฎาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
      { ID: 10, MONTH: 'สิงหาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
      { ID: 11, MONTH: 'กันยายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },];
  public tempDatas12: any[] = [ 
    { ID: 0, MONTH: 'ตุลาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 1, MONTH: 'พฤศจิกายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 2, MONTH: 'ธันวาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 3, MONTH: 'มกราคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 4, MONTH: 'กุมภาพันธ์', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 5, MONTH: 'มีนาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 6, MONTH: 'เมษายน',  QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 7, MONTH: 'พฤษภาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 8, MONTH: 'มิถุนายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 9, MONTH: 'กรกฎาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 10, MONTH: 'สิงหาคม', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },
    { ID: 11, MONTH: 'กันยายน', QTY: 0, FINE: 0 , TRE: 0, BRI : 0 , AWA :0 , QTY_CASE_PERCENT : 0 , FINE_PERCENT : 0 },];

  public years: any[] = [
  { ID: 0, MONTH: 'ตุลาคม' },
  { ID: 1, MONTH: 'พฤศจิกายน' },
  { ID: 2, MONTH: 'ธันวาคม' },
  { ID: 3, MONTH: 'มกราคม' },
  { ID: 4, MONTH: 'กุมภาพันธ์' },
  { ID: 5, MONTH: 'มีนาคม' },
  { ID: 6, MONTH: 'เมษายน' },
  { ID: 7, MONTH: 'พฤษภาคม' },
  { ID: 8, MONTH: 'มิถุนายน' },
  { ID: 9, MONTH: 'กรกฎาคม' },
  { ID: 10, MONTH: 'สิงหาคม' },
  { ID: 11, MONTH: 'กันยายน' },];

  constructor(
    private navService: Nav_target_Service,
    private ngbModel: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    private targetService : TargetService,
    private activeRoute: ActivatedRoute,
  ) { }


  ngOnInit() {
    localStorage.setItem('programcode', 'ILG60-99-02');

    this.navService.setSendButton(true);
    this.navService.setPrintButton(true);
    this.navigate_service();

  }

  private active_Route() {
    this.activeRoute.params.takeUntil(this.destroy$).subscribe(p => {
      this.mode = p['mode'];
    });
  }

  
  private destroy$: Subject<boolean> = new Subject<boolean>();
  modal: any;
  
  private navigate_service() {

    this.sub = this.activeRoute.params.subscribe(p => {

      
      this.offfice_code = p.off;
      this.item_id = p.id;
      this.target_id = p.name;

      // console.log(p.id)

      const para = {
        ACCOUNT_OFFICE_CODE : this.offfice_code
      }
      this.targetService.TargetDetailgetByCon("TargetDetailgetByCon",para).then(list=>{
        // console.log(list)
        for (var i=0;i<list.length;i++){
          if ( list[i].TARGET_ID == this.item_id){
            this.old_qty = list[i].OLD_QTY;
            this.old_fine = list[i].SUM_FINE;
          }
        }
      });

      // console.log(p.name)

      // const par = {
      //     TEXT_SEARCH: this.target_id,
      //     OFFICE_CODE: this.offfice_code
      // }

      const paramss = {
        TEXT_SEARCH : this.offfice_code,
        OFFICE_ID : "" 
      }
      this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramss).then(ssss=>{

      var ofname = ssss.RESPONSE_DATA[0].OFFICE_NAME;

      // console.log(ofname)

      const offCode = localStorage.getItem("officeCode");

      const par = {
        TEXT_SEARCH: ofname
    }

      this.targetService.TargetListgetByKeyword(par).subscribe(lists=>{
        // console.log(lists)

        for (var sss =0; sss<lists.length; sss++){
          if( lists[sss].ITEM_ID == this.item_id ){

            console.log(lists[sss].OFFICE_NAME);

            for (var i=0;i<lists.length;i++){
              this.year = lists[sss].BUDGET_YEAR;
              this.lawsult_type = lists[sss].LAWSUIT_TYPE_TARGET;
              this.office_name = lists[sss].OFFICE_NAME;
              this.product = lists[sss].PRODUCT_GROUP_NAME;
              this.sequence = lists[sss].SEQUENCE;
              this.issend = lists[sss].IS_SEND;
            }
    
            if (this.issend == 1){
              this.save_btn = false;
              this.print_btn = true;
            }else{
              this.save_btn = true;
              this.print_btn = false;
            }
    
            if (this.lawsult_type == 0){
              this.lawsult_name = "เปรียบเทียบปรับ";
            }else if (this.lawsult_type == 1){
              this.lawsult_name = "ส่งฟ้องศาล";
            }else if (this.lawsult_type == 2){
              this.lawsult_name = "ไม่มีตัว";
            }
    
          // console.log(this.offfice_code);
    
          var nums1 = this.offfice_code.charAt(0);
          var nums2 = this.offfice_code.charAt(1);
          var nums3 = this.offfice_code.charAt(2);
          var nums4 = this.offfice_code.charAt(3);
          var nums5 = this.offfice_code.charAt(4);
          var nums6 = this.offfice_code.charAt(5);
    
          //สนง
          var first4 = nums1+nums2+nums3+nums4;
          var last2 = nums5+nums6;
    
          //ภาค
          var first2 = nums1+nums2;
          var last4 = nums3+nums4+nums5+nums6;
    
          //พื้นที่
          var middle2 = nums3+nums4;
    
          
          if(  first4 == "0001"||first4 == "0002"||first4 == "0003"||first4 == "0004"||first4 == "0005"||first4 == "0006"||
                  first4 == "0008"||first4 == "0009"||first4 == "0010"||first4 == "0011"||first4 == "0012"||first4 == "0013" )
            {
                if(  last2 == "00"||last2 == "01"||last2 == "02"||last2 == "03"||last2 == "04"||last2 == "05"||
                  last2 == "06"||last2 == "07"||last2 == "08"||last2 == "09"||last2 == "10")
                  {
                    console.log("สำนักงาน");
                    {
                      // console.log("ภาค")
                      var s1 = [];var s2 = [];var s3 = [];var s4 = [];var s5 = [];var s6 = [];
                        var s7 = [];var s8 = [];var s9 = [];var s10 = [];var s11 = [];var s12 = [];
      
                        var sw1 = [];var sw2 = [];var sw3 = [];var sw4 = [];var sw5 = [];var sw6 = [];
                        var sw7 = [];var sw8 = [];var sw9 = [];var sw10 = [];var sw11 = [];var sw12 = [];
      
                        let paramss1 = {
                          TEXT_SEARCH : "010000",
                          OFFICE_ID : "" 
                        }
                        this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramss1).then(list1=>{
                          // console.log(list.RESPONSE_DATA);
                          if (list1.RESPONSE_DATA.length != 0){
                          s1 = list1.RESPONSE_DATA[0].OFFICE_NAME;
                          sw1 = list1.RESPONSE_DATA[0].OFFICE_CODE;}
      
                        
                        let paramss2 = {
                          TEXT_SEARCH : "020000",
                          OFFICE_ID : "" 
                        }
                        this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramss2).then(list2=>{
                          // console.log(list.RESPONSE_DATA);
                          if (list2.RESPONSE_DATA.length != 0){
                          s2 = list2.RESPONSE_DATA[0].OFFICE_NAME;
                          sw2 = list2.RESPONSE_DATA[0].OFFICE_CODE;}
      
                        let paramss3 = {
                          TEXT_SEARCH : "030000",
                          OFFICE_ID : "" 
                        }
                        this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramss3).then(list3=>{
                          // console.log(list.RESPONSE_DATA);
                          if (list3.RESPONSE_DATA.length != 0){
                          s3 = list3.RESPONSE_DATA[0].OFFICE_NAME;
                          sw3 = list3.RESPONSE_DATA[0].OFFICE_CODE;}
      
                        let paramss4 = {
                          TEXT_SEARCH : "040000",
                          OFFICE_ID : "" 
                        }
                        this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramss4).then(list4=>{
                          // console.log(list.RESPONSE_DATA);
                          if (list4.RESPONSE_DATA.length != 0){
                          s4 = list4.RESPONSE_DATA[0].OFFICE_NAME;
                          sw4 = list4.RESPONSE_DATA[0].OFFICE_CODE;}
      
                        let paramss5 = {
                          TEXT_SEARCH : "050000",
                          OFFICE_ID : "" 
                        }
                        this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramss5).then(list5=>{
                          // console.log(list.RESPONSE_DATA);
                          if (list5.RESPONSE_DATA.length != 0){
                          s5 = list5.RESPONSE_DATA[0].OFFICE_NAME;
                          sw5 = list5.RESPONSE_DATA[0].OFFICE_CODE;}
      
                        let paramss6 = {
                          TEXT_SEARCH : "060000",
                          OFFICE_ID : "" 
                        }
                        this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramss6).then(list6=>{
                          // console.log(list.RESPONSE_DATA);
                          if (list6.RESPONSE_DATA.length != 0){
                          s6 = list6.RESPONSE_DATA[0].OFFICE_NAME;
                          sw6 = list6.RESPONSE_DATA[0].OFFICE_CODE;}
      
                        let paramss7 = {
                          TEXT_SEARCH : "070000",
                          OFFICE_ID : "" 
                        }
                        this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramss7).then(list7=>{
                          // console.log(list.RESPONSE_DATA);
                          if (list7.RESPONSE_DATA.length != 0){
                          s7 = list7.RESPONSE_DATA[0].OFFICE_NAME;
                          sw7 = list7.RESPONSE_DATA[0].OFFICE_CODE;}
      
                        let paramss8 = {
                          TEXT_SEARCH : "080000",
                          OFFICE_ID : "" 
                        }
                        this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramss8).then(list8=>{
                          // console.log(list.RESPONSE_DATA);
                          if (list8.RESPONSE_DATA.length != 0){
                          s8 = list8.RESPONSE_DATA[0].OFFICE_NAME;
                          sw8 = list8.RESPONSE_DATA[0].OFFICE_CODE;}
      
                        let paramss9 = {
                          TEXT_SEARCH : "090000",
                          OFFICE_ID : "" 
                        }
                        this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramss9).then(list9=>{
                          // console.log(list.RESPONSE_DATA);
                          if (list9.RESPONSE_DATA.length != 0){
                          s9 = list9.RESPONSE_DATA[0].OFFICE_NAME;
                          sw9 = list9.RESPONSE_DATA[0].OFFICE_CODE;}
      
                        let paramss10 = {
                          TEXT_SEARCH : "100000",
                          OFFICE_ID : "" 
                        }
                        this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramss10).then(list10=>{
                          // console.log(list.RESPONSE_DATA);
                          if (list10.RESPONSE_DATA.length != 0){
                          s10 = list10.RESPONSE_DATA[0].OFFICE_NAME;
                          sw10 = list10.RESPONSE_DATA[0].OFFICE_CODE;}
      
                        let paramss11 = {
                          TEXT_SEARCH : "110000",
                          OFFICE_ID : "" 
                        }
                        this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramss11).then(list11=>{
                          // console.log(list.RESPONSE_DATA);
                          if (list11.RESPONSE_DATA.length != 0){
                          s11 = list11.RESPONSE_DATA[0].OFFICE_NAME;
                          sw11 = list11.RESPONSE_DATA[0].OFFICE_CODE;}
      
                        let paramss12 = {
                          TEXT_SEARCH : "120000",
                          OFFICE_ID : "" 
                        }
                        this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramss12).then(list12=>{
                          // console.log(list.RESPONSE_DATA);
                          if (list12.RESPONSE_DATA.length != 0){
                            s12 = list12.RESPONSE_DATA[0].OFFICE_NAME
                            sw12 = list12.RESPONSE_DATA[0].OFFICE_CODE;;
                          }
                          this.row = true;
      
                         if (s12.length !== 0){
                          this.condition_sepuence = 12;
                          this.tempData.push({
                            header1 : s1,
                            header2 : s2,
                            header3 : s3,
                            header4 : s4,
                            header5 : s5,
                            header6 : s6,
                            header7 : s7,
                            header8 : s8,
                            header9 : s9,
                            header10 : s10,
                            header11 : s11,
                            header12 : s12,
                            });
      
                            this.condition_zone.push({
                              office1 : sw1,
                              office2 : sw2,
                              office3 : sw3,
                              office4 : sw4,
                              office5 : sw5,
                              office6 : sw6,
                              office7 : sw7,
                              office8 : sw8,
                              office9 : sw9,
                              office10 : sw10,
                              office11 : sw11,
                              office12 : sw12,
                              });
      
                                this.table12 = true;
                                this.table11 = true;
                                this.table10 = true;
                                this.table9 = true;
                                this.table8 = true;
                                this.table7 = true;
                                this.table6 = true;
                                this.table5 = true;
                                this.table4 = true;
                                this.table3 = true;
                                this.table2 = true;
                                this.table1 = true;
                                this.table = true;
      
                         }else if (s11.length !== 0){
                          this.condition_sepuence = 11;
                          this.tempData.push({
                            header1 : s1,
                            header2 : s2,
                            header3 : s3,
                            header4 : s4,
                            header5 : s5,
                            header6 : s6,
                            header7 : s7,
                            header8 : s8,
                            header9 : s9,
                            header10 : s10,
                            header11 : s11,
                            })
                            this.condition_zone.push({
                              office1 : sw1,
                              office2 : sw2,
                              office3 : sw3,
                              office4 : sw4,
                              office5 : sw5,
                              office6 : sw6,
                              office7 : sw7,
                              office8 : sw8,
                              office9 : sw9,
                              office10 : sw10,
                              office11 : sw11,
                              office12 : null,
                              });
                                
                                this.table11 = true;
                                this.table10 = true;
                                this.table9 = true;
                                this.table8 = true;
                                this.table7 = true;
                                this.table6 = true;
                                this.table5 = true;
                                this.table4 = true;
                                this.table3 = true;
                                this.table2 = true;
                                this.table1 = true;
                                this.table = true;
      
                         }else if (s10.length !== 0){
                          this.condition_sepuence = 10;
                          this.tempData.push({
                            header1 : s1,
                            header2 : s2,
                            header3 : s3,
                            header4 : s4,
                            header5 : s5,
                            header6 : s6,
                            header7 : s7,
                            header8 : s8,
                            header9 : s9,
                            header10 : s10,
                            })
                            this.condition_zone.push({
                              office1 : sw1,
                              office2 : sw2,
                              office3 : sw3,
                              office4 : sw4,
                              office5 : sw5,
                              office6 : sw6,
                              office7 : sw7,
                              office8 : sw8,
                              office9 : sw9,
                              office10 : sw10,
                              office11 : null,
                              office12 : null,
                              });
                                
                                this.table10 = true;
                                this.table9 = true;
                                this.table8 = true;
                                this.table7 = true;
                                this.table6 = true;
                                this.table5 = true;
                                this.table4 = true;
                                this.table3 = true;
                                this.table2 = true;
                                this.table1 = true;
                                this.table = true;
      
                         }else if (s9.length !== 0){
                          this.condition_sepuence = 9;
                          this.tempData.push({
                            header1 : s1,
                            header2 : s2,
                            header3 : s3,
                            header4 : s4,
                            header5 : s5,
                            header6 : s6,
                            header7 : s7,
                            header8 : s8,
                            header9 : s9,
                            })
      
                            this.condition_zone.push({
                              office1 : sw1,
                              office2 : sw2,
                              office3 : sw3,
                              office4 : sw4,
                              office5 : sw5,
                              office6 : sw6,
                              office7 : sw7,
                              office8 : sw8,
                              office9 : sw9,
                              office10 : null,
                              office11 : null,
                              office12 : null,
                              });
                              
                                this.table9 = true;
                                this.table8 = true;
                                this.table7 = true;
                                this.table6 = true;
                                this.table5 = true;
                                this.table4 = true;
                                this.table3 = true;
                                this.table2 = true;
                                this.table1 = true;
                                this.table = true;
      
                         }else if (s8.length !== 0){
                          this.condition_sepuence = 8;
                          this.tempData.push({
                            header1 : s1,
                            header2 : s2,
                            header3 : s3,
                            header4 : s4,
                            header5 : s5,
                            header6 : s6,
                            header7 : s7,
                            header8 : s8,
                            })
      
                            this.condition_zone.push({
                              office1 : sw1,
                              office2 : sw2,
                              office3 : sw3,
                              office4 : sw4,
                              office5 : sw5,
                              office6 : sw6,
                              office7 : sw7,
                              office8 : sw8,
                              office9 : null,
                              office10 : null,
                              office11 : null,
                              office12 : null,
                              });
                               
                                this.table8 = true;
                                this.table7 = true;
                                this.table6 = true;
                                this.table5 = true;
                                this.table4 = true;
                                this.table3 = true;
                                this.table2 = true;
                                this.table1 = true;
                                this.table = true;
      
                         }else if (s7.length !== 0){
                          this.condition_sepuence = 7;
                          this.tempData.push({
                            header1 : s1,
                            header2 : s2,
                            header3 : s3,
                            header4 : s4,
                            header5 : s5,
                            header6 : s6,
                            header7 : s7,
                            })
      
                            this.condition_zone.push({
                              office1 : sw1,
                              office2 : sw2,
                              office3 : sw3,
                              office4 : sw4,
                              office5 : sw5,
                              office6 : sw6,
                              office7 : sw7,
                              office8 : null,
                              office9 : null,
                              office10 : null,
                              office11 : null,
                              office12 : null,
                              });
                               
                                this.table7 = true;
                                this.table6 = true;
                                this.table5 = true;
                                this.table4 = true;
                                this.table3 = true;
                                this.table2 = true;
                                this.table1 = true;
                                this.table = true;
      
                         }else if (s6.length !== 0){
                          this.condition_sepuence = 6;
                          this.tempData.push({
                            header1 : s1,
                            header2 : s2,
                            header3 : s3,
                            header4 : s4,
                            header5 : s5,
                            header6 : s6,
                            })
      
                            this.condition_zone.push({
                              office1 : sw1,
                              office2 : sw2,
                              office3 : sw3,
                              office4 : sw4,
                              office5 : sw5,
                              office6 : sw6,
                              office7 : null,
                              office8 : null,
                              office9 : null,
                              office10 : null,
                              office11 : null,
                              office12 : null,
                              });
                               
                                this.table6 = true;
                                this.table5 = true;
                                this.table4 = true;
                                this.table3 = true;
                                this.table2 = true;
                                this.table1 = true;
                                this.table = true;
      
                         }else if (s5.length !== 0){
                          this.condition_sepuence = 5;
                          this.tempData.push({
                            header1 : s1,
                            header2 : s2,
                            header3 : s3,
                            header4 : s4,
                            header5 : s5,
                            })
      
                            this.condition_zone.push({
                              office1 : sw1,
                              office2 : sw2,
                              office3 : sw3,
                              office4 : sw4,
                              office5 : sw5,
                              office6 : null,
                              office7 : null,
                              office8 : null,
                              office9 : null,
                              office10 : null,
                              office11 : null,
                              office12 : null,
                              });
                               
                                this.table5 = true;
                                this.table4 = true;
                                this.table3 = true;
                                this.table2 = true;
                                this.table1 = true;
                                this.table = true;
      
                         }else if (s4.length !== 0){
                          this.condition_sepuence = 4;
                          this.tempData.push({
                            header1 : s1,
                            header2 : s2,
                            header3 : s3,
                            header4 : s4,
                            })
      
                            this.condition_zone.push({
                              office1 : sw1,
                              office2 : sw2,
                              office3 : sw3,
                              office4 : sw4,
                              office5 : null,
                              office6 : null,
                              office7 : null,
                              office8 : null,
                              office9 : null,
                              office10 : null,
                              office11 : null,
                              office12 : null,
                              });
                               
                                this.table4 = true;
                                this.table3 = true;
                                this.table2 = true;
                                this.table1 = true;
                                this.table = true;
      
                         }else if (s3.length !== 0){
                          this.condition_sepuence = 3;
                          this.tempData.push({
                            header1 : s1,
                            header2 : s2,
                            header3 : s3,
                            })
      
                            this.condition_zone.push({
                              office1 : sw1,
                              office2 : sw2,
                              office3 : sw3,
                              office4 : null,
                              office5 : null,
                              office6 : null,
                              office7 : null,
                              office8 : null,
                              office9 : null,
                              office10 : null,
                              office11 : null,
                              office12 : null,
                              });
                               
                                this.table3 = true;
                                this.table2 = true;
                                this.table1 = true;
                                this.table = true;
      
                         }else if (s2.length !== 0){
                          this.condition_sepuence = 2;
                          this.tempData.push({
                            header1 : s1,
                            header2 : s2,
                            })
      
                            this.condition_zone.push({
                              office1 : sw1,
                              office2 : sw2,
                              office3 : null,
                              office4 : null,
                              office5 : null,
                              office6 : null,
                              office7 : null,
                              office8 : null,
                              office9 : null,
                              office10 : null,
                              office11 : null,
                              office12 : null,
                              });
                               
                                this.table2 = true;
                                this.table1 = true;
                                this.table = true;
      
                         }else if (s1.length !== 0){
                          this.condition_sepuence = 1;
                          this.tempData.push({
                            header1 : s1,
                            })
      
                            this.condition_zone.push({
                              office1 : sw1,
                              office2 : null,
                              office3 : null,
                              office4 : null,
                              office5 : null,
                              office6 : null,
                              office7 : null,
                              office8 : null,
                              office9 : null,
                              office10 : null,
                              office11 : null,
                              office12 : null,
                              });
                                this.table1 = true;
                                this.table = true;
      
                         }
      
      
                        var ss1 = 0;
                        var ss2 = 0;
                        var ss3= 0;
                        var ss4 = 0;
                        var ss5 = 0;
                        var ss6 = 0;
                        var ss7 = 0;
                        var ss8 = 0;
                        var ss9 = 0;
                        var ss10 = 0;
                        var ss11 = 0;
                        var ss12 = 0;
                        
                            var pro = '';
                            if (this.product == 'สุรา'){
                              pro = 'สุรา'
                            }else if (this.product == 'ยาสูบ'){
                              pro = 'ยาสูบ'
                            }else if (this.product == 'ไพ่'){
                              pro = 'ไพ่'
                            }else if (this.product == 'สินค้าอื่นๆ'){
                              pro = 'สินค้าอื่นๆ'
                            }
                      
                            var law = '';
                            if (this.lawsult_type == 0){
                              law = '0'
                            }else if (this.lawsult_type == 1){
                              law = '1'
                            }else if (this.lawsult_type == 2){
                              law = '2'
                            }
      
                        if(this.condition_sepuence == 12){
                          this.condition_sepuence12 = 1;
                          this.condition_sepuence11 = 1;
                          this.condition_sepuence10 = 1;
                          this.condition_sepuence9 = 1;
                          this.condition_sepuence8 = 1;
                          this.condition_sepuence7 = 1;
                          this.condition_sepuence6 = 1;
                          this.condition_sepuence5 = 1;
                          this.condition_sepuence4 = 1;
                          this.condition_sepuence3 = 1;
                          this.condition_sepuence2 = 1;
                          this.condition_sepuence1 = 1;
                        } 
                        else if(this.condition_sepuence == 11){
                          this.condition_sepuence11 = 1;
                          this.condition_sepuence10 = 1;
                          this.condition_sepuence9 = 1;
                          this.condition_sepuence8 = 1;
                          this.condition_sepuence7 = 1;
                          this.condition_sepuence6 = 1;
                          this.condition_sepuence5 = 1;
                          this.condition_sepuence4 = 1;
                          this.condition_sepuence3 = 1;
                          this.condition_sepuence2 = 1;
                          this.condition_sepuence1 = 1;
                        } 
                        else if(this.condition_sepuence == 10){
                          this.condition_sepuence10 = 1;
                          this.condition_sepuence9 = 1;
                          this.condition_sepuence8 = 1;
                          this.condition_sepuence7 = 1;
                          this.condition_sepuence6 = 1;
                          this.condition_sepuence5 = 1;
                          this.condition_sepuence4 = 1;
                          this.condition_sepuence3 = 1;
                          this.condition_sepuence2 = 1;
                          this.condition_sepuence1 = 1;
                        } 
                        else if(this.condition_sepuence == 9){
                          this.condition_sepuence9 = 1;
                          this.condition_sepuence8 = 1;
                          this.condition_sepuence7 = 1;
                          this.condition_sepuence6 = 1;
                          this.condition_sepuence5 = 1;
                          this.condition_sepuence4 = 1;
                          this.condition_sepuence3 = 1;
                          this.condition_sepuence2 = 1;
                          this.condition_sepuence1 = 1;
                        }   
                        else if(this.condition_sepuence == 8){
                          this.condition_sepuence8 = 1;
                          this.condition_sepuence7 = 1;
                          this.condition_sepuence6 = 1;
                          this.condition_sepuence5 = 1;
                          this.condition_sepuence4 = 1;
                          this.condition_sepuence3 = 1;
                          this.condition_sepuence2 = 1;
                          this.condition_sepuence1 = 1;
                        } 
                        else if(this.condition_sepuence == 7){
                          this.condition_sepuence7 = 1;
                          this.condition_sepuence6 = 1;
                          this.condition_sepuence5 = 1;
                          this.condition_sepuence4 = 1;
                          this.condition_sepuence3 = 1;
                          this.condition_sepuence2 = 1;
                          this.condition_sepuence1 = 1;
                        } 
                        else if(this.condition_sepuence == 6){
                          this.condition_sepuence6 = 1;
                          this.condition_sepuence5 = 1;
                          this.condition_sepuence4 = 1;
                          this.condition_sepuence3 = 1;
                          this.condition_sepuence2 = 1;
                          this.condition_sepuence1 = 1;
                        } 
                        else if(this.condition_sepuence == 5){
                          this.condition_sepuence5 = 1;
                          this.condition_sepuence4 = 1;
                          this.condition_sepuence3 = 1;
                          this.condition_sepuence2 = 1;
                          this.condition_sepuence1 = 1;
                        } 
                        else if(this.condition_sepuence == 4){
                          this.condition_sepuence4 = 1;
                          this.condition_sepuence3 = 1;
                          this.condition_sepuence2 = 1;
                          this.condition_sepuence1 = 1;
                        }
                        else if(this.condition_sepuence == 3){
                          this.condition_sepuence3 = 1;
                          this.condition_sepuence2 = 1;
                          this.condition_sepuence1 = 1;
                        } 
                        else if(this.condition_sepuence == 2){
                          this.condition_sepuence2 = 1;
                          this.condition_sepuence1 = 1;
                        }
                        else if(this.condition_sepuence == 1){
                          this.condition_sepuence1 = 1;
                        }
      
      
                        if(this.condition_sepuence1 == 1){
                          // console.log(1);
                          const param = {
                            TEXT_SEARCH : this.condition_zone[0].office1,
                            OFFICE_CODE : this.condition_zone[0].office1
                          }
                          this.targetService.TargetListgetByKeyword(param).subscribe(list1=>{
                  
                            if (list1.length == 0){
                              this.sum_sequence = this.sum_sequence;
                            }else {
                              for(var i=0; i<list1.length; i++){
                                if( list1[i].PRODUCT_GROUP_NAME == pro && list1[i].LAWSUIT_TYPE_TARGET == law && list1[i].SEQUENCE == this.sequence &&
                                  list1[i].IS_ACTIVE == 1 && list1[i].IS_SEND == 1 && list1[i].BUDGET_YEAR == this.year){
                                    // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                                    ss1 = 1;
                  
                                    var params = {
                                      ITEM_ID: list1[i].ITEM_ID,
                                      TARGET_ID: list1[i].TARGET_ID
                                    }
                                    this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                      // console.log(lists)
                                      for (var i=0; i<lists.length;i++){
                                        this.tempDatas1[i].QTY = lists[i].QTY_CASE;
                                        this.tempDatas1[i].FINE = lists[i].FINE;
                                        this.tempDatas1[i].TRE = lists[i].TREASURY_MONEY;
                                        this.tempDatas1[i].BRI = lists[i].BRIBE;
                                        this.tempDatas1[i].AWA = lists[i].REWARD;
                                        this.tempDatas1[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                        this.tempDatas1[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                  
                                        var qty_persent = [];
                                        var fine_persent = [];
                  
                                        this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+
                                                                this.tempDatas10[i].QTY+this.tempDatas11[i].QTY+this.tempDatas12[i].QTY;
                                        this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+
                                                                this.tempDatas10[i].FINE+this.tempDatas11[i].FINE+this.tempDatas12[i].FINE;
                                        this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+
                                                                this.tempDatas10[i].TRE+this.tempDatas11[i].TRE+this.tempDatas12[i].TRE;
                                        this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+
                                                                this.tempDatas10[i].BRI+this.tempDatas11[i].BRI+this.tempDatas12[i].BRI;
                                        this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+
                                                                this.tempDatas10[i].AWA+this.tempDatas11[i].AWA+this.tempDatas12[i].AWA;  
                                        qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+
                                                                this.tempDatas10[i].QTY_CASE_PERCENT+this.tempDatas11[i].QTY_CASE_PERCENT+this.tempDatas12[i].QTY_CASE_PERCENT;
                                        fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+
                                                                this.tempDatas10[i].FINE_PERCENT+this.tempDatas11[i].FINE_PERCENT+this.tempDatas12[i].FINE_PERCENT;
                                        this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.condition_sepuence;
                                        this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.condition_sepuence;
                    
                                      }
                    
                                    })
                                  }else{
                                      for (var s = 0; s<12;s++){
                                        this.tempDatas1[s].QTY = 0;
                                        this.tempDatas1[s].FINE = 0;
                                        this.tempDatas1[s].TRE = 0;
                                        this.tempDatas1[s].BRI = 0;
                                        this.tempDatas1[s].AWA = 0;
                                        this.tempDatas1[s].QTY_CASE_PERCENT = 0;
                                        this.tempDatas1[s].FINE_PERCENT = 0;
                                        this.tempDatas[s].QTY = 0;
                                        this.tempDatas[s].FINE = 0;
                                        this.tempDatas[s].TRE = 0;
                                        this.tempDatas[s].BRI = 0;
                                        this.tempDatas[s].AWA = 0;
                                        this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                        this.tempDatas[s].FINE_PERCENT = 0;
                                        }
                                      // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                    }
                              }
                            }
                            if (this.condition_sepuence == 10 && ss1 == 1){
                              // console.log(ss1)
                              this.save_btn = true;
                              }else{
                              // console.log("no")
                              this.save_btn = false;
                              }
                  
                            if(this.condition_sepuence2 == 1){
                              // console.log(2);
                              const param = {
                                TEXT_SEARCH : this.condition_zone[0].office2,
                                OFFICE_CODE : this.condition_zone[0].office2
                              }
                              this.targetService.TargetListgetByKeyword(param).subscribe(list2=>{
                                // console.log(list2)
                                if (list2.length == 0){
                                  this.sum_sequence = this.sum_sequence;
                                }else {
                                  for(var i=0; i<list2.length; i++){
                                    if( list2[i].PRODUCT_GROUP_NAME == pro && list2[i].LAWSUIT_TYPE_TARGET == law && list2[i].SEQUENCE == this.sequence &&
                                      list2[i].IS_ACTIVE == 1 && list2[i].IS_SEND == 1 && list2[i].BUDGET_YEAR == this.year){
      
                                        ss2 = 1;
                                        // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                      
                                        var params = {
                                          ITEM_ID: list2[i].ITEM_ID,
                                          TARGET_ID: list2[i].TARGET_ID
                                        }
                                        this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                          // console.log(lists)
                                          for (var i=0; i<lists.length;i++){
                                            this.tempDatas2[i].QTY = lists[i].QTY_CASE;
                                            this.tempDatas2[i].FINE = lists[i].FINE;
                                            this.tempDatas2[i].TRE = lists[i].TREASURY_MONEY;
                                            this.tempDatas2[i].BRI = lists[i].BRIBE;
                                            this.tempDatas2[i].AWA = lists[i].REWARD;
                                            this.tempDatas2[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                            this.tempDatas2[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                      
                                            var qty_persent = [];
                                            var fine_persent = [];
                      
                                            this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                    this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                    this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+
                                                                    this.tempDatas10[i].QTY+this.tempDatas11[i].QTY+this.tempDatas12[i].QTY;
                                            this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                    this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                    this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+
                                                                    this.tempDatas10[i].FINE+this.tempDatas11[i].FINE+this.tempDatas12[i].FINE;
                                            this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                    this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                    this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+
                                                                    this.tempDatas10[i].TRE+this.tempDatas11[i].TRE+this.tempDatas12[i].TRE;
                                            this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                    this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                    this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+
                                                                    this.tempDatas10[i].BRI+this.tempDatas11[i].BRI+this.tempDatas12[i].BRI;
                                            this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                    this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                    this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+
                                                                    this.tempDatas10[i].AWA+this.tempDatas11[i].AWA+this.tempDatas12[i].AWA;  
                                            qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                    this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                    this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+
                                                                    this.tempDatas10[i].QTY_CASE_PERCENT+this.tempDatas11[i].QTY_CASE_PERCENT+this.tempDatas12[i].QTY_CASE_PERCENT;
                                            fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                    this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                    this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+
                                                                    this.tempDatas10[i].FINE_PERCENT+this.tempDatas11[i].FINE_PERCENT+this.tempDatas12[i].FINE_PERCENT;
                                            this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.condition_sepuence;
                                            this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.condition_sepuence;
                        
                                          }
                        
                                        })
                                      }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas2[s].QTY = 0;
                                            this.tempDatas2[s].FINE = 0;
                                            this.tempDatas2[s].TRE = 0;
                                            this.tempDatas2[s].BRI = 0;
                                            this.tempDatas2[s].AWA = 0;
                                            this.tempDatas2[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas2[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                  }
                                }
                  
                                if (this.condition_sepuence == 2 && ss1 == 1 && ss2 == 1 ){
                                  // console.log(ss1,ss2)
                                  this.save_btn = true;
                                  }else{
                                  // console.log("no")
                                  this.save_btn = false;
                                  }
                  
                  
                                if(this.condition_sepuence3 == 1){
                                  // console.log(3);
                                  const param = {
                                    TEXT_SEARCH : this.condition_zone[0].office3,
                                    OFFICE_CODE : this.condition_zone[0].office3
                                  }
                                  this.targetService.TargetListgetByKeyword(param).subscribe(list3=>{
                                    // console.log(list3)
                                    if (list3.length == 0){
                                      this.sum_sequence = this.sum_sequence;
                                    }else {
                                      for(var i=0; i<list3.length; i++){
                                        if( list3[i].PRODUCT_GROUP_NAME == pro && list3[i].LAWSUIT_TYPE_TARGET == law && list3[i].SEQUENCE == this.sequence &&
                                          list3[i].IS_ACTIVE == 1 && list3[i].IS_SEND == 1 && list3[i].BUDGET_YEAR == this.year){
      
                                            ss3 = 1;
                                            // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                          
                                            var params = {
                                              ITEM_ID: list3[i].ITEM_ID,
                                              TARGET_ID: list3[i].TARGET_ID
                                            }
                                            this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                              // console.log(lists)
                                              for (var i=0; i<lists.length;i++){
                                                this.tempDatas3[i].QTY = lists[i].QTY_CASE;
                                                this.tempDatas3[i].FINE = lists[i].FINE;
                                                this.tempDatas3[i].TRE = lists[i].TREASURY_MONEY;
                                                this.tempDatas3[i].BRI = lists[i].BRIBE;
                                                this.tempDatas3[i].AWA = lists[i].REWARD;
                                                this.tempDatas3[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                this.tempDatas3[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                          
                                                var qty_persent = [];
                                                var fine_persent = [];
                          
                                                this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                        this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                        this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+
                                                                        this.tempDatas10[i].QTY+this.tempDatas11[i].QTY+this.tempDatas12[i].QTY;
                                                this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                        this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                        this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+
                                                                        this.tempDatas10[i].FINE+this.tempDatas11[i].FINE+this.tempDatas12[i].FINE;
                                                this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                        this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                        this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+
                                                                        this.tempDatas10[i].TRE+this.tempDatas11[i].TRE+this.tempDatas12[i].TRE;
                                                this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                        this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                        this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+
                                                                        this.tempDatas10[i].BRI+this.tempDatas11[i].BRI+this.tempDatas12[i].BRI;
                                                this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                        this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                        this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+
                                                                        this.tempDatas10[i].AWA+this.tempDatas11[i].AWA+this.tempDatas12[i].AWA;  
                                                qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                        this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                        this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+
                                                                        this.tempDatas10[i].QTY_CASE_PERCENT+this.tempDatas11[i].QTY_CASE_PERCENT+this.tempDatas12[i].QTY_CASE_PERCENT;
                                                fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                        this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                        this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+
                                                                        this.tempDatas10[i].FINE_PERCENT+this.tempDatas11[i].FINE_PERCENT+this.tempDatas12[i].FINE_PERCENT;
                                                this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.condition_sepuence;
                                                this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.condition_sepuence;
                            
                                              }
                            
                                            })
                                          }else{
                                              for (var s = 0; s<12;s++){
                                                this.tempDatas3[s].QTY = 0;
                                                this.tempDatas3[s].FINE = 0;
                                                this.tempDatas3[s].TRE = 0;
                                                this.tempDatas3[s].BRI = 0;
                                                this.tempDatas3[s].AWA = 0;
                                                this.tempDatas3[s].QTY_CASE_PERCENT = 0;
                                                this.tempDatas3[s].FINE_PERCENT = 0;
                                                this.tempDatas[s].QTY = 0;
                                                this.tempDatas[s].FINE = 0;
                                                this.tempDatas[s].TRE = 0;
                                                this.tempDatas[s].BRI = 0;
                                                this.tempDatas[s].AWA = 0;
                                                this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                                this.tempDatas[s].FINE_PERCENT = 0;
                                                }
                                              // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                            }
                                      }
                                    }
                                    
                                    if (this.condition_sepuence == 3 && ss1 == 1 && ss2 == 1  && ss3 == 1 ){
                                      // console.log(ss1,ss2,ss3)
                                      this.save_btn = true;
                                      }else{
                                      // console.log("no")
                                      this.save_btn = false;
                                      }
                  
                                    if(this.condition_sepuence4 == 1){
                                      // console.log(4);
                                      const param = {
                                        TEXT_SEARCH : this.condition_zone[0].office4,
                                        OFFICE_CODE : this.condition_zone[0].office4
                                      }
                                      this.targetService.TargetListgetByKeyword(param).subscribe(list4=>{
                                        // console.log(list4)
                                        if (list4.length == 0){
                                          this.sum_sequence = this.sum_sequence;
                                        }else {
                                          for(var i=0; i<list4.length; i++){
                                            if( list4[i].PRODUCT_GROUP_NAME == pro && list4[i].LAWSUIT_TYPE_TARGET == law && list4[i].SEQUENCE == this.sequence &&
                                              list4[i].IS_ACTIVE == 1 && list4[i].IS_SEND == 1 && list4[i].BUDGET_YEAR == this.year){
      
                                            ss4 = 1;
                                            // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                          
                                            var params = {
                                              ITEM_ID: list4[i].ITEM_ID,
                                              TARGET_ID: list4[i].TARGET_ID
                                            }
                                            this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                              // console.log(lists)
                                              for (var i=0; i<lists.length;i++){
                                                this.tempDatas4[i].QTY = lists[i].QTY_CASE;
                                                this.tempDatas4[i].FINE = lists[i].FINE;
                                                this.tempDatas4[i].TRE = lists[i].TREASURY_MONEY;
                                                this.tempDatas4[i].BRI = lists[i].BRIBE;
                                                this.tempDatas4[i].AWA = lists[i].REWARD;
                                                this.tempDatas4[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                this.tempDatas4[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                          
                                                var qty_persent = [];
                                                var fine_persent = [];
                          
                                                this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                        this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                        this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+
                                                                        this.tempDatas10[i].QTY+this.tempDatas11[i].QTY+this.tempDatas12[i].QTY;
                                                this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                        this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                        this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+
                                                                        this.tempDatas10[i].FINE+this.tempDatas11[i].FINE+this.tempDatas12[i].FINE;
                                                this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                        this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                        this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+
                                                                        this.tempDatas10[i].TRE+this.tempDatas11[i].TRE+this.tempDatas12[i].TRE;
                                                this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                        this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                        this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+
                                                                        this.tempDatas10[i].BRI+this.tempDatas11[i].BRI+this.tempDatas12[i].BRI;
                                                this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                        this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                        this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+
                                                                        this.tempDatas10[i].AWA+this.tempDatas11[i].AWA+this.tempDatas12[i].AWA;  
                                                qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                        this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                        this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+
                                                                        this.tempDatas10[i].QTY_CASE_PERCENT+this.tempDatas11[i].QTY_CASE_PERCENT+this.tempDatas12[i].QTY_CASE_PERCENT;
                                                fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                        this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                        this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+
                                                                        this.tempDatas10[i].FINE_PERCENT+this.tempDatas11[i].FINE_PERCENT+this.tempDatas12[i].FINE_PERCENT;
                                                this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.condition_sepuence;
                                                this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.condition_sepuence;
                            
                                              }
                            
                                            })
                                          }else{
                                              for (var s = 0; s<12;s++){
                                                this.tempDatas4[s].QTY = 0;
                                                this.tempDatas4[s].FINE = 0;
                                                this.tempDatas4[s].TRE = 0;
                                                this.tempDatas4[s].BRI = 0;
                                                this.tempDatas4[s].AWA = 0;
                                                this.tempDatas4[s].QTY_CASE_PERCENT = 0;
                                                this.tempDatas4[s].FINE_PERCENT = 0;
                                                this.tempDatas[s].QTY = 0;
                                                this.tempDatas[s].FINE = 0;
                                                this.tempDatas[s].TRE = 0;
                                                this.tempDatas[s].BRI = 0;
                                                this.tempDatas[s].AWA = 0;
                                                this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                                this.tempDatas[s].FINE_PERCENT = 0;
                                                }
                                              // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                            }
                                          }
                                        }
                  
                                        if (this.condition_sepuence == 4 && ss1 == 1 && ss2 == 1  && ss3 == 1 && ss4 == 1 ){
                                          // console.log(ss1,ss2,ss3)
                                          this.save_btn = true;
                                          }else{
                                          // console.log("no")
                                          this.save_btn = false;
                                          }
                  
                                        if(this.condition_sepuence5 == 1){
                                          // console.log(5);
                                          const param = {
                                            TEXT_SEARCH : this.condition_zone[0].office5,
                                            OFFICE_CODE : this.condition_zone[0].office5
                                          }
                                          this.targetService.TargetListgetByKeyword(param).subscribe(list5=>{
                                            // console.log(list5)
                                            if (list5.length == 0){
                                              this.sum_sequence = this.sum_sequence;
                                            }else {
                                              for(var i=0; i<list5.length; i++){
                                                if( list5[i].PRODUCT_GROUP_NAME == pro && list5[i].LAWSUIT_TYPE_TARGET == law && list5[i].SEQUENCE == this.sequence &&
                                                  list5[i].IS_ACTIVE == 1 && list5[i].IS_SEND == 1 && list5[i].BUDGET_YEAR == this.year){
      
                                                    ss5 = 1;
                                                    // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                                  
                                                    var params = {
                                                      ITEM_ID: list5[i].ITEM_ID,
                                                      TARGET_ID: list5[i].TARGET_ID
                                                    }
                                                    this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                      // console.log(lists)
                                                      for (var i=0; i<lists.length;i++){
                                                        this.tempDatas5[i].QTY = lists[i].QTY_CASE;
                                                        this.tempDatas5[i].FINE = lists[i].FINE;
                                                        this.tempDatas5[i].TRE = lists[i].TREASURY_MONEY;
                                                        this.tempDatas5[i].BRI = lists[i].BRIBE;
                                                        this.tempDatas5[i].AWA = lists[i].REWARD;
                                                        this.tempDatas5[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                        this.tempDatas5[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                                  
                                                        var qty_persent = [];
                                                        var fine_persent = [];
                                  
                                                        this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                                this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                                this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+
                                                                                this.tempDatas10[i].QTY+this.tempDatas11[i].QTY+this.tempDatas12[i].QTY;
                                                        this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                                this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                                this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+
                                                                                this.tempDatas10[i].FINE+this.tempDatas11[i].FINE+this.tempDatas12[i].FINE;
                                                        this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                                this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                                this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+
                                                                                this.tempDatas10[i].TRE+this.tempDatas11[i].TRE+this.tempDatas12[i].TRE;
                                                        this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                                this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                                this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+
                                                                                this.tempDatas10[i].BRI+this.tempDatas11[i].BRI+this.tempDatas12[i].BRI;
                                                        this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                                this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                                this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+
                                                                                this.tempDatas10[i].AWA+this.tempDatas11[i].AWA+this.tempDatas12[i].AWA;  
                                                        qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                                this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                                this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+
                                                                                this.tempDatas10[i].QTY_CASE_PERCENT+this.tempDatas11[i].QTY_CASE_PERCENT+this.tempDatas12[i].QTY_CASE_PERCENT;
                                                        fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                                this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                                this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+
                                                                                this.tempDatas10[i].FINE_PERCENT+this.tempDatas11[i].FINE_PERCENT+this.tempDatas12[i].FINE_PERCENT;
                                                        this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.condition_sepuence;
                                                        this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.condition_sepuence;
                                    
                                                      }
                                    
                                                    })
                                                  }else{
                                                      for (var s = 0; s<12;s++){
                                                        this.tempDatas5[s].QTY = 0;
                                                        this.tempDatas5[s].FINE = 0;
                                                        this.tempDatas5[s].TRE = 0;
                                                        this.tempDatas5[s].BRI = 0;
                                                        this.tempDatas5[s].AWA = 0;
                                                        this.tempDatas5[s].QTY_CASE_PERCENT = 0;
                                                        this.tempDatas5[s].FINE_PERCENT = 0;
                                                        this.tempDatas[s].QTY = 0;
                                                        this.tempDatas[s].FINE = 0;
                                                        this.tempDatas[s].TRE = 0;
                                                        this.tempDatas[s].BRI = 0;
                                                        this.tempDatas[s].AWA = 0;
                                                        this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                                        this.tempDatas[s].FINE_PERCENT = 0;
                                                        }
                                                      // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                                    }
                                              }
                                            }
                                            if (this.condition_sepuence == 5 && ss1 == 1 && ss2 == 1  && ss3 == 1 && ss4 == 1 && ss5 == 1 ){
                                              // console.log(ss1,ss2,ss3)
                                              this.save_btn = true;
                                              }else{
                                              // console.log("no")
                                              this.save_btn = false;
                                              }
                  
                                            if(this.condition_sepuence6 == 1){
                                              // console.log(6);
                                              const param = {
                                                TEXT_SEARCH : this.condition_zone[0].office6,
                                                OFFICE_CODE : this.condition_zone[0].office6
                                              }
                                              this.targetService.TargetListgetByKeyword(param).subscribe(list6=>{
                                                // console.log(list6)
                                                if (list6.length == 0){
                                                  this.sum_sequence = this.sum_sequence;
                                                }else {
                                                  for(var i=0; i<list6.length; i++){
                                                    if( list6[i].PRODUCT_GROUP_NAME == pro && list6[i].LAWSUIT_TYPE_TARGET == law && list6[i].SEQUENCE == this.sequence &&
                                                      list6[i].IS_ACTIVE == 1 && list6[i].IS_SEND == 1 && list6[i].BUDGET_YEAR == this.year){
      
                                                    ss6 = 1;
                                                    // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                                  
                                                    var params = {
                                                      ITEM_ID: list6[i].ITEM_ID,
                                                      TARGET_ID: list6[i].TARGET_ID
                                                    }
                                                    this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                      // console.log(lists)
                                                      for (var i=0; i<lists.length;i++){
                                                        this.tempDatas6[i].QTY = lists[i].QTY_CASE;
                                                        this.tempDatas6[i].FINE = lists[i].FINE;
                                                        this.tempDatas6[i].TRE = lists[i].TREASURY_MONEY;
                                                        this.tempDatas6[i].BRI = lists[i].BRIBE;
                                                        this.tempDatas6[i].AWA = lists[i].REWARD;
                                                        this.tempDatas6[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                        this.tempDatas6[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                                  
                                                        var qty_persent = [];
                                                        var fine_persent = [];
                                  
                                                        this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                                this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                                this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+
                                                                                this.tempDatas10[i].QTY+this.tempDatas11[i].QTY+this.tempDatas12[i].QTY;
                                                        this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                                this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                                this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+
                                                                                this.tempDatas10[i].FINE+this.tempDatas11[i].FINE+this.tempDatas12[i].FINE;
                                                        this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                                this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                                this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+
                                                                                this.tempDatas10[i].TRE+this.tempDatas11[i].TRE+this.tempDatas12[i].TRE;
                                                        this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                                this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                                this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+
                                                                                this.tempDatas10[i].BRI+this.tempDatas11[i].BRI+this.tempDatas12[i].BRI;
                                                        this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                                this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                                this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+
                                                                                this.tempDatas10[i].AWA+this.tempDatas11[i].AWA+this.tempDatas12[i].AWA;  
                                                        qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                                this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                                this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+
                                                                                this.tempDatas10[i].QTY_CASE_PERCENT+this.tempDatas11[i].QTY_CASE_PERCENT+this.tempDatas12[i].QTY_CASE_PERCENT;
                                                        fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                                this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                                this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+
                                                                                this.tempDatas10[i].FINE_PERCENT+this.tempDatas11[i].FINE_PERCENT+this.tempDatas12[i].FINE_PERCENT;
                                                        this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.condition_sepuence;
                                                        this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.condition_sepuence;
                                    
                                                      }
                                    
                                                    })
                                                  }else{
                                                      for (var s = 0; s<12;s++){
                                                        this.tempDatas6[s].QTY = 0;
                                                        this.tempDatas6[s].FINE = 0;
                                                        this.tempDatas6[s].TRE = 0;
                                                        this.tempDatas6[s].BRI = 0;
                                                        this.tempDatas6[s].AWA = 0;
                                                        this.tempDatas6[s].QTY_CASE_PERCENT = 0;
                                                        this.tempDatas6[s].FINE_PERCENT = 0;
                                                        this.tempDatas[s].QTY = 0;
                                                        this.tempDatas[s].FINE = 0;
                                                        this.tempDatas[s].TRE = 0;
                                                        this.tempDatas[s].BRI = 0;
                                                        this.tempDatas[s].AWA = 0;
                                                        this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                                        this.tempDatas[s].FINE_PERCENT = 0;
                                                        }
                                                      // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                                    }
                                                  }
                                                }
                                                
                                                if (this.condition_sepuence == 6 && ss1 == 1 && ss2 == 1  && ss3 == 1 && ss4 == 1 && ss5 == 1 && ss6 == 1 
                                                  ){
                                                 // console.log(ss1,ss2,ss3)
                                                 this.save_btn = true;
                                                 }else{
                                                 // console.log("no")
                                                 this.save_btn = false;
                                                 }
                  
                                                if(this.condition_sepuence7 == 1){
                                                  // console.log(7);
                                                  const param = {
                                                    TEXT_SEARCH : this.condition_zone[0].office7,
                                                    OFFICE_CODE : this.condition_zone[0].office7
                                                  }
                                                  this.targetService.TargetListgetByKeyword(param).subscribe(list7=>{
                                                    // console.log(list7)
                                                    if (list7.length == 0){
                                                      this.sum_sequence = this.sum_sequence;
                                                    }else {
                                                      for(var i=0; i<list6.length; i++){
                                                        if( list7[i].PRODUCT_GROUP_NAME == pro && list7[i].LAWSUIT_TYPE_TARGET == law && list7[i].SEQUENCE == this.sequence &&
                                                          list7[i].IS_ACTIVE == 1 && list7[i].IS_SEND == 1 && list7[i].BUDGET_YEAR == this.year){
      
                                                    ss7 = 1;
                                                    // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                                  
                                                    var params = {
                                                      ITEM_ID: list7[i].ITEM_ID,
                                                      TARGET_ID: list7[i].TARGET_ID
                                                    }
                                                    this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                      // console.log(lists)
                                                      for (var i=0; i<lists.length;i++){
                                                        this.tempDatas7[i].QTY = lists[i].QTY_CASE;
                                                        this.tempDatas7[i].FINE = lists[i].FINE;
                                                        this.tempDatas7[i].TRE = lists[i].TREASURY_MONEY;
                                                        this.tempDatas7[i].BRI = lists[i].BRIBE;
                                                        this.tempDatas7[i].AWA = lists[i].REWARD;
                                                        this.tempDatas7[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                        this.tempDatas7[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                                  
                                                        var qty_persent = [];
                                                        var fine_persent = [];
                                  
                                                        this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                                this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                                this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+
                                                                                this.tempDatas10[i].QTY+this.tempDatas11[i].QTY+this.tempDatas12[i].QTY;
                                                        this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                                this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                                this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+
                                                                                this.tempDatas10[i].FINE+this.tempDatas11[i].FINE+this.tempDatas12[i].FINE;
                                                        this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                                this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                                this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+
                                                                                this.tempDatas10[i].TRE+this.tempDatas11[i].TRE+this.tempDatas12[i].TRE;
                                                        this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                                this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                                this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+
                                                                                this.tempDatas10[i].BRI+this.tempDatas11[i].BRI+this.tempDatas12[i].BRI;
                                                        this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                                this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                                this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+
                                                                                this.tempDatas10[i].AWA+this.tempDatas11[i].AWA+this.tempDatas12[i].AWA;  
                                                        qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                                this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                                this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+
                                                                                this.tempDatas10[i].QTY_CASE_PERCENT+this.tempDatas11[i].QTY_CASE_PERCENT+this.tempDatas12[i].QTY_CASE_PERCENT;
                                                        fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                                this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                                this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+
                                                                                this.tempDatas10[i].FINE_PERCENT+this.tempDatas11[i].FINE_PERCENT+this.tempDatas12[i].FINE_PERCENT;
                                                        this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.condition_sepuence;
                                                        this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.condition_sepuence;
                                    
                                                      }
                                    
                                                    })
                                                  }else{
                                                      for (var s = 0; s<12;s++){
                                                        this.tempDatas7[s].QTY = 0;
                                                        this.tempDatas7[s].FINE = 0;
                                                        this.tempDatas7[s].TRE = 0;
                                                        this.tempDatas7[s].BRI = 0;
                                                        this.tempDatas7[s].AWA = 0;
                                                        this.tempDatas7[s].QTY_CASE_PERCENT = 0;
                                                        this.tempDatas7[s].FINE_PERCENT = 0;
                                                        this.tempDatas[s].QTY = 0;
                                                        this.tempDatas[s].FINE = 0;
                                                        this.tempDatas[s].TRE = 0;
                                                        this.tempDatas[s].BRI = 0;
                                                        this.tempDatas[s].AWA = 0;
                                                        this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                                        this.tempDatas[s].FINE_PERCENT = 0;
                                                        }
                                                      // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                                    }
                                                   
                                                      }
                                                    }
                                                    if (this.condition_sepuence == 7 && ss1 == 1 && ss2 == 1  && ss3 == 1 && ss4 == 1 && ss5 == 1 && ss6 == 1 
                                                      && ss7 == 1 ){
                                                    // console.log(ss1,ss2,ss3)
                                                    this.save_btn = true;
                                                    }else{
                                                    // console.log("no")
                                                    this.save_btn = false;
                                                    }
                  
                                                    if(this.condition_sepuence8 == 1){
                                                      // console.log(8);
                                                      const param = {
                                                        TEXT_SEARCH : this.condition_zone[0].office8,
                                                        OFFICE_CODE : this.condition_zone[0].office8
                                                      }
                                                      this.targetService.TargetListgetByKeyword(param).subscribe(list8=>{
                                                        // console.log(list8)
                                                        if (list8.length == 0){
                                                          this.sum_sequence = this.sum_sequence;
                                                        }else {
                                                          for(var i=0; i<list8.length; i++){
                                                            if( list8[i].PRODUCT_GROUP_NAME == pro && list8[i].LAWSUIT_TYPE_TARGET == law && list8[i].SEQUENCE == this.sequence &&
                                                              list8[i].IS_ACTIVE == 1 && list8[i].IS_SEND == 1 && list8[i].BUDGET_YEAR == this.year){
      
                                                                ss8 = 1;
                                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                                              
                                                                var params = {
                                                                  ITEM_ID: list8[i].ITEM_ID,
                                                                  TARGET_ID: list8[i].TARGET_ID
                                                                }
                                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                                  // console.log(lists)
                                                                  for (var i=0; i<lists.length;i++){
                                                                    this.tempDatas8[i].QTY = lists[i].QTY_CASE;
                                                                    this.tempDatas8[i].FINE = lists[i].FINE;
                                                                    this.tempDatas8[i].TRE = lists[i].TREASURY_MONEY;
                                                                    this.tempDatas8[i].BRI = lists[i].BRIBE;
                                                                    this.tempDatas8[i].AWA = lists[i].REWARD;
                                                                    this.tempDatas8[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                                    this.tempDatas8[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                                              
                                                                    var qty_persent = [];
                                                                    var fine_persent = [];
                                              
                                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+
                                                                                            this.tempDatas10[i].QTY+this.tempDatas11[i].QTY+this.tempDatas12[i].QTY;
                                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+
                                                                                            this.tempDatas10[i].FINE+this.tempDatas11[i].FINE+this.tempDatas12[i].FINE;
                                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+
                                                                                            this.tempDatas10[i].TRE+this.tempDatas11[i].TRE+this.tempDatas12[i].TRE;
                                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+
                                                                                            this.tempDatas10[i].BRI+this.tempDatas11[i].BRI+this.tempDatas12[i].BRI;
                                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+
                                                                                            this.tempDatas10[i].AWA+this.tempDatas11[i].AWA+this.tempDatas12[i].AWA;  
                                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+
                                                                                            this.tempDatas10[i].QTY_CASE_PERCENT+this.tempDatas11[i].QTY_CASE_PERCENT+this.tempDatas12[i].QTY_CASE_PERCENT;
                                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+
                                                                                            this.tempDatas10[i].FINE_PERCENT+this.tempDatas11[i].FINE_PERCENT+this.tempDatas12[i].FINE_PERCENT;
                                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.condition_sepuence;
                                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.condition_sepuence;
                                                
                                                                  }
                                                
                                                                })
                                                              }else{
                                                                  for (var s = 0; s<12;s++){
                                                                    this.tempDatas8[s].QTY = 0;
                                                                    this.tempDatas8[s].FINE = 0;
                                                                    this.tempDatas8[s].TRE = 0;
                                                                    this.tempDatas8[s].BRI = 0;
                                                                    this.tempDatas8[s].AWA = 0;
                                                                    this.tempDatas8[s].QTY_CASE_PERCENT = 0;
                                                                    this.tempDatas8[s].FINE_PERCENT = 0;
                                                                    this.tempDatas[s].QTY = 0;
                                                                    this.tempDatas[s].FINE = 0;
                                                                    this.tempDatas[s].TRE = 0;
                                                                    this.tempDatas[s].BRI = 0;
                                                                    this.tempDatas[s].AWA = 0;
                                                                    this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                                                    this.tempDatas[s].FINE_PERCENT = 0;
                                                                    }
                                                                  // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                                                }
                                                                
                                                          }
                                                        }
                                                        if (this.condition_sepuence == 8 && ss1 == 1 && ss2 == 1  && ss3 == 1 && ss4 == 1 && ss5 == 1 && ss6 == 1 
                                                          && ss7 == 1 && ss8 == 1 ){
                                                        // console.log(ss1,ss2,ss3)
                                                        this.save_btn = true;
                                                        }else{
                                                        // console.log("no")
                                                        this.save_btn = false;
                                                        }
                  
                                                        if(this.condition_sepuence9 == 1){
                                                          // console.log(9);
                                                          const param = {
                                                            TEXT_SEARCH : this.condition_zone[0].office9,
                                                            OFFICE_CODE : this.condition_zone[0].office9
                                                          }
                                                          this.targetService.TargetListgetByKeyword(param).subscribe(list9=>{
                                                            // console.log(list9)
                                                            if (list9.length == 0){
                                                              this.sum_sequence = this.sum_sequence;
                                                            }else {
                                                              for(var i=0; i<list9.length; i++){
                                                                if( list9[i].PRODUCT_GROUP_NAME == pro && list9[i].LAWSUIT_TYPE_TARGET == law && list9[i].SEQUENCE == this.sequence &&
                                                                  list9[i].IS_ACTIVE == 1 && list9[i].IS_SEND == 1 && list9[i].BUDGET_YEAR == this.year){
      
                                                                    ss9 = 1;
                                                                    // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                                                  
                                                                    var params = {
                                                                      ITEM_ID: list9[i].ITEM_ID,
                                                                      TARGET_ID: list9[i].TARGET_ID
                                                                    }
                                                                    this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                                      // console.log(lists)
                                                                      for (var i=0; i<lists.length;i++){
                                                                        this.tempDatas9[i].QTY = lists[i].QTY_CASE;
                                                                        this.tempDatas9[i].FINE = lists[i].FINE;
                                                                        this.tempDatas9[i].TRE = lists[i].TREASURY_MONEY;
                                                                        this.tempDatas9[i].BRI = lists[i].BRIBE;
                                                                        this.tempDatas9[i].AWA = lists[i].REWARD;
                                                                        this.tempDatas9[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                                        this.tempDatas9[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                                                  
                                                                        var qty_persent = [];
                                                                        var fine_persent = [];
                                                  
                                                                        this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                                                this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                                                this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+
                                                                                                this.tempDatas10[i].QTY+this.tempDatas11[i].QTY+this.tempDatas12[i].QTY;
                                                                        this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                                                this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                                                this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+
                                                                                                this.tempDatas10[i].FINE+this.tempDatas11[i].FINE+this.tempDatas12[i].FINE;
                                                                        this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                                                this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                                                this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+
                                                                                                this.tempDatas10[i].TRE+this.tempDatas11[i].TRE+this.tempDatas12[i].TRE;
                                                                        this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                                                this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                                                this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+
                                                                                                this.tempDatas10[i].BRI+this.tempDatas11[i].BRI+this.tempDatas12[i].BRI;
                                                                        this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                                                this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                                                this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+
                                                                                                this.tempDatas10[i].AWA+this.tempDatas11[i].AWA+this.tempDatas12[i].AWA;  
                                                                        qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                                                this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                                                this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+
                                                                                                this.tempDatas10[i].QTY_CASE_PERCENT+this.tempDatas11[i].QTY_CASE_PERCENT+this.tempDatas12[i].QTY_CASE_PERCENT;
                                                                        fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                                                this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                                                this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+
                                                                                                this.tempDatas10[i].FINE_PERCENT+this.tempDatas11[i].FINE_PERCENT+this.tempDatas12[i].FINE_PERCENT;
                                                                        this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.condition_sepuence;
                                                                        this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.condition_sepuence;
                                                    
                                                                      }
                                                    
                                                                    })
                                                                  }else{
                                                                      for (var s = 0; s<12;s++){
                                                                        this.tempDatas9[s].QTY = 0;
                                                                        this.tempDatas9[s].FINE = 0;
                                                                        this.tempDatas9[s].TRE = 0;
                                                                        this.tempDatas9[s].BRI = 0;
                                                                        this.tempDatas9[s].AWA = 0;
                                                                        this.tempDatas9[s].QTY_CASE_PERCENT = 0;
                                                                        this.tempDatas9[s].FINE_PERCENT = 0;
                                                                        this.tempDatas[s].QTY = 0;
                                                                        this.tempDatas[s].FINE = 0;
                                                                        this.tempDatas[s].TRE = 0;
                                                                        this.tempDatas[s].BRI = 0;
                                                                        this.tempDatas[s].AWA = 0;
                                                                        this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                                                        this.tempDatas[s].FINE_PERCENT = 0;
                                                                        }
                                                                      // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                                                    }
                                                                    
                                                              }
                                                            }
                                                            if (this.condition_sepuence == 9 && ss1 == 1 && ss2 == 1  && ss3 == 1 && ss4 == 1 && ss5 == 1 && ss6 == 1 
                                                              && ss7 == 1 && ss8 == 1  && ss9 == 1 ){
                                                            // console.log(ss1,ss2,ss3)
                                                            this.save_btn = true;
                                                            }else{
                                                            // console.log("no")
                                                            this.save_btn = false;
                                                            }
                  
                                                            if(this.condition_sepuence10 == 1){
                                                              // console.log(10);
                                                              const param = {
                                                                TEXT_SEARCH : this.condition_zone[0].office10,
                                                                OFFICE_CODE : this.condition_zone[0].office10
                                                              }
                                                              this.targetService.TargetListgetByKeyword(param).subscribe(list10=>{
                                                                // console.log(list10)
                                                                if (list10.length == 0){
                                                                  this.sum_sequence = this.sum_sequence;
                                                                }else {
                                                                  for(var i=0; i<list10.length; i++){
                                                                    if( list10[i].PRODUCT_GROUP_NAME == pro && list10[i].LAWSUIT_TYPE_TARGET == law && list10[i].SEQUENCE == this.sequence &&
                                                                      list10[i].IS_ACTIVE == 1 && list10[i].IS_SEND == 1 && list10[i].BUDGET_YEAR == this.year){
      
                                                                        ss10 = 1;
                                                                        // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                                                      
                                                                        var params = {
                                                                          ITEM_ID: list10[i].ITEM_ID,
                                                                          TARGET_ID: list10[i].TARGET_ID
                                                                        }
                                                                        this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                                          // console.log(lists)
                                                                          for (var i=0; i<lists.length;i++){
                                                                            this.tempDatas10[i].QTY = lists[i].QTY_CASE;
                                                                            this.tempDatas10[i].FINE = lists[i].FINE;
                                                                            this.tempDatas10[i].TRE = lists[i].TREASURY_MONEY;
                                                                            this.tempDatas10[i].BRI = lists[i].BRIBE;
                                                                            this.tempDatas10[i].AWA = lists[i].REWARD;
                                                                            this.tempDatas10[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                                            this.tempDatas10[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                                                      
                                                                            var qty_persent = [];
                                                                            var fine_persent = [];
                                                      
                                                                            this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                                                    this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                                                    this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+
                                                                                                    this.tempDatas10[i].QTY+this.tempDatas11[i].QTY+this.tempDatas12[i].QTY;
                                                                            this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                                                    this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                                                    this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+
                                                                                                    this.tempDatas10[i].FINE+this.tempDatas11[i].FINE+this.tempDatas12[i].FINE;
                                                                            this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                                                    this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                                                    this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+
                                                                                                    this.tempDatas10[i].TRE+this.tempDatas11[i].TRE+this.tempDatas12[i].TRE;
                                                                            this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                                                    this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                                                    this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+
                                                                                                    this.tempDatas10[i].BRI+this.tempDatas11[i].BRI+this.tempDatas12[i].BRI;
                                                                            this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                                                    this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                                                    this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+
                                                                                                    this.tempDatas10[i].AWA+this.tempDatas11[i].AWA+this.tempDatas12[i].AWA;  
                                                                            qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                                                    this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                                                    this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+
                                                                                                    this.tempDatas10[i].QTY_CASE_PERCENT+this.tempDatas11[i].QTY_CASE_PERCENT+this.tempDatas12[i].QTY_CASE_PERCENT;
                                                                            fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                                                    this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                                                    this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+
                                                                                                    this.tempDatas10[i].FINE_PERCENT+this.tempDatas11[i].FINE_PERCENT+this.tempDatas12[i].FINE_PERCENT;
                                                                            this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.condition_sepuence;
                                                                            this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.condition_sepuence;
                                                        
                                                                          }
                                                        
                                                                        })
                                                                      }else{
                                                                          for (var s = 0; s<12;s++){
                                                                            this.tempDatas10[s].QTY = 0;
                                                                            this.tempDatas10[s].FINE = 0;
                                                                            this.tempDatas10[s].TRE = 0;
                                                                            this.tempDatas10[s].BRI = 0;
                                                                            this.tempDatas10[s].AWA = 0;
                                                                            this.tempDatas10[s].QTY_CASE_PERCENT = 0;
                                                                            this.tempDatas10[s].FINE_PERCENT = 0;
                                                                            this.tempDatas[s].QTY = 0;
                                                                            this.tempDatas[s].FINE = 0;
                                                                            this.tempDatas[s].TRE = 0;
                                                                            this.tempDatas[s].BRI = 0;
                                                                            this.tempDatas[s].AWA = 0;
                                                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                                                            this.tempDatas[s].FINE_PERCENT = 0;
                                                                            }
                                                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                                                        }
                                                                  }
                                                                }
                                                              });
                  
                                                              if (this.condition_sepuence == 10 && ss1 == 1 && ss2 == 1  && ss3 == 1 && ss4 == 1 && ss5 == 1 && ss6 == 1 
                                                                && ss7 == 1 && ss8 == 1  && ss9 == 1 && ss10 == 1){
                                                              // console.log(ss1,ss2,ss3)
                                                              this.save_btn = true;
                                                              }else{
                                                              // console.log("no")
                                                              this.save_btn = false;
                                                              }
                  
                  
                                                              if(this.condition_sepuence11 == 1){
                                                                // console.log(11);
                                                                const param = {
                                                                  TEXT_SEARCH : this.condition_zone[0].office11,
                                                                  OFFICE_CODE : this.condition_zone[0].office11
                                                                }
                                                                this.targetService.TargetListgetByKeyword(param).subscribe(list11=>{
                                                                  // console.log(list11)
                                                                  if (list11.length == 0){
                                                                    this.sum_sequence = this.sum_sequence;
                                                                  }else {
                                                                    for(var i=0; i<list11.length; i++){
                                                                      if( list11[i].PRODUCT_GROUP_NAME == pro && list11[i].LAWSUIT_TYPE_TARGET == law && list11[i].SEQUENCE == this.sequence &&
                                                                        list11[i].IS_ACTIVE == 1 && list11[i].IS_SEND == 1 && list11[i].BUDGET_YEAR == this.year){
      
                                                                          ss11 = 1;
                                                                          // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                                                        
                                                                          var params = {
                                                                            ITEM_ID: list11[i].ITEM_ID,
                                                                            TARGET_ID: list11[i].TARGET_ID
                                                                          }
                                                                          this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                                            // console.log(lists)
                                                                            for (var i=0; i<lists.length;i++){
                                                                              this.tempDatas11[i].QTY = lists[i].QTY_CASE;
                                                                              this.tempDatas11[i].FINE = lists[i].FINE;
                                                                              this.tempDatas11[i].TRE = lists[i].TREASURY_MONEY;
                                                                              this.tempDatas11[i].BRI = lists[i].BRIBE;
                                                                              this.tempDatas11[i].AWA = lists[i].REWARD;
                                                                              this.tempDatas11[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                                              this.tempDatas11[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                                                        
                                                                              var qty_persent = [];
                                                                              var fine_persent = [];
                                                        
                                                                              this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                                                      this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                                                      this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+
                                                                                                      this.tempDatas10[i].QTY+this.tempDatas11[i].QTY+this.tempDatas12[i].QTY;
                                                                              this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                                                      this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                                                      this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+
                                                                                                      this.tempDatas10[i].FINE+this.tempDatas11[i].FINE+this.tempDatas12[i].FINE;
                                                                              this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                                                      this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                                                      this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+
                                                                                                      this.tempDatas10[i].TRE+this.tempDatas11[i].TRE+this.tempDatas12[i].TRE;
                                                                              this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                                                      this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                                                      this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+
                                                                                                      this.tempDatas10[i].BRI+this.tempDatas11[i].BRI+this.tempDatas12[i].BRI;
                                                                              this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                                                      this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                                                      this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+
                                                                                                      this.tempDatas10[i].AWA+this.tempDatas11[i].AWA+this.tempDatas12[i].AWA;  
                                                                              qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                                                      this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                                                      this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+
                                                                                                      this.tempDatas10[i].QTY_CASE_PERCENT+this.tempDatas11[i].QTY_CASE_PERCENT+this.tempDatas12[i].QTY_CASE_PERCENT;
                                                                              fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                                                      this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                                                      this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+
                                                                                                      this.tempDatas10[i].FINE_PERCENT+this.tempDatas11[i].FINE_PERCENT+this.tempDatas12[i].FINE_PERCENT;
                                                                              this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.condition_sepuence;
                                                                              this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.condition_sepuence;
                                                          
                                                                            }
                                                          
                                                                          })
                                                                        }else{
                                                                            for (var s = 0; s<12;s++){
                                                                              this.tempDatas11[s].QTY = 0;
                                                                              this.tempDatas11[s].FINE = 0;
                                                                              this.tempDatas11[s].TRE = 0;
                                                                              this.tempDatas11[s].BRI = 0;
                                                                              this.tempDatas11[s].AWA = 0;
                                                                              this.tempDatas11[s].QTY_CASE_PERCENT = 0;
                                                                              this.tempDatas11[s].FINE_PERCENT = 0;
                                                                              this.tempDatas[s].QTY = 0;
                                                                              this.tempDatas[s].FINE = 0;
                                                                              this.tempDatas[s].TRE = 0;
                                                                              this.tempDatas[s].BRI = 0;
                                                                              this.tempDatas[s].AWA = 0;
                                                                              this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                                                              this.tempDatas[s].FINE_PERCENT = 0;
                                                                              }
                                                                            // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                                                          }
                                                                    }
                                                                  }
                                                                });
                                                                
                                                                if (this.condition_sepuence == 11 && ss1 == 1 && ss2 == 1  && ss3 == 1 && ss4 == 1 && ss5 == 1 && ss6 == 1 
                                                                  && ss7 == 1 && ss8 == 1  && ss9 == 1 && ss10 == 1 && ss11 == 1){
                                                                // console.log(ss1,ss2,ss3)
                                                                this.save_btn = true;
                                                                }else{
                                                                // console.log("no")
                                                                this.save_btn = false;
                                                                }
                  
                                                                if(this.condition_sepuence12 == 1){
                                                                  // console.log(12);
                                                                  const param = {
                                                                    TEXT_SEARCH : this.condition_zone[0].office12,
                                                                    OFFICE_CODE : this.condition_zone[0].office12
                                                                  }
                                                                  this.targetService.TargetListgetByKeyword(param).subscribe(list12=>{
                                                                    // console.log(list11)
                                                                    if (list12.length == 0){
                                                                      this.sum_sequence = this.sum_sequence;
                                                                    }else {
                                                                      for(var i=0; i<list12.length; i++){
                                                                        if( list12[i].PRODUCT_GROUP_NAME == pro && list12[i].LAWSUIT_TYPE_TARGET == law && list12[i].SEQUENCE == this.sequence &&
                                                                          list12[i].IS_ACTIVE == 1 && list12[i].IS_SEND == 1 && list12[i].BUDGET_YEAR == this.year){
      
                                                                            ss12 = 1;
                                                                            // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                                                          
                                                                            var params = {
                                                                              ITEM_ID: list12[i].ITEM_ID,
                                                                              TARGET_ID: list12[i].TARGET_ID
                                                                            }
                                                                            this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                                              // console.log(lists)
                                                                              for (var i=0; i<lists.length;i++){
                                                                                this.tempDatas12[i].QTY = lists[i].QTY_CASE;
                                                                                this.tempDatas12[i].FINE = lists[i].FINE;
                                                                                this.tempDatas12[i].TRE = lists[i].TREASURY_MONEY;
                                                                                this.tempDatas12[i].BRI = lists[i].BRIBE;
                                                                                this.tempDatas12[i].AWA = lists[i].REWARD;
                                                                                this.tempDatas12[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                                                this.tempDatas12[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                                                          
                                                                                var qty_persent = [];
                                                                                var fine_persent = [];
                                                          
                                                                                this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                                                        this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                                                        this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+
                                                                                                        this.tempDatas10[i].QTY+this.tempDatas11[i].QTY+this.tempDatas12[i].QTY;
                                                                                this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                                                        this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                                                        this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+
                                                                                                        this.tempDatas10[i].FINE+this.tempDatas11[i].FINE+this.tempDatas12[i].FINE;
                                                                                this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                                                        this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                                                        this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+
                                                                                                        this.tempDatas10[i].TRE+this.tempDatas11[i].TRE+this.tempDatas12[i].TRE;
                                                                                this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                                                        this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                                                        this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+
                                                                                                        this.tempDatas10[i].BRI+this.tempDatas11[i].BRI+this.tempDatas12[i].BRI;
                                                                                this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                                                        this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                                                        this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+
                                                                                                        this.tempDatas10[i].AWA+this.tempDatas11[i].AWA+this.tempDatas12[i].AWA;  
                                                                                qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                                                        this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                                                        this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+
                                                                                                        this.tempDatas10[i].QTY_CASE_PERCENT+this.tempDatas11[i].QTY_CASE_PERCENT+this.tempDatas12[i].QTY_CASE_PERCENT;
                                                                                fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                                                        this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                                                        this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+
                                                                                                        this.tempDatas10[i].FINE_PERCENT+this.tempDatas11[i].FINE_PERCENT+this.tempDatas12[i].FINE_PERCENT;
                                                                                this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.condition_sepuence;
                                                                                this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.condition_sepuence;
                                                            
                                                                              }
                                                            
                                                                            })
                                                                          }else{
                                                                              for (var s = 0; s<12;s++){
                                                                                this.tempDatas12[s].QTY = 0;
                                                                                this.tempDatas12[s].FINE = 0;
                                                                                this.tempDatas12[s].TRE = 0;
                                                                                this.tempDatas12[s].BRI = 0;
                                                                                this.tempDatas12[s].AWA = 0;
                                                                                this.tempDatas12[s].QTY_CASE_PERCENT = 0;
                                                                                this.tempDatas12[s].FINE_PERCENT = 0;
                                                                                this.tempDatas[s].QTY = 0;
                                                                                this.tempDatas[s].FINE = 0;
                                                                                this.tempDatas[s].TRE = 0;
                                                                                this.tempDatas[s].BRI = 0;
                                                                                this.tempDatas[s].AWA = 0;
                                                                                this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                                                                this.tempDatas[s].FINE_PERCENT = 0;
                                                                                }
                                                                              // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                                                            }
                                                                      }
                                                                    }
                                                                  });
                                                                    
                                                                  if (this.condition_sepuence == 12 && ss1 == 1 && ss2 == 1  && ss3 == 1 && ss4 == 1 && ss5 == 1 && ss6 == 1 
                                                                    && ss7 == 1 && ss8 == 1  && ss9 == 1 && ss10 == 1 && ss11 == 1 && ss12 == 1 ){
                                                                  // console.log(ss1,ss2,ss3)
                                                                  this.save_btn = true;
                                                                  }else{
                                                                  // console.log("no")
                                                                  this.save_btn = false;
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          });
                                                        }
                                                      });
                                                    }
                                                  });
                                                }  
                                              });
                                            }
                                          });
                                        }
                                      });
                                    }
                                  });
                                }
                              });
                            }
                          });
                        }
                        });
                      });});});});});});});});});});});
      
                    }
                  }
          
            }
          else if(  first2 == "01"||first2 == "02"||first2 == "03"||first2 == "04"||first2 == "05"||first2 == "06"||
                  first2 == "07"||first2 == "08"||first2 == "09"||first2 == "10")
              {
                if( last4 == "0000"||last4 == "0001"||last4 == "0002"||last4 == "0003"||last4 == "0004"||last4 == "0005"||
                    last4 == "0006"||last4 == "0007"||last4 == "0008"||last4 == "0010"||last4 == "0011"||last4 == "0012")
                  {
                    // console.log("ภาค")
                    var s1 = [];var s2 = [];var s3 = [];var s4 = [];var s5 = [];var s6 = [];
                      var s7 = [];var s8 = [];var s9 = [];var s10 = [];var s11 = [];var s12 = [];
    
                      var sw1 = [];var sw2 = [];var sw3 = [];var sw4 = [];var sw5 = [];var sw6 = [];
                      var sw7 = [];var sw8 = [];var sw9 = [];var sw10 = [];var sw11 = [];var sw12 = [];
    
                      let paramss1 = {
                        TEXT_SEARCH : first2+"0100",
                        OFFICE_ID : "" 
                      }
                      this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramss1).then(list1=>{
                        // console.log(list.RESPONSE_DATA);
                        if (list1.RESPONSE_DATA.length != 0){
                        s1 = list1.RESPONSE_DATA[0].OFFICE_NAME;
                        sw1 = list1.RESPONSE_DATA[0].OFFICE_CODE;}
    
                      
                      let paramss2 = {
                        TEXT_SEARCH : first2+"0200",
                        OFFICE_ID : "" 
                      }
                      this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramss2).then(list2=>{
                        // console.log(list.RESPONSE_DATA);
                        if (list2.RESPONSE_DATA.length != 0){
                        s2 = list2.RESPONSE_DATA[0].OFFICE_NAME;
                        sw2 = list2.RESPONSE_DATA[0].OFFICE_CODE;}
    
                      let paramss3 = {
                        TEXT_SEARCH : first2+"0300",
                        OFFICE_ID : "" 
                      }
                      this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramss3).then(list3=>{
                        // console.log(list.RESPONSE_DATA);
                        if (list3.RESPONSE_DATA.length != 0){
                        s3 = list3.RESPONSE_DATA[0].OFFICE_NAME;
                        sw3 = list3.RESPONSE_DATA[0].OFFICE_CODE;}
    
                      let paramss4 = {
                        TEXT_SEARCH : first2+"0400",
                        OFFICE_ID : "" 
                      }
                      this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramss4).then(list4=>{
                        // console.log(list.RESPONSE_DATA);
                        if (list4.RESPONSE_DATA.length != 0){
                        s4 = list4.RESPONSE_DATA[0].OFFICE_NAME;
                        sw4 = list4.RESPONSE_DATA[0].OFFICE_CODE;}
    
                      let paramss5 = {
                        TEXT_SEARCH : first2+"0500",
                        OFFICE_ID : "" 
                      }
                      this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramss5).then(list5=>{
                        // console.log(list.RESPONSE_DATA);
                        if (list5.RESPONSE_DATA.length != 0){
                        s5 = list5.RESPONSE_DATA[0].OFFICE_NAME;
                        sw5 = list5.RESPONSE_DATA[0].OFFICE_CODE;}
    
                      let paramss6 = {
                        TEXT_SEARCH : first2+"0600",
                        OFFICE_ID : "" 
                      }
                      this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramss6).then(list6=>{
                        // console.log(list.RESPONSE_DATA);
                        if (list6.RESPONSE_DATA.length != 0){
                        s6 = list6.RESPONSE_DATA[0].OFFICE_NAME;
                        sw6 = list6.RESPONSE_DATA[0].OFFICE_CODE;}
    
                      let paramss7 = {
                        TEXT_SEARCH : first2+"0700",
                        OFFICE_ID : "" 
                      }
                      this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramss7).then(list7=>{
                        // console.log(list.RESPONSE_DATA);
                        if (list7.RESPONSE_DATA.length != 0){
                        s7 = list7.RESPONSE_DATA[0].OFFICE_NAME;
                        sw7 = list7.RESPONSE_DATA[0].OFFICE_CODE;}
    
                      let paramss8 = {
                        TEXT_SEARCH : first2+"0800",
                        OFFICE_ID : "" 
                      }
                      this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramss8).then(list8=>{
                        // console.log(list.RESPONSE_DATA);
                        if (list8.RESPONSE_DATA.length != 0){
                        s8 = list8.RESPONSE_DATA[0].OFFICE_NAME;
                        sw8 = list8.RESPONSE_DATA[0].OFFICE_CODE;}
    
                      let paramss9 = {
                        TEXT_SEARCH : first2+"0900",
                        OFFICE_ID : "" 
                      }
                      this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramss9).then(list9=>{
                        // console.log(list.RESPONSE_DATA);
                        if (list9.RESPONSE_DATA.length != 0){
                        s9 = list9.RESPONSE_DATA[0].OFFICE_NAME;
                        sw9 = list9.RESPONSE_DATA[0].OFFICE_CODE;}
    
                      let paramss10 = {
                        TEXT_SEARCH : first2+"1000",
                        OFFICE_ID : "" 
                      }
                      this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramss10).then(list10=>{
                        // console.log(list.RESPONSE_DATA);
                        if (list10.RESPONSE_DATA.length != 0){
                        s10 = list10.RESPONSE_DATA[0].OFFICE_NAME;
                        sw10 = list10.RESPONSE_DATA[0].OFFICE_CODE;}
    
                      let paramss11 = {
                        TEXT_SEARCH : first2+"1100",
                        OFFICE_ID : "" 
                      }
                      this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramss11).then(list11=>{
                        // console.log(list.RESPONSE_DATA);
                        if (list11.RESPONSE_DATA.length != 0){
                        s11 = list11.RESPONSE_DATA[0].OFFICE_NAME;
                        sw11 = list11.RESPONSE_DATA[0].OFFICE_CODE;}
    
                      let paramss12 = {
                        TEXT_SEARCH : first2+"1200",
                        OFFICE_ID : "" 
                      }
                      this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramss12).then(list12=>{
                        // console.log(list.RESPONSE_DATA);
                        if (list12.RESPONSE_DATA.length != 0){
                          s12 = list12.RESPONSE_DATA[0].OFFICE_NAME
                          sw12 = list12.RESPONSE_DATA[0].OFFICE_CODE;;
                        }
                        this.row = true;
    
                       if (s12.length !== 0){
                        this.condition_sepuence = 12;
                        this.tempData.push({
                          header1 : s1,
                          header2 : s2,
                          header3 : s3,
                          header4 : s4,
                          header5 : s5,
                          header6 : s6,
                          header7 : s7,
                          header8 : s8,
                          header9 : s9,
                          header10 : s10,
                          header11 : s11,
                          header12 : s12,
                          });
    
                          this.condition_zone.push({
                            office1 : s1,
                            office2 : s2,
                            office3 : s3,
                            office4 : s4,
                            office5 : s5,
                            office6 : s6,
                            office7 : s7,
                            office8 : s8,
                            office9 : s9,
                            office10 : s10,
                            office11 : s11,
                            office12 : s12,
                            });
    
                              this.table12 = true;
                              this.table11 = true;
                              this.table10 = true;
                              this.table9 = true;
                              this.table8 = true;
                              this.table7 = true;
                              this.table6 = true;
                              this.table5 = true;
                              this.table4 = true;
                              this.table3 = true;
                              this.table2 = true;
                              this.table1 = true;
                              this.table = true;
    
                       }else if (s11.length !== 0){
                        this.condition_sepuence = 11;
                        this.tempData.push({
                          header1 : s1,
                          header2 : s2,
                          header3 : s3,
                          header4 : s4,
                          header5 : s5,
                          header6 : s6,
                          header7 : s7,
                          header8 : s8,
                          header9 : s9,
                          header10 : s10,
                          header11 : s11,
                          })
                          this.condition_zone.push({
                            office1 : s1,
                            office2 : s2,
                            office3 : s3,
                            office4 : s4,
                            office5 : s5,
                            office6 : s6,
                            office7 : s7,
                            office8 : s8,
                            office9 : s9,
                            office10 : s10,
                            office11 : s11,
                            office12 : null,
                            });
                              
                              this.table11 = true;
                              this.table10 = true;
                              this.table9 = true;
                              this.table8 = true;
                              this.table7 = true;
                              this.table6 = true;
                              this.table5 = true;
                              this.table4 = true;
                              this.table3 = true;
                              this.table2 = true;
                              this.table1 = true;
                              this.table = true;
    
                       }else if (s10.length !== 0){
                        this.condition_sepuence = 10;
                        this.tempData.push({
                          header1 : s1,
                          header2 : s2,
                          header3 : s3,
                          header4 : s4,
                          header5 : s5,
                          header6 : s6,
                          header7 : s7,
                          header8 : s8,
                          header9 : s9,
                          header10 : s10,
                          })
                          this.condition_zone.push({
                            office1 : s1,
                            office2 : s2,
                            office3 : s3,
                            office4 : s4,
                            office5 : s5,
                            office6 : s6,
                            office7 : s7,
                            office8 : s8,
                            office9 : s9,
                            office10 : s10,
                            office11 : null,
                            office12 : null,
                            });
                              
                              this.table10 = true;
                              this.table9 = true;
                              this.table8 = true;
                              this.table7 = true;
                              this.table6 = true;
                              this.table5 = true;
                              this.table4 = true;
                              this.table3 = true;
                              this.table2 = true;
                              this.table1 = true;
                              this.table = true;
    
                       }else if (s9.length !== 0){
                        this.condition_sepuence = 9;
                        this.tempData.push({
                          header1 : s1,
                          header2 : s2,
                          header3 : s3,
                          header4 : s4,
                          header5 : s5,
                          header6 : s6,
                          header7 : s7,
                          header8 : s8,
                          header9 : s9,
                          })
    
                          this.condition_zone.push({
                            office1 : s1,
                            office2 : s2,
                            office3 : s3,
                            office4 : s4,
                            office5 : s5,
                            office6 : s6,
                            office7 : s7,
                            office8 : s8,
                            office9 : s9,
                            office10 : null,
                            office11 : null,
                            office12 : null,
                            });
                            
                              this.table9 = true;
                              this.table8 = true;
                              this.table7 = true;
                              this.table6 = true;
                              this.table5 = true;
                              this.table4 = true;
                              this.table3 = true;
                              this.table2 = true;
                              this.table1 = true;
                              this.table = true;
    
                       }else if (s8.length !== 0){
                        this.condition_sepuence = 8;
                        this.tempData.push({
                          header1 : s1,
                          header2 : s2,
                          header3 : s3,
                          header4 : s4,
                          header5 : s5,
                          header6 : s6,
                          header7 : s7,
                          header8 : s8,
                          })
    
                          this.condition_zone.push({
                            office1 : s1,
                            office2 : s2,
                            office3 : s3,
                            office4 : s4,
                            office5 : s5,
                            office6 : s6,
                            office7 : s7,
                            office8 : s8,
                            office9 : null,
                            office10 : null,
                            office11 : null,
                            office12 : null,
                            });
                             
                              this.table8 = true;
                              this.table7 = true;
                              this.table6 = true;
                              this.table5 = true;
                              this.table4 = true;
                              this.table3 = true;
                              this.table2 = true;
                              this.table1 = true;
                              this.table = true;
    
                       }else if (s7.length !== 0){
                        this.condition_sepuence = 7;
                        this.tempData.push({
                          header1 : s1,
                          header2 : s2,
                          header3 : s3,
                          header4 : s4,
                          header5 : s5,
                          header6 : s6,
                          header7 : s7,
                          })
    
                          this.condition_zone.push({
                            office1 : s1,
                            office2 : s2,
                            office3 : s3,
                            office4 : s4,
                            office5 : s5,
                            office6 : s6,
                            office7 : s7,
                            office8 : null,
                            office9 : null,
                            office10 : null,
                            office11 : null,
                            office12 : null,
                            });
                             
                              this.table7 = true;
                              this.table6 = true;
                              this.table5 = true;
                              this.table4 = true;
                              this.table3 = true;
                              this.table2 = true;
                              this.table1 = true;
                              this.table = true;
    
                       }else if (s6.length !== 0){
                        this.condition_sepuence = 6;
                        this.tempData.push({
                          header1 : s1,
                          header2 : s2,
                          header3 : s3,
                          header4 : s4,
                          header5 : s5,
                          header6 : s6,
                          })
    
                          this.condition_zone.push({
                            office1 : s1,
                            office2 : s2,
                            office3 : s3,
                            office4 : s4,
                            office5 : s5,
                            office6 : s6,
                            office7 : null,
                            office8 : null,
                            office9 : null,
                            office10 : null,
                            office11 : null,
                            office12 : null,
                            });
                             
                              this.table6 = true;
                              this.table5 = true;
                              this.table4 = true;
                              this.table3 = true;
                              this.table2 = true;
                              this.table1 = true;
                              this.table = true;
    
                       }else if (s5.length !== 0){
                        this.condition_sepuence = 5;
                        this.tempData.push({
                          header1 : s1,
                          header2 : s2,
                          header3 : s3,
                          header4 : s4,
                          header5 : s5,
                          })
    
                          this.condition_zone.push({
                            office1 : s1,
                            office2 : s2,
                            office3 : s3,
                            office4 : s4,
                            office5 : s5,
                            office6 : null,
                            office7 : null,
                            office8 : null,
                            office9 : null,
                            office10 : null,
                            office11 : null,
                            office12 : null,
                            });
                             
                              this.table5 = true;
                              this.table4 = true;
                              this.table3 = true;
                              this.table2 = true;
                              this.table1 = true;
                              this.table = true;
    
                       }else if (s4.length !== 0){
                        this.condition_sepuence = 4;
                        this.tempData.push({
                          header1 : s1,
                          header2 : s2,
                          header3 : s3,
                          header4 : s4,
                          })
    
                          this.condition_zone.push({
                            office1 : s1,
                            office2 : s2,
                            office3 : s3,
                            office4 : s4,
                            office5 : null,
                            office6 : null,
                            office7 : null,
                            office8 : null,
                            office9 : null,
                            office10 : null,
                            office11 : null,
                            office12 : null,
                            });
                             
                              this.table4 = true;
                              this.table3 = true;
                              this.table2 = true;
                              this.table1 = true;
                              this.table = true;
    
                       }else if (s3.length !== 0){
                        this.condition_sepuence = 3;
                        this.tempData.push({
                          header1 : s1,
                          header2 : s2,
                          header3 : s3,
                          })
    
                          this.condition_zone.push({
                            office1 : s1,
                            office2 : s2,
                            office3 : s3,
                            office4 : null,
                            office5 : null,
                            office6 : null,
                            office7 : null,
                            office8 : null,
                            office9 : null,
                            office10 : null,
                            office11 : null,
                            office12 : null,
                            });
                             
                              this.table3 = true;
                              this.table2 = true;
                              this.table1 = true;
                              this.table = true;
    
                       }else if (s2.length !== 0){
                        this.condition_sepuence = 2;
                        this.tempData.push({
                          header1 : s1,
                          header2 : s2,
                          })
    
                          this.condition_zone.push({
                            office1 : s1,
                            office2 : s2,
                            office3 : null,
                            office4 : null,
                            office5 : null,
                            office6 : null,
                            office7 : null,
                            office8 : null,
                            office9 : null,
                            office10 : null,
                            office11 : null,
                            office12 : null,
                            });
                             
                              this.table2 = true;
                              this.table1 = true;
                              this.table = true;
    
                       }else if (s1.length !== 0){
                        this.condition_sepuence = 1;
                        this.tempData.push({
                          header1 : s1,
                          })
    
                          this.condition_zone.push({
                            office1 : s1,
                            office2 : null,
                            office3 : null,
                            office4 : null,
                            office5 : null,
                            office6 : null,
                            office7 : null,
                            office8 : null,
                            office9 : null,
                            office10 : null,
                            office11 : null,
                            office12 : null,
                            });
                              this.table1 = true;
                              this.table = true;
    
                       }
    
    
                      var ss1 = 0;
                      var ss2 = 0;
                      var ss3= 0;
                      var ss4 = 0;
                      var ss5 = 0;
                      var ss6 = 0;
                      var ss7 = 0;
                      var ss8 = 0;
                      var ss9 = 0;
                      var ss10 = 0;
                      var ss11 = 0;
                      var ss12 = 0;
                      
                          var pro = '';
                          if (this.product == 'สุรา'){
                            pro = 'สุรา'
                          }else if (this.product == 'ยาสูบ'){
                            pro = 'ยาสูบ'
                          }else if (this.product == 'ไพ่'){
                            pro = 'ไพ่'
                          }else if (this.product == 'สินค้าอื่นๆ'){
                            pro = 'สินค้าอื่นๆ'
                          }
                    
                          var law = '';
                          if (this.lawsult_type == 0){
                            law = '0'
                          }else if (this.lawsult_type == 1){
                            law = '1'
                          }else if (this.lawsult_type == 2){
                            law = '2'
                          }
    
                      if(this.condition_sepuence == 12){
                        this.condition_sepuence12 = 1;
                        this.condition_sepuence11 = 1;
                        this.condition_sepuence10 = 1;
                        this.condition_sepuence9 = 1;
                        this.condition_sepuence8 = 1;
                        this.condition_sepuence7 = 1;
                        this.condition_sepuence6 = 1;
                        this.condition_sepuence5 = 1;
                        this.condition_sepuence4 = 1;
                        this.condition_sepuence3 = 1;
                        this.condition_sepuence2 = 1;
                        this.condition_sepuence1 = 1;
                      } 
                      else if(this.condition_sepuence == 11){
                        this.condition_sepuence11 = 1;
                        this.condition_sepuence10 = 1;
                        this.condition_sepuence9 = 1;
                        this.condition_sepuence8 = 1;
                        this.condition_sepuence7 = 1;
                        this.condition_sepuence6 = 1;
                        this.condition_sepuence5 = 1;
                        this.condition_sepuence4 = 1;
                        this.condition_sepuence3 = 1;
                        this.condition_sepuence2 = 1;
                        this.condition_sepuence1 = 1;
                      } 
                      else if(this.condition_sepuence == 10){
                        this.condition_sepuence10 = 1;
                        this.condition_sepuence9 = 1;
                        this.condition_sepuence8 = 1;
                        this.condition_sepuence7 = 1;
                        this.condition_sepuence6 = 1;
                        this.condition_sepuence5 = 1;
                        this.condition_sepuence4 = 1;
                        this.condition_sepuence3 = 1;
                        this.condition_sepuence2 = 1;
                        this.condition_sepuence1 = 1;
                      } 
                      else if(this.condition_sepuence == 9){
                        this.condition_sepuence9 = 1;
                        this.condition_sepuence8 = 1;
                        this.condition_sepuence7 = 1;
                        this.condition_sepuence6 = 1;
                        this.condition_sepuence5 = 1;
                        this.condition_sepuence4 = 1;
                        this.condition_sepuence3 = 1;
                        this.condition_sepuence2 = 1;
                        this.condition_sepuence1 = 1;
                      }   
                      else if(this.condition_sepuence == 8){
                        this.condition_sepuence8 = 1;
                        this.condition_sepuence7 = 1;
                        this.condition_sepuence6 = 1;
                        this.condition_sepuence5 = 1;
                        this.condition_sepuence4 = 1;
                        this.condition_sepuence3 = 1;
                        this.condition_sepuence2 = 1;
                        this.condition_sepuence1 = 1;
                      } 
                      else if(this.condition_sepuence == 7){
                        this.condition_sepuence7 = 1;
                        this.condition_sepuence6 = 1;
                        this.condition_sepuence5 = 1;
                        this.condition_sepuence4 = 1;
                        this.condition_sepuence3 = 1;
                        this.condition_sepuence2 = 1;
                        this.condition_sepuence1 = 1;
                      } 
                      else if(this.condition_sepuence == 6){
                        this.condition_sepuence6 = 1;
                        this.condition_sepuence5 = 1;
                        this.condition_sepuence4 = 1;
                        this.condition_sepuence3 = 1;
                        this.condition_sepuence2 = 1;
                        this.condition_sepuence1 = 1;
                      } 
                      else if(this.condition_sepuence == 5){
                        this.condition_sepuence5 = 1;
                        this.condition_sepuence4 = 1;
                        this.condition_sepuence3 = 1;
                        this.condition_sepuence2 = 1;
                        this.condition_sepuence1 = 1;
                      } 
                      else if(this.condition_sepuence == 4){
                        this.condition_sepuence4 = 1;
                        this.condition_sepuence3 = 1;
                        this.condition_sepuence2 = 1;
                        this.condition_sepuence1 = 1;
                      }
                      else if(this.condition_sepuence == 3){
                        this.condition_sepuence3 = 1;
                        this.condition_sepuence2 = 1;
                        this.condition_sepuence1 = 1;
                      } 
                      else if(this.condition_sepuence == 2){
                        this.condition_sepuence2 = 1;
                        this.condition_sepuence1 = 1;
                      }
                      else if(this.condition_sepuence == 1){
                        this.condition_sepuence1 = 1;
                      }
    
                      if(this.condition_sepuence1 == 1){
        // console.log(1);
        const param = {
          TEXT_SEARCH : this.condition_zone[0].office1,
          OFFICE_CODE : this.condition_zone[0].office1
        }
        console.log(param)
        this.targetService.TargetListgetByKeyword(param).subscribe(list1=>{

          if (list1.length == 0){
            this.sum_sequence = this.sum_sequence;
          }else {
            for(var i=0; i<list1.length; i++){
              if( list1[i].PRODUCT_GROUP_NAME == pro && list1[i].LAWSUIT_TYPE_TARGET == law && list1[i].SEQUENCE == this.sequence &&
                list1[i].IS_ACTIVE == 1 && list1[i].IS_SEND == 1 && list1[i].BUDGET_YEAR == this.year){
                  // this.box3 = true;
                  this.row = true;
                  // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                  ss1 = 1;

                  var params = {
                    ITEM_ID: list1[i].ITEM_ID,
                    TARGET_ID: list1[i].TARGET_ID
                  }
                  this.targetService.TargetgetByCon(params).subscribe(lists=>{
                    // console.log(lists)
                    for (var i=0; i<lists.length;i++){
                      this.tempDatas1[i].QTY = lists[i].QTY_CASE;
                      this.tempDatas1[i].FINE = lists[i].FINE;
                      this.tempDatas1[i].TRE = lists[i].TREASURY_MONEY;
                      this.tempDatas1[i].BRI = lists[i].BRIBE;
                      this.tempDatas1[i].AWA = lists[i].REWARD;
                      this.tempDatas1[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                      this.tempDatas1[i].FINE_PERCENT = lists[i].FINE_PERCENT;

                      var qty_persent = [];
                      var fine_persent = [];

                      this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                              this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                              this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+
                                              this.tempDatas10[i].QTY+this.tempDatas11[i].QTY+this.tempDatas12[i].QTY;
                      this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                              this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                              this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+
                                              this.tempDatas10[i].FINE+this.tempDatas11[i].FINE+this.tempDatas12[i].FINE;
                      this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                              this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                              this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+
                                              this.tempDatas10[i].TRE+this.tempDatas11[i].TRE+this.tempDatas12[i].TRE;
                      this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                              this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                              this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+
                                              this.tempDatas10[i].BRI+this.tempDatas11[i].BRI+this.tempDatas12[i].BRI;
                      this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                              this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                              this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+
                                              this.tempDatas10[i].AWA+this.tempDatas11[i].AWA+this.tempDatas12[i].AWA;  
                      qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                              this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                              this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+
                                              this.tempDatas10[i].QTY_CASE_PERCENT+this.tempDatas11[i].QTY_CASE_PERCENT+this.tempDatas12[i].QTY_CASE_PERCENT;
                      fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                              this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                              this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+
                                              this.tempDatas10[i].FINE_PERCENT+this.tempDatas11[i].FINE_PERCENT+this.tempDatas12[i].FINE_PERCENT;
                      this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.condition_sepuence;
                      this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.condition_sepuence;
  
                    }
  
                  })
                }else{
                    for (var s = 0; s<12;s++){
                      this.tempDatas1[s].QTY = 0;
                      this.tempDatas1[s].FINE = 0;
                      this.tempDatas1[s].TRE = 0;
                      this.tempDatas1[s].BRI = 0;
                      this.tempDatas1[s].AWA = 0;
                      this.tempDatas1[s].QTY_CASE_PERCENT = 0;
                      this.tempDatas1[s].FINE_PERCENT = 0;
                      this.tempDatas[s].QTY = 0;
                      this.tempDatas[s].FINE = 0;
                      this.tempDatas[s].TRE = 0;
                      this.tempDatas[s].BRI = 0;
                      this.tempDatas[s].AWA = 0;
                      this.tempDatas[s].QTY_CASE_PERCENT = 0;
                      this.tempDatas[s].FINE_PERCENT = 0;
                      }
                    // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                  }
            }
          }
          if (this.condition_sepuence == 1 && ss1 == 1){
            // console.log(ss1)
            this.save_btn = true;
            }else{
            // console.log("no")
            this.save_btn = false;
            }

          if(this.condition_sepuence2 == 1){
            // console.log(2);
            const param = {
              TEXT_SEARCH : this.condition_zone[0].office2,
              OFFICE_CODE : this.condition_zone[0].office2
            }
            console.log(param)
            this.targetService.TargetListgetByKeyword(param).subscribe(list2=>{
              // console.log(list2)
              if (list2.length == 0){
                this.sum_sequence = this.sum_sequence;
              }else {
                for(var i=0; i<list2.length; i++){
                  if( list2[i].PRODUCT_GROUP_NAME == pro && list2[i].LAWSUIT_TYPE_TARGET == law && list2[i].SEQUENCE == this.sequence &&
                    list2[i].IS_ACTIVE == 1 && list2[i].IS_SEND == 1 && list2[i].BUDGET_YEAR == this.year){
                      // this.box3 = true;
                      this.row = true;
                      ss2 = 1;
                      // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
    
                      var params = {
                        ITEM_ID: list2[i].ITEM_ID,
                        TARGET_ID: list2[i].TARGET_ID
                      }
                      this.targetService.TargetgetByCon(params).subscribe(lists=>{
                        // console.log(lists)
                        for (var i=0; i<lists.length;i++){
                          this.tempDatas2[i].QTY = lists[i].QTY_CASE;
                          this.tempDatas2[i].FINE = lists[i].FINE;
                          this.tempDatas2[i].TRE = lists[i].TREASURY_MONEY;
                          this.tempDatas2[i].BRI = lists[i].BRIBE;
                          this.tempDatas2[i].AWA = lists[i].REWARD;
                          this.tempDatas2[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                          this.tempDatas2[i].FINE_PERCENT = lists[i].FINE_PERCENT;
    
                          var qty_persent = [];
                          var fine_persent = [];
    
                          this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                  this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                  this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+
                                                  this.tempDatas10[i].QTY+this.tempDatas11[i].QTY+this.tempDatas12[i].QTY;
                          this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                  this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                  this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+
                                                  this.tempDatas10[i].FINE+this.tempDatas11[i].FINE+this.tempDatas12[i].FINE;
                          this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                  this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                  this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+
                                                  this.tempDatas10[i].TRE+this.tempDatas11[i].TRE+this.tempDatas12[i].TRE;
                          this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                  this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                  this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+
                                                  this.tempDatas10[i].BRI+this.tempDatas11[i].BRI+this.tempDatas12[i].BRI;
                          this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                  this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                  this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+
                                                  this.tempDatas10[i].AWA+this.tempDatas11[i].AWA+this.tempDatas12[i].AWA;  
                          qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                  this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                  this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+
                                                  this.tempDatas10[i].QTY_CASE_PERCENT+this.tempDatas11[i].QTY_CASE_PERCENT+this.tempDatas12[i].QTY_CASE_PERCENT;
                          fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                  this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                  this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+
                                                  this.tempDatas10[i].FINE_PERCENT+this.tempDatas11[i].FINE_PERCENT+this.tempDatas12[i].FINE_PERCENT;
                          this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.condition_sepuence;
                          this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.condition_sepuence;
      
                        }
      
                      })
                    }else{
                        for (var s = 0; s<12;s++){
                          this.tempDatas2[s].QTY = 0;
                          this.tempDatas2[s].FINE = 0;
                          this.tempDatas2[s].TRE = 0;
                          this.tempDatas2[s].BRI = 0;
                          this.tempDatas2[s].AWA = 0;
                          this.tempDatas2[s].QTY_CASE_PERCENT = 0;
                          this.tempDatas2[s].FINE_PERCENT = 0;
                          this.tempDatas[s].QTY = 0;
                          this.tempDatas[s].FINE = 0;
                          this.tempDatas[s].TRE = 0;
                          this.tempDatas[s].BRI = 0;
                          this.tempDatas[s].AWA = 0;
                          this.tempDatas[s].QTY_CASE_PERCENT = 0;
                          this.tempDatas[s].FINE_PERCENT = 0;
                          }
                        // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                      }
                }
              }

              if (this.condition_sepuence == 2 && ss1 == 1 && ss2 == 1 ){
                // console.log(ss1,ss2)
                this.save_btn = true;
                }else{
                // console.log("no")
                this.save_btn = false;
                }


              if(this.condition_sepuence3 == 1){
                // console.log(3);
                const param = {
                  TEXT_SEARCH : this.condition_zone[0].office3,
                  OFFICE_CODE : this.condition_zone[0].office3
                }
                console.log(param)
                this.targetService.TargetListgetByKeyword(param).subscribe(list3=>{
                  // console.log(list3)
                  if (list3.length == 0){
                    this.sum_sequence = this.sum_sequence;
                  }else {
                    for(var i=0; i<list3.length; i++){
                      if( list3[i].PRODUCT_GROUP_NAME == pro && list3[i].LAWSUIT_TYPE_TARGET == law && list3[i].SEQUENCE == this.sequence &&
                        list3[i].IS_ACTIVE == 1 && list3[i].IS_SEND == 1 && list3[i].BUDGET_YEAR == this.year){
                          // this.box3 = true;
                          this.row = true;
                          ss3 = 1;
                          // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
        
                          var params = {
                            ITEM_ID: list3[i].ITEM_ID,
                            TARGET_ID: list3[i].TARGET_ID
                          }
                          this.targetService.TargetgetByCon(params).subscribe(lists=>{
                            // console.log(lists)
                            for (var i=0; i<lists.length;i++){
                              this.tempDatas3[i].QTY = lists[i].QTY_CASE;
                              this.tempDatas3[i].FINE = lists[i].FINE;
                              this.tempDatas3[i].TRE = lists[i].TREASURY_MONEY;
                              this.tempDatas3[i].BRI = lists[i].BRIBE;
                              this.tempDatas3[i].AWA = lists[i].REWARD;
                              this.tempDatas3[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                              this.tempDatas3[i].FINE_PERCENT = lists[i].FINE_PERCENT;
        
                              var qty_persent = [];
                              var fine_persent = [];
        
                              this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                      this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                      this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+
                                                      this.tempDatas10[i].QTY+this.tempDatas11[i].QTY+this.tempDatas12[i].QTY;
                              this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                      this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                      this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+
                                                      this.tempDatas10[i].FINE+this.tempDatas11[i].FINE+this.tempDatas12[i].FINE;
                              this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                      this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                      this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+
                                                      this.tempDatas10[i].TRE+this.tempDatas11[i].TRE+this.tempDatas12[i].TRE;
                              this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                      this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                      this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+
                                                      this.tempDatas10[i].BRI+this.tempDatas11[i].BRI+this.tempDatas12[i].BRI;
                              this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                      this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                      this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+
                                                      this.tempDatas10[i].AWA+this.tempDatas11[i].AWA+this.tempDatas12[i].AWA;  
                              qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                      this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                      this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+
                                                      this.tempDatas10[i].QTY_CASE_PERCENT+this.tempDatas11[i].QTY_CASE_PERCENT+this.tempDatas12[i].QTY_CASE_PERCENT;
                              fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                      this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                      this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+
                                                      this.tempDatas10[i].FINE_PERCENT+this.tempDatas11[i].FINE_PERCENT+this.tempDatas12[i].FINE_PERCENT;
                              this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.condition_sepuence;
                              this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.condition_sepuence;
          
                            }
          
                          })
                        }else{
                            for (var s = 0; s<12;s++){
                              this.tempDatas3[s].QTY = 0;
                              this.tempDatas3[s].FINE = 0;
                              this.tempDatas3[s].TRE = 0;
                              this.tempDatas3[s].BRI = 0;
                              this.tempDatas3[s].AWA = 0;
                              this.tempDatas3[s].QTY_CASE_PERCENT = 0;
                              this.tempDatas3[s].FINE_PERCENT = 0;
                              this.tempDatas[s].QTY = 0;
                              this.tempDatas[s].FINE = 0;
                              this.tempDatas[s].TRE = 0;
                              this.tempDatas[s].BRI = 0;
                              this.tempDatas[s].AWA = 0;
                              this.tempDatas[s].QTY_CASE_PERCENT = 0;
                              this.tempDatas[s].FINE_PERCENT = 0;
                              }
                            // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                          }
                    }
                  }
                  
                  if (this.condition_sepuence == 3 && ss1 == 1 && ss2 == 1  && ss3 == 1 ){
                    // console.log(ss1,ss2,ss3)
                    this.save_btn = true;
                    }else{
                    // console.log("no")
                    this.save_btn = false;
                    }

                  if(this.condition_sepuence4 == 1){
                    // console.log(4);
                    const param = {
                      TEXT_SEARCH : this.condition_zone[0].office4,
                      OFFICE_CODE : this.condition_zone[0].office4
                    }
                    console.log(param)
                    this.targetService.TargetListgetByKeyword(param).subscribe(list4=>{
                      // console.log(list4)
                      if (list4.length == 0){
                        this.sum_sequence = this.sum_sequence;
                      }else {
                        for(var i=0; i<list4.length; i++){
                          if( list4[i].PRODUCT_GROUP_NAME == pro && list4[i].LAWSUIT_TYPE_TARGET == law && list4[i].SEQUENCE == this.sequence &&
                            list4[i].IS_ACTIVE == 1 && list4[i].IS_SEND == 1 && list4[i].BUDGET_YEAR == this.year){
                          // this.box3 = true;
                          this.row = true;
                          ss4 = 1;
                          // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
        
                          var params = {
                            ITEM_ID: list4[i].ITEM_ID,
                            TARGET_ID: list4[i].TARGET_ID
                          }
                          this.targetService.TargetgetByCon(params).subscribe(lists=>{
                            // console.log(lists)
                            for (var i=0; i<lists.length;i++){
                              this.tempDatas4[i].QTY = lists[i].QTY_CASE;
                              this.tempDatas4[i].FINE = lists[i].FINE;
                              this.tempDatas4[i].TRE = lists[i].TREASURY_MONEY;
                              this.tempDatas4[i].BRI = lists[i].BRIBE;
                              this.tempDatas4[i].AWA = lists[i].REWARD;
                              this.tempDatas4[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                              this.tempDatas4[i].FINE_PERCENT = lists[i].FINE_PERCENT;
        
                              var qty_persent = [];
                              var fine_persent = [];
        
                              this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                      this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                      this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+
                                                      this.tempDatas10[i].QTY+this.tempDatas11[i].QTY+this.tempDatas12[i].QTY;
                              this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                      this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                      this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+
                                                      this.tempDatas10[i].FINE+this.tempDatas11[i].FINE+this.tempDatas12[i].FINE;
                              this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                      this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                      this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+
                                                      this.tempDatas10[i].TRE+this.tempDatas11[i].TRE+this.tempDatas12[i].TRE;
                              this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                      this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                      this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+
                                                      this.tempDatas10[i].BRI+this.tempDatas11[i].BRI+this.tempDatas12[i].BRI;
                              this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                      this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                      this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+
                                                      this.tempDatas10[i].AWA+this.tempDatas11[i].AWA+this.tempDatas12[i].AWA;  
                              qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                      this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                      this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+
                                                      this.tempDatas10[i].QTY_CASE_PERCENT+this.tempDatas11[i].QTY_CASE_PERCENT+this.tempDatas12[i].QTY_CASE_PERCENT;
                              fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                      this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                      this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+
                                                      this.tempDatas10[i].FINE_PERCENT+this.tempDatas11[i].FINE_PERCENT+this.tempDatas12[i].FINE_PERCENT;
                              this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.condition_sepuence;
                              this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.condition_sepuence;
          
                            }
          
                          })
                        }else{
                            for (var s = 0; s<12;s++){
                              this.tempDatas4[s].QTY = 0;
                              this.tempDatas4[s].FINE = 0;
                              this.tempDatas4[s].TRE = 0;
                              this.tempDatas4[s].BRI = 0;
                              this.tempDatas4[s].AWA = 0;
                              this.tempDatas4[s].QTY_CASE_PERCENT = 0;
                              this.tempDatas4[s].FINE_PERCENT = 0;
                              this.tempDatas[s].QTY = 0;
                              this.tempDatas[s].FINE = 0;
                              this.tempDatas[s].TRE = 0;
                              this.tempDatas[s].BRI = 0;
                              this.tempDatas[s].AWA = 0;
                              this.tempDatas[s].QTY_CASE_PERCENT = 0;
                              this.tempDatas[s].FINE_PERCENT = 0;
                              }
                            // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                          }
                        }
                      }

                      if (this.condition_sepuence == 4 && ss1 == 1 && ss2 == 1  && ss3 == 1 && ss4 == 1 ){
                        // console.log(ss1,ss2,ss3)
                        this.save_btn = true;
                        }else{
                        // console.log("no")
                        this.save_btn = false;
                        }

                      if(this.condition_sepuence5 == 1){
                        // console.log(5);
                        const param = {
                          TEXT_SEARCH : this.condition_zone[0].office5,
                          OFFICE_CODE : this.condition_zone[0].office5
                        }
                        console.log(param)
                        this.targetService.TargetListgetByKeyword(param).subscribe(list5=>{
                          // console.log(list5)
                          if (list5.length == 0){
                            this.sum_sequence = this.sum_sequence;
                          }else {
                            for(var i=0; i<list5.length; i++){
                              if( list5[i].PRODUCT_GROUP_NAME == pro && list5[i].LAWSUIT_TYPE_TARGET == law && list5[i].SEQUENCE == this.sequence &&
                                list5[i].IS_ACTIVE == 1 && list5[i].IS_SEND == 1 && list5[i].BUDGET_YEAR == this.year){
                                  // this.box3 = true;
                                  this.row = true;
                                  ss5 = 1;
                                  // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                
                                  var params = {
                                    ITEM_ID: list5[i].ITEM_ID,
                                    TARGET_ID: list5[i].TARGET_ID
                                  }
                                  this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                    // console.log(lists)
                                    for (var i=0; i<lists.length;i++){
                                      this.tempDatas5[i].QTY = lists[i].QTY_CASE;
                                      this.tempDatas5[i].FINE = lists[i].FINE;
                                      this.tempDatas5[i].TRE = lists[i].TREASURY_MONEY;
                                      this.tempDatas5[i].BRI = lists[i].BRIBE;
                                      this.tempDatas5[i].AWA = lists[i].REWARD;
                                      this.tempDatas5[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                      this.tempDatas5[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                
                                      var qty_persent = [];
                                      var fine_persent = [];
                
                                      this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                              this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                              this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+
                                                              this.tempDatas10[i].QTY+this.tempDatas11[i].QTY+this.tempDatas12[i].QTY;
                                      this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                              this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                              this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+
                                                              this.tempDatas10[i].FINE+this.tempDatas11[i].FINE+this.tempDatas12[i].FINE;
                                      this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                              this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                              this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+
                                                              this.tempDatas10[i].TRE+this.tempDatas11[i].TRE+this.tempDatas12[i].TRE;
                                      this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                              this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                              this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+
                                                              this.tempDatas10[i].BRI+this.tempDatas11[i].BRI+this.tempDatas12[i].BRI;
                                      this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                              this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                              this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+
                                                              this.tempDatas10[i].AWA+this.tempDatas11[i].AWA+this.tempDatas12[i].AWA;  
                                      qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                              this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                              this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+
                                                              this.tempDatas10[i].QTY_CASE_PERCENT+this.tempDatas11[i].QTY_CASE_PERCENT+this.tempDatas12[i].QTY_CASE_PERCENT;
                                      fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                              this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                              this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+
                                                              this.tempDatas10[i].FINE_PERCENT+this.tempDatas11[i].FINE_PERCENT+this.tempDatas12[i].FINE_PERCENT;
                                      this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.condition_sepuence;
                                      this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.condition_sepuence;
                  
                                    }
                  
                                  })
                                }else{
                                    for (var s = 0; s<12;s++){
                                      this.tempDatas5[s].QTY = 0;
                                      this.tempDatas5[s].FINE = 0;
                                      this.tempDatas5[s].TRE = 0;
                                      this.tempDatas5[s].BRI = 0;
                                      this.tempDatas5[s].AWA = 0;
                                      this.tempDatas5[s].QTY_CASE_PERCENT = 0;
                                      this.tempDatas5[s].FINE_PERCENT = 0;
                                      this.tempDatas[s].QTY = 0;
                                      this.tempDatas[s].FINE = 0;
                                      this.tempDatas[s].TRE = 0;
                                      this.tempDatas[s].BRI = 0;
                                      this.tempDatas[s].AWA = 0;
                                      this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                      this.tempDatas[s].FINE_PERCENT = 0;
                                      }
                                    // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                  }
                            }
                          }
                          if (this.condition_sepuence == 5 && ss1 == 1 && ss2 == 1  && ss3 == 1 && ss4 == 1 && ss5 == 1 ){
                            // console.log(ss1,ss2,ss3)
                            this.save_btn = true;
                            }else{
                            // console.log("no")
                            this.save_btn = false;
                            }

                            if(this.condition_sepuence6 == 1){
                              // console.log(6);
                              const param = {
                                TEXT_SEARCH : this.condition_zone[0].office6,
                                OFFICE_CODE : this.condition_zone[0].office6
                              }
                              console.log(param)
                              this.targetService.TargetListgetByKeyword(param).subscribe(list6=>{
                                // console.log(list6)
                                if (list6.length == 0){
                                  this.sum_sequence = this.sum_sequence;
                                }else {
                                  for(var i=0; i<list6.length; i++){
                                    if( list6[i].PRODUCT_GROUP_NAME == pro && list6[i].LAWSUIT_TYPE_TARGET == law && list6[i].SEQUENCE == this.sequence &&
                                      list6[i].IS_ACTIVE == 1 && list6[i].IS_SEND == 1 && list6[i].BUDGET_YEAR == this.year){
                                    // this.box3 = true;
                                    this.row = true;
                                    ss6 = 1;
                                    // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                  
                                    var params = {
                                      ITEM_ID: list6[i].ITEM_ID,
                                      TARGET_ID: list6[i].TARGET_ID
                                    }
                                    this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                      // console.log(lists)
                                      for (var i=0; i<lists.length;i++){
                                        this.tempDatas6[i].QTY = lists[i].QTY_CASE;
                                        this.tempDatas6[i].FINE = lists[i].FINE;
                                        this.tempDatas6[i].TRE = lists[i].TREASURY_MONEY;
                                        this.tempDatas6[i].BRI = lists[i].BRIBE;
                                        this.tempDatas6[i].AWA = lists[i].REWARD;
                                        this.tempDatas6[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                        this.tempDatas6[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                  
                                        var qty_persent = [];
                                        var fine_persent = [];
                  
                                        this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+
                                                                this.tempDatas10[i].QTY+this.tempDatas11[i].QTY+this.tempDatas12[i].QTY;
                                        this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+
                                                                this.tempDatas10[i].FINE+this.tempDatas11[i].FINE+this.tempDatas12[i].FINE;
                                        this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+
                                                                this.tempDatas10[i].TRE+this.tempDatas11[i].TRE+this.tempDatas12[i].TRE;
                                        this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+
                                                                this.tempDatas10[i].BRI+this.tempDatas11[i].BRI+this.tempDatas12[i].BRI;
                                        this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+
                                                                this.tempDatas10[i].AWA+this.tempDatas11[i].AWA+this.tempDatas12[i].AWA;  
                                        qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+
                                                                this.tempDatas10[i].QTY_CASE_PERCENT+this.tempDatas11[i].QTY_CASE_PERCENT+this.tempDatas12[i].QTY_CASE_PERCENT;
                                        fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+
                                                                this.tempDatas10[i].FINE_PERCENT+this.tempDatas11[i].FINE_PERCENT+this.tempDatas12[i].FINE_PERCENT;
                                        this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.condition_sepuence;
                                        this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.condition_sepuence;
                    
                                      }
                    
                                    })
                                  }else{
                                      for (var s = 0; s<12;s++){
                                        this.tempDatas6[s].QTY = 0;
                                        this.tempDatas6[s].FINE = 0;
                                        this.tempDatas6[s].TRE = 0;
                                        this.tempDatas6[s].BRI = 0;
                                        this.tempDatas6[s].AWA = 0;
                                        this.tempDatas6[s].QTY_CASE_PERCENT = 0;
                                        this.tempDatas6[s].FINE_PERCENT = 0;
                                        this.tempDatas[s].QTY = 0;
                                        this.tempDatas[s].FINE = 0;
                                        this.tempDatas[s].TRE = 0;
                                        this.tempDatas[s].BRI = 0;
                                        this.tempDatas[s].AWA = 0;
                                        this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                        this.tempDatas[s].FINE_PERCENT = 0;
                                        }
                                      // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                    }
                                  }
                                }
                                
                                if (this.condition_sepuence == 6 && ss1 == 1 && ss2 == 1  && ss3 == 1 && ss4 == 1 && ss5 == 1 && ss6 == 1 
                                  ){
                                 // console.log(ss1,ss2,ss3)
                                 this.save_btn = true;
                                 }else{
                                 // console.log("no")
                                 this.save_btn = false;
                                 }
  
                                 if(this.condition_sepuence7 == 1){
                                  // console.log(7);
                                  const param = {
                                    TEXT_SEARCH : this.condition_zone[0].office7,
                                    OFFICE_CODE : this.condition_zone[0].office7
                                  }
                                  console.log(param)
                                  this.targetService.TargetListgetByKeyword(param).subscribe(list7=>{
                                    // console.log(list7)
                                    if (list7.length == 0){
                                      this.sum_sequence = this.sum_sequence;
                                    }else {
                                      for(var i=0; i<list7.length; i++){
                                        if( list7[i].PRODUCT_GROUP_NAME == pro && list7[i].LAWSUIT_TYPE_TARGET == law && list7[i].SEQUENCE == this.sequence &&
                                          list7[i].IS_ACTIVE == 1 && list7[i].IS_SEND == 1 && list7[i].BUDGET_YEAR == this.year){
                                        // this.box3 = true;
                                        this.row = true;
                                        ss7 =  1;
                                        // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                      
                                        var params = {
                                          ITEM_ID: list7[i].ITEM_ID,
                                          TARGET_ID: list7[i].TARGET_ID
                                        }
                                        this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                          // console.log(lists)
                                          for (var i=0; i<lists.length;i++){
                                            this.tempDatas7[i].QTY = lists[i].QTY_CASE;
                                            this.tempDatas7[i].FINE = lists[i].FINE;
                                            this.tempDatas7[i].TRE = lists[i].TREASURY_MONEY;
                                            this.tempDatas7[i].BRI = lists[i].BRIBE;
                                            this.tempDatas7[i].AWA = lists[i].REWARD;
                                            this.tempDatas7[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                            this.tempDatas7[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                      
                                            var qty_persent = [];
                                            var fine_persent = [];
                      
                                            this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                    this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                    this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+
                                                                    this.tempDatas10[i].QTY+this.tempDatas11[i].QTY+this.tempDatas12[i].QTY;
                                            this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                    this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                    this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+
                                                                    this.tempDatas10[i].FINE+this.tempDatas11[i].FINE+this.tempDatas12[i].FINE;
                                            this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                    this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                    this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+
                                                                    this.tempDatas10[i].TRE+this.tempDatas11[i].TRE+this.tempDatas12[i].TRE;
                                            this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                    this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                    this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+
                                                                    this.tempDatas10[i].BRI+this.tempDatas11[i].BRI+this.tempDatas12[i].BRI;
                                            this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                    this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                    this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+
                                                                    this.tempDatas10[i].AWA+this.tempDatas11[i].AWA+this.tempDatas12[i].AWA;  
                                            qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                    this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                    this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+
                                                                    this.tempDatas10[i].QTY_CASE_PERCENT+this.tempDatas11[i].QTY_CASE_PERCENT+this.tempDatas12[i].QTY_CASE_PERCENT;
                                            fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                    this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                    this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+
                                                                    this.tempDatas10[i].FINE_PERCENT+this.tempDatas11[i].FINE_PERCENT+this.tempDatas12[i].FINE_PERCENT;
                                            this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.condition_sepuence;
                                            this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.condition_sepuence;
                        
                                          }
                        
                                        })
                                      }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas7[s].QTY = 0;
                                            this.tempDatas7[s].FINE = 0;
                                            this.tempDatas7[s].TRE = 0;
                                            this.tempDatas7[s].BRI = 0;
                                            this.tempDatas7[s].AWA = 0;
                                            this.tempDatas7[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas7[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                      }
                                    }
                                    
                                    if (this.condition_sepuence == 7 && ss1 == 1 && ss2 == 1  && ss3 == 1 && ss4 == 1 && ss5 == 1 && ss6 == 1 && ss7 == 1 
                                      ){
                                     // console.log(ss1,ss2,ss3)
                                     this.save_btn = true;
                                     }else{
                                     // console.log("no")
                                     this.save_btn = false;
                                     }
      
                                    //  console.log(ss1,ss2,ss3,ss4,ss5,ss6,ss7)
                                     if(this.condition_sepuence8 == 1){
                                      // console.log(8);
                                      const param = {
                                        TEXT_SEARCH : this.condition_zone[0].office8,
                                        OFFICE_CODE : this.condition_zone[0].office8
                                      }
                                      console.log(param)
                                      this.targetService.TargetListgetByKeyword(param).subscribe(list8=>{
                                        // console.log(list8)
                                        if (list8.length == 0){
                                          this.sum_sequence = this.sum_sequence;
                                        }else {
                                          for(var i=0; i<list8.length; i++){
                                            if( list8[i].PRODUCT_GROUP_NAME == pro && list8[i].LAWSUIT_TYPE_TARGET == law && list8[i].SEQUENCE == this.sequence &&
                                              list8[i].IS_ACTIVE == 1 && list8[i].IS_SEND == 1 && list8[i].BUDGET_YEAR == this.year){
                                            // this.box3 = true;
                                            this.row = true;
                                            ss8 =  1;
                                            // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                          
                                            var params = {
                                              ITEM_ID: list8[i].ITEM_ID,
                                              TARGET_ID: list8[i].TARGET_ID
                                            }
                                            this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                              // console.log(lists)
                                              for (var i=0; i<lists.length;i++){
                                                this.tempDatas8[i].QTY = lists[i].QTY_CASE;
                                                this.tempDatas8[i].FINE = lists[i].FINE;
                                                this.tempDatas8[i].TRE = lists[i].TREASURY_MONEY;
                                                this.tempDatas8[i].BRI = lists[i].BRIBE;
                                                this.tempDatas8[i].AWA = lists[i].REWARD;
                                                this.tempDatas8[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                this.tempDatas8[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                          
                                                var qty_persent = [];
                                                var fine_persent = [];
                          
                                                this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                        this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                        this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+
                                                                        this.tempDatas10[i].QTY+this.tempDatas11[i].QTY+this.tempDatas12[i].QTY;
                                                this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                        this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                        this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+
                                                                        this.tempDatas10[i].FINE+this.tempDatas11[i].FINE+this.tempDatas12[i].FINE;
                                                this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                        this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                        this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+
                                                                        this.tempDatas10[i].TRE+this.tempDatas11[i].TRE+this.tempDatas12[i].TRE;
                                                this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                        this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                        this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+
                                                                        this.tempDatas10[i].BRI+this.tempDatas11[i].BRI+this.tempDatas12[i].BRI;
                                                this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                        this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                        this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+
                                                                        this.tempDatas10[i].AWA+this.tempDatas11[i].AWA+this.tempDatas12[i].AWA;  
                                                qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                        this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                        this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+
                                                                        this.tempDatas10[i].QTY_CASE_PERCENT+this.tempDatas11[i].QTY_CASE_PERCENT+this.tempDatas12[i].QTY_CASE_PERCENT;
                                                fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                        this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                        this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+
                                                                        this.tempDatas10[i].FINE_PERCENT+this.tempDatas11[i].FINE_PERCENT+this.tempDatas12[i].FINE_PERCENT;
                                                this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.condition_sepuence;
                                                this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.condition_sepuence;
                            
                                              }
                            
                                            })
                                          }else{
                                              for (var s = 0; s<12;s++){
                                                this.tempDatas8[s].QTY = 0;
                                                this.tempDatas8[s].FINE = 0;
                                                this.tempDatas8[s].TRE = 0;
                                                this.tempDatas8[s].BRI = 0;
                                                this.tempDatas8[s].AWA = 0;
                                                this.tempDatas8[s].QTY_CASE_PERCENT = 0;
                                                this.tempDatas8[s].FINE_PERCENT = 0;
                                                this.tempDatas[s].QTY = 0;
                                                this.tempDatas[s].FINE = 0;
                                                this.tempDatas[s].TRE = 0;
                                                this.tempDatas[s].BRI = 0;
                                                this.tempDatas[s].AWA = 0;
                                                this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                                this.tempDatas[s].FINE_PERCENT = 0;
                                                }
                                              // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                            }
                                          }
                                        }
                                        
                                        if (this.condition_sepuence == 8 && ss1 == 1 && ss2 == 1  && ss3 == 1 && ss4 == 1 && ss5 == 1 && ss6 == 1 
                                          && ss7 == 1  && ss8 == 1 
                                          ){
                                         // console.log(ss1,ss2,ss3)
                                         this.save_btn = true;
                                         }else{
                                         // console.log("no")
                                         this.save_btn = false;
                                         }
          
                                        //  console.log(ss1,ss2,ss3,ss4,ss5,ss6,ss7,ss8)
                                         if(this.condition_sepuence9 == 1){
                                          // console.log(8);
                                          const param = {
                                            TEXT_SEARCH : this.condition_zone[0].office9,
                                            OFFICE_CODE : this.condition_zone[0].office9
                                          }
                                          console.log(param)
                                          this.targetService.TargetListgetByKeyword(param).subscribe(list9=>{
                                            // console.log(list9)
                                            if (list9.length == 0){
                                              this.sum_sequence = this.sum_sequence;
                                            }else {
                                              for(var i=0; i<list9.length; i++){
                                                if( list9[i].PRODUCT_GROUP_NAME == pro && list9[i].LAWSUIT_TYPE_TARGET == law && list9[i].SEQUENCE == this.sequence &&
                                                  list9[i].IS_ACTIVE == 1 && list9[i].IS_SEND == 1 && list9[i].BUDGET_YEAR == this.year){
                                                // this.box3 = true;
                                                this.row = true;
                                                ss9 =  1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                              
                                                var params = {
                                                  ITEM_ID: list9[i].ITEM_ID,
                                                  TARGET_ID: list9[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas9[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas9[i].FINE = lists[i].FINE;
                                                    this.tempDatas9[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas9[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas9[i].AWA = lists[i].REWARD;
                                                    this.tempDatas9[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas9[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                              
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                              
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+
                                                                            this.tempDatas10[i].QTY+this.tempDatas11[i].QTY+this.tempDatas12[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+
                                                                            this.tempDatas10[i].FINE+this.tempDatas11[i].FINE+this.tempDatas12[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+
                                                                            this.tempDatas10[i].TRE+this.tempDatas11[i].TRE+this.tempDatas12[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+
                                                                            this.tempDatas10[i].BRI+this.tempDatas11[i].BRI+this.tempDatas12[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+
                                                                            this.tempDatas10[i].AWA+this.tempDatas11[i].AWA+this.tempDatas12[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas10[i].QTY_CASE_PERCENT+this.tempDatas11[i].QTY_CASE_PERCENT+this.tempDatas12[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+
                                                                            this.tempDatas10[i].FINE_PERCENT+this.tempDatas11[i].FINE_PERCENT+this.tempDatas12[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.condition_sepuence;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.condition_sepuence;
                                
                                                  }
                                
                                                })
                                              }else{
                                                  for (var s = 0; s<12;s++){
                                                    this.tempDatas9[s].QTY = 0;
                                                    this.tempDatas9[s].FINE = 0;
                                                    this.tempDatas9[s].TRE = 0;
                                                    this.tempDatas9[s].BRI = 0;
                                                    this.tempDatas9[s].AWA = 0;
                                                    this.tempDatas9[s].QTY_CASE_PERCENT = 0;
                                                    this.tempDatas9[s].FINE_PERCENT = 0;
                                                    this.tempDatas[s].QTY = 0;
                                                    this.tempDatas[s].FINE = 0;
                                                    this.tempDatas[s].TRE = 0;
                                                    this.tempDatas[s].BRI = 0;
                                                    this.tempDatas[s].AWA = 0;
                                                    this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                                    this.tempDatas[s].FINE_PERCENT = 0;
                                                    }
                                                  // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                                }
                                              }
                                            }
                                            
                                            if (this.condition_sepuence == 9 && ss1 == 1 && ss2 == 1  && ss3 == 1 && ss4 == 1 && ss5 == 1 && ss6 == 1 
                                              && ss7 == 1  && ss8 == 1 && ss9 == 1 
                                              ){
                                             // console.log(ss1,ss2,ss3)
                                             this.save_btn = true;
                                             }else{
                                             // console.log("no")
                                             this.save_btn = false;
                                             }
              
                                            //  console.log(ss1,ss2,ss3,ss4,ss5,ss6,ss7,ss8,ss9)
                                            if(this.condition_sepuence10 == 1){
                                              // console.log(8);
                                              const param = {
                                                TEXT_SEARCH : this.condition_zone[0].office10,
                                                OFFICE_CODE : this.condition_zone[0].office10
                                              }
                                              console.log(param)
                                              this.targetService.TargetListgetByKeyword(param).subscribe(list10=>{
                                                // console.log(list10)
                                                if (list10.length == 0){
                                                  this.sum_sequence = this.sum_sequence;
                                                }else {
                                                  for(var i=0; i<list10.length; i++){
                                                    if( list10[i].PRODUCT_GROUP_NAME == pro && list10[i].LAWSUIT_TYPE_TARGET == law && list10[i].SEQUENCE == this.sequence &&
                                                      list10[i].IS_ACTIVE == 1 && list10[i].IS_SEND == 1 && list10[i].BUDGET_YEAR == this.year){
                                                    // this.box3 = true;
                                                    this.row = true;
                                                    ss10 =  1;
                                                    // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                                  
                                                    var params = {
                                                      ITEM_ID: list10[i].ITEM_ID,
                                                      TARGET_ID: list10[i].TARGET_ID
                                                    }
                                                    this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                      // console.log(lists)
                                                      for (var i=0; i<lists.length;i++){
                                                        this.tempDatas10[i].QTY = lists[i].QTY_CASE;
                                                        this.tempDatas10[i].FINE = lists[i].FINE;
                                                        this.tempDatas10[i].TRE = lists[i].TREASURY_MONEY;
                                                        this.tempDatas10[i].BRI = lists[i].BRIBE;
                                                        this.tempDatas10[i].AWA = lists[i].REWARD;
                                                        this.tempDatas10[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                        this.tempDatas10[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                                  
                                                        var qty_persent = [];
                                                        var fine_persent = [];
                                  
                                                        this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                                this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                                this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+
                                                                                this.tempDatas10[i].QTY+this.tempDatas11[i].QTY+this.tempDatas12[i].QTY;
                                                        this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                                this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                                this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+
                                                                                this.tempDatas10[i].FINE+this.tempDatas11[i].FINE+this.tempDatas12[i].FINE;
                                                        this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                                this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                                this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+
                                                                                this.tempDatas10[i].TRE+this.tempDatas11[i].TRE+this.tempDatas12[i].TRE;
                                                        this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                                this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                                this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+
                                                                                this.tempDatas10[i].BRI+this.tempDatas11[i].BRI+this.tempDatas12[i].BRI;
                                                        this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                                this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                                this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+
                                                                                this.tempDatas10[i].AWA+this.tempDatas11[i].AWA+this.tempDatas12[i].AWA;  
                                                        qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                                this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                                this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+
                                                                                this.tempDatas10[i].QTY_CASE_PERCENT+this.tempDatas11[i].QTY_CASE_PERCENT+this.tempDatas12[i].QTY_CASE_PERCENT;
                                                        fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                                this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                                this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+
                                                                                this.tempDatas10[i].FINE_PERCENT+this.tempDatas11[i].FINE_PERCENT+this.tempDatas12[i].FINE_PERCENT;
                                                        this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.condition_sepuence;
                                                        this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.condition_sepuence;
                                    
                                                      }
                                    
                                                    })
                                                  }else{
                                                      for (var s = 0; s<12;s++){
                                                        this.tempDatas10[s].QTY = 0;
                                                        this.tempDatas10[s].FINE = 0;
                                                        this.tempDatas10[s].TRE = 0;
                                                        this.tempDatas10[s].BRI = 0;
                                                        this.tempDatas10[s].AWA = 0;
                                                        this.tempDatas10[s].QTY_CASE_PERCENT = 0;
                                                        this.tempDatas10[s].FINE_PERCENT = 0;
                                                        this.tempDatas[s].QTY = 0;
                                                        this.tempDatas[s].FINE = 0;
                                                        this.tempDatas[s].TRE = 0;
                                                        this.tempDatas[s].BRI = 0;
                                                        this.tempDatas[s].AWA = 0;
                                                        this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                                        this.tempDatas[s].FINE_PERCENT = 0;
                                                        }
                                                      // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                                    }
                                                  }
                                                }
                                                
                                                if (this.condition_sepuence == 10 && ss1 == 1 && ss2 == 1  && ss3 == 1 && ss4 == 1 && ss5 == 1 && ss6 == 1 
                                                  && ss7 == 1  && ss8 == 1 && ss9 == 1 && ss10 == 1 
                                                  ){
                                                 // console.log(ss1,ss2,ss3)
                                                 this.save_btn = true;
                                                 }else{
                                                 // console.log("no")
                                                 this.save_btn = false;
                                                 }
                  
                                                //  console.log(ss1,ss2,ss3,ss4,ss5,ss6,ss7,ss8,ss9,ss10)
                                                if(this.condition_sepuence11 == 1){
                                                  // console.log(8);
                                                  const param = {
                                                    TEXT_SEARCH : this.condition_zone[0].office11,
                                                    OFFICE_CODE : this.condition_zone[0].office11
                                                  }
                                                  console.log(param)
                                                  this.targetService.TargetListgetByKeyword(param).subscribe(list11=>{
                                                    // console.log(list11)
                                                    if (list11.length == 0){
                                                      this.sum_sequence = this.sum_sequence;
                                                    }else {
                                                      for(var i=0; i<list11.length; i++){
                                                        if( list11[i].PRODUCT_GROUP_NAME == pro && list11[i].LAWSUIT_TYPE_TARGET == law && list11[i].SEQUENCE == this.sequence &&
                                                          list11[i].IS_ACTIVE == 1 && list11[i].IS_SEND == 1 && list11[i].BUDGET_YEAR == this.year){
                                                        // this.box3 = true;
                                                        this.row = true;
                                                        ss11 =  1;
                                                        // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                                      
                                                        var params = {
                                                          ITEM_ID: list11[i].ITEM_ID,
                                                          TARGET_ID: list11[i].TARGET_ID
                                                        }
                                                        this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                          // console.log(lists)
                                                          for (var i=0; i<lists.length;i++){
                                                            this.tempDatas11[i].QTY = lists[i].QTY_CASE;
                                                            this.tempDatas11[i].FINE = lists[i].FINE;
                                                            this.tempDatas11[i].TRE = lists[i].TREASURY_MONEY;
                                                            this.tempDatas11[i].BRI = lists[i].BRIBE;
                                                            this.tempDatas11[i].AWA = lists[i].REWARD;
                                                            this.tempDatas11[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                            this.tempDatas11[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                                      
                                                            var qty_persent = [];
                                                            var fine_persent = [];
                                      
                                                            this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                                    this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                                    this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+
                                                                                    this.tempDatas10[i].QTY+this.tempDatas11[i].QTY+this.tempDatas12[i].QTY;
                                                            this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                                    this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                                    this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+
                                                                                    this.tempDatas10[i].FINE+this.tempDatas11[i].FINE+this.tempDatas12[i].FINE;
                                                            this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                                    this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                                    this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+
                                                                                    this.tempDatas10[i].TRE+this.tempDatas11[i].TRE+this.tempDatas12[i].TRE;
                                                            this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                                    this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                                    this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+
                                                                                    this.tempDatas10[i].BRI+this.tempDatas11[i].BRI+this.tempDatas12[i].BRI;
                                                            this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                                    this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                                    this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+
                                                                                    this.tempDatas10[i].AWA+this.tempDatas11[i].AWA+this.tempDatas12[i].AWA;  
                                                            qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                                    this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                                    this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+
                                                                                    this.tempDatas10[i].QTY_CASE_PERCENT+this.tempDatas11[i].QTY_CASE_PERCENT+this.tempDatas12[i].QTY_CASE_PERCENT;
                                                            fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                                    this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                                    this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+
                                                                                    this.tempDatas10[i].FINE_PERCENT+this.tempDatas11[i].FINE_PERCENT+this.tempDatas12[i].FINE_PERCENT;
                                                            this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.condition_sepuence;
                                                            this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.condition_sepuence;
                                        
                                                          }
                                        
                                                        })
                                                      }else{
                                                          for (var s = 0; s<12;s++){
                                                            this.tempDatas11[s].QTY = 0;
                                                            this.tempDatas11[s].FINE = 0;
                                                            this.tempDatas11[s].TRE = 0;
                                                            this.tempDatas11[s].BRI = 0;
                                                            this.tempDatas11[s].AWA = 0;
                                                            this.tempDatas11[s].QTY_CASE_PERCENT = 0;
                                                            this.tempDatas11[s].FINE_PERCENT = 0;
                                                            this.tempDatas[s].QTY = 0;
                                                            this.tempDatas[s].FINE = 0;
                                                            this.tempDatas[s].TRE = 0;
                                                            this.tempDatas[s].BRI = 0;
                                                            this.tempDatas[s].AWA = 0;
                                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                                            this.tempDatas[s].FINE_PERCENT = 0;
                                                            }
                                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                                        }
                                                      }
                                                    }
                                                    
                                                    if (this.condition_sepuence == 11 && ss1 == 1 && ss2 == 1  && ss3 == 1 && ss4 == 1 && ss5 == 1 && ss6 == 1 
                                                      && ss7 == 1  && ss8 == 1 && ss9 == 1 && ss10 == 1 && ss11 == 1 
                                                      ){
                                                     // console.log(ss1,ss2,ss3)
                                                     this.save_btn = true;
                                                     }else{
                                                     // console.log("no")
                                                     this.save_btn = false;
                                                     }
                      
                                                    //  console.log(ss1,ss2,ss3,ss4,ss5,ss6,ss7,ss8,ss9,ss10,ss11)

                                                    if(this.condition_sepuence12 == 1){
                                                      // console.log(8);
                                                      const param = {
                                                        TEXT_SEARCH : this.condition_zone[0].office12,
                                                        OFFICE_CODE : this.condition_zone[0].office12
                                                      }
                                                      console.log(param)
                                                      this.targetService.TargetListgetByKeyword(param).subscribe(list12=>{
                                                        // console.log(list12)
                                                        if (list12.length == 0){
                                                          this.sum_sequence = this.sum_sequence;
                                                        }else {
                                                          for(var i=0; i<list12.length; i++){
                                                            if( list12[i].PRODUCT_GROUP_NAME == pro && list12[i].LAWSUIT_TYPE_TARGET == law && list12[i].SEQUENCE == this.sequence &&
                                                              list12[i].IS_ACTIVE == 1 && list12[i].IS_SEND == 1 && list12[i].BUDGET_YEAR == this.year){
                                                            // this.box3 = true;
                                                            this.row = true;
                                                            ss12 =  1;
                                                            // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                                          
                                                            var params = {
                                                              ITEM_ID: list11[i].ITEM_ID,
                                                              TARGET_ID: list11[i].TARGET_ID
                                                            }
                                                            this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                              // console.log(lists)
                                                              for (var i=0; i<lists.length;i++){
                                                                this.tempDatas12[i].QTY = lists[i].QTY_CASE;
                                                                this.tempDatas12[i].FINE = lists[i].FINE;
                                                                this.tempDatas12[i].TRE = lists[i].TREASURY_MONEY;
                                                                this.tempDatas12[i].BRI = lists[i].BRIBE;
                                                                this.tempDatas12[i].AWA = lists[i].REWARD;
                                                                this.tempDatas12[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                                this.tempDatas12[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                                          
                                                                var qty_persent = [];
                                                                var fine_persent = [];
                                          
                                                                this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                                        this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                                        this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+
                                                                                        this.tempDatas10[i].QTY+this.tempDatas11[i].QTY+this.tempDatas12[i].QTY;
                                                                this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                                        this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                                        this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+
                                                                                        this.tempDatas10[i].FINE+this.tempDatas11[i].FINE+this.tempDatas12[i].FINE;
                                                                this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                                        this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                                        this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+
                                                                                        this.tempDatas10[i].TRE+this.tempDatas11[i].TRE+this.tempDatas12[i].TRE;
                                                                this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                                        this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                                        this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+
                                                                                        this.tempDatas10[i].BRI+this.tempDatas11[i].BRI+this.tempDatas12[i].BRI;
                                                                this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                                        this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                                        this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+
                                                                                        this.tempDatas10[i].AWA+this.tempDatas11[i].AWA+this.tempDatas12[i].AWA;  
                                                                qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                                        this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                                        this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+
                                                                                        this.tempDatas10[i].QTY_CASE_PERCENT+this.tempDatas11[i].QTY_CASE_PERCENT+this.tempDatas12[i].QTY_CASE_PERCENT;
                                                                fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                                        this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                                        this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+
                                                                                        this.tempDatas10[i].FINE_PERCENT+this.tempDatas11[i].FINE_PERCENT+this.tempDatas12[i].FINE_PERCENT;
                                                                this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.condition_sepuence;
                                                                this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.condition_sepuence;
                                            
                                                              }
                                            
                                                            })
                                                          }else{
                                                              for (var s = 0; s<12;s++){
                                                                this.tempDatas12[s].QTY = 0;
                                                                this.tempDatas12[s].FINE = 0;
                                                                this.tempDatas12[s].TRE = 0;
                                                                this.tempDatas12[s].BRI = 0;
                                                                this.tempDatas12[s].AWA = 0;
                                                                this.tempDatas12[s].QTY_CASE_PERCENT = 0;
                                                                this.tempDatas12[s].FINE_PERCENT = 0;
                                                                this.tempDatas[s].QTY = 0;
                                                                this.tempDatas[s].FINE = 0;
                                                                this.tempDatas[s].TRE = 0;
                                                                this.tempDatas[s].BRI = 0;
                                                                this.tempDatas[s].AWA = 0;
                                                                this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                                                this.tempDatas[s].FINE_PERCENT = 0;
                                                                }
                                                              // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                                            }
                                                          }
                                                        }
                                                        
                                                        if (this.condition_sepuence == 12 && ss1 == 1 && ss2 == 1  && ss3 == 1 && ss4 == 1 && ss5 == 1 && ss6 == 1 
                                                          && ss7 == 1  && ss8 == 1 && ss9 == 1 && ss10 == 1 && ss11 == 1 && ss12 == 1 
                                                          ){
                                                         // console.log(ss1,ss2,ss3)
                                                         this.save_btn = true;
                                                         }else{
                                                         // console.log("no")
                                                         this.save_btn = false;
                                                         }
                          
                                                        //  console.log(ss1,ss2,ss3,ss4,ss5,ss6,ss7,ss8,ss9,ss10,ss11,ss12)
                          
                                                      });
                                                    }
                      
                                                  });
                                                }
                  
                                              });
                                            }
              
                                          });
                                        }
          
                                      });
                                    }
      
                                  });
                                }
  
                              });
                            }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
                  
                      });
                    });});});});});});});});});});});
    
                  }
                else if(  middle2 == "01"||middle2 == "02"||middle2 == "03"||middle2 == "04"||middle2 == "05"||
                          middle2 == "06"||middle2 == "07"||middle2 == "08"||middle2 == "09"||middle2 == "10"||middle2 == "11"||middle2 == "12")
                  {
                    if(last2 == "00")
                      {
                        // console.log("พื้นที่")
                        // console.log(this.office_name)
                        this.office_name = ofname;
                        let paramsssss = {
                          TEXT_SEARCH : this.office_name,
                          OFFICE_ID : "" 
                        }
                
                      this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramsssss).then(list=>{
                        console.log(list);
                
                
                          for(var i=0; i<list.RESPONSE_DATA.length;i++){
                            if ( list.RESPONSE_DATA[i].OFFICE_CODE !== this.offfice_code ){
                              // console.log(list.RESPONSE_DATA[i].OFFICE_NAME);
                              this.office_table.push({
                                name : list.RESPONSE_DATA[i].OFFICE_NAME.substring(this.office_name.length+1)
                              });
                  
                              this.office_id_table.push({
                                name : list.RESPONSE_DATA[i].OFFICE_NAME
                              });
                            }
                          }
                          // console.log(this.office_table);
                  
                          if ( this.office_table.length == 10){
                            // console.log('10');
                            this.table10 = true;
                            this.table9 = true;
                            this.table8 = true;
                            this.table7 = true;
                            this.table6 = true;
                            this.table5 = true;
                            this.table4 = true;
                            this.table3 = true;
                            this.table2 = true;
                            this.table1 = true;
                            this.table = true;
                            this.tempData.push({
                              header1 : this.office_table[0].name,
                              header2 : this.office_table[1].name,
                              header3 : this.office_table[2].name,
                              header4 : this.office_table[3].name,
                              header5 : this.office_table[4].name,
                              header6 : this.office_table[5].name,
                              header7 : this.office_table[6].name,
                              header8 : this.office_table[7].name,
                              header9 : this.office_table[8].name,
                              header10 : this.office_table[9].name,
                            });
                            this.row = true;  
                          }else if ( this.office_table.length == 9){
                            // console.log('9');
                            this.table9 = true;
                            this.table8 = true;
                            this.table7 = true;
                            this.table6 = true;
                            this.table5 = true;
                            this.table4 = true;
                            this.table3 = true;
                            this.table2 = true;
                            this.table1 = true;
                            this.table = true;
                            this.tempData.push({
                              header1 : this.office_table[0].name,
                              header2 : this.office_table[1].name,
                              header3 : this.office_table[2].name,
                              header4 : this.office_table[3].name,
                              header5 : this.office_table[4].name,
                              header6 : this.office_table[5].name,
                              header7 : this.office_table[6].name,
                              header8 : this.office_table[7].name,
                              header9 : this.office_table[8].name,
                            })
                  
                            this.row = true;
                          }else if ( this.office_table.length == 8){
                            // console.log('8');
                            this.table8 = true;
                            this.table7 = true;
                            this.table6 = true;
                            this.table5 = true;
                            this.table4 = true;
                            this.table3 = true;
                            this.table2 = true;
                            this.table1 = true;
                            this.table = true;
                            this.tempData.push({
                              header1 : this.office_table[0].name,
                              header2 : this.office_table[1].name,
                              header3 : this.office_table[2].name,
                              header4 : this.office_table[3].name,
                              header5 : this.office_table[4].name,
                              header6 : this.office_table[5].name,
                              header7 : this.office_table[6].name,
                              header8 : this.office_table[7].name,
                            })
                  
                            this.row = true;
                          }else if ( this.office_table.length == 7){
                            this.table7 = true;
                            this.table6 = true;
                            this.table5 = true;
                            this.table4 = true;
                            this.table3 = true;
                            this.table2 = true;
                            this.table1 = true;
                            this.table = true;
                            this.tempData.push({
                              header1 : this.office_table[0].name,
                              header2 : this.office_table[1].name,
                              header3 : this.office_table[2].name,
                              header4 : this.office_table[3].name,
                              header5 : this.office_table[4].name,
                              header6 : this.office_table[5].name,
                              header7 : this.office_table[6].name,
                            })
                  
                            this.row = true;
                          }else if ( this.office_table.length == 6){
                            // console.log('6');
                            this.table6 = true;
                            this.table5 = true;
                            this.table4 = true;
                            this.table3 = true;
                            this.table2 = true;
                            this.table1 = true;
                            this.table = true;
                            this.tempData.push({
                              header1 : this.office_table[0].name,
                              header2 : this.office_table[1].name,
                              header3 : this.office_table[2].name,
                              header4 : this.office_table[3].name,
                              header5 : this.office_table[4].name,
                              header6 : this.office_table[5].name,
                            })
                  
                            this.row = true;
                          }else if ( this.office_table.length == 5){
                            // console.log('5');
                            this.table5 = true;
                            this.table4 = true;
                            this.table3 = true;
                            this.table2 = true;
                            this.table1 = true;
                            this.table = true;
                            this.tempData.push({
                              header1 : this.office_table[0].name,
                              header2 : this.office_table[1].name,
                              header3 : this.office_table[2].name,
                              header4 : this.office_table[3].name,
                              header5 : this.office_table[4].name,
                            })
                  
                            this.row = true;
                          }else if ( this.office_table.length == 4){
                            // console.log('4');
                            this.table4 = true;
                            this.table3 = true;
                            this.table2 = true;
                            this.table1 = true;
                            this.table = true;
                            this.tempData.push({
                              header1 : this.office_table[0].name,
                              header2 : this.office_table[1].name,
                              header3 : this.office_table[2].name,
                              header4 : this.office_table[3].name,
                            })
                  
                            this.row = true;
                          }else if ( this.office_table.length == 3){
                            // console.log(this.office_table);
                            this.table3 = true;
                            this.table2 = true;
                            this.table1 = true;
                            this.table = true;
                  
                            this.tempData.push({
                              header1 : this.office_table[0].name,
                              header2 : this.office_table[1].name,
                              header3 : this.office_table[2].name,
                            })
                  
                            
                  
                            this.row = true;
                  
                          }else if ( this.office_table.length == 2){
                            // console.log('2');
                            this.table2 = true;
                            this.table1 = true;
                            this.table = true;
                            this.tempData.push({
                              header1 : this.office_table[0].name,
                              header2 : this.office_table[1].name,
                            })
                  
                            this.row = true;
                          }else if ( this.office_table.length == 1){
                            // console.log('1');
                            this.table1 = true;
                            this.table = true;
                            this.tempData.push({
                              header1 : this.office_table[0].name,
                            })
                  
                            this.row = true;
                          }
                  
                  
                          var ss1 = 0;
                          var ss2 = 0;
                          var ss3= 0;
                          var ss4 = 0;
                          var ss5 = 0;
                          var ss6 = 0;
                          var ss7 = 0;
                          var ss8 = 0;
                          var ss9 = 0;
                          var ss10 = 0;
                          var num = this.sequence;
                  
                          const param = {
                            TEXT_SEARCH: "",
                            OFFICE_CODE: this.offfice_code
                          };
                    
                          var pro = '';
                          if (this.product == 'สุรา'){
                            pro = 'สุรา'
                          }else if (this.product == 'ยาสูบ'){
                            pro = 'ยาสูบ'
                          }else if (this.product == 'ไพ่'){
                            pro = 'ไพ่'
                          }else if (this.product == 'สินค้าอื่นๆ'){
                            pro = 'สินค้าอื่นๆ'
                          }
                    
                          var law = '';
                          if (this.lawsult_type == 0){
                            law = '0'
                          }else if (this.lawsult_type == 1){
                            law = '1'
                          }else if (this.lawsult_type == 2){
                            law = '2'
                          }
                    
                          this.targetService.TargetListgetByKeyword(param).subscribe(list=>{
                            // console.log(list); 
                            // console.log(this.year);
                            // console.log(this.office_id_table);
                            // console.log(this.lawsult_type);
                            // console.log(this.product_group);
                    
                            if(this.office_table.length == 10){
                    
                              for (var i = 0; i<list.length;i++){
                                if( list[i].OFFICE_NAME == this.office_id_table[0].name){
                    
                                    if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                      list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                      list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                        ss1 = 1;
                                          // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                                          var params = {
                                            ITEM_ID: list[i].ITEM_ID,
                                            TARGET_ID: list[i].TARGET_ID
                                          }
                                          this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                            // console.log(lists)
                                            for (var i=0; i<lists.length;i++){
                                              this.tempDatas1[i].QTY = lists[i].QTY_CASE;
                                              this.tempDatas1[i].FINE = lists[i].FINE;
                                              this.tempDatas1[i].TRE = lists[i].TREASURY_MONEY;
                                              this.tempDatas1[i].BRI = lists[i].BRIBE;
                                              this.tempDatas1[i].AWA = lists[i].REWARD;
                                              this.tempDatas1[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                              this.tempDatas1[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                              var qty_persent = [];
                                              var fine_persent = [];
                    
                                              this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                      this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                      this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                              this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                      this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                      this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                              this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                      this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                      this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                              this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                      this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                      this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                              this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                      this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                      this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                              qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                      this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                      this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                              fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                      this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                      this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                              this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                              this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                                            }
                    
                                          })
                    
                                      }else{
                                        for (var s = 0; s<12;s++){
                                          this.tempDatas1[s].QTY = 0;
                                          this.tempDatas1[s].FINE = 0;
                                          this.tempDatas1[s].TRE = 0;
                                          this.tempDatas1[s].BRI = 0;
                                          this.tempDatas1[s].AWA = 0;
                                          this.tempDatas1[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas1[s].FINE_PERCENT = 0;
                                          this.tempDatas[s].QTY = 0;
                                          this.tempDatas[s].FINE = 0;
                                          this.tempDatas[s].TRE = 0;
                                          this.tempDatas[s].BRI = 0;
                                          this.tempDatas[s].AWA = 0;
                                          this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas[s].FINE_PERCENT = 0;
                                          }
                                        // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                      }
                                }
                                if( list[i].OFFICE_NAME == this.office_id_table[1].name){
                    
                                  if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                    list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                    list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                      ss2 = 1;
                                      // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                      var params = {
                                        ITEM_ID: list[i].ITEM_ID,
                                        TARGET_ID: list[i].TARGET_ID
                                      }
                                      this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                        // console.log(lists)
                                        for (var i=0; i<lists.length;i++){
                                          this.tempDatas2[i].QTY = lists[i].QTY_CASE;
                                          this.tempDatas2[i].FINE = lists[i].FINE;
                                          this.tempDatas2[i].TRE = lists[i].TREASURY_MONEY;
                                          this.tempDatas2[i].BRI = lists[i].BRIBE;
                                          this.tempDatas2[i].AWA = lists[i].REWARD;
                                          this.tempDatas2[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                          this.tempDatas2[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                          var qty_persent = [];
                                          var fine_persent = [];
                    
                                          this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                  this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                  this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                          this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                  this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                  this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                          this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                  this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                  this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                          this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                  this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                  this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                          this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                  this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                  this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                          qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                  this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                  this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                          fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                  this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                  this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                          this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                          this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                      
                                        }
                      
                                      })
                                    }else{
                                        for (var s = 0; s<12;s++){
                                          this.tempDatas2[s].QTY = 0;
                                          this.tempDatas2[s].FINE = 0;
                                          this.tempDatas2[s].TRE = 0;
                                          this.tempDatas2[s].BRI = 0;
                                          this.tempDatas2[s].AWA = 0;
                                          this.tempDatas2[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas2[s].FINE_PERCENT = 0;
                                          this.tempDatas[s].QTY = 0;
                                          this.tempDatas[s].FINE = 0;
                                          this.tempDatas[s].TRE = 0;
                                          this.tempDatas[s].BRI = 0;
                                          this.tempDatas[s].AWA = 0;
                                          this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas[s].FINE_PERCENT = 0;
                                          }
                                        // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                      }
                                }
                                if( list[i].OFFICE_NAME == this.office_id_table[2].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss3 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas3[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas3[i].FINE = lists[i].FINE;
                                                    this.tempDatas3[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas3[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas3[i].AWA = lists[i].REWARD;
                                                    this.tempDatas3[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas3[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas3[s].QTY = 0;
                                            this.tempDatas3[s].FINE = 0;
                                            this.tempDatas3[s].TRE = 0;
                                            this.tempDatas3[s].BRI = 0;
                                            this.tempDatas3[s].AWA = 0;
                                            this.tempDatas3[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas3[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                    
                                if( list[i].OFFICE_NAME == this.office_id_table[3].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss4 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas4[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas4[i].FINE = lists[i].FINE;
                                                    this.tempDatas4[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas4[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas4[i].AWA = lists[i].REWARD;
                                                    this.tempDatas4[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas4[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas4[s].QTY = 0;
                                            this.tempDatas4[s].FINE = 0;
                                            this.tempDatas4[s].TRE = 0;
                                            this.tempDatas4[s].BRI = 0;
                                            this.tempDatas4[s].AWA = 0;
                                            this.tempDatas4[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas4[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                    
                                if( list[i].OFFICE_NAME == this.office_id_table[4].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss5 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas5[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas5[i].FINE = lists[i].FINE;
                                                    this.tempDatas5[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas5[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas5[i].AWA = lists[i].REWARD;
                                                    this.tempDatas5[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas5[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas5[s].QTY = 0;
                                            this.tempDatas5[s].FINE = 0;
                                            this.tempDatas5[s].TRE = 0;
                                            this.tempDatas5[s].BRI = 0;
                                            this.tempDatas5[s].AWA = 0;
                                            this.tempDatas5[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas5[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                    
                                if( list[i].OFFICE_NAME == this.office_id_table[5].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss6 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas6[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas6[i].FINE = lists[i].FINE;
                                                    this.tempDatas6[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas6[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas6[i].AWA = lists[i].REWARD;
                                                    this.tempDatas6[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas6[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas6[s].QTY = 0;
                                            this.tempDatas6[s].FINE = 0;
                                            this.tempDatas6[s].TRE = 0;
                                            this.tempDatas6[s].BRI = 0;
                                            this.tempDatas6[s].AWA = 0;
                                            this.tempDatas6[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas6[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                    
                                if( list[i].OFFICE_NAME == this.office_id_table[6].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss7 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas7[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas7[i].FINE = lists[i].FINE;
                                                    this.tempDatas7[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas7[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas7[i].AWA = lists[i].REWARD;
                                                    this.tempDatas7[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas7[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas7[s].QTY = 0;
                                            this.tempDatas7[s].FINE = 0;
                                            this.tempDatas7[s].TRE = 0;
                                            this.tempDatas7[s].BRI = 0;
                                            this.tempDatas7[s].AWA = 0;
                                            this.tempDatas7[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas7[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                    
                                if( list[i].OFFICE_NAME == this.office_id_table[7].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss8 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas8[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas8[i].FINE = lists[i].FINE;
                                                    this.tempDatas8[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas8[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas8[i].AWA = lists[i].REWARD;
                                                    this.tempDatas8[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas8[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas8[s].QTY = 0;
                                            this.tempDatas8[s].FINE = 0;
                                            this.tempDatas8[s].TRE = 0;
                                            this.tempDatas8[s].BRI = 0;
                                            this.tempDatas8[s].AWA = 0;
                                            this.tempDatas8[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas8[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                    
                                if( list[i].OFFICE_NAME == this.office_id_table[8].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss9 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas9[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas9[i].FINE = lists[i].FINE;
                                                    this.tempDatas9[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas9[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas9[i].AWA = lists[i].REWARD;
                                                    this.tempDatas9[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas9[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas9[s].QTY = 0;
                                            this.tempDatas9[s].FINE = 0;
                                            this.tempDatas9[s].TRE = 0;
                                            this.tempDatas9[s].BRI = 0;
                                            this.tempDatas9[s].AWA = 0;
                                            this.tempDatas9[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas9[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                    
                                if( list[i].OFFICE_NAME == this.office_id_table[9].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss10 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas10[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas10[i].FINE = lists[i].FINE;
                                                    this.tempDatas10[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas10[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas10[i].AWA = lists[i].REWARD;
                                                    this.tempDatas10[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas10[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas10[s].QTY = 0;
                                            this.tempDatas10[s].FINE = 0;
                                            this.tempDatas10[s].TRE = 0;
                                            this.tempDatas10[s].BRI = 0;
                                            this.tempDatas10[s].AWA = 0;
                                            this.tempDatas10[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas10[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                              }
                    
                              if (ss1 == 1 && ss2 == 1 && ss3 == 1 && ss4 == 1 && ss5 == 1 && ss6 == 1 && ss7 == 1 && ss8 == 1 && ss9 == 1 && ss10 == 1 ){
                                // console.log(ss1,ss2,ss3)
                                this.targetTotal = true;
                              }else{
                                // console.log("no")
                                this.targetTotal = false;
                              }
                    
                            }else if(this.office_table.length == 9){
                    
                              for (var i = 0; i<list.length;i++){
                                if( list[i].OFFICE_NAME == this.office_id_table[0].name){
                    
                                    if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                      list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                      list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                        ss1 = 1;
                                          // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                                          var params = {
                                            ITEM_ID: list[i].ITEM_ID,
                                            TARGET_ID: list[i].TARGET_ID
                                          }
                                          this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                            // console.log(lists)
                                            for (var i=0; i<lists.length;i++){
                                              this.tempDatas1[i].QTY = lists[i].QTY_CASE;
                                              this.tempDatas1[i].FINE = lists[i].FINE;
                                              this.tempDatas1[i].TRE = lists[i].TREASURY_MONEY;
                                              this.tempDatas1[i].BRI = lists[i].BRIBE;
                                              this.tempDatas1[i].AWA = lists[i].REWARD;
                                              this.tempDatas1[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                              this.tempDatas1[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                              var qty_persent = [];
                                              var fine_persent = [];
                    
                                              this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                      this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                      this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                              this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                      this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                      this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                              this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                      this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                      this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                              this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                      this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                      this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                              this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                      this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                      this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                              qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                      this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                      this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                              fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                      this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                      this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                              this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                              this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                                            }
                    
                                          })
                    
                                      }else{
                                        for (var s = 0; s<12;s++){
                                          this.tempDatas1[s].QTY = 0;
                                          this.tempDatas1[s].FINE = 0;
                                          this.tempDatas1[s].TRE = 0;
                                          this.tempDatas1[s].BRI = 0;
                                          this.tempDatas1[s].AWA = 0;
                                          this.tempDatas1[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas1[s].FINE_PERCENT = 0;
                                          this.tempDatas[s].QTY = 0;
                                          this.tempDatas[s].FINE = 0;
                                          this.tempDatas[s].TRE = 0;
                                          this.tempDatas[s].BRI = 0;
                                          this.tempDatas[s].AWA = 0;
                                          this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas[s].FINE_PERCENT = 0;
                                          }
                                        // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                      }
                                }
                                if( list[i].OFFICE_NAME == this.office_id_table[1].name){
                    
                                  if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                    list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                    list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                      ss2 = 1;
                                      // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                      var params = {
                                        ITEM_ID: list[i].ITEM_ID,
                                        TARGET_ID: list[i].TARGET_ID
                                      }
                                      this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                        // console.log(lists)
                                        for (var i=0; i<lists.length;i++){
                                          this.tempDatas2[i].QTY = lists[i].QTY_CASE;
                                          this.tempDatas2[i].FINE = lists[i].FINE;
                                          this.tempDatas2[i].TRE = lists[i].TREASURY_MONEY;
                                          this.tempDatas2[i].BRI = lists[i].BRIBE;
                                          this.tempDatas2[i].AWA = lists[i].REWARD;
                                          this.tempDatas2[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                          this.tempDatas2[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                          var qty_persent = [];
                                          var fine_persent = [];
                    
                                          this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                  this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                  this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                          this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                  this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                  this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                          this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                  this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                  this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                          this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                  this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                  this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                          this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                  this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                  this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                          qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                  this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                  this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                          fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                  this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                  this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                          this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                          this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                      
                                        }
                      
                                      })
                                    }else{
                                        for (var s = 0; s<12;s++){
                                          this.tempDatas2[s].QTY = 0;
                                          this.tempDatas2[s].FINE = 0;
                                          this.tempDatas2[s].TRE = 0;
                                          this.tempDatas2[s].BRI = 0;
                                          this.tempDatas2[s].AWA = 0;
                                          this.tempDatas2[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas2[s].FINE_PERCENT = 0;
                                          this.tempDatas[s].QTY = 0;
                                          this.tempDatas[s].FINE = 0;
                                          this.tempDatas[s].TRE = 0;
                                          this.tempDatas[s].BRI = 0;
                                          this.tempDatas[s].AWA = 0;
                                          this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas[s].FINE_PERCENT = 0;
                                          }
                                        // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                      }
                                }
                                if( list[i].OFFICE_NAME == this.office_id_table[2].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss3 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas3[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas3[i].FINE = lists[i].FINE;
                                                    this.tempDatas3[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas3[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas3[i].AWA = lists[i].REWARD;
                                                    this.tempDatas3[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas3[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas3[s].QTY = 0;
                                            this.tempDatas3[s].FINE = 0;
                                            this.tempDatas3[s].TRE = 0;
                                            this.tempDatas3[s].BRI = 0;
                                            this.tempDatas3[s].AWA = 0;
                                            this.tempDatas3[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas3[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                    
                                if( list[i].OFFICE_NAME == this.office_id_table[3].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss4 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas4[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas4[i].FINE = lists[i].FINE;
                                                    this.tempDatas4[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas4[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas4[i].AWA = lists[i].REWARD;
                                                    this.tempDatas4[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas4[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas4[s].QTY = 0;
                                            this.tempDatas4[s].FINE = 0;
                                            this.tempDatas4[s].TRE = 0;
                                            this.tempDatas4[s].BRI = 0;
                                            this.tempDatas4[s].AWA = 0;
                                            this.tempDatas4[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas4[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                    
                                if( list[i].OFFICE_NAME == this.office_id_table[4].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss5 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas5[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas5[i].FINE = lists[i].FINE;
                                                    this.tempDatas5[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas5[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas5[i].AWA = lists[i].REWARD;
                                                    this.tempDatas5[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas5[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas5[s].QTY = 0;
                                            this.tempDatas5[s].FINE = 0;
                                            this.tempDatas5[s].TRE = 0;
                                            this.tempDatas5[s].BRI = 0;
                                            this.tempDatas5[s].AWA = 0;
                                            this.tempDatas5[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas5[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                    
                                if( list[i].OFFICE_NAME == this.office_id_table[5].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss6 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas6[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas6[i].FINE = lists[i].FINE;
                                                    this.tempDatas6[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas6[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas6[i].AWA = lists[i].REWARD;
                                                    this.tempDatas6[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas6[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas6[s].QTY = 0;
                                            this.tempDatas6[s].FINE = 0;
                                            this.tempDatas6[s].TRE = 0;
                                            this.tempDatas6[s].BRI = 0;
                                            this.tempDatas6[s].AWA = 0;
                                            this.tempDatas6[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas6[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                    
                                if( list[i].OFFICE_NAME == this.office_id_table[6].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss7 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas7[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas7[i].FINE = lists[i].FINE;
                                                    this.tempDatas7[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas7[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas7[i].AWA = lists[i].REWARD;
                                                    this.tempDatas7[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas7[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas7[s].QTY = 0;
                                            this.tempDatas7[s].FINE = 0;
                                            this.tempDatas7[s].TRE = 0;
                                            this.tempDatas7[s].BRI = 0;
                                            this.tempDatas7[s].AWA = 0;
                                            this.tempDatas7[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas7[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                    
                                if( list[i].OFFICE_NAME == this.office_id_table[7].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss8 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas8[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas8[i].FINE = lists[i].FINE;
                                                    this.tempDatas8[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas8[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas8[i].AWA = lists[i].REWARD;
                                                    this.tempDatas8[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas8[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas8[s].QTY = 0;
                                            this.tempDatas8[s].FINE = 0;
                                            this.tempDatas8[s].TRE = 0;
                                            this.tempDatas8[s].BRI = 0;
                                            this.tempDatas8[s].AWA = 0;
                                            this.tempDatas8[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas8[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                    
                                if( list[i].OFFICE_NAME == this.office_id_table[8].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss9 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas9[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas9[i].FINE = lists[i].FINE;
                                                    this.tempDatas9[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas9[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas9[i].AWA = lists[i].REWARD;
                                                    this.tempDatas9[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas9[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas9[s].QTY = 0;
                                            this.tempDatas9[s].FINE = 0;
                                            this.tempDatas9[s].TRE = 0;
                                            this.tempDatas9[s].BRI = 0;
                                            this.tempDatas9[s].AWA = 0;
                                            this.tempDatas9[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas9[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                              }
                    
                              if (ss1 == 1 && ss2 == 1 && ss3 == 1 && ss4 == 1 && ss5 == 1 && ss6 == 1 && ss7 == 1 && ss8 == 1 && ss9 == 1 ){
                                // console.log(ss1,ss2,ss3)
                                this.targetTotal = true;
                              }else{
                                // console.log("no")
                                this.targetTotal = false;
                              }
                    
                            }else if(this.office_table.length == 8){
                    
                              for (var i = 0; i<list.length;i++){
                                if( list[i].OFFICE_NAME == this.office_id_table[0].name){
                    
                                    if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                      list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                      list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                        ss1 = 1;
                                          // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                                          var params = {
                                            ITEM_ID: list[i].ITEM_ID,
                                            TARGET_ID: list[i].TARGET_ID
                                          }
                                          this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                            // console.log(lists)
                                            for (var i=0; i<lists.length;i++){
                                              this.tempDatas1[i].QTY = lists[i].QTY_CASE;
                                              this.tempDatas1[i].FINE = lists[i].FINE;
                                              this.tempDatas1[i].TRE = lists[i].TREASURY_MONEY;
                                              this.tempDatas1[i].BRI = lists[i].BRIBE;
                                              this.tempDatas1[i].AWA = lists[i].REWARD;
                                              this.tempDatas1[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                              this.tempDatas1[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                              var qty_persent = [];
                                              var fine_persent = [];
                    
                                              this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                      this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                      this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                              this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                      this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                      this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                              this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                      this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                      this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                              this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                      this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                      this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                              this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                      this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                      this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                              qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                      this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                      this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                              fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                      this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                      this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                              this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                              this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                                            }
                    
                                          })
                    
                                      }else{
                                        for (var s = 0; s<12;s++){
                                          this.tempDatas1[s].QTY = 0;
                                          this.tempDatas1[s].FINE = 0;
                                          this.tempDatas1[s].TRE = 0;
                                          this.tempDatas1[s].BRI = 0;
                                          this.tempDatas1[s].AWA = 0;
                                          this.tempDatas1[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas1[s].FINE_PERCENT = 0;
                                          this.tempDatas[s].QTY = 0;
                                          this.tempDatas[s].FINE = 0;
                                          this.tempDatas[s].TRE = 0;
                                          this.tempDatas[s].BRI = 0;
                                          this.tempDatas[s].AWA = 0;
                                          this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas[s].FINE_PERCENT = 0;
                                          }
                                        // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                      }
                                }
                                if( list[i].OFFICE_NAME == this.office_id_table[1].name){
                    
                                  if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                    list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                    list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                      ss2 = 1;
                                      // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                      var params = {
                                        ITEM_ID: list[i].ITEM_ID,
                                        TARGET_ID: list[i].TARGET_ID
                                      }
                                      this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                        // console.log(lists)
                                        for (var i=0; i<lists.length;i++){
                                          this.tempDatas2[i].QTY = lists[i].QTY_CASE;
                                          this.tempDatas2[i].FINE = lists[i].FINE;
                                          this.tempDatas2[i].TRE = lists[i].TREASURY_MONEY;
                                          this.tempDatas2[i].BRI = lists[i].BRIBE;
                                          this.tempDatas2[i].AWA = lists[i].REWARD;
                                          this.tempDatas2[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                          this.tempDatas2[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                          var qty_persent = [];
                                          var fine_persent = [];
                    
                                          this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                  this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                  this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                          this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                  this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                  this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                          this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                  this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                  this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                          this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                  this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                  this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                          this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                  this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                  this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                          qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                  this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                  this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                          fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                  this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                  this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                          this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                          this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                      
                                        }
                      
                                      })
                                    }else{
                                        for (var s = 0; s<12;s++){
                                          this.tempDatas2[s].QTY = 0;
                                          this.tempDatas2[s].FINE = 0;
                                          this.tempDatas2[s].TRE = 0;
                                          this.tempDatas2[s].BRI = 0;
                                          this.tempDatas2[s].AWA = 0;
                                          this.tempDatas2[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas2[s].FINE_PERCENT = 0;
                                          this.tempDatas[s].QTY = 0;
                                          this.tempDatas[s].FINE = 0;
                                          this.tempDatas[s].TRE = 0;
                                          this.tempDatas[s].BRI = 0;
                                          this.tempDatas[s].AWA = 0;
                                          this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas[s].FINE_PERCENT = 0;
                                          }
                                        // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                      }
                                }
                                if( list[i].OFFICE_NAME == this.office_id_table[2].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss3 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas3[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas3[i].FINE = lists[i].FINE;
                                                    this.tempDatas3[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas3[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas3[i].AWA = lists[i].REWARD;
                                                    this.tempDatas3[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas3[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas3[s].QTY = 0;
                                            this.tempDatas3[s].FINE = 0;
                                            this.tempDatas3[s].TRE = 0;
                                            this.tempDatas3[s].BRI = 0;
                                            this.tempDatas3[s].AWA = 0;
                                            this.tempDatas3[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas3[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                    
                                if( list[i].OFFICE_NAME == this.office_id_table[3].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss4 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas4[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas4[i].FINE = lists[i].FINE;
                                                    this.tempDatas4[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas4[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas4[i].AWA = lists[i].REWARD;
                                                    this.tempDatas4[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas4[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas4[s].QTY = 0;
                                            this.tempDatas4[s].FINE = 0;
                                            this.tempDatas4[s].TRE = 0;
                                            this.tempDatas4[s].BRI = 0;
                                            this.tempDatas4[s].AWA = 0;
                                            this.tempDatas4[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas4[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                    
                                if( list[i].OFFICE_NAME == this.office_id_table[4].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss5 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas5[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas5[i].FINE = lists[i].FINE;
                                                    this.tempDatas5[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas5[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas5[i].AWA = lists[i].REWARD;
                                                    this.tempDatas5[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas5[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas5[s].QTY = 0;
                                            this.tempDatas5[s].FINE = 0;
                                            this.tempDatas5[s].TRE = 0;
                                            this.tempDatas5[s].BRI = 0;
                                            this.tempDatas5[s].AWA = 0;
                                            this.tempDatas5[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas5[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                    
                                if( list[i].OFFICE_NAME == this.office_id_table[5].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss6 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas6[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas6[i].FINE = lists[i].FINE;
                                                    this.tempDatas6[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas6[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas6[i].AWA = lists[i].REWARD;
                                                    this.tempDatas6[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas6[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas6[s].QTY = 0;
                                            this.tempDatas6[s].FINE = 0;
                                            this.tempDatas6[s].TRE = 0;
                                            this.tempDatas6[s].BRI = 0;
                                            this.tempDatas6[s].AWA = 0;
                                            this.tempDatas6[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas6[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                    
                                if( list[i].OFFICE_NAME == this.office_id_table[6].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss7 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas7[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas7[i].FINE = lists[i].FINE;
                                                    this.tempDatas7[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas7[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas7[i].AWA = lists[i].REWARD;
                                                    this.tempDatas7[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas7[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas7[s].QTY = 0;
                                            this.tempDatas7[s].FINE = 0;
                                            this.tempDatas7[s].TRE = 0;
                                            this.tempDatas7[s].BRI = 0;
                                            this.tempDatas7[s].AWA = 0;
                                            this.tempDatas7[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas7[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                    
                                if( list[i].OFFICE_NAME == this.office_id_table[7].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss8 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas8[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas8[i].FINE = lists[i].FINE;
                                                    this.tempDatas8[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas8[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas8[i].AWA = lists[i].REWARD;
                                                    this.tempDatas8[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas8[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas8[s].QTY = 0;
                                            this.tempDatas8[s].FINE = 0;
                                            this.tempDatas8[s].TRE = 0;
                                            this.tempDatas8[s].BRI = 0;
                                            this.tempDatas8[s].AWA = 0;
                                            this.tempDatas8[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas8[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                              }
                    
                              if (ss1 == 1 && ss2 == 1 && ss3 == 1 && ss4 == 1 && ss5 == 1 && ss6 == 1 && ss7 == 1 && ss8 == 1){
                                // console.log(ss1,ss2,ss3)
                                this.targetTotal = true;
                              }else{
                                // console.log("no")
                                this.targetTotal = false;
                              }
                    
                            }else if(this.office_table.length == 7){
                    
                              for (var i = 0; i<list.length;i++){
                                if( list[i].OFFICE_NAME == this.office_id_table[0].name){
                    
                                    if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                      list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                      list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                        ss1 = 1;
                                          // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                                          var params = {
                                            ITEM_ID: list[i].ITEM_ID,
                                            TARGET_ID: list[i].TARGET_ID
                                          }
                                          this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                            // console.log(lists)
                                            for (var i=0; i<lists.length;i++){
                                              this.tempDatas1[i].QTY = lists[i].QTY_CASE;
                                              this.tempDatas1[i].FINE = lists[i].FINE;
                                              this.tempDatas1[i].TRE = lists[i].TREASURY_MONEY;
                                              this.tempDatas1[i].BRI = lists[i].BRIBE;
                                              this.tempDatas1[i].AWA = lists[i].REWARD;
                                              this.tempDatas1[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                              this.tempDatas1[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                              var qty_persent = [];
                                              var fine_persent = [];
                    
                                              this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                      this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                      this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                              this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                      this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                      this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                              this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                      this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                      this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                              this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                      this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                      this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                              this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                      this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                      this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                              qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                      this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                      this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                              fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                      this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                      this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                              this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                              this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                                            }
                    
                                          })
                    
                                      }else{
                                        for (var s = 0; s<12;s++){
                                          this.tempDatas1[s].QTY = 0;
                                          this.tempDatas1[s].FINE = 0;
                                          this.tempDatas1[s].TRE = 0;
                                          this.tempDatas1[s].BRI = 0;
                                          this.tempDatas1[s].AWA = 0;
                                          this.tempDatas1[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas1[s].FINE_PERCENT = 0;
                                          this.tempDatas[s].QTY = 0;
                                          this.tempDatas[s].FINE = 0;
                                          this.tempDatas[s].TRE = 0;
                                          this.tempDatas[s].BRI = 0;
                                          this.tempDatas[s].AWA = 0;
                                          this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas[s].FINE_PERCENT = 0;
                                          }
                                        // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                      }
                                }
                                if( list[i].OFFICE_NAME == this.office_id_table[1].name){
                    
                                  if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                    list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                    list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                      ss2 = 1;
                                      // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                      var params = {
                                        ITEM_ID: list[i].ITEM_ID,
                                        TARGET_ID: list[i].TARGET_ID
                                      }
                                      this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                        // console.log(lists)
                                        for (var i=0; i<lists.length;i++){
                                          this.tempDatas2[i].QTY = lists[i].QTY_CASE;
                                          this.tempDatas2[i].FINE = lists[i].FINE;
                                          this.tempDatas2[i].TRE = lists[i].TREASURY_MONEY;
                                          this.tempDatas2[i].BRI = lists[i].BRIBE;
                                          this.tempDatas2[i].AWA = lists[i].REWARD;
                                          this.tempDatas2[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                          this.tempDatas2[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                          var qty_persent = [];
                                          var fine_persent = [];
                    
                                          this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                  this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                  this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                          this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                  this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                  this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                          this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                  this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                  this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                          this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                  this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                  this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                          this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                  this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                  this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                          qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                  this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                  this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                          fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                  this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                  this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                          this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                          this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                      
                                        }
                      
                                      })
                                    }else{
                                        for (var s = 0; s<12;s++){
                                          this.tempDatas2[s].QTY = 0;
                                          this.tempDatas2[s].FINE = 0;
                                          this.tempDatas2[s].TRE = 0;
                                          this.tempDatas2[s].BRI = 0;
                                          this.tempDatas2[s].AWA = 0;
                                          this.tempDatas2[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas2[s].FINE_PERCENT = 0;
                                          this.tempDatas[s].QTY = 0;
                                          this.tempDatas[s].FINE = 0;
                                          this.tempDatas[s].TRE = 0;
                                          this.tempDatas[s].BRI = 0;
                                          this.tempDatas[s].AWA = 0;
                                          this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas[s].FINE_PERCENT = 0;
                                          }
                                        // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                      }
                                }
                                if( list[i].OFFICE_NAME == this.office_id_table[2].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss3 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas3[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas3[i].FINE = lists[i].FINE;
                                                    this.tempDatas3[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas3[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas3[i].AWA = lists[i].REWARD;
                                                    this.tempDatas3[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas3[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas3[s].QTY = 0;
                                            this.tempDatas3[s].FINE = 0;
                                            this.tempDatas3[s].TRE = 0;
                                            this.tempDatas3[s].BRI = 0;
                                            this.tempDatas3[s].AWA = 0;
                                            this.tempDatas3[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas3[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                    
                                if( list[i].OFFICE_NAME == this.office_id_table[3].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss4 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas4[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas4[i].FINE = lists[i].FINE;
                                                    this.tempDatas4[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas4[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas4[i].AWA = lists[i].REWARD;
                                                    this.tempDatas4[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas4[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas4[s].QTY = 0;
                                            this.tempDatas4[s].FINE = 0;
                                            this.tempDatas4[s].TRE = 0;
                                            this.tempDatas4[s].BRI = 0;
                                            this.tempDatas4[s].AWA = 0;
                                            this.tempDatas4[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas4[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                    
                                if( list[i].OFFICE_NAME == this.office_id_table[4].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss5 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas5[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas5[i].FINE = lists[i].FINE;
                                                    this.tempDatas5[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas5[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas5[i].AWA = lists[i].REWARD;
                                                    this.tempDatas5[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas5[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas5[s].QTY = 0;
                                            this.tempDatas5[s].FINE = 0;
                                            this.tempDatas5[s].TRE = 0;
                                            this.tempDatas5[s].BRI = 0;
                                            this.tempDatas5[s].AWA = 0;
                                            this.tempDatas5[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas5[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                    
                                if( list[i].OFFICE_NAME == this.office_id_table[5].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss6 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas6[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas6[i].FINE = lists[i].FINE;
                                                    this.tempDatas6[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas6[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas6[i].AWA = lists[i].REWARD;
                                                    this.tempDatas6[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas6[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas6[s].QTY = 0;
                                            this.tempDatas6[s].FINE = 0;
                                            this.tempDatas6[s].TRE = 0;
                                            this.tempDatas6[s].BRI = 0;
                                            this.tempDatas6[s].AWA = 0;
                                            this.tempDatas6[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas6[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                    
                                if( list[i].OFFICE_NAME == this.office_id_table[6].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss7 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas7[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas7[i].FINE = lists[i].FINE;
                                                    this.tempDatas7[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas7[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas7[i].AWA = lists[i].REWARD;
                                                    this.tempDatas7[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas7[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas7[s].QTY = 0;
                                            this.tempDatas7[s].FINE = 0;
                                            this.tempDatas7[s].TRE = 0;
                                            this.tempDatas7[s].BRI = 0;
                                            this.tempDatas7[s].AWA = 0;
                                            this.tempDatas7[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas7[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                              }
                    
                              if (ss1 == 1 && ss2 == 1 && ss3 == 1 && ss4 == 1 && ss5 == 1 && ss6 == 1 && ss7 == 1){
                                // console.log(ss1,ss2,ss3)
                                this.targetTotal = true;
                              }else{
                                // console.log("no")
                                this.targetTotal = false;
                              }
                    
                            }else if(this.office_table.length == 6){
                    
                              for (var i = 0; i<list.length;i++){
                                if( list[i].OFFICE_NAME == this.office_id_table[0].name){
                    
                                    if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                      list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                      list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                        ss1 = 1;
                                          // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                                          var params = {
                                            ITEM_ID: list[i].ITEM_ID,
                                            TARGET_ID: list[i].TARGET_ID
                                          }
                                          this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                            // console.log(lists)
                                            for (var i=0; i<lists.length;i++){
                                              this.tempDatas1[i].QTY = lists[i].QTY_CASE;
                                              this.tempDatas1[i].FINE = lists[i].FINE;
                                              this.tempDatas1[i].TRE = lists[i].TREASURY_MONEY;
                                              this.tempDatas1[i].BRI = lists[i].BRIBE;
                                              this.tempDatas1[i].AWA = lists[i].REWARD;
                                              this.tempDatas1[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                              this.tempDatas1[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                              var qty_persent = [];
                                              var fine_persent = [];
                    
                                              this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                      this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                      this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                              this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                      this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                      this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                              this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                      this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                      this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                              this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                      this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                      this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                              this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                      this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                      this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                              qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                      this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                      this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                              fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                      this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                      this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                              this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                              this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                                            }
                    
                                          })
                    
                                      }else{
                                        for (var s = 0; s<12;s++){
                                          this.tempDatas1[s].QTY = 0;
                                          this.tempDatas1[s].FINE = 0;
                                          this.tempDatas1[s].TRE = 0;
                                          this.tempDatas1[s].BRI = 0;
                                          this.tempDatas1[s].AWA = 0;
                                          this.tempDatas1[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas1[s].FINE_PERCENT = 0;
                                          this.tempDatas[s].QTY = 0;
                                          this.tempDatas[s].FINE = 0;
                                          this.tempDatas[s].TRE = 0;
                                          this.tempDatas[s].BRI = 0;
                                          this.tempDatas[s].AWA = 0;
                                          this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas[s].FINE_PERCENT = 0;
                                          }
                                        // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                      }
                                }
                                if( list[i].OFFICE_NAME == this.office_id_table[1].name){
                    
                                  if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                    list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                    list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                      ss2 = 1;
                                      // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                      var params = {
                                        ITEM_ID: list[i].ITEM_ID,
                                        TARGET_ID: list[i].TARGET_ID
                                      }
                                      this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                        // console.log(lists)
                                        for (var i=0; i<lists.length;i++){
                                          this.tempDatas2[i].QTY = lists[i].QTY_CASE;
                                          this.tempDatas2[i].FINE = lists[i].FINE;
                                          this.tempDatas2[i].TRE = lists[i].TREASURY_MONEY;
                                          this.tempDatas2[i].BRI = lists[i].BRIBE;
                                          this.tempDatas2[i].AWA = lists[i].REWARD;
                                          this.tempDatas2[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                          this.tempDatas2[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                          var qty_persent = [];
                                          var fine_persent = [];
                    
                                          this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                  this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                  this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                          this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                  this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                  this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                          this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                  this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                  this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                          this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                  this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                  this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                          this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                  this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                  this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                          qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                  this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                  this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                          fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                  this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                  this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                          this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                          this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                      
                                        }
                      
                                      })
                                    }else{
                                        for (var s = 0; s<12;s++){
                                          this.tempDatas2[s].QTY = 0;
                                          this.tempDatas2[s].FINE = 0;
                                          this.tempDatas2[s].TRE = 0;
                                          this.tempDatas2[s].BRI = 0;
                                          this.tempDatas2[s].AWA = 0;
                                          this.tempDatas2[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas2[s].FINE_PERCENT = 0;
                                          this.tempDatas[s].QTY = 0;
                                          this.tempDatas[s].FINE = 0;
                                          this.tempDatas[s].TRE = 0;
                                          this.tempDatas[s].BRI = 0;
                                          this.tempDatas[s].AWA = 0;
                                          this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas[s].FINE_PERCENT = 0;
                                          }
                                        // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                      }
                                }
                                if( list[i].OFFICE_NAME == this.office_id_table[2].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss3 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas3[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas3[i].FINE = lists[i].FINE;
                                                    this.tempDatas3[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas3[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas3[i].AWA = lists[i].REWARD;
                                                    this.tempDatas3[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas3[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas3[s].QTY = 0;
                                            this.tempDatas3[s].FINE = 0;
                                            this.tempDatas3[s].TRE = 0;
                                            this.tempDatas3[s].BRI = 0;
                                            this.tempDatas3[s].AWA = 0;
                                            this.tempDatas3[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas3[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                    
                                if( list[i].OFFICE_NAME == this.office_id_table[3].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss4 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas4[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas4[i].FINE = lists[i].FINE;
                                                    this.tempDatas4[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas4[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas4[i].AWA = lists[i].REWARD;
                                                    this.tempDatas4[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas4[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas4[s].QTY = 0;
                                            this.tempDatas4[s].FINE = 0;
                                            this.tempDatas4[s].TRE = 0;
                                            this.tempDatas4[s].BRI = 0;
                                            this.tempDatas4[s].AWA = 0;
                                            this.tempDatas4[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas4[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                    
                                if( list[i].OFFICE_NAME == this.office_id_table[4].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss5 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas5[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas5[i].FINE = lists[i].FINE;
                                                    this.tempDatas5[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas5[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas5[i].AWA = lists[i].REWARD;
                                                    this.tempDatas5[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas5[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas5[s].QTY = 0;
                                            this.tempDatas5[s].FINE = 0;
                                            this.tempDatas5[s].TRE = 0;
                                            this.tempDatas5[s].BRI = 0;
                                            this.tempDatas5[s].AWA = 0;
                                            this.tempDatas5[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas5[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                    
                                if( list[i].OFFICE_NAME == this.office_id_table[5].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss6 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas6[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas6[i].FINE = lists[i].FINE;
                                                    this.tempDatas6[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas6[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas6[i].AWA = lists[i].REWARD;
                                                    this.tempDatas6[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas6[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas6[s].QTY = 0;
                                            this.tempDatas6[s].FINE = 0;
                                            this.tempDatas6[s].TRE = 0;
                                            this.tempDatas6[s].BRI = 0;
                                            this.tempDatas6[s].AWA = 0;
                                            this.tempDatas6[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas6[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                              }
                    
                              if (ss1 == 1 && ss2 == 1 && ss3 == 1 && ss4 == 1 && ss5 == 1 && ss6 == 1){
                                // console.log(ss1,ss2,ss3)
                                this.targetTotal = true;
                              }else{
                                // console.log("no")
                                this.targetTotal = false;
                              }
                    
                            }else if(this.office_table.length == 5){
                    
                              for (var i = 0; i<list.length;i++){
                                if( list[i].OFFICE_NAME == this.office_id_table[0].name){
                    
                                    if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                      list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                      list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                        ss1 = 1;
                                          // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                                          var params = {
                                            ITEM_ID: list[i].ITEM_ID,
                                            TARGET_ID: list[i].TARGET_ID
                                          }
                                          this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                            // console.log(lists)
                                            for (var i=0; i<lists.length;i++){
                                              this.tempDatas1[i].QTY = lists[i].QTY_CASE;
                                              this.tempDatas1[i].FINE = lists[i].FINE;
                                              this.tempDatas1[i].TRE = lists[i].TREASURY_MONEY;
                                              this.tempDatas1[i].BRI = lists[i].BRIBE;
                                              this.tempDatas1[i].AWA = lists[i].REWARD;
                                              this.tempDatas1[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                              this.tempDatas1[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                              var qty_persent = [];
                                              var fine_persent = [];
                    
                                              this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                      this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                      this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                              this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                      this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                      this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                              this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                      this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                      this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                              this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                      this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                      this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                              this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                      this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                      this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                              qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                      this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                      this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                              fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                      this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                      this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                              this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                              this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                                            }
                    
                                          })
                    
                                      }else{
                                        for (var s = 0; s<12;s++){
                                          this.tempDatas1[s].QTY = 0;
                                          this.tempDatas1[s].FINE = 0;
                                          this.tempDatas1[s].TRE = 0;
                                          this.tempDatas1[s].BRI = 0;
                                          this.tempDatas1[s].AWA = 0;
                                          this.tempDatas1[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas1[s].FINE_PERCENT = 0;
                                          this.tempDatas[s].QTY = 0;
                                          this.tempDatas[s].FINE = 0;
                                          this.tempDatas[s].TRE = 0;
                                          this.tempDatas[s].BRI = 0;
                                          this.tempDatas[s].AWA = 0;
                                          this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas[s].FINE_PERCENT = 0;
                                          }
                                        // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                      }
                                }
                                if( list[i].OFFICE_NAME == this.office_id_table[1].name){
                    
                                  if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                    list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                    list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                      ss2 = 1;
                                      // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                      var params = {
                                        ITEM_ID: list[i].ITEM_ID,
                                        TARGET_ID: list[i].TARGET_ID
                                      }
                                      this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                        // console.log(lists)
                                        for (var i=0; i<lists.length;i++){
                                          this.tempDatas2[i].QTY = lists[i].QTY_CASE;
                                          this.tempDatas2[i].FINE = lists[i].FINE;
                                          this.tempDatas2[i].TRE = lists[i].TREASURY_MONEY;
                                          this.tempDatas2[i].BRI = lists[i].BRIBE;
                                          this.tempDatas2[i].AWA = lists[i].REWARD;
                                          this.tempDatas2[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                          this.tempDatas2[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                          var qty_persent = [];
                                          var fine_persent = [];
                    
                                          this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                  this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                  this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                          this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                  this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                  this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                          this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                  this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                  this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                          this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                  this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                  this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                          this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                  this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                  this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                          qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                  this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                  this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                          fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                  this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                  this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                          this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                          this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                      
                                        }
                      
                                      })
                                    }else{
                                        for (var s = 0; s<12;s++){
                                          this.tempDatas2[s].QTY = 0;
                                          this.tempDatas2[s].FINE = 0;
                                          this.tempDatas2[s].TRE = 0;
                                          this.tempDatas2[s].BRI = 0;
                                          this.tempDatas2[s].AWA = 0;
                                          this.tempDatas2[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas2[s].FINE_PERCENT = 0;
                                          this.tempDatas[s].QTY = 0;
                                          this.tempDatas[s].FINE = 0;
                                          this.tempDatas[s].TRE = 0;
                                          this.tempDatas[s].BRI = 0;
                                          this.tempDatas[s].AWA = 0;
                                          this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas[s].FINE_PERCENT = 0;
                                          }
                                        // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                      }
                                }
                                if( list[i].OFFICE_NAME == this.office_id_table[2].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss3 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas3[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas3[i].FINE = lists[i].FINE;
                                                    this.tempDatas3[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas3[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas3[i].AWA = lists[i].REWARD;
                                                    this.tempDatas3[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas3[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas3[s].QTY = 0;
                                            this.tempDatas3[s].FINE = 0;
                                            this.tempDatas3[s].TRE = 0;
                                            this.tempDatas3[s].BRI = 0;
                                            this.tempDatas3[s].AWA = 0;
                                            this.tempDatas3[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas3[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                    
                                if( list[i].OFFICE_NAME == this.office_id_table[3].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss4 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas4[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas4[i].FINE = lists[i].FINE;
                                                    this.tempDatas4[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas4[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas4[i].AWA = lists[i].REWARD;
                                                    this.tempDatas4[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas4[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas4[s].QTY = 0;
                                            this.tempDatas4[s].FINE = 0;
                                            this.tempDatas4[s].TRE = 0;
                                            this.tempDatas4[s].BRI = 0;
                                            this.tempDatas4[s].AWA = 0;
                                            this.tempDatas4[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas4[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                    
                                if( list[i].OFFICE_NAME == this.office_id_table[4].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss5 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas5[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas5[i].FINE = lists[i].FINE;
                                                    this.tempDatas5[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas5[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas5[i].AWA = lists[i].REWARD;
                                                    this.tempDatas5[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas5[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas5[s].QTY = 0;
                                            this.tempDatas5[s].FINE = 0;
                                            this.tempDatas5[s].TRE = 0;
                                            this.tempDatas5[s].BRI = 0;
                                            this.tempDatas5[s].AWA = 0;
                                            this.tempDatas5[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas5[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                              }
                    
                              if (ss1 == 1 && ss2 == 1 && ss3 == 1 && ss4 == 1 && ss5 == 1){
                                // console.log(ss1,ss2,ss3)
                                this.targetTotal = true;
                              }else{
                                // console.log("no")
                                this.targetTotal = false;
                              }
                    
                            }else if(this.office_table.length == 4){
                    
                              for (var i = 0; i<list.length;i++){
                                if( list[i].OFFICE_NAME == this.office_id_table[0].name){
                    
                                    if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                      list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                      list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                        ss1 = 1;
                                          // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                                          var params = {
                                            ITEM_ID: list[i].ITEM_ID,
                                            TARGET_ID: list[i].TARGET_ID
                                          }
                                          this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                            // console.log(lists)
                                            for (var i=0; i<lists.length;i++){
                                              this.tempDatas1[i].QTY = lists[i].QTY_CASE;
                                              this.tempDatas1[i].FINE = lists[i].FINE;
                                              this.tempDatas1[i].TRE = lists[i].TREASURY_MONEY;
                                              this.tempDatas1[i].BRI = lists[i].BRIBE;
                                              this.tempDatas1[i].AWA = lists[i].REWARD;
                                              this.tempDatas1[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                              this.tempDatas1[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                              var qty_persent = [];
                                              var fine_persent = [];
                    
                                              this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                      this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                      this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                              this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                      this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                      this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                              this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                      this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                      this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                              this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                      this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                      this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                              this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                      this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                      this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                              qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                      this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                      this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                              fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                      this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                      this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                              this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                              this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                                            }
                    
                                          })
                    
                                      }else{
                                        for (var s = 0; s<12;s++){
                                          this.tempDatas1[s].QTY = 0;
                                          this.tempDatas1[s].FINE = 0;
                                          this.tempDatas1[s].TRE = 0;
                                          this.tempDatas1[s].BRI = 0;
                                          this.tempDatas1[s].AWA = 0;
                                          this.tempDatas1[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas1[s].FINE_PERCENT = 0;
                                          this.tempDatas[s].QTY = 0;
                                          this.tempDatas[s].FINE = 0;
                                          this.tempDatas[s].TRE = 0;
                                          this.tempDatas[s].BRI = 0;
                                          this.tempDatas[s].AWA = 0;
                                          this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas[s].FINE_PERCENT = 0;
                                          }
                                        // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                      }
                                }
                                if( list[i].OFFICE_NAME == this.office_id_table[1].name){
                    
                                  if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                    list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                    list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                      ss2 = 1;
                                      // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                      var params = {
                                        ITEM_ID: list[i].ITEM_ID,
                                        TARGET_ID: list[i].TARGET_ID
                                      }
                                      this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                        // console.log(lists)
                                        for (var i=0; i<lists.length;i++){
                                          this.tempDatas2[i].QTY = lists[i].QTY_CASE;
                                          this.tempDatas2[i].FINE = lists[i].FINE;
                                          this.tempDatas2[i].TRE = lists[i].TREASURY_MONEY;
                                          this.tempDatas2[i].BRI = lists[i].BRIBE;
                                          this.tempDatas2[i].AWA = lists[i].REWARD;
                                          this.tempDatas2[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                          this.tempDatas2[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                          var qty_persent = [];
                                          var fine_persent = [];
                    
                                          this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                  this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                  this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                          this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                  this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                  this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                          this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                  this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                  this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                          this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                  this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                  this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                          this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                  this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                  this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                          qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                  this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                  this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                          fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                  this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                  this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                          this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                          this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                      
                                        }
                      
                                      })
                                    }else{
                                        for (var s = 0; s<12;s++){
                                          this.tempDatas2[s].QTY = 0;
                                          this.tempDatas2[s].FINE = 0;
                                          this.tempDatas2[s].TRE = 0;
                                          this.tempDatas2[s].BRI = 0;
                                          this.tempDatas2[s].AWA = 0;
                                          this.tempDatas2[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas2[s].FINE_PERCENT = 0;
                                          this.tempDatas[s].QTY = 0;
                                          this.tempDatas[s].FINE = 0;
                                          this.tempDatas[s].TRE = 0;
                                          this.tempDatas[s].BRI = 0;
                                          this.tempDatas[s].AWA = 0;
                                          this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas[s].FINE_PERCENT = 0;
                                          }
                                        // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                      }
                                }
                                if( list[i].OFFICE_NAME == this.office_id_table[2].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss3 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas3[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas3[i].FINE = lists[i].FINE;
                                                    this.tempDatas3[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas3[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas3[i].AWA = lists[i].REWARD;
                                                    this.tempDatas3[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas3[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas3[s].QTY = 0;
                                            this.tempDatas3[s].FINE = 0;
                                            this.tempDatas3[s].TRE = 0;
                                            this.tempDatas3[s].BRI = 0;
                                            this.tempDatas3[s].AWA = 0;
                                            this.tempDatas3[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas3[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                    
                                if( list[i].OFFICE_NAME == this.office_id_table[3].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss4 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas4[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas4[i].FINE = lists[i].FINE;
                                                    this.tempDatas4[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas4[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas4[i].AWA = lists[i].REWARD;
                                                    this.tempDatas4[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas4[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas4[s].QTY = 0;
                                            this.tempDatas4[s].FINE = 0;
                                            this.tempDatas4[s].TRE = 0;
                                            this.tempDatas4[s].BRI = 0;
                                            this.tempDatas4[s].AWA = 0;
                                            this.tempDatas4[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas4[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                              }
                    
                              if (ss1 == 1 && ss2 == 1 && ss3 == 1 && ss4 == 1){
                                // console.log(ss1,ss2,ss3)
                                this.targetTotal = true;
                              }else{
                                // console.log("no")
                                this.targetTotal = false;
                              }
                    
                            }else if(this.office_table.length == 3){
                    
                              for (var i = 0; i<list.length;i++){
                                if( list[i].OFFICE_NAME == this.office_id_table[0].name){
                    
                                    if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                      list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                      list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                        ss1 = 1;
                                          // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                                          var params = {
                                            ITEM_ID: list[i].ITEM_ID,
                                            TARGET_ID: list[i].TARGET_ID
                                          }
                                          this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                            // console.log(lists)
                                            for (var i=0; i<lists.length;i++){
                                              this.tempDatas1[i].QTY = lists[i].QTY_CASE;
                                              this.tempDatas1[i].FINE = lists[i].FINE;
                                              this.tempDatas1[i].TRE = lists[i].TREASURY_MONEY;
                                              this.tempDatas1[i].BRI = lists[i].BRIBE;
                                              this.tempDatas1[i].AWA = lists[i].REWARD;
                                              this.tempDatas1[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                              this.tempDatas1[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                              var qty_persent = [];
                                              var fine_persent = [];
                    
                                              this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                      this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                      this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                              this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                      this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                      this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                              this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                      this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                      this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                              this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                      this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                      this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                              this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                      this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                      this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                              qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                      this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                      this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                              fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                      this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                      this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                              this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                              this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                            }
                    
                                          })
                    
                                      }else{
                                        for (var s = 0; s<12;s++){
                                          this.tempDatas1[s].QTY = 0;
                                          this.tempDatas1[s].FINE = 0;
                                          this.tempDatas1[s].TRE = 0;
                                          this.tempDatas1[s].BRI = 0;
                                          this.tempDatas1[s].AWA = 0;
                                          this.tempDatas1[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas1[s].FINE_PERCENT = 0;
                                          this.tempDatas[s].QTY = 0;
                                          this.tempDatas[s].FINE = 0;
                                          this.tempDatas[s].TRE = 0;
                                          this.tempDatas[s].BRI = 0;
                                          this.tempDatas[s].AWA = 0;
                                          this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas[s].FINE_PERCENT = 0;
                                          }
                                        // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                      }
                                }
                                if( list[i].OFFICE_NAME == this.office_id_table[1].name){
                    
                                  if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                    list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                    list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                      ss2 = 1;
                                      // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                      var params = {
                                        ITEM_ID: list[i].ITEM_ID,
                                        TARGET_ID: list[i].TARGET_ID
                                      }
                                      this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                        // console.log(lists)
                                        for (var i=0; i<lists.length;i++){
                                          this.tempDatas2[i].QTY = lists[i].QTY_CASE;
                                          this.tempDatas2[i].FINE = lists[i].FINE;
                                          this.tempDatas2[i].TRE = lists[i].TREASURY_MONEY;
                                          this.tempDatas2[i].BRI = lists[i].BRIBE;
                                          this.tempDatas2[i].AWA = lists[i].REWARD;
                                          this.tempDatas2[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                          this.tempDatas2[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                          var qty_persent = [];
                                          var fine_persent = [];
                    
                                          this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                  this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                  this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                          this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                  this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                  this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                          this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                  this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                  this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                          this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                  this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                  this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                          this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                  this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                  this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                          qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                  this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                  this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                          fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                  this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                  this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                          this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                          this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                      
                                        }
                      
                                      })
                                    }else{
                                        for (var s = 0; s<12;s++){
                                          this.tempDatas2[s].QTY = 0;
                                          this.tempDatas2[s].FINE = 0;
                                          this.tempDatas2[s].TRE = 0;
                                          this.tempDatas2[s].BRI = 0;
                                          this.tempDatas2[s].AWA = 0;
                                          this.tempDatas2[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas2[s].FINE_PERCENT = 0;
                                          this.tempDatas[s].QTY = 0;
                                          this.tempDatas[s].FINE = 0;
                                          this.tempDatas[s].TRE = 0;
                                          this.tempDatas[s].BRI = 0;
                                          this.tempDatas[s].AWA = 0;
                                          this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas[s].FINE_PERCENT = 0;
                                          }
                                        // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                      }
                                }
                                if( list[i].OFFICE_NAME == this.office_id_table[2].name){
                    
                                        if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                          list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                          list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                            ss3 = 1;
                                                // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                                var params = {
                                                  ITEM_ID: list[i].ITEM_ID,
                                                  TARGET_ID: list[i].TARGET_ID
                                                }
                                                this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                                  // console.log(lists)
                                                  for (var i=0; i<lists.length;i++){
                                                    this.tempDatas3[i].QTY = lists[i].QTY_CASE;
                                                    this.tempDatas3[i].FINE = lists[i].FINE;
                                                    this.tempDatas3[i].TRE = lists[i].TREASURY_MONEY;
                                                    this.tempDatas3[i].BRI = lists[i].BRIBE;
                                                    this.tempDatas3[i].AWA = lists[i].REWARD;
                                                    this.tempDatas3[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                                    this.tempDatas3[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                                    var qty_persent = [];
                                                    var fine_persent = [];
                          
                                                    this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                            this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                            this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                                    this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                            this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                            this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                                    this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                            this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                            this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                                    this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                            this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                            this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                                    this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                            this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                            this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                                    qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                            this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                                    fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                            this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                            this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                                    this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                                    this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                    
                                                    // console.log(qty_persent[i])
                                                    // console.log(this.tempDatas[i].FINE_PERCENT)
                                                  }
                    
                                                })
                                        }else{
                                          for (var s = 0; s<12;s++){
                                            this.tempDatas3[s].QTY = 0;
                                            this.tempDatas3[s].FINE = 0;
                                            this.tempDatas3[s].TRE = 0;
                                            this.tempDatas3[s].BRI = 0;
                                            this.tempDatas3[s].AWA = 0;
                                            this.tempDatas3[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas3[s].FINE_PERCENT = 0;
                                            this.tempDatas[s].QTY = 0;
                                            this.tempDatas[s].FINE = 0;
                                            this.tempDatas[s].TRE = 0;
                                            this.tempDatas[s].BRI = 0;
                                            this.tempDatas[s].AWA = 0;
                                            this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                            this.tempDatas[s].FINE_PERCENT = 0;
                                            }
                                          // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                        }
                                }
                              }
                    
                              if (ss1 == 1 && ss2 == 1 && ss3 == 1 ){
                                // console.log(ss1,ss2,ss3)
                                this.targetTotal = true;
                              }else{
                                // console.log("no")
                                this.targetTotal = false;
                              }
                    
                            }else if(this.office_table.length == 2){
                    
                              for (var i = 0; i<list.length;i++){
                                if( list[i].OFFICE_NAME == this.office_id_table[0].name){
                    
                                    if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                      list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                      list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                        ss1 = 1;
                                          // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                                          var params = {
                                            ITEM_ID: list[i].ITEM_ID,
                                            TARGET_ID: list[i].TARGET_ID
                                          }
                                          this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                            // console.log(lists)
                                            for (var i=0; i<lists.length;i++){
                                              this.tempDatas1[i].QTY = lists[i].QTY_CASE;
                                              this.tempDatas1[i].FINE = lists[i].FINE;
                                              this.tempDatas1[i].TRE = lists[i].TREASURY_MONEY;
                                              this.tempDatas1[i].BRI = lists[i].BRIBE;
                                              this.tempDatas1[i].AWA = lists[i].REWARD;
                                              this.tempDatas1[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                              this.tempDatas1[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                              var qty_persent = [];
                                              var fine_persent = [];
                    
                                              this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                      this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                      this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                              this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                      this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                      this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                              this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                      this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                      this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                              this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                      this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                      this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                              this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                      this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                      this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                              qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                      this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                      this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                              fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                      this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                      this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                              this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                              this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                                            }
                    
                                          })
                    
                                      }else{
                                        for (var s = 0; s<12;s++){
                                          this.tempDatas1[s].QTY = 0;
                                          this.tempDatas1[s].FINE = 0;
                                          this.tempDatas1[s].TRE = 0;
                                          this.tempDatas1[s].BRI = 0;
                                          this.tempDatas1[s].AWA = 0;
                                          this.tempDatas1[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas1[s].FINE_PERCENT = 0;
                                          this.tempDatas[s].QTY = 0;
                                          this.tempDatas[s].FINE = 0;
                                          this.tempDatas[s].TRE = 0;
                                          this.tempDatas[s].BRI = 0;
                                          this.tempDatas[s].AWA = 0;
                                          this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas[s].FINE_PERCENT = 0;
                                          }
                                        // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                      }
                                }
                                if( list[i].OFFICE_NAME == this.office_id_table[1].name){
                    
                                  if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                    list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                    list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                      ss2 = 1;
                                      // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                    
                                      var params = {
                                        ITEM_ID: list[i].ITEM_ID,
                                        TARGET_ID: list[i].TARGET_ID
                                      }
                                      this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                        // console.log(lists)
                                        for (var i=0; i<lists.length;i++){
                                          this.tempDatas2[i].QTY = lists[i].QTY_CASE;
                                          this.tempDatas2[i].FINE = lists[i].FINE;
                                          this.tempDatas2[i].TRE = lists[i].TREASURY_MONEY;
                                          this.tempDatas2[i].BRI = lists[i].BRIBE;
                                          this.tempDatas2[i].AWA = lists[i].REWARD;
                                          this.tempDatas2[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                          this.tempDatas2[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                          var qty_persent = [];
                                          var fine_persent = [];
                    
                                          this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                  this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                  this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                          this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                  this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                  this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                          this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                  this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                  this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                          this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                  this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                  this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                          this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                  this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                  this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                          qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                  this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                  this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                          fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                  this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                  this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                          this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                          this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                      
                                        }
                      
                                      })
                                    }else{
                                        for (var s = 0; s<12;s++){
                                          this.tempDatas2[s].QTY = 0;
                                          this.tempDatas2[s].FINE = 0;
                                          this.tempDatas2[s].TRE = 0;
                                          this.tempDatas2[s].BRI = 0;
                                          this.tempDatas2[s].AWA = 0;
                                          this.tempDatas2[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas2[s].FINE_PERCENT = 0;
                                          this.tempDatas[s].QTY = 0;
                                          this.tempDatas[s].FINE = 0;
                                          this.tempDatas[s].TRE = 0;
                                          this.tempDatas[s].BRI = 0;
                                          this.tempDatas[s].AWA = 0;
                                          this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas[s].FINE_PERCENT = 0;
                                          }
                                        // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                      }
                                }
                              }
                    
                              if (ss1 == 1 && ss2 == 1 ){
                                // console.log(ss1,ss2,ss3)
                                this.targetTotal = true;
                              }else{
                                // console.log("no")
                                this.targetTotal = false;
                              }
                    
                            }else if(this.office_table.length == 1){
                    
                              for (var i = 0; i<list.length;i++){
                                if( list[i].OFFICE_NAME == this.office_id_table[0].name){
                    
                                    if(list[i].SEQUENCE == num && list[i].BUDGET_YEAR == this.year && 
                                      list[i].LAWSUIT_TYPE_TARGET == law && list[i].PRODUCT_GROUP_NAME == pro && 
                                      list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1){
                                        ss1 = 1;
                                          // console.log(list[i].OFFICE_NAME,"itemID",list[i].ITEM_ID,"targetID",list[i].TARGET_ID);
                                          var params = {
                                            ITEM_ID: list[i].ITEM_ID,
                                            TARGET_ID: list[i].TARGET_ID
                                          }
                                          this.targetService.TargetgetByCon(params).subscribe(lists=>{
                                            // console.log(lists)
                                            for (var i=0; i<lists.length;i++){
                                              this.tempDatas1[i].QTY = lists[i].QTY_CASE;
                                              this.tempDatas1[i].FINE = lists[i].FINE;
                                              this.tempDatas1[i].TRE = lists[i].TREASURY_MONEY;
                                              this.tempDatas1[i].BRI = lists[i].BRIBE;
                                              this.tempDatas1[i].AWA = lists[i].REWARD;
                                              this.tempDatas1[i].QTY_CASE_PERCENT = lists[i].QTY_CASE_PERCENT;
                                              this.tempDatas1[i].FINE_PERCENT = lists[i].FINE_PERCENT;
                    
                                              var qty_persent = [];
                                              var fine_persent = [];
                    
                                              this.tempDatas[i].QTY = this.tempDatas1[i].QTY+this.tempDatas2[i].QTY+this.tempDatas3[i].QTY+
                                                                      this.tempDatas4[i].QTY+this.tempDatas5[i].QTY+this.tempDatas6[i].QTY+
                                                                      this.tempDatas7[i].QTY+this.tempDatas8[i].QTY+this.tempDatas9[i].QTY+this.tempDatas10[i].QTY;
                                              this.tempDatas[i].FINE= this.tempDatas1[i].FINE+this.tempDatas2[i].FINE+this.tempDatas3[i].FINE+
                                                                      this.tempDatas4[i].FINE+this.tempDatas5[i].FINE+this.tempDatas6[i].FINE+
                                                                      this.tempDatas7[i].FINE+this.tempDatas8[i].FINE+this.tempDatas9[i].FINE+this.tempDatas10[i].FINE;
                                              this.tempDatas[i].TRE = this.tempDatas1[i].TRE+this.tempDatas2[i].TRE+this.tempDatas3[i].TRE+
                                                                      this.tempDatas4[i].TRE+this.tempDatas5[i].TRE+this.tempDatas6[i].TRE+
                                                                      this.tempDatas7[i].TRE+this.tempDatas8[i].TRE+this.tempDatas9[i].TRE+this.tempDatas10[i].TRE;
                                              this.tempDatas[i].BRI = this.tempDatas1[i].BRI+this.tempDatas2[i].BRI+this.tempDatas3[i].BRI+
                                                                      this.tempDatas4[i].BRI+this.tempDatas5[i].BRI+this.tempDatas6[i].BRI+
                                                                      this.tempDatas7[i].BRI+this.tempDatas8[i].BRI+this.tempDatas9[i].BRI+this.tempDatas10[i].BRI;
                                              this.tempDatas[i].AWA = this.tempDatas1[i].AWA+this.tempDatas2[i].AWA+this.tempDatas3[i].AWA+
                                                                      this.tempDatas4[i].AWA+this.tempDatas5[i].AWA+this.tempDatas6[i].AWA+
                                                                      this.tempDatas7[i].AWA+this.tempDatas8[i].AWA+this.tempDatas9[i].AWA+this.tempDatas10[i].AWA;  
                                              qty_persent[i] = this.tempDatas1[i].QTY_CASE_PERCENT+this.tempDatas2[i].QTY_CASE_PERCENT+this.tempDatas3[i].QTY_CASE_PERCENT+
                                                                      this.tempDatas4[i].QTY_CASE_PERCENT+this.tempDatas5[i].QTY_CASE_PERCENT+this.tempDatas6[i].QTY_CASE_PERCENT+
                                                                      this.tempDatas7[i].QTY_CASE_PERCENT+this.tempDatas8[i].QTY_CASE_PERCENT+this.tempDatas9[i].QTY_CASE_PERCENT+this.tempDatas10[i].QTY_CASE_PERCENT;
                                              fine_persent[i] = this.tempDatas1[i].FINE_PERCENT+this.tempDatas2[i].FINE_PERCENT+this.tempDatas3[i].FINE_PERCENT+
                                                                      this.tempDatas4[i].FINE_PERCENT+this.tempDatas5[i].FINE_PERCENT+this.tempDatas6[i].FINE_PERCENT+
                                                                      this.tempDatas7[i].FINE_PERCENT+this.tempDatas8[i].FINE_PERCENT+this.tempDatas9[i].FINE_PERCENT+this.tempDatas10[i].FINE_PERCENT;
                                              this.tempDatas[i].QTY_CASE_PERCENT = qty_persent[i]/this.office_table.length;
                                              this.tempDatas[i].FINE_PERCENT = fine_persent[i]/this.office_table.length;
                                            }
                    
                                          })
                    
                                      }else{
                                        for (var s = 0; s<12;s++){
                                          this.tempDatas1[s].QTY = 0;
                                          this.tempDatas1[s].FINE = 0;
                                          this.tempDatas1[s].TRE = 0;
                                          this.tempDatas1[s].BRI = 0;
                                          this.tempDatas1[s].AWA = 0;
                                          this.tempDatas1[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas1[s].FINE_PERCENT = 0;
                                          this.tempDatas[s].QTY = 0;
                                          this.tempDatas[s].FINE = 0;
                                          this.tempDatas[s].TRE = 0;
                                          this.tempDatas[s].BRI = 0;
                                          this.tempDatas[s].AWA = 0;
                                          this.tempDatas[s].QTY_CASE_PERCENT = 0;
                                          this.tempDatas[s].FINE_PERCENT = 0;
                                          }
                                        // console.log("nodata",list[i].OFFICE_NAME,'ครั้งที่',list[i].SEQUENCE,list[i].BUDGET_YEAR);
                                      }
                                }
                              }
                    
                              if (ss1 == 1 ){
                                // console.log(ss1,ss2,ss3)
                                this.targetTotal = true;
                              }else{
                                // console.log("no")
                                this.targetTotal = false;
                              }
                    
                            }
                    
                          });
                        });
                      }
    
                  }
    
              }
          }
        }
        
      });
    });

    });
    // console.log(this.tempData.length);

    
    // this.navService.onPrint.takeUntil(this.destroy$).subscribe(async status =>{
    //   if(status){
    //     // this.preloader.setShowPreloader(true);
    //     // await this.navService.setOnPrint(false);

    //     this.modal = this.ngbModel.open(PrintdocModelComponent,{backdrop:'static',size:'lg',})
    //   }
    // });

    // this.navService.onSendTarget.takeUntil(this.destroy$).subscribe(async status =>{
    //   if (status){
    //     this.navService.setSendButton(false);
    //     // this.router.navigate(['/SuppressTarget/manages/target/R']);
    //   }
    // });
    
    
  }

  ngOnSend_target(): void{
    this.navService.setEditButton(false);
    this.navService.setDeleteButton(false);
    this.navService.setSendButton(false);
    // this.navService.setSendTargetButton_target(false);
  }

  // ยอดรวม พื้นที่/ภาค---------------------------------------------------------------------------------------------------------------------------------
  public total_QTY1(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas1.length;i++){
      total += this.tempDatas1[i].QTY;
    }
    return total;
  }
  public total_QTY2(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas2.length;i++){
      total += this.tempDatas2[i].QTY;
    }
    return total;
  }
  public total_QTY3(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas3.length;i++){
      total += this.tempDatas3[i].QTY;
    }
    return total;
  }
  public total_QTY4(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas4.length;i++){
      total += this.tempDatas4[i].QTY;
    }
    return total;
  }
  public total_QTY5(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas5.length;i++){
      total += this.tempDatas5[i].QTY;
    }
    return total;
  }
  public total_QTY6(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas6.length;i++){
      total += this.tempDatas6[i].QTY;
    }
    return total;
  }
  public total_QTY7(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas7.length;i++){
      total += this.tempDatas7[i].QTY;
    }
    return total;
  }
  public total_QTY8(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas8.length;i++){
      total += this.tempDatas8[i].QTY;
    }
    return total;
  }
  public total_QTY9(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas9.length;i++){
      total += this.tempDatas9[i].QTY;
    }
    return total;
  }
  public total_QTY10(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas10.length;i++){
      total += this.tempDatas10[i].QTY;
    }
    return total;
  }
  public total_QTY11(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas11.length;i++){
      total += this.tempDatas11[i].QTY;
    }
    return total;
  }
  public total_QTY12(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas12.length;i++){
      total += this.tempDatas12[i].QTY;
    }
    return total;
  }
  public total_QTY(): number {
    var total = 0;

    for (var i=0; i< this.tempDatas.length;i++){
      total += this.tempDatas[i].QTY;
    }
    return total;
  }

  public total_FINE1(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas1.length;i++){
      total += this.tempDatas1[i].FINE;
    }
    return total;
  }
  public total_FINE2(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas2.length;i++){
      total += this.tempDatas2[i].FINE;
    }
    return total;
  }
  public total_FINE3(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas3.length;i++){
      total += this.tempDatas3[i].FINE;
    }
    return total;
  }
  public total_FINE4(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas4.length;i++){
      total += this.tempDatas4[i].FINE;
    }
    return total;
  }
  public total_FINE5(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas5.length;i++){
      total += this.tempDatas5[i].FINE;
    }
    return total;
  }
  public total_FINE6(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas6.length;i++){
      total += this.tempDatas6[i].FINE;
    }
    return total;
  }
  public total_FINE7(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas7.length;i++){
      total += this.tempDatas7[i].FINE;
    }
    return total;
  }
  public total_FINE8(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas8.length;i++){
      total += this.tempDatas8[i].FINE;
    }
    return total;
  }
  public total_FINE9(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas9.length;i++){
      total += this.tempDatas9[i].FINE;
    }
    return total;
  }
  public total_FINE10(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas10.length;i++){
      total += this.tempDatas10[i].FINE;
    }
    return total;
  }
  public total_FINE11(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas11.length;i++){
      total += this.tempDatas11[i].FINE;
    }
    return total;
  }
  public total_FINE12(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas12.length;i++){
      total += this.tempDatas12[i].FINE;
    }
    return total;
  }
  public total_FINE(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas.length;i++){
      total += this.tempDatas[i].FINE;
    }
    return total;
  }

  public total_TRE1(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas1.length;i++){
      total += this.tempDatas1[i].TRE;
    }
    return total;
  }
  public total_TRE2(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas2.length;i++){
      total += this.tempDatas2[i].TRE;
    }
    return total;
  }
  public total_TRE3(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas3.length;i++){
      total += this.tempDatas3[i].TRE;
    }
    return total;
  }
  public total_TRE4(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas4.length;i++){
      total += this.tempDatas4[i].TRE;
    }
    return total;
  }
  public total_TRE5(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas5.length;i++){
      total += this.tempDatas5[i].TRE;
    }
    return total;
  }
  public total_TRE6(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas6.length;i++){
      total += this.tempDatas6[i].TRE;
    }
    return total;
  }
  public total_TRE7(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas7.length;i++){
      total += this.tempDatas7[i].TRE;
    }
    return total;
  }
  public total_TRE8(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas8.length;i++){
      total += this.tempDatas8[i].TRE;
    }
    return total;
  }
  public total_TRE9(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas9.length;i++){
      total += this.tempDatas9[i].TRE;
    }
    return total;
  }
  public total_TRE10(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas10.length;i++){
      total += this.tempDatas10[i].TRE;
    }
    return total;
  }
  public total_TRE11(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas11.length;i++){
      total += this.tempDatas11[i].TRE;
    }
    return total;
  }
  public total_TRE12(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas12.length;i++){
      total += this.tempDatas12[i].TRE;
    }
    return total;
  }
  public total_TRE(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas.length;i++){
      total += this.tempDatas[i].TRE;
    }
    return total;
  }
  
  public total_BRI1(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas1.length;i++){
      total += this.tempDatas1[i].BRI;
    }
    return total;
  }
  public total_BRI2(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas2.length;i++){
      total += this.tempDatas2[i].BRI;
    }
    return total;
  }
  public total_BRI3(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas3.length;i++){
      total += this.tempDatas3[i].BRI;
    }
    return total;
  }
  public total_BRI4(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas4.length;i++){
      total += this.tempDatas4[i].BRI;
    }
    return total;
  }
  public total_BRI5(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas5.length;i++){
      total += this.tempDatas5[i].BRI;
    }
    return total;
  }
  public total_BRI6(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas6.length;i++){
      total += this.tempDatas6[i].BRI;
    }
    return total;
  }
  public total_BRI7(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas7.length;i++){
      total += this.tempDatas7[i].BRI;
    }
    return total;
  }
  public total_BRI8(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas8.length;i++){
      total += this.tempDatas8[i].BRI;
    }
    return total;
  }
  public total_BRI9(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas9.length;i++){
      total += this.tempDatas9[i].BRI;
    }
    return total;
  }
  public total_BRI10(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas10.length;i++){
      total += this.tempDatas10[i].BRI;
    }
    return total;
  }
  public total_BRI11(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas11.length;i++){
      total += this.tempDatas11[i].BRI;
    }
    return total;
  }
  public total_BRI12(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas12.length;i++){
      total += this.tempDatas12[i].BRI;
    }
    return total;
  }
  public total_BRI(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas.length;i++){
      total += this.tempDatas[i].BRI;
    }
    return total;
  }
  public total_AWA1(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas1.length;i++){
      total += this.tempDatas1[i].AWA;
    }
    return total;
  }
  public total_AWA2(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas2.length;i++){
      total += this.tempDatas2[i].AWA;
    }
    return total;
  }
  public total_AWA3(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas3.length;i++){
      total += this.tempDatas3[i].AWA;
    }
    return total;
  }
  public total_AWA4(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas4.length;i++){
      total += this.tempDatas4[i].AWA;
    }
    return total;
  }
  public total_AWA5(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas5.length;i++){
      total += this.tempDatas5[i].AWA;
    }
    return total;
  }
  public total_AWA6(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas6.length;i++){
      total += this.tempDatas6[i].AWA;
    }
    return total;
  }
  public total_AWA7(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas7.length;i++){
      total += this.tempDatas7[i].AWA;
    }
    return total;
  }
  public total_AWA8(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas8.length;i++){
      total += this.tempDatas8[i].AWA;
    }
    return total;
  }
  public total_AWA9(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas9.length;i++){
      total += this.tempDatas9[i].AWA;
    }
    return total;
  }
  public total_AWA10(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas10.length;i++){
      total += this.tempDatas10[i].AWA;
    }
    return total;
  }
  public total_AWA11(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas11.length;i++){
      total += this.tempDatas11[i].AWA;
    }
    return total;
  }
  public total_AWA12(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas12.length;i++){
      total += this.tempDatas12[i].AWA;
    }
    return total;
  }
  public total_AWA(): number {
    var total = 0;
    for (var i=0; i< this.tempDatas.length;i++){
      total += this.tempDatas[i].AWA;
    }
    return total;
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
          this.router.navigate(['/SuppressTarget/list']);
        } else {
          swal({
            type: 'error',
            text: 'ไม่สามารถทำรายการได้'
          });
        }
      }
    });
    // console.log(this.date_time);


  }

  clickSave() {

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
            // location.reload();
            this.save_btn = false;
            this.print_btn = true;
            this.delete_btn = false;
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


  ngOnDestroy(): void {
   
    this.navService.setSendButton(false);
    this.navService.setPrintButton(false);
    // this.destroy$.unsubscribe;
  }
  
}
