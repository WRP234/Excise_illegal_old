import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { IArrestMasGuiltbase, SearchByKeyword, IArrestMasGuiltbaseMock } from '../../model';
import swal from 'sweetalert2';
import { Message } from '../../../../config/message';
import { Ilg60O02000206Config } from './ilg60-o-02-00-02-06.config';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ArrestMasGuiltBaseService } from '../../services/arrest-mas-guilt-base.service';

@Component({
  selector: 'app-ilg60-o-02-00-02-06',
  templateUrl: './ilg60-o-02-00-02-06.component.html',
  styleUrls: ['./ilg60-o-02-00-02-06.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class Ilg60O02000206Component extends Ilg60O02000206Config implements OnInit, OnDestroy {

  constructor(
    private fb: FormBuilder,
    private s_GuiltBase: ArrestMasGuiltBaseService
  ) {
    super();
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      ArrestMasGuiltbase: this.fb.array([])
    })
  }

  ngOnDestroy(): void {
    this.paginage.TotalItems = 0;
  }

  onSearchByKey(form: SearchByKeyword) {

    this.s_GuiltBase.ArrestMasGuiltbasegetByKeyword(form).then( item => {

      const body = [];
      body.push(item);
      this.onSearchComplete(body[0])
    });

  }

  private onSearchComplete(list: IArrestMasGuiltbase[]) {
    console.log(list)
    if (!list.length) {
      swal('', Message.noRecord, 'warning');
      return;
    }
    this.dataList = list.map((x, i) => {
      return Object.assign(x, { ROW_ID: i + 1 });
    });
    const __list = this.dataList.slice(0, 5);
    this.setItemFormArray(__list, 'ArrestMasGuiltbase');
    this.paginage.TotalItems = list.length;
  }

  private setItemFormArray(array: any[], formControl: string) {
    if (array !== undefined && array.length) {
      const itemFGs = array.map(item => this.fb.group(item));
      const itemFormArray = this.fb.array(itemFGs);
      this.formGroup.setControl(formControl, itemFormArray);

      console.log(this.formGroup);
    }
  }

  onSelectionChange(entry: FormGroup) {
    this.selectedEntry = entry.value;
  }

  public onSelect(e: any) {
    console.log(this.selectedEntry);
    this.Output.emit(this.selectedEntry);

    this.c.emit(e);
  }

  async pageChanges(event: any) {
    const list = this.dataList.slice(event.startIndex - 1, event.endIndex);
    this.setItemFormArray(list, 'ArrestMasGuiltbase');
  }
}
