import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ArrestProduct,
  ProductSRP
} from '../models';

export class ArrestHelperService {
  protected DocumentApiPrefixUrl = `${environment.api_port}1123/XCS60`;
  protected ArrestApiPrefixUrl = `${environment.api_port}1111/XCS60`;
  protected MasterApiPrefixUrl = `${environment.api_port}2222/XCS60`;

  public PipeResponseData(obj: Observable<any>) {
    return obj.pipe(map(x => {
      if (x == null || undefined)
        return [];

      if (x['SUCCESS'] == true || "True")
        return x['RESPONSE_DATA'];

      return [];
    }));
  }

  public PipeResponseSRP(obj: Observable<any>) {
    return obj.pipe(map(x => {
      if (x == null || undefined)
        return [];

      if (x['ResponseMessage'] == "SUCCESS")
        return x['ResponseData']
      // this.setModel_SRP(x['ResponseData']);

      return [];
    }));
  }

}
