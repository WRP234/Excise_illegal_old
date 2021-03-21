import { Component, OnInit } from '@angular/core';
import { TableDataConfig } from './table-data.config';
import { PagerService, IPagerService } from '../services/Pager.service';
import { IRequestBribeReward } from '../../interfaces/RequestBribeReward.interface';
import { RequestBribeRewardService } from '../../services/RequestBribeReward.service';

@Component({
  selector: 'app-table-data',
  templateUrl: './table-data.component.html',
  styleUrls: ['./table-data.component.scss']
})
export class TableDataComponent extends TableDataConfig implements OnInit {
  // array of all items to be paged
  private allItems: any[];

  // pager object
  public pager: IPagerService = {
    totalItems: this.paginage.TotalItems,
    currentPage: this.paginage.CurrentPage,
    pageSize: this.paginage.PageSize,
    totalPages: 1,
    startPage: 1,
    endPage: 1,
    startIndex: 1,
    endIndex: 0,
    pages: this.paginage.RowsPerPageOptions
  };

  // paged items
  public pagedItems: any[];
  constructor(private pagerService: PagerService, private requestBribeRewardService: RequestBribeRewardService,) {
    super();
  }

  ngOnInit() {
    this.data$.subscribe(data => {

      data.forEach((ele: any, index: number) => {

        ele.trClass = ele.REQUEST_STATUS == 'ยังไม่ได้แบ่งเงิน' ? 'caseC' : '';

      });

      if (data != null) {
        this.allItems = data;
        this.setPage(1, this.paginage.PageSize);
      }
    });
  }

  public setPage(current: number, pageSize) {
    // get pager object from service
    this.pager = this.pagerService.getPager(
      this.allItems ? this.allItems.length : 0,
      current,
      pageSize
    );

    // get current page of items
    if (this.allItems) {
      this.pagedItems = this.allItems.slice(
        this.pager.startIndex,
        this.pager.endIndex + 1
      );

      this.pagedItems.forEach((f, index) => {
        this.ShowInputModel[index] = 1;
      });
    }
  }
  public pageChanges($event) {
    // console.log('pageChange', $event);
    // this.pager.totalItems = $event.TotalItems
    // this.pager.pageSize = $event.PageSize
    this.pager.currentPage = $event.currentPage;
    this.pager.startIndex = $event.startIndex;
    this.pager.endIndex = $event.endIndex;
    this.pager.pageSize = $event.pageSize;
    this.pager.pages = $event.pages;
    this.setPage($event.currentPage, $event.pageSize);
  }
  public viewData(data) {}

  public customRouteFor(
    path: string,
    item: any,
    route: string[]
  ): (string | number)[] {

    console.log(item);

    return [path, ...route.map(m => item[m])];
  }

  public customRouteNew(item: any) {

    console.log(item);

    // this.memberService.getmemberheader().then(res => {
    //   this.doughnutChartLabels = res;
    // })

    var test: any = '';

    this.requestBribeRewardService.RequestBribeRewardgetByIndictmentID({
      IndictmentID: item.IndictmentID
    }).toPromise().then(res => {
      console.info(res);
      // this.doughnutChartLabels = res;
    })

    // const RequestBribeRewards: IRequestBribeReward[] = this.requestBribeRewardService
    // .RequestBribeRewardgetByIndictmentID({
    //   IndictmentID: item.IndictmentID
    // })
    // .toPromise();

    // const RequestBribeRewardID =  RequestBribeRewards.length > 0 ? RequestBribeRewards[0].RequestBribeRewardID : RequestBribeRewards.length = 0;

    return ['/reward/reward/C', test , item.IndictmentID];
  }
}
