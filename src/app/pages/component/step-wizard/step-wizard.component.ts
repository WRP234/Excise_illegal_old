import { Component, OnInit, AfterViewInit } from '@angular/core';
import { StepWizardConfig } from './step-wizard.config'
import { Router } from '@angular/router';
import { StepWizardService } from './step-wizard.service';

@Component({
  selector: 'app-step-wizard',
  templateUrl: './step-wizard.component.html',
  styleUrls: ['./step-wizard.component.scss']
})
export class StepWizardComponent extends StepWizardConfig implements OnInit, AfterViewInit {

  constructor(private router: Router,
    private srevice: StepWizardService
  ) {
    super();
  }


  ngOnInit() {
    this.stepForm = this.createReqForm();
  }

  ngAfterViewInit() {
    this.setReqFrom();
  }

  setReqFrom() {
    this.input.subscribe(value => {
      if (value) {

        const value$ = value;
        
        switch (this.sectionId) {
          case 1:
            this.stepForm.controls['NOTICE_CODE'].setValue(value$['VALUE']);
            break;
          case 2:
            this.stepForm.controls['ARREST_CODE'].setValue(value$['VALUE']);
            break;
          case 3:
            if (value$['VALUE'] == '0')
              this.stepForm.controls['ARREST_CODE'].setValue(value$['RESERVE_VALUE']);
            else
              this.stepForm.controls['LAWSUIT_ID'].setValue(value$['VALUE']);
            break;
          case 4:
            if (value$['VALUE'] == '0')
              this.stepForm.controls['ARREST_CODE'].setValue(value$['RESERVE_VALUE']);
            else
              this.stepForm.controls['PROVE_ID'].setValue(value$['VALUE']);
            break;
          case 5:
            if (value$['VALUE'] == '0')
              this.stepForm.controls['ARREST_CODE'].setValue(value$['RESERVE_VALUE']);
            else
              this.stepForm.controls['COMPARE_ID'].setValue(value$['VALUE']);
            break;
          case 6:
            this.stepForm.controls['REVENUE_ID'].setValue(value$['VALUE']);
            break;
          case 7:
            if (value$['VALUE'] == '0')
              this.stepForm.controls['ARREST_CODE'].setValue(value$['RESERVE_VALUE']);
            else
              this.stepForm.controls['BRIBE_REWARD_ID'].setValue(value$['VALUE']);
            break;
          default:
            break;
        }

        this.srevice.TimeLineListgetByCon(this.stepForm.getRawValue())
          .subscribe(res => {
            if (res.length) {

              const r = res[0];

              this.section.map(m => {
                if (m.id == 1) m.processed = r['NOTICE_CODE'] ? true : false;
                if (m.id == 2) m.processed = r['ARREST_CODE'] ? true : false;
                if (m.id == 3) m.processed = r['LAWSUIT_ID'] ? true : false;
                if (m.id == 4) m.processed = r['PROVE_ID'] ? true : false;
                if (m.id == 5) m.processed = r['COMPARE_ID'] ? true : false;
                if (m.id == 6) m.processed = r['REVENUE_ID'] ? true : false;
                if (m.id == 7) m.processed = r['BRIBE_REWARD_ID'] ? true : false;
              })

              const isProcessed = this.section.filter(f => f.processed == true);

              const isMaxProcessed = Math.max.apply(Math, isProcessed.map((o) => { return o.id; }))

              //set latest processed
              this.section = this.section.reduce((a, c) =>
                [...a, { ...c, proceed_to: c.id == isMaxProcessed ? true : false }], []);

            }
          })
      }
    })
  }

  onClickStepRouter(i) {
    switch (i) {
      case 1:
        this.router.navigateByUrl('/notice/list');
        break;
      case 2:
        this.router.navigateByUrl('/arrest/list');
        break;
      case 3:
        this.router.navigateByUrl('/lawsuit/list');
        break;
      case 4:
        this.router.navigateByUrl('/prove/list');
        break;
      case 5:
        this.router.navigateByUrl('/fine/list');
        break;
      case 6:
        this.router.navigateByUrl('/revenue/list');
        break;
      case 7:
        this.router.navigateByUrl('/reward/list');
        break;
    }
  }


}
