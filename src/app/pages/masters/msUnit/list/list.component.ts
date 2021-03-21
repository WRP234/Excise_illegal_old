import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { pagination } from 'app/config/pagination';
import { NavigationService } from 'app/shared/header-navigation/navigation.service';
import { PreloaderService } from 'app/shared/preloader/preloader.component';
import swal from 'sweetalert2';
import { MasUnitService } from '../masUnit.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ListComponent implements OnInit {

  advSearch: any;
  dataList = [];
  showDataList = [];
  paginage = pagination;
  PRODUCT_GROUP_LIST: any[] = [];

  constructor(
    private _router: Router,
    private navService: NavigationService,
    private preloader: PreloaderService,
    private masUnitService: MasUnitService,
  ) {
    this.advSearch = this.navService.showAdvSearch;
  }

  async ngOnInit() {
    await this.preloader.setShowPreloader(true);
    this.advSearch.next(true);
    await this.getProductGroup();
    await this.preloader.setShowPreloader(false);
  }

  clickCreate = () => this._router.navigate([`/msUnit/manage/C/NEW`]);

  clickView = (unitID: string) => this._router.navigate([`/msUnit/manage/R/${unitID}`]);

  setAdvSearch() {
    this.advSearch.next(!this.advSearch.getValue());
  }


  onAdvSearch(form: any): void {
    this.preloader.setShowPreloader(true);

    this.masUnitService.MasProductUnitgetByConAdv(form.value).subscribe(res => {
      if (res.length) {
        this.onSearchComplete(res);
        this.preloader.setShowPreloader(false);
      } else {
        this.showDataList = [];
        swal('', "ไม่พบข้อมูล", 'warning');
        this.preloader.setShowPreloader(false);
      }
      this.preloader.setShowPreloader(false);

    }, (err: HttpErrorResponse) => {
      swal('', err.message, 'error');
      this.preloader.setShowPreloader(false);
    });
  }

  onSearchComplete(list: any) {
    this.dataList = [];

    if (!list.length) {
      this.showDataList = [];
      return false;
    }

    if (Array.isArray(list)) {
      this.dataList = list;
    } else {
      this.dataList.push(list);
    }

    // set total record
    this.paginage.TotalItems = this.dataList.length;
    this.showDataList = this.dataList.slice(0, this.paginage.RowsPerPageOptions[0]);
  }

  getProductGroup() {
    var paramsOther = {
      PRODUCT_GROUP_ID: "",
      PRODUCT_GROUP_CODE: ""
    }

    this.masUnitService.MasProductGroupgetByCon(paramsOther).subscribe(
      (list) => {
        this.PRODUCT_GROUP_LIST = list;
      }, (error) => { console.error(error); return false; });
  }

  async pageChanges(event) {
    this.showDataList = await this.dataList.slice(event.startIndex - 1, event.endIndex);
  }

}
