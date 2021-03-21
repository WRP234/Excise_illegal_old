import { Component, ViewEncapsulation, OnInit, Output, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Ilg6003020000E18Config } from './ilg60-03-02-00-00-e18.config';
import { MasterService } from '../../services';
import { ArrestLocale, MasSubDistrictgetByCon } from '../../models';
import { takeUntil } from 'rxjs/operators';
import { MasSubDistrictService } from '../../services/mas-sub-district.service';
import { LoaderService } from '../../../../core/loader/loader.service';

@Component({
  selector: 'app-ilg60-03-02-00-00-e18',
  templateUrl: './ilg60-03-02-00-00-e18.component.html',
  styleUrls: ['./ilg60-03-02-00-00-e18.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Ilg6003020000E18Component extends Ilg6003020000E18Config implements OnInit, AfterViewInit, OnDestroy {
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  constructor(
    private fb: FormBuilder,
    private s_MasMaster: MasterService,
    private chRef: ChangeDetectorRef,
    private loaderService: LoaderService,
    private masSubDistrictService: MasSubDistrictService
  ) {
    super();
  }

  ngOnInit() {
    this.ArrestFG = this.fb.group({
      ArrestLocale: this.fb.array([
        this.formGroup
      ])
    });

    this.formChange();
  }

  ngAfterViewInit(): void {
    switch (this.mode) {
      case this.ModeAction.C:
        break;

      case this.ModeAction.R:
        this.inputData
          .pipe(takeUntil(this.destroy$))
          .subscribe(x => {
            this.ILG60_03_02_00_00_E18.next(true);

            const obj = x.reduce((accu, curr) => {
              const la = curr.GPS ? curr.GPS.split(',')[0] : null;
              const lo = curr.GPS ? curr.GPS.split(',')[1] : null;
              for (var key in curr) {
                if (curr[key] === 'null') curr[key] = null;
              }
              const o = [
                ...accu,
                {
                  LATITUDE: (la && la != 'null') ? la : null,
                  LONGITUDE: (lo && lo != 'null') ? lo : null,
                  ...curr
                }
              ];

              return o
            }, [])
            this.setItemFormArray(obj, 'ArrestLocale');

            this.emitValue(obj);
            this.formChange();

            this.chRef.markForCheck();
          })
        break;
    }
  }

  private setItemFormArray(array: any[], formControl: string) {
    if (array !== undefined && array.length) {
      const itemFGs = array.map(item => this.fb.group(item));
      const itemFormArray = this.fb.array(itemFGs);
      this.ArrestFG.setControl(formControl, itemFormArray);
    }
  }

  searchLocale = this.s_MasMaster.searchLocale;

  emitValue(value: any[]) {
    const obj = Object.assign([], value);
    this.Output.emit(obj)
  }

  formChange() {
    this.ArrestLocale.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((x: ArrestLocale[]) => {
        const obj = Object.assign([], x);
        obj[0].GPS = `${x[0]['LATITUDE']},${x[0]['LONGITUDE']}`;
        this.emitValue(obj);
      })
  }

  selectItemLocale(event: any) {
    this.loaderService.showLoader();
    this.ArrestLocale.at(0).patchValue({
      SUB_DISTRICT_ID: event.item.SUB_DISTRICT_ID,
      SUB_DISTRICT_NAME_TH: event.item.SUB_DISTRICT_NAME_TH,
      SUB_DISTRICT_NAME_EN: event.item.SUB_DISTRICT_NAME_EN,
      DISTRICT_NAME_TH: event.item.DISTRICT_NAME_TH,
      DISTRICT_NAME_EN: event.item.DISTRICT_NAME_EN,
      PROVINCE_NAME_TH: event.item.PROVINCE_NAME_TH,
      PROVINCE_NAME_EN: event.item.PROVINCE_NAME_EN
    });
    this.invalid.next(false);
    this.REGION_REQ_E18.next(false);
    this.ILG60_03_02_00_00_E18.next(true);

    // ///********SET LOCALE_OFFICE_CODE*********//
    let LOCALE = this.ArrestLocale.getRawValue();
    const MasSubDrt: MasSubDistrictgetByCon = {
      TEXT_SEARCH: "",
      SUB_DISTRICT_ID: LOCALE[0].SUB_DISTRICT_ID,
      DISTRICT_ID: null
    }

    this.masSubDistrictService.MasSubDistrictgetByCon(MasSubDrt).subscribe(s => {
      if (s.length)
        this.LOCALE_OFFICE_CODE.next(s[0].OFFICE_CODE)

    });
    this.loaderService.onEnd();
  }

}
