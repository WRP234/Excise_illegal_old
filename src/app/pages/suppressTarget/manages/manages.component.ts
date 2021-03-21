import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { pagination } from '../../../config/pagination';
import { SuppressTarget } from '../suppressTarget.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import swal from 'sweetalert2';
import { Subject } from 'rxjs/Subject';
import { Messages_target } from '../new_message'
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrintdocModelComponent } from '../printdoc-model/printdoc-model.component';
import {Nav_target_Service} from '../../../shared/header-navigation/nav_target.service'
import { TargetService } from '../target.service';
import { range, timer } from 'rxjs';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { PARAMETERS } from '@angular/core/src/util/decorators';
import { timestamp } from 'rxjs-compat/operator/timestamp';


@Component({
  selector: 'app-manages',
  templateUrl: './manages.component.html',
  styleUrls: ['./manages.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ManagesComponent implements OnInit {

  // @ViewChild('printDocModal') printDocModel: ElementRef;
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

  //api
  office_name : any;
  office_code : any;
  office_id : any;
  target_code : any;
  year : any;
  total_year : any;
  sequence : any;
  sequence_2 : any;
  createTarget_name : any;
  product_group : any;
  lawsult_type : any;
  product_group1 : any;
  product_group2 : any;
  product_group3 : any;
  product_group4 = "สินค้าอื่นๆ";
  lawsult_type1 = 0;
  lawsult_type2 = 1;
  lawsult_type3 = 2;
  qty : any;
  sum_qty : any;
  fine : any;
  sum_fine : any;
  date_time : any;
  product_name : any;
  lawsult_name : any;
  offcode : any;
  list_sequence = [];
  sum_sequence = 1;
  vip =  <boolean>(false);

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

  //get item
  office_table = [];
  office_id_table = [];

  private destroy$: Subject<boolean> = new Subject<boolean>();
  // ListMasProd: any;
  tagetForm: FormGroup;

  craete_btn = <Boolean>(false);
  search_text= <Boolean>(true);

  private subSetNextPage: any;
  // set_Btn
  print_btn = <boolean>(false);
  edit_btn = <boolean>(false);
  delete_btn = <boolean>(false);
  save_btn = <boolean>(false);
  cancel_btn = <boolean>(false);
  //สตป
  nav0 = <boolean>(false);
  ins_lawsult1 = "เปรียบเทียบปรับ";
  ins_lawsult2 = "ส่งฟ้องศาล";
  ins_lawsult3 = "ไม่มีตัว";

  ins_product1 = "สุรา";
  ins_product2 = "ยาสูบ";
  ins_product3 = "ไพ่";
  ins_product4 = "สินค้าอื่นๆ";


  //พื้นที่/สาขา
  nav1 = <boolean>(true);
  nav2 = <boolean>(true);
  //ภาค
  nav3 = <boolean>(false);
  nav2_1 = <boolean>(true);
  nav2_2 = <boolean>(true);
  targetTotal = <boolean>(false);

  //สาขา/สตป
  box1 = <boolean>(false);
  box2 = <boolean>(false);
  product_type1 = <boolean>(false);
  lawsult1 = <boolean>(false);
  sequence1 = <boolean>(false);

  //พื้นที่/ภาค
  product_type2 = <boolean>(false);
  lawsult2 = <boolean>(false);
  sequence2 = <boolean>(false);
  sequence2_1 = <boolean>(false);
  sequence2_2 = <boolean>(false);
  box3 = <boolean>(false);
  insert_total : any;

  //table
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
  row = <boolean>(false);
  row1 = <boolean>(true);
  row2 = <boolean>(true);
  // row3 = <boolean>(false);
  // row4 = <boolean>(false);
  // row5 = <boolean>(false);
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
    // console.log(e);
  }

  //สาขา/สตป
  items: any[] = [
    { id: 1, name: "สุรา" },
    { id: 2, name: "ยาสูบ" },
    { id: 3, name: "ไพ่" },
    { id: 4, name: "สินค้าอื่นๆ" }
  ];
  item: any[] = [
    { id: 1, name: "เปรียบเทียบปรับ" },
    { id: 2, name: "ส่งฟ้องศาล" },
    { id: 3, name: "ไม่มีตัว" }
  ];
  selected: number = 0;
  selecteds: number = 0;

  // พื้นที่/ภาค
  items2: any[] = [
    { id: 1, name: "สุรา" },
    { id: 2, name: "ยาสูบ" },
    { id: 3, name: "ไพ่" },
    { id: 4, name: "สินค้าอื่นๆ" }
  ];

  item2: any[] = [
    { id: 1, name: "เปรียบเทียบปรับ" },
    { id: 2, name: "ส่งฟ้องศาล" },
    { id: 3, name: "ไม่มีตัว" }
  ];
  selected2: number = 0;
  selecteds2: number = 0;

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

  //set years
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
    private SuppressTarget: SuppressTarget,
    private router: Router,
    private activeRoute: ActivatedRoute,

    private preloader: PreloaderService,
    private ngbModel: NgbModal,
    private targetService : TargetService,
    
  ) {
  }


  ngOnInit() {

    localStorage.setItem('programcode', 'ILG60-99-02');
    
    this.craeteTarget_btn = true;
    this.prevPageButton = true
    this.navService.setSearchBar(true)
    this.active_Route();
    this.navService.setSendButton(true);
    this.navService.setPrintButton(true);
    this.date();
    this.navigate_service();
    this.totalItemDetail();
    this.productgroup();
    
    
  }

  //datetime---------------------------------------------------------------------------------------------------------------------------------
  private date(){
    // bUDGET_YEAR_FROM 
  
    // console.log(this.item);
  
    const _date = new Date;
    const dd = _date.getDate();
    const mm = _date.getMonth() + 1;
    const yy = _date.getFullYear();
    const _hours = _date.getHours();
    const _minutes = _date.getMinutes();
    const _seconds = _date.getSeconds();
    const _millimi = _date.getMilliseconds();

    // console.log('_date',_date);
    // console.log('dd',dd);
    // console.log('mm',mm);
    // console.log('yyyy',yy);
    // console.log('_hours',_hours);
    // console.log('_minutes',_minutes);
    // console.log('_seconds',_seconds);
    // console.log('_millimi',_millimi);

    if (mm == 1 || mm == 2 || mm == 3|| mm == 4|| mm == 5|| mm == 6|| mm == 7|| mm == 8|| mm == 9){
      // yy = _date.getFullYear()+542;
      this.total_year = yy+543;

    }else{
      // yy = _date.getFullYear()+543;
      this.total_year = yy+544;
    }

    
    // this.year = this.total_year;
    // console.log(yy);
  // this.date_time = yyyy+'-'+mm+'-'+dd+' '+_hours+':'+_minutes+':'+_seconds+'.'+_millimi;
  // console.log(this.date_time);
  
  }

  ite2: any[] = [ ];

  config2: any = {'width': '100%' , 'max': 5, 'placeholder': '', 'sourceField': 'OFFICE_NAME'};
 
  selectedItem: any = '';
  inputChanged: any = '';

  //mas office---------------------------------------------------------------------------------------------------------------------------------
  onSelect(item: any) {
    this.selectedItem = item;
    this.office_name = item.OFFICE_NAME;

    // console.log(this.office_name);
    if (this.office_name != ''){
        this.save_btn = true;
        this.cancel_btn = true;
        this.nav2 = true;
        this.nav2_1 = true;
        this.nav2_2 = false;

        const paramss = {
          TEXT_SEARCH : this.office_name,
          OFFICE_ID : "" 
        }
        this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramss).then(list=>{
          
          this.office_code = list.RESPONSE_DATA[0].OFFICE_CODE;
          this.office_id = list.RESPONSE_DATA[0].OFFICE_ID;

          // console.log(this.office_id);
          // console.log(this.office_code);
        });
        
    }else{
      this.save_btn = true;
        this.cancel_btn = true;
        this.nav2 = true;
        this.nav2_1 = false;
        this.nav2_2 = true;
    }

  }
  
  //value input---------------------------------------------------------------------------------------------------------------------------------
  onInputChangedEvent(val: string) {
    this.inputChanged = val;
    // console.log(val);
  }

  //product_list---------------------------------------------------------------------------------------------------------------------------------
  private productgroup(){
    // const product_group = {TEXT_SEARCH :"",  PRODUCT_GROUP_ID : ""};
    // this.targetService.MasProductGroupgetByCon("MasProductGroupgetByCon",product_group).then(list=>{
    //   // console.log(list);
    //   for (var i=1; i<list.length; i++){
    //     if (list[i].PRODUCT_GROUP_CODE == "13"){

    //         this.product_group1 = list[i].PRODUCT_GROUP_NAME;
    //         // console.log(list[i].PRODUCT_GROUP_CODE);
    //         // console.log(list[i].PRODUCT_GROUP_NAME);

    //     }

    //     if (list[i].PRODUCT_GROUP_CODE == "14"){

    //       this.product_group2 = list[i].PRODUCT_GROUP_NAME;
    //     }

    //     if (list[i].PRODUCT_GROUP_CODE == "15"){

    //       this.product_group3 = list[i].PRODUCT_GROUP_NAME;
    //     }
    //   }
    // });

    this.product_group1 = 'สุรา';
    this.product_group2 = 'ยาสูบ';
    this.product_group3 = 'ไพ่';

    const _date = new Date;
    const dd = _date.getDate();
    const mm = _date.getMonth() + 1;
    const yy = _date.getFullYear();
    let yyyy  ;
    const _hours = _date.getHours();
    const _minutes = _date.getMinutes();
    const _seconds = _date.getSeconds();
    const _millimi = _date.getMilliseconds();
    
    // console.log(_date);
    // console.log(yyyy+'-'+mm+'-'+dd);
    // console.log(_hours+':'+_minutes+':'+_seconds+'.'+_millimi);

    if (mm == 1 || mm == 2 || mm == 3|| mm == 4|| mm == 5|| mm == 6|| mm == 7|| mm == 8|| mm == 9){
      // yy = _date.getFullYear()+542;
      yyyy = yy;

    }else{
      // yy = _date.getFullYear()+543;
      yyyy = yy+1;
    }
    
  this.date_time = yyyy+'-'+mm+'-'+dd+' '+_hours+':'+_minutes+':'+_seconds+'.'+_millimi;
  // console.log(this.date_time);
  }

  //navigate load---------------------------------------------------------------------------------------------------------------------------------
  private navigate_service() {

    // this.print_btn = true;
    this.sub = this.activeRoute.params.subscribe(p => {

      // this.office_name = p.name;
      // this.office_code = p.code;
      // this.office_id = p.id;
      const name = p.name;

      // สปป-----------------------------------------------------------------------------------------------
      this.offcode = p.code;

    var nums1 = this.offcode.charAt(0);
    var nums2 = this.offcode.charAt(1);
    var nums3 = this.offcode.charAt(2);
    var nums4 = this.offcode.charAt(3);
    var nums5 = this.offcode.charAt(4);
    var nums6 = this.offcode.charAt(5);

    //สนง
    var first4 = nums1+nums2+nums3+nums4;
    var last2 = nums5+nums6;

    //ภาค
    var first2 = nums1+nums2;
    var last4 = nums3+nums4+nums5+nums6;

    //พื้นที่
     var middle2 = nums3+nums4;

    //000700 : สตป.
    if(first4 == "0007" )
      {
      if( last2 == "00"||last2 == "01"||last2 == "02"||last2 == "03"||last2 == "04"||last2 == "05"||last2 == "06"||
          last2 == "07"||last2 == "08"||last2 == "09"||last2 == "10")
        {
          
          this.office_name = p.name;
          this.office_code = p.code;
          this.office_id = p.id;

          // console.log(this.office_code);

          this.cancel_btn = true;
          this.nav1 = true;

          this.nav2 = false;
          this.nav2_1 = false;
          this.nav2_2 = false;
          this.product_type1 = true;
          this.lawsult1 = true;
          this.sequence1 = true;
          this.vip = true;
          // this.vip = false;

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



        }}

    //สำนักงาน : first(0001-0013) last(00-10) //db(mas_office.office_name(shortBy:asc)) first t id.2 to id.74
    else if(  first4 == "0001"||first4 == "0002"||first4 == "0003"||first4 == "0004"||first4 == "0005"||first4 == "0006"||
              first4 == "0008"||first4 == "0009"||first4 == "0010"||first4 == "0011"||first4 == "0012"||first4 == "0013" )
        {if(  last2 == "00"||last2 == "01"||last2 == "02"||last2 == "03"||last2 == "04"||last2 == "05"||
              last2 == "06"||last2 == "07"||last2 == "08"||last2 == "09"||last2 == "10")
              {
                this.nav3 = true;
                this.nav2 = false;
                this.nav1 = false;
                this.nav0 = false;

                    this.office_name = p.name;
                    this.office_code = p.code;
                    this.office_id = p.id;
                    // this.save_btn = true;
                    this.cancel_btn = true;
                    this.sequence2 = true;
                    this.sequence2_1 = true;
                    this.vip = false;

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

                    // console.log(s1)
                    // console.log(sw1)
                    // console.log(s2)
                    // console.log(sw2)
                    // console.log(s3)
                    // console.log(sw3)
                    // console.log(s4)
                    // console.log(sw4)
                    // console.log(s5)
                    // console.log(sw5)
                    // console.log(s6)
                    // console.log(sw6)
                    // console.log(s7)
                    // console.log(sw7)
                    // console.log(s8)
                    // console.log(sw8)
                    // console.log(s9)
                    // console.log(sw9)
                    // console.log(s10)
                    // console.log(sw10)
                    // console.log(s11)
                    // console.log(sw11)
                    // console.log(s12)
                    // console.log(sw12)

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

                  });
                });});});});});});});});});});});
              }
          }

    //ภาค : first(01-10) last(0000-0010) //db(mas_office.office_name(shortBy:asc))
    else if(  first2 == "01"||first2 == "02"||first2 == "03"||first2 == "04"||first2 == "05"||first2 == "06"||
              first2 == "07"||first2 == "08"||first2 == "09"||first2 == "10")
          {
            if( last4 == "0000"||last4 == "0001"||last4 == "0002"||last4 == "0003"||last4 == "0004"||last4 == "0005"||
                last4 == "0006"||last4 == "0007"||last4 == "0008"||last4 == "0010"||last4 == "0011"||last4 == "0012")
              {
                this.nav3 = true;
                this.nav2 = false;
                this.nav1 = false;
                this.nav0 = false;

                    this.office_name = p.name;
                    this.office_code = p.code;
                    this.office_id = p.id;
                    // this.save_btn = true;
                    this.cancel_btn = true;
                    this.sequence2 = true;
                    this.sequence2_1 = true;

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

                  var s1 = [];var s2 = [];var s3 = [];var s4 = [];var s5 = [];var s6 = [];
                  var s7 = [];var s8 = [];var s9 = [];var s10 = [];var s11 = [];var s12 = [];

                  var sw1 = [];var sw2 = [];var sw3 = [];var sw4 = [];var sw5 = [];var sw6 = [];
                  var sw7 = [];var sw8 = [];var sw9 = [];var sw10 = [];var sw11 = [];var sw12 = [];

                  let paramss1 = {
                    TEXT_SEARCH : first2+"0100",
                    OFFICE_ID : "" 
                  }
                  // console.log(paramss1)
                  this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramss1).then(list1=>{
                    // console.log(list1.RESPONSE_DATA);
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
                    // console.log(list8.RESPONSE_DATA);
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
                    // console.log(list10.RESPONSE_DATA);
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
                    // console.log(list12.RESPONSE_DATA);
                    if (list12.RESPONSE_DATA.length != 0){
                      s12 = list12.RESPONSE_DATA[0].OFFICE_NAME
                      sw12 = list12.RESPONSE_DATA[0].OFFICE_CODE;;
                    }


                    // console.log(s10);
                    // console.log(sw10);

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
                    //  console.log("10")
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

                      // console.log(this.tempData[0].header8)
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

                        console.log(s8)
                          
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

                  });
                });});});});});});});});});});});
              }

              //พื้นที่ : first(01-10) middle(01-12) last(00) //db(mas_office.office_name(shortBy:asc))
              else if(  middle2 == "01"||middle2 == "02"||middle2 == "03"||middle2 == "04"||middle2 == "05"||
                        middle2 == "06"||middle2 == "07"||middle2 == "08"||middle2 == "09"||middle2 == "10"||middle2 == "11"||middle2 == "12")
                    {
                      if(last2 == "00")
                        {

                          this.office_name = p.name;
                          this.office_code = p.code;
                          this.office_id = p.id;
                          this.vip = false;

                          // console.log("พื้นที่",this.offcode);

                          let paramsss = {
                            TEXT_SEARCH : this.office_name,
                            OFFICE_ID : "" 
                          }

                          this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramsss).then(lists=>{
                            console.log(lists.RESPONSE_DATA)
                            if(lists.RESPONSE_DATA.length == 1){
                              console.log("one")
                              this.cancel_btn = true;
                              this.nav1 = true;

                              this.nav2 = false;
                              this.nav2_1 = false;
                              this.nav2_2 = false;
                              this.product_type1 = true;
                              this.lawsult1 = true;
                              this.sequence1 = true;
                            }else  {
                              this.nav1 = true;
                              this.cancel_btn = true;
                              this.nav1 = true;
                              this.nav2 = false;
                              this.nav2_1 = false;
                              this.nav2_2 = false;
                              this.product_type2 = true;
                              this.lawsult2 = true;
                              this.sequence2 = true;
                              this.sequence2_1 = true;
                              console.log("multi")

                              
                              console.log(this.office_name);

                              // this.save_btn = true;
                              

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
                            
                            // console.log(name);
                            let paramss = {	TEXT_SEARCH : name}
                            this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramss).then(list=>{
                              // console.log(list.RESPONSE_DATA);
                              for(var i=0; i<list.RESPONSE_DATA.length;i++){
                                if ( list.RESPONSE_DATA[i].OFFICE_CODE !== this.offcode ){
                                  // console.log(list.RESPONSE_DATA[i].OFFICE_NAME);
                                  this.office_table.push({
                                    name : list.RESPONSE_DATA[i].OFFICE_NAME.substring(this.office_name.length+1)
                                  });

                                  this.office_id_table.push({
                                    name : list.RESPONSE_DATA[i].OFFICE_NAME
                                  });
                                }
                              }

                              // this.officetable(this.office_table);

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
                                  })

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
                              
                            });
                        
                            }
                          })


                        }
                      
                      //สาขา : first(01-10) middle(01-12) last(00-06) //db(mas_office.office_name(shortBy:asc))
                      else if(  last2 == "01"||last2 == "02"||last2 == "03"||last2 == "04"||last2 == "05"||last2 == "06"||
                                last2 == "07"||last2 == "08"||last2 == "09"||last2 == "10")
                            {

                              this.office_name = p.name;
                              this.office_code = p.code;
                              this.office_id = p.id;

                              // console.log(this.office_code);

                              this.cancel_btn = true;
                              this.nav1 = true;

                              this.nav2 = false;
                              this.nav2_1 = false;
                              this.nav2_2 = false;
                              this.product_type1 = true;
                              this.lawsult1 = true;
                              this.sequence1 = true;
                              this.vip = false;

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
                              // console.log("สาขา",this.offcode);
                            }
                    }
            
          }

    });
    
  }

  // สาขา/สตป
  //product condition---------------------------------------------------------------------------------------------------------------------------------
   selectOption(id: number) {
    this.product_group = id;
    
    
    const params = {TEXT_SEARCH :"",OFFICE_CODE : this.office_code};
    this.targetService.TargetListgetByKeyword(params).subscribe(list=>{
      // console.log(list)
    if (list.length == 0){
      this.sequence = 1;
      this.sum_qty = this.qty;
      this.sum_fine = this.fine
      this.save_btn = true;
      this.box2 = true;
    }

    if( this.product_group  == 1 && this.lawsult_type == 1){
      // console.log("product: 1  type: 1");
      var sum = 1;
      this.sequence = 1;
      this.sum_qty = this.qty;
      this.sum_fine = this.fine
      this.save_btn = true;
      this.box2 = true;

      for(var i=0; i<list.length; i++){
        if(list[i].PRODUCT_GROUP_NAME == this.product_group1 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type1 && list[i].IS_ACTIVE == 1 && list[i].OFFICE_NAME == this.office_name){

          if(list[i].BUDGET_YEAR == this.year){
            //sequence
              if(sum <= list[i].SEQUENCE){
                sum = list[i].SEQUENCE+1;
                this.sequence = sum;
              }
          }
      }}}

  else  if( this.product_group  == 1 && this.lawsult_type == 2){
      // console.log("product: 1  type: 2");
      var sum = 1;
      this.sequence = 1;
      this.sum_qty = this.qty;
      this.sum_fine = this.fine
      this.save_btn = true;
      this.box2 = true;

      for(var i=0; i<list.length; i++){
        if(list[i].PRODUCT_GROUP_NAME == this.product_group1 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type2 && list[i].IS_ACTIVE == 1 && list[i].OFFICE_NAME == this.office_name){

            if(list[i].BUDGET_YEAR == this.year){
              //sequence
                if(sum <= list[i].SEQUENCE){
                  sum = list[i].SEQUENCE+1;
                  this.sequence = sum;
                }
            }
      }}}

  else  if( this.product_group  == 1 && this.lawsult_type == 3){
      // console.log("product: 1  type: 3");
      var sum = 1;
      this.sequence = 1;
      this.sum_qty = this.qty;
      this.sum_fine = this.fine
      this.save_btn = true;
      this.box2 = true;

      for(var i=0; i<list.length; i++){
        if(list[i].PRODUCT_GROUP_NAME == this.product_group1 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type3 && list[i].IS_ACTIVE == 1 && list[i].OFFICE_NAME == this.office_name){

          if(list[i].BUDGET_YEAR == this.year){
            //sequence
              if(sum <= list[i].SEQUENCE){
                sum = list[i].SEQUENCE+1;
                this.sequence = sum;
              }
          }
      }}}

  else  if( this.product_group  == 2 && this.lawsult_type == 1){
      // console.log("product: 2  type: 1");
      var sum = 1;
      this.sequence = 1;
      this.sum_qty = this.qty;
      this.sum_fine = this.fine
      this.save_btn = true;
      this.box2 = true;

      for(var i=0; i<list.length; i++){
        if(list[i].PRODUCT_GROUP_NAME == this.product_group2 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type1 && list[i].IS_ACTIVE == 1 && list[i].OFFICE_NAME == this.office_name){

          if(list[i].BUDGET_YEAR == this.year){
            //sequence
              if(sum <= list[i].SEQUENCE){
                sum = list[i].SEQUENCE+1;
                this.sequence = sum;
              }
          }
      }}}
    
  else  if( this.product_group  == 2 && this.lawsult_type == 2){
      // console.log("product: 2  type: 2");
      var sum = 1;
      this.sequence = 1;
      this.sum_qty = this.qty;
      this.sum_fine = this.fine
      this.save_btn = true;
      this.box2 = true;

      for(var i=0; i<list.length; i++){
        if(list[i].PRODUCT_GROUP_NAME == this.product_group2 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type2 && list[i].IS_ACTIVE == 1 && list[i].OFFICE_NAME == this.office_name){

          if(list[i].BUDGET_YEAR == this.year){
            //sequence
              if(sum <= list[i].SEQUENCE){
                sum = list[i].SEQUENCE+1;
                this.sequence = sum;
              }
          }
      }}}
    
  else  if( this.product_group  == 2 && this.lawsult_type == 3){
      // console.log("product: 2  type: 3");
      var sum = 1;
      this.sequence = 1;
      this.sum_qty = this.qty;
      this.sum_fine = this.fine
      this.save_btn = true;
      this.box2 = true;

      for(var i=0; i<list.length; i++){
        if(list[i].PRODUCT_GROUP_NAME == this.product_group2 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type3 && list[i].IS_ACTIVE == 1 && list[i].OFFICE_NAME == this.office_name){

          if(list[i].BUDGET_YEAR == this.year){
            //sequence
              if(sum <= list[i].SEQUENCE){
                sum = list[i].SEQUENCE+1;
                this.sequence = sum;
              }
          }
      }}}
    
  else  if( this.product_group  == 3 && this.lawsult_type == 1){
      // console.log("product: 3  type: 1");
      var sum = 1;
      this.sequence = 1;
      this.sum_qty = this.qty;
      this.sum_fine = this.fine
      this.save_btn = true;
      this.box2 = true;

      for(var i=0; i<list.length; i++){
        if(list[i].PRODUCT_GROUP_NAME == this.product_group3 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type1 && list[i].IS_ACTIVE == 1 && list[i].OFFICE_NAME == this.office_name){

          if(list[i].BUDGET_YEAR == this.year){
            //sequence
              if(sum <= list[i].SEQUENCE){
                sum = list[i].SEQUENCE+1;
                this.sequence = sum;
              }
          }
      }}}

  else  if( this.product_group  == 3 && this.lawsult_type == 2){
      // console.log("product: 3  type: 2");
      var sum = 1;
      this.sequence = 1;
      this.sum_qty = this.qty;
      this.sum_fine = this.fine
      this.save_btn = true;
      this.box2 = true;

      for(var i=0; i<list.length; i++){
        if(list[i].PRODUCT_GROUP_NAME == this.product_group3 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type2 && list[i].IS_ACTIVE == 1 && list[i].OFFICE_NAME == this.office_name){

          if(list[i].BUDGET_YEAR == this.year){
            //sequence
              if(sum <= list[i].SEQUENCE){
                sum = list[i].SEQUENCE+1;
                this.sequence = sum;
              }
          }
      }}}

  else if( this.product_group  == 3 && this.lawsult_type == 3){
      // console.log("product: 3  type: 3");
      var sum = 1;
      this.sequence = 1;
      this.sum_qty = this.qty;
      this.sum_fine = this.fine
      this.save_btn = true;
      this.box2 = true;

      for(var i=0; i<list.length; i++){
        if(list[i].PRODUCT_GROUP_NAME == this.product_group3 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type3 && list[i].IS_ACTIVE == 1 && list[i].OFFICE_NAME == this.office_name){

          if(list[i].BUDGET_YEAR == this.year){
            //sequence
              if(sum <= list[i].SEQUENCE){
                sum = list[i].SEQUENCE+1;
                this.sequence = sum;
              }
          }
      }}}

  else  if( this.product_group  == 4 && this.lawsult_type == 1){
      // console.log("product: 4  type: 1");
      var sum = 1;
      this.sequence = 1;
      this.sum_qty = this.qty;
      this.sum_fine = this.fine
      this.save_btn = true;
      this.box2 = true;

      for(var i=0; i<list.length; i++){
        if(list[i].PRODUCT_GROUP_NAME == this.product_group4 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type1 && list[i].IS_ACTIVE == 1 && list[i].OFFICE_NAME == this.office_name){

          if(list[i].BUDGET_YEAR == this.year){
              console.log(list[i].SEQUENCE);

              if(sum <= list[i].SEQUENCE){
                sum = list[i].SEQUENCE+1;
                this.sequence = sum;
                console.log(sum);
              }
          }
      }}}

  else if( this.product_group  == 4 && this.lawsult_type == 2){
      // console.log("product: 4  type: 2");
      var sum = 1;
      this.sequence = 1;
      this.sum_qty = this.qty;
      this.sum_fine = this.fine
      this.save_btn = true;
      this.box2 = true;

      for(var i=0; i<list.length; i++){
        if(list[i].PRODUCT_GROUP_NAME == this.product_group4 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type2 && list[i].IS_ACTIVE == 1 && list[i].OFFICE_NAME == this.office_name){

          if(list[i].BUDGET_YEAR == this.year){
            //sequence
              if(sum <= list[i].SEQUENCE){
                sum = list[i].SEQUENCE+1;
                this.sequence = sum;
              }
          }
      }}}

  else  if( this.product_group  == 4 && this.lawsult_type == 3){
      // console.log("product: 4  type: 3");
      var sum = 1;
      this.sequence = 1;
      this.sum_qty = this.qty;
      this.sum_fine = this.fine
      this.save_btn = true;
      this.box2 = true;

      for(var i=0; i<list.length; i++){
        if(list[i].PRODUCT_GROUP_NAME == this.product_group4 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type3 && list[i].IS_ACTIVE == 1 && list[i].OFFICE_NAME == this.office_name){

          if(list[i].BUDGET_YEAR == this.year){
            //sequence
              if(sum <= list[i].SEQUENCE){
                sum = list[i].SEQUENCE+1;
                this.sequence = sum;
              }
          }
      }}}
  });

  }
  //type condition---------------------------------------------------------------------------------------------------------------------------------
   selectOptions(id: number) {
    this.lawsult_type = id;
    this.year = ""+this.total_year;
    
    const params = {TEXT_SEARCH :"",OFFICE_CODE : this.office_code};
    this.targetService.TargetListgetByKeyword(params).subscribe(list=>{

    if(list.length ==0){
      this.sequence = 1;
      this.sum_qty = this.qty;
      this.sum_fine = this.fine
      this.save_btn = true;
      this.box2 = true;
    }
    
    if( this.lawsult_type  == 1 && this.product_group == 1){
      // console.log("lawsult_type: 1  product_group: 1");
      var sum = 1;
      this.sequence = 1;
      this.sum_qty = this.qty;
      this.sum_fine = this.fine
      this.save_btn = true;
      this.box2 = true;

      for(var i=0; i<list.length; i++){
        if( list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type1  && list[i].PRODUCT_GROUP_NAME == this.product_group1 && list[i].IS_ACTIVE == 1 && list[i].OFFICE_NAME == this.office_name){

          if(list[i].BUDGET_YEAR == this.year){
            //sequence
              if(sum <= list[i].SEQUENCE){
                sum = list[i].SEQUENCE+1;
                this.sequence = sum;
              }
          }
      }}}

    else  if( this.lawsult_type  == 1 && this.product_group == 2){
      // console.log("product: 1  type: 2");
      var sum = 1;
      this.sequence = 1;
      this.sum_qty = this.qty;
      this.sum_fine = this.fine
      this.save_btn = true;
      this.box2 = true;

      for(var i=0; i<list.length; i++){
        if(list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type1 && list[i].PRODUCT_GROUP_NAME == this.product_group2 && list[i].IS_ACTIVE == 1 && list[i].OFFICE_NAME == this.office_name){

          if(list[i].BUDGET_YEAR == this.year){
            //sequence
              if(sum <= list[i].SEQUENCE){
                sum = list[i].SEQUENCE+1;
                this.sequence = sum;
              }
          }
      }}}

    else  if( this.lawsult_type  == 1 && this.product_group == 3){
      // console.log("product: 1  type: 3");
      var sum = 1;
      this.sequence = 1;
      this.sum_qty = this.qty;
      this.sum_fine = this.fine
      this.save_btn = true;
      this.box2 = true;

      for(var i=0; i<list.length; i++){
        if( list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type1 && list[i].PRODUCT_GROUP_NAME == this.product_group3 && list[i].IS_ACTIVE == 1 && list[i].OFFICE_NAME == this.office_name){

          if(list[i].BUDGET_YEAR == this.year){
            //sequence
              if(sum <= list[i].SEQUENCE){
                sum = list[i].SEQUENCE+1;
                this.sequence = sum;
              }
          }
      }}}

    else  if( this.lawsult_type  == 1 && this.product_group == 4){
      // console.log("product: 2  type: 1");
      var sum = 1;
      this.sequence = 1;
      this.sum_qty = this.qty;
      this.sum_fine = this.fine
      this.save_btn = true;
      this.box2 = true;

      for(var i=0; i<list.length; i++){
        if( list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type1 && list[i].PRODUCT_GROUP_NAME == this.product_group4 && list[i].IS_ACTIVE == 1 && list[i].OFFICE_NAME == this.office_name){

          if(list[i].BUDGET_YEAR == this.year){
            //sequence
              if(sum <= list[i].SEQUENCE){
                sum = list[i].SEQUENCE+1;
                this.sequence = sum;
              }
          }
      }}}
    
    else  if( this.lawsult_type  == 2 && this.product_group == 1){
      // console.log("product: 2  type: 2");
      var sum = 1;
      this.sequence = 1;
      this.sum_qty = this.qty;
      this.sum_fine = this.fine
      this.save_btn = true;
      this.box2 = true;

      for(var i=0; i<list.length; i++){
        if( list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type2 && list[i].PRODUCT_GROUP_NAME == this.product_group1 && list[i].IS_ACTIVE == 1 && list[i].OFFICE_NAME == this.office_name){

          if(list[i].BUDGET_YEAR == this.year){
            //sequence
              if(sum <= list[i].SEQUENCE){
                sum = list[i].SEQUENCE+1;
                this.sequence = sum;
              }
          }
      }}}
    
    else  if( this.lawsult_type  == 2 && this.product_group == 2){
      // console.log("product: 2  type: 3");
      var sum = 1;
      this.sequence = 1;
      this.sum_qty = this.qty;
      this.sum_fine = this.fine
      this.save_btn = true;
      this.box2 = true;

      for(var i=0; i<list.length; i++){
        if( list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type2 && list[i].PRODUCT_GROUP_NAME == this.product_group2 && list[i].IS_ACTIVE == 1 && list[i].OFFICE_NAME == this.office_name){

          if(list[i].BUDGET_YEAR == this.year){
            //sequence
              if(sum <= list[i].SEQUENCE){
                sum = list[i].SEQUENCE+1;
                this.sequence = sum;
              }
          }
      }}}
    
    else  if( this.lawsult_type  == 2 && this.product_group == 3){
      // console.log("product: 3  type: 1");
      var sum = 1;
      this.sequence = 1;
      this.sum_qty = this.qty;
      this.sum_fine = this.fine
      this.save_btn = true;
      this.box2 = true;

      for(var i=0; i<list.length; i++){
        if( list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type2 && list[i].PRODUCT_GROUP_NAME == this.product_group3 && list[i].IS_ACTIVE == 1 && list[i].OFFICE_NAME == this.office_name){

          if(list[i].BUDGET_YEAR == this.year){
            //sequence
              if(sum <= list[i].SEQUENCE){
                sum = list[i].SEQUENCE+1;
                this.sequence = sum;
              }
          }
      }}}

    else  if( this.lawsult_type  == 2 && this.product_group == 4){
      // console.log("product: 3  type: 2");
      var sum = 1;
      this.sequence = 1;
      this.sum_qty = this.qty;
      this.sum_fine = this.fine
      this.save_btn = true;
      this.box2 = true;

      for(var i=0; i<list.length; i++){
        if(list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type2 && list[i].PRODUCT_GROUP_NAME == this.product_group4 &&  list[i].IS_ACTIVE == 1 && list[i].OFFICE_NAME == this.office_name){

          if(list[i].BUDGET_YEAR == this.year){
            //sequence
              if(sum <= list[i].SEQUENCE){
                sum = list[i].SEQUENCE+1;
                this.sequence = sum;
              }
          }
      }}}

    else  if( this.lawsult_type  == 3 && this.product_group == 1){
      // console.log("product: 3  type: 3");
      var sum = 1;
      this.sequence = 1;
      this.sum_qty = this.qty;
      this.sum_fine = this.fine
      this.save_btn = true;
      this.box2 = true;

      for(var i=0; i<list.length; i++){
        if( list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type3 && list[i].PRODUCT_GROUP_NAME == this.product_group1 && list[i].IS_ACTIVE == 1 && list[i].OFFICE_NAME == this.office_name){

          if(list[i].BUDGET_YEAR == this.year){
            //sequence
              if(sum <= list[i].SEQUENCE){
                sum = list[i].SEQUENCE+1;
                this.sequence = sum;
              }
          }
      }}}

    else  if( this.lawsult_type  == 3 && this.product_group == 2){
      // console.log("product: 4  type: 1");
      var sum = 1;
      this.sequence = 1;
      this.sum_qty = this.qty;
      this.sum_fine = this.fine
      this.save_btn = true;
      this.box2 = true;

      for(var i=0; i<list.length; i++){
        if( list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type3 && list[i].PRODUCT_GROUP_NAME == this.product_group2 && list[i].IS_ACTIVE == 1 && list[i].OFFICE_NAME == this.office_name){

          if(list[i].BUDGET_YEAR == this.year){
            //sequence
              if(sum <= list[i].SEQUENCE){
                sum = list[i].SEQUENCE+1;
                this.sequence = sum;
              }
          }
      }}}

    else  if( this.lawsult_type  == 3 && this.product_group == 3){
      // console.log("product: 4  type: 2");
      var sum = 1;
      this.sequence = 1;
      this.sum_qty = this.qty;
      this.sum_fine = this.fine
      this.save_btn = true;
      this.box2 = true;

      for(var i=0; i<list.length; i++){
        if( list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type3 && list[i].PRODUCT_GROUP_NAME == this.product_group3 && list[i].IS_ACTIVE == 1 && list[i].OFFICE_NAME == this.office_name){

          if(list[i].BUDGET_YEAR == this.year){
            //sequence
              if(sum <= list[i].SEQUENCE){
                sum = list[i].SEQUENCE+1;
                this.sequence = sum;
              }
          }
      }}}

    else  if( this.lawsult_type  == 3 && this.product_group == 4){
      // console.log("product: 4  type: 3");
      var sum = 1;
      this.sequence = 1;
      this.sum_qty = this.qty;
      this.sum_fine = this.fine
      this.save_btn = true;
      this.box2 = true;

      for(var i=0; i<list.length; i++){
        if( list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type3 && list[i].PRODUCT_GROUP_NAME == this.product_group4 && list[i].IS_ACTIVE == 1 && list[i].OFFICE_NAME == this.office_name){

          if(list[i].BUDGET_YEAR == this.year){
            //sequence
              if(sum <= list[i].SEQUENCE){
                sum = list[i].SEQUENCE+1;
                this.sequence = sum;
              }
          }
      }}}
    });
  
  }

  // พื้นที่
   //product condition---------------------------------------------------------------------------------------------------------------------------------
  selectOption2(id: number) {
    
    this.product_group = id;
    this.targetTotal = false;
    this.list_sequence = [];
    this.sum_sequence = 1;
    this.sequence2_1 = true;
    this.sequence2_2 = false;
    this.box3 = false;
    this.year = this.total_year;
    this.sum_qty = this.qty;
    this.sum_fine = this.fine;
    const params = {TEXT_SEARCH :"",OFFICE_CODE : this.office_code};
    this.targetService.TargetListgetByKeyword(params).subscribe(list=>{

    if( this.product_group == 1 && this.lawsult_type == 1){
      // console.log("product: 1  type: 1");
          for(var i=0; i<list.length; i++){
            if( list[i].PRODUCT_GROUP_NAME == this.product_group1 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type1 && 
                list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1 && list[i].BUDGET_YEAR == this.year){
                      if(this.sum_sequence <= list[i].SEQUENCE){
                        this.sum_sequence =  list[i].SEQUENCE;
              }}
        }
       
        if (list.length == 0){
          this.box3 = false;
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          this.list_sequence.push({
                name : 1
              });

        }else{
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          for (var i=0; i< this.sum_sequence; i++){
          this.list_sequence.push({name : i+1 });
          }
        }
      }

    else if( this.product_group == 1 && this.lawsult_type == 2){
      // console.log("product: 1  type: 2");
          for(var i=0; i<list.length; i++){
            if( list[i].PRODUCT_GROUP_NAME == this.product_group1 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type2 && 
                list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1 && list[i].BUDGET_YEAR == this.year){
                      if(this.sum_sequence <= list[i].SEQUENCE){
                        this.sum_sequence =  list[i].SEQUENCE;
              }}
        }
       
        if (list.length == 0){
          this.box3 = false;
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          this.list_sequence.push({
                name : 1
              });

        }else{
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          for (var i=0; i< this.sum_sequence; i++){
          this.list_sequence.push({name : i+1 });
          }
        }
      }

    else if( this.product_group == 1 && this.lawsult_type == 3){
      // console.log("product: 1  type: 3");
          for(var i=0; i<list.length; i++){
            if( list[i].PRODUCT_GROUP_NAME == this.product_group1 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type3 && 
                list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1 && list[i].BUDGET_YEAR == this.year){
                      if(this.sum_sequence <= list[i].SEQUENCE){
                        this.sum_sequence =  list[i].SEQUENCE;
              }}
        }
       
        if (list.length == 0){
          this.box3 = false;
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          this.list_sequence.push({
                name : 1
              });

        }else{
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          for (var i=0; i< this.sum_sequence; i++){
          this.list_sequence.push({name : i+1 });
          }
        }
      }
    
    else if( this.product_group == 2 && this.lawsult_type == 1){
      // console.log("product: 2  type: 1");
          for(var i=0; i<list.length; i++){
            if( list[i].PRODUCT_GROUP_NAME == this.product_group2 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type1 && 
                list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1 && list[i].BUDGET_YEAR == this.year){
                      if(this.sum_sequence <= list[i].SEQUENCE){
                        this.sum_sequence =  list[i].SEQUENCE;
              }}
        }
       
        if (list.length == 0){
          this.box3 = false;
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          this.list_sequence.push({
                name : 1
              });

        }else{
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          for (var i=0; i< this.sum_sequence; i++){
          this.list_sequence.push({name : i+1 });
          }
        }
      }
    
    else if( this.product_group == 2 && this.lawsult_type == 2){
      // console.log("product: 2  type: 2");
          for(var i=0; i<list.length; i++){
            if( list[i].PRODUCT_GROUP_NAME == this.product_group2 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type2 && 
                list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1 && list[i].BUDGET_YEAR == this.year){
                      if(this.sum_sequence <= list[i].SEQUENCE){
                        this.sum_sequence =  list[i].SEQUENCE;
              }}
        }
       
        if (list.length == 0){
          this.box3 = false;
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          this.list_sequence.push({
                name : 1
              });

        }else{
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          for (var i=0; i< this.sum_sequence; i++){
          this.list_sequence.push({name : i+1 });
          }
        }
      }

    else if( this.product_group == 2 && this.lawsult_type == 3){
      // console.log("product: 2  type: 3");
          for(var i=0; i<list.length; i++){
            if( list[i].PRODUCT_GROUP_NAME == this.product_group2 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type3 && 
                list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1 && list[i].BUDGET_YEAR == this.year){
                      if(this.sum_sequence <= list[i].SEQUENCE){
                        this.sum_sequence =  list[i].SEQUENCE;
              }}
        }
       
        if (list.length == 0){
          this.box3 = false;
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          this.list_sequence.push({
                name : 1
              });

        }else{
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          for (var i=0; i< this.sum_sequence; i++){
          this.list_sequence.push({name : i+1 });
          }
        }
      }
    
    else if( this.product_group == 3 && this.lawsult_type == 1){
      // console.log("product: 3  type: 1");
          for(var i=0; i<list.length; i++){
            if( list[i].PRODUCT_GROUP_NAME == this.product_group3 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type1 && 
                list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1 && list[i].BUDGET_YEAR == this.year){
                      if(this.sum_sequence <= list[i].SEQUENCE){
                        this.sum_sequence =  list[i].SEQUENCE;
              }}
        }
       
        if (list.length == 0){
          this.box3 = false;
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          this.list_sequence.push({
                name : 1
              });

        }else{
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          for (var i=0; i< this.sum_sequence; i++){
          this.list_sequence.push({name : i+1 });
          }
        }
      }

    else if( this.product_group == 3 && this.lawsult_type == 2){
      // console.log("product: 3  type: 2");
          for(var i=0; i<list.length; i++){
            if( list[i].PRODUCT_GROUP_NAME == this.product_group3 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type2 && 
                list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1 && list[i].BUDGET_YEAR == this.year){
                      if(this.sum_sequence <= list[i].SEQUENCE){
                        this.sum_sequence =  list[i].SEQUENCE;
              }}
        }
       
        if (list.length == 0){
          this.box3 = false;
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          this.list_sequence.push({
                name : 1
              });

        }else{
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          for (var i=0; i< this.sum_sequence; i++){
          this.list_sequence.push({name : i+1 });
          }
        }
      }
    
    else if( this.product_group == 3 && this.lawsult_type == 3){
      // console.log("product: 3  type: 3");
          for(var i=0; i<list.length; i++){
            if( list[i].PRODUCT_GROUP_NAME == this.product_group3 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type3 && 
                list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1 && list[i].BUDGET_YEAR == this.year){
                      if(this.sum_sequence <= list[i].SEQUENCE){
                        this.sum_sequence =  list[i].SEQUENCE;
              }}
        }
       
        if (list.length == 0){
          this.box3 = false;
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          this.list_sequence.push({
                name : 1
              });

        }else{
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          for (var i=0; i< this.sum_sequence; i++){
          this.list_sequence.push({name : i+1 });
          }
        }
      }
    
    else if( this.product_group == 4 && this.lawsult_type == 1){
      // console.log("product: 4  type: 1");
          for(var i=0; i<list.length; i++){
            if( list[i].PRODUCT_GROUP_NAME == this.product_group4 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type1 && 
                list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1 && list[i].BUDGET_YEAR == this.year){
                      if(this.sum_sequence <= list[i].SEQUENCE){
                        this.sum_sequence =  list[i].SEQUENCE;
              }}
        }
       
        if (list.length == 0){
          this.box3 = false;
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          this.list_sequence.push({
                name : 1
              });

        }else{
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          for (var i=0; i< this.sum_sequence; i++){
          this.list_sequence.push({name : i+1 });
          }
        }
      }
    
    else if( this.product_group == 4 && this.lawsult_type == 2){
      // console.log("product: 4  type: 2");
          for(var i=0; i<list.length; i++){
            if( list[i].PRODUCT_GROUP_NAME == this.product_group4 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type2 && 
                list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1 && list[i].BUDGET_YEAR == this.year){
                      if(this.sum_sequence <= list[i].SEQUENCE){
                        this.sum_sequence =  list[i].SEQUENCE;
              }}
        }
       
        if (list.length == 0){
          this.box3 = false;
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          this.list_sequence.push({
                name : 1
              });

        }else{
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          for (var i=0; i< this.sum_sequence; i++){
          this.list_sequence.push({name : i+1 });
          }
        }
      }
    
    else if( this.product_group == 4 && this.lawsult_type == 3){
      // console.log("product: 4  type: 3");
          for(var i=0; i<list.length; i++){
            if( list[i].PRODUCT_GROUP_NAME == this.product_group4 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type3 && 
                list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1 && list[i].BUDGET_YEAR == this.year){
                      if(this.sum_sequence <= list[i].SEQUENCE){
                        this.sum_sequence =  list[i].SEQUENCE;
              }}
        }
       
        if (list.length == 0){
          this.box3 = false;
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          this.list_sequence.push({
                name : 1
              });

        }else{
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          for (var i=0; i< this.sum_sequence; i++){
          this.list_sequence.push({name : i+1 });
          }
        }
      }

    });

  }
  //type condition---------------------------------------------------------------------------------------------------------------------------------
  selectOptions2(id: number) {
    // console.log(this.year)
    this.lawsult_type = id;
    this.list_sequence = [];
    this.targetTotal = false;
    this.sum_sequence = 1;
    this.sequence2_1 = true;
    this.sequence2_2 = false;
    this.box3 = false;
    this.year = this.total_year;
    this.sum_qty = this.qty;
    this.sum_fine = this.fine;
    const params = {TEXT_SEARCH :"",OFFICE_CODE : this.office_code};
    this.targetService.TargetListgetByKeyword(params).subscribe(list=>{

    if( this.product_group == 1 && this.lawsult_type == 1){
      // console.log("product: 1  type: 1");
          for(var i=0; i<list.length; i++){
            if( list[i].PRODUCT_GROUP_NAME == this.product_group1 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type1 && 
                list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1 && list[i].BUDGET_YEAR == this.year){
                      if(this.sum_sequence <= list[i].SEQUENCE){
                        this.sum_sequence =  list[i].SEQUENCE;
              }}
        }
       
        if (list.length == 0){
          this.box3 = false;
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          this.list_sequence.push({
                name : 1
              });

        }else{
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          for (var i=0; i< this.sum_sequence; i++){
          this.list_sequence.push({name : i+1 });
          }
        }
      }

    else if( this.product_group == 1 && this.lawsult_type == 2){
      // console.log("product: 1  type: 2");
          for(var i=0; i<list.length; i++){
            if( list[i].PRODUCT_GROUP_NAME == this.product_group1 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type2 && 
                list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1 && list[i].BUDGET_YEAR == this.year){
                      if(this.sum_sequence <= list[i].SEQUENCE){
                        this.sum_sequence =  list[i].SEQUENCE;
              }}
        }
       
        if (list.length == 0){
          this.box3 = false;
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          this.list_sequence.push({
                name : 1
              });

        }else{
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          for (var i=0; i< this.sum_sequence; i++){
          this.list_sequence.push({name : i+1 });
          }
        }
      }

    else if( this.product_group == 1 && this.lawsult_type == 3){
      // console.log("product: 1  type: 3");
          for(var i=0; i<list.length; i++){
            if( list[i].PRODUCT_GROUP_NAME == this.product_group1 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type3 && 
                list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1 && list[i].BUDGET_YEAR == this.year){
                      if(this.sum_sequence <= list[i].SEQUENCE){
                        this.sum_sequence =  list[i].SEQUENCE;
              }}
        }
       
        if (list.length == 0){
          this.box3 = false;
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          this.list_sequence.push({
                name : 1
              });

        }else{
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          for (var i=0; i< this.sum_sequence; i++){
          this.list_sequence.push({name : i+1 });
          }
        }
      }
    
    else if( this.product_group == 2 && this.lawsult_type == 1){
      // console.log("product: 2  type: 1");
          for(var i=0; i<list.length; i++){
            if( list[i].PRODUCT_GROUP_NAME == this.product_group2 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type1 && 
                list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1 && list[i].BUDGET_YEAR == this.year){
                      if(this.sum_sequence <= list[i].SEQUENCE){
                        this.sum_sequence =  list[i].SEQUENCE;
              }}
        }
       
        if (list.length == 0){
          this.box3 = false;
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          this.list_sequence.push({
                name : 1
              });

        }else{
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          for (var i=0; i< this.sum_sequence; i++){
          this.list_sequence.push({name : i+1 });
          }
        }
      }
    
    else if( this.product_group == 2 && this.lawsult_type == 2){
      // console.log("product: 2  type: 2");
          for(var i=0; i<list.length; i++){
            if( list[i].PRODUCT_GROUP_NAME == this.product_group2 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type2 && 
                list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1 && list[i].BUDGET_YEAR == this.year){
                      if(this.sum_sequence <= list[i].SEQUENCE){
                        this.sum_sequence =  list[i].SEQUENCE;
              }}
        }
       
        if (list.length == 0){
          this.box3 = false;
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          this.list_sequence.push({
                name : 1
              });

        }else{
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          for (var i=0; i< this.sum_sequence; i++){
          this.list_sequence.push({name : i+1 });
          }
        }
      }

    else if( this.product_group == 2 && this.lawsult_type == 3){
      // console.log("product: 2  type: 3");
          for(var i=0; i<list.length; i++){
            if( list[i].PRODUCT_GROUP_NAME == this.product_group2 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type3 && 
                list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1 && list[i].BUDGET_YEAR == this.year){
                      if(this.sum_sequence <= list[i].SEQUENCE){
                        this.sum_sequence =  list[i].SEQUENCE;
              }}
        }
       
        if (list.length == 0){
          this.box3 = false;
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          this.list_sequence.push({
                name : 1
              });

        }else{
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          for (var i=0; i< this.sum_sequence; i++){
          this.list_sequence.push({name : i+1 });
          }
        }
      }
    
    else if( this.product_group == 3 && this.lawsult_type == 1){
      // console.log("product: 3  type: 1");
          for(var i=0; i<list.length; i++){
            if( list[i].PRODUCT_GROUP_NAME == this.product_group3 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type1 && 
                list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1 && list[i].BUDGET_YEAR == this.year){
                      if(this.sum_sequence <= list[i].SEQUENCE){
                        this.sum_sequence =  list[i].SEQUENCE;
              }}
        }
       
        if (list.length == 0){
          this.box3 = false;
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          this.list_sequence.push({
                name : 1
              });

        }else{
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          for (var i=0; i< this.sum_sequence; i++){
          this.list_sequence.push({name : i+1 });
          }
        }
      }

    else if( this.product_group == 3 && this.lawsult_type == 2){
      // console.log("product: 3  type: 2");
          for(var i=0; i<list.length; i++){
            if( list[i].PRODUCT_GROUP_NAME == this.product_group3 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type2 && 
                list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1 && list[i].BUDGET_YEAR == this.year){
                      if(this.sum_sequence <= list[i].SEQUENCE){
                        this.sum_sequence =  list[i].SEQUENCE;
              }}
        }
       
        if (list.length == 0){
          this.box3 = false;
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          this.list_sequence.push({
                name : 1
              });

        }else{
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          for (var i=0; i< this.sum_sequence; i++){
          this.list_sequence.push({name : i+1 });
          }
        }
      }
    
    else if( this.product_group == 3 && this.lawsult_type == 3){
      // console.log("product: 3  type: 3");
          for(var i=0; i<list.length; i++){
            if( list[i].PRODUCT_GROUP_NAME == this.product_group3 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type3 && 
                list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1 && list[i].BUDGET_YEAR == this.year){
                      if(this.sum_sequence <= list[i].SEQUENCE){
                        this.sum_sequence =  list[i].SEQUENCE;
              }}
        }
       
        if (list.length == 0){
          this.box3 = false;
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          this.list_sequence.push({
                name : 1
              });

        }else{
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          for (var i=0; i< this.sum_sequence; i++){
          this.list_sequence.push({name : i+1 });
          }
        }
      }
    
    else if( this.product_group == 4 && this.lawsult_type == 1){
      // console.log("product: 4  type: 1");
          for(var i=0; i<list.length; i++){
            if( list[i].PRODUCT_GROUP_NAME == this.product_group4 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type1 && 
                list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1 && list[i].BUDGET_YEAR == this.year){
                      if(this.sum_sequence <= list[i].SEQUENCE){
                        this.sum_sequence =  list[i].SEQUENCE;
              }}
        }
       
        if (list.length == 0){
          this.box3 = false;
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          this.list_sequence.push({
                name : 1
              });

        }else{
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          for (var i=0; i< this.sum_sequence; i++){
          this.list_sequence.push({name : i+1 });
          }
        }
      }
    
    else if( this.product_group == 4 && this.lawsult_type == 2){
      // console.log("product: 4  type: 2");
          for(var i=0; i<list.length; i++){
            if( list[i].PRODUCT_GROUP_NAME == this.product_group4 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type2 && 
                list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1 && list[i].BUDGET_YEAR == this.year){
                      if(this.sum_sequence <= list[i].SEQUENCE){
                        this.sum_sequence =  list[i].SEQUENCE;
              }}
        }
       
        if (list.length == 0){
          this.box3 = false;
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          this.list_sequence.push({
                name : 1
              });

        }else{
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          for (var i=0; i< this.sum_sequence; i++){
          this.list_sequence.push({name : i+1 });
          }
        }
      }
    
    else if( this.product_group == 4 && this.lawsult_type == 3){
      // console.log("product: 4  type: 3");
          for(var i=0; i<list.length; i++){
            if( list[i].PRODUCT_GROUP_NAME == this.product_group4 && list[i].LAWSUIT_TYPE_TARGET == this.lawsult_type3 && 
                list[i].IS_ACTIVE == 1 && list[i].IS_SEND == 1 && list[i].BUDGET_YEAR == this.year){
                      if(this.sum_sequence <= list[i].SEQUENCE){
                        this.sum_sequence =  list[i].SEQUENCE;
              }}
        }
       
        if (list.length == 0){
          this.box3 = false;
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          this.list_sequence.push({
                name : 1
              });

        }else{
          this.sequence2_1 = false;
          this.sequence2_2 = true;

          for (var i=0; i< this.sum_sequence; i++){
          this.list_sequence.push({name : i+1 });
          }
        }
      }

    });

  }
  //condition sequence---------------------------------------------------------------------------------------------------------------------------------
  event_sequence(num){
    this.sequence = num;
    this.targetTotal = false;
    // console.log('id',num);
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

    if (num == 0){
      this.box3 = false;

      this.sequence2_1 = false;
      this.sequence2_2 = true;

      this.list_sequence.push({
        name : 1
      });
      for (var i=0; i< 12; i++){
        this.tempDatas1[i].QTY = 0;this.tempDatas1[i].FINE = 0;this.tempDatas1[i].TRE = 0;this.tempDatas1[i].BRI = 0;this.tempDatas1[i].AWA = 0;
        this.tempDatas2[i].QTY = 0;this.tempDatas2[i].FINE = 0;this.tempDatas2[i].TRE = 0;this.tempDatas2[i].BRI = 0;this.tempDatas2[i].AWA = 0;
        this.tempDatas3[i].QTY = 0;this.tempDatas3[i].FINE = 0;this.tempDatas3[i].TRE = 0;this.tempDatas3[i].BRI = 0;this.tempDatas3[i].AWA = 0;
        this.tempDatas4[i].QTY = 0;this.tempDatas4[i].FINE = 0;this.tempDatas4[i].TRE = 0;this.tempDatas4[i].BRI = 0;this.tempDatas4[i].AWA = 0;
        this.tempDatas5[i].QTY = 0;this.tempDatas5[i].FINE = 0;this.tempDatas5[i].TRE = 0;this.tempDatas5[i].BRI = 0;this.tempDatas5[i].AWA = 0;
        this.tempDatas6[i].QTY = 0;this.tempDatas6[i].FINE = 0;this.tempDatas6[i].TRE = 0;this.tempDatas6[i].BRI = 0;this.tempDatas6[i].AWA = 0;
        this.tempDatas7[i].QTY = 0;this.tempDatas7[i].FINE = 0;this.tempDatas7[i].TRE = 0;this.tempDatas7[i].BRI = 0;this.tempDatas7[i].AWA = 0;
        this.tempDatas8[i].QTY = 0;this.tempDatas8[i].FINE = 0;this.tempDatas8[i].TRE = 0;this.tempDatas8[i].BRI = 0;this.tempDatas8[i].AWA = 0;
        this.tempDatas9[i].QTY = 0;this.tempDatas9[i].FINE = 0;this.tempDatas9[i].TRE = 0;this.tempDatas9[i].BRI = 0;this.tempDatas9[i].AWA = 0;
        this.tempDatas10[i].QTY = 0;this.tempDatas10[i].FINE = 0;this.tempDatas10[i].TRE = 0;this.tempDatas10[i].BRI = 0;this.tempDatas10[i].AWA = 0;
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
      }
    }
    else if (num != 0){
      this.box3 = false;

      this.sequence2_1 = false;
      this.sequence2_2 = true;

      const param = {
        TEXT_SEARCH: "",
        OFFICE_CODE: this.office_code
      };

      var pro = '';
      if (this.product_group == 1){
        pro = 'สุรา'
      }else if (this.product_group == 2){
        pro = 'ยาสูบ'
      }else if (this.product_group == 3){
        pro = 'ไพ่'
      }else if (this.product_group == 4){
        pro = 'สินค้าอื่นๆ'
      }

      var law ;
      if (this.lawsult_type == 1){
        law = 0
      }else if (this.lawsult_type == 2){
        law = 1
      }else if (this.lawsult_type == 3){
        law = 2
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
                    this.box3 = true;
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
                  this.box3 = true;
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
                        this.box3 = true;
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
                        this.box3 = true;
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
                        this.box3 = true;
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
                        this.box3 = true;
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
                        this.box3 = true;
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
                        this.box3 = true;
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
                        this.box3 = true;
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
                        this.box3 = true;
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
                    this.box3 = true;
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
                  this.box3 = true;
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
                        this.box3 = true;
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
                        this.box3 = true;
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
                        this.box3 = true;
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
                        this.box3 = true;
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
                        this.box3 = true;
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
                        this.box3 = true;
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
                        this.box3 = true;
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
                    this.box3 = true;
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
                  this.box3 = true;
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
                        this.box3 = true;
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
                        this.box3 = true;
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
                        this.box3 = true;
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
                        this.box3 = true;
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
                        this.box3 = true;
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
                        this.box3 = true;
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
                    this.box3 = true;
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
                  this.box3 = true;
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
                        this.box3 = true;
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
                        this.box3 = true;
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
                        this.box3 = true;
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
                        this.box3 = true;
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
                        this.box3 = true;
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
                    this.box3 = true;
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
                  this.box3 = true;
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
                        this.box3 = true;
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
                        this.box3 = true;
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
                        this.box3 = true;
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
                        this.box3 = true;
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
                    this.box3 = true;
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
                  this.box3 = true;
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
                        this.box3 = true;
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
                        this.box3 = true;
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
                        this.box3 = true;
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
                    this.box3 = true;
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
                  this.box3 = true;
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
                        this.box3 = true;
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
                        this.box3 = true;
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
                    this.box3 = true;
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
                  this.box3 = true;
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
                        this.box3 = true;
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
                    this.box3 = true;
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
                  this.box3 = true;
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
                    this.box3 = true;
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
    }

  }

  //ภาค
  //product condition------------------------------
  zoneoption(id: number){
    this.product_group = id;
    this.sum_sequence = 1;
    this.list_sequence = [];
    this.sequence2_1 = true;
    this.sequence2_2 = false;
    this.sum_qty = this.qty;
    this.sum_fine = this.fine;
    this.year = ""+this.total_year;
    var pro = '';
      if (this.product_group == 1){
        pro = 'สุรา'
      }else if (this.product_group == 2){
        pro = 'ยาสูบ'
      }else if (this.product_group == 3){
        pro = 'ไพ่'
      }else if (this.product_group == 4){
        pro = 'สินค้าอื่นๆ'
      }

      var law ;
      if (this.lawsult_type == 1){
        law = 0
      }else if (this.lawsult_type == 2){
        law = 1
      }else if (this.lawsult_type == 3){
        law = 2
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
        // console.log(param)
        this.targetService.TargetListgetByKeyword(param).subscribe(list1=>{
          // console.log(list1)
          if (list1.length == 0){
            this.sum_sequence = this.sum_sequence;
          }else {
            for(var i=0; i<list1.length; i++){
              if( list1[i].PRODUCT_GROUP_NAME == pro && list1[i].LAWSUIT_TYPE_TARGET == law && 
                list1[i].IS_ACTIVE == 1 && list1[i].IS_SEND == 1 && list1[i].BUDGET_YEAR == this.year){
                        if(this.sum_sequence <= list1[i].SEQUENCE){
                          this.sum_sequence =  list1[i].SEQUENCE;}
              }
            }
          }
          this.list_sequence = [];
          for ( var s = 0; s < this.sum_sequence; s++){
            this.list_sequence.push({name : s+1 });
          }

          if (law == null){
          this.sequence2_1 = true;
          this.sequence2_2 = false;
          }else{
              this.sequence2_1 = false;
              this.sequence2_2 = true;
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
                  if( list2[i].PRODUCT_GROUP_NAME == pro && list2[i].LAWSUIT_TYPE_TARGET == law && 
                    list2[i].IS_ACTIVE == 1 && list2[i].IS_SEND == 1 && list2[i].BUDGET_YEAR == this.year){
                            if(this.sum_sequence <= list2[i].SEQUENCE){
                              this.sum_sequence =  list2[i].SEQUENCE;}
                  }
                }
              }
              this.list_sequence = [];
              for ( var s = 0; s < this.sum_sequence; s++){
                this.list_sequence.push({name : s+1 });
              }
              if (law == null){
                this.sequence2_1 = true;
                this.sequence2_2 = false;
                }else{
                    this.sequence2_1 = false;
                    this.sequence2_2 = true;
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
                      if( list3[i].PRODUCT_GROUP_NAME == pro && list3[i].LAWSUIT_TYPE_TARGET == law && 
                        list3[i].IS_ACTIVE == 1 && list3[i].IS_SEND == 1 && list3[i].BUDGET_YEAR == this.year){
                                if(this.sum_sequence <= list3[i].SEQUENCE){
                                  this.sum_sequence =  list3[i].SEQUENCE;}
                      }
                    }
                  }
                  this.list_sequence = [];
                  for ( var s = 0; s < this.sum_sequence; s++){
                    this.list_sequence.push({name : s+1 });
                  }
                  if (law == null){
                    this.sequence2_1 = true;
                    this.sequence2_2 = false;
                    }else{
                        this.sequence2_1 = false;
                        this.sequence2_2 = true;
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
                          if( list4[i].PRODUCT_GROUP_NAME == pro && list4[i].LAWSUIT_TYPE_TARGET == law && 
                            list4[i].IS_ACTIVE == 1 && list4[i].IS_SEND == 1 && list4[i].BUDGET_YEAR == this.year){
                                    if(this.sum_sequence <= list4[i].SEQUENCE){
                                      this.sum_sequence =  list4[i].SEQUENCE;}
                          }
                        }
                      }
                      this.list_sequence = [];
                      for ( var s = 0; s < this.sum_sequence; s++){
                        this.list_sequence.push({name : s+1 });
                      }
                      if (law == null){
                        this.sequence2_1 = true;
                        this.sequence2_2 = false;
                        }else{
                            this.sequence2_1 = false;
                            this.sequence2_2 = true;
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
                              if( list5[i].PRODUCT_GROUP_NAME == pro && list5[i].LAWSUIT_TYPE_TARGET == law && 
                                list5[i].IS_ACTIVE == 1 && list5[i].IS_SEND == 1 && list5[i].BUDGET_YEAR == this.year){
                                        if(this.sum_sequence <= list5[i].SEQUENCE){
                                          this.sum_sequence =  list5[i].SEQUENCE;}
                              }
                            }
                          }
                          this.list_sequence = [];
                          for ( var s = 0; s < this.sum_sequence; s++){
                            this.list_sequence.push({name : s+1 });
                          }
                          if (law == null){
                            this.sequence2_1 = true;
                            this.sequence2_2 = false;
                            }else{
                                this.sequence2_1 = false;
                                this.sequence2_2 = true;
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
                                  if( list6[i].PRODUCT_GROUP_NAME == pro && list6[i].LAWSUIT_TYPE_TARGET == law && 
                                    list6[i].IS_ACTIVE == 1 && list6[i].IS_SEND == 1 && list6[i].BUDGET_YEAR == this.year){
                                            if(this.sum_sequence <= list6[i].SEQUENCE){
                                              this.sum_sequence =  list6[i].SEQUENCE;}
                                  }
                                }
                              }
                              this.list_sequence = [];
                                  for ( var s = 0; s < this.sum_sequence; s++){
                                    this.list_sequence.push({name : s+1 });
                                  }
                                  if (law == null){
                                    this.sequence2_1 = true;
                                    this.sequence2_2 = false;
                                    }else{
                                        this.sequence2_1 = false;
                                        this.sequence2_2 = true;
                                    }

                              if(this.condition_sepuence7 == 1){
                                // console.log(7);
                                const param = {
                                  TEXT_SEARCH : this.condition_zone[0].office7,
                                  OFFICE_CODE : this.condition_zone[0].office7
                                }
                                // console.log(param);
                                this.targetService.TargetListgetByKeyword(param).subscribe(list7=>{
                                  // console.log(list7)
                                  if (list7.length == 0){
                                    this.sum_sequence = this.sum_sequence;
                                  }else {
                                    for(var i=0; i<list6.length; i++){
                                      if( list7[i].PRODUCT_GROUP_NAME == pro && list7[i].LAWSUIT_TYPE_TARGET == law && 
                                        list7[i].IS_ACTIVE == 1 && list7[i].IS_SEND == 1 && list7[i].BUDGET_YEAR == this.year){
                                                if(this.sum_sequence <= list7[i].SEQUENCE){
                                                  this.sum_sequence =  list7[i].SEQUENCE;}
                                      }
                                    }
                                  }
                                  this.list_sequence = [];
                                  for ( var s = 0; s < this.sum_sequence; s++){
                                    this.list_sequence.push({name : s+1 });
                                  }
                                  if (law == null){
                                    this.sequence2_1 = true;
                                    this.sequence2_2 = false;
                                    }else{
                                        this.sequence2_1 = false;
                                        this.sequence2_2 = true;
                                    }
                                    // console.log(param)
                                    if(this.condition_sepuence8 == 1){
                                      // console.log(8);
                                      const param = {
                                        TEXT_SEARCH : this.condition_zone[0].office8,
                                        OFFICE_CODE : this.condition_zone[0].office8
                                      }
                                      console.log(param)
                                      this.targetService.TargetListgetByKeyword(param).subscribe(list8=>{
                                        console.log(list8)
                                        if (list8.length == 0){
                                          this.sum_sequence = this.sum_sequence;
                                        }else {
                                          for(var i=0; i<list8.length; i++){
                                            if( list8[i].PRODUCT_GROUP_NAME == pro && list8[i].LAWSUIT_TYPE_TARGET == law && 
                                              list8[i].IS_ACTIVE == 1 && list8[i].IS_SEND == 1 && list8[i].BUDGET_YEAR == this.year){
                                                      if(this.sum_sequence <= list8[i].SEQUENCE){
                                                        this.sum_sequence =  list8[i].SEQUENCE;}
                                            }
                                          }
                                        }
                                        this.list_sequence = [];
                                        for ( var s = 0; s < this.sum_sequence; s++){
                                          this.list_sequence.push({name : s+1 });
                                        }
                                        if (law == null){
                                          this.sequence2_1 = true;
                                          this.sequence2_2 = false;
                                          }else{
                                              this.sequence2_1 = false;
                                              this.sequence2_2 = true;
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
                                                if( list9[i].PRODUCT_GROUP_NAME == pro && list9[i].LAWSUIT_TYPE_TARGET == law && 
                                                  list9[i].IS_ACTIVE == 1 && list9[i].IS_SEND == 1 && list9[i].BUDGET_YEAR == this.year){
                                                          if(this.sum_sequence <= list9[i].SEQUENCE){
                                                            this.sum_sequence =  list9[i].SEQUENCE;}
                                                }
                                              }
                                            }
                                            this.list_sequence = [];
                                              for ( var s = 0; s < this.sum_sequence; s++){
                                                this.list_sequence.push({name : s+1 });
                                              }
                                              if (law == null){
                                                this.sequence2_1 = true;
                                                this.sequence2_2 = false;
                                                }else{
                                                    this.sequence2_1 = false;
                                                    this.sequence2_2 = true;
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
                                                    if( list10[i].PRODUCT_GROUP_NAME == pro && list10[i].LAWSUIT_TYPE_TARGET == law && 
                                                      list10[i].IS_ACTIVE == 1 && list10[i].IS_SEND == 1 && list10[i].BUDGET_YEAR == this.year){
                                                              if(this.sum_sequence <= list10[i].SEQUENCE){
                                                                this.sum_sequence =  list10[i].SEQUENCE;}
                                                    }
                                                  }
                                                }
                                              });
                                              this.list_sequence = [];
                                              for ( var s = 0; s < this.sum_sequence; s++){
                                                this.list_sequence.push({name : s+1 });
                                              }
                                              if (law == null){
                                                this.sequence2_1 = true;
                                                this.sequence2_2 = false;
                                                }else{
                                                    this.sequence2_1 = false;
                                                    this.sequence2_2 = true;
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
                                                      if( list11[i].PRODUCT_GROUP_NAME == pro && list11[i].LAWSUIT_TYPE_TARGET == law && 
                                                        list11[i].IS_ACTIVE == 1 && list11[i].IS_SEND == 1 && list11[i].BUDGET_YEAR == this.year){
                                                                if(this.sum_sequence <= list11[i].SEQUENCE){
                                                                  this.sum_sequence =  list11[i].SEQUENCE;}
                                                      }
                                                    }
                                                  }
                                                });
                                                this.list_sequence = [];
                                                for ( var s = 0; s < this.sum_sequence; s++){
                                                  this.list_sequence.push({name : s+1 });
                                                }
                                                if (law == null){
                                                  this.sequence2_1 = true;
                                                  this.sequence2_2 = false;
                                                  }else{
                                                      this.sequence2_1 = false;
                                                      this.sequence2_2 = true;
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
                                                        if( list12[i].PRODUCT_GROUP_NAME == pro && list12[i].LAWSUIT_TYPE_TARGET == law && 
                                                          list12[i].IS_ACTIVE == 1 && list12[i].IS_SEND == 1 && list12[i].BUDGET_YEAR == this.year){
                                                                  if(this.sum_sequence <= list12[i].SEQUENCE){
                                                                    this.sum_sequence =  list12[i].SEQUENCE;}
                                                        }
                                                      }
                                                    }
                                                  });
                                                  this.list_sequence = [];
                                                  for ( var s = 0; s < this.sum_sequence; s++){
                                                    this.list_sequence.push({name : s+1 });
                                                  }
                                                  if (law == null){
                                                    this.sequence2_1 = true;
                                                    this.sequence2_2 = false;
                                                    }else{
                                                        this.sequence2_1 = false;
                                                        this.sequence2_2 = true;
                                                    }
                                                }
                                              }
                                            }
                                          });
                                        }
                                      });
                                    }
                                });//7
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

  }
  //type condition---------------
  zoneoptions(id: number){
    // console.log(id)
    this.lawsult_type = id;
    this.sum_sequence = 1;
    this.list_sequence = [];
    this.sequence2_1 = true;
    this.sequence2_2 = false;
    this.sum_qty = this.qty;
    this.sum_fine = this.fine;
    this.year = ""+this.total_year;
    var pro = '';
      if (this.product_group == 1){
        pro = 'สุรา'
      }else if (this.product_group == 2){
        pro = 'ยาสูบ'
      }else if (this.product_group == 3){
        pro = 'ไพ่'
      }else if (this.product_group == 4){
        pro = 'สินค้าอื่นๆ'
      }

      var law ;
      if (this.lawsult_type == 1){
        law = 0
      }else if (this.lawsult_type == 2){
        law = 1
      }else if (this.lawsult_type == 3){
        law = 2
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
              if( list1[i].PRODUCT_GROUP_NAME == pro && list1[i].LAWSUIT_TYPE_TARGET == law && 
                list1[i].IS_ACTIVE == 1 && list1[i].IS_SEND == 1 && list1[i].BUDGET_YEAR == this.year){
                        if(this.sum_sequence <= list1[i].SEQUENCE){
                          this.sum_sequence =  list1[i].SEQUENCE;}
              }
            }
          }
          this.list_sequence = [];
          for ( var s = 0; s < this.sum_sequence; s++){
            this.list_sequence.push({name : s+1 });
          }
          if (pro == ''){
            this.sequence2_1 = true;
            this.sequence2_2 = false;
            }else{
                this.sequence2_1 = false;
                this.sequence2_2 = true;
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
                  if( list2[i].PRODUCT_GROUP_NAME == pro && list2[i].LAWSUIT_TYPE_TARGET == law && 
                    list2[i].IS_ACTIVE == 1 && list2[i].IS_SEND == 1 && list2[i].BUDGET_YEAR == this.year){
                            if(this.sum_sequence <= list2[i].SEQUENCE){
                              this.sum_sequence =  list2[i].SEQUENCE;}
                  }
                }
              }
              this.list_sequence = [];
              for ( var s = 0; s < this.sum_sequence; s++){
                this.list_sequence.push({name : s+1 });
              }
              if (pro == ''){
                this.sequence2_1 = true;
                this.sequence2_2 = false;
                }else{
                    this.sequence2_1 = false;
                    this.sequence2_2 = true;
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
                      if( list3[i].PRODUCT_GROUP_NAME == pro && list3[i].LAWSUIT_TYPE_TARGET == law && 
                        list3[i].IS_ACTIVE == 1 && list3[i].IS_SEND == 1 && list3[i].BUDGET_YEAR == this.year){
                                if(this.sum_sequence <= list3[i].SEQUENCE){
                                  this.sum_sequence =  list3[i].SEQUENCE;}
                      }
                    }
                  }
                  this.list_sequence = [];
                  for ( var s = 0; s < this.sum_sequence; s++){
                    this.list_sequence.push({name : s+1 });
                  }
                  if (pro == ''){
                    this.sequence2_1 = true;
                    this.sequence2_2 = false;
                    }else{
                        this.sequence2_1 = false;
                        this.sequence2_2 = true;
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
                          if( list4[i].PRODUCT_GROUP_NAME == pro && list4[i].LAWSUIT_TYPE_TARGET == law && 
                            list4[i].IS_ACTIVE == 1 && list4[i].IS_SEND == 1 && list4[i].BUDGET_YEAR == this.year){
                                    if(this.sum_sequence <= list4[i].SEQUENCE){
                                      this.sum_sequence =  list4[i].SEQUENCE;}
                          }
                        }
                      }
                      this.list_sequence = [];
                      for ( var s = 0; s < this.sum_sequence; s++){
                        this.list_sequence.push({name : s+1 });
                      }
                      if (pro == ''){
                        this.sequence2_1 = true;
                        this.sequence2_2 = false;
                        }else{
                            this.sequence2_1 = false;
                            this.sequence2_2 = true;
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
                              if( list5[i].PRODUCT_GROUP_NAME == pro && list5[i].LAWSUIT_TYPE_TARGET == law && 
                                list5[i].IS_ACTIVE == 1 && list5[i].IS_SEND == 1 && list5[i].BUDGET_YEAR == this.year){
                                        if(this.sum_sequence <= list5[i].SEQUENCE){
                                          this.sum_sequence =  list5[i].SEQUENCE;}
                              }
                            }
                          }
                          this.list_sequence = [];
                          for ( var s = 0; s < this.sum_sequence; s++){
                            this.list_sequence.push({name : s+1 });
                          }
                          if (pro == ''){
                            this.sequence2_1 = true;
                            this.sequence2_2 = false;
                            }else{
                                this.sequence2_1 = false;
                                this.sequence2_2 = true;
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
                                  if( list6[i].PRODUCT_GROUP_NAME == pro && list6[i].LAWSUIT_TYPE_TARGET == law && 
                                    list6[i].IS_ACTIVE == 1 && list6[i].IS_SEND == 1 && list6[i].BUDGET_YEAR == this.year){
                                            if(this.sum_sequence <= list6[i].SEQUENCE){
                                              this.sum_sequence =  list6[i].SEQUENCE;}
                                  }
                                }
                              }
                              this.list_sequence = [];
                                  for ( var s = 0; s < this.sum_sequence; s++){
                                    this.list_sequence.push({name : s+1 });
                                  }
                                  if (pro == ''){
                                    this.sequence2_1 = true;
                                    this.sequence2_2 = false;
                                    }else{
                                        this.sequence2_1 = false;
                                        this.sequence2_2 = true;
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
                                      if( list7[i].PRODUCT_GROUP_NAME == pro && list7[i].LAWSUIT_TYPE_TARGET == law && 
                                        list7[i].IS_ACTIVE == 1 && list7[i].IS_SEND == 1 && list7[i].BUDGET_YEAR == this.year){
                                                if(this.sum_sequence <= list7[i].SEQUENCE){
                                                  this.sum_sequence =  list7[i].SEQUENCE;}
                                      }
                                    }
                                  }
                                  this.list_sequence = [];
                                  for ( var s = 0; s < this.sum_sequence; s++){
                                    this.list_sequence.push({name : s+1 });
                                  }
                                  if (pro == ''){
                                    this.sequence2_1 = true;
                                    this.sequence2_2 = false;
                                    }else{
                                        this.sequence2_1 = false;
                                        this.sequence2_2 = true;
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
                                          if( list8[i].PRODUCT_GROUP_NAME == pro && list8[i].LAWSUIT_TYPE_TARGET == law && 
                                            list8[i].IS_ACTIVE == 1 && list8[i].IS_SEND == 1 && list8[i].BUDGET_YEAR == this.year){
                                                    if(this.sum_sequence <= list8[i].SEQUENCE){
                                                      this.sum_sequence =  list8[i].SEQUENCE;}
                                          }
                                        }
                                      }
                                      this.list_sequence = [];
                                      for ( var s = 0; s < this.sum_sequence; s++){
                                        this.list_sequence.push({name : s+1 });
                                      }
                                      if (pro == ''){
                                        this.sequence2_1 = true;
                                        this.sequence2_2 = false;
                                        }else{
                                            this.sequence2_1 = false;
                                            this.sequence2_2 = true;
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
                                              if( list9[i].PRODUCT_GROUP_NAME == pro && list9[i].LAWSUIT_TYPE_TARGET == law && 
                                                list9[i].IS_ACTIVE == 1 && list9[i].IS_SEND == 1 && list9[i].BUDGET_YEAR == this.year){
                                                        if(this.sum_sequence <= list9[i].SEQUENCE){
                                                          this.sum_sequence =  list9[i].SEQUENCE;}
                                              }
                                            }
                                          }
                                          this.list_sequence = [];
                                            for ( var s = 0; s < this.sum_sequence; s++){
                                              this.list_sequence.push({name : s+1 });
                                            }
                                            if (pro == ''){
                                              this.sequence2_1 = true;
                                              this.sequence2_2 = false;
                                              }else{
                                                  this.sequence2_1 = false;
                                                  this.sequence2_2 = true;
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
                                                  if( list10[i].PRODUCT_GROUP_NAME == pro && list10[i].LAWSUIT_TYPE_TARGET == law && 
                                                    list10[i].IS_ACTIVE == 1 && list10[i].IS_SEND == 1 && list10[i].BUDGET_YEAR == this.year){
                                                            if(this.sum_sequence <= list10[i].SEQUENCE){
                                                              this.sum_sequence =  list10[i].SEQUENCE;}
                                                  }
                                                }
                                              }
                                            });
                                            this.list_sequence = [];
                                            for ( var s = 0; s < this.sum_sequence; s++){
                                              this.list_sequence.push({name : s+1 });
                                            }
                                            if (pro == ''){
                                              this.sequence2_1 = true;
                                              this.sequence2_2 = false;
                                              }else{
                                                  this.sequence2_1 = false;
                                                  this.sequence2_2 = true;
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
                                                    if( list11[i].PRODUCT_GROUP_NAME == pro && list11[i].LAWSUIT_TYPE_TARGET == law && 
                                                      list11[i].IS_ACTIVE == 1 && list11[i].IS_SEND == 1 && list11[i].BUDGET_YEAR == this.year){
                                                              if(this.sum_sequence <= list11[i].SEQUENCE){
                                                                this.sum_sequence =  list11[i].SEQUENCE;}
                                                    }
                                                  }
                                                }
                                              });
                                              this.list_sequence = [];
                                              for ( var s = 0; s < this.sum_sequence; s++){
                                                this.list_sequence.push({name : s+1 });
                                              }
                                              if (pro == ''){
                                                this.sequence2_1 = true;
                                                this.sequence2_2 = false;
                                                }else{
                                                    this.sequence2_1 = false;
                                                    this.sequence2_2 = true;
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
                                                      if( list12[i].PRODUCT_GROUP_NAME == pro && list12[i].LAWSUIT_TYPE_TARGET == law && 
                                                        list12[i].IS_ACTIVE == 1 && list12[i].IS_SEND == 1 && list12[i].BUDGET_YEAR == this.year){
                                                                if(this.sum_sequence <= list12[i].SEQUENCE){
                                                                  this.sum_sequence =  list12[i].SEQUENCE;}
                                                      }
                                                    }
                                                  }
                                                });
                                                this.list_sequence = [];
                                                for ( var s = 0; s < this.sum_sequence; s++){
                                                  this.list_sequence.push({name : s+1 });
                                                }
                                                if (pro == ''){
                                                  this.sequence2_1 = true;
                                                  this.sequence2_2 = false;
                                                  }else{
                                                      this.sequence2_1 = false;
                                                      this.sequence2_2 = true;
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
  }
  zone_event(num : number){
    this.sequence = num;
    this.box3 = false;
    this.row = false;

    

    // console.log(this.condition_sepuence);

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
    
    this.year = ""+this.total_year;
    var pro = '';
      if (this.product_group == 1){
        pro = 'สุรา'
      }else if (this.product_group == 2){
        pro = 'ยาสูบ'
      }else if (this.product_group == 3){
        pro = 'ไพ่'
      }else if (this.product_group == 4){
        pro = 'สินค้าอื่นๆ'
      }

      var law ;
      if (this.lawsult_type == 1){
        law = 0
      }else if (this.lawsult_type == 2){
        law = 1
      }else if (this.lawsult_type == 3){
        law = 2
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

    // console.log(this.condition_sepuence)
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
                  this.box3 = true;
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
            this.targetTotal = true;
            }else{
            // console.log("no")
            this.targetTotal = false;
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
                      this.box3 = true;
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
                this.targetTotal = true;
                }else{
                // console.log("no")
                this.targetTotal = false;
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
                          this.box3 = true;
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
                    this.targetTotal = true;
                    }else{
                    // console.log("no")
                    this.targetTotal = false;
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
                          this.box3 = true;
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
                        this.targetTotal = true;
                        }else{
                        // console.log("no")
                        this.targetTotal = false;
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
                                  this.box3 = true;
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
                            this.targetTotal = true;
                            }else{
                            // console.log("no")
                            this.targetTotal = false;
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
                                    this.box3 = true;
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
                                 this.targetTotal = true;
                                 }else{
                                 // console.log("no")
                                 this.targetTotal = false;
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
                                        this.box3 = true;
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
                                     this.targetTotal = true;
                                     }else{
                                     // console.log("no")
                                     this.targetTotal = false;
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
                                            this.box3 = true;
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
                                         this.targetTotal = true;
                                         }else{
                                         // console.log("no")
                                         this.targetTotal = false;
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
                                                this.box3 = true;
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
                                             this.targetTotal = true;
                                             }else{
                                             // console.log("no")
                                             this.targetTotal = false;
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
                                                    this.box3 = true;
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
                                                 this.targetTotal = true;
                                                 }else{
                                                 // console.log("no")
                                                 this.targetTotal = false;
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
                                                        this.box3 = true;
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
                                                     this.targetTotal = true;
                                                     }else{
                                                     // console.log("no")
                                                     this.targetTotal = false;
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
                                                            this.box3 = true;
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
                                                         this.targetTotal = true;
                                                         }else{
                                                         // console.log("no")
                                                         this.targetTotal = false;
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
  }

  //click view---------------------------------------------------------------------------------------------------------------------------------
  viewTarget() {

    this.router.navigate(['/SuppressTarget/manages/view']);
    this.navService.setSendButton(true);
    this.navService.setPrintButton(true);
  }
  //click cancel---------------------------------------------------------------------------------------------------------------------------------
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
    console.log(this.date_time);

    
    // console.log(this.tempDatas[11].TRE);

  }
  //click print---------------------------------------------------------------------------------------------------------------------------------
  clickPrint() {
    this.modal = this.ngbModel.open(PrintdocModelComponent, { backdrop: 'static', size: 'lg', })
  }

  //click edit---------------------------------------------------------------------------------------------------------------------------------
  clickEdit() {
    this.print_btn = false;
    this.edit_btn = false;

    this.craeteTarget_btn = true;
    this.save_btn = true;
    this.cancel_btn = true;

  }

  //get rout---------------------------------------------------------------------------------------------------------------------------------
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

  ngOnSend_target(): void{
    this.navService.setEditButton(false);
    this.navService.setDeleteButton(false);
    this.navService.setSendButton(false);
    // this.navService.setSendTargetButton_target(false);
  }

  targetItemDetail: Array<any> = [
    { ID: 0, MONTH: 'ตุลาคม', QTY1: 2, FINE1: 34667 },
    { ID: 1, MONTH: 'พฤศจิกายน', QTY1: 2, FINE1: 34667 },
    { ID: 2, MONTH: 'ธันวาคม', QTY1: 2, FINE1: 34667 },
    { ID: 3, MONTH: 'มกราคม', QTY1: 2, FINE1: 34667 },
    { ID: 4, MONTH: 'กุมภาพันธ์', QTY1: 2, FINE1: 34667 },
    { ID: 5, MONTH: 'มีนาคม', QTY1: 2, FINE1: 34667 },
    { ID: 6, MONTH: 'เมษายน',  QTY1: 2, FINE1: 34667 },
    { ID: 7, MONTH: 'พฤษภาคม', QTY1: 2, FINE1: 34667 },
    { ID: 8, MONTH: 'มิถุนายน', QTY1: 2, FINE1: 34667 },
    { ID: 9, MONTH: 'กรกฎาคม', QTY1: 2, FINE1: 34667 },
    { ID: 10, MONTH: 'สิงหาคม', QTY1: 2, FINE1: 34667 },
    { ID: 11, MONTH: 'กันยายน', QTY1: 2, FINE1: 34667 },
  ];

  targetItemDetail_Call: Array<any> = [
    { ID: 0, MONTH: 'ตุลาคม', QTY: 0, FINE: 0, BRI: 0.2, AWA: 0.2, TRE: 0.6, cal_QTY: 0,sum_QTY: 0, cal_FINE: 0,sum_FINE: 0, },
    { ID: 1, MONTH: 'พฤศจิกายน', QTY: 0, FINE: 0, BRI: 0.2, AWA: 0.2, TRE: 0.6, cal_QTY: 0,sum_QTY: 0, cal_FINE: 0,sum_FINE: 0, },
    { ID: 2, MONTH: 'ธันวาคม', QTY: 0, FINE: 0, BRI: 0.2, AWA: 0.2, TRE: 0.6, cal_QTY: 0,sum_QTY: 0, cal_FINE: 0,sum_FINE: 0, },
    { ID: 3, MONTH: 'มกราคม', QTY: 0, FINE: 0, BRI: 0.2, AWA: 0.2, TRE: 0.6, cal_QTY: 0,sum_QTY: 0, cal_FINE: 0,sum_FINE: 0, },
    { ID: 4, MONTH: 'กุมภาพันธ์', QTY: 0, FINE: 0, BRI: 0.2, AWA: 0.2, TRE: 0.6, cal_QTY: 0,sum_QTY: 0, cal_FINE: 0,sum_FINE: 0, },
    { ID: 5, MONTH: 'มีนาคม', QTY: 0, FINE: 0, BRI: 0.2, AWA: 0.2, TRE: 0.6, cal_QTY: 0,sum_QTY: 0, cal_FINE: 0,sum_FINE: 0, },
    { ID: 6, MONTH: 'เมษายน',  QTY: 0, FINE: 0, BRI: 0.2, AWA: 0.2, TRE: 0.6, cal_QTY: 0,sum_QTY: 0, cal_FINE: 0,sum_FINE: 0, },
    { ID: 7, MONTH: 'พฤษภาคม', QTY: 0, FINE: 0, BRI: 0.2, AWA: 0.2, TRE: 0.6, cal_QTY: 0,sum_QTY: 0, cal_FINE: 0,sum_FINE: 0, },
    { ID: 8, MONTH: 'มิถุนายน', QTY: 0, FINE: 0, BRI: 0.2, AWA: 0.2, TRE: 0.6, cal_QTY: 0,sum_QTY: 0, cal_FINE: 0,sum_FINE: 0, },
    { ID: 9, MONTH: 'กรกฎาคม', QTY: 0, FINE: 0, BRI: 0.2, AWA: 0.2, TRE: 0.6, cal_QTY: 0,sum_QTY: 0, cal_FINE: 0,sum_FINE: 0, },
    { ID: 10, MONTH: 'สิงหาคม', QTY: 0, FINE: 0, BRI: 0.2, AWA: 0.2, TRE: 0.6, cal_QTY: 0,sum_QTY: 0, cal_FINE: 0,sum_FINE: 0, },
    { ID: 11, MONTH: 'กันยายน', QTY: 0, FINE: 0, BRI: 0.2, AWA: 0.2, TRE: 0.6, cal_QTY: 0,sum_QTY: 0, cal_FINE: 0,sum_FINE: 0, },
  ];

  public totalItemDetail() {

    for(var i=0; i < this.targetItemDetail_Call.length; i++){
    this.targetItemDetail_Call[i].QTY = this.targetItemDetail[i].QTY1;
    this.targetItemDetail_Call[i].FINE = this.targetItemDetail[i].FINE1;
    this.targetItemDetail_Call[i].sum_QTY = this.targetItemDetail_Call[i].QTY;
    this.targetItemDetail_Call[i].sum_FINE = this.targetItemDetail_Call[i].FINE;
    }
    
      // var ts = { ITEM_ID: "165" }

      // this.targetService.getByCon("TargetgetByCon",ts).then(list =>{

      //     // console.log(list);

      //     for(var i=0; i < this.targetItemDetail_Call.length; i++){
      //       this.targetItemDetail_Call[i].QTY = list[i].QTY_CASE;
      //       this.targetItemDetail_Call[i].FINE = list[i].FINE;
      //       this.targetItemDetail_Call[i].sum_QTY = this.targetItemDetail_Call[i].QTY;
      //       this.targetItemDetail_Call[i].sum_FINE = this.targetItemDetail_Call[i].FINE;
      //       }
      // })


  }

    //set case---------------------------------------------------------------------------------------------------------------------------------
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
    //set case---------------------------------------------------------------------------------------------------------------------------------
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
    //set data put insert สาขา/สตป---------------------------------------------------------------------------------------------------------------------------------
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

    //ยอดรวม สาขา/สตป---------------------------------------------------------------------------------------------------------------------------------
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
  
    //click save สาขา/สตป---------------------------------------------------------------------------------------------------------------------------------
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
            if (this.office_id == null || this.office_code == null || this.office_name == null || this.sequence == null || this.selected == 0|| this.selecteds == 0){
              swal({
                type: 'error',
                text: Messages_target.Req_mes + Messages_target.data+ Messages_target.success,
                confirmButtonText: 'ยืนยัน',
                reverseButtons: false,
          
              });
            }else{
            //transaction
            let paramiter = { RUNNING_OFFICE_CODE : this.office_code , RUNNING_TABLE:"OPS_TARGET"};
        
            this.targetService.transectionGet("TransactionRunninggetByCon",paramiter).then(list=>{
              // console.log(list);
              let running_id = [];
        
              for (var i =0 ; i<list.length; i++){
                running_id[i] = list[i].RUNNING_ID;
                // console.log(running_id[i]);
                
              }
        
              if(running_id.length == 0){
                // console.log("null",this.office_id,this.office_code);
                var run_id =[];
                var run_month =[];
                var run_no =[];
                var run_ofcode =[];
                var run_ofid =[];
                var run_pre =[];
                var run_table =[];
                var run_year =[];
        
                let paramiter = {
                RUNNING_OFFICE_ID: this.office_id,
                RUNNING_OFFICE_CODE: this.office_code,
                RUNNING_TABLE: "OPS_TARGET",
                RUNNING_PREFIX: "TG"};
                this.targetService.transectionIns("TransactionRunninginsAll",paramiter).then(list=>{
                  // console.log(list);
        
                  if(list.IsSuccess == "True"){
        
                    let paramiters = { RUNNING_OFFICE_CODE : this.office_code , RUNNING_TABLE:"OPS_TARGET"};
        
                    this.targetService.transectionGet("TransactionRunninggetByCon",paramiters).then(lists=>{
                      // console.log(lists);
        
                      var leng = "";
                            var prefix = "";
                            var ofcode = "";
                            var year = "";
                            var no = "";
                            var sum = 0;
        
                            for (var i =0 ; i<lists.length; i++){
                            prefix += lists[i].RUNNING_PREFIX;
                            ofcode += lists[i].RUNNING_OFFICE_CODE;
                            year += lists[i].RUNNING_YEAR;
                            no += lists[i].RUNNING_NO;
                            leng += lists[i].RUNNING_NO;
                            }
                            for(var i = 0; i<leng.length;i++){
                              sum+=1
                            }
        
                            if(sum == 1){
                              this.target_code = prefix+ofcode+year+"0000"+no;
                              // console.log("target_code : ",this.target_code);
                              this.insall1(this.target_code);
                            }else if (sum == 2){
                              this.target_code = prefix+ofcode+year+"000"+no;
                              // console.log("target_code : ",this.target_code);
                              this.insall1(this.target_code);
                            }else if (sum == 3){
                              this.target_code = prefix+ofcode+year+"00"+no;
                              // console.log("target_code : ",this.target_code);
                              this.insall1(this.target_code);
                            }else if (sum == 4){
                              this.target_code = prefix+ofcode+year+"0"+no;
                              // console.log("target_code : ",this.target_code);
                              this.insall1(this.target_code);
                            }else if (sum == 5){
                              this.target_code = prefix+ofcode+year+no;
                              // console.log("target_code : ",this.target_code);
                              this.insall1(this.target_code);
                            }
                    });
                  }
                });
        
              }else {
                // console.log("don't null",this.office_id,this.office_code);
                var run_id =[];
                var run_month =[];
                var run_no =[];
                var run_ofcode =[];
                var run_ofid =[];
                var run_pre =[];
                var run_table =[];
                var run_year =[];
        
                let paramiter = { RUNNING_OFFICE_CODE : this.office_code , RUNNING_TABLE:"OPS_TARGET"};
        
                    this.targetService.transectionGet("TransactionRunninggetByCon",paramiter).then(lists=>{
        
                      for (var i =0 ; i<lists.length; i++){
                        run_id[i] = lists[i].RUNNING_ID;
                        run_month[i] = lists[i].RUNNING_MONTH;
                        run_no[i] = lists[i].RUNNING_NO;
                        run_ofcode[i] = lists[i].RUNNING_OFFICE_CODE;
                        run_ofid[i] = lists[i].RUNNING_OFFICE_ID;
                        run_pre[i] = lists[i].RUNNING_PREFIX;
                        run_table[i] = lists[i].RUNNING_TABLE;
                        run_year[i] = lists[i].RUNNING_YEAR;
        
                      if(run_id[i] == run_id[lists.length-1]){
                        // console.log("RUNNING_ID:",run_id[lists.length-1]);
                        // console.log("RUNNING_NO:",run_no[lists.length-1]);
        
                        let paramiters = { RUNNING_ID : run_id[lists.length-1]};
        
                        this.targetService.transectionGet("TransactionRunningupdByCon",paramiters).then(list=>{
                          // console.log(list);
                          this.targetService.transectionGet("TransactionRunninggetByCon",paramiter).then(lists=>{
        
                            var leng = "";
                            var prefix = "";
                            var ofcode = "";
                            var year = "";
                            var no = "";
                            var sum = 0;
        
                            for (var i =0 ; i<lists.length; i++){
                            prefix += lists[i].RUNNING_PREFIX;
                            ofcode += lists[i].RUNNING_OFFICE_CODE;
                            year += lists[i].RUNNING_YEAR;
                            no += lists[i].RUNNING_NO;
                            leng += lists[i].RUNNING_NO;
                            }
                            for(var i = 0; i<leng.length;i++){
                              sum+=1
                            }
        
                            if(sum == 1){
                              this.target_code = prefix+ofcode+year+"0000"+no;
                              // console.log("target_code : ",this.target_code);
                              this.insall1(this.target_code);
                            }else if (sum == 2){
                              this.target_code = prefix+ofcode+year+"000"+no;
                              // console.log("target_code : ",this.target_code);
                              this.insall1(this.target_code);
                            }else if (sum == 3){
                              this.target_code = prefix+ofcode+year+"00"+no;
                              // console.log("target_code : ",this.target_code);
                              this.insall1(this.target_code);
                            }else if (sum == 4){
                              this.target_code = prefix+ofcode+year+"0"+no;
                              // console.log("target_code : ",this.target_code);
                              this.insall1(this.target_code);
                            }else if (sum == 5){
                              this.target_code = prefix+ofcode+year+no;
                              // console.log("target_code : ",this.target_code);
                              this.insall1(this.target_code);
                            }
                          })
                        });
                      }
                      }
                });
              }
            })
          }
          } else {
            swal({
              type: 'error',
              text: 'ไม่สามารถทำรายการได้'
            });
          }
        }
      });

      
      
      // ---target_code----------------------------------------------------------------------
  
    }
    //insert สาขา/สตป---------------------------------------------------------------------------------------------------------------------------------
    insall1(target_code){

        // console.log("product",this.product_group);
        // console.log("type",this.lawsult_type);

        if (this.product_group == 1){
          this.product_name = 13;
        }else if (this.product_group == 2){
          this.product_name = 14;
        }else if (this.product_group == 3){
          this.product_name = 15;
        }else if (this.product_group == 4){
          this.product_name = 16;
        }
  
        if (this.lawsult_type == 1){
          this.lawsult_name = 0;
        }else if (this.lawsult_type == 2){
          this.lawsult_name = 1;
        }else if (this.lawsult_type == 3){
          this.lawsult_name = 2;
        }
        // console.log("product_group",this.product_name);
        // console.log("lawsult_type",this.lawsult_name);

      if ( target_code == null ){
        swal({
          type: 'error',
          text: Messages_target.Req_mes + Messages_target.data+ Messages_target.success,
          confirmButtonText: 'ยืนยัน',
          reverseButtons: false,
    
        });

      }else{

        // console.log(this.office_id);
        // console.log(this.office_code);
        // console.log(this.office_name);
        // console.log(target_code);
        // console.log(this.date_time);

        // console.log(this.product_name);
        // console.log(this.sequence);
        // console.log(this.lawsult_name);

        // console.log(this.targetItemDetail_Call[0].sum_QTY);
        // console.log(this.qty_Case[0].qty_case);
        // console.log(this.targetItemDetail_Call[0].sum_FINE);

      let insall = {
        TARGET_ID: "",
        OFFICE_ID: this.office_id,
        OFFICE_CODE: this.office_code,
        OFFICE_NAME: this.office_name,
        TARGET_CODE: target_code,
        BUDGET_YEAR: this.date_time,
        TARGET_DATE: this.date_time,
        IS_ACTIVE: "1",
        TargetItem: [
          {
            ITEM_ID: "",
            TARGET_ID: "",
            PRODUCT_GROUP_ID: this.product_name,
            TARGET_ITEM_DATE: this.date_time,
            OLD_QTY: 0,
            OLD_FINE: 0,
            SEQUENCE: this.sequence,
            IS_SEND: "0",
            LAWSUIT_TYPE_TARGET: this.lawsult_name,
            OLD_BRIBE: 0,
            OLD_REWARD: 0,
            OLD_TREASURY: 0,
            IS_ACTIVE: "1",
            TargetItemDetail: [
              {
                ITEM_DETAIL_ID: "",
                ITEM_ID: "",
                QTY_CASE: this.targetItemDetail_Call[0].sum_QTY,
                QTY_CASE_PERCENT: this.qty_Case[0].qty_case,
                FINE: this.targetItemDetail_Call[0].sum_FINE,
                FINE_PERCENT: this.fine_Case[0].fine_case,
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
                ITEM_DETAIL_ID: "",
                ITEM_ID: "",
                QTY_CASE: this.targetItemDetail_Call[1].sum_QTY,
                QTY_CASE_PERCENT: this.qty_Case[1].qty_case,
                FINE: this.targetItemDetail_Call[1].sum_FINE,
                FINE_PERCENT: this.fine_Case[1].fine_case,
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
                ITEM_DETAIL_ID: "",
                ITEM_ID: "",
                QTY_CASE: this.targetItemDetail_Call[2].sum_QTY,
                QTY_CASE_PERCENT: this.qty_Case[2].qty_case,
                FINE: this.targetItemDetail_Call[2].sum_FINE,
                FINE_PERCENT: this.fine_Case[2].fine_case,
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
                ITEM_DETAIL_ID: "",
                ITEM_ID: "",
                QTY_CASE: this.targetItemDetail_Call[3].sum_QTY,
                QTY_CASE_PERCENT: this.qty_Case[3].qty_case,
                FINE: this.targetItemDetail_Call[3].sum_FINE,
                FINE_PERCENT: this.fine_Case[3].fine_case,
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
                ITEM_DETAIL_ID: "",
                ITEM_ID: "",
                QTY_CASE: this.targetItemDetail_Call[4].sum_QTY,
                QTY_CASE_PERCENT: this.qty_Case[4].qty_case,
                FINE: this.targetItemDetail_Call[4].sum_FINE,
                FINE_PERCENT: this.fine_Case[4].fine_case,
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
                ITEM_DETAIL_ID: "",
                ITEM_ID: "",
                QTY_CASE: this.targetItemDetail_Call[5].sum_QTY,
                QTY_CASE_PERCENT: this.qty_Case[5].qty_case,
                FINE: this.targetItemDetail_Call[5].sum_FINE,
                FINE_PERCENT: this.fine_Case[5].fine_case,
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
                ITEM_DETAIL_ID: "",
                ITEM_ID: "",
                QTY_CASE: this.targetItemDetail_Call[6].sum_QTY,
                QTY_CASE_PERCENT: this.qty_Case[6].qty_case,
                FINE: this.targetItemDetail_Call[6].sum_FINE,
                FINE_PERCENT: this.fine_Case[6].fine_case,
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
                ITEM_DETAIL_ID: "",
                ITEM_ID: "",
                QTY_CASE: this.targetItemDetail_Call[7].sum_QTY,
                QTY_CASE_PERCENT: this.qty_Case[7].qty_case,
                FINE: this.targetItemDetail_Call[7].sum_FINE,
                FINE_PERCENT: this.fine_Case[7].fine_case,
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
                ITEM_DETAIL_ID: "",
                ITEM_ID: "",
                QTY_CASE: this.targetItemDetail_Call[8].sum_QTY,
                QTY_CASE_PERCENT: this.qty_Case[8].qty_case,
                FINE: this.targetItemDetail_Call[8].sum_FINE,
                FINE_PERCENT: this.fine_Case[8].fine_case,
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
                ITEM_DETAIL_ID: "",
                ITEM_ID: "",
                QTY_CASE: this.targetItemDetail_Call[9].sum_QTY,
                QTY_CASE_PERCENT: this.qty_Case[9].qty_case,
                FINE: this.targetItemDetail_Call[9].sum_FINE,
                FINE_PERCENT: this.fine_Case[9].fine_case,
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
                ITEM_DETAIL_ID: "",
                ITEM_ID: "",
                QTY_CASE: this.targetItemDetail_Call[10].sum_QTY,
                QTY_CASE_PERCENT: this.qty_Case[10].qty_case,
                FINE: this.targetItemDetail_Call[10].sum_FINE,
                FINE_PERCENT: this.fine_Case[10].fine_case,
                TREASURY_MONEY: Math.ceil(this.targetItemDetail_Call[10].sum_FINE*this.targetItemDetail_Call[10].TRE),
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
                ITEM_DETAIL_ID: "",
                ITEM_ID: "",
                QTY_CASE: this.targetItemDetail_Call[11].sum_QTY,
                QTY_CASE_PERCENT: this.qty_Case[11].qty_case,
                FINE: this.targetItemDetail_Call[11].sum_FINE,
                FINE_PERCENT: this.fine_Case[11].fine_case,
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
          }
        ]
      }
  
      this.targetService.TargetinsAll("TargetinsAll",insall).then(list=>{

        console.log(list);
  
        if (list.IsSuccess =="True"){
          swal({
            type: 'success',
            text: Messages_target.save_mes + Messages_target.complete,
            confirmButtonText: 'ยืนยัน',
            buttonsStyling: true,
      
          });

          // this.save_btn = false;
          // this.cancel_btn = false;
          // this.craeteTarget_btn = false;
          // this.delete_btn = false;
          // this.print_btn = true;
          // this.edit_btn = true;
          
          // this.router.navigate([`/SuppressTarget/list]);

          const para = { TEXT_SEARCH : "",OFFICE_CODE : this.office_code}
          this.targetService.TargetListgetByKeyword(para).subscribe(list=>{

            var code = this.office_name;
            var year = this.office_code;

            for (var i = 0; i<list.length; i++){
              if (list[i].TARGET_CODE == this.target_code){
                // console.log(list[i].TARGET_CODE);
                var num = list[i].ITEM_ID;
              }
            }
            // console.log(list);
            // console.log(code);
            // console.log(year);
            this.router.navigate([`/SuppressTarget/manages/view/${code}/${year}/${num}`]);

          });

         

        }else{

          swal({
            type: 'error',
            text: Messages_target.canNot_mes + Messages_target.save_mes+ Messages_target.suffix_mes,
            confirmButtonText: 'ยืนยัน',
            reverseButtons: false,
      
          });
        }
  
      });
    }
  }

  //click Total พื้นที่/ภาค---------------------------------------------------------------------------------------------------------------------------------
    clickTotal(){

      var pro;
      var law;
      var conditions = 0;

      if (this.product_group == 1){
        pro = "สุรา";
      }else if (this.product_group == 2){
        pro = "ยาสูบ";
      }else if (this.product_group == 3){
        pro = "ไพ่";
      }else if (this.product_group == 4){
        pro = "สินค้าอื่นๆ";
      }

      if (this.lawsult_type == 1){
        law = 0;
      }else if (this.lawsult_type == 2){
        law = 1;
      }else if (this.lawsult_type == 3){
        law = 2;
      }


      const pam ={
        TEXT_SEARCH : this.office_code,
        OFFICE_CODE : ""
      }

      this.targetService.TargetListgetByKeyword(pam).subscribe(listss=>{

      for (var i =0; i< listss.length; i++){

        if (listss[i].BUDGET_YEAR == this.total_year && listss[i].IS_ACTIVE == 1 && listss[i].PRODUCT_GROUP_NAME == pro
            && listss[i].LAWSUIT_TYPE_TARGET  == law && listss[i].SEQUENCE == this.sequence){
              // console.log(listss[i]);
                conditions = 1;
            }
        
      }

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
            if (this.office_id == null || this.office_code == null || this.office_name == null || this.sequence == null || this.product_group == null|| this.lawsult_type == null ){
              swal({
                type: 'error',
                text: Messages_target.Req_mes + Messages_target.data+ Messages_target.success,
                confirmButtonText: 'ยืนยัน',
                reverseButtons: false,
          
              });
            }
            else if (conditions == 1){
              swal({
                type: 'error',
                text: "มีเป้าปราบปรามแล้ว",
                confirmButtonText: 'ยืนยัน',
                reverseButtons: false,
          
              });
            }
            else{
            //transaction
            let paramiter = { RUNNING_OFFICE_CODE : this.office_code , RUNNING_TABLE:"OPS_TARGET"};

            this.targetService.transectionGet("TransactionRunninggetByCon",paramiter).then(list=>{
              // console.log(list);
              let running_id = [];
        
              for (var i =0 ; i<list.length; i++){
                running_id[i] = list[i].RUNNING_ID;
                // console.log(running_id[i]);
                
              }

              // console.log(running_id[i]);
        
              if(running_id.length == 0){
                // console.log("null",this.office_id,this.office_code);
                var run_id =[];
                var run_month =[];
                var run_no =[];
                var run_ofcode =[];
                var run_ofid =[];
                var run_pre =[];
                var run_table =[];
                var run_year =[];
        
                let paramiter = {
                RUNNING_OFFICE_ID: this.office_id,
                RUNNING_OFFICE_CODE: this.office_code,
                RUNNING_TABLE: "OPS_TARGET",
                RUNNING_PREFIX: "TG"};
                this.targetService.transectionIns("TransactionRunninginsAll",paramiter).then(list=>{
                  // console.log(list);
        
                  if(list.IsSuccess == "True"){
        
                    let paramiters = { RUNNING_OFFICE_CODE : this.office_code , RUNNING_TABLE:"OPS_TARGET"};
        
                    this.targetService.transectionGet("TransactionRunninggetByCon",paramiters).then(lists=>{
                      // console.log(lists);
        
                      var leng = "";
                            var prefix = "";
                            var ofcode = "";
                            var year = "";
                            var no = "";
                            var sum = 0;
        
                            for (var i =0 ; i<lists.length; i++){
                            prefix += lists[i].RUNNING_PREFIX;
                            ofcode += lists[i].RUNNING_OFFICE_CODE;
                            year += lists[i].RUNNING_YEAR;
                            no += lists[i].RUNNING_NO;
                            leng += lists[i].RUNNING_NO;
                            }
                            for(var i = 0; i<leng.length;i++){
                              sum+=1
                            }
        
                            if(sum == 1){
                              this.target_code = prefix+ofcode+year+"0000"+no;
                              // console.log("target_code : ",this.target_code);
                              this.total_cal (this.target_code);
                            }else if (sum == 2){
                              this.target_code = prefix+ofcode+year+"000"+no;
                              // console.log("target_code : ",this.target_code);
                              this.total_cal (this.target_code);
                            }else if (sum == 3){
                              this.target_code = prefix+ofcode+year+"00"+no;
                              // console.log("target_code : ",this.target_code);
                              this.total_cal (this.target_code);
                            }else if (sum == 4){
                              this.target_code = prefix+ofcode+year+"0"+no;
                              // console.log("target_code : ",this.target_code);
                              this.total_cal (this.target_code);
                            }else if (sum == 5){
                              this.target_code = prefix+ofcode+year+no;
                              // console.log("target_code : ",this.target_code);
                              this.total_cal (this.target_code);
                            }
                    });
                  }
                });
        
              }
              else {
                // console.log("don't null",this.office_id,this.office_code);
                var run_id =[];
                var run_month =[];
                var run_no =[];
                var run_ofcode =[];
                var run_ofid =[];
                var run_pre =[];
                var run_table =[];
                var run_year =[];
        
                let paramiter = { RUNNING_OFFICE_CODE : this.office_code , RUNNING_TABLE:"OPS_TARGET"};
        
                    this.targetService.transectionGet("TransactionRunninggetByCon",paramiter).then(lists=>{
        
                      for (var i =0 ; i<lists.length; i++){
                        run_id[i] = lists[i].RUNNING_ID;
                        run_month[i] = lists[i].RUNNING_MONTH;
                        run_no[i] = lists[i].RUNNING_NO;
                        run_ofcode[i] = lists[i].RUNNING_OFFICE_CODE;
                        run_ofid[i] = lists[i].RUNNING_OFFICE_ID;
                        run_pre[i] = lists[i].RUNNING_PREFIX;
                        run_table[i] = lists[i].RUNNING_TABLE;
                        run_year[i] = lists[i].RUNNING_YEAR;
        
                      if(run_id[i] == run_id[lists.length-1]){
                        // console.log("RUNNING_ID:",run_id[lists.length-1]);
                        // console.log("RUNNING_NO:",run_no[lists.length-1]);
        
                        let paramiters = { RUNNING_ID : run_id[lists.length-1]};
        
                        this.targetService.transectionGet("TransactionRunningupdByCon",paramiters).then(list=>{
                          // console.log(list);
                          this.targetService.transectionGet("TransactionRunninggetByCon",paramiter).then(lists=>{
        
                            var leng = "";
                            var prefix = "";
                            var ofcode = "";
                            var year = "";
                            var no = "";
                            var sum = 0;
        
                            for (var i =0 ; i<lists.length; i++){
                            prefix += lists[i].RUNNING_PREFIX;
                            ofcode += lists[i].RUNNING_OFFICE_CODE;
                            year += lists[i].RUNNING_YEAR;
                            no += lists[i].RUNNING_NO;
                            leng += lists[i].RUNNING_NO;
                            }
                            for(var i = 0; i<leng.length;i++){
                              sum+=1
                            }
        
                            if(sum == 1){
                              this.target_code = prefix+ofcode+year+"0000"+no;
                              // console.log("target_code : ",this.target_code);
                              this.total_cal (this.target_code);
                            }else if (sum == 2){
                              this.target_code = prefix+ofcode+year+"000"+no;
                              // console.log("target_code : ",this.target_code);
                              this.total_cal (this.target_code);
                            }else if (sum == 3){
                              this.target_code = prefix+ofcode+year+"00"+no;
                              // console.log("target_code : ",this.target_code);
                              this.total_cal (this.target_code);
                            }else if (sum == 4){
                              this.target_code = prefix+ofcode+year+"0"+no;
                              // console.log("target_code : ",this.target_code);
                              this.total_cal (this.target_code);
                            }else if (sum == 5){
                              this.target_code = prefix+ofcode+year+no;
                              // console.log("target_code : ",this.target_code);
                              this.total_cal (this.target_code);
                            }
                          })
                        });
                      }
                      }
                });
              }
            })
          }
          } else {
            swal({
              type: 'error',
              text: 'ไม่สามารถทำรายการได้'
            });
          }
        }
      });
    });
  }


    total_cal (target_code){

      // console.log("product",this.product_group);
        // console.log("type",this.lawsult_type);

        if (this.product_group == 1){
          this.product_name = 13;
        }else if (this.product_group == 2){
          this.product_name = 14;
        }else if (this.product_group == 3){
          this.product_name = 15;
        }else if (this.product_group == 4){
          this.product_name = 16;
        }
  
        if (this.lawsult_type == 1){
          this.lawsult_name = 0;
        }else if (this.lawsult_type == 2){
          this.lawsult_name = 1;
        }else if (this.lawsult_type == 3){
          this.lawsult_name = 2;
        }
        // console.log("product_group",this.product_name);
        // console.log("lawsult_type",this.lawsult_name);

      if ( target_code == null ){
        swal({
          type: 'error',
          text: Messages_target.Req_mes + Messages_target.data+ Messages_target.success,
          confirmButtonText: 'ยืนยัน',
          reverseButtons: false,
    
        });

      }else{



        // console.log(this.office_id);
        // console.log(this.office_code);
        // console.log(this.office_name);
        // console.log(target_code);
        // console.log(this.date_time);

        // console.log(this.product_name);
        // console.log(this.sequence);
        // console.log(this.lawsult_name);

      let insall = {
        TARGET_ID: "",
        OFFICE_ID: this.office_id,
        OFFICE_CODE: this.office_code,
        OFFICE_NAME: this.office_name,
        TARGET_CODE: target_code,
        BUDGET_YEAR: this.date_time,
        TARGET_DATE: this.date_time,
        IS_ACTIVE: "1",
        TargetItem: [
          {
            ITEM_ID: "",
            TARGET_ID: "",
            PRODUCT_GROUP_ID: this.product_name,
            TARGET_ITEM_DATE: this.date_time,
            OLD_QTY: 0,
            OLD_FINE: 0,
            SEQUENCE: this.sequence,
            IS_SEND: "0",
            LAWSUIT_TYPE_TARGET: this.lawsult_name,
            OLD_BRIBE: 0,
            OLD_REWARD: 0,
            OLD_TREASURY: 0,
            IS_ACTIVE: "1",
            TargetItemDetail: [
              {
                ITEM_DETAIL_ID: "",
                ITEM_ID: "",
                QTY_CASE: this.tempDatas[0].QTY,
                QTY_CASE_PERCENT: this.tempDatas[0].QTY_CASE_PERCENT,
                FINE: this.tempDatas[0].FINE,
                FINE_PERCENT: this.tempDatas[0].FINE_PERCENT,
                TREASURY_MONEY: this.tempDatas[0].TRE,
                MONTH: "0",
                BRIBE: this.tempDatas[0].BRI,
                REWARD: this.tempDatas[0].AWA,
                OLD_BRIBE: 0,
                OLD_FINE: 0,
                OLD_QTY: 0,
                OLD_REWARD: 0,
                OLD_TREASURY: 0
              },
              {
                ITEM_DETAIL_ID: "",
                ITEM_ID: "",
                QTY_CASE: this.tempDatas[1].QTY,
                QTY_CASE_PERCENT: this.tempDatas[1].QTY_CASE_PERCENT,
                FINE: this.tempDatas[1].FINE,
                FINE_PERCENT: this.tempDatas[1].FINE_PERCENT,
                TREASURY_MONEY: this.tempDatas[1].TRE,
                MONTH: "1",
                BRIBE: this.tempDatas[1].BRI,
                REWARD: this.tempDatas[1].AWA,
                OLD_BRIBE: 0,
                OLD_FINE: 0,
                OLD_QTY: 0,
                OLD_REWARD: 0,
                OLD_TREASURY: 0
              },
              {
                ITEM_DETAIL_ID: "",
                ITEM_ID: "",
                QTY_CASE: this.tempDatas[2].QTY,
                QTY_CASE_PERCENT: this.tempDatas[2].QTY_CASE_PERCENT,
                FINE: this.tempDatas[2].FINE,
                FINE_PERCENT: this.tempDatas[2].FINE_PERCENT,
                TREASURY_MONEY: this.tempDatas[2].TRE,
                MONTH: "2",
                BRIBE: this.tempDatas[2].BRI,
                REWARD: this.tempDatas[2].AWA,
                OLD_BRIBE: 0,
                OLD_FINE: 0,
                OLD_QTY: 0,
                OLD_REWARD: 0,
                OLD_TREASURY: 0
              },
              {
                ITEM_DETAIL_ID: "",
                ITEM_ID: "",
                QTY_CASE: this.tempDatas[3].QTY,
                QTY_CASE_PERCENT: this.tempDatas[3].QTY_CASE_PERCENT,
                FINE: this.tempDatas[3].FINE,
                FINE_PERCENT: this.tempDatas[3].FINE_PERCENT,
                TREASURY_MONEY: this.tempDatas[3].TRE,
                MONTH: "3",
                BRIBE: this.tempDatas[3].BRI,
                REWARD: this.tempDatas[3].AWA,
                OLD_BRIBE: 0,
                OLD_FINE: 0,
                OLD_QTY: 0,
                OLD_REWARD: 0,
                OLD_TREASURY: 0
              },
              {
                ITEM_DETAIL_ID: "",
                ITEM_ID: "",
                QTY_CASE: this.tempDatas[4].QTY,
                QTY_CASE_PERCENT: this.tempDatas[4].QTY_CASE_PERCENT,
                FINE: this.tempDatas[4].FINE,
                FINE_PERCENT: this.tempDatas[4].FINE_PERCENT,
                TREASURY_MONEY: this.tempDatas[4].TRE,
                MONTH: "4",
                BRIBE: this.tempDatas[4].BRI,
                REWARD: this.tempDatas[4].AWA,
                OLD_BRIBE: 0,
                OLD_FINE: 0,
                OLD_QTY: 0,
                OLD_REWARD: 0,
                OLD_TREASURY: 0
              },
              {
                ITEM_DETAIL_ID: "",
                ITEM_ID: "",
                QTY_CASE: this.tempDatas[5].QTY,
                QTY_CASE_PERCENT: this.tempDatas[5].QTY_CASE_PERCENT,
                FINE: this.tempDatas[5].FINE,
                FINE_PERCENT: this.tempDatas[5].FINE_PERCENT,
                TREASURY_MONEY: this.tempDatas[5].TRE,
                MONTH: "5",
                BRIBE: this.tempDatas[5].BRI,
                REWARD: this.tempDatas[5].AWA,
                OLD_BRIBE: 0,
                OLD_FINE: 0,
                OLD_QTY: 0,
                OLD_REWARD: 0,
                OLD_TREASURY: 0
              },
              {
                ITEM_DETAIL_ID: "",
                ITEM_ID: "",
                QTY_CASE: this.tempDatas[6].QTY,
                QTY_CASE_PERCENT: this.tempDatas[6].QTY_CASE_PERCENT,
                FINE: this.tempDatas[6].FINE,
                FINE_PERCENT: this.tempDatas[6].FINE_PERCENT,
                TREASURY_MONEY: this.tempDatas[6].TRE,
                MONTH: "6",
                BRIBE: this.tempDatas[6].BRI,
                REWARD: this.tempDatas[6].AWA,
                OLD_BRIBE: 0,
                OLD_FINE: 0,
                OLD_QTY: 0,
                OLD_REWARD: 0,
                OLD_TREASURY: 0
              },
              {
                ITEM_DETAIL_ID: "",
                ITEM_ID: "",
                QTY_CASE: this.tempDatas[7].QTY,
                QTY_CASE_PERCENT: this.tempDatas[7].QTY_CASE_PERCENT,
                FINE: this.tempDatas[7].FINE,
                FINE_PERCENT: this.tempDatas[7].FINE_PERCENT,
                TREASURY_MONEY: this.tempDatas[7].TRE,
                MONTH: "7",
                BRIBE: this.tempDatas[7].BRI,
                REWARD: this.tempDatas[7].AWA,
                OLD_BRIBE: 0,
                OLD_FINE: 0,
                OLD_QTY: 0,
                OLD_REWARD: 0,
                OLD_TREASURY: 0
              },
              {
                ITEM_DETAIL_ID: "",
                ITEM_ID: "",
                QTY_CASE: this.tempDatas[8].QTY,
                QTY_CASE_PERCENT: this.tempDatas[8].QTY_CASE_PERCENT,
                FINE: this.tempDatas[8].FINE,
                FINE_PERCENT: this.tempDatas[8].FINE_PERCENT,
                TREASURY_MONEY: this.tempDatas[8].TRE,
                MONTH: "8",
                BRIBE: this.tempDatas[8].BRI,
                REWARD: this.tempDatas[8].AWA,
                OLD_BRIBE: 0,
                OLD_FINE: 0,
                OLD_QTY: 0,
                OLD_REWARD: 0,
                OLD_TREASURY: 0
              },
              {
                ITEM_DETAIL_ID: "",
                ITEM_ID: "",
                QTY_CASE: this.tempDatas[9].QTY,
                QTY_CASE_PERCENT: this.tempDatas[9].QTY_CASE_PERCENT,
                FINE: this.tempDatas[9].FINE,
                FINE_PERCENT: this.tempDatas[9].FINE_PERCENT,
                TREASURY_MONEY: this.tempDatas[9].TRE,
                MONTH: "9",
                BRIBE: this.tempDatas[9].BRI,
                REWARD: this.tempDatas[9].AWA,
                OLD_BRIBE: 0,
                OLD_FINE: 0,
                OLD_QTY: 0,
                OLD_REWARD: 0,
                OLD_TREASURY: 0
              },
              {
                ITEM_DETAIL_ID: "",
                ITEM_ID: "",
                QTY_CASE: this.tempDatas[10].QTY,
                QTY_CASE_PERCENT: this.tempDatas[10].QTY_CASE_PERCENT,
                FINE: this.tempDatas[10].FINE,
                FINE_PERCENT: this.tempDatas[10].FINE_PERCENT,
                TREASURY_MONEY: this.tempDatas[10].TRE,
                MONTH: "10",
                BRIBE: this.tempDatas[10].BRI,
                REWARD: this.tempDatas[10].AWA,
                OLD_BRIBE: 0,
                OLD_FINE: 0,
                OLD_QTY: 0,
                OLD_REWARD: 0,
                OLD_TREASURY: 0
              },
              {
                ITEM_DETAIL_ID: "",
                ITEM_ID: "",
                QTY_CASE: this.tempDatas[11].QTY,
                QTY_CASE_PERCENT: this.tempDatas[11].QTY_CASE_PERCENT,
                FINE: this.tempDatas[11].FINE,
                FINE_PERCENT: this.tempDatas[11].FINE_PERCENT,
                TREASURY_MONEY: this.tempDatas[11].TRE,
                MONTH: "11",
                BRIBE: this.tempDatas[11].BRI,
                REWARD: this.tempDatas[11].AWA,
                OLD_BRIBE: 0,
                OLD_FINE: 0,
                OLD_QTY: 0,
                OLD_REWARD: 0,
                OLD_TREASURY: 0
              },
            ]
          }
        ]
      }
  
      this.targetService.TargetinsAll("TargetinsAll",insall).then(list=>{
        // console.log(list);
  
        if (list.IsSuccess =="True"){
          swal({
            type: 'success',
            text: Messages_target.save_mes + Messages_target.complete,
            confirmButtonText: 'ยืนยัน',
            buttonsStyling: true,
      
          }).then((result) => {

          const para = { TEXT_SEARCH : this.office_name ,OFFICE_CODE : this.office_code}
          this.targetService.TargetListgetByKeyword(para).subscribe(list=>{
            var num ;

            for (var i = 0; i<list.length; i++){
              if (list[i].TARGET_CODE == target_code){
                // console.log(list[i].TARGET_CODE);
                num = list[i].ITEM_ID;
              }
            }
            const name = target_code;
            const off = this.office_code;
            const id = num;
          this.router.navigate([`/SuppressTarget/targetArea/view/${name}/${off}/${id}`]);
          });

          });

        }else{

          swal({
            type: 'error',
            text: Messages_target.canNot_mes + Messages_target.save_mes+ Messages_target.suffix_mes,
            confirmButtonText: 'ยืนยัน',
            reverseButtons: false,
      
          });
        }
  
      });
    }


    }

}
