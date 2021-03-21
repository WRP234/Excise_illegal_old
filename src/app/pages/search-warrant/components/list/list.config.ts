import { IsResultDropDown } from '../../entities/is_result';
import { IsArrestingStatusDropDown } from '../../entities/is_arresting_status';
import {SearchWarrantHelper} from '../../search-warrant.helper';

export class ListConfig extends SearchWarrantHelper {

  public IsResultDropDown = IsResultDropDown;
  public IsArrestingStatusDropDown = IsArrestingStatusDropDown;
}
