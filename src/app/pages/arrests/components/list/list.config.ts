
import { ArrestHelper } from '../../arrest.helper';
import { IsLawsuitComplateDropDown, GetIsLawsuitComplate } from '../../entities';
import { pagination } from '../../../../config/pagination';
import { BehaviorSubject } from 'rxjs';

export class ListConfig extends ArrestHelper {
  // public advSearch: any;
  public TextSearch: string;
  public IsLawsuitComplateDropDown = IsLawsuitComplateDropDown;
  public GetIsLawsuitComplate = GetIsLawsuitComplate;
  public paginage = pagination;
  public dataTable: any;
  public advSearch: BehaviorSubject<Boolean>;

  public dateFromOption = Object.assign({}, this.myDatePickerOptions);
  public dateToOption = Object.assign({}, this.myDatePickerOptions);
  public DATE_START_FROM: any;
  public DATE_START_TO: any;

  //SEARCH_SORTING
  public TN_SORTING = new BehaviorSubject<Boolean>(true);
  public TIME_SORTING = new BehaviorSubject<Boolean>(true);

  //TEMP_DEFAULTs
  public TEMP_TEXT_SEARCH: any = '';

  public TEMP_ARREST_CODE: any = '';
  public TEMP_STAFF_NAME: any = '';
  public TEMP_LAWBREAKER_NAME: any = '';
  public TEMP_SUBSECTION_NAME: any = '';
  public TEMP_GUILTBASE_NAME: any = '';
  public TEMP_LOCALE_NAME: any = '';
  public TEMP_OFFICE_NAME: any = '';
  public TEMP_IS_LAWSUIT_COMPLETE: any = '';

}
