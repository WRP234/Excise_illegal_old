import { Component, ViewEncapsulation, OnInit, Output , Input } from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
import { Ilg6003020000E18Config } from './ilg60-03-02-00-00-e18.config';
import { MasterService } from '../../../arrests/services';
import { EventEmitter } from 'protractor';
import { BehaviorSubject } from 'rxjs';
import { ArrestLocale } from '../../../model';


@Component({
  selector: 'app-ilg60-03-02-00-00-e18',
  templateUrl: './ilg60-03-02-00-00-e18.component.html',
  styleUrls: ['./ilg60-03-02-00-00-e18.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class Ilg6003020000E18Component extends Ilg6003020000E18Config implements OnInit {

  searchLocale = this.s_MasMaster.searchLocale;
  titleNames = this.s_MasMaster.searchTitle;

  constructor(
    private fb: FormBuilder,
    private s_MasMaster: MasterService,
  ) {
    super();
  }

  ngOnInit() {
    this.PuritycertFG = this.fb.group({
      ArrestLocale: this.fb.array([
        this.formGroup
      ])
    });
    this.formChange();

    setTimeout(() => {
      if (this.inputData2.length > 0) {
        this.setValue(this.inputData2);
      }else {
        this.PuritycertFG = this.fb.group({
          ArrestLocale: this.fb.array([
            this.formGroup
          ])
        });
        this.formChange();
      }
    },1000);
  }

  setValue(item) {
    if (item) {

      const body = {
        TEXT_SEARCH : ''
      };
      this.s_MasMaster.MasLocalegetByCon2(body).then( reap => {
        const data =   reap['RESPONSE_DATA'].filter(Locale => Locale.SUB_DISTRICT_ID === item[0].SUB_DISTRICT_ID);
        // console.log(data);
        this.ArrestLocale.at(0).patchValue({
          SUB_DISTRICT_NAME_TH: data[0].SUB_DISTRICT_NAME_TH,
          SUB_DISTRICT_NAME_EN: data[0].SUB_DISTRICT_NAME_EN,
          DISTRICT_NAME_TH: data[0].DISTRICT_NAME_TH,
          DISTRICT_NAME_EN: data[0].DISTRICT_NAME_EN,
          PROVINCE_NAME_TH: data[0].PROVINCE_NAME_TH,
          PROVINCE_NAME_EN: data[0].PROVINCE_NAME_EN,
          SUB_DISTRICT_ID: data[0].SUB_DISTRICT_ID
        })
      });

      let gps = [] ;
      if ( item[0].GPS !== "null,null" ) {
        gps = item[0].GPS.split(',');
      } else {
        gps[0] = '';
        gps[1] = '';
      }

      this.ArrestLocale.at(0).patchValue({
        person_status : item[0].PERSON_STATUS,
        person_title_id: item[0].PERSON_TITLE_NAME_TH,
        person_first_name: item[0].PERSON_FIRST_NAME,
        person_last_name:  item[0].PERSON_LAST_NAME,
        person_id_card: item[0].PERSON_ID_CARD,
        person_age: item[0].PERSON_AGE,
        person_career: item[0].PERSON_CAREER,
        person_position: item[0].PERSON_POSITION,
        LATITUDE: gps[0],
        LONGITUDE: gps[1],
        ADDRESS_NO: item[0].ADDRESS_NO,
        VILLAGE_NO: item[0].VILLAGE_NO,
        BUILDING_NAME: item[0].BUILDING_NAME,
        ROOM_NO: item[0].ROOM_NO,
        FLOOR: item[0].FLOOR,
        VILLAGE_NAME: item[0].VILLAGE_NAME,
        ALLEY: item[0].ALLEY,
        LANE: item[0].LANE,
        ROAD: item[0].ROAD,
        SUB_DISTRICT_ID : item[0].SUB_DISTRICT_ID
      });
    }

    // console.log(this.PuritycertFG);
  }

  formChange() {
    this.ArrestLocale.valueChanges
      .subscribe((x: ArrestLocale[]) => {
        const obj = Object.assign([], x);
        obj[0].GPS = `${x[0]['LATITUDE']},${x[0]['LONGITUDE']}`;
        this.Output.emit(obj)
      })
  }

  selectItemLocale(event: any) {
    console.log(event);
    this.ArrestLocale.at(0).patchValue({
      SUB_DISTRICT_NAME_TH: event.item.SUB_DISTRICT_NAME_TH,
      SUB_DISTRICT_NAME_EN: event.item.SUB_DISTRICT_NAME_EN,
      DISTRICT_NAME_TH: event.item.DISTRICT_NAME_TH,
      DISTRICT_NAME_EN: event.item.DISTRICT_NAME_EN,
      PROVINCE_NAME_TH: event.item.PROVINCE_NAME_TH,
      PROVINCE_NAME_EN: event.item.PROVINCE_NAME_EN,
      SUB_DISTRICT_ID: event.item.SUB_DISTRICT_ID
    })
  }

  selectItemTitle(event: any) {
    this.ArrestLocale.at(0).patchValue({
      person_title_id:  event.item.TITLE_NAME_TH
    })
  }



}

