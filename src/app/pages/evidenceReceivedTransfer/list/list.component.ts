import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ListConfig } from './list.config';
import { NavigationService } from 'app/shared/header-navigation/navigation.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ListComponent extends ListConfig implements OnInit {

  constructor(
    private navService: NavigationService,
  ) {
    super();
    this.advSearch = this.navService.showAdvSearch;
  }

  ngOnInit() {
    this.advSearch.next(true);
  }

  setAdvSearch() {
    this.advSearch.next(!this.advSearch.getValue());
  }

  onKeywordSearch() {

  }

  onAdvSearch() {

  }

  async pageChanges(event: any) {
    this.evidenceInList = await this.evidenceIn.slice(event.startIndex - 1, event.endIndex);



    this.evidenceInList = [{
      ROW_ID: 1, ID: 1
    }]

  }


}
