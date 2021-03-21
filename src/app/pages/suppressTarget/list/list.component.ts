import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavigationService } from '../../../shared/header-navigation/navigation.service';
// import { NavigationService } from '../header-navigation/navigation.service';
import { pagination } from '../../../config/pagination';
import { PreloaderService } from '../../../shared/preloader/preloader.component';
import { SuppressTarget } from '../suppressTarget.service';
import { TargetService } from '../target.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Nav_target_Service } from '../../../shared/header-navigation/nav_target.service'
import { FormGroup, FormBuilder, FormArray, FormControl, ValidatorFn } from '@angular/forms';
import swal from 'sweetalert2';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Message } from 'app/config/message';
import { SidebarService } from '../../../shared/sidebar/sidebar.component';



@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ListComponent implements OnInit {
  @ViewChild('advForm') advForm: NgForm;
  newButton: any;

  showNewButton = new BehaviorSubject<Boolean>(false);
  private onNextPageSubscribe: any;
  private subOnSearch: any;



  //var of api
  mas_office : any;
  // mas_office = "070100";
  date_time : any;
  year : any;
  office_name : any;
  years = [];
  id: number = 0;
  
  
  advSearch1 = <Boolean>(false);
  advSearch2 = <Boolean>(false);
  dataList = [];
  showDataList = [];
  paginage = pagination;
  createTarget : Array<any> = [{code :"",name :"",id: ""}];

  // เช็คการทำงาน
  permisCheck: any
  perBeforReturn: any

  // buttom on header
  craete_btn = <Boolean>(false);
  search_text = <Boolean>(false);
  viewtarget1 = <Boolean>(false);
  viewtarget2 = <Boolean>(false);
  viewtarget3 = <Boolean>(false);
  viewtarget4 = <Boolean>(false);
  view_area = <Boolean>(false);
  page = <Boolean>(true);
  vip = <Boolean>(false);

   //type condition
   selectOptions(id: number) {
    // console.log(id);  
  }


  //after search
  listOfsreach = [];
  targetList: any = [];

  //btn
  showAdvSearch = new BehaviorSubject<Boolean>(true);


  // ListMasProd: any;
  constructor(
    private navService: Nav_target_Service,
    private suppressTarget: SuppressTarget,
    private targetService : TargetService,
    private router: Router, ) {

  }

  setAdvSearch() {
    if (this.showAdvSearch.getValue()) {
      this.showAdvSearch.next(false);
    } else {
      this.showAdvSearch.next(true);
    }
  }

  ngOnInit() {
    localStorage.setItem('programcode', 'ILG60-99-01');
    const offCode = localStorage.getItem("officeCode");
    // console.log('+++++++++++++++++++++++',offCode)
    this.mas_office = offCode;
    this.search_text = true;
    // this.navigate_service();
    this.Pageload();
    this.date();

  }

  // items2: any[] = [
  //   {OFFICE_ID: 136, OFFICE_CODE: "030301", OFFICE_NAME: "สำนักงานสรรพสามิตพื้นที่บุรีรัมย์ สาขาเมือง", IS_ACTIVE: 1}
  // ];

  items2: any[] = [ ];

  config2: any = {'width': '100%' , 'max': 8, 'placeholder': '', 'sourceField': 'OFFICE_NAME'};
 
  selectedItem: any = '';
  inputChanged: any = '';


  onSelect(item: any) {
    this.selectedItem = item;
    // console.log(item.OFFICE_NAME);
    this.office_name = item.OFFICE_NAME;
  }
 
  onInputChangedEvent(val: string) {
    this.inputChanged = val;
    // console.log(val);
  }


// สาขา
  viewTarget1(TARGET_CODE,TxtStatus,BUDGET_YEAR,SEQUENCE
    ,TARGET_ITEM_DATE,OFFICE_NAME,ITEM_ID,TARGET_ID: string) {

    const code = OFFICE_NAME;
    const year = this.mas_office;
    const num = ITEM_ID;

    // console.log(TARGET_CODE,TxtStatus,BUDGET_YEAR,SEQUENCE,TARGET_ITEM_DATE,OFFICE_NAME,ITEM_ID,TARGET_ID);
      
    this.router.navigate([`/SuppressTarget/manages/view/${code}/${year}/${num}`]);

    this.navService.setSendButton(true);
    this.navService.setPrintButton(true);
  }

  viewTarget2(TARGET_CODE,TxtStatus,BUDGET_YEAR,SEQUENCE
    ,TARGET_ITEM_DATE,OFFICE_NAME,ITEM_ID,TARGET_ID,PRODUCT_GROUP_NAME,LAWSUIT: string) {

      const name = TARGET_CODE;
      const off = this.mas_office;
      const id = ITEM_ID;
      // const seq = SEQUENCE;
      // const pro = PRODUCT_GROUP_NAME;
      // const law = LAWSUIT;

    // console.log(name,off,id);
      
    // this.router.navigate([`/SuppressTarget/manages/view/${code}/${year}/${num}`]);
    this.router.navigate([`/SuppressTarget/targetArea/view/${name}/${off}/${id}`]);

    this.navService.setSendButton(true);
    this.navService.setPrintButton(true);
  }

  viewTarget3(TARGET_CODE,TxtStatus,BUDGET_YEAR,SEQUENCE
    ,TARGET_ITEM_DATE,OFFICE_NAME: string) {

    const code = OFFICE_NAME;
    const year = BUDGET_YEAR;
    const num = SEQUENCE;

    console.log(TARGET_CODE,TxtStatus,BUDGET_YEAR,SEQUENCE,TARGET_ITEM_DATE,OFFICE_NAME);
      
    // this.router.navigate([`/SuppressTarget/manages/view/${code}/${year}/${num}`]);
    this.router.navigate(['/SuppressTarget/ParkTarget/view']);

    this.navService.setSendButton(true);
    this.navService.setPrintButton(true);
  }

  viewTarget4(TARGET_CODE,TxtStatus,BUDGET_YEAR,SEQUENCE
    ,TARGET_ITEM_DATE,OFFICE_NAME: string) {

    const code = OFFICE_NAME;
    const year = BUDGET_YEAR;
    const num = SEQUENCE;

    console.log(TARGET_CODE,TxtStatus,BUDGET_YEAR,SEQUENCE,TARGET_ITEM_DATE,OFFICE_NAME);
      
    // this.router.navigate([`/SuppressTarget/manages/view/${code}/${year}/${num}`]);
    this.router.navigate(['/SuppressTarget/ParkTarget/view']);

    this.navService.setSendButton(true);
    this.navService.setPrintButton(true);
  }

  ngOnDestroy(): void {
    this.craete_btn = false;
    this.search_text = false;
  }

  ShowAlertNoRecord() {
    swal({
        title: '',
        text: Message.noRecord,
        type: 'warning',
        confirmButtonText: 'ตกลง'
    });
  }

  
  async Pageload() {
    
    const paramss = {
      TEXT_SEARCH : "",
      OFFICE_ID : "" 
    }
    this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramss).then(list=>{
      this.items2 = list.RESPONSE_DATA;
      // console.log(this.items2);
    });

    //เรียก office_code จากการ login
    var officecode = "";
    officecode = this.mas_office;

    var nums1 = officecode.charAt(0);
    var nums2 = officecode.charAt(1);
    var nums3 = officecode.charAt(2);
    var nums4 = officecode.charAt(3);
    var nums5 = officecode.charAt(4);
    var nums6 = officecode.charAt(5);

    //สนง
    var first4 = nums1+nums2+nums3+nums4;
    var last2 = nums5+nums6;

    //ภาค
    var first2 = nums1+nums2;
    var last4 = nums3+nums4+nums5+nums6;

    //พื้นที่
     var middle2 = nums3+nums4;

    // console.log(officecode);
    // console.log(num2,num3,num4,num5,num6);
    // console.log(nums1,nums2,nums3,nums4,nums5,nums6);

    //000700 : สตป.
    if(first4 == "0007" )
      {
      if( last2 == "00"||last2 == "01"||last2 == "02"||last2 == "03"||last2 == "04"||last2 == "05"||last2 == "06"||
          last2 == "07"||last2 == "08"||last2 == "09"||last2 == "10")
        {
          this.craete_btn = true;
          this.viewtarget1 = true;
          this.advSearch1 = true;
          this.vip = true;
          // console.log("สตป",officecode);
        }}

    //สำนักงาน : first(0001-0013) last(00-10) //db(mas_office.office_name(shortBy:asc)) first t id.2 to id.74
    else if(  first4 == "0001"||first4 == "0002"||first4 == "0003"||first4 == "0004"||first4 == "0005"||first4 == "0006"||
              first4 == "0008"||first4 == "0009"||first4 == "0010"||first4 == "0011"||first4 == "0012"||first4 == "0013" )
        {if(  last2 == "00"||last2 == "01"||last2 == "02"||last2 == "03"||last2 == "04"||last2 == "05"||
              last2 == "06"||last2 == "07"||last2 == "08"||last2 == "09"||last2 == "10")
            {
              this.craete_btn = false;
              this.viewtarget4 = true;
              this.advSearch1 = true;
              this.view_area = false;
              this.vip = true;
              // console.log("สำนักงาน",officecode);
            }}

    //ภาค : first(01-10) last(0000-0010) //db(mas_office.office_name(shortBy:asc))
    else if(  first2 == "01"||first2 == "02"||first2 == "03"||first2 == "04"||first2 == "05"||first2 == "06"||
              first2 == "07"||first2 == "08"||first2 == "09"||first2 == "10")
          {
            if( last4 == "0000"||last4 == "0001"||last4 == "0002"||last4 == "0003"||last4 == "0004"||last4 == "0005"||
                last4 == "0006"||last4 == "0007"||last4 == "0008"||last4 == "0010"||last4 == "0011"||last4 == "0012")
              {
                this.craete_btn = false;
                this.viewtarget2 = true;
                this.advSearch1 = true;
                this.view_area = true;
                this.vip = false;
                  // console.log("ภาค",officecode);
              }

              //พื้นที่ : first(01-10) middle(01-12) last(00) //db(mas_office.office_name(shortBy:asc))
              else if(  middle2 == "01"||middle2 == "02"||middle2 == "03"||middle2 == "04"||middle2 == "05"||
                        middle2 == "06"||middle2 == "07"||middle2 == "08"||middle2 == "09"||middle2 == "10"||middle2 == "11"||middle2 == "12")
                    {
                      if(last2 == "00")
                        {
                          // this.craete_btn = false;
                          // this.viewtarget2 = true;
                          // this.advSearch1 = true;
                          // this.view_area = true;
                          // console.log("พื้นที่",officecode);
                          this.vip = false;
                          let paramss = {
                            TEXT_SEARCH : officecode,
                            OFFICE_ID : "" 
                          }

                          this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramss).then(list=>{
                            // console.log(list.RESPONSE_DATA.length)
                            var ofname = list.RESPONSE_DATA[0].OFFICE_NAME;

                            let paramsss = {
                              TEXT_SEARCH : ofname,
                              OFFICE_ID : "" 
                            }

                            this.targetService.MasOfficegetByCon("MasOfficegetByCon",paramsss).then(lists=>{
                              console.log(lists.RESPONSE_DATA)
                              if(lists.RESPONSE_DATA.length == 1){
                                console.log("one")
                                this.craete_btn = true;
                                this.viewtarget1 = true;
                                this.advSearch1 = true;
                              }else  {
                                this.craete_btn = false;
                                this.viewtarget2 = true;
                                this.advSearch1 = true;
                                this.view_area = true;
                                console.log("multi")
                              }
                            });

                            

                          });


                        }
                      
                      //สาขา : first(01-10) middle(01-12) last(00-06) //db(mas_office.office_name(shortBy:asc))
                      else if(  last2 == "01"||last2 == "02"||last2 == "03"||last2 == "04"||last2 == "05"||last2 == "06"||
                                last2 == "07"||last2 == "08"||last2 == "09"||last2 == "10")
                            {
                              this.craete_btn = true;
                              this.viewtarget1 = true;
                              this.advSearch1 = true;
                              this.vip = false;
                              // console.log("สาขา",officecode);
                            }
                    }
            
          }
    
    let params = { TEXT_SEARCH : officecode};

    this.targetService.MasOfficegetByCon("MasOfficegetByCon",params).then(list=>{
      // console.log(list.RESPONSE_DATA);

      for (var i=0;i<list.RESPONSE_DATA.length;i++){
        this.createTarget[i].code = list.RESPONSE_DATA[i].OFFICE_CODE;
        this.createTarget[i].id = list.RESPONSE_DATA[i].OFFICE_ID;
        this.createTarget[i].name = list.RESPONSE_DATA[i].OFFICE_NAME;
        
        // console.log(this.createTarget[i].code,this.createTarget[i].id,this.createTarget[i].name);
      }
    });
  }
  
 //step :search
 async onSearch(formSearch) {

  if (this.vip == false){
  this.page = false;
  let text = formSearch.TEXT_SEARCH;

  var officecode = "";
      officecode = this.mas_office;

  let params = { TEXT_SEARCH : text ,OFFICE_CODE: officecode};


  this.targetService.getByKeyword("TargetListgetByKeyword",params).then(list => {

    var targetKeywordlist = list;
    this.page = true;
    // console.log(this.mas_office);
    // console.log(list);

    if (targetKeywordlist.length == 0) {
      swal('', Message.noRecord, 'warning');
      this.onSearchComplete(targetKeywordlist)
    } 
    else { this.onSearchComplete(targetKeywordlist) }

    // console.log(targetKeywordlist);

  });
  }else if (this.vip == true){
    this.page = false;
    let text = formSearch.TEXT_SEARCH;
  
    var officecode = "";
        officecode = this.mas_office;
  
    let params = { TEXT_SEARCH : text ,OFFICE_CODE: ""};
  
  
    this.targetService.getByKeyword("TargetListgetByKeyword",params).then(list => {
  
      var targetKeywordlist = list;
      this.page = true;
      // console.log(this.mas_office);
      // console.log(list);
  
      if (targetKeywordlist.length == 0) {
        swal('', Message.noRecord, 'warning');
        this.onSearchComplete(targetKeywordlist)
      } 
      else { this.onSearchComplete(targetKeywordlist) }
  
      // console.log(targetKeywordlist);
  
    });
    }
}


// item: any[] = [
//   { id: 1, name: "เปรียบเทียบปรับ" },
//   { id: 2, name: "ส่งฟ้องศาล" },
//   { id: 3, name: "ไม่มีตัว" }
// ];

// item: any[] = [
//   { id: 1, name: "เปรียบเทียบปรับ" },
//   { id: 2, name: "ส่งฟ้องศาล" },
//   { id: 3, name: "ไม่มีตัว" }
// ];

selecteds: number = 0;


private date(){
  // bUDGET_YEAR_FROM 

  // console.log(this.item);

  const _date = new Date;
  const dd = _date.getDate();
  const mm = _date.getMonth() + 1;
  const yyyy = _date.getFullYear()+543;
  const _hours = _date.getHours();
  const _minutes = _date.getMinutes();
  const _seconds = _date.getSeconds();
  const _millimi = _date.getMilliseconds();
  const first_month = 10;
  const first_date = 1;
  const last_month = 9;
  const last_date = 30;
  const start = 2019;
  const sum = yyyy-10;
  const total = yyyy-sum;

  // console.log(sum);
  
  for (var i=0; i< total+1; i++){
    // console.log(i);
    // this.years[i].name = start+i;
    // this.id = i;

    this.years.push({
      name : sum+i
    });
  }

  // console.log(this.years);

  // console.log(this.years[i].name);

   

  // console.log('real',yyyy);
  // console.log('start',start);
  // console.log('sum',sum);
  // console.log('first',this.years);
  // console.log('first',start+'-'+first_month+'-'+first_date);
  // console.log('last',yyyy+'-'+last_month+'-'+last_date);
  // console.log(_hours+':'+_minutes+':'+_seconds+'.'+_millimi);
// this.date_time = yyyy+'-'+mm+'-'+dd+' '+_hours+':'+_minutes+':'+_seconds+'.'+_millimi;
// console.log(this.date_time);


  

}


onAdvSearch(advForm){

  // console.log(advForm);

  this.page = false;

  if (this.vip == false){

  const code = advForm.TARGET_CODE;
  const iS_SEND = advForm.IS_SEND;
  const sEQUENCE = advForm.SEQUENCE;
  const lAWSUIT_TYPE_TARGET = advForm.LAWSUIT_TYPE_TARGET;
  const oFFICE_NAME = advForm.OFFICE_NAME;
  const pRODUCT_GROUP_NAME = advForm.PRODUCT_GROUP_NAME;
  const bUDGET_YEAR_FROM = advForm.BUDGET_YEAR_FROM;
  const bUDGET_YEAR_TO = advForm.BUDGET_YEAR_TO;
  const officecode = this.mas_office;
  const tARGET_ITEM_DATE_FROM = advForm.TARGET_ITEM_DATE_FROM;
  const tARGET_ITEM_DATE_TO = advForm.TARGET_ITEM_DATE_TO;
  let dd1 ;
  let mm1 ;
  let yy1 ;
  let time_from ;

  let dd2 ;
  let mm2 ;
  let yy2 ;
  let time_to ;

  if (tARGET_ITEM_DATE_FROM == null){
      time_from = "";
  }else{
    const dd1 = tARGET_ITEM_DATE_FROM.jsdate.getDate();
    const mm1 = tARGET_ITEM_DATE_FROM.jsdate.getMonth() + 1;
    const yy1 = tARGET_ITEM_DATE_FROM.jsdate.getFullYear();
    time_from = yy1+"-"+mm1+"-"+dd1;
  }
  
  if (tARGET_ITEM_DATE_TO == null ){
    time_to = "";
  }else{
    const dd2 = tARGET_ITEM_DATE_TO.jsdate.getDate();
    const mm2 = tARGET_ITEM_DATE_TO.jsdate.getMonth() + 1;
    const yy2 = tARGET_ITEM_DATE_TO.jsdate.getFullYear();
    time_to = yy2+"-"+mm2+"-"+dd2;
  }

  const param = 
    {
      BUDGET_YEAR_FROM: bUDGET_YEAR_FROM,
      BUDGET_YEAR_TO: bUDGET_YEAR_TO,
      IS_SEND: iS_SEND,
      LAWSUIT_TYPE_TARGET: lAWSUIT_TYPE_TARGET,
      OFFICE_NAME: oFFICE_NAME,
      PRODUCT_GROUP_NAME: pRODUCT_GROUP_NAME,
      SEQUENCE: sEQUENCE,
      TARGET_CODE: code,
      TARGET_ITEM_DATE_FROM: time_from,
      TARGET_ITEM_DATE_TO: time_to,
      OFFICE_CODE: officecode
    }

  this.targetService.TargetListgetByConAdv("TargetListgetByConAdv",param).then(list=>{

    var targetKeywordlist = list;
    this.page = true;
  // console.log(list);
  if (targetKeywordlist.length == 0) {
    swal('', Message.noRecord, 'warning');
    this.onSearchComplete(targetKeywordlist)
  } 
  else { this.onSearchComplete(targetKeywordlist) }
    // console.log(targetKeywordlist);
  });
  }else if (this.vip == true){
    const code = advForm.TARGET_CODE;
  const iS_SEND = advForm.IS_SEND;
  const sEQUENCE = advForm.SEQUENCE;
  const lAWSUIT_TYPE_TARGET = advForm.LAWSUIT_TYPE_TARGET;
  const oFFICE_NAME = advForm.OFFICE_NAME;
  const pRODUCT_GROUP_NAME = advForm.PRODUCT_GROUP_NAME;
  const bUDGET_YEAR_FROM = advForm.BUDGET_YEAR_FROM;
  const bUDGET_YEAR_TO = advForm.BUDGET_YEAR_TO;
  const officecode = this.mas_office;
  const tARGET_ITEM_DATE_FROM = advForm.TARGET_ITEM_DATE_FROM;
  const tARGET_ITEM_DATE_TO = advForm.TARGET_ITEM_DATE_TO;
  let dd1 ;
  let mm1 ;
  let yy1 ;
  let time_from ;

  let dd2 ;
  let mm2 ;
  let yy2 ;
  let time_to ;

  if (tARGET_ITEM_DATE_FROM == null){
      time_from = "";
  }else{
    const dd1 = tARGET_ITEM_DATE_FROM.jsdate.getDate();
    const mm1 = tARGET_ITEM_DATE_FROM.jsdate.getMonth() + 1;
    const yy1 = tARGET_ITEM_DATE_FROM.jsdate.getFullYear();
    time_from = yy1+"-"+mm1+"-"+dd1;
  }
  
  if (tARGET_ITEM_DATE_TO == null ){
    time_to = "";
  }else{
    const dd2 = tARGET_ITEM_DATE_TO.jsdate.getDate();
    const mm2 = tARGET_ITEM_DATE_TO.jsdate.getMonth() + 1;
    const yy2 = tARGET_ITEM_DATE_TO.jsdate.getFullYear();
    time_to = yy2+"-"+mm2+"-"+dd2;
  }

  const param = 
    {
      BUDGET_YEAR_FROM: bUDGET_YEAR_FROM,
      BUDGET_YEAR_TO: bUDGET_YEAR_TO,
      IS_SEND: iS_SEND,
      LAWSUIT_TYPE_TARGET: lAWSUIT_TYPE_TARGET,
      OFFICE_NAME: "",
      PRODUCT_GROUP_NAME: pRODUCT_GROUP_NAME,
      SEQUENCE: sEQUENCE,
      TARGET_CODE: code,
      TARGET_ITEM_DATE_FROM: time_from,
      TARGET_ITEM_DATE_TO: time_to,
      OFFICE_CODE: officecode
    }

  this.targetService.TargetListgetByConAdv("TargetListgetByConAdv",param).then(list=>{

    var targetKeywordlist = list;
    this.page = true;
  // console.log(list);
  if (targetKeywordlist.length == 0) {
    swal('', Message.noRecord, 'warning');
    this.onSearchComplete(targetKeywordlist)
  } 
  else { this.onSearchComplete(targetKeywordlist) }
    // console.log(targetKeywordlist);
  });
  }
  
}

  //step 3 searchList
  async onSearchComplete(list: any) {

    
    this.dataList = [];

    if (this.vip == false){
      for (var i = 0 ; i < list.length;i++){

        if ( list[i].IS_ACTIVE == 1 && list[i].OFFICE_NAME == this.createTarget[0].name){
          // console.log(list[i]);
          if (list[i].length == 0) {
            this.ShowAlertNoRecord();
            this.showDataList = [];
            this.page = true;
            return false;
          }else{
            this.dataList.push(list[i]);
            this.page = true;
          }
          // console.log(this.dataList);
  
          list.map((item) => {
            switch (item.IS_SEND) {
                case 0:
                    item.TxtStatus = "ยังไม่ส่งเป้าปราบปราม";
                    break;
                case 1:
                    item.TxtStatus = "ส่งเป้าปราบปรามแล้ว";
                    break;
            }})
  
          list.map((item) => {
              switch (item.LAWSUIT_TYPE_TARGET) {
                  case 0:
                      item.LAWSUIT = "เปรียบเทียบปรับ";
                      break;
                  case 1:
                      item.LAWSUIT = "ส่งฟ้องศาล";
                      break;
                  case 2:
                      item.LAWSUIT = "ไม่มีตัว";
                      break;
              }})
  
            // set total record
            this.paginage.TotalItems = this.dataList.length;
            this.showDataList = this.dataList.slice(0, this.paginage.RowsPerPageOptions[0]);
  
              // console.log(this.showDataList);
  
            this.showDataList.map((item => {
            item.DATE = this.setDateStruct(item.TARGET_ITEM_DATE);
            }))
  
        }
        
  
      }
    }else if (this.vip == true){
      for (var i = 0 ; i < list.length;i++){

        if ( list[i].IS_ACTIVE == 1 ){
          // console.log(list[i]);
          if (list[i].length == 0) {
            this.ShowAlertNoRecord();
            this.showDataList = [];
            this.page = true;
            return false;
          }else{
            this.dataList.push(list[i]);
            this.page = true;
          }
          // console.log(this.dataList);
  
          list.map((item) => {
            switch (item.IS_SEND) {
                case 0:
                    item.TxtStatus = "ยังไม่ส่งเป้าปราบปราม";
                    break;
                case 1:
                    item.TxtStatus = "ส่งเป้าปราบปรามแล้ว";
                    break;
            }})
  
          list.map((item) => {
              switch (item.LAWSUIT_TYPE_TARGET) {
                  case 0:
                      item.LAWSUIT = "เปรียบเทียบปรับ";
                      break;
                  case 1:
                      item.LAWSUIT = "ส่งฟ้องศาล";
                      break;
                  case 2:
                      item.LAWSUIT = "ไม่มีตัว";
                      break;
              }})
  
            // set total record
            this.paginage.TotalItems = this.dataList.length;
            this.showDataList = this.dataList.slice(0, this.paginage.RowsPerPageOptions[0]);
  
              // console.log(this.showDataList);
  
            this.showDataList.map((item => {
            item.DATE = this.setDateStruct(item.TARGET_ITEM_DATE);
            }))
  
        }
        
  
      }
    }


    


    // let params = { TEXT_SEARCH : this.mas_office};
    // console.log(params);

    // this.targetService.getByKeyword("TargetListgetByKeyword",params).then(lists => {
    //     for (var s = 0 ; s < lists.length;s++){
    //       if (lists[s].IS_ACTIVE == 1){

    //           for (var i = 0 ; i < list.length;i++){
    //             if ( list[i].IS_ACTIVE == 1){
    //               // console.log(list[i]);

    //               if (lists[s].TARGET_ID == list[i].TARGET_ID){
                      
    //                 if (list[i].length == 0) {
    //                         this.ShowAlertNoRecord();
    //                         this.showDataList = [];
    //                         this.page = true;
    //                         return false;
    //                       }else{
    //                         this.dataList.push(list[i]);
    //                         this.page = true;
    //                       }

                          
    //               // console.log(this.dataList);

    //                 list.map((item) => {
    //                   switch (item.IS_SEND) {
    //                       case 0:
    //                           item.TxtStatus = "ยังไม่ส่งเป้าปราบปราม";
    //                           break;
    //                       case 1:
    //                           item.TxtStatus = "ส่งเป้าปราบปรามแล้ว";
    //                           break;
    //                   }})

    //                 list.map((item) => {
    //                     switch (item.LAWSUIT_TYPE_TARGET) {
    //                         case 0:
    //                             item.LAWSUIT = "เปรียบเทียบปรับ";
    //                             break;
    //                         case 1:
    //                             item.LAWSUIT = "ส่งฟ้องศาล";
    //                             break;
    //                         case 2:
    //                             item.LAWSUIT = "ไม่มีตัว";
    //                             break;
    //                     }})

    //                   // set total record
    //                   this.paginage.TotalItems = this.dataList.length;
    //                   this.showDataList = this.dataList.slice(0, this.paginage.RowsPerPageOptions[0]);

    //                     // console.log(this.showDataList);

    //                   this.showDataList.map((item => {
    //                   item.DATE = this.setDateStruct(item.TARGET_ITEM_DATE);
    //                 }))
    //               }
    //             }
    //           }
    //     }
    //   }
    // });
  }
  
  //set dateThai
  setDateStruct(date) {
    let months = this.targetService.I18N_VALUES.months;
    let temp = date = new Date(date);
    let CompDate = `${temp.getUTCDate()} ${months[temp.getMonth()]} ${temp.getUTCFullYear() + 543}`;
    return CompDate;
  }

  async pageChanges(event) {
    this.showDataList = await this.dataList.slice(event.startIndex - 1, event.endIndex);
    await  this.showDataList.map((item => {
      item.DATE = this.setDateStruct(item.TARGET_ITEM_DATE);
    }))
  }

  async onCreateTarget(OFFICE_NAME,OFFICE_CODE,OFFICE_ID) {
    const name = OFFICE_NAME;
    const code = OFFICE_CODE;
    const id = OFFICE_ID;
    
    // console.log(OFFICE_NAME,OFFICE_CODE,OFFICE_ID);
    this.craete_btn = false;
    this.search_text = false;
    this.router.navigateByUrl(`/SuppressTarget/manage/${'C'}/${'0'}`);

  }


  clickPrint(){

  }

}

