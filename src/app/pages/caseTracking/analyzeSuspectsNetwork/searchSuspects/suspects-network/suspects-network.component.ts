import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { SearchSuspectsService } from '../../analyze-services/searchSuspects.service'
import { LoaderService } from '../../../../../core/loader/loader.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { SuspectNetworkConfig } from './suspect-network.config'
import { FormBuilder, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-suspects-network',
  templateUrl: './suspects-network.component.html',
  styleUrls: ['./suspects-network.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SuspectsNetworkComponent extends SuspectNetworkConfig implements OnInit, OnDestroy {

  constructor(private activeRoute: ActivatedRoute,
    private s: SearchSuspectsService,
    private fb: FormBuilder,
    private loaderService: LoaderService) {
    super();
  }

  ngOnInit() {
    this.suspectNetworkFG = this.fb.group({
      name: new FormControl(""),
      designation: new FormControl(""),
      img: new FormControl(""),
      subordinates: this.fb.array([])
    });

    this.advSearch = this.showAdvSearch;
    this.getActiveRoute();
    this.getPersonDetailValue();
    this.loaderService.showLoader();
  }

  getActiveRoute() {
    this.activeRoute.params.subscribe(p => {
      this.PERSON_ID = p['code']
    });
  }

  getPersonDetailValue() {
    let response = new Observable<any>();
    response = this.s.PersonDetailgetByPersonId(this.PERSON_ID)
      .pipe(
        map(x => ({
          PERSON_INFO: x['PERSON_INFO'],
          RELATIONSHIPS: x['PERSON_RELATIONSHIPS'],
          ARREST_LAWBREAKER_DETAILS: this.filterDuplicate(x['ARREST_LAWBREAKER_DETAILS'], 'ARREST_ID')
        })), takeUntil(this.destroy$)
      )
    this.setFormData(response);
  }

  setFormData(value$) {
    value$.subscribe(x => {

      const p = x['PERSON_INFO'];
      const lawbreakerName = `${p['TITLE_NAME_TH']}${p['FIRST_NAME']} ${p['LAST_NAME']}`;

      const relationships = x['RELATIONSHIPS'].reduce((a, c) => {
        return [
          ...a, {
            name: `${c['TITLE_NAME_TH']}${c['FIRST_NAME']} ${c['LAST_NAME']}`,
            designation: c['RELATIONSHIP_NAME'],
            img: this.imgLawbreaker,
            subordinates: []
          }]
      }, []);

      const subordinates: any[] = [{
        name: new FormControl('ใบงานจับกุมเดียวกัน'),
        designation: new FormControl(''),
        img: new FormControl(this.imgArrest),
        subordinates: this.arrestRelationshipModify(x['ARREST_LAWBREAKER_DETAILS'])
      },
      {
        name: new FormControl('เครือญาติ'),
        designation: new FormControl(''),
        img: new FormControl(this.imgRelationship),
        subordinates: this.fb.array(relationships)
      }]

      this.suspectNetworkFG.reset({
        name: lawbreakerName,
        designation: 'ผู้ต้องหา',
        img: this.imgLawbreaker,
        subordinates: this.fb.array([subordinates])
      })

      this.setItemFormArray(subordinates, 'subordinates');

      this.processed.next(true);
      this.loaderService.onEnd();
    });
    this.loaderService.onEnd();

  }

  arrestRelationshipModify(ARREST_LAWBREAKER_DETAILS: any[]): FormArray {
    let arrest = new FormArray([]);
    ARREST_LAWBREAKER_DETAILS.forEach(async f => {
      arrest.push(this.fb.group({
        name: new FormControl(''),
        designation: new FormControl(f['ARREST_CODE']),
        img: new FormControl(this.imgDocument),
        subordinates: this.fb.array(await this.subArrestRelationshipModify(f['ARREST_ID']))
      }))
    });

    return arrest;
  }

  subArrestRelationshipModify(ARREST_ID) {
    return this.s.ArrestgetByCon({ ARREST_ID: ARREST_ID })
      .pipe(map(x => x['ArrestLawbreaker']
        .reduce((accuAlb, currAlb) => {
          return [
            ...accuAlb, {
              name: `${currAlb['TITLE_NAME_TH']}${currAlb['FIRST_NAME']} ${currAlb['LAST_NAME']}`,
              designation: 'ผู้ต้องหา',
              img: this.imgLawbreaker,
              subordinates: []
            }]
        }, []))
      ).toPromise();
  }

  private setItemFormArray(array: any[], formControl: string) {
    if (array !== undefined && array.length) {
      const itemFGs = array.map(item => this.fb.group(item));
      const itemFormArray = this.fb.array(itemFGs);
      this.suspectNetworkFG.setControl(formControl, itemFormArray);
    }
  }

  filterDuplicate(array: any[], prop: string) {
    return array.filter((v, i, a) => a.map(x => x[prop])
      .indexOf(v[prop]) === i);
  }

  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }

}
