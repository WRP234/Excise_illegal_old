import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { pagination } from "../../../config/pagination";
import { EvidenceOutService } from "../evidenceOut.service";
import { PreloaderService } from "../../../shared/preloader/preloader.component";
import { FormArray, FormBuilder, FormControl, FormGroup, FormControlName } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { evidenceOutHelpers } from "../evidenceOut.helper"
import { Message } from 'app/config/message';
import { finalize } from 'rxjs/operators';
import { getDateMyDatepicker, convertDateForSave } from 'app/config/dateFormat';

@Component({
  selector: 'app-evidence-out-item-modal',
  templateUrl: './evidence-out-item-modal.component.html',
  styleUrls: ['./evidence-out-item-modal.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class EvidenceOutItemModalComponent extends evidenceOutHelpers implements OnInit {

  @Output() d = new EventEmitter();
  @Output() c = new EventEmitter();
  @Output() Output = new EventEmitter<any[]>();

  @Input() private moduleType: string;

  public paginage = pagination;

  public checkedAll: boolean;
  public selectedEntry: boolean;

  private eItemFG: FormGroup;

  private dataList = new Array<any>();

  get ItemMapping(): FormArray {
    return this.eItemFG.get('ItemMapping') as FormArray;
  }

  constructor(private eOutService: EvidenceOutService,
    private preloaderService: PreloaderService,
    private fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    console.log('moduleType : ', this.moduleType);

    this.eItemFG = this.fb.group({
      ItemMapping: this.fb.array([])
    });

    switch (this.moduleType) {
      case '11I':

        break;
      case '11E':

        break;
      case '12':

        break;
      case '13':

        break;
      case '14':

        break;
      case '15G':

        break;
      case '15D':

        break;
      case '16':

        break;
    }

  }

  async pageChanges(event: any) {
    // const list = await this.dataList.slice(event.startIndex - 1, event.endIndex);
    // this.setItemFormArray(list, this.formGroup, 'ProductMapping');
  }

  onAdvSearch(form: any) {
    this.preloaderService.setShowPreloader(true);
    let f = form;

    let eInDateFrom = getDateMyDatepicker(f.EVIDENCE_IN_DATE_FROM);
    f.EVIDENCE_IN_DATE_FROM = convertDateForSave(eInDateFrom) || '';

    let eInDateTo = getDateMyDatepicker(f.EVIDENCE_IN_DATE_TO);
    f.EVIDENCE_IN_DATE_TO = convertDateForSave(eInDateTo) || '';

    let lDateFrom = getDateMyDatepicker(f.LAWSUIT_DATE_FROM);
    f.LAWSUIT_DATE_FROM = convertDateForSave(lDateFrom) || '';

    let lDateTo = getDateMyDatepicker(f.LAWSUIT_DATE_TO);
    f.LAWSUIT_DATE_TO = convertDateForSave(lDateTo) || '';

    this.eOutService.EvidenceOutStockBalanceByLawsuitNo(f)
      .pipe(finalize(() => this.preloaderService.setShowPreloader(false)))
      .subscribe(
        (res) => this.onSearchComplete(res),
        (err) => this.swalFn('', `EvidenceOutStockBalanceByLawsuitNo ${err.name}`, 'warning')
      );
  }

  onSearchComplete(list: any) {
    if (!list.length) {
      this.swalFn('', Message.noRecord, 'warning');
      this.eItemFG = this.fb.group({
        ItemMapping: this.fb.array([])
      });
    }

    this.dataList = list.map((x, i) => {
      x.EvidenceInItem = this.setEvidenceInItem(x.EvidenceInItem)
      return Object.assign(x, { IS_CHECKED: false, ROW_ID: i + 1 });
    });

    const __list = this.dataList.slice(0, 5);

    this.setItemFormArray(__list, this.eItemFG, 'ItemMapping');
    this.paginage.TotalItems = list.length;
  }

  setEvidenceInItem(item: any[]): FormArray {
    const arr = item.reduce((a, c) => [...a, {
      ...c,
      EvidenceOutStockBalance: this.setFormArray(c.EvidenceOutStockBalance)
    }], []);

    return this.setFormArray(arr)
  }

  setFormArray(value: any[]): FormArray {
    let arr = new FormArray([])
    value.map(m => arr.push(this.fb.group(m)));
    return arr;
  }

  public checkAll(e: Event) {
    const checkbox = e.target as HTMLInputElement;
    for (let index = 0; index < this.ItemMapping.value.length; index++) {
      this.ItemMapping.at(index).get('IS_CHECKED').patchValue(checkbox.checked);
    }
    this.onSelectChange();
  }

  onSelectChange() {
    const item = this.ItemMapping.getRawValue();
    this.checkedAll = item.every(e => e['IS_CHECKED'] == true);
    this.selectedEntry = item.some(e => e['IS_CHECKED'] == true);
  }

  itemSelected() {
    const item: any[] = this.ItemMapping
      .getRawValue()
      .filter(f => f['IS_CHECKED'] == true);

    this.Output.emit(item);
    this.dismiss('Save click');
  }

  private setItemFormArray(array: any[], fg: FormGroup, formControl: string) {
    if (array !== undefined && array.length) {
      const itemFGs = array.map(item => this.fb.group(item));
      const itemFormArray = this.fb.array(itemFGs);
      fg.setControl(formControl, itemFormArray);
    }
  }

  dismiss = (e: string) => this.c.emit(e);

}
