import { CaseStatusInfo } from './../../model/case-Status-list';
import { CaseStatusDetail } from './../../model/case-Status-detail';

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CaseStatusService } from './../caseStatus.service';

@Component({
  selector: 'app-case-details',
  templateUrl: './case-details.component.html',
  styleUrls: ['./case-details.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class CaseDetailsComponent implements OnInit {
  arrestId: number
  listCaseStatusDetail :CaseStatusInfo [];
  caseStatusDetail :CaseStatusInfo;

  constructor(
    private activeRoute: ActivatedRoute,
    private caseStatusService:CaseStatusService
  ) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(p => { this.arrestId = p['arrestId'] });
    if(this.arrestId) {
      this.loadCaseStatus()
    }
  }

  loadCaseStatus() {
      const params = {
        ARREST_ID: this.arrestId,
      }
      this.caseStatusService.CaseStatusDetail(params).subscribe(data=>{
        const result = data as CaseStatusDetail;
        if(result.IsSuccess){
          this.listCaseStatusDetail = result.CASE_STATUS;
          if(this.listCaseStatusDetail[0]) {
            this.caseStatusDetail = this.listCaseStatusDetail[0]
          }
          console.log(this.caseStatusDetail)
        }
      })
    }

}
