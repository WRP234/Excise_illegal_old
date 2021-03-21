import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { caseReportConfig } from '../case-report.config';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends caseReportConfig implements OnInit {

  constructor(private router: Router) {
    super();
  }

  ngOnInit() {
  }

  onClick = (item: any) =>
    this.router.navigate([`/report/case-report/list/criteria`], {
      queryParams: { reportName: item.reportName, reportCode: item.reportCode }
    });

}
