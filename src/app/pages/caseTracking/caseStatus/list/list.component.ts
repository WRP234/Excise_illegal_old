import { CaseStatusList } from './../../model/case-Status-Info';
import { CaseStatusInfo } from './../../model/case-Status-list';


import { CaseStatusService } from './../caseStatus.service';
import { Component, OnInit, ViewEncapsulation ,ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActivatedRoute, Router } from '@angular/router';
import { pagination } from '../../../../config/pagination';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ListComponent implements OnInit {
  @ViewChild('advForm') advForm: NgForm;

  //btn
  advSearch: any;
  showAdvSearch = new BehaviorSubject<Boolean>(true);

  paginage = pagination;
  //
  listCaseStatus  =[];

listCaseStatusPagelist =[];

  accountOfficeCode:String= '';
  listProductGroup = [
    "เครื่องดื่ม",
    "รถยนต์",
    "สุรา",
    "น้ำมัน",
    "เครื่องไฟฟ้า",
    "แบตเตอรี่",
    "แก้วและเครื่องแก้ว",
    "รถจักรยานยนต์",
    "เรือ",
    "ผลิตภัณฑ์เคครอื่งหอมและเครื่องสำอาง",
    "พรมและสิ่งทอปูพื้นอื่นๆ",
    "หินอ่อนและหินแกรนิต",
    "สารละลายชั้นบรรยากาศ",
    "ยาสูบ",
    "ไพ่",
    "สุราแช่",
    "สุรากลั่น",
    "กิจการบรรเทิงหรือหยอ่นใจ",
    "กิจการเสี่ยงโชค",
    "กิจการที่มีผลกระทบต่อสิ่งแวดล้อม",
    "กิจการที่ได้รับอนุญาตหรือสัปทานจากรัฐ",
    "สินค้าอื่นๆ",
  ]
  yearList= []

  listStatusCase = [
    "ทั้งหมด",
    "รอรับคดี",
    "ไ่มรับเป็นคดี",
    "รอคำพิพากษา",
    "รอพิสูจน์ของกลาง",
    "รอเปรียบเทียบและชำระค่าปรับ",
    "ปล่อยตัวชั่วคราว",
    "รอนำเงินส่งรายได้",
    "รองานรายได้รับเงินนำส่ง",
    "รอแบ่งเงินสินบนรางวัล",
    "แบ่งเงินสินบนรางวัลเรียบร้อยแล้ว",
  ]
  

  constructor(private router: Router,private caseStatusService:CaseStatusService) { }




  ngOnInit() {
    var currentYear = (new Date().getFullYear()) + 543 ;
    for(let i = currentYear;i >= (currentYear - 10); i--) {
      this.yearList.push(i)
    }
    this.advSearch = this.showAdvSearch;

    this.accountOfficeCode = localStorage.getItem('officeCode');
  }
  ngOnDestroy() {
    this.paginage.TotalItems = 0;
  
  }

  setAdvSearch() {
    if (this.showAdvSearch.getValue()) {

      console.log('setAdvSearch')
      this.showAdvSearch.next(false);
    } else {
      this.showAdvSearch.next(true);
    }
  }

  clickSearch(form: any){

    if(this.accountOfficeCode != null && this.accountOfficeCode != undefined){
      const params = {
        ACCOUNT_OFFICE_CODE: this.accountOfficeCode,
        TEXT_SEARCH : form.TEXT_SEARCH
      
        }
        this.searchByKeyword(params);
    }
  }
  async pageChanges(event: any) {
    this.listCaseStatus = await this.listCaseStatusPagelist.slice(event.startIndex - 1, event.endIndex);
  }
  searchByKeyword(params){
    this.listCaseStatus=[]
    this.listCaseStatusPagelist =[]
    this.paginage.TotalItems = 0;
    this.caseStatusService.SearchByKeyword(params).subscribe(data=>{
      const result = data as CaseStatusList;
      if(result.IsSuccess ){      
        for (let i = 0; i < result.CaseStatusList.length; i++) {
          result.CaseStatusList[i].count_number = i + 1;
          this.listCaseStatus.push(result.CaseStatusList[i])
          this.listCaseStatusPagelist.push(result.CaseStatusList[i])
        }
       
        this.listCaseStatus.slice(0, 5);                       
        this.paginage.TotalItems =result.CaseStatusList.length;     

      }
    })
  }

  searchConditionAdvance(params){
    console.log(params)
    this.listCaseStatus=[]
    this.listCaseStatusPagelist =[]
    this.paginage.TotalItems = 0;
    this.caseStatusService.SearchByAdvance(params).subscribe(data=>{
      const result = data as CaseStatusList;
      console.log(result)
      if(result.IsSuccess ){      
        for (let i = 0; i < result.CASE_STATUS_LIST.length; i++) {
          result.CASE_STATUS_LIST[i].count_number = i + 1;
          this.listCaseStatus.push(result.CASE_STATUS_LIST[i])
          this.listCaseStatusPagelist.push(result.CASE_STATUS_LIST[i])
        }
       
        this.listCaseStatus.slice(0, 5);                       
        this.paginage.TotalItems =result.CASE_STATUS_LIST.length;   
      }
    })
  }


  onAdvSearch(form: any){
    if(this.accountOfficeCode != null && this.accountOfficeCode != undefined){
      const params = {
        // ACCOUNT_OFFICE_CODE: this.accountOfficeCode,
        ARREST_CODE : form.arrestCode,
        OCCURRENCE_DATE_FROM : (form.occurrenceDateFrom) ? (form.occurrenceDateFrom.epoc) : (""),
        OCCURRENCE_DATE_TO : (form.OccurrenceDateTo) ? (form.OccurrenceDateTo.epoc) : (""),
        // PROVINCE : form.province,
        // DISTRINCE : form.district,
        // SUBDISTRINCE : form.subDistrict,
        LOCATION : form.location,
        ARREST_LAWBREAKER_NAME : form.arrestLawBreakerName,
        ARREST_STAFF_NAME : form.arrestStaffName,
        SUBSECTION_NAME : form.subsectionName,
        PRODUCT_GROUP_NAME : form.productGroupName,
        LAWSUIT_NO : form.lawSuitNo,
        LAWSUIT_NO_YEAR : form.lawSuitNoYear, //not have input
        LAWSUIT_STAFF_NAME : form.lawSuitStaffName,
        LAWSUIT_DATE_FROM : (form.lawSuitDateFrom) ? (form.lawSuitDateFrom.epoc) : (""),
        LAWSUIT_DATE_TO : (form.lawSuitDateTo) ? (form.lawSuitDateTo.epoc) : (""),
        LAWSUIT_OFFICE_NAME : form.lawSuitOfficeName,
        PROVE_NO : form.proveNo,
        PROVE_NO_YEAR : form.proveNoYear, //not have input
        PROVE_STAFF_NAME : form.proveStaffName,
        PROVE_DATE_FROM : (form.proveDateFrom) ? (form.proveDateFrom.epoc) : (""),
        PROVE_DATE_TO : (form.proveDateTo) ? (form.proveDateTo.epoc) : (""),
        //not have form.compareNo
        COMPARE_NO:form.compareNo,
        COMPARE_NO_YEAR:form.compareNoYear,
        COMPARE_STAFF_NAME : form.compareStaffName,
        COMPARE_DATE_FROM : (form.compareDateFrom) ? (form.compareDateFrom.epoc) : (""),
        COMPARE_DATE_TO : (form.compareDateTo) ? (form.compareDateTo.epoc) : (""),
        CASE_STATUS : form.caseStatus,
      }

      this.searchConditionAdvance(params);
    }
  }

  clickView(arrestId: number){
    this.router.navigate([`/caseStatus/case-details/${arrestId}`]);
  }
}
