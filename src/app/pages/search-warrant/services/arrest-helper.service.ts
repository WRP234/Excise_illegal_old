import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class ArrestHelperService {
  protected DocumentApiPrefixUrl = `${environment.api_port}1111/XCS60`;
  protected ArrestApiPrefixUrl = `${environment.api_port}1111/XCS60`;
  protected MasterApiPrefixUrl = `${environment.api_port}2222/XCS60`;
  protected TrasactionRunningApiPrefixUrl = `${environment.api_port}1111/XCS60`

  public PipeResponseData(obj: Observable<any>) {
    return obj.pipe(map(x => {
      if (x == null || x == undefined)
        return [];

      if (x['SUCCESS'] == true)
        return x['RESPONSE_DATA'];

      return [];
    }));
  }
}
