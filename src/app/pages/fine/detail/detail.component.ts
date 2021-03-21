import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from '../../../shared/header-navigation/navigation.service';
import { IMyDpOptions } from 'mydatepicker';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  viewMode:boolean =true;
  // advSearch: any;
  private today = new Date();
  public LawsuitDateOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd/mmm/yyyy',
    disableSince: { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() + 1 },
  };
  constructor(
    private router: Router,
    private navservice: NavigationService
) {
//  true
    this.navservice.setNextPageButton(true);

// false
    this.navservice.setEditButton(false);
    this.navservice.setDeleteButton(false);
    this.navservice.setPrintButton(false);
    this.navservice.setSaveButton(false);
    this.navservice.setCancelButton(false);
    this.navservice.setSearchBar(false);
    this.navservice.setNewButton(false);
    // this.advSearch = this.navservice.showAdvSearch;

}
  ngOnInit() {
  }

}
