import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NavigationService } from 'app/shared/header-navigation/navigation.service';
import { pagination } from '../../../config/pagination';
import { Router } from '@angular/router';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { Message } from '../../../config/message';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ListComponent implements OnInit {
  @ViewChild('advForm') advForm: NgForm;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  paginage = pagination;
  advSearch: any;
  List: any = [{ "name": "นาย อนันชพงศ์ เอี่ยมสำอางค์", "pName": "เจ้าพนักงานสรรพสามิตปฏิบัติงาน", "offName": "สสพ.ชุมพร" },
  { "name": "นางสาว นุชนาถ ธรรมโชติ", "pName": "เจ้าพนักงานสรรพสามิตปฏิบัติงาน", "offName": "สสภ.9" }];

  constructor(private router: Router,
    private navService: NavigationService, ) {
    // set button false
    this.navService.setEditButton(false);
    this.navService.setDeleteButton(false);
    this.navService.setPrintButton(false);
    this.navService.setSaveButton(false);
    this.navService.setCancelButton(false);
    this.navService.setNextPageButton(false);
    this.navService.setNewButton(false);
    // set button true
    this.navService.setSearchBar(true);
    
    this.advSearch = this.navService.showAdvSearch;
  }

  async pageChanges(event) { }

  clickManage(event: any) {
    const getdata = event;
    // event.path[1].innerText
    localStorage.setItem('UserName', 'UserName');
    localStorage.setItem('Name', getdata.name);
    localStorage.setItem('positionName', getdata.pName);
    localStorage.setItem('officeName', getdata.offName);
    this.router.navigate([`/uac/manage`]);
  }

  async onAdvSearch(form: any) {
    const getfrom = form
    console.log("datafrom : ", getfrom)
  }
  ngOnInit() { 
    this.navigate_Service();
  }
  private navigate_Service() {

    // this.navService.setSearchBar.takeUntil(this.destroy$).subscribe(async status => {
    //   if (status) {
    //     console.log("onSave")
    //   }
    // });
    
  }
  ngOnDestroy() { }

}
