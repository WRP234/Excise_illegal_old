import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Ilg60O02000204Config } from './ilg60-o-02-00-02-04.config';
import { SearchByKeyword, ArrestMasPerson, ArrestMasPersongetByConAdv, ArrestLawbreaker } from '../../models';
import { Message } from 'app/config/message';
import { FormBuilder } from '@angular/forms';
import { ArrestMasPersonService } from '../../services/arrest-mas-person.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavigationService } from 'app/shared/header-navigation/navigation.service';

@Component({
  selector: 'app-ilg60-o-02-00-02-04',
  templateUrl: './ilg60-o-02-00-02-04.component.html',
  styleUrls: ['./ilg60-o-02-00-02-04.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Ilg60O02000204Component extends Ilg60O02000204Config implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.paginage.TotalItems = 0;
  }

  constructor(
    private fb: FormBuilder,
    private s_MasPerson: ArrestMasPersonService,
    private ngbModel: NgbModal,
    private navService: NavigationService

  ) {
    super();
    this.advSearch = this.navService.showAdvSearch;
  }

  public checkedAll: boolean;

  ngOnInit() {
    this.formGroup = this.fb.group({
      Person: this.fb.array([]),
      ArrestPersonAdded: this.fb.array([])
    });
    this.advSearch.next(true);
    // this.onSearchComplete(ArrestMasPersonMock)
    this.taskModel.priority = "0"; //default person type
  }

  public onSearchByKey(form: SearchByKeyword) {
    this.s_MasPerson.ArrestMasPersongetByKeyword(form)
      .subscribe(x => this.onSearchComplete(x));
  }

  public onAdvSearch(form: ArrestMasPersongetByConAdv) {
    let f = Object.assign({}, form);
    // f.ENTITY_TYPE = f.PERSON_TYPE == PersonType.ENTREPRENEUR
    //   ? EntityType.CORPERATION
    //   : EntityType.PERSON;
    this.s_MasPerson.ArrestMasPersongetByConAdv(f)
      .subscribe(x => this.onSearchComplete(x));
  }

  private onSearchComplete(list: ArrestMasPerson[]) {
    if (!list.length) {
      this.swalFn('', Message.noRecord, 'warning');
      this.formGroup = this.fb.group({
        Person: this.fb.array([]),
        ArrestPersonAdded: this.fb.array([])
      });
    }

    this.dataList = list.map((x, i) => {
      return Object.assign(x, {
        IS_CHECKED: false,
        ROW_ID: i + 1,
        FATHER_NAME: this.getRelationship(x.ArrestMasPersonRelationship, 1, x.PERSON_TYPE),
        MATHER_NAME: this.getRelationship(x.ArrestMasPersonRelationship, 2, x.PERSON_TYPE),
        RELATIONSHIP_NAME: this.getRelationship(x.ArrestMasPersonRelationship, 3, x.PERSON_TYPE)
      });
    });
    const __list = this.dataList.slice(0, 5);
    this.setItemFormArray(__list, 'Person');
    this.paginage.TotalItems = list.length;

  }

  getRelationship = (PersonRelationship: any[] = [], RelationType: number, PersonType: number) => {
    return PersonRelationship
      .filter(x => x['RELATIONSHIP_ID'] == RelationType)
      .reduce((a, c) => {
        return [...a, `${PersonType == 1 ? c.TITLE_SHORT_NAME_EN || '' : c.TITLE_SHORT_NAME_TH || ''}${c.FIRST_NAME || ''} ${c.MIDDLE_NAME || ''} ${c.LAST_NAME || ''}`]
      }, "")
  }

  private setItemFormArray(array: any[], formControl: string) {
    if (array !== undefined && array.length) {
      const itemFGs = array.map(item => this.fb.group(item));
      const itemFormArray = this.fb.array(itemFGs);
      this.formGroup.setControl(formControl, itemFormArray);
    }
  }

  public checkAll(e: Event) {
    const checkbox = e.target as HTMLInputElement;
    for (let index = 0; index < this.Person.value.length; index++) {
      this.Person.at(index).get('IS_CHECKED').patchValue(checkbox.checked);
    }

    if (checkbox.checked) {
      let list = [...this.Person.value, ...this.ArrestPersonAdded.value];
      this.checkedAll = true;
      this.setItemFormArray(list, 'ArrestPersonAdded');
    } else {
      while (this.ArrestPersonAdded.length) this.ArrestPersonAdded.removeAt(0);
      this.checkedAll = false;
    }
  }

  public checkOne(e: Event, item: any, i: number) {
    const checkbox = e.target as HTMLInputElement;
    this.Person.at(i).get('IS_CHECKED').patchValue(checkbox.checked);

    if (checkbox.checked) {
      const newObj = [item];
      const list = ([...this.ArrestPersonAdded.value, ...newObj]);
      this.setItemFormArray(list, 'ArrestPersonAdded');
    } else {
      this.checkedAll = false;
      const index = this.ArrestPersonAdded.value.findIndex(x => x['PERSON_ID'] == item['PERSON_ID']);
      this.ArrestPersonAdded.removeAt(index);
    }
  }

  public onSelect(e: any) {

    const newObj = Object.assign([], this.ArrestPersonAdded.value);
    const lawbreakerObj = newObj.map((x: ArrestMasPerson) => {
      const lawbreaker: ArrestLawbreaker = {
        LAWBREAKER_ID: null,
        ARREST_ID: null,
        PERSON_ID: x.PERSON_ID,
        TITLE_ID: null,
        PERSON_TYPE: x.PERSON_TYPE,
        ENTITY_TYPE: x.ENTITY_TYPE,
        TITLE_NAME_TH: x.TITLE_NAME_TH,
        TITLE_NAME_EN: x.TITLE_NAME_EN,
        TITLE_SHORT_NAME_TH: x.TITLE_SHORT_NAME_TH,
        TITLE_SHORT_NAME_EN: x.TITLE_SHORT_NAME_EN,
        FIRST_NAME: x.FIRST_NAME,
        MIDDLE_NAME: x.MIDDLE_NAME,
        LAST_NAME: x.LAST_NAME,
        OTHER_NAME: x.OTHER_NAME,
        COMPANY_REGISTRATION_NO: x.COMPANY_REGISTRATION_NO,
        COMPANY_NAME: x.COMPANY_NAME,
        EXCISE_REGISTRATION_NO: null,
        ID_CARD: x.ID_CARD,
        AGE: null,
        PASSPORT_NO: x.PASSPORT_NO,
        CAREER: null,
        PERSON_DESC: null,
        EMAIL: null,
        TEL_NO: null,
        MISTREAT_NO: x.MISTREAT_NO,
        IS_ACTIVE: 1
      }
      return lawbreaker
    })

    this.Output.emit(lawbreakerObj);
    this.c.emit(e);
  }

  async pageChanges(event: any) {
    const list = await this.dataList.slice(event.startIndex - 1, event.endIndex);
    this.setItemFormArray(list, 'Person');
  }

  CreateViewLawBreaker(e: any) {
    if (e == 'Create') {
      this.Create.emit([]);
      this.c.emit('Cross click');
    } else {
      this.ModeEmit = this.ModeAction.R;
      this.PERSON_ID = e;
      this.modal = this.ngbModel.open(this.LawbreakerModel, { size: <any>'xl', centered: true });
      this.c.emit('Cross click');
    }
  }

  setAdvSearch() {
    this.advSearch.next(!this.advSearch.getValue());
  }

}
