import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActivatedRoute, Router } from '@angular/router';
import { pagination } from '../../../../../config/pagination';
import { SearchSuspectsService } from '../../analyze-services/searchSuspects.service'
import swal from 'sweetalert2';
import { Message } from 'app/config/message';
import { PreloaderService } from '../../../../../shared/preloader/preloader.component';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ListComponent implements OnInit {
  @ViewChild('advForm') advForm: NgForm;

  PERSON_TYPE: any = [{ person_type: "คนไทย", person_value: 0 }, { person_type: "คนต่างชาติ", person_value: 1 }]
  ENTITY_TYPE: any = [{ entity_type: "บุคคลธรรมดา", entity_value: 0 }, { entity_type: "นิติบุคคล", entity_value: 1 }]

  fromSearch: any = [];
  listfromSearch: any = [];

  //btn
  advSearch: any;
  showAdvSearch = new BehaviorSubject<Boolean>(true);

  paginage = pagination;
  constructor(private router: Router,
    private searchSuspectsService: SearchSuspectsService,
    private preloaderService: PreloaderService
  ) {

  }

  ngOnInit() {
    this.advSearch = this.showAdvSearch;
  }

  setAdvSearch() {
    // if (this.showAdvSearch.getValue()) {
    //   this.showAdvSearch.next(false);
    // } else {
    //   this.showAdvSearch.next(true);
    // }
  }

  clickimageSearch() {
    this.router.navigate(['/suspectsAnalyze/imageSearch']);
  }

  clickView(code: string) {
    this.router.navigate([`/suspectsAnalyze/manage/R/${code}`]);
  }

  onSearchByKeyword(keyword) {
    this.preloaderService.setShowPreloader(true);
    this.searchSuspectsService.PersonListgetByKeyword(keyword).subscribe(list => {

      var SearchResult = list;
      if (!SearchResult.length) {
        swal('', Message.noRecord, 'warning');
        this.preloaderService.setShowPreloader(false);
        return false;
      } else {
        this.preloaderService.setShowPreloader(false);
        this.onSearchComplete(SearchResult)
      }
    }, (error) => {
      swal(``, `*** API ERROR !! ***  ${error.url}` + `<br/>` + `*** MESSAGE ERROR ***` + `<br/>` + error.error.MSG, `error`);
      this.preloaderService.setShowPreloader(false);
      return false;
    })
  }

  onAdvSearch(value) {
    this.preloaderService.setShowPreloader(true);
    this.searchSuspectsService.PersonListgetByConAdv(value).subscribe(list => {
      var SearchResult = list;
      if (!SearchResult.length) {
        swal('', Message.noRecord, 'warning');
        this.preloaderService.setShowPreloader(false);
        return false;
      } else {
        this.preloaderService.setShowPreloader(false);
        this.onSearchComplete(SearchResult)
      }
    }, (error) => {
      swal(``, `*** API ERROR !! ***  ${error.url}` + `<br/>` + `*** MESSAGE ERROR ***` + `<br/>` + error.error.MSG, `error`);
      this.preloaderService.setShowPreloader(false);
      return false;
    })

  }

  async onSearchComplete(list) {
    this.listfromSearch = list;
    this.listfromSearch.filter(f => {
      if (f.ENTITY_TYPE == 0) { list.map(m => m.ENTITY_TYPE = 'บุคคลธรรมดา') }
      else if (f.ENTITY_TYPE == 1) { list.map(m => m.ENTITY_TYPE = 'นิติบุคคล') }
      if (f.PERSON_TYPE == 0) { list.map(m => m.PERSON_TYPE = 'คนไทย') }
      else if (f.PERSON_TYPE == 1) { list.map(m => m.PERSON_TYPE = 'คนต่างชาติ') }
    })

    this.paginage.TotalItems = this.listfromSearch.length;
    this.fromSearch = this.listfromSearch.slice(0, this.paginage.RowsPerPageOptions[0]);
  }


  async pageChanges(event) {
    this.fromSearch = await this.listfromSearch.slice(event.startIndex - 1, event.endIndex);
  }


}
