import { Component, OnInit, ViewEncapsulation, EventEmitter, Output, Input, OnDestroy } from '@angular/core';

import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { MainMasterService } from 'app/services/main-master.service';
// import { InvestgateService, InvestgateDetailService } from '../../services';
import { LoaderService } from 'app/core/loader/loader.service';
import { Subject } from 'rxjs';
import { TargetService } from '../target.service';
import { NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

enum SORTING { ASC, DESC }

@Component({
  selector: 'app-printdoc-model',
  templateUrl: './printdoc-model.component.html',
  // styleUrls: ['./printdoc-model.component.scss'],
  // encapsulation: ViewEncapsulation.Emulated
})
export class PrintdocModelComponent implements OnInit {

  // sort = SORTING.ASC;
  // sorting = SORTING;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  // @Input() investCode: string;
  // @Input() investDetailId: string;

  @Output() d = new EventEmitter();
  @Output() c = new EventEmitter();

  // FG: FormGroup;

  // get PrintDoc(): FormArray {
  //   return this.FG.get('PrintDoc') as FormArray;
  // }

  constructor(
    private s_masmain: MainMasterService,
    private loaderService: LoaderService,
    private fb: FormBuilder,
    private targetService : TargetService,
    private ActiveModal: NgbActiveModal,
  ) { }

  async ngOnInit() {
    // this.FG = this.fb.group({
    //   PrintDoc: this.fb.array([])
    // });

    // if(this.){

    // }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  checkResponse(res: any) {
    switch (res.IsSuccess) {
      case 'False':
      case false:
        return false;
      default:
        return true;
    }
  }

  onCreateTarget(){
    console.log("print++");
    this.targetService.print('1').subscribe(x => {
      const file = new Blob([x], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    })
  }

  // private setItemFormArray(array: any[], FormControl: string) {
  //   if (array !== undefined) {
  //     const itemFGs = array.map(item => this.fb.group(item));
  //     const itemFormArray = this.fb.array(itemFGs);
  //     this.FG.setControl(FormControl, itemFormArray);
  //   }
  // }

  sortPrintDoc() {
    // this.sort = (this.sort == SORTING.ASC ? SORTING.DESC : SORTING.ASC);
    // let sort = this.PrintDoc.value.sort(() => -1);
    // this.PrintDoc.value.map(() => this.PrintDoc.removeAt(0));
    // this.setItemFormArray(sort, 'PrintDoc');

  }

  onPrint() {
    // let _print = this.PrintDoc.value.filter(x => x.IsCkecked == true && x.DocType == 0)
    // if(_print.length){
    //   _print.map(x => {
    //     // this.s
    //   })
    // }
  }

  dismiss(e: any) {
    // console.log('dd');
    this.d.emit('esc');
    this.d.emit(e);
    this.ActiveModal.close();
}

  close(e: any) {
    this.c.emit(e);
  }
}
