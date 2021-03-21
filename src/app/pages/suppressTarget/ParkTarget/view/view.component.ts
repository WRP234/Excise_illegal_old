import { Component, OnInit, ViewEncapsulation, ViewChild,ElementRef } from '@angular/core';
// import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// import { NavigationService } from '../../../../shared/header-navigation/navigation.service';
// import { Nav_Parktarget_Service } from '../nav_target.service';
import { pagination } from '../../../../config/pagination';
import { SuppressTarget } from '../../suppressTarget.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Nav_target_Service } from "../../../../shared/header-navigation/nav_target.service";
import { PrintdocModelComponent } from '../../printdoc-model/printdoc-model.component';
import { async } from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class ViewComponent implements OnInit {
  // const sum_QTY_1 = 0;
  @ViewChild('printDocModal') printDocModel: ElementRef;
  isRequired: boolean | false;
  private onNextPageSubscribe: any;
  private onCancelSubscribe: any;
  private subOnSearch: any;
  modal: any;
  constructor(
    private navService: Nav_target_Service,
    private router: Router,
    private ngbModel: NgbModal,
  ) {




  }

  ngOnInit() {
    localStorage.setItem('programcode', 'ILG60-99-02');
    this.show_button();
    this.navigate_service();
  }
  private destroy$: Subject<boolean> = new Subject<boolean>();

  private navigate_service() {
    this.navService.onSendTarget.takeUntil(this.destroy$).subscribe(async status => {
      if (status) {
        await this.ngOnSend_target();
        // this.router.navigate(['/SuppressTarget/manages/target/R']);
      }
    });
    this.navService.onPrint.takeUntil(this.destroy$).subscribe(async status => {
      if(status){
        // await this.
        this.modal = this.ngbModel.open(PrintdocModelComponent,{backdrop:'static',size:'lg',})
      }
    });
  }

  targetItemDetail: Array<any> = [
    { ID: 0, MONTH: 'ตุลาคม', QTY_1: 5, FINE_1: 2300, QTY_2: 5, FINE_2: 2300, QTY_3: 5, FINE_3: 2300, },
    { ID: 1, MONTH: 'พฤศจิกายน', QTY_1: 5, FINE_1: 2300, QTY_2: 5, FINE_2: 2300, QTY_3: 5, FINE_3: 2300, },
    { ID: 2, MONTH: 'ธันวาคม', QTY_1: 5, FINE_1: 2300, QTY_2: 5, FINE_2: 2300, QTY_3: 5, FINE_3: 2300, },
    { ID: 3, MONTH: 'มกราคม', QTY_1: 5, FINE_1: 2300, QTY_2: 5, FINE_2: 2300, QTY_3: 5, FINE_3: 2300, },
    { ID: 4, MONTH: 'กุมภาพันธ์', QTY_1: 5, FINE_1: 2300, QTY_2: 5, FINE_2: 2300, QTY_3: 5, FINE_3: 2300, },
    { ID: 5, MONTH: 'มีนาคม', QTY_1: 5, FINE_1: 2300, QTY_2: 5, FINE_2: 2300, QTY_3: 5, FINE_3: 2300, },
    { ID: 6, MONTH: 'เมษายน', QTY_1: 5, FINE_1: 2300, QTY_2: 5, FINE_2: 2300, QTY_3: 5, FINE_3: 2300, },
    { ID: 7, MONTH: 'พฤษภาคม', QTY_1: 5, FINE_1: 2300, QTY_2: 5, FINE_2: 2300, QTY_3: 5, FINE_3: 2300, },
    { ID: 8, MONTH: 'มิถุนายน', QTY_1: 5, FINE_1: 2300, QTY_2: 5, FINE_2: 2300, QTY_3: 5, FINE_3: 2300, },
    { ID: 9, MONTH: 'กรกฎาคม', QTY_1: 5, FINE_1: 2300, QTY_2: 5, FINE_2: 2300, QTY_3: 5, FINE_3: 2300, },
    { ID: 10, MONTH: 'สิงหาคม', QTY_1: 5, FINE_1: 2300, QTY_2: 5, FINE_2: 2300, QTY_3: 5, FINE_3: 2300, },
    { ID: 11, MONTH: 'กันยายน', QTY_1: 5, FINE_1: 2300, QTY_2: 5, FINE_2: 2300, QTY_3: 5, FINE_3: 2300, },
  ];
  targetItemDetail_NON: Array<any> = [
    { ID: 0, MONTH: 'ตุลาคม', QTY_1: null, FINE_1: null, QTY_2: 5, FINE_2: 2300, QTY_3: 5, FINE_3: 2300, QTY_4: 35, FINE_4: 16100, },
    { ID: 1, MONTH: 'พฤศจิกายน', QTY_1: null, FINE_1: null, QTY_2: 5, FINE_2: 2300, QTY_3: 5, FINE_3: 2300, QTY_4: 35, FINE_4: 16100, },
    { ID: 2, MONTH: 'ธันวาคม', QTY_1: null, FINE_1: null, QTY_2: 5, FINE_2: 2300, QTY_3: 5, FINE_3: 2300, QTY_4: 35, FINE_4: 16100, },
    { ID: 3, MONTH: 'มกราคม', QTY_1: null, FINE_1: null, QTY_2: 5, FINE_2: 2300, QTY_3: 5, FINE_3: 2300, QTY_4: 35, FINE_4: 16100, },
    { ID: 4, MONTH: 'กุมภาพันธ์', QTY_1: null, FINE_1: null, QTY_2: 5, FINE_2: 2300, QTY_3: 5, FINE_3: 2300, QTY_4: 35, FINE_4: 16100, },
    { ID: 5, MONTH: 'มีนาคม', QTY_1: null, FINE_1: null, QTY_2: 5, FINE_2: 2300, QTY_3: 5, FINE_3: 2300, QTY_4: 35, FINE_4: 16100, },
    { ID: 6, MONTH: 'เมษายน', QTY_1: null, FINE_1: null, QTY_2: 5, FINE_2: 2300, QTY_3: 5, FINE_3: 2300, QTY_4: 35, FINE_4: 16100, },
    { ID: 7, MONTH: 'พฤษภาคม', QTY_1: null, FINE_1: null, QTY_2: 5, FINE_2: 2300, QTY_3: 5, FINE_3: 2300, QTY_4: 35, FINE_4: 16100, },
    { ID: 8, MONTH: 'มิถุนายน', QTY_1: null, FINE_1: null, QTY_2: 5, FINE_2: 2300, QTY_3: 5, FINE_3: 2300, QTY_4: 35, FINE_4: 16100, },
    { ID: 9, MONTH: 'กรกฎาคม', QTY_1: null, FINE_1: null, QTY_2: 5, FINE_2: 2300, QTY_3: 5, FINE_3: 2300, QTY_4: 35, FINE_4: 16100, },
    { ID: 10, MONTH: 'สิงหาคม', QTY_1: null, FINE_1: null, QTY_2: 5, FINE_2: 2300, QTY_3: 5, FINE_3: 2300, QTY_4: 35, FINE_4: 16100, },
    { ID: 11, MONTH: 'กันยายน', QTY_1: null, FINE_1: null, QTY_2: 5, FINE_2: 2300, QTY_3: 5, FINE_3: 2300, QTY_4: 35, FINE_4: 16100, },
  ];

  // public get_QTY_1():any{
  //   let QTY_1_value:any;
  //   // if (this.targetItemDetail_NON.QTY_1 == )
  //   for (var i = 0; i < this.targetItemDetail.length; i++) {
  //     // total += Number(this.targetItemDetail[i].QTY_1)
  //     if (this.targetItemDetail_NON[i].QTY_1 == null){
  //       QTY_1_value = '-';
  //     }else{
  //       QTY_1_value = this.targetItemDetail_NON[i].QTY_1
  //     }

  //   }
  //   console.log("QTY_1_value",QTY_1_value)
  //   return QTY_1_value;
  // }
  ngOnSend_target(): void {
    this.navService.setEditButton(false);
    this.navService.setDeleteButton(false);
    this.navService.setSendButton(false);
    // this.navService.setSendTargetButton_target(false);
  }

  public getTotalQTY_1(): number {
    let total: any;
    for (var i = 0; i < this.targetItemDetail.length; i++) {
      total += Number(this.targetItemDetail[i].QTY_1)
    }
    // console.log('total',total)
    return total;

  }
  public getTotalQTY_2(): number {
    var total = 0;
    for (var i = 0; i < this.targetItemDetail.length; i++) {
      total += this.targetItemDetail[i].QTY_2
    }
    // console.log('total',total)
    return total;

  }
  public getTotalQTY_3(): number {
    var total = 0;
    for (var i = 0; i < this.targetItemDetail.length; i++) {
      total += this.targetItemDetail[i].QTY_3
    }
    // console.log('total',total)
    return total;

  }
  public getTotalFINE_1(): number {
    var total = 0;
    for (var i = 0; i < this.targetItemDetail.length; i++) {
      total += this.targetItemDetail[i].FINE_1
    }
    // console.log('total',total)
    return total;

  }
  public getTotalFINE_2(): number {
    var total = 0;
    for (var i = 0; i < this.targetItemDetail.length; i++) {
      total += this.targetItemDetail[i].FINE_2
    }
    // console.log('total',total)
    return total;

  }
  public getTotalFINE_3(): number {
    var total = 0;
    for (var i = 0; i < this.targetItemDetail.length; i++) {
      total += this.targetItemDetail[i].FINE_3
    }
    console.log('total', total)
    return total;

  }

  // non
  public getTotalQTY_1_(): number {
    var total = 0;
    for (var i = 0; i < this.targetItemDetail_NON.length; i++) {
      total += this.targetItemDetail_NON[i].QTY_1
    }
    // console.log('total',total)
    return total;

  }
  public getTotalQTY_2_(): number {
    var total = 0;
    for (var i = 0; i < this.targetItemDetail_NON.length; i++) {
      total += this.targetItemDetail_NON[i].QTY_2
    }
    // console.log('total',total)
    return total;

  }
  public getTotalQTY_3_(): number {
    var total = 0;
    for (var i = 0; i < this.targetItemDetail_NON.length; i++) {
      total += this.targetItemDetail_NON[i].QTY_3
    }
    // console.log('total',total)
    return total;

  }
  public getTotalQTY_4_(): number {
    var total = 0;
    for (var i = 0; i < this.targetItemDetail_NON.length; i++) {
      total += this.targetItemDetail_NON[i].QTY_4
    }
    // console.log('total',total)
    return total;

  }
  public getTotalFINE_1_(): number {
    var total = 0;
    for (var i = 0; i < this.targetItemDetail_NON.length; i++) {
      total += this.targetItemDetail_NON[i].FINE_1
    }
    // console.log('total',total)
    return total;

  }
  public getTotalFINE_2_(): number {
    var total = 0;
    for (var i = 0; i < this.targetItemDetail_NON.length; i++) {
      total += this.targetItemDetail_NON[i].FINE_2
    }
    // console.log('total',total)
    return total;

  }
  public getTotalFINE_3_(): number {
    var total = 0;
    for (var i = 0; i < this.targetItemDetail_NON.length; i++) {
      total += this.targetItemDetail_NON[i].FINE_3
    }
    // console.log('total',total)
    return total;

  }
  public getTotalFINE_4_(): number {
    var total = 0;
    for (var i = 0; i < this.targetItemDetail_NON.length; i++) {
      total += this.targetItemDetail_NON[i].FINE_4
    }
    // console.log('total',total)
    return total;

  }
  show_button(): void {
    this.navService.setPrintButton(true);
    this.navService.setSendButton(false);
    this.navService.setEditField(false);
    this.navService.setSaveButton(false);
  }
  ngOnDestroy(): void {
    this.navService.setPrintButton(false)
    // this.navService.setSearchBar_target(false);
    // this.navService.setNewButton_target(false);
    // this.destroy$.unsubscribe();
  }


}
